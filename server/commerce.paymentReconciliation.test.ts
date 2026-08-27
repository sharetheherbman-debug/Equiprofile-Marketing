import { describe, expect, it } from "vitest";
import {
  isStoreScopedMetadata,
  reconcilePaidStoreCheckout,
  reconcileStoreRefund,
} from "./commerce/paymentReconciliation";

describe("Store payment reconciliation", () => {
  const order = { totalPence: 12_500, currency: "GBP" };

  it("accepts only a paid checkout that exactly matches the trusted total and currency", () => {
    expect(
      reconcilePaidStoreCheckout({
        order,
        amountTotal: 12_500,
        currency: "gbp",
        paymentStatus: "paid",
      }),
    ).toEqual({ accepted: true });
    expect(
      reconcilePaidStoreCheckout({
        order,
        amountTotal: 12_499,
        currency: "gbp",
        paymentStatus: "paid",
      }),
    ).toMatchObject({
      accepted: false,
      reason: expect.stringMatching(/amount/i),
    });
    expect(
      reconcilePaidStoreCheckout({
        order,
        amountTotal: 12_500,
        currency: "usd",
        paymentStatus: "paid",
      }),
    ).toMatchObject({
      accepted: false,
      reason: expect.stringMatching(/currency/i),
    });
    expect(
      reconcilePaidStoreCheckout({
        order,
        amountTotal: 12_500,
        currency: "gbp",
        paymentStatus: "unpaid",
      }),
    ).toMatchObject({
      accepted: false,
      reason: expect.stringMatching(/not paid/i),
    });
  });

  it("classifies verified refunds as partial or full and rejects invalid amounts", () => {
    expect(
      reconcileStoreRefund({ order, amountRefunded: 5_000, currency: "GBP" }),
    ).toEqual({ accepted: true, paymentStatus: "partially_refunded" });
    expect(
      reconcileStoreRefund({ order, amountRefunded: 12_500, currency: "GBP" }),
    ).toEqual({ accepted: true, paymentStatus: "refunded" });
    expect(
      reconcileStoreRefund({ order, amountRefunded: 12_501, currency: "GBP" }),
    ).toMatchObject({
      accepted: false,
      reason: expect.stringMatching(/exceeds/i),
    });
    expect(
      reconcileStoreRefund({ order, amountRefunded: 5_000, currency: "EUR" }),
    ).toMatchObject({
      accepted: false,
      reason: expect.stringMatching(/currency/i),
    });
  });

  it("keeps Store events isolated from SaaS and malformed metadata", () => {
    expect(
      isStoreScopedMetadata({ commerceScope: "store", orderId: "42" }),
    ).toBe(true);
    expect(
      isStoreScopedMetadata({ commerceScope: "saas", orderId: "42" }),
    ).toBe(false);
    expect(
      isStoreScopedMetadata({ commerceScope: "store", orderId: "customer_42" }),
    ).toBe(false);
    expect(isStoreScopedMetadata(null)).toBe(false);
  });
});
