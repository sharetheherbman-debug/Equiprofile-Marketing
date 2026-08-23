import { describe, expect, it } from "vitest";
import {
  AVASAM_ONBOARDING_STATUS,
  AvasamConnectorNotConfiguredError,
  AvasamSupplierConnector,
} from "./avasam";

describe("AvasamSupplierConnector", () => {
  it("is explicitly inert until seller-account credentials and approvals exist", async () => {
    const connector = new AvasamSupplierConnector();
    expect(connector.readiness()).toMatchObject({
      supplierSlug: "avasam",
      onboardingStatus: AVASAM_ONBOARDING_STATUS,
      enabled: false,
      credentialsPresent: false,
      networkCallsPermitted: false,
    });
    await expect(connector.testConnection()).resolves.toMatchObject({
      ok: false,
    });
    await expect(connector.authenticate()).rejects.toBeInstanceOf(
      AvasamConnectorNotConfiguredError,
    );
    await expect(connector.getProduct("ANY-SKU")).rejects.toBeInstanceOf(
      AvasamConnectorNotConfiguredError,
    );
    await expect(
      connector.submitOrder({
        merchantOrderReference: "TEST-ORDER",
        lines: [{ supplierSku: "ANY-SKU", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(AvasamConnectorNotConfiguredError);
    await expect(connector.getFulfilment("TEST-ORDER")).rejects.toBeInstanceOf(
      AvasamConnectorNotConfiguredError,
    );
    await expect(connector.getTracking("TEST-ORDER")).rejects.toBeInstanceOf(
      AvasamConnectorNotConfiguredError,
    );
    await expect(
      connector.requestReturn({
        supplierOrderReference: "TEST-ORDER",
        lines: [{ supplierSku: "ANY-SKU", quantity: 1 }],
        reason: "Deterministic contract test",
      }),
    ).rejects.toBeInstanceOf(AvasamConnectorNotConfiguredError);
  });
});
