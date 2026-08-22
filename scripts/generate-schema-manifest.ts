import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getTableName } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/mysql-core";
import * as schema from "../drizzle/schema";

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
  source: "typed-drizzle-schema";
  limitations: string[];
  tableCount: number;
  tables: ManifestTable[];
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
const tables = Object.values(schema)
  .map(tableManifest)
  .filter((table): table is ManifestTable => table !== null)
  .sort((left, right) => left.name.localeCompare(right.name));
const canonical = {
  format: "equiprofile-final-core-schema-manifest/v1" as const,
  source: "typed-drizzle-schema" as const,
  limitations: [
    "This manifest is deterministic for typed Drizzle tables only.",
    "Commerce tables currently referenced through raw SQL remain an explicit forward-reconciliation requirement until represented by the canonical schema migration and manifest.",
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
