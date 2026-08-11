import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const connector = readFileSync(
  resolve(process.cwd(), "server/marketingConnector.ts"),
  "utf8",
);
const managementApp = readFileSync(
  resolve(process.cwd(), "client/management/src/ManagementApp.tsx"),
  "utf8",
);
const adminWrapper = readFileSync(
  resolve(process.cwd(), "client/src/pages/AdminEnvironmentSafe.tsx"),
  "utf8",
);
const adminPage = readFileSync(
  resolve(process.cwd(), "client/src/pages/Admin.tsx"),
  "utf8",
);
const legacyMarketingSectionPath = resolve(
  process.cwd(),
  "client/src/pages/AdminCampaigns.tsx",
);
const connectionCard = readFileSync(
  resolve(process.cwd(), "client/src/components/admin/MarketingConnectionCard.tsx"),
  "utf8",
);

describe("EquiProfile owner-only Marketing boundary", () => {
  it("requires the primary owner identity as well as admin role", () => {
    expect(connector).toContain("PRIMARY_ADMIN_EMAIL");
    expect(connector).toContain('context.user.role !== "admin"');
    expect(connector).toContain("signedInEmail !== ownerEmail");
    expect(connector).toContain("EquiProfile owner access required");
    expect(connector).toContain("isTrustedCookieWrite(req)");
  });

  it("routes hidden admin through the owner-safe wrapper without a CSS-hidden Marketing menu", () => {
    expect(managementApp).toContain('import("@/pages/AdminEnvironmentSafe")');
    expect(adminWrapper).toContain("<MarketingConnectionCard />");
    expect(adminWrapper).not.toContain(".lucide-mail");
  });

  it("physically removes the old embedded Marketing admin section", () => {
    expect(existsSync(legacyMarketingSectionPath)).toBe(false);
    expect(adminPage).not.toContain("AdminCampaigns");
    expect(adminPage).not.toContain("Marketing Studio");
    expect(adminPage).not.toContain('activeSection === "campaigns"');
    expect(adminPage).not.toContain('value: "campaigns"');
  });

  it("keeps the standalone connector disabled by default until Phase 2", () => {
    expect(connector).toContain("MARKETING_CONNECTOR_ENABLED");
    expect(connector).toContain("current.enabled");
    expect(connector).toContain("Marketing connector is disabled or not configured");
  });

  it("does not render the Marketing launcher for non-owner admins", () => {
    expect(connectionCard).toContain("response.status === 403");
    expect(connectionCard).toContain("setOwnerDenied(true)");
    expect(connectionCard).toContain("if (ownerDenied) return null");
  });
});
