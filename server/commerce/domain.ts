export const COMMERCE_ORDER_STATES = [
  "checkout_pending",
  "payment_pending",
  "paid",
  "acknowledged",
  "processing",
  "partially_fulfilled",
  "fulfilled",
  "dispatched",
  "delivered",
  "payment_failed",
  "cancelled",
  "return_requested",
  "returned",
  "partially_refunded",
  "refunded",
] as const;

export type CommerceOrderState = (typeof COMMERCE_ORDER_STATES)[number];
export type AvailabilityStatus =
  | "in_stock"
  | "low_stock"
  | "on_order"
  | "stale"
  | "unavailable";

const ORDER_TRANSITIONS: Record<
  CommerceOrderState,
  readonly CommerceOrderState[]
> = {
  checkout_pending: ["payment_pending", "cancelled"],
  payment_pending: ["paid", "payment_failed", "cancelled"],
  paid: [
    "acknowledged",
    "processing",
    "cancelled",
    "partially_refunded",
    "refunded",
  ],
  acknowledged: ["processing", "cancelled", "partially_refunded", "refunded"],
  processing: [
    "partially_fulfilled",
    "fulfilled",
    "cancelled",
    "partially_refunded",
    "refunded",
  ],
  partially_fulfilled: [
    "fulfilled",
    "dispatched",
    "partially_refunded",
    "refunded",
  ],
  fulfilled: [
    "dispatched",
    "return_requested",
    "partially_refunded",
    "refunded",
  ],
  dispatched: [
    "delivered",
    "return_requested",
    "partially_refunded",
    "refunded",
  ],
  delivered: ["return_requested", "partially_refunded", "refunded"],
  payment_failed: ["checkout_pending"],
  cancelled: [],
  return_requested: ["returned", "cancelled"],
  returned: ["partially_refunded", "refunded"],
  partially_refunded: ["refunded"],
  refunded: [],
};

export function canTransitionOrder(
  from: CommerceOrderState,
  to: CommerceOrderState,
) {
  return ORDER_TRANSITIONS[from].includes(to);
}

export type CartPriceLine = {
  quantity: number;
  retailPricePence: number;
  salePricePence: number | null;
  vatRateBasisPoints: number;
  availabilityStatus: AvailabilityStatus;
  freshUntil: Date | null;
};

export type CalculatedCartTotals = {
  subtotalPence: number;
  vatPence: number;
  shippingPence: number;
  totalPence: number;
};

/** Inventory can be sold only when a supplier has asserted availability and its freshness window remains valid. */
export function isSellableInventory(
  line: Pick<CartPriceLine, "availabilityStatus" | "freshUntil">,
  now = new Date(),
) {
  return (
    (line.availabilityStatus === "in_stock" ||
      line.availabilityStatus === "low_stock") &&
    !!line.freshUntil &&
    line.freshUntil.getTime() >= now.getTime()
  );
}

/** Server-only amount calculation; callers must never accept a browser price or tax value. */
export function calculateCartTotals(
  lines: CartPriceLine[],
  shippingPence = 0,
): CalculatedCartTotals {
  if (!Number.isInteger(shippingPence) || shippingPence < 0)
    throw new Error("Invalid shipping amount");
  let subtotalPence = 0;
  let vatPence = 0;
  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1)
      throw new Error("Invalid cart quantity");
    if (!isSellableInventory(line))
      throw new Error("A cart item is unavailable or has stale supplier stock");
    const unitPrice = line.salePricePence ?? line.retailPricePence;
    if (!Number.isInteger(unitPrice) || unitPrice < 0)
      throw new Error("Invalid trusted product price");
    const lineSubtotal = unitPrice * line.quantity;
    subtotalPence += lineSubtotal;
    vatPence += Math.round((lineSubtotal * line.vatRateBasisPoints) / 10_000);
  }
  return {
    subtotalPence,
    vatPence,
    shippingPence,
    totalPence: subtotalPence + vatPence + shippingPence,
  };
}

export type PricePolicy = {
  targetGrossMarginBasisPoints: number;
  minimumGrossMarginBasisPoints: number;
  minimumAbsoluteProfitPence: number;
  maxAutomaticMovementBasisPoints: number;
};

export function recommendRetailPrice(
  supplierCostPence: number,
  currentRetailPence: number | null,
  policy: PricePolicy,
) {
  if (!Number.isInteger(supplierCostPence) || supplierCostPence < 0)
    throw new Error("Invalid supplier cost");
  const target = Math.ceil(
    (supplierCostPence * 10_000) /
      (10_000 - policy.targetGrossMarginBasisPoints),
  );
  const minimum = Math.max(
    Math.ceil(
      (supplierCostPence * 10_000) /
        (10_000 - policy.minimumGrossMarginBasisPoints),
    ),
    supplierCostPence + policy.minimumAbsoluteProfitPence,
  );
  const proposedRetailPence = Math.max(target, minimum);
  const needsHumanReview =
    currentRetailPence !== null &&
    Math.abs(proposedRetailPence - currentRetailPence) * 10_000 >
      currentRetailPence * policy.maxAutomaticMovementBasisPoints;
  return { proposedRetailPence, needsHumanReview };
}

export type SupplierProductRecord = {
  supplierSku: string;
  title: string;
  factualDescription: string;
  pricePence: number;
  availabilityStatus: AvailabilityStatus;
  sourceUpdatedAt: Date;
};

/** Future supplier integration contract. Credentials stay in server configuration, never browser code. */
export interface SupplierConnector {
  authenticate(): Promise<void>;
  testConnection(): Promise<{ ok: boolean; message: string }>;
  getCatalogue(): AsyncIterable<SupplierProductRecord>;
  getProduct(supplierSku: string): Promise<SupplierProductRecord | null>;
  getInventory(supplierSku: string): Promise<{
    availabilityStatus: AvailabilityStatus;
    quantity: number | null;
    updatedAt: Date;
  }>;
  getPrices(supplierSku: string): Promise<{
    supplierCostPence: number;
    rrpPence: number | null;
    updatedAt: Date;
  }>;
  getShippingProfile(): Promise<{ name: string; leadTimeDays: number | null }>;
}

export function requiresHumanApproval(
  action:
    | "publish"
    | "supplier_activation"
    | "price_change"
    | "factual_change"
    | "purchase_commitment",
) {
  return [
    "publish",
    "supplier_activation",
    "price_change",
    "factual_change",
    "purchase_commitment",
  ].includes(action);
}
