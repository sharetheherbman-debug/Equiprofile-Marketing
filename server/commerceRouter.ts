import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  adminUnlockedProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc";
import { getDb } from "./db";
import { resolveMarketingConsent } from "./_core/marketingConsent";
import { publishMarketingEvent } from "./_core/marketingPublisher";
import { getStoreStripe } from "./stripe";
import {
  calculateCartTotals,
  canTransitionOrder,
  isSellableInventory,
  type CartPriceLine,
} from "./commerce/domain";
import {
  assessReturnPolicy,
  configuredReturnWindowDays,
  hasDuplicateReturnItems,
  remainingReturnableQuantity,
  type ReturnEligibility,
} from "./commerce/returnPolicy";
import {
  enrichCandidateCopy,
  isDuplicateCandidate,
  normaliseSupplierCandidate,
  priceCandidate,
  scoreCandidate,
} from "./commerce/productManager";

type Rows<T> = [T[], unknown];
const asRows = <T>(result: unknown) => (result as Rows<T>)[0];

async function activeCartId(userId: number) {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
  await db.execute(
    sql`INSERT INTO commerceCarts (userId, currency, status) VALUES (${userId}, 'GBP', 'active') ON DUPLICATE KEY UPDATE updatedAt = CURRENT_TIMESTAMP`,
  );
  const rows = asRows<{ id: number }>(
    await db.execute(
      sql`SELECT id FROM commerceCarts WHERE userId = ${userId} AND status = 'active' LIMIT 1`,
    ),
  );
  if (!rows[0])
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not create a cart",
    });
  return rows[0].id;
}

async function audit(
  actorType: "system" | "user" | "ai",
  actorUserId: number | null,
  entityType: string,
  entityId: string,
  action: string,
  details: unknown,
) {
  const db = await getDb();
  if (!db) return;
  await db.execute(
    sql`INSERT INTO commerceAuditLog (actorType, actorUserId, entityType, entityId, action, detailsJson) VALUES (${actorType}, ${actorUserId}, ${entityType}, ${entityId}, ${action}, ${JSON.stringify(details)})`,
  );
}

