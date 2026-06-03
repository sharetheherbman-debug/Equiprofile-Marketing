#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

BASE_URL="${BASE_URL:-}"
LOGO_FILE_PATH="${LOGO_FILE_PATH:-}"

pass() { echo "✅ $1"; }
warn() { echo "⚠️  $1"; }
fail() { echo "❌ $1"; exit 1; }

echo "[go-live] PR64P smoke checks"

# 1) /api/files encoded logo URL returns 200 (runtime check when BASE_URL and LOGO_FILE_PATH are provided)
if [[ -n "$BASE_URL" && -n "$LOGO_FILE_PATH" ]]; then
  ENCODED="$(python - <<'PY'
import os, urllib.parse
print(urllib.parse.quote(os.environ["LOGO_FILE_PATH"], safe=""))
PY
)"
  STATUS="$(curl -sS -o /tmp/marketing_logo_smoke.out -w "%{http_code}" "$BASE_URL/api/files?path=$ENCODED" || true)"
  [[ "$STATUS" == "200" ]] && pass "/api/files encoded logo URL returned 200" || fail "/api/files encoded logo URL expected 200, got $STATUS"
else
  warn "Skip runtime /api/files check (set BASE_URL and LOGO_FILE_PATH to enable)."
fi

# 2) provider routes ready (contract + targeted tests)
grep -q "getMarketingProviderToolingTruth" server/routers.ts && pass "provider tooling truth route exists"
npx vitest run server/pr60.backendGeniusSettings.test.ts -t "provider"

# 3) create Reel route returns expected status (contract)
grep -q "createMarketingStudioPlan" server/routers.ts && pass "create Reel route exists"

# 4) latest Reel is 1080x1920 (contract test)
npx vitest run server/pr64o.reelMediaAudioPublishTruth.test.ts -t "1080x1920"

# 5) fallback-only is not publish-ready
npx vitest run server/pr64o.reelMediaAudioPublishTruth.test.ts -t "fallback-only"

# 6) connector cards are truthful
npx vitest run server/pr50.schedulerSocial.test.ts server/pr60.backendGeniusSettings.test.ts -t "connector readiness|publish"

# 7) tracking redirect route exists
grep -q 'app.get("/m/:code"' server/_core/index.ts && pass "tracking redirect route exists"

# 8) calendar endpoint works (contract)
grep -q "listMarketingScheduleDrafts" server/routers.ts && pass "calendar endpoint contract exists"

# 9) results endpoint works (contract)
grep -q "getMarketingPerformanceScore" server/routers.ts && grep -q "getMarketingLearningInsights" server/routers.ts && pass "results endpoints exist"

# 10) no normal Create UI text contains raw backend warnings
if rg -n "drawtext unavailable|Campaign inspector|Guided Studio internals|Media Studio internals|raw JSON" client/src/components/marketing/app/TheMarketingApp.tsx >/dev/null; then
  fail "normal Create UI still contains raw backend diagnostics text"
fi
pass "normal Create UI hides raw backend diagnostics text"

echo "[go-live] smoke checks completed"
