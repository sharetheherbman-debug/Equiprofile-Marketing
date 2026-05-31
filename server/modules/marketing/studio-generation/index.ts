import { nanoid } from "nanoid";
import { z } from "zod";
import { executeAITaskWithProviderRoute } from "../../../_core/ai/orchestrator";
import { MARKETING_STUDIO_SCENE_SCHEMA } from "../../../../shared/_core/marketingStudioSchemas";
import type { MarketingStudioScene } from "../../../../shared/_core/marketingStudioPlan";
import {
  createMarketingProviderHealthCheck,
  defaultWorkspaceBudgetPolicy,
  getMarketingTaskCapabilityEntry,
  resolveMarketingProviderRoute,
  type MarketingTask,
  type MarketingProviderName,
} from "../provider-capabilities";

export type MarketingStudioGenerationStatus = "generated" | "setup_needed" | "provider_unavailable" | "failed";

const SCENE_PLAN_SCHEMA = z.object({
  scenes: z.array(MARKETING_STUDIO_SCENE_SCHEMA).min(1),
  fallback_used: z.boolean().optional(),
  fallback_reason: z.string().optional(),
});

const SCRIPT_PAYLOAD_SCHEMA = z.object({
  title: z.string().min(1).max(260).optional(),
  brief: z.string().min(1).max(8000).optional(),
  script: z.string().min(1).max(20000).optional(),
  voiceoverScript: z.string().min(1).max(20000).optional(),
  requiredAssets: z.array(z.string().max(400)).optional(),
  platformNotes: z.array(z.string().max(400)).optional(),
  cta: z.string().min(1).max(400).optional(),
  hashtags: z.array(z.string().max(120)).optional(),
  complianceNotes: z.array(z.string().max(400)).optional(),
});

