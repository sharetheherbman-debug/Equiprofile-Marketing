import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

let storedRow: Record<string, any> | null = null;
let generationMode: "model" | "fallback" = "fallback";

const fakeDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        orderBy: () => ({
          limit: async () => storedRow ? [storedRow] : [],
        }),
      }),
    }),
  }),
  insert: () => ({
    values: async (payload: Record<string, unknown>) => {
      const now = new Date();
      storedRow = { id: 1, createdAt: now, updatedAt: now, ...payload };
      return [{ insertId: 1 }];
    },
  }),
  update: () => ({
    set: (patch: Record<string, unknown>) => ({
      where: async () => {
        storedRow = { ...storedRow, ...patch };
      },
    }),
  }),
};

vi.mock("./db", () => ({ getDb: async () => fakeDb }));
vi.mock("./dynamicConfig", () => ({ getRuntimeConfig: async () => null }));
vi.mock("./modules/growth-engine", () => ({
  createMediaAsset: async () => ({ id: 77 }),
  createMarketingCampaignItemRecord: async () => Math.floor(Math.random() * 10000) + 1,
  createMarketingCampaignRecord: async () => 1,
  createMarketingScheduleDraftRecord: async () => Math.floor(Math.random() * 10000) + 1,
  listMarketingCampaignItemRecords: async () => [],
}));
vi.mock("./modules/marketing/qa-engine/marketingReviewStore", () => ({
  createMarketingReviewRecord: async () => Math.floor(Math.random() * 10000) + 1,
}));
vi.mock("./modules/marketing/brand-memory", () => ({
  getMarketingBrandMemory: async () => ({ status: "setup_needed", memory: null }),
}));
vi.mock("./modules/marketing/model-execution", () => ({
  executeMarketingModelTask: async ({ platform, task }: { platform: string; task: string }) => ({
    status: generationMode === "model" ? "completed" : "setup_needed",
    generationMode,
    provider: generationMode === "model" ? "qwen" : null,
    model: generationMode === "model" ? "qwen-plus-marketing" : null,
    selectedProvider: generationMode === "model" ? "qwen" : null,
    selectedModel: generationMode === "model" ? "qwen-plus-marketing" : null,
    executedProvider: generationMode === "model" ? "qwen" : null,
    executedModel: generationMode === "model" ? "qwen-plus-marketing" : null,
    routeEnforced: generationMode === "model",
    routeMismatchReason: null,
    task,
    mode: "standard",
    routeReason: generationMode === "model" ? "Qwen route ready" : "Provider setup needed",
    estimatedCostTier: "low",
    fallbackReason: generationMode === "fallback" ? "Provider setup required" : null,
    generatedAt: new Date().toISOString(),
    output: generationMode === "model"
      ? {
        angle: `${platform} operational clarity`,
        hook: "Model hook: keep every horse record visible",
        subject: "Model email: organize the stable week",
        previewText: "Horse records, schedules, and documents in one workflow.",
        body: "Model copy: EquiProfile keeps horse health records, documents, schedules, and staff visibility organized.",
        cta: "Start your free trial: https://equiprofile.online/signup",
        hashtags: ["#equiprofile", "#stablemanagement"],
        visualPrompt: "EquiProfile product-aware stable workflow",
        reviewStatus: "needs_review",
      }
      : {},
    rawText: null,
    warnings: [],
    parserWarnings: [],
    providerStatus: generationMode === "model" ? "ready" : "setup_needed",
    reviewStatus: "needs_review",
  }),
}));

import {
  extractMarketingProductProfileFromHtml,
  getMarketingProductProfile,
  getSafeMarketingProductContext,
  upsertMarketingProductProfile,
} from "./modules/marketing/product-intelligence";
import {
  MarketingProductProfileSetupNeededError,
  composeSignupCampaignPackage,
  generateMarketingEmailCampaignPackage,
  generateMarketingPaidSocialAdPackage,
  generateMarketingSocialPostPackage,
} from "./modules/marketing/deliverable-composer";

