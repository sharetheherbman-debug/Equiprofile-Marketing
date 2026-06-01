import type { AITask } from "./types";

type MediaKind = "image" | "video" | "audio" | null;

type PlayabilityInput = {
  type?: string | null;
  task?: string | null;
  status?: string | null;
  publicUrl?: string | null;
  localPath?: string | null;
  mimeType?: string | null;
  outputMetadata?: Record<string, unknown> | null;
};

export function isPlayableMediaMimeForType(type: string | null | undefined, mimeType: string | null | undefined): boolean {
  const expected = String(type ?? "").toLowerCase();
  const mime = String(mimeType ?? "").toLowerCase();
  if (!mime) return false;
  if (mime === "text/plain") return false;
  if (expected === "image") return mime.startsWith("image/");
  if (expected === "video" || expected === "avatar") return mime.startsWith("video/");
  if (expected === "audio" || expected === "voice") return mime.startsWith("audio/");
  if (expected === "thumbnail") return mime.startsWith("image/");
  return mime.startsWith("image/") || mime.startsWith("video/") || mime.startsWith("audio/");
}

export function hasPlayableMediaLocation(assetOrOutput: { publicUrl?: string | null; localPath?: string | null }): boolean {
  const publicUrl = typeof assetOrOutput.publicUrl === "string" ? assetOrOutput.publicUrl.trim() : "";
  const localPath = typeof assetOrOutput.localPath === "string" ? assetOrOutput.localPath.trim() : "";
  return Boolean(publicUrl || localPath);
}

function expectedMediaKindFromTask(task: string | null | undefined): MediaKind {
  const value = String(task ?? "").toLowerCase() as AITask | string;
  if (value === "text_to_image" || value === "image_edit" || value === "image_generation") return "image";
  if (value === "text_to_video" || value === "image_to_video" || value === "avatar_video" || value === "avatar_generation" || value === "avatar_lipsync") return "video";
  if (value === "text_to_speech" || value === "speech_to_text" || value === "voiceover" || value === "music_generation" || value === "background_audio_selection") return "audio";
  return null;
}

function expectedMediaKindFromType(type: string | null | undefined): MediaKind {
  const value = String(type ?? "").toLowerCase();
  if (value === "image" || value === "thumbnail") return "image";
  if (value === "video" || value === "avatar") return "video";
  if (value === "audio" || value === "voice") return "audio";
  return null;
}

function isVerifiedMetadataForKind(kind: MediaKind, metadata: Record<string, unknown> | null | undefined): boolean {
  if (!metadata || typeof metadata !== "object") return false;
  const inferredKind = typeof metadata.mediaKind === "string" ? metadata.mediaKind.toLowerCase() : null;
  if (inferredKind && kind && inferredKind === kind) return true;
  if (kind === "image") {
    return Number(metadata.width ?? 0) > 0 && Number(metadata.height ?? 0) > 0;
  }
  if (kind === "video") {
    return Number(metadata.durationSeconds ?? 0) > 0
      || (typeof metadata.resolution === "string" && metadata.resolution.length > 0);
  }
  if (kind === "audio") {
    return Number(metadata.durationSeconds ?? 0) > 0
      || Number(metadata.sampleRate ?? 0) > 0
      || typeof metadata.audioType === "string";
  }
  return false;
}

export function isPlayableMediaAsset(asset: PlayabilityInput): boolean {
  if (!hasPlayableMediaLocation(asset)) return false;
  const expectedKind = expectedMediaKindFromTask(asset.task) ?? expectedMediaKindFromType(asset.type);
  const expectedTypeForMime = expectedKind === "audio" ? "audio" : expectedKind === "video" ? "video" : expectedKind === "image" ? "image" : asset.type ?? null;
  if (isPlayableMediaMimeForType(expectedTypeForMime, asset.mimeType)) return true;
  return isVerifiedMetadataForKind(expectedKind, asset.outputMetadata);
}

export function isPlayableMediaOutputForTask(task: string, output: PlayabilityInput): boolean {
  const expectedKind = expectedMediaKindFromTask(task);
  if (!expectedKind) return false;
  return isPlayableMediaAsset({
    ...output,
    task,
    type: expectedKind === "audio" ? "audio" : expectedKind,
  });
}

export function coerceInvalidCompletedMediaStatus<T extends PlayabilityInput>(assetOrPatch: T): T & {
  status?: string | null;
  errorMessage?: string | null;
  outputMetadata: Record<string, unknown>;
} {
  const metadata: Record<string, unknown> = {
    ...((assetOrPatch.outputMetadata ?? {}) as Record<string, unknown>),
  };
  if (String(assetOrPatch.status ?? "").toLowerCase() !== "completed") {
    return {
      ...assetOrPatch,
      outputMetadata: metadata,
    };
  }
  if (isPlayableMediaAsset(assetOrPatch)) {
    return {
      ...assetOrPatch,
      outputMetadata: metadata,
    };
  }
  return {
    ...assetOrPatch,
    status: "failed",
    errorMessage: "Marked not complete because no playable media URL or local path exists.",
    outputMetadata: {
      ...metadata,
      mediaTruth: "not_playable",
    },
  };
}
