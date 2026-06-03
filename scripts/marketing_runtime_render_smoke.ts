import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getLocalMediaStorageRoot } from "../server/_core/storage/localMediaStorage";
import { renderMarketingTimeline } from "../server/modules/marketing/media-factory/marketingRenderer";
import type { MarketingTimeline } from "../server/modules/marketing/media-factory/renderJobTypes";

if (!process.env.EQUIPROFILE_STORAGE_ROOT) {
  process.env.EQUIPROFILE_STORAGE_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "marketing-runtime-render-"));
}

const timeline: MarketingTimeline = {
  totalDurationSeconds: 1,
  captionLines: [{ startSeconds: 0, endSeconds: 1, text: "EquiProfile keeps stable teams organised." }],
  scenes: [{
    id: "runtime-smoke-scene",
    order: 1,
    durationSeconds: 1,
    sourceType: "text_card",
    mediaKind: "text_card",
    assetId: null,
    assetUrl: null,
    previewUrl: null,
    provider: null,
    providerAssetId: null,
    textCard: "EquiProfile keeps horse records, schedules, documents and team visibility in one place.",
    narration: "EquiProfile keeps stable teams organised with horse records, document tracking and scheduling.",
    visualPrompt: "Branded caption fallback for an equine stable management platform",
    caption: "EquiProfile keeps stable teams organised.",
    metadata: {
      requiredSubject: "equine stable management",
      negativePrompt: "",
      sourceMetadata: null,
      selectedAt: null,
      selectionReason: "runtime render smoke fallback",
      status: "needs_review",
    },
  }],
};

const rendered = await renderMarketingTimeline({
  jobId: "runtime-smoke-real-ffmpeg",
  brandOverlay: {
    brandName: "EquiProfile",
    domain: "equiprofile.online",
    cta: "Start your free trial",
    primaryColor: "#1e3a5f",
    secondaryColor: "#c5a55a",
  },
  timeline,
  captions: { mode: "none", format: "srt" },
});

if (rendered.status !== "completed") {
  console.error(`[runtime-render] FAIL: ${rendered.errorMessage}`);
  process.exit(1);
}

if (!rendered.output.publicUrl || !rendered.output.filePath) {
  console.error("[runtime-render] FAIL: render completed without publicUrl/filePath");
  process.exit(1);
}

if (!rendered.output.filePath.startsWith(path.join(getLocalMediaStorageRoot(), "generated") + path.sep)) {
  console.error(`[runtime-render] FAIL: output path is outside current storage root: ${rendered.output.filePath}`);
  process.exit(1);
}

const signature = fs.readFileSync(rendered.output.filePath).toString("latin1", 4, 8);
if (signature !== "ftyp") {
  console.error(`[runtime-render] FAIL: output is not an MP4 ftyp file: ${rendered.output.filePath}`);
  process.exit(1);
}

console.log(`[runtime-render] PASS: ${rendered.output.publicUrl}`);
console.log(`[runtime-render] storageRoot=${getLocalMediaStorageRoot()}`);
console.log(`[runtime-render] warnings=${(rendered.warnings ?? []).join(" | ") || "none"}`);
