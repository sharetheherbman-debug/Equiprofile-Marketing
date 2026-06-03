import { Worker } from "bullmq";
import { createMediaAsset } from "../../growth-engine";
import {
  getMarketingRenderJobById,
  updateMarketingRenderJobRecord,
} from "./marketingRenderJobStore";
import { renderMarketingTimeline } from "./marketingRenderer";
import { createMarketingAssetVersionRecord } from "./marketingMediaAssetVersionStore";
import { createMarketingVoiceover } from "./marketingVoiceService";
import { evaluateReelPublishReadiness } from "./reelPublishReadinessGate";

let redisWorker: Worker<{ jobId: string }> | null = null;

export function startMarketingRenderWorker() {
  if (!process.env.REDIS_URL || redisWorker) return redisWorker;
  redisWorker = new Worker<{ jobId: string }>(
    "marketing-render-jobs",
    async (job) => processMarketingRenderJob(job.data.jobId),
    {
      connection: { url: process.env.REDIS_URL },
    },
  );
  return redisWorker;
}

export async function processMarketingRenderJob(jobId: string) {
  const job = await getMarketingRenderJobById(jobId);
  if (!job) {
    return { status: "failed" as const, errorMessage: "Render job not found" };
  }

  if (job.status === "cancelled") {
    return { status: "cancelled" as const };
  }

  await updateMarketingRenderJobRecord({ id: job.id, status: "processing", errorMessage: null });

  // ── Audio resolution ─────────────────────────────────────────────────────
  // Attempt voiceover generation if the job requires audio and no audioUrl is
  // set yet. Record all attempts in attemptLog regardless of outcome.
  let resolvedAudioUrl: string | null = job.audio.audioUrl;
  let resolvedVoiceProvider: string | null = job.audio.voiceProvider;
  let resolvedVoiceModel: string | null = job.audio.voiceModel;
  const audioAttemptLog: NonNullable<typeof job.audio.attemptLog> = [];

  if (!resolvedAudioUrl) {
    if (job.timeline.render?.audioRequired) {
      const planId = job.planId ?? job.id;
      const voiceoverResult = await createMarketingVoiceover({
        tenantId: job.tenantId,
        workspaceId: job.workspaceId,
        hostAppId: job.hostAppId,
        plan: {
          id: planId,
          script: "",
          scenes: [],
          voiceoverScript: job.originalUserPrompt,
        },
        voiceId: null,
      }).catch((error: unknown) => ({
        status: "setup_needed" as const,
        reason: error instanceof Error ? error.message : "voice_generation_error",
        provider: null as null,
        model: null as null,
        voiceAssetId: null as null,
        audioUrl: null as null,
      }));

      const voiceReason = voiceoverResult.status === "setup_needed"
        ? `voiceover_setup_needed:${(voiceoverResult as { reason?: string }).reason ?? "unknown"}`
        : `Voiceover generated. provider=${voiceoverResult.provider} model=${voiceoverResult.model}`;

      audioAttemptLog.push({
        route: "voiceover_generation",
        provider: voiceoverResult.provider,
        model: voiceoverResult.model,
        outcome: voiceoverResult.status === "completed" ? "success" : "setup_needed",
        reason: voiceReason,
      });

      if (voiceoverResult.status === "completed" && voiceoverResult.audioUrl) {
        resolvedAudioUrl = voiceoverResult.audioUrl;
        resolvedVoiceProvider = voiceoverResult.provider;
        resolvedVoiceModel = voiceoverResult.model;
      }
    } else {
      audioAttemptLog.push({
        route: "voiceover_generation",
        provider: null,
        model: null,
        outcome: "skipped",
        reason: "audio_not_required_for_this_content_type",
      });
    }

    if (!resolvedAudioUrl) {
      audioAttemptLog.push({
        route: "music_generation",
        provider: null,
        model: null,
        outcome: "setup_needed",
        reason: "music_generation_route_not_available:no_music_provider_configured",
      });
    }
  }

  // Persist updated audio state before rendering
  const audioStatus = resolvedAudioUrl
    ? "completed" as const
    : job.timeline.render?.audioRequired
      ? "needs_audio_upgrade" as const
      : "setup_needed" as const;

  await updateMarketingRenderJobRecord({
    id: job.id,
    audioJson: JSON.stringify({
      ...job.audio,
      status: audioStatus,
      audioUrl: resolvedAudioUrl,
      voiceProvider: resolvedVoiceProvider,
      voiceModel: resolvedVoiceModel,
      attemptLog: audioAttemptLog.length > 0 ? audioAttemptLog : job.audio.attemptLog,
    }),
  });

  const rendered = await renderMarketingTimeline({
    jobId: job.id,
    timeline: job.timeline,
    brandOverlay: job.brandOverlay,
    audio: {
      audioUrl: resolvedAudioUrl,
      backgroundMusicUrl: job.audio.backgroundMusicUrl,
    },
    captions: {
      mode: job.captions.mode,
      format: job.captions.format,
      srt: job.captions.srt,
      vtt: job.captions.vtt,
    },
    testMode: process.env.NODE_ENV === "test" || process.env.MARKETING_RENDER_TEST_MODE === "true",
  });

  if (rendered.status === "setup_needed") {
    const setupJob = await updateMarketingRenderJobRecord({
      id: job.id,
      status: "setup_needed",
      errorMessage: rendered.errorMessage,
    });
    return {
      status: "setup_needed" as const,
      job: setupJob,
      errorMessage: rendered.errorMessage,
    };
  }
  if (!rendered.output.publicUrl) {
    const errorMessage = "Render completed but no playable URL was returned.";
    const failedJob = await updateMarketingRenderJobRecord({
      id: job.id,
      status: "failed",
      errorMessage,
      completedAt: new Date(),
    });
    return { status: "failed" as const, job: failedJob, errorMessage };
  }

  const mediaAsset = await createMediaAsset({
    tenantId: job.tenantId,
    type: "video",
    provider: "media_factory",
    task: "assembled_video",
    status: "completed",
    localPath: rendered.output.filePath,
    publicUrl: rendered.output.publicUrl,
    mimeType: rendered.output.mimeType,
    fileSizeBytes: rendered.output.sizeBytes,
    durationSeconds: rendered.output.durationSeconds,
    generationPrompt: job.originalUserPrompt,
    outputMetadata: {
      renderJobId: job.id,
      renderMode: job.renderMode,
      contentType: job.contentType,
      durationSeconds: rendered.output.durationSeconds,
      scenesCount: job.timeline.scenes.length,
      captionMode: job.captions.mode,
      captionFormat: job.captions.format,
      captionsBurnedIn: rendered.output.metadata?.captionsBurnedIn ?? false,
      audioIncluded: rendered.output.metadata?.audioIncluded ?? false,
      audioStatus: rendered.output.metadata?.audioStatus ?? audioStatus,
      captionStatus: rendered.output.metadata?.captionStatus ?? job.captions.status,
      captionSrt: rendered.output.metadata?.srt ?? job.captions.srt,
      captionVtt: rendered.output.metadata?.vtt ?? job.captions.vtt,
      voiceAssetId: job.audio.voiceAssetId,
      audioUrl: resolvedAudioUrl,
      voiceProvider: resolvedVoiceProvider,
      voiceModel: resolvedVoiceModel,
      brandKitId: job.brandKitId,
      overlayTemplate: job.overlayTemplate,
      brandOverlay: {
        brandKitId: job.brandOverlay.brandKitId ?? job.brandKitId,
        overlayTemplate: job.brandOverlay.overlayTemplate ?? job.overlayTemplate,
        brandName: job.brandOverlay.brandName,
        domain: job.brandOverlay.domain,
        cta: job.brandOverlay.cta,
      },
      source: "media_factory",
      renderWarnings: rendered.warnings ?? [],
    },
  });

  // ── Evaluate publish-readiness quality gate ───────────────────────────────
  const reloadedJob = await getMarketingRenderJobById(job.id);
  const jobForGate = reloadedJob ?? job;
  const qualityGate = evaluateReelPublishReadiness({
    ...jobForGate,
    outputPublicUrl: rendered.output.publicUrl,
    audio: {
      ...jobForGate.audio,
      status: audioStatus,
      audioUrl: resolvedAudioUrl,
      voiceProvider: resolvedVoiceProvider,
      voiceModel: resolvedVoiceModel,
      attemptLog: audioAttemptLog.length > 0 ? audioAttemptLog : jobForGate.audio.attemptLog,
    },
  });

  const completedJob = await updateMarketingRenderJobRecord({
    id: job.id,
    status: "completed",
    outputMediaAssetId: mediaAsset.id,
    outputPublicUrl: rendered.output.publicUrl,
    warnings: rendered.warnings ?? [],
    errorMessage: null,
    completedAt: new Date(),
    qualityStatus: qualityGate.status,
  });

  const sourceAssetIds = Array.from(new Set(
    job.timeline.scenes
      .map((scene) => scene.assetId)
      .filter((value): value is number => typeof value === "number" && value > 0),
  ));
  for (const sourceMediaAssetId of sourceAssetIds) {
    await createMarketingAssetVersionRecord({
      tenantId: job.tenantId,
      workspaceId: job.workspaceId,
      sourceMediaAssetId,
      derivedMediaAssetId: mediaAsset.id,
      versionType: "campaign_export",
      renderJobId: Number(job.id),
      brandKitId: job.brandKitId,
      metadata: {
        source: "marketing_media_factory",
        overlayTemplate: job.overlayTemplate,
      },
    }).catch(() => undefined);
  }

  return {
    status: "completed" as const,
    job: completedJob,
    output: rendered.output,
    qualityGate,
  };
}
