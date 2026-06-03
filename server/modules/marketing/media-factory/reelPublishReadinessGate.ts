/**
 * reelPublishReadinessGate.ts — PR64O
 *
 * Central quality gate for Reel / Short video publish-readiness.
 *
 * Statuses:
 *   needs_media_upgrade  — all scenes are text_card fallbacks
 *   needs_audio_upgrade  — vertical MP4 but missing audio stream
 *   draft_generated      — rendered but not meeting all criteria
 *   ready_for_review     — meets quality gate, ready for human review
 *   ready_to_export      — approved by reviewer, can be exported/posted
 *   posted               — real platform post ID confirmed
 */

import type { MarketingRenderJob } from "./renderJobTypes";
import type { ReelQualityStatus } from "./renderJobTypes";

export interface ReelPublishReadinessResult {
  status: ReelQualityStatus;
  reasons: string[];
  exportReady: boolean;
  postable: boolean;
  /** Human-friendly label shown in the UI. */
  label: string;
}

const VERTICAL_CONTENT_TYPES = new Set([
  "facebook_ad",
  "instagram_reel",
  "tiktok_video",
  "youtube_short",
]);

function isVerticalJob(job: MarketingRenderJob): boolean {
  if (VERTICAL_CONTENT_TYPES.has(job.contentType)) return true;
  if (job.timeline.render?.platformFormat === "vertical_short_video") return true;
  const prompt = String(job.originalUserPrompt ?? "").toLowerCase();
  return /facebook reel|instagram reel|tiktok|youtube short|\breel\b/.test(prompt);
}

function hasRealMediaScenes(job: MarketingRenderJob): boolean {
  return job.timeline.scenes.some(
    (scene) => scene.sourceType !== "text_card" && scene.mediaKind !== "text_card",
  );
}

function hasAudioStream(job: MarketingRenderJob): boolean {
  return Boolean(
    job.audio.audioUrl ||
    job.audio.backgroundMusicUrl ||
    job.audio.status === "completed",
  );
}

function isWithinDurationRange(job: MarketingRenderJob): boolean {
  const duration = job.durationTargetSeconds;
  if (!duration) return false;
  return duration >= 15 && duration <= 180;
}

function hasAllFallbackScenes(job: MarketingRenderJob): boolean {
  if (!job.timeline.scenes.length) return true;
  return job.timeline.scenes.every(
    (scene) => scene.sourceType === "text_card" || scene.mediaKind === "text_card",
  );
}

function hasBrandOrCta(job: MarketingRenderJob): boolean {
  return Boolean(
    job.brandOverlay?.brandName ||
    job.brandOverlay?.cta ||
    job.brandOverlay?.domain,
  );
}

/**
 * Evaluate the publish-readiness of a completed render job.
 *
 * This function is pure — it does not write to the database.
 * The render worker calls it and persists the returned `status`.
 */
export function evaluateReelPublishReadiness(job: MarketingRenderJob): ReelPublishReadinessResult {
  const reasons: string[] = [];

  // Only Reel/Short jobs are evaluated here; non-vertical jobs are always
  // "draft_generated" until reviewed.
  const isVertical = isVerticalJob(job);

  const hasOutput = Boolean(job.outputPublicUrl);
  const allFallback = hasAllFallbackScenes(job);
  const hasAudio = hasAudioStream(job);
  const withinDuration = isWithinDurationRange(job);
  const hasBrand = hasBrandOrCta(job);
  const hasMedia = hasRealMediaScenes(job);

  if (!isVertical) {
    // Non-vertical content goes through a lighter gate
    if (!hasOutput) reasons.push("output_url_missing");
    return {
      status: "draft_generated",
      reasons,
      exportReady: hasOutput,
      postable: false,
      label: "Draft generated",
    };
  }

  // Vertical Reel gate
  if (!hasOutput) reasons.push("output_url_missing");
  if (!withinDuration) reasons.push(`duration_out_of_range:${job.durationTargetSeconds}s`);
  if (allFallback) reasons.push("all_scenes_are_text_card_fallbacks");
  if (!hasAudio) reasons.push("no_audio_stream");
  if (!hasBrand) reasons.push("brand_or_cta_missing");

  // Check vertical dimensions
  const render = job.timeline.render;
  if (render) {
    if (render.width !== 1080) reasons.push(`width_expected_1080_got_${render.width}`);
    if (render.height !== 1920) reasons.push(`height_expected_1920_got_${render.height}`);
  }

  // Derive status
  if (allFallback && !hasAudio) {
    return {
      status: "draft_generated",
      reasons,
      exportReady: false,
      postable: false,
      label: "Draft generated, not ready to export/post",
    };
  }

  if (allFallback) {
    return {
      status: "needs_media_upgrade",
      reasons,
      exportReady: false,
      postable: false,
      label: "Needs media upgrade",
    };
  }

  if (!hasAudio) {
    return {
      status: "needs_audio_upgrade",
      reasons,
      exportReady: false,
      postable: false,
      label: "Needs audio upgrade",
    };
  }

  if (!hasOutput || !withinDuration) {
    return {
      status: "draft_generated",
      reasons,
      exportReady: false,
      postable: false,
      label: "Draft generated",
    };
  }

  if (hasMedia && hasAudio && hasOutput && withinDuration) {
    return {
      status: "ready_for_review",
      reasons,
      exportReady: true,
      postable: false,
      label: "Ready for review",
    };
  }

  return {
    status: "draft_generated",
    reasons,
    exportReady: hasOutput,
    postable: false,
    label: "Draft generated",
  };
}
