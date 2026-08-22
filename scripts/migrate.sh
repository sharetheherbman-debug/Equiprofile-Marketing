#!/usr/bin/env bash
# EquiProfile Core supported migration dispatcher.
#
# Safety contract:
#   * Fresh zero database -> explicit Core fresh provisioner only.
#   * Current final schema -> no action.
#   * Exact tracked Management baseline -> named, fingerprint-gated forward upgrade.
#   * Exact legacy Management baseline -> explicit owner backup-gated adoption command only.
#   * Partial, drifted, or unknown schema -> fail closed.
#
# Historical Drizzle files and tracking rows are never rewritten by this script.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DRY_RUN="${DRY_RUN:-0}"
cd "$PROJECT_ROOT"

if [ -z "${DATABASE_URL:-}" ] && [ -f "$PROJECT_ROOT/.env" ]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$PROJECT_ROOT/.env" | head -1 | cut -d= -f2-)"
  export DATABASE_URL
fi
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is required."
  exit 1
fi

report_file="$(mktemp)"
trap 'rm -f "$report_file"' EXIT
set +e
npx tsx scripts/audit-migration-baseline.ts >"$report_file"
inspect_exit=$?
set -e

classification="$(node -e 'const fs=require("fs"); const r=JSON.parse(fs.readFileSync(process.argv[1], "utf8")); process.stdout.write(r.classification || "UNKNOWN")' "$report_file")"
echo "EquiProfile Core migration inspection: $classification"
cat "$report_file"

case "$classification" in
  FRESH_ZERO_DATABASE)
    if [ "$DRY_RUN" = "1" ]; then
      echo "DRY RUN: verified fresh zero database; no provisioning executed."
      exit 0
    fi
    echo "Provisioning verified fresh zero database with the explicit final-Core command."
    exec npx tsx scripts/provision-final-core-schema.ts --mode=fresh
    ;;
  CURRENT_NO_ACTION_REQUIRED)
    echo "Current final Core schema verified; no migration action required."
    exit 0
    ;;
  SUPPORTED_TRACKED_MANAGEMENT_BASELINE)
    if [ "$DRY_RUN" = "1" ]; then
      echo "DRY RUN: verified the exact supported tracked Management baseline; no upgrade executed."
      exit 0
    fi
    echo "Upgrading the exact fingerprint-gated supported Management baseline with the named final-Core forward command."
    exec npx tsx scripts/upgrade-supported-management-baseline.ts --mode=supported-management
    ;;
  *)
    echo "ERROR: no automatic migration path is authorised for $classification."
    echo "Run the read-only report under owner control and use only a separately validated named baseline procedure."
    # Preserve the inspector failure for unsafe schema states and fail closed even
    # if a future inspector uses a zero exit code for an unsupported class.
    exit "${inspect_exit:-2}"
    ;;
esac
