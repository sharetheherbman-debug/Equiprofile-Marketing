import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { inferMarketingWorkspaceIntent } from "../client/src/components/marketing/app/marketingIntentRouter";
import { MarketingPreviewPanel } from "../client/src/components/marketing/app/workspace/MarketingPreviewPanel";
import {
  applyBrandedCaptionFallbackToUnresolvedScenes,
  buildMarketingStudioFallbackScenes,
  ensureRenderableMarketingStudioPlan,
  resolveMarketingStudioFallbackCategory,
} from "../shared/_core/marketingStudioFallback";
import type { MarketingStudioPlan } from "../shared/_core/marketingStudioPlan";
import { compileMarketingTimeline } from "./modules/marketing/media-factory/marketingTimelineCompiler";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

function plan(durationTargetSeconds: number): MarketingStudioPlan {
  return {
    id: `plan-${durationTargetSeconds}`,
    workspaceId: "equiprofile-global",
    hostAppId: "equiprofile",
    contentType: durationTargetSeconds >= 180 ? "youtube_3min_video" : "facebook_ad",
    originalUserPrompt: `Create a ${durationTargetSeconds} second video`,
    goal: "Create video",
    audience: "customers",
    platform: durationTargetSeconds >= 180 ? "YouTube" : "Facebook",
    durationTargetSeconds,
    outputFormat: "Assembled video",
    brief: "",
    script: "",
    scenes: [],
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
    status: "brief",
  };
}

describe("PR64I intent routing", () => {
  it("keeps advert, video, and signup campaign intents separate", () => {
    expect(inferMarketingWorkspaceIntent("Create an advert for EquiProfile")).toMatchObject({ workflow: "image_ad" });
    expect(inferMarketingWorkspaceIntent("Create a Facebook image advertisement for EquiProfile")).toMatchObject({ workflow: "image_ad" });
    expect(inferMarketingWorkspaceIntent("Create me a 30 second Facebook reel for EquiProfile")).toMatchObject({ workflow: "assembled_video", contentType: "facebook_ad", durationSeconds: 30 });
    expect(inferMarketingWorkspaceIntent("Create a 2 minute video for EquiProfile")).toMatchObject({ workflow: "assembled_video", durationSeconds: 120 });
    expect(inferMarketingWorkspaceIntent("Create a 3 minute YouTube video for EquiProfile")).toMatchObject({ workflow: "assembled_video", contentType: "youtube_3min_video", durationSeconds: 180 });
    expect(inferMarketingWorkspaceIntent("Create a 7 day Facebook signup campaign for EquiProfile")).toMatchObject({ workflow: "campaign", packageType: "signup_campaign" });
    expect(inferMarketingWorkspaceIntent("Create a paid Facebook ad for EquiProfile")).toMatchObject({ workflow: "campaign", packageType: "paid_social_ad" });
  });
});

