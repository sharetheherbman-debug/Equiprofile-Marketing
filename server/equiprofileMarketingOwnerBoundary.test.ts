import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const connector = readFileSync(
  resolve(process.cwd(), "server/marketingConnector.ts"),
  "utf8",
);
const adminLauncher = readFileSync(
  resolve(process.cwd(), "client/src/pages/AdminCampaigns.tsx"),
  "utf8",
);

describe("EquiProfile owner-only Marketing boundary", () => {
  it("requires the primary owner identity as well as admin role", () => {
    expect(connector).toContain("PRIMARY_ADMIN_EMAIL");
    expect(connector).toContain('context.user.role !== "admin"');
    expect(connector).toContain("signedInEmail !== ownerEmail");
    expect(connector).toContain("EquiProfile owner access required");
  });

  it("keeps Marketing as a hidden owner operational tool, not a customer feature", () => {
    expect(adminLauncher).toContain("Owner administration");
    expect(adminLauncher).toContain("not part of the customer dashboard or subscription feature set");
    expect(adminLauncher).toContain("<MarketingConnectionCard />");
    expect(adminLauncher).not.toContain("TheMarketingApp");
  });
});
