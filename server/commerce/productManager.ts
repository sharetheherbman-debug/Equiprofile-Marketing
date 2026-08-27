import { invokeLLM, isAIConfigured } from "../_core/llm";
import { recommendRetailPrice, type PricePolicy } from "./domain";

export type SupplierCandidate = {
  supplierSku: string;
  ean?: string | null;
  title: string;
  factualDescription: string;
  brand?: string | null;
  supplierCostPence: number;
  rrpPence?: number | null;
  availabilityStatus:
    | "in_stock"
    | "low_stock"
    | "on_order"
    | "stale"
    | "unavailable";
  sourceUpdatedAt: Date;
  leadTimeDays?: number | null;
  categoryHint?: string | null;
};

export type ProductManagerScore = {
  relevance: number;
  completeness: number;
  freshness: number;
  margin: number;
  duplicateRisk: number;
  total: number;
  reasons: string[];
};

export function normaliseSupplierCandidate(
  input: SupplierCandidate,
): SupplierCandidate {
  return {
    ...input,
    supplierSku: input.supplierSku.trim().toUpperCase(),
    ean: input.ean?.replace(/\D/g, "") || null,
    title: input.title.trim().replace(/\s+/g, " "),
    factualDescription: input.factualDescription.trim(),
    brand: input.brand?.trim() || null,
  };
}

export function isDuplicateCandidate(
  candidate: SupplierCandidate,
  existing: Array<{ supplierSku: string; ean?: string | null; title: string }>,
) {
  const normalised = normaliseSupplierCandidate(candidate);
  const title = normalised.title.toLowerCase();
  return existing.some(
    (row) =>
      row.supplierSku.toUpperCase() === normalised.supplierSku ||
      (!!normalised.ean && row.ean === normalised.ean) ||
      row.title.trim().toLowerCase() === title,
  );
}

export function scoreCandidate(
  candidate: SupplierCandidate,
  duplicate: boolean,
  now = new Date(),
): ProductManagerScore {
  const ageHours =
    Math.max(0, now.getTime() - candidate.sourceUpdatedAt.getTime()) /
    3_600_000;
  const freshness = ageHours <= 24 ? 20 : ageHours <= 72 ? 10 : 0;
  const completeness =
    [
      candidate.supplierSku,
      candidate.title,
      candidate.factualDescription,
      candidate.supplierCostPence > 0,
      candidate.brand,
    ].filter(Boolean).length * 4;
  const relevance =
    /horse|equine|rider|stable|tack|groom|rug|bridle|saddle|yard/i.test(
      `${candidate.title} ${candidate.categoryHint ?? ""}`,
    )
      ? 25
      : 0;
  const margin =
    candidate.rrpPence && candidate.rrpPence > candidate.supplierCostPence
      ? 20
      : 8;
  const duplicateRisk = duplicate ? 25 : 0;
  const reasons = [
    duplicate ? "duplicate candidate" : "unique identifier",
    freshness ? "source freshness acceptable" : "source stale",
    relevance
      ? "equestrian relevance detected"
      : "manual category review required",
  ];
  return {
    relevance,
    completeness,
    freshness,
    margin,
    duplicateRisk,
    total: Math.max(
      0,
      relevance + completeness + freshness + margin - duplicateRisk,
    ),
    reasons,
  };
}

export function priceCandidate(
  candidate: SupplierCandidate,
  currentRetailPence: number | null,
  policy: PricePolicy,
) {
  return recommendRetailPrice(
    candidate.supplierCostPence,
    currentRetailPence,
    policy,
  );
}

export type EnrichmentResult =
  | {
      status: "not_configured" | "unavailable";
      proposal: null;
      reason?: string;
    }
  | {
      status: "completed";
      proposal: Record<string, unknown>;
    };

/**
 * The enrichment is a non-authoritative drafting aid. A malformed model reply
 * must never block a governed proposal workflow, publish a product, or turn
 * unavailable supplier data into a customer-facing claim.
 */
export function parseEnrichmentProposal(response: unknown): EnrichmentResult {
  const content =
    response && typeof response === "object"
      ? (
          response as {
            choices?: Array<{ message?: { content?: unknown } }>;
          }
        ).choices?.[0]?.message?.content
      : undefined;

  if (typeof content !== "string" || content.trim().length === 0) {
    return {
      status: "unavailable",
      proposal: null,
      reason: "The AI provider returned no usable structured copy.",
    };
  }

  try {
    const proposal: unknown = JSON.parse(content);
    if (!proposal || typeof proposal !== "object" || Array.isArray(proposal)) {
      throw new Error("Structured copy was not an object.");
    }
    return {
      status: "completed",
      proposal: proposal as Record<string, unknown>,
    };
  } catch {
    return {
      status: "unavailable",
      proposal: null,
      reason: "The AI provider returned malformed structured copy.",
    };
  }
}

export async function enrichCandidateCopy(
  candidate: SupplierCandidate,
): Promise<EnrichmentResult> {
  if (!(await isAIConfigured()))
    return { status: "not_configured" as const, proposal: null };
  const factual = JSON.stringify({
    title: candidate.title,
    brand: candidate.brand,
    factualDescription: candidate.factualDescription,
    categoryHint: candidate.categoryHint,
  });
  try {
    const response = await invokeLLM({
      maxTokens: 700,
      messages: [
        {
          role: "system",
          content:
            "You create concise original ecommerce marketing copy. Use only supplied factual data. Do not invent specifications, materials, certifications, health claims, delivery promises, or safety claims. Return strict JSON.",
        },
        {
          role: "user",
          content: `Create a title recommendation, description, three feature bullets, SEO title, SEO description, tags, and category suggestion from this supplier fact record: ${factual}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "commerce_copy",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              features: { type: "array", items: { type: "string" } },
              seoTitle: { type: "string" },
              seoDescription: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              categorySuggestion: { type: "string" },
            },
            required: [
              "title",
              "description",
              "features",
              "seoTitle",
              "seoDescription",
              "tags",
              "categorySuggestion",
            ],
            additionalProperties: false,
          },
        },
      },
    });
    return parseEnrichmentProposal(response);
  } catch (error) {
    return {
      status: "unavailable",
      proposal: null,
      reason:
        error instanceof Error
          ? `AI enrichment was unavailable: ${error.message}`
          : "AI enrichment was unavailable.",
    };
  }
}
