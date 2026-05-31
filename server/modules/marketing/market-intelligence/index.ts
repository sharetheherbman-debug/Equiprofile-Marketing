import { and, desc, eq, gte } from "drizzle-orm";
import { marketingCompetitorSignals, marketingContentGapSignals, marketingTrendSignals } from "../../../../drizzle/schema";
import { getRuntimeConfig } from "../../../dynamicConfig";
import { getDb } from "../../../db";

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function assertSourceAllowed(sourceType: string, scraperConfigured: boolean) {
  if (sourceType === "scraper" && !scraperConfigured) {
    throw new Error("scraper_not_configured");
  }
}

export async function recordMarketingTrendSignal(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  platform: string;
  niche?: string;
  topic: string;
  signalType: string;
  signalText: string;
  sourceType: "manual" | "imported" | "connector" | "scraper";
  sourceUrl?: string | null;
  confidence?: "low" | "medium" | "high";
  capturedAt?: Date;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const scraperConfigured = Boolean(await getRuntimeConfig("marketing_scraper_provider", "MARKETING_SCRAPER_PROVIDER"));
  assertSourceAllowed(input.sourceType, scraperConfigured);

  const result = await db.insert(marketingTrendSignals).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    platform: input.platform,
    niche: input.niche ?? null,
    topic: input.topic,
    signalType: input.signalType,
    signalText: input.signalText,
    sourceType: input.sourceType,
    sourceUrl: input.sourceUrl ?? null,
    confidence: input.confidence ?? "low",
    capturedAt: input.capturedAt ?? new Date(),
    expiresAt: input.expiresAt ?? null,
    metadataJson: JSON.stringify(input.metadata ?? {}),
  });

  return { status: "ok" as const, id: (result as { insertId?: number }).insertId ?? null };
}

export async function listMarketingTrendSignals(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  platform?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const clauses = [
    eq(marketingTrendSignals.tenantId, input.tenantId),
    eq(marketingTrendSignals.workspaceId, input.workspaceId),
    eq(marketingTrendSignals.hostAppId, input.hostAppId),
  ];
  if (input.platform) clauses.push(eq(marketingTrendSignals.platform, input.platform));

  const rows = await db
    .select()
    .from(marketingTrendSignals)
    .where(and(...clauses))
    .orderBy(desc(marketingTrendSignals.capturedAt))
    .limit(input.limit ?? 50);

  return rows.map((row: any) => ({ ...row, metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}) }));
}

export async function getMarketingTrendContext(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  platform?: string;
  lookbackDays?: number;
}) {
  const db = await getDb();
  if (!db) {
    return { status: "setup_needed" as const, reason: "Database not available", signals: [] as unknown[] };
  }
  const since = new Date(Date.now() - (input.lookbackDays ?? 30) * 24 * 60 * 60 * 1000);
  const signals = await db
    .select()
    .from(marketingTrendSignals)
    .where(and(
      eq(marketingTrendSignals.tenantId, input.tenantId),
      eq(marketingTrendSignals.workspaceId, input.workspaceId),
      eq(marketingTrendSignals.hostAppId, input.hostAppId),
      input.platform ? eq(marketingTrendSignals.platform, input.platform) : gte(marketingTrendSignals.capturedAt, since),
      gte(marketingTrendSignals.capturedAt, since),
    ))
    .orderBy(desc(marketingTrendSignals.capturedAt))
    .limit(100);

  if (!signals.length) {
    return { status: "insufficient_data" as const, reason: "no_trend_signals", signals: [] as unknown[] };
  }

  return {
    status: "ok" as const,
    sourceLabels: Array.from(new Set(signals.map((item: any) => item.sourceType))),
    signals: signals.map((row: any) => ({ ...row, metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}) })),
  };
}

