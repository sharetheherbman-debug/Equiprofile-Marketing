import crypto from "crypto";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  marketingAttributionLinks,
  marketingCampaignResults,
  marketingConversionEvents,
} from "../../../../drizzle/schema";

async function getDb() {
  const dbModule = await import("../../../db");
  return dbModule.getDb();
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function asNumber(value: string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function maybeHashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const trimmed = ip.trim();
  if (!trimmed) return null;
  return crypto.createHash("sha256").update(trimmed).digest("hex");
}

export async function createMarketingAttributionLink(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number | null;
  campaignItemId?: number | null;
  destinationUrl: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const code = `mkt_${nanoid(10)}`;
  const shortUrl = `/m/${code}`;
  const result = await db.insert(marketingAttributionLinks).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId ?? null,
    campaignItemId: input.campaignItemId ?? null,
    code,
    shortUrl,
    destinationUrl: input.destinationUrl,
    utmSource: input.utmSource ?? null,
    utmMedium: input.utmMedium ?? null,
    utmCampaign: input.utmCampaign ?? null,
    utmContent: input.utmContent ?? null,
    utmTerm: input.utmTerm ?? null,
    clickCount: 0,
    metadataJson: JSON.stringify(input.metadata ?? {}),
  });

  return {
    id: result[0].insertId,
    code,
    shortUrl,
  };
}

export async function listMarketingAttributionLinks(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(marketingAttributionLinks)
    .where(and(
      eq(marketingAttributionLinks.tenantId, input.tenantId),
      eq(marketingAttributionLinks.workspaceId, input.workspaceId),
      eq(marketingAttributionLinks.hostAppId, input.hostAppId),
    ))
    .orderBy(desc(marketingAttributionLinks.updatedAt));

  return rows.map((row) => ({
    ...row,
    metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastClickedAt: row.lastClickedAt?.toISOString() ?? null,
  }));
}

export async function resolveMarketingAttributionClick(input: {
  code: string;
  userAgent?: string | null;
  referrer?: string | null;
  ip?: string | null;
}) {
  const db = await getDb();
  if (!db) return { status: "setup_needed" as const, reason: "Database not available", destinationUrl: null };

  const [row] = await db
    .select()
    .from(marketingAttributionLinks)
    .where(eq(marketingAttributionLinks.code, input.code))
    .limit(1);

  if (!row?.destinationUrl) {
    return { status: "not_found" as const, reason: "Attribution code not found", destinationUrl: null };
  }

  const now = new Date();
  await db
    .update(marketingAttributionLinks)
    .set({
      clickCount: (row.clickCount ?? 0) + 1,
      lastClickedAt: now,
      updatedAt: now,
      metadataJson: JSON.stringify({
        ...parseJson<Record<string, unknown>>(row.metadataJson, {}),
        lastClick: {
          at: now.toISOString(),
          userAgent: input.userAgent ?? null,
          referrer: input.referrer ?? null,
          ipHash: maybeHashIp(input.ip),
        },
      }),
    })
    .where(eq(marketingAttributionLinks.id, row.id));

  await db.insert(marketingConversionEvents).values({
    tenantId: row.tenantId,
    workspaceId: row.workspaceId,
    hostAppId: row.hostAppId,
    campaignId: row.campaignId ?? null,
    campaignItemId: row.campaignItemId ?? null,
    eventType: "click",
    source: "attribution",
    metadataJson: JSON.stringify({
      attributionCode: row.code,
      userAgent: input.userAgent ?? null,
      referrer: input.referrer ?? null,
      ipHash: maybeHashIp(input.ip),
    }),
    capturedAt: now,
  });

  return {
    status: "ok" as const,
    destinationUrl: row.destinationUrl,
    campaignId: row.campaignId ?? null,
    campaignItemId: row.campaignItemId ?? null,
  };
}

export async function recordMarketingConversionEvent(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number | null;
  campaignItemId?: number | null;
  eventType: string;
  source: "manual" | "attribution" | "connector" | "imported" | "api" | string;
  contactRef?: string | null;
  revenueValue?: string | null;
  sourceRef?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (input.source === "connector" && !input.sourceRef?.trim()) {
    throw new Error("connector conversion events require sourceRef");
  }

  const result = await db.insert(marketingConversionEvents).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId ?? null,
    campaignItemId: input.campaignItemId ?? null,
    eventType: input.eventType,
    source: input.source,
    contactRef: input.contactRef ?? null,
    revenueValue: input.revenueValue ?? null,
    metadataJson: JSON.stringify({
      ...(input.metadata ?? {}),
      sourceRef: input.sourceRef ?? null,
    }),
    capturedAt: new Date(),
  });

  return result[0].insertId;
}

