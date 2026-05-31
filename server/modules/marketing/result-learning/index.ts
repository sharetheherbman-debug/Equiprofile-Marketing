import { and, desc, eq } from "drizzle-orm";
import {
  marketingBestPerformers,
  marketingCampaignResults,
  marketingExperimentRuns,
  marketingExperimentVariants,
  marketingLearningInsights,
} from "../../../../drizzle/schema";
import { getDb } from "../../../db";
import { detectMarketingWinningPatterns, scoreMarketingCampaignPerformance } from "../results-conversion";

function parseNum(value: string | null | undefined): number {
  if (!value) return 0;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export async function createMarketingExperiment(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
  name: string;
  hypothesis?: string;
  sourceType?: "manual" | "connector" | "imported" | "api";
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(marketingExperimentRuns).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId ?? null,
    name: input.name,
    hypothesis: input.hypothesis ?? null,
    status: "running",
    sourceType: input.sourceType ?? "manual",
    metadataJson: JSON.stringify(input.metadata ?? {}),
  });

  return { status: "ok" as const, experimentId: (result as { insertId?: number }).insertId ?? null };
}

export async function recordMarketingExperimentVariant(input: {
  experimentId: number;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  variantKey: string;
  hook?: string;
  cta?: string;
  platform?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  sourceType?: "manual" | "connector" | "imported" | "api";
  evidence?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(marketingExperimentVariants).values({
    experimentId: input.experimentId,
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    variantKey: input.variantKey,
    hook: input.hook ?? null,
    cta: input.cta ?? null,
    platform: input.platform ?? null,
    impressions: input.impressions ?? 0,
    clicks: input.clicks ?? 0,
    conversions: input.conversions ?? 0,
    sourceType: input.sourceType ?? "manual",
    evidenceJson: JSON.stringify(input.evidence ?? {}),
  });

  return { status: "ok" as const, variantId: (result as { insertId?: number }).insertId ?? null };
}

export async function scoreMarketingExperiment(input: { experimentId: number; tenantId: string; workspaceId: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const variants = await db
    .select()
    .from(marketingExperimentVariants)
    .where(and(
      eq(marketingExperimentVariants.experimentId, input.experimentId),
      eq(marketingExperimentVariants.tenantId, input.tenantId),
      eq(marketingExperimentVariants.workspaceId, input.workspaceId),
    ));

  if (!variants.length) {
    return { status: "insufficient_data" as const, confidence: "low", winners: [], notes: ["no_variants"] };
  }

  const scored = variants.map((variant: any) => {
    const ctr = variant.impressions > 0 ? variant.clicks / variant.impressions : 0;
    const cvr = variant.clicks > 0 ? variant.conversions / variant.clicks : 0;
    const score = (ctr * 0.6) + (cvr * 0.4);
    return {
      id: variant.id,
      variantKey: variant.variantKey,
      hook: variant.hook,
      cta: variant.cta,
      platform: variant.platform,
      score,
      ctr,
      cvr,
      sampleSize: variant.impressions,
      sourceType: variant.sourceType,
    };
  }).sort((a: any, b: any) => b.score - a.score);

  const top = scored[0];
  const confidence = top.sampleSize < 100 ? "low" : top.sourceType === "connector" ? "high" : "medium";

  return {
    status: top.sampleSize < 20 ? "insufficient_data" : "ok",
    confidence,
    winners: scored.slice(0, 3),
    notes: top.sampleSize < 20 ? ["low_sample_size"] : [],
  } as const;
}

export async function getMarketingLearningInsights(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
}) {
  const db = await getDb();
  if (!db) return { status: "setup_needed" as const, insights: [] as unknown[] };

  const clauses = [
    eq(marketingLearningInsights.tenantId, input.tenantId),
    eq(marketingLearningInsights.workspaceId, input.workspaceId),
    eq(marketingLearningInsights.hostAppId, input.hostAppId),
  ];
  if (input.campaignId) clauses.push(eq(marketingLearningInsights.campaignId, input.campaignId));

  const rows = await db
    .select()
    .from(marketingLearningInsights)
    .where(and(...clauses))
    .orderBy(desc(marketingLearningInsights.updatedAt))
    .limit(100);

  return {
    status: rows.length ? "ok" : "insufficient_data",
    insights: rows.map((row: any) => ({ ...row, metadata: row.metadataJson ? JSON.parse(row.metadataJson) : {} })),
  } as const;
}

export async function diagnoseMarketingUnderperformance(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId: number;
}) {
  const score = await scoreMarketingCampaignPerformance(input);
  const reasons: string[] = [];

  if (score.totals.clicks === 0) reasons.push("no_clicks_detected");
  if (score.totals.conversions === 0) reasons.push("no_conversions_detected");
  if (score.totals.ctaPerformance <= 0) reasons.push("weak_or_missing_cta_signal");
  if (score.warnings.includes("insufficient_data")) reasons.push("insufficient_data");

  return {
    status: reasons.length ? "ok" : "insufficient_data",
    confidence: score.confidence,
    reasons,
    sourceLabels: score.dataSources,
    evidenceSummary: {
      impressions: score.totals.impressions,
      clicks: score.totals.clicks,
      conversions: score.totals.conversions,
      conversionRate: score.totals.conversionRate,
    },
  };
}

