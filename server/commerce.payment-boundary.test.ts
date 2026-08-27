import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const bootstrap = fs.readFileSync(
  path.join(root, "server/_core/index.ts"),
  "utf8",
);

describe("Store payment boundary", () => {
  it("uses an isolated Store webhook and Store-specific secret", () => {
    expect(bootstrap).toContain('"/api/webhooks/store-stripe"');
    expect(bootstrap).toContain("STORE_STRIPE_WEBHOOK_SECRET");
    expect(bootstrap).toContain("isStoreScopedMetadata(metadata)");
    expect(bootstrap).toContain("getStoreStripe()");
    expect(bootstrap).toContain("Store payment processing is not configured");
  });

  it("records provider events with replay protection before reconciliation", () => {
    expect(bootstrap).toContain("INSERT IGNORE INTO commercePaymentEvents");
    expect(bootstrap).toContain("affectedRows");
    expect(bootstrap).toContain("cached: true");
    expect(bootstrap).toContain("reconcilePaidStoreCheckout");
    expect(bootstrap).toContain("reconcileStoreRefund");
    expect(bootstrap).toContain("storePaymentStatus = 'paid'");
    expect(bootstrap).toContain(
      "storePaymentStatus = ${decision.paymentStatus}",
    );
    expect(bootstrap).toContain("INSERT INTO commerceRefunds");
    expect(bootstrap).toContain(
      "metadata.orderNumber !== order[0].orderNumber",
    );
  });

  it("keeps Store Checkout disabled by default and marks any configured session as Store-scoped", () => {
    const router = fs.readFileSync(
      path.join(root, "server/commerceRouter.ts"),
      "utf8",
    );
    expect(router).toContain('process.env.ENABLE_STORE_STRIPE === "true"');
    expect(router).toContain("getStoreStripe()");
    expect(router).toContain("paymentConfigurationRequired: true");
    expect(router).toContain("stripe.checkout.sessions.create");
    expect(router).toContain('commerceScope: "store"');
  });
});
