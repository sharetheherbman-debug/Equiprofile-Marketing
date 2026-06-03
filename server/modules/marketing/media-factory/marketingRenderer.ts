import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";
import sharp from "sharp";
import { execa } from "execa";
import { ensureStorageDirs, getLocalMediaStorageRoot, writeGeneratedAsset } from "../../../_core/storage/localMediaStorage";
import type { MarketingBrandOverlay, MarketingTimeline, RenderOutput } from "./renderJobTypes";
import { generateSrtCaptions, generateVttCaptions } from "./marketingCaptionService";

const TEST_MP4_BASE64 = "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";

function escapeDrawText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function escapeSubtitlePath(filePath: string): string {
  return String(filePath)
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'");
}

function safeSceneText(value: string): string {
  return String(value || "").replace(/\s+/g, " ").trim();
}

const NAMED_SVG_COLORS = new Set([
  "black",
  "white",
  "red",
  "green",
  "blue",
  "navy",
  "gray",
  "grey",
  "silver",
  "maroon",
  "purple",
  "fuchsia",
  "lime",
  "olive",
  "yellow",
  "teal",
  "aqua",
  "orange",
  "gold",
]);

function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  const short = /^#([0-9a-f]{3})$/i.exec(trimmed);
  if (short) {
    return `#${short[1].split("").map((char) => `${char}${char}`).join("").toLowerCase()}`;
  }
  const long = /^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(trimmed);
  if (long) {
    return `#${long[1].toLowerCase()}`;
  }
  return null;
}

function sanitizeSvgColor(value: string | null | undefined, fallback: string): string {
  const normalizedFallback = normalizeHexColor(fallback) ?? "#1e3a5f";
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return normalizedFallback;
  const normalized = normalizeHexColor(trimmed);
  if (normalized) return normalized;
  const named = trimmed.toLowerCase().replace(/[^a-z]/g, "");
  if (NAMED_SVG_COLORS.has(named)) return named === "grey" ? "gray" : named;
  return normalizedFallback;
}

function svgColorToFfmpegColor(value: string): string {
  const normalized = normalizeHexColor(value);
  if (normalized) return `0x${normalized.slice(1)}`;
  const named = value.toLowerCase().replace(/[^a-z]/g, "");
  return NAMED_SVG_COLORS.has(named) ? named : "0x1e3a5f";
}

