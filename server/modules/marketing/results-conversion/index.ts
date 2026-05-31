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

export async function recordMarketingConversionEvent(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  campaignId?: number | null;
  campaignItemId?: number | null;
  eventType: string;
  source: string;
  contactRef?: string | null;
  revenueValue?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

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
    metadataJson: JSON.stringify(input.metadata ?? {}),
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
