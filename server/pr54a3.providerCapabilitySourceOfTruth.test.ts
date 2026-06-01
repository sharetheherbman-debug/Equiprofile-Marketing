import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { marketingProviderHealthChecks, marketingProviderModels } from "../drizzle/schema";
import { defaultWorkspaceBudgetPolicy } from "./modules/marketing/provider-capabilities/marketingBudgetPolicy";
import type { MarketingProviderModelRecord } from "./modules/marketing/provider-capabilities/providerCapabilityTypes";
import { getSocialPublisher } from "./modules/marketing/social-publishing/socialPublisherRegistry";

function createModel(overrides: Partial<MarketingProviderModelRecord>): MarketingProviderModelRecord {
  return {
    provider: "qwen",
    modelId: "qwen-2.5",
    displayName: "Qwen 2.5",
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
    lastSyncedAt: "2026-05-31T00:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetModules();
});

describe("PR54A-3 schema source of truth", () => {
  it("exports provider model and provider health schema tables with required columns", () => {
    expect(marketingProviderModels).toBeDefined();
    expect(marketingProviderHealthChecks).toBeDefined();
    expect(marketingProviderModels.tenantId.name).toBe("tenantId");
    expect(marketingProviderModels.workspaceId.name).toBe("workspaceId");
    expect(marketingProviderModels.provider.name).toBe("provider");
    expect(marketingProviderModels.modelId.name).toBe("modelId");
    expect(marketingProviderModels.supportedTasksJson.name).toBe("supportedTasksJson");
    expect(marketingProviderModels.metadataJson.name).toBe("metadataJson");
    expect(marketingProviderModels.createdAt.name).toBe("createdAt");
    expect(marketingProviderModels.updatedAt.name).toBe("updatedAt");
    expect(marketingProviderHealthChecks.provider.name).toBe("provider");
    expect(marketingProviderHealthChecks.modelId.name).toBe("modelId");
    expect(marketingProviderHealthChecks.task.name).toBe("task");
    expect(marketingProviderHealthChecks.status.name).toBe("status");
    expect(marketingProviderHealthChecks.checkedAt.name).toBe("checkedAt");
  });
});

