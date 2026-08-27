import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const managementApp = readFileSync(
  resolve(process.cwd(), "client/management/src/ManagementApp.tsx"),
  "utf8",
);
const protectedRoute = readFileSync(
  resolve(process.cwd(), "client/src/components/ProtectedRoute.tsx"),
  "utf8",
);
const trpc = readFileSync(
  resolve(process.cwd(), "server/_core/trpc.ts"),
  "utf8",
);
const proDashboard = readFileSync(
  resolve(process.cwd(), "client/src/v2/pages/ManagementDashboardV2.tsx"),
  "utf8",
);

describe("EquiProfile release access boundary", () => {
  it("keeps every Stable-only management route behind StableRoute", () => {
    for (const route of [
      "/breeding",
      "/lessons",
      "/stable",
      "/stable-dashboard",
      "/staff",
      "/stable-setup",
      "/stable-reports",
      "/messages",
    ]) {
      const routeIndex = managementApp.indexOf(`<Route path=\"${route}\">`);
      expect(routeIndex, `${route} route missing`).toBeGreaterThan(-1);
      const routeEnd = managementApp.indexOf("</Route>", routeIndex);
      expect(routeEnd, `${route} route closing tag missing`).toBeGreaterThan(routeIndex);
      const routeBlock = managementApp.slice(routeIndex, routeEnd + "</Route>".length);
      expect(routeBlock, `${route} must use StableRoute`).toContain("<StableRoute>");
      expect(routeBlock, `${route} must not fall back to ProtectedRoute`).not.toContain(
        "<ProtectedRoute>",
      );
    }
  });

  it("keeps owner/admin routes behind admin role protection", () => {
    for (const route of ["/admin", "/qa-check"]) {
      const routeIndex = managementApp.indexOf(`<Route path=\"${route}\">`);
      expect(routeIndex, `${route} route missing`).toBeGreaterThan(-1);
      const routeEnd = managementApp.indexOf("</Route>", routeIndex);
      expect(routeEnd, `${route} route closing tag missing`).toBeGreaterThan(routeIndex);
      const routeBlock = managementApp.slice(routeIndex, routeEnd + "</Route>".length);
      expect(routeBlock).toContain("<ProtectedRoute requireAdmin>");
    }
  });

  it("keeps the normal V2 dashboard free of Marketing and Stable-only customer tools", () => {
    expect(proDashboard).not.toContain("MarketingConnectionCard");
    expect(proDashboard).not.toContain("Marketing Studio");
    expect(proDashboard).not.toContain("/ai-marketing");
    for (const stableOnlyPath of [
      'path: "/lessons"',
      'path: "/stable"',
      'path: "/stable-dashboard"',
      'path: "/staff"',
      'path: "/stable-reports"',
      'path: "/messages"',
    ]) {
      expect(proDashboard).not.toContain(stableOnlyPath);
    }
  });

  it("enforces effective Stable entitlement in both the client wrapper and legacy server namespaces", () => {
    expect(protectedRoute).toContain("return <ProtectedRoute stableOnly>{children}</ProtectedRoute>");
    expect(protectedRoute).toContain('from "@shared/managementEntitlement"');
    expect(protectedRoute).toContain("resolveEffectiveManagementEntitlement(");
    expect(protectedRoute).toContain('managementEntitlement.effectivePlanTier === "stable"');
    expect(protectedRoute).toContain('managementEntitlement.complimentaryAccessState === "active"');
    expect(trpc).toContain('"lessonBookings."');
    expect(trpc).toContain('"trainerAvailability."');
    expect(trpc).toContain("This feature requires the Stable plan. Please upgrade to continue.");
  });

  it("does not expose the removed public Marketing product route", () => {
    expect(managementApp).not.toContain('/ai-marketing');
    expect(managementApp).not.toContain("AIMarketingLanding");
  });
});
