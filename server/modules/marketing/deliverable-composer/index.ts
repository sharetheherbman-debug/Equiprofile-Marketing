import { nanoid } from "nanoid";
import {
  createMarketingCampaignItemRecord,
  createMarketingCampaignRecord,
  createMarketingScheduleDraftRecord,
  listMarketingCampaignItemRecords,
} from "../../growth-engine";
import { createMarketingReviewRecord } from "../qa-engine/marketingReviewStore";
import { defaultWorkspaceBudgetPolicy, resolveMarketingProviderRoute } from "../provider-capabilities";
import { generateMarketingImageAsset } from "../image-generation";
import { generateMarketingStudioScript } from "../studio-generation";
import { getMarketingBrandMemory } from "../brand-memory";
import { executeMarketingModelTask } from "../model-execution";
import type { MarketingModelExecutionOutput, MarketingModelTask } from "../model-execution";
import {
  getMarketingProductProfile,
  isMarketingProductProfileReady,
  productProfileSetupQuestions,
  type MarketingProductProfileRecord,
} from "../product-intelligence";

export type MarketingDeliverablePackageType =
  | "image_ad"
  | "social_ad"
  | "social_post"
  | "paid_social_ad"
  | "video_ad_30s"
  | "assembled_video_3m"
  | "signup_campaign"
  | "weekly_content_pack"
  | "email_campaign"
  | "blog_seo";

export type MarketingDeliverablePackage = {
  packageId: string;
  campaignId: number;
  packageType: MarketingDeliverablePackageType;
  goal: string;
  audience: string;
  platforms: string[];
  status: "draft" | "partial" | "completed";
  generationSource: "model" | "fallback" | "hybrid";
  textGeneratedByModel: boolean;
  mediaGeneratedByModel: boolean;
  fallbackUsed: boolean;
  setupNeeded: boolean;
  blockers: string[];
  strategy: string;
  hooks: string[];
  adCopy: string[];
  cta: string;
  script: string;
  scenePlan: Array<Record<string, unknown>>;
  visualPrompts: string[];
  mediaRequirements: string[];
  captionPlan: Record<string, unknown>;
  voiceoverPlan: Record<string, unknown>;
  musicPlan: Record<string, unknown>;
  brandOverlayPlan: Record<string, unknown>;
  reviewItems: Array<Record<string, unknown>>;
  exportPack: Record<string, unknown>;
  scheduleDrafts: Array<Record<string, unknown>>;
  mediaJobs: Array<Record<string, unknown>>;
  campaignItems: Array<Record<string, unknown>>;
};

export type ComposeMarketingDeliverableInput = {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  goal: string;
  audience: string;
  platforms: string[];
  packageType: MarketingDeliverablePackageType;
  campaignId?: number;
  durationSeconds?: number;
  durationDays?: number;
  targetOutcome?: string;
  exportOnly?: boolean;
  requireApproval?: boolean;
  productProfile?: MarketingProductProfileRecord;
};

export class UnsupportedDeliverablePackageTypeError extends Error {
  readonly packageType: string;

  constructor(packageType: string) {
    super(`Unsupported deliverable package type: ${packageType}`);
    this.name = "UnsupportedDeliverablePackageTypeError";
    this.packageType = packageType;
  }
}

export class MarketingProductProfileSetupNeededError extends Error {
  readonly setupQuestions: string[];

  constructor(setupQuestions: string[]) {
    super(`Let's learn what we're marketing first. ${setupQuestions.join(" ")}`);
    this.name = "MarketingProductProfileSetupNeededError";
    this.setupQuestions = setupQuestions.slice(0, 4);
  }
}

type ProductGenerationContext = {
  profile: MarketingProductProfileRecord;
  brandMemory: Record<string, unknown> | null;
  brandKit: Record<string, unknown>;
  primaryCta: string;
};

function fallbackHooks(goal: string, audience: string, profile?: MarketingProductProfileRecord) {
  if (profile) {
    const benefit = profile.benefits[0] ?? profile.coreFeatures[0] ?? "make daily operations clearer";
    const feature = profile.coreFeatures[0] ?? "product workflows";
    return [
      `${audience}: ${profile.appName} helps you ${benefit}`,
      `Bring ${feature} into one practical workflow with ${profile.appName}`,
      `${profile.appName} gives ${audience} a clearer path to ${goal.toLowerCase()}`,
    ];
  }
  return [
    `${audience}: stop losing time to manual updates`,
    `Get more from every stable with ${goal.toLowerCase()}`,
    "From admin chaos to consistent growth in one flow",
  ];
}

function primaryProductCta(profile: MarketingProductProfileRecord) {
  return profile.ctaLibrary[0]
    ?? (profile.signupUrl ? `Start your free trial: ${profile.signupUrl}` : null)
    ?? "Learn more";
}

async function requireProductGenerationContext(input: ComposeMarketingDeliverableInput): Promise<ProductGenerationContext> {
  const resolved = input.productProfile
    ? { profile: input.productProfile }
    : await getMarketingProductProfile(input);
  if (!resolved.profile || !isMarketingProductProfileReady(resolved.profile)) {
    throw new MarketingProductProfileSetupNeededError(productProfileSetupQuestions(resolved.profile));
  }
  const memory = await getMarketingBrandMemory(input).catch(() => ({ status: "setup_needed" as const, memory: null }));
  const profile = resolved.profile;
  const primaryCta = primaryProductCta(profile);
  return {
    profile,
    brandMemory: memory.memory as Record<string, unknown> | null,
    primaryCta,
    brandKit: {
      brandName: profile.appName,
      domain: profile.domain ?? "",
      primaryCta,
      toneOfVoice: profile.toneOfVoice.join(", "),
      logoAssetId: profile.logoAssetId,
      brandColors: profile.brandColors,
      brandMemory: memory.memory ?? null,
    },
  };
}

function asText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

async function executeProductCopy(input: ComposeMarketingDeliverableInput, context: ProductGenerationContext, options: {
  task?: MarketingModelTask;
  platform: string;
  contentType: string;
  originalPrompt?: string;
}) {
  const profile = context.profile;
  return executeMarketingModelTask({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    mode: input.qualityMode,
    task: options.task ?? "platform_copywriting",
    brandKit: context.brandKit,
    campaignBrief: {
      campaignName: `${profile.appName} ${input.packageType}`,
      goal: input.goal,
      audience: input.audience,
      offer: profile.primaryOffer,
      primaryCta: context.primaryCta,
      productProfile: {
        appName: profile.appName,
        category: profile.differentiators[0] ?? "",
        coreFeatures: profile.coreFeatures,
        benefits: profile.benefits,
        painPointsSolved: profile.painPointsSolved,
        objections: profile.objections,
        proofPoints: profile.proofPoints,
        differentiators: profile.differentiators,
        forbiddenClaims: profile.forbiddenClaims,
        toneOfVoice: profile.toneOfVoice,
        signupUrl: profile.signupUrl,
        platformPositioning: profile.platformPositioning[options.platform] ?? "",
      },
      brandMemory: context.brandMemory,
    },
    platform: options.platform,
    contentType: options.contentType,
    audience: input.audience,
    offer: profile.primaryOffer ?? "",
    originalPrompt: options.originalPrompt ?? input.goal,
    constraints: [
      `Use only product facts from the supplied product profile for ${profile.appName}.`,
      `Use this CTA exactly where appropriate: ${context.primaryCta}`,
      ...profile.forbiddenClaims,
    ],
  });
}

