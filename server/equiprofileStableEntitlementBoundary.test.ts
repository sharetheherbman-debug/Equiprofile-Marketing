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

  it("blocks legacy lesson and trainer APIs server-side using the effective entitlement", () => {
    expect(trpcCore).toContain('"lessonBookings."');
    expect(trpcCore).toContain('"trainerAvailability."');
    expect(trpcCore).toContain("requiresStableEntitlement(path)");
    expect(trpcCore).toContain("resolveEffectiveManagementEntitlement");
    expect(trpcCore).toContain('state.entitlement.effectivePlanTier === "stable"');
    expect(trpcCore).toContain("state.entitlement.effectiveBothDashboardsUnlocked");
    expect(trpcCore).toContain('code: "FORBIDDEN"');
  });

  it("does not bypass complimentary overlays by reading raw preference access directly", () => {
    expect(trpcCore).not.toContain('prefs.planTier === "stable"');
    expect(trpcCore).not.toContain("prefs.bothDashboardsUnlocked === true");
  });
});
