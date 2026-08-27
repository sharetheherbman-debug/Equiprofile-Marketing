import "dotenv/config";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { applyFinalCoreCommerceContract } from "./final-core-commerce-contract";
import { applySupportedManagementBaselineForwardContract } from "./final-core-management-baseline-contract";

const argument = (name: string): string | undefined =>
  process.argv
    .find((value) => value.startsWith(`${name}=`))
    ?.slice(name.length + 1);

const mode = argument("--mode");
const isSupportedManagementMode = mode === "supported-management";
const isExactLegacyAdoptionMode = mode === "exact-legacy-adoption";
if (!isSupportedManagementMode && !isExactLegacyAdoptionMode) {
  throw new Error(
    "This command is restricted to --mode=supported-management or --mode=exact-legacy-adoption.",
  );
}
const backupReference = argument("--owner-backup-reference");
if (isExactLegacyAdoptionMode && !backupReference) {
  throw new Error(
    "Exact legacy adoption requires --owner-backup-reference=<owner-controlled backup identifier>.",
  );
}
const databaseUrl = argument("--database-url") ?? process.env.DATABASE_URL;
if (!databaseUrl)
  throw new Error("DATABASE_URL or --database-url is required.");

const manifest = JSON.parse(
  readFileSync(resolve("docs/final-core-schema-manifest.json"), "utf8"),
) as {
  fingerprint?: string;
};
if (!manifest.fingerprint)
  throw new Error("Final-Core schema manifest has no fingerprint.");

function inspectReadOnly() {
  const result = spawnSync(
    process.execPath,
    [
      resolve("node_modules/tsx/dist/cli.mjs"),
      resolve("scripts/audit-migration-baseline.ts"),
      `--database-url=${databaseUrl}`,
    ],
    { cwd: process.cwd(), encoding: "utf8", env: process.env },
  );
  if (result.error) throw result.error;
  const output = String(result.stdout ?? "");
  if (!output.trim()) {
    throw new Error(
      `Read-only schema inspector returned no report: ${String(result.stderr ?? "")}`,
    );
  }
  return JSON.parse(output) as {
    classification?: string;
    differences?: Record<string, unknown>;
  };
}

const preflight = inspectReadOnly();
const requiredClassification = isSupportedManagementMode
  ? "SUPPORTED_TRACKED_MANAGEMENT_BASELINE"
  : "EXACT_LEGACY_MANAGEMENT_BASELINE";
if (preflight.classification !== requiredClassification) {
  throw new Error(
    `Refusing named Management upgrade: read-only preflight classified ${preflight.classification ?? "UNKNOWN"}; expected ${requiredClassification}.`,
  );
}

// The reconciler import is not an application startup path. These process-local
// placeholders only satisfy import-time validation and are never persisted or emitted.
process.env.JWT_SECRET ??= "supported-management-upgrade-process-only";
process.env.ADMIN_UNLOCK_PASSWORD ??=
  "supported-management-upgrade-process-only";

const { reconcileCoreSchema } = await import("../server/db");
const connection = await mysql.createConnection(databaseUrl);
try {
  const coreDb = drizzle(connection);
  const commerceContract = await applyFinalCoreCommerceContract(connection);
  await reconcileCoreSchema(coreDb);
  const managementBaselineContract =
    await applySupportedManagementBaselineForwardContract(connection);

  const verification = inspectReadOnly();
  if (verification.classification !== "CURRENT_NO_ACTION_REQUIRED") {
    throw new Error(
      `Supported Management upgrade did not reach final Core: ${verification.classification ?? "UNKNOWN"}.`,
    );
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`coreSchemaState\` (
      \`schemaKey\` varchar(80) NOT NULL,
      \`schemaVersion\` varchar(80) NOT NULL,
      \`manifestFingerprint\` varchar(128) NOT NULL,
      \`appliedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`schemaKey\`)
    )
  `);
  await connection.execute(
    "INSERT INTO coreSchemaState (schemaKey, schemaVersion, manifestFingerprint) VALUES ('final-core', 'v1', ?) " +
      "ON DUPLICATE KEY UPDATE schemaVersion = VALUES(schemaVersion), manifestFingerprint = VALUES(manifestFingerprint), appliedAt = CURRENT_TIMESTAMP",
    [manifest.fingerprint],
  );

  console.log(
    JSON.stringify(
      {
        status: isSupportedManagementMode
          ? "SUPPORTED_MANAGEMENT_UPGRADED"
          : "EXACT_LEGACY_MANAGEMENT_ADOPTED_AND_UPGRADED",
        classificationBefore: preflight.classification,
        ownerBackupReference: isExactLegacyAdoptionMode
          ? backupReference
          : null,
        classificationAfter: verification.classification,
        manifestFingerprint: manifest.fingerprint,
        managementBaselineContract,
        commerceContract,
        historicalMigrationsModified: false,
        drizzleHistoryForged: false,
      },
      null,
      2,
    ),
  );
} finally {
  await connection.end();
}
