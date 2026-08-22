import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const migrateScript = readFileSync(
  resolve(process.cwd(), "scripts/migrate.sh"),
  "utf8",
).replace(/\r\n/g, "\n");
const provisioner = readFileSync(
  resolve(process.cwd(), "scripts/provision-final-core-schema.ts"),
  "utf8",
).replace(/\r\n/g, "\n");
const envOnlyMigration = readFileSync(
  resolve(process.cwd(), "drizzle/0013_environment_only_runtime_secrets.sql"),
  "utf8",
).replace(/\r\n/g, "\n");

describe("EquiProfile production migration safety boundary", () => {
  it("inspects before action and keeps dry run read-only", () => {
    expect(migrateScript).toContain('DRY_RUN="${DRY_RUN:-0}"');
    expect(migrateScript).toContain("npx tsx scripts/audit-migration-baseline.ts");
    expect(migrateScript).toContain("DRY RUN: verified fresh zero database; no provisioning executed.");
    expect(migrateScript).toContain('if [ "$DRY_RUN" = "1" ]; then');
  });

  it("permits only explicit fresh provisioning and current-schema no-op", () => {
    expect(migrateScript).toContain("FRESH_ZERO_DATABASE)");
    expect(migrateScript).toContain("CURRENT_NO_ACTION_REQUIRED)");
    expect(migrateScript).toContain("scripts/provision-final-core-schema.ts --mode=fresh");
    expect(provisioner).toContain('if (mode !== "fresh")');
    expect(provisioner).toContain("Refusing fresh provisioning");
    expect(provisioner).toContain("Fresh provision is incomplete");
  });

  it("fails closed for every unsupported existing or drifted state", () => {
    expect(migrateScript).toContain("ERROR: no automatic migration path is authorised");
    expect(migrateScript).toContain("separately validated named baseline procedure");
    expect(migrateScript).not.toContain("INSERT INTO `__drizzle_migrations`");
    expect(migrateScript).not.toContain("drizzle-kit migrate");
  });

  it("uses only a generated semantically checked copy for fresh replay", () => {
    expect(provisioner).toContain("scripts/build-migration-replay-fixture.ts");
    expect(provisioner).toContain("migrations-replay-fixed");
    expect(provisioner).toContain("historicalMigrationsModified: false");
    expect(provisioner).toContain("drizzleHistoryForged: false");
  });

  it("preserves the existing environment-only migration boundaries", () => {
    const breakpoints = envOnlyMigration.match(/--> statement-breakpoint/g) ?? [];
    expect(breakpoints).toHaveLength(4);
    expect(envOnlyMigration).toContain(
      ");\n--> statement-breakpoint\nDROP TRIGGER IF EXISTS `siteSettings_env_only_insert`;",
    );
    expect(envOnlyMigration).toContain(
      "DROP TRIGGER IF EXISTS `siteSettings_env_only_update`;\n--> statement-breakpoint\nCREATE TRIGGER `siteSettings_env_only_update`",
    );
  });
});
