import crypto from "crypto";
import { marketingBrandKits, marketingProductProfiles } from "../drizzle/schema";
import { getDb } from "./db";

interface ConnectorResponse<T> {
  success: boolean;
  data?: T;
  error?: { message?: string; code?: string };
}

export interface BusinessSnapshotResult {
  accepted: boolean;
  duplicate: boolean;
  version: number;
  material_change: boolean;
}

export interface BrandKitSnapshotSource {
  id: number;
  brandName: string;
  domain: string;
  tagline: string | null;
  primaryCta: string;
  secondaryCta: string | null;
  toneOfVoice: string;
  targetAudience: string | null;
  updatedAt: Date;
}

export interface ProductSnapshotSource {
  id: number;
  appName: string;
  category: string;
  domain: string | null;
  landingPageUrl: string | null;
  signupUrl: string | null;
  targetAudiencesJson: string | null;
  primaryOffer: string | null;
  pricingDetails: string | null;
  coreFeaturesJson: string | null;
  benefitsJson: string | null;
  painPointsSolvedJson: string | null;
  objectionsJson: string | null;
  proofPointsJson: string | null;
  differentiatorsJson: string | null;
  forbiddenClaimsJson: string | null;
  toneOfVoiceJson: string | null;
  ctaLibraryJson: string | null;
  platformPositioningJson: string | null;
  sourceMode: string;
  confidenceScore: number;
  confirmedAt: Date | null;
  updatedAt: Date;
}

export interface MarketingBusinessSnapshot {
  snapshot_id: string;
  occurred_at: string;
  app: {
    id: string;
    name: string;
    domain: string;
    description?: string;
  };
  products: Array<Record<string, unknown>>;
  plans: Array<Record<string, unknown>>;
  pricing: Array<Record<string, unknown>>;
  features: Array<Record<string, unknown>>;
  offers: Array<Record<string, unknown>>;
  promotions: Array<Record<string, unknown>>;
  status_changes: Array<Record<string, unknown>>;
  authoritative_fields: string[];
}

function envFlagEnabled(value: string | undefined): boolean {
  return /^(1|true|yes|on)$/i.test(String(value || "").trim());
}

function connectorConfig() {
  const appUrl = (
    process.env.MARKETING_APP_URL ||
    "https://marketing.equiprofile.online"
  ).replace(/\/$/, "");
  return {
    enabled: envFlagEnabled(process.env.MARKETING_CONNECTOR_ENABLED),
    apiUrl: (process.env.MARKETING_API_URL || `${appUrl}/api/v1`).replace(/\/$/, ""),
    applicationId: process.env.EQUIPROFILE_APP_ID || "equiprofile",
    connectorKey: process.env.EQUIPROFILE_CONNECTOR_KEY || "",
  };
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`)
    .join(",")}}`;
}

