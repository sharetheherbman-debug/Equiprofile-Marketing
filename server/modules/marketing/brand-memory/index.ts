import { and, desc, eq } from "drizzle-orm";
import { marketingBrandMemory } from "../../../../drizzle/schema";
import { getDb } from "../../../db";
import { getMarketingPerformanceContext } from "../results-conversion";

type JsonRecord = Record<string, unknown>;

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getMarketingBrandMemory(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const db = await getDb();
  if (!db) {
    return { status: "setup_needed" as const, reason: "Database not available", memory: null };
  }

  const [row] = await db
    .select()
    .from(marketingBrandMemory)
    .where(and(
      eq(marketingBrandMemory.tenantId, input.tenantId),
      eq(marketingBrandMemory.workspaceId, input.workspaceId),
      eq(marketingBrandMemory.hostAppId, input.hostAppId),
    ))
    .orderBy(desc(marketingBrandMemory.updatedAt))
    .limit(1);

  if (!row) {
    return { status: "setup_needed" as const, reason: "brand_memory_missing", memory: null };
  }

  return {
    status: "ok" as const,
    memory: {
      ...row,
      targetPersonas: parseJson(row.targetPersonasJson, [] as unknown[]),
      objections: parseJson(row.objectionsJson, [] as unknown[]),
      proofPoints: parseJson(row.proofPointsJson, [] as unknown[]),
      tabooClaims: parseJson(row.tabooClaimsJson, [] as unknown[]),
      toneRules: parseJson(row.toneRulesJson, [] as unknown[]),
      competitorNotes: parseJson(row.competitorNotesJson, [] as unknown[]),
      winningHooks: parseJson(row.winningHooksJson, [] as unknown[]),
      winningCtas: parseJson(row.winningCtasJson, [] as unknown[]),
      winningPlatforms: parseJson(row.winningPlatformsJson, [] as unknown[]),
      contentDoDont: parseJson(row.contentDoDontJson, { do: [], dont: [] } as JsonRecord),
      sourceLabels: parseJson(row.sourceLabelsJson, {} as JsonRecord),
    },
  };
}

export async function upsertMarketingBrandMemory(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  brandName: string;
  positioningStatement?: string | null;
  targetPersonas?: unknown[];
  objections?: unknown[];
  proofPoints?: unknown[];
  tabooClaims?: unknown[];
  toneRules?: unknown[];
  competitorNotes?: unknown[];
  winningHooks?: unknown[];
  winningCtas?: unknown[];
  winningPlatforms?: unknown[];
  contentDoDont?: JsonRecord;
  sourceLabels?: JsonRecord;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const current = await getMarketingBrandMemory({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
  });

  const payload = {
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    brandName: input.brandName,
    positioningStatement: input.positioningStatement ?? null,
    targetPersonasJson: JSON.stringify(input.targetPersonas ?? (current.memory?.targetPersonas ?? [])),
    objectionsJson: JSON.stringify(input.objections ?? (current.memory?.objections ?? [])),
    proofPointsJson: JSON.stringify(input.proofPoints ?? (current.memory?.proofPoints ?? [])),
    tabooClaimsJson: JSON.stringify(input.tabooClaims ?? (current.memory?.tabooClaims ?? [])),
    toneRulesJson: JSON.stringify(input.toneRules ?? (current.memory?.toneRules ?? [])),
    competitorNotesJson: JSON.stringify(input.competitorNotes ?? (current.memory?.competitorNotes ?? [])),
    winningHooksJson: JSON.stringify(input.winningHooks ?? (current.memory?.winningHooks ?? [])),
    winningCtasJson: JSON.stringify(input.winningCtas ?? (current.memory?.winningCtas ?? [])),
    winningPlatformsJson: JSON.stringify(input.winningPlatforms ?? (current.memory?.winningPlatforms ?? [])),
    contentDoDontJson: JSON.stringify(input.contentDoDont ?? (current.memory?.contentDoDont ?? { do: [], dont: [] })),
    sourceLabelsJson: JSON.stringify(input.sourceLabels ?? (current.memory?.sourceLabels ?? {})),
  };

  if (current.memory?.id) {
    await db
      .update(marketingBrandMemory)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(marketingBrandMemory.id, current.memory.id));
  } else {
    await db.insert(marketingBrandMemory).values(payload);
  }

  return getMarketingBrandMemory({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
  });
}

