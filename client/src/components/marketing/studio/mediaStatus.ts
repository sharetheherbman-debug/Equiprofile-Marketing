import type { StudioMediaState } from "./types";

export function isPlayableMimeType(mimeType?: string | null) {
  const mime = String(mimeType ?? "").toLowerCase();
  if (!mime || mime === "text/plain") return false;
  return mime.startsWith("video/") || mime.startsWith("image/") || mime.startsWith("audio/");
}

export function hasPlayablePublicAsset(asset: { publicUrl?: string | null; localPath?: string | null; mimeType?: string | null }) {
  const hasLocation = Boolean(asset.publicUrl) || Boolean(asset.localPath);
  return hasLocation && isPlayableMimeType(asset.mimeType);
}

export function mergeStudioMediaState(
  current: StudioMediaState,
  patch: Partial<StudioMediaState>,
): StudioMediaState {
  if (hasPlayablePublicAsset(current) && patch.status && patch.status !== "completed") {
    return current;
  }
  const next = { ...current, ...patch };
  if (hasPlayablePublicAsset(next)) {
    next.status = "completed";
    if (typeof next.progressPercent !== "number" || next.progressPercent < 100) next.progressPercent = 100;
    if (typeof next.estimatedCompletionSeconds !== "number" || next.estimatedCompletionSeconds > 0) next.estimatedCompletionSeconds = 0;
  }
  return next;
}
