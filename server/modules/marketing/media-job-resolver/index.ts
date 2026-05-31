import { and, desc, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import {
  marketingAudioBeds,
  marketingAvatarJobs,
  marketingVoiceProfiles,
} from "../../../../drizzle/schema";
import { getMediaAssetById } from "../../growth-engine";

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

function hasRealOutput(asset: { status: string; publicUrl: string | null; localPath: string | null } | null): boolean {
  if (!asset) return false;
  if (asset.status !== "completed") return false;
  return Boolean((asset.publicUrl && asset.publicUrl.trim()) || (asset.localPath && asset.localPath.trim()));
}

type ResolverBucket = "completed" | "failed" | "processing" | "setup_needed";

type ResolverSummary = {
  status: "ready" | "partial" | "setup_needed" | "failed";
  processed: number;
  completed: number;
  failed: number;
  processing: number;
  setupNeeded: number;
  warnings: string[];
};

function summarize(buckets: ResolverBucket[], warnings: string[]): ResolverSummary {
  const completed = buckets.filter((item) => item === "completed").length;
  const failed = buckets.filter((item) => item === "failed").length;
  const processing = buckets.filter((item) => item === "processing").length;
  const setupNeeded = buckets.filter((item) => item === "setup_needed").length;
  const processed = buckets.length;

  const status: ResolverSummary["status"] =
    processed === 0
      ? "ready"
      : failed > 0 && completed === 0 && processing === 0
        ? "failed"
        : setupNeeded > 0 && completed === 0 && processing === 0
          ? "setup_needed"
          : failed > 0 || setupNeeded > 0 || processing > 0
            ? "partial"
            : "ready";

  return { status, processed, completed, failed, processing, setupNeeded, warnings };
}

export async function resolveQueuedMarketingAvatarJobs(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const db = await getDb();
  if (!db) {
    return summarize(["setup_needed"], ["Database unavailable for avatar job resolver."]);
  }

  let rows: typeof marketingAvatarJobs.$inferSelect[] = [];
  try {
    rows = await db
      .select()
      .from(marketingAvatarJobs)
      .where(and(
        eq(marketingAvatarJobs.tenantId, input.tenantId),
        eq(marketingAvatarJobs.workspaceId, input.workspaceId),
        eq(marketingAvatarJobs.hostAppId, input.hostAppId),
        inArray(marketingAvatarJobs.status, ["queued", "processing", "setup_needed"]),
      ))
      .orderBy(desc(marketingAvatarJobs.updatedAt))
      .limit(200);
  } catch (error) {
    return summarize(["setup_needed"], [`avatar_resolver_query_failed:${error instanceof Error ? error.message : String(error)}`]);
  }

  const buckets: ResolverBucket[] = [];
  const warnings: string[] = [];

  for (const row of rows) {
    if (row.routeStatus !== "ready") {
      buckets.push("setup_needed");
      continue;
    }
    if (!row.outputMediaAssetId) {
      await db
        .update(marketingAvatarJobs)
        .set({
          status: "failed",
          errorMessage: "missing_output_media_asset_reference",
          updatedAt: new Date(),
        })
        .where(eq(marketingAvatarJobs.id, row.id));
      buckets.push("failed");
      continue;
    }

    const outputAsset = await getMediaAssetById(row.outputMediaAssetId);
    if (!outputAsset) {
      await db
        .update(marketingAvatarJobs)
        .set({
          status: "failed",
          errorMessage: "output_media_asset_not_found",
          updatedAt: new Date(),
        })
        .where(eq(marketingAvatarJobs.id, row.id));
      buckets.push("failed");
      continue;
    }

    if (hasRealOutput(outputAsset)) {
      await db
        .update(marketingAvatarJobs)
        .set({
          status: "completed",
          outputUrl: outputAsset.publicUrl ?? outputAsset.localPath,
          completedAt: row.completedAt ?? new Date(),
          errorMessage: null,
          updatedAt: new Date(),
        })
        .where(eq(marketingAvatarJobs.id, row.id));
      buckets.push("completed");
      continue;
    }

    if (outputAsset.status === "failed") {
      await db
        .update(marketingAvatarJobs)
        .set({
          status: "failed",
          errorMessage: outputAsset.errorMessage ?? "provider_job_failed",
          updatedAt: new Date(),
        })
        .where(eq(marketingAvatarJobs.id, row.id));
      buckets.push("failed");
      continue;
    }

    if (outputAsset.status === "completed") {
      await db
        .update(marketingAvatarJobs)
        .set({
          status: "failed",
          errorMessage: "completed_without_real_output_url_or_path",
          updatedAt: new Date(),
        })
        .where(eq(marketingAvatarJobs.id, row.id));
      buckets.push("failed");
      continue;
    }

    if (row.status !== "processing") {
      await db
        .update(marketingAvatarJobs)
        .set({
          status: "processing",
          updatedAt: new Date(),
        })
        .where(eq(marketingAvatarJobs.id, row.id));
    }
    buckets.push("processing");
  }

  return summarize(buckets, warnings);
}

export async function resolveQueuedMarketingVoicePreviewJobs(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const db = await getDb();
  if (!db) {
    return summarize(["setup_needed"], ["Database unavailable for voice preview resolver."]);
  }

  let rows: typeof marketingVoiceProfiles.$inferSelect[] = [];
  try {
    rows = await db
      .select()
      .from(marketingVoiceProfiles)
      .where(and(
        eq(marketingVoiceProfiles.tenantId, input.tenantId),
        eq(marketingVoiceProfiles.workspaceId, input.workspaceId),
        eq(marketingVoiceProfiles.hostAppId, input.hostAppId),
        isNotNull(marketingVoiceProfiles.previewAssetId),
        isNull(marketingVoiceProfiles.previewUrl),
        inArray(marketingVoiceProfiles.status, ["active", "setup_needed"]),
      ))
      .orderBy(desc(marketingVoiceProfiles.updatedAt))
      .limit(200);
  } catch (error) {
    return summarize(["setup_needed"], [`voice_preview_resolver_query_failed:${error instanceof Error ? error.message : String(error)}`]);
  }

  const buckets: ResolverBucket[] = [];
  const warnings: string[] = [];

  for (const row of rows) {
    if (!row.previewAssetId) {
      buckets.push("setup_needed");
      continue;
    }
    const previewAsset = await getMediaAssetById(row.previewAssetId);
    if (!previewAsset) {
      await db
        .update(marketingVoiceProfiles)
        .set({
          status: "setup_needed",
          updatedAt: new Date(),
        })
        .where(eq(marketingVoiceProfiles.id, row.id));
      buckets.push("setup_needed");
      continue;
    }

    if (hasRealOutput(previewAsset)) {
      await db
        .update(marketingVoiceProfiles)
        .set({
          previewUrl: previewAsset.publicUrl ?? previewAsset.localPath,
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(marketingVoiceProfiles.id, row.id));
      buckets.push("completed");
      continue;
    }

    if (previewAsset.status === "failed") {
      await db
        .update(marketingVoiceProfiles)
        .set({
          status: "setup_needed",
          updatedAt: new Date(),
        })
        .where(eq(marketingVoiceProfiles.id, row.id));
      buckets.push("failed");
      continue;
    }

    buckets.push("processing");
  }

  return summarize(buckets, warnings);
}

export async function resolveQueuedMarketingMusicJobs(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const db = await getDb();
  if (!db) {
    return summarize(["setup_needed"], ["Database unavailable for music job resolver."]);
  }

  let rows: typeof marketingAudioBeds.$inferSelect[] = [];
  try {
    rows = await db
      .select()
      .from(marketingAudioBeds)
      .where(and(
        eq(marketingAudioBeds.tenantId, input.tenantId),
        eq(marketingAudioBeds.workspaceId, input.workspaceId),
        eq(marketingAudioBeds.hostAppId, input.hostAppId),
        eq(marketingAudioBeds.providerSource, "generated"),
        eq(marketingAudioBeds.task, "music_generation"),
        inArray(marketingAudioBeds.status, ["queued", "processing", "setup_needed", "failed"]),
      ))
      .orderBy(desc(marketingAudioBeds.updatedAt))
      .limit(200);
  } catch (error) {
    return summarize(["setup_needed"], [`music_resolver_query_failed:${error instanceof Error ? error.message : String(error)}`]);
  }

  const buckets: ResolverBucket[] = [];
  const warnings: string[] = [];

  for (const row of rows) {
    const metadata = parseJson<Record<string, unknown>>(row.metadataJson, {});
    if (!row.mediaAssetId) {
      await db
        .update(marketingAudioBeds)
        .set({
          status: "failed",
          metadataJson: JSON.stringify({
            ...metadata,
            resolver_error: "missing_media_asset_id",
          }),
          updatedAt: new Date(),
        })
        .where(eq(marketingAudioBeds.id, row.id));
      buckets.push("failed");
      continue;
    }

    const outputAsset = await getMediaAssetById(row.mediaAssetId);
    if (!outputAsset) {
      await db
        .update(marketingAudioBeds)
        .set({
          status: "failed",
          metadataJson: JSON.stringify({
            ...metadata,
            resolver_error: "output_media_asset_not_found",
          }),
          updatedAt: new Date(),
        })
        .where(eq(marketingAudioBeds.id, row.id));
      buckets.push("failed");
      continue;
    }

    if (hasRealOutput(outputAsset)) {
      await db
        .update(marketingAudioBeds)
        .set({
          status: "completed",
          publicUrl: outputAsset.publicUrl ?? outputAsset.localPath,
          metadataJson: JSON.stringify({
            ...metadata,
            resolvedAt: new Date().toISOString(),
          }),
          updatedAt: new Date(),
        })
        .where(eq(marketingAudioBeds.id, row.id));
      buckets.push("completed");
      continue;
    }

    if (outputAsset.status === "failed") {
      await db
        .update(marketingAudioBeds)
        .set({
          status: "failed",
          metadataJson: JSON.stringify({
            ...metadata,
            resolver_error: outputAsset.errorMessage ?? "provider_job_failed",
          }),
          updatedAt: new Date(),
        })
        .where(eq(marketingAudioBeds.id, row.id));
      buckets.push("failed");
      continue;
    }

    if (outputAsset.status === "completed") {
      await db
        .update(marketingAudioBeds)
        .set({
          status: "failed",
          metadataJson: JSON.stringify({
            ...metadata,
            resolver_error: "completed_without_real_output_url_or_path",
          }),
          updatedAt: new Date(),
        })
        .where(eq(marketingAudioBeds.id, row.id));
      buckets.push("failed");
      continue;
    }

    if (row.status !== "processing") {
      await db
        .update(marketingAudioBeds)
        .set({
          status: "processing",
          updatedAt: new Date(),
        })
        .where(eq(marketingAudioBeds.id, row.id));
    }
    buckets.push("processing");
  }

  return summarize(buckets, warnings);
}

export async function resolveQueuedMarketingMediaJobs(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const [avatar, voicePreview, music] = await Promise.all([
    resolveQueuedMarketingAvatarJobs(input),
    resolveQueuedMarketingVoicePreviewJobs(input),
    resolveQueuedMarketingMusicJobs(input),
  ]);

  const allBuckets: ResolverBucket[] = [
    ...Array.from({ length: avatar.completed }, () => "completed" as const),
    ...Array.from({ length: avatar.failed }, () => "failed" as const),
    ...Array.from({ length: avatar.processing }, () => "processing" as const),
    ...Array.from({ length: avatar.setupNeeded }, () => "setup_needed" as const),
    ...Array.from({ length: voicePreview.completed }, () => "completed" as const),
    ...Array.from({ length: voicePreview.failed }, () => "failed" as const),
    ...Array.from({ length: voicePreview.processing }, () => "processing" as const),
    ...Array.from({ length: voicePreview.setupNeeded }, () => "setup_needed" as const),
    ...Array.from({ length: music.completed }, () => "completed" as const),
    ...Array.from({ length: music.failed }, () => "failed" as const),
    ...Array.from({ length: music.processing }, () => "processing" as const),
    ...Array.from({ length: music.setupNeeded }, () => "setup_needed" as const),
  ];

  const summary = summarize(allBuckets, [...avatar.warnings, ...voicePreview.warnings, ...music.warnings]);

  return {
    ...summary,
    avatar,
    voicePreview,
    music,
  };
}

export async function getMarketingMediaJobResolverStatus(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const db = await getDb();
  if (!db) {
    return {
      status: "setup_needed" as const,
      reason: "Database unavailable for resolver status.",
      counts: {
        avatar: 0,
        voicePreview: 0,
        music: 0,
      },
    };
  }

  let avatarRows: Array<{ id: number }> = [];
  let voiceRows: Array<{ id: number }> = [];
  let musicRows: Array<{ id: number }> = [];
  try {
    [avatarRows, voiceRows, musicRows] = await Promise.all([
      db
        .select({ id: marketingAvatarJobs.id })
        .from(marketingAvatarJobs)
        .where(and(
          eq(marketingAvatarJobs.tenantId, input.tenantId),
          eq(marketingAvatarJobs.workspaceId, input.workspaceId),
          eq(marketingAvatarJobs.hostAppId, input.hostAppId),
          inArray(marketingAvatarJobs.status, ["queued", "processing"]),
        )),
      db
        .select({ id: marketingVoiceProfiles.id })
        .from(marketingVoiceProfiles)
        .where(and(
          eq(marketingVoiceProfiles.tenantId, input.tenantId),
          eq(marketingVoiceProfiles.workspaceId, input.workspaceId),
          eq(marketingVoiceProfiles.hostAppId, input.hostAppId),
          isNotNull(marketingVoiceProfiles.previewAssetId),
          isNull(marketingVoiceProfiles.previewUrl),
        )),
      db
        .select({ id: marketingAudioBeds.id })
        .from(marketingAudioBeds)
        .where(and(
          eq(marketingAudioBeds.tenantId, input.tenantId),
          eq(marketingAudioBeds.workspaceId, input.workspaceId),
          eq(marketingAudioBeds.hostAppId, input.hostAppId),
          eq(marketingAudioBeds.providerSource, "generated"),
          eq(marketingAudioBeds.task, "music_generation"),
          inArray(marketingAudioBeds.status, ["queued", "processing"]),
        )),
    ]);
  } catch (error) {
    return {
      status: "setup_needed" as const,
      reason: `Resolver status query failed: ${error instanceof Error ? error.message : String(error)}`,
      counts: {
        avatar: 0,
        voicePreview: 0,
        music: 0,
      },
    };
  }

  const pending = avatarRows.length + voiceRows.length + musicRows.length;
  return {
    status: pending > 0 ? "partial" as const : "ready" as const,
    reason: pending > 0 ? "Queued media jobs still pending resolver checks." : null,
    counts: {
      avatar: avatarRows.length,
      voicePreview: voiceRows.length,
      music: musicRows.length,
    },
  };
}