function escapeXml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapSvgText(value: string, maxChars = 44, maxLines = 4): string[] {
  const words = safeSceneText(value).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+\S*$/, "")}…`;
  }
  return lines.length ? lines : ["Marketing message"];
}

function isRemoteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function isAllowedRemoteStockUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const allowedHosts = [
      "pexels.com",
      "pixabay.com",
      "pexelscdn.com",
      "cdn.pixabay.com",
      "images.pexels.com",
      "videos.pexels.com",
    ];
    return allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

function buildSceneOverlayFilter(input: {
  sceneText: string;
  overlay: MarketingBrandOverlay;
  isFinalScene: boolean;
}): string {
  const safe = input.overlay.safeArea ?? { top: 40, right: 40, bottom: 40, left: 40 };
  const placements = input.overlay.placements ?? {
    logo: "top_right" as const,
    brandDomain: "top_left" as const,
    cta: "bottom_right" as const,
  };
  const brandX = placements.brandDomain === "bottom_center" ? "(w-tw)/2" : `${safe.left}`;
  const brandY = placements.brandDomain === "bottom_left" || placements.brandDomain === "bottom_center"
    ? `h-${safe.bottom + 96}`
    : `${safe.top}`;
  const domainX = placements.brandDomain === "bottom_center" ? "(w-tw)/2" : `${safe.left}`;
  const domainY = placements.brandDomain === "bottom_left" || placements.brandDomain === "bottom_center"
    ? `h-${safe.bottom + 64}`
    : `${safe.top + 44}`;
  const ctaText = input.isFinalScene && input.overlay.endCard?.enabled
    ? `CTA: ${input.overlay.endCard.cta || input.overlay.cta}`
    : input.overlay.cta;
  const ctaX = placements.cta === "bottom_center" ? "(w-tw)/2" : placements.cta === "bottom_left" ? `${safe.left}` : `w-tw-${safe.right}`;
  const ctaY = `h-${safe.bottom + 36}`;
  const ctaColor = input.isFinalScene ? input.overlay.secondaryColor : "white";
  const lines = [
    `drawtext=fontcolor=white:fontsize=30:x=${brandX}:y=${brandY}:text='${escapeDrawText(input.overlay.brandName)}'`,
    `drawtext=fontcolor=white:fontsize=22:x=${domainX}:y=${domainY}:text='${escapeDrawText(input.overlay.domain)}'`,
    `drawtext=fontcolor=white:fontsize=28:x=${safe.left}:y=h-${safe.bottom + 100}:text='${escapeDrawText(input.sceneText)}'`,
  ];
  lines.push(`drawtext=fontcolor=${escapeDrawText(ctaColor)}:fontsize=30:x=${ctaX}:y=${ctaY}:text='${escapeDrawText(ctaText)}'`);
  if (input.isFinalScene && input.overlay.endCard?.enabled) {
    lines.push(`drawtext=fontcolor=white:fontsize=40:x=(w-tw)/2:y=(h*0.35):text='${escapeDrawText(input.overlay.endCard.title || input.overlay.brandName)}'`);
  }
  return lines.join(",");
}

function ffmpegCandidates() {
  return Array.from(new Set([
    process.env.FFMPEG_PATH,
    typeof ffmpegStatic === "string" ? ffmpegStatic : null,
    path.resolve(process.cwd(), "node_modules", "ffmpeg-static", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"),
    "ffmpeg",
  ].filter((value): value is string => Boolean(value && value.trim()))));
}

async function canRunFfmpeg(candidate: string) {
  if (candidate !== "ffmpeg" && !fs.existsSync(candidate)) {
    return { ok: false as const, reason: "path_missing" };
  }
  try {
    await execa(candidate, ["-version"], { timeout: 8_000 });
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

async function getFfmpegFilterCapabilities(ffmpegPath: string | null) {
  if (!ffmpegPath) return { drawtextAvailable: false, filterCheckError: "FFmpeg is not executable." };
  if (process.env.MARKETING_RENDER_DISABLE_DRAWTEXT === "1") {
    return { drawtextAvailable: false, filterCheckError: "drawtext disabled by MARKETING_RENDER_DISABLE_DRAWTEXT." };
  }
  try {
    const result = await execa(ffmpegPath, ["-hide_banner", "-filters"], { timeout: 8_000 });
    return {
      drawtextAvailable: /(^|\n)\s*T?\.?\.?\s+drawtext\s+/m.test(result.stdout),
      filterCheckError: "",
    };
  } catch (error) {
    return {
      drawtextAvailable: false,
      filterCheckError: describeExecutionError(error),
    };
  }
}

function describeExecutionError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const details = [
    error.message,
    "shortMessage" in error && typeof error.shortMessage === "string" ? error.shortMessage : null,
    "exitCode" in error && typeof error.exitCode !== "undefined" ? `exitCode=${String(error.exitCode)}` : null,
    "stderr" in error && typeof error.stderr === "string" && error.stderr.trim() ? `stderr=${error.stderr.trim().slice(0, 1_000)}` : null,
    "stdout" in error && typeof error.stdout === "string" && error.stdout.trim() ? `stdout=${error.stdout.trim().slice(0, 500)}` : null,
    "command" in error && typeof error.command === "string" ? `command=${error.command}` : null,
  ].filter(Boolean);
  return Array.from(new Set(details)).join(" | ");
}

export async function resolveAvailableFfmpegPath() {
  const failures: string[] = [];
  for (const candidate of ffmpegCandidates()) {
    const result = await canRunFfmpeg(candidate);
    if (result.ok) return { ffmpegPath: candidate, failures };
    failures.push(`${candidate}: ${result.reason}`);
  }
  return { ffmpegPath: null, failures };
}

export async function getMarketingRenderRuntimeReadiness() {
  const { ffmpegPath, failures } = await resolveAvailableFfmpegPath();
  const filterCapabilities = await getFfmpegFilterCapabilities(ffmpegPath);
  const tmpProbe = path.join(os.tmpdir(), `marketing-render-probe-${process.pid}-${Date.now()}.tmp`);
  const outputRoot = getLocalMediaStorageRoot();
  const storageProbe = path.join(outputRoot, "temp", `render-probe-${process.pid}-${Date.now()}.tmp`);
  const result = {
    ready: false,
    ffmpegPath,
    ffmpegExecutable: Boolean(ffmpegPath),
    ffmpegFailures: failures,
    drawtextAvailable: filterCapabilities.drawtextAvailable,
    filterCheckError: filterCapabilities.filterCheckError,
    tempWritable: false,
    outputWritable: false,
    outputRoot,
    publicUrlBase: "/media/generated",
    reason: "",
  };
  try {
    await fs.promises.writeFile(tmpProbe, "ok");
    await fs.promises.unlink(tmpProbe);
    result.tempWritable = true;
  } catch (error) {
    result.reason = `Temp directory is not writable: ${error instanceof Error ? error.message : String(error)}`;
  }
  try {
    await ensureStorageDirs();
    await fs.promises.writeFile(storageProbe, "ok");
    await fs.promises.unlink(storageProbe);
    result.outputWritable = true;
  } catch (error) {
    result.reason = `Generated media root is not writable: ${error instanceof Error ? error.message : String(error)}`;
  }
  if (!ffmpegPath) {
    result.reason = `FFmpeg is not executable. Tried: ${failures.join("; ") || "no candidates"}`;
  }
  result.ready = Boolean(ffmpegPath && result.tempWritable && result.outputWritable);
  if (result.ready) result.reason = "FFmpeg, temp storage, and generated media output are ready.";
  return result;
}

function sceneBaseVideoFilter(): string {
  return "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,fps=30,format=yuv420p";
}

function buildTextCardSvg(input: {
  scene: MarketingTimeline["scenes"][number];
  overlay: MarketingBrandOverlay;
  isFinalScene: boolean;
}) {
  const primary = sanitizeSvgColor(input.overlay.primaryColor, "#1e3a5f");
  const secondary = sanitizeSvgColor(input.overlay.secondaryColor, "#c5a55a");
  const accent = sanitizeSvgColor(input.overlay.accentColor, secondary);
  const sceneText = safeSceneText(input.scene.textCard || input.scene.narration || input.scene.visualPrompt || input.scene.caption || "Marketing message");
  const lines = wrapSvgText(sceneText, 42, 5);
  const ctaText = input.isFinalScene && input.overlay.endCard?.enabled
    ? input.overlay.endCard.cta || input.overlay.cta
    : input.overlay.cta;
  const tspans = lines.map((line, index) =>
    `<tspan x="92" dy="${index === 0 ? 0 : 50}">${escapeXml(line)}</tspan>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="${primary}"/>
  <rect x="0" y="0" width="1280" height="720" fill="rgba(0,0,0,0.14)"/>
  <circle cx="1110" cy="145" r="220" fill="${secondary}" opacity="0.18"/>
  <rect x="72" y="72" width="1136" height="576" rx="34" fill="rgba(255,255,255,0.10)" stroke="${accent}" stroke-width="3"/>
  <text x="92" y="126" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">${escapeXml(input.overlay.brandName)}</text>
  <text x="92" y="166" fill="rgba(255,255,255,0.78)" font-family="Arial, Helvetica, sans-serif" font-size="22">${escapeXml(input.overlay.domain)}</text>
  <text x="92" y="315" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">${tspans}</text>
  <rect x="92" y="570" width="520" height="58" rx="29" fill="${secondary}"/>
  <text x="122" y="608" fill="${primary}" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700">${escapeXml(ctaText || "Learn more")}</text>
