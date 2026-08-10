import crypto from "crypto";
import type { Router, Request, Response } from "express";
import { gte, or } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { createContext } from "./_core/context";
import { getDb } from "./db";

interface ConnectorResponse<T> {
  success: boolean;
  data?: T;
  error?: { message?: string; code?: string };
}

export interface MarketingConversionEvent {
  event_id: string;
  event_type: string;
  occurred_at: string;
  external_user_id?: string;
  external_organization_id?: string;
  value_pence?: number;
  currency?: "GBP";
  consent_basis: "contract" | "consent" | "legitimate_interest" | "anonymous_aggregate";
  properties?: Record<string, unknown>;
}

const connectorRuntime = globalThis as typeof globalThis & {
  __equiprofileMarketingSyncTimer?: ReturnType<typeof setInterval>;
  __equiprofileMarketingSyncRunning?: boolean;
  __equiprofileMarketingLastScanAt?: Date;
};

function config() {
  const appUrl = (
    process.env.MARKETING_APP_URL ||
    "https://marketing.equiprofile.online"
  ).replace(/\/$/, "");
  return {
    appUrl,
    apiUrl: (process.env.MARKETING_API_URL || `${appUrl}/api/v1`).replace(
      /\/$/,
      "",
    ),
    applicationId: process.env.EQUIPROFILE_APP_ID || "equiprofile",
    connectorKey: process.env.EQUIPROFILE_CONNECTOR_KEY || "",
    ownerEmail: (process.env.PRIMARY_ADMIN_EMAIL || "").trim().toLowerCase(),
  };
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

function connectorHeaders(body: unknown): Record<string, string> {
  const current = config();
  if (!current.connectorKey || current.connectorKey.length < 32) {
    throw new Error("EQUIPROFILE_CONNECTOR_KEY is not configured securely");
  }
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(24).toString("base64url");
  const message = `${timestamp}\n${nonce}\n${canonicalize(body)}`;
  const signature = crypto
    .createHmac("sha256", current.connectorKey)
    .update(message, "utf8")
    .digest("hex");
  return {
    "Content-Type": "application/json",
    "X-Application-Id": current.applicationId,
    "X-Application-Key": current.connectorKey,
    "X-Application-Timestamp": timestamp,
    "X-Application-Nonce": nonce,
    "X-Application-Signature": signature,
  };
}

async function signedPost<T>(path: string, body: unknown): Promise<T> {
  const current = config();
  const response = await fetch(`${current.apiUrl}${path}`, {
    method: "POST",
    headers: connectorHeaders(body),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response
    .json()
    .catch(() => ({}))) as ConnectorResponse<T>;
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(
      payload.error?.message ||
        `Marketing connector request failed (${response.status})`,
    );
  }
  return payload.data;
}

export function isMarketingConnectorConfigured(): boolean {
  const current = config();
  return (
    current.connectorKey.length >= 32 && current.apiUrl.startsWith("https://")
  );
}

export async function sendMarketingConversionEvent(
  event: MarketingConversionEvent,
): Promise<boolean> {
  if (!isMarketingConnectorConfigured()) return false;
  try {
    await signedPost<{ accepted: boolean; duplicate: boolean }>(
      "/application-connectors/events/conversion",
      {
        ...event,
        currency: "GBP",
      },
    );
    return true;
  } catch (error) {
    console.error(
      "[Marketing Connector] Conversion event delivery failed:",
      error,
    );
    return false;
  }
}

function anonymousSubjectId(userId: number): string {
  return crypto
    .createHmac("sha256", config().connectorKey)
    .update(`equiprofile-user:${userId}`, "utf8")
    .digest("hex")
    .slice(0, 32);
}

async function syncRecentConversionSignals(): Promise<void> {
  if (
    !isMarketingConnectorConfigured() ||
    process.env.NODE_ENV === "test" ||
    connectorRuntime.__equiprofileMarketingSyncRunning
  ) {
    return;
  }

  connectorRuntime.__equiprofileMarketingSyncRunning = true;
  const scanStartedAt = new Date();
  try {
    const db = await getDb();
    if (!db) return;

    const previousScan = connectorRuntime.__equiprofileMarketingLastScanAt;
    const lookbackMs = previousScan ? 10 * 60 * 1000 : 48 * 60 * 60 * 1000;
    const since = new Date(
      (previousScan?.getTime() ?? scanStartedAt.getTime()) - lookbackMs,
    );

    const recentUsers = await db
      .select({
        id: users.id,
        createdAt: users.createdAt,
        lastPaymentAt: users.lastPaymentAt,
        subscriptionPlan: users.subscriptionPlan,
        subscriptionStatus: users.subscriptionStatus,
      })
      .from(users)
      .where(
        or(
          gte(users.createdAt, since),
          gte(users.lastPaymentAt, since),
        ),
      )
      .limit(500);

    let allDelivered = true;
    for (const user of recentUsers) {
      const anonymousId = anonymousSubjectId(user.id);
      const createdAt = user.createdAt ? new Date(user.createdAt) : null;
      const lastPaymentAt = user.lastPaymentAt
        ? new Date(user.lastPaymentAt)
        : null;

      if (createdAt && createdAt >= since) {
        const delivered = await sendMarketingConversionEvent({
          event_id: `account-registered:${anonymousId}:${createdAt.toISOString()}`,
          event_type: "account_registered",
          occurred_at: createdAt.toISOString(),
          consent_basis: "anonymous_aggregate",
          properties: {
            application: "equiprofile",
            subscription_plan: user.subscriptionPlan || "monthly",
          },
        });
        allDelivered = allDelivered && delivered;
      }

      if (lastPaymentAt && lastPaymentAt >= since) {
        const delivered = await sendMarketingConversionEvent({
          event_id: `subscription-payment:${anonymousId}:${lastPaymentAt.toISOString()}`,
          event_type: "subscription_payment_recorded",
          occurred_at: lastPaymentAt.toISOString(),
          consent_basis: "anonymous_aggregate",
          properties: {
            application: "equiprofile",
            subscription_plan: user.subscriptionPlan || "monthly",
            subscription_status: user.subscriptionStatus,
            revenue_value_exported: false,
          },
        });
        allDelivered = allDelivered && delivered;
      }
    }

    if (allDelivered) {
      connectorRuntime.__equiprofileMarketingLastScanAt = scanStartedAt;
    }
  } catch (error) {
    console.error("[Marketing Connector] Conversion sync failed:", error);
  } finally {
    connectorRuntime.__equiprofileMarketingSyncRunning = false;
  }
}

function startMarketingConversionSync(): void {
  if (
    !isMarketingConnectorConfigured() ||
    process.env.NODE_ENV === "test" ||
    connectorRuntime.__equiprofileMarketingSyncTimer
  ) {
    return;
  }

  void syncRecentConversionSignals();
  const timer = setInterval(
    () => void syncRecentConversionSignals(),
    5 * 60 * 1000,
  );
  timer.unref?.();
  connectorRuntime.__equiprofileMarketingSyncTimer = timer;
}

async function requireOwner(req: Request, res: Response) {
  const context = await createContext({ req, res } as never);
  if (!context.user || context.user.role !== "admin") {
    res.status(403).json({ error: "Owner access required" });
    return null;
  }

  const ownerEmail = config().ownerEmail;
  if (!ownerEmail) {
    res.status(503).json({
      error: "PRIMARY_ADMIN_EMAIL must be configured before EquiProfile Marketing can be opened",
    });
    return null;
  }

  const signedInEmail = String(context.user.email || "").trim().toLowerCase();
  if (!signedInEmail || signedInEmail !== ownerEmail) {
    res.status(403).json({ error: "EquiProfile owner access required" });
    return null;
  }

  return context.user;
}

export function registerMarketingConnectorRoutes(router: Router): void {
  startMarketingConversionSync();

  router.get("/admin/marketing/status", async (req, res) => {
    try {
      const user = await requireOwner(req, res);
      if (!user) return;
      const current = config();
      res.json({
        configured: isMarketingConnectorConfigured(),
        applicationId: current.applicationId,
        marketingUrl: current.appUrl,
        authentication: "owner-only signed one-use SSO",
        secretLocation: "VPS environment only",
        conversionSync: isMarketingConnectorConfigured()
          ? "anonymous aggregate sync enabled"
          : "disabled",
      });
    } catch (error) {
      console.error("[Marketing Connector] Status failed:", error);
      res
        .status(500)
        .json({ error: "Could not read Marketing connector status" });
    }
  });

  router.post("/admin/marketing/sso", async (req, res) => {
    try {
      const user = await requireOwner(req, res);
      if (!user) return;
      if (!user.email) {
        return res.status(400).json({
          error: "The owner account requires an email address",
        });
      }
      const payload = {
        external_user_id: String(user.id),
        email: String(user.email).trim().toLowerCase(),
        display_name: String(user.name || user.email),
        external_role: "admin" as const,
        target_path: "/dashboard",
      };
      const result = await signedPost<{
        redirect_url: string;
        expires_in_seconds: number;
      }>("/application-connectors/sso/issue", payload);
      const redirect = new URL(result.redirect_url);
      if (redirect.origin !== new URL(config().appUrl).origin) {
        throw new Error("Marketing returned an unexpected redirect origin");
      }
      res.json(result);
    } catch (error) {
      console.error("[Marketing Connector] SSO issue failed:", error);
      res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : "Could not open EquiProfile Marketing",
      });
    }
  });
}
