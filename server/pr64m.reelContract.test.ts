import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import { execa } from "execa";
import { describe, expect, it } from "vitest";
import { compileMarketingTimeline } from "./modules/marketing/media-factory/marketingTimelineCompiler";
import { renderMarketingTimeline } from "./modules/marketing/media-factory/marketingRenderer";
import type { MarketingStudioPlan } from "../shared/_core/marketingStudioPlan";

function basePlan(overrides: Partial<MarketingStudioPlan> = {}): MarketingStudioPlan {
  return {
    id: "pr64m-plan",
    workspaceId: "equiprofile-global",
    hostAppId: "equiprofile",
    contentType: "facebook_ad",
    originalUserPrompt: "Create me a 30 second Facebook Reel for EquiProfile",
    goal: "Generate reel",
    audience: "trial users",
    platform: "Facebook",
    durationTargetSeconds: 30,
    outputFormat: "Assembled video",
    brief: "",
    script: "Scene script",
    scenes: [{
      id: "scene-1",
      order: 1,
      durationSeconds: 2,
      narration: "EquiProfile saves time.",
      visualPrompt: "Product screenshot and rider",
      negativePrompt: "",
      sourceType: "text_card",
      requiredSubject: "product",
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      mediaKind: "text_card",
      sourceMetadata: null,
      selectedAt: null,
      selectionReason: null,
      status: "needs_review",
    }],
    requiredAssets: [],
    voiceoverRequired: true,
    voiceoverScript: "",
    voiceId: null,
    voiceProvider: null,
    voiceAssetId: null,
    audioAssetUrl: null,
    backgroundMusicUrl: null,
    captionsRequired: true,
    captionMode: "script",
    captionFormat: "srt",
    audioStatus: "pending",
    captionStatus: "pending",
    brandOverlayRequired: true,
    renderMode: "assembled_video",
    status: "render",
    ...overrides,
  };
}

describe("PR64M reel render contract", () => {
  it("compiles Facebook Reel prompts as 9:16 vertical short video", () => {
    const timeline = compileMarketingTimeline(basePlan());
    expect(timeline.render).toMatchObject({
      aspectRatio: "9:16",
      width: 1080,
      height: 1920,
      platformFormat: "vertical_short_video",
      audioRequired: true,
      captionsRequired: true,
    });
  });

  it("compiles YouTube 3 minute plans as 16:9 landscape", () => {
    const timeline = compileMarketingTimeline(basePlan({
      contentType: "youtube_3min_video",
      originalUserPrompt: "Create a 3 minute YouTube video for EquiProfile",
    }));
    expect(timeline.render).toMatchObject({
      aspectRatio: "16:9",
      width: 1920,
      height: 1080,
      platformFormat: "youtube_landscape",
    });
  });

  it("renders vertical MP4 output for Reel timelines", async () => {
    process.env.EQUIPROFILE_STORAGE_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "pr64m-render-"));
    const timeline = compileMarketingTimeline(basePlan());
    const rendered = await renderMarketingTimeline({
      jobId: "pr64m-vertical",
      timeline,
      brandOverlay: {
        brandName: "EquiProfile",
        domain: "equiprofile.online",
        cta: "Start your free trial",
        primaryColor: "#1e3a5f",
        secondaryColor: "#c5a55a",
      },
      captions: { mode: "none", format: "srt" },
    });

    if (rendered.status !== "completed") throw new Error(rendered.errorMessage);
    expect(rendered.output.mimeType).toBe("video/mp4");

    const probe = await execa(String(ffmpegPath), ["-i", rendered.output.filePath], { reject: false });
    const details = `${probe.stdout}\n${probe.stderr}`;
    expect(details).toContain("1080x1920");
  }, 30_000);
});