</svg>`;
}

async function renderTextCardPng(input: {
  tmpDir: string;
  scene: MarketingTimeline["scenes"][number];
  sceneIndex: number;
  totalScenes: number;
  overlay: MarketingBrandOverlay;
}) {
  const outputPath = path.join(input.tmpDir, `scene-card-${input.sceneIndex + 1}.png`);
  const svg = buildTextCardSvg({
    scene: input.scene,
    overlay: input.overlay,
    isFinalScene: input.sceneIndex === input.totalScenes - 1,
  });
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  return outputPath;
}

function buildPlainColorSceneCommand(input: {
  ffmpegPath: string;
  tmpDir: string;
  sceneIndex: number;
  durationSeconds: number;
  overlay: MarketingBrandOverlay;
}) {
  const outputPath = path.join(input.tmpDir, `scene-${input.sceneIndex + 1}.mp4`);
  return {
    command: input.ffmpegPath,
    args: [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `color=c=${svgColorToFfmpegColor(sanitizeSvgColor(input.overlay.primaryColor, "#1e3a5f"))}:s=1280x720:d=${Math.max(1, Math.round(input.durationSeconds || 1))}:r=30`,
      "-an",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    outputPath,
  };
}

async function renderGeneratedTextCardSegment(input: {
  ffmpegPath: string;
  tmpDir: string;
  scene: MarketingTimeline["scenes"][number];
  sceneIndex: number;
  totalScenes: number;
  overlay: MarketingBrandOverlay;
}): Promise<{ outputPath: string; warning?: string }> {
  const duration = String(Math.max(1, Math.round(input.scene.durationSeconds || 1)));
  const outputPath = path.join(input.tmpDir, `scene-${input.sceneIndex + 1}.mp4`);
  try {
    const cardPath = await renderTextCardPng(input);
    await execa(input.ffmpegPath, [
      "-y",
      "-loop",
      "1",
      "-t",
      duration,
      "-i",
      cardPath,
      "-an",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ], { timeout: 35_000 });
    return { outputPath };
  } catch (error) {
    const plain = buildPlainColorSceneCommand({
      ffmpegPath: input.ffmpegPath,
      tmpDir: input.tmpDir,
      sceneIndex: input.sceneIndex,
      durationSeconds: input.scene.durationSeconds,
      overlay: input.overlay,
    });
    await execa(plain.command, plain.args, { timeout: 25_000 });
    return {
      outputPath: plain.outputPath,
      warning: `Scene ${input.scene.id} branded text-card PNG failed; plain colour fallback used (${describeExecutionError(error)}).`,
    };
  }
}

export function buildSceneSegmentCommand(input: {
  ffmpegPath: string;
  tmpDir: string;
  scene: MarketingTimeline["scenes"][number];
  sceneIndex: number;
  totalScenes: number;
  overlay: MarketingBrandOverlay;
  enableLogoOverlay?: boolean;
}): { command: string; args: string[]; outputPath: string } {
  const scene = input.scene;
  const duration = String(Math.max(1, Math.round(scene.durationSeconds || 1)));
  const outputPath = path.join(input.tmpDir, `scene-${input.sceneIndex + 1}.mp4`);
  const isFinalScene = input.sceneIndex === input.totalScenes - 1;
  const sceneText = safeSceneText(scene.caption || scene.narration || scene.textCard || `Scene ${input.sceneIndex + 1}`);
  const vf = `${sceneBaseVideoFilter()},${buildSceneOverlayFilter({ sceneText, overlay: input.overlay, isFinalScene })}`;
  const remoteAssetAllowed = Boolean(scene.assetUrl && (!isRemoteUrl(scene.assetUrl) || isAllowedRemoteStockUrl(scene.assetUrl)));
  const logoUrl = input.enableLogoOverlay !== false ? input.overlay.logoUrl : undefined;
  const useLogo = Boolean(logoUrl && input.overlay.placements?.logo !== "none");
  const safe = input.overlay.safeArea ?? { top: 40, right: 40, bottom: 40, left: 40 };
  const logoPlacement = input.overlay.placements?.logo ?? "top_right";
  const logoX = logoPlacement === "top_left" ? `${safe.left}` : `W-w-${safe.right}`;
  const logoY = `${safe.top}`;
  const shouldUseAsset = Boolean(scene.assetUrl && scene.mediaKind !== "text_card" && remoteAssetAllowed);

  if (shouldUseAsset && scene.mediaKind === "image") {
    const filter = `${sceneBaseVideoFilter()},${buildSceneOverlayFilter({ sceneText, overlay: input.overlay, isFinalScene })}`;
    const filterComplex = `[0:v]${filter}[base];[1:v]scale=140:-1[logo];[base][logo]overlay=${logoX}:${logoY}`;
    return {
      command: input.ffmpegPath,
      args: [
        "-y",
        "-loop",
        "1",
        "-t",
        duration,
        "-i",
        scene.assetUrl!,
        ...(useLogo ? ["-i", logoUrl!] : []),
        ...(useLogo ? ["-filter_complex", filterComplex] : ["-vf", vf]),
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outputPath,
      ],
      outputPath,
    };
  }

  if (shouldUseAsset && scene.mediaKind === "video") {
    const filter = `${sceneBaseVideoFilter()},${buildSceneOverlayFilter({ sceneText, overlay: input.overlay, isFinalScene })}`;
    const filterComplex = `[0:v]${filter}[base];[1:v]scale=140:-1[logo];[base][logo]overlay=${logoX}:${logoY}`;
    const args = [
      "-y",
      ...(scene.assetUrl && !isRemoteUrl(scene.assetUrl) ? ["-stream_loop", "-1"] : []),
      ...(scene.assetUrl && isRemoteUrl(scene.assetUrl)
        ? ["-rw_timeout", "15000000", "-timeout", "15000000", "-reconnect", "1", "-reconnect_streamed", "1", "-reconnect_delay_max", "2"]
        : []),
      "-i",
      scene.assetUrl!,
      "-t",
      duration,
      ...(useLogo ? ["-i", logoUrl!] : []),
      ...(useLogo ? ["-filter_complex", filterComplex] : ["-vf", vf]),
      "-an",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ];
    return { command: input.ffmpegPath, args, outputPath };
  }

  const fallbackText = safeSceneText(scene.textCard || scene.narration || scene.visualPrompt || `Scene ${input.sceneIndex + 1}`);
  const fallbackFilter = `${buildSceneOverlayFilter({
    sceneText: fallbackText,
    overlay: input.overlay,
    isFinalScene,
  })},format=yuv420p`;
  const fallbackComplex = `[0:v]${fallbackFilter}[base];[1:v]scale=140:-1[logo];[base][logo]overlay=${logoX}:${logoY}`;

  return {
    command: input.ffmpegPath,
    args: [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `color=c=${input.overlay.primaryColor}:s=1280x720:d=${duration}`,
      ...(useLogo ? ["-i", logoUrl!] : []),
      ...(useLogo ? ["-filter_complex", fallbackComplex] : ["-vf", fallbackFilter]),
      "-an",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    outputPath,
  };
}

async function renderSceneWithFallback(input: {
  ffmpegPath: string;
  tmpDir: string;
  scene: MarketingTimeline["scenes"][number];
  sceneIndex: number;
  totalScenes: number;
  overlay: MarketingBrandOverlay;
  drawtextAvailable: boolean;
}): Promise<{ outputPath: string; warning?: string }> {
  if (input.scene.sourceType === "text_card" || input.scene.mediaKind === "text_card") {
    const rendered = await renderGeneratedTextCardSegment(input);
    return {
      outputPath: rendered.outputPath,
      warning: rendered.warning ?? (
        input.drawtextAvailable
          ? undefined
          : `Scene ${input.scene.id} used PNG text-card fallback because FFmpeg drawtext is unavailable.`
      ),
    };
  }

  if (input.scene.assetUrl && isRemoteUrl(input.scene.assetUrl) && !isAllowedRemoteStockUrl(input.scene.assetUrl)) {
    const fallbackScene = {
      ...input.scene,
      sourceType: "text_card" as const,
      mediaKind: "text_card" as const,
      assetUrl: null,
    };
    const rendered = await renderGeneratedTextCardSegment({
      ffmpegPath: input.ffmpegPath,
      tmpDir: input.tmpDir,
      scene: fallbackScene,
      sceneIndex: input.sceneIndex,
      totalScenes: input.totalScenes,
      overlay: input.overlay,
    });
    return {
      outputPath: rendered.outputPath,
      warning: rendered.warning ?? `Scene ${input.scene.id} used disallowed remote host; PNG text card fallback used.`,
    };
  }

  const primary = buildSceneSegmentCommand({
    ffmpegPath: input.ffmpegPath,
    tmpDir: input.tmpDir,
    scene: input.scene,
    sceneIndex: input.sceneIndex,
    totalScenes: input.totalScenes,
    overlay: input.overlay,
    enableLogoOverlay: true,
  });
  try {
    await execa(primary.command, primary.args, { timeout: 45_000 });
    return { outputPath: primary.outputPath };
  } catch (error) {
    if (input.overlay.logoUrl) {
      try {
        const withoutLogo = buildSceneSegmentCommand({
          ffmpegPath: input.ffmpegPath,
          tmpDir: input.tmpDir,
          scene: input.scene,
          sceneIndex: input.sceneIndex,
          totalScenes: input.totalScenes,
          overlay: input.overlay,
          enableLogoOverlay: false,
        });
        await execa(withoutLogo.command, withoutLogo.args, { timeout: 35_000 });
        return {
          outputPath: withoutLogo.outputPath,
          warning: `Scene ${input.sceneIndex + 1} logo overlay failed; rendering continued without logo.`,
        };
      } catch {
        // Continue to text-card fallback below.
      }
    }
    const fallbackScene = {
      ...input.scene,
      sourceType: "text_card" as const,
      mediaKind: "text_card" as const,
      assetUrl: null,
    };
    const rendered = await renderGeneratedTextCardSegment({
      ffmpegPath: input.ffmpegPath,
      tmpDir: input.tmpDir,
      scene: fallbackScene,
      sceneIndex: input.sceneIndex,
      totalScenes: input.totalScenes,
      overlay: input.overlay,
    });
    return {
      outputPath: rendered.outputPath,
      warning: rendered.warning ?? `Scene ${input.scene.id} media failed; PNG text card fallback used (${describeExecutionError(error)}).`,
    };
  }
}

export async function renderMarketingTimeline(input: {
  jobId: string;
  timeline: MarketingTimeline;
  brandOverlay: MarketingBrandOverlay;
  audio?: {
    audioUrl?: string | null;
    backgroundMusicUrl?: string | null;
  };
  captions?: {
    mode?: "none" | "script" | "voice_aligned";
    format?: "srt" | "vtt";
    srt?: string;
    vtt?: string;
  };
  testMode?: boolean;
}): Promise<{ status: "completed"; output: RenderOutput; warnings?: string[] } | { status: "setup_needed"; errorMessage: string; readiness?: Awaited<ReturnType<typeof getMarketingRenderRuntimeReadiness>> }> {
  if (!input.timeline.scenes.length) {
    return {
      status: "setup_needed",
      errorMessage: "Render needs at least one prepared scene. Generate scenes before starting the render job.",
    };
  }
  const duration = Math.max(1, Math.round(input.timeline.totalDurationSeconds || 1));
  const captionMode = input.captions?.mode ?? "none";
  const captionFormat = input.captions?.format ?? "srt";
  const srtText = input.captions?.srt || generateSrtCaptions(input.timeline);
  const vttText = input.captions?.vtt || generateVttCaptions(input.timeline);

  if (input.testMode) {
    const { localPath, publicUrl, fileSizeBytes } = await writeGeneratedAsset({
      data: Buffer.from(TEST_MP4_BASE64, "base64"),
      folder: "generated",
      mimeType: "video/mp4",
      jobId: input.jobId,
      ext: "mp4",
    });

    return {
      status: "completed",
      output: {
        publicUrl,
        filePath: localPath,
        mimeType: "video/mp4",
        durationSeconds: duration,
        sizeBytes: fileSizeBytes,
        metadata: {
          audioIncluded: false,
          captionsBurnedIn: captionMode !== "none" && Boolean(srtText.trim()),
          captionMode,
          captionFormat,
          srt: srtText,
          vtt: vttText,
          audioStatus: "pending",
          captionStatus: captionMode === "none" ? "pending" : "generated",
        },
      },
    };
  }

  const readiness = await getMarketingRenderRuntimeReadiness();
  if (!readiness.ready || !readiness.ffmpegPath) {
    return {
      status: "setup_needed",
      errorMessage: `${readiness.reason} outputRoot=${readiness.outputRoot}; tempWritable=${readiness.tempWritable}; outputWritable=${readiness.outputWritable}; ffmpegPath=${readiness.ffmpegPath ?? "none"}`,
      readiness,
    };
  }
  const ffmpegPath = readiness.ffmpegPath;

  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), `marketing-render-${input.jobId}-`));
  const tmpOut = path.join(tmpDir, `assembled-${input.jobId}.mp4`);
  const captionOut = path.join(tmpDir, `captioned-${input.jobId}.mp4`);
  const finalOut = path.join(tmpDir, `final-${input.jobId}.mp4`);
  const concatFile = path.join(tmpDir, "segments.txt");
  const srtPath = path.join(tmpDir, "captions.srt");
  const warnings: string[] = [];
  let workingVideoPath = tmpOut;
  let captionsBurnedIn = false;
  let audioIncluded = false;
  let renderStage = "initialising";
  let captionStatus: "pending" | "generated" | "burned_in" | "failed" =
    captionMode === "none" ? "pending" : "generated";
  let audioStatus: "pending" | "setup_needed" | "queued" | "completed" | "failed" = "pending";

  try {
    const needsReviewOrTextCardCount = input.timeline.scenes.filter((scene) =>
      scene.sourceType === "text_card" || scene.metadata.status === "needs_review").length;
    if (needsReviewOrTextCardCount > 0) {
      warnings.push(`Render started with ${needsReviewOrTextCardCount} branded caption fallback scenes because optional media was unavailable.`);
    }

    renderStage = "rendering scene segments";
    const sceneResults = await Promise.all(input.timeline.scenes.map(async (scene, index) => {
      return renderSceneWithFallback({
        ffmpegPath,
        tmpDir,
        scene,
        sceneIndex: index,
        totalScenes: input.timeline.scenes.length,
        overlay: input.brandOverlay,
        drawtextAvailable: readiness.drawtextAvailable,
      });
    }));
    sceneResults.forEach((result) => {
      if (result.warning) warnings.push(result.warning);
    });

    const concatBody = sceneResults.map((result) => `file '${result.outputPath.replace(/'/g, "'\\''")}'`).join("\n");
    renderStage = "writing concat manifest";
    await fs.promises.writeFile(concatFile, concatBody, "utf8");

    renderStage = "concatenating scene segments";
    await execa(ffmpegPath, [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatFile,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      tmpOut,
    ], { timeout: 60_000 });

    if (captionMode !== "none" && srtText.trim()) {
      try {
        renderStage = "burning captions";
        await fs.promises.writeFile(srtPath, srtText, "utf8");
        await execa(ffmpegPath, [
          "-y",
          "-i",
          workingVideoPath,
          "-vf",
          `subtitles='${escapeSubtitlePath(srtPath)}'`,
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "-an",
          captionOut,
        ], { timeout: 60_000 });
        workingVideoPath = captionOut;
        captionsBurnedIn = true;
        captionStatus = "burned_in";
      } catch {
        captionStatus = "failed";
        warnings.push("Caption burn-in failed; rendering continued without burned captions.");
      }
    }

    const selectedAudioUrl = input.audio?.audioUrl || input.audio?.backgroundMusicUrl || null;
    if (selectedAudioUrl) {
      try {
        renderStage = "mixing audio";
        const isRemote = /^https?:\/\//i.test(selectedAudioUrl);
        await execa(ffmpegPath, [
          "-y",
          "-i",
          workingVideoPath,
          ...(!isRemote ? ["-stream_loop", "-1"] : []),
          "-i",
          selectedAudioUrl,
          "-shortest",
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-movflags",
          "+faststart",
          finalOut,
        ], { timeout: 60_000 });
        workingVideoPath = finalOut;
        audioIncluded = true;
        audioStatus = "completed";
      } catch {
        audioStatus = "failed";
        warnings.push("Voiceover unavailable; silent captioned video rendered.");
      }
    } else {
      audioStatus = "setup_needed";
      warnings.push("Voiceover unavailable; silent captioned video rendered.");
    }
    if (!input.audio?.backgroundMusicUrl) {
      warnings.push("Background music unavailable; rendering continued without music.");
    }

    renderStage = "persisting rendered mp4";
    const data = await fs.promises.readFile(workingVideoPath);
    const { localPath, publicUrl, fileSizeBytes } = await writeGeneratedAsset({
      data,
      folder: "generated",
      mimeType: "video/mp4",
      jobId: input.jobId,
      ext: "mp4",
    });

    return {
      status: "completed",
      output: {
        publicUrl,
        filePath: localPath,
        mimeType: "video/mp4",
        durationSeconds: duration,
        sizeBytes: fileSizeBytes,
        metadata: {
          audioIncluded,
          captionsBurnedIn,
          captionMode,
          captionFormat,
          srt: srtText,
          vtt: vttText,
          audioStatus,
          captionStatus,
        },
      },
      warnings,
    };
  } catch (error) {
    const storageRoot = getLocalMediaStorageRoot();
    return {
      status: "setup_needed",
      errorMessage: `Media renderer failed during ${renderStage}. ffmpegPath=${ffmpegPath}; tmpDir=${tmpDir}; outputRoot=${storageRoot}; reason=${describeExecutionError(error)}`,
    };
  } finally {
    try {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}
