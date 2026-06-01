import { createMarketingCampaignRecord } from "../../growth-engine";
import { createMarketingAgentRun, getMarketingAgentRun, runMarketingAgentTask } from "../agent-workforce";
import { analyzeMarketingCampaignBrief, generateMarketingManagerGuidance, recommendCampaignStructure } from "../campaign-manager-brain";
import { getMarketingCommandCentreState } from "../command-centre";
import { getMarketingConnectorReadiness } from "../connector-readiness";
import { scoreMarketingCreative } from "../creative-scoring";
import { recommendMarketingPlaybook } from "../genius-brain";
import { detectMarketingContentGaps, getMarketingCompetitorContext, getMarketingTrendContext } from "../market-intelligence";
import { buildMarketingCaptionStylePlan, buildMarketingThumbnailPlan, buildMarketingVideoPacingPlan, recommendMarketingMediaTemplate, validateMarketingMediaExcellence } from "../media-excellence";
import { buildPlatformSpecialistPromptContext, recommendSpecialistsForCampaign } from "../platform-specialists";
import { getMarketingPerformanceContext } from "../results-conversion";
import { buildBrandMemoryPromptContext, updateBrandMemoryFromResults } from "../brand-memory";
import { getMarketingLearningInsights, recommendNextMarketingActions } from "../result-learning";
import { composeSignupCampaignPackage } from "../deliverable-composer";

type AutonomousRole =
  | "StrategyAgent"
  | "CopyAgent"
  | "MediaAgent"
  | "AvatarVoiceAgent"
  | "QaAgent"
  | "SchedulerAgent"
  | "ResultsAgent";

type AutonomousStep = {
  role: AutonomousRole;
  taskType: string;
  prompt: string;
  optional?: boolean;
};

export function buildAutonomousCampaignPlan(input: {
  goal: string;
  audience: string;
  platforms: string[];
  contentTypes: string[];
  durationDays: number;
  exportOnly: boolean;
  requireApproval: boolean;
  contextSummary: string;
}): AutonomousStep[] {
  const platformLine = input.platforms.join(", ");
  const typeLine = input.contentTypes.join(", ");
  const reviewLine = input.requireApproval
    ? "All outputs must be flagged needs_review and never auto-approved."
    : "Outputs still require explicit review before publish.";

  return [
    {
      role: "StrategyAgent",
      taskType: "campaign_strategy",
      prompt: `Build campaign strategy for goal: ${input.goal}. Audience: ${input.audience}. Platforms: ${platformLine}. Duration: ${input.durationDays} days. ${reviewLine} Context: ${input.contextSummary}`,
    },
    {
      role: "CopyAgent",
      taskType: "scriptwriting",
      prompt: `Generate hook/copy/script options for content types: ${typeLine}. Keep platform fit for ${platformLine}. Include CTA variants, compliance notes, and proof requirements.`,
    },
    {
      role: "MediaAgent",
      taskType: "scene_planning",
      prompt: "Generate scene/media plan with required assets, source type, and fallback flags where setup is missing. Include media template recommendation metadata.",
    },
    {
      role: "AvatarVoiceAgent",
      taskType: "voiceover",
      prompt: "Queue avatar/voice/music preparation plan only where provider routes are ready. Otherwise return setup_needed blockers.",
      optional: true,
    },
    {
      role: "QaAgent",
      taskType: "qa_summary",
      prompt: "Run deterministic QA summary and list blocking failures and manual review requirements.",
    },
    {
      role: "SchedulerAgent",
      taskType: "platform_copywriting",
      prompt: `Create export-first scheduling drafts for ${platformLine}; do not attempt direct posting.`,
    },
    {
      role: "ResultsAgent",
      taskType: "campaign_strategy",
      prompt: "Attach learning loop recommendations, winning-pattern caveats, and next-best actions with confidence labels.",
    },
  ];
}

export async function persistAutonomousCampaignOutputs(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  runIds: number[];
}) {
  const runs = await Promise.all(input.runIds.map((id) => getMarketingAgentRun({
    id,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
  })));
  return runs.filter(Boolean);
}

export function createAutonomousReviewTasks(input: {
  runSummaries: Array<{ runId: number; role: AutonomousRole; status: string; taskId?: number | null }>;
}) {
  return input.runSummaries.map((item) => ({
    runId: item.runId,
    taskId: item.taskId ?? null,
    role: item.role,
    reviewStatus: "needs_review" as const,
    reason: item.status === "completed"
      ? "generated_output_requires_human_review"
      : "blocked_or_setup_needed_review_required",
  }));
}

