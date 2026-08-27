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
  type CommerceOrderState,
} from "./commerce/domain";
import {
  assessReturnPolicy,
  canRequestReturnInOrderState,
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

const productProvenanceSchema = z.object({
  sourceType: z.enum(["manual", "supplier"]),
  sourceName: z.string().min(2).max(200),
  sourceReference: z.string().min(3).max(2_000),
  checkedAt: z.string().datetime(),
  notes: z.string().max(2_000).optional(),
});

type CommerceDb = NonNullable<Awaited<ReturnType<typeof getDb>>>;

function isRetryableDatabaseConcurrencyError(error: unknown): boolean {
  let current = error as
    | { code?: string; errno?: number; cause?: unknown }
    | undefined;
  for (let depth = 0; current && depth < 6; depth += 1) {
    if (
      current.code === "ER_LOCK_DEADLOCK" ||
      current.code === "ER_LOCK_WAIT_TIMEOUT" ||
      current.errno === 1213 ||
      current.errno === 1205
    ) {
      return true;
    }
    current = current.cause as typeof current;
  }
  return false;
}

async function retryDatabaseTransaction<T>(operation: () => Promise<T>) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryableDatabaseConcurrencyError(error) || attempt === 2) {
        throw error;
      }
    }
  }
  throw lastError;
}

