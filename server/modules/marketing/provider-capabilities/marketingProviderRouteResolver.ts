import { evaluateBudgetPolicy } from "./marketingBudgetPolicy";
import { getMarketingTaskCapabilityEntry } from "./marketingTaskCapabilityMatrix";
import { listMarketingProviderModels } from "./providerModelStore";
import type { MarketingTask, WorkspaceBudgetPolicy } from "./providerCapabilityTypes";

export type MarketingRouteDecision = {
  status: "ready" | "setup_needed" | "provider_unavailable" | "budget_blocked";
  marketingTask: MarketingTask;
  canonicalTask: string;
  reason: string | null;
  budgetStatus: "allowed" | "blocked";
  setupStatus: "ready" | "setup_needed";
  providerHealthStatus: string | null;
  selected: {
    provider: string;
    modelId: string;
    category: string;
    canonicalTask: string;
    routeType: "model" | "media_factory_assembled_video";
  } | null;
  candidates: Array<{ provider: string; modelId: string; category: string; costTier: string; setupStatus: string }>;
  rejectedCandidates: Array<{ provider: string; modelId: string; reason: string; setupStatus: string }>;
};

export async function resolveMarketingProviderRoute(input: {
  tenantId: string;
  workspaceId: string;
  task: MarketingTask;
  policy: WorkspaceBudgetPolicy;
  provider?: string;
  modelId?: string;
}) : Promise<MarketingRouteDecision> {
  const taskConfig = getMarketingTaskCapabilityEntry(input.task);

  const models = await listMarketingProviderModels({ tenantId: input.tenantId, workspaceId: input.workspaceId });
  const preference = input.policy.mode === "elite" ? taskConfig.elitePreference : taskConfig.standardPreference;
  const allowedProviders = input.policy.mode === "standard" && !input.policy.allowGenXFallbackInStandard
    ? preference.filter((provider) => provider !== "genx")
    : preference;
  const providerPriority = new Map(allowedProviders.map((provider, index) => [provider, index]));
  const filteredBySelection = models
    .filter((model) => !input.provider || model.provider === input.provider)
    .filter((model) => !input.modelId || model.modelId.toLowerCase() === input.modelId.toLowerCase());

  const accepted = filteredBySelection
    .filter((model) => {
      const supportedTasks = model.supportedTasks.map((task) => String(task));
      return supportedTasks.includes(input.task) || supportedTasks.includes(taskConfig.canonicalTask);
    })
    .filter((model) => model.setupStatus === "ready")
    .sort((a, b) => (providerPriority.get(a.provider) ?? Number.MAX_SAFE_INTEGER) - (providerPriority.get(b.provider) ?? Number.MAX_SAFE_INTEGER));

  const rejectedCandidates = filteredBySelection
    .filter((model) => !accepted.includes(model))
    .map((model) => {
      const supportedTasks = model.supportedTasks.map((task) => String(task));
      const matchesMarketingTask = supportedTasks.includes(input.task);
      const matchesCanonicalTask = supportedTasks.includes(taskConfig.canonicalTask);
      const reason = !matchesMarketingTask && !matchesCanonicalTask
        ? `unsupported_task:${input.task}|canonical:${taskConfig.canonicalTask}`
        : model.setupStatus !== "ready"
          ? `setup_status:${model.setupStatus}`
          : "filtered_out";
      return {
        provider: model.provider,
        modelId: model.modelId,
        setupStatus: model.setupStatus,
        reason,
      };
    });

  if (!accepted.length) {
    return {
      status: "setup_needed",
      marketingTask: input.task,
      canonicalTask: taskConfig.canonicalTask,
      reason: "No ready provider model found for the requested marketing task.",
      budgetStatus: "allowed",
      setupStatus: "setup_needed",
      providerHealthStatus: null,
      selected: null,
      candidates: filteredBySelection
        .filter((model) => {
          const supportedTasks = model.supportedTasks.map((task) => String(task));
          return supportedTasks.includes(input.task) || supportedTasks.includes(taskConfig.canonicalTask);
        })
        .map((model) => ({ provider: model.provider, modelId: model.modelId, category: model.category, costTier: model.costTier, setupStatus: model.setupStatus })),
      rejectedCandidates,
    };
  }

  const chosen = accepted[0];
  const budget = evaluateBudgetPolicy({ policy: input.policy, costTier: chosen.costTier, task: input.task, provider: chosen.provider });
  if (!budget.allowed) {
    return {
      status: "budget_blocked",
      marketingTask: input.task,
      canonicalTask: taskConfig.canonicalTask,
      reason: budget.reason,
      budgetStatus: "blocked",
      setupStatus: "ready",
      providerHealthStatus: null,
      selected: null,
      candidates: accepted.map((model) => ({ provider: model.provider, modelId: model.modelId, category: model.category, costTier: model.costTier, setupStatus: model.setupStatus })),
      rejectedCandidates,
    };
  }

  return {
    status: "ready",
    marketingTask: input.task,
    canonicalTask: taskConfig.canonicalTask,
    reason: null,
    budgetStatus: "allowed",
    setupStatus: "ready",
    providerHealthStatus: null,
    selected: {
      provider: chosen.provider,
      modelId: chosen.modelId,
      category: chosen.category,
      canonicalTask: taskConfig.canonicalTask,
      routeType: "model",
    },
    candidates: accepted.map((model) => ({ provider: model.provider, modelId: model.modelId, category: model.category, costTier: model.costTier, setupStatus: model.setupStatus })),
    rejectedCandidates,
  };
}
