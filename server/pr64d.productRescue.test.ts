import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("./modules/growth-engine", () => ({
  createMarketingCampaignItemRecord: async () => Math.floor(Math.random() * 10000) + 1,
  createMarketingCampaignRecord: async () => 1,
  createMarketingScheduleDraftRecord: async () => Math.floor(Math.random() * 10000) + 1,
  listMarketingCampaignItemRecords: async () => [],
}));

vi.mock("./modules/marketing/qa-engine/marketingReviewStore", () => ({
  createMarketingReviewRecord: async () => Math.floor(Math.random() * 10000) + 1,
}));

vi.mock("./modules/marketing/provider-capabilities", () => ({
  defaultWorkspaceBudgetPolicy: () => ({}),
  resolveMarketingProviderRoute: async () => ({ status: "ready", reason: null, selected: { provider: "openai", modelId: "gpt-4o" } }),
}));

vi.mock("./modules/marketing/image-generation", () => ({
  generateMarketingImageAsset: async () => ({ status: "setup_needed", assetId: null, publicUrl: null, setupNeeded: [], reason: "no provider" }),
}));

vi.mock("./modules/marketing/studio-generation", () => ({
  generateMarketingStudioScript: async () => ({
    status: "setup_needed",
    script: "",
    scenePlan: [],
    requiredAssets: [],
    cta: "Start free trial",
    voiceoverScript: "",
    platformNotes: [],
    providerRouteMetadata: {
      reason: "no provider",
      fallback_used: true,
      provider: null,
      modelId: null,
    },
  }),
}));

import {
  UnsupportedDeliverablePackageTypeError,
  composeMarketingDeliverablePackage,
  composeSignupCampaignPackage,
  generateMarketingEmailCampaignPackage,
  generateMarketingPaidSocialAdPackage,
  generateMarketingSocialPostPackage,
  generateMarketingWeeklyContentPackPackage,
} from "./modules/marketing/deliverable-composer";

const repoRoot = path.resolve(import.meta.dirname, "..");
const marketingAppSource = fs.readFileSync(
  path.join(repoRoot, "client/src/components/marketing/app/TheMarketingApp.tsx"),
  "utf8",
);

const BACKEND_TERMS_FORBIDDEN_IN_PRIMARY_UI = [
  "Ready now",
  "Package / plan only",
  "Needs setup",
  "Future / not wired",
] as const;

const BACKEND_LABELS_FORBIDDEN_IN_BUTTONS = [
  ">Output:",
  ">Expected:",
] as const;

describe("PR64D frontend — diagnostic grid removed from primary Studio", () => {
  it("creation menu does not render diagnostic group headers", () => {
    const menuStart = marketingAppSource.indexOf("creation-menu");
    const menuEnd = marketingAppSource.indexOf("Center: Composer", menuStart);
    expect(menuStart).toBeGreaterThan(0);
    const menuSection = marketingAppSource.slice(menuStart, menuEnd > 0 ? menuEnd : menuStart + 5000);

    for (const term of BACKEND_TERMS_FORBIDDEN_IN_PRIMARY_UI) {
      expect(menuSection, `Creation menu must not render \"${term}\" as a section header`).not.toContain(`>${term}<`);
    }
  });

  it('creation menu buttons do not show "Output:" or "Expected:" labels', () => {
    const menuStart = marketingAppSource.indexOf("creation-menu");
    const menuEnd = marketingAppSource.indexOf("Center: Composer", menuStart);
    const menuSection = marketingAppSource.slice(menuStart, menuEnd > 0 ? menuEnd : menuStart + 5000);

    for (const label of BACKEND_LABELS_FORBIDDEN_IN_BUTTONS) {
      expect(menuSection, `Creation menu must not render \"${label}\" label`).not.toContain(label);
    }
  });

  it("future capabilities are not rendered as active creation menu items", () => {
    const menuStart = marketingAppSource.indexOf("creation-menu");
    const detailsIdx = marketingAppSource.indexOf("<details", menuStart);
    const futureLabelIdx = marketingAppSource.indexOf('"Future / not wired"', menuStart);

    if (futureLabelIdx > 0 && futureLabelIdx < marketingAppSource.indexOf("Center: Composer", menuStart)) {
      expect(detailsIdx).toBeGreaterThan(0);
      expect(detailsIdx).toBeLessThan(futureLabelIdx);
    }
  });

  it("Plan campaign button is present in the composer", () => {
    expect(marketingAppSource).toContain("Plan campaign");
    expect(marketingAppSource).toContain("handlePlanCampaign");
  });

  it("campaign plan state is wired up", () => {
    expect(marketingAppSource).toContain("campaignPlan");
    expect(marketingAppSource).toContain("setCampaignPlan");
  });
});