async function releaseCheckoutReservation(
  db: CommerceDb,
  orderId: number,
  nextStatus: "payment_failed" | "cancelled",
) {
  return db.transaction(async (tx) => {
    const order = asRows<{ id: number; status: string }>(
      await tx.execute(
        sql`SELECT id, status FROM commerceOrders WHERE id = ${orderId} LIMIT 1 FOR UPDATE`,
      ),
    )[0];
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
        SELECT DISTINCT p.id, p.slug, p.title, p.description, p.brand, p.retailPricePence, p.salePricePence,
          (SELECT si2.availabilityStatus
           FROM commerceProductVariants pv2
           JOIN commerceSupplierProducts sp2 ON sp2.variantId = pv2.id
           JOIN commerceSuppliers s2 ON s2.id = sp2.supplierId AND s2.status = 'active'
           JOIN commerceSupplierInventory si2 ON si2.supplierProductId = sp2.id
           WHERE pv2.productId = p.id AND pv2.isActive = TRUE
             AND si2.quantity > 0 AND si2.availabilityStatus IN ('in_stock','low_stock')
             AND si2.freshUntil >= CURRENT_TIMESTAMP
           ORDER BY si2.quantity DESC LIMIT 1) AS availabilityStatus
        FROM commerceProducts p
        LEFT JOIN commerceProductCategories pc ON pc.productId = p.id
        LEFT JOIN commerceCategories c ON c.id = pc.categoryId
        WHERE p.status = 'published' AND p.developmentOnly = FALSE AND p.isArchived = FALSE AND p.imageRightsStatus = 'licensed'
          AND (p.title LIKE ${term} OR p.brand LIKE ${term})
          AND (${input?.category ?? ""} = '' OR c.slug = ${input?.category ?? ""})
          AND EXISTS (
            SELECT 1
            FROM commerceProductVariants pv
            JOIN commerceSupplierProducts sp ON sp.variantId = pv.id
            JOIN commerceSuppliers s ON s.id = sp.supplierId AND s.status = 'active'
            JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
            WHERE pv.productId = p.id
              AND pv.isActive = TRUE
              AND si.quantity > 0
              AND si.availabilityStatus IN ('in_stock', 'low_stock')
              AND si.freshUntil >= CURRENT_TIMESTAMP
          )
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
        LEFT JOIN commerceSupplierProducts sp ON sp.id = (
          SELECT MIN(sp2.id) FROM commerceSupplierProducts sp2
          JOIN commerceSuppliers s2 ON s2.id = sp2.supplierId AND s2.status = 'active'
          WHERE sp2.variantId = pv.id
        )
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
        LEFT JOIN commerceSupplierProducts sp ON sp.id = (
          SELECT MIN(sp2.id) FROM commerceSupplierProducts sp2
          JOIN commerceSuppliers s2 ON s2.id = sp2.supplierId AND s2.status = 'active'
          WHERE sp2.variantId = pv.id
        )
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
      const cartId = await activeCartId(ctx.user.id);
      const storeStripeEnabled = process.env.ENABLE_STORE_STRIPE === "true";
      const stripe = storeStripeEnabled ? getStoreStripe() : null;

      const prepared = await retryDatabaseTransaction(() =>
        db.transaction(async (tx) => {
          // The unique idempotency-key lookup is locked before inventory. Concurrent
          // retries therefore converge on one durable order instead of racing to
          // create duplicate order rows.
          const existing = asRows<{
            id: number;
            orderNumber: string;
            status: string;
            stripeCheckoutSessionId: string | null;
          }>(
            await tx.execute(
              sql`SELECT id, orderNumber, status, stripeCheckoutSessionId FROM commerceOrders WHERE idempotencyKey = ${input.idempotencyKey} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          if (existing) {
            if (
              asRows<{ userId: number }>(
                await tx.execute(
                  sql`SELECT userId FROM commerceOrders WHERE id = ${existing.id} LIMIT 1`,
                ),
              )[0]?.userId !== ctx.user.id
            ) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "This checkout key is already in use.",
              });
            }
            return { existing, rows: [], totals: null, order: null };
          }

          const rows = asRows<any>(
            await tx.execute(sql`
            SELECT ci.quantity, pv.id AS variantId, pv.sku, pv.title AS variantTitle,
              p.title AS productTitle, p.vatRateBasisPoints,
              COALESCE(pv.retailPricePence, p.retailPricePence) AS retailPricePence,
              COALESCE(pv.salePricePence, p.salePricePence) AS salePricePence,
              p.returnEligibility, si.id AS inventoryId, si.quantity AS inventoryQuantity,
              si.availabilityStatus, si.freshUntil, sp.supplierId
            FROM commerceCartItems ci
            JOIN commerceProductVariants pv ON pv.id = ci.variantId
            JOIN commerceProducts p ON p.id = pv.productId
            JOIN commerceSupplierProducts sp ON sp.id = (
              SELECT MIN(sp2.id)
              FROM commerceSupplierProducts sp2
              JOIN commerceSuppliers s2 ON s2.id = sp2.supplierId AND s2.status = 'active'
              WHERE sp2.variantId = pv.id
            )
            JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
            WHERE ci.cartId = ${cartId}
              AND p.status = 'published'
              AND p.developmentOnly = FALSE
              AND p.isArchived = FALSE
              AND p.imageRightsStatus = 'licensed'
              AND pv.isActive = TRUE
            FOR UPDATE
          `),
          );
          if (rows.length === 0) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "Your cart has no checkout-eligible items.",
            });
          }
          for (const row of rows) {
            if (
              row.inventoryQuantity === null ||
              Number(row.inventoryQuantity) < Number(row.quantity)
            ) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: "The requested quantity is no longer available.",
              });
            }
          }

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
                error instanceof Error
                  ? error.message
                  : "Cart validation failed",
            });
          }

          // With Store payments disabled, checkout is a truthful price/stock
          // preview only. It creates no order and reserves no inventory.
          if (!stripe) {
            return { existing: null, rows, totals, order: null };
          }

          const returnWindowDays = configuredReturnWindowDays(
            process.env.COMMERCE_RETURN_WINDOW_DAYS,
          );
          const orderNumber = `EPS-${new Date().getFullYear()}-${nanoid(10).toUpperCase()}`;
          await tx.execute(
            sql`INSERT INTO commerceOrders (orderNumber, userId, status, currency, subtotalPence, shippingPence, vatPence, totalPence, idempotencyKey) VALUES (${orderNumber}, ${ctx.user.id}, 'checkout_pending', 'GBP', ${totals.subtotalPence}, ${totals.shippingPence}, ${totals.vatPence}, ${totals.totalPence}, ${input.idempotencyKey})`,
          );
          const order = asRows<{ id: number; orderNumber: string }>(
            await tx.execute(
              sql`SELECT id, orderNumber FROM commerceOrders WHERE idempotencyKey = ${input.idempotencyKey} LIMIT 1`,
            ),
          )[0];
          for (const row of rows) {
            await tx.execute(
              sql`INSERT INTO commerceOrderItems (orderId, variantId, titleSnapshot, skuSnapshot, quantity, unitPricePence, vatPence, supplierId, returnEligibility, returnWindowDays) VALUES (${order.id}, ${row.variantId}, ${`${row.productTitle} — ${row.variantTitle}`}, ${row.sku}, ${row.quantity}, ${row.salePricePence ?? row.retailPricePence}, ${Math.round(((row.salePricePence ?? row.retailPricePence) * row.quantity * row.vatRateBasisPoints) / 10000)}, ${row.supplierId}, ${row.returnEligibility ?? "review_required"}, ${row.returnEligibility === "standard" ? returnWindowDays : 0})`,
            );
            const inventoryUpdate = (await tx.execute(
              sql`UPDATE commerceSupplierInventory
                SET quantity = quantity - ${row.quantity},
                    availabilityStatus = CASE
                      WHEN quantity - ${row.quantity} <= 0 THEN 'unavailable'
                      WHEN quantity - ${row.quantity} <= 5 THEN 'low_stock'
                      ELSE 'in_stock'
                    END
                WHERE id = ${row.inventoryId} AND quantity >= ${row.quantity}`,
            )) as unknown as [{ affectedRows?: number }, unknown];
            if (Number(inventoryUpdate[0]?.affectedRows ?? 0) !== 1) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Inventory changed while checkout was being prepared.",
              });
            }
          }
          await tx.execute(
            sql`UPDATE commerceCarts SET status = 'converted', activeCartKey = CONCAT('c', id) WHERE id = ${cartId} AND status = 'active'`,
          );
          return { existing: null, rows, totals, order };
        }),
      );

      if (prepared.existing) {
        let checkoutUrl: string | null = null;
        if (stripe && prepared.existing.stripeCheckoutSessionId) {
          try {
            const existingSession = await stripe.checkout.sessions.retrieve(
              prepared.existing.stripeCheckoutSessionId,
            );
            checkoutUrl = existingSession.url;
          } catch {
            checkoutUrl = null;
          }
        }
        return {
          order: prepared.existing,
          idempotent: true,
          paymentConfigurationRequired: !stripe,
          checkoutUrl,
        };
      }
      if (!prepared.order || !stripe) {
        return {
          orderNumber: null,
          totals: prepared.totals,
          idempotent: false,
          paymentConfigurationRequired: true,
          checkoutUrl: null,
        };
      }
      const { order, rows, totals } = prepared;
      await audit(
        "user",
        ctx.user.id,
        "order",
        String(order.id),
        "checkout_prepared",
        totals,
      );
      const publicBaseUrl = (
        process.env.STORE_PUBLIC_URL ?? "https://shop.equiprofile.online"
      ).replace(/\/$/, "");
      let session;
      try {
        session = await stripe.checkout.sessions.create(
          {
            mode: "payment",
            client_reference_id: String(order.id),
            metadata: {
              commerceScope: "store",
              orderId: String(order.id),
              orderNumber: order.orderNumber,
            },
            payment_intent_data: {
              metadata: {
                commerceScope: "store",
                orderId: String(order.id),
                orderNumber: order.orderNumber,
              },
            },
            success_url: `${publicBaseUrl}/?store_checkout=success&order=${encodeURIComponent(order.orderNumber)}`,
            cancel_url: `${publicBaseUrl}/?store_checkout=cancelled&order=${encodeURIComponent(order.orderNumber)}`,
            line_items: rows.map((row: any) => ({
              quantity: row.quantity,
              price_data: {
                currency: "gbp",
                unit_amount: row.salePricePence ?? row.retailPricePence,
                product_data: {
                  name: `${row.productTitle} — ${row.variantTitle}`,
                },
              },
            })),
          },
          { idempotencyKey: `store-checkout-${order.id}` },
        );
      } catch (error) {
        await releaseCheckoutReservation(db, order.id, "payment_failed");
        await audit(
          "system",
          null,
          "order",
          String(order.id),
          "store_checkout_session_failed",
          { message: error instanceof Error ? error.message : "Unknown error" },
        );
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message:
            "Payment checkout could not be started. Reserved inventory was released; start checkout again with a new checkout key.",
        });
      }
      await db.execute(
        sql`UPDATE commerceOrders SET status = 'payment_pending', storePaymentStatus = 'pending', stripeCheckoutSessionId = ${session.id}, storePaymentReference = ${session.payment_intent ? String(session.payment_intent) : null} WHERE id = ${order.id} AND status = 'checkout_pending'`,
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
          entityId: order.orderNumber,
          publicUrl: publicBaseUrl,
          timestamp: new Date().toISOString(),
          consentState,
          idempotencyKey: `shop-checkout-started:${order.orderNumber}`,
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
        orderNumber: order.orderNumber,
        totals,
        idempotent: false,
        paymentConfigurationRequired: false,
        checkoutUrl: session.url,
      };
    }),

  product: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(180) }))
    .query(async ({ ctx, input }) => {
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
      const [variants, images, attributes, categories] = await Promise.all([
        asRows(
          await db.execute(
            sql`SELECT pv.id, pv.sku, pv.title, pv.attributesJson, pv.retailPricePence, pv.salePricePence,
              si.quantity AS stockQuantity, si.availabilityStatus, si.freshUntil
              FROM commerceProductVariants pv
              JOIN commerceSupplierProducts sp ON sp.id = (
                SELECT MIN(sp2.id) FROM commerceSupplierProducts sp2
                JOIN commerceSuppliers s2 ON s2.id = sp2.supplierId AND s2.status = 'active'
                WHERE sp2.variantId = pv.id
              )
              JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
              WHERE pv.productId = ${product.id} AND pv.isActive = TRUE
                AND si.quantity > 0
                AND si.availabilityStatus IN ('in_stock', 'low_stock')
                AND si.freshUntil >= CURRENT_TIMESTAMP
              ORDER BY pv.id`,
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
        asRows<{ slug: string }>(
          await db.execute(
            sql`SELECT c.slug FROM commerceCategories c JOIN commerceProductCategories pc ON pc.categoryId = c.id WHERE pc.productId = ${product.id} AND c.isActive = TRUE ORDER BY c.sortOrder, c.slug`,
          ),
        ),
      ]);
      const productResult = {
        ...product,
        availabilityStatus:
          (variants[0] as { availabilityStatus?: string } | undefined)
            ?.availabilityStatus ?? "unavailable",
        variants,
        images,
        attributes,
        categories,
      };
      if (
        ctx.user &&
        resolveMarketingConsent(
          (ctx.user as { preferences?: unknown }).preferences,
        ) === "marketing_opt_in"
      ) {
        const publicBaseUrl = (
          process.env.STORE_PUBLIC_URL ?? "https://shop.equiprofile.online"
        ).replace(/\/$/, "");
        void publishMarketingEvent({
          sourceApp: "equiprofile.online",
          productLine: "shop",
          eventType: "shop_product_viewed",
          entityType: "product",
          entityId: product.slug,
          publicUrl: `${publicBaseUrl}/?product=${encodeURIComponent(product.slug)}`,
          timestamp: new Date().toISOString(),
          consentState: "marketing_opt_in",
          idempotencyKey: `shop-product-viewed:${ctx.user.id}:${product.slug}:${new Date().toISOString().slice(0, 13)}`,
          payloadVersion: "1.0",
          payload: {
            slug: product.slug,
            categorySlugs: categories.map((category) => category.slug),
          },
        }).catch(() => undefined);
      }
      return productResult;
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
              sql`SELECT oi.id, oi.titleSnapshot, oi.skuSnapshot, oi.quantity,
                oi.unitPricePence, oi.vatPence, oi.fulfilmentStatus,
                oi.returnEligibility, oi.returnWindowDays, oi.returnWindowEndsAt,
                GREATEST(oi.quantity - COALESCE((
                  SELECT SUM(ri.quantity)
                  FROM commerceReturnItems ri
                  JOIN commerceReturns r ON r.id = ri.returnId
                  WHERE ri.orderItemId = oi.id
                    AND r.orderId = ${order.id}
                    AND r.status IN ('requested', 'approved', 'received', 'refunded')
                ), 0), 0) AS remainingReturnableQuantity
              FROM commerceOrderItems oi WHERE oi.orderId = ${order.id}`,
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
        const orderState = order.status as CommerceOrderState;
        if (!canRequestReturnInOrderState(orderState)) {
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
            SELECT p.id, p.slug, p.title, p.description, p.brand, p.status, p.developmentOnly, p.isArchived, p.availabilityStatus, p.retailPricePence, p.salePricePence, p.vatRateBasisPoints, p.imageRightsStatus, p.returnEligibility, p.factualProvenanceJson, p.createdAt,
              pa.status AS approvalStatus, pa.reason AS approvalReason
            FROM commerceProducts p
            LEFT JOIN commerceProductApprovals pa ON pa.productId = p.id AND pa.id = (SELECT MAX(id) FROM commerceProductApprovals WHERE productId = p.id)
            WHERE (${input?.status ?? ""} = '' OR p.status = ${input?.status ?? ""})
            ORDER BY p.createdAt DESC LIMIT 200
          `),
        );
      }),
    productDetail: adminUnlockedProcedure
      .input(z.object({ productId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const product = asRows<any>(
          await db.execute(
            sql`SELECT * FROM commerceProducts WHERE id = ${input.productId} LIMIT 1`,
          ),
        )[0];
        if (!product) throw new TRPCError({ code: "NOT_FOUND" });
        const [variants, assignments, categories, images] = await Promise.all([
          db.execute(
            sql`SELECT id, sku, ean, title, attributesJson, retailPricePence, salePricePence, isActive FROM commerceProductVariants WHERE productId = ${input.productId} ORDER BY id`,
          ),
          db.execute(sql`
            SELECT sp.id, sp.variantId, sp.supplierId, s.name AS supplierName, s.status AS supplierStatus,
              sp.supplierSku, sp.supplierCostPence, sp.rrpPence, sp.leadTimeDays, sp.sourceUpdatedAt,
              si.quantity, si.availabilityStatus, si.stockUpdatedAt, si.freshUntil
            FROM commerceSupplierProducts sp
            JOIN commerceSuppliers s ON s.id = sp.supplierId
            LEFT JOIN commerceSupplierInventory si ON si.supplierProductId = sp.id
            WHERE sp.productId = ${input.productId}
            ORDER BY sp.id
          `),
          db.execute(sql`
            SELECT c.id, c.slug, c.name
            FROM commerceProductCategories pc
            JOIN commerceCategories c ON c.id = pc.categoryId
            WHERE pc.productId = ${input.productId}
            ORDER BY c.sortOrder, c.name
          `),
          db.execute(
            sql`SELECT id, variantId, storageUrl, altText, rightsStatus, provenanceJson FROM commerceProductImages WHERE productId = ${input.productId} ORDER BY sortOrder, id`,
          ),
        ]);
        return {
          ...product,
          variants: asRows(variants),
          supplierAssignments: asRows(assignments),
          categories: asRows(categories),
          images: asRows(images),
        };
      }),
    createManualProduct: adminUnlockedProcedure
      .input(
        z.object({
          slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .max(180),
          title: z.string().min(3).max(250),
          description: z.string().min(20).max(20_000),
          brand: z.string().max(150).nullable(),
          retailPricePence: z.number().int().positive(),
          salePricePence: z.number().int().positive().nullable(),
          vatRateBasisPoints: z.number().int().min(0).max(10_000),
          returnEligibility: z.enum([
            "standard",
            "not_returnable",
            "review_required",
          ]),
          provenance: productProvenanceSchema,
          supplierId: z.number().int().positive(),
          sku: z.string().min(2).max(150),
          variantTitle: z.string().min(1).max(250),
          attributes: z.record(z.string(), z.string()).default({}),
          supplierSku: z.string().min(2).max(150),
          supplierCostPence: z.number().int().min(0),
          leadTimeDays: z.number().int().min(0).max(365).nullable(),
          quantity: z.number().int().min(0),
          stockFreshForHours: z.number().int().min(1).max(720),
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
        const result = await db.transaction(async (tx) => {
          const supplier = asRows<{ id: number }>(
            await tx.execute(
              sql`SELECT id FROM commerceSuppliers WHERE id = ${input.supplierId} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          if (!supplier)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Supplier assignment target not found.",
            });
          const insertedProduct = (
            await tx.execute(sql`
              INSERT INTO commerceProducts
                (slug, title, description, status, brand, retailPricePence, salePricePence,
                 vatRateBasisPoints, availabilityStatus, imageRightsStatus, factualProvenanceJson,
                 developmentOnly, isArchived, returnEligibility)
              VALUES
                (${input.slug}, ${input.title}, ${input.description}, 'draft', ${input.brand},
                 ${input.retailPricePence}, ${input.salePricePence}, ${input.vatRateBasisPoints},
                 'unavailable', 'review_required', ${JSON.stringify(input.provenance)}, FALSE, FALSE,
                 ${input.returnEligibility})
            `)
          )[0] as { insertId: number };
          const productId = Number(insertedProduct.insertId);
          const insertedVariant = (
            await tx.execute(sql`
              INSERT INTO commerceProductVariants
                (productId, sku, title, attributesJson, retailPricePence, salePricePence, isActive)
              VALUES (${productId}, ${input.sku}, ${input.variantTitle},
                ${JSON.stringify(input.attributes)}, ${input.retailPricePence}, ${input.salePricePence}, TRUE)
            `)
          )[0] as { insertId: number };
          const variantId = Number(insertedVariant.insertId);
          const insertedAssignment = (
            await tx.execute(sql`
              INSERT INTO commerceSupplierProducts
                (supplierId, productId, variantId, supplierSku, sourcePayloadJson,
                 supplierCostPence, rrpPence, leadTimeDays, sourceUpdatedAt)
              VALUES (${input.supplierId}, ${productId}, ${variantId}, ${input.supplierSku},
                ${JSON.stringify({ provenance: input.provenance })}, ${input.supplierCostPence},
                ${input.retailPricePence}, ${input.leadTimeDays}, CURRENT_TIMESTAMP)
            `)
          )[0] as { insertId: number };
          await tx.execute(sql`
            INSERT INTO commerceSupplierInventory
              (supplierProductId, quantity, availabilityStatus, stockUpdatedAt, freshUntil)
            VALUES (${Number(insertedAssignment.insertId)}, ${input.quantity},
              ${input.quantity === 0 ? "unavailable" : input.quantity <= 5 ? "low_stock" : "in_stock"},
              CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ${input.stockFreshForHours} HOUR))
          `);
          await tx.execute(
            sql`INSERT INTO commerceProductApprovals (productId, status, proposedBy, reason) VALUES (${productId}, 'pending', 'user', 'Manual product requires independent human approval before publication.')`,
          );
          return { productId, variantId };
        });
        await audit(
          "user",
          ctx.user.id,
          "product",
          String(result.productId),
          "manual_created",
          {
            supplierId: input.supplierId,
            variantId: result.variantId,
          },
        );
        return {
          ...result,
          status: "draft" as const,
          publicCatalogueVisible: false,
        };
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
          vatRateBasisPoints: z.number().int().min(0).max(10_000),
          factualProvenance: productProvenanceSchema,
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
        await db.transaction(async (tx) => {
          const existing = asRows<{
            retailPricePence: number;
            salePricePence: number | null;
          }>(
            await tx.execute(
              sql`SELECT retailPricePence, salePricePence FROM commerceProducts WHERE id = ${input.productId} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
          await tx.execute(
            sql`UPDATE commerceProducts SET title = ${input.title}, description = ${input.description}, brand = ${input.brand}, retailPricePence = ${input.retailPricePence}, salePricePence = ${input.salePricePence}, vatRateBasisPoints = ${input.vatRateBasisPoints}, factualProvenanceJson = ${JSON.stringify(input.factualProvenance)}, availabilityStatus = ${input.availabilityStatus}, imageRightsStatus = ${input.imageRightsStatus}, returnEligibility = ${input.returnEligibility} WHERE id = ${input.productId}`,
          );
          if (
            Number(existing.retailPricePence) !== input.retailPricePence ||
            (existing.salePricePence === null
              ? null
              : Number(existing.salePricePence)) !== input.salePricePence
          ) {
            await tx.execute(
              sql`INSERT INTO commercePriceHistory (productId, retailPricePence, salePricePence, reason, createdByUserId) VALUES (${input.productId}, ${input.retailPricePence}, ${input.salePricePence}, 'Commerce Admin product edit', ${ctx.user.id})`,
            );
          }
        });
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
            vatRateBasisPoints: input.vatRateBasisPoints,
          },
        );
        return { success: true };
      }),
    upsertVariantInventory: adminUnlockedProcedure
      .input(
        z.object({
          productId: z.number().int().positive(),
          variantId: z.number().int().positive().nullable(),
          supplierId: z.number().int().positive(),
          sku: z.string().min(2).max(150),
          ean: z.string().max(32).nullable(),
          title: z.string().min(1).max(250),
          attributes: z.record(z.string(), z.string()),
          retailPricePence: z.number().int().min(0).nullable(),
          salePricePence: z.number().int().min(0).nullable(),
          isActive: z.boolean(),
          supplierSku: z.string().min(2).max(150),
          supplierCostPence: z.number().int().min(0),
          leadTimeDays: z.number().int().min(0).max(365).nullable(),
          quantity: z.number().int().min(0),
          availabilityStatus: z.enum([
            "in_stock",
            "low_stock",
            "on_order",
            "stale",
            "unavailable",
          ]),
          freshUntil: z.string().datetime().nullable(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (
          input.salePricePence !== null &&
          input.retailPricePence !== null &&
          input.salePricePence > input.retailPricePence
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Variant sale price cannot exceed its retail price.",
          });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const variantId = await db.transaction(async (tx) => {
          const product = asRows<{ id: number }>(
            await tx.execute(
              sql`SELECT id FROM commerceProducts WHERE id = ${input.productId} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          const supplier = asRows<{ id: number }>(
            await tx.execute(
              sql`SELECT id FROM commerceSuppliers WHERE id = ${input.supplierId} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          if (!product || !supplier)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product or supplier not found.",
            });
          let targetVariantId = input.variantId;
          if (targetVariantId === null) {
            const inserted = (
              await tx.execute(sql`
              INSERT INTO commerceProductVariants
                (productId, sku, ean, title, attributesJson, retailPricePence, salePricePence, isActive)
              VALUES (${input.productId}, ${input.sku}, ${input.ean}, ${input.title},
                ${JSON.stringify(input.attributes)}, ${input.retailPricePence}, ${input.salePricePence},
                ${input.isActive})
            `)
            )[0] as { insertId: number };
            targetVariantId = Number(inserted.insertId);
          } else {
            const updated = (
              await tx.execute(sql`
              UPDATE commerceProductVariants
              SET sku = ${input.sku}, ean = ${input.ean}, title = ${input.title},
                attributesJson = ${JSON.stringify(input.attributes)},
                retailPricePence = ${input.retailPricePence}, salePricePence = ${input.salePricePence},
                isActive = ${input.isActive}
              WHERE id = ${targetVariantId} AND productId = ${input.productId}
            `)
            )[0] as { affectedRows: number };
            if (Number(updated.affectedRows) !== 1)
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Variant not found.",
              });
          }
          await tx.execute(sql`
            INSERT INTO commerceSupplierProducts
              (supplierId, productId, variantId, supplierSku, sourcePayloadJson,
               supplierCostPence, leadTimeDays, sourceUpdatedAt)
            VALUES (${input.supplierId}, ${input.productId}, ${targetVariantId}, ${input.supplierSku},
              ${JSON.stringify({ source: "commerce-admin-manual" })}, ${input.supplierCostPence},
              ${input.leadTimeDays}, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE variantId = VALUES(variantId), supplierCostPence = VALUES(supplierCostPence),
              leadTimeDays = VALUES(leadTimeDays), sourceUpdatedAt = CURRENT_TIMESTAMP
          `);
          const assignment = asRows<{ id: number }>(
            await tx.execute(
              sql`SELECT id FROM commerceSupplierProducts WHERE supplierId = ${input.supplierId} AND supplierSku = ${input.supplierSku} LIMIT 1`,
            ),
          )[0];
          await tx.execute(sql`
            INSERT INTO commerceSupplierInventory
              (supplierProductId, quantity, availabilityStatus, stockUpdatedAt, freshUntil)
            VALUES (${assignment.id}, ${input.quantity}, ${input.availabilityStatus}, CURRENT_TIMESTAMP,
              ${input.freshUntil ? new Date(input.freshUntil) : null})
            ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), availabilityStatus = VALUES(availabilityStatus),
              stockUpdatedAt = CURRENT_TIMESTAMP, freshUntil = VALUES(freshUntil)
          `);
          return targetVariantId;
        });
        await audit(
          "user",
          ctx.user.id,
          "variant",
          String(variantId),
          "inventory_upserted",
          {
            productId: input.productId,
            supplierId: input.supplierId,
            quantity: input.quantity,
            availabilityStatus: input.availabilityStatus,
          },
        );
        return { success: true, variantId };
      }),
    orderDetail: adminUnlockedProcedure
      .input(z.object({ orderId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const order = asRows<any>(
          await db.execute(
            sql`SELECT * FROM commerceOrders WHERE id = ${input.orderId} LIMIT 1`,
          ),
        )[0];
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        const [items, shipments, tracking, returns, refunds] =
          await Promise.all([
            db.execute(
              sql`SELECT id, titleSnapshot, skuSnapshot, quantity, unitPricePence, vatPence, supplierId, fulfilmentStatus FROM commerceOrderItems WHERE orderId = ${input.orderId} ORDER BY id`,
            ),
            db.execute(
              sql`SELECT id, supplierId, status, carrier, trackingReference, leadTimeDays, estimatedDeliveryAt, dispatchedAt, deliveredAt FROM commerceShipments WHERE orderId = ${input.orderId} ORDER BY id`,
            ),
            db.execute(sql`
            SELECT te.id, te.shipmentId, te.eventCode, te.eventDescription, te.eventAt, te.source
            FROM commerceTrackingEvents te JOIN commerceShipments s ON s.id = te.shipmentId
            WHERE s.orderId = ${input.orderId} ORDER BY te.eventAt DESC
          `),
            db.execute(
              sql`SELECT id, status, reason, requestedAt, decidedAt, receivedAt FROM commerceReturns WHERE orderId = ${input.orderId} ORDER BY id`,
            ),
            db.execute(
              sql`SELECT id, returnId, amountPence, status, stripeRefundId, idempotencyKey, createdAt FROM commerceRefunds WHERE orderId = ${input.orderId} ORDER BY id`,
            ),
          ]);
        return {
          ...order,
          items: asRows(items),
          shipments: asRows(shipments),
          trackingEvents: asRows(tracking),
          returns: asRows(returns),
          refunds: asRows(refunds),
        };
      }),
    updateFulfilment: adminUnlockedProcedure
      .input(
        z.object({
          orderId: z.number().int().positive(),
          orderItemId: z.number().int().positive(),
          status: z.enum([
            "acknowledged",
            "processing",
            "dispatched",
            "delivered",
            "cancelled",
          ]),
          carrier: z.string().max(120).nullable(),
          trackingReference: z.string().max(250).nullable(),
          trackingDescription: z.string().max(1_000).nullable(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (
          ["dispatched", "delivered"].includes(input.status) &&
          (!input.carrier || !input.trackingReference)
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Carrier and tracking reference are required for dispatch and delivery.",
          });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const result = await db.transaction(async (tx) => {
          const order = asRows<{ status: CommerceOrderState }>(
            await tx.execute(
              sql`SELECT status FROM commerceOrders WHERE id = ${input.orderId} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          const item = asRows<{
            id: number;
            supplierId: number | null;
            fulfilmentStatus: string;
          }>(
            await tx.execute(
              sql`SELECT id, supplierId, fulfilmentStatus FROM commerceOrderItems WHERE id = ${input.orderItemId} AND orderId = ${input.orderId} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          if (!order || !item) throw new TRPCError({ code: "NOT_FOUND" });
          if (
            ![
              "paid",
              "acknowledged",
              "processing",
              "partially_fulfilled",
              "fulfilled",
              "dispatched",
            ].includes(order.status)
          ) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "Only a trusted paid order can enter fulfilment.",
            });
          }
          await tx.execute(
            sql`UPDATE commerceOrderItems SET fulfilmentStatus = ${input.status} WHERE id = ${input.orderItemId}`,
          );
          let shipmentId: number | null = null;
          if (["dispatched", "delivered"].includes(input.status)) {
            const shipment = asRows<{ id: number }>(
              await tx.execute(
                sql`SELECT id FROM commerceShipments WHERE orderId = ${input.orderId} AND supplierId <=> ${item.supplierId} ORDER BY id LIMIT 1 FOR UPDATE`,
              ),
            )[0];
            if (shipment) {
              shipmentId = shipment.id;
              await tx.execute(sql`
                UPDATE commerceShipments SET status = ${input.status}, carrier = ${input.carrier},
                  trackingReference = ${input.trackingReference},
                  dispatchedAt = CASE WHEN ${input.status} = 'dispatched' AND dispatchedAt IS NULL THEN CURRENT_TIMESTAMP ELSE dispatchedAt END,
                  deliveredAt = CASE WHEN ${input.status} = 'delivered' THEN CURRENT_TIMESTAMP ELSE deliveredAt END
                WHERE id = ${shipment.id}
              `);
            } else {
              const inserted = (
                await tx.execute(sql`
                INSERT INTO commerceShipments
                  (orderId, supplierId, status, carrier, trackingReference, dispatchedAt, deliveredAt)
                VALUES (${input.orderId}, ${item.supplierId}, ${input.status}, ${input.carrier},
                  ${input.trackingReference},
                  CASE WHEN ${input.status} = 'dispatched' THEN CURRENT_TIMESTAMP ELSE NULL END,
                  CASE WHEN ${input.status} = 'delivered' THEN CURRENT_TIMESTAMP ELSE NULL END)
              `)
              )[0] as { insertId: number };
              shipmentId = Number(inserted.insertId);
            }
            await tx.execute(sql`
              INSERT INTO commerceShipmentItems (shipmentId, orderItemId, quantity)
              SELECT ${shipmentId}, id, quantity FROM commerceOrderItems WHERE id = ${input.orderItemId}
              ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
            `);
            await tx.execute(sql`
              INSERT INTO commerceTrackingEvents
                (shipmentId, eventCode, eventDescription, eventAt, source)
              VALUES (${shipmentId}, ${input.status}, ${input.trackingDescription}, CURRENT_TIMESTAMP, 'commerce-admin')
            `);
          }
          const counts = asRows<{ total: number; matching: number }>(
            await tx.execute(sql`
              SELECT COUNT(*) AS total,
                SUM(CASE WHEN fulfilmentStatus = ${input.status} THEN 1 ELSE 0 END) AS matching
              FROM commerceOrderItems WHERE orderId = ${input.orderId}
            `),
          )[0];
          const allMatching = Number(counts.total) === Number(counts.matching);
          const proposedOrderState: CommerceOrderState =
            input.status === "acknowledged"
              ? "acknowledged"
              : input.status === "processing"
                ? "processing"
                : input.status === "dispatched"
                  ? allMatching
                    ? "dispatched"
                    : "partially_fulfilled"
                  : input.status === "delivered"
                    ? allMatching
                      ? "delivered"
                      : "partially_fulfilled"
                    : "cancelled";
          if (canTransitionOrder(order.status, proposedOrderState)) {
            await tx.execute(
              sql`UPDATE commerceOrders SET status = ${proposedOrderState} WHERE id = ${input.orderId} AND status = ${order.status}`,
            );
          }
          return { shipmentId, orderState: proposedOrderState };
        });
        await audit(
          "user",
          ctx.user.id,
          "order",
          String(input.orderId),
          `fulfilment_${input.status}`,
          {
            orderItemId: input.orderItemId,
            shipmentId: result.shipmentId,
          },
        );
        return { success: true, ...result };
      }),
    requestStoreRefund: adminUnlockedProcedure
      .input(
        z.object({
          orderId: z.number().int().positive(),
          returnId: z.number().int().positive().nullable(),
          amountPence: z.number().int().positive(),
          idempotencyKey: z.string().uuid(),
          reason: z.string().min(3).max(500),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (process.env.ENABLE_STORE_STRIPE !== "true") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message:
              "Store Stripe TEST processing is disabled; no refund was requested.",
          });
        }
        const stripe = getStoreStripe();
        if (!stripe)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Store Stripe TEST processing is not configured.",
          });
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
        const prepared = await db.transaction(async (tx) => {
          const existing = asRows<any>(
            await tx.execute(
              sql`SELECT id, status, stripeRefundId FROM commerceRefunds WHERE idempotencyKey = ${input.idempotencyKey} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          if (existing)
            return { existing, paymentReference: null as string | null };
          const order = asRows<{
            id: number;
            totalPence: number;
            storePaymentStatus: string;
            storePaymentReference: string | null;
          }>(
            await tx.execute(
              sql`SELECT id, totalPence, storePaymentStatus, storePaymentReference FROM commerceOrders WHERE id = ${input.orderId} LIMIT 1 FOR UPDATE`,
            ),
          )[0];
          if (
            !order ||
            !["paid", "partially_refunded"].includes(order.storePaymentStatus)
          ) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "Only a trusted Store payment can be refunded.",
            });
          }
          const refunded = asRows<{ amount: number | string }>(
            await tx.execute(
              sql`SELECT COALESCE(SUM(amountPence), 0) AS amount FROM commerceRefunds WHERE orderId = ${input.orderId} AND status IN ('pending','succeeded') FOR UPDATE`,
            ),
          )[0];
          if (
            Number(refunded.amount) + input.amountPence >
            Number(order.totalPence)
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Refund total cannot exceed the trusted order total.",
            });
          }
          if (input.returnId !== null) {
            const returnRow = asRows<{ status: string }>(
              await tx.execute(
                sql`SELECT status FROM commerceReturns WHERE id = ${input.returnId} AND orderId = ${input.orderId} LIMIT 1 FOR UPDATE`,
              ),
            )[0];
            if (!returnRow || returnRow.status !== "received") {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message:
                  "A linked return must be received before refund initiation.",
              });
            }
          }
          const inserted = (
            await tx.execute(
              sql`INSERT INTO commerceRefunds (orderId, returnId, amountPence, status, idempotencyKey) VALUES (${input.orderId}, ${input.returnId}, ${input.amountPence}, 'pending', ${input.idempotencyKey})`,
            )
          )[0] as { insertId: number };
          return {
            existing: null,
            refundId: Number(inserted.insertId),
            paymentReference: order.storePaymentReference,
          };
        });
        if (prepared.existing)
          return {
            refundId: Number(prepared.existing.id),
            status: prepared.existing.status,
          };
        try {
          const refund = await stripe.refunds.create(
            {
              payment_intent: prepared.paymentReference!,
              amount: input.amountPence,
              reason: "requested_by_customer",
              metadata: {
                commerceScope: "store",
                orderId: String(input.orderId),
                commerceRefundId: String(prepared.refundId),
                requestedByUserId: String(ctx.user.id),
                reason: input.reason.slice(0, 200),
              },
            },
            { idempotencyKey: `store-refund-${input.idempotencyKey}` },
          );
          await db.execute(
            sql`UPDATE commerceRefunds SET stripeRefundId = ${refund.id} WHERE id = ${prepared.refundId} AND status = 'pending'`,
          );
          await audit(
            "user",
            ctx.user.id,
            "refund",
            String(prepared.refundId),
            "provider_requested",
            {
              orderId: input.orderId,
              amountPence: input.amountPence,
            },
          );
          return { refundId: prepared.refundId, status: "pending" as const };
        } catch {
          await db.execute(
            sql`UPDATE commerceRefunds SET status = 'failed' WHERE id = ${prepared.refundId} AND status = 'pending'`,
          );
          throw new TRPCError({
            code: "BAD_GATEWAY",
            message:
              "The Store refund provider request failed; no success was recorded.",
          });
        }
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
        await db.transaction(async (tx) => {
          const row = asRows<{ id: number; status: string }>(
            await tx.execute(
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
          await tx.execute(
            sql`UPDATE commerceReturns SET status = ${input.decision}, decidedAt = CASE WHEN ${input.decision} IN ('approved','rejected') THEN CURRENT_TIMESTAMP ELSE decidedAt END, receivedAt = CASE WHEN ${input.decision} = 'received' THEN CURRENT_TIMESTAMP ELSE receivedAt END WHERE id = ${input.returnId} AND status = ${row.status}`,
          );
        });
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
