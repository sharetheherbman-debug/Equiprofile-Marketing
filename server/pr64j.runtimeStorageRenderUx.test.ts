import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("PR64J runtime storage contract", () => {
  it("serves uploaded avatar and marketing-brand files from the canonical upload root", async () => {
    vi.resetModules();
    const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pr64j-storage-"));
    process.env.EQUIPROFILE_STORAGE_ROOT = storageRoot;
    delete process.env.STORAGE_PATH;
    delete process.env.EQUIPROFILE_UPLOADS_ROOT;

    const mod = await import("./_core/storage/runtimeFileStorage");
    const uploadRoot = mod.getCanonicalUploadRoot();
    const avatarKey = "1/avatars/avatar.png";
    const logoKey = "1/marketing-brand/logo.png";
    fs.mkdirSync(path.join(uploadRoot, "1", "avatars"), { recursive: true });
    fs.mkdirSync(path.join(uploadRoot, "1", "marketing-brand"), { recursive: true });
    fs.writeFileSync(path.join(uploadRoot, avatarKey), "avatar");
    fs.writeFileSync(path.join(uploadRoot, logoKey), "logo");

    expect(uploadRoot).toBe(path.join(storageRoot, "uploads"));
    expect(mod.findServableUploadFile(avatarKey)?.filePath).toBe(path.join(uploadRoot, avatarKey));
    expect(mod.findServableUploadFile(logoKey)?.filePath).toBe(path.join(uploadRoot, logoKey));
    expect(mod.findServableUploadFile("../secret.txt")).toBeNull();
  });

  it("resolves generated media only from the generated storage root", async () => {
    vi.resetModules();
    const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pr64j-generated-"));
    process.env.EQUIPROFILE_STORAGE_ROOT = storageRoot;
    const mod = await import("./_core/storage/runtimeFileStorage");
    fs.mkdirSync(path.join(storageRoot, "generated"), { recursive: true });
    fs.writeFileSync(path.join(storageRoot, "generated", "video.mp4"), "mp4");

    expect(mod.resolveGeneratedMediaPath("generated/video.mp4")).toBe(path.join(storageRoot, "generated", "video.mp4"));
    expect(mod.resolveGeneratedMediaPath("../uploads/private.png")).toBeNull();
  });

  it("accepts safe local media URLs and rejects unsafe logo URLs", async () => {
    const { isSafeLocalMediaUrl } = await import("./_core/storage/runtimeFileStorage");
    expect(isSafeLocalMediaUrl("/api/files/1/marketing-brand/logo.png")).toBe(true);
    expect(isSafeLocalMediaUrl("/media/generated/generated/reel.mp4")).toBe(true);
    expect(isSafeLocalMediaUrl("https://cdn.example.com/logo.png")).toBe(true);
    expect(isSafeLocalMediaUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeLocalMediaUrl("data:image/png;base64,abc")).toBe(false);
    expect(isSafeLocalMediaUrl("file:///etc/passwd")).toBe(false);
    expect(isSafeLocalMediaUrl("/api/files/../secret")).toBe(false);
    expect(isSafeLocalMediaUrl("/var/equiprofile/storage/private.png")).toBe(false);
  });

  it("decodes encoded upload keys and resolves files with spaces in names", async () => {
    vi.resetModules();
    const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pr64m-fileserve-"));
    process.env.EQUIPROFILE_STORAGE_ROOT = storageRoot;
    const mod = await import("./_core/storage/runtimeFileStorage");
    const uploadRoot = mod.getCanonicalUploadRoot();
    const encoded = "1/marketing-brand/Example%20logo.png";
    const decoded = mod.decodeUploadFileKey(encoded);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    fs.mkdirSync(path.join(uploadRoot, "1", "marketing-brand"), { recursive: true });
    fs.writeFileSync(path.join(uploadRoot, decoded.key), "logo");
    expect(mod.findServableUploadFile(decoded.key)?.filePath).toBe(path.join(uploadRoot, "1", "marketing-brand", "Example logo.png"));
    expect(mod.decodeUploadFileKey("%E0%A4%A")).toEqual({ ok: false, reason: "invalid_encoding" });
  });
});

describe("PR64J render completion readiness", () => {
  it("reports exact render readiness instead of assuming ffmpeg-static only", async () => {
    const renderer = await import("./modules/marketing/media-factory/marketingRenderer");
    const readiness = await renderer.getMarketingRenderRuntimeReadiness();
    expect(readiness).toHaveProperty("ffmpegFailures");
    expect(readiness).toHaveProperty("tempWritable");
    expect(readiness).toHaveProperty("outputWritable");
    expect(readiness.reason).toBeTruthy();
  });

  it("keeps completed renders without public URL as hard worker failures", () => {
    const worker = read("server/modules/marketing/media-factory/marketingRenderWorker.ts");
    expect(worker).toContain("Render completed but no playable URL was returned.");
    expect(worker).toContain('status: "failed"');
  });
});

describe("PR64J UX and diagnostics visibility", () => {
  it("keeps Product Setup visible with Scan Site and focused latest outcome status", () => {
    const product = read("client/src/components/marketing/app/workspace/ProductContextPanel.tsx");
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    expect(product).toContain("Scan Site");
    expect(product).toContain("Confirm Product");
    expect(product).toContain("Logo file missing");
    expect(app).toContain("latest-outcome-card");
    expect(app).toContain("route:");
    expect(app).toContain("nextAction");
  });

  it("hides Admin Support unless explicit support mode is enabled", () => {
    const settings = read("client/src/components/marketing/app/MarketingAppSettings.tsx");
    expect(settings).toContain("VITE_MARKETING_SUPPORT_MODE");
    expect(settings).toContain("supportModeEnabled ? <details");
    expect(settings).toContain("enabled: supportModeEnabled && showAdminSupport");
  });

  it("exposes runtime storage, render readiness, and logo repair procedures", () => {
    const router = read("server/routers.ts");
    expect(router).toContain("getMarketingRuntimeStorageReadiness");
    expect(router).toContain("getMarketingRenderRuntimeReadiness");
    expect(router).toContain("repairMarketingBrandLogo");
  });
});
