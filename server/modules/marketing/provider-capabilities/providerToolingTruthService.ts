import { inArray } from "drizzle-orm";
import { siteSettings } from "../../../../drizzle/schema";
import { getDb } from "../../../db";
import { getMarketingConnectorReadiness } from "../connector-readiness";
import { getMarketingResultsSummary } from "../results-conversion";
import { getProviderHealth } from "../../../_core/ai/providers/providerRegistry";
import { defaultWorkspaceBudgetPolicy } from "./marketingBudgetPolicy";
import { getMarketingTaskCapabilityEntry } from "./marketingTaskCapabilityMatrix";
import { resolveMarketingProviderRoute } from "./marketingProviderRouteResolver";
import { listMarketingProviderModels } from "./providerModelStore";
import type { MarketingProviderName, MarketingTask } from "./providerCapabilityTypes";

const PROVIDERS: MarketingProviderName[] = ["genx", "qwen", "huggingface"];
const TOOLING_TASKS: MarketingTask[] = [
  "campaign_strategy",
  "platform_copywriting",
  "email_generation",
  "scriptwriting",
  "scene_planning",
  "image_generation",
  "avatar_generation",
  "avatar_lipsync",
  "voiceover",
  "music_generation",
  "visual_qa",
];

const PROVIDER_KEYS: Record<MarketingProviderName, { db: string[]; env: string }> = {
  genx: { db: ["marketing_genx_api_key", "genx_api_key"], env: "GENX_API_KEY" },
  qwen: { db: ["marketing_qwen_api_key", "qwen_api_key"], env: "QWEN_API_KEY" },
  huggingface: { db: ["marketing_huggingface_api_key", "huggingface_api_key"], env: "HUGGINGFACE_API_KEY" },
};

function classifyHuggingFaceReason(message: string | null | undefined): string | null {
  const lower = String(message ?? "").toLowerCase();
  if (!lower) return null;
  if (lower.includes("401") || lower.includes("unauthorized") || lower.includes("invalid key")) return "invalid key";
  if (lower.includes("permission") || lower.includes("forbidden") || lower.includes("403")) return "missing permissions";
  if (lower.includes("rate") && (lower.includes("limit") || lower.includes("429"))) return "rate-limited";
  if (lower.includes("endpoint") || lower.includes("network") || lower.includes("unavailable") || lower.includes("timeout")) return "endpoint unavailable";
  if (lower.includes("no configured") || lower.includes("no model")) return "no model resolved";
  if (lower.includes("unsupported") || lower.includes("not executable")) return "unsupported task";
  return "unknown";
}

async function getProviderKeySources() {
  const db = await getDb();
  if (!db) {
    return Object.fromEntries(PROVIDERS.map((provider) => [provider, process.env[PROVIDER_KEYS[provider].env] ? "env" : "missing"])) as Record<MarketingProviderName, "db" | "env" | "missing">;
  }
  const keys = Object.values(PROVIDER_KEYS).flatMap((item) => item.db);
  const rows = await db
    .select({ key: siteSettings.key, value: siteSettings.value })
    .from(siteSettings)
    .where(inArray(siteSettings.key, keys));
  const valueByKey = new Map(rows.map((row) => [row.key, row.value]));
  const result: Record<MarketingProviderName, "db" | "env" | "missing"> = {
    genx: "missing",
    qwen: "missing",
    huggingface: "missing",
  };
  for (const provider of PROVIDERS) {
    const dbHas = PROVIDER_KEYS[provider].db.some((key) => Boolean(String(valueByKey.get(key) ?? "").trim()));
    if (dbHas) {
      result[provider] = "db";
      continue;
    }
    result[provider] = process.env[PROVIDER_KEYS[provider].env] ? "env" : "missing";
  }
  return result;
}

