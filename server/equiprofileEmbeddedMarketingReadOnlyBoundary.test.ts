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
);

describe("EquiProfile embedded Marketing boundary", () => {
  it("blocks legacy Marketing writes centrally and directs owners to standalone Marketing", () => {
    expect(trpcCore).toContain("isEmbeddedMarketingWrite(path)");
    expect(trpcCore).toContain("Legacy embedded Marketing is read-only");
    expect(trpcCore).toContain("standalone Marketing application");
    expect(trpcCore).toContain('"sendCampaign"');
    expect(trpcCore).toContain('"sendTestEmail"');
    expect(trpcCore).toContain('"publishApprovedScheduleDraft"');
    expect(trpcCore).toContain('"testMarketingProviderTaskRoute"');
    expect(trpcCore).toContain('"connectMarketingPlatform"');
  });

  it("keeps legacy read procedures temporarily available only for inventory and reconciliation", () => {
    expect(routers).toContain("listMarketingCampaignItems: adminUnlockedProcedure");
    expect(routers).toContain("listMarketingSocialConnections: adminUnlockedProcedure");
    expect(routers).toContain("listMarketingScheduleDrafts: adminUnlockedProcedure");
    expect(routers).toContain("getMarketingPublishStatus: adminUnlockedProcedure");
  });
});
