import { describe, expect, it } from "vitest";
import { grantProductComplimentaryAccess } from "../shared/productEntitlement";
import {
  isAcademyOrganizationEntitlementActive,
  resolveIndividualAcademyEntitlement,
} from "./academy/entitlement";

describe("Academy product entitlement", () => {
  it("keeps Management-only customers out of Academy learner routes", () => {
    expect(resolveIndividualAcademyEntitlement({ preferences: JSON.stringify({ planTier: "pro" }) })).toMatchObject({ entitled: false, audience: "none" });
  });

  it("recognises an explicit individual Academy rider entitlement", () => {
    expect(resolveIndividualAcademyEntitlement({ preferences: JSON.stringify({ academyEntitlementStatus: "active", academyPlan: "rider" }) })).toMatchObject({ entitled: true, audience: "rider", source: "individual_academy" });
  });

  it("keeps Academy and Management payment truth independent in both directions", () => {
    const academyOnly = resolveIndividualAcademyEntitlement({
      preferences: JSON.stringify({ academyEntitlementStatus: "active", academyPlan: "rider" }),
    });
    const managementOnly = resolveIndividualAcademyEntitlement({
      preferences: JSON.stringify({ planTier: "stable", subscriptionStatus: "active" }),
    });
    expect(academyOnly).toMatchObject({ entitled: true, source: "individual_academy" });
    expect(managementOnly).toMatchObject({ entitled: false, source: "none" });
  });

  it("preserves explicit teacher and owner Academy audiences without representing them as admin", () => {
    expect(resolveIndividualAcademyEntitlement({
      preferences: JSON.stringify({ academyEntitlementStatus: "active", academyPlan: "teacher" }),
    })).toMatchObject({ entitled: true, audience: "teacher", source: "individual_academy" });
    expect(resolveIndividualAcademyEntitlement({
      preferences: JSON.stringify({ academyEntitlementStatus: "active", academyPlan: "owner" }),
    })).toMatchObject({ entitled: true, audience: "owner", source: "individual_academy" });
  });

  it("preserves existing Academy learner accounts during the product-aware migration", () => {
    expect(resolveIndividualAcademyEntitlement({ preferences: JSON.stringify({ selectedExperience: "student" }) })).toMatchObject({ entitled: true, audience: "rider", source: "legacy_academy" });
  });

  it("allows administrators without granting a customer subscription", () => {
    expect(resolveIndividualAcademyEntitlement({ role: "admin" })).toMatchObject({ entitled: true, audience: "admin", source: "admin_role" });
  });

  it("honours Academy complimentary access without marking it paid", () => {
    const preferences = grantProductComplimentaryAccess({}, {
      product: "academy",
      tier: "rider",
      days: 30,
      now: new Date("2026-09-01T00:00:00.000Z"),
    });
    expect(resolveIndividualAcademyEntitlement({ preferences: JSON.stringify(preferences) })).toMatchObject({
      entitled: true,
      audience: "rider",
      source: "complimentary_academy",
    });
  });

  it("requires an active organization billing entitlement or unexpired trial", () => {
    const now = new Date("2026-09-01T00:00:00.000Z");
    expect(isAcademyOrganizationEntitlementActive({ isActive: true, billingStatus: "active", trialEndsAt: null }, now)).toBe(true);
    expect(isAcademyOrganizationEntitlementActive({ isActive: true, billingStatus: "past_due", trialEndsAt: null }, now)).toBe(false);
    expect(isAcademyOrganizationEntitlementActive({ isActive: true, billingStatus: "not_configured", trialEndsAt: new Date("2026-09-02T00:00:00.000Z") }, now)).toBe(true);
    expect(isAcademyOrganizationEntitlementActive({ isActive: false, billingStatus: "active", trialEndsAt: null }, now)).toBe(false);
  });
});
