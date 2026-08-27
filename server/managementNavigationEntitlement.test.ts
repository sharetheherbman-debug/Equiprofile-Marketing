import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveEffectiveManagementEntitlement,
  type BaseSubscriptionState,
} from "../shared/managementEntitlement";

const NOW = new Date("2026-08-23T09:00:00.000Z");

function resolve(
  base: BaseSubscriptionState,
  preferences: Record<string, unknown>,
) {
  return resolveEffectiveManagementEntitlement(base, preferences, NOW);
}

describe("Management browser navigation entitlement", () => {
  it("keeps paid Pro on the standard dashboard", () => {
    expect(resolve(
      { subscriptionStatus: "active", planTier: "pro", bothDashboardsUnlocked: false },
      { planTier: "pro" },
    )).toMatchObject({
      effectivePlanTier: "pro",
      effectiveBothDashboardsUnlocked: false,
      complimentaryAccessState: "none",
    });
  });

  it("keeps paid Stable on Stable navigation", () => {
    expect(resolve(
      { subscriptionStatus: "active", planTier: "stable", bothDashboardsUnlocked: false },
      { planTier: "stable" },
    )).toMatchObject({
      effectivePlanTier: "stable",
      effectiveBothDashboardsUnlocked: false,
    });
  });

  it("renders Stable navigation for an active complimentary Stable grant over paid Pro", () => {
    expect(resolve(
      { subscriptionStatus: "active", planTier: "pro", bothDashboardsUnlocked: false },
      {
        planTier: "pro",
        complimentaryAccess: {
          version: 1,
          tier: "stable",
          startsAt: "2026-08-22T09:00:00.000Z",
          endsAt: "2026-09-22T09:00:00.000Z",
        },
      },
    )).toMatchObject({
      effectivePlanTier: "stable",
      effectiveBothDashboardsUnlocked: false,
      complimentaryAccessState: "active",
    });
  });

  it("renders both dashboard switchers for an active full Management grant", () => {
    expect(resolve(
      { subscriptionStatus: "expired", planTier: "pro", bothDashboardsUnlocked: false },
      {
        planTier: "pro",
        complimentaryAccess: {
          version: 1,
          tier: "management_full",
          startsAt: "2026-08-22T09:00:00.000Z",
          endsAt: null,
        },
      },
    )).toMatchObject({
      effectivePlanTier: "stable",
      effectiveBothDashboardsUnlocked: true,
      complimentaryAccessState: "active",
    });
  });

  it("falls back to the paid plan when complimentary access expires", () => {
    expect(resolve(
      { subscriptionStatus: "active", planTier: "pro", bothDashboardsUnlocked: false },
      {
        planTier: "pro",
        complimentaryAccess: {
          version: 1,
          tier: "stable",
          startsAt: "2026-07-01T09:00:00.000Z",
          endsAt: "2026-08-01T09:00:00.000Z",
        },
      },
    )).toMatchObject({
      effectivePlanTier: "pro",
      effectiveBothDashboardsUnlocked: false,
      complimentaryAccessState: "expired",
    });
  });

  it("forces both navigation and route/paywall gates to consume the shared entitlement", () => {
    const dashboard = fs.readFileSync(
      path.resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"),
      "utf8",
    );
    const protectedRoute = fs.readFileSync(
      path.resolve(process.cwd(), "client/src/components/ProtectedRoute.tsx"),
      "utf8",
    );

    expect(dashboard).toContain('from "@shared/managementEntitlement"');
    expect(dashboard).toContain("resolveEffectiveManagementEntitlement(");
    expect(dashboard).toContain("managementEntitlement.effectivePlanTier");
    expect(dashboard).toContain("managementEntitlement.effectiveBothDashboardsUnlocked");

    expect(protectedRoute).toContain('from "@shared/managementEntitlement"');
    expect(protectedRoute).toContain("resolveEffectiveManagementEntitlement(");
    expect(protectedRoute).toContain('managementEntitlement.complimentaryAccessState === "active"');
    expect(protectedRoute).toContain("managementEntitlement.effectivePlanTier === \"stable\"");
    expect(protectedRoute).toContain("!complimentaryAccessActive");
  });
});
