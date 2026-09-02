import { getRuntimeConfig, getRuntimeConfigDiagnostics } from "../../../dynamicConfig";
import { aiUsageAnalytics } from "../analytics/usageAnalytics";
import { resolveModelCandidatesForTask, type ProviderModelCandidate } from "../modelRegistry";
import { recordProviderTelemetry } from "../providerTelemetry";
import type { AIProviderName, AITask, TaskExecutionResult } from "../types";
import { executeGenXTask, resolveGenXConfig, testGenXTextGeneration, testRawGenXConnection } from "./genxProvider";

type ProviderHealth = {
  provider: "genx";
  configured: boolean;
  status: "healthy" | "degraded" | "offline";
  message: string;
  endpoint?: string;
  model?: string;
  lastSuccessAt?: string;
  lastErrorAt?: string;
  lastError?: string;
  lastLatencyMs?: number;
  lastTestAt?: string;
  lastTestStatus?: "success" | "failed" | "skipped" | "missing_key" | "missing_base_url";
  lastStatusCode?: number | null;
  lastMediaSuccessAt?: string;
  liveReady: boolean;
};

const runtime: Omit<ProviderHealth, "provider" | "configured" | "status" | "message" | "liveReady"> = {};
const LIVE_TEST_TTL_MS = 15 * 60 * 1000;

function hasRecentLiveSuccess() {
  return Boolean(runtime.lastSuccessAt && Date.now() - new Date(runtime.lastSuccessAt).getTime() <= LIVE_TEST_TTL_MS);
}

function recordTest(result: Record<string, unknown>) {
  const now = new Date().toISOString();
  const success = result.status === "success";
  runtime.lastTestAt = now;
  runtime.lastTestStatus = (result.status as ProviderHealth["lastTestStatus"]) ?? (success ? "success" : "failed");
  runtime.lastStatusCode = typeof result.statusCode === "number" ? result.statusCode : null;
  if (success) {
    runtime.lastSuccessAt = now;
    runtime.lastLatencyMs = Number(result.latencyMs ?? 0);
    runtime.lastError = undefined;
    runtime.lastErrorAt = undefined;
  } else {
    runtime.lastSuccessAt = undefined;
    runtime.lastErrorAt = now;
    runtime.lastError = String(result.responseSummary ?? result.reason ?? result.error ?? "GenX test failed");
  }
}

export function resetProviderRuntimeForTests() {
  for (const key of Object.keys(runtime) as Array<keyof typeof runtime>) delete runtime[key];
}

export class ProviderSelectionError extends Error {
  readonly code: "provider_missing" | "provider_unavailable";

  constructor(code: "provider_missing" | "provider_unavailable", message: string) {
    super(message);
    this.name = "ProviderSelectionError";
    this.code = code;
  }
}

export function isCoreProductionProvider(provider: AIProviderName): provider is "genx" {
  return provider === "genx";
}

export async function isConfigured(provider: AIProviderName): Promise<boolean> {
  return provider === "genx" && Boolean(await getRuntimeConfig("genx_api_key", "GENX_API_KEY"));
}