const productProfile = {
  tenantId: "global",
  workspaceId: "default",
  hostAppId: "equiprofile",
  appName: "EquiProfile",
  domain: "equiprofile.online",
  landingPageUrl: "https://equiprofile.online",
  signupUrl: "https://equiprofile.online/signup",
  logoAssetId: null,
  brandColors: ["#1e3a5f", "#c5a55a"],
  targetAudiences: ["stable owners", "horse owners", "riding schools", "trainers", "yards", "equestrian businesses"],
  primaryOffer: "Free trial",
  pricingDetails: "Start a free trial",
  coreFeatures: ["horse health records", "document tracking", "stable management", "scheduling", "staff visibility"],
  benefits: ["keep stable operations organized", "keep horse health records visible", "coordinate schedules and staff"],
  painPointsSolved: ["scattered stable admin"],
  objections: [],
  proofPoints: ["Built for equestrian businesses"],
  differentiators: ["equine and stable management context in one operational platform"],
  forbiddenClaims: ["Do not invent customer counts."],
  toneOfVoice: ["professional", "helpful"],
  ctaLibrary: ["Start your free trial: https://equiprofile.online/signup"],
  platformPositioning: {},
  extractedSourceUrls: ["https://equiprofile.online"],
  candidateLogoUrls: ["https://equiprofile.online/logo.png"],
  candidateLogoAssetIds: [],
  missingInfo: [],
  sourceMode: "basic_fetch" as const,
  confidenceScore: 96,
  lastScrapedAt: null,
  confirmedAt: null,
};

const baseInput = {
  tenantId: "global",
  workspaceId: "default",
  hostAppId: "equiprofile",
  qualityMode: "standard" as const,
  goal: "Increase EquiProfile free-trial signups",
  audience: "stable owners",
  platforms: ["Facebook", "Instagram", "Email"],
  durationDays: 7,
  exportOnly: true,
  requireApproval: true,
  productProfile,
};

