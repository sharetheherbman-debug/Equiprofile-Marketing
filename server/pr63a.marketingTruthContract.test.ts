import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "..");

function read(file: string): string {
  return fs.readFileSync(path.join(repoRoot, file), "utf8");
}

describe("PR63A creation capability truth contract", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns required creation types with truthful statuses", async () => {
    const policySpy = vi.fn((mode: "standard" | "elite") => ({ mode }));
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: policySpy,
      resolveMarketingProviderRoute: vi.fn(async ({ task }: { task: string }) => {
        const setupNeededTasks = new Set(["image_generation", "avatar_generation", "avatar_lipsync", "voiceover"]);
        if (setupNeededTasks.has(task)) {
          return {
            status: "setup_needed",
            reason: `No ready provider model found for ${task}`,
            selected: null,
            candidates: [],
          };
        }
        return {
          status: "ready",
          reason: null,
          selected: {
            provider: "qwen",
            modelId: `${task}-model`,
          },
          candidates: [],
        };
      }),
    }));
    vi.doMock("./modules/marketing/backend-readiness", () => ({
      getMarketingBackendReadiness: vi.fn(async () => ({
        mediaFactoryConfigStatus: "setup_needed",
        schedulingExportReadiness: "ready",
      })),
    }));

    const { getMarketingCreationCapabilities } = await import("./modules/marketing/creation-capabilities");

    const result = await getMarketingCreationCapabilities({
      tenantId: "global",
      workspaceId: "default",
      hostAppId: "equiprofile",
    });

    expect(result.qualityMode).toBe("standard");
    expect(policySpy).toHaveBeenCalledWith("standard");

    const byId = new Map(result.capabilities.map((item) => [item.id, item]));
    for (const id of [
      "image_ad",
      "video_ad_30s",
      "assembled_video_3m",
      "signup_campaign",
      "social_post",
      "email_campaign",
      "blog_seo",
      "weekly_content_pack",
      "avatar_video",
    ]) {
      expect(byId.has(id), `Missing capability: ${id}`).toBe(true);
    }

    expect(byId.get("image_ad")?.status).toBe("setup_needed");
    expect(byId.get("image_ad")?.outputGuarantee).toBe("setup_needed");
    expect(byId.get("image_ad")?.viewerContract?.viewer).toBe("setup_blocker");
    expect(byId.get("video_ad_30s")?.status).toBe("planned_only");
    expect(byId.get("video_ad_30s")?.outputGuarantee).toBe("package_only");
    expect(byId.get("video_ad_30s")?.viewerContract?.viewer).toBe("deliverable_package");
    expect(byId.get("assembled_video_3m")?.status).toBe("planned_only");
    expect(byId.get("assembled_video_3m")?.outputGuarantee).toBe("plan_only");
    expect(byId.get("assembled_video_3m")?.viewerContract?.viewer).toBe("video_plan");
    expect(byId.get("assembled_video_3m")?.missingSetup.join(" ")).toContain("FFmpeg/Remotion");
    expect(byId.get("avatar_video")?.status).toBe("setup_needed");
    expect(byId.get("avatar_video")?.executionLevel).toBe("blocked");
    expect(byId.get("avatar_video")?.proofRequired.length).toBeGreaterThan(0);
    expect(byId.get("signup_campaign")?.outputGuarantee).toBe("package_only");
    expect(byId.get("signup_campaign")?.viewerContract?.viewer).toBe("deliverable_package");

    expect(byId.get("social_post")?.status).toBe("not_wired");
    expect(byId.get("social_post")?.outputGuarantee).toBe("not_wired");
    expect(byId.get("email_campaign")?.status).toBe("not_wired");
    expect(byId.get("blog_seo")?.status).toBe("not_wired");
    expect(byId.get("weekly_content_pack")?.status).toBe("not_wired");
  });

  it("keeps frontend default quality mode as standard", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    expect(app).toContain('const [quality, setQuality] = useState<QualityMode>("standard")');
    expect(app).toContain('qualityMode: "standard"');
  });

  it("settings checklist uses task-route truth for media capabilities", () => {
    const settings = read("client/src/components/marketing/app/MarketingAppSettings.tsx");
    expect(settings).toContain('isTaskReady("image_generation")');
    expect(settings).toContain('isTaskReady("voiceover")');
    expect(settings).toContain('isTaskReady("music_generation")');
    expect(settings).toContain('isTaskReady("avatar_generation")');
    expect(settings).toContain("mediaFactoryConfigStatus");
    expect(settings).toContain("Output guarantee truth");
    expect(settings).toContain("getMarketingCreationCapabilities");
  });

  it("TheMarketingApp keeps truthful output states without exposing diagnostic grouping in the primary menu", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    expect(app).toContain("Setup / blocker output");
    expect(app).toContain("Plan-only output");
    expect(app).toContain("Advanced");
    expect(app).toContain("futureCapabilities.length > 0");
    expect(app).not.toContain('>{"Ready now"}<');
    expect(app).not.toContain('>{"Package / plan only"}<');
    expect(app).not.toContain('>{"Needs setup"}<');
    expect(app).not.toContain('disabled={group.title === "Future / not wired"}');
  });

  it("keeps avatar capability as queued/setup truth without claiming playable preview", async () => {
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      resolveMarketingProviderRoute: vi.fn(async ({ task }: { task: string }) => ({
        status: "ready",
        reason: null,
        selected: { provider: "qwen", modelId: `${task}-model` },
        candidates: [],
      })),
    }));
    vi.doMock("./modules/marketing/backend-readiness", () => ({
      getMarketingBackendReadiness: vi.fn(async () => ({
        mediaFactoryConfigStatus: "ready",
        schedulingExportReadiness: "ready",
      })),
    }));

    const { getMarketingCreationCapabilities } = await import("./modules/marketing/creation-capabilities");
    const result = await getMarketingCreationCapabilities({
      tenantId: "global",
      workspaceId: "default",
      hostAppId: "equiprofile",
      qualityMode: "standard",
    });
    const avatar = result.capabilities.find((item) => item.id === "avatar_video");
    expect(avatar?.outputGuarantee).toBe("queued_media");
    expect(avatar?.viewerContract.viewer).toBe("media_job");
    expect(avatar?.canPreview).toBe(false);
    expect(avatar?.canGenerate).toBe(false);
  });
});