function generationTruth(results: MarketingModelExecutionOutput[]) {
  const textGeneratedByModel = results.some((result) => result.generationMode === "model");
  const fallbackUsed = results.some((result) => result.generationMode === "fallback");
  const blockers = Array.from(new Set(results
    .filter((result) => result.generationMode === "fallback" && result.providerStatus !== "ready")
    .map((result) => result.providerStatus === "setup_needed"
      ? "AI copy provider setup is needed. Configure Qwen or Hugging Face for Standard copy, or GenX for Elite copy."
      : "The configured AI copy provider is temporarily unavailable; product-aware fallback copy was used.")));
  return { textGeneratedByModel, fallbackUsed, blockers };
}

function productVisualPrompt(profile: MarketingProductProfileRecord, platform: string, benefit: string) {
  return `${platform} creative for ${profile.appName}: show ${benefit}. Keep the concept grounded in ${profile.coreFeatures.slice(0, 3).join(", ")}. Use confirmed brand colors ${profile.brandColors.join(", ") || "from Brand Kit"} and reserve logo-safe space${profile.logoAssetId ? ` for logo asset ${profile.logoAssetId}` : ""}.`;
}

function normalizeScenes(input: Array<Record<string, unknown>>, durationSeconds: number, min: number, max: number) {
  const scenes = [...input];
  if (scenes.length > max) return scenes.slice(0, max);
  if (scenes.length >= min) return scenes;

  const needed = min - scenes.length;
  const baseDuration = Math.max(8, Math.floor(durationSeconds / min));
  for (let index = 0; index < needed; index += 1) {
    const order = scenes.length + 1;
    scenes.push({
      id: `scene-${order}`,
      order,
      durationSeconds: baseDuration,
      narration: `Supporting scene ${order}`,
      visualPrompt: `Scene ${order} for ${durationSeconds}-second package`,
      sourceType: "stock",
      mediaSlot: "stock_media",
    });
  }
  return scenes;
}

async function ensureCampaignId(input: ComposeMarketingDeliverableInput) {
  if (input.campaignId) return input.campaignId;
  return createMarketingCampaignRecord({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    name: `PR62C ${input.packageType} - ${input.goal.slice(0, 80)}`,
    goal: input.goal,
    audience: input.audience,
    channels: input.platforms,
    durationDays: input.durationDays ?? 30,
    status: "draft",
  });
}

async function getTextRouteStatus(input: ComposeMarketingDeliverableInput) {
  const route = await resolveMarketingProviderRoute({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    task: "campaign_strategy",
    policy: defaultWorkspaceBudgetPolicy(input.qualityMode),
  });
  return {
    setupNeeded: route.status !== "ready",
    reason: route.reason ?? "Text generation provider route is not ready.",
    provider: route.selected?.provider ?? null,
    model: route.selected?.modelId ?? null,
  };
}

export function resolveDeliverablePackageStatus(input: {
  setupNeeded: boolean;
  blockers: string[];
  packageType: MarketingDeliverablePackageType;
  requireApproval?: boolean;
  hasPlayableMedia: boolean;
  hasRenderedVideo: boolean;
}) {
  if (input.setupNeeded || input.blockers.length > 0) return "partial" as const;
  if (input.requireApproval) return "draft" as const;

  if (input.packageType === "assembled_video_3m") {
    return input.hasRenderedVideo ? "completed" as const : "draft" as const;
  }

  if (input.packageType === "video_ad_30s") {
    return input.hasPlayableMedia ? "completed" as const : "draft" as const;
  }

  if (input.packageType === "signup_campaign" || input.packageType === "image_ad") {
    return "draft" as const;
  }

  return input.hasPlayableMedia ? "completed" as const : "draft" as const;
}

export function resolveGenerationSource(input: {
  textGeneratedByModel: boolean;
  mediaGeneratedByModel: boolean;
  fallbackUsed: boolean;
}): "model" | "fallback" | "hybrid" {
  if (input.fallbackUsed && (input.textGeneratedByModel || input.mediaGeneratedByModel)) return "hybrid";
  if (input.textGeneratedByModel || input.mediaGeneratedByModel) return "model";
  return "fallback";
}

export async function composeImageAdPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const textRoute = await getTextRouteStatus(input);
  const hooks = fallbackHooks(input.goal, input.audience, productContext.profile);
  const adCopy = [
    `${hooks[0]}. ${productContext.profile.appName} helps with ${productContext.profile.benefits[0]}.`,
    `${hooks[1]}. ${productContext.primaryCta}`,
  ];
  const imageResult = await generateMarketingImageAsset({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    prompt: `${input.goal}. Product: ${productContext.profile.appName}. Features: ${productContext.profile.coreFeatures.join(", ")}. Benefits: ${productContext.profile.benefits.join(", ")}. Audience: ${input.audience}. Platform: ${input.platforms.join(", ")}. Use logo-safe space and brand colors: ${productContext.profile.brandColors.join(", ")}.`,
    platform: input.platforms[0],
    qualityMode: input.qualityMode,
    campaignId,
  }).catch(() => null);

  const setupBlockers = [
    ...(textRoute.setupNeeded ? [textRoute.reason] : []),
    ...(imageResult?.status === "setup_needed" ? imageResult.setupNeeded : []),
  ];
  const mediaGeneratedByModel = imageResult?.status === "completed" && Boolean(imageResult.publicUrl ?? imageResult.assetId ?? imageResult.jobId);
  const textGeneratedByModel = false;
  const fallbackUsed = true;
  const generationSource = mediaGeneratedByModel && !textRoute.setupNeeded
    ? "hybrid"
    : "fallback";
  const status = resolveDeliverablePackageStatus({
    setupNeeded: setupBlockers.length > 0,
    blockers: setupBlockers,
    packageType: "image_ad",
    requireApproval: input.requireApproval,
    hasPlayableMedia: mediaGeneratedByModel,
    hasRenderedVideo: false,
  });

  const mediaJobs = imageResult
    ? [{
      kind: "image_generation",
      status: imageResult.status,
      assetId: imageResult.assetId,
      jobId: imageResult.jobId,
      publicUrl: imageResult.publicUrl,
      provider: imageResult.provider,
      model: imageResult.model,
      setupNeeded: imageResult.setupNeeded,
    }]
    : [];

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "image_ad",
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    status,
    generationSource,
    textGeneratedByModel,
    mediaGeneratedByModel,
    fallbackUsed,
    setupNeeded: setupBlockers.length > 0,
    blockers: setupBlockers,
    strategy: `Image-first ad package for ${input.audience} focused on ${input.goal}.`,
    hooks,
    adCopy,
    cta: productContext.primaryCta,
    script: "",
    scenePlan: [],
    visualPrompts: [productVisualPrompt(productContext.profile, input.platforms[0] ?? "Social", productContext.profile.benefits[0] ?? "the primary product benefit")],
    mediaRequirements: ["Square image 1:1", "Brand-safe product screenshot", "Logo lockup"],
    captionPlan: {
      primary: "Clear opener + proof + CTA",
      variants: input.platforms.map((platform) => ({ platform, tone: "direct_response" })),
    },
    voiceoverPlan: {},
    musicPlan: {},
    brandOverlayPlan: { logoPlacement: "top-right", ctaBadge: "Start free trial" },
    reviewItems: [],
    exportPack: {},
    scheduleDrafts: [],
    mediaJobs,
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: textRoute.provider,
    model: textRoute.model,
  });
}

