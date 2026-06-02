import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  coerceInvalidCompletedMediaStatus,
  hasPlayableMediaLocation,
  isPlayableMediaAsset,
  isPlayableMediaMimeForType,
} from "./_core/ai/mediaPlayability";

const repoRoot = path.resolve(import.meta.dirname, "..");

describe("PR62B media truth guards", () => {
  it("requires playable location + compatible image mime for completed image assets", () => {
    expect(isPlayableMediaMimeForType("image", "image/png")).toBe(true);
    expect(hasPlayableMediaLocation({ publicUrl: "https://cdn.example.com/a.png" })).toBe(true);
    expect(isPlayableMediaAsset({
      type: "image",
      task: "text_to_image",
      status: "completed",
      publicUrl: "https://cdn.example.com/a.png",
      localPath: null,
      mimeType: "image/png",
    })).toBe(true);
  });

  it("blocks text/plain from being treated as completed playable image", () => {
    const coerced = coerceInvalidCompletedMediaStatus({
      type: "image",
      task: "text_to_image",
      status: "completed",
      publicUrl: "https://cdn.example.com/result.txt",
      localPath: null,
      mimeType: "text/plain",
      outputMetadata: { resultType: "text" },
    });
    expect(coerced.status).toBe("failed");
    expect(coerced.outputMetadata.mediaTruth).toBe("not_playable");
  });

  it("blocks prompt-only output from being completed image when url/path is missing", () => {
    const coerced = coerceInvalidCompletedMediaStatus({
      type: "image",
      task: "text_to_image",
      status: "completed",
      publicUrl: null,
      localPath: null,
      mimeType: null,
      outputMetadata: { resultType: "prompt_only" },
    });
    expect(coerced.status).toBe("failed");
    expect(String(coerced.errorMessage)).toContain("Marked not complete");
  });
});

describe("PR62B broken completed media repair", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("repairs completed media rows with no playable URL/path and records repair metadata", async () => {
    const rows = [
      {
        id: 11,
        type: "image",
        status: "completed",
        publicUrl: null,
        localPath: null,
        outputMetadataJson: JSON.stringify({ resultType: "prompt_only" }),
        tenantType: "individual",
        tenantId: "global",
        userId: null,
        campaignId: null,
        draftId: null,
        jobId: null,
        provider: "qwen",
        task: "text_to_image",
        thumbnailUrl: null,
        mimeType: null,
        fileSizeBytes: null,
        durationSeconds: null,
        width: null,
        height: null,
        generationPrompt: "prompt",
        generationSettingsJson: null,
        errorMessage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const updates: Array<{ id: number; payload: Record<string, unknown> }> = [];

    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => ({
        select: () => ({
          from: () => ({
            where: () => ({
              orderBy: () => ({
                limit: async () => rows,
              }),
            }),
          }),
        }),
        update: () => ({
          set: (payload: Record<string, unknown>) => ({
            where: (clause: unknown) => {
              updates.push({
                id: rows[0].id,
                payload,
              });
              return clause;
            },
          }),
        }),
      })),
    }));

    const { repairBrokenCompletedMediaAssets } = await import("./modules/growth-engine/mediaAssets");
    const result = await repairBrokenCompletedMediaAssets({ limit: 100 });
    expect(result.scanned).toBe(1);
    expect(result.repaired).toBe(1);
    expect(updates.length).toBe(1);
    expect(updates[0].payload.status).toBe("failed");
    expect(String(updates[0].payload.errorMessage)).toContain("no playable media URL or local path");
    expect(String(updates[0].payload.outputMetadataJson)).toContain("PR62B_media_truth_repair");
  });

  it("updateMediaAsset persists guard-driven failed status when existing completed asset is not playable and patch.status is omitted", async () => {
    const existingRow = {
      id: 22,
      type: "image",
      status: "completed",
      publicUrl: null,
      localPath: null,
      outputMetadataJson: JSON.stringify({ resultType: "prompt_only" }),
      tenantType: "individual",
      tenantId: "global",
      userId: null,
      campaignId: null,
      draftId: null,
      jobId: null,
      provider: "qwen",
      task: "text_to_image",
      thumbnailUrl: null,
      mimeType: null,
      fileSizeBytes: null,
      durationSeconds: null,
      width: null,
      height: null,
      generationPrompt: "prompt",
      generationSettingsJson: null,
      errorMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updates: Array<Record<string, unknown>> = [];

    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => ({
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [existingRow],
            }),
          }),
        }),
        update: () => ({
          set: (payload: Record<string, unknown>) => {
            updates.push(payload);
            return {
              where: (_clause: unknown) => true,
            };
          },
        }),
      })),
    }));

    const { updateMediaAsset } = await import("./modules/growth-engine/mediaAssets");
    await updateMediaAsset(existingRow.id, {
      outputMetadata: { resultType: "prompt_only" },
    });

    expect(updates.length).toBe(1);
    expect(updates[0].status).toBe("failed");
    expect(String(updates[0].errorMessage)).toContain("Marked not complete");
    expect(String(updates[0].outputMetadataJson)).toContain("mediaTruth");
    expect(String(updates[0].outputMetadataJson)).toContain("not_playable");
  });
});