describe("PR54A-3 provider stores", () => {
  it("providerModelStore parses list rows into durable capability records", async () => {
    const row = {
      provider: "qwen",
      modelId: "qwen-2.5",
      displayName: "Qwen 2.5",
      category: "text",
      supportedTasksJson: "[\"campaign_strategy\",\"hook_generation\"]",
      inputModalitiesJson: "[\"text\"]",
      outputModalitiesJson: "[\"text\"]",
      maxContextTokens: 32000,
      maxDurationSeconds: null,
      supportedAspectRatiosJson: null,
      supportedLanguagesJson: "[\"en\"]",
      costTier: "standard",
      pricingJson: "{\"usdPer1kTokens\":0.1}",
      qualityTier: "good",
      isAvailable: 1,
      setupStatus: "ready",
      source: "synced",
      metadataJson: "{\"executionMode\":\"sync\"}",
      lastSyncedAt: new Date("2026-05-31T00:00:00.000Z"),
      updatedAt: new Date("2026-05-31T00:00:00.000Z"),
    };

    const mockDb = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(async () => [row]),
          })),
        })),
      })),
    };

    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => mockDb),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/providerModelStore");
    const result = await mod.listMarketingProviderModels({ tenantId: "t", workspaceId: "w" });

    expect(result).toHaveLength(1);
    expect(result[0].supportedTasks).toEqual(["campaign_strategy", "hook_generation"]);
    expect(result[0].metadata).toEqual({ executionMode: "sync" });
    expect(result[0].lastSyncedAt).toBe("2026-05-31T00:00:00.000Z");
  });

  it("providerModelStore upsert inserts model records with serialized JSON fields", async () => {
    const valuesSpy = vi.fn(async () => [{ insertId: 101 }]);
    const mockDb = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn(async () => []),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        values: valuesSpy,
      })),
    };

    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => mockDb),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/providerModelStore");
    const id = await mod.upsertMarketingProviderModel({
      tenantId: "tenant-a",
      workspaceId: "workspace-a",
      model: createModel({
        provider: "huggingface",
        modelId: "hf-embed",
        supportedTasks: ["embedding"],
        inputModalities: ["text"],
        outputModalities: ["embedding"],
      }),
    });

    expect(id).toBe(101);
    expect(valuesSpy).toHaveBeenCalledWith(expect.objectContaining({
      tenantId: "tenant-a",
      workspaceId: "workspace-a",
      provider: "huggingface",
      modelId: "hf-embed",
      supportedTasksJson: "[\"embedding\"]",
      outputModalitiesJson: "[\"embedding\"]",
    }));
  });

  it("providerHealthStore creates and lists health checks from durable table", async () => {
    const insertValuesSpy = vi.fn(async () => [{ insertId: 202 }]);
    const checkedAt = new Date("2026-05-31T01:02:03.000Z");
    const mockDb = {
      insert: vi.fn(() => ({
        values: insertValuesSpy,
      })),
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(async () => [{
              provider: "genx",
              modelId: "genx-elite",
              task: "avatar_generation",
              status: "degraded",
              latencyMs: 987,
              errorMessage: "token_missing",
              checkedAt,
            }]),
          })),
        })),
      })),
    };

    vi.doMock("./db", () => ({
      getDb: vi.fn(async () => mockDb),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/providerHealthStore");
    const insertId = await mod.createMarketingProviderHealthCheck({
      tenantId: "tenant-a",
      workspaceId: "workspace-a",
      provider: "genx",
      modelId: "genx-elite",
      task: "avatar_generation",
      status: "degraded",
      latencyMs: 987,
      errorMessage: "token_missing",
    });

    const rows = await mod.listMarketingProviderHealthChecks({ tenantId: "tenant-a", workspaceId: "workspace-a" });

    expect(insertId).toBe(202);
    expect(insertValuesSpy).toHaveBeenCalledWith(expect.objectContaining({
      provider: "genx",
      modelId: "genx-elite",
      task: "avatar_generation",
      status: "degraded",
    }));
    expect(rows[0]).toEqual({
      provider: "genx",
      modelId: "genx-elite",
      task: "avatar_generation",
      status: "degraded",
      latencyMs: 987,
      errorMessage: "token_missing",
      checkedAt: checkedAt.toISOString(),
    });
  });
});