export async function getMarketingProviderToolingTruth(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  mode?: "standard" | "elite";
}) {
  const [models, providerHealth, keySourceByProvider, connectorReadiness, resultsSummary] = await Promise.all([
    listMarketingProviderModels({ tenantId: input.tenantId, workspaceId: input.workspaceId }),
    getProviderHealth(),
    getProviderKeySources(),
    getMarketingConnectorReadiness({ tenantId: input.tenantId, workspaceId: input.workspaceId }),
    getMarketingResultsSummary({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId }),
  ]);

  const policy = defaultWorkspaceBudgetPolicy(input.mode ?? "standard");
  const taskRoutes = await Promise.all(TOOLING_TASKS.map(async (marketingTask) => {
    const route = await resolveMarketingProviderRoute({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      task: marketingTask,
      policy,
    });
    return {
      marketingTask,
      canonicalTask: getMarketingTaskCapabilityEntry(marketingTask).canonicalTask,
      status: route.status,
      provider: route.selected?.provider ?? null,
      modelId: route.selected?.modelId ?? null,
      reason: route.reason,
      candidates: route.candidates,
      rejectedCandidates: route.rejectedCandidates,
    };
  }));

  const providers = Object.fromEntries(PROVIDERS.map((provider) => {
    const health = providerHealth.find((item) => item.provider === provider);
    const providerModels = models.filter((item) => item.provider === provider);
    const executableTaskCount = new Set(providerModels.flatMap((item) => item.supportedTasks.map((task) => String(task)))).size;
    const readyTaskCount = new Set(providerModels.filter((item) => item.setupStatus === "ready").flatMap((item) => item.supportedTasks.map((task) => String(task)))).size;
    const degradedReason = provider === "huggingface"
      ? classifyHuggingFaceReason(health?.lastError ?? health?.message)
      : health?.status === "degraded"
        ? health?.lastError ?? health?.message ?? "Provider degraded"
        : null;
    const recommendations = !health?.configured
      ? ["Add provider API key in Settings > Provider keys."]
      : health?.status === "degraded"
        ? provider === "huggingface"
          ? [`Resolve Hugging Face issue: ${degradedReason ?? "unknown"}.`]
          : ["Run provider test and sync capabilities after updating provider model settings."]
        : ["Run Sync all capabilities after changing models or keys."];
    return [provider, {
      keyConfigured: keySourceByProvider[provider] !== "missing",
      configured: keySourceByProvider[provider] !== "missing",
      keySource: keySourceByProvider[provider],
      healthStatus: health?.status ?? "offline",
      lastTestStatus: health?.lastTestStatus ?? null,
      lastError: health?.lastError ?? null,
      degradedReason,
      discoveredModelCount: providerModels.length,
      executableTaskCount,
      readyTaskCount,
      recommendations,
    }];
  })) as Record<MarketingProviderName, unknown>;

  const publishingBlockers = connectorReadiness.platforms
    .filter((item) => item.status !== "ready_for_posting")
    .map((item) => `${item.platform}: ${item.reason}`);
  const routeBlockers = taskRoutes
    .filter((route) => route.status !== "ready")
    .map((route) => `${route.marketingTask}: ${route.reason ?? route.status}`);

  const blockers = [...routeBlockers, ...publishingBlockers];
  const recommendations = blockers.length
    ? [
      "Run Test all providers and then Sync all capabilities.",
      "Connect blocked publishing platforms or use export/manual flow until connected.",
    ]
    : ["Provider routes and publishing connectors are ready."];

  return {
    providers,
    taskRoutes,
    publishing: {
      connectors: connectorReadiness.platforms,
      exportFirstAvailable: true,
      blockedUntilConnected: publishingBlockers.length > 0,
    },
    attribution: {
      redirectRouteAvailable: true,
      clickTrackingAvailable: true,
      conversionRecordingAvailable: true,
      manualMetricsAvailable: true,
      resultsRows: resultsSummary.counts.rows,
    },
    blockers,
    recommendations,
  };
}
