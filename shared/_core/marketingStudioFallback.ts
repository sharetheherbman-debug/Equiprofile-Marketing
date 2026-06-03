import type { MarketingStudioPlan, MarketingStudioScene } from "./marketingStudioPlan";

export type MarketingStudioProductContext = {
  hostAppId?: string | null;
  productCategory?: string | null;
  productName?: string | null;
  productProfileConfirmed?: boolean;
};

type SceneBlueprint = {
  narration: string;
  visualPrompt: string;
  requiredSubject: string;
};

const CATEGORY_BLUEPRINTS: Record<string, SceneBlueprint[]> = {
  equine_stable_management: [
    {
      narration: "Open with an organized stable operation and a clear day-to-day challenge.",
      visualPrompt: "Well-kept stable yard, horses and care team, clean brand-safe composition",
      requiredSubject: "organized stable operation",
    },
    {
      narration: "Show how the product helps the team keep horse records, schedules, and documents visible.",
      visualPrompt: "Horse care team coordinating schedules and records near a stable yard",
      requiredSubject: "stable team coordination",
    },
    {
      narration: "Close with a confident next step for owners and equestrian teams.",
      visualPrompt: "Healthy horses, confident team, clean CTA-safe closing frame",
      requiredSubject: "equestrian call to action",
    },
  ],
  property_real_estate: [
    {
      narration: "Open with a clear property goal and the audience decision that matters most.",
      visualPrompt: "Professional property exterior and welcoming real-estate presentation",
      requiredSubject: "property opportunity",
    },
    {
      narration: "Show the practical value that helps buyers, sellers, landlords, or agents move forward.",
      visualPrompt: "Property walkthrough, clean interior details, trusted real-estate service",
      requiredSubject: "property value",
    },
    {
      narration: "Close with a simple next step to enquire, book, or learn more.",
      visualPrompt: "Property closing frame with clean CTA-safe composition",
      requiredSubject: "property call to action",
    },
  ],
  automotive: [
    {
      narration: "Open with the vehicle, service, or automotive goal in a strong brand-safe frame.",
      visualPrompt: "Polished automotive scene, vehicle details, premium clean composition",
      requiredSubject: "automotive opportunity",
    },
    {
      narration: "Show the feature, ownership benefit, or service value that matters to the audience.",
      visualPrompt: "Vehicle feature detail or automotive service experience",
      requiredSubject: "automotive value",
    },
    {
      narration: "Close with a clear next step to enquire, book, or explore the offer.",
      visualPrompt: "Automotive closing frame with clean CTA-safe composition",
      requiredSubject: "automotive call to action",
    },
  ],
  saas_app: [
    {
      narration: "Open with the workflow problem the product helps solve.",
      visualPrompt: "Modern product workflow, focused user, clean software brand composition",
      requiredSubject: "workflow problem",
    },
    {
      narration: "Show the product value through a practical, audience-relevant outcome.",
      visualPrompt: "Productivity workflow and clear software value demonstration",
      requiredSubject: "software product value",
    },
    {
      narration: "Close with one useful next step and a clear call to action.",
      visualPrompt: "Clean software CTA closing frame with logo-safe composition",
      requiredSubject: "software call to action",
    },
  ],
  generic: [
    {
      narration: "Open with the audience problem and the reason to pay attention.",
      visualPrompt: "Brand-relevant opening frame with clear product context",
      requiredSubject: "audience problem",
    },
    {
      narration: "Show the practical product or service value in a trustworthy way.",
      visualPrompt: "Practical product value demonstration for the target audience",
      requiredSubject: "product value",
    },
    {
      narration: "Close with one clear next step.",
      visualPrompt: "Clean CTA closing frame with logo-safe composition",
      requiredSubject: "call to action",
    },
  ],
};

