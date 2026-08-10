import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const migrateScript = readFileSync(
  resolve(process.cwd(), "scripts/migrate.sh"),
  "utf8",
);

describe("EquiProfile production migration safety boundary", () => {
  it("supports a truly read-only production preflight", () => {
    expect(migrateScript).toContain('DRY_RUN="${DRY_RUN:-0}"');
    expect(migrateScript).toContain('Mode: DRY RUN (read-only)');
    expect(migrateScript).toContain('Dry-run guards passed. No migration was executed.');
    expect(migrateScript).toContain('if [ "$DRY_RUN" = "1" ]; then\n  exit 0');
  });

  it("never guesses or auto-baselines an existing untracked schema", () => {
    expect(migrateScript).toContain("Automatic baselining is disabled");
    expect(migrateScript).not.toContain("Baselined migration:");
    expect(migrateScript).not.toContain("INSERT INTO `__drizzle_migrations`");
  });

  it("reproduces Drizzle timestamp ordering without forging migration hashes", () => {
    expect(migrateScript).toContain("MAX(created_at) AS maxCreatedAt");
    expect(migrateScript).toContain("Number(entry.when) > maxCreatedAt");
    expect(migrateScript).toContain("this wrapper never forges hashes");
  });

  it("allows only the reviewed Phase 1 migration on an existing database", () => {
    expect(migrateScript).toContain(
      'EXPECTED_PHASE1_MIGRATION="0013_environment_only_runtime_secrets"',
    );
    expect(migrateScript).toContain("Existing production-style database has unexpected pending migrations");
    expect(migrateScript).toContain("Phase 1 allowlist");
  });
});
