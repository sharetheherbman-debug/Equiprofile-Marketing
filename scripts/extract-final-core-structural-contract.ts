import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const inputArgument = process.argv.find((argument) => argument.startsWith("--input="));
const outputArgument = process.argv.find((argument) => argument.startsWith("--out="));
if (!inputArgument) {
  throw new Error("Use --input=<successful read-only inspection JSON>.");
}

const inputPath = resolve(inputArgument.slice("--input=".length));
const outputPath = resolve(
  outputArgument?.slice("--out=".length) ?? "schema/final-core-structural-contract.json",
);
const inspection = JSON.parse(readFileSync(inputPath, "utf8")) as {
  classification?: string;
  differences?: Record<string, unknown>;
  observed?: {
    tables?: Array<{
      name: string;
      indexes: Array<{ name: string; unique: boolean; columns: string[] }>;
      foreignKeys: Array<{ name: string; columns: string[]; foreignTable: string | null }>;
    }>;
  };
};

if (inspection.classification !== "CURRENT_NO_ACTION_REQUIRED") {
  throw new Error("Structural contract may only be extracted from a successful current-schema inspection.");
}
if (Object.values(inspection.differences ?? {}).some((value) => Array.isArray(value) && value.length > 0)) {
  throw new Error("Structural contract extraction refused because the inspection reported differences.");
}

const tables = [...(inspection.observed?.tables ?? [])]
  .map((table) => ({
    name: table.name,
    indexes: [...table.indexes].sort((left, right) => left.name.localeCompare(right.name)),
    foreignKeys: [...table.foreignKeys].sort((left, right) => left.name.localeCompare(right.name)),
  }))
  .sort((left, right) => left.name.localeCompare(right.name));
if (!tables.length) throw new Error("Inspection contains no observed application tables.");

const canonical = {
  format: "equiprofile-final-core-structural-contract/v1",
  source: "successful-disposable-fresh-provision-inspection",
  tableCount: tables.length,
  tables,
};
const fingerprint = createHash("sha256")
  .update(JSON.stringify(canonical, null, 2))
  .digest("hex");
writeFileSync(outputPath, `${JSON.stringify({ ...canonical, fingerprint }, null, 2)}\n`);
console.log(JSON.stringify({ inputPath, outputPath, tableCount: tables.length, fingerprint }, null, 2));
