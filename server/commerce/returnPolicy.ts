import type { CommerceOrderState } from "./domain";

export type ReturnEligibility =
  | "standard"
  | "not_returnable"
  | "review_required";

export type ReturnPolicyDecision =
  | { eligible: true; windowEndsAt: Date }
  | { eligible: false; reason: string };

const RETURN_REQUEST_ORDER_STATES = new Set<CommerceOrderState>([
  "fulfilled",
  "dispatched",
  "delivered",
  "return_requested",
  "returned",
  "partially_refunded",
]);

export function canRequestReturnInOrderState(state: CommerceOrderState) {
  return RETURN_REQUEST_ORDER_STATES.has(state);
}

/**
 * The operational return policy is intentionally explicit. A missing or invalid
 * configuration disables self-service return requests rather than silently
 * assuming a legal deadline. Compliance owners must configure and review the
 * policy for the applicable sales channels and product categories.
 */
export function configuredReturnWindowDays(
  rawValue: string | undefined,
): number {
  const value = Number(rawValue);
  return Number.isInteger(value) && value >= 1 && value <= 365 ? value : 0;
}

export function assessReturnPolicy(input: {
  orderStatus: CommerceOrderState;
  deliveredAt: Date | null;
  eligibility: ReturnEligibility;
  windowDays: number;
  now?: Date;
}): ReturnPolicyDecision {
  const now = input.now ?? new Date();
  if (!canRequestReturnInOrderState(input.orderStatus)) {
    return {
      eligible: false,
      reason: "The order is not in a return-eligible delivery state.",
    };
  }
  if (!input.deliveredAt) {
    return {
      eligible: false,
      reason: "Delivery has not been recorded for this item.",
    };
  }
  if (input.eligibility !== "standard") {
    return {
      eligible: false,
      reason:
        input.eligibility === "not_returnable"
          ? "This item is marked as not returnable under the recorded order policy."
          : "This item requires a return-policy review before a request can be made.",
    };
  }
  if (!Number.isInteger(input.windowDays) || input.windowDays < 1) {
    return {
      eligible: false,
      reason:
        "Self-service returns are unavailable because no return-window policy was recorded for this item.",
    };
  }
  const windowEndsAt = new Date(input.deliveredAt);
  windowEndsAt.setUTCDate(windowEndsAt.getUTCDate() + input.windowDays);
  if (now > windowEndsAt) {
    return { eligible: false, reason: "The recorded return window has ended." };
  }
  return { eligible: true, windowEndsAt };
}

export function remainingReturnableQuantity(
  purchasedQuantity: number,
  previouslyRequestedQuantity: number,
): number {
  return Math.max(0, purchasedQuantity - previouslyRequestedQuantity);
}

export function hasDuplicateReturnItems(
  items: Array<{ orderItemId: number }>,
): boolean {
  return new Set(items.map((item) => item.orderItemId)).size !== items.length;
}