export async function buildBrandMemoryPromptContext(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const memory = await getMarketingBrandMemory(input);
  if (memory.status !== "ok" || !memory.memory) {
    return {
      status: "setup_needed" as const,
      source: "brand_memory" as const,
      notes: ["No durable brand memory yet."],
    };
  }

  return {
    status: "ok" as const,
    source: "brand_memory" as const,
    brandName: memory.memory.brandName,
    positioningStatement: memory.memory.positioningStatement,
    toneRules: memory.memory.toneRules,
    objections: memory.memory.objections,
    tabooClaims: memory.memory.tabooClaims,
    winningHooks: memory.memory.winningHooks,
    winningCtas: memory.memory.winningCtas,
    winningPlatforms: memory.memory.winningPlatforms,
    sourceLabels: memory.memory.sourceLabels,
  };
}

export async function updateBrandMemoryFromResults(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
}) {
  const perf = await getMarketingPerformanceContext(input);
  if (perf.status !== "ok") {
    return { status: "insufficient_data" as const, reason: "performance_context_insufficient" };
  }

  const existing = await getMarketingBrandMemory(input);
  const sourceLabels = {
    ...(existing.memory?.sourceLabels ?? {}),
    winningHooks: "connector_or_attribution",
    winningCtas: "connector_or_attribution",
    winningPlatforms: "connector_or_attribution",
    updatedAt: new Date().toISOString(),
  };

  return upsertMarketingBrandMemory({
    ...input,
    brandName: existing.memory?.brandName ?? "Brand",
    positioningStatement: existing.memory?.positioningStatement ?? null,
    targetPersonas: existing.memory?.targetPersonas ?? [],
    objections: existing.memory?.objections ?? [],
    proofPoints: existing.memory?.proofPoints ?? [],
    tabooClaims: existing.memory?.tabooClaims ?? [],
    toneRules: existing.memory?.toneRules ?? [],
    competitorNotes: existing.memory?.competitorNotes ?? [],
    winningHooks: perf.patterns.winningHooks,
    winningCtas: perf.patterns.winningCtaStyles,
    winningPlatforms: perf.patterns.winningPlatforms,
    contentDoDont: existing.memory?.contentDoDont ?? { do: [], dont: [] },
    sourceLabels,
  });
}

export async function updateBrandMemoryFromManualNotes(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  notes: {
    brandName?: string;
    positioningStatement?: string;
    targetPersonas?: unknown[];
    objections?: unknown[];
    proofPoints?: unknown[];
    tabooClaims?: unknown[];
    toneRules?: unknown[];
    competitorNotes?: unknown[];
    contentDoDont?: JsonRecord;
  };
}) {
  const existing = await getMarketingBrandMemory(input);
  const sourceLabels = {
    ...(existing.memory?.sourceLabels ?? {}),
    manualNotes: "manual",
    manualUpdatedAt: new Date().toISOString(),
  };

  return upsertMarketingBrandMemory({
    ...input,
    brandName: input.notes.brandName ?? existing.memory?.brandName ?? "Brand",
    positioningStatement: input.notes.positioningStatement ?? existing.memory?.positioningStatement ?? null,
    targetPersonas: input.notes.targetPersonas ?? existing.memory?.targetPersonas ?? [],
    objections: input.notes.objections ?? existing.memory?.objections ?? [],
    proofPoints: input.notes.proofPoints ?? existing.memory?.proofPoints ?? [],
    tabooClaims: input.notes.tabooClaims ?? existing.memory?.tabooClaims ?? [],
    toneRules: input.notes.toneRules ?? existing.memory?.toneRules ?? [],
    competitorNotes: input.notes.competitorNotes ?? existing.memory?.competitorNotes ?? [],
    winningHooks: existing.memory?.winningHooks ?? [],
    winningCtas: existing.memory?.winningCtas ?? [],
    winningPlatforms: existing.memory?.winningPlatforms ?? [],
    contentDoDont: input.notes.contentDoDont ?? existing.memory?.contentDoDont ?? { do: [], dont: [] },
    sourceLabels,
  });
}
