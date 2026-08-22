import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mysql from "mysql2/promise";

type ManifestColumn = {
  name: string;
  sqlType: string;
  notNull: boolean;
  hasDefault: boolean;
  primaryKey: boolean;
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
type Manifest = {
  format: string;
  fingerprint: string;
  tableCount: number;
  tables: ManifestTable[];
};
type SupportedManagementBaseline = {
  format: "equiprofile-supported-management-baseline/v1";
  schemaFingerprint: string;
  expectedMigrations: Array<{ tag: string; hash: string; when: number }>;
  fingerprint: string;
};

type ActualTable = {
  name: string;
  columns: Array<{
    name: string;
    sqlType: string;
    notNull: boolean;
    hasDefault: boolean;
    primaryKey: boolean;
  }>;
  indexes: Array<{ name: string; unique: boolean; columns: string[] }>;
  foreignKeys: Array<{
    name: string;
    columns: string[];
    foreignTable: string | null;
  }>;
};

const argument = (name: string): string | undefined =>
  process.argv
    .find((value) => value.startsWith(`${name}=`))
    ?.slice(name.length + 1);
const manifestPath = resolve(
  argument("--manifest") ?? "docs/final-core-schema-manifest.json",
);
const supportedManagementBaselinePath = resolve(
  argument("--supported-management-baseline") ?? "schema/supported-management-baseline.json",
);
const databaseUrl = argument("--database-url") ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or --database-url is required; the inspector is read-only.",
  );
}

function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

const inspectorSystemTables = new Set(["__drizzle_migrations", "coreSchemaState"]);