describe("PR54A-3 route/publishing truth", () => {
  it("matches campaign_strategy through canonical strategy support", async () => {
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        createModel({
          provider: "qwen",
          modelId: "qwen-strategy",
          supportedTasks: ["strategy" as any],
          setupStatus: "ready",
          isAvailable: true,
        }),
      ]),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver");
    const decision = await mod.resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "campaign_strategy",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });

    expect(decision.status).toBe("ready");
    expect(decision.selected?.modelId).toBe("qwen-strategy");
    expect(decision.canonicalTask).toBe("strategy");
  });

  it("maps marketing tasks to canonical tasks for copy and image routes", async () => {
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        createModel({
          provider: "qwen",
          modelId: "qwen-copy",
          supportedTasks: ["copywriting" as any],
          setupStatus: "ready",
          isAvailable: true,
        }),
        createModel({
          provider: "huggingface",
          modelId: "hf-image",
          category: "image",
          costTier: "free",
          supportedTasks: ["text_to_image" as any],
          setupStatus: "ready",
          isAvailable: true,
        }),
      ]),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver");
    const copyDecision = await mod.resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "platform_copywriting",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });
    const imageDecision = await mod.resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "image_generation",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });

    expect(copyDecision.status).toBe("ready");
    expect(copyDecision.canonicalTask).toBe("copywriting");
    expect(imageDecision.status).toBe("ready");
    expect(imageDecision.canonicalTask).toBe("text_to_image");
  });

  it("allows avatar_generation only when avatar_video route is ready", async () => {
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        createModel({
          provider: "genx",
          modelId: "genx-avatar",
          category: "video",
          supportedTasks: ["avatar_video" as any],
          setupStatus: "setup_needed",
          isAvailable: false,
        }),
      ]),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver");
    const blockedDecision = await mod.resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "avatar_generation",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });
    expect(blockedDecision.status).toBe("setup_needed");

    vi.resetModules();
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        createModel({
          provider: "genx",
          modelId: "genx-avatar-ready",
          category: "video",
          supportedTasks: ["avatar_video" as any],
          setupStatus: "ready",
          isAvailable: true,
          costTier: "standard",
        }),
      ]),
    }));

    const modReady = await import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver");
    const readyDecision = await modReady.resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "avatar_generation",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });
    expect(readyDecision.status).toBe("ready");
  });

  it("standard mode blocks premium GenX when explicit fallback is not allowed", async () => {
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        createModel({
          provider: "genx",
          modelId: "genx-ultra",
          supportedTasks: ["avatar_generation"],
          costTier: "premium",
          category: "video",
          setupStatus: "ready",
          isAvailable: true,
        }),
      ]),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver");
    const policy = {
      ...defaultWorkspaceBudgetPolicy("standard"),
      maxCostTier: "elite" as const,
    };
    const decision = await mod.resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "avatar_generation",
      policy,
    });

    expect(decision.status).toBe("budget_blocked");
    expect(decision.selected).toBeNull();
    expect(decision.reason).toContain("standard mode disallows premium GenX fallback");
  });

  it("no ready provider model returns setup_needed with no fake selected route", async () => {
    vi.doMock("./modules/marketing/provider-capabilities/providerModelStore", () => ({
      listMarketingProviderModels: vi.fn(async () => [
        createModel({
          provider: "qwen",
          modelId: "qwen-not-ready",
          supportedTasks: ["platform_copywriting"],
          setupStatus: "setup_needed",
          isAvailable: false,
        }),
      ]),
    }));

    const mod = await import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver");
    const decision = await mod.resolveMarketingProviderRoute({
      tenantId: "t",
      workspaceId: "w",
      task: "platform_copywriting",
      policy: defaultWorkspaceBudgetPolicy("standard"),
    });

    expect(decision.status).toBe("setup_needed");
    expect(decision.selected).toBeNull();
    expect(decision.reason).toContain("No ready provider model");
  });

  it("social stub adapters cannot fake successful posting or platform IDs", async () => {
    const publisher = getSocialPublisher("Facebook");
    const result = await publisher.publishApprovedDraft({
      draftId: 1,
      platform: "Facebook",
      title: "Draft",
      content: "Copy",
      scheduledFor: "2026-06-01T00:00:00.000Z",
      reviewStatus: "approved",
      assetUrls: [],
    });

    expect(result.success).toBe(false);
    expect(Boolean(result.platformPostId ?? result.uploadId)).toBe(false);
  });
});

describe("PR64C tooling truth endpoint contract", () => {
  it("keeps admin router wired to tooling truth endpoint", () => {
    const routers = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    const service = readFileSync(resolve(process.cwd(), "server/modules/marketing/provider-capabilities/providerToolingTruthService.ts"), "utf8");
    expect(routers).toContain("getMarketingProviderToolingTruth");
    expect(service).toContain("providers");
    expect(service).toContain("taskRoutes");
    expect(service).toContain("publishing");
    expect(service).toContain("attribution");
  });
});

describe("PR54A-3 build blocker regression", () => {
  it("provider-capability routers and modules stay wired to durable store layer", async () => {
    const [syncModule, readinessModule, resolverModule] = await Promise.all([
      import("./modules/marketing/provider-capabilities/providerCapabilitySync"),
      import("./modules/marketing/provider-capabilities/marketingProviderReadinessService"),
      import("./modules/marketing/provider-capabilities/marketingProviderRouteResolver"),
    ]);

    expect(typeof syncModule.syncMarketingProviderCapabilitiesForWorkspace).toBe("function");
    expect(typeof readinessModule.getMarketingProviderReadinessSummary).toBe("function");
    expect(typeof resolverModule.resolveMarketingProviderRoute).toBe("function");

    const routers = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    expect(routers).toContain("syncMarketingProviderCapabilitiesForWorkspace");
    expect(routers).toContain("getMarketingProviderReadinessSummary");
    expect(routers).toContain("listMarketingProviderModels");
    expect(routers).toContain("resolveMarketingProviderRoute");
    expect(routers).toContain("testMarketingProviderTaskRoute");
    expect(routers).not.toContain("discoverProviderModels(");
  });
});
