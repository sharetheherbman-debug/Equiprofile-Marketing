import { describe, expect, it } from "vitest";
import {
  calculateCartTotals,
  canTransitionOrder,
  recommendRetailPrice,
  requiresHumanApproval,
} from "./commerce/domain";

describe("commerce domain safeguards", () => {
  it("calculates trusted price and VAT only for fresh sellable inventory", () => {
    const totals = calculateCartTotals([
      {
        quantity: 2,
        retailPricePence: 1500,
        salePricePence: 1200,
        vatRateBasisPoints: 2000,
        availabilityStatus: "in_stock",
        freshUntil: new Date(Date.now() + 60_000),
      },
    ]);
    expect(totals).toEqual({
      subtotalPence: 2400,
      vatPence: 480,
      shippingPence: 0,
      totalPence: 2880,
    });
  });

  it("rejects stale or unavailable supplier inventory before checkout", () => {
    expect(() =>
      calculateCartTotals([
        {
          quantity: 1,
          retailPricePence: 1500,
          salePricePence: null,
          vatRateBasisPoints: 2000,
          availabilityStatus: "stale",
          freshUntil: new Date(Date.now() - 1),
        },
      ]),
    ).toThrow(/unavailable or has stale supplier stock/);
  });

  it("enforces the order state machine and human approval boundaries", () => {
    expect(canTransitionOrder("payment_pending", "paid")).toBe(true);
    expect(canTransitionOrder("delivered", "paid")).toBe(false);
    expect(requiresHumanApproval("publish")).toBe(true);
    const proposal = recommendRetailPrice(1000, 1200, {
      targetGrossMarginBasisPoints: 4000,
      minimumGrossMarginBasisPoints: 2500,
      minimumAbsoluteProfitPence: 300,
      maxAutomaticMovementBasisPoints: 1000,
    });
    expect(proposal.proposedRetailPence).toBeGreaterThanOrEqual(1667);
    expect(proposal.needsHumanReview).toBe(true);
  });
});