export async function explainMarketingWinLoss(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId: number;
}) {
  const [score, patterns] = await Promise.all([
    scoreMarketingCampaignPerformance(input),
    detectMarketingWinningPatterns(input),
  ]);

  const explanation = score.status === "insufficient_data"
    ? "Insufficient reliable sample size to explain performance confidently."
    : `Top signals are ${patterns.winningPlatforms.join(", ") || "unknown platforms"} with CTA cues ${patterns.winningCtaStyles.join(", ") || "unknown"}.`;

  return {
    status: score.status,
    confidence: score.confidence,
    sourceLabels: score.dataSources,
    explanation,
    evidenceSummary: {
      totals: score.totals,
      warnings: score.warnings,
      winningPatterns: patterns,
    },
  };
}

export async function recommendNextMarketingActions(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId: number;
}) {
  const [diagnosis, pattern] = await Promise.all([
    diagnoseMarketingUnderperformance(input),
    detectMarketingWinningPatterns(input),
  ]);

  const actions: string[] = [];
  if (diagnosis.reasons.includes("no_clicks_detected")) actions.push("Strengthen opening hooks and run 2-3 hook variants.");
  if (diagnosis.reasons.includes("weak_or_missing_cta_signal")) actions.push("Replace weak CTA with intent-aligned CTA and single action path.");
  if (diagnosis.reasons.includes("no_conversions_detected")) actions.push("Audit landing flow and align CTA with offer clarity.");
  if (pattern.status === "ok" && pattern.winningPlatforms.length) {
    actions.push(`Shift near-term output toward winning platforms: ${pattern.winningPlatforms.join(", ")}.`);
  }
  if (!actions.length) actions.push("Collect more connector and attribution data before making high-confidence shifts.");

  return {
    status: actions.length ? "ok" : "insufficient_data",
    confidence: diagnosis.confidence,
    sourceLabels: diagnosis.sourceLabels,
    actions,
    evidenceSummary: {
      diagnosis,
      pattern,
    },
  };
}

export async function refreshBestPerformerSnapshots(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId: number;
}) {
  const db = await getDb();
  if (!db) return { status: "setup_needed" as const };

  const rows = await db
    .select()
    .from(marketingCampaignResults)
    .where(and(
      eq(marketingCampaignResults.tenantId, input.tenantId),
      eq(marketingCampaignResults.workspaceId, input.workspaceId),
      eq(marketingCampaignResults.hostAppId, input.hostAppId),
      eq(marketingCampaignResults.campaignId, input.campaignId),
    ));

  const bestByPlatform = rows.reduce<Record<string, number>>((acc: Record<string, number>, row: any) => {
    acc[row.platform] = (acc[row.platform] ?? 0) + parseNum(row.metricValue);
    return acc;
  }, {});

  for (const [platform, score] of Object.entries(bestByPlatform)) {
    await db.insert(marketingBestPerformers).values({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      hostAppId: input.hostAppId,
      campaignId: input.campaignId,
      performerType: "platform",
      performerKey: platform,
      score: String(score as number),
      confidence: (score as number) > 100 ? "medium" : "low",
      sourceType: "manual",
      evidenceSummary: `Aggregated metric score for ${platform}`,
      metadataJson: JSON.stringify({ derived: true }),
    });
  }

  return { status: "ok" as const, count: Object.keys(bestByPlatform).length };
}
