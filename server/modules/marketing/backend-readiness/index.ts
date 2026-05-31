import { getRuntimeConfig } from "../../../dynamicConfig";
import {
  defaultWorkspaceBudgetPolicy,
  getMarketingProviderReadinessSummary,
  listMarketingProviderModels,
  listMarketingTaskCapabilityEntries,
  resolveMarketingProviderRoute,
  type MarketingTask,
} from "../provider-capabilities";
import { listMarketingVoiceProfiles, listMarketingAudioBeds } from "../avatar-voice-music";

export type MarketingBackendReadinessStatus = "ready" | "setup_needed" | "partial" | "blocked" | "failed";

function statusFromFlags(input: { ready: boolean; partial?: boolean; blocked?: boolean }): MarketingBackendReadinessStatus {
  if (input.blocked) return "blocked";
  if (input.ready) return "ready";
  if (input.partial) return "partial";
  return "setup_needed";
}

async function checkBinary(name: "ffmpeg" | "remotion") {
  try {
    if (name === "ffmpeg") {
      const mod = await import("ffmpeg-static");
      return Boolean(mod.default);
    }
    await import("remotion");
    return true;
  } catch {
    return false;
  }
}

export async function getMarketingBackendReadiness(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode?: "standard" | "elite";
}) {
  const mode = input.qualityMode ?? "standard";
  const policy = defaultWorkspaceBudgetPolicy(mode);
  const providerReadiness = await getMarketingProviderReadinessSummary({ tenantId: input.tenantId, workspaceId: input.workspaceId });
  const inventory = await listMarketingProviderModels({ tenantId: input.tenantId, workspaceId: input.workspaceId });
  const tasks = listMarketingTaskCapabilityEntries();

  const taskRoutes = await Promise.all(tasks.map(async (task) => {
    const route = await resolveMarketingProviderRoute({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      task: task.task,
      policy,
    });
    return {
      task: task.task,
      status: route.status,
      reason: route.reason,
      selected: route.selected,
    };
  }));

  const stockPexels = await getRuntimeConfig("pexels_api_key", "PEXELS_API_KEY");
  const stockPixabay = await getRuntimeConfig("pixabay_api_key", "PIXABAY_API_KEY");

  const ffmpegReady = await checkBinary("ffmpeg");
  const remotionReady = await checkBinary("remotion");

  const voices = await listMarketingVoiceProfiles({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
  });
  const audioBeds = await listMarketingAudioBeds({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
  });

  const blockedIssues: string[] = [];
  const warnings: string[] = [];

  if (!providerReadiness.providers.some((provider) => provider.setupStatus === "ready")) {
    blockedIssues.push("No ready model providers available for current workspace.");
  }
  if (!stockPexels && !stockPixabay) {
    warnings.push("Stock media providers are not configured; sourceStockMedia will stay setup_needed.");
  }
  if (!ffmpegReady || !remotionReady) {
    blockedIssues.push("Media Factory runtime dependencies missing (ffmpeg/remotion).");
  }
  if (!voices.length) {
    warnings.push("No voice profiles configured yet.");
  }

  const routeBlockedCount = taskRoutes.filter((item) => item.status === "setup_needed" || item.status === "provider_unavailable" || item.status === "budget_blocked").length;

  const routeStatus = statusFromFlags({
    ready: routeBlockedCount === 0,
    partial: routeBlockedCount > 0 && routeBlockedCount < taskRoutes.length,
    blocked: routeBlockedCount === taskRoutes.length,
  });

  const status = blockedIssues.length
    ? "blocked"
    : routeStatus === "ready" && (stockPexels || stockPixabay) && ffmpegReady && remotionReady
      ? "ready"
      : routeStatus === "partial"
        ? "partial"
        : "setup_needed";

  return {
    status,
    providerCapabilityReadiness: {
      status: providerReadiness.providers.some((provider) => provider.setupStatus === "ready")
        ? "partial"
        : "setup_needed",
      providers: providerReadiness.providers,
    },
    modelInventoryCounts: {
      total: inventory.length,
      ready: inventory.filter((model) => model.setupStatus === "ready").length,
      byProvider: inventory.reduce<Record<string, number>>((acc, model) => {
        acc[model.provider] = (acc[model.provider] ?? 0) + 1;
        return acc;
      }, {}),
    },
    taskRouteStatus: taskRoutes,
    stockMediaConfigStatus: statusFromFlags({ ready: Boolean(stockPexels || stockPixabay) }),
    mediaFactoryConfigStatus: statusFromFlags({ ready: ffmpegReady && remotionReady, partial: ffmpegReady || remotionReady }),
    ffmpegAvailability: ffmpegReady,
    remotionAvailability: remotionReady,
    avatarReadiness: statusFromFlags({
      ready: taskRoutes.some((route) => route.task === "avatar_generation" && route.status === "ready"),
      partial: taskRoutes.some((route) => route.task === "avatar_generation"),
    }),
    voiceReadiness: statusFromFlags({
      ready: voices.some((voice) => voice.status === "active" && Boolean(voice.providerVoiceId)),
      partial: voices.length > 0,
    }),
    musicReadiness: statusFromFlags({
      ready: audioBeds.some((bed) => bed.status === "ready"),
      partial: audioBeds.length > 0,
    }),
    qaReadiness: "ready" as MarketingBackendReadinessStatus,
    visualQaReadiness: taskRoutes.some((route) => route.task === "visual_qa" && route.status === "ready")
      ? "ready" as MarketingBackendReadinessStatus
      : "setup_needed" as MarketingBackendReadinessStatus,
    schedulingExportReadiness: "ready" as MarketingBackendReadinessStatus,
    publishingReadiness: "setup_needed" as MarketingBackendReadinessStatus,
    resultsConversionReadiness: "partial" as MarketingBackendReadinessStatus,
    agentWorkforceReadiness: statusFromFlags({
      ready: taskRoutes.some((route) => route.task === "campaign_strategy" && route.status === "ready"),
      partial: true,
    }),
    blockingIssues: blockedIssues,
    warnings,
    nextRecommendedBackendFrontendStep: blockedIssues.length
      ? "Resolve backend blocking issues before frontend rebuild."
      : "Backend contracts are available; frontend rebuild can proceed against readiness endpoint.",
  };
}

export type MarketingBackendReadinessResponse = Awaited<ReturnType<typeof getMarketingBackendReadiness>>;