export async function composeThirtySecondAdPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const durationSeconds = input.durationSeconds ?? 30;
  const scriptPlan = await generateMarketingStudioScript({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    qualityMode: input.qualityMode,
    contentType: "30_second_ad",
    platform: input.platforms[0],
    originalUserPrompt: input.goal,
    brief: `Goal: ${input.goal}. Audience: ${input.audience}. Product: ${productContext.profile.appName}. Features: ${productContext.profile.coreFeatures.join(", ")}. Benefits: ${productContext.profile.benefits.join(", ")}. Offer: ${productContext.profile.primaryOffer ?? "not configured"}. CTA: ${productContext.primaryCta}.`,
    audience: input.audience,
    goal: input.goal,
    durationTargetSeconds: durationSeconds,
  });

  const scenes = normalizeScenes(scriptPlan.scenePlan as unknown as Array<Record<string, unknown>>, durationSeconds, 3, 5);
  const blockers = scriptPlan.status === "setup_needed" || scriptPlan.status === "provider_unavailable"
    ? [scriptPlan.providerRouteMetadata.reason ?? "Script provider setup is needed."]
    : [];
  const textGeneratedByModel = scriptPlan.status === "generated" && !scriptPlan.providerRouteMetadata.fallback_used;
  const mediaGeneratedByModel = false;
  const fallbackUsed = true;
  const generationSource = resolveGenerationSource({
    textGeneratedByModel,
    mediaGeneratedByModel,
    fallbackUsed,
  });
  const status = resolveDeliverablePackageStatus({
    setupNeeded: blockers.length > 0,
    blockers,
    packageType: "video_ad_30s",
    requireApproval: input.requireApproval,
    hasPlayableMedia: false,
    hasRenderedVideo: false,
  });

  const hooks = fallbackHooks(input.goal, input.audience, productContext.profile);
  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "video_ad_30s",
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    status,
    generationSource,
    textGeneratedByModel,
    mediaGeneratedByModel,
    fallbackUsed,
    setupNeeded: blockers.length > 0,
    blockers,
    strategy: `30-second conversion ad tailored for ${input.platforms.join(", ")}.`,
    hooks,
    adCopy: [
      `${hooks[0]}. ${productContext.profile.appName} brings ${productContext.profile.coreFeatures.slice(0, 3).join(", ")} into one practical workflow.`,
      "Stop juggling tools and start converting interested owners today.",
    ],
    cta: scriptPlan.cta || productContext.primaryCta,
    script: scriptPlan.script,
    scenePlan: scenes,
    visualPrompts: scenes.map((scene) => String(scene.visualPrompt ?? "")),
    mediaRequirements: scriptPlan.requiredAssets.length ? scriptPlan.requiredAssets : ["Short b-roll clips", "Brand product screenshot", "CTA end card"],
    captionPlan: { mode: "short_ad", notes: scriptPlan.platformNotes },
    voiceoverPlan: { script: scriptPlan.voiceoverScript, durationSeconds },
    musicPlan: { mood: "uplifting", ducking: true },
    brandOverlayPlan: { logoPlacement: "bottom-right", ctaTag: "Free trial" },
    reviewItems: [],
    exportPack: {},
    scheduleDrafts: [],
    mediaJobs: [],
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: scriptPlan.providerRouteMetadata.provider,
    model: scriptPlan.providerRouteMetadata.modelId,
    durationSeconds,
  });
}

export async function composeAssembledVideoPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const durationSeconds = input.durationSeconds ?? 180;
  const scriptPlan = await generateMarketingStudioScript({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    qualityMode: input.qualityMode,
    contentType: "assembled_video_3m",
    platform: input.platforms[0] ?? "YouTube",
    originalUserPrompt: input.goal,
    brief: `Build an assembled 3-minute marketing video package for ${input.audience}. Product: ${productContext.profile.appName}. Features: ${productContext.profile.coreFeatures.join(", ")}. Benefits: ${productContext.profile.benefits.join(", ")}. Offer: ${productContext.profile.primaryOffer ?? "not configured"}. CTA: ${productContext.primaryCta}.`,
    audience: input.audience,
    goal: input.goal,
    durationTargetSeconds: durationSeconds,
  });

  const scenes: Array<Record<string, unknown>> = normalizeScenes(scriptPlan.scenePlan as unknown as Array<Record<string, unknown>>, durationSeconds, 8, 15)
    .map((rawScene, index) => {
      const scene = rawScene as Record<string, unknown>;
      return {
        ...scene,
        sceneIndex: index + 1,
        mediaSlot: scene.mediaSlot ?? ["stock_media", "generated_image", "generated_clip", "avatar_talking_head", "screen_demo"][index % 5],
      };
    });

  const totalDuration = scenes.reduce((sum, scene) => sum + Number(scene.durationSeconds ?? 0), 0);
  const blockers = scriptPlan.status === "setup_needed" || scriptPlan.status === "provider_unavailable"
    ? [scriptPlan.providerRouteMetadata.reason ?? "Video planning model route is not configured."]
    : [];
  const textGeneratedByModel = scriptPlan.status === "generated" && !scriptPlan.providerRouteMetadata.fallback_used;
  const mediaGeneratedByModel = false;
  const fallbackUsed = true;
  const generationSource = resolveGenerationSource({
    textGeneratedByModel,
    mediaGeneratedByModel,
    fallbackUsed,
  });
  const status = resolveDeliverablePackageStatus({
    setupNeeded: blockers.length > 0,
    blockers,
    packageType: "assembled_video_3m",
    requireApproval: input.requireApproval,
    hasPlayableMedia: false,
    hasRenderedVideo: false,
  });

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "assembled_video_3m",
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    status,
    generationSource,
    textGeneratedByModel,
    mediaGeneratedByModel,
    fallbackUsed,
    setupNeeded: blockers.length > 0,
    blockers,
    strategy: `Assembled-video package with timeline, media slots, voiceover and export readiness for ${input.platforms[0] ?? "YouTube"}.`,
    hooks: fallbackHooks(input.goal, input.audience, productContext.profile),
    adCopy: [],
    cta: scriptPlan.cta || productContext.primaryCta,
    script: scriptPlan.script,
    scenePlan: scenes,
    visualPrompts: scenes.map((scene) => String(scene.visualPrompt ?? "")),
    mediaRequirements: [
      "Stock b-roll per scene",
      "Generated image options",
      "Screen/demo captures",
      "Brand end card",
    ],
    captionPlan: { style: "burned_and_srt", language: "en", perScene: true },
    voiceoverPlan: { script: scriptPlan.voiceoverScript, narrationMode: "single_voice", durationSeconds },
    musicPlan: { style: "cinematic_light", licenseStatus: "setup_needed_until_provider_ready" },
    brandOverlayPlan: { lowerThird: true, watermark: true, closingCta: true },
    reviewItems: [],
    exportPack: {
      renderStatus: "not_rendered",
      renderReadiness: blockers.length ? "setup_needed" : "ready_for_review",
      durationSecondsTarget: durationSeconds,
      durationSecondsPlanned: totalDuration,
    },
    scheduleDrafts: [],
    mediaJobs: [],
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: scriptPlan.providerRouteMetadata.provider,
    model: scriptPlan.providerRouteMetadata.modelId,
    durationSeconds,
  });
}