export async function recordMarketingCompetitorSignal(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  competitorName: string;
  platform: string;
  signalType: string;
  signalText: string;
  sourceType: "manual" | "imported" | "connector" | "scraper";
  sourceUrl?: string | null;
  confidence?: "low" | "medium" | "high";
  capturedAt?: Date;
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const scraperConfigured = Boolean(await getRuntimeConfig("marketing_scraper_provider", "MARKETING_SCRAPER_PROVIDER"));
  assertSourceAllowed(input.sourceType, scraperConfigured);

  const result = await db.insert(marketingCompetitorSignals).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    competitorName: input.competitorName,
    platform: input.platform,
    signalType: input.signalType,
    signalText: input.signalText,
    sourceType: input.sourceType,
    sourceUrl: input.sourceUrl ?? null,
    confidence: input.confidence ?? "low",
    capturedAt: input.capturedAt ?? new Date(),
    metadataJson: JSON.stringify(input.metadata ?? {}),
  });

  return { status: "ok" as const, id: (result as { insertId?: number }).insertId ?? null };
}

export async function listMarketingCompetitorSignals(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  platform?: string;
  competitorName?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const clauses = [
    eq(marketingCompetitorSignals.tenantId, input.tenantId),
    eq(marketingCompetitorSignals.workspaceId, input.workspaceId),
    eq(marketingCompetitorSignals.hostAppId, input.hostAppId),
  ];
  if (input.platform) clauses.push(eq(marketingCompetitorSignals.platform, input.platform));
  if (input.competitorName) clauses.push(eq(marketingCompetitorSignals.competitorName, input.competitorName));

  const rows = await db
    .select()
    .from(marketingCompetitorSignals)
    .where(and(...clauses))
    .orderBy(desc(marketingCompetitorSignals.capturedAt))
    .limit(input.limit ?? 50);

  return rows.map((row: any) => ({ ...row, metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}) }));
}

export async function getMarketingCompetitorContext(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  platform?: string;
  lookbackDays?: number;
}) {
  const db = await getDb();
  if (!db) {
    return { status: "setup_needed" as const, reason: "Database not available", signals: [] as unknown[] };
  }

  const since = new Date(Date.now() - (input.lookbackDays ?? 30) * 24 * 60 * 60 * 1000);
  const rows = await db
    .select()
    .from(marketingCompetitorSignals)
    .where(and(
      eq(marketingCompetitorSignals.tenantId, input.tenantId),
      eq(marketingCompetitorSignals.workspaceId, input.workspaceId),
      eq(marketingCompetitorSignals.hostAppId, input.hostAppId),
      input.platform ? eq(marketingCompetitorSignals.platform, input.platform) : gte(marketingCompetitorSignals.capturedAt, since),
      gte(marketingCompetitorSignals.capturedAt, since),
    ))
    .orderBy(desc(marketingCompetitorSignals.capturedAt))
    .limit(100);

  if (!rows.length) {
    return { status: "insufficient_data" as const, reason: "no_competitor_signals", signals: [] as unknown[] };
  }

  return {
    status: "ok" as const,
    sourceLabels: Array.from(new Set(rows.map((item: any) => item.sourceType))),
    signals: rows.map((row: any) => ({ ...row, metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}) })),
  };
}

export async function detectMarketingContentGaps(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  platform: string;
}) {
  const trend = await getMarketingTrendContext(input);
  const competitor = await getMarketingCompetitorContext(input);

  if (trend.status !== "ok" || competitor.status !== "ok") {
    return {
      status: "insufficient_data" as const,
      reason: "missing_trend_or_competitor_signals",
      gaps: [],
    };
  }

  const competitorTopics = new Set((competitor.signals as any[]).map((row: any) => String(row.signalText).toLowerCase()));
  const gapCandidates = trend.signals
    .map((row: any) => String(row.topic).trim())
    .filter((topic: string) => topic && !Array.from(competitorTopics).some((item: string) => item.includes(topic.toLowerCase())))
    .slice(0, 8);

  const db = await getDb();
  if (db && gapCandidates.length) {
    for (const topic of gapCandidates) {
      await db.insert(marketingContentGapSignals).values({
        tenantId: input.tenantId,
        workspaceId: input.workspaceId,
        hostAppId: input.hostAppId,
        platform: input.platform,
        gapType: "topic_gap",
        gapText: `Potential content gap around: ${topic}`,
        confidence: "medium",
        sourceSummary: "Derived from trend vs competitor signal delta",
        metadataJson: JSON.stringify({ topic }),
      });
    }
  }

  return {
    status: gapCandidates.length ? "ok" : "insufficient_data",
    gaps: gapCandidates,
    evidence: {
      trendCount: trend.signals.length,
      competitorCount: competitor.signals.length,
    },
  } as const;
}