const baseInput = {
  tenantId: "test-tenant",
  workspaceId: "test-workspace",
  hostAppId: "test-app",
  qualityMode: "standard" as const,
  goal: "Get stable owners to sign up for EquiProfile",
  audience: "stable owners",
  platforms: ["Facebook", "Instagram"],
  durationDays: 7,
  exportOnly: true,
  requireApproval: true,
  productProfile: {
    tenantId: "test-tenant",
    workspaceId: "test-workspace",
    hostAppId: "test-app",
    appName: "EquiProfile",
    domain: "equiprofile.online",
    landingPageUrl: "https://equiprofile.online",
    signupUrl: "https://equiprofile.online/signup",
    logoAssetId: null,
    brandColors: ["#1e3a5f", "#c5a55a"],
    targetAudiences: ["stable owners", "horse owners", "riding schools", "trainers", "yards", "equestrian businesses"],
    primaryOffer: "Free trial",
    pricingDetails: "Free trial",
    coreFeatures: ["horse health records", "document tracking", "stable management", "scheduling", "staff visibility"],
    benefits: ["keep stable operations organized", "keep horse health records visible", "coordinate schedules and staff"],
    painPointsSolved: ["scattered stable admin"],
    objections: [],
    proofPoints: [],
    differentiators: ["equine and stable management context in one operational platform"],
    forbiddenClaims: ["Do not invent proof."],
    toneOfVoice: ["professional", "helpful"],
    ctaLibrary: ["Start your free trial: https://equiprofile.online/signup"],
    platformPositioning: {},
    extractedSourceUrls: ["https://equiprofile.online"],
    candidateLogoUrls: [],
    candidateLogoAssetIds: [],
    missingInfo: [],
    sourceMode: "manual" as const,
    confidenceScore: 90,
    lastScrapedAt: null,
    confirmedAt: null,
  },
};

describe("PR64D backend — social_post package", () => {
  it("creates 3-5 platform-specific posts with hook, caption, CTA", async () => {
    const result = await generateMarketingSocialPostPackage({ ...baseInput, packageType: "social_post" });
    expect(result.packageType).toBe("social_post");
    expect(result.hooks.length).toBeGreaterThanOrEqual(3);
    expect(result.hooks.length).toBeLessThanOrEqual(5);
    expect(result.adCopy.length).toBeGreaterThanOrEqual(3);
    expect(result.cta).toBeTruthy();
    const posts = (result.captionPlan as any).posts;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThanOrEqual(3);
    expect(posts[0]).toHaveProperty("hook");
    expect(posts[0]).toHaveProperty("caption");
    expect(posts[0]).toHaveProperty("cta");
  });

  it("social_post creates campaign items on persist", async () => {
    const result = await generateMarketingSocialPostPackage({ ...baseInput, packageType: "social_post" });
    expect(result.campaignItems.length).toBeGreaterThan(0);
  });
});

describe("PR64D backend — paid_social_ad package", () => {
  it("creates 3 ad variants with primary text, headline, description, CTA, audience angle, offer note", async () => {
    const result = await generateMarketingPaidSocialAdPackage({ ...baseInput, packageType: "paid_social_ad" });
    expect(result.packageType).toBe("paid_social_ad");
    const variants = (result.captionPlan as any).adVariants;
    expect(Array.isArray(variants)).toBe(true);
    expect(variants.length).toBe(3);
    for (const variant of variants) {
      expect(variant).toHaveProperty("primaryText");
      expect(variant).toHaveProperty("headline");
      expect(variant).toHaveProperty("description");
      expect(variant).toHaveProperty("cta");
      expect(variant).toHaveProperty("audienceAngle");
      expect(variant).toHaveProperty("offerNote");
    }
  });

  it("paid_social_ad creates campaign items on persist", async () => {
    const result = await generateMarketingPaidSocialAdPackage({ ...baseInput, packageType: "paid_social_ad" });
    expect(result.campaignItems.length).toBeGreaterThan(0);
  });
});

