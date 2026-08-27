import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const sourceDirectory = resolve(root, "drizzle");
const fixtureDirectory = resolve(root, ".tmp", "migrations-replay-fixed");
const targetFiles = [
  "0002_add_missing_user_columns.sql",
  "0005_fix_site_settings.sql",
  "0008_create_missing_tables.sql",
  "0012_email_campaigns_analytics.sql",
  "0013_email_verification.sql",
] as const;

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function stripBoundaryMarkers(sql: string): string {
  // Legacy files may contain the marker inline after a statement; generated
  // fixtures may put it on a separate line. Both forms are parser markers.
  return sql.replace(/\s*--> statement-breakpoint/g, "");
}

function normaliseSqlForEquivalence(sql: string): string {
  return stripBoundaryMarkers(sql).replace(/\s+/g, " ").trim();
}

function addBoundaryMarkers(sql: string): string {
  // `0002` and `0013` already use inline boundaries around stored-procedure
  // bodies. Do not insert markers inside those bodies; retain their exact copy.
  if (sql.includes("--> statement-breakpoint")) return sql;
  const repaired = sql.replace(
    /;([ \t]*)(\r?\n|$)/g,
    (match, spacing, newline, offset, source) => {
      // Drizzle splits literal markers into queries. A final marker would
      // create an empty trailing query, so delimit only a real next boundary.
      if (!source.slice(offset + match.length).trim()) return match;
      const lineEnd = newline || "\n";
      return `;${spacing}${lineEnd}--> statement-breakpoint${lineEnd}`;
    },
  );
  if (repaired === sql) {
    throw new Error(
      "Fixture source contains no statement terminator to bound.",
    );
  }
  return repaired;
}

if (!existsSync(sourceDirectory)) {
  throw new Error(`Canonical migration directory missing: ${sourceDirectory}`);
}

rmSync(fixtureDirectory, { recursive: true, force: true });
mkdirSync(resolve(root, ".tmp"), { recursive: true });
cpSync(sourceDirectory, fixtureDirectory, { recursive: true });

const report = targetFiles.map((file) => {
  const originalPath = join(sourceDirectory, file);
  const fixturePath = join(fixtureDirectory, file);
  const original = readFileSync(originalPath, "utf8");
  const repaired = addBoundaryMarkers(original);
  writeFileSync(fixturePath, repaired, "utf8");
  const semanticContentUnchanged =
    normaliseSqlForEquivalence(original) ===
    normaliseSqlForEquivalence(repaired);
  const onlyBoundaryMarkersAdded =
    semanticContentUnchanged &&
    stripBoundaryMarkers(repaired).replace(/\s+/g, " ").trim() ===
      stripBoundaryMarkers(original).replace(/\s+/g, " ").trim();
  if (!semanticContentUnchanged || !onlyBoundaryMarkersAdded) {
    throw new Error(`SQL-equivalence failure for ${file}`);
  }
  return {
    file,
    originalSha256: sha256(original),
    replayFixtureSha256: sha256(repaired),
    statementBoundaryCount: (repaired.match(/--> statement-breakpoint/g) ?? [])
      .length,
    sqlSemanticContentUnchanged: semanticContentUnchanged,
    onlyBoundaryMarkersAdded,
  };
});

const manifest = {
  kind: "TEST_REPLAY_FIXTURE_ONLY",
  sourceDirectory,
  fixtureDirectory,
  productionSafety: [
    "Generated under ignored .tmp and never replaces drizzle/.",
    "The production migrate wrapper continues to use the canonical drizzle/ directory.",
    "Only Drizzle statement-boundary comments are introduced in the five copied files.",
  ],
  files: report,
};
writeFileSync(
  join(fixtureDirectory, "REPLAY_FIXTURE_MANIFEST.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(manifest, null, 2));
