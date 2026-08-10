import { readFileSync } from "fs";
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
const legacyMarketingSection = readFileSync(
  resolve(process.cwd(), "client/src/pages/AdminCampaigns.tsx"),
  "utf8",
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

  it("routes the hidden admin page through the owner-safe wrapper", () => {
    expect(managementApp).toContain('import("@/pages/AdminEnvironmentSafe")');
    expect(adminWrapper).toContain("<MarketingConnectionCard />");
    expect(adminWrapper).toContain('[role=\"menuitem\"]:has(.lucide-mail)');
  });

  it("keeps the old embedded Marketing section non-executable and without a launcher", () => {
    expect(legacyMarketingSection).not.toContain("MarketingConnectionCard");
    expect(legacyMarketingSection).not.toContain("TheMarketingApp");
    expect(legacyMarketingSection).toContain("Embedded Marketing retired");
  });

  it("does not render the Marketing launcher for non-owner admins", () => {
    expect(connectionCard).toContain("response.status === 403");
    expect(connectionCard).toContain("setOwnerDenied(true)");
    expect(connectionCard).toContain("if (ownerDenied) return null");
  });
});
