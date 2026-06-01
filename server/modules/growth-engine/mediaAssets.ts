// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
// Media Asset Registry for Growth Engine
// Provides create/read/update/delete for the mediaAssets table.
// Links to growthQueueJobs via jobId for backwards compatibility with existing media job tracking.

import { and, desc, eq, inArray } from "drizzle-orm";
import { mediaAssets } from "../../../drizzle/schema";
import { coerceInvalidCompletedMediaStatus, isPlayableMediaAsset } from "../../_core/ai/mediaPlayability";

type Db = Awaited<ReturnType<typeof import("../../db")["getDb"]>>;

async function resolveDb(): Promise<Db> {
  const dbModule = await import("../../db");
  if ("getDb" in dbModule && typeof dbModule.getDb === "function") {
    return dbModule.getDb();
  }
  return null;
}

function parseJson<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export type MediaAssetInput = {
  tenantType?: string;
  tenantId: string;
  userId?: number;
  campaignId?: number;
  draftId?: string;
  jobId?: string;
  type: "image" | "video" | "avatar" | "voice" | "audio" | "thumbnail" | "document" | "other";
  provider?: string;
  task?: string;
  status?: "created" | "processing" | "completed" | "failed" | "deleted";
  localPath?: string;
  publicUrl?: string;
  thumbnailUrl?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  generationPrompt?: string;
  generationSettings?: Record<string, unknown>;
  outputMetadata?: Record<string, unknown>;
  errorMessage?: string | null;
};

export async function createMediaAsset(input: MediaAssetInput) {
  const db = await resolveDb();
  if (!db) throw new Error("Database not available for media asset registry");
  const coerced = coerceInvalidCompletedMediaStatus(input);
  const status = (coerced.status ?? "created") as MediaAssetInput["status"];
  const outputMetadata = coerced.outputMetadata ?? input.outputMetadata ?? {};
  const errorMessage = coerced.errorMessage ?? input.errorMessage ?? null;

  const result = await db.insert(mediaAssets).values({
    tenantType: input.tenantType ?? "individual",
    tenantId: input.tenantId,
    userId: input.userId ?? null,
    campaignId: input.campaignId ?? null,
    draftId: input.draftId ?? null,
    jobId: input.jobId ?? null,
    type: input.type,
    provider: input.provider ?? null,
    task: input.task ?? null,
    status: status ?? "created",
    localPath: input.localPath ?? null,
    publicUrl: input.publicUrl ?? null,
    thumbnailUrl: input.thumbnailUrl ?? null,
    mimeType: input.mimeType ?? null,
    fileSizeBytes: input.fileSizeBytes ?? null,
    durationSeconds: input.durationSeconds ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    generationPrompt: input.generationPrompt ?? null,
    generationSettingsJson: input.generationSettings
      ? JSON.stringify(input.generationSettings)
      : null,
    outputMetadataJson: Object.keys(outputMetadata).length
      ? JSON.stringify(outputMetadata)
      : null,
    errorMessage: errorMessage,
  });

  const id = result[0].insertId;
  return {
    id,
    ...input,
    status,
    outputMetadata,
    errorMessage,
  };
}

export async function updateMediaAsset(id: number, patch: Partial<MediaAssetInput>) {
  const db = await resolveDb();
  if (!db) throw new Error("Database not available for media asset registry");
  const [existing] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!existing) return;

  const existingOutputMetadata = parseJson<Record<string, unknown>>(existing.outputMetadataJson, {});
  const merged = coerceInvalidCompletedMediaStatus({
    type: patch.type ?? existing.type,
    task: patch.task ?? existing.task,
    status: patch.status ?? existing.status,
    localPath: patch.localPath ?? existing.localPath,
    publicUrl: patch.publicUrl ?? existing.publicUrl,
    mimeType: patch.mimeType ?? existing.mimeType,
    outputMetadata: patch.outputMetadata ?? existingOutputMetadata,
    errorMessage: patch.errorMessage ?? existing.errorMessage,
  });

  await db
    .update(mediaAssets)
    .set({
      ...(patch.status !== undefined && { status: merged.status }),
      ...(patch.localPath !== undefined && { localPath: patch.localPath }),
      ...(patch.publicUrl !== undefined && { publicUrl: patch.publicUrl }),
      ...(patch.thumbnailUrl !== undefined && { thumbnailUrl: patch.thumbnailUrl }),
      ...(patch.mimeType !== undefined && { mimeType: patch.mimeType }),
      ...(patch.fileSizeBytes !== undefined && { fileSizeBytes: patch.fileSizeBytes }),
      ...((patch.errorMessage !== undefined || merged.errorMessage !== existing.errorMessage) && { errorMessage: merged.errorMessage ?? null }),
      ...((patch.outputMetadata !== undefined || merged.outputMetadata !== existingOutputMetadata) && {
        outputMetadataJson: JSON.stringify(merged.outputMetadata ?? existingOutputMetadata ?? {}),
      }),
      updatedAt: new Date(),
    })
    .where(eq(mediaAssets.id, id));
}