export function summarizeAutonomousCampaignRun(input: {
  campaignId: number;
  runSummaries: Array<{ runId: number; role: AutonomousRole; status: string; reason?: string | null; taskId?: number | null }>;
  connectorReadiness: Awaited<ReturnType<typeof getMarketingConnectorReadiness>>;
  performanceContext: Awaited<ReturnType<typeof getMarketingPerformanceContext>>;
  intelligence: Record<string, unknown>;
}) {
  const blockers = input.runSummaries
    .filter((item) => item.status !== "completed")
    .map((item) => `${item.role}: ${item.reason ?? item.status}`);

  if (input.connectorReadiness.status !== "ready") {
    blockers.push("Connectors not fully ready: export-first enforced.");
  }

  return {
    campaignId: input.campaignId,
    status: blockers.length ? "partial" : "completed",
    runSummaries: input.runSummaries,
    reviewTasks: createAutonomousReviewTasks({ runSummaries: input.runSummaries }),
    blockers,
    performanceContext: input.performanceContext,
    intelligence: input.intelligence,
    exportOnlyEnforced: input.connectorReadiness.status !== "ready",
  };
}

export async function runAutonomousMarketingCampaign(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  qualityMode: "standard" | "elite";
  goal: string;
  audience: string;
  platforms: string[];
  durationDays: number;
  contentTypes: string[];
  requireApproval?: boolean;
  exportOnly?: boolean;
}) {
  const requireApproval = input.requireApproval ?? true;
  const exportOnly = input.exportOnly ?? true;

  const campaignId = await createMarketingCampaignRecord({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    name: `Autonomous Campaign - ${input.goal.slice(0, 80)}`,
    goal: input.goal,
    audience: input.audience,
    channels: input.platforms,
    durationDays: input.durationDays,
    status: "draft",
  });

  const [
    performanceContext,
    connectorReadiness,
    trendContext,
    competitorContext,
    gapContext,
    specialistContext,
    geniusContext,
    playbook,
    brandMemory,
    managerBrief,
    managerGuidance,
    structure,
    learningInsights,
  ] = await Promise.all([
    getMarketingPerformanceContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, campaignId }),
    getMarketingConnectorReadiness({ tenantId: input.tenantId, workspaceId: input.workspaceId }),
    getMarketingTrendContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, platform: input.platforms[0] }),
    getMarketingCompetitorContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, platform: input.platforms[0] }),
    detectMarketingContentGaps({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, platform: input.platforms[0] ?? "LinkedIn" }),
    recommendSpecialistsForCampaign({ platforms: input.platforms, goal: input.goal, contentTypes: input.contentTypes }),
    buildPlatformSpecialistPromptContext({ platforms: input.platforms, goal: input.goal, contentTypes: input.contentTypes }),
    recommendMarketingPlaybook({ platform: input.platforms[0] ?? "LinkedIn", goal: input.goal, audience: input.audience }),
    buildBrandMemoryPromptContext({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId }),
    analyzeMarketingCampaignBrief({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, goal: input.goal, audience: input.audience, platforms: input.platforms }),
    generateMarketingManagerGuidance({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, goal: input.goal, audience: input.audience, platforms: input.platforms }),
    recommendCampaignStructure({ goal: input.goal, platform: input.platforms, audience: input.audience }),
    getMarketingLearningInsights({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, campaignId }),
  ]);

  const effectiveExportOnly = exportOnly || connectorReadiness.status !== "ready";

  const contextSummary = [
    `performance:${performanceContext.status}/${performanceContext.confidence}`,
    `trend:${trendContext.status}`,
    `competitor:${competitorContext.status}`,
    `contentGaps:${gapContext.status}`,
    `specialists:${specialistContext.status}`,
    `brandMemory:${brandMemory.status}`,
  ].join(" | ");

  const plan = buildAutonomousCampaignPlan({
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    contentTypes: input.contentTypes,
    durationDays: input.durationDays,
    exportOnly: effectiveExportOnly,
    requireApproval,
    contextSummary,
  });

  const runSummaries: Array<{ runId: number; role: AutonomousRole; status: string; reason?: string | null; taskId?: number | null }> = [];
  for (const step of plan) {
    const runId = await createMarketingAgentRun({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      campaignId,
      agentRole: step.role,
      inputJson: {
        goal: input.goal,
        audience: input.audience,
        platforms: input.platforms,
        requireApproval,
        exportOnly: effectiveExportOnly,
        stepRole: step.role,
        managerGuidance,
        structure,
        geniusPlaybook: playbook,
        brandMemory,
        trendContext,
        competitorContext,
        contentGapContext: gapContext,
        performanceContext,
      },
    });

    const response = await runMarketingAgentTask({
      runId,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      qualityMode: input.qualityMode,
      taskType: step.taskType,
      prompt: step.prompt,
    });

    runSummaries.push({
      runId,
      role: step.role,
      status: response.status,
      reason: response.reason ?? null,
      taskId: response.taskId ?? null,
    });
  }

  const creativeScore = await scoreMarketingCreative({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    platform: input.platforms[0] ?? "LinkedIn",
    contentType: input.contentTypes[0] ?? "social_post",
    goal: input.goal,
    hook: input.goal,
    body: managerGuidance.guidance.join(" "),
    cta: "Review and approve draft",
    claims: [],
    proofPoints: [],
    hasVisualAsset: false,
  });

  const mediaTemplate = recommendMarketingMediaTemplate({
    platform: input.platforms[0] ?? "LinkedIn",
    contentType: input.contentTypes[0] ?? "social_post",
  });
  const pacingPlan = buildMarketingVideoPacingPlan({
    durationSeconds: Math.max(20, Math.floor((input.durationDays * 30) / 7)),
    platform: input.platforms[0] ?? "LinkedIn",
    hasVoiceover: true,
    hasMusic: true,
  });
  const captionPlan = buildMarketingCaptionStylePlan({ platform: input.platforms[0] ?? "LinkedIn" });
  const thumbnailPlan = buildMarketingThumbnailPlan({ platform: input.platforms[0] ?? "LinkedIn", keyMessage: input.goal, hasLogo: brandMemory.status === "ok" });
  const mediaValidation = validateMarketingMediaExcellence({
    hasRenderedOutput: false,
    hasCaptionTrack: true,
    hasLogoSafeOverlay: true,
    musicLicenseStatus: "unknown",
    voiceQualityStatus: "ok",
  });

  await updateBrandMemoryFromResults({ tenantId: input.tenantId, workspaceId: input.workspaceId, hostAppId: input.hostAppId, campaignId }).catch(() => null);

  const nextActions = await recommendNextMarketingActions({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId,
  });

  const commandCentre = await getMarketingCommandCentreState({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    qualityMode: input.qualityMode,
    campaignId,
    goalHint: input.goal,
    audienceHint: input.audience,
    platformsHint: input.platforms,
  });

  const persistedRuns = await persistAutonomousCampaignOutputs({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    runIds: runSummaries.map((item) => item.runId),
  });

  const agentSummary = summarizeAutonomousCampaignRun({
    campaignId,
    runSummaries,
    connectorReadiness,
    performanceContext,
    intelligence: {
      managerBrief,
      managerGuidance,
      structure,
      specialistContext,
      geniusContext,
      playbook,
      brandMemory,
      trendContext,
      competitorContext,
      gapContext,
      learningInsights,
      creativeScore,
      mediaTemplate,
      pacingPlan,
      captionPlan,
      thumbnailPlan,
      mediaValidation,
      nextActions,
      commandCentre,
    },
  });

  const deliverablePackage = await composeSignupCampaignPackage({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    qualityMode: input.qualityMode,
    goal: input.goal,
    audience: input.audience,
    platforms: input.platforms,
    packageType: "signup_campaign",
    campaignId,
    durationDays: input.durationDays,
    exportOnly: effectiveExportOnly,
    requireApproval,
  });

  return {
    campaignId,
    deliverablePackage,
    campaignItems: deliverablePackage.campaignItems,
    reviewItems: deliverablePackage.reviewItems,
    exportPack: deliverablePackage.exportPack,
    scheduleDrafts: deliverablePackage.scheduleDrafts,
    mediaJobs: deliverablePackage.mediaJobs,
    agentSummary,
    setupNeeded: deliverablePackage.setupNeeded,
    blockers: deliverablePackage.blockers,
    reviewTasks: agentSummary.reviewTasks,
    runSummaries,
    persistedRuns,
    requireApproval,
    exportOnly: effectiveExportOnly,
    directPostingEnabled: false,
    status: deliverablePackage.status,
  };
}