export const commerceRouter = router({
  catalogue: publicProcedure
    .input(
      z
        .object({
          query: z.string().max(100).optional(),
          category: z.string().max(150).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const term = `%${input?.query?.trim() ?? ""}%`;
      return asRows(
        await db.execute(sql`
        SELECT DISTINCT p.id, p.slug, p.title, p.description, p.brand, p.retailPricePence, p.salePricePence, p.availabilityStatus
        FROM commerceProducts p
        LEFT JOIN commerceProductCategories pc ON pc.productId = p.id
        LEFT JOIN commerceCategories c ON c.id = pc.categoryId
        WHERE p.status = 'published' AND p.developmentOnly = FALSE AND p.isArchived = FALSE AND p.imageRightsStatus = 'licensed'
          AND (p.title LIKE ${term} OR p.brand LIKE ${term})
          AND (${input?.category ?? ""} = '' OR c.slug = ${input?.category ?? ""})
        ORDER BY p.createdAt DESC
        LIMIT 48
      `),
      );
    }),

  categories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
    return asRows(
      await db.execute(
        sql`SELECT slug, name, description, parentId FROM commerceCategories WHERE isActive = TRUE ORDER BY sortOrder, name`,
      ),
    );
  }),

  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const cartId = await activeCartId(ctx.user.id);
      return asRows(
        await db.execute(sql`
        SELECT ci.id, ci.quantity, pv.id AS variantId, pv.sku, pv.title AS variantTitle, p.title AS productTitle,
          COALESCE(pv.salePricePence, p.salePricePence, pv.retailPricePence, p.retailPricePence) AS unitPricePence,
          p.availabilityStatus, si.freshUntil
        FROM commerceCartItems ci
        JOIN commerceProductVariants pv ON pv.id = ci.variantId
        JOIN commerceProducts p ON p.id = pv.productId
        LEFT JOIN commerceSupplierProducts sp ON sp.variantId = pv.id
        LEFT JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
        WHERE ci.cartId = ${cartId}
        ORDER BY ci.createdAt DESC
      `),
      );
    }),
    add: protectedProcedure
      .input(
        z.object({
          variantId: z.number().int().positive(),
          quantity: z.number().int().min(1).max(20),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const eligible = asRows<{
          id: number;
          isActive: number;
          status: string;
          developmentOnly: number;
          isArchived: number;
          imageRightsStatus: string;
          availabilityStatus:
            | "in_stock"
            | "low_stock"
            | "on_order"
            | "stale"
            | "unavailable";
          freshUntil: Date | null;
        }>(
          await db.execute(sql`
        SELECT pv.id, pv.isActive, p.status, p.developmentOnly, p.isArchived, p.imageRightsStatus,
          COALESCE(si.availabilityStatus, 'unavailable') AS availabilityStatus, si.freshUntil
        FROM commerceProductVariants pv
        JOIN commerceProducts p ON p.id = pv.productId
        LEFT JOIN commerceSupplierProducts sp ON sp.variantId = pv.id
        LEFT JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
        WHERE pv.id = ${input.variantId} LIMIT 1
      `),
        )[0];
        if (
          !eligible ||
          !eligible.isActive ||
          eligible.status !== "published" ||
          eligible.developmentOnly ||
          eligible.isArchived ||
          eligible.imageRightsStatus !== "licensed" ||
          !isSellableInventory({
            availabilityStatus: eligible.availabilityStatus,
            freshUntil: eligible.freshUntil
              ? new Date(eligible.freshUntil)
              : null,
          })
        ) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message:
              "This product variant is unavailable or has stale supplier stock.",
          });
        }
        const cartId = await activeCartId(ctx.user.id);
        await db.execute(
          sql`INSERT INTO commerceCartItems (cartId, variantId, quantity) VALUES (${cartId}, ${input.variantId}, ${input.quantity}) ON DUPLICATE KEY UPDATE quantity = LEAST(quantity + VALUES(quantity), 20), updatedAt = CURRENT_TIMESTAMP`,
        );
        await audit("user", ctx.user.id, "cart", String(cartId), "item_added", {
          variantId: input.variantId,
          quantity: input.quantity,
        });
        return { success: true };
      }),
    setQuantity: protectedProcedure
      .input(
        z.object({
          itemId: z.number().int().positive(),
          quantity: z.number().int().min(0).max(20),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const cartId = await activeCartId(ctx.user.id);
        if (input.quantity === 0)
          await db.execute(
            sql`DELETE FROM commerceCartItems WHERE id = ${input.itemId} AND cartId = ${cartId}`,
          );
        else
          await db.execute(
            sql`UPDATE commerceCartItems SET quantity = ${input.quantity}, updatedAt = CURRENT_TIMESTAMP WHERE id = ${input.itemId} AND cartId = ${cartId}`,
          );
        return { success: true };
      }),
  }),

  checkout: protectedProcedure
    .input(z.object({ idempotencyKey: z.string().min(12).max(160) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const existing = asRows<{
        id: number;
        orderNumber: string;
        status: string;
      }>(
        await db.execute(
          sql`SELECT id, orderNumber, status FROM commerceOrders WHERE userId = ${ctx.user.id} AND idempotencyKey = ${input.idempotencyKey} LIMIT 1`,
        ),
      );
      if (existing[0])
        return {
          order: existing[0],
          idempotent: true,
          paymentConfigurationRequired: true,
        };
      const cartId = await activeCartId(ctx.user.id);
      const rows = asRows<any>(
        await db.execute(sql`
      SELECT ci.quantity, pv.id AS variantId, pv.sku, pv.title AS variantTitle, p.title AS productTitle, p.vatRateBasisPoints,
        COALESCE(pv.retailPricePence, p.retailPricePence) AS retailPricePence,
        COALESCE(pv.salePricePence, p.salePricePence) AS salePricePence,
        p.returnEligibility,
        COALESCE(si.availabilityStatus, 'unavailable') AS availabilityStatus, si.freshUntil, sp.supplierId
      FROM commerceCartItems ci JOIN commerceProductVariants pv ON pv.id = ci.variantId JOIN commerceProducts p ON p.id = pv.productId
      LEFT JOIN commerceSupplierProducts sp ON sp.variantId = pv.id LEFT JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
      WHERE ci.cartId = ${cartId} AND p.status = 'published' AND p.developmentOnly = FALSE AND p.isArchived = FALSE AND p.imageRightsStatus = 'licensed' AND pv.isActive = TRUE
    `),
      );
      if (rows.length === 0)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Your cart has no checkout-eligible items.",
        });
      let totals;
      try {
        totals = calculateCartTotals(
          rows.map(
            (row: any): CartPriceLine => ({
              ...row,
              freshUntil: row.freshUntil ? new Date(row.freshUntil) : null,
            }),
          ),
          0,
        );
      } catch (error) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            error instanceof Error ? error.message : "Cart validation failed",
        });
      }
      const returnWindowDays = configuredReturnWindowDays(
        process.env.COMMERCE_RETURN_WINDOW_DAYS,
      );
      const orderNumber = `EPS-${new Date().getFullYear()}-${nanoid(10).toUpperCase()}`;
      await db.execute(
        sql`INSERT INTO commerceOrders (orderNumber, userId, status, currency, subtotalPence, shippingPence, vatPence, totalPence, idempotencyKey) VALUES (${orderNumber}, ${ctx.user.id}, 'checkout_pending', 'GBP', ${totals.subtotalPence}, ${totals.shippingPence}, ${totals.vatPence}, ${totals.totalPence}, ${input.idempotencyKey})`,
      );
      const order = asRows<{ id: number }>(
        await db.execute(
          sql`SELECT id FROM commerceOrders WHERE idempotencyKey = ${input.idempotencyKey} LIMIT 1`,
        ),
      )[0];
      for (const row of rows)
        await db.execute(
          sql`INSERT INTO commerceOrderItems (orderId, variantId, titleSnapshot, skuSnapshot, quantity, unitPricePence, vatPence, supplierId, returnEligibility, returnWindowDays) VALUES (${order.id}, ${row.variantId}, ${`${row.productTitle} — ${row.variantTitle}`}, ${row.sku}, ${row.quantity}, ${row.salePricePence ?? row.retailPricePence}, ${Math.round(((row.salePricePence ?? row.retailPricePence) * row.quantity * row.vatRateBasisPoints) / 10000)}, ${row.supplierId ?? null}, ${row.returnEligibility ?? "review_required"}, ${row.returnEligibility === "standard" ? returnWindowDays : 0})`,
        );
      await audit(
        "user",
        ctx.user.id,
        "order",
        String(order.id),
        "checkout_prepared",
        totals,
      );
      const storeStripeEnabled = process.env.ENABLE_STORE_STRIPE === "true";
      const stripe = storeStripeEnabled ? getStoreStripe() : null;
      if (!stripe) {
        return {
          orderNumber,
          totals,
          idempotent: false,
          paymentConfigurationRequired: true,
          checkoutUrl: null,
        };
      }
      const publicBaseUrl = (
        process.env.STORE_PUBLIC_URL ?? "https://shop.equiprofile.online"
      ).replace(/\/$/, "");
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: String(order.id),
        metadata: {
          commerceScope: "store",
          orderId: String(order.id),
          orderNumber,
        },
        success_url: `${publicBaseUrl}/?store_checkout=success&order=${encodeURIComponent(orderNumber)}`,
        cancel_url: `${publicBaseUrl}/?store_checkout=cancelled&order=${encodeURIComponent(orderNumber)}`,
        line_items: rows.map((row: any) => ({
          quantity: row.quantity,
          price_data: {
            currency: "gbp",
            unit_amount: row.salePricePence ?? row.retailPricePence,
            product_data: { name: `${row.productTitle} — ${row.variantTitle}` },
          },
        })),
      });
      await db.execute(
        sql`UPDATE commerceOrders SET status = 'payment_pending', storePaymentStatus = 'pending', storePaymentReference = ${session.payment_intent ? String(session.payment_intent) : null} WHERE id = ${order.id}`,
      );
      await audit(
        "system",
        null,
        "order",
        String(order.id),
        "store_checkout_session_created",
        { stripeSessionId: session.id },
      );

      // The checkout is already durable above. Marketing delivery is explicitly
      // opt-in and detached so it cannot alter checkout or Stripe behavior.
      const consentState = resolveMarketingConsent(
        (ctx.user as { preferences?: unknown }).preferences,
      );
      if (consentState === "marketing_opt_in") {
        void publishMarketingEvent({
          sourceApp: "equiprofile.online",
          productLine: "shop",
          eventType: "shop_checkout_started",
          entityType: "checkout",
          entityId: orderNumber,
          publicUrl: publicBaseUrl,
          timestamp: new Date().toISOString(),
          consentState,
          idempotencyKey: `shop-checkout-started:${orderNumber}`,
          payloadVersion: "1.0",
          payload: {
            currency: "GBP",
            itemCount: rows.reduce(
              (count: number, row: any) => count + row.quantity,
              0,
            ),
            subtotalPence: totals.subtotalPence,
          },
        }).catch(() => undefined);
      }
      return {
        orderNumber,
        totals,
        idempotent: false,
        paymentConfigurationRequired: false,
        checkoutUrl: session.url,
      };
    }),

  product: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(180) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const product = asRows<any>(
        await db.execute(
          sql`SELECT id, slug, title, description, brand, retailPricePence, salePricePence, availabilityStatus FROM commerceProducts WHERE slug = ${input.slug} AND status = 'published' AND developmentOnly = FALSE AND isArchived = FALSE AND imageRightsStatus = 'licensed' LIMIT 1`,
        ),
      )[0];
      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      const [variants, images, attributes] = await Promise.all([
        asRows(
          await db.execute(
            sql`SELECT id, sku, title, attributesJson, retailPricePence, salePricePence FROM commerceProductVariants WHERE productId = ${product.id} AND isActive = TRUE ORDER BY id`,
          ),
        ),
        asRows(
          await db.execute(
            sql`SELECT storageUrl, altText, sortOrder FROM commerceProductImages WHERE productId = ${product.id} AND rightsStatus = 'licensed' ORDER BY sortOrder`,
          ),
        ),
        asRows(
          await db.execute(
            sql`SELECT attributeName, attributeValue FROM commerceProductAttributes WHERE productId = ${product.id} AND sourceType != 'generated' ORDER BY attributeName`,
          ),
        ),
      ]);
      return { ...product, variants, images, attributes };
    }),

  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      return asRows(
        await db.execute(
          sql`SELECT id, fullName, line1, line2, city, postcode, countryCode, phone FROM commerceAddresses WHERE userId = ${ctx.user.id} ORDER BY updatedAt DESC`,
        ),
      );
    }),
    save: protectedProcedure
      .input(
        z.object({
          fullName: z.string().min(2).max(200),
          line1: z.string().min(2).max(250),
          line2: z.string().max(250).optional(),
          city: z.string().min(2).max(120),
          postcode: z.string().min(2).max(32),
          countryCode: z.string().length(2),
          phone: z.string().max(64).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        await db.execute(
          sql`INSERT INTO commerceAddresses (userId, fullName, line1, line2, city, postcode, countryCode, phone) VALUES (${ctx.user.id}, ${input.fullName}, ${input.line1}, ${input.line2 ?? null}, ${input.city}, ${input.postcode}, ${input.countryCode.toUpperCase()}, ${input.phone ?? null})`,
        );
        await audit(
          "user",
          ctx.user.id,
          "address",
          String(ctx.user.id),
          "saved",
          { countryCode: input.countryCode.toUpperCase() },
        );
        return { success: true };
      }),
  }),

  orders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
    return asRows(
      await db.execute(
        sql`SELECT id, orderNumber, status, storePaymentStatus, totalPence, currency, createdAt FROM commerceOrders WHERE userId = ${ctx.user.id} ORDER BY createdAt DESC`,
      ),
    );
  }),

  orderDetail: protectedProcedure
    .input(z.object({ orderId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const order = asRows<any>(
        await db.execute(
          sql`SELECT id, orderNumber, status, storePaymentStatus, subtotalPence, shippingPence, vatPence, totalPence, currency, createdAt FROM commerceOrders WHERE id = ${input.orderId} AND userId = ${ctx.user.id} LIMIT 1`,
        ),
      )[0];
      if (!order)
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      const [items, shipments, returns, refunds, trackingEvents] =
        await Promise.all([
          asRows(
            await db.execute(
              sql`SELECT id, titleSnapshot, skuSnapshot, quantity, unitPricePence, vatPence, fulfilmentStatus, returnEligibility, returnWindowDays, returnWindowEndsAt FROM commerceOrderItems WHERE orderId = ${order.id}`,
            ),
          ),
          asRows(
            await db.execute(
              sql`SELECT id, status, carrier, trackingReference, estimatedDeliveryAt, dispatchedAt, deliveredAt FROM commerceShipments WHERE orderId = ${order.id}`,
            ),
          ),
          asRows(
            await db.execute(
              sql`SELECT id, status, reason, requestedAt, decidedAt, receivedAt FROM commerceReturns WHERE orderId = ${order.id} AND userId = ${ctx.user.id}`,
            ),
          ),
          asRows(
            await db.execute(
              sql`SELECT cr.id, cr.returnId, cr.amountPence, cr.status, cr.stripeRefundId, cr.createdAt
              FROM commerceRefunds cr
              JOIN commerceReturns r ON r.id = cr.returnId
              WHERE cr.orderId = ${order.id} AND r.userId = ${ctx.user.id}
              ORDER BY cr.createdAt DESC`,
            ),
          ),
          asRows(
            await db.execute(
              sql`SELECT te.id, te.shipmentId, te.eventCode, te.eventDescription, te.eventAt, te.source
              FROM commerceTrackingEvents te
              JOIN commerceShipments s ON s.id = te.shipmentId
              WHERE s.orderId = ${order.id}
              ORDER BY te.eventAt DESC`,
            ),
          ),
        ]);
      return { ...order, items, shipments, returns, refunds, trackingEvents };
    }),

  requestReturn: protectedProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        reason: z.string().min(5).max(2000),
        items: z
          .array(
            z.object({
              orderItemId: z.number().int().positive(),
              quantity: z.number().int().min(1).max(20),
            }),
          )
          .min(1)
          .max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      if (hasDuplicateReturnItems(input.items)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Each order item may appear only once in a return request.",
        });
      }

      const requestedReturn = await db.transaction(async (tx) => {
        const order = asRows<{ id: number; status: string }>(
          await tx.execute(
            sql`SELECT id, status FROM commerceOrders WHERE id = ${input.orderId} AND userId = ${ctx.user.id} LIMIT 1 FOR UPDATE`,
          ),
        )[0];
        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found.",
          });
        }
        const orderState = order.status as Parameters<
          typeof canTransitionOrder
        >[0];
        if (!canTransitionOrder(orderState, "return_requested")) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "This order is not in a return-eligible lifecycle state.",
          });
        }

        const orderItems = asRows<{
          id: number;
          quantity: number;
          returnEligibility: ReturnEligibility;
          returnWindowDays: number;
        }>(
          await tx.execute(
            sql`SELECT oi.id, oi.quantity, oi.returnEligibility, oi.returnWindowDays
              FROM commerceOrderItems oi
              WHERE oi.orderId = ${input.orderId}
              FOR UPDATE`,
          ),
        );
        const itemsById = new Map(orderItems.map((item) => [item.id, item]));

        for (const requestedItem of input.items) {
          const item = itemsById.get(requestedItem.orderItemId);
          if (!item) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "A return item does not belong to this order.",
            });
          }
          const deliveryRows = asRows<{ deliveredAt: Date | null }>(
            await tx.execute(
              sql`SELECT MAX(s.deliveredAt) AS deliveredAt
                FROM commerceShipmentItems si
                JOIN commerceShipments s ON s.id = si.shipmentId AND s.status = 'delivered'
                WHERE si.orderItemId = ${item.id}`,
            ),
          );
          const deliveredAt = deliveryRows[0]?.deliveredAt
            ? new Date(deliveryRows[0].deliveredAt)
            : null;
          const policy = assessReturnPolicy({
            orderStatus: orderState,
            deliveredAt,
            eligibility: item.returnEligibility,
            windowDays: item.returnWindowDays,
          });
          if (!policy.eligible) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: policy.reason,
            });
          }
          const priorRows = asRows<{ requestedQuantity: number }>(
            await tx.execute(
              sql`SELECT COALESCE(SUM(ri.quantity), 0) AS requestedQuantity
                FROM commerceReturnItems ri
                JOIN commerceReturns r ON r.id = ri.returnId
                WHERE ri.orderItemId = ${item.id}
                  AND r.orderId = ${input.orderId}
                  AND r.status IN ('requested', 'approved', 'received', 'refunded')
                FOR UPDATE`,
            ),
          );
          const remaining = remainingReturnableQuantity(
            item.quantity,
            Number(priorRows[0]?.requestedQuantity ?? 0),
          );
          if (requestedItem.quantity > remaining) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message:
                "Requested return quantity exceeds the remaining returnable quantity for an order item.",
            });
          }
          await tx.execute(
            sql`UPDATE commerceOrderItems SET returnWindowEndsAt = ${policy.windowEndsAt} WHERE id = ${item.id}`,
          );
        }

        await tx.execute(
          sql`INSERT INTO commerceReturns (orderId, userId, reason) VALUES (${input.orderId}, ${ctx.user.id}, ${input.reason})`,
        );
        const returnRow = asRows<{ id: number }>(
          await tx.execute(sql`SELECT LAST_INSERT_ID() AS id`),
        )[0];
        for (const item of input.items) {
          await tx.execute(
            sql`INSERT INTO commerceReturnItems (returnId, orderItemId, quantity) VALUES (${returnRow.id}, ${item.orderItemId}, ${item.quantity})`,
          );
        }
        await tx.execute(
          sql`UPDATE commerceOrders SET status = 'return_requested' WHERE id = ${input.orderId} AND status = ${orderState}`,
        );
        return { id: returnRow.id, status: "requested" as const };
      });

      await audit(
        "user",
        ctx.user.id,
        "return",
        String(requestedReturn.id),
        "requested",
        {
          orderId: input.orderId,
          itemCount: input.items.length,
          quantity: input.items.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        },
      );
      return requestedReturn;
    }),

  admin: router({
    dashboard: adminUnlockedProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const metrics = asRows<any>(
        await db.execute(
          sql`SELECT
            COUNT(*) AS orderCount,
            COALESCE(SUM(CASE WHEN status IN ('paid','acknowledged','processing','partially_fulfilled','fulfilled','dispatched','delivered','return_requested','returned','partially_refunded','refunded') THEN totalPence ELSE 0 END), 0) AS realisedRevenuePence,
            COALESCE(AVG(CASE WHEN status IN ('paid','acknowledged','processing','partially_fulfilled','fulfilled','dispatched','delivered','return_requested','returned','partially_refunded','refunded') THEN totalPence END), 0) AS averageOrderValuePence,
            COALESCE(SUM(CASE WHEN status IN ('checkout_pending','payment_pending') THEN 1 ELSE 0 END), 0) AS pendingOrderCount,
            COALESCE(SUM(CASE WHEN storePaymentStatus IN ('pending','not_configured') THEN 1 ELSE 0 END), 0) AS pendingPaymentCount,
            (SELECT COUNT(*) FROM commerceShipments WHERE status IN ('delivery_failed','cancelled')) AS fulfilmentProblemCount,
            (SELECT COUNT(*) FROM commerceSupplierSyncRuns WHERE status = 'failed') AS supplierSyncProblemCount,
            (SELECT COUNT(*) FROM commerceSupplierInventory WHERE availabilityStatus IN ('stale','unavailable') OR freshUntil IS NULL OR freshUntil < CURRENT_TIMESTAMP) AS stockIssueCount,
            (SELECT COUNT(*) FROM commerceProducts p JOIN commerceSupplierProducts sp ON sp.productId = p.id WHERE COALESCE(p.salePricePence, p.retailPricePence) <= sp.supplierCostPence) AS marginWarningCount,
            (SELECT COUNT(*) FROM commerceReturns WHERE status IN ('requested','approved','received')) AS returnQueueCount
            FROM commerceOrders`,
        ),
      )[0];
      return {
        ...metrics,
        supplierMode: "NOT_CONFIGURED",
        note: "All values derive from persisted Commerce records; no supplier is active.",
      };
    }),
    products: adminUnlockedProcedure
      .input(z.object({ status: z.string().max(40).optional() }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        return asRows(
          await db.execute(sql`
            SELECT p.id, p.slug, p.title, p.description, p.brand, p.status, p.developmentOnly, p.isArchived, p.availabilityStatus, p.retailPricePence, p.salePricePence, p.imageRightsStatus, p.returnEligibility, p.createdAt,
              pa.status AS approvalStatus, pa.reason AS approvalReason
            FROM commerceProducts p
            LEFT JOIN commerceProductApprovals pa ON pa.productId = p.id AND pa.id = (SELECT MAX(id) FROM commerceProductApprovals WHERE productId = p.id)
            WHERE (${input?.status ?? ""} = '' OR p.status = ${input?.status ?? ""})
            ORDER BY p.createdAt DESC LIMIT 200
          `),
        );
      }),
    suppliers: adminUnlockedProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      return asRows(
        await db.execute(sql`
          SELECT s.id, s.slug, s.name, s.status, s.onboardingStatus, s.fulfilmentModel, s.imageRightsStatus,
            MAX(sr.completedAt) AS lastSyncAt,
            SUM(CASE WHEN sr.status = 'failed' THEN 1 ELSE 0 END) AS syncErrorCount
          FROM commerceSuppliers s
          LEFT JOIN commerceSupplierSources ss ON ss.supplierId = s.id
          LEFT JOIN commerceSupplierSyncRuns sr ON sr.supplierSourceId = ss.id
          GROUP BY s.id, s.slug, s.name, s.status, s.onboardingStatus, s.fulfilmentModel, s.imageRightsStatus
          ORDER BY s.createdAt DESC
        `),
      );
    }),
    orders: adminUnlockedProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      return asRows(
        await db.execute(
          sql`SELECT id, orderNumber, userId, status, storePaymentStatus, totalPence, currency, createdAt FROM commerceOrders ORDER BY createdAt DESC LIMIT 200`,
        ),
      );
    }),
    returns: adminUnlockedProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      return asRows(
        await db.execute(
          sql`SELECT r.id, r.orderId, r.userId, r.status, r.reason, r.requestedAt, o.orderNumber FROM commerceReturns r JOIN commerceOrders o ON o.id = r.orderId ORDER BY r.requestedAt DESC LIMIT 200`,
        ),
      );
    }),
    createSyntheticCandidate: adminUnlockedProcedure.mutation(
      async ({ ctx }) => {
        if (process.env.NODE_ENV === "production")
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Synthetic supplier data is disabled in production.",
          });
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        await db.execute(
          sql`INSERT INTO commerceSuppliers (slug, name, status, fulfilmentModel, imageRightsStatus) VALUES ('synthetic-development', 'Synthetic Development Supplier', 'not_configured', 'supplier_direct', 'review_required') ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        );
        const supplier = asRows<{ id: number }>(
          await db.execute(
            sql`SELECT id FROM commerceSuppliers WHERE slug = 'synthetic-development' LIMIT 1`,
          ),
        )[0];
        const slug = `development-haynet-${nanoid(6).toLowerCase()}`;
        await db.execute(
          sql`INSERT INTO commerceProducts (slug, title, description, status, retailPricePence, vatRateBasisPoints, availabilityStatus, imageRightsStatus, factualProvenanceJson, developmentOnly) VALUES (${slug}, 'Synthetic development haynet', 'Synthetic non-commercial product used solely to verify the governed catalogue pipeline.', 'review_required', 1899, 2000, 'in_stock', 'review_required', ${JSON.stringify({ source: "synthetic-development", factual: false })}, TRUE)`,
        );
        const product = asRows<{ id: number }>(
          await db.execute(
            sql`SELECT id FROM commerceProducts WHERE slug = ${slug} LIMIT 1`,
          ),
        )[0];
        const sku = `DEV-${nanoid(8).toUpperCase()}`;
        await db.execute(
          sql`INSERT INTO commerceProductVariants (productId, sku, title, attributesJson) VALUES (${product.id}, ${sku}, 'Standard', '{}')`,
        );
        const variant = asRows<{ id: number }>(
          await db.execute(
            sql`SELECT id FROM commerceProductVariants WHERE sku = ${sku} LIMIT 1`,
          ),
        )[0];
        await db.execute(
          sql`INSERT INTO commerceSupplierProducts (supplierId, productId, variantId, supplierSku, sourcePayloadJson, supplierCostPence) VALUES (${supplier.id}, ${product.id}, ${variant.id}, ${sku}, ${JSON.stringify({ synthetic: true })}, 900)`,
        );
        await db.execute(
          sql`INSERT INTO commerceProductApprovals (productId, status, proposedBy, reason) VALUES (${product.id}, 'pending', 'system', 'Synthetic development candidate requires human approval and remains non-public.')`,
        );
        await audit(
          "system",
          ctx.user.id,
          "product",
          String(product.id),
          "synthetic_candidate_created",
          { developmentOnly: true },
        );
        return {
          productId: product.id,
          status: "review_required",
          publicCatalogueVisible: false,
        };
      },
    ),
    proposeProduct: adminUnlockedProcedure
      .input(z.object({ productId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const source = asRows<any>(
          await db.execute(sql`
          SELECT p.id, p.title, p.description, p.brand, sp.supplierSku, sp.supplierCostPence,
            si.availabilityStatus, sp.sourceUpdatedAt
          FROM commerceProducts p
          JOIN commerceSupplierProducts sp ON sp.productId = p.id
          LEFT JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
          WHERE p.id = ${input.productId} LIMIT 1
        `),
        )[0];
        if (!source)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Supplier-backed product candidate not found",
          });
        const candidate = normaliseSupplierCandidate({
          supplierSku: source.supplierSku,
          title: source.title,
          factualDescription: source.description,
          brand: source.brand,
          supplierCostPence: source.supplierCostPence,
          availabilityStatus: source.availabilityStatus ?? "unavailable",
          sourceUpdatedAt: source.sourceUpdatedAt
            ? new Date(source.sourceUpdatedAt)
            : new Date(0),
        });
        const existing = asRows<any>(
          await db.execute(
            sql`SELECT supplierSku, ean, title FROM commerceSupplierProducts sp JOIN commerceProducts p ON p.id = sp.productId WHERE p.id != ${input.productId} LIMIT 500`,
          ),
        );
        const duplicate = isDuplicateCandidate(candidate, existing);
        const score = scoreCandidate(candidate, duplicate);
        const pricing = priceCandidate(candidate, null, {
          targetGrossMarginBasisPoints: 4000,
          minimumGrossMarginBasisPoints: 2500,
          minimumAbsoluteProfitPence: 300,
          maxAutomaticMovementBasisPoints: 1000,
        });
        const enrichment = await enrichCandidateCopy(candidate);
        await db.execute(
          sql`INSERT INTO commerceProductManagerActions (productId, actionType, actorType, status, inputJson, outputJson) VALUES (${input.productId}, 'propose', 'ai', 'completed', ${JSON.stringify(candidate)}, ${JSON.stringify({ duplicate, score, pricing, enrichmentStatus: enrichment.status })})`,
        );
        await audit(
          "ai",
          ctx.user.id,
          "product",
          String(input.productId),
          "proposal_generated",
          {
            duplicate,
            score: score.total,
            needsHumanReview: pricing.needsHumanReview,
            enrichmentStatus: enrichment.status,
          },
        );
        return {
          candidate,
          duplicate,
          score,
          pricing,
          enrichment,
          humanApprovalRequired: true,
        };
      }),
    approveProduct: adminUnlockedProcedure
      .input(
        z.object({
          productId: z.number().int().positive(),
          approve: z.boolean(),
          reason: z.string().min(3).max(1000),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const status = input.approve ? "approved" : "rejected";
        await db.execute(
          sql`UPDATE commerceProductApprovals SET status = ${status}, reviewedByUserId = ${ctx.user.id}, reason = ${input.reason}, reviewedAt = CURRENT_TIMESTAMP WHERE productId = ${input.productId} AND status = 'pending'`,
        );
        if (input.approve)
          await db.execute(
            sql`UPDATE commerceProducts SET status = 'published' WHERE id = ${input.productId}`,
          );
        await audit(
          "user",
          ctx.user.id,
          "product",
          String(input.productId),
          input.approve ? "approved" : "rejected",
          { reason: input.reason, developmentOnlyRemainsExcluded: true },
        );
        return { success: true, publicCatalogueVisible: false };
      }),
    setProductLifecycle: adminUnlockedProcedure
      .input(
        z.object({
          productId: z.number().int().positive(),
          action: z.enum(["publish", "unpublish", "archive"]),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const product = asRows<{
          id: number;
          developmentOnly: number;
          imageRightsStatus: string;
        }>(
          await db.execute(
            sql`SELECT id, developmentOnly, imageRightsStatus FROM commerceProducts WHERE id = ${input.productId} LIMIT 1`,
          ),
        )[0];
        if (!product)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found.",
          });
        if (input.action === "publish") {
          const approval = asRows<{ status: string }>(
            await db.execute(
              sql`SELECT status FROM commerceProductApprovals WHERE productId = ${input.productId} ORDER BY id DESC LIMIT 1`,
            ),
          )[0];
          if (
            product.developmentOnly ||
            product.imageRightsStatus !== "licensed" ||
            approval?.status !== "approved"
          ) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message:
                "Publication requires a non-development product, licensed imagery and a recorded human approval.",
            });
          }
          await db.execute(
            sql`UPDATE commerceProducts SET status = 'published', isArchived = FALSE WHERE id = ${input.productId}`,
          );
        } else if (input.action === "unpublish") {
          await db.execute(
            sql`UPDATE commerceProducts SET status = 'review_required' WHERE id = ${input.productId}`,
          );
        } else {
          await db.execute(
            sql`UPDATE commerceProducts SET status = 'archived', isArchived = TRUE WHERE id = ${input.productId}`,
          );
        }
        await audit(
          "user",
          ctx.user.id,
          "product",
          String(input.productId),
          `lifecycle_${input.action}`,
          {},
        );
        return { success: true };
      }),
    editProduct: adminUnlockedProcedure
      .input(
        z.object({
          productId: z.number().int().positive(),
          title: z.string().min(3).max(250),
          description: z.string().min(10).max(20_000),
          brand: z.string().max(150).nullable(),
          retailPricePence: z.number().int().min(0),
          salePricePence: z.number().int().min(0).nullable(),
          availabilityStatus: z.enum([
            "in_stock",
            "low_stock",
            "on_order",
            "stale",
            "unavailable",
          ]),
          imageRightsStatus: z.enum([
            "review_required",
            "licensed",
            "not_permitted",
          ]),
          returnEligibility: z.enum([
            "standard",
            "not_returnable",
            "review_required",
          ]),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (
          input.salePricePence !== null &&
          input.salePricePence > input.retailPricePence
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Sale price cannot exceed retail price.",
          });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        await db.execute(
          sql`UPDATE commerceProducts SET title = ${input.title}, description = ${input.description}, brand = ${input.brand}, retailPricePence = ${input.retailPricePence}, salePricePence = ${input.salePricePence}, availabilityStatus = ${input.availabilityStatus}, imageRightsStatus = ${input.imageRightsStatus}, returnEligibility = ${input.returnEligibility} WHERE id = ${input.productId}`,
        );
        await audit(
          "user",
          ctx.user.id,
          "product",
          String(input.productId),
          "edited",
          {
            availabilityStatus: input.availabilityStatus,
            imageRightsStatus: input.imageRightsStatus,
            returnEligibility: input.returnEligibility,
          },
        );
        return { success: true };
      }),
    setSupplierStatus: adminUnlockedProcedure
      .input(
        z.object({
          supplierId: z.number().int().positive(),
          status: z.enum(["review", "active", "suspended"]),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const supplier = asRows<{
          onboardingStatus: string;
          imageRightsStatus: string;
        }>(
          await db.execute(
            sql`SELECT onboardingStatus, imageRightsStatus FROM commerceSuppliers WHERE id = ${input.supplierId} LIMIT 1`,
          ),
        )[0];
        if (!supplier)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Supplier not found.",
          });
        if (
          input.status === "active" &&
          (supplier.onboardingStatus !== "APPROVED" ||
            supplier.imageRightsStatus !== "licensed")
        ) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message:
              "Activation requires approved supplier onboarding and licensed image rights.",
          });
        }
        await db.execute(
          sql`UPDATE commerceSuppliers SET status = ${input.status} WHERE id = ${input.supplierId}`,
        );
        await audit(
          "user",
          ctx.user.id,
          "supplier",
          String(input.supplierId),
          `status_${input.status}`,
          {},
        );
        return { success: true };
      }),
    testSupplierConnection: adminUnlockedProcedure
      .input(z.object({ supplierId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const sourceCount =
          asRows<{ count: number }>(
            await db.execute(
              sql`SELECT COUNT(*) AS count FROM commerceSupplierSources WHERE supplierId = ${input.supplierId} AND isEnabled = TRUE`,
            ),
          )[0]?.count ?? 0;
        const result =
          sourceCount > 0
            ? {
                connected: false,
                message:
                  "An enabled source is recorded, but external credentials are not tested from the Commerce admin UI.",
              }
            : {
                connected: false,
                message: "No enabled supplier source is recorded.",
              };
        await audit(
          "user",
          ctx.user.id,
          "supplier",
          String(input.supplierId),
          "connection_test_recorded",
          result,
        );
        return result;
      }),
    reviewReturn: adminUnlockedProcedure
      .input(
        z.object({
          returnId: z.number().int().positive(),
          decision: z.enum(["approved", "rejected", "received"]),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const row = asRows<{ id: number; status: string }>(
          await db.execute(
            sql`SELECT id, status FROM commerceReturns WHERE id = ${input.returnId} LIMIT 1 FOR UPDATE`,
          ),
        )[0];
        if (!row)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Return request not found.",
          });
        const allowed: Record<string, string[]> = {
          requested: ["approved", "rejected"],
          approved: ["received"],
        };
        if (!allowed[row.status]?.includes(input.decision)) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "This return cannot move to the requested state.",
          });
        }
        await db.execute(
          sql`UPDATE commerceReturns SET status = ${input.decision}, decidedAt = CASE WHEN ${input.decision} IN ('approved','rejected') THEN CURRENT_TIMESTAMP ELSE decidedAt END, receivedAt = CASE WHEN ${input.decision} = 'received' THEN CURRENT_TIMESTAMP ELSE receivedAt END WHERE id = ${input.returnId}`,
        );
        await audit(
          "user",
          ctx.user.id,
          "return",
          String(input.returnId),
          `status_${input.decision}`,
          {},
        );
        return { success: true };
      }),
    auditLog: adminUnlockedProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      return asRows(
        await db.execute(
          sql`SELECT id, actorType, actorUserId, entityType, entityId, action, detailsJson, createdAt FROM commerceAuditLog ORDER BY createdAt DESC LIMIT 200`,
        ),
      );
    }),
  }),
});