export async function isProviderAvailableForTask(provider: AIProviderName, task: AITask): Promise<boolean> {
  if (provider !== "genx" || !(await isConfigured(provider))) return false;
  const config = await resolveGenXConfig();
  if (!config.endpoint) return false;
  const candidates = (await resolveModelCandidatesForTask(task)).filter((candidate) => candidate.provider === "genx");
  if (!candidates.length) return false;
  if (task !== "chat" && task !== "copywriting") return true;
  if (hasRecentLiveSuccess()) return true;
  try {
    const result = await testGenXTextGeneration();
    recordTest(result as Record<string, unknown>);
    return result.status === "success";
  } catch (error) {
    recordTest({ status: "failed", error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

export function getProviderRuntimeDiagnostics() {
  return { mode: getRuntimeConfigDiagnostics(), providers: { genx: { ...runtime } } };
}

export async function getProviderHealth(): Promise<ProviderHealth[]> {
  const [configured, config] = await Promise.all([isConfigured("genx"), resolveGenXConfig()]);
  const liveReady = hasRecentLiveSuccess();
  return [{
    provider: "genx",
    configured,
    status: liveReady ? "healthy" : configured ? "degraded" : "offline",
    message: liveReady ? "GenX live test passed recently" : configured
      ? "GenX is configured, but a live text-generation test has not passed recently."
      : "GenX is not configured.",
    endpoint: config.endpoint,
    model: config.model,
    liveReady,
    ...runtime,
  }];
}

export async function executeWithProvider(
  provider: AIProviderName,
  task: AITask,
  input: Record<string, unknown>,
  timeoutMs: number,
  candidate?: ProviderModelCandidate,
): Promise<TaskExecutionResult> {
  if (provider !== "genx") {
    throw new ProviderSelectionError("provider_unavailable", `Core production permits GenX only for task "${task}"`);
  }
  try {
    const result = await executeGenXTask(task, candidate ? {
      ...input,
      model: candidate.id,
      routeReason: candidate.routeReason,
      endpointFamily: candidate.endpointFamily,
    } : input, timeoutMs);
    const routed = { ...result, model: result.model || candidate?.id || "", routeReason: result.routeReason ?? candidate?.routeReason, endpointFamily: result.endpointFamily ?? candidate?.endpointFamily };
    runtime.lastSuccessAt = new Date().toISOString();
    runtime.lastLatencyMs = routed.latencyMs;
    aiUsageAnalytics.recordUsage({ at: new Date().toISOString(), provider: "genx", task, latencyMs: routed.latencyMs, promptTokens: routed.usage?.promptTokens ?? 0, completionTokens: routed.usage?.completionTokens ?? 0 });
    await recordProviderTelemetry({ provider: "genx", model: routed.model, task, tenantId: "global", latencyMs: routed.latencyMs, success: true });
    return routed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    runtime.lastErrorAt = new Date().toISOString();
    runtime.lastError = message;
    await recordProviderTelemetry({ provider: "genx", model: candidate?.id ?? "unknown", task, tenantId: "global", success: false, failureReason: message });
    throw error;
  }
}

export async function executeWithFallback(
  _providers: AIProviderName[], task: AITask, input: Record<string, unknown>, timeoutMs: number, maxRetries = 1,
): Promise<TaskExecutionResult> {
  if (!(await isProviderAvailableForTask("genx", task))) {
    throw new ProviderSelectionError("provider_missing", `GenX is not available for task "${task}"`);
  }
  const candidates = (await resolveModelCandidatesForTask(task)).filter((candidate) => candidate.provider === "genx");
  let lastError: Error | null = null;
  for (const candidate of candidates) {
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        return await executeWithProvider("genx", task, input, timeoutMs, candidate);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        aiUsageAnalytics.recordFailure({ at: new Date().toISOString(), provider: "genx", task, error: `model ${candidate.id} attempt ${attempt + 1}: ${lastError.message}` });
      }
    }
  }
  throw new ProviderSelectionError("provider_unavailable", `GenX failed for task "${task}": ${lastError?.message ?? "no executable model"}`);
}

export async function runFullProviderSelfTest() {
  const modelCandidates = await resolveModelCandidatesForTask("copywriting", true);
  try {
    if (!(await isConfigured("genx"))) {
      return { checks: [{ provider: "genx", status: "skipped", reason: "Not configured" }], providers: await getProviderHealth() };
    }
    const raw = await testRawGenXConnection();
    const generated = await testGenXTextGeneration();
    recordTest(generated as Record<string, unknown>);
    return { checks: [{ ...raw, test: "raw_connectivity" }, { ...generated, test: "chat_copy_generation" }], modelCount: modelCandidates.length, providers: await getProviderHealth() };
  } catch (error) {
    recordTest({ status: "failed", error: error instanceof Error ? error.message : String(error) });
    return { checks: [{ provider: "genx", status: "failed", error: runtime.lastError }], providers: await getProviderHealth() };
  }
}
