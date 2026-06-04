import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const root = process.cwd();

describe("PR60 settings stability", () => {
  it("settings consumes provider settings object shape and readiness endpoints", () => {
    const source = readFileSync(path.join(root, "client/src/components/marketing/app/MarketingAppSettings.tsx"), "utf8");
    expect(source).toContain("type ProviderSettingsApiResponse");
    expect(source).toContain("settingsById");
    expect(source).toContain("trpc.admin.getMarketingBackendReadiness.useQuery");
    expect(source).toContain("trpc.admin.listMarketingSocialConnections.useQuery");
    expect(source).not.toContain("providerSettingsQuery.data as Array");
    expect(source).toContain("Saved");
    expect(source).toContain("keyMasked");
  });

  it("router exposes frontend command-centre and intelligence contracts", () => {
    const source = readFileSync(path.join(root, "server/routers.ts"), "utf8");
    for (const required of [
      "getMarketingCommandCentreState",
      "runAutonomousMarketingCampaign",
      "getMarketingBrandMemory",
      "listMarketingPlatformSpecialists",
      "recommendMarketingPlaybook",
      "getMarketingTrendContext",
      "getMarketingCompetitorContext",
      "getMarketingLearningInsights",
      "scoreMarketingCreative",
      "getMarketingBackendReadiness",
      "getMarketingConnectorReadiness",
      "resolveQueuedMarketingMediaJobs",
      "getMarketingManagerGuidance",
      "recommendMarketingNextSteps",
    ]) {
      expect(source).toContain(required);
    }
  });
});

describe("PR60 DB noise cleanup", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("suppresses repeated verbose DB noise in test mode when DB is unavailable", async () => {
    process.env.NODE_ENV = "test";
    process.env.VITEST = "true";
    process.env.DATABASE_URL = "mysql://testuser:bad@127.0.0.1:3306/test_db";

    vi.doMock("drizzle-orm/mysql2", () => ({
      drizzle: () => ({
        execute: async () => {
          throw new Error("connect ECONNREFUSED 127.0.0.1:3306");
        },
      }),
    }));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const dbModule = await import("./db");
    const first = await dbModule.getDb();
    const second = await dbModule.getDb();

    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith("[Database][test] Database unavailable, running DB-optional tests with setup_needed fallbacks.");
    const testWarnCalls = warnSpy.mock.calls.filter((call) => String(call[0]).includes("[Database][test]"));
    expect(testWarnCalls.length).toBe(1);
    expect(errorSpy).not.toHaveBeenCalled();
  }, 15_000);
});

describe("PR60 marketing genius and specialists", () => {
  it("exposes required hook and angle frameworks", async () => {
    const genius = await import("./modules/marketing/genius-brain");
    const hookIds = genius.listMarketingHookFrameworks().map((item) => item.id);
    const angleIds = genius.listMarketingAngleFrameworks().map((item) => item.id);

    for (const required of [
      "problem_agitate_solve",
      "contrarian_insight",
      "before_after",
      "mistake_to_avoid",
      "hidden_cost",
      "quick_win",
      "founder_story",
      "social_proof",
      "myth_busting",
      "urgency_event",
      "transformation",
      "checklist_listicle",
      "curiosity_gap",
      "data_stat_insight",
      "objection_flip",
    ]) {
      expect(hookIds).toContain(required);
    }

    for (const required of ["pain_point", "aspiration", "status", "fomo", "time_saving", "money_saving", "trust_safety", "authority", "community", "seasonal_event", "demo_proof", "comparison"]) {
      expect(angleIds).toContain(required);
    }
  });

  it("scores platform fit and returns warnings truthfully", async () => {
    const specialists = await import("./modules/marketing/platform-specialists");
    const result = specialists.scoreMarketingPlatformFit({
      specialistId: "linkedin_authority",
      contentFormat: "meme-first hard sell",
      hasCta: false,
      hasProof: false,
    });

    expect(result.status).toBe("ok");
    expect(result.score).toBeLessThan(60);
    expect(result.warnings).toContain("missing_cta");
    expect(result.warnings).toContain("missing_proof");
  });
});

describe("PR60 creative and intelligence truth", () => {
  it("creative scoring blocks unsupported claims and missing CTA for conversion goals", async () => {
    vi.doMock("./modules/marketing/brand-memory", () => ({
      buildBrandMemoryPromptContext: vi.fn(async () => ({
        status: "ok",
        tabooClaims: ["guaranteed cure"],
      })),
    }));

    const scoring = await import("./modules/marketing/creative-scoring");
    const result = await scoring.scoreMarketingCreative({
      tenantId: "global",
      workspaceId: "default",
      hostAppId: "equiprofile",
      platform: "LinkedIn",
      contentType: "social_post",
      goal: "increase conversions",
      hook: "Guaranteed cure for all record issues",
      body: "This will solve everything instantly.",
      cta: "",
      claims: ["guaranteed cure"],
      proofPoints: [],
      hasVisualAsset: false,
    });

    expect(result.blockingIssues).toContain("claims_without_supporting_proof");
    expect(result.blockingIssues).toContain("missing_cta_for_conversion_goal");
    expect(["reject", "manual_review_required", "needs_changes"]).toContain(result.approvalRecommendation);
  });

  it("market intelligence rejects scraper source when scraper config is missing", async () => {
    vi.doMock("./dynamicConfig", () => ({ getRuntimeConfig: vi.fn(async () => "") }));
    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => ({
        insert: vi.fn(() => ({ values: vi.fn(async () => ({ insertId: 1 })) })),
      })),
    }));

    const marketIntel = await import("./modules/marketing/market-intelligence");
    await expect(marketIntel.recordMarketingTrendSignal({
      tenantId: "global",
      workspaceId: "default",
      hostAppId: "equiprofile",
      platform: "LinkedIn",
      topic: "horse workflow",
      signalType: "trend",
      signalText: "Rising demand for audit trails",
      sourceType: "scraper",
    })).rejects.toThrow("scraper_not_configured");
  });

  it("connector readiness stays setup_needed when token/scope/config missing", async () => {
    vi.doMock("./dynamicConfig", () => ({ getRuntimeConfig: vi.fn(async () => "") }));
    vi.doMock("./modules/growth-engine", () => ({
      listMarketingSocialConnectionRecords: vi.fn(async () => []),
    }));
    vi.doMock("./modules/marketing/social-publishing/socialPublisherRegistry", () => ({
      getSocialPublisher: vi.fn(() => ({
        getRequiredScopes: () => ["publish"],
        validateConnection: () => ({ readinessStatus: "setup_needed", reason: "missing_token" }),
        canPublishWithConnection: () => false,
      })),
    }));

    const readiness = await import("./modules/marketing/connector-readiness");
    const result = await readiness.getMarketingConnectorReadiness({ tenantId: "global", workspaceId: "default" });

    expect(result.status).toBe("setup_needed");
    expect(result.counts.readyForPosting).toBe(0);
    expect(result.platforms.every((item) => item.status !== "ready_for_posting")).toBe(true);
  });
});
