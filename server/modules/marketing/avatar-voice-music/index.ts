import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  brandAvatars,
  marketingAudioBeds,
  marketingAvatarJobs,
  marketingVoiceProfiles,
} from "../../../../drizzle/schema";
import { createMediaAsset, getMediaAssetById } from "../../growth-engine";
import {
  createMarketingProviderHealthCheck,
  defaultWorkspaceBudgetPolicy,
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

function asProviderName(value: string): MarketingProviderName {
  if (value === "genx" || value === "qwen" || value === "huggingface") return value;
  return "qwen";
}

export type MarketingAvatarStatus = "queued" | "processing" | "completed" | "failed" | "cancelled" | "setup_needed";

export async function listMarketingBrandAvatars(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(brandAvatars)
    .where(and(
      eq(brandAvatars.tenantId, input.tenantId),
      eq(brandAvatars.workspaceId, input.workspaceId),
      eq(brandAvatars.hostAppId, input.hostAppId),
    ))
    .orderBy(desc(brandAvatars.updatedAt));

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getActiveMarketingBrandAvatar(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const rows = await listMarketingBrandAvatars(input);
  return rows.find((row) => row.status === "active") ?? null;
}

export async function createMarketingBrandAvatar(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  brandProfileId?: number | null;
  brandKitId?: number | null;
  name: string;
  role?: string | null;
  personality?: string | null;
  visualDescription?: string | null;
  wardrobeRules?: string | null;
  backgroundRules?: string | null;
  referenceAssetId?: number | null;
  referenceAssetUrl?: string | null;
  promptTemplate?: string | null;
  negativePrompt?: string | null;
  consistencySeed?: string | null;
  preferredVoiceProfileId?: number | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(brandAvatars).values({
    tenantType: "individual",
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    brandProfileId: input.brandProfileId ?? null,
    brandKitId: input.brandKitId ?? null,
    name: input.name,
    role: input.role ?? null,
    personality: input.personality ?? null,
    visualDescription: input.visualDescription ?? null,
    wardrobeRules: input.wardrobeRules ?? null,
    backgroundRules: input.backgroundRules ?? null,
    referenceAssetId: input.referenceAssetId ?? null,
    referenceAssetUrl: input.referenceAssetUrl ?? null,
    promptTemplate: input.promptTemplate ?? null,
    negativePrompt: input.negativePrompt ?? null,
    consistencySeed: input.consistencySeed ?? null,
    preferredVoiceProfileId: input.preferredVoiceProfileId ?? null,
    status: "active",
  });
  return result[0].insertId;
}

export async function updateMarketingBrandAvatar(input: {
  id: number;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  patch: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const allowed = [
    "name",
    "role",
    "personality",
    "visualDescription",
    "wardrobeRules",
    "backgroundRules",
    "referenceAssetId",
    "referenceAssetUrl",
    "promptTemplate",
    "negativePrompt",
    "consistencySeed",
    "preferredVoiceProfileId",
    "brandProfileId",
    "brandKitId",
    "status",
  ] as const;

  const set: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in input.patch) set[key] = input.patch[key];
  }

  await db
    .update(brandAvatars)
    .set(set)
    .where(and(
      eq(brandAvatars.id, input.id),
      eq(brandAvatars.tenantId, input.tenantId),
      eq(brandAvatars.workspaceId, input.workspaceId),
      eq(brandAvatars.hostAppId, input.hostAppId),
    ));
}

export async function archiveMarketingBrandAvatar(input: { id: number; tenantId: string; workspaceId: string; hostAppId: string }) {
  return updateMarketingBrandAvatar({
    ...input,
    patch: { status: "archived" },
  });
}

export function buildMarketingAvatarPromptContext(avatar: {
  name: string;
  role: string | null;
  personality: string | null;
  visualDescription: string | null;
  wardrobeRules: string | null;
  backgroundRules: string | null;
  promptTemplate: string | null;
  negativePrompt: string | null;
  consistencySeed: string | null;
} | null) {
  if (!avatar) return "";
  const lines = [
    `Avatar: ${avatar.name}`,
    avatar.role ? `Role: ${avatar.role}` : "",
    avatar.personality ? `Personality: ${avatar.personality}` : "",
    avatar.visualDescription ? `Visual description: ${avatar.visualDescription}` : "",
    avatar.wardrobeRules ? `Wardrobe rules: ${avatar.wardrobeRules}` : "",
    avatar.backgroundRules ? `Background rules: ${avatar.backgroundRules}` : "",
    avatar.promptTemplate ? `Prompt template: ${avatar.promptTemplate}` : "",
    avatar.negativePrompt ? `Negative prompt: ${avatar.negativePrompt}` : "",
    avatar.consistencySeed ? `Consistency seed: ${avatar.consistencySeed}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

async function resolveCapabilityRoute(input: {
  tenantId: string;
  workspaceId: string;
  task: MarketingTask;
  qualityMode: "standard" | "elite";
}) {
  const policy = defaultWorkspaceBudgetPolicy(input.qualityMode);
  return resolveMarketingProviderRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: input.task,
    policy,
  });
}

export async function createMarketingAvatarAsset(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  prompt: string;
  campaignId?: number | null;
  campaignItemId?: number | null;
  referenceAssetId?: number | null;
  userId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const route = await resolveCapabilityRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: "avatar_generation",
    qualityMode: input.qualityMode,
  });

  if (route.status !== "ready" || !route.selected) {
    const result = await db.insert(marketingAvatarJobs).values({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      campaignId: input.campaignId ?? null,
      campaignItemId: input.campaignItemId ?? null,
      task: "avatar_generation",
      provider: null,
      modelId: null,
      routeStatus: route.status,
      status: "setup_needed",
      metadataJson: JSON.stringify({ prompt: input.prompt }),
      errorMessage: route.reason,
    });
    return {
      status: route.status === "provider_unavailable" ? "provider_unavailable" as const : "setup_needed" as const,
      avatarJobId: result[0].insertId,
      mediaAssetId: null,
      jobId: null,
      reason: route.reason,
    };
  }

  const provider = route.selected.provider;
  const modelId = route.selected.modelId;
  const queuedJobId = `avatar_gen_${nanoid(14)}`;
  const media = await createMediaAsset({
    tenantId: input.tenantId,
    userId: input.userId,
    campaignId: input.campaignId ?? undefined,
    type: "avatar",
    provider,
    task: "avatar_video",
    jobId: queuedJobId,
    status: "processing",
    generationPrompt: input.prompt,
    outputMetadata: {
      route,
      modelId,
      referenceAssetId: input.referenceAssetId ?? null,
    },
  });

  const created = await db.insert(marketingAvatarJobs).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId ?? null,
    campaignItemId: input.campaignItemId ?? null,
    task: "avatar_generation",
    provider,
    modelId,
    routeStatus: "ready",
    status: "queued",
    jobId: queuedJobId,
    sourceMediaAssetId: input.referenceAssetId ?? null,
    outputMediaAssetId: media.id,
    metadataJson: JSON.stringify({ prompt: input.prompt }),
  });

  await createMarketingProviderHealthCheck({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    provider: provider as MarketingProviderName,
    modelId,
    task: "avatar_generation",
    status: "degraded",
    errorMessage: "queued_for_provider_execution",
  });

  return {
    status: "queued" as const,
    avatarJobId: created[0].insertId,
    mediaAssetId: media.id,
    jobId: queuedJobId,
    reason: null,
  };
}

export async function createMarketingAvatarLipsyncJob(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  avatarAssetId: number;
  audioAssetId: number;
  campaignId?: number | null;
  campaignItemId?: number | null;
  userId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const avatarAsset = await getMediaAssetById(input.avatarAssetId);
  const audioAsset = await getMediaAssetById(input.audioAssetId);
  if (!avatarAsset || !audioAsset) {
    return {
      status: "failed" as const,
      avatarJobId: null,
      mediaAssetId: null,
      jobId: null,
      reason: "avatar/video/audio inputs are required for lipsync",
    };
  }

  const route = await resolveCapabilityRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: "avatar_lipsync",
    qualityMode: input.qualityMode,
  });

  if (route.status !== "ready" || !route.selected) {
    const result = await db.insert(marketingAvatarJobs).values({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      campaignId: input.campaignId ?? null,
      campaignItemId: input.campaignItemId ?? null,
      task: "avatar_lipsync",
      provider: null,
      modelId: null,
      routeStatus: route.status,
      status: "setup_needed",
      sourceMediaAssetId: input.avatarAssetId,
      audioMediaAssetId: input.audioAssetId,
      metadataJson: JSON.stringify({ avatarAssetId: input.avatarAssetId, audioAssetId: input.audioAssetId }),
      errorMessage: route.reason,
    });

    return {
      status: route.status === "provider_unavailable" ? "provider_unavailable" as const : "setup_needed" as const,
      avatarJobId: result[0].insertId,
      mediaAssetId: null,
      jobId: null,
      reason: route.reason,
    };
  }

  const provider = route.selected.provider;
  const modelId = route.selected.modelId;
  const queuedJobId = `avatar_lipsync_${nanoid(14)}`;
  const media = await createMediaAsset({
    tenantId: input.tenantId,
    userId: input.userId,
    campaignId: input.campaignId ?? undefined,
    type: "video",
    provider,
    task: "avatar_video",
    jobId: queuedJobId,
    status: "processing",
    generationPrompt: `Lipsync avatar asset ${input.avatarAssetId}`,
    outputMetadata: {
      route,
      modelId,
      avatarAssetId: input.avatarAssetId,
      audioAssetId: input.audioAssetId,
    },
  });

  const created = await db.insert(marketingAvatarJobs).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId ?? null,
    campaignItemId: input.campaignItemId ?? null,
    task: "avatar_lipsync",
    provider,
    modelId,
    routeStatus: "ready",
    status: "queued",
    jobId: queuedJobId,
    sourceMediaAssetId: input.avatarAssetId,
    audioMediaAssetId: input.audioAssetId,
    outputMediaAssetId: media.id,
  });

  return {
    status: "queued" as const,
    avatarJobId: created[0].insertId,
    mediaAssetId: media.id,
    jobId: queuedJobId,
    reason: null,
  };
}

export async function getMarketingAvatarJobStatus(input: { id: number; tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(marketingAvatarJobs)
    .where(and(
      eq(marketingAvatarJobs.id, input.id),
      eq(marketingAvatarJobs.tenantId, input.tenantId),
      eq(marketingAvatarJobs.workspaceId, input.workspaceId),
      eq(marketingAvatarJobs.hostAppId, input.hostAppId),
    ))
    .limit(1);

  if (!row) return null;
  const outputAsset = row.outputMediaAssetId ? await getMediaAssetById(row.outputMediaAssetId).catch(() => null) : null;

  if (row.status === "completed" && !outputAsset?.id) {
    return {
      id: row.id,
      status: "failed" as MarketingAvatarStatus,
      reason: "completed state without output asset is invalid",
      mediaAssetId: row.outputMediaAssetId,
      jobId: row.jobId,
      outputUrl: row.outputUrl,
    };
  }

  return {
    id: row.id,
    status: row.status as MarketingAvatarStatus,
    reason: row.errorMessage,
    mediaAssetId: row.outputMediaAssetId,
    jobId: row.jobId,
    outputUrl: row.outputUrl,
    metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}),
  };
}

export async function listMarketingVoiceProfiles(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(marketingVoiceProfiles)
    .where(and(
      eq(marketingVoiceProfiles.tenantId, input.tenantId),
      eq(marketingVoiceProfiles.workspaceId, input.workspaceId),
      eq(marketingVoiceProfiles.hostAppId, input.hostAppId),
    ))
    .orderBy(desc(marketingVoiceProfiles.updatedAt));

  return rows.map((row) => ({
    ...row,
    styleMetadata: parseJson<Record<string, unknown>>(row.styleMetadataJson, {}),
    licensing: parseJson<Record<string, unknown>>(row.licensingJson, {}),
    usagePolicy: parseJson<Record<string, unknown>>(row.usagePolicyJson, {}),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function createMarketingVoiceProfile(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  name: string;
  provider: string;
  providerVoiceId?: string | null;
  language?: string;
  accent?: string | null;
  styleMetadata?: Record<string, unknown>;
  sampleText?: string | null;
  licensing?: Record<string, unknown>;
  usagePolicy?: Record<string, unknown>;
  status?: "active" | "archived" | "setup_needed";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(marketingVoiceProfiles).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    name: input.name,
    provider: input.provider,
    providerVoiceId: input.providerVoiceId ?? null,
    language: input.language ?? "en",
    accent: input.accent ?? null,
    styleMetadataJson: JSON.stringify(input.styleMetadata ?? {}),
    sampleText: input.sampleText ?? null,
    licensingJson: JSON.stringify(input.licensing ?? {}),
    usagePolicyJson: JSON.stringify(input.usagePolicy ?? {}),
    status: input.status ?? (input.providerVoiceId ? "active" : "setup_needed"),
  });

  return result[0].insertId;
}

export async function updateMarketingVoiceProfile(input: {
  id: number;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  patch: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const direct = ["name", "provider", "providerVoiceId", "language", "accent", "sampleText", "previewAssetId", "previewUrl", "isDefault", "status"] as const;
  for (const key of direct) {
    if (key in input.patch) set[key] = input.patch[key];
  }
  if ("styleMetadata" in input.patch) set.styleMetadataJson = JSON.stringify(input.patch.styleMetadata ?? {});
  if ("licensing" in input.patch) set.licensingJson = JSON.stringify(input.patch.licensing ?? {});
  if ("usagePolicy" in input.patch) set.usagePolicyJson = JSON.stringify(input.patch.usagePolicy ?? {});

  await db
    .update(marketingVoiceProfiles)
    .set(set)
    .where(and(
      eq(marketingVoiceProfiles.id, input.id),
      eq(marketingVoiceProfiles.tenantId, input.tenantId),
      eq(marketingVoiceProfiles.workspaceId, input.workspaceId),
      eq(marketingVoiceProfiles.hostAppId, input.hostAppId),
    ));
}

export async function archiveMarketingVoiceProfile(input: { id: number; tenantId: string; workspaceId: string; hostAppId: string }) {
  return updateMarketingVoiceProfile({ ...input, patch: { status: "archived", isDefault: false } });
}

export async function setDefaultMarketingVoiceProfile(input: { id: number; tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(marketingVoiceProfiles)
    .set({ isDefault: false, updatedAt: new Date() })
    .where(and(
      eq(marketingVoiceProfiles.tenantId, input.tenantId),
      eq(marketingVoiceProfiles.workspaceId, input.workspaceId),
      eq(marketingVoiceProfiles.hostAppId, input.hostAppId),
    ));

  await db
    .update(marketingVoiceProfiles)
    .set({ isDefault: true, status: "active", updatedAt: new Date() })
    .where(and(
      eq(marketingVoiceProfiles.id, input.id),
      eq(marketingVoiceProfiles.tenantId, input.tenantId),
      eq(marketingVoiceProfiles.workspaceId, input.workspaceId),
      eq(marketingVoiceProfiles.hostAppId, input.hostAppId),
    ));
}

export async function generateMarketingVoicePreview(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  voiceProfileId: number;
  previewText: string;
  userId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [profile] = await db
    .select()
    .from(marketingVoiceProfiles)
    .where(and(
      eq(marketingVoiceProfiles.id, input.voiceProfileId),
      eq(marketingVoiceProfiles.tenantId, input.tenantId),
      eq(marketingVoiceProfiles.workspaceId, input.workspaceId),
      eq(marketingVoiceProfiles.hostAppId, input.hostAppId),
    ))
    .limit(1);

  if (!profile?.providerVoiceId) {
    return {
      status: "setup_needed" as const,
      previewAssetId: null,
      previewUrl: null,
      reason: "voice profile/providerVoiceId is required",
    };
  }

  const route = await resolveCapabilityRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: "voiceover",
    qualityMode: input.qualityMode,
  });

  if (route.status !== "ready" || !route.selected) {
    await createMarketingProviderHealthCheck({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      provider: asProviderName(profile.provider),
      task: "voiceover",
      status: route.status === "provider_unavailable" ? "provider_unavailable" : "setup_needed",
      errorMessage: route.reason,
    });

    await updateMarketingVoiceProfile({
      id: profile.id,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      patch: { status: "setup_needed" },
    });

    return {
      status: "setup_needed" as const,
      previewAssetId: null,
      previewUrl: null,
      reason: route.reason,
    };
  }

  const jobId = `voice_preview_${nanoid(14)}`;
  const media = await createMediaAsset({
    tenantId: input.tenantId,
    userId: input.userId,
    type: "voice",
    provider: route.selected.provider,
    task: "text_to_speech",
    jobId,
    status: "processing",
    generationPrompt: input.previewText,
    outputMetadata: {
      voiceProfileId: profile.id,
      providerVoiceId: profile.providerVoiceId,
      route,
    },
  });

  await updateMarketingVoiceProfile({
    id: profile.id,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    patch: {
      previewAssetId: media.id,
      previewUrl: null,
      status: "active",
    },
  });

  return {
    status: "queued" as const,
    previewAssetId: media.id,
    previewUrl: null,
    reason: null,
  };
}

export async function listMarketingAudioBeds(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(marketingAudioBeds)
    .where(and(
      eq(marketingAudioBeds.tenantId, input.tenantId),
      eq(marketingAudioBeds.workspaceId, input.workspaceId),
      eq(marketingAudioBeds.hostAppId, input.hostAppId),
    ))
    .orderBy(desc(marketingAudioBeds.updatedAt));

  return rows.map((row) => ({
    ...row,
    metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function createMarketingMusicGenerationJob(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  title: string;
  mood?: string | null;
  tempo?: string | null;
  durationSeconds?: number | null;
  prompt: string;
  userId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const route = await resolveCapabilityRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: "music_generation",
    qualityMode: input.qualityMode,
  });

  if (route.status !== "ready" || !route.selected) {
    const result = await db.insert(marketingAudioBeds).values({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      providerSource: "generated",
      task: "music_generation",
      title: input.title,
      mood: input.mood ?? null,
      tempo: input.tempo ?? null,
      durationSeconds: input.durationSeconds ?? null,
      status: "setup_needed",
      metadataJson: JSON.stringify({ prompt: input.prompt, reason: route.reason }),
    });

    return {
      status: "setup_needed" as const,
      audioBedId: result[0].insertId,
      mediaAssetId: null,
      jobId: null,
      reason: route.reason,
    };
  }

  const jobId = `music_gen_${nanoid(14)}`;
  const media = await createMediaAsset({
    tenantId: input.tenantId,
    userId: input.userId,
    type: "voice",
    provider: route.selected.provider,
    task: "text_to_speech",
    jobId,
    status: "processing",
    generationPrompt: input.prompt,
    outputMetadata: {
      route,
      audioType: "music_generation",
      mood: input.mood ?? null,
      tempo: input.tempo ?? null,
      durationSeconds: input.durationSeconds ?? null,
    },
  });

  const inserted = await db.insert(marketingAudioBeds).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    providerSource: "generated",
    task: "music_generation",
    title: input.title,
    mood: input.mood ?? null,
    tempo: input.tempo ?? null,
    durationSeconds: input.durationSeconds ?? null,
    licenseType: null,
    licenseAttribution: null,
    commercialUseAllowed: null,
    mediaAssetId: media.id,
    publicUrl: null,
    status: "setup_needed",
    metadataJson: JSON.stringify({
      jobId,
      manual_review_required: true,
      license_missing: true,
      prompt: input.prompt,
    }),
  });

  return {
    status: "queued" as const,
    audioBedId: inserted[0].insertId,
    mediaAssetId: media.id,
    jobId,
    reason: null,
  };
}

export async function selectMarketingBackgroundAudio(input: {
  id: number;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [row] = await db
    .select()
    .from(marketingAudioBeds)
    .where(and(
      eq(marketingAudioBeds.id, input.id),
      eq(marketingAudioBeds.tenantId, input.tenantId),
      eq(marketingAudioBeds.workspaceId, input.workspaceId),
      eq(marketingAudioBeds.hostAppId, input.hostAppId),
    ))
    .limit(1);

  if (!row) return { status: "failed" as const, reason: "audio bed not found" };

  const commercialAllowed = row.commercialUseAllowed === true;
  const hasLicense = Boolean(row.licenseType && row.licenseAttribution);
  const manualReviewRequired = !(commercialAllowed && hasLicense);

  await db
    .update(marketingAudioBeds)
    .set({
      status: manualReviewRequired ? "manual_review_required" : "ready",
      metadataJson: JSON.stringify({
        ...parseJson<Record<string, unknown>>(row.metadataJson, {}),
        selected: true,
        manual_review_required: manualReviewRequired,
      }),
      updatedAt: new Date(),
    })
    .where(eq(marketingAudioBeds.id, row.id));

  return {
    status: manualReviewRequired ? "manual_review_required" as const : "ready" as const,
    reason: manualReviewRequired ? "license metadata missing or commercial-use not allowed" : null,
    audioBedId: row.id,
  };
}

export async function getMarketingAudioLicenseMetadata(input: { id: number; tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(marketingAudioBeds)
    .where(and(
      eq(marketingAudioBeds.id, input.id),
      eq(marketingAudioBeds.tenantId, input.tenantId),
      eq(marketingAudioBeds.workspaceId, input.workspaceId),
      eq(marketingAudioBeds.hostAppId, input.hostAppId),
    ))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    licenseType: row.licenseType,
    licenseAttribution: row.licenseAttribution,
    commercialUseAllowed: row.commercialUseAllowed,
    sourceUrl: row.sourceUrl,
    providerSource: row.providerSource,
    status: row.status,
    metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}),
  };
}

export function buildMarketingAudioMixPolicy(input: {
  hasVoiceover: boolean;
  hasBackgroundMusic: boolean;
  voiceoverDurationSeconds?: number | null;
  musicDurationSeconds?: number | null;
  musicLicenseOk?: boolean;
}) {
  const warnings: string[] = [];
  if (!input.hasVoiceover) warnings.push("Voiceover missing; verify narrative clarity before export.");
  if (!input.hasBackgroundMusic) warnings.push("Background music missing; optional but verify pacing.");
  if (input.musicLicenseOk === false) warnings.push("Music license missing or commercial use not allowed.");

  const voiceDuration = input.voiceoverDurationSeconds ?? null;
  const musicDuration = input.musicDurationSeconds ?? null;
  if (voiceDuration && musicDuration && Math.abs(voiceDuration - musicDuration) > 3) {
    warnings.push("Voiceover and music durations are mismatched by more than 3 seconds.");
  }

  return {
    voiceoverGainDb: input.hasVoiceover ? -1.5 : -99,
    backgroundMusicGainDb: input.hasBackgroundMusic ? -18 : -99,
    ducking: {
      enabled: input.hasVoiceover && input.hasBackgroundMusic,
      thresholdDb: -22,
      ratio: 4,
      attackMs: 80,
      releaseMs: 240,
    },
    introFadeMs: 400,
    outroFadeMs: 550,
    safeLoudnessTargetLufs: -14,
    warnings,
  };
}