export async function listProcessingMediaAssetsForProvider(provider: string, limit = 25) {
  const db = await resolveDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.provider, provider))
    .orderBy(desc(mediaAssets.updatedAt))
    .limit(limit);

  return rows
    .map(mapAssetRow)
    .filter((row) => row.status === "processing");
}

export async function getMediaAssetById(id: number) {
  const db = await resolveDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  if (!row) return null;
  return mapAssetRow(row);
}

export async function getMediaAssetByJobId(jobId: string) {
  const db = await resolveDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.jobId, jobId))
    .limit(1);

  if (!row) return null;
  return mapAssetRow(row);
}

export async function listMediaAssetsForTenant(tenantId: string, limit = 100) {
  const db = await resolveDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.tenantId, tenantId))
    .orderBy(desc(mediaAssets.createdAt))
    .limit(limit);

  return rows.map(mapAssetRow);
}

export async function deleteMediaAsset(id: number) {
  const db = await resolveDb();
  if (!db) throw new Error("Database not available for media asset registry");

  await db
    .update(mediaAssets)
    .set({ status: "deleted", updatedAt: new Date() })
    .where(eq(mediaAssets.id, id));
}

export async function permanentDeleteMediaAsset(id: number) {
  const db = await resolveDb();
  if (!db) throw new Error("Database not available for media asset registry");
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
}

export async function listPendingMediaAssets(opts: {
  tenantId?: string;
  assetId?: number;
  limit?: number;
}) {
  const db = await resolveDb();
  if (!db) return [];

  const conditions = [
    inArray(mediaAssets.status, ["processing", "queued"]),
    eq(mediaAssets.provider, "genx"),
  ];
  if (opts.tenantId) conditions.push(eq(mediaAssets.tenantId, opts.tenantId));
  if (opts.assetId) conditions.push(eq(mediaAssets.id, opts.assetId));

  const rows = await db
    .select()
    .from(mediaAssets)
    .where(and(...conditions))
    .orderBy(desc(mediaAssets.createdAt))
    .limit(opts.limit ?? 50);

  return rows.map(mapAssetRow);
}

export async function repairBrokenCompletedMediaAssets(input: { limit?: number } = {}) {
  const db = await resolveDb();
  if (!db) {
    return { scanned: 0, repaired: 0, skipped: 0, examples: [] as Array<{ id: number; reason: string }> };
  }

  const rows = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.status, "completed"))
    .orderBy(desc(mediaAssets.updatedAt))
    .limit(input.limit ?? 1000);

  let repaired = 0;
  let skipped = 0;
  const examples: Array<{ id: number; reason: string }> = [];
  const targetTypes = new Set(["image", "video", "audio", "avatar", "voice", "thumbnail"]);

  for (const row of rows) {
    if (!targetTypes.has(String(row.type ?? "").toLowerCase())) {
      skipped += 1;
      continue;
    }

    const parsed = mapAssetRow(row);
    if (isPlayableMediaAsset(parsed)) {
      skipped += 1;
      continue;
    }

    const metadata = {
      ...(parsed.outputMetadata ?? {}),
      mediaTruth: "not_playable",
      repairedBy: "PR62B_media_truth_repair",
      repairedAt: new Date().toISOString(),
    };

    await db
      .update(mediaAssets)
      .set({
        status: "failed",
        errorMessage: "Marked not complete because no playable media URL or local path exists.",
        outputMetadataJson: JSON.stringify(metadata),
        updatedAt: new Date(),
      })
      .where(eq(mediaAssets.id, row.id));

    repaired += 1;
    if (examples.length < 10) {
      examples.push({ id: row.id, reason: "missing_playable_url_or_local_path" });
    }
  }

  return {
    scanned: rows.length,
    repaired,
    skipped,
    examples,
  };
}

function mapAssetRow(row: typeof mediaAssets.$inferSelect) {
  return {
    id: row.id,
    tenantType: row.tenantType,
    tenantId: row.tenantId,
    userId: row.userId,
    campaignId: row.campaignId,
    draftId: row.draftId,
    jobId: row.jobId,
    type: row.type,
    provider: row.provider,
    task: row.task,
    status: row.status,
    localPath: row.localPath,
    publicUrl: row.publicUrl,
    thumbnailUrl: row.thumbnailUrl,
    mimeType: row.mimeType,
    fileSizeBytes: row.fileSizeBytes,
    durationSeconds: row.durationSeconds,
    width: row.width,
    height: row.height,
    generationPrompt: row.generationPrompt,
    generationSettings: parseJson<Record<string, unknown>>(row.generationSettingsJson, {}),
    outputMetadata: parseJson<Record<string, unknown>>(row.outputMetadataJson, {}),
    errorMessage: row.errorMessage,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
