import { executeAITask } from "../../../_core/ai/orchestrator";
import type { TenantScope } from "../../../_core/ai/types";
import { createMediaAsset, getMediaAssetByJobId } from "../../growth-engine";
import { isPlayableMediaAsset } from "../../../_core/ai/mediaPlayability";
import {
  createMarketingProviderHealthCheck,
  defaultWorkspaceBudgetPolicy,
  resolveMarketingProviderRoute,
} from "../provider-capabilities";

function buildSetupNeededFromRoute(route: {
  status: string;
  reason: string | null;
  candidates?: Array<{ provider: string; setupStatus: string }>;
}) {
  const missing: string[] = [];
  const candidates = route.candidates ?? [];
  if (!candidates.length) {
    missing.push("No image-capable provider model is configured for this workspace.");
  } else if (!candidates.some((candidate) => candidate.setupStatus === "ready")) {
    missing.push("Image-capable models exist but none are marked ready.");
  }
  if (route.status === "budget_blocked") {
    missing.push("Budget policy blocked all available image routes.");
  }
  if (route.reason) {
    missing.push(route.reason);
  }
  return Array.from(new Set(missing));
}

type GenerateImageStatus = "completed" | "processing" | "queued" | "setup_needed" | "failed";

export async function generateMarketingImageAsset(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId?: string;
  userId?: number;
  prompt: string;
  platform?: string;
  aspectRatio?: string;
  qualityMode: "standard" | "elite";
  campaignId?: number | null;
}) {
  const policy = defaultWorkspaceBudgetPolicy(input.qualityMode);
  const route = await resolveMarketingProviderRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: "image_generation",
    policy,
  });

  if (route.status !== "ready" || !route.selected) {
    const missing = buildSetupNeededFromRoute(route);
    const setupAsset = await createMediaAsset({
      tenantId: input.tenantId,
      userId: input.userId,
      campaignId: input.campaignId ?? undefined,
      type: "image",
      provider: route.candidates[0]?.provider ?? undefined,
      task: "text_to_image",
      status: "failed",
      generationPrompt: input.prompt,
      errorMessage: "Image generation setup is incomplete.",
      outputMetadata: {
        resultType: "setup_needed",
        mediaTruth: "not_playable",
        routeStatus: route.status,
        routeReason: route.reason,
        missing,
        platform: input.platform ?? null,
        aspectRatio: input.aspectRatio ?? null,
      },
    });
    return {
      status: "setup_needed" as const,
      assetId: setupAsset.id,
      jobId: null,
      publicUrl: null,
      mimeType: null,
      provider: route.selected?.provider ?? null,
      model: route.selected?.modelId ?? null,
      reason: route.reason ?? "Image provider route is not ready.",
      setupNeeded: missing,
      errorMessage: "Image generation setup is incomplete.",
    };
  }

  const tenantScope: TenantScope = {
    tenantType: "stable",
    tenantId: input.tenantId,
    initiatedByUserId: input.userId,
  };

  try {
    const result = await executeAITask({
      task: "text_to_image",
      agentId: "MediaAgent",
      tenantScope,
      requiresApproval: false,
      input: {
        prompt: input.prompt,
        model: route.selected.modelId,
        platform: input.platform,
        aspectRatio: input.aspectRatio,
        hostAppId: input.hostAppId ?? "workspace",
      },
    });

    const status: GenerateImageStatus = result.status === "queued" ? "processing" : result.status === "completed" ? "completed" : "failed";
    const jobId = result.jobId ?? null;
    const byJob = jobId ? await getMediaAssetByJobId(jobId).catch(() => null) : null;
    const asset = byJob;

    await createMarketingProviderHealthCheck({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      provider: route.selected.provider as "genx" | "qwen" | "huggingface",
      modelId: route.selected.modelId,
      task: "image_generation",
      status: status === "failed" ? "degraded" : "ok",
      errorMessage: status === "failed" ? (result as { message?: string }).message ?? "image_generation_failed" : null,
    }).catch(() => undefined);

    if (asset?.status === "completed" && isPlayableMediaAsset(asset)) {
      return {
        status: "completed" as const,
        assetId: asset.id,
        jobId,
        publicUrl: asset.publicUrl ?? null,
        mimeType: asset.mimeType ?? null,
        provider: route.selected.provider,
        model: route.selected.modelId,
        reason: null,
        setupNeeded: [] as string[],
        errorMessage: null,
      };
    }

    if (asset?.status === "failed") {
      return {
        status: "failed" as const,
        assetId: asset.id,
        jobId,
        publicUrl: null,
        mimeType: asset.mimeType ?? null,
        provider: route.selected.provider,
        model: route.selected.modelId,
        reason: asset.errorMessage ?? "Provider did not return playable image output.",
        setupNeeded: [] as string[],
        errorMessage: asset.errorMessage ?? "Provider did not return playable image output.",
      };
    }

    return {
      status: "processing" as const,
      assetId: asset?.id ?? null,
      jobId,
      publicUrl: null,
      mimeType: null,
      provider: route.selected.provider,
      model: route.selected.modelId,
      reason: "Image job queued and awaiting playable output.",
      setupNeeded: [] as string[],
      errorMessage: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const setupNeeded = /setup_needed|provider_missing|provider_unavailable/i.test(message);
    const failedAsset = await createMediaAsset({
      tenantId: input.tenantId,
      userId: input.userId,
      campaignId: input.campaignId ?? undefined,
      type: "image",
      provider: route.selected.provider,
      task: "text_to_image",
      status: "failed",
      generationPrompt: input.prompt,
      errorMessage: message,
      outputMetadata: {
        resultType: setupNeeded ? "setup_needed" : "failed",
        mediaTruth: "not_playable",
        routeStatus: route.status,
        routeReason: route.reason,
        selectedProvider: route.selected.provider,
        selectedModel: route.selected.modelId,
        platform: input.platform ?? null,
        aspectRatio: input.aspectRatio ?? null,
      },
    });

    return {
      status: setupNeeded ? "setup_needed" as const : "failed" as const,
      assetId: failedAsset.id,
      jobId: null,
      publicUrl: null,
      mimeType: null,
      provider: route.selected.provider,
      model: route.selected.modelId,
      reason: message,
      setupNeeded: setupNeeded ? [message] : [],
      errorMessage: message,
    };
  }
}