function connectorHeaders(body: unknown): Record<string, string> {
  const current = connectorConfig();
  if (!current.connectorKey || current.connectorKey.length < 32) {
    throw new Error("EQUIPROFILE_CONNECTOR_KEY is not configured securely");
  }
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(24).toString("base64url");
  const signature = crypto
    .createHmac("sha256", current.connectorKey)
    .update(`${timestamp}\n${nonce}\n${canonicalize(body)}`, "utf8")
    .digest("hex");
  return {
    "Content-Type": "application/json",
    "X-Application-Id": current.applicationId,
    "X-Application-Key": current.connectorKey,
    "X-Application-Timestamp": timestamp,
    "X-Application-Nonce": nonce,
    "X-Application-Signature": signature,
  };
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function cleanStrings(value: string | null | undefined): string[] {
  const parsed = parseJson<unknown>(value, []);
  if (!Array.isArray(parsed)) return [];
  return [...new Set(parsed.map((item) => String(item || "").trim()).filter(Boolean))];
}

function cleanObject(value: string | null | undefined): Record<string, unknown> {
  const parsed = parseJson<unknown>(value, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : {};
}

function normalizeDomain(value: string): string {
  const trimmed = String(value || "").trim().toLowerCase();
  if (!trimmed) throw new Error("EquiProfile brand domain is required");
  const candidate = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  const url = new URL(candidate);
  if (!/^https?:$/.test(url.protocol)) throw new Error("EquiProfile brand domain must be HTTP(S)");
  return url.hostname.toLowerCase();
}

function canonicalHttpsUrl(domain: string, value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname.toLowerCase() !== domain) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function profileRank(profile: ProductSnapshotSource): number {
  let score = Math.max(0, Number(profile.confidenceScore || 0));
  if (profile.confirmedAt) score += 10000;
  if (String(profile.sourceMode || "").toLowerCase() === "manual") score += 1000;
  return score;
}

export function selectAuthoritativeProduct(
  profiles: ProductSnapshotSource[],
): ProductSnapshotSource {
  if (profiles.length === 0) throw new Error("EquiProfile product profile is required");
  return [...profiles].sort((left, right) => {
    const rankDelta = profileRank(right) - profileRank(left);
    if (rankDelta !== 0) return rankDelta;
    return right.updatedAt.getTime() - left.updatedAt.getTime();
  })[0];
}

export function buildBusinessSnapshotFromRows(
  applicationId: string,
  brand: BrandKitSnapshotSource,
  profiles: ProductSnapshotSource[],
): MarketingBusinessSnapshot {
  if (!brand || !brand.brandName) throw new Error("EquiProfile brand kit is required");
  const product = selectAuthoritativeProduct(profiles);
  const domain = normalizeDomain(brand.domain);
  const landingPageUrl = canonicalHttpsUrl(domain, product.landingPageUrl) || `https://${domain}/`;
  const signupUrl = canonicalHttpsUrl(domain, product.signupUrl) || landingPageUrl;

  const audiences = cleanStrings(product.targetAudiencesJson);
  const coreFeatures = cleanStrings(product.coreFeaturesJson).filter(
    (feature) => feature.length <= 240,
  );
  const benefits = cleanStrings(product.benefitsJson);
  const painPoints = cleanStrings(product.painPointsSolvedJson);
  const objections = cleanStrings(product.objectionsJson);
  const proofPoints = cleanStrings(product.proofPointsJson);
  const differentiators = cleanStrings(product.differentiatorsJson);
  const forbiddenClaims = cleanStrings(product.forbiddenClaimsJson);
  const tone = cleanStrings(product.toneOfVoiceJson);
  const ctas = cleanStrings(product.ctaLibraryJson);
  const platformPositioning = cleanObject(product.platformPositioningJson);

  const productRecord: Record<string, unknown> = {
    name: brand.brandName,
    category: product.category || "unknown",
    domain,
    landing_page_url: landingPageUrl,
    signup_url: signupUrl,
    target_audiences: audiences,
    benefits,
    pain_points_solved: painPoints,
    objections,
    proof_points: proofPoints,
    differentiators,
    forbidden_claims: forbiddenClaims,
    tone_of_voice: tone,
    cta_library: ctas,
    platform_positioning: platformPositioning,
  };

  if (product.pricingDetails) {
    productRecord.pricing_note = product.pricingDetails;
  }

  const featureRecords = coreFeatures.map((feature) => ({ name: feature }));
  const offerRecords = product.primaryOffer
    ? [{ name: product.primaryOffer, signup_url: signupUrl }]
    : [];

  const stableFacts = {
    app: {
      id: applicationId,
      name: brand.brandName,
      domain,
      ...(brand.tagline ? { description: brand.tagline } : {}),
    },
    products: [productRecord],
    plans: [],
    pricing: [],
    features: featureRecords,
    offers: offerRecords,
    promotions: [],
    status_changes: [],
    authoritative_fields: ["app", "products", "features", "offers"],
  };

  const fingerprint = crypto
    .createHash("sha256")
    .update(canonicalize(stableFacts), "utf8")
    .digest("hex");

  const occurredAt = new Date(
    Math.max(brand.updatedAt.getTime(), product.updatedAt.getTime()),
  ).toISOString();

  return {
    snapshot_id: `${applicationId}-business-${fingerprint}`,
    occurred_at: occurredAt,
    ...stableFacts,
  };
}

export async function buildMarketingBusinessSnapshot(): Promise<MarketingBusinessSnapshot> {
  const current = connectorConfig();
  if (!current.enabled) throw new Error("Marketing connector is disabled");
  const db = await getDb();
  if (!db) throw new Error("Management database is unavailable");

  const brandRows = await db
    .select({
      id: marketingBrandKits.id,
      brandName: marketingBrandKits.brandName,
      domain: marketingBrandKits.domain,
      tagline: marketingBrandKits.tagline,
      primaryCta: marketingBrandKits.primaryCta,
      secondaryCta: marketingBrandKits.secondaryCta,
      toneOfVoice: marketingBrandKits.toneOfVoice,
      targetAudience: marketingBrandKits.targetAudience,
      updatedAt: marketingBrandKits.updatedAt,
    })
    .from(marketingBrandKits);

  const productRows = await db
    .select({
      id: marketingProductProfiles.id,
      appName: marketingProductProfiles.appName,
      category: marketingProductProfiles.category,
      domain: marketingProductProfiles.domain,
      landingPageUrl: marketingProductProfiles.landingPageUrl,
      signupUrl: marketingProductProfiles.signupUrl,
      targetAudiencesJson: marketingProductProfiles.targetAudiencesJson,
      primaryOffer: marketingProductProfiles.primaryOffer,
      pricingDetails: marketingProductProfiles.pricingDetails,
      coreFeaturesJson: marketingProductProfiles.coreFeaturesJson,
      benefitsJson: marketingProductProfiles.benefitsJson,
      painPointsSolvedJson: marketingProductProfiles.painPointsSolvedJson,
      objectionsJson: marketingProductProfiles.objectionsJson,
      proofPointsJson: marketingProductProfiles.proofPointsJson,
      differentiatorsJson: marketingProductProfiles.differentiatorsJson,
      forbiddenClaimsJson: marketingProductProfiles.forbiddenClaimsJson,
      toneOfVoiceJson: marketingProductProfiles.toneOfVoiceJson,
      ctaLibraryJson: marketingProductProfiles.ctaLibraryJson,
      platformPositioningJson: marketingProductProfiles.platformPositioningJson,
      sourceMode: marketingProductProfiles.sourceMode,
      confidenceScore: marketingProductProfiles.confidenceScore,
      confirmedAt: marketingProductProfiles.confirmedAt,
      updatedAt: marketingProductProfiles.updatedAt,
    })
    .from(marketingProductProfiles);

  const brand = brandRows
    .filter((row) => String(row.brandName || "").trim().toLowerCase() === "equiprofile")
    .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())[0];

  if (!brand) throw new Error("EquiProfile brand kit is unavailable");

  const products = productRows.filter(
    (row) => String(row.appName || "").trim().toLowerCase() === "equiprofile",
  );

  return buildBusinessSnapshotFromRows(current.applicationId, brand, products);
}

export async function sendMarketingBusinessSnapshot(): Promise<BusinessSnapshotResult> {
  const current = connectorConfig();
  if (!current.enabled || current.connectorKey.length < 32 || !current.apiUrl.startsWith("https://")) {
    throw new Error("EquiProfile Marketing connector is disabled or not configured securely");
  }

  const payload = await buildMarketingBusinessSnapshot();
  const response = await fetch(`${current.apiUrl}/application-connectors/business-snapshot`, {
    method: "POST",
    headers: connectorHeaders(payload),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });

  const body = (await response.json().catch(() => ({}))) as ConnectorResponse<BusinessSnapshotResult>;
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message || `Marketing business snapshot failed (${response.status})`);
  }
  return body.data;
}
