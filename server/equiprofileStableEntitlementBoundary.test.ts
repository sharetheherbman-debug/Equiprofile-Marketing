import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const trpcCore = readFileSync(
  resolve(process.cwd(), "server/_core/trpc.ts"),
  "utf8",
);
const routers = readFileSync(
  resolve(process.cwd(), "server/routers.ts"),
  "utf8",
).replace(/\r\n/g, "\n");

describe("EquiProfile Stable server entitlement boundary", () => {
  it("keeps core Stable management routers on stablePlanProcedure", () => {
    expect(routers).toContain("const stablePlanProcedure = subscribedProcedure.use");
    expect(routers).toContain("stables: router({\n    create: stablePlanProcedure");
    expect(routers).toContain("messages: router({\n    getThreads: stablePlanProcedure");
    expect(routers).toContain("breeding: router({\n    createRecord: stablePlanProcedure");
  });

  it("blocks legacy lesson and trainer APIs server-side for non-Stable plans", () => {
    expect(trpcCore).toContain('"lessonBookings."');
    expect(trpcCore).toContain('"trainerAvailability."');
    expect(trpcCore).toContain("requiresStableEntitlement(path)");
    expect(trpcCore).toContain('prefs.planTier === "stable"');
    expect(trpcCore).toContain("prefs.bothDashboardsUnlocked === true");
    expect(trpcCore).toContain('code: "FORBIDDEN"');
  });
});
