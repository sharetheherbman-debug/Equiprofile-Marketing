import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

type ReplayKind = "original" | "repaired";

const [kindArgument, databaseName] = process.argv.slice(2);
if (kindArgument !== "original" && kindArgument !== "repaired") {
  throw new Error(
    "Usage: tsx scripts/run-disposable-migration-replay.ts <original|repaired> <database-name>",
  );
}
if (
  !/^equiprofile_final_core_replay_(original|repaired)_[a-z0-9_]+$/.test(
    databaseName,
  )
) {
  throw new Error(
    "Refusing non-disposable database name. It must start with equiprofile_final_core_replay_original_ or equiprofile_final_core_replay_repaired_.",
  );
}

const url = new URL(process.env.DATABASE_URL ?? "");
if (!url.protocol.startsWith("mysql")) {
  throw new Error("DATABASE_URL must be a MySQL URL for a disposable replay.");
}
if (!new Set(["localhost", "127.0.0.1", "::1"]).has(url.hostname)) {
  throw new Error("Disposable replay is restricted to a local database host.");
}

const projectRoot = process.cwd();
const kind = kindArgument as ReplayKind;
const migrationsFolder = resolve(
  projectRoot,
  kind === "original" ? "drizzle" : ".tmp/migrations-replay-fixed",
);
const journal = JSON.parse(
  readFileSync(resolve(migrationsFolder, "meta", "_journal.json"), "utf8"),
) as { entries: Array<{ tag: string; when: number }> };
const migrations = readMigrationFiles({ migrationsFolder });
const tagsByHash = new Map(
  migrations.map((migration, index) => [
    migration.hash,
    journal.entries[index]?.tag,
  ]),
);

const safeIdentifier = `\`${databaseName.replace(/`/g, "``")}\``;
const serverUrl = new URL(url.toString());
serverUrl.pathname = "/";
serverUrl.search = "";
const databaseUrl = new URL(url.toString());
databaseUrl.pathname = `/${databaseName}`;

const startedAt = new Date().toISOString();
const report: Record<string, unknown> = {
  kind: "DISPOSABLE_REPLAY_EXPERIMENT",
  replayKind: kind,
  migrationsFolder,
  databaseName,
  startedAt,
  localHostVerified: url.hostname,
  databaseCreated: false,
  migrationStatus: "NOT_STARTED",
  appliedMigrations: [],
  firstFailure: null,
};

let serverConnection;
let databaseConnection;
try {
  serverConnection = await createConnection(serverUrl.toString());
  const [existing] = await serverConnection.query<
    Array<{ SCHEMA_NAME: string }>
  >(
    "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?",
    [databaseName],
  );
  if (existing.length > 0) {
    if (process.env.DISPOSABLE_REPLAY_DATABASE_PRECREATED !== "1") {
      throw new Error(
        `Refusing to reuse existing disposable database ${databaseName}; choose a new name instead of dropping data.`,
      );
    }
    const [tables] = await serverConnection.query<
      Array<{ tableCount: number }>
    >(
      "SELECT COUNT(*) AS tableCount FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [databaseName],
    );
    if (Number(tables[0]?.tableCount ?? 0) !== 0) {
      throw new Error(
        `Refusing pre-created database ${databaseName}: it is not empty.`,
      );
    }
    report.preCreatedEmptyDatabaseVerified = true;
  } else {
    await serverConnection.query(`CREATE DATABASE ${safeIdentifier}`);
    report.databaseCreated = true;
  }
  databaseConnection = await createConnection(databaseUrl.toString());
  const db = drizzle(databaseConnection);

  try {
    await migrate(db, { migrationsFolder });
    report.migrationStatus = "SUCCEEDED";
  } catch (error) {
    report.migrationStatus = "FAILED";
    report.firstFailure =
      error instanceof Error ? error.message : String(error);
  }

  const [trackingRows] = await databaseConnection
    .query<
      Array<{ hash: string; created_at: number }>
    >("SELECT hash, created_at FROM __drizzle_migrations ORDER BY created_at ASC")
    .catch((error) => {
      if (error instanceof Error && /doesn't exist/i.test(error.message))
        return [[]];
      throw error;
    });
  report.appliedMigrations = trackingRows.map((row) => ({
    tag: tagsByHash.get(row.hash) ?? "UNKNOWN_HASH",
    hash: row.hash,
    createdAt: Number(row.created_at),
  }));
  report.finishedAt = new Date().toISOString();
  report.migrationCountExpected = migrations.length;
  report.migrationCountApplied = trackingRows.length;
  report.lastAppliedTag =
    trackingRows.length > 0
      ? (tagsByHash.get(trackingRows[trackingRows.length - 1].hash) ??
        "UNKNOWN_HASH")
      : null;
} finally {
  await databaseConnection?.end();
  await serverConnection?.end();
}

console.log(JSON.stringify(report, null, 2));

if (report.migrationStatus === "NOT_STARTED") {
  process.exitCode = 1;
}
