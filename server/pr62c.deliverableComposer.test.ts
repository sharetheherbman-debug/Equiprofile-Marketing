import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "..");

beforeEach(() => {
  vi.resetModules();
});

describe("PR62C deliverable composer", () => {
  it("composeThirtySecondAdPackage returns required sections", async () => {
    vi.doMock("./modules/marketing/studio-generation", () => ({
      generateMarketingStudioScript: vi.fn(async () => ({
        status: "generated",
        title: "Ad",
        goal: "g",
        audience: "a",
        brief: "b",
        script: "30-second script",
        voiceoverScript: "voice",
        scenePlan: [
          { order: 1, durationSeconds: 8, narration: "s1", visualPrompt: "v1" },
          { order: 2, durationSeconds: 10, narration: "s2", visualPrompt: "v2" },
          { order: 3, durationSeconds: 12, narration: "s3", visualPrompt: "v3" },
        ],
        requiredAssets: ["asset"],
        platformNotes: ["note"],
        cta: "Start free trial",
        hashtags: [],
        complianceNotes: [],
        providerRouteMetadata: {
          task: "scriptwriting",
          status: "ready",
          provider: "qwen",
          modelId: "qwen-text",
          reason: null,
          fallback_used: false,
          fallback_reason: null,
        },
      })),
    }));
    vi.doMock("./modules/marketing/image-generation", () => ({
      generateMarketingImageAsset: vi.fn(async () => ({ status: "setup_needed", setupNeeded: ["image provider missing"] })),
    }));

    const createMarketingCampaignItemRecord = vi.fn(async () => 1);
    const createMarketingScheduleDraftRecord = vi.fn(async () => 1);
    vi.doMock("./modules/growth-engine", () => ({
      createMarketingCampaignRecord: vi.fn(async () => 55),
      createMarketingCampaignItemRecord,
      createMarketingScheduleDraftRecord,
      listMarketingCampaignItemRecords: vi.fn(async () => []),
    }));
    vi.doMock("./modules/marketing/qa-engine/marketingReviewStore", () => ({
      createMarketingReviewRecord: vi.fn(async () => 1),
    }));
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      resolveMarketingProviderRoute: vi.fn(async () => ({ status: "ready", reason: null, selected: { provider: "qwen", modelId: "qwen-text" } })),
    }));

    const { composeThirtySecondAdPackage } = await import("./modules/marketing/deliverable-composer");
    const result = await composeThirtySecondAdPackage({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
      qualityMode: "standard",
      goal: "Create a 30-second Facebook and Instagram ad",
      audience: "stable owners",
      platforms: ["Facebook", "Instagram"],
      packageType: "video_ad_30s",
      durationSeconds: 30,
    });

    expect(result.packageType).toBe("video_ad_30s");
    expect(result.strategy).toBeTruthy();
    expect(result.hooks.length).toBeGreaterThanOrEqual(3);
    expect(result.script).toContain("30-second");
    expect(result.scenePlan.length).toBeGreaterThanOrEqual(3);
    expect(result.campaignItems.length).toBeGreaterThan(0);
    expect(createMarketingCampaignItemRecord).toHaveBeenCalled();
    expect(createMarketingScheduleDraftRecord).toHaveBeenCalled();
  });

  it("composeAssembledVideoPackage returns 8 to 15 scene timeline for 180-second package", async () => {
    vi.doMock("./modules/marketing/studio-generation", () => ({
      generateMarketingStudioScript: vi.fn(async () => ({
        status: "generated",
        title: "Video",
        goal: "g",
        audience: "a",
        brief: "b",
        script: "long script",
        voiceoverScript: "voice",
        scenePlan: [{ order: 1, durationSeconds: 20, narration: "s1", visualPrompt: "v1" }],
        requiredAssets: [],
        platformNotes: [],
        cta: "CTA",
        hashtags: [],
        complianceNotes: [],
        providerRouteMetadata: { status: "ready", provider: "qwen", modelId: "qwen-text", reason: null, fallback_used: false },
      })),
    }));
    vi.doMock("./modules/marketing/image-generation", () => ({ generateMarketingImageAsset: vi.fn(async () => ({ status: "setup_needed", setupNeeded: [] })) }));
    vi.doMock("./modules/growth-engine", () => ({
      createMarketingCampaignRecord: vi.fn(async () => 99),
      createMarketingCampaignItemRecord: vi.fn(async () => 1),
      createMarketingScheduleDraftRecord: vi.fn(async () => 1),
      listMarketingCampaignItemRecords: vi.fn(async () => []),
    }));
    vi.doMock("./modules/marketing/qa-engine/marketingReviewStore", () => ({ createMarketingReviewRecord: vi.fn(async () => 1) }));
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      resolveMarketingProviderRoute: vi.fn(async () => ({ status: "ready", reason: null, selected: { provider: "qwen", modelId: "qwen-text" } })),
    }));

    const { composeAssembledVideoPackage } = await import("./modules/marketing/deliverable-composer");
    const result = await composeAssembledVideoPackage({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
      qualityMode: "standard",
      goal: "Create a 3-minute marketing video",
      audience: "stable owners",
      platforms: ["YouTube"],
      packageType: "assembled_video_3m",
      durationSeconds: 180,
    });

    expect(result.packageType).toBe("assembled_video_3m");
    expect(result.scenePlan.length).toBeGreaterThanOrEqual(8);
    expect(result.scenePlan.length).toBeLessThanOrEqual(15);
  });

  it("generateMarketingAdPackage persists campaign items", () => {
    const source = fs.readFileSync(path.join(repoRoot, "server/routers.ts"), "utf8");
    expect(source).toContain("generateMarketingAdPackage: adminUnlockedProcedure");
    expect(source).toContain("composeThirtySecondAdPackageService");
    expect(source).toContain("createMarketingCampaignItemRecord");
  });

  it("generateMarketingVideoPackage persists scene-plan/video package items", () => {
    const routerSource = fs.readFileSync(path.join(repoRoot, "server/routers.ts"), "utf8");
    const composerSource = fs.readFileSync(path.join(repoRoot, "server/modules/marketing/deliverable-composer/index.ts"), "utf8");
    expect(routerSource).toContain("generateMarketingVideoPackage: adminUnlockedProcedure");
    expect(routerSource).toContain("composeAssembledVideoPackageService");
    expect(composerSource).toContain("type: \"scene_plan\"");
    expect(composerSource).toContain("type: \"video_plan\"");
  });

  it("generateMarketingCampaignPackage persists campaign plan/social/email/ad items", () => {
    const source = fs.readFileSync(path.join(repoRoot, "server/modules/marketing/deliverable-composer/index.ts"), "utf8");
    expect(source).toContain("composeSignupCampaignPackage");
    expect(source).toContain("type: \"campaign_plan\"");
    expect(source).toContain("type: \"social_post\"");
    expect(source).toContain("type: \"email\"");
    expect(source).toContain("type: \"ad_copy\"");
  });

  it("runAutonomousMarketingCampaign returns deliverablePackage, not only agent metadata", async () => {
    vi.doMock("./modules/growth-engine", () => ({
      createMarketingCampaignRecord: vi.fn(async () => 12),
    }));
    vi.doMock("./modules/marketing/connector-readiness", () => ({
      getMarketingConnectorReadiness: vi.fn(async () => ({ status: "setup_needed", counts: { readyForPosting: 0 } })),
    }));
    vi.doMock("./modules/marketing/results-conversion", () => ({
      getMarketingPerformanceContext: vi.fn(async () => ({ status: "insufficient_data", confidence: "low" })),
    }));
    vi.doMock("./modules/marketing/market-intelligence", () => ({
      getMarketingTrendContext: vi.fn(async () => ({ status: "setup_needed" })),
      getMarketingCompetitorContext: vi.fn(async () => ({ status: "setup_needed" })),
      detectMarketingContentGaps: vi.fn(async () => ({ status: "setup_needed" })),
    }));
    vi.doMock("./modules/marketing/platform-specialists", () => ({
      recommendSpecialistsForCampaign: vi.fn(async () => ({ status: "ok" })),
      buildPlatformSpecialistPromptContext: vi.fn(async () => ({ status: "ok" })),
    }));
    vi.doMock("./modules/marketing/genius-brain", () => ({ recommendMarketingPlaybook: vi.fn(async () => ({ status: "ok" })) }));
    vi.doMock("./modules/marketing/brand-memory", () => ({
      buildBrandMemoryPromptContext: vi.fn(async () => ({ status: "ok" })),
      updateBrandMemoryFromResults: vi.fn(async () => ({})),
    }));
    vi.doMock("./modules/marketing/campaign-manager-brain", () => ({
      analyzeMarketingCampaignBrief: vi.fn(async () => ({ status: "ok" })),
      generateMarketingManagerGuidance: vi.fn(async () => ({ guidance: ["g"] })),
      recommendCampaignStructure: vi.fn(async () => ({ status: "ok" })),
    }));
    vi.doMock("./modules/marketing/result-learning", () => ({
      getMarketingLearningInsights: vi.fn(async () => ({ status: "ok" })),
      recommendNextMarketingActions: vi.fn(async () => ({ status: "ok" })),
    }));
    vi.doMock("./modules/marketing/creative-scoring", () => ({ scoreMarketingCreative: vi.fn(async () => ({ total: 80 })) }));
    vi.doMock("./modules/marketing/media-excellence", () => ({
      recommendMarketingMediaTemplate: vi.fn(() => ({ template: "t" })),
      buildMarketingVideoPacingPlan: vi.fn(() => ({ plan: [] })),
      buildMarketingCaptionStylePlan: vi.fn(() => ({ style: "s" })),
      buildMarketingThumbnailPlan: vi.fn(() => ({ style: "s" })),
      validateMarketingMediaExcellence: vi.fn(() => ({ status: "ok" })),
    }));
    vi.doMock("./modules/marketing/command-centre", () => ({ getMarketingCommandCentreState: vi.fn(async () => ({ status: "ok" })) }));
    vi.doMock("./modules/marketing/agent-workforce", () => ({
      createMarketingAgentRun: vi.fn(async () => 10),
      runMarketingAgentTask: vi.fn(async () => ({ status: "completed", taskId: 11, reason: null })),
      getMarketingAgentRun: vi.fn(async () => ({ status: "completed", tasks: [] })),
    }));
    vi.doMock("./modules/marketing/deliverable-composer", () => ({
      composeSignupCampaignPackage: vi.fn(async () => ({
        packageId: "pkg_1",
        campaignId: 12,
        packageType: "signup_campaign",
        setupNeeded: false,
        blockers: [],
        status: "completed",
        campaignItems: [{ id: 1 }],
        reviewItems: [{ id: 2 }],
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
      goal: "Get signups",
      audience: "stable owners",
      platforms: ["Facebook"],
      durationDays: 30,
      contentTypes: ["social_post"],
    });

    expect(result.deliverablePackage).toBeTruthy();
    expect(result.campaignItems.length).toBeGreaterThan(0);
    expect(result.agentSummary).toBeTruthy();
  });

  it("missing media provider still returns text deliverables with media setup_needed", async () => {
    vi.doUnmock("./modules/marketing/deliverable-composer");
    vi.doMock("./modules/marketing/studio-generation", () => ({
      generateMarketingStudioScript: vi.fn(async () => ({
        status: "generated",
        script: "text deliverable",
        voiceoverScript: "voice",
        scenePlan: [{ order: 1, durationSeconds: 10, narration: "s1", visualPrompt: "v1" }],
        requiredAssets: [],
        platformNotes: [],
        cta: "CTA",
        hashtags: [],
        complianceNotes: [],
        providerRouteMetadata: { status: "ready", provider: "qwen", modelId: "qwen", reason: null, fallback_used: false },
      })),
    }));
    vi.doMock("./modules/marketing/image-generation", () => ({
      generateMarketingImageAsset: vi.fn(async () => ({ status: "setup_needed", setupNeeded: ["Configure image provider"], assetId: 1 })),
    }));
    vi.doMock("./modules/growth-engine", () => ({
      createMarketingCampaignRecord: vi.fn(async () => 5),
      createMarketingCampaignItemRecord: vi.fn(async () => 1),
      createMarketingScheduleDraftRecord: vi.fn(async () => 1),
      listMarketingCampaignItemRecords: vi.fn(async () => []),
    }));
    vi.doMock("./modules/marketing/qa-engine/marketingReviewStore", () => ({ createMarketingReviewRecord: vi.fn(async () => 1) }));
    vi.doMock("./modules/marketing/provider-capabilities", () => ({
      defaultWorkspaceBudgetPolicy: vi.fn(() => ({ mode: "standard" })),
      resolveMarketingProviderRoute: vi.fn(async () => ({ status: "ready", reason: null, selected: { provider: "qwen", modelId: "qwen-text" } })),
    }));

    const { composeImageAdPackage } = await import("./modules/marketing/deliverable-composer");
    const result = await composeImageAdPackage({
      tenantId: "t",
      workspaceId: "w",
      hostAppId: "equiprofile",
      qualityMode: "standard",
      goal: "Create image ad",
      audience: "stable owners",
      platforms: ["Facebook"],
      packageType: "image_ad",
    });

    expect(result.setupNeeded).toBe(true);
    expect(result.blockers.join(" ")).toContain("Configure image provider");
    expect(result.adCopy.length).toBeGreaterThan(0);
  });
});
