import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MarketingBrandOverlay, MarketingTimeline } from "./modules/marketing/media-factory/renderJobTypes";

const originalStorageRoot = process.env.EQUIPROFILE_STORAGE_ROOT;

function tempRoot(label: string) {
  return fs.mkdtempSync(path.join(os.tmpdir(), label));
}

function timeline(durationSeconds = 1): MarketingTimeline {
  return {
    totalDurationSeconds: durationSeconds,
    captionLines: [{ startSeconds: 0, endSeconds: durationSeconds, text: "Organise horse health records and stable schedules in one calm workspace." }],
    scenes: [{
      id: "scene-1",
      order: 1,
      durationSeconds,
      sourceType: "text_card",
      mediaKind: "text_card",
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      textCard: "Organise horse health records and stable schedules in one calm workspace.",
      narration: "EquiProfile keeps stable teams organised with records, documents, scheduling and staff visibility.",
      visualPrompt: "Branded caption card for an equine stable management platform",
      caption: "EquiProfile keeps stable teams organised.",
      metadata: {
        requiredSubject: "equine stable management",
        negativePrompt: "",
        sourceMetadata: null,
        selectedAt: null,
        selectionReason: "PR64K fallback render regression",
        status: "needs_review",
      },
    }],
  };
}

function overlay(): MarketingBrandOverlay {
  return {
    brandName: "EquiProfile",
    domain: "equiprofile.online",
    cta: "Start your free trial",
    primaryColor: "#1e3a5f",
    secondaryColor: "#c5a55a",
  };
}

afterEach(() => {
  if (originalStorageRoot === undefined) {
    delete process.env.EQUIPROFILE_STORAGE_ROOT;
  } else {
    process.env.EQUIPROFILE_STORAGE_ROOT = originalStorageRoot;
  }
});

describe("PR64K dynamic storage root repair", () => {
  it("writes generated assets to the current env root after module import", async () => {
    vi.resetModules();
    process.env.EQUIPROFILE_STORAGE_ROOT = tempRoot("pr64k-old-root-");
    const storage = await import("./_core/storage/localMediaStorage");

    const newRoot = tempRoot("pr64k-new-root-");
    process.env.EQUIPROFILE_STORAGE_ROOT = newRoot;
    const written = await storage.writeGeneratedAsset({
      data: Buffer.from("asset"),
      folder: "generated",
      mimeType: "application/pdf",
      jobId: "late-root",
      ext: "pdf",
    });

    expect(written.localPath.startsWith(path.join(newRoot, "generated") + path.sep)).toBe(true);
    expect(written.publicUrl.startsWith("/media/generated/generated/")).toBe(true);
    expect(fs.existsSync(written.localPath)).toBe(true);
  });

  it("reports render readiness against the current env root after module import", async () => {
    vi.resetModules();
    process.env.EQUIPROFILE_STORAGE_ROOT = tempRoot("pr64k-readiness-old-");
    const renderer = await import("./modules/marketing/media-factory/marketingRenderer");

    const newRoot = tempRoot("pr64k-readiness-new-");
    process.env.EQUIPROFILE_STORAGE_ROOT = newRoot;
    const readiness = await renderer.getMarketingRenderRuntimeReadiness();

    expect(readiness.outputRoot).toBe(newRoot);
    expect(fs.existsSync(path.join(newRoot, "temp"))).toBe(true);
  });

  it("executes real FFmpeg branded-caption render into the current env root after module import", async () => {
    vi.resetModules();
    process.env.EQUIPROFILE_STORAGE_ROOT = tempRoot("pr64k-render-old-");
    const renderer = await import("./modules/marketing/media-factory/marketingRenderer");

    const newRoot = tempRoot("pr64k-render-new-");
    process.env.EQUIPROFILE_STORAGE_ROOT = newRoot;
    const rendered = await renderer.renderMarketingTimeline({
      jobId: "pr64k-real-ffmpeg",
      brandOverlay: overlay(),
      timeline: timeline(),
      captions: { mode: "none", format: "srt" },
    });

    expect(rendered.status).toBe("completed");
    if (rendered.status !== "completed") {
      throw new Error(rendered.errorMessage);
    }
    expect(rendered.output.filePath.startsWith(path.join(newRoot, "generated") + path.sep)).toBe(true);
    expect(rendered.output.publicUrl.startsWith("/media/generated/generated/")).toBe(true);
    expect(fs.readFileSync(rendered.output.filePath).toString("latin1", 4, 8)).toBe("ftyp");
  }, 30_000);
});
