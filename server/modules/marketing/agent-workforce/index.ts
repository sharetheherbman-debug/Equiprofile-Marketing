import { and, desc, eq } from "drizzle-orm";
import {
  marketingAgentRuns,
  marketingAgentTasks,
} from "../../../../drizzle/schema";
import { executeAITaskWithProviderRoute } from "../../../_core/ai/orchestrator";
import {
  createMarketingProviderHealthCheck,
  defaultWorkspaceBudgetPolicy,
  getMarketingTaskCapabilityEntry,
  resolveMarketingProviderRoute,
  type MarketingProviderName,
  type MarketingTask,
} from "../provider-capabilities";

async function getDb() {
  const dbModule = await import("../../../db");
  return dbModule.getDb();
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

const AGENT_ROLES = [
  "StrategyAgent",
  "CopyAgent",
  "MediaAgent",
  "AvatarVoiceAgent",
  "QaAgent",
  "SchedulerAgent",
  "ResultsAgent",
] as const;

function asMarketingTask(taskType: string): MarketingTask {
  const known: MarketingTask[] = [
    "campaign_strategy",
    "hook_generation",
    "angle_generation",
    "platform_copywriting",
    "email_generation",
    "blog_seo_generation",
    "scriptwriting",
    "scene_planning",
    "prompt_direction",
    "localization",
    "captioning",
    "transcription",
    "voiceover",
    "image_generation",
    "text_to_video_scene_clip",
    "visual_qa",
    "embedding",
    "qa_summary",
    "avatar_generation",
    "avatar_lipsync",
    "music_generation",
    "background_audio_selection",
  ];
  return known.includes(taskType as MarketingTask) ? (taskType as MarketingTask) : "campaign_strategy";
}

function extractOutputText(output: unknown): string {
  if (typeof output === "string") return output;
  if (!output || typeof output !== "object") return "";
  const payload = output as Record<string, unknown>;
  const choices = payload.choices;
  if (Array.isArray(choices)) {
    const first = choices[0] as Record<string, unknown> | undefined;
    const message = first?.message as Record<string, unknown> | undefined;
    if (typeof message?.content === "string") return message.content;
  }
  if (typeof payload.text === "string") return payload.text;
  return "";
}

export async function createMarketingAgentRun(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number | null;
  agentRole: (typeof AGENT_ROLES)[number];
  inputJson?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(marketingAgentRuns).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId ?? null,
    agentRole: input.agentRole,
    status: "queued",
    inputJson: JSON.stringify(input.inputJson ?? {}),
  });
  return result[0].insertId;
}

