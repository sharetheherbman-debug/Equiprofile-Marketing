import {
  normaliseSupplierCandidate,
  type SupplierCandidate,
} from "./productManager";

export type SupplierSourceRecord = {
  supplierSlug: string;
  supplierSku: string;
  ean?: string | null;
  title: string;
  factualDescription: string;
  brand?: string | null;
  supplierCostPence: number;
  availabilityStatus: SupplierCandidate["availabilityStatus"];
  sourceUpdatedAt: string;
  categoryHint?: string | null;
  leadTimeDays?: number | null;
};

export type IngestedSupplierRecord = {
  candidate: SupplierCandidate;
  provenance: {
    supplierSlug: string;
    sourceUpdatedAt: string;
    sourceType: "synthetic-development" | "connector";
  };
};

export function ingestSupplierRecords(
  records: SupplierSourceRecord[],
  sourceType: "synthetic-development" | "connector",
): {
  accepted: IngestedSupplierRecord[];
  rejected: Array<{ supplierSku: string; reason: string }>;
} {
  const accepted: IngestedSupplierRecord[] = [];
  const rejected: Array<{ supplierSku: string; reason: string }> = [];
  const seen = new Set<string>();
  for (const record of records) {
    if (
      !record.supplierSku?.trim() ||
      !record.title?.trim() ||
      !record.factualDescription?.trim() ||
      !Number.isInteger(record.supplierCostPence) ||
      record.supplierCostPence <= 0
    ) {
      rejected.push({
        supplierSku: record.supplierSku || "unknown",
        reason: "required factual record fields are missing or invalid",
      });
      continue;
    }
    const candidate = normaliseSupplierCandidate({
      supplierSku: record.supplierSku,
      ean: record.ean,
      title: record.title,
      factualDescription: record.factualDescription,
      brand: record.brand,
      supplierCostPence: record.supplierCostPence,
      availabilityStatus: record.availabilityStatus,
      sourceUpdatedAt: new Date(record.sourceUpdatedAt),
      categoryHint: record.categoryHint,
      leadTimeDays: record.leadTimeDays,
    });
    if (Number.isNaN(candidate.sourceUpdatedAt.getTime())) {
      rejected.push({
        supplierSku: candidate.supplierSku,
        reason: "source timestamp is invalid",
      });
      continue;
    }
    const key = candidate.ean
      ? `ean:${candidate.ean}`
      : `sku:${candidate.supplierSku}`;
    if (seen.has(key)) {
      rejected.push({
        supplierSku: candidate.supplierSku,
        reason: "duplicate source SKU or EAN in import run",
      });
      continue;
    }
    seen.add(key);
    accepted.push({
      candidate,
      provenance: {
        supplierSlug: record.supplierSlug,
        sourceUpdatedAt: candidate.sourceUpdatedAt.toISOString(),
        sourceType,
      },
    });
  }
  return { accepted, rejected };
}

/** Development-only fixture; it is not a real supplier catalogue and must never be published. */
export function syntheticDevelopmentFeed(
  now = new Date(),
): SupplierSourceRecord[] {
  return [
    {
      supplierSlug: "synthetic-development",
      supplierSku: "DEV-HAYNET-001",
      title: "Synthetic development haynet",
      factualDescription:
        "Development-only non-commercial record used to exercise the governed supplier ingestion pipeline.",
      brand: "EquiProfile Development",
      supplierCostPence: 900,
      availabilityStatus: "in_stock",
      sourceUpdatedAt: now.toISOString(),
      categoryHint: "stable and yard",
      leadTimeDays: 0,
    },
  ];
}
