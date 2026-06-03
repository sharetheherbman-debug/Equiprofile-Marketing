import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MarketingBrandOverlay, MarketingTimeline } from "./modules/marketing/media-factory/renderJobTypes";

const originalStorageRoot = process.env.EQUIPROFILE_STORAGE_ROOT;
const originalDisableDrawtext = process.env.MARKETING_RENDER_DISABLE_DRAWTEXT;

function tempRoot(label: string) {
  return fs.mkdtempSync(path.join(os.tmpdir(), label));
}

function overlay(input: Partial<MarketingBrandOverlay> = {}): MarketingBrandOverlay {
  return {
    brandName: "EquiProfile & Stable Ops",
    domain: "equiprofile.online/signup",
    cta: "Start your free trial: records, schedules & documents",
    primaryColor: "#1e3a5f",
    secondaryColor: "#c5a55a",
    ...input,
  };
}

function timeline(text: string, durationSeconds = 1): MarketingTimeline {
  return {
    totalDurationSeconds: durationSeconds,
    captionLines: [{ startSeconds: 0, endSeconds: durationSeconds, text }],
    scenes: [{
      id: "drawtext-free-scene",
      order: 1,
      durationSeconds,
      sourceType: "text_card",
      mediaKind: "text_card",
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      textCard: text,
      narration: text,
      visualPrompt: "Drawtext-free branded card fallback",
      caption: text,
      metadata: {
        requiredSubject: "equine stable management",
        negativePrompt: "",
        sourceMetadata: null,
        selectedAt: null,
        selectionReason: "PR64L drawtext-free regression",
        status: "needs_review",
      },
    }],
  };
}

afterEach(() => {
  if (originalStorageRoot === undefined) {
    delete process.env.EQUIPROFILE_STORAGE_ROOT;
  } else {
    process.env.EQUIPROFILE_STORAGE_ROOT = originalStorageRoot;
  }
  if (originalDisableDrawtext === undefined) {
    delete process.env.MARKETING_RENDER_DISABLE_DRAWTEXT;
  } else {
    process.env.MARKETING_RENDER_DISABLE_DRAWTEXT = originalDisableDrawtext;
  }
});

describe("PR64L drawtext-free fallback render", () => {
  it("detects drawtext as unavailable without failing renderer readiness", async () => {
    vi.resetModules();
    process.env.MARKETING_RENDER_DISABLE_DRAWTEXT = "1";
    process.env.EQUIPROFILE_STORAGE_ROOT = tempRoot("pr64l-readiness-");
    const { getMarketingRenderRuntimeReadiness } = await import("./modules/marketing/media-factory/marketingRenderer");

    const readiness = await getMarketingRenderRuntimeReadiness();

    expect(readiness.ready).toBe(true);
    expect(readiness.ffmpegExecutable).toBe(true);
    expect(readiness.drawtextAvailable).toBe(false);
    expect(readiness.filterCheckError).toContain("MARKETING_RENDER_DISABLE_DRAWTEXT");
  });

  it("renders a real MP4 with PNG card fallback when drawtext is unavailable", async () => {
    vi.resetModules();
    process.env.MARKETING_RENDER_DISABLE_DRAWTEXT = "1";
    process.env.EQUIPROFILE_STORAGE_ROOT = tempRoot("pr64l-render-");
    const { renderMarketingTimeline } = await import("./modules/marketing/media-factory/marketingRenderer");

    const rendered = await renderMarketingTimeline({
      jobId: "pr64l-no-drawtext",
      brandOverlay: overlay(),
      timeline: timeline("Horse health records, staff visibility & scheduling — without paperwork chaos."),
      captions: { mode: "none", format: "srt" },
    });

    if (rendered.status !== "completed") {
      throw new Error(rendered.errorMessage);
    }
    expect(rendered.status).toBe("completed");
    expect(fs.existsSync(rendered.output.filePath)).toBe(true);
    expect(fs.readFileSync(rendered.output.filePath).toString("latin1", 4, 8)).toBe("ftyp");
    expect(rendered.output.publicUrl).toMatch(/^\/media\/generated\/generated\/.+\.mp4$/);
    expect(rendered.warnings).toContain("Scene drawtext-free-scene used PNG text-card fallback because FFmpeg drawtext is unavailable.");
  }, 30_000);

  it("escapes punctuation and falls back from invalid brand colours safely", async () => {
    vi.resetModules();
    process.env.MARKETING_RENDER_DISABLE_DRAWTEXT = "1";
    process.env.EQUIPROFILE_STORAGE_ROOT = tempRoot("pr64l-special-text-");
    const { renderMarketingTimeline } = await import("./modules/marketing/media-factory/marketingRenderer");

    const rendered = await renderMarketingTimeline({
      jobId: "pr64l-special-chars",
      brandOverlay: overlay({
        primaryColor: "url(javascript:bad)",
        secondaryColor: "#ca5",
        cta: "Book a trial: records, staff & docs / today",
      }),
      timeline: timeline("Owner's records: feed, vet notes, vaccines, files & schedules / all in one place.\nNo duplicate admin."),
      captions: { mode: "none", format: "srt" },
    });

    if (rendered.status !== "completed") {
      throw new Error(rendered.errorMessage);
    }
    expect(rendered.status).toBe("completed");
    expect(fs.existsSync(rendered.output.filePath)).toBe(true);
    expect(fs.readFileSync(rendered.output.filePath).toString("latin1", 4, 8)).toBe("ftyp");
  }, 30_000);
});
