import { describe, expect, it } from "vitest";
import {
  grantComplimentaryAccess,
  readComplimentaryAccess,
  resolveEffectiveManagementEntitlement,
  revokeComplimentaryAccess,
} from "./complimentaryAccess";

const NOW = new Date("2026-08-21T12:00:00.000Z");

describe("complimentary Management access overlay", () => {
  it("grants temporary Stable access without rewriting the paid Pro subscription", () => {
    const base = {
      subscriptionStatus: "active",
      planTier: "pro" as const,
      bothDashboardsUnlocked: false,
    };
    const prefs = { planTier: "pro", customerPreference: "keep-me" };
    const granted = grantComplimentaryAccess(prefs, {
      tier: "stable",
      days: 30,
      now: NOW,
      grantedByUserId: 99,
      reason: "Service recovery",
    });

    expect(granted.planTier).toBe("pro");
    expect(granted.customerPreference).toBe("keep-me");
    expect(readComplimentaryAccess(granted)?.tier).toBe("stable");
    expect(resolveEffectiveManagementEntitlement(base, granted, NOW)).toMatchObject({
      subscriptionStatus: "active",
      planTier: "pro",
      effectivePlanTier: "stable",
      effectiveBothDashboardsUnlocked: false,
      complimentaryAccessState: "active",
    });
  });

  it("falls back to the paid plan after expiry instead of blocking the subscriber", () => {
    const base = {
      subscriptionStatus: "active",
      planTier: "stable" as const,
      bothDashboardsUnlocked: false,
    };
    const granted = grantComplimentaryAccess({}, {
      tier: "pro",
      days: 7,
      now: NOW,
    });
    const afterExpiry = new Date("2026-08-29T12:00:00.000Z");

    expect(
      resolveEffectiveManagementEntitlement(base, granted, afterExpiry),
    ).toMatchObject({
      subscriptionStatus: "active",
      planTier: "stable",
      effectivePlanTier: "stable",
      complimentaryAccessState: "expired",
    });
  });

  it("revokes only the overlay and leaves the underlying entitlement untouched", () => {
    const base = {
      subscriptionStatus: "active",
      planTier: "stable" as const,
      bothDashboardsUnlocked: true,
    };
    const original = {
      planTier: "stable",
      bothDashboardsUnlocked: true,
      stripeCustomerMarker: "preserved",
    };
    const granted = grantComplimentaryAccess(original, {
      tier: "pro",
      days: 14,
      now: NOW,
    });
    const revoked = revokeComplimentaryAccess(granted);

    expect(revoked).toMatchObject(original);
    expect(revoked.complimentaryAccess).toBeNull();
    expect(resolveEffectiveManagementEntitlement(base, revoked, NOW)).toMatchObject({
      subscriptionStatus: "active",
      planTier: "stable",
      effectivePlanTier: "stable",
      effectiveBothDashboardsUnlocked: true,
      complimentaryAccessState: "none",
    });
  });

  it("supports an explicit no-expiry full Management grant without mutating billing", () => {
    const base = {
      subscriptionStatus: "trial",
      planTier: "pro" as const,
      bothDashboardsUnlocked: false,
    };
    const granted = grantComplimentaryAccess({}, {
      tier: "management_full",
      days: null,
      now: NOW,
    });

    expect(readComplimentaryAccess(granted)?.endsAt).toBeNull();
    expect(resolveEffectiveManagementEntitlement(base, granted, NOW)).toMatchObject({
      subscriptionStatus: "trial",
      planTier: "pro",
      effectivePlanTier: "stable",
      effectiveBothDashboardsUnlocked: true,
      complimentaryAccessState: "active",
      complimentaryAccessUntil: null,
    });
  });

  it("rejects invalid durations rather than creating an ambiguous entitlement", () => {
    expect(() =>
      grantComplimentaryAccess({}, { tier: "pro", days: 0, now: NOW }),
    ).toThrow("Complimentary access days must be an integer from 1 to 3650");
  });
});
