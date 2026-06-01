import { describe, expect, it } from "vitest";
import { composeMarketingDeliverablePackage, UnsupportedDeliverablePackageTypeError } from "./modules/marketing/deliverable-composer";

describe("PR64B deliverable composer truth", () => {
  it("does not silently fallback unsupported package types to signup_campaign", async () => {
    await expect(
      composeMarketingDeliverablePackage({
        tenantId: "global",
        workspaceId: "default",
        hostAppId: "equiprofile",
        qualityMode: "standard",
        goal: "Get me 50 signups this month from stable owners.",
        audience: "stable owners",
        platforms: ["Facebook"],
        packageType: "social_ad",
        exportOnly: true,
        requireApproval: true,
      }),
    ).rejects.toBeInstanceOf(UnsupportedDeliverablePackageTypeError);
  });

  it("returns typed unsupported error with packageType marker", async () => {
    try {
      await composeMarketingDeliverablePackage({
        tenantId: "global",
        workspaceId: "default",
        hostAppId: "equiprofile",
        qualityMode: "standard",
        goal: "Create a social ad package.",
        audience: "stable owners",
        platforms: ["Facebook"],
        packageType: "email_campaign",
      });
      throw new Error("Expected unsupported error");
    } catch (error) {
      expect(error).toBeInstanceOf(UnsupportedDeliverablePackageTypeError);
      const typed = error as UnsupportedDeliverablePackageTypeError;
      expect(typed.packageType).toBe("email_campaign");
      expect(typed.message).toContain("Unsupported deliverable package type");
    }
  });
});
