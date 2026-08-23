import { describe, expect, it } from "vitest";
import {
  assessReturnPolicy,
  canRequestReturnInOrderState,
  configuredReturnWindowDays,
  hasDuplicateReturnItems,
  remainingReturnableQuantity,
} from "./commerce/returnPolicy";

describe("Commerce return policy", () => {
  const deliveredAt = new Date("2026-08-01T10:00:00.000Z");

  it("requires an explicit bounded return-window configuration", () => {
    expect(configuredReturnWindowDays(undefined)).toBe(0);
    expect(configuredReturnWindowDays("0")).toBe(0);
    expect(configuredReturnWindowDays("30")).toBe(30);
    expect(configuredReturnWindowDays("366")).toBe(0);
  });

  it("allows a standard item only after delivery and within its recorded window", () => {
    expect(
      assessReturnPolicy({
        orderStatus: "delivered",
        deliveredAt,
        eligibility: "standard",
        windowDays: 30,
        now: new Date("2026-08-15T10:00:00.000Z"),
      }),
    ).toEqual({
      eligible: true,
      windowEndsAt: new Date("2026-08-31T10:00:00.000Z"),
    });

    expect(
      assessReturnPolicy({
        orderStatus: "paid",
        deliveredAt,
        eligibility: "standard",
        windowDays: 30,
      }),
    ).toMatchObject({
      eligible: false,
      reason: expect.stringMatching(/delivery state/i),
    });
  });

  it("rejects no-delivery, non-returnable, review-required and expired requests", () => {
    for (const input of [
      { deliveredAt: null, eligibility: "standard" as const, windowDays: 30 },
      { deliveredAt, eligibility: "not_returnable" as const, windowDays: 30 },
      { deliveredAt, eligibility: "review_required" as const, windowDays: 30 },
      { deliveredAt, eligibility: "standard" as const, windowDays: 0 },
    ]) {
      expect(
        assessReturnPolicy({
          orderStatus: "delivered",
          now: new Date("2026-08-15T10:00:00.000Z"),
          ...input,
        }),
      ).toMatchObject({ eligible: false });
    }
    expect(
      assessReturnPolicy({
        orderStatus: "delivered",
        deliveredAt,
        eligibility: "standard",
        windowDays: 7,
        now: new Date("2026-08-09T10:00:00.000Z"),
      }),
    ).toMatchObject({
      eligible: false,
      reason: expect.stringMatching(/ended/i),
    });
  });

  it("prevents requested returns from exceeding the purchased quantity", () => {
    expect(remainingReturnableQuantity(3, 0)).toBe(3);
    expect(remainingReturnableQuantity(3, 2)).toBe(1);
    expect(remainingReturnableQuantity(3, 4)).toBe(0);
  });

  it("permits later partial-return requests while blocking unpaid and fully refunded orders", () => {
    for (const state of [
      "fulfilled",
      "dispatched",
      "delivered",
      "return_requested",
      "returned",
      "partially_refunded",
    ] as const) {
      expect(canRequestReturnInOrderState(state)).toBe(true);
    }
    expect(canRequestReturnInOrderState("payment_pending")).toBe(false);
    expect(canRequestReturnInOrderState("refunded")).toBe(false);
  });

  it("rejects duplicate items inside a single request", () => {
    expect(
      hasDuplicateReturnItems([{ orderItemId: 1 }, { orderItemId: 1 }]),
    ).toBe(true);
    expect(
      hasDuplicateReturnItems([{ orderItemId: 1 }, { orderItemId: 2 }]),
    ).toBe(false);
  });
});
