import { buildBrandMemoryPromptContext } from "../brand-memory";
import { buildMarketingGeniusPromptContext } from "../genius-brain";
import { getMarketingTrendContext, getMarketingCompetitorContext } from "../market-intelligence";
import { buildPlatformSpecialistPromptContext } from "../platform-specialists";
import { getMarketingPerformanceContext } from "../results-conversion";

export function detectMarketingBriefWeaknesses(input: {
  goal: string;
  audience: string;
  platform: string[];
  cta?: string;
  proofPoints?: string[];
}) {
  const weaknesses: string[] = [];
  if (input.goal.trim().length < 12) weaknesses.push("goal_too_broad");
  if (!input.cta || input.cta.trim().length < 6) weaknesses.push("weak_cta");
  if ((input.proofPoints?.length ?? 0) === 0) weaknesses.push("missing_proof");
  if (!input.platform.length) weaknesses.push("platform_missing");

  return {
    status: weaknesses.length ? "ok" : "insufficient_data",
    weaknesses,
  } as const;
}

export function recommendCampaignStructure(input: {
  goal: string;
  platform: string[];
  audience: string;
}) {
  const isLinkedIn = input.platform.some((item) => item.toLowerCase().includes("linkedin"));
  const structure = isLinkedIn
    ? ["Authority hook", "Evidence", "Actionable framework", "CTA"]
    : ["Hook", "Pain or aspiration", "Proof", "CTA"];

  return {
    status: "ok" as const,
    structure,
    rationale: isLinkedIn
      ? "LinkedIn audiences reward authority and proof-first sequencing."
      : "Short-form and social feeds reward fast hook + clear payoff.",
  };
}

export async function analyzeMarketingCampaignBrief(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  goal: string;
  audience: string;
  platforms: string[];
  cta?: string;
  proofPoints?: string[];
}) {
  const weaknesses = detectMarketingBriefWeaknesses({
    goal: input.goal,
    audience: input.audience,
    platform: input.platforms,
    cta: input.cta,
    proofPoints: input.proofPoints,
  });
  const structure = recommendCampaignStructure({ goal: input.goal, platform: input.platforms, audience: input.audience });
  const platformContext = buildPlatformSpecialistPromptContext({ platforms: input.platforms, goal: input.goal });
  const genius = buildMarketingGeniusPromptContext({ platform: input.platforms[0] ?? "LinkedIn", goal: input.goal, audience: input.audience });
  const brand = await buildBrandMemoryPromptContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId });

  return {
    status: "ok" as const,
    weaknesses,
    structure,
    sourcesUsed: {
      brandMemory: brand.status === "ok",
      platformSpecialist: platformContext.status === "ok",
      genericPlaybook: true,
    },
    contexts: {
      platformContext,
      genius,
      brand,
    },
  };
}

export async function generateMarketingManagerGuidance(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  goal: string;
  audience: string;
  platforms: string[];
  cta?: string;
  proofPoints?: string[];
}) {
  const analysis = await analyzeMarketingCampaignBrief(input);
  const guidance: string[] = [];

  if (analysis.weaknesses.weaknesses.includes("goal_too_broad")) guidance.push("This campaign goal is too broad. Define one measurable conversion event.");
  if (analysis.weaknesses.weaknesses.includes("weak_cta")) guidance.push("Your CTA is weak. Use a single explicit action with one destination.");
  if (analysis.weaknesses.weaknesses.includes("missing_proof")) guidance.push("Add proof before scaling spend: case result, benchmark, or verifiable process.");
  if (input.platforms.some((item) => item.toLowerCase().includes("linkedin")) && input.goal.toLowerCase().includes("discount")) {
    guidance.push("LinkedIn should lead with authority proof, not discount-first language.");
  }

  if (!guidance.length) guidance.push("Brief quality is solid. Proceed to hook and angle generation with platform specialist constraints.");

  return {
    status: "ok" as const,
    guidance,
    sourcesUsed: [
      analysis.sourcesUsed.brandMemory ? "brand memory" : "generic playbook",
      "platform specialist",
      "generic playbook",
    ],
  };
}

export async function recommendMarketingNextSteps(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
  goal: string;
  audience: string;
  platforms: string[];
}) {
  const [trend, competitor, performance] = await Promise.all([
    getMarketingTrendContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, platform: input.platforms[0] }),
    getMarketingCompetitorContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, platform: input.platforms[0] }),
    getMarketingPerformanceContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, campaignId: input.campaignId }),
  ]);

  const steps: string[] = [];
  if (performance.status === "insufficient_data") {
    steps.push("Run a small controlled experiment with 2 hooks and 2 CTA variants to build reliable baseline data.");
  } else {
    steps.push("Scale formats aligned to winning platforms and CTA styles from current performance context.");
  }
  if (trend.status !== "ok") steps.push("Add manual/imported trend signals before trend-led content decisions.");
  if (competitor.status !== "ok") steps.push("Capture competitor signal notes manually or via configured source to avoid blind spots.");
  steps.push("Route all new outputs through creative scoring and review gate before scheduling.");

  return {
    status: "ok" as const,
    steps,
    sourcesUsed: [
      "performance context",
      trend.status === "ok" ? "trend signal" : "generic playbook",
      competitor.status === "ok" ? "competitor signal" : "generic playbook",
    ],
  };
}
