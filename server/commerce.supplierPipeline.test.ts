import { describe, expect, it } from "vitest";
import {
  ingestSupplierRecords,
  syntheticDevelopmentFeed,
} from "./commerce/supplierPipeline";

describe("supplier ingestion pipeline", () => {
  it("normalises valid factual records and preserves provenance", () => {
    const result = ingestSupplierRecords(
      syntheticDevelopmentFeed(new Date("2026-01-02T03:04:05.000Z")),
      "synthetic-development",
    );
    expect(result.rejected).toEqual([]);
    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0].candidate.supplierSku).toBe("DEV-HAYNET-001");
    expect(result.accepted[0].provenance.sourceType).toBe(
      "synthetic-development",
    );
  });

  it("rejects malformed records and duplicate source identifiers", () => {
    const source = syntheticDevelopmentFeed();
    const result = ingestSupplierRecords(
      [
        ...source,
        { ...source[0], supplierSku: "dev-haynet-001" },
        { ...source[0], supplierSku: "", title: "" },
      ],
      "synthetic-development",
    );
    expect(result.accepted).toHaveLength(1);
    expect(result.rejected.map((entry) => entry.reason)).toContain(
      "duplicate source SKU or EAN in import run",
    );
    expect(result.rejected.map((entry) => entry.reason)).toContain(
      "required factual record fields are missing or invalid",
    );
  });
});
