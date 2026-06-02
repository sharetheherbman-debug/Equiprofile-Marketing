export type MarketingCampaignQualityGate = {
  status: "passed" | "failed";
  reasons: string[];
  exportReady: boolean;
  postable: boolean;
};

const INTERNAL_COPY_PATTERNS: Array<[RegExp, string]> = [
  [/\bsignup_campaign\b/i, "Copy contains internal package labels."],
  [/\bsocial_post\b/i, "Copy contains internal content labels."],
  [/\bpaid_social_ad\b/i, "Copy contains internal content labels."],
  [/\bemail_campaign\b/i, "Copy contains internal content labels."],
  [/\bday_1\b/i, "Copy contains internal schedule labels."],
  [/\bvariant for\b/i, "Copy contains template scaffolding."],
  [/\bfastest route to\b/i, "Copy contains generic prompt scaffolding."],
  [/\badd signup url before export\b/i, "Copy contains setup instructions inside campaign copy."],
  [/\{\s*"[a-z0-9_]+":/i, "Copy contains raw JSON metadata."],
];

const EQUINE_TERMS = /\b(horse|horses|stable|stables|equine|equestrian|yard|yards)\b/i;
const AUTOMOTIVE_TERMS = /\b(bmw|car|cars|vehicle|vehicles|automotive|dealership|test drive)\b/i;

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function validateMarketingCampaignQuality(input: {
  productCategory?: string | null;
  sourcePrompt?: string | null;
  cta?: string | null;
  benefits?: string[];
  features?: string[];
  copyBlocks: string[];
}): MarketingCampaignQualityGate {
  const copyBlocks = input.copyBlocks.map((block) => block.trim()).filter(Boolean);
  const joined = copyBlocks.join("\n");
  const reasons: string[] = [];
  for (const [pattern, reason] of INTERNAL_COPY_PATTERNS) {
    if (pattern.test(joined)) reasons.push(reason);
  }
  const normalizedBlocks = copyBlocks.map(normalized).filter(Boolean);
  if (new Set(normalizedBlocks).size !== normalizedBlocks.length) reasons.push("Campaign contains repeated copy blocks.");
  const sourcePrompt = normalized(input.sourcePrompt ?? "");
  if (sourcePrompt && normalizedBlocks.some((block) => block === sourcePrompt)) reasons.push("User prompt was copied as campaign copy.");
  const category = input.productCategory ?? "unknown";
  if (category !== "equine_stable_management" && EQUINE_TERMS.test(joined)) reasons.push("Campaign copy contains equine language for a non-equine product.");
  if (category !== "automotive" && AUTOMOTIVE_TERMS.test(joined)) reasons.push("Campaign copy contains automotive language for a non-automotive product.");
  if (!String(input.cta ?? "").trim()) reasons.push("Campaign CTA is missing.");
  const productFacts = [...(input.benefits ?? []), ...(input.features ?? [])].map(normalized).filter(Boolean);
  if (productFacts.length && !productFacts.some((fact) => normalized(joined).includes(fact))) {
    reasons.push("Campaign copy does not contain a product-specific feature or benefit.");
  }
  return {
    status: reasons.length ? "failed" : "passed",
    reasons: Array.from(new Set(reasons)),
    exportReady: reasons.length === 0,
    postable: false,
  };
}