function normalizeCategory(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function resolveMarketingStudioFallbackCategory(context: MarketingStudioProductContext = {}) {
  const hostAppId = normalizeCategory(context.hostAppId);
  const category = normalizeCategory(context.productCategory);
  if (hostAppId === "equiprofile" || category === "equine_stable_management" || category === "equine") return "equine_stable_management";
  if (category.includes("property") || category.includes("real_estate")) return "property_real_estate";
  if (category.includes("automotive") || category.includes("vehicle") || category.includes("car")) return "automotive";
  if (category.includes("saas") || category.includes("software") || category.includes("app")) return "saas_app";
  return "generic";
}

export function buildMarketingStudioFallbackScenes(input: {
  prompt: string;
  durationTargetSeconds: number;
  context?: MarketingStudioProductContext;
  reason?: string;
}): MarketingStudioScene[] {
  const category = resolveMarketingStudioFallbackCategory(input.context);
  const blueprints = CATEGORY_BLUEPRINTS[category] ?? CATEGORY_BLUEPRINTS.generic;
  const targetSeconds = Math.max(1, Math.round(input.durationTargetSeconds || 30));
  const sceneCount = Math.min(targetSeconds, Math.max(3, Math.ceil(targetSeconds / 15)));
  const baseDuration = Math.floor(targetSeconds / sceneCount);
  let remainingSeconds = targetSeconds;

  return Array.from({ length: sceneCount }, (_, index) => {
    const blueprint = blueprints[index % blueprints.length];
    const isFinalScene = index === sceneCount - 1;
    const durationSeconds = isFinalScene ? remainingSeconds : Math.max(1, baseDuration);
    remainingSeconds -= durationSeconds;
    return {
      id: `fallback-${category}-${targetSeconds}-${index + 1}`,
      order: index + 1,
      durationSeconds,
      narration: blueprint.narration,
      visualPrompt: blueprint.visualPrompt,
      negativePrompt: "blurry, off-topic, watermark, unreadable text, raw metadata",
      sourceType: isFinalScene ? "text_card" : "stock",
      requiredSubject: blueprint.requiredSubject,
      assetId: null,
      assetUrl: null,
      previewUrl: null,
      provider: null,
      providerAssetId: null,
      mediaKind: isFinalScene ? "text_card" : "video",
      sourceMetadata: {
        fallback_used: true,
        fallback_reason: input.reason ?? "media_provider_or_stock_not_available",
        fallback_category: category,
      },
      selectedAt: null,
      selectionReason: isFinalScene ? "Branded caption fallback closing scene" : null,
      status: isFinalScene ? "needs_review" : "pending",
    };
  });
}

export function applyBrandedCaptionFallbackToUnresolvedScenes(plan: MarketingStudioPlan): MarketingStudioPlan {
  return {
    ...plan,
    scenes: plan.scenes.map((scene) => {
      if (scene.assetUrl || scene.sourceType === "text_card" || scene.mediaKind === "text_card") return scene;
      return {
        ...scene,
        sourceType: "text_card",
        mediaKind: "text_card",
        assetId: null,
        assetUrl: null,
        previewUrl: null,
        provider: null,
        providerAssetId: null,
        selectedAt: null,
        selectionReason: "Branded caption fallback used because optional scene media was unavailable",
        status: "needs_review",
      };
    }),
  };
}

export function ensureRenderableMarketingStudioPlan(
  plan: MarketingStudioPlan,
  context: MarketingStudioProductContext = {},
): MarketingStudioPlan {
  const scenes = plan.scenes.length
    ? plan.scenes
    : buildMarketingStudioFallbackScenes({
      prompt: plan.originalUserPrompt,
      durationTargetSeconds: plan.durationTargetSeconds,
      context,
      reason: "studio_plan_missing_scenes",
    });
  const script = plan.script.trim() || scenes.map((scene) => scene.narration).filter(Boolean).join(" ");
  return {
    ...plan,
    script,
    voiceoverScript: plan.voiceoverScript.trim() || script,
    scenes,
  };
}

export function isRenderableMarketingStudioPlan(plan?: MarketingStudioPlan | null) {
  return Boolean(plan?.script.trim() && plan.scenes.length && plan.scenes.every((scene) => scene.durationSeconds > 0));
}
