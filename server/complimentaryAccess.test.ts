import { describe, expect, it } from "vitest";
import {
  grantComplimentaryAccess,
  hasEffectiveManagementAccess,
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

  it("allows an expired paid account only while an active complimentary overlay exists", () => {
    const base = {
      subscriptionStatus: "expired",
      planTier: "pro" as const,
      bothDashboardsUnlocked: false,
    };
    const granted = grantComplimentaryAccess({}, {
      tier: "management_full",
      days: 7,
      now: NOW,
    });

    expect(resolveEffectiveManagementEntitlement(base, granted, NOW)).toMatchObject({
      subscriptionStatus: "expired",
      planTier: "pro",
      effectivePlanTier: "stable",
      effectiveBothDashboardsUnlocked: true,
      complimentaryAccessState: "active",
    });
  });

  it("reads an active legacy free-access preference as a compatibility overlay", () => {
    const legacy = {
      freeAccess: true,
      freeAccessTier: "stable",
      freeAccessUntil: "2026-09-01T12:00:00.000Z",
      planTier: "pro",
    };
    const base = {
      subscriptionStatus: "expired",
      planTier: "pro" as const,
      bothDashboardsUnlocked: false,
    };

    expect(readComplimentaryAccess(legacy)).toMatchObject({ tier: "stable" });
    expect(resolveEffectiveManagementEntitlement(base, legacy, NOW)).toMatchObject({
      effectivePlanTier: "stable",
      complimentaryAccessState: "active",
    });
  });

  it("treats expired legacy free access as expired without blocking a paid subscriber", () => {
    const legacy = {
      freeAccess: true,
      freeAccessUntil: "2026-08-01T12:00:00.000Z",
      planTier: "stable",
    };
    const base = {
      subscriptionStatus: "active",
      planTier: "stable" as const,
      bothDashboardsUnlocked: false,
    };

    expect(resolveEffectiveManagementEntitlement(base, legacy, NOW)).toMatchObject({
      subscriptionStatus: "active",
      effectivePlanTier: "stable",
      complimentaryAccessState: "expired",
    });
  });

  it("suppresses retained legacy flags when the canonical overlay is revoked", () => {
    const revoked = revokeComplimentaryAccess({
      freeAccess: true,
      freeAccessUntil: "2026-09-01T12:00:00.000Z",
      freeAccessDays: 30,
    });

    expect(revoked).toMatchObject({
      complimentaryAccess: null,
      freeAccess: false,
      freeAccessUntil: null,
      freeAccessDays: null,
    });
    expect(readComplimentaryAccess(revoked)).toBeNull();
  });

  it("rejects invalid durations rather than creating an ambiguous entitlement", () => {
    expect(() =>
      grantComplimentaryAccess({}, { tier: "pro", days: 0, now: NOW }),
    ).toThrow("Complimentary access days must be an integer from 1 to 3650");
  });

  it("uses one access predicate for active paid, active complimentary, and trial users", () => {
    const activeOverlay = grantComplimentaryAccess({}, {
      tier: "pro",
      days: 7,
      now: NOW,
    });

    expect(hasEffectiveManagementAccess({
      subscriptionStatus: "active",
      trialEndsAt: null,
      preferences: "{malformed",
    }, NOW)).toBe(true);
    expect(hasEffectiveManagementAccess({
      subscriptionStatus: "expired",
      trialEndsAt: null,
      preferences: JSON.stringify(activeOverlay),
    }, NOW)).toBe(true);
    expect(hasEffectiveManagementAccess({
      subscriptionStatus: "trial",
      trialEndsAt: "2026-08-22T12:00:01.000Z",
      preferences: {},
    }, NOW)).toBe(true);
  });

  it("denies expired overlays and trials without a valid end date while preserving admins", () => {
    const expiredOverlay = grantComplimentaryAccess({}, {
      tier: "stable",
      days: 1,
      now: new Date("2026-08-01T12:00:00.000Z"),
    });

    expect(hasEffectiveManagementAccess({
      subscriptionStatus: "expired",
      preferences: expiredOverlay,
    }, NOW)).toBe(false);
    expect(hasEffectiveManagementAccess({
      subscriptionStatus: "trial",
      trialEndsAt: null,
      preferences: {},
    }, NOW)).toBe(false);
    expect(hasEffectiveManagementAccess({
      role: "admin",
      subscriptionStatus: "expired",
      preferences: {},
    }, NOW)).toBe(true);
  });
});
