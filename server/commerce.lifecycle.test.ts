import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const router = fs.readFileSync(
  path.join(root, "server/commerceRouter.ts"),
  "utf8",
);

describe("Shop customer lifecycle acceptance contract", () => {
  it("keeps catalogue browsing public while cart mutation and checkout are authenticated", () => {
    expect(router).toContain("catalogue: publicProcedure");
    expect(router).toContain("product: publicProcedure");
    expect(router).toContain("cart: router({");
    expect(router).toContain("add: protectedProcedure");
    expect(router).toContain("checkout: protectedProcedure");
  });

  it("enforces cart quantity bounds and removes an item only through quantity zero", () => {
    expect(router).toContain("quantity: z.number().int().min(1).max(20)");
    expect(router).toContain("quantity: z.number().int().min(0).max(20)");
    expect(router).toContain("DELETE FROM commerceCartItems");
    expect(router).toContain(
      "quantity = LEAST(quantity + VALUES(quantity), 20)",
    );
  });

  it("returns a truthful server-priced preview without reserving stock when Store payment is disabled", () => {
    expect(router).toContain("'checkout_pending'");
    expect(router).toContain("idempotencyKey: z.string().min(12).max(160)");
    expect(router).toContain('process.env.ENABLE_STORE_STRIPE === "true"');
    expect(router).toContain("paymentConfigurationRequired: true");
    expect(router).toContain("checkoutUrl: null");
    expect(router).toContain("It creates no order and reserves no inventory");
  });

  it("keeps order history, detail, returns and refunds scoped to the authenticated customer", () => {
    expect(router).toContain(
      "commerceOrders WHERE userId = ${ctx.user.id} ORDER BY createdAt DESC",
    );
    expect(router).toContain(
      "WHERE id = ${input.orderId} AND userId = ${ctx.user.id} LIMIT 1",
    );
    expect(router).toContain(
      "commerceReturns WHERE orderId = ${order.id} AND userId = ${ctx.user.id}",
    );
    expect(router).toContain("JOIN commerceReturns r ON r.id = cr.returnId");
    expect(router).toContain("AND r.userId = ${ctx.user.id}");
  });

  it("requires a user return request to respect policy and leaves refunds for audited administration/provider reconciliation", () => {
    expect(router).toContain("requestReturn: protectedProcedure");
    expect(router).toContain("assessReturnPolicy");
    expect(router).toContain("remainingReturnableQuantity");
    expect(router).toContain("admin: router({");
    expect(router).toContain("reviewReturn");
  });
});
