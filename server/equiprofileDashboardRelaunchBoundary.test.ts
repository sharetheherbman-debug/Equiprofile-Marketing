import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const uiVersion = readFileSync(
  resolve(process.cwd(), "client/src/config/uiVersion.ts"),
  "utf8",
);
const managementApp = readFileSync(
  resolve(process.cwd(), "client/management/src/ManagementApp.tsx"),
  "utf8",
).replace(/\r\n/g, "\n");
const managementV2Gate = readFileSync(
  resolve(process.cwd(), "client/src/v2/pages/ManagementDashboardV2.tsx"),
  "utf8",
);

describe("EquiProfile V2 relaunch dashboard boundary", () => {
  it("makes V2 the default while retaining V1 only as an explicit rollback", () => {
    expect(uiVersion).toContain('if (envVersion === "v1") return "v1"');
    expect(uiVersion).toContain('return "v2"');
    expect(managementApp).toContain('import("@/v2/pages/ManagementDashboardV2")');
  });

  it("does not send education plans to non-existent Management dashboard routes", () => {
    expect(managementV2Gate).toContain('setLocation("/onboarding")');
    expect(managementV2Gate).not.toContain("/student-dashboard");
    expect(managementV2Gate).not.toContain("/teacher-dashboard");
    expect(managementV2Gate).not.toContain("/school-dashboard");
  });

  it("routes Stable-only customer surfaces through StableRoute", () => {
    for (const path of ["/stable", "/stable-dashboard", "/staff", "/stable-setup", "/stable-reports", "/messages", "/lessons", "/breeding"]) {
      const marker = `<Route path=\"${path}\">`;
      expect(managementApp).toContain(marker);
    }
    expect(managementApp).toContain('<Route path="/messages">\n              <StableRoute>');
  });
});
