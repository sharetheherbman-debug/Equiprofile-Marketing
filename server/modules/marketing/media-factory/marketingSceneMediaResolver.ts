/**
 * marketingSceneMediaResolver.ts — PR64O
 *
 * Extended scene media resolution with full provider fallback chain:
 *   1. Preserve existing uploaded / library / stock assets
 *   2. Try Pexels / Pixabay stock media
 *   3. If stock unavailable, try GenX / Hugging Face image / video generation
 *   4. Record exact failure reasons for every attempted source
 *   5. Only fall back to text_card after ALL sources fail
 *
 * Fallback-only output: every text_card scene gets sourceMetadata with
 * the full list of sources attempted and why each failed.
 */

import type { MarketingStudioScene } from "../../../../shared/_core/marketingStudioPlan";
import {
  searchMarketingStockMediaForScene,
  buildMarketingStockQuery,
  type MarketingStockMediaItem,
} from "./marketingStockMediaService";
import {
  resolveMarketingProviderRoute,
  defaultWorkspaceBudgetPolicy,
} from "../provider-capabilities";

export type SceneMediaAttemptStatus =
  | "preserved"
  | "stock_selected"
  | "provider_generated"
  | "text_card_fallback";

export interface SceneMediaAttemptRecord {
  sceneId: string;
  finalStatus: SceneMediaAttemptStatus;
  attempts: Array<{
    source: string;
    outcome: "success" | "setup_needed" | "unavailable" | "no_results" | "skipped";
    reason: string;
  }>;
  selectionReason: string | null;
}

export interface ResolvedSceneMediaResult {
  /** Overall assembly status: ok if at least one scene has real media. */
  status: "ok" | "all_fallback" | "setup_needed";
  scenes: MarketingStudioScene[];
  perSceneAttempts: SceneMediaAttemptRecord[];
  warnings: string[];
  /** True only if every scene ended up as text_card. */
  allFallback: boolean;
}

function hasRealMediaAsset(scene: MarketingStudioScene): boolean {
  if (scene.sourceType === "text_card" || scene.mediaKind === "text_card") return false;
  return Boolean(scene.assetUrl);
}

function isManuallyRetained(scene: MarketingStudioScene): boolean {
  const reason = String(scene.selectionReason ?? "").toLowerCase();
  return reason.includes("manual");
}

/**
 * Attempt to source real media for a single scene using the AI image /
 * video generation route (GenX or Hugging Face). Returns outcome when the
 * provider route is not ready so the caller can fall through to text_card.
 */
async function tryProviderMediaForScene(input: {
  scene: MarketingStudioScene;
  tenantId: string;
  workspaceId: string;
  qualityMode: "standard" | "elite";
  originalUserPrompt: string;
}): Promise<{
  outcome: "success" | "setup_needed" | "unavailable";
  reason: string;
  updatedScene?: MarketingStudioScene;
}> {
  const policy = defaultWorkspaceBudgetPolicy(input.qualityMode);
  // Use image_generation for images; text_to_video_scene_clip for video
  const mediaTask = input.scene.mediaKind === "video"
    ? "text_to_video_scene_clip" as const
    : "image_generation" as const;

  const route = await resolveMarketingProviderRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: mediaTask,
    policy,
  }).catch(() => null);

  if (!route || route.status !== "ready" || !route.selected) {
    const routeStatus = route?.status ?? "provider_unavailable";
    const reason = route?.reason ?? "No provider route available for media generation.";
    return {
      outcome: routeStatus === "setup_needed" ? "setup_needed" : "unavailable",
      reason: `provider_media_route:${routeStatus} — ${reason}`,
    };
  }

  // Route is ready — record provider metadata and mark scene as generated.
  // Actual generation is deferred to the render worker; we store the resolved
  // route so the worker knows which provider to call.
  const providerName = route.selected.provider;
  const modelId = route.selected.modelId;
  const prompt = buildMarketingStockQuery({
    scene: {
      requiredSubject: input.scene.requiredSubject,
      visualPrompt: input.scene.visualPrompt,
      narration: input.scene.narration,
    },
    originalUserPrompt: input.originalUserPrompt,
  });

  const updatedScene: MarketingStudioScene = {
    ...input.scene,
    sourceType: "generated",
    mediaKind: input.scene.mediaKind === "video" ? "video" as const : "image" as const,
    provider: providerName,
    providerAssetId: null,
    assetUrl: null,
    previewUrl: null,
    sourceMetadata: {
      ...((input.scene.sourceMetadata as Record<string, unknown>) ?? {}),
      providerRoute: { provider: providerName, modelId, task: mediaTask },
      generationPrompt: prompt,
      source: "provider_generation",
      generationPending: true,
    },
    selectionReason: `provider_route_ready:${providerName}/${modelId}`,
    selectedAt: new Date().toISOString(),
    status: "asset_selected",
  };

  return {
    outcome: "success",
    reason: `provider_route_ready:${providerName}/${modelId}`,
    updatedScene,
  };
}

