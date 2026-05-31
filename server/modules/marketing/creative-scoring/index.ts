import { buildBrandMemoryPromptContext } from "../brand-memory";
import { scoreMarketingPlatformFit } from "../platform-specialists";

export type CreativeScoreInput = {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  platform: string;
  contentType: string;
  goal: string;
  hook?: string;
  body?: string;
  cta?: string;
  claims?: string[];
  proofPoints?: string[];
  hasVisualAsset?: boolean;
  priorFatigueSignals?: number;
};

export type CreativeScoreResult = {
  totalScore: number;
  categoryScores: Record<string, number>;
  blockingIssues: string[];
  warnings: string[];
  improvementSuggestions: string[];
  rewriteSuggestions: string[];
  platformSpecificWarnings: string[];
  approvalRecommendation: "approve" | "needs_changes" | "reject" | "manual_review_required";
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function keywordSignal(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

export async function scoreMarketingCreative(input: CreativeScoreInput): Promise<CreativeScoreResult> {
  const hook = input.hook?.trim() ?? "";
  const body = input.body?.trim() ?? "";
  const cta = input.cta?.trim() ?? "";
  const joined = `${hook} ${body}`.trim();

  const blockingIssues: string[] = [];
  const warnings: string[] = [];
  const improvementSuggestions: string[] = [];
  const rewriteSuggestions: string[] = [];

  const hookStrength = clamp(hook.length >= 12 ? 75 : hook.length > 0 ? 45 : 20);
  const clarity = clamp(body.length >= 60 ? 70 : body.length > 0 ? 45 : 20);
  const ctaStrength = clamp(cta.length >= 8 ? 80 : cta.length > 0 ? 45 : 10);
  const emotionalPull = clamp(keywordSignal(joined, ["save", "protect", "confidence", "easy", "fast"]) ? 70 : 45);
  const novelty = clamp(keywordSignal(hook, ["nobody tells you", "hidden", "mistake", "before and after"]) ? 68 : 50);
  const trustLevel = clamp((input.proofPoints?.length ?? 0) > 0 ? 75 : 35);
  const visualImpact = clamp(input.hasVisualAsset ? 75 : 30);
  const conversionPotential = clamp((hookStrength * 0.35) + (ctaStrength * 0.45) + (clarity * 0.2));

  const platformScore = scoreMarketingPlatformFit({
    specialistId: input.platform.toLowerCase().includes("linkedin") ? "linkedin_authority"
      : input.platform.toLowerCase().includes("instagram") ? "instagram"
      : input.platform.toLowerCase().includes("youtube") ? "youtube_shorts"
      : input.platform.toLowerCase().includes("facebook") ? "facebook_ads"
      : input.platform.toLowerCase().includes("email") ? "email_conversion"
      : input.platform.toLowerCase().includes("blog") ? "seo_blog"
      : "tiktok_reels",
    contentFormat: input.contentType,
    contentLengthHint: body,
    hasCta: Boolean(cta),
    hasProof: (input.proofPoints?.length ?? 0) > 0,
  });

  const platformFit = platformScore.status === "ok" ? platformScore.score : 20;
  if (platformScore.status !== "ok") warnings.push("platform_specialist_missing");
  warnings.push(...(platformScore.status === "ok" ? platformScore.warnings : []));

  const brandMemory = await buildBrandMemoryPromptContext({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
  });
  const tabooClaims = brandMemory.status === "ok" ? (brandMemory.tabooClaims as string[]) : [];
  const claimRisk = clamp((input.claims ?? []).some((claim) => tabooClaims.some((taboo) => claim.toLowerCase().includes(taboo.toLowerCase()))) ? 85 : 20);
  const complianceRisk = clamp((input.claims ?? []).length > 0 && (input.proofPoints?.length ?? 0) === 0 ? 75 : 25);
  const fatigueRisk = clamp((input.priorFatigueSignals ?? 0) > 3 ? 70 : 30);

  if ((input.claims?.length ?? 0) > 0 && (input.proofPoints?.length ?? 0) === 0) {
    blockingIssues.push("claims_without_supporting_proof");
  }
  if (!cta && input.goal.toLowerCase().includes("conversion")) {
    blockingIssues.push("missing_cta_for_conversion_goal");
  }
  if (platformFit < 35) {
    warnings.push("platform_mismatch");
  }

  if (hookStrength < 50) improvementSuggestions.push("Strengthen first-line hook with a specific pain or curiosity trigger.");
  if (ctaStrength < 50) improvementSuggestions.push("Use a single, explicit CTA with clear next step.");
  if (trustLevel < 50) improvementSuggestions.push("Add verifiable proof point or evidence context.");
  if (!input.hasVisualAsset) improvementSuggestions.push("Attach or generate visual asset before approval.");

  if (hookStrength < 50) rewriteSuggestions.push("Rewrite hook using a Problem-Agitate-Solve or Curiosity-Gap opening.");
  if (platformFit < 50) rewriteSuggestions.push("Rewrite copy using platform specialist rules for pacing and CTA style.");

  const categoryScores = {
    hookStrength,
    scrollStoppingPower: clamp((hookStrength * 0.6) + (visualImpact * 0.4)),
    clarity,
    emotionalPull,
    ctaStrength,
    brandFit: brandMemory.status === "ok" ? 70 : 45,
    platformFit,
    novelty,
    conversionPotential,
    visualImpact,
    trustLevel,
    complianceRisk: 100 - complianceRisk,
    claimRisk: 100 - claimRisk,
    fatigueRisk: 100 - fatigueRisk,
  };

  const totalScore = clamp(Object.values(categoryScores).reduce((acc, value) => acc + value, 0) / Object.keys(categoryScores).length);

  const approvalRecommendation: CreativeScoreResult["approvalRecommendation"] = blockingIssues.length
    ? "reject"
    : totalScore >= 75
      ? "manual_review_required"
      : totalScore >= 55
        ? "needs_changes"
        : "reject";

  return {
    totalScore,
    categoryScores,
    blockingIssues,
    warnings,
    improvementSuggestions,
    rewriteSuggestions,
    platformSpecificWarnings: platformScore.status === "ok" ? platformScore.warnings : ["platform_score_unavailable"],
    approvalRecommendation,
  };
}

export async function improveMarketingCreative(input: CreativeScoreInput) {
  const score = await scoreMarketingCreative(input);
  const suggestions = [...score.improvementSuggestions, ...score.rewriteSuggestions];
  return {
    status: score.blockingIssues.length ? "needs_changes" : "ok",
    score,
    suggestions,
  } as const;
}

export async function getMarketingCreativeScorecard(input: CreativeScoreInput) {
  const score = await scoreMarketingCreative(input);
  return {
    status: "ok" as const,
    generatedAt: new Date().toISOString(),
    score,
  };
}
