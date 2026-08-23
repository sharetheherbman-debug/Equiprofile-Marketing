import type {
  AvailabilityStatus,
  SupplierConnector,
  SupplierProductRecord,
} from "../domain";

/**
 * Avasam supplier integration boundary.
 *
 * Public information indicates Avasam can provide supplier catalogue, stock and
 * order automation capabilities, but its authenticated seller API contract and
 * credentials are not available to this repository. This adapter is intentionally
 * inert until a trade-approved account, documented API access, image rights and
 * a human supplier-activation approval exist. It never makes a network request.
 */
export const AVASAM_ONBOARDING_STATUS =
  "PENDING_AVASAM_ACCOUNT_CREDENTIALS" as const;

export class AvasamConnectorNotConfiguredError extends Error {
  constructor(operation: string) {
    super(
      `Avasam ${operation} is blocked: ${AVASAM_ONBOARDING_STATUS}. ` +
        "Provide approved seller-account credentials and complete human supplier activation before enabling this connector.",
    );
    this.name = "AvasamConnectorNotConfiguredError";
  }
}

export type AvasamConnectorReadiness = {
  supplierSlug: "avasam";
  onboardingStatus: typeof AVASAM_ONBOARDING_STATUS;
  enabled: false;
  credentialsPresent: false;
  networkCallsPermitted: false;
  message: string;
};

const notConfiguredReadiness = (): AvasamConnectorReadiness => ({
  supplierSlug: "avasam",
  onboardingStatus: AVASAM_ONBOARDING_STATUS,
  enabled: false,
  credentialsPresent: false,
  networkCallsPermitted: false,
  message:
    "Awaiting Avasam seller-account credentials, API documentation review, image-rights confirmation and human supplier-activation approval.",
});

export class AvasamSupplierConnector implements SupplierConnector {
  readiness(): AvasamConnectorReadiness {
    return notConfiguredReadiness();
  }

  async authenticate(): Promise<void> {
    throw new AvasamConnectorNotConfiguredError("authentication");
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const readiness = this.readiness();
    return { ok: false, message: readiness.message };
  }

  async *getCatalogue(): AsyncIterable<SupplierProductRecord> {
    throw new AvasamConnectorNotConfiguredError("catalogue retrieval");
  }

  async getProduct(
    _supplierSku: string,
  ): Promise<SupplierProductRecord | null> {
    throw new AvasamConnectorNotConfiguredError("product retrieval");
  }

  async getInventory(_supplierSku: string): Promise<{
    availabilityStatus: AvailabilityStatus;
    quantity: number | null;
    updatedAt: Date;
  }> {
    throw new AvasamConnectorNotConfiguredError("inventory retrieval");
  }

  async getPrices(_supplierSku: string): Promise<{
    supplierCostPence: number;
    rrpPence: number | null;
    updatedAt: Date;
  }> {
    throw new AvasamConnectorNotConfiguredError("price retrieval");
  }

  async getShippingProfile(): Promise<{
    name: string;
    leadTimeDays: number | null;
  }> {
    throw new AvasamConnectorNotConfiguredError("shipping-profile retrieval");
  }

  async submitOrder(_order: {
    merchantOrderReference: string;
    lines: Array<{ supplierSku: string; quantity: number }>;
  }): Promise<{ supplierOrderReference: string; acceptedAt: Date }> {
    throw new AvasamConnectorNotConfiguredError("order submission");
  }

  async getFulfilment(_supplierOrderReference: string): Promise<{
    status: "pending" | "processing" | "dispatched" | "delivered" | "cancelled";
    carrier: string | null;
    trackingReference: string | null;
    updatedAt: Date;
  }> {
    throw new AvasamConnectorNotConfiguredError("fulfilment retrieval");
  }

  async getTracking(
    _supplierOrderReference: string,
  ): Promise<
    Array<{ eventCode: string; description: string | null; occurredAt: Date }>
  > {
    throw new AvasamConnectorNotConfiguredError("tracking retrieval");
  }

  async requestReturn(_input: {
    supplierOrderReference: string;
    lines: Array<{ supplierSku: string; quantity: number }>;
    reason: string;
  }): Promise<{ supplierReturnReference: string; acceptedAt: Date }> {
    throw new AvasamConnectorNotConfiguredError("return submission");
  }
}