describe("PR64E product intelligence", () => {
  beforeEach(() => {
    storedRow = null;
    generationMode = "fallback";
  });

  it("extracts app name, audiences, CTA, and logo candidate from sample HTML", () => {
    const extracted = extractMarketingProductProfileFromHtml({
      hostAppId: "equiprofile",
      landingPageUrl: "https://equiprofile.online",
      html: `
        <html><head><title>EquiProfile | Stable management</title></head>
        <body>
          <img src="/logo.png" alt="EquiProfile logo">
          <h1>EquiProfile stable management for stable owners and riding schools</h1>
          <p>Track horse health records, documents, schedules and staff visibility.</p>
          <a href="/signup">Start your free trial</a>
        </body></html>
      `,
    });
    expect(extracted.profile.appName).toBe("EquiProfile");
    expect(extracted.profile.targetAudiences).toContain("stable owners");
    expect(extracted.profile.signupUrl).toBe("https://equiprofile.online/signup");
    expect(extracted.profile.candidateLogoUrls).toContain("https://equiprofile.online/logo.png");
  });

  it("persists and reloads a scoped product profile", async () => {
    await upsertMarketingProductProfile(productProfile);
    const reloaded = await getMarketingProductProfile(productProfile);
    expect(reloaded.status).toBe("ok");
    expect(reloaded.profile?.appName).toBe("EquiProfile");
    expect(reloaded.profile?.benefits).toContain("keep stable operations organized");
  });

  it("asks setup questions when a generic product profile is missing", async () => {
    const genericInput = { ...baseInput, hostAppId: "unknown-app", productProfile: undefined, packageType: "social_post" as const };
    await expect(generateMarketingSocialPostPackage(genericInput))
      .rejects.toBeInstanceOf(MarketingProductProfileSetupNeededError);
    const error = await generateMarketingSocialPostPackage(genericInput).catch((caught) => caught);
    expect(error.setupQuestions.length).toBeGreaterThanOrEqual(2);
    expect(error.setupQuestions.length).toBeLessThanOrEqual(4);
  });

  it("uses safe EquiProfile defaults when the stored profile is missing", async () => {
    const context = await getSafeMarketingProductContext({
      tenantId: "global",
      workspaceId: "default",
      hostAppId: "equiprofile",
    });
    expect(context.source).toBe("equiprofile_defaults");
    expect(context.profileReady).toBe(false);
    expect(context.profile?.appName).toBe("EquiProfile");
    expect(context.profile?.benefits).toContain("keep stable operations organized");
  });

  it("generates a truthful fallback signup campaign from EquiProfile defaults", async () => {
    const signup = await composeSignupCampaignPackage({ ...baseInput, productProfile: undefined, packageType: "signup_campaign" });
    expect(signup.textGeneratedByModel).toBe(false);
    expect(signup.fallbackUsed).toBe(true);
    expect(JSON.stringify(signup.captionPlan)).toContain("EquiProfile");
    expect(JSON.stringify(signup.captionPlan)).toContain("horse health records");
  });

  it("uses product benefits, offer, and CTA in deterministic fallbacks", async () => {
    const social = await generateMarketingSocialPostPackage({ ...baseInput, packageType: "social_post" });
    const ad = await generateMarketingPaidSocialAdPackage({ ...baseInput, packageType: "paid_social_ad" });
    const email = await generateMarketingEmailCampaignPackage({ ...baseInput, packageType: "email_campaign" });
    expect(JSON.stringify(social)).toContain("keep stable operations organized");
    expect(JSON.stringify(ad)).toContain("Free trial");
    expect(JSON.stringify(email)).toContain("https://equiprofile.online/signup");
  });

  it("builds a coherent signup campaign from app context, not generic stable-owner filler", async () => {
    const signup = await composeSignupCampaignPackage({ ...baseInput, packageType: "signup_campaign" });
    expect(JSON.stringify(signup.captionPlan)).toContain("EquiProfile");
    expect(JSON.stringify(signup.captionPlan)).toContain("horse health records");
    expect(JSON.stringify(signup.captionPlan)).not.toContain("Stable-owner conversion message");
  });

  it("sets textGeneratedByModel only when model output is used", async () => {
    generationMode = "model";
    const result = await generateMarketingSocialPostPackage({ ...baseInput, packageType: "social_post" });
    expect(result.textGeneratedByModel).toBe(true);
    expect(result.fallbackUsed).toBe(false);
    expect(JSON.stringify(result.captionPlan)).toContain("Model copy");
  });

  it("sets fallbackUsed only when deterministic fallback is used", async () => {
    const result = await generateMarketingSocialPostPackage({ ...baseInput, packageType: "social_post" });
    expect(result.textGeneratedByModel).toBe(false);
    expect(result.fallbackUsed).toBe(true);
  });
});

describe("PR64E frontend product setup", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const appSource = fs.readFileSync(path.join(root, "client/src/components/marketing/app/TheMarketingApp.tsx"), "utf8");
  const profileCardSource = fs.readFileSync(path.join(root, "client/src/components/marketing/app/workspace/ProductContextPanel.tsx"), "utf8");

  it("shows product setup card when profile is missing or low confidence", () => {
    expect(appSource).toContain("<ProductContextPanel");
    expect(profileCardSource).toContain("Let’s learn what we’re marketing.");
    expect(profileCardSource).toContain("Scan Site");
    expect(profileCardSource).toContain("Confirm Product");
  });

  it("keeps raw scrape diagnostics out of the main Studio", () => {
    expect(appSource).not.toContain("rawScrapeSummary");
    expect(profileCardSource).not.toContain("rawScrapeSummary");
    expect(fs.readFileSync(path.join(root, "client/src/components/marketing/app/MarketingAppSettings.tsx"), "utf8")).toContain("Admin Support");
  });
});
