import { and, desc, eq } from "drizzle-orm";
import { marketingProductProfiles } from "../../../../drizzle/schema";
import { getRuntimeConfig } from "../../../dynamicConfig";
import { getDb } from "../../../db";
import { createMediaAsset } from "../../growth-engine";
import { validateBrandScanUrl } from "../../growth-engine/brandScanner";

export const MIN_PRODUCT_PROFILE_CONFIDENCE = 60;

export type MarketingProductProfileRecord = {
  id?: number;
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  appName: string;
  domain: string | null;
  landingPageUrl: string | null;
  signupUrl: string | null;
  logoAssetId: number | null;
  brandColors: string[];
  targetAudiences: string[];
  primaryOffer: string | null;
  pricingDetails: string | null;
  coreFeatures: string[];
  benefits: string[];
  painPointsSolved: string[];
  objections: string[];
  proofPoints: string[];
  differentiators: string[];
  forbiddenClaims: string[];
  toneOfVoice: string[];
  ctaLibrary: string[];
  platformPositioning: Record<string, string>;
  extractedSourceUrls: string[];
  candidateLogoUrls: string[];
  candidateLogoAssetIds: number[];
  missingInfo: string[];
  sourceMode: "firecrawl" | "basic_fetch" | "manual";
  confidenceScore: number;
  lastScrapedAt: string | null;
  confirmedAt: string | null;
};

type ProductProfileUpsertInput = Partial<Omit<MarketingProductProfileRecord, "id" | "tenantId" | "workspaceId" | "hostAppId" | "lastScrapedAt" | "confirmedAt">> & {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  lastScrapedAt?: Date | null;
  confirmedAt?: Date | null;
  rawScrapeSummary?: Record<string, unknown> | null;
};

const EQUI_PROFILE_AUDIENCES = [
  "stable owners",
  "horse owners",
  "riding schools",
  "trainers",
  "yards",
  "equestrian businesses",
];
const EQUI_PROFILE_FEATURES = [
  "horse health records",
  "document tracking",
  "stable management",
  "scheduling",
  "staff visibility",
  "operational growth support",
];
const EQUI_PROFILE_BENEFITS = [
  "keep stable operations organized",
  "keep horse health records visible",
  "track important horse and stable documents",
  "coordinate schedules and staff",
  "support operational growth",
];
const DEFAULT_FORBIDDEN_CLAIMS = [
  "Do not invent customer counts, time savings, revenue gains, or testimonials.",
  "Do not claim publishing or analytics unless a configured connector proves it.",
];

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function unique(values: Array<string | null | undefined>, limit = 20) {
  return Array.from(new Set(values.map((value) => (value ?? "").replace(/\s+/g, " ").trim()).filter(Boolean))).slice(0, limit);
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractAttr(html: string, attr: string) {
  return Array.from(html.matchAll(new RegExp(`${attr}=["']([^"']+)["']`, "gi"))).map((match) => String(match[1]));
}

function extractMeta(html: string, name: string) {
  const first = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1];
  const second = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, "i"))?.[1];
  return (first ?? second ?? "").trim();
}

function extractHeadings(html: string) {
  return unique(Array.from(html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)).map((match) => stripHtml(String(match[1]))), 20);
}

function resolvePublicUrl(candidate: string, landingPageUrl: string) {
  try {
    const resolved = new URL(candidate, landingPageUrl);
    if (!["http:", "https:"].includes(resolved.protocol)) return null;
    validateBrandScanUrl(resolved.toString());
    return resolved.toString();
  } catch {
    return null;
  }
}

function extractLogoCandidates(html: string, landingPageUrl: string) {
  const imageTags = Array.from(html.matchAll(/<img[^>]+>/gi)).map((match) => String(match[0]));
  return unique(imageTags
    .filter((tag) => /logo|brand|mark/i.test(tag))
    .flatMap((tag) => extractAttr(tag, "src"))
    .map((src) => resolvePublicUrl(src, landingPageUrl)), 6);
}