describe("PR62B generateMarketingImageAsset truth", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns setup_needed when no image provider route is ready", async () => {
    const createMediaAsset = vi.fn(async (input: Record<string, unknown>) => ({ id: 77, ...input }));
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      resolveMarketingProviderRoute: vi.fn(async () => ({
        status: "setup_needed",
        reason: "No ready provider model found for the requested marketing task.",
        selected: null,
        candidates: [],
      })),
      createMarketingProviderHealthCheck: vi.fn(async () => 1),
    }));
    vi.doMock("./modules/growth-engine", () => ({
      createMediaAsset,
      getMediaAssetById: vi.fn(async () => null),
      getMediaAssetByJobId: vi.fn(async () => null),
    }));
    vi.doMock("./_core/ai/orchestrator", () => ({
      executeAITask: vi.fn(async () => ({ status: "queued", task: "text_to_image", jobId: "job-1" })),
    }));

    const { generateMarketingImageAsset } = await import("./modules/marketing/image-generation");
    const result = await generateMarketingImageAsset({
      tenantId: "t",
      workspaceId: "w",
      qualityMode: "standard",
      prompt: "Create a premium image ad for EquiProfile targeting stable owners.",
      hostAppId: "equiprofile",
    });

    expect(result.status).toBe("setup_needed");
    expect(result.setupNeeded.length).toBeGreaterThan(0);
    expect(createMediaAsset).toHaveBeenCalledTimes(1);
  });

  it("returns completed when mocked provider output resolves to a playable image asset", async () => {
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "elite" })),
      resolveMarketingProviderRoute: vi.fn(async () => ({
        status: "ready",
        reason: null,
        selected: { provider: "qwen", modelId: "qwen-image", category: "image", canonicalTask: "text_to_image", routeType: "model" },
        candidates: [{ provider: "qwen", setupStatus: "ready" }],
      })),
      createMarketingProviderHealthCheck: vi.fn(async () => 1),
    }));
    vi.doMock("./_core/ai/orchestrator", () => ({
      executeAITask: vi.fn(async () => ({ status: "queued", task: "text_to_image", jobId: "job_42" })),
    }));
    vi.doMock("./modules/growth-engine", () => ({
      createMediaAsset: vi.fn(async () => ({ id: 1 })),
      getMediaAssetById: vi.fn(async () => null),
      getMediaAssetByJobId: vi.fn(async () => ({
        id: 42,
        status: "completed",
        type: "image",
        task: "text_to_image",
        publicUrl: "https://cdn.example.com/image.png",
        localPath: null,
        mimeType: "image/png",
        outputMetadata: { mediaTruth: "playable" },
      })),
    }));

    const { generateMarketingImageAsset } = await import("./modules/marketing/image-generation");
    const result = await generateMarketingImageAsset({
      tenantId: "t",
      workspaceId: "w",
      qualityMode: "elite",
      prompt: "Create a premium image ad for EquiProfile targeting stable owners.",
      hostAppId: "equiprofile",
    });

    expect(result.status).toBe("completed");
    expect(result.publicUrl).toContain("image.png");
    expect(result.provider).toBe("qwen");
    expect(result.model).toBe("qwen-image");
  });
});

describe("PR62B frontend image action + asset card truth", () => {
  it("wires Generate Image Ad flow and setup_needed handling in TheMarketingApp", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
      "utf8",
    );
    expect(source).toContain("generateMarketingImageAsset");
    // PR64F: image creative remains explicit-only and secondary to full campaigns.
    expect(source).toContain("Image creative generated for review");
    expect(source).toContain("image_ad");
    expect(source).not.toContain("fake preview");
  });

  it("asset card gates Open/Download behind completed playable status and collapses long prompts", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "client/src/components/marketing/app/MarketingAppPanels.tsx"),
      "utf8",
    );
    expect(source).toContain("const canOpenAsset = Boolean(asset.publicUrl && status === \"completed\")");
    expect(source).toContain("Prompt details");
    expect(source).toContain("shortPrompt");
  });

  it("documents generateMarketingImageAsset as first-class PR62B flow (not legacy)", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "server/routers.ts"),
      "utf8",
    );
    const marker = "generateMarketingImageAsset: adminUnlockedProcedure";
    const markerIndex = source.indexOf(marker);
    expect(markerIndex).toBeGreaterThan(-1);
    const nearbyComment = source.slice(Math.max(0, markerIndex - 350), markerIndex);
    expect(nearbyComment).toContain(
      "PR62B first-class Marketing App image generation flow. This returns playable image output when configured, or setup_needed/failed truthfully.",
    );
    expect(nearbyComment).not.toContain("LEGACY COMPATIBILITY ONLY");
  });
});
