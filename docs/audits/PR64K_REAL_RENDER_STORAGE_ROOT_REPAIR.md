# PR64K — Real Render Storage Root Repair

## What Was Broken

- PR64J fixed the runtime media/file serving path, but the full VPS suite still failed the PR64I real FFmpeg fallback test.
- The failing contract was `server/pr64i.liveGenerationRenderHardening.test.ts`: `executes the real FFmpeg branded-caption path without stock, voice, or music`.
- The render returned `setup_needed` instead of `completed`.
- The root cause was stale storage root capture: `server/_core/storage/localMediaStorage.ts` exported `STORAGE_ROOT` from `EQUIPROFILE_STORAGE_ROOT` at module import time, while tests and deployment smoke checks can set `EQUIPROFILE_STORAGE_ROOT` after modules are already loaded.

## Audit Findings

- `server/_core/storage/localMediaStorage.ts` used module-level `STORAGE_ROOT` in write/delete/public URL helpers.
- `server/modules/marketing/media-factory/marketingRenderer.ts` imported `STORAGE_ROOT` and used it for readiness probes.
- `server/routers.ts`, AI diagnostics, and provider self-tests also reported or resolved generated media paths from the stale constant.
- `scripts/marketing_runtime_smoke.sh` proved source contracts and PR64J tests, but it did not execute a real render path.

## Storage Root Fix

- Added `getLocalMediaStorageRoot()` as the dynamic source of truth for generated media storage.
- Kept `STORAGE_ROOT` as a compatibility export only; active helpers now call the getter at execution time.
- Updated generated asset writes, temp writes, temp promotion, thumbnail placeholders, delete safety checks, public URL derivation, runtime file storage, route media resolution, provider diagnostics, and AI diagnostics to use the current root.

## Render Fix

- `getMarketingRenderRuntimeReadiness()` now probes the current dynamic storage root.
- `renderMarketingTimeline()` now returns setup failures with:
  - render stage,
  - FFmpeg path,
  - temp directory,
  - output root,
  - stderr/stdout/exit code/command when available.
- The real branded-caption fallback render continues to create a silent MP4 with warnings when stock media, voice, or music are unavailable.

## Regression Coverage

- Added `server/pr64k.realRenderStorageRootRepair.test.ts`.
- New tests import storage/renderer modules before changing `EQUIPROFILE_STORAGE_ROOT` and then verify:
  - generated assets write to the new current root,
  - render readiness reports the new current root,
  - the real FFmpeg branded-caption path writes a playable MP4 under the new current root.

## Smoke Coverage

- Added `scripts/marketing_runtime_render_smoke.ts`.
- Updated `scripts/marketing_runtime_smoke.sh` to run:
  - PR64J runtime tests,
  - PR64K dynamic root/real render tests,
  - a real TSX renderer smoke with a temporary storage root.

## Exact VPS Smoke Test

```bash
npm test -- server/pr64i.liveGenerationRenderHardening.test.ts -t "executes the real FFmpeg branded-caption path without stock, voice, or music"
npm test -- server/pr64k.realRenderStorageRootRepair.test.ts
EQUIPROFILE_STORAGE_ROOT="$(mktemp -d)" npx tsx scripts/marketing_runtime_render_smoke.ts
bash scripts/marketing_runtime_smoke.sh
bash scripts/deploy_validate_marketing.sh
```

## Local Validation

- `npm.cmd run check` — passed.
- `npm.cmd test` — passed: 86 test files, 673 tests.
- `npm.cmd run preflight` — passed.
- `npm.cmd run build` — passed with existing Vite chunk-size/CSS ordering warnings.
- `npx.cmd tsx scripts/marketing_runtime_render_smoke.ts` — passed and produced `/media/generated/generated/...mp4`.
- Direct Windows equivalent of `scripts/marketing_runtime_smoke.sh` — passed.
- Direct Windows equivalents of workspace/render/provider smoke contracts — passed.
- `bash scripts/marketing_runtime_smoke.sh` and `bash scripts/deploy_validate_marketing.sh` — not executable in this local Windows shell because Bash is unavailable; run unchanged on VPS/Linux.

## Remaining Blockers

- None in app code for the PR64I real FFmpeg fallback render contract.
- Local Windows validation cannot execute `.sh` files without Bash, so Bash script execution still needs Linux/VPS confirmation.