describe("PR64I branded caption fallback", () => {
  it.each([30, 120, 180])("builds a renderable %ss fallback timeline without external media", (durationTargetSeconds) => {
    const prepared = applyBrandedCaptionFallbackToUnresolvedScenes(ensureRenderableMarketingStudioPlan(plan(durationTargetSeconds), {
      hostAppId: "equiprofile",
      productCategory: "equine_stable_management",
    }));
    const timeline = compileMarketingTimeline(prepared);
    expect(prepared.script).toBeTruthy();
    expect(timeline.totalDurationSeconds).toBe(durationTargetSeconds);
    expect(timeline.scenes.length).toBeGreaterThan(0);
    expect(timeline.scenes.every((scene) => scene.sourceType === "text_card")).toBe(true);
  });

  it("uses equine fallback only for genuine EquiProfile or equine context", () => {
    expect(resolveMarketingStudioFallbackCategory({ hostAppId: "equiprofile" })).toBe("equine_stable_management");
    expect(resolveMarketingStudioFallbackCategory({ productCategory: "property_real_estate" })).toBe("property_real_estate");
    const property = buildMarketingStudioFallbackScenes({ prompt: "horse words pasted here", durationTargetSeconds: 30, context: { productCategory: "property_real_estate" } });
    expect(JSON.stringify(property).toLowerCase()).not.toContain("stable yard");
    expect(JSON.stringify(property).toLowerCase()).toContain("property");
  });

  it("returns playable MP4 metadata for 30s, 120s, and 180s test renders", async () => {
    process.env.EQUIPROFILE_STORAGE_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "pr64i-render-"));
    const { renderMarketingTimeline } = await import("./modules/marketing/media-factory/marketingRenderer");
    for (const durationTargetSeconds of [30, 120, 180]) {
      const prepared = applyBrandedCaptionFallbackToUnresolvedScenes(ensureRenderableMarketingStudioPlan(plan(durationTargetSeconds), { hostAppId: "equiprofile" }));
      const rendered = await renderMarketingTimeline({
        jobId: `pr64i-${durationTargetSeconds}`,
        testMode: true,
        brandOverlay: { brandName: "EquiProfile", domain: "equiprofile.online", cta: "Start your free trial", primaryColor: "#1e3a5f", secondaryColor: "#c5a55a" },
        timeline: compileMarketingTimeline(prepared),
        captions: { mode: "script", format: "srt" },
      });
      expect(rendered.status).toBe("completed");
      if (rendered.status !== "completed") continue;
      expect(rendered.output.publicUrl).toBeTruthy();
      expect(rendered.output.mimeType).toBe("video/mp4");
      expect(rendered.output.durationSeconds).toBe(durationTargetSeconds);
    }
  });

  it("executes the real FFmpeg branded-caption path without stock, voice, or music", async () => {
    process.env.EQUIPROFILE_STORAGE_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "pr64i-ffmpeg-"));
    const { renderMarketingTimeline } = await import("./modules/marketing/media-factory/marketingRenderer");
    const prepared = applyBrandedCaptionFallbackToUnresolvedScenes(ensureRenderableMarketingStudioPlan(plan(3), { hostAppId: "equiprofile" }));
    const rendered = await renderMarketingTimeline({
      jobId: "pr64i-real-ffmpeg",
      brandOverlay: { brandName: "EquiProfile", domain: "equiprofile.online", cta: "Start your free trial", primaryColor: "#1e3a5f", secondaryColor: "#c5a55a" },
      timeline: compileMarketingTimeline(prepared),
      captions: { mode: "none", format: "srt" },
    });
    expect(rendered.status).toBe("completed");
    if (rendered.status !== "completed") return;
    expect(rendered.output.publicUrl).toBeTruthy();
    expect(fs.readFileSync(rendered.output.filePath).toString("latin1", 4, 8)).toBe("ftyp");
    expect(rendered.warnings).toContain("Voiceover unavailable; silent captioned video rendered.");
    expect(rendered.warnings).toContain("Background music unavailable; rendering continued without music.");
  }, 30_000);
});

describe("PR64I preview, Library, Calendar, and Settings truth", () => {
  it("renders image and completed video URLs in Preview", () => {
    const image = renderToStaticMarkup(React.createElement(MarketingPreviewPanel, { deliverablePackage: null, mediaOutput: { status: "completed", publicUrl: "https://example.com/ad.png", mimeType: "image/png", provider: "genx" }, asset: null, renderJob: null, studioPlan: null }));
    const video = renderToStaticMarkup(React.createElement(MarketingPreviewPanel, { deliverablePackage: null, mediaOutput: null, asset: null, renderJob: { status: "completed", outputPublicUrl: "https://example.com/reel.mp4" }, studioPlan: null }));
    expect(image).toContain("<img");
    expect(image).toContain("genx");
    expect(video).toContain("<video");
  });

  it("treats completed renders without playable URL as a hard Preview error", () => {
    const html = renderToStaticMarkup(React.createElement(MarketingPreviewPanel, { deliverablePackage: null, mediaOutput: null, asset: null, renderJob: { status: "completed", outputPublicUrl: null }, studioPlan: null }));
    expect(html).toContain("Render completed but no playable URL was returned");
    expect(html).not.toContain("A playable URL will appear here");
  });

  it("keeps Library deletion confirmed and Calendar mutations wired", () => {
    const library = read("client/src/components/marketing/app/workspace/MarketingLibraryView.tsx");
    const calendar = read("client/src/components/marketing/app/workspace/MarketingCalendarView.tsx");
    expect(library).toContain("window.confirm");
    expect(library).toContain("Use as reference");
    expect(library).toContain("pexels");
    expect(calendar).toContain("<FullCalendar");
    expect(calendar).toContain("eventDrop={handleDrop}");
    expect(calendar).toContain("cancelScheduleDraftMutation");
  });

  it("shows Qwen text and media truth separately and stock search proof actions", () => {
    const settings = read("client/src/components/marketing/app/MarketingAppSettings.tsx");
    expect(settings).toContain("Qwen text:");
    expect(settings).toContain("Qwen media:");
    expect(settings).toContain("Disabled until DashScope native media execution returns a usable media URL or queued job.");
    expect(settings).toContain("Test stock search");
  });
});