function extractOutputText(output: unknown): string {
  if (typeof output === "string") return output;
  if (!output || typeof output !== "object") return "";
  const record = output as Record<string, unknown>;
  const choices = record.choices;
  if (Array.isArray(choices)) {
    const first = choices[0] as Record<string, unknown> | undefined;
    const message = first?.message as Record<string, unknown> | undefined;
    if (typeof message?.content === "string" && message.content.trim()) return message.content;
  }
  const generatedText = (record[0] as Record<string, unknown> | undefined)?.generated_text;
  if (typeof generatedText === "string" && generatedText.trim()) return generatedText;
  if (typeof record.text === "string" && record.text.trim()) return record.text;
  return "";
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
    const slice = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

function normalizeScene(
  scene: Partial<MarketingStudioScene> & { id: string },
  index: number,
  route: { provider: string; modelId: string; task: string } | null,
): MarketingStudioScene {
  const parsed = MARKETING_STUDIO_SCENE_SCHEMA.parse({
    ...scene,
    id: scene.id || nanoid(),
    order: scene.order || index + 1,
    sourceType: scene.sourceType || "stock",
    mediaKind: scene.mediaKind || (scene.sourceType === "text_card" ? "text_card" : scene.sourceType === "avatar" ? "avatar" : "video"),
    status: scene.status || "pending",
    sourceMetadata: {
      ...(scene.sourceMetadata ?? {}),
      providerRoute: route,
    },
  });

  return {
    ...parsed,
    mediaKind: parsed.mediaKind ?? (parsed.sourceType === "text_card" ? "text_card" : parsed.sourceType === "avatar" ? "avatar" : "video"),
    assetUrl: parsed.assetUrl ?? null,
    previewUrl: parsed.previewUrl ?? null,
    provider: parsed.provider ?? null,
    providerAssetId: parsed.providerAssetId ?? null,
    sourceMetadata: (parsed.sourceMetadata as Record<string, unknown> | null) ?? null,
    selectedAt: parsed.selectedAt ?? null,
    selectionReason: parsed.selectionReason ?? null,
    status: parsed.status ?? "pending",
  };
}

function fallbackScenePlan(input: {
  prompt: string;
  durationTargetSeconds: number;
  existingScenes?: MarketingStudioScene[];
  reason: string;
}): MarketingStudioScene[] {
  if (input.existingScenes?.length) {
    return input.existingScenes.map((scene, index) => normalizeScene({
      ...scene,
      sourceMetadata: {
        ...(scene.sourceMetadata ?? {}),
        fallback_used: true,
        fallback_reason: input.reason,
      },
    }, index, null));
  }

  const baseDuration = Math.max(4, Math.floor(input.durationTargetSeconds / 3));
  const cleanPrompt = input.prompt.slice(0, 180);

  const generated: MarketingStudioScene[] = [
    {
      id: nanoid(),
      order: 1,
      durationSeconds: baseDuration,
      narration: `Open with the problem context for: ${cleanPrompt}`,
      visualPrompt: `Strong opening visual for ${cleanPrompt}`,
      negativePrompt: "blurry, off-topic, watermark, text artifacts",
      sourceType: "stock",
      requiredSubject: "problem statement",
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      mediaKind: "video",
      sourceMetadata: { fallback_used: true, fallback_reason: input.reason },
      selectedAt: null,
      selectionReason: null,
      status: "pending",
    },
    {
      id: nanoid(),
      order: 2,
      durationSeconds: baseDuration,
      narration: "Show the product/value transformation in practical use.",
      visualPrompt: "Mid-scene product value demonstration",
      negativePrompt: "off-topic corporate office stock",
      sourceType: "stock",
      requiredSubject: "value demonstration",
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      mediaKind: "video",
      sourceMetadata: { fallback_used: true, fallback_reason: input.reason },
      selectedAt: null,
      selectionReason: null,
      status: "pending",
    },
    {
      id: nanoid(),
      order: 3,
      durationSeconds: Math.max(4, input.durationTargetSeconds - baseDuration * 2),
      narration: "Close with clear CTA and concrete next step.",
      visualPrompt: "CTA close frame, clean and brand-safe",
      negativePrompt: "noisy layout, unreadable text",
      sourceType: "text_card",
      requiredSubject: "call to action",
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      mediaKind: "text_card",
      sourceMetadata: { fallback_used: true, fallback_reason: input.reason },
      selectedAt: null,
      selectionReason: null,
      status: "pending",
    },
  ];

  return generated;
}

async function resolveRoute(input: {
  tenantId: string;
  workspaceId: string;
  qualityMode: "standard" | "elite";
  task: MarketingTask;
  provider?: MarketingProviderName;
  modelId?: string;
}) {
  const policy = defaultWorkspaceBudgetPolicy(input.qualityMode);
  return resolveMarketingProviderRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: input.task,
    policy,
    provider: input.provider,
    modelId: input.modelId,
  });
}

async function executeRoutedTextTask(input: {
  tenantId: string;
  workspaceId: string;
  task: MarketingTask;
  prompt: string;
  qualityMode: "standard" | "elite";
  provider?: MarketingProviderName;
  modelId?: string;
  hostAppId?: string;
}) {
  const route = await resolveRoute(input);
  if (route.status !== "ready" || !route.selected) {
    if (input.provider) {
      await createMarketingProviderHealthCheck({
        tenantId: input.tenantId,
        workspaceId: input.workspaceId,
        provider: input.provider,
        task: input.task,
        status: route.status === "provider_unavailable" ? "provider_unavailable" : "setup_needed",
        errorMessage: route.reason,
      });
    }
    return {
      status: route.status,
      route,
      outputText: null,
      outputJson: null,
      errorMessage: route.reason,
    } as const;
  }

  const taskDef = getMarketingTaskCapabilityEntry(input.task);
  const startedAt = Date.now();
  try {
    const response = await executeAITaskWithProviderRoute({
      task: taskDef.canonicalTask,
      provider: route.selected.provider as MarketingProviderName,
      model: route.selected.modelId,
      requiresApproval: false,
      tenantScope: {
        tenantType: "stable",
        tenantId: input.tenantId,
      },
      input: {
        prompt: input.prompt,
        hostAppId: input.hostAppId ?? "equiprofile",
      },
    });

    const outputText = extractOutputText(response.output);
    const outputJson = parseJsonObject(outputText);
    await createMarketingProviderHealthCheck({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      provider: route.selected.provider as MarketingProviderName,
      modelId: route.selected.modelId,
      task: input.task,
      latencyMs: Date.now() - startedAt,
      status: response.status === "completed" ? "ok" : "degraded",
      errorMessage: response.status === "completed" ? null : `execution_status_${response.status}`,
    });

    return {
      status: response.status === "completed" ? "generated" : "failed",
      route,
      outputText,
      outputJson,
      errorMessage: response.status === "completed" ? null : `execution_status_${response.status}`,
    } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await createMarketingProviderHealthCheck({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      provider: route.selected.provider as MarketingProviderName,
      modelId: route.selected.modelId,
      task: input.task,
      status: /setup/i.test(message) ? "setup_needed" : "provider_unavailable",
      errorMessage: message,
    });
    return {
      status: /setup/i.test(message) ? "setup_needed" : "provider_unavailable",
      route,
      outputText: null,
      outputJson: null,
      errorMessage: message,
    } as const;
  }
}