export async function composeSignupCampaignPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const durationDays = Math.min(7, Math.max(7, input.durationDays ?? 7));
  const platforms = input.platforms.length ? input.platforms : ["Facebook", "Instagram", "Email"];
  const dayTemplates = Array.from({ length: durationDays }).map((_, index) => {
    const day = index + 1;
    const isEmail = day === 2 || day === 5 || day === 7;
    return {
      day,
      isEmail,
      platform: isEmail ? "Email" : platforms.filter((platform) => platform !== "Email")[index % Math.max(1, platforms.filter((platform) => platform !== "Email").length)] ?? "Facebook",
    };
  });
  const results = await Promise.all(dayTemplates.map((day) => executeProductCopy(input, productContext, {
    task: day.isEmail ? "email_generation" : "platform_copywriting",
    platform: day.platform,
    contentType: `signup_campaign day_${day.day} ${day.isEmail ? "email" : "social_post"}`,
  })));
  const hooks = fallbackHooks(input.goal, input.audience, productContext.profile);
  const dayPlan = dayTemplates.map((day, index) => {
    const benefit = productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? "make operations clearer";
    return {
      day: day.day,
      platform: day.platform,
      channel: day.isEmail ? "email" : "social",
      subject: day.isEmail ? asText(results[index]?.output.subject, `${productContext.profile.appName}: ${benefit}`) : undefined,
      hook: asText(results[index]?.output.hook, hooks[index % hooks.length]),
      body: asText(results[index]?.output.body, `${productContext.profile.appName} helps ${input.audience} ${benefit}. ${productContext.primaryCta}`),
      cta: asText(results[index]?.output.cta, productContext.primaryCta),
      proofNote: productContext.profile.proofPoints[0] ?? "Add confirmed proof before publishing.",
      offerNote: productContext.profile.primaryOffer ?? "Offer details require confirmation.",
    };
  });
  const socialPosts = dayPlan.filter((day) => day.channel === "social");
  const emails = dayPlan.filter((day) => day.channel === "email");
  const truth = generationTruth(results);

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "signup_campaign",
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    status: resolveDeliverablePackageStatus({
      setupNeeded: truth.blockers.length > 0,
      blockers: truth.blockers,
      packageType: "signup_campaign",
      requireApproval: input.requireApproval,
      hasPlayableMedia: false,
      hasRenderedVideo: false,
    }),
    generationSource: resolveGenerationSource({ textGeneratedByModel: truth.textGeneratedByModel, mediaGeneratedByModel: false, fallbackUsed: truth.fallbackUsed }),
    textGeneratedByModel: truth.textGeneratedByModel,
    mediaGeneratedByModel: false,
    fallbackUsed: truth.fallbackUsed,
    setupNeeded: truth.blockers.length > 0,
    blockers: truth.blockers,
    strategy: `Signup-focused 7-day plan for ${productContext.profile.appName} targeting ${input.audience}. Outcome: ${input.targetOutcome ?? "signup growth"}. Offer: ${productContext.profile.primaryOffer ?? "confirm offer"}.`,
    hooks: socialPosts.map((post) => post.hook),
    adCopy: socialPosts.map((post) => post.body),
    cta: productContext.primaryCta,
    script: dayPlan.map((day) => `Day ${day.day} - ${day.platform}\n${day.subject ? `Subject: ${day.subject}\n` : ""}${day.body}\nCTA: ${day.cta}`).join("\n\n"),
    scenePlan: [],
    visualPrompts: socialPosts.map((post, index) => productVisualPrompt(productContext.profile, post.platform, productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? post.body)),
    mediaRequirements: socialPosts.map((post) => `${post.platform} brand-aware creative with logo-safe space`),
    captionPlan: {
      dayPlan,
      socialPosts,
      emailSequence: emails,
      measurementPlan: ["Export tracking-link plan", "Connect analytics before claiming measured results"],
    },
    voiceoverPlan: {},
    musicPlan: {},
    brandOverlayPlan: { logoAssetId: productContext.profile.logoAssetId, brandColors: productContext.profile.brandColors },
    reviewItems: [],
    exportPack: {
      campaignCalendarDays: durationDays,
      checklist: ["social posts", "ad copy", "email sequence", "landing CTA", "video recommendation"],
    },
    scheduleDrafts: [],
    mediaJobs: [],
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: results.find((result) => result.generationMode === "model")?.provider ?? null,
    model: results.find((result) => result.generationMode === "model")?.model ?? null,
  });
}