export async function importMarketingManualMetrics(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId: number;
  campaignItemId?: number | null;
  platform: string;
  metricType: string;
  metricValue: number;
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(marketingCampaignResults).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId,
    campaignItemId: input.campaignItemId ?? null,
    platform: input.platform,
    metricType: input.metricType,
    metricValue: String(input.metricValue),
    source: "manual",
    sourceRef: null,
    metadataJson: JSON.stringify(input.metadata ?? {}),
    capturedAt: new Date(),
  });

  return result[0].insertId;
}

export async function recordConnectorMetric(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId: number;
  campaignItemId?: number | null;
  platform: string;
  metricType: string;
  metricValue: number;
  sourceRef: string;
  metadata?: Record<string, unknown>;
}) {
  if (!input.sourceRef.trim()) {
    throw new Error("connector metrics require sourceRef");
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(marketingCampaignResults).values({
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    campaignId: input.campaignId,
    campaignItemId: input.campaignItemId ?? null,
    platform: input.platform,
    metricType: input.metricType,
    metricValue: String(input.metricValue),
    source: "connector",
    sourceRef: input.sourceRef,
    metadataJson: JSON.stringify(input.metadata ?? {}),
    capturedAt: new Date(),
  });
  return result[0].insertId;
}

export async function listMarketingCampaignResults(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const baseConditions = [
    eq(marketingCampaignResults.tenantId, input.tenantId),
    eq(marketingCampaignResults.workspaceId, input.workspaceId),
    eq(marketingCampaignResults.hostAppId, input.hostAppId),
  ];
  if (input.campaignId) baseConditions.push(eq(marketingCampaignResults.campaignId, input.campaignId));

  const rows = await db
    .select()
    .from(marketingCampaignResults)
    .where(and(...baseConditions))
    .orderBy(desc(marketingCampaignResults.capturedAt));

  return rows.map((row) => ({
    ...row,
    metricValueNumber: asNumber(row.metricValue),
    metadata: parseJson<Record<string, unknown>>(row.metadataJson, {}),
    capturedAt: row.capturedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getMarketingResultsSummary(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
}) {
  const rows = await listMarketingCampaignResults(input);

  const summary = {
    totals: {
      manual: 0,
      connector: 0,
      imported: 0,
      unknown: 0,
    },
    metricsByType: {} as Record<string, number>,
  };

  for (const row of rows) {
    if (row.source === "manual") summary.totals.manual += row.metricValueNumber;
    else if (row.source === "connector") summary.totals.connector += row.metricValueNumber;
    else if (row.source === "imported") summary.totals.imported += row.metricValueNumber;
    else summary.totals.unknown += row.metricValueNumber;

    summary.metricsByType[row.metricType] = (summary.metricsByType[row.metricType] ?? 0) + row.metricValueNumber;
  }

  return {
    counts: {
      rows: rows.length,
      bySource: rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.source] = (acc[row.source] ?? 0) + 1;
        return acc;
      }, {}),
    },
    totals: summary.totals,
    metricsByType: summary.metricsByType,
  };
}

export async function scoreMarketingCampaignPerformance(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const resultRows = await listMarketingCampaignResults(input);
  const conversionConditions = [
    eq(marketingConversionEvents.tenantId, input.tenantId),
    eq(marketingConversionEvents.workspaceId, input.workspaceId),
    eq(marketingConversionEvents.hostAppId, input.hostAppId),
  ];
  if (input.campaignId) conversionConditions.push(eq(marketingConversionEvents.campaignId, input.campaignId));
  const conversionRows = await db
    .select()
    .from(marketingConversionEvents)
    .where(and(...conversionConditions))
    .orderBy(desc(marketingConversionEvents.capturedAt));

  const impressions = resultRows.filter((row) => row.metricType === "impressions").reduce((acc, row) => acc + row.metricValueNumber, 0);
  const clicksFromMetrics = resultRows.filter((row) => row.metricType === "clicks").reduce((acc, row) => acc + row.metricValueNumber, 0);
  const clicksFromAttribution = conversionRows.filter((row) => row.eventType === "click").length;
  const clicks = Math.max(clicksFromMetrics, clicksFromAttribution);
  const conversionsFromMetrics = resultRows.filter((row) => row.metricType === "conversions").reduce((acc, row) => acc + row.metricValueNumber, 0);
  const conversionsFromEvents = conversionRows.filter((row) => row.eventType !== "click").length;
  const conversions = Math.max(conversionsFromMetrics, conversionsFromEvents);
  const conversionRate = clicks > 0 ? conversions / clicks : 0;

  const engagementSignals = ["likes", "comments", "shares", "saves"];
  const engagementScore = resultRows
    .filter((row) => engagementSignals.includes(row.metricType))
    .reduce((acc, row) => acc + row.metricValueNumber, 0);

  const sourceCounts = resultRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.source] = (acc[row.source] ?? 0) + 1;
    return acc;
  }, {});

  const sampleSize = resultRows.length + conversionRows.length;
  const connectorCount = sourceCounts.connector ?? 0;
  const confidence = sampleSize < 10
    ? "low"
    : connectorCount > 0
      ? "high"
      : "medium";

  const warnings: string[] = [];
  if (sampleSize < 10) warnings.push("insufficient_data");
  if (connectorCount === 0) warnings.push("connector_metrics_missing");

  const platformScores = resultRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.platform] = (acc[row.platform] ?? 0) + row.metricValueNumber;
    return acc;
  }, {});

  const contentItemScores = resultRows.reduce<Record<string, number>>((acc, row) => {
    const key = row.campaignItemId ? String(row.campaignItemId) : "unknown";
    acc[key] = (acc[key] ?? 0) + row.metricValueNumber;
    return acc;
  }, {});

  const ctaPerformance = resultRows
    .filter((row) => row.metricType.toLowerCase().includes("cta"))
    .reduce((acc, row) => acc + row.metricValueNumber, 0);

  return {
    status: warnings.includes("insufficient_data") ? "insufficient_data" : "ok",
    confidence,
    sampleSize,
    dataSources: sourceCounts,
    totals: {
      impressions,
      clicks,
      conversions,
      conversionRate,
      engagementScore,
      ctaPerformance,
    },
    platformScores,
    contentItemScores,
    warnings,
  };
}

