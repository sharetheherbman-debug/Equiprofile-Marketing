import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const migrateScript = readFileSync(
  resolve(process.cwd(), "scripts/migrate.sh"),
  "utf8",
).replace(/\r\n/g, "\n");

const readinessAudit = readFileSync(
  resolve(process.cwd(), "scripts/audit-management-db-readiness.ts"),
  "utf8",
).replace(/\r\n/g, "\n");

const packageJson = readFileSync(resolve(process.cwd(), "package.json"), "utf8");

const envOnlyMigration = readFileSync(
  resolve(process.cwd(), "drizzle/0013_environment_only_runtime_secrets.sql"),
  "utf8",
).replace(/\r\n/g, "\n");

describe("EquiProfile focused Management release database safety boundary", () => {
  it("uses a read-only readiness audit instead of applying migrations", () => {
    expect(migrateScript).toContain("Management-only release database guard");
    expect(migrateScript).toContain("No database migration is authorised or required by this release.");
    expect(migrateScript).toContain("exec npx tsx scripts/audit-management-db-readiness.ts");
    expect(packageJson).toContain('"db:readiness"');
    expect(packageJson).toContain('"db:migrate": "npm run db:readiness"');
  });

  it("never guesses, baselines, or mutates migration history in the release wrapper", () => {
    expect(migrateScript).not.toContain("Baselined migration:");
    expect(migrateScript).not.toContain("__drizzle_migrations");
    expect(migrateScript).not.toContain("drizzle-kit migrate");
    expect(migrateScript).not.toMatch(/\b(?:INSERT|UPDATE|DELETE|ALTER|CREATE|DROP|TRUNCATE)\b\s+(?:TABLE|INTO|FROM|`)/i);
  });

  it("keeps the readiness implementation read-only and fail-closed", () => {
    expect(readinessAudit).toContain("DATABASE_URL");
    expect(readinessAudit).toMatch(/SELECT/i);
    expect(readinessAudit).not.toMatch(/\b(?:INSERT|UPDATE|DELETE|ALTER|CREATE|DROP|TRUNCATE)\b\s+(?:TABLE|INTO|FROM|`)/i);
    expect(readinessAudit).toMatch(/process\.exit(?:Code)?\s*=\s*[12]|process\.exit\([12]\)/);
  });

  it("requires an explicit database URL rather than silently targeting another database", () => {
    expect(migrateScript).toContain('if [ -z "${DATABASE_URL:-}" ]');
    expect(migrateScript).toContain('echo "ERROR: DATABASE_URL is required."');
    expect(migrateScript).toContain("exit 2");
  });

  it("preserves the reviewed historical environment-only migration byte semantics", () => {
    const breakpoints = envOnlyMigration.match(/--> statement-breakpoint/g) ?? [];

    expect(breakpoints).toHaveLength(4);
    expect(envOnlyMigration).toContain(
      ");\n--> statement-breakpoint\nDROP TRIGGER IF EXISTS `siteSettings_env_only_insert`;",
    );
    expect(envOnlyMigration).toContain(
      "DROP TRIGGER IF EXISTS `siteSettings_env_only_insert`;\n--> statement-breakpoint\nCREATE TRIGGER `siteSettings_env_only_insert`",
    );
    expect(envOnlyMigration).toContain(
      ");\n--> statement-breakpoint\nDROP TRIGGER IF EXISTS `siteSettings_env_only_update`;",
    );
    expect(envOnlyMigration).toContain(
      "DROP TRIGGER IF EXISTS `siteSettings_env_only_update`;\n--> statement-breakpoint\nCREATE TRIGGER `siteSettings_env_only_update`",
    );
  });
});