export async function generateMarketingSocialPostPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const platformList = input.platforms.length ? input.platforms : ["Facebook"];
  const postCount = Math.min(5, Math.max(3, platformList.length + 2));
  const results = await Promise.all(Array.from({ length: postCount }).map((_, index) => {
    const platform = platformList[index % platformList.length];
    return executeProductCopy(input, productContext, { platform, contentType: "social_post" });
  }));
  const hooks = fallbackHooks(input.goal, input.audience, productContext.profile);
  const posts = results.map((result, index) => {
    const platform = platformList[index % platformList.length];
    const benefit = productContext.profile.benefits[index % productContext.profile.benefits.length] ?? productContext.profile.benefits[0];
    const fallbackHook = hooks[index % hooks.length];
    const fallbackCaption = `${fallbackHook}. ${productContext.profile.appName} helps ${input.audience} ${benefit}. ${productContext.primaryCta}`;
    return {
      platform,
      hook: asText(result.output.hook, fallbackHook),
      caption: asText(result.output.body, fallbackCaption),
      cta: asText(result.output.cta, productContext.primaryCta),
      hashtags: Array.isArray(result.output.hashtags) ? result.output.hashtags.map(String) : [],
      proofNote: productContext.profile.proofPoints[0] ?? "Use only confirmed product facts; add proof before publishing.",
    };
  });
  const truth = generationTruth(results);

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "social_post",
    goal: input.goal,
    audience: input.audience,
    platforms: platformList,
    status: resolveDeliverablePackageStatus({
      setupNeeded: truth.blockers.length > 0,
      blockers: truth.blockers,
      packageType: "social_post",
      requireApproval: input.requireApproval,
      hasPlayableMedia: false,
      hasRenderedVideo: false,
    }),
    generationSource: resolveGenerationSource({ textGeneratedByModel: truth.textGeneratedByModel, mediaGeneratedByModel: false, fallbackUsed: truth.fallbackUsed }),
    textGeneratedByModel: truth.textGeneratedByModel,
    mediaGeneratedByModel: false,
    fallbackUsed: truth.fallbackUsed,
    setupNeeded: truth.blockers.length > 0,
    blockers: truth.blockers,
    strategy: `${postCount} product-aware posts for ${platformList.join(", ")} using ${productContext.profile.appName}'s confirmed benefits and CTA.`,
    hooks: posts.map((post) => post.hook),
    adCopy: posts.map((post) => post.caption),
    cta: productContext.primaryCta,
    script: posts.map((post, index) => `Post ${index + 1} (${post.platform}):\nHook: ${post.hook}\nCaption: ${post.caption}\nCTA: ${post.cta}`).join("\n\n"),
    scenePlan: [],
    visualPrompts: posts.map((post, index) => productVisualPrompt(productContext.profile, post.platform, productContext.profile.benefits[index % productContext.profile.benefits.length] ?? productContext.profile.benefits[0])),
    mediaRequirements: posts.map((post) => `${post.platform} image or graphic`),
    captionPlan: { posts, reviewChecklist: posts.map((post, index) => `Review post ${index + 1} (${post.platform})`) },
    voiceoverPlan: {},
    musicPlan: {},
    brandOverlayPlan: {},
    reviewItems: [],
    exportPack: { checklist: ["Review all posts", "Approve captions", "Add visuals", "Schedule or export"] },
    scheduleDrafts: [],
    mediaJobs: [],
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: results.find((result) => result.generationMode === "model")?.provider ?? null,
    model: results.find((result) => result.generationMode === "model")?.model ?? null,
  });
}

export async function generateMarketingPaidSocialAdPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const platformList = input.platforms.filter((platform) => ["Facebook", "Instagram", "LinkedIn"].includes(platform));
  const platform = platformList[0] ?? input.platforms[0] ?? "Facebook";

  const fallbackAdVariants = ["Pain and proof", "Product benefit", "Direct CTA"].map((angle, index) => ({
    variantLabel: `Variant ${String.fromCharCode(65 + index)} - ${angle}`,
    primaryText: fallbackHooks(input.goal, input.audience, productContext.profile)[index],
    headline: `${productContext.profile.appName}: ${productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? "A clearer workflow"}`,
    description: productContext.profile.differentiators[index % Math.max(1, productContext.profile.differentiators.length)] ?? "Product details require confirmation.",
    cta: productContext.primaryCta,
    audienceAngle: `${input.audience}: ${productContext.profile.painPointsSolved[index % Math.max(1, productContext.profile.painPointsSolved.length)] ?? "operational clarity"}`,
    offerNote: productContext.profile.primaryOffer ?? "Offer details require confirmation.",
  }));
  const results = await Promise.all(fallbackAdVariants.map((variant) => executeProductCopy(input, productContext, {
    platform,
    contentType: `paid_social_ad ${variant.variantLabel}`,
  })));
  const adVariants = fallbackAdVariants.map((variant, index) => ({
    ...variant,
    primaryText: asText(results[index]?.output.body, `${fallbackHooks(input.goal, input.audience, productContext.profile)[index]}. ${productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? "Make operations clearer"}.`),
    headline: asText(results[index]?.output.hook, `${productContext.profile.appName}: ${productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? "A clearer workflow"}`),
    description: asText(results[index]?.output.angle, productContext.profile.differentiators[index % Math.max(1, productContext.profile.differentiators.length)] ?? variant.description),
    cta: asText(results[index]?.output.cta, productContext.primaryCta),
    audienceAngle: asText(results[index]?.output.angle, `${input.audience}: ${productContext.profile.painPointsSolved[index % Math.max(1, productContext.profile.painPointsSolved.length)] ?? "operational clarity"}`),
    offerNote: productContext.profile.primaryOffer ?? "Offer details require confirmation.",
  }));
  const truth = generationTruth(results);

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "paid_social_ad",
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    status: resolveDeliverablePackageStatus({
      setupNeeded: truth.blockers.length > 0,
      blockers: truth.blockers,
      packageType: "paid_social_ad",
      requireApproval: input.requireApproval,
      hasPlayableMedia: false,
      hasRenderedVideo: false,
    }),
    generationSource: resolveGenerationSource({ textGeneratedByModel: truth.textGeneratedByModel, mediaGeneratedByModel: false, fallbackUsed: truth.fallbackUsed }),
    textGeneratedByModel: truth.textGeneratedByModel,
    mediaGeneratedByModel: false,
    fallbackUsed: truth.fallbackUsed,
    setupNeeded: truth.blockers.length > 0,
    blockers: truth.blockers,
    strategy: `3 product-aware paid ad variants for ${platform} using ${productContext.profile.appName}'s offer and confirmed positioning.`,
    hooks: adVariants.map((variant) => variant.primaryText),
    adCopy: adVariants.map((variant) => `${variant.headline}: ${variant.description} | CTA: ${variant.cta} | ${variant.offerNote}`),
    cta: productContext.primaryCta,
    script: adVariants.map((variant) => `${variant.variantLabel}\nPrimary text: ${variant.primaryText}\nHeadline: ${variant.headline}\nDescription: ${variant.description}\nCTA: ${variant.cta}\nAudience: ${variant.audienceAngle}\nOffer: ${variant.offerNote}`).join("\n\n"),
    scenePlan: [],
    visualPrompts: adVariants.map((variant, index) => productVisualPrompt(productContext.profile, platform, productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? variant.audienceAngle)),
    mediaRequirements: adVariants.map((variant) => `${platform} ad image or video for ${variant.variantLabel}`),
    captionPlan: { adVariants, reviewChecklist: adVariants.map((variant, index) => `Approve ${variant.variantLabel} (ad ${index + 1})`) },
    voiceoverPlan: {},
    musicPlan: {},
    brandOverlayPlan: {},
    reviewItems: [],
    exportPack: { checklist: ["Review 3 ad variants", "Approve primary text", "Add creative assets", "Set budget and audience in Ads Manager"] },
    scheduleDrafts: [],
    mediaJobs: [],
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: results.find((result) => result.generationMode === "model")?.provider ?? null,
    model: results.find((result) => result.generationMode === "model")?.model ?? null,
  });
}

export async function generateMarketingEmailCampaignPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const emailCount = Math.min(5, Math.max(3, Math.ceil((input.durationDays ?? 7) / 3)));

  const fallbackEmails = Array.from({ length: emailCount }).map((_, index) => {
    const benefit = productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? "make daily operations clearer";
    return {
      emailIndex: index + 1,
      subject: `${productContext.profile.appName}: ${benefit}`,
      previewText: `${benefit}. ${productContext.profile.primaryOffer ?? ""}`,
      body: `Hi [First Name],\n\n${productContext.profile.appName} helps ${input.audience} ${benefit} with ${productContext.profile.coreFeatures.slice(0, 3).join(", ")}.\n\n${productContext.primaryCta}`,
      cta: productContext.primaryCta,
      timingSuggestion: `Day ${index * 3 + 1} - review and send when approved`,
      complianceNote: "Include unsubscribe link and review compliance before export.",
    };
  });
  const results = await Promise.all(fallbackEmails.map((email) => executeProductCopy(input, productContext, {
    task: "email_generation",
    platform: "Email",
    contentType: `email_campaign email_${email.emailIndex}`,
  })));
  const emails = fallbackEmails.map((email, index) => {
    const benefit = productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? "make daily operations clearer";
    return {
      ...email,
      subject: asText(results[index]?.output.subject, `${productContext.profile.appName}: ${benefit}`),
      previewText: asText(results[index]?.output.previewText, `${benefit}. ${productContext.profile.primaryOffer ?? ""}`),
      body: asText(results[index]?.output.body, `Hi [First Name],\n\n${productContext.profile.appName} helps ${input.audience} ${benefit} with ${productContext.profile.coreFeatures.slice(0, 3).join(", ")}.\n\n${productContext.primaryCta}`),
      cta: asText(results[index]?.output.cta, productContext.primaryCta),
    };
  });
  const truth = generationTruth(results);

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "email_campaign",
    goal: input.goal,
    audience: input.audience,
    platforms: ["Email"],
    status: resolveDeliverablePackageStatus({
      setupNeeded: truth.blockers.length > 0,
      blockers: truth.blockers,
      packageType: "email_campaign",
      requireApproval: input.requireApproval,
      hasPlayableMedia: false,
      hasRenderedVideo: false,
    }),
    generationSource: resolveGenerationSource({ textGeneratedByModel: truth.textGeneratedByModel, mediaGeneratedByModel: false, fallbackUsed: truth.fallbackUsed }),
    textGeneratedByModel: truth.textGeneratedByModel,
    mediaGeneratedByModel: false,
    fallbackUsed: truth.fallbackUsed,
    setupNeeded: truth.blockers.length > 0,
    blockers: truth.blockers,
    strategy: `${emailCount}-email product-aware nurture sequence for ${input.audience} using ${productContext.profile.appName}'s configured CTA.`,
    hooks: emails.map((email) => email.subject),
    adCopy: emails.map((email) => `${email.subject} | Preview: ${email.previewText} | CTA: ${email.cta}`),
    cta: productContext.primaryCta,
    script: emails.map((email) => `Email ${email.emailIndex}: ${email.subject}\nPreview: ${email.previewText}\n\n${email.body}\n\nCTA: ${email.cta}\nTiming: ${email.timingSuggestion}\nCompliance: ${email.complianceNote}`).join("\n\n---\n\n"),
    scenePlan: [],
    visualPrompts: [],
    mediaRequirements: ["Email header image optional"],
    captionPlan: { emails, reviewChecklist: emails.map((email, index) => `Review email ${index + 1}: ${email.subject}`) },
    voiceoverPlan: {},
    musicPlan: {},
    brandOverlayPlan: {},
    reviewItems: [],
    exportPack: { checklist: ["Review all email bodies", "Verify compliance notes", "Set up email platform", "Schedule send dates"] },
    scheduleDrafts: [],
    mediaJobs: [],
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: results.find((result) => result.generationMode === "model")?.provider ?? null,
    model: results.find((result) => result.generationMode === "model")?.model ?? null,
  });
}

export async function generateMarketingWeeklyContentPackPackage(input: ComposeMarketingDeliverableInput) {
  const productContext = await requireProductGenerationContext(input);
  const campaignId = await ensureCampaignId(input);
  const days = Math.min(7, Math.max(5, input.durationDays ?? 7));
  const platformList = input.platforms.length ? input.platforms : ["Facebook", "Instagram"];
  const hooks = fallbackHooks(input.goal, input.audience, productContext.profile);

  const fallbackDayPlan = Array.from({ length: days }).map((_, index) => {
    const day = index + 1;
    const platform = platformList[index % platformList.length];
    const hook = hooks[index % hooks.length];
    return {
      day,
      platform,
      channel: platform,
      contentFormat: day <= 2 ? "social_post" : day <= 4 ? "ad_creative" : "social_post",
      body: `Day ${day} — ${platform}: ${hook}. Check out EquiProfile and start your free trial today.`,
      cta: day % 3 === 0 ? "Start free trial" : day % 3 === 1 ? "Learn more" : "See how it works",
      postingWindow: day <= 3 ? "Morning (8–10am)" : "Afternoon (12–2pm)",
    };
  });
  const results = await Promise.all(fallbackDayPlan.map((day) => {
    const isEmail = day.day % 4 === 0;
    return executeProductCopy(input, productContext, {
      task: isEmail ? "email_generation" : "platform_copywriting",
      platform: isEmail ? "Email" : day.platform,
      contentType: `weekly_content_pack ${isEmail ? "email" : day.contentFormat}`,
    });
  }));
  const dayPlan = fallbackDayPlan.map((day, index) => {
    const isEmail = day.day % 4 === 0;
    const benefit = productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? "make operations clearer";
    const platform = isEmail ? "Email" : day.platform;
    return {
      ...day,
      platform,
      channel: platform,
      contentFormat: isEmail ? "email" : day.contentFormat,
      subject: isEmail ? asText(results[index]?.output.subject, `${productContext.profile.appName}: ${benefit}`) : undefined,
      body: asText(results[index]?.output.body, `Day ${day.day} - ${platform}: ${productContext.profile.appName} helps ${input.audience} ${benefit}. ${productContext.primaryCta}`),
      cta: asText(results[index]?.output.cta, productContext.primaryCta),
    };
  });
  const truth = generationTruth(results);

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "weekly_content_pack",
    goal: input.goal,
    audience: input.audience,
    platforms: platformList,
    status: resolveDeliverablePackageStatus({
      setupNeeded: truth.blockers.length > 0,
      blockers: truth.blockers,
      packageType: "weekly_content_pack",
      requireApproval: input.requireApproval,
      hasPlayableMedia: false,
      hasRenderedVideo: false,
    }),
    generationSource: resolveGenerationSource({ textGeneratedByModel: truth.textGeneratedByModel, mediaGeneratedByModel: false, fallbackUsed: truth.fallbackUsed }),
    textGeneratedByModel: truth.textGeneratedByModel,
    mediaGeneratedByModel: false,
    fallbackUsed: truth.fallbackUsed,
    setupNeeded: truth.blockers.length > 0,
    blockers: truth.blockers,
    strategy: `${days}-day product-aware social and email plan across ${platformList.join(", ")} for ${input.audience}.`,
    hooks: dayPlan.map((day) => day.body),
    adCopy: dayPlan.map((day) => `Day ${day.day} (${day.platform}): ${day.body} | CTA: ${day.cta}`),
    cta: productContext.primaryCta,
    script: dayPlan.map((day) => `Day ${day.day} — ${day.platform} (${day.postingWindow})\nFormat: ${day.contentFormat}\nContent: ${day.body}\nCTA: ${day.cta}`).join("\n\n"),
    scenePlan: [],
    visualPrompts: dayPlan.filter((day) => day.contentFormat !== "email").map((day, index) => productVisualPrompt(productContext.profile, day.platform, productContext.profile.benefits[index % Math.max(1, productContext.profile.benefits.length)] ?? day.body)),
    mediaRequirements: dayPlan.map((day) => `Day ${day.day} ${day.platform} image`),
    captionPlan: { dayPlan, reviewChecklist: dayPlan.map((day) => `Approve Day ${day.day} (${day.platform})`) },
    voiceoverPlan: {},
    musicPlan: {},
    brandOverlayPlan: {},
    reviewItems: [],
    exportPack: { checklist: ["Review day-by-day plan", "Approve all posts", "Add visuals", "Schedule or export week"] },
    scheduleDrafts: [],
    mediaJobs: [],
    campaignItems: [],
  };

  return persistMarketingDeliverablePackage({
    packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    sourcePrompt: input.goal,
    qualityMode: input.qualityMode,
    requireApproval: input.requireApproval,
    exportOnly: input.exportOnly,
    provider: results.find((result) => result.generationMode === "model")?.provider ?? null,
    model: results.find((result) => result.generationMode === "model")?.model ?? null,
  });
}