export async function detectMarketingWinningPatterns(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
}) {
  const rows = await listMarketingCampaignResults(input);
  if (rows.length < 5) {
    return {
      status: "insufficient_data" as const,
      confidence: "low" as const,
      winningHooks: [] as string[],
      winningPlatforms: [] as string[],
      winningContentFormats: [] as string[],
      winningCtaStyles: [] as string[],
      winningPostingWindows: [] as string[],
      weakPerformers: [] as string[],
      warnings: ["insufficient_data"],
    };
  }

  const metricWeighted = rows.reduce<Record<string, number>>((acc, row) => {
    const metadata = row.metadata as Record<string, unknown>;
    const hook = typeof metadata.hook === "string" ? metadata.hook : null;
    const format = typeof metadata.contentFormat === "string" ? metadata.contentFormat : null;
    const cta = typeof metadata.ctaStyle === "string" ? metadata.ctaStyle : null;
    const postingWindow = typeof metadata.postingWindow === "string" ? metadata.postingWindow : null;

    const weight = row.metricValueNumber;
    if (hook) acc[`hook:${hook}`] = (acc[`hook:${hook}`] ?? 0) + weight;
    if (format) acc[`format:${format}`] = (acc[`format:${format}`] ?? 0) + weight;
    if (cta) acc[`cta:${cta}`] = (acc[`cta:${cta}`] ?? 0) + weight;
    if (postingWindow) acc[`window:${postingWindow}`] = (acc[`window:${postingWindow}`] ?? 0) + weight;
    acc[`platform:${row.platform}`] = (acc[`platform:${row.platform}`] ?? 0) + weight;
    return acc;
  }, {});

  function top(prefix: string, limit = 3) {
    return Object.entries(metricWeighted)
      .filter(([key]) => key.startsWith(prefix))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key]) => key.slice(prefix.length));
  }

  const platformScores = Object.entries(metricWeighted)
    .filter(([key]) => key.startsWith("platform:"))
    .sort((a, b) => b[1] - a[1]);

  return {
    status: "ok" as const,
    confidence: rows.some((row) => row.source === "connector") ? "high" as const : "medium" as const,
    winningHooks: top("hook:"),
    winningPlatforms: top("platform:"),
    winningContentFormats: top("format:"),
    winningCtaStyles: top("cta:"),
    winningPostingWindows: top("window:"),
    weakPerformers: platformScores.slice(-2).map(([key]) => key.replace("platform:", "")),
    warnings: rows.some((row) => row.source === "manual" || row.source === "imported")
      ? ["manual_or_imported_metrics_present"]
      : [],
  };
}

export async function getMarketingPerformanceContext(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number;
}) {
  const [score, patterns] = await Promise.all([
    scoreMarketingCampaignPerformance(input),
    detectMarketingWinningPatterns(input),
  ]);

  return {
    status: score.status === "ok" && patterns.status === "ok" ? "ok" : "insufficient_data",
    confidence: score.confidence,
    sourceLabels: score.dataSources,
    score,
    patterns,
    guidance: score.status === "insufficient_data"
      ? "Use conservative generation defaults. Performance history is insufficient."
      : "Use winning patterns with confidence-weighted priority.",
  };
}
