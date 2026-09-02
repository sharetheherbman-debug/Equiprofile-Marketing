import crypto from "crypto";
import type { Request, Response, Router } from "express";
import { and, eq, or } from "drizzle-orm";
import { billingSyncEvents, organizations, users } from "../drizzle/schema";
import * as db from "./db";
import { getDb } from "./db";

const MAX_CLOCK_SKEW_SECONDS = 300;
const PRODUCTS = new Set(["management", "academy"]);
const STATUSES = new Set([
  "active", "trial", "trialing", "grace", "past_due", "overdue",
  "unpaid", "cancelled", "canceled", "expired", "incomplete",
]);
const MANAGEMENT_PLANS = new Set(["management_pro", "management_stable"]);
const ACADEMY_PLANS = new Set(["academy_rider", "academy_school_10", "academy_school_20", "academy_school_50"]);
const INTERVALS = new Set(["monthly", "yearly"]);

export function canonicalizeBillingBody(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalizeBillingBody).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalizeBillingBody(object[key])}`).join(",")}}`;
}

export function verifyBillingSyncSignature(input: {
  body: unknown;
  timestamp: string;
  nonce: string;
  signature: string;
  applicationId: string;
  expectedApplicationId: string;
  connectorKey: string;
  nowSeconds?: number;
}) {
  if (input.connectorKey.length < 32) return { ok: false as const, reason: "connector_not_configured" };
  if (input.applicationId !== input.expectedApplicationId) return { ok: false as const, reason: "invalid_application" };
  if (!/^[A-Za-z0-9_-]{16,160}$/.test(input.nonce)) return { ok: false as const, reason: "invalid_nonce" };
  if (!/^[a-f0-9]{64}$/i.test(input.signature)) return { ok: false as const, reason: "invalid_signature" };
  const timestamp = Number(input.timestamp);
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (!Number.isInteger(timestamp) || Math.abs(now - timestamp) > MAX_CLOCK_SKEW_SECONDS) {
    return { ok: false as const, reason: "expired_timestamp" };
  }
  const message = `${input.timestamp}\n${input.nonce}\n${canonicalizeBillingBody(input.body)}`;
  const expected = crypto.createHmac("sha256", input.connectorKey).update(message, "utf8").digest();
  const supplied = Buffer.from(input.signature, "hex");
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return { ok: false as const, reason: "invalid_signature" };
  }
  return { ok: true as const };
}

