import { readFileSync } from "fs";
import { resolve } from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

describe("PR55 schema and router backend contracts", () => {
  it("adds durable backend tables for avatar/voice/music/results/agents", () => {
    const schema = readFileSync(resolve(process.cwd(), "drizzle/schema.ts"), "utf8");
    expect(schema).toContain("export const marketingAvatarJobs");
    expect(schema).toContain("export const marketingVoiceProfiles");
    expect(schema).toContain("export const marketingAudioBeds");
    expect(schema).toContain("export const marketingCampaignResults");
    expect(schema).toContain("export const marketingConversionEvents");
    expect(schema).toContain("export const marketingAttributionLinks");
    expect(schema).toContain("export const marketingAgentRuns");
    expect(schema).toContain("export const marketingAgentTasks");
  });

  it("registers PR55 backend procedures in routers.ts", () => {
    const routers = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    for (const name of [
      "generateMarketingStudioScript",
      "generateMarketingStudioScenePlan",
      "generateMarketingStudioPlanFromPrompt",
      "listMarketingBrandAvatars",
      "createMarketingAvatarAsset",
      "createMarketingAvatarLipsyncJob",
      "listMarketingVoiceProfiles",
      "generateMarketingVoicePreview",
      "listMarketingAudioBeds",
      "createMarketingMusicGenerationJob",
      "retryMarketingRenderJob",
      "approveMarketingRenderOutput",
      "rejectMarketingRenderOutput",
      "requestMarketingRenderChanges",
      "createMarketingAttributionLink",
      "recordMarketingConversionEvent",
      "createMarketingAgentRun",
      "runMarketingAgentTask",
      "getMarketingBackendReadiness",
    ]) {
      expect(routers).toContain(`${name}: adminUnlockedProcedure`);
    }
  });
});

describe("PR55 provider routing policy", () => {
  it("standard prefers qwen before genx and elite prefers genx first", async () => {
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        {
          provider: "genx",
          modelId: "genx-standard",
          displayName: "GenX",
          category: "text",
          supportedTasks: ["campaign_strategy"],
          inputModalities: ["text"],
          outputModalities: ["text"],
          maxContextTokens: null,
          maxDurationSeconds: null,
          supportedAspectRatios: [],
          supportedLanguages: ["en"],
          costTier: "standard",
          pricing: null,
          qualityTier: "good",
          isAvailable: true,
          setupStatus: "ready",
          source: "synced",
          metadata: {},
          lastSyncedAt: null,
        },
        {
          provider: "qwen",
          modelId: "qwen-standard",
          displayName: "Qwen",
          category: "text",
          supportedTasks: ["campaign_strategy"],
          inputModalities: ["text"],
          outputModalities: ["text"],
          maxContextTokens: null,
          maxDurationSeconds: null,
          supportedAspectRatios: [],
          supportedLanguages: ["en"],
          costTier: "standard",
          pricing: null,
          qualityTier: "good",
          isAvailable: true,
          setupStatus: "ready",
          source: "synced",
          metadata: {},
          lastSyncedAt: null,
        },
      ]),
    }));

    const { resolveMarketingProviderRoute } = await import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver");
    const { defaultWorkspaceBudgetPolicy } = await import("./modules/marketing/provider-capabilities/marketingBudgetPolicy");

    const standard = await resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "campaign_strategy",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });
    const elite = await resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "campaign_strategy",
      policy: defaultWorkspaceBudgetPolicy("elite"),
    });

    expect(standard.selected?.provider).toBe("qwen");
    expect(elite.selected?.provider).toBe("genx");
  });
});

describe("PR55 studio generation fallback truth", () => {
  it("marks fallback_used when provider route is unavailable", async () => {
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      getMarketingTaskCapabilityEntry: vi.fn(() => ({ canonicalTask: "strategy" })),
      resolveMarketingProviderRoute: vi.fn(async () => ({
        status: "setup_needed",
        reason: "No ready provider model found",
        selected: null,
        candidates: [],
      })),
      createMarketingProviderHealthCheck: vi.fn(async () => 1),
    }));
    vi.doMock("./_core/ai/orchestrator", () => ({
      executeAITaskWithProviderRoute: vi.fn(),
    }));

    const { generateMarketingStudioScenePlan } = await import("./modules/marketing/studio-generation");
    const result = await generateMarketingStudioScenePlan({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
      qualityMode: "standard",
      contentType: "facebook_ad",
      originalUserPrompt: "Build an equine campaign reel",
      durationTargetSeconds: 15,
    });

    expect(result.status).toBe("setup_needed");
    expect(result.fallback_used).toBe(true);
    expect(result.scenePlan.length).toBeGreaterThan(0);
    expect(result.scenePlan[0].sourceMetadata).toMatchObject({ fallback_used: true });
  });
});

describe("PR55 audio policy truth", () => {
  it("audio mix policy warns when voice/music and license are missing", async () => {
    const { buildMarketingAudioMixPolicy } = await import("./modules/marketing/avatar-voice-music");
    const policy = buildMarketingAudioMixPolicy({
      hasVoiceover: false,
      hasBackgroundMusic: false,
      musicLicenseOk: false,
    });

    expect(policy.warnings.join(" ")).toContain("Voiceover missing");
    expect(policy.warnings.join(" ")).toContain("Background music missing");
    expect(policy.warnings.join(" ")).toContain("Music license missing");
  });
});

describe("PR55 results and agents truth guards", () => {
  it("results module separates manual and connector sources", () => {
    const source = readFileSync(resolve(process.cwd(), "server/modules/marketing/results-conversion/index.ts"), "utf8");
    expect(source).toContain('source: "manual"');
    expect(source).toContain('source: "connector"');
    expect(source).toContain("connector metrics require sourceRef");
  });

  it("agent workforce module records route/provider and failure metadata", () => {
    const source = readFileSync(resolve(process.cwd(), "server/modules/marketing/agent-workforce/index.ts"), "utf8");
    expect(source).toContain("routeJson");
    expect(source).toContain("provider");
    expect(source).toContain("errorMessage");
    expect(source).toContain("one task at a time is enforced");
  });
});

describe("PR55 readiness endpoint truth", () => {
  it("does not return all-ready when providers/config are missing", async () => {
    vi.doMock("./dynamicConfig", () => ({
      getRuntimeConfig: vi.fn(async () => null),
    }));

    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      getMarketingProviderReadinessSummary: vi.fn(async () => ({
        providers: [
          { provider: "qwen", setupStatus: "setup_needed", modelCount: 0 },
          { provider: "genx", setupStatus: "setup_needed", modelCount: 0 },
          { provider: "huggingface", setupStatus: "setup_needed", modelCount: 0 },
        ],
      })),
      listMarketingProviderModels: vi.fn(async () => []),
      listMarketingTaskCapabilityEntries: vi.fn(() => [{ task: "campaign_strategy" }]),
      resolveMarketingProviderRoute: vi.fn(async () => ({ status: "setup_needed", reason: "missing", selected: null })),
    }));

    vi.doMock("./modules/marketing/avatar-voice-music", () => ({
      listMarketingVoiceProfiles: vi.fn(async () => []),
      listMarketingAudioBeds: vi.fn(async () => []),
    }));

    const { getMarketingBackendReadiness } = await import("./modules/marketing/backend-readiness");
    const readiness = await getMarketingBackendReadiness({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
      qualityMode: "standard",
    });

    expect(readiness.status).not.toBe("ready");
    expect(readiness.blockingIssues.length + readiness.warnings.length).toBeGreaterThan(0);
  });
});
