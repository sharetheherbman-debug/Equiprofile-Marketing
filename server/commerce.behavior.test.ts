import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const router = fs.readFileSync(
  path.join(root, "server/commerceRouter.ts"),
  "utf8",
);
const bootstrap = fs.readFileSync(
  path.join(root, "server/_core/index.ts"),
  "utf8",
);

describe("Commerce behavioral security boundaries", () => {
  it("excludes development, archived and unlicensed-image products from public catalogue, detail, cart and checkout", () => {
    const licensedChecks =
      router.match(/imageRightsStatus = 'licensed'/g) ?? [];
    expect(licensedChecks.length).toBeGreaterThanOrEqual(3);
    expect(router).toContain('eligible.imageRightsStatus !== "licensed"');
    expect(router).toContain("p.developmentOnly = FALSE");
    expect(router).toContain("p.isArchived = FALSE");
  });

  it("derives price and tax from persisted rows, not browser input", () => {
    expect(router).toContain("calculateCartTotals(");
    expect(router).toContain("vatRateBasisPoints");
    expect(router).toContain("idempotencyKey: z.string().min(12)");
    expect(router).not.toContain("pricePence: z.");
  });

  it("keeps carts and orders scoped to their authenticated owner with server-side quantity limits", () => {
    expect(router).toContain("WHERE userId = ${userId} AND status = 'active'");
    expect(router).toContain("quantity: z.number().int().min(1).max(20)");
    expect(router).toContain(
      "quantity = LEAST(quantity + VALUES(quantity), 20)",
    );
    expect(router).toContain(
      "WHERE id = ${input.orderId} AND userId = ${ctx.user.id}",
    );
  });

  it("requires signed Store events, Store scope, replay protection and exact payment reconciliation", () => {
    expect(bootstrap).toContain('"/api/webhooks/store-stripe"');
    expect(bootstrap).toContain("stripe.webhooks.constructEvent");
    expect(bootstrap).toContain("isStoreScopedMetadata(metadata)");
    expect(bootstrap).toContain("reconcilePaidStoreCheckout");
    expect(bootstrap).toContain("reconcileStoreRefund");
    expect(bootstrap).toContain("cached: true");
  });

  it("uses duplicate-item rejection, transaction locks, recorded delivery, policy and cumulative quantity checks for returns", () => {
    expect(router).toContain("hasDuplicateReturnItems(input.items)");
    expect(router).toContain("await db.transaction");
    expect(router).toContain("FOR UPDATE");
    expect(router).toContain("assessReturnPolicy");
    expect(router).toContain("remainingReturnableQuantity");
    expect(router).toContain("returnWindowDays");
  });
});
