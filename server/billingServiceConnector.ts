import crypto from "crypto";
import type { Request, Response, Router } from "express";
import { and, eq } from "drizzle-orm";
import { organizations } from "../drizzle/schema";
import { getDb } from "./db";
import { sdk } from "./_core/sdk";

const PRODUCTS = new Set(["management", "academy"]);
const ACTIONS = new Set(["home", "checkout", "portal"]);
const INTERVALS = new Set(["monthly", "yearly"]);
const PRODUCT_PLANS = {
  management: new Set(["management_pro", "management_stable"]),
  academy: new Set([
    "academy_rider",
    "academy_school_10",
    "academy_school_20",
    "academy_school_50",
  ]),
} as const;

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
        if (req.accepts(["html", "json"]) === "html") {
          return res.status(503).type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>EquiProfile Billing is coming online</title><meta name="robots" content="noindex,nofollow">
<style>body{margin:0;background:#f4f7fb;color:#102a43;font:16px/1.6 system-ui,sans-serif;display:grid;min-height:100vh;place-items:center}.card{max-width:34rem;margin:1rem;padding:2rem;border:1px solid #d9e2ec;border-radius:1rem;background:#fff;box-shadow:0 18px 50px rgba(15,35,55,.1)}h1{font-family:Georgia,serif;line-height:1.2}a{color:#245a8a}</style></head>
<body><main class="card"><h1>EquiProfile Billing is coming online</h1><p>Your account and product data are safe. The central Billing centre is temporarily unavailable while its service connection is completed.</p><p>Please return to EquiProfile and try again later, or contact <a href="mailto:hello@equiprofile.online">hello@equiprofile.online</a> if you need help.</p><p><a href="/">Return to EquiProfile</a></p></main></body></html>`);
        }
        return res.status(503).json({ error: "EquiProfile Billing is temporarily unavailable" });
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
      if (action === "checkout" && (!plan || !interval || !PRODUCT_PLANS[product as "management" | "academy"].has(plan))) {
        return res.status(400).json({ error: "Invalid product plan" });
      }

      let organizationId: number | undefined;
      if (product === "academy" && plan?.startsWith("academy_school_")) {
        const database = await getDb();
        if (!database) return res.status(503).json({ error: "Academy organization verification is unavailable" });
        const [organization] = await database
          .select({ id: organizations.id })
          .from(organizations)
          .where(and(eq(organizations.ownerId, user.id), eq(organizations.isActive, true)))
          .limit(1);
        if (!organization) {
          return res.status(409).json({ error: "Create or restore your Academy organization before choosing a school plan" });
        }
        organizationId = organization.id;
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
        ...(organizationId ? { organization_id: organizationId } : {}),
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
