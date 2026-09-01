import crypto from "crypto";
import type { Request, Response, Router } from "express";
import { sdk } from "./_core/sdk";

const PRODUCTS = new Set(["management", "academy"]);
const ACTIONS = new Set(["home", "checkout", "portal"]);
const INTERVALS = new Set(["monthly", "yearly"]);

function enabled(value: string | undefined) {
  return /^(1|true|yes|on)$/i.test(String(value || "").trim());
}

function config() {
  const appUrl = (
    process.env.BILLING_APP_URL || "https://billing.equiprofile.online"
  ).replace(/\/$/, "");
  return {
    enabled: enabled(process.env.BILLING_SERVICE_ENABLED),
    appUrl,
    apiUrl: (process.env.BILLING_API_URL || `${appUrl}/api/v1`).replace(/\/$/, ""),
    applicationId: process.env.EQUIPROFILE_APP_ID || "equiprofile",
    connectorKey: process.env.BILLING_CONNECTOR_KEY || "",
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

function signedHeaders(body: unknown): Record<string, string> {
  const current = config();
  if (current.connectorKey.length < 32) {
    throw new Error("BILLING_CONNECTOR_KEY is not configured securely");
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
    "X-Application-Timestamp": timestamp,
    "X-Application-Nonce": nonce,
    "X-Application-Signature": signature,
  };
}

export function isBillingServiceConfigured() {
  const current = config();
  return (
    current.enabled &&
    current.connectorKey.length >= 32 &&
    current.apiUrl.startsWith("https://") &&
    current.appUrl.startsWith("https://")
  );
}

async function issueRedirect(body: Record<string, unknown>) {
  const current = config();
  const response = await fetch(`${current.apiUrl}/application-connectors/sso/issue`, {
    method: "POST",
    headers: signedHeaders(body),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    data?: { redirect_url?: string };
    error?: { message?: string };
  };
  if (!response.ok || !payload.success || !payload.data?.redirect_url) {
    throw new Error(
      payload.error?.message || `Billing connector request failed (${response.status})`,
    );
  }
  const redirect = new URL(payload.data.redirect_url);
  if (redirect.origin !== new URL(current.appUrl).origin) {
    throw new Error("Billing returned an unexpected redirect origin");
  }
  return redirect.toString();
}

export function registerBillingServiceRoutes(router: Router) {
  router.get("/billing/status", async (req: Request, res: Response) => {
    try {
      await sdk.authenticateRequest(req);
      res.json({ available: isBillingServiceConfigured() });
    } catch {
      res.status(401).json({ error: "Authentication required" });
    }
  });

  router.get("/billing/launch", async (req: Request, res: Response) => {
    try {
      if (!isBillingServiceConfigured()) {
        return res.status(503).json({ error: "EquiProfile Billing is not configured" });
      }
      const user = await sdk.authenticateRequest(req);
      if (!user.email) {
        return res.status(400).json({ error: "An email address is required for billing" });
      }
      const product = String(req.query.product || "");
      const action = String(req.query.action || "home");
      const plan = req.query.plan ? String(req.query.plan) : undefined;
      const interval = req.query.interval ? String(req.query.interval) : undefined;
      if (!PRODUCTS.has(product)) {
        return res.status(400).json({ error: "Invalid billing product" });
      }
      if (!ACTIONS.has(action)) {
        return res.status(400).json({ error: "Invalid billing action" });
      }
      if (interval && !INTERVALS.has(interval)) {
        return res.status(400).json({ error: "Invalid billing interval" });
      }
      if (plan && !/^[a-z0-9_]{2,80}$/.test(plan)) {
        return res.status(400).json({ error: "Invalid billing plan" });
      }

      const redirectUrl = await issueRedirect({
        external_user_id: String(user.id),
        email: String(user.email).trim().toLowerCase(),
        display_name: String(user.name || user.email),
        external_role: user.role,
        product,
        action,
        ...(plan ? { plan } : {}),
        ...(interval ? { interval } : {}),
      });
      res.redirect(303, redirectUrl);
    } catch (error) {
      console.error("[Billing Connector] Launch failed:", error);
      res.status(502).json({
        error: error instanceof Error ? error.message : "Could not open EquiProfile Billing",
      });
    }
  });
}
