#!/usr/bin/env bash
# Management-only release database guard.
#
# This release contains no Management schema changes. Deployment must therefore
# never mutate the database merely because application code is being updated.
# The command is intentionally read-only and exits non-zero if the required
# Management schema surface is not present.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

if [ -z "${DATABASE_URL:-}" ] && [ -f "$PROJECT_ROOT/.env" ]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$PROJECT_ROOT/.env" | head -1 | cut -d= -f2-)"
  export DATABASE_URL
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is required."
  exit 2
fi

echo "EquiProfile Management release: read-only database readiness check"
echo "No database migration is authorised or required by this release."
exec npx tsx scripts/audit-management-db-readiness.ts