export type GenerateMarketingStudioScriptInput = {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  contentType: string;
  platform?: string;
  originalUserPrompt: string;
  brief?: string;
  audience?: string;
  goal?: string;
  durationTargetSeconds?: number;
  brandContext?: Record<string, unknown>;
  existingScript?: string;
  existingScenes?: MarketingStudioScene[];
};

export type MarketingStudioScriptGenerationResult = {
  status: MarketingStudioGenerationStatus;
  title: string;
  goal: string;
  audience: string;
  brief: string;
  script: string;
  voiceoverScript: string;
  scenePlan: MarketingStudioScene[];
  requiredAssets: string[];
  platformNotes: string[];
  cta: string;
  hashtags: string[];
  complianceNotes: string[];
  providerRouteMetadata: {
    task: MarketingTask;
    status: "ready" | "setup_needed" | "provider_unavailable" | "budget_blocked" | "failed";
    provider: string | null;
    modelId: string | null;
    reason: string | null;
    fallback_used: boolean;
    fallback_reason: string | null;
  };
};

export async function generateMarketingStudioScript(input: GenerateMarketingStudioScriptInput): Promise<MarketingStudioScriptGenerationResult> {
  const prompt = [
    "You are generating a marketing studio script payload.",
    "Return JSON only with keys: title, brief, script, voiceoverScript, requiredAssets, platformNotes, cta, hashtags, complianceNotes.",
    `Content type: ${input.contentType}`,
    `Platform: ${input.platform ?? "general"}`,
    `Goal: ${input.goal ?? ""}`,
    `Audience: ${input.audience ?? ""}`,
    `Original prompt: ${input.originalUserPrompt}`,
    `Brief: ${input.brief ?? ""}`,
    `Duration target seconds: ${input.durationTargetSeconds ?? 30}`,
    `Brand context JSON: ${JSON.stringify(input.brandContext ?? {})}`,
  ].join("\n");

  const executed = await executeRoutedTextTask({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    qualityMode: input.qualityMode,
    task: "scriptwriting",
    prompt,
    hostAppId: input.hostAppId,
  });

  const fallbackReason = executed.status === "generated" ? null : (executed.errorMessage ?? executed.route.reason ?? "provider_unavailable");
  const parsed = executed.outputJson ? SCRIPT_PAYLOAD_SCHEMA.safeParse(executed.outputJson) : { success: false as const };

  const resolvedScript = parsed.success
    ? parsed.data.script ?? input.existingScript ?? input.brief ?? input.originalUserPrompt
    : input.existingScript ?? input.brief ?? `Script draft for: ${input.originalUserPrompt}`;

  const scenePlan = await generateMarketingStudioScenePlan({
    ...input,
    existingScript: resolvedScript,
    fallbackReason,
  });

  return {
    status: executed.status === "generated" ? "generated" : executed.status === "setup_needed" || executed.status === "budget_blocked"
      ? "setup_needed"
      : executed.status === "provider_unavailable"
        ? "provider_unavailable"
        : "failed",
    title: parsed.success ? (parsed.data.title ?? `${input.contentType} campaign`) : `${input.contentType} campaign`,
    goal: input.goal ?? "",
    audience: input.audience ?? "",
    brief: parsed.success ? (parsed.data.brief ?? input.brief ?? "") : (input.brief ?? ""),
    script: resolvedScript,
    voiceoverScript: parsed.success ? (parsed.data.voiceoverScript ?? resolvedScript) : resolvedScript,
    scenePlan: scenePlan.scenePlan,
    requiredAssets: parsed.success ? (parsed.data.requiredAssets ?? []) : [],
    platformNotes: parsed.success ? (parsed.data.platformNotes ?? []) : [],
    cta: parsed.success ? (parsed.data.cta ?? "") : "",
    hashtags: parsed.success ? (parsed.data.hashtags ?? []) : [],
    complianceNotes: parsed.success ? (parsed.data.complianceNotes ?? []) : [],
    providerRouteMetadata: {
      task: "scriptwriting",
      status: executed.status === "generated" ? "ready" : executed.status,
      provider: executed.route.selected?.provider ?? null,
      modelId: executed.route.selected?.modelId ?? null,
      reason: executed.route.reason,
      fallback_used: executed.status !== "generated",
      fallback_reason: fallbackReason,
    },
  };
}

