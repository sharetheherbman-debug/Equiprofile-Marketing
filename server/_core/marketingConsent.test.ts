import { describe, expect, it } from "vitest";
import { resolveMarketingConsent } from "./marketingConsent";

describe("resolveMarketingConsent", () => {
  it("recognises only the explicit marketing-analytics opt-in", () => {
    expect(
      resolveMarketingConsent(
        JSON.stringify({
          notifications: { marketingAnalyticsConsent: true },
        }),
      ),
    ).toBe("marketing_opt_in");
  });

  it.each([
    undefined,
    null,
    "not-json",
    JSON.stringify({}),
    JSON.stringify({ notifications: { marketingAnalyticsConsent: false } }),
    JSON.stringify({ notifications: { emailNotifications: true } }),
    { notifications: { weeklyDigest: true } },
  ])("fails closed for %j", (preferences) => {
    expect(resolveMarketingConsent(preferences)).toBe("unknown");
  });
});
