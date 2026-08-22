import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getTableName } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/mysql-core";
import * as schema from "../drizzle/schema";
import { finalCoreCommerceContractMetadata, getFinalCoreCommerceManifestTables } from "./commerceSchemaManifest";

type ManifestColumn = {
  name: string;
  sqlType: string;
  notNull: boolean;
  hasDefault: boolean;
  primaryKey: boolean;
  default: string | null;
  enumValues: readonly string[] | undefined;
};

type ManifestTable = {
  name: string;
  columns: ManifestColumn[];
  indexes: Array<{ name: string; unique: boolean; columns: string[] }>;
  foreignKeys: Array<{
    name: string;
    columns: string[];
    foreignTable: string | null;
  }>;
  uniqueConstraints: Array<{ name: string; columns: string[] }>;
};

type SchemaManifest = {
  format: "equiprofile-final-core-schema-manifest/v1";
  generatedAt: string;
  source: string;
  limitations: string[];
  tableCount: number;
  tables: ManifestTable[];
  fingerprint: string;
};

type StructuralContract = {
  format: "equiprofile-final-core-structural-contract/v1";
  source: string;
  tableCount: number;
  tables: Array<Pick<ManifestTable, "name" | "indexes" | "foreignKeys">>;
  fingerprint: string;
};

function stable(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function columnName(column: any): string {
  return String(column?.name ?? column?.config?.name ?? "unknown");
}

function indexColumns(index: any): string[] {
  const columns = index?.config?.columns ?? index?.columns ?? [];
  return columns.map((column: any) => columnName(column)).sort();
}

function tableManifest(value: any): ManifestTable | null {
  try {
    const name = getTableName(value);
    const config = getTableConfig(value) as any;
    const columns: ManifestColumn[] = (config.columns ?? [])
      .map((column: any) => ({
        name: String(column.name),
        sqlType: String(column.getSQLType?.() ?? "unknown"),
        notNull: Boolean(column.notNull),
        hasDefault: Boolean(column.hasDefault),
        primaryKey: Boolean(column.primary),
        default:
          column.default === undefined || column.default === null
            ? null
            : String(column.default),
        enumValues: column.enumValues,
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
    const indexes = (config.indexes ?? [])
      .map((index: any) => ({
        name: String(index.config?.name ?? index.name ?? "unnamed"),
        unique: Boolean(index.config?.unique ?? index.unique),
        columns: indexColumns(index),
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
    const foreignKeys = (config.foreignKeys ?? [])
      .map((foreignKey: any) => ({
        name: String(foreignKey.getName?.() ?? foreignKey.name ?? "unnamed"),
        columns: (foreignKey.reference?.().columns ?? foreignKey.columns ?? [])
          .map((column: any) => columnName(column))
          .sort(),
        foreignTable: (() => {
          try {
            return getTableName(foreignKey.reference?.().foreignTable);
          } catch {
            return null;
          }
        })(),
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
    const uniqueConstraints = (config.uniqueConstraints ?? [])
      .map((constraint: any) => ({
        name: String(constraint.getName?.() ?? constraint.name ?? "unnamed"),
        columns: (constraint.columns ?? [])
          .map((column: any) => columnName(column))
          .sort(),
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
    return { name, columns, indexes, foreignKeys, uniqueConstraints };
  } catch {
    return null;
  }
}

const outputArgument = process.argv.find((argument) =>
  argument.startsWith("--out="),
);
const outputPath = resolve(
  outputArgument?.slice("--out=".length) ??
    "docs/final-core-schema-manifest.json",
);
const typedTables = Object.values(schema)
  .map(tableManifest)
  .filter((table): table is ManifestTable => table !== null);
const commerceTables = getFinalCoreCommerceManifestTables() as ManifestTable[];
const sourceTables = [...typedTables, ...commerceTables]
  .sort((left, right) => left.name.localeCompare(right.name));
const duplicateTableNames = sourceTables
  .map((table) => table.name)
  .filter((name, index, names) => names.indexOf(name) !== index);
if (duplicateTableNames.length) {
  throw new Error(`Final-Core manifest has duplicate table definitions: ${[...new Set(duplicateTableNames)].join(", ")}`);
}

const structuralContractPath = resolve("schema/final-core-structural-contract.json");
const structuralContract = JSON.parse(readFileSync(structuralContractPath, "utf8")) as StructuralContract;
const { fingerprint: structuralFingerprint, ...structuralCanonical } = structuralContract;
const calculatedStructuralFingerprint = createHash("sha256")
  .update(stable(structuralCanonical))
  .digest("hex");
if (structuralContract.format !== "equiprofile-final-core-structural-contract/v1" || structuralFingerprint !== calculatedStructuralFingerprint) {
  throw new Error("Final-Core structural contract is missing, malformed, or has an unexpected fingerprint.");
}
const structuralByTable = new Map(structuralContract.tables.map((table) => [table.name, table]));
if (structuralByTable.size !== sourceTables.length || sourceTables.some((table) => !structuralByTable.has(table.name))) {
  throw new Error("Final-Core structural contract does not cover exactly the typed and Commerce schema tables.");
}
const tables = sourceTables
  .map((table) => ({
    ...table,
    indexes: structuralByTable.get(table.name)!.indexes,
    foreignKeys: structuralByTable.get(table.name)!.foreignKeys,
  }))
  .sort((left, right) => left.name.localeCompare(right.name));
const canonical = {
  format: "equiprofile-final-core-schema-manifest/v1" as const,
  source: "typed-drizzle-schema+final-commerce-contract" as const,
  limitations: [
    "The typed Drizzle schema and reviewed final-Core Commerce contract are deterministic source inputs.",
    `Commerce contract SHA-256: ${finalCoreCommerceContractMetadata.sha256}.`,
    `Structural contract SHA-256: ${structuralFingerprint}.`,
    "The manifest generator never connects to or modifies a database.",
  ],
  tableCount: tables.length,
  tables,
};
const fingerprint = createHash("sha256")
  .update(stable(canonical))
  .digest("hex");
const manifest: SchemaManifest = {
  ...canonical,
  generatedAt: new Date().toISOString(),
  fingerprint,
};
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${stable(manifest)}\n`);
console.log(
  JSON.stringify(
    {
      outputPath,
      tableCount: manifest.tableCount,
      fingerprint: manifest.fingerprint,
    },
    null,
    2,
  ),
);