describe("PR63A schedule/export runtime safety", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("listMarketingScheduleDraftRecords returns [] safely when no drafts exist", async () => {
    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => ({
        select: () => ({
          from: () => ({
            where: () => ({
              orderBy: () => ({
                limit: async () => [],
              }),
            }),
          }),
        }),
      })),
    }));

    const { listMarketingScheduleDraftRecords } = await import("./modules/growth-engine/persistence");
    const rows = await listMarketingScheduleDraftRecords({ tenantId: "global", workspaceId: "default" });
    expect(rows).toEqual([]);
  });

  it("buildScheduleExportPack handles empty and populated drafts truthfully", async () => {
    const { buildScheduleExportPack } = await import("./modules/marketing/social-publishing/scheduleExportPackBuilder");

    const emptyPack = buildScheduleExportPack({
      tenantId: "global",
      workspaceId: "default",
      drafts: [],
    });
    expect(emptyPack.totalItems).toBe(0);
    expect(emptyPack.platformGroups).toEqual([]);

    const populatedPack = buildScheduleExportPack({
      tenantId: "global",
      workspaceId: "default",
      drafts: [
        {
          id: 1,
          tenantId: "global",
          workspaceId: "default",
          campaignId: 10,
          campaignItemId: 11,
          platform: "Facebook",
          title: "Stable owner launch",
          content: "Body",
          scheduledFor: "2026-06-05T09:00:00.000Z",
          status: "draft",
          reviewStatus: "needs_review",
          metadataJson: null,
          createdAt: "2026-06-01T09:00:00.000Z",
          updatedAt: "2026-06-01T09:00:00.000Z",
        },
      ],
    });
    expect(populatedPack.totalItems).toBe(1);
    expect(populatedPack.platformGroups[0]?.platform).toBe("Facebook");
  });
});

describe("PR63A runtime CREATE TABLE/index consistency", () => {
  it("marketingBeastModeVariants indexes reference existing CREATE TABLE columns", () => {
    const source = read("server/db.ts");
    const startMarker = "CREATE TABLE IF NOT EXISTS \\`marketingBeastModeVariants\\` (";
    const endMarker = "CREATE TABLE IF NOT EXISTS \\`marketingVisualQaRecords\\` (";
    const start = source.indexOf(startMarker);
    expect(start).toBeGreaterThan(-1);
    const end = source.indexOf(endMarker, start);
    expect(end).toBeGreaterThan(start);
    const createSegment = source.slice(start, end);

    const columnMatches = [...createSegment.matchAll(/^\s*\\?`([^`]+)\\?`\s+/gm)];
    const columns = new Set(columnMatches.map((match) => match[1]));

    const indexMatches = [...createSegment.matchAll(/KEY\s+\\?`[^`]+\\?`\s*\(([^)]+)\)/g)];
    expect(indexMatches.length).toBeGreaterThan(0);

    for (const indexMatch of indexMatches) {
      const cols = [...indexMatch[1].matchAll(/\\?`([^`]+)\\?`/g)].map((m) => m[1]);
      expect(cols.length).toBeGreaterThan(0);
      for (const col of cols) {
        expect(columns.has(col), `Index references missing column: ${col}`).toBe(true);
      }
    }
  });
});
