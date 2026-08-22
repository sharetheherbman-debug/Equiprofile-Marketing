import { afterEach, describe, expect, it } from "vitest";
import {
  discoverProviderModels,
  resetProviderModelDiscoveryCacheForTests,
  resolveModelCandidatesForTask,
} from "./providerModelDiscovery";

describe("providerModelDiscovery", () => {
  afterEach(() => {
    delete process.env.GENX_VIDEO_MODEL;
    delete process.env.GENX_IMAGE_MODEL;
    delete process.env.GENX_MODEL;
    delete process.env.GENX_VIDEO_PROMPT_ONLY;
    resetProviderModelDiscoveryCacheForTests();
  });

  it("discovers GenX only and keeps disabled legacy providers empty", async () => {
    process.env.GENX_MODEL = "gpt-5.4";
    resetProviderModelDiscoveryCacheForTests();
    const snapshot = await discoverProviderModels(true);

    expect(snapshot.providers.genx.length).toBeGreaterThan(0);
    expect(snapshot.providers.genx[0].id).toBeTruthy();
    expect(snapshot.providers.genx[0].categories).toContain("copywriting");
    expect(snapshot.providers.genx[0].executableTasks).toContain("copywriting");
    expect(snapshot.providers.qwen).toEqual([]);
    expect(snapshot.providers.huggingface).toEqual([]);
  });

  it("uses cached discovery when not forced", async () => {
    resetProviderModelDiscoveryCacheForTests();
    const first = await discoverProviderModels(true);
    const second = await discoverProviderModels(false);

    expect(second.discoveredAt).toBe(first.discoveredAt);
  });

  it("exposes GenX default text model as a backward-compatible route candidate", async () => {
    process.env.GENX_MODEL = "gpt-5.4";
    resetProviderModelDiscoveryCacheForTests();
    const candidates = await resolveModelCandidatesForTask("copywriting", true);
    const genx = candidates.find((candidate) => candidate.provider === "genx");

    expect(genx?.id).toBe("gpt-5.4");
    expect(genx?.endpointFamily).toBe("openai_chat");
  });

  it("routes campaign-oriented text tasks through the model registry", async () => {
    process.env.GENX_MODEL = "gpt-5.4";
    resetProviderModelDiscoveryCacheForTests();
    const candidates = await resolveModelCandidatesForTask("campaign_generation", true);
    const genx = candidates.find((candidate) => candidate.provider === "genx");

    expect(genx?.id).toBe("gpt-5.4");
    expect(genx?.executableTasks).toContain("campaign_generation");
  });

  it("does not expose disabled legacy-provider media models", async () => {
    resetProviderModelDiscoveryCacheForTests();
    const candidates = await resolveModelCandidatesForTask("text_to_video", true);

    expect(candidates.some((candidate) => candidate.provider === "qwen")).toBe(false);
  });

  it("resolves configured GenX media models for video tasks", async () => {
    process.env.GENX_VIDEO_MODEL = "genx-video-t2v-test";
    resetProviderModelDiscoveryCacheForTests();
    const candidates = await resolveModelCandidatesForTask("text_to_video", true);

    expect(candidates[0].provider).toBe("genx");
    expect(candidates[0].id).toBe("genx-video-t2v-test");
    expect(candidates[0].endpointFamily).toBe("genx_async_job");
    expect(candidates[0].executableTasks).toContain("text_to_video");
  });

  it("does not expose gpt-5.4 as a playable text_to_video fallback", async () => {
    resetProviderModelDiscoveryCacheForTests();
    const candidates = await resolveModelCandidatesForTask("text_to_video", true);

    expect(candidates.some((candidate) => candidate.provider === "genx" && candidate.id === "gpt-5.4")).toBe(false);
  });

  it("prevents configured gpt-5.4 from becoming a text_to_video model", async () => {
    process.env.GENX_VIDEO_MODEL = "gpt-5.4";
    resetProviderModelDiscoveryCacheForTests();
    const candidates = await resolveModelCandidatesForTask("text_to_video", true);

    expect(candidates.some((candidate) => candidate.provider === "genx" && candidate.id === "gpt-5.4")).toBe(false);
  });

  it("skips configured GenX avatar models for text_to_video", async () => {
    process.env.GENX_VIDEO_MODEL = "kling-avatar-v2-pro";
    resetProviderModelDiscoveryCacheForTests();
    const candidates = await resolveModelCandidatesForTask("text_to_video", true);

    expect(candidates.some((candidate) => candidate.id === "kling-avatar-v2-pro")).toBe(false);
  });
});
