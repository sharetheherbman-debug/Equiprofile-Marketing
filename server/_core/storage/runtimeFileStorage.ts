import fs from "fs";
import path from "path";
import { getLocalMediaStorageRoot } from "./localMediaStorage";

export const LEGACY_UPLOAD_ROOT = "/var/www/equiprofile/uploads";

function uniquePaths(paths: string[]) {
  return Array.from(new Set(paths.map((item) => path.resolve(item))));
}

export function getGeneratedStorageRoot() {
  return getLocalMediaStorageRoot();
}

export function getCanonicalUploadRoot() {
  return path.resolve(
    process.env.STORAGE_PATH
      ?? process.env.EQUIPROFILE_UPLOADS_ROOT
      ?? path.join(getGeneratedStorageRoot(), "uploads"),
  );
}

export function getUploadLookupRoots() {
  return uniquePaths([
    getCanonicalUploadRoot(),
    getGeneratedStorageRoot(),
    LEGACY_UPLOAD_ROOT,
  ]);
}

export function safeResolveInside(root: string, key: string) {
  const cleanKey = key.replace(/^\/+/, "");
  const rootPath = path.resolve(root);
  const filePath = path.resolve(rootPath, cleanKey);
  if (filePath !== rootPath && filePath.startsWith(rootPath + path.sep)) {
    return { ok: true as const, filePath };
  }
  return { ok: false as const, filePath };
}

export function decodeUploadFileKey(rawKey: string): { ok: true; key: string } | { ok: false; reason: string } {
  if (!rawKey || rawKey.includes("\0")) return { ok: false, reason: "invalid_key" };
  try {
    return { ok: true, key: decodeURIComponent(rawKey) };
  } catch {
    return { ok: false, reason: "invalid_encoding" };
  }
}

export function findServableUploadFile(key: string) {
  if (!key || key.includes("\0")) return null;
  for (const root of getUploadLookupRoots()) {
    const resolved = safeResolveInside(root, key);
    if (!resolved.ok) continue;
    if (fs.existsSync(resolved.filePath)) {
      return { root, filePath: resolved.filePath };
    }
  }
  return null;
}

export function resolveGeneratedMediaPath(key: string) {
  if (!key || key.includes("\0")) return null;
  const resolved = safeResolveInside(getGeneratedStorageRoot(), key);
  return resolved.ok ? resolved.filePath : null;
}

export function isSafeLocalMediaUrl(value: string | null | undefined) {
  const candidate = (value ?? "").trim();
  if (!candidate) return true;
  if (/^(?:javascript|data|file):/i.test(candidate)) return false;
  if (/^\w:[\\/]/.test(candidate)) return false;
  if (/^\/(?:var|etc|home|root|proc|sys|private)\b/i.test(candidate)) return false;
  if (candidate.includes("\0") || candidate.includes("\\") || candidate.includes("..")) return false;
  if (candidate.startsWith("/api/files/") || candidate.startsWith("/media/generated/")) return true;
  if (candidate.startsWith("/assets/") || candidate.startsWith("/management-assets/") || candidate.startsWith("/school-assets/")) return true;
  return /^https?:\/\//i.test(candidate);
}

export async function getRuntimeFileStorageReadiness() {
  const generatedRoot = getGeneratedStorageRoot();
  const uploadRoot = getCanonicalUploadRoot();
  const lookupRoots = getUploadLookupRoots();
  const checkRoot = async (root: string) => {
    try {
      await fs.promises.mkdir(root, { recursive: true });
      await fs.promises.access(root, fs.constants.R_OK | fs.constants.W_OK);
      return { root, readable: true, writable: true };
    } catch (error) {
      return {
        root,
        readable: false,
        writable: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return {
    canonicalStorageRoot: generatedRoot,
    generatedMediaRoot: generatedRoot,
    canonicalUploadRoot: uploadRoot,
    legacyUploadRoot: LEGACY_UPLOAD_ROOT,
    uploadLookupRoots: lookupRoots,
    generated: await checkRoot(generatedRoot),
    uploads: await checkRoot(uploadRoot),
    publicContracts: {
      uploadedFiles: "/api/files/:key",
      generatedMedia: "/media/generated/:folder/:filename",
    },
  };
}