/**
 * Resolve scene media for a Reel / Short video using the full provider
 * fallback chain. This replaces the plain stock-only sourcing in the
 * createMarketingRenderJob route when a real provider route is available.
 */
export async function resolveReelSceneMedia(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  plan: {
    originalUserPrompt: string;
    audience?: string;
    productCategory?: string;
    scenes: MarketingStudioScene[];
  };
  /** Pass a custom search function for tests. */
  search?: typeof searchMarketingStockMediaForScene;
}): Promise<ResolvedSceneMediaResult> {
  const perSceneAttempts: SceneMediaAttemptRecord[] = [];
  const resolvedScenes: MarketingStudioScene[] = [];
  const warnings: string[] = [];

  for (const rawScene of input.plan.scenes) {
    const scene: MarketingStudioScene = {
      ...rawScene,
      mediaKind: rawScene.mediaKind ?? (rawScene.sourceType === "text_card" ? "text_card" : "video"),
      status: rawScene.status ?? "pending",
    } as MarketingStudioScene;

    const record: SceneMediaAttemptRecord = {
      sceneId: scene.id,
      finalStatus: "text_card_fallback",
      attempts: [],
      selectionReason: null,
    };

    // ── Step 1: preserve existing real media ─────────────────────────────
    if (hasRealMediaAsset(scene) || isManuallyRetained(scene)) {
      record.finalStatus = "preserved";
      record.selectionReason = scene.selectionReason ?? "existing_asset";
      record.attempts.push({ source: "existing_asset", outcome: "success", reason: "Asset already present." });
      perSceneAttempts.push(record);
      resolvedScenes.push(scene);
      continue;
    }

    // ── Step 2: try stock media ───────────────────────────────────────────
    const searchFn = input.search ?? searchMarketingStockMediaForScene;
    const sceneForSearch: Pick<MarketingStudioScene, "requiredSubject" | "visualPrompt" | "narration" | "mediaKind" | "sourceType"> = {
      requiredSubject: scene.requiredSubject,
      visualPrompt: scene.visualPrompt,
      narration: scene.narration,
      mediaKind: scene.mediaKind === "text_card" ? "video" : scene.mediaKind,
      sourceType: scene.sourceType === "text_card" ? "stock" : scene.sourceType,
    };

    const stockResult = await searchFn({
      scene: sceneForSearch,
      originalUserPrompt: input.plan.originalUserPrompt,
      audience: input.plan.audience,
      productCategory: input.plan.productCategory,
      providerPreference: "auto",
    }).catch((error: unknown) => ({
      status: "provider_unavailable" as const,
      items: [] as MarketingStockMediaItem[],
      query: "",
      provider: "auto" as const,
      message: error instanceof Error ? error.message : "stock_search_error",
    }));

    if (stockResult.status === "ok" && stockResult.items.length > 0) {
      const best = stockResult.items[0];
      const selectedScene: MarketingStudioScene = {
        ...scene,
        sourceType: "stock",
        mediaKind: best.mediaKind,
        assetUrl: best.assetUrl,
        previewUrl: best.previewUrl,
        provider: best.provider,
        providerAssetId: best.providerAssetId,
        sourceMetadata: {
          ...((scene.sourceMetadata as Record<string, unknown>) ?? {}),
          source: "stock",
          stockProvider: best.provider,
          stockQuery: stockResult.query,
          stockTitle: best.title,
        },
        selectionReason: `stock_selected:${best.provider}`,
        selectedAt: new Date().toISOString(),
        status: "asset_selected",
      };
      record.finalStatus = "stock_selected";
      record.selectionReason = selectedScene.selectionReason ?? null;
      record.attempts.push({
        source: `stock:${stockResult.provider}`,
        outcome: "success",
        reason: `Stock media found via ${best.provider}.`,
      });
      perSceneAttempts.push(record);
      resolvedScenes.push(selectedScene);
      continue;
    }

    const stockFailReason = stockResult.status === "setup_needed"
      ? `stock_setup_needed:${(stockResult as { message?: string }).message ?? "No stock API keys configured."}`
      : stockResult.items.length === 0
        ? `stock_no_results:${stockResult.query}`
        : `stock_unavailable:${(stockResult as { message?: string }).message ?? "Stock provider error."}`;

    record.attempts.push({
      source: `stock:${stockResult.provider}`,
      outcome: stockResult.status === "setup_needed" ? "setup_needed" : stockResult.items.length === 0 ? "no_results" : "unavailable",
      reason: stockFailReason,
    });

    // ── Step 3: try AI provider media generation ──────────────────────────
    const providerResult = await tryProviderMediaForScene({
      scene,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      qualityMode: input.qualityMode,
      originalUserPrompt: input.plan.originalUserPrompt,
    });

    record.attempts.push({
      source: `provider_generation:${scene.mediaKind === "video" ? "text_to_video_scene_clip" : "image_generation"}`,
      outcome: providerResult.outcome,
      reason: providerResult.reason,
    });

    if (providerResult.outcome === "success" && providerResult.updatedScene) {
      record.finalStatus = "provider_generated";
      record.selectionReason = providerResult.updatedScene.selectionReason ?? null;
      perSceneAttempts.push(record);
      resolvedScenes.push(providerResult.updatedScene);
      continue;
    }

    // ── Step 4: all sources failed — text_card fallback ───────────────────
    const attemptSummary = record.attempts
      .map((attempt) => `${attempt.source}:${attempt.outcome}`)
      .join(", ");
    const fallbackReason = `All media sources failed. Attempts: [${attemptSummary}]`;
    const fallbackScene: MarketingStudioScene = {
      ...scene,
      sourceType: "text_card",
      mediaKind: "text_card",
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      sourceMetadata: {
        source: "fallback_text_card",
        fallbackReason,
        attemptedSources: record.attempts,
      },
      selectionReason: fallbackReason,
      selectedAt: new Date().toISOString(),
      status: "needs_review",
    } as unknown as MarketingStudioScene;
    record.finalStatus = "text_card_fallback";
    record.selectionReason = fallbackReason;
    warnings.push(`Scene ${scene.id}: ${fallbackReason}`);
    perSceneAttempts.push(record);
    resolvedScenes.push(fallbackScene);
  }

  const allFallback = resolvedScenes.every((scene) => scene.sourceType === "text_card" || scene.mediaKind === "text_card");
  const hasSetupNeeded = perSceneAttempts.some((record) =>
    record.attempts.some((attempt) => attempt.outcome === "setup_needed"),
  );

  return {
    status: allFallback ? "all_fallback" : hasSetupNeeded ? "setup_needed" : "ok",
    scenes: resolvedScenes,
    perSceneAttempts,
    warnings,
    allFallback,
  };
}
