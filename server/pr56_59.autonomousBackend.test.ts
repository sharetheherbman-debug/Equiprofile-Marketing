import { readFileSync } from "fs";
import { resolve } from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

describe("PR56 scene planning and studio safety", () => {
  it("scene_planning resolves to a model route when a provider model is ready", async () => {
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        {
          provider: "qwen",
          modelId: "qwen-planner",
          displayName: "Qwen Planner",
          category: "text",
          supportedTasks: ["scene_planning"],
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
    const route = await resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "scene_planning",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });

    expect(route.status).toBe("ready");
    expect(route.selected?.routeType).toBe("model");
    expect(route.selected?.provider).toBe("qwen");
    expect(route.selected?.provider).not.toBe("media_factory");
  });

  it("studio workbench no longer uses optional mutation fallback for script generation", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/marketing/app/studio/StudioWorkbench.tsx"), "utf8");
    expect(source).toContain("trpc.admin.generateMarketingStudioScript.useMutation()");
    expect(source).not.toContain("generateMarketingStudioScript?.useMutation");
  });
});

describe("PR56 queued media and taxonomy truth", () => {
  it("music generation uses audio/music taxonomy instead of voice/text_to_speech", async () => {
    const createMediaAsset = vi.fn(async (input) => ({ id: 17, ...input }));
    vi.doMock("./modules/growth-engine", () => ({
      createMediaAsset,
      getMediaAssetById: vi.fn(),
    }));
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      resolveMarketingProviderRoute: vi.fn(async () => ({
        status: "ready",
        reason: null,
        selected: {
          provider: "qwen",
          modelId: "qwen-audio",
          category: "audio",
          canonicalTask: "text_to_speech",
          routeType: "model",
        },
        candidates: [],
      })),
      createMarketingProviderHealthCheck: vi.fn(async () => 1),
      type: {},
    }));
    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => ({
        insert: () => ({
          values: async () => [{ insertId: 3 }],
        }),
      })),
    }));

    const { createMarketingMusicGenerationJob } = await import("./modules/marketing/avatar-voice-music");
    await createMarketingMusicGenerationJob({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
      qualityMode: "standard",
      title: "Uplift Track",
      prompt: "bright energetic background music",
      mood: "uplifting",
      tempo: "120bpm",
      durationSeconds: 15,
      userId: 1,
    });

    expect(createMediaAsset).toHaveBeenCalledTimes(1);
    const payload = createMediaAsset.mock.calls[0][0];
    expect(payload.type).toBe("audio");
    expect(payload.task).toBe("music_generation");
  });

  it("queued media resolver returns stable setup_needed status when resolver backend is unavailable", async () => {
    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => null),
    }));
    const mod = await import("./modules/marketing/media-job-resolver");
    const first = await mod.resolveQueuedMarketingMediaJobs({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
    });
    const second = await mod.resolveQueuedMarketingMediaJobs({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
    });

    expect(first.status).toBe("setup_needed");
    expect(second.status).toBe("setup_needed");
    expect(first.setupNeeded).toBeGreaterThan(0);
    expect(second.setupNeeded).toBeGreaterThan(0);
    expect(first.warnings.length).toBeGreaterThan(0);
    expect(second.warnings.length).toBeGreaterThan(0);
  });
});

describe("PR57/PR59 readiness and truth contracts", () => {
  it("attribution redirect flow is wired to durable click increment and redirect endpoint", () => {
    const resultsSource = readFileSync(resolve(process.cwd(), "server/modules/marketing/results-conversion/index.ts"), "utf8");
    const serverSource = readFileSync(resolve(process.cwd(), "server/_core/index.ts"), "utf8");
    expect(resultsSource).toContain("resolveMarketingAttributionClick");
    expect(resultsSource).toContain("clickCount: (row.clickCount ?? 0) + 1");
    expect(serverSource).toContain("app.get(\"/m/:code\"");
    expect(serverSource).toContain("res.redirect(302, result.destinationUrl)");
  });

  it("connector readiness reports missing token/scope states without fake ready", async () => {
    vi.doMock("./modules/growth-engine", () => ({
      listMarketingSocialConnectionRecords: vi.fn(async () => [
        {
          platform: "Facebook",
          status: "connected",
          scopes: ["pages_read_engagement"],
          tokenRef: null,
          expiresAt: null,
          accountId: "acct_1",
        },
      ]),
    }));
    vi.doMock("./dynamicConfig", () => ({
      getRuntimeConfig: vi.fn(async () => null),
    }));
    vi.doMock("./modules/marketing/social-publishing/socialPublisherRegistry", () => ({
      getSocialPublisher: vi.fn(() => ({
        getRequiredScopes: () => ["pages_manage_posts", "pages_read_engagement"],
        validateConnection: () => ({ canPublish: false, readinessStatus: "connected", reason: "connected_but_not_ready" }),
        canPublishWithConnection: () => false,
      })),
    }));

    const { getMarketingConnectorReadiness } = await import("./modules/marketing/connector-readiness");
    const readiness = await getMarketingConnectorReadiness({ tenantId: "t", workspaceId: "w" });
    const facebook = readiness.platforms.find((row) => row.platform === "Facebook");

    expect(readiness.status).not.toBe("ready");
    expect(facebook?.status === "missing_token" || facebook?.status === "missing_scopes").toBe(true);
  });

  it("publisher stubs cannot fake posted state", async () => {
    vi.doUnmock("./modules/marketing/social-publishing/socialPublisherRegistry");
    vi.doUnmock("./modules/growth-engine");
    vi.doUnmock("./dynamicConfig");
    const { getSocialPublisher } = await import("./modules/marketing/social-publishing/socialPublisherRegistry");
    const publisher = getSocialPublisher("Facebook");
    const result = await publisher.publishApprovedDraft({
      draftId: 1,
      platform: "Facebook",
      title: "t",
      content: "c",
      scheduledFor: new Date().toISOString(),
      reviewStatus: "approved",
    });
    expect(result.success).toBe(false);
    expect(result.platformPostId ?? result.uploadId).toBeFalsy();
  });
});