function columnSqlTypesAreCompatible(expectedType: string, actualType: string): boolean {
  const expected = expectedType.trim().toLowerCase().replace(/\(\d+\)/g, "").replace(/\s+/g, "");
  const actual = actualType.trim().toLowerCase().replace(/\(\d+\)/g, "").replace(/\s+/g, "");
  // MariaDB reports Drizzle's `boolean` as TINYINT(1). They are semantically
  // equivalent in this MySQL-compatible Core schema and must not create a
  // false drift classification after a clean provision.
  if (expected === "boolean") return actual === "boolean" || actual === "tinyint";
  return actual.startsWith(expected);
}
function sorted<T>(items: T[], compare: (left: T, right: T) => number): T[] {
  return [...items].sort(compare);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
if (manifest.format !== "equiprofile-final-core-schema-manifest/v1") {
  throw new Error(`Unsupported manifest format: ${manifest.format}`);
}
const supportedManagementBaseline = JSON.parse(
  readFileSync(supportedManagementBaselinePath, "utf8"),
) as SupportedManagementBaseline;
if (
  supportedManagementBaseline.format !== "equiprofile-supported-management-baseline/v1" ||
  supportedManagementBaseline.expectedMigrations.length !== 5
) {
  throw new Error("Unsupported or incomplete supported Management baseline manifest.");
}

const connection = await mysql.createConnection(databaseUrl);
try {
  const [[schemaRow]] = await connection.query<Array<{ schemaName: string }>>(
    "SELECT DATABASE() AS schemaName",
  );
  if (!schemaRow?.schemaName)
    throw new Error("The connection has no selected database.");
  const schemaName = schemaRow.schemaName;
  const [tableRows] = await connection.query<Array<{ tableName: string }>>(
    "SELECT TABLE_NAME AS tableName FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME",
    [schemaName],
  );
  const actualTables: ActualTable[] = [];
  for (const { tableName } of tableRows) {
    if (inspectorSystemTables.has(tableName)) continue;
    const [columnRows] = await connection.query<
      Array<{
        name: string;
        dataType: string;
        columnType: string;
        isNullable: "YES" | "NO";
        columnDefault: string | null;
        columnKey: string;
      }>
    >(
      "SELECT COLUMN_NAME AS name, DATA_TYPE AS dataType, COLUMN_TYPE AS columnType, IS_NULLABLE AS isNullable, COLUMN_DEFAULT AS columnDefault, COLUMN_KEY AS columnKey FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
      [schemaName, tableName],
    );
    const [indexRows] = await connection.query<
      Array<{
        name: string;
        nonUnique: number;
        columnName: string;
        sequence: number;
      }>
    >(
      "SELECT INDEX_NAME AS name, NON_UNIQUE AS nonUnique, COLUMN_NAME AS columnName, SEQ_IN_INDEX AS sequence FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY INDEX_NAME, SEQ_IN_INDEX",
      [schemaName, tableName],
    );
    const [foreignKeyRows] = await connection.query<
      Array<{
        name: string;
        columnName: string;
        foreignTable: string;
        sequence: number;
      }>
    >(
      "SELECT CONSTRAINT_NAME AS name, COLUMN_NAME AS columnName, REFERENCED_TABLE_NAME AS foreignTable, ORDINAL_POSITION AS sequence FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY CONSTRAINT_NAME, ORDINAL_POSITION",
      [schemaName, tableName],
    );
    const indexMap = new Map<
      string,
      { name: string; unique: boolean; columns: string[] }
    >();
    for (const row of indexRows) {
      const index = indexMap.get(row.name) ?? {
        name: row.name,
        unique: Number(row.nonUnique) === 0,
        columns: [],
      };
      index.columns.push(row.columnName);
      indexMap.set(row.name, index);
    }
    const foreignKeyMap = new Map<
      string,
      { name: string; columns: string[]; foreignTable: string | null }
    >();
    for (const row of foreignKeyRows) {
      const foreignKey = foreignKeyMap.get(row.name) ?? {
        name: row.name,
        columns: [],
        foreignTable: row.foreignTable,
      };
      foreignKey.columns.push(row.columnName);
      foreignKeyMap.set(row.name, foreignKey);
    }
    actualTables.push({
      name: tableName,
      columns: columnRows.map((row) => ({
        name: row.name,
        sqlType: row.columnType.toLowerCase(),
        notNull: row.isNullable === "NO",
        hasDefault: row.columnDefault !== null,
        primaryKey: row.columnKey === "PRI",
      })),
      indexes: sorted([...indexMap.values()], (left, right) =>
        left.name.localeCompare(right.name),
      ),
      foreignKeys: sorted([...foreignKeyMap.values()], (left, right) =>
        left.name.localeCompare(right.name),
      ),
    });
  }
  const expected = new Map(manifest.tables.map((table) => [table.name, table]));
  const actual = new Map(actualTables.map((table) => [table.name, table]));
  const missingTables = manifest.tables
    .map((table) => table.name)
    .filter((name) => !actual.has(name));
  const extraTables = actualTables
    .map((table) => table.name)
    .filter((name) => !expected.has(name));
  const missingColumns: string[] = [];
  const unexpectedColumns: string[] = [];
  const incompatibleColumns: string[] = [];
  const missingIndexes: string[] = [];
  const unexpectedIndexes: string[] = [];
  const incompatibleIndexes: string[] = [];
  const missingForeignKeys: string[] = [];
  const unexpectedForeignKeys: string[] = [];
  const incompatibleForeignKeys: string[] = [];
  for (const [tableName, expectedTable] of expected) {
    const actualTable = actual.get(tableName);
    if (!actualTable) continue;
    const expectedColumns = new Map(
      expectedTable.columns.map((column) => [column.name, column]),
    );
    const actualColumns = new Map(
      actualTable.columns.map((column) => [column.name, column]),
    );
    for (const [columnName, expectedColumn] of expectedColumns) {
      const actualColumn = actualColumns.get(columnName);
      if (!actualColumn) {
        missingColumns.push(`${tableName}.${columnName}`);
      } else if (
        actualColumn.notNull !== expectedColumn.notNull ||
        actualColumn.primaryKey !== expectedColumn.primaryKey ||
        !columnSqlTypesAreCompatible(expectedColumn.sqlType, actualColumn.sqlType)
      ) {
        incompatibleColumns.push(`${tableName}.${columnName}`);
      }
    }
    for (const columnName of actualColumns.keys()) {
      if (!expectedColumns.has(columnName))
        unexpectedColumns.push(`${tableName}.${columnName}`);
    }

    const expectedIndexes = new Map(
      [
        ...expectedTable.indexes,
        ...expectedTable.uniqueConstraints.map((constraint) => ({
          name: constraint.name,
          unique: true,
          columns: constraint.columns,
        })),
      ]
        .filter((index) => index.name !== "PRIMARY")
        .map((index) => [index.name, index]),
    );
    const actualIndexes = new Map(
      actualTable.indexes
        .filter((index) => index.name !== "PRIMARY")
        .map((index) => [index.name, index]),
    );
    for (const [indexName, expectedIndex] of expectedIndexes) {
      const actualIndex = actualIndexes.get(indexName);
      if (!actualIndex) {
        missingIndexes.push(`${tableName}.${indexName}`);
      } else if (
        actualIndex.unique !== expectedIndex.unique ||
        actualIndex.columns.join(",") !== expectedIndex.columns.join(",")
      ) {
        incompatibleIndexes.push(`${tableName}.${indexName}`);
      }
    }
    for (const indexName of actualIndexes.keys()) {
      if (!expectedIndexes.has(indexName)) unexpectedIndexes.push(`${tableName}.${indexName}`);
    }

    const expectedForeignKeys = new Map(
      expectedTable.foreignKeys.map((foreignKey) => [foreignKey.name, foreignKey]),
    );
    const actualForeignKeys = new Map(
      actualTable.foreignKeys.map((foreignKey) => [foreignKey.name, foreignKey]),
    );
    for (const [foreignKeyName, expectedForeignKey] of expectedForeignKeys) {
      const actualForeignKey = actualForeignKeys.get(foreignKeyName);
      if (!actualForeignKey) {
        missingForeignKeys.push(`${tableName}.${foreignKeyName}`);
      } else if (
        actualForeignKey.foreignTable !== expectedForeignKey.foreignTable ||
        actualForeignKey.columns.join(",") !== expectedForeignKey.columns.join(",")
      ) {
        incompatibleForeignKeys.push(`${tableName}.${foreignKeyName}`);
      }
    }
    for (const foreignKeyName of actualForeignKeys.keys()) {
      if (!expectedForeignKeys.has(foreignKeyName)) unexpectedForeignKeys.push(`${tableName}.${foreignKeyName}`);
    }
  }
  const tracked = tableRows.some(
    (row) => row.tableName === "__drizzle_migrations",
  );
  const [trackingRows] = await connection
    .query<Array<{ hash: string; createdAt: number }>>(
      "SELECT hash, created_at AS createdAt FROM __drizzle_migrations ORDER BY created_at ASC",
    )
    .catch(() => [[] as Array<{ hash: string; createdAt: number }>]);
  const schemaSnapshot = sorted(actualTables, (left, right) =>
    left.name.localeCompare(right.name),
  );
  const actualFingerprint = fingerprint(schemaSnapshot);
  const trackedHistoryMatchesSupportedManagementBaseline =
    trackingRows.length === supportedManagementBaseline.expectedMigrations.length &&
    trackingRows.every((row, index) =>
      row.hash === supportedManagementBaseline.expectedMigrations[index]?.hash,
    );
  const isSupportedTrackedManagementBaseline =
    tracked &&
    actualFingerprint === supportedManagementBaseline.schemaFingerprint &&
    trackedHistoryMatchesSupportedManagementBaseline;
  const isExactLegacyManagementBaseline =
    !tracked && actualFingerprint === supportedManagementBaseline.schemaFingerprint;
  const noApplicationTables = actualTables.length === 0;
  const exact =
    !missingTables.length &&
    !extraTables.length &&
    !missingColumns.length &&
    !unexpectedColumns.length &&
    !incompatibleColumns.length &&
    !missingIndexes.length &&
    !unexpectedIndexes.length &&
    !incompatibleIndexes.length &&
    !missingForeignKeys.length &&
    !unexpectedForeignKeys.length &&
    !incompatibleForeignKeys.length;
  const hasExpectedSurface = actualTables.some((table) =>
    expected.has(table.name),
  );
  const classification = noApplicationTables
    ? "FRESH_ZERO_DATABASE"
    : exact
      ? "CURRENT_NO_ACTION_REQUIRED"
      : isSupportedTrackedManagementBaseline
        ? "SUPPORTED_TRACKED_MANAGEMENT_BASELINE"
        : isExactLegacyManagementBaseline
          ? "EXACT_LEGACY_MANAGEMENT_BASELINE"
          : tracked
          ? "PARTIAL_OR_DRIFTED"
          : hasExpectedSurface
            ? "AMBIGUOUS"
            : "UNKNOWN";
  const result = {
    mode: "READ_ONLY",
    database: schemaName,
    manifestPath,
    expectedFingerprint: manifest.fingerprint,
    actualFingerprint,
    migrationTracking: {
      present: tracked,
      appliedCount: trackingRows.length,
      latestObserved: trackingRows.at(-1) ?? null,
    },
    expectedBaseline: {
      supportedManagementBaselinePath,
      schemaFingerprint: supportedManagementBaseline.schemaFingerprint,
      expectedMigrationCount: supportedManagementBaseline.expectedMigrations.length,
      latestExpectedMigration: supportedManagementBaseline.expectedMigrations.at(-1) ?? null,
      trackedHistoryMatches: trackedHistoryMatchesSupportedManagementBaseline,
    },
    classification,
    safeToUpgrade:
      classification === "CURRENT_NO_ACTION_REQUIRED" ||
      classification === "SUPPORTED_TRACKED_MANAGEMENT_BASELINE",
    humanReviewRequired: classification !== "CURRENT_NO_ACTION_REQUIRED",
    differences: {
      missingTables,
      extraTables,
      missingColumns,
      unexpectedColumns,
      incompatibleColumns,
      missingIndexes,
      unexpectedIndexes,
      incompatibleIndexes,
      missingForeignKeys,
      unexpectedForeignKeys,
      incompatibleForeignKeys,
    },
    observed: { tableCount: actualTables.length, tables: schemaSnapshot },
  };
  console.log(JSON.stringify(result, null, 2));
  process.exitCode =
    classification === "CURRENT_NO_ACTION_REQUIRED" ||
    classification === "FRESH_ZERO_DATABASE" ||
    classification === "SUPPORTED_TRACKED_MANAGEMENT_BASELINE"
      ? 0
      : 2;
} finally {
  await connection.end();
}
