export type StorePaymentOrder = {
  totalPence: number;
  currency: string;
};

export type ReconciliationDecision =
  | { accepted: true }
  | { accepted: false; reason: string };

function normaliseCurrency(value: string | null | undefined): string {
  return (value ?? "").trim().toUpperCase();
}

export function reconcilePaidStoreCheckout(input: {
  order: StorePaymentOrder;
  amountTotal: number | null | undefined;
  currency: string | null | undefined;
  paymentStatus: string | null | undefined;
}): ReconciliationDecision {
  if (input.paymentStatus !== "paid") {
    return { accepted: false, reason: "Checkout session is not paid." };
  }
  if (!Number.isInteger(input.amountTotal) || input.amountTotal! < 0) {
    return {
      accepted: false,
      reason: "Checkout session has no valid settled amount.",
    };
  }
  if (input.amountTotal !== input.order.totalPence) {
    return {
      accepted: false,
      reason: "Checkout amount does not match the trusted order total.",
    };
  }
  if (
    normaliseCurrency(input.currency) !==
    normaliseCurrency(input.order.currency)
  ) {
    return {
      accepted: false,
      reason: "Checkout currency does not match the trusted order currency.",
    };
  }
  return { accepted: true };
}

export function reconcileStoreRefund(input: {
  order: StorePaymentOrder;
  amountRefunded: number | null | undefined;
  currency: string | null | undefined;
}):
  | { accepted: true; paymentStatus: "partially_refunded" | "refunded" }
  | { accepted: false; reason: string } {
  if (!Number.isInteger(input.amountRefunded) || input.amountRefunded! <= 0) {
    return {
      accepted: false,
      reason: "Refund event has no positive refunded amount.",
    };
  }
  if (input.amountRefunded! > input.order.totalPence) {
    return {
      accepted: false,
      reason: "Refunded amount exceeds the trusted order total.",
    };
  }
  if (
    normaliseCurrency(input.currency) !==
    normaliseCurrency(input.order.currency)
  ) {
    return {
      accepted: false,
      reason: "Refund currency does not match the trusted order currency.",
    };
  }
  return {
    accepted: true,
    paymentStatus:
      input.amountRefunded === input.order.totalPence
        ? "refunded"
        : "partially_refunded",
  };
}

export type StoreScopedMetadata = Record<string, string> & {
  commerceScope: "store";
  orderId: string;
};

export function isStoreScopedMetadata(
  metadata: Record<string, string> | null | undefined,
): metadata is StoreScopedMetadata {
  return (
    metadata?.commerceScope === "store" && /^\d+$/.test(metadata.orderId ?? "")
  );
}
