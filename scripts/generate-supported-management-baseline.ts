import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readMigrationFiles } from "drizzle-orm/migrator";

const inspectionArgument = process.argv.find((argument) => argument.startsWith("--inspection="));
const replayArgument = process.argv.find((argument) => argument.startsWith("--replay="));
const outputArgument = process.argv.find((argument) => argument.startsWith("--out="));
if (!inspectionArgument || !replayArgument) {
  throw new Error("Use --inspection=<read-only baseline inspection> --replay=<canonical baseline replay>.");
}

const inspection = JSON.parse(readFileSync(resolve(inspectionArgument.slice("--inspection=".length)), "utf8")) as {
  actualFingerprint?: string;
  migrationTracking?: { present?: boolean };
  classification?: string;
};
const replay = JSON.parse(readFileSync(resolve(replayArgument.slice("--replay=".length)), "utf8")) as {
  replayKind?: string;
  migrationStatus?: string;
  migrationCountExpected?: number;
  migrationCountApplied?: number;
  lastAppliedTag?: string | null;
  firstFailure?: string | null;
  appliedMigrations?: Array<{ tag: string; hash: string; createdAt: number }>;
};
const expectedCanonicalTags = new Set([
  "0000_motionless_rocket_raccoon",
  "0001_cold_shen",
  "0002_add_missing_user_columns",
  "0003_chat_contact_tables",
  "0004_notes_table",
]);
if (!inspection.actualFingerprint || inspection.classification !== "PARTIAL_OR_DRIFTED" || !inspection.migrationTracking?.present) {
  throw new Error("Baseline inspection must be a tracked, non-final disposable schema.");
}
if (
  replay.replayKind !== "original" ||
  replay.migrationStatus !== "FAILED" ||
  replay.migrationCountExpected !== 14 ||
  replay.migrationCountApplied !== expectedCanonicalTags.size ||
  replay.lastAppliedTag !== "0001_cold_shen" ||
  !/Migration 0005/i.test(replay.firstFailure ?? "")
) {
  throw new Error("Baseline replay must be the exact canonical five-entry state before known migration 0005 statement-boundary failure.");
}

const migrationsFolder = resolve("drizzle");
const migrations = readMigrationFiles({ migrationsFolder });
const journal = JSON.parse(readFileSync(resolve(migrationsFolder, "meta", "_journal.json"), "utf8")) as {
  entries: Array<{ tag: string; when: number }>;
};
if (migrations.length !== journal.entries.length || migrations.length !== 14) {
  throw new Error("Canonical Management migration history must contain exactly 14 journalled entries.");
}
const canonicalHashesByTag = new Map(
  migrations.map((migration, index) => [journal.entries[index].tag, migration.hash]),
);
const expectedMigrations = [...(replay.appliedMigrations ?? [])]
  .sort((left, right) => left.createdAt - right.createdAt)
  .map((migration) => ({
    tag: migration.tag,
    hash: migration.hash,
    when: migration.createdAt,
  }));
if (
  expectedMigrations.length !== expectedCanonicalTags.size ||
  expectedMigrations.some((migration) =>
    !expectedCanonicalTags.has(migration.tag) ||
    canonicalHashesByTag.get(migration.tag) !== migration.hash,
  )
) {
  throw new Error("Canonical baseline replay hashes do not match the approved five-entry historical sequence.");
}

const canonical = {
  format: "equiprofile-supported-management-baseline/v1",
  schemaFingerprint: inspection.actualFingerprint,
  expectedMigrations,
  sourceEvidence: {
    replayKind: "canonical-history-pre-0005-statement-boundary-failure",
    canonicalHistoryHashesVerified: true,
    baselineContainsNoFinalCoreReconciliation: true,
  },
};
const fingerprint = createHash("sha256")
  .update(JSON.stringify(canonical, null, 2))
  .digest("hex");
const outputPath = resolve(outputArgument?.slice("--out=".length) ?? "schema/supported-management-baseline.json");
writeFileSync(outputPath, `${JSON.stringify({ ...canonical, fingerprint }, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, schemaFingerprint: inspection.actualFingerprint, migrationCount: expectedMigrations.length, latestTracked: expectedMigrations.at(-1), fingerprint }, null, 2));