export async function composeMarketingDeliverablePackage(input: ComposeMarketingDeliverableInput) {
  if (input.packageType === "assembled_video_3m") return composeAssembledVideoPackage(input);
  if (input.packageType === "signup_campaign") return composeSignupCampaignPackage(input);
  if (input.packageType === "video_ad_30s") return composeThirtySecondAdPackage(input);
  if (input.packageType === "image_ad") return composeImageAdPackage(input);
  if (input.packageType === "social_post") return generateMarketingSocialPostPackage(input);
  if (input.packageType === "paid_social_ad") return generateMarketingPaidSocialAdPackage(input);
  if (input.packageType === "email_campaign") return generateMarketingEmailCampaignPackage(input);
  if (input.packageType === "weekly_content_pack") return generateMarketingWeeklyContentPackPackage(input);
  throw new UnsupportedDeliverablePackageTypeError(input.packageType);
}

export async function createCampaignItemsFromDeliverablePackage(input: {
  packageData: MarketingDeliverablePackage;
  tenantId: string;
  sourcePrompt: string;
  qualityMode: "standard" | "elite";
  provider?: string | null;
  model?: string | null;
  durationSeconds?: number;
  exportOnly?: boolean;
}) {
  const status = input.exportOnly === false ? "draft" : "export_only";
  const generationSource = input.packageData.generationSource;
  const metadataBase = {
    packageId: input.packageData.packageId,
    provider: input.provider ?? null,
    model: input.model ?? null,
    qualityMode: input.qualityMode,
    generationSource,
    textGeneratedByModel: input.packageData.textGeneratedByModel,
    mediaGeneratedByModel: input.packageData.mediaGeneratedByModel,
    fallbackUsed: input.packageData.fallbackUsed,
    setupNeeded: input.packageData.setupNeeded,
    blockers: input.packageData.blockers,
  };

  const itemRows: Array<{ type: string; platform?: string; title: string; content?: string; prompt?: string; metadata?: Record<string, unknown> }> = [
    {
      type: "campaign_plan",
      title: `${input.packageData.packageType} strategy`,
      content: input.packageData.strategy,
      metadata: metadataBase,
    },
    ...input.packageData.hooks.map((hook, index) => ({
      type: "social_post",
      platform: input.packageData.platforms[index % Math.max(1, input.packageData.platforms.length)],
      title: `Hook ${index + 1}`,
      content: hook,
      metadata: { ...metadataBase, creativeScore: 80 - index * 3 },
    })),
    ...input.packageData.adCopy.map((copy, index) => ({
      type: "ad_copy",
      platform: input.packageData.platforms[index % Math.max(1, input.packageData.platforms.length)],
      title: `Ad copy ${index + 1}`,
      content: copy,
      metadata: metadataBase,
    })),
    ...input.packageData.scenePlan.map((scene, index) => ({
      type: "scene_plan",
      platform: input.packageData.platforms[0],
      title: `Scene ${index + 1}`,
      content: String(scene.narration ?? ""),
      prompt: String(scene.visualPrompt ?? ""),
      metadata: {
        ...metadataBase,
        durationSeconds: Number(scene.durationSeconds ?? 0),
        sceneIndex: index + 1,
      },
    })),
    ...input.packageData.visualPrompts.map((prompt, index) => ({
      type: "visual_prompt",
      platform: input.packageData.platforms[0],
      title: `Visual prompt ${index + 1}`,
      prompt,
      metadata: { ...metadataBase, sceneIndex: index + 1 },
    })),
  ];

  if (input.packageData.script.trim()) {
    itemRows.push({
      type: input.packageData.packageType === "assembled_video_3m" ? "script_longform" : "script_30s",
      platform: input.packageData.platforms[0],
      title: `${input.packageData.packageType} script`,
      content: input.packageData.script,
      metadata: { ...metadataBase, durationSeconds: input.durationSeconds ?? null },
    });
  }

  if (input.packageData.packageType === "image_ad") {
    itemRows.push({
      type: "image_ad",
      platform: input.packageData.platforms[0],
      title: "Image ad",
      content: input.packageData.adCopy[0] ?? input.packageData.strategy,
      prompt: input.packageData.visualPrompts[0] ?? "",
      metadata: metadataBase,
    });
  }

  if (input.packageData.packageType === "assembled_video_3m") {
    itemRows.push({
      type: "video_plan",
      platform: input.packageData.platforms[0],
      title: "Assembled video plan",
      content: JSON.stringify({
        durationSeconds: input.durationSeconds ?? 180,
        voiceoverPlan: input.packageData.voiceoverPlan,
        musicPlan: input.packageData.musicPlan,
        brandOverlayPlan: input.packageData.brandOverlayPlan,
      }, null, 2),
      metadata: { ...metadataBase, durationSeconds: input.durationSeconds ?? 180 },
    });
  }

  if (input.packageData.packageType === "signup_campaign") {
    itemRows.push({
      type: "email",
      platform: "Email",
      title: "Signup sequence",
      content: JSON.stringify((input.packageData.captionPlan as { emailSequence?: string[] }).emailSequence ?? [], null, 2),
      metadata: metadataBase,
    });
  }

  const createdItems: Array<Record<string, unknown>> = [];
  for (const row of itemRows) {
    const id = await createMarketingCampaignItemRecord({
      campaignId: input.packageData.campaignId,
      tenantId: input.tenantId,
      type: row.type as any,
      platform: row.platform,
      title: row.title,
      content: row.content,
      prompt: row.prompt,
      status: status as "draft" | "export_only",
      reviewStatus: "needs_review",
      metadata: row.metadata,
    });
    createdItems.push({ id, ...row, status, reviewStatus: "needs_review" });
  }

  const exportPackItemId = await createMarketingCampaignItemRecord({
    campaignId: input.packageData.campaignId,
    tenantId: input.tenantId,
    type: "export_pack" as any,
    platform: "All",
    title: `${input.packageData.packageType} export pack`,
    content: JSON.stringify(input.packageData.exportPack, null, 2),
    status: status as "draft" | "export_only",
    reviewStatus: "needs_review",
    metadata: metadataBase,
  });
  createdItems.push({
    id: exportPackItemId,
    type: "export_pack",
    title: `${input.packageData.packageType} export pack`,
    status,
    reviewStatus: "needs_review",
  });

  return createdItems;
}