describe("PR64D backend — email_campaign package", () => {
  it("creates 3-5 emails with subject, preview text, body, CTA, timing suggestion, compliance note", async () => {
    const result = await generateMarketingEmailCampaignPackage({ ...baseInput, packageType: "email_campaign", platforms: ["Email"] });
    expect(result.packageType).toBe("email_campaign");
    const emails = (result.captionPlan as any).emails;
    expect(Array.isArray(emails)).toBe(true);
    expect(emails.length).toBeGreaterThanOrEqual(3);
    for (const email of emails) {
      expect(email).toHaveProperty("subject");
      expect(email).toHaveProperty("previewText");
      expect(email).toHaveProperty("body");
      expect(email).toHaveProperty("cta");
      expect(email).toHaveProperty("timingSuggestion");
      expect(email).toHaveProperty("complianceNote");
    }
  });

  it("email_campaign platform is Email", async () => {
    const result = await generateMarketingEmailCampaignPackage({ ...baseInput, packageType: "email_campaign", platforms: ["Email"] });
    expect(result.platforms).toContain("Email");
  });
});

describe("PR64D backend — weekly_content_pack package", () => {
  it("creates 5-7 day plan with day/channel/platform/body/CTA per item", async () => {
    const result = await generateMarketingWeeklyContentPackPackage({ ...baseInput, packageType: "weekly_content_pack" });
    expect(result.packageType).toBe("weekly_content_pack");
    const dayPlan = (result.captionPlan as any).dayPlan;
    expect(Array.isArray(dayPlan)).toBe(true);
    expect(dayPlan.length).toBeGreaterThanOrEqual(5);
    expect(dayPlan.length).toBeLessThanOrEqual(7);
    for (const day of dayPlan) {
      expect(day).toHaveProperty("day");
      expect(day).toHaveProperty("channel");
      expect(day).toHaveProperty("platform");
      expect(day).toHaveProperty("body");
      expect(day).toHaveProperty("cta");
    }
  });
});

describe("PR64D backend — signup_campaign package", () => {
  it("creates social and email outputs", async () => {
    const result = await composeSignupCampaignPackage({ ...baseInput, packageType: "signup_campaign" });
    const itemTypes = result.campaignItems.map((item) => String((item as any).type));
    expect(itemTypes.some((type) => type === "social_post" || type === "ad_copy" || type === "campaign_plan")).toBe(true);
    const emailItem = result.campaignItems.find((item) => String((item as any).type) === "email");
    expect(emailItem).toBeDefined();
  });

  it("signup_campaign does not include blog item by default", async () => {
    const result = await composeSignupCampaignPackage({ ...baseInput, packageType: "signup_campaign" });
    const itemTypes = result.campaignItems.map((item) => String((item as any).type));
    expect(itemTypes).not.toContain("blog");
  });
});

describe("PR64D backend — unsupported package type", () => {
  it("throws UnsupportedDeliverablePackageTypeError for unknown package types", async () => {
    await expect(
      composeMarketingDeliverablePackage({ ...baseInput, packageType: "unknown_type" as any }),
    ).rejects.toBeInstanceOf(UnsupportedDeliverablePackageTypeError);
  });

  it("does not silently fall back to signup_campaign for unsupported types", async () => {
    const error = await composeMarketingDeliverablePackage({
      ...baseInput,
      packageType: "random_unsupported" as any,
    }).catch((caught) => caught);
    expect(error).toBeInstanceOf(UnsupportedDeliverablePackageTypeError);
    expect((error as UnsupportedDeliverablePackageTypeError).packageType).toBe("random_unsupported");
  });
});
