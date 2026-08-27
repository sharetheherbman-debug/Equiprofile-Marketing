import { createHmac, randomBytes } from "node:crypto";

type ProductLine = "management" | "academy" | "shop";
type ConsentState =
  | "marketing_opt_in"
  | "transactional_only"
  | "withdrawn"
  | "unknown";

export type MarketingEventEnvelope = {
  sourceApp: "equiprofile.online";
  productLine: ProductLine;
  eventType: string;
  entityType: string;
  entityId: string;
  publicUrl: string;
  timestamp: string;
  consentState: ConsentState;
  idempotencyKey: string;
  payloadVersion: "1.0";
  payload: Record<string, unknown>;
};

export type MarketingPublishResult =
  | { delivered: true; statusCode: number; nonce: string }
  | {
      delivered: false;
      reason:
        | "CONSENT_NOT_GRANTED"
        | "DELIVERY_DISABLED"
        | "INVALID_EVENT"
        | "DELIVERY_FAILED";
      detail: string;
    };

const EVENT_ALLOW_LIST: Record<
  ProductLine,
  Record<string, { entityType: string; payloadKeys: readonly string[] }>
> = {
  management: {
    management_registration_completed: {
      entityType: "account_registration",
      payloadKeys: ["registrationSurface", "planInterest"],
    },
    management_subscription_payment_recorded: {
      entityType: "subscription_payment",
      payloadKeys: ["planId", "currency", "purchaseState"],
    },
    management_plan_changed: {
      entityType: "subscription",
      payloadKeys: ["planId", "previousPlanId", "changeState"],
    },
  },
  academy: {
    academy_public_plans_viewed: {
      entityType: "plan_catalogue",
      payloadKeys: ["planIds", "currency"],
    },
    academy_pathway_catalogue_viewed: {
      entityType: "pathway",
      payloadKeys: ["pathwaySlug", "pathwayTitle", "level"],
    },
    academy_pricing_viewed: {
      entityType: "pricing",
      payloadKeys: ["planId", "pricePence", "currency", "billingInterval"],
    },
    academy_registration_completed: {
      entityType: "account_registration",
      payloadKeys: ["registrationSurface", "planInterest"],
    },
    academy_plan_purchase_completed: {
      entityType: "plan_purchase",
      payloadKeys: ["planId", "currency", "purchaseState"],
    },
  },
  shop: {
    shop_approved_product_published: {
      entityType: "product",
      payloadKeys: [
        "slug",
        "title",
        "brand",
        "canonicalPricePence",
        "currency",
        "availabilityStatus",
        "imageUrl",
      ],
    },
    shop_product_availability_changed: {
      entityType: "product",
      payloadKeys: [
        "slug",
        "availabilityStatus",
        "canonicalPricePence",
        "currency",
      ],
    },
    shop_product_viewed: {
      entityType: "product",
      payloadKeys: ["slug", "categorySlugs"],
    },
    shop_checkout_started: {
      entityType: "checkout",
      payloadKeys: ["currency", "itemCount", "subtotalPence"],
    },
    shop_order_paid: {
      entityType: "order",
      payloadKeys: [
        "orderNumber",
        "currency",
        "totalPence",
        "itemCount",
        "purchaseState",
      ],
    },
  },
};

const PROHIBITED_KEY =
  /(?:email|address|phone|password|token|secret|card|payment|stripe|supplier(?:cost|agreement|key|account)?|progress|competenc|feedback|tutor|health|medical|vet(?:erinary)?|insurance|refund|chargeback|session|jwt|ip(?:address)?)/i;

function validateHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isPrimitiveOrPrimitiveArray(value: unknown): boolean {
  if (value === null) return true;
  if (["string", "number", "boolean"].includes(typeof value)) return true;
  return (
    Array.isArray(value) &&
    value.every((item) => ["string", "number", "boolean"].includes(typeof item))
  );
}

function validateEnvelope(envelope: MarketingEventEnvelope): string | null {
  if (envelope.sourceApp !== "equiprofile.online")
    return "Unexpected source application.";
  if (!validateHttpsUrl(envelope.publicUrl))
    return "Public URL must use HTTPS.";
  if (!envelope.entityId || !envelope.idempotencyKey) {
    return "Entity and idempotency identifiers are required.";
  }
  if (Number.isNaN(Date.parse(envelope.timestamp)))
    return "Timestamp must be ISO-8601 compatible.";
  const event = EVENT_ALLOW_LIST[envelope.productLine]?.[envelope.eventType];
  if (!event) return "Event is not allow-listed for this product line.";
  if (event.entityType !== envelope.entityType)
    return "Event entity type does not match the contract.";
  for (const [key, value] of Object.entries(envelope.payload)) {
    if (!event.payloadKeys.includes(key) || PROHIBITED_KEY.test(key)) {
      return "Payload contains an unapproved or restricted field.";
    }
    if (!isPrimitiveOrPrimitiveArray(value)) {
      return "Payload values must be primitive values or arrays of primitive values.";
    }
  }
  return null;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`)
    .join(",")}}`;
}

