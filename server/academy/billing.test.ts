import { describe, expect, it } from "vitest";
import {
  academyBillingConfig,
  academyPlanLimits,
  academySubscriptionStatus,
  isAcademyScopedMetadata,
} from "./billing";

describe("Academy billing configuration", () => {
  const environment: NodeJS.ProcessEnv = {
    ENABLE_ACADEMY_BILLING: "true",
    ACADEMY_STRIPE_TEST_MODE: "true",
    ACADEMY_STRIPE_SECRET_KEY: "sk_test_academy_only",
    ACADEMY_STRIPE_SCHOOL_10_MONTHLY_PRICE_ID: "price_school10_month",
    ACADEMY_STRIPE_SCHOOL_10_YEARLY_PRICE_ID: "price_school10_year",
    ACADEMY_STRIPE_SCHOOL_20_MONTHLY_PRICE_ID: "price_school20_month",
    ACADEMY_STRIPE_SCHOOL_20_YEARLY_PRICE_ID: "price_school20_year",
    ACADEMY_STRIPE_SCHOOL_50_MONTHLY_PRICE_ID: "price_school50_month",
    ACADEMY_STRIPE_SCHOOL_50_YEARLY_PRICE_ID: "price_school50_year",
    ACADEMY_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID: "price_enterprise_month",
    ACADEMY_STRIPE_ENTERPRISE_YEARLY_PRICE_ID: "price_enterprise_year",
  };

  it("selects only the server-owned TEST price for the requested Academy plan and interval", () => {
    expect(academyBillingConfig(environment, "school_20", "yearly")).toEqual({
      configured: true,
      secretKey: "sk_test_academy_only",
      priceId: "price_school20_year",
    });
  });

  it("fails closed when billing is disabled, TEST mode is absent, or a non-test credential is supplied", () => {
    expect(academyBillingConfig({}, "school_10", "monthly")).toMatchObject({
      configured: false,
    });
    expect(
      academyBillingConfig(
        { ...environment, ACADEMY_STRIPE_TEST_MODE: "false" },
        "school_10",
        "monthly",
      ),
    ).toMatchObject({
      configured: false,
      reason: expect.stringMatching(/TEST/i),
    });
    expect(
      academyBillingConfig(
        { ...environment, ACADEMY_STRIPE_SECRET_KEY: "sk_live_not_allowed" },
        "school_10",
        "monthly",
      ),
    ).toMatchObject({
      configured: false,
      reason: expect.stringMatching(/TEST/i),
    });
  });

  it("accepts only Academy-scoped numeric organization metadata and maps Stripe lifecycle status conservatively", () => {
    expect(
      isAcademyScopedMetadata({
        academyScope: "academy",
        organizationId: "19",
      }),
    ).toBe(true);
    expect(
      isAcademyScopedMetadata({ academyScope: "store", organizationId: "19" }),
    ).toBe(false);
    expect(
      isAcademyScopedMetadata({
        academyScope: "academy",
        organizationId: "org_19",
      }),
    ).toBe(false);
    expect(academySubscriptionStatus("active")).toBe("active");
    expect(academySubscriptionStatus("past_due")).toBe("past_due");
    expect(academySubscriptionStatus("incomplete_expired")).toBe("expired");
    expect(academySubscriptionStatus("canceled")).toBe("cancelled");
  });

  it("preserves defined plan seat limits without accepting browser-provided limits", () => {
    expect(academyPlanLimits("school_10")).toEqual({
      maxStudents: 10,
      maxTeachers: 2,
    });
    expect(academyPlanLimits("school_enterprise")).toEqual({
      maxStudents: 999,
      maxTeachers: 50,
    });
  });
});
