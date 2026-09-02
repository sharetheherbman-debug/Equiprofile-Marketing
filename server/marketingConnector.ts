import crypto from "crypto";
import type { Request, Response, Router } from "express";
import { isProductComplimentaryActive } from "../shared/productEntitlement";
import { createContext } from "./_core/context";
import { isTrustedCookieWrite } from "./_core/requestSecurity";

interface ConnectorResponse<T> {
  success: boolean;
  data?: T;
  error?: { message?: string; code?: string };
}

function envFlagEnabled(value: string | undefined): boolean {
  return /^(1|true|yes|on)$/i.test(String(value || "").trim());
}

function config() {
  const appUrl = (
    process.env.MARKETING_APP_URL || "https://marketing.equiprofile.online"
  ).replace(/\/$/, "");
  return {
    enabled: envFlagEnabled(process.env.MARKETING_CONNECTOR_ENABLED),
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
    current.enabled &&
    current.connectorKey.length >= 32 &&
    current.apiUrl.startsWith("https://")
  );
}

/**
 * Marketing is never opened merely because a user is signed in. The primary
 * owner is always eligible; additional users must be explicit administrators
 * and hold an active, audited Marketing complimentary grant. Billing-owned
 * Marketing entitlements can replace that grant check when the central Billing
 * service starts selling this product.
 */
async function requireOwner(req: Request, res: Response) {
  if (!isTrustedCookieWrite(req)) {
    res
      .status(403)
      .json({ error: "Cross-site authenticated request rejected" });
    return null;
  }

  const context = await createContext({ req, res } as never);
  if (!context.user || context.user.role !== "admin") {
    res.status(403).json({ error: "Administrator access required" });
    return null;
  }

  const ownerEmail = config().ownerEmail;
  if (!ownerEmail) {
    res.status(503).json({
      error:
        "PRIMARY_ADMIN_EMAIL must be configured before the Marketing service can be opened",
    });
    return null;
  }

  const signedInEmail = String(context.user.email || "")
    .trim()
    .toLowerCase();
  const isPrimaryOwner = !!signedInEmail && signedInEmail === ownerEmail;
  const hasDelegatedMarketingAccess = isProductComplimentaryActive(
    context.user.preferences,
    "marketing",
  );
  if (!isPrimaryOwner && !hasDelegatedMarketingAccess) {
    res.status(403).json({
      error:
        "Marketing access has not been granted to this administrator account",
    });
    return null;
  }

  return context.user;
}

/**
 * Owner-controlled connector status and SSO entry only. Conversion events are
 * deliberately not polled or inferred here: they use the canonical publisher,
 * explicit consent and durable post-commit product-line event wiring.
 */
export function registerMarketingConnectorRoutes(router: Router): void {
  router.get("/admin/marketing/status", async (req, res) => {
    try {
      const user = await requireOwner(req, res);
      if (!user) return;
      res.json({ available: isMarketingConnectorConfigured() });
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
      if (!isMarketingConnectorConfigured()) {
        return res.status(503).json({
          error: "Marketing connector is disabled or not configured",
        });
      }
      if (!user.email) {
        return res.status(400).json({
          error: "The administrator account requires an email address",
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
            : "Could not open the Marketing service",
      });
    }
  });
}
