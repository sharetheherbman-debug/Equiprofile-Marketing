import crypto from "crypto";
import type { Express, Request, Response } from "express";
import { createContext } from "./_core/context";

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

function config() {
  const appUrl = (process.env.MARKETING_APP_URL || "https://marketing.equiprofile.online").replace(/\/$/, "");
  return {
    appUrl,
    apiUrl: (process.env.MARKETING_API_URL || `${appUrl}/api/v1`).replace(/\/$/, ""),
    applicationId: process.env.EQUIPROFILE_APP_ID || "equiprofile",
    connectorKey: process.env.EQUIPROFILE_CONNECTOR_KEY || "",
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
  const payload = (await response.json().catch(() => ({}))) as ConnectorResponse<T>;
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message || `Marketing connector request failed (${response.status})`);
  }
  return payload.data;
}

export function isMarketingConnectorConfigured(): boolean {
  const current = config();
  return current.connectorKey.length >= 32 && current.apiUrl.startsWith("https://");
}

export async function sendMarketingConversionEvent(event: MarketingConversionEvent): Promise<void> {
  if (!isMarketingConnectorConfigured()) return;
  try {
    await signedPost<{ accepted: boolean; duplicate: boolean }>("/application-connectors/events/conversion", {
      ...event,
      currency: "GBP",
    });
  } catch (error) {
    console.error("[Marketing Connector] Conversion event delivery failed:", error);
  }
}

async function requireAdmin(req: Request, res: Response) {
  // Express req/res is compatible with the tRPC context adapter used by EquiProfile.
  const context = await createContext({ req, res } as never);
  if (!context.user || context.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return context.user;
}

export function registerMarketingConnectorRoutes(app: Express): void {
  app.get("/api/admin/marketing/status", async (req, res) => {
    try {
      const user = await requireAdmin(req, res);
      if (!user) return;
      const current = config();
      res.json({
        configured: isMarketingConnectorConfigured(),
        applicationId: current.applicationId,
        marketingUrl: current.appUrl,
        authentication: "signed one-use SSO",
        secretLocation: "VPS environment only",
      });
    } catch (error) {
      console.error("[Marketing Connector] Status failed:", error);
      res.status(500).json({ error: "Could not read Marketing connector status" });
    }
  });

  app.post("/api/admin/marketing/sso", async (req, res) => {
    try {
      const user = await requireAdmin(req, res);
      if (!user) return;
      if (!user.email) {
        return res.status(400).json({ error: "The administrator account requires an email address" });
      }
      const payload = {
        external_user_id: String(user.id),
        email: String(user.email).trim().toLowerCase(),
        display_name: String(user.name || user.email),
        external_role: "admin" as const,
        target_path: "/dashboard",
      };
      const result = await signedPost<{ redirect_url: string; expires_in_seconds: number }>(
        "/application-connectors/sso/issue",
        payload,
      );
      const redirect = new URL(result.redirect_url);
      if (redirect.origin !== new URL(config().appUrl).origin) {
        throw new Error("Marketing returned an unexpected redirect origin");
      }
      res.json(result);
    } catch (error) {
      console.error("[Marketing Connector] SSO issue failed:", error);
      res.status(502).json({
        error: error instanceof Error ? error.message : "Could not open EquiProfile Marketing",
      });
    }
  });
}