export async function generateMarketingStudioScenePlan(input: GenerateMarketingStudioScriptInput & {
  existingScript?: string;
  fallbackReason?: string | null;
}) {
  const prompt = [
    "Generate scene plan JSON for a marketing video.",
    "Return JSON only: { scenes: MarketingStudioScene[] }",
    "Each scene must include: id, order, durationSeconds, narration, visualPrompt, negativePrompt, sourceType, requiredSubject, assetId, assetUrl, previewUrl, provider, providerAssetId, mediaKind, sourceMetadata, selectedAt, selectionReason, status.",
    `Original prompt: ${input.originalUserPrompt}`,
    `Script: ${input.existingScript ?? input.brief ?? ""}`,
    `Duration target seconds: ${input.durationTargetSeconds ?? 30}`,
  ].join("\n");

  const executed = await executeRoutedTextTask({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    qualityMode: input.qualityMode,
    task: "scene_planning",
    prompt,
    hostAppId: input.hostAppId,
  });

  const providerRoute = executed.route.selected
    ? { provider: executed.route.selected.provider, modelId: executed.route.selected.modelId, task: "scene_planning" }
    : null;

  const rawPayload = executed.outputJson && SCENE_PLAN_SCHEMA.safeParse(executed.outputJson).success
    ? SCENE_PLAN_SCHEMA.parse(executed.outputJson)
    : null;

  const fallbackReason = input.fallbackReason ?? executed.errorMessage ?? executed.route.reason ?? "scene_plan_provider_unavailable";
  const fallbackUsed = executed.status !== "generated" || !rawPayload;

  const scenes = fallbackUsed
    ? fallbackScenePlan({
      prompt: input.originalUserPrompt,
      durationTargetSeconds: input.durationTargetSeconds ?? 30,
      existingScenes: input.existingScenes,
      reason: fallbackReason,
    })
    : rawPayload!.scenes.map((scene, index) => normalizeScene({
      ...scene,
      sourceMetadata: {
        ...(scene.sourceMetadata ?? {}),
        fallback_used: false,
      },
    }, index, providerRoute));

  const status: MarketingStudioGenerationStatus = executed.status === "generated"
    ? "generated"
    : executed.status === "setup_needed" || executed.status === "budget_blocked"
      ? "setup_needed"
      : executed.status === "provider_unavailable"
        ? "provider_unavailable"
        : "failed";

  return {
    status,
    scenePlan: scenes,
    fallback_used: fallbackUsed,
    fallback_reason: fallbackUsed ? fallbackReason : null,
    providerRouteMetadata: {
      task: "scene_planning" as const,
      status: executed.status === "generated" ? "ready" : executed.status,
      provider: executed.route.selected?.provider ?? null,
      modelId: executed.route.selected?.modelId ?? null,
      reason: executed.route.reason,
      fallback_used: fallbackUsed,
      fallback_reason: fallbackUsed ? fallbackReason : null,
    },
  };
}

export async function generateMarketingStudioPlanFromPrompt(input: GenerateMarketingStudioScriptInput) {
  const script = await generateMarketingStudioScript(input);
  return {
    ...script,
    status: script.status,
  };
}
