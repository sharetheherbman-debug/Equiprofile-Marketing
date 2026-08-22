import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  publishMarketingEvent,
  type MarketingEventEnvelope,
} from "./_core/marketingPublisher";

const validEvent: MarketingEventEnvelope = {
  sourceApp: "equiprofile.online",
  productLine: "academy",
  eventType: "academy_pricing_viewed",
  entityType: "pricing",
  entityId: "academy-10-monthly",
  publicUrl: "https://academy.equiprofile.online/academy/pricing",
  timestamp: "2026-08-21T12:00:00.000Z",
  consentState: "marketing_opt_in",
  idempotencyKey: "academy-pricing-viewed-test-001",
  payloadVersion: "1.0",
  payload: {
    planId: "academy_10",
    pricePence: 4900,
    currency: "GBP",
    billingInterval: "monthly",
  },
};

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`)
    .join(",")}}`;
}

afterEach(() => {
  delete process.env.MARKETING_APP_URL;
  delete process.env.MARKETING_API_URL;
  delete process.env.HOST_APP_ID;
  delete process.env.EQUIPROFILE_APP_ID;
  delete process.env.HOST_APP_CONNECTOR_KEY;
  delete process.env.EQUIPROFILE_CONNECTOR_KEY;
  delete process.env.MARKETING_CONNECTOR_TIMEOUT_MS;
  vi.unstubAllGlobals();
});

describe("Core Marketing publisher", () => {
  it("does not emit an event without explicit marketing consent", async () => {
    const result = await publishMarketingEvent({
      ...validEvent,
      consentState: "transactional_only",
    });

    expect(result).toEqual({
      delivered: false,
      reason: "CONSENT_NOT_GRANTED",
      detail: "Marketing consent is not granted for this event.",
    });
  });

  it("rejects restricted or unknown payload fields before remote delivery", async () => {
    const result = await publishMarketingEvent({
      ...validEvent,
      payload: { ...validEvent.payload, email: "person@example.com" },
    });

    expect(result.delivered).toBe(false);
    if (!result.delivered) expect(result.reason).toBe("INVALID_EVENT");
  });

  it("supports allow-listed Management events without exposing private data", async () => {
    const result = await publishMarketingEvent({
      ...validEvent,
      productLine: "management",
      eventType: "management_registration_completed",
      entityType: "account_registration",
      entityId: "registration-001",
      publicUrl: "https://equiprofile.online/register",
      idempotencyKey: "management-registration-001",
      payload: { registrationSurface: "public", planInterest: "pro" },
    });

    expect(result.delivered).toBe(false);
    if (!result.delivered) expect(result.reason).toBe("DELIVERY_DISABLED");
  });

  it("fails safely when the connector has not been configured", async () => {
    const result = await publishMarketingEvent(validEvent);

    expect(result.delivered).toBe(false);
    if (!result.delivered) expect(result.reason).toBe("DELIVERY_DISABLED");
  });

  it("uses the standalone Marketing Application Connector protocol", async () => {
    const connectorKey = "test-connector-key-0123456789-abcdef";
    process.env.MARKETING_API_URL = "https://marketing.example/api/v1";
    process.env.EQUIPROFILE_APP_ID = "equiprofile";
    process.env.EQUIPROFILE_CONNECTOR_KEY = connectorKey;
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await publishMarketingEvent(validEvent);

    expect(result.delivered).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://marketing.example/api/v1/application-connectors/events/conversion",
    );
    const headers = request.headers as Record<string, string>;
    expect(headers["X-Application-Id"]).toBe("equiprofile");
    expect(headers["X-Application-Key"]).toBe(connectorKey);
    expect(headers["X-Application-Timestamp"]).toMatch(/^\d{10}$/);
    expect(headers["X-Application-Nonce"]).toMatch(/^[A-Za-z0-9_-]{16,128}$/);
    expect(headers["X-Application-Signature"]).toMatch(/^[0-9a-f]{64}$/);

    const body = JSON.parse(String(request.body));
    expect(body).toEqual({
      event_id: validEvent.idempotencyKey,
      event_type: validEvent.eventType,
      occurred_at: validEvent.timestamp,
      currency: "GBP",
      consent_basis: "consent",
      properties: {
        product_line: "academy",
        entity_type: "pricing",
        entity_id: "academy-10-monthly",
        public_url: validEvent.publicUrl,
        payload_version: "1.0",
        ...validEvent.payload,
      },
    });

    const expectedSignature = createHmac("sha256", connectorKey)
      .update(
        `${headers["X-Application-Timestamp"]}\n${headers["X-Application-Nonce"]}\n${canonicalize(body)}`,
        "utf8",
      )
      .digest("hex");
    expect(headers["X-Application-Signature"]).toBe(expectedSignature);
  });

  it("contains a remote failure so Core operations are not interrupted", async () => {
    process.env.MARKETING_API_URL = "https://marketing.example/api/v1";
    process.env.EQUIPROFILE_CONNECTOR_KEY =
      "test-connector-key-0123456789-abcdef";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await publishMarketingEvent(validEvent);

    expect(result).toEqual({
      delivered: false,
      reason: "DELIVERY_FAILED",
      detail: "Marketing connector could not be reached.",
    });
  });
});
