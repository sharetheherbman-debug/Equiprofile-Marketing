// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import cors from "cors";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import authRouter from "./authRouter";
import billingRouter from "./billingRouter";
import salesChatRouter from "./salesChatRouter";
import { appRouter } from "../routers";
import { apiRouter } from "../api";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import * as db from "../db";
import { getDb } from "../db";
import { resolveMarketingConsent } from "./marketingConsent";
import { publishMarketingEvent } from "./marketingPublisher";
import { contactSubmissions, organizations, users } from "../../drizzle/schema";
import { sql, eq } from "drizzle-orm";
import {
  getStoreStripe,
  getStripe,
  validatePricingConfig,
  PRICING_PLANS,
} from "../stripe";
import {
  isStoreScopedMetadata,
  reconcilePaidStoreCheckout,
  reconcileStoreRefund,
} from "../commerce/paymentReconciliation";
import {
  academySubscriptionStatus,
  getAcademyStripe,
  isAcademyScopedMetadata,
} from "../academy/billing";
import * as email from "./email";
import { ENV } from "./env";
import { getRuntimeConfig } from "../dynamicConfig";
import { resolve } from "path";
import path from "path";
import fs from "fs";
import {
  decodeUploadFileKey,
  findServableUploadFile,
  getRuntimeFileStorageReadiness,
  safeResolveInside,
} from "./storage/runtimeFileStorage";

// Module-level server reference used by the graceful-shutdown handler below.
// Set inside server.listen() callback once the port is bound.
let _activeServer: import("http").Server | null = null;

type CoreDb = NonNullable<Awaited<ReturnType<typeof getDb>>>;

async function releaseStoreCheckoutReservation(
  database: CoreDb,
  orderId: number,
  nextStatus: "payment_failed" | "cancelled",
) {
  return database.transaction(async (tx) => {
    const rows = (
      (await tx.execute(
        sql`SELECT id, status FROM commerceOrders WHERE id = ${orderId} LIMIT 1 FOR UPDATE`,
      )) as any
    )[0] as Array<{ id: number; status: string }>;
    const order = rows[0];
    if (
      !order ||
      !["checkout_pending", "payment_pending"].includes(order.status)
    ) {
      return false;
    }
    await tx.execute(sql`
      UPDATE commerceSupplierInventory si
      JOIN commerceSupplierProducts sp ON sp.id = si.supplierProductId
      JOIN commerceOrderItems oi
        ON oi.variantId = sp.variantId
        AND oi.supplierId = sp.supplierId
        AND sp.id = (
          SELECT MIN(sp2.id)
          FROM commerceSupplierProducts sp2
          WHERE sp2.variantId = oi.variantId AND sp2.supplierId = oi.supplierId
        )
      SET si.quantity = COALESCE(si.quantity, 0) + oi.quantity,
          si.availabilityStatus = CASE
            WHEN COALESCE(si.quantity, 0) + oi.quantity <= 5 THEN 'low_stock'
            ELSE 'in_stock'
          END
      WHERE oi.orderId = ${orderId}
    `);
    await tx.execute(
      sql`UPDATE commerceOrders SET status = ${nextStatus}, storePaymentStatus = 'failed' WHERE id = ${orderId} AND status = ${order.status}`,
    );
    return true;
  });
}

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