function parsePreferences(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function optionalDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = new Date(String(value));
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function managementStatus(status: string): "trial" | "active" | "cancelled" | "overdue" | "expired" {
  if (status === "active") return "active";
  if (status === "trial" || status === "trialing" || status === "grace") return "trial";
  if (status === "past_due" || status === "overdue" || status === "unpaid") return "overdue";
  if (status === "cancelled" || status === "canceled") return "cancelled";
  return "expired";
}

type BillingSyncBody = {
  event_id: string;
  external_user_id: number;
  product: "management" | "academy";
  status: string;
  plan: string;
  interval: "monthly" | "yearly";
  organization_id?: number | null;
  current_period_ends_at?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  last_payment_at?: string | null;
};

function validateBody(raw: unknown): { ok: true; value: BillingSyncBody } | { ok: false; error: string } {
  const body = raw as Partial<BillingSyncBody>;
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  if (!/^[A-Za-z0-9_.:-]{6,160}$/.test(String(body.event_id || ""))) return { ok: false, error: "Invalid event" };
  if (!Number.isInteger(body.external_user_id) || Number(body.external_user_id) < 1) return { ok: false, error: "Invalid user" };
  if (!PRODUCTS.has(String(body.product))) return { ok: false, error: "Invalid product" };
  if (!STATUSES.has(String(body.status))) return { ok: false, error: "Invalid billing status" };
  if (!INTERVALS.has(String(body.interval))) return { ok: false, error: "Invalid interval" };
  if (body.product === "management" && (!MANAGEMENT_PLANS.has(String(body.plan)) || body.organization_id)) {
    return { ok: false, error: "Invalid Management subscription context" };
  }
  const academySchool = String(body.plan).startsWith("academy_school_");
  if (body.product === "academy" && !ACADEMY_PLANS.has(String(body.plan))) return { ok: false, error: "Invalid Academy plan" };
  if (body.product === "academy" && academySchool !== Number.isInteger(body.organization_id)) {
    return { ok: false, error: "Academy school plans require an organization; Rider plans must not include one" };
  }
  for (const value of [body.stripe_customer_id, body.stripe_subscription_id]) {
    if (value !== undefined && value !== null && (typeof value !== "string" || value.length > 255)) {
      return { ok: false, error: "Invalid billing identifier" };
    }
  }
  return { ok: true, value: body as BillingSyncBody };
}

export function registerBillingEntitlementSyncRoutes(router: Router) {
  router.post("/billing-sync/entitlements", async (req: Request, res: Response) => {
    const connectorKey = process.env.BILLING_CONNECTOR_KEY || "";
    const expectedApplicationId = process.env.EQUIPROFILE_APP_ID || "equiprofile";
    const timestamp = String(req.header("X-Application-Timestamp") || "");
    const nonce = String(req.header("X-Application-Nonce") || "");
    const signature = String(req.header("X-Application-Signature") || "");
    const applicationId = String(req.header("X-Application-Id") || "");
    const verified = verifyBillingSyncSignature({
      body: req.body,
      timestamp,
      nonce,
      signature,
      applicationId,
      expectedApplicationId,
      connectorKey,
    });
    if (!verified.ok) return res.status(401).json({ error: "Billing synchronization signature rejected" });
    if (process.env.NODE_ENV === "production") {
      const forwarded = String(req.header("X-Forwarded-Proto") || "").toLowerCase();
      if (!req.secure && forwarded !== "https") return res.status(400).json({ error: "HTTPS is required" });
    }
    const parsed = validateBody(req.body);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const body = parsed.value;
    const user = await db.getUserById(body.external_user_id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const database = await getDb();
    if (!database) return res.status(503).json({ error: "Billing synchronization is unavailable" });

    let organization: { id: number; ownerId: number } | undefined;
    if (body.organization_id) {
      [organization] = await database.select({ id: organizations.id, ownerId: organizations.ownerId })
        .from(organizations).where(eq(organizations.id, body.organization_id)).limit(1);
      if (!organization) return res.status(404).json({ error: "Organization not found" });
      if (organization.ownerId !== user.id) return res.status(403).json({ error: "Cross-account organization mutation rejected" });
    }

    const existing = await database.select({ eventId: billingSyncEvents.eventId, nonce: billingSyncEvents.nonce })
      .from(billingSyncEvents)
      .where(or(eq(billingSyncEvents.eventId, body.event_id), eq(billingSyncEvents.nonce, nonce)))
      .limit(1);
    if (existing[0]?.eventId === body.event_id) return res.json({ success: true, duplicate: true });
    if (existing.length > 0) return res.status(409).json({ error: "Billing synchronization nonce replay rejected" });

    const payloadHash = crypto.createHash("sha256").update(canonicalizeBillingBody(req.body), "utf8").digest("hex");
    const periodEnd = optionalDate(body.current_period_ends_at);
    const lastPayment = optionalDate(body.last_payment_at);
    try {
      await database.transaction(async (tx) => {
        await tx.insert(billingSyncEvents).values({
          applicationId,
          eventId: body.event_id,
          nonce,
          product: body.product,
          externalUserId: user.id,
          organizationId: body.organization_id ?? null,
          billingStatus: body.status,
          payloadHash,
        });
        if (body.product === "management") {
          const preferences = parsePreferences(user.preferences);
          await tx.update(users).set({
            subscriptionStatus: managementStatus(body.status),
            subscriptionPlan: body.interval,
            subscriptionEndsAt: periodEnd,
            stripeCustomerId: body.stripe_customer_id ?? user.stripeCustomerId,
            stripeSubscriptionId: body.stripe_subscription_id ?? user.stripeSubscriptionId,
            preferences: JSON.stringify({
              ...preferences,
              planTier: body.plan === "management_stable" ? "stable" : "pro",
            }),
            ...(lastPayment ? { lastPaymentAt: lastPayment } : {}),
          }).where(eq(users.id, user.id));
        } else if (body.organization_id) {
          await tx.update(organizations).set({
            planTier: body.plan.replace(/^academy_/, ""),
            academyBillingStatus: body.status,
            academyBillingInterval: body.interval,
            academyBillingCurrentPeriodEndsAt: periodEnd,
            academyStripeCustomerId: body.stripe_customer_id ?? null,
            academyStripeSubscriptionId: body.stripe_subscription_id ?? null,
          }).where(and(eq(organizations.id, body.organization_id), eq(organizations.ownerId, user.id)));
        } else {
          const preferences = parsePreferences(user.preferences);
          await tx.update(users).set({
            preferences: JSON.stringify({
              ...preferences,
              academyEntitlementStatus: body.status,
              academyPlan: body.plan.replace(/^academy_/, ""),
              academyBillingInterval: body.interval,
              academyBillingCurrentPeriodEndsAt: body.current_period_ends_at ?? null,
              academyStripeCustomerId: body.stripe_customer_id ?? null,
              academyStripeSubscriptionId: body.stripe_subscription_id ?? null,
            }),
          }).where(eq(users.id, user.id));
        }
      });
    } catch {
      return res.status(409).json({ error: "Billing synchronization event already processed or could not be applied" });
    }
    await db.logActivity({
      userId: user.id,
      action: "billing_entitlement_synchronized",
      entityType: body.organization_id ? "organization" : "user",
      entityId: body.organization_id ?? user.id,
      details: JSON.stringify({ eventId: body.event_id, product: body.product, plan: body.plan, status: body.status }),
    });
    return res.json({ success: true, duplicate: false });
  });
}
