import { describe, expect, it } from "vitest";
import {
  isDuplicateCandidate,
  normaliseSupplierCandidate,
  parseEnrichmentProposal,
  priceCandidate,
  scoreCandidate,
  type SupplierCandidate,
} from "./commerce/productManager";

const candidate: SupplierCandidate = {
  supplierSku: " dev-01 ",
  ean: "50 123-456",
  title: "  Equine   grooming kit ",
  factualDescription:
    "A synthetic development record with no customer-facing factual claim.",
  brand: " Development ",
  supplierCostPence: 1000,
  rrpPence: 1800,
  availabilityStatus: "in_stock",
  sourceUpdatedAt: new Date(),
  categoryHint: "horse grooming",
};

describe("governed Product Manager", () => {
  it("normalises supplier identifiers and detects SKU, EAN, and title duplicates", () => {
    const normalised = normaliseSupplierCandidate(candidate);
    expect(normalised.supplierSku).toBe("DEV-01");
    expect(normalised.ean).toBe("50123456");
    expect(
      isDuplicateCandidate(candidate, [
        { supplierSku: "DEV-01", ean: null, title: "other" },
      ]),
    ).toBe(true);
    expect(
      isDuplicateCandidate(candidate, [
        { supplierSku: "different", ean: "50123456", title: "other" },
      ]),
    ).toBe(true);
  });

  it("scores source freshness and duplicate risk without auto-publication", () => {
    const clean = scoreCandidate(candidate, false);
    const duplicate = scoreCandidate(candidate, true);
    expect(clean.total).toBeGreaterThan(duplicate.total);
    expect(clean.reasons).toContain("equestrian relevance detected");
  });

  it("requires review for an abnormal price movement", () => {
    const proposal = priceCandidate(candidate, 1100, {
      targetGrossMarginBasisPoints: 4000,
      minimumGrossMarginBasisPoints: 2500,
      minimumAbsoluteProfitPence: 300,
      maxAutomaticMovementBasisPoints: 1000,
    });
    expect(proposal.needsHumanReview).toBe(true);
  });

  it("fails closed when optional AI enrichment is empty or malformed", () => {
    expect(parseEnrichmentProposal({ choices: [] })).toMatchObject({
      status: "unavailable",
      proposal: null,
    });
    expect(
      parseEnrichmentProposal({
        choices: [{ message: { content: "not valid JSON" } }],
      }),
    ).toMatchObject({ status: "unavailable", proposal: null });
    expect(
      parseEnrichmentProposal({
        choices: [{ message: { content: '{"title":"Draft"}' } }],
      }),
    ).toMatchObject({
      status: "completed",
      proposal: { title: "Draft" },
    });
  });
});