// Port checking functions removed - now using deterministic port binding
// If port is in use, server will fail with clear error message instead of auto-switching

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Trust proxy - CRITICAL for correct IP detection behind nginx reverse proxy
  // Must be set BEFORE rate limiter and any middleware that reads req.ip
  app.set("trust proxy", 1);
  console.log("✅ Trust proxy enabled for reverse proxy support");

  // CORS configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3100",
        "http://127.0.0.1:3100",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://academy.localhost:3001",
        "http://shop.localhost:3001",
        "http://academy.localhost:3002",
        "https://equiprofile.online",
        "https://www.equiprofile.online",
        "https://academy.equiprofile.online",
        // Legacy compatibility only for existing Academy links.
        "https://school.equiprofile.online",
        "https://shop.equiprofile.online",
      ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
      maxAge: 86400, // 24 hours
    }),
  );
  console.log("✅ CORS configured with allowed origins:", allowedOrigins);

  // Security headers via Helmet.
  // CSP uses 'unsafe-inline' (no nonces) so that Vite-generated inline
  // scripts are always permitted regardless of whether a service worker or
  // Nginx cache returns a previously-seen HTML response.  Nonce-based CSP
  // caused recurring blank white screens: stale HTML contained an old nonce
  // that no longer matched the server-generated header.  Removing nonces
  // permanently eliminates that failure mode while keeping all other
  // directives enforced.  The same static CSP is also set by Nginx
  // (deployment/nginx/equiprofile.conf) as a belt-and-suspenders measure.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://www.googletagmanager.com",
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: [
            "'self'",
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://region1.google-analytics.com",
            "https://www.googleadservices.com",
            "https://googleads.g.doubleclick.net",
          ],
          frameAncestors: ["'self'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Request ID middleware for logging
  app.use((req, res, next) => {
    req.headers["x-request-id"] = req.headers["x-request-id"] || nanoid();
    res.setHeader("X-Request-ID", req.headers["x-request-id"] as string);
    next();
  });

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[${req.headers["x-request-id"]}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`,
      );
    });
    next();
  });

  // Rate limiting
  // Trust proxy is already set globally via app.set("trust proxy", 1)
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "2000"),
    message: {
      error: "Too many requests",
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json(options.message);
    },
  });
  app.use("/api", limiter);

  // Health/build endpoints rate limiter (more permissive for monitoring)
  const healthLimiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 60, // 60 requests per minute (1 per second average)
    message: {
      error: "Too many requests",
      message: "Too many health check requests",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json(options.message);
    },
  });

  app.get("/shop-sitemap.xml", async (_req, res) => {
    const database = await getDb();
    if (!database) {
      return res
        .status(503)
        .type("text/plain")
        .send("Shop catalogue unavailable");
    }
    const products = (
      (await database.execute(sql`
        SELECT slug, updatedAt
        FROM commerceProducts
        WHERE status = 'published'
          AND developmentOnly = FALSE
          AND isArchived = FALSE
          AND imageRightsStatus = 'licensed'
        ORDER BY slug
      `)) as any
    )[0] as Array<{ slug: string; updatedAt: Date | string }>;
    const urls = [
      "  <url><loc>https://shop.equiprofile.online/</loc></url>",
      ...products.map((product) => {
        const location = `https://shop.equiprofile.online/?product=${encodeURIComponent(product.slug)}`;
        const modified = new Date(product.updatedAt).toISOString().slice(0, 10);
        return `  <url><loc>${xmlEscape(location)}</loc><lastmod>${modified}</lastmod></url>`;
      }),
    ];
    res
      .status(200)
      .type("application/xml")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`,
      );
  });

  // Store Stripe webhook — deliberately isolated from SaaS subscription billing.
  // It remains inactive until dedicated Store configuration is present.
  app.post(
    "/api/webhooks/store-stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const stripe = getStoreStripe();
      const webhookSecret = process.env.STORE_STRIPE_WEBHOOK_SECRET;
      if (!stripe || !webhookSecret) {
        return res
          .status(503)
          .json({ error: "Store payment processing is not configured" });
      }
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        return res.status(400).json({ error: "Missing Stripe signature" });
      }
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret,
        );
      } catch (error: any) {
        return res.status(400).json({
          error: `Store webhook signature verification failed: ${error.message}`,
        });
      }
      const dbConn = await getDb();
      if (!dbConn) {
        return res.status(503).json({ error: "Database unavailable" });
      }
      const object = event.data.object as
        | Stripe.Checkout.Session
        | Stripe.PaymentIntent
        | Stripe.Charge;
      const metadata = "metadata" in object ? object.metadata : null;
      if (!isStoreScopedMetadata(metadata)) {
        const ignoredInsert = (await dbConn.execute(
          sql`INSERT IGNORE INTO commercePaymentEvents (provider, providerEventId, eventType, status, payloadJson, processedAt) VALUES ('stripe', ${event.id}, ${event.type}, 'ignored', ${JSON.stringify(event.data.object)}, CURRENT_TIMESTAMP)`,
        )) as unknown as [{ affectedRows?: number }, unknown];
        if (Number(ignoredInsert[0]?.affectedRows ?? 0) === 0) {
          return res.json({ received: true, cached: true });
        }
        return res.json({ received: true, ignored: true });
      }
      const orderId = Number(metadata.orderId);
      const order = (
        (await dbConn.execute(
          sql`SELECT commerceOrders.id, commerceOrders.orderNumber, commerceOrders.totalPence, commerceOrders.currency, commerceOrders.status, commerceOrders.storePaymentStatus, users.preferences AS userPreferences FROM commerceOrders JOIN users ON users.id = commerceOrders.userId WHERE commerceOrders.id = ${orderId} LIMIT 1`,
        )) as any
      )[0] as Array<{
        id: number;
        orderNumber: string;
        totalPence: number;
        currency: string;
        status: string;
        storePaymentStatus: string;
        userPreferences: string | null;
      }>;
      if (!order[0]) {
        const failedInsert = (await dbConn.execute(
          sql`INSERT IGNORE INTO commercePaymentEvents (provider, providerEventId, eventType, status, payloadJson, processedAt) VALUES ('stripe', ${event.id}, ${event.type}, 'failed', ${JSON.stringify(event.data.object)}, CURRENT_TIMESTAMP)`,
        )) as unknown as [{ affectedRows?: number }, unknown];
        if (Number(failedInsert[0]?.affectedRows ?? 0) === 0) {
          return res.json({ received: true, cached: true });
        }
        return res.json({ received: true, rejected: true });
      }
      if (metadata.orderNumber !== order[0].orderNumber) {
        const mismatchedInsert = (await dbConn.execute(
          sql`INSERT IGNORE INTO commercePaymentEvents (provider, providerEventId, eventType, orderId, status, payloadJson, processedAt) VALUES ('stripe', ${event.id}, ${event.type}, ${orderId}, 'failed', ${JSON.stringify(event.data.object)}, CURRENT_TIMESTAMP)`,
        )) as unknown as [{ affectedRows?: number }, unknown];
        if (Number(mismatchedInsert[0]?.affectedRows ?? 0) === 0) {
          return res.json({ received: true, cached: true });
        }
        return res.json({ received: true, rejected: true });
      }
      const paymentReference =
        "payment_intent" in object
          ? String(object.payment_intent ?? "")
          : "id" in object
            ? object.id
            : "";
      const eventInsert = (await dbConn.execute(
        sql`INSERT IGNORE INTO commercePaymentEvents (provider, providerEventId, eventType, orderId, paymentIntentId, status, payloadJson) VALUES ('stripe', ${event.id}, ${event.type}, ${orderId}, ${paymentReference || null}, 'received', ${JSON.stringify(event.data.object)})`,
      )) as unknown as [{ affectedRows?: number }, unknown];
      if (Number(eventInsert[0]?.affectedRows ?? 0) === 0) {
        const retryClaim = (await dbConn.execute(
          sql`UPDATE commercePaymentEvents SET status = 'received', processedAt = NULL WHERE provider = 'stripe' AND providerEventId = ${event.id} AND status = 'failed'`,
        )) as unknown as [{ affectedRows?: number }, unknown];
        if (Number(retryClaim[0]?.affectedRows ?? 0) === 0) {
          return res.json({ received: true, cached: true });
        }
      }

      let reconciliationFailure: string | null = null;
      if (event.type === "checkout.session.completed") {
        const session = object as Stripe.Checkout.Session;
        const decision = reconcilePaidStoreCheckout({
          order: order[0],
          amountTotal: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
        });
        if (!decision.accepted) reconciliationFailure = decision.reason;
        else {
          await dbConn.execute(
            sql`UPDATE commerceOrders SET status = 'paid', storePaymentStatus = 'paid', storePaymentReference = ${paymentReference || null} WHERE id = ${orderId} AND status IN ('checkout_pending', 'payment_pending')`,
          );

          // The payment transition is durable. Detached connector delivery uses
          // only explicit consent and aggregate order facts, and cannot affect
          // the webhook acknowledgement or Store payment state.
          if (
            resolveMarketingConsent(order[0].userPreferences) ===
            "marketing_opt_in"
          ) {
            void (async () => {
              try {
                const itemRows = (
                  (await dbConn.execute(
                    sql`SELECT COALESCE(SUM(quantity), 0) AS itemCount FROM commerceOrderItems WHERE orderId = ${orderId}`,
                  )) as any
                )[0] as Array<{ itemCount: number | string }>;
                await publishMarketingEvent({
                  sourceApp: "equiprofile.online",
                  productLine: "shop",
                  eventType: "shop_order_paid",
                  entityType: "order",
                  entityId: order[0].orderNumber,
                  publicUrl: (
                    process.env.STORE_PUBLIC_URL ??
                    "https://shop.equiprofile.online"
                  ).replace(/\/$/, ""),
                  timestamp: new Date().toISOString(),
                  consentState: "marketing_opt_in",
                  idempotencyKey: `shop-order-paid:${order[0].orderNumber}`,
                  payloadVersion: "1.0",
                  payload: {
                    orderNumber: order[0].orderNumber,
                    currency: "GBP",
                    totalPence: order[0].totalPence,
                    itemCount: Number(itemRows[0]?.itemCount ?? 0),
                    purchaseState: "paid",
                  },
                });
              } catch {
                // Marketing delivery is strictly best-effort after payment.
              }
            })();
          }
        }
      } else if (event.type === "payment_intent.payment_failed") {
        await releaseStoreCheckoutReservation(
          dbConn,
          orderId,
          "payment_failed",
        );
      } else if (event.type === "checkout.session.expired") {
        await releaseStoreCheckoutReservation(dbConn, orderId, "cancelled");
      } else if (event.type === "charge.refunded") {
        const charge = object as Stripe.Charge;
        const decision = reconcileStoreRefund({
          order: order[0],
          amountRefunded: charge.amount_refunded,
          currency: charge.currency,
        });
        if (!decision.accepted) reconciliationFailure = decision.reason;
        else {
          try {
            await dbConn.transaction(async (tx) => {
              const lockedOrder = (
                (await tx.execute(
                  sql`SELECT id FROM commerceOrders WHERE id = ${orderId} LIMIT 1 FOR UPDATE`,
                )) as any
              )[0] as Array<{ id: number }>;
              if (!lockedOrder[0])
                throw new Error(
                  "Store order disappeared during refund reconciliation.",
                );
              for (const providerRefund of charge.refunds?.data ?? []) {
                await tx.execute(
                  sql`UPDATE commerceRefunds SET status = 'succeeded' WHERE orderId = ${orderId} AND stripeRefundId = ${providerRefund.id} AND status = 'pending'`,
                );
              }
              const priorRefunds = (
                (await tx.execute(
                  sql`SELECT COALESCE(SUM(amountPence), 0) AS refundedPence FROM commerceRefunds WHERE orderId = ${orderId} AND status = 'succeeded' FOR UPDATE`,
                )) as any
              )[0] as Array<{ refundedPence: number | string }>;
              const priorRefundedPence = Number(
                priorRefunds[0]?.refundedPence ?? 0,
              );
              const refundDelta = charge.amount_refunded - priorRefundedPence;
              if (refundDelta < 0) {
                throw new Error(
                  "Refund event is older than trusted refund bookkeeping.",
                );
              }
              if (refundDelta > 0) {
                await tx.execute(
                  sql`INSERT INTO commerceRefunds (orderId, amountPence, status, stripeRefundId, idempotencyKey) VALUES (${orderId}, ${refundDelta}, 'succeeded', ${`event:${event.id}`}, ${`stripe-refund-event:${event.id}`})`,
                );
              }
              await tx.execute(
                sql`UPDATE commerceOrders SET status = ${decision.paymentStatus}, storePaymentStatus = ${decision.paymentStatus} WHERE id = ${orderId} AND status IN ('paid', 'acknowledged', 'processing', 'partially_fulfilled', 'fulfilled', 'dispatched', 'delivered', 'returned', 'partially_refunded')`,
              );
            });
          } catch (error) {
            reconciliationFailure =
              error instanceof Error
                ? error.message
                : "Store refund reconciliation transaction failed.";
          }
        }
      }
      if (reconciliationFailure) {
        await dbConn.execute(
          sql`UPDATE commercePaymentEvents SET status = 'failed', processedAt = CURRENT_TIMESTAMP WHERE provider = 'stripe' AND providerEventId = ${event.id}`,
        );
        return res.json({ received: true, rejected: true });
      }
      await dbConn.execute(
        sql`UPDATE commercePaymentEvents SET status = 'processed', processedAt = CURRENT_TIMESTAMP WHERE provider = 'stripe' AND providerEventId = ${event.id}`,
      );
      return res.json({ received: true });
    },
  );

  // Academy Stripe TEST webhook — isolated from SaaS subscriptions and Store payments.
  app.post(
    "/api/webhooks/academy-stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const stripe = getAcademyStripe();
      const webhookSecret = process.env.ACADEMY_STRIPE_WEBHOOK_SECRET;
      if (
        !stripe ||
        !webhookSecret ||
        process.env.ACADEMY_STRIPE_TEST_MODE !== "true"
      ) {
        return res
          .status(503)
          .json({ error: "Academy TEST payment processing is not configured" });
      }
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        return res.status(400).json({ error: "Missing Stripe signature" });
      }
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret,
        );
      } catch (error: any) {
        return res.status(400).json({
          error: `Academy webhook signature verification failed: ${error.message}`,
        });
      }
      const dbConn = await getDb();
      if (!dbConn) {
        return res.status(503).json({ error: "Database unavailable" });
      }
      const existing = (
        (await dbConn.execute(
          sql`SELECT id FROM academyBillingEvents WHERE provider = 'stripe' AND providerEventId = ${event.id} LIMIT 1`,
        )) as any
      )[0] as Array<{ id: number }>;
      if (existing?.[0]) return res.json({ received: true, cached: true });

      const object = event.data.object as
        | Stripe.Checkout.Session
        | Stripe.Subscription;
      const metadata = "metadata" in object ? object.metadata : null;
      if (!isAcademyScopedMetadata(metadata)) {
        await dbConn.execute(
          sql`INSERT INTO academyBillingEvents (provider, providerEventId, eventType, status, payloadJson) VALUES ('stripe', ${event.id}, ${event.type}, 'ignored', ${JSON.stringify(event.data.object)})`,
        );
        return res.json({ received: true, ignored: true });
      }
      const organizationId = Number(metadata.organizationId);
      const [organization] = await dbConn
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.id, organizationId))
        .limit(1);
      if (!organization) {
        await dbConn.execute(
          sql`INSERT INTO academyBillingEvents (provider, providerEventId, eventType, status, payloadJson) VALUES ('stripe', ${event.id}, ${event.type}, 'failed', ${JSON.stringify(event.data.object)})`,
        );
        return res.json({ received: true, rejected: true });
      }
      await dbConn.execute(
        sql`INSERT INTO academyBillingEvents (provider, providerEventId, eventType, organizationId, status, payloadJson) VALUES ('stripe', ${event.id}, ${event.type}, ${organizationId}, 'received', ${JSON.stringify(event.data.object)})`,
      );

      if (event.type === "checkout.session.completed") {
        const session = object as Stripe.Checkout.Session;
        await dbConn
          .update(organizations)
          .set({
            academyBillingStatus: "checkout_pending",
            academyStripeCustomerId: session.customer
              ? String(session.customer)
              : null,
            academyStripeSubscriptionId: session.subscription
              ? String(session.subscription)
              : null,
            academyStripeCheckoutSessionId: session.id,
          })
          .where(eq(organizations.id, organizationId));
      } else if (
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated" ||
        event.type === "customer.subscription.deleted"
      ) {
        const subscription = object as Stripe.Subscription;
        const status = academySubscriptionStatus(subscription.status);
        const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
        const currentPeriodEndsAt = currentPeriodEnd
          ? new Date(currentPeriodEnd * 1000)
          : null;
        await dbConn
          .update(organizations)
          .set({
            academyBillingStatus: status,
            academyStripeCustomerId: String(subscription.customer),
            academyStripeSubscriptionId: subscription.id,
            academyBillingPriceId: subscription.items.data[0]?.price.id ?? null,
            academyBillingCurrentPeriodEndsAt: currentPeriodEndsAt,
          })
          .where(eq(organizations.id, organizationId));
      }
      await dbConn.execute(
        sql`UPDATE academyBillingEvents SET status = 'processed', processedAt = CURRENT_TIMESTAMP WHERE provider = 'stripe' AND providerEventId = ${event.id}`,
      );
      return res.json({ received: true });
    },
  );

  // Stripe webhook - must be before body parser
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !webhookSecret) {
        return res.status(400).json({ error: "Missing signature or secret" });
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error(
          `[Stripe Webhook] Signature verification failed:`,
          err.message,
        );
        return res.status(400).json({
          error: `Webhook signature verification failed: ${err.message}`,
        });
      }

      // Check for duplicate events (idempotency)
      const alreadyProcessed = await db.isStripeEventProcessed(event.id);
      if (alreadyProcessed) {
        console.log(`[Stripe Webhook] Event ${event.id} already processed`);
        return res.json({ received: true, cached: true });
      }

      // Store event for idempotency
      await db.createStripeEvent(
        event.id,
        event.type,
        JSON.stringify(event.data.object),
      );

      try {
        // Handle different event types
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = parseInt(session.metadata?.userId || "0");

            if (userId && session.customer && session.subscription) {
              const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string,
              );
              const plan =
                subscription.items.data[0]?.price.recurring?.interval === "year"
                  ? "yearly"
                  : "monthly";

              // Determine plan tier (pro vs stable) by matching price ID
              const priceId = subscription.items.data[0]?.price.id || "";
              const stablePriceIds = [
                PRICING_PLANS.stable.monthly.priceId,
                PRICING_PLANS.stable.yearly.priceId,
              ].filter(Boolean);
              const planTier = stablePriceIds.includes(priceId)
                ? "stable"
                : "pro";

              await db.updateUser(userId, {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                subscriptionStatus: "active",
                subscriptionPlan: plan,
                lastPaymentAt: new Date(),
              });

              // Store plan tier in user preferences
              const userForPrefs = await db.getUserById(userId);
              if (userForPrefs) {
                const existingPrefs = userForPrefs.preferences
                  ? JSON.parse(userForPrefs.preferences)
                  : {};
                await db.updateUser(userId, {
                  preferences: JSON.stringify({ ...existingPrefs, planTier }),
                });

                email
                  .sendPaymentSuccessEmail(userForPrefs, plan)
                  .catch((err) =>
                    console.error(
                      "[Stripe Webhook] Failed to send payment email:",
                      err,
                    ),
                  );
              }

              console.log(
                `[Stripe Webhook] User ${userId} subscription activated (tier: ${planTier})`,
              );
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = await getUserIdByStripeSubscription(subscription.id);

            if (userId) {
              let status: "active" | "cancelled" | "overdue" | "expired" =
                "active";
              if (subscription.status === "past_due") status = "overdue";
              if (
                subscription.status === "canceled" ||
                subscription.status === "unpaid"
              )
                status = "cancelled";
              if (subscription.status === "incomplete_expired")
                status = "expired";

              await db.updateUser(userId, {
                subscriptionStatus: status,
                subscriptionEndsAt: subscription.cancel_at
                  ? new Date(subscription.cancel_at * 1000)
                  : null,
              });

              // Keep planTier in preferences in sync with the active price.
              // Without this, a user who switches from Stable → Pro retains
              // planTier = "stable" in their preferences indefinitely.
              const updatedPriceId = subscription.items.data[0]?.price.id || "";
              const stablePriceIds = [
                PRICING_PLANS.stable.monthly.priceId,
                PRICING_PLANS.stable.yearly.priceId,
              ].filter(Boolean);
              const updatedPlanTier = stablePriceIds.includes(updatedPriceId)
                ? "stable"
                : "pro";
              const userForPrefsUpdate = await db.getUserById(userId);
              if (userForPrefsUpdate) {
                const existingPrefs = userForPrefsUpdate.preferences
                  ? JSON.parse(userForPrefsUpdate.preferences)
                  : {};
                await db.updateUser(userId, {
                  preferences: JSON.stringify({
                    ...existingPrefs,
                    planTier: updatedPlanTier,
                  }),
                });
              }

              console.log(
                `[Stripe Webhook] User ${userId} subscription updated to ${status} (tier: ${updatedPlanTier})`,
              );
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = await getUserIdByStripeSubscription(subscription.id);

            if (userId) {
              await db.updateUser(userId, {
                subscriptionStatus: "cancelled",
                subscriptionEndsAt: new Date(),
              });

              // Send cancellation confirmation email
              const cancelledUser = await db.getUserById(userId);
              if (cancelledUser) {
                email
                  .sendCancellationEmail(cancelledUser)
                  .catch((err) =>
                    console.error(
                      "[Stripe Webhook] Failed to send cancellation email:",
                      err,
                    ),
                  );
              }

              console.log(
                `[Stripe Webhook] User ${userId} subscription cancelled`,
              );
            }
            break;
          }

          case "invoice.payment_succeeded": {
            const invoice = event.data.object as any;
            const subscriptionId = invoice.subscription as string | undefined;
            if (subscriptionId) {
              const userId =
                await getUserIdByStripeSubscription(subscriptionId);
              if (userId) {
                await db.updateUser(userId, {
                  subscriptionStatus: "active",
                  lastPaymentAt: new Date(),
                });

                // Send renewal receipt email (skip for first checkout — that's handled above)
                if (invoice.billing_reason !== "subscription_create") {
                  const paidUser = await db.getUserById(userId);
                  if (paidUser) {
                    const plan =
                      paidUser.subscriptionPlan === "monthly" ||
                      paidUser.subscriptionPlan === "yearly"
                        ? paidUser.subscriptionPlan
                        : undefined;
                    email
                      .sendRenewalReceiptEmail(paidUser, plan)
                      .catch((err) =>
                        console.error(
                          "[Stripe Webhook] Failed to send renewal receipt email:",
                          err,
                        ),
                      );
                  }
                }

                console.log(
                  `[Stripe Webhook] User ${userId} payment succeeded`,
                );
              }
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as any;
            const subscriptionId = invoice.subscription as string | undefined;
            if (subscriptionId) {
              const userId =
                await getUserIdByStripeSubscription(subscriptionId);
              if (userId) {
                await db.updateUser(userId, {
                  subscriptionStatus: "overdue",
                });

                // Send payment failed email
                const overdueUser = await db.getUserById(userId);
                if (overdueUser) {
                  email
                    .sendPaymentFailedEmail(overdueUser)
                    .catch((err) =>
                      console.error(
                        "[Stripe Webhook] Failed to send payment failed email:",
                        err,
                      ),
                    );
                }

                console.log(`[Stripe Webhook] User ${userId} payment failed`);
              }
            }
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        await db.markStripeEventProcessed(event.id);
        res.json({ received: true });
      } catch (error) {
        console.error(
          `[Stripe Webhook] Error processing event ${event.id}:`,
          error,
        );
        await db.markStripeEventProcessed(event.id, (error as Error).message);
        res.status(500).json({ error: "Webhook processing failed" });
      }
    },
  );

  // Helper function to find user by Stripe subscription ID
  async function getUserIdByStripeSubscription(
    subscriptionId: string,
  ): Promise<number | null> {
    const user = await db.getUserByStripeSubscriptionId(subscriptionId);
    return user?.id || null;
  }

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Cache build info at startup to avoid blocking on every request
  let cachedBuildInfo: any = null;
  try {
    const packageJsonPath = resolve(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // Try to get git commit (only once at startup)
    let commit = "unknown";
    try {
      const { execSync } = require("child_process");
      commit = execSync("git rev-parse HEAD", {
        encoding: "utf-8",
        timeout: 1000,
      })
        .trim()
        .slice(0, 7);
    } catch {
      // Git not available, that's okay
    }

    cachedBuildInfo = {
      version: packageJson.version || "1.0.0",
      buildId: process.env.BUILD_ID || "dev",
      commit,
      buildTime: process.env.BUILD_TIME || new Date().toISOString(),
      nodeVersion: process.version,
    };
  } catch (err) {
    console.warn("⚠️  Could not generate build info:", err);
    cachedBuildInfo = {
      version: "1.0.0",
      buildId: "unknown",
      commit: "unknown",
      buildTime: new Date().toISOString(),
      nodeVersion: process.version,
    };
  }

  // Simple health check endpoint (production-friendly) with rate limiting
  app.get("/healthz", healthLimiter, (req, res) => {
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
    });
  });

  // Build info endpoint (cached) with rate limiting
  app.get("/build", healthLimiter, (req, res) => {
    res.json(cachedBuildInfo);
  });

  // Marketing attribution is owned by the standalone Marketing service. Core
  // deliberately does not resolve, record, or proxy marketing links so an
  // unavailable Marketing service cannot affect ordinary Core operations.
  app.get("/m/:code", (_req, res) => {
    res.status(410).json({
      error: "Marketing links are served by the standalone Marketing application.",
    });
  });

  // Health check endpoint (detailed)
  app.get("/api/health", async (req, res) => {
    const dbConnected = !!(await db.getDb());
    const stripeConfigured = !!getStripe();
    const oauthConfigured = !!(ENV.oAuthServerUrl && ENV.appId);
    const version = process.env.npm_package_version || "1.0.0";

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version,
      services: {
        database: dbConnected,
        stripe: stripeConfigured,
        oauth: oauthConfigured,
      },
    });
  });

  /**
   * GET /api/system/config-status
   * Returns which optional services are configured (boolean flags only, no secrets).
   * Protected — requires authenticated admin user.
   */
  app.get("/api/system/config-status", async (req, res) => {
    try {
      // @ts-expect-error - Express req/res is compatible with CreateExpressContextOptions
      const context = await createContext({ req, res });
      if (!context.user || context.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      // Check env vars first, then fall back to DB-stored dashboard settings
      const smtpUser =
        process.env.SMTP_USER ||
        (await getRuntimeConfig("smtp_user", "SMTP_USER"));
      const smtpPass =
        process.env.SMTP_PASS ||
        (await getRuntimeConfig("smtp_pass", "SMTP_PASS"));
      const smtpConfigured = !!(smtpUser && smtpPass);
      const stripeReady =
        ENV.enableStripe &&
        !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
      const uploadsReady = true; // Local disk storage is always available on VPS
      const aiGenX = !!(
        process.env.GENX_API_KEY ||
        (await getRuntimeConfig("genx_api_key", "GENX_API_KEY"))
      );
      res.json({
        db: true, // If we got here the server started successfully
        smtp: smtpConfigured,
        stripe: stripeReady,
        uploads: uploadsReady,
        ai: {
          genx: aiGenX,
          anyConfigured: aiGenX,
        },
        weather: true, // Open-Meteo needs no key
        adminPasswordSet: !!process.env.ADMIN_UNLOCK_PASSWORD,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/admin/status
   * Returns red/yellow/green readiness report for each service.
   * Protected — requires authenticated admin user.
   */
  app.get("/api/admin/status", async (req, res) => {
    try {
      // @ts-expect-error - Express req/res is compatible with CreateExpressContextOptions
      const context = await createContext({ req, res });
      if (!context.user || context.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      // Check env vars first, then fall back to DB-stored dashboard settings
      const smtpUser =
        process.env.SMTP_USER ||
        (await getRuntimeConfig("smtp_user", "SMTP_USER"));
      const smtpPass =
        process.env.SMTP_PASS ||
        (await getRuntimeConfig("smtp_pass", "SMTP_PASS"));
      const smtpConfigured = !!(smtpUser && smtpPass);
      const smtpSource =
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? "environment"
          : smtpConfigured
            ? "dashboard settings"
            : "not configured";
      const stripeConfigured = !!(
        process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET
      );
      const stripePublicKey = !!(
        process.env.VITE_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY
      );
      const aiGenX = !!(
        process.env.GENX_API_KEY ||
        (await getRuntimeConfig("genx_api_key", "GENX_API_KEY"))
      );
      const weatherKey = !!process.env.WEATHER_API_KEY;
      const adminPasswordSet = !!process.env.ADMIN_UNLOCK_PASSWORD;
      const jwtSet = !!process.env.JWT_SECRET;

      let dbOk = false;
      try {
        dbOk = !!(await db.getDb());
      } catch {
        /* ignore */
      }

      let realtimeOk = false;
      try {
        const { realtimeManager } = await import("./realtime");
        realtimeOk = typeof realtimeManager?.getStats === "function";
      } catch {
        /* ignore */
      }

      const toStatus = (ok: boolean, warn = false) =>
        ok ? "green" : warn ? "yellow" : "red";

      res.json({
        overall: dbOk && jwtSet && adminPasswordSet ? "green" : "red",
        services: {
          db: {
            status: toStatus(dbOk),
            ok: dbOk,
            message: dbOk
              ? "Database connected"
              : "DATABASE_URL not set or DB unreachable",
          },
          smtp: {
            status: toStatus(smtpConfigured, true),
            ok: smtpConfigured,
            message: smtpConfigured
              ? `SMTP configured (via ${smtpSource})`
              : "Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment or Admin → Settings to enable email",
          },
          stripe: {
            status: toStatus(stripeConfigured && stripePublicKey, true),
            ok: stripeConfigured && stripePublicKey,
            message:
              stripeConfigured && stripePublicKey
                ? "Stripe configured"
                : "Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, VITE_STRIPE_PUBLIC_KEY to enable billing",
          },
          ai: {
            status: toStatus(aiGenX, true),
            ok: aiGenX,
            message:
              aiGenX
                ? "GenX AI configured"
                : "Set GENX_API_KEY to enable AI features",
          },
          weather: {
            status: "green",
            ok: true, // Open-Meteo is free and requires no API key
            message: weatherKey
              ? "Weather API key configured (additional provider available)"
              : "Using Open-Meteo (free, no key required) – weather features fully functional",
          },
          storage: (() => {
            const hasProxy = !!(
              process.env.STORAGE_PROXY_URL && process.env.STORAGE_PROXY_KEY
            );
            const storageOk = true; // Local disk storage is always available on VPS
            const storageMode = hasProxy ? "proxy storage" : "local disk (VPS)";
            return {
              status: toStatus(storageOk, !hasProxy),
              ok: storageOk,
              message: `Document uploads enabled via ${storageMode} (${ENV.storagePath})`,
            };
          })(),
          realtime: {
            status: toStatus(realtimeOk),
            ok: realtimeOk,
            message: realtimeOk
              ? "Realtime (SSE) active"
              : "Realtime manager not initialised",
          },
          adminPassword: {
            status: toStatus(adminPasswordSet),
            ok: adminPasswordSet,
            message: adminPasswordSet
              ? "ADMIN_UNLOCK_PASSWORD is set"
              : "Set ADMIN_UNLOCK_PASSWORD env var to secure the admin panel",
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Simple ping endpoint (minimal response for monitoring)
  app.get("/api/health/ping", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Version endpoint with build fingerprint (rate limited like other info endpoints)
  app.get("/api/version", healthLimiter, (req, res) => {
    const path = require("path");

    // Try to read build.txt for build fingerprint
    let buildInfo: any = {
      version: cachedBuildInfo.version,
      sha: cachedBuildInfo.commit,
      buildTime: cachedBuildInfo.buildTime,
    };

    try {
      const buildTxtPath = path.resolve(process.cwd(), "dist/public/build.txt");
      if (fs.existsSync(buildTxtPath)) {
        const buildTxt = fs.readFileSync(buildTxtPath, "utf-8");
        const lines = buildTxt.split("\n");
        lines.forEach((line: string) => {
          const [key, value] = line.split("=");
          if (key && value) {
            if (key === "BUILD_SHA") buildInfo.sha = value.trim();
            if (key === "BUILD_TIME") buildInfo.buildTime = value.trim();
            if (key === "VERSION") buildInfo.version = value.trim();
          }
        });
      }
    } catch (err) {
      // If build.txt doesn't exist, use cached info
    }

    res.json(buildInfo);
  });

  // OAuth status endpoint
  app.get("/api/oauth/status", (req, res) => {
    const configured = !!(ENV.oAuthServerUrl && ENV.appId);
    res.json({
      configured,
      baseUrl: ENV.baseUrl,
      oauthServerUrl: configured ? ENV.oAuthServerUrl : null,
    });
  });

  // Favicon handler - serve favicon.svg as favicon.ico with correct headers (rate limited)
  // Production: dist/index.js lives in dist/, so import.meta.dirname = dist/
  // Vite copies client/public/* into EACH frontend build dir (management/ and school/).
  // Both contain the same favicon, so we resolve from management/ as the canonical copy.
  app.get("/favicon.ico", healthLimiter, (req, res) => {
    const faviconPath =
      process.env.NODE_ENV === "development"
        ? resolve(process.cwd(), "client/public/favicon.svg")
        : resolve(import.meta.dirname, "public/management/favicon.svg");

    if (fs.existsSync(faviconPath)) {
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day
      res.sendFile(faviconPath);
    } else {
      res.status(404).send("Favicon not found");
    }
  });

  // Apple touch icon handler — iOS and Safari request these paths at the root
  // level regardless of what is declared in <link> tags.  Without an explicit
  // handler they would fall through to the SPA catch-all and receive HTML.
  // Same path convention as favicon: resolve from management/ build in production.
  const appleTouchIconRoutes = [
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
    "/apple-touch-icon-120x120.png",
    "/apple-touch-icon-120x120-precomposed.png",
  ];
  app.get(appleTouchIconRoutes, (req, res) => {
    const iconPath =
      process.env.NODE_ENV === "development"
        ? resolve(process.cwd(), "client/public/icons/icon-192x192.png")
        : resolve(
            import.meta.dirname,
            "public/management/icons/icon-192x192.png",
          );

    if (fs.existsSync(iconPath)) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day
      res.sendFile(iconPath);
    } else {
      res.status(404).send("Not Found");
    }
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Contact form endpoint (public) – rate limited to prevent abuse
  const isValidEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) &&
    !e.includes("@@") &&
    e.length <= 320;
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 submissions per 15 minutes per IP
    message: {
      error: "Too many requests",
      message: "Too many contact form submissions, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json(options.message);
    },
  });
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const { name, email: fromEmail, subject, message, source } = req.body;

      if (!name || !fromEmail || !subject || !message) {
        return res.status(400).json({
          error: "All fields (name, email, subject, message) are required",
        });
      }

      if (typeof name !== "string" || name.length > 200) {
        return res.status(400).json({ error: "Invalid name" });
      }
      if (
        typeof fromEmail !== "string" ||
        fromEmail.length > 320 ||
        !isValidEmail(fromEmail)
      ) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      if (typeof subject !== "string" || subject.length > 500) {
        return res.status(400).json({ error: "Invalid subject" });
      }
      if (typeof message !== "string" || message.length > 10000) {
        return res.status(400).json({ error: "Message too long" });
      }

      // Source tagging — differentiate management vs school enquiries
      const contactSource = source === "school" ? "school" : "management";
      const subjectPrefix =
        contactSource === "school"
          ? "[School Enquiry] "
          : "[Management Enquiry] ";
      const taggedSubject = subjectPrefix + subject;

      await email.sendContactEmail({
        name,
        email: fromEmail,
        subject: taggedSubject,
        message,
      });

      // Persist to DB (non-blocking on failure so the response is always fast)
      const dbConn = await getDb();
      if (dbConn) {
        const ipHash = crypto
          .createHash("sha256")
          .update(String(req.ip || ""))
          .digest("hex")
          .slice(0, 64);
        dbConn
          .insert(contactSubmissions)
          .values({
            name,
            email: fromEmail,
            subject: taggedSubject,
            message,
            ipHash,
          })
          .catch((err: Error) =>
            console.warn("[Contact] DB insert failed:", err.message),
          );
      }

      res.json({
        success: true,
        message: "Your message has been sent. We'll get back to you soon!",
      });
    } catch (error) {
      console.error("[Contact] Error sending contact email:", error);
      res
        .status(500)
        .json({ error: "Failed to send message. Please try again." });
    }
  });

  // Local auth routes
  app.use("/api/auth", authRouter);

  // Billing routes (Stripe)
  app.use("/api/billing", billingRouter);

  // Sales Chat & Lead Capture (public, rate-limited)
  app.use("/api", salesChatRouter);

  // Internal site analytics — page view tracking middleware
  const { analyticsMiddleware, trackCtaClick } =
    await import("./analyticsTracker");
  app.use(analyticsMiddleware());
  app.post("/api/analytics/cta", express.json(), trackCtaClick);

  // Test email endpoint (admin only) - tightly rate-limited to prevent email abuse
  const adminEmailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 test emails per hour
    message: {
      error: "Too many requests",
      message: "Too many test email requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      res.status(options.statusCode).json(options.message);
    },
  });
  app.post(
    "/api/admin/send-test-email",
    adminEmailLimiter,
    async (req, res) => {
      try {
        // Require authenticated admin
        // @ts-expect-error - Express req/res is compatible with CreateExpressContextOptions
        const context = await createContext({ req, res });
        if (!context.user || context.user.role !== "admin") {
          return res.status(403).json({ error: "Admin access required" });
        }

        const { to } = req.body;
        if (!to) {
          return res.status(400).json({ error: "Email address required" });
        }

        const success = await email.sendTestEmail(to);
        res.json({
          success,
          message: success
            ? "Test email sent"
            : "Failed to send email (check SMTP config)",
        });
      } catch (error) {
        console.error("[Admin] Test email error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );

  // Real-time SSE endpoint
  const { realtimeManager } = await import("./realtime");
  app.get("/api/realtime/events", async (req, res) => {
    try {
      // Get user from session (reuse tRPC context logic)
      // @ts-expect-error - Express req/res is compatible with CreateExpressContextOptions
      const context = await createContext({ req, res });

      if (!context.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Register SSE client
      const clientId = realtimeManager.addClient(context.user.id, res);

      // Subscribe to user-specific channel
      realtimeManager.subscribe(clientId, [`user:${context.user.id}`]);

      console.log(
        `[SSE] User ${context.user.id} connected with client ${clientId}`,
      );
    } catch (error) {
      console.error("[SSE] Connection error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // SSE stats endpoint (admin only)
  app.get("/api/realtime/stats", async (req, res) => {
    try {
      // @ts-expect-error - Express req/res is compatible with CreateExpressContextOptions
      const context = await createContext({ req, res });
      if (!context.user || context.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const stats = realtimeManager.getStats();
      res.json(stats);
    } catch (error) {
      console.error("[SSE] Stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // SSE health endpoint (public, for monitoring)
  app.get("/api/realtime/health", (req, res) => {
    try {
      const stats = realtimeManager.getStats();
      res.json({
        status: "healthy",
        connectedClients: stats.connectedClients || 0,
        activeChannels: stats.channels ? Object.keys(stats.channels).length : 0,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[SSE] Health check error:", error);
      res.status(500).json({
        status: "unhealthy",
        error: "Failed to get realtime stats",
      });
    }
  });

  // WhatsApp / Twilio delivery status webhook
  // Twilio POSTs delivery status callbacks here (configure in Twilio Console → Messaging → Senders).
  // Also handles inbound opt-out STOP messages so users can self-unsubscribe.
  app.post(
    "/api/webhooks/whatsapp",
    express.urlencoded({ extended: false }),
    async (req, res) => {
      try {
        const body = req.body as Record<string, string>;

        // Delivery status update (MessageStatus field from Twilio)
        if (body.MessageStatus) {
          console.log(
            `[WhatsApp] Delivery status: ${body.MessageSid} → ${body.MessageStatus}`,
          );
        }

        // Inbound message (Body field from Twilio)
        if (body.Body && body.From) {
          const text = body.Body.trim().toUpperCase();
          const from = body.From; // e.g. whatsapp:+447123456789

          console.log(`[WhatsApp] Inbound message from ${from}: ${text}`);

          if (
            text === "STOP" ||
            text === "UNSUBSCRIBE" ||
            text === "OPT OUT" ||
            text === "OPTOUT"
          ) {
            console.log(`[WhatsApp] Opt-out request from ${from}`);
            try {
              const { getDb } = await import("../db");
              const db = await getDb();
              if (db) {
                // Normalise to E.164 format: strip whatsapp: prefix if present
                const phone = from.replace(/^whatsapp:/, "");
                const normalised = phone.startsWith("+") ? phone : `+${phone}`;
                const matchedUsers = await db
                  .select({ id: users.id, preferences: users.preferences })
                  .from(users)
                  .where(
                    sql`JSON_UNQUOTE(JSON_EXTRACT(${users.preferences}, '$.whatsappPhone')) = ${normalised}`,
                  );
                for (const user of matchedUsers) {
                  const prefs = user.preferences
                    ? JSON.parse(user.preferences)
                    : {};
                  prefs.whatsappReminders = false;
                  await db
                    .update(users)
                    .set({ preferences: JSON.stringify(prefs) })
                    .where(eq(users.id, user.id));
                  console.log(`[WhatsApp] Opted out user ${user.id}`);
                }
              }
            } catch (err) {
              console.error("[WhatsApp] Error processing opt-out:", err);
            }
          }
        }

        // Twilio expects an empty 200 TwiML response (or plain 200)
        res
          .status(200)
          .send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
      } catch (error) {
        console.error("[WhatsApp] Webhook error:", error);
        res
          .status(200)
          .send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
      }
    },
  );

  // Import trial lock middleware
  const { trialLockMiddleware } = await import("./trialLock");

  // Apply trial lock middleware to ALL API routes (except exempt paths)
  // This enforces hard 7-day trial lock server-side
  app.use("/api", trialLockMiddleware);
  app.use("/trpc", trialLockMiddleware);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // REST API v1 (for third-party integrations)
  app.use("/api/v1", apiRouter);

  // ── Local file serving ────────────────────────────────────────────────────
  // Serves files uploaded to local disk storage (when proxy storage is not configured).
  // Authentication is NOT required here because the file URLs are unguessable
  // (nanoid-prefixed keys).  Path traversal is prevented by resolve() check.
  app.get(/^\/api\/files\/(.+)$/, async (req, res) => {
    const match = req.path.match(/^\/api\/files\/(.+)$/);
    const rawFileKey = match?.[1];
    if (!rawFileKey) {
      return res.status(400).json({ error: "Missing file key" });
    }

    const decoded = decodeUploadFileKey(rawFileKey);
    if (!decoded.ok) {
      return res.status(400).json({ error: "Invalid file key encoding" });
    }
    const fileKey = decoded.key;

    const rootCheck = safeResolveInside(ENV.storagePath, fileKey);
    if (!rootCheck.ok) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const found = findServableUploadFile(fileKey);
    if (!found) {
      console.warn(
        `[FileServe] 404 - file not found on disk: ${fileKey} (raw: ${rawFileKey})`,
      );
      return res.status(404).json({ error: "File not found" });
    }

    // When ?download=1 is present, force the browser to download the file
    // rather than displaying it inline.  The HTML <a download> attribute is
    // sufficient for same-origin images and PDFs on most browsers, but for
    // Word/Excel files the attribute is ignored and the browser relies on the
    // Content-Disposition header.
    const forceDownload = req.query.download === "1";
    if (forceDownload) {
      const rawName = path.basename(fileKey).replace(/^[^-]+-/, ""); // strip nanoid prefix
      // Fallback to the full basename if stripping leaves an empty string
      const originalName = rawName || path.basename(fileKey);
      // Use RFC 5987 percent-encoding for the filename* parameter so that
      // any Unicode or special characters (including quotes and backslashes)
      // are transmitted safely without header-injection risk.
      const encoded = encodeURIComponent(originalName);
      // Also provide a plain ASCII fallback for older clients by replacing
      // non-ASCII chars — this must NOT use backslash-quoting which is
      // incomplete for backslash characters themselves.
      const asciiFallback = originalName.replace(/[^\w\s.\-]/g, "_");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`,
      );
    }

    res.sendFile(found.filePath);
  });
  // Any request that starts with /api/ and has NOT been handled by a route
  // above must return JSON, never the SPA index.html.
  // This prevents the "login returns HTML 200" bug where an unmatched API path
  // falls through to the SPA catch-all.
  //
  // Uses a RegExp instead of a string wildcard to avoid path-to-regexp 8.x
  // errors.  Express 5 + router 2 pass string patterns through path-to-regexp
  // 8.x, which requires every wildcard to carry an explicit parameter name
  // (e.g. "/api/*path").  Bare "/api/*" and "/api/:path(.*)" both throw:
  //   PathError: Missing parameter name at index N
  // A RegExp literal bypasses path-to-regexp entirely and is safe across all
  // Express/router versions.
  app.all(/^\/api\/.*/, (req, res) => {
    res.status(404).json({
      error: "Not found",
      path: req.originalUrl,
    });
  });

  // Global JSON error handler for Express errors thrown inside API handlers.
  // Must be registered AFTER all routes and BEFORE static serving.
  // The 4-argument signature is required by Express to recognise this as an
  // error handler (not a regular middleware).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: any, res: any, next: any) => {
    // Only override if the response hasn't started and the request is an API call
    if (!res.headersSent && req.originalUrl.startsWith("/api/")) {
      const status: number = err.status || err.statusCode || 500;
      console.error("[API Error]", req.method, req.originalUrl, err.message);
      // Return a JSON error body for payload-too-large so tRPC clients receive
      // structured JSON instead of nginx/Express default HTML pages.
      if (status === 413 || err.type === "entity.too.large") {
        return res.status(413).json({
          error: "File too large. Maximum upload size is 10MB.",
        });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
    next(err);
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Deterministic port binding - fail if port is in use (no auto-switching)
  // Bind to 0.0.0.0 by default so the server is reachable from all interfaces
  // (required when running behind Nginx on the same host).  Override via HOST
  // env var (e.g. HOST=127.0.0.1 to restrict to loopback only).
  const host = process.env.HOST || "0.0.0.0";
  const port = parseInt(process.env.PORT || "3000");

  console.log(`Starting server on ${host}:${port}...`);

  // Validate pricing configuration at startup
  validatePricingConfig();

  // Ensure local uploads directory exists and is writable.
  // Without this, file uploads silently fail on a fresh VPS deploy.
  const uploadsDir = path.resolve(ENV.storagePath);
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    console.log(`✓ Uploads directory ready: ${uploadsDir}`);
  } catch (err) {
    console.error(`❌ Uploads directory not writable: ${uploadsDir}`, err);
  }

  getRuntimeFileStorageReadiness()
    .then((readiness) =>
      console.log("[RuntimeStorage]", JSON.stringify(readiness)),
    )
    .catch((err) =>
      console.error("[RuntimeStorage] readiness check failed", err),
    );

  // Pre-warm the database connection so that ensureTables() runs before the
  // first user request arrives.  Without this, the first API call (e.g.
  // calendar.getEvents) would block for the full ensureTables duration and
  // could exceed the 30 s Nginx proxy timeout.
  getDb().catch((err) => console.error("[Startup] DB pre-warm error:", err));

  // Verify SMTP configuration — non-blocking, logs result to console
  email
    .verifySmtpConfig()
    .catch((err) => console.error("[Startup] SMTP verification error:", err));

  server.listen(port, host, () => {
    console.log(`✓ Server running on http://${host}:${port}/`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`✓ Health check: http://${host}:${port}/api/health`);

    // Expose server handle for graceful shutdown handler below
    _activeServer = server;

    // Start reminder scheduler
    import("./reminderScheduler")
      .then((module) => {
        module.startReminderScheduler();
      })
      .catch((err) => {
        console.error("[Server] Failed to start reminder scheduler:", err);
      });

    // Start media resolver loop — polls pending GenX jobs every 30s
    import("../_core/ai/mediaResolver")
      .then((module) => {
        module.startMediaResolverLoop();
      })
      .catch((err) => {
        console.error("[Server] Failed to start media resolver loop:", err);
      });
  });

  // Handle port binding errors
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n❌ ERROR: Port ${port} is already in use!`);
      console.error(`\nTo fix this issue:`);
      console.error(`  1. Find process using port: lsof -i :${port}`);
      console.error(`  2. Kill the process: kill -9 <PID>`);
      console.error(`  3. Or use a different port: PORT=${port + 1} npm start`);
      console.error(`\nIf running via systemd:`);
      console.error(`  sudo systemctl stop equiprofile`);
      console.error(`  sudo systemctl start equiprofile\n`);
      process.exit(1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
}

startServer().catch(console.error);

// ── Graceful shutdown (systemd SIGTERM + Ctrl-C SIGINT) ─────────────────────
// Keep the process in the foreground; do NOT call process.exit() immediately so
// that in-flight requests can drain.  The HTTP server's close() callback calls
// process.exit(0) once all connections are finished.
function shutdown(signal: string) {
  console.log(`\n[Server] Received ${signal} — shutting down gracefully…`);
  if (_activeServer) {
    _activeServer.close(() => {
      console.log("[Server] All connections closed. Exiting.");
      process.exit(0);
    });
    // Force-exit after 10 s if connections don't drain in time
    setTimeout(() => {
      console.error("[Server] Forced exit after 10 s shutdown timeout.");
      process.exit(1);
    }, 10_000).unref();
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