export async function createReviewItemsFromDeliverablePackage(input: {
  packageData: MarketingDeliverablePackage;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignItems: Array<Record<string, unknown>>;
}) {
  const reviewItems: Array<Record<string, unknown>> = [];
  for (const item of input.campaignItems) {
    const targetId = Number(item.id);
    if (!Number.isFinite(targetId)) continue;
    const recordId = await createMarketingReviewRecord({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      targetType: "campaign_item",
      targetId: String(targetId),
      status: "needs_review",
      reason: "generated_output_requires_human_review",
      metadata: null,
    });
    reviewItems.push({
      recordId,
      targetType: "campaign_item",
      targetId,
      status: "needs_review",
      packageId: input.packageData.packageId,
    });
  }
  return reviewItems;
}

export async function createScheduleDraftsFromDeliverablePackage(input: {
  packageData: MarketingDeliverablePackage;
  tenantId: string;
  workspaceId: string;
  campaignItems: Array<Record<string, unknown>>;
}) {
  const drafts: Array<Record<string, unknown>> = [];
  const scheduleItems = input.campaignItems.filter((item) => {
    const type = String(item.type ?? "");
    return type === "social_post" || type === "ad_copy" || type === "image_ad" || type === "video_plan";
  }).slice(0, 6);

  for (const [index, item] of scheduleItems.entries()) {
    const platform = String(item.platform ?? input.packageData.platforms[index % Math.max(1, input.packageData.platforms.length)] ?? "General");
    const scheduledFor = new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString();
    const id = await createMarketingScheduleDraftRecord({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      campaignId: input.packageData.campaignId,
      campaignItemId: Number(item.id) || null,
      platform,
      title: String(item.title ?? `${input.packageData.packageType} draft ${index + 1}`),
      content: typeof item.content === "string" ? item.content : "",
      scheduledFor,
      status: "export_only",
      reviewStatus: "needs_review",
      metadataJson: JSON.stringify({
        packageId: input.packageData.packageId,
        generationSource: input.packageData.generationSource,
      }),
    });
    drafts.push({ id, platform, scheduledFor, status: "export_only", reviewStatus: "needs_review" });
  }

  return drafts;
}

export function createExportPackFromDeliverablePackage(input: {
  packageData: MarketingDeliverablePackage;
  campaignItems: Array<Record<string, unknown>>;
  scheduleDrafts: Array<Record<string, unknown>>;
}) {
  const exportPack = {
    packageId: input.packageData.packageId,
    packageType: input.packageData.packageType,
    checklist: [
      "Review hooks and copy",
      "Review scene plan and visual prompts",
      "Validate setup_needed blockers",
      "Export approved assets",
    ],
    itemCount: input.campaignItems.length,
    scheduleDraftCount: input.scheduleDrafts.length,
    renderStatus: input.packageData.packageType === "assembled_video_3m" ? "not_rendered" : "not_required",
  };
  return exportPack;
}

export function summarizeMarketingDeliverablePackage(input: { packageData: MarketingDeliverablePackage }) {
  return {
    packageId: input.packageData.packageId,
    packageType: input.packageData.packageType,
    status: input.packageData.status,
    setupNeeded: input.packageData.setupNeeded,
    blockerCount: input.packageData.blockers.length,
    campaignItemCount: input.packageData.campaignItems.length,
    reviewItemCount: input.packageData.reviewItems.length,
    scheduleDraftCount: input.packageData.scheduleDrafts.length,
  };
}

export async function persistMarketingDeliverablePackage(input: {
  packageData: MarketingDeliverablePackage;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  sourcePrompt: string;
  qualityMode: "standard" | "elite";
  provider?: string | null;
  model?: string | null;
  durationSeconds?: number;
  exportOnly?: boolean;
  requireApproval?: boolean;
}) {
  const existing = await listMarketingCampaignItemRecords({
    campaignId: input.packageData.campaignId,
    tenantId: input.tenantId,
  }).catch(() => [] as Array<Record<string, unknown>>);

  const hasPackage = existing.some((row) => {
    const metadata = (row as { metadata?: Record<string, unknown> }).metadata ?? {};
    return metadata.packageId === input.packageData.packageId;
  });

  const campaignItems = hasPackage
    ? existing
    : await createCampaignItemsFromDeliverablePackage({
      packageData: input.packageData,
      tenantId: input.tenantId,
      sourcePrompt: input.sourcePrompt,
      qualityMode: input.qualityMode,
      provider: input.provider,
      model: input.model,
      durationSeconds: input.durationSeconds,
      exportOnly: input.exportOnly,
    });

  const reviewItems = await createReviewItemsFromDeliverablePackage({
    packageData: input.packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignItems,
  });

  const scheduleDrafts = await createScheduleDraftsFromDeliverablePackage({
    packageData: input.packageData,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    campaignItems,
  });

  const exportPack = createExportPackFromDeliverablePackage({
    packageData: input.packageData,
    campaignItems,
    scheduleDrafts,
  });

  return {
    ...input.packageData,
    reviewItems,
    exportPack,
    scheduleDrafts,
    campaignItems,
  };
}