function extractColors(html: string) {
  return unique(Array.from(html.matchAll(/#[0-9a-fA-F]{6}\b/g)).map((match) => match[0].toLowerCase()), 6);
}

function extractMatchingSentences(text: string, pattern: RegExp, limit = 8) {
  return unique(text.split(/[.!?]\s+/).filter((sentence) => pattern.test(sentence)), limit);
}

function inferAppName(html: string, landingPageUrl: string) {
  const title = stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const ogTitle = extractMeta(html, "og:title");
  const heading = extractHeadings(html)[0] ?? "";
  const fallback = new URL(landingPageUrl).hostname.replace(/^www\./, "").split(".")[0] ?? "Product";
  return (ogTitle || title || heading || fallback).split(/[|\-–—:]/)[0].trim() || "Product";
}

function profileMissingInfo(profile: Pick<MarketingProductProfileRecord,
  "appName" | "landingPageUrl" | "targetAudiences" | "primaryOffer" | "coreFeatures" | "benefits" | "ctaLibrary">) {
  return [
    !profile.appName ? "product name" : "",
    !profile.landingPageUrl ? "website or landing page URL" : "",
    !profile.targetAudiences.length ? "target audience" : "",
    !profile.primaryOffer ? "primary offer or trial details" : "",
    !profile.coreFeatures.length ? "core product features" : "",
    !profile.benefits.length ? "customer benefits" : "",
    !profile.ctaLibrary.length ? "campaign CTA" : "",
  ].filter(Boolean);
}

function confidenceFromMissingInfo(missingInfo: string[], hasSource: boolean, confirmed = false) {
  return Math.max(0, Math.min(100, 100 - missingInfo.length * 12 - (hasSource ? 0 : 12) + (confirmed ? 5 : 0)));
}

function equiProfileDetected(input: { appName: string; text: string; hostAppId?: string }) {
  return input.hostAppId?.toLowerCase() === "equiprofile"
    || /equiprofile/i.test(input.appName)
    || /(equine|equestrian|stable management|horse records)/i.test(input.text);
}

export function extractMarketingProductProfileFromHtml(input: {
  html: string;
  landingPageUrl: string;
  signupUrl?: string | null;
  productNotes?: string | null;
  hostAppId?: string;
  sourceMode?: "firecrawl" | "basic_fetch";
}) {
  const safeUrl = validateBrandScanUrl(input.landingPageUrl);
  const bodyText = stripHtml(input.html);
  const combinedText = `${bodyText} ${input.productNotes ?? ""}`.trim();
  const appName = inferAppName(input.html, safeUrl);
  const isEquiProfile = equiProfileDetected({ appName, text: combinedText, hostAppId: input.hostAppId });
  const links = extractAttr(input.html, "href").map((href) => resolvePublicUrl(href, safeUrl)).filter(Boolean) as string[];
  const signupUrl = input.signupUrl
    ? validateBrandScanUrl(input.signupUrl)
    : links.find((link) => /(signup|register|trial|start|join)/i.test(link)) ?? null;
  const trialText = extractMatchingSentences(combinedText, /(trial|pricing|price|free|per month|subscription|demo)/i, 6);
  const detectedAudiences = [
    ...EQUI_PROFILE_AUDIENCES.filter((audience) => combinedText.toLowerCase().includes(audience)),
    ...extractMatchingSentences(combinedText, /\bfor\s+[a-z]/i, 4),
  ];
  const detectedFeatures = extractMatchingSentences(combinedText, /(record|document|schedul|staff|manage|health|track|dashboard|visibility|operation)/i, 10);
  const detectedBenefits = extractMatchingSentences(combinedText, /(organize|save|grow|visibility|simplif|central|support|less admin|more time|coordinate)/i, 10);
  const detectedProof = extractMatchingSentences(combinedText, /(trusted|used by|customer|testimonial|review|rated|businesses|schools)/i, 6);
  const detectedCtas = extractMatchingSentences(combinedText, /(start|join|try|sign up|signup|register|book|demo|learn more|get started)/i, 8);
  const primaryOffer = trialText[0] ?? (signupUrl ? "Signup or free-trial offer available" : null);
  const draft = {
    tenantId: "",
    workspaceId: "",
    hostAppId: input.hostAppId ?? "equiprofile",
    appName,
    domain: new URL(safeUrl).hostname.replace(/^www\./, ""),
    landingPageUrl: safeUrl,
    signupUrl,
    logoAssetId: null,
    brandColors: extractColors(input.html),
    targetAudiences: unique(isEquiProfile ? [...detectedAudiences, ...EQUI_PROFILE_AUDIENCES] : detectedAudiences),
    primaryOffer,
    pricingDetails: trialText.join(" | ") || null,
    coreFeatures: unique(isEquiProfile ? [...detectedFeatures, ...EQUI_PROFILE_FEATURES] : detectedFeatures),
    benefits: unique(isEquiProfile ? [...detectedBenefits, ...EQUI_PROFILE_BENEFITS] : detectedBenefits),
    painPointsSolved: unique([
      ...extractMatchingSentences(combinedText, /(manual|paperwork|chaos|miss|lose time|scattered|admin|visibility)/i, 8),
      ...(isEquiProfile ? ["scattered stable admin", "limited visibility across horse records, documents, schedules, and staff"] : []),
    ]),
    objections: [],
    proofPoints: detectedProof,
    differentiators: unique([
      ...extractMatchingSentences(combinedText, /(all in one|single platform|central|built for|designed for|unlike)/i, 8),
      ...(isEquiProfile ? ["equine and stable management context in one operational platform"] : []),
    ]),
    forbiddenClaims: DEFAULT_FORBIDDEN_CLAIMS,
    toneOfVoice: unique([
      ...["professional", "trusted", "practical", "premium", "friendly"].filter((tone) => combinedText.toLowerCase().includes(tone)),
      ...(isEquiProfile ? ["professional", "helpful", "practical equestrian software"] : []),
    ]),
    ctaLibrary: unique([signupUrl ? `Start your free trial: ${signupUrl}` : null, ...detectedCtas]),
    platformPositioning: isEquiProfile ? {
      Facebook: "Show practical stable-management relief and free-trial CTA.",
      Instagram: "Use equestrian operations visuals with one concrete benefit.",
      LinkedIn: "Position operational visibility and growth support for equestrian businesses.",
      Email: "Use benefit-led education and a configured signup or free-trial CTA.",
    } : {} as Record<string, string>,
    extractedSourceUrls: unique([safeUrl, signupUrl, ...links], 20),
    candidateLogoUrls: extractLogoCandidates(input.html, safeUrl),
    candidateLogoAssetIds: [] as number[],
    sourceMode: input.sourceMode ?? "basic_fetch",
    confidenceScore: 0,
    missingInfo: [] as string[],
  };
  draft.missingInfo = profileMissingInfo(draft);
  draft.confidenceScore = confidenceFromMissingInfo(draft.missingInfo, true);
  return {
    profile: draft,
    rawScrapeSummary: {
      sourceMode: draft.sourceMode,
      landingPageUrl: safeUrl,
      title: inferAppName(input.html, safeUrl),
      metaDescription: extractMeta(input.html, "description") || extractMeta(input.html, "og:description"),
      headings: extractHeadings(input.html),
      bodyExcerpt: bodyText.slice(0, 4000),
      detectedLinks: links.slice(0, 30),
      detectedLogoCandidates: draft.candidateLogoUrls,
      detectedPricingOrTrialText: trialText,
    },
  };
}

function mapRow(row: typeof marketingProductProfiles.$inferSelect): MarketingProductProfileRecord {
  return {
    id: row.id,
    tenantId: row.tenantId,
    workspaceId: row.workspaceId,
    hostAppId: row.hostAppId,
    appName: row.appName,
    domain: row.domain,
    landingPageUrl: row.landingPageUrl,
    signupUrl: row.signupUrl,
    logoAssetId: row.logoAssetId,
    brandColors: parseJson(row.brandColorsJson, []),
    targetAudiences: parseJson(row.targetAudiencesJson, []),
    primaryOffer: row.primaryOffer,
    pricingDetails: row.pricingDetails,
    coreFeatures: parseJson(row.coreFeaturesJson, []),
    benefits: parseJson(row.benefitsJson, []),
    painPointsSolved: parseJson(row.painPointsSolvedJson, []),
    objections: parseJson(row.objectionsJson, []),
    proofPoints: parseJson(row.proofPointsJson, []),
    differentiators: parseJson(row.differentiatorsJson, []),
    forbiddenClaims: parseJson(row.forbiddenClaimsJson, []),
    toneOfVoice: parseJson(row.toneOfVoiceJson, []),
    ctaLibrary: parseJson(row.ctaLibraryJson, []),
    platformPositioning: parseJson(row.platformPositioningJson, {}),
    extractedSourceUrls: parseJson(row.extractedSourceUrlsJson, []),
    candidateLogoUrls: parseJson(row.candidateLogoUrlsJson, []),
    candidateLogoAssetIds: parseJson(row.candidateLogoAssetIdsJson, []),
    missingInfo: parseJson(row.missingInfoJson, []),
    sourceMode: row.sourceMode as MarketingProductProfileRecord["sourceMode"],
    confidenceScore: row.confidenceScore,
    lastScrapedAt: row.lastScrapedAt?.toISOString() ?? null,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
  };
}

export function productProfileSetupQuestions(profile?: MarketingProductProfileRecord | null) {
  const missing = profile?.missingInfo ?? ["website or landing page URL", "target audience", "primary offer or trial details", "core product benefits"];
  return unique(missing.map((item) => `What should campaigns use for ${item}?`), 4);
}

export function isMarketingProductProfileReady(profile?: MarketingProductProfileRecord | null) {
  return Boolean(profile && profile.confidenceScore >= MIN_PRODUCT_PROFILE_CONFIDENCE && profile.missingInfo.length <= 3);
}

export async function getMarketingProductProfile(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return { status: "setup_needed" as const, reason: "Database not available", profile: null, setupQuestions: productProfileSetupQuestions() };
  const [row] = await db.select().from(marketingProductProfiles).where(and(
    eq(marketingProductProfiles.tenantId, input.tenantId),
    eq(marketingProductProfiles.workspaceId, input.workspaceId),
    eq(marketingProductProfiles.hostAppId, input.hostAppId),
  )).orderBy(desc(marketingProductProfiles.updatedAt)).limit(1);
  if (!row) return { status: "setup_needed" as const, reason: "product_profile_missing", profile: null, setupQuestions: productProfileSetupQuestions() };
  const profile = mapRow(row);
  return {
    status: isMarketingProductProfileReady(profile) ? "ok" as const : "setup_needed" as const,
    reason: isMarketingProductProfileReady(profile) ? null : "product_profile_low_confidence",
    profile,
    setupQuestions: productProfileSetupQuestions(profile),
  };
}

export async function upsertMarketingProductProfile(input: ProductProfileUpsertInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const current = await getMarketingProductProfile(input);
  const existing = current.profile;
  const draft = {
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    hostAppId: input.hostAppId,
    appName: input.appName ?? existing?.appName ?? "Product",
    domain: input.domain ?? existing?.domain ?? null,
    landingPageUrl: input.landingPageUrl ?? existing?.landingPageUrl ?? null,
    signupUrl: input.signupUrl ?? existing?.signupUrl ?? null,
    logoAssetId: input.logoAssetId ?? existing?.logoAssetId ?? null,
    brandColors: input.brandColors ?? existing?.brandColors ?? [],
    targetAudiences: input.targetAudiences ?? existing?.targetAudiences ?? [],
    primaryOffer: input.primaryOffer ?? existing?.primaryOffer ?? null,
    pricingDetails: input.pricingDetails ?? existing?.pricingDetails ?? null,
    coreFeatures: input.coreFeatures ?? existing?.coreFeatures ?? [],
    benefits: input.benefits ?? existing?.benefits ?? [],
    painPointsSolved: input.painPointsSolved ?? existing?.painPointsSolved ?? [],
    objections: input.objections ?? existing?.objections ?? [],
    proofPoints: input.proofPoints ?? existing?.proofPoints ?? [],
    differentiators: input.differentiators ?? existing?.differentiators ?? [],
    forbiddenClaims: input.forbiddenClaims ?? existing?.forbiddenClaims ?? DEFAULT_FORBIDDEN_CLAIMS,
    toneOfVoice: input.toneOfVoice ?? existing?.toneOfVoice ?? [],
    ctaLibrary: input.ctaLibrary ?? existing?.ctaLibrary ?? [],
    platformPositioning: input.platformPositioning ?? existing?.platformPositioning ?? {},
    extractedSourceUrls: input.extractedSourceUrls ?? existing?.extractedSourceUrls ?? [],
    candidateLogoUrls: input.candidateLogoUrls ?? existing?.candidateLogoUrls ?? [],
    candidateLogoAssetIds: input.candidateLogoAssetIds ?? existing?.candidateLogoAssetIds ?? [],
    sourceMode: input.sourceMode ?? existing?.sourceMode ?? "manual",
  };
  const missingInfo = input.missingInfo ?? profileMissingInfo(draft);
  const confidenceScore = input.confidenceScore ?? confidenceFromMissingInfo(missingInfo, draft.extractedSourceUrls.length > 0, Boolean(input.confirmedAt ?? existing?.confirmedAt));
  const payload = {
    ...draft,
    brandColorsJson: JSON.stringify(draft.brandColors),
    targetAudiencesJson: JSON.stringify(draft.targetAudiences),
    coreFeaturesJson: JSON.stringify(draft.coreFeatures),
    benefitsJson: JSON.stringify(draft.benefits),
    painPointsSolvedJson: JSON.stringify(draft.painPointsSolved),
    objectionsJson: JSON.stringify(draft.objections),
    proofPointsJson: JSON.stringify(draft.proofPoints),
    differentiatorsJson: JSON.stringify(draft.differentiators),
    forbiddenClaimsJson: JSON.stringify(draft.forbiddenClaims),
    toneOfVoiceJson: JSON.stringify(draft.toneOfVoice),
    ctaLibraryJson: JSON.stringify(draft.ctaLibrary),
    platformPositioningJson: JSON.stringify(draft.platformPositioning),
    extractedSourceUrlsJson: JSON.stringify(draft.extractedSourceUrls),
    candidateLogoUrlsJson: JSON.stringify(draft.candidateLogoUrls),
    candidateLogoAssetIdsJson: JSON.stringify(draft.candidateLogoAssetIds),
    missingInfoJson: JSON.stringify(missingInfo),
    rawScrapeSummaryJson: input.rawScrapeSummary === undefined ? undefined : JSON.stringify(input.rawScrapeSummary ?? {}),
    confidenceScore,
    lastScrapedAt: input.lastScrapedAt ?? (existing?.lastScrapedAt ? new Date(existing.lastScrapedAt) : null),
    confirmedAt: input.confirmedAt ?? (existing?.confirmedAt ? new Date(existing.confirmedAt) : null),
  };
  if (existing?.id) {
    await db.update(marketingProductProfiles).set({ ...payload, updatedAt: new Date() }).where(eq(marketingProductProfiles.id, existing.id));
  } else {
    await db.insert(marketingProductProfiles).values(payload);
  }
  return getMarketingProductProfile(input);
}

async function fetchBasicHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    let targetUrl = validateBrandScanUrl(url);
    let response: Response | null = null;
    for (let redirectCount = 0; redirectCount <= 4; redirectCount += 1) {
      response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: { "user-agent": "EquiProfileMarketingProductScanner/1.0" },
        redirect: "manual",
      });
      if (![301, 302, 303, 307, 308].includes(response.status)) break;
      const location = response.headers.get("location");
      if (!location) throw new Error("Product site redirect did not include a location");
      targetUrl = validateBrandScanUrl(new URL(location, targetUrl).toString());
    }
    if (!response) throw new Error("Product site fetch did not return a response");
    if (!response.ok) throw new Error(`Product site fetch failed with status ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) throw new Error("Product site did not return HTML");
    const html = await response.text();
    if (Buffer.byteLength(html, "utf8") > 1_000_000) throw new Error("Product site HTML exceeds security limit");
    return html;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFirecrawlHtml(url: string) {
  const apiKey = await getRuntimeConfig("firecrawl_api_key", "FIRECRAWL_API_KEY");
  if (!apiKey) return null;
  const baseUrl = await getRuntimeConfig("firecrawl_base_url", "FIRECRAWL_BASE_URL") || "https://api.firecrawl.dev";
  const response = await fetch(`${String(baseUrl).replace(/\/$/, "")}/v1/scrape`, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ url: validateBrandScanUrl(url), formats: ["html"] }),
  });
  if (!response.ok) throw new Error(`Firecrawl scrape failed with status ${response.status}`);
  const body = await response.json() as { data?: { html?: string }; html?: string };
  const html = body.data?.html ?? body.html;
  if (!html) throw new Error("Firecrawl scrape returned no HTML");
  return html;
}

async function saveLogoCandidates(input: { tenantId: string; candidateLogoUrls: string[] }) {
  const ids: number[] = [];
  for (const publicUrl of input.candidateLogoUrls.slice(0, 3)) {
    try {
      const asset = await createMediaAsset({
        tenantId: input.tenantId,
        type: "image",
        task: "product_site_logo_candidate",
        provider: "product_intelligence",
        status: "created",
        publicUrl,
        outputMetadata: { candidateOnly: true, requiresBrandKitConfirmation: true, source: "product_site_scan" },
      });
      ids.push(asset.id);
    } catch {
      // Candidate URL remains available even when asset registry is unavailable.
    }
  }
  return ids;
}

function buildManualProfile(input: { landingPageUrl: string; signupUrl?: string | null; productNotes: string; hostAppId: string }) {
  const safeUrl = validateBrandScanUrl(input.landingPageUrl);
  const notes = input.productNotes.trim();
  const isEquiProfile = equiProfileDetected({ appName: input.hostAppId, text: notes, hostAppId: input.hostAppId });
  const draft = {
    appName: isEquiProfile ? "EquiProfile" : input.hostAppId,
    domain: new URL(safeUrl).hostname.replace(/^www\./, ""),
    landingPageUrl: safeUrl,
    signupUrl: input.signupUrl ? validateBrandScanUrl(input.signupUrl) : null,
    targetAudiences: isEquiProfile ? EQUI_PROFILE_AUDIENCES : [],
    primaryOffer: input.signupUrl ? "Signup or free-trial offer available" : null,
    coreFeatures: isEquiProfile ? EQUI_PROFILE_FEATURES : [],
    benefits: isEquiProfile ? EQUI_PROFILE_BENEFITS : [],
    painPointsSolved: isEquiProfile ? ["scattered stable admin", "limited operational visibility"] : [],
    differentiators: isEquiProfile ? ["equine and stable management context in one operational platform"] : [],
    forbiddenClaims: DEFAULT_FORBIDDEN_CLAIMS,
    toneOfVoice: isEquiProfile ? ["professional", "helpful", "practical equestrian software"] : [],
    ctaLibrary: input.signupUrl ? [`Start your free trial: ${input.signupUrl}`] : [],
    extractedSourceUrls: [safeUrl],
    sourceMode: "manual" as const,
  };
  return draft;
}

export async function scanMarketingProductSite(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  landingPageUrl: string;
  signupUrl?: string | null;
  productNotes?: string | null;
  forceRefresh?: boolean;
}) {
  const current = await getMarketingProductProfile(input);
  if (!input.forceRefresh && current.status === "ok" && current.profile?.landingPageUrl === input.landingPageUrl) return current;
  let html: string | null = null;
  let sourceMode: "firecrawl" | "basic_fetch" = "basic_fetch";
  let scrapeError: string | null = null;
  try {
    html = await fetchFirecrawlHtml(input.landingPageUrl);
    if (html) sourceMode = "firecrawl";
  } catch (error) {
    scrapeError = error instanceof Error ? error.message : String(error);
  }
  if (!html) {
    try {
      html = await fetchBasicHtml(input.landingPageUrl);
      sourceMode = "basic_fetch";
    } catch (error) {
      scrapeError = error instanceof Error ? error.message : String(error);
    }
  }
  if (!html) {
    if (!input.productNotes?.trim()) {
      return {
        status: "manual_setup_needed" as const,
        reason: scrapeError ?? "No scraper is available for this site.",
        profile: current.profile,
        setupQuestions: productProfileSetupQuestions(current.profile),
      };
    }
    const manual = buildManualProfile({ ...input, productNotes: input.productNotes });
    return upsertMarketingProductProfile({ ...input, ...manual, rawScrapeSummary: { sourceMode: "manual", scrapeError, productNotes: input.productNotes } });
  }
  const extracted = extractMarketingProductProfileFromHtml({ ...input, html, sourceMode });
  const candidateLogoAssetIds = await saveLogoCandidates({ tenantId: input.tenantId, candidateLogoUrls: extracted.profile.candidateLogoUrls });
  return upsertMarketingProductProfile({
    ...input,
    ...extracted.profile,
    candidateLogoAssetIds,
    lastScrapedAt: new Date(),
    rawScrapeSummary: { ...extracted.rawScrapeSummary, scrapeError },
  });
}

export async function refreshMarketingProductProfile(input: {
  tenantId: string;
  workspaceId: string;
  hostAppId: string;
  forceRefresh?: boolean;
}) {
  const current = await getMarketingProductProfile(input);
  if (!current.profile?.landingPageUrl) {
    return { ...current, status: "manual_setup_needed" as const, reason: "landing_page_url_missing" };
  }
  return scanMarketingProductSite({
    ...input,
    landingPageUrl: current.profile.landingPageUrl,
    signupUrl: current.profile.signupUrl,
    forceRefresh: input.forceRefresh ?? true,
  });
}

export async function confirmMarketingProductProfile(input: { tenantId: string; workspaceId: string; hostAppId: string; logoAssetId?: number | null }) {
  const current = await getMarketingProductProfile(input);
  if (!current.profile) throw new Error("Product profile not found");
  return upsertMarketingProductProfile({
    ...input,
    logoAssetId: input.logoAssetId ?? current.profile.logoAssetId,
    confirmedAt: new Date(),
    confidenceScore: Math.min(100, current.profile.confidenceScore + 5),
  });
}

export async function getMarketingProductDiagnostics(input: { tenantId: string; workspaceId: string; hostAppId: string }) {
  const db = await getDb();
  if (!db) return { status: "setup_needed" as const, reason: "Database not available" };
  const [row] = await db.select().from(marketingProductProfiles).where(and(
    eq(marketingProductProfiles.tenantId, input.tenantId),
    eq(marketingProductProfiles.workspaceId, input.workspaceId),
    eq(marketingProductProfiles.hostAppId, input.hostAppId),
  )).orderBy(desc(marketingProductProfiles.updatedAt)).limit(1);
  if (!row) return { status: "setup_needed" as const, reason: "product_profile_missing" };
  return {
    status: "ok" as const,
    profileId: row.id,
    sourceMode: row.sourceMode,
    rawScrapeSummary: parseJson(row.rawScrapeSummaryJson, {}),
    lastScrapedAt: row.lastScrapedAt?.toISOString() ?? null,
  };
}
