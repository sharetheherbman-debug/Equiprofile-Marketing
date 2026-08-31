import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  COOKIE_CONSENT_KEY,
  resetMeasurementForTests,
  sanitizeEventPayload,
  trackMeasurementEvent,
  trackPageView,
  updateConsent,
} from "./analytics";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, String(value)),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("typed non-PII measurement boundary", () => {
  beforeEach(() => {
    const local = storage();
    const session = storage();
    local.setItem(COOKIE_CONSENT_KEY, "accepted");
    vi.stubGlobal("localStorage", local);
    vi.stubGlobal("sessionStorage", session);
    vi.stubGlobal("document", { title: "EquiProfile" });
    vi.stubGlobal("window", {
      location: {
        href: "https://equiprofile.example/features?utm_source=test",
        origin: "https://equiprofile.example",
        pathname: "/features",
      },
      dataLayer: [],
      dispatchEvent: vi.fn(),
    });
    resetMeasurementForTests();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("accepts only the documented fields and rejects obvious PII", () => {
    expect(
      sanitizeEventPayload("management_task_created", {
        task_type: "general_care",
        recurring: false,
      }),
    ).toEqual({ task_type: "general_care", recurring: false });
    expect(
      sanitizeEventPayload("horse_record_created", {
        horse_name: "Private horse",
      }),
    ).toBeNull();
    expect(
      sanitizeEventPayload("search", { search_term: "person@example.com" }),
    ).toBeNull();
    expect(
      sanitizeEventPayload("generate_lead", { message: "Private free text" }),
    ).toBeNull();
  });

  it("suppresses immediate duplicate events and attaches consented attribution", () => {
    expect(trackMeasurementEvent("sign_up", { method: "email" })).toBe(true);
    expect(trackMeasurementEvent("sign_up", { method: "email" })).toBe(false);
    const layer = (globalThis.window as unknown as { dataLayer: unknown[] })
      .dataLayer;
    expect(layer).toHaveLength(1);
    expect(layer[0]).toMatchObject({
      event: "sign_up",
      method: "email",
      acquisition: {},
    });
  });

  it("updates all consent types and blocks events after rejection", () => {
    updateConsent("declined");
    const layer = (globalThis.window as unknown as { dataLayer: unknown[] })
      .dataLayer;
    const update = layer[0] as unknown[];
    expect(update[0]).toBe("consent");
    expect(update[1]).toBe("update");
    expect(update[2]).toMatchObject({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(trackMeasurementEvent("login", { method: "email" })).toBe(false);
  });

  it("redacts private record and token path segments from page measurement", () => {
    const browser = globalThis.window as unknown as {
      location: { href: string; origin: string; pathname: string };
      dataLayer: unknown[];
    };
    browser.location.pathname = "/passport/private-share-token";
    browser.location.href =
      "https://equiprofile.example/passport/private-share-token?utm_source=test";
    expect(trackPageView()).toBe(true);
    expect(browser.dataLayer[0]).toMatchObject({
      event: "page_view",
      page_path: "/passport",
      page_title: "EquiProfile Application",
    });
    expect(JSON.stringify(browser.dataLayer[0])).not.toContain(
      "private-share-token",
    );
  });
});