export async function listMarketingAgentRuns(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(marketingAgentRuns)
    .where(and(
      eq(marketingAgentRuns.tenantId, input.tenantId),
      eq(marketingAgentRuns.workspaceId, input.workspaceId),
      eq(marketingAgentRuns.hostAppId, input.hostAppId),
    ))
    .orderBy(desc(marketingAgentRuns.updatedAt));

  return rows.map((row) => ({
    ...row,
    input: parseJson<Record<string, unknown>>(row.inputJson, {}),
    output: parseJson<Record<string, unknown>>(row.outputJson, {}),
    startedAt: row.startedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getMarketingAgentRun(input: { id: number; tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return null;
  const [run] = await db
    .select()
    .from(marketingAgentRuns)
    .where(and(
      eq(marketingAgentRuns.id, input.id),
      eq(marketingAgentRuns.tenantId, input.tenantId),
      eq(marketingAgentRuns.workspaceId, input.workspaceId),
      eq(marketingAgentRuns.hostAppId, input.hostAppId),
    ))
    .limit(1);

  if (!run) return null;

  const tasks = await db
    .select()
    .from(marketingAgentTasks)
    .where(eq(marketingAgentTasks.runId, run.id))
    .orderBy(desc(marketingAgentTasks.createdAt));

  return {
    ...run,
    input: parseJson<Record<string, unknown>>(run.inputJson, {}),
    output: parseJson<Record<string, unknown>>(run.outputJson, {}),
    tasks: tasks.map((task) => ({
      ...task,
      route: parseJson<Record<string, unknown>>(task.routeJson, {}),
      input: parseJson<Record<string, unknown>>(task.inputJson, {}),
      output: parseJson<Record<string, unknown>>(task.outputJson, {}),
      startedAt: task.startedAt?.toISOString() ?? null,
      completedAt: task.completedAt?.toISOString() ?? null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    })),
    startedAt: run.startedAt?.toISOString() ?? null,
    completedAt: run.completedAt?.toISOString() ?? null,
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
  };
}

export async function runMarketingAgentTask(input: {
  runId: number;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  taskType: string;
  prompt: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [run] = await db
    .select()
    .from(marketingAgentRuns)
    .where(and(
      eq(marketingAgentRuns.id, input.runId),
      eq(marketingAgentRuns.tenantId, input.tenantId),
      eq(marketingAgentRuns.workspaceId, input.workspaceId),
      eq(marketingAgentRuns.hostAppId, input.hostAppId),
    ))
    .limit(1);

  if (!run) {
    throw new Error("Agent run not found");
  }

  const [runningTask] = await db
    .select()
    .from(marketingAgentTasks)
    .where(and(eq(marketingAgentTasks.runId, run.id), eq(marketingAgentTasks.status, "processing")))
    .limit(1);

  if (runningTask) {
    return {
      status: "blocked" as const,
      reason: "one task at a time is enforced unless explicitly queued",
      taskId: runningTask.id,
    };
  }

  const task = asMarketingTask(input.taskType);
  const policy = defaultWorkspaceBudgetPolicy(input.qualityMode);
  const route = await resolveMarketingProviderRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task,
    policy,
  });

  await db
    .update(marketingAgentRuns)
    .set({ status: "processing", startedAt: run.startedAt ?? new Date(), updatedAt: new Date() })
    .where(eq(marketingAgentRuns.id, run.id));

  const taskInsert = await db.insert(marketingAgentTasks).values({
    runId: run.id,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: run.campaignId,
    agentRole: run.agentRole,
    taskType: task,
    status: route.status === "ready" ? "processing" : route.status,
    provider: route.selected?.provider ?? null,
    modelId: route.selected?.modelId ?? null,
    routeJson: JSON.stringify(route),
    inputJson: JSON.stringify({ prompt: input.prompt, reviewGate: "required" }),
    startedAt: new Date(),
  });

  const taskId = taskInsert[0].insertId;

  if (route.status !== "ready" || !route.selected) {
    await db
      .update(marketingAgentTasks)
      .set({
        status: route.status,
        errorMessage: route.reason,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(marketingAgentTasks.id, taskId));

    await db
      .update(marketingAgentRuns)
      .set({
        status: route.status,
        errorMessage: route.reason,
        updatedAt: new Date(),
      })
      .where(eq(marketingAgentRuns.id, run.id));

    return {
      status: route.status as "setup_needed" | "provider_unavailable" | "budget_blocked",
      taskId,
      reason: route.reason,
    };
  }

  const taskDef = getMarketingTaskCapabilityEntry(task);
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
      },
    });

    const output = {
      status: response.status,
      provider: response.provider,
      model: response.model,
      outputText: extractOutputText(response.output),
      review_gate_required: true,
    };

    const completedStatus = response.status === "completed" ? "completed" : "failed";
    await db
      .update(marketingAgentTasks)
      .set({
        status: completedStatus,
        outputJson: JSON.stringify(output),
        errorMessage: response.status === "completed" ? null : `execution_status_${response.status}`,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(marketingAgentTasks.id, taskId));

    await db
      .update(marketingAgentRuns)
      .set({
        status: completedStatus,
        outputJson: JSON.stringify({ latestTaskId: taskId, route, review_gate_required: true }),
        errorMessage: response.status === "completed" ? null : `execution_status_${response.status}`,
        completedAt: completedStatus === "completed" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(marketingAgentRuns.id, run.id));

    await createMarketingProviderHealthCheck({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      provider: route.selected.provider as MarketingProviderName,
      modelId: route.selected.modelId,
      task,
      status: response.status === "completed" ? "ok" : "degraded",
      errorMessage: response.status === "completed" ? null : `execution_status_${response.status}`,
    });

    return {
      status: completedStatus as "completed" | "failed",
      taskId,
      provider: route.selected.provider as MarketingProviderName,
      modelId: route.selected.modelId,
      reason: response.status === "completed" ? null : `execution_status_${response.status}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(marketingAgentTasks)
      .set({
        status: "failed",
        errorMessage: message,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(marketingAgentTasks.id, taskId));

    await db
      .update(marketingAgentRuns)
      .set({
        status: "failed",
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(marketingAgentRuns.id, run.id));

    await createMarketingProviderHealthCheck({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      provider: route.selected.provider as MarketingProviderName,
      modelId: route.selected.modelId,
      task,
      status: /setup/i.test(message) ? "setup_needed" : "failed",
      errorMessage: message,
    });

    return {
      status: "failed" as const,
      taskId,
      provider: route.selected.provider as MarketingProviderName,
      modelId: route.selected.modelId,
      reason: message,
    };
  }
}

export async function cancelMarketingAgentRun(input: { id: number; tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(marketingAgentRuns)
    .set({ status: "cancelled", completedAt: new Date(), updatedAt: new Date() })
    .where(and(
      eq(marketingAgentRuns.id, input.id),
      eq(marketingAgentRuns.tenantId, input.tenantId),
      eq(marketingAgentRuns.workspaceId, input.workspaceId),
      eq(marketingAgentRuns.hostAppId, input.hostAppId),
    ));

  await db
    .update(marketingAgentTasks)
    .set({ status: "cancelled", completedAt: new Date(), updatedAt: new Date() })
    .where(and(
      eq(marketingAgentTasks.runId, input.id),
      eq(marketingAgentTasks.tenantId, input.tenantId),
      eq(marketingAgentTasks.workspaceId, input.workspaceId),
      eq(marketingAgentTasks.hostAppId, input.hostAppId),
    ));

  return { success: true };
}