describe("PR58 autonomous workforce orchestration", () => {
  it("runAutonomousMarketingCampaign persists role runs/tasks and stays export-first by default", async () => {
    vi.doMock("./modules/growth-engine", () => ({
      createMarketingCampaignRecord: vi.fn(async () => 91),
    }));
    vi.doMock("./modules/marketing/results-conversion", () => ({
      getMarketingPerformanceContext: vi.fn(async () => ({
        status: "insufficient_data",
        confidence: "low",
        sourceLabels: { manual: 0, connector: 0 },
      })),
      scoreMarketingCampaignPerformance: vi.fn(async () => ({
        status: "insufficient_data",
        confidence: "low",
        totals: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          conversionRate: 0,
          engagementScore: 0,
          ctaPerformance: 0,
          platformScore: {},
          contentItemScore: {},
        },
        dataSources: { manual: 0, connector: 0, imported: 0, api: 0, attribution: 0, unknown: 0 },
        warnings: ["insufficient_data"],
      })),
      detectMarketingWinningPatterns: vi.fn(async () => ({
        status: "insufficient_data",
        winningHooks: [],
        winningPlatforms: [],
        winningFormats: [],
        winningCtaStyles: [],
        winningPostingWindows: [],
        weakPerformers: [],
        warnings: ["insufficient_data"],
      })),
    }));
    vi.doMock("./modules/marketing/connector-readiness", () => ({
      getMarketingConnectorReadiness: vi.fn(async () => ({
        status: "setup_needed",
        counts: { readyForPosting: 0, blocked: 7 },
        platforms: [],
      })),
    }));
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard", allowPremiumGenXInStandard: false })),
      getMarketingProviderReadinessSummary: vi.fn(async () => ({
        providers: [{ provider: "qwen", setupStatus: "ready" }],
      })),
      listMarketingProviderModels: vi.fn(async () => [
        { provider: "qwen", setupStatus: "ready" },
      ]),
      listMarketingTaskCapabilityEntries: vi.fn(() => [
        { task: "campaign_strategy" },
        { task: "script_generation" },
      ]),
      resolveMarketingProviderRoute: vi.fn(async () => ({
        status: "ready",
        reason: null,
        selected: { provider: "qwen", modelId: "qwen-text", routeType: "model", canonicalTask: "campaign_strategy" },
        candidates: [],
      })),
    }));

    let runId = 100;
    vi.doMock("./modules/marketing/agent-workforce", () => ({
      createMarketingAgentRun: vi.fn(async () => ++runId),
      runMarketingAgentTask: vi.fn(async () => ({
        status: "completed",
        taskId: ++runId,
        reason: null,
      })),
      getMarketingAgentRun: vi.fn(async ({ id }: { id: number }) => ({
        id,
        status: "completed",
        tasks: [],
      })),
    }));
    vi.doMock("./modules/marketing/deliverable-composer", () => ({
      composeSignupCampaignPackage: vi.fn(async () => ({
        packageId: "pkg_test",
        campaignId: 91,
        packageType: "signup_campaign",
        setupNeeded: false,
        blockers: [],
        status: "completed",
        campaignItems: [{ id: 1 }],
        reviewItems: [{ id: 2, reviewStatus: "needs_review" }],
        exportPack: { id: "exp" },
        scheduleDrafts: [{ id: 3 }],
        mediaJobs: [],
      })),
    }));

    const { runAutonomousMarketingCampaign } = await import("./modules/marketing/autonomous-campaign");
    const result = await runAutonomousMarketingCampaign({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
      qualityMode: "standard",
      goal: "Generate trial signups",
      audience: "Horse owners",
      platforms: ["Facebook", "Instagram"],
      durationDays: 14,
      contentTypes: ["short_video", "image_post"],
    });

    expect(result.campaignId).toBe(91);
    expect(result.runSummaries.length).toBeGreaterThanOrEqual(7);
    expect(result.exportOnly).toBe(true);
    expect(result.reviewTasks.every((task) => task.reviewStatus === "needs_review")).toBe(true);
  });
});
