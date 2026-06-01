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

export type MarketingDeliverablePackageType =
  | "image_ad"
  | "social_ad"
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
};

export class UnsupportedDeliverablePackageTypeError extends Error {
  readonly packageType: string;

  constructor(packageType: string) {
    super(`Unsupported deliverable package type: ${packageType}`);
    this.name = "UnsupportedDeliverablePackageTypeError";
    this.packageType = packageType;
  }
}

function fallbackHooks(goal: string, audience: string) {
  return [
    `${audience}: stop losing time to manual updates`,
    `Get more from every stable with ${goal.toLowerCase()}`,
    "From admin chaos to consistent growth in one flow",
  ];
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
  const campaignId = await ensureCampaignId(input);
  const textRoute = await getTextRouteStatus(input);
  const hooks = fallbackHooks(input.goal, input.audience);
  const adCopy = [
    `${hooks[0]} EquiProfile helps stable owners centralize operations and launch with confidence.`,
    `${hooks[1]} Start your free trial and move from guesswork to growth.`,
  ];
  const imageResult = await generateMarketingImageAsset({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    prompt: `${input.goal}. Audience: ${input.audience}. Platform: ${input.platforms.join(", ")}`,
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
    cta: "Start your EquiProfile free trial",
    script: "",
    scenePlan: [],
    visualPrompts: [`Premium horse stable environment, trustworthy staff, product-led workflow for ${input.audience}`],
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
    brief: `Goal: ${input.goal}. Audience: ${input.audience}.`,
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

  const hooks = fallbackHooks(input.goal, input.audience);
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
      `${hooks[0]} EquiProfile organizes your stable into one growth-ready system.`,
      "Stop juggling tools and start converting interested owners today.",
    ],
    cta: scriptPlan.cta || "Start your free trial",
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
    brief: `Build an assembled 3-minute marketing video package for ${input.audience}.`,
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
    hooks: fallbackHooks(input.goal, input.audience),
    adCopy: [],
    cta: scriptPlan.cta || "Book your EquiProfile demo",
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
  const campaignId = await ensureCampaignId(input);
  const durationDays = input.durationDays ?? 30;
  const adPackage = await composeThirtySecondAdPackage({
    ...input,
    campaignId,
    packageType: "video_ad_30s",
    durationSeconds: 30,
  });

  const socialPosts = Array.from({ length: durationDays >= 30 ? 6 : 3 }).map((_, index) =>
    `Day ${index + 1}: Stable-owner conversion message with proof + CTA`,
  );
  const emails = [
    "Email 1: Pain + promise + free-trial CTA",
    "Email 2: Case-study proof + objections",
    "Email 3: Last-chance CTA",
  ];

  const packageData: MarketingDeliverablePackage = {
    packageId: `pkg_${nanoid(12)}`,
    campaignId,
    packageType: "signup_campaign",
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    status: resolveDeliverablePackageStatus({
      setupNeeded: adPackage.setupNeeded,
      blockers: adPackage.blockers,
      packageType: "signup_campaign",
      requireApproval: input.requireApproval,
      hasPlayableMedia: false,
      hasRenderedVideo: false,
    }),
    generationSource: adPackage.generationSource,
    textGeneratedByModel: adPackage.textGeneratedByModel,
    mediaGeneratedByModel: adPackage.mediaGeneratedByModel,
    fallbackUsed: adPackage.fallbackUsed,
    setupNeeded: adPackage.setupNeeded,
    blockers: adPackage.blockers,
    strategy: `Signup-focused ${durationDays}-day plan targeting ${input.audience}. Outcome: ${input.targetOutcome ?? "monthly signup growth"}.`,
    hooks: adPackage.hooks,
    adCopy: [...adPackage.adCopy, ...socialPosts.slice(0, 2)],
    cta: "Start free trial",
    script: adPackage.script,
    scenePlan: adPackage.scenePlan,
    visualPrompts: adPackage.visualPrompts,
    mediaRequirements: adPackage.mediaRequirements,
    captionPlan: {
      ...adPackage.captionPlan,
      socialPosts,
      emailSequence: emails,
      measurementPlan: ["Track signups", "Track CTR", "Track trial activations"],
    },
    voiceoverPlan: adPackage.voiceoverPlan,
    musicPlan: adPackage.musicPlan,
    brandOverlayPlan: adPackage.brandOverlayPlan,
    reviewItems: [],
    exportPack: {
      campaignCalendarDays: durationDays,
      checklist: ["social posts", "ad copy", "email sequence", "landing CTA", "video recommendation"],
    },
    scheduleDrafts: [],
    mediaJobs: adPackage.mediaJobs,
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
  });
}

export async function composeMarketingDeliverablePackage(input: ComposeMarketingDeliverableInput) {
  if (input.packageType === "assembled_video_3m") return composeAssembledVideoPackage(input);
  if (input.packageType === "signup_campaign") return composeSignupCampaignPackage(input);
  if (input.packageType === "video_ad_30s") return composeThirtySecondAdPackage(input);
  if (input.packageType === "image_ad") return composeImageAdPackage(input);
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
    itemRows.push(
      {
        type: "email",
        platform: "Email",
        title: "Signup sequence",
        content: JSON.stringify((input.packageData.captionPlan as { emailSequence?: string[] }).emailSequence ?? [], null, 2),
        metadata: metadataBase,
      },
      {
        type: "blog",
        platform: "Blog / SEO",
        title: "Signup campaign longform",
        content: "Publish educational signup-focused SEO content supporting the campaign CTA.",
        metadata: metadataBase,
      },
    );
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
