#!/bin/bash
# ==========================================
# EquiProfile Production Migration Script
# ==========================================
# Safety model:
#   - Fresh DB: drizzle may apply the full journal.
#   - Existing DB with no Drizzle tracking table: abort. Never guess/baseline.
#   - Existing tracked DB: calculate pending migrations using Drizzle's
#     created_at ordering and fail closed if this Phase 1 release would apply
#     anything except the reviewed environment-only migration.
#   - DRY_RUN=1 performs every discovery/guard check without changing the DB.
#
# Usage:
#   DRY_RUN=1 bash scripts/migrate.sh   # mandatory production preflight
#   bash scripts/migrate.sh             # apply only after reviewed dry run
#
# Requires DATABASE_URL set in environment (or .env file loaded by caller).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DRY_RUN="${DRY_RUN:-0}"
EXPECTED_PHASE1_MIGRATION="0013_environment_only_runtime_secrets"

cd "$PROJECT_ROOT"

echo "=========================================="
echo " EquiProfile DB Migration"
echo "=========================================="

if [ "$DRY_RUN" = "1" ]; then
  echo "Mode: DRY RUN (read-only)"
else
  echo "Mode: APPLY"
fi

# ---------------------------------------------------------------------------
# Load DATABASE_URL only when caller did not already supply it.
# ---------------------------------------------------------------------------
if [ -z "${DATABASE_URL:-}" ]; then
  if [ -f "$PROJECT_ROOT/.env" ]; then
    echo "ℹ️  Loading DATABASE_URL from .env"
    DATABASE_URL="$(grep -E '^DATABASE_URL=' "$PROJECT_ROOT/.env" | head -1 | cut -d= -f2-)"
    export DATABASE_URL
  fi
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL is not set. Aborting migration."
  exit 1
fi

echo "ℹ️  DATABASE_URL configured."

# ---------------------------------------------------------------------------
# Preflight the real database and reproduce Drizzle's timestamp-based pending
# decision. This intentionally does not mutate an existing tracking table.
# ---------------------------------------------------------------------------
PREFLIGHT_JSON="$(node --input-type=module <<'JSEOF'
import { createConnection } from 'mysql2/promise';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  const dbName = url.pathname.replace(/^\//, '');
  if (!dbName) throw new Error('DATABASE_URL does not contain a database name');

  const journalPath = resolve(process.cwd(), 'drizzle', 'meta', '_journal.json');
  if (!existsSync(journalPath)) throw new Error('Missing drizzle/meta/_journal.json');
  const journal = JSON.parse(readFileSync(journalPath, 'utf8'));
  const entries = Array.isArray(journal.entries) ? journal.entries : [];
  if (entries.length === 0) throw new Error('Migration journal has no entries');

  for (const entry of entries) {
    const sqlPath = join(process.cwd(), 'drizzle', `${entry.tag}.sql`);
    if (!existsSync(sqlPath)) {
      throw new Error(`Journal entry has no SQL file: ${entry.tag}`);
    }
  }

  const conn = await createConnection(process.env.DATABASE_URL);
  try {
    const [trackingRows] = await conn.execute(
      'SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [dbName, '__drizzle_migrations'],
    );
    const trackingExists = Number(trackingRows[0].cnt) > 0;

    const [schemaRows] = await conn.execute(
      'SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
      [dbName],
    );
    const schemaTableCount = Number(schemaRows[0].cnt);

    let trackedCount = 0;
    let maxCreatedAt = null;
    if (trackingExists) {
      const [rows] = await conn.execute(
        'SELECT COUNT(*) AS cnt, MAX(created_at) AS maxCreatedAt FROM `__drizzle_migrations`',
      );
      trackedCount = Number(rows[0].cnt);
      maxCreatedAt = rows[0].maxCreatedAt == null ? null : Number(rows[0].maxCreatedAt);
    }

    if (!trackingExists && schemaTableCount > 0) {
      throw new Error(
        `Existing schema has ${schemaTableCount} tables but no __drizzle_migrations table. ` +
        'Automatic baselining is disabled; reconcile this database explicitly.',
      );
    }

    // Drizzle MySQL migration execution compares journal folderMillis/when to
    // the newest tracked created_at value. Reproduce that decision here.
    const pending = entries.filter((entry) =>
      maxCreatedAt == null || Number(entry.when) > maxCreatedAt
    );

    process.stdout.write(JSON.stringify({
      dbName,
      trackingExists,
      schemaTableCount,
      trackedCount,
      maxCreatedAt,
      pending: pending.map((entry) => ({ tag: entry.tag, when: Number(entry.when) })),
    }));
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error(`MIGRATION_PREFLIGHT_ERROR: ${error.message}`);
  process.exit(1);
});
JSEOF
)"

node - "$PREFLIGHT_JSON" "$EXPECTED_PHASE1_MIGRATION" "$DRY_RUN" <<'JSEOF'
const report = JSON.parse(process.argv[2]);
const expected = process.argv[3];
const dryRun = process.argv[4] === '1';

console.log('');
console.log('Preflight:');
console.log(`   Database: ${report.dbName}`);
console.log(`   Schema tables: ${report.schemaTableCount}`);
console.log(`   Tracking table: ${report.trackingExists ? 'present' : 'absent'}`);
console.log(`   Tracked rows: ${report.trackedCount}`);
console.log(`   Highest created_at: ${report.maxCreatedAt ?? 'none'}`);
console.log(`   Pending migrations: ${report.pending.length}`);
for (const migration of report.pending) {
  console.log(`      - ${migration.tag} (${migration.when})`);
}

if (report.schemaTableCount > 0 && report.trackingExists) {
  const unexpected = report.pending.filter((migration) => migration.tag !== expected);
  if (unexpected.length > 0) {
    console.error('');
    console.error('❌ Existing production-style database has unexpected pending migrations.');
    console.error(`   Phase 1 allowlist: ${expected}`);
    console.error(`   Unexpected: ${unexpected.map((m) => m.tag).join(', ')}`);
    process.exit(2);
  }
}

if (dryRun) {
  console.log('');
  console.log('✅ Dry-run guards passed. No migration was executed.');
}
JSEOF

if [ "$DRY_RUN" = "1" ]; then
  exit 0
fi

# ---------------------------------------------------------------------------
# Apply exactly the set that passed the preflight. drizzle-kit itself owns the
# migration transaction/tracking semantics; this wrapper never forges hashes.
# ---------------------------------------------------------------------------
echo ""
echo "Running drizzle-kit migrate..."
echo ""

npx drizzle-kit migrate

echo ""
echo "=========================================="
echo "✅ Migration complete!"
echo "=========================================="
