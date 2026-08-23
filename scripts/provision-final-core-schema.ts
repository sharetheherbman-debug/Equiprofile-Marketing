import "dotenv/config";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { applyFinalCoreCommerceContract } from "./final-core-commerce-contract";

const argument = (name: string): string | undefined =>
  process.argv
    .find((value) => value.startsWith(`${name}=`))
    ?.slice(name.length + 1);

const mode = argument("--mode");
const databaseUrl = argument("--database-url") ?? process.env.DATABASE_URL;
if (mode !== "fresh") {
  throw new Error(
    "This command is fresh-database-only. Invoke with --mode=fresh.",
  );
}
if (!databaseUrl) {
  throw new Error("DATABASE_URL or --database-url is required.");
}

const manifestPath = resolve("docs/final-core-schema-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  fingerprint?: string;
  tables?: Array<{ name: string }>;
};
if (!manifest.fingerprint) {
  throw new Error(`Schema manifest at ${manifestPath} has no fingerprint.`);
}

// The schema reconciler imports runtime configuration but fresh provisioning
// does not start an application process or use authentication/admin features.
// Supply process-local placeholders solely to satisfy that import boundary; no
// value is persisted, emitted, or used as deployment configuration.
process.env.JWT_SECRET ??= "fresh-provisioning-process-only";
process.env.ADMIN_UNLOCK_PASSWORD ??= "fresh-provisioning-process-only";
const { reconcileCoreSchema } = await import("../server/db");

const connection = await mysql.createConnection(databaseUrl);
try {
  const [[schemaRow]] = await connection.query<Array<{ schemaName: string }>>(
    "SELECT DATABASE() AS schemaName",
  );
  const schemaName = schemaRow?.schemaName;
  if (!schemaName) throw new Error("The connection has no selected database.");

  const [existing] = await connection.query<Array<{ tableName: string }>>(
    "SELECT TABLE_NAME AS tableName FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'",
    [schemaName],
  );
  if (existing.length > 0) {
    throw new Error(
      `Refusing fresh provisioning: ${schemaName} already contains ${existing.length} table(s). ` +
        "Run the read-only baseline inspector and the appropriate supported upgrade procedure instead.",
    );
  }

  // Rebuild the ignored fixture for every fresh installation. Its generator
  // verifies SHA-256 and SQL semantic equivalence before Drizzle reads it; the
  // canonical drizzle/ history is never altered or replayed in place.
  execFileSync(
    process.execPath,
    [
      resolve("node_modules/tsx/dist/cli.mjs"),
      resolve("scripts/build-migration-replay-fixture.ts"),
    ],
    {
      cwd: process.cwd(),
      stdio: "inherit",
    },
  );

  // Reuse the single connection so the controlled command closes every handle.
  const coreDb = drizzle(connection);
  await migrate(coreDb, {
    migrationsFolder: resolve(".tmp/migrations-replay-fixed"),
  });
  const commerceContract = await applyFinalCoreCommerceContract(connection);
  await reconcileCoreSchema(coreDb);

  const [provisionedTables] = await connection.query<
    Array<{ tableName: string }>
  >(
    "SELECT TABLE_NAME AS tableName FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'",
    [schemaName],
  );
  // Windows MariaDB commonly stores identifiers with lower_case_table_names=1.
  // Table-name comparison is therefore case-insensitive while column/index/FK
  // inspection remains strict.
  const provisionedNames = new Set(
    provisionedTables.map((table) => table.tableName.toLowerCase()),
  );
  const missingManifestTables = (manifest.tables ?? [])
    .map((table) => table.name)
    .filter((name) => !provisionedNames.has(name.toLowerCase()));
  if (missingManifestTables.length > 0) {
    throw new Error(
      `Fresh provision is incomplete; ${missingManifestTables.length} manifest table(s) are missing: ` +
        missingManifestTables.slice(0, 20).join(", "),
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
        status: "FRESH_PROVISIONED",
        database: schemaName,
        schemaState: {
          schemaKey: "final-core",
          schemaVersion: "v1",
          manifestFingerprint: manifest.fingerprint,
        },
        historicalMigrationsModified: false,
        drizzleHistoryForged: false,
        commerceContract,
      },
      null,
      2,
    ),
  );
} finally {
  await connection.end();
}