function marketingConfig() {
  const appUrl = (
    process.env.MARKETING_APP_URL ?? "https://marketing.equiprofile.online"
  ).replace(/\/$/, "");
  const apiUrl = (
    process.env.MARKETING_API_URL ?? `${appUrl}/api/v1`
  ).replace(/\/$/, "");
  return {
    apiUrl,
    applicationId:
      process.env.HOST_APP_ID?.trim() ||
      process.env.EQUIPROFILE_APP_ID?.trim() ||
      "equiprofile",
    connectorKey:
      process.env.HOST_APP_CONNECTOR_KEY ??
      process.env.EQUIPROFILE_CONNECTOR_KEY ??
      "",
    timeoutMs: Math.min(
      Math.max(Number(process.env.MARKETING_CONNECTOR_TIMEOUT_MS ?? 3000), 250),
      10_000,
    ),
  };
}

type ApplicationConversionPayload = {
  event_id: string;
  event_type: string;
  occurred_at: string;
  currency: "GBP";
  consent_basis: "consent";
  properties: Record<string, unknown>;
};

function toConversionPayload(
  envelope: MarketingEventEnvelope,
): ApplicationConversionPayload {
  return {
    event_id: envelope.idempotencyKey,
    event_type: envelope.eventType,
    occurred_at: envelope.timestamp,
    currency: "GBP",
    consent_basis: "consent",
    properties: {
      product_line: envelope.productLine,
      entity_type: envelope.entityType,
      entity_id: envelope.entityId,
      public_url: envelope.publicUrl,
      payload_version: envelope.payloadVersion,
      ...envelope.payload,
    },
  };
}

function connectorHeaders(
  body: unknown,
  applicationId: string,
  connectorKey: string,
): { headers: Record<string, string>; nonce: string } {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(24).toString("base64url");
  const signature = createHmac("sha256", connectorKey)
    .update(`${timestamp}\n${nonce}\n${canonicalize(body)}`, "utf8")
    .digest("hex");
  return {
    nonce,
    headers: {
      "Content-Type": "application/json",
      "X-Application-Id": applicationId,
      "X-Application-Key": connectorKey,
      "X-Application-Timestamp": timestamp,
      "X-Application-Nonce": nonce,
      "X-Application-Signature": signature,
    },
  };
}

/**
 * Publish one consented, allow-listed Core conversion event using the standalone
 * Marketing application's canonical Application Connector protocol. Remote
 * configuration or delivery failures are contained so Core transactions never
 * fail solely because Marketing is unavailable.
 */
export async function publishMarketingEvent(
  envelope: MarketingEventEnvelope,
): Promise<MarketingPublishResult> {
  if (envelope.consentState !== "marketing_opt_in") {
    return {
      delivered: false,
      reason: "CONSENT_NOT_GRANTED",
      detail: "Marketing consent is not granted for this event.",
    };
  }
  const validationError = validateEnvelope(envelope);
  if (validationError) {
    return {
      delivered: false,
      reason: "INVALID_EVENT",
      detail: validationError,
    };
  }

  const { apiUrl, applicationId, connectorKey, timeoutMs } = marketingConfig();
  if (
    !validateHttpsUrl(apiUrl) ||
    !applicationId ||
    connectorKey.length < 32
  ) {
    return {
      delivered: false,
      reason: "DELIVERY_DISABLED",
      detail:
        "Marketing Application Connector URL, application ID or connector key is not configured securely.",
    };
  }

  const body = toConversionPayload(envelope);
  const { headers, nonce } = connectorHeaders(
    body,
    applicationId,
    connectorKey,
  );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `${apiUrl}/application-connectors/events/conversion`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      return {
        delivered: false,
        reason: "DELIVERY_FAILED",
        detail: `Marketing connector returned HTTP ${response.status}.`,
      };
    }
    return { delivered: true, statusCode: response.status, nonce };
  } catch {
    return {
      delivered: false,
      reason: "DELIVERY_FAILED",
      detail: "Marketing connector could not be reached.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export const MARKETING_EVENT_ALLOW_LIST = EVENT_ALLOW_LIST;
