# PR64J Runtime Storage, Render, Brand Kit, And UX Rescue

## Scope

PR64J repairs live runtime blockers in the existing PR64H/PR64I Marketing App shell. It does not add another app layer, left menu, fake publisher, fake analytics, or duplicate render/media system.

## Root Cause Findings

### Storage Mismatch

- Uploaded files were written and served through `ENV.storagePath`.
- Generated media was written and served through `EQUIPROFILE_STORAGE_ROOT`.
- Production default uploads previously pointed at `/var/www/equiprofile/uploads`.
- Live generated/runtime storage exists under `/var/equiprofile/storage`.
- Result: Brand Kit logo URLs such as `/api/files/1/marketing-brand/...` could resolve against the wrong root and return 404.

### Logo 404

- Brand Kit logo upload returned `/api/files/...`, but `/api/files` only checked the upload root it knew about.
- Safe local Brand Kit URLs such as `/api/files/...` and `/media/generated/...` were not treated as first-class safe logo URLs by Brand Kit sanitization.
- Broken image previews retried as normal images rather than showing a clear repair/reupload state.

### Render `setup_needed` Despite FFmpeg Existing

- Renderer readiness only trusted the imported `ffmpeg-static` value.
- The live VPS can have a working executable under `node_modules/ffmpeg-static/ffmpeg` even if the imported value is unavailable or shaped differently.
- Render failures were compressed into a generic `setup_needed` message, hiding the actual missing condition.

## Canonical Media URL Contract

- Canonical generated storage root: `EQUIPROFILE_STORAGE_ROOT`, default `/var/equiprofile/storage`.
- Canonical upload root: `STORAGE_PATH`, then `EQUIPROFILE_UPLOADS_ROOT`, then `/var/equiprofile/storage/uploads`.
- Uploaded file URL: `/api/files/:key`.
- Generated media URL: `/media/generated/:folder/:filename`.
- `/api/files` lookup order:
  1. canonical upload root,
  2. generated storage root for legacy app-storage files,
  3. legacy `/var/www/equiprofile/uploads`.
- All lookups use path traversal guards and refuse paths outside allowed roots.

## Brand Kit Repair

- `uploadMarketingBrandLogo` writes to the canonical served upload root through existing `storagePut`.
- Brand Kit now accepts safe local URLs:
  - `/api/files/...`
  - `/media/generated/...`
  - app static asset namespaces
  - public `https://...`
- Brand Kit rejects:
  - traversal,
  - `javascript:`,
  - `data:`,
  - `file:`,
  - private/internal filesystem paths.
- `repairMarketingBrandLogo` clears a missing local logo URL and returns `Logo file missing - reupload or repair`.
- `ProductContextPanel` stops retrying broken image requests and shows a repair/reupload state.

## Render Completion Repair

- Renderer now tests FFmpeg candidates:
  - `FFMPEG_PATH`,
  - imported `ffmpeg-static`,
  - `node_modules/ffmpeg-static/ffmpeg` or `ffmpeg.exe`,
  - system `ffmpeg`.
- Render readiness checks:
  - FFmpeg executable and `ffmpeg -version`,
  - temp directory writable,
  - generated output root writable,
  - public URL base remains `/media/generated`.
- Render failures now persist exact error text.
- Completed render without `outputPublicUrl` remains a hard failure.

## Deploy Validation Repair

- Added `scripts/deploy_validate_marketing.sh`.
- It runs with `set -euo pipefail`.
- Any failure in check, test, preflight, build, or Marketing App smoke scripts exits non-zero.

## UX Simplification

- Create page keeps the PR64H top-menu shell.
- Product setup expands automatically when product profile needs review.
- Product Setup exposes Website URL, Signup URL, Product notes, Scan Site, Save draft, Use EquiProfile defaults, and Confirm Product.
- Create flow now includes one latest outcome card with route chosen, status, detail, and next action.
- Studio details and advanced tools remain collapsed unless needed.

## Scraper Visibility

- `Scan Site` is visible inside Product Setup.
- Invalid URL handling remains in the product-intelligence backend; invalid scans must not overwrite confirmed profiles.

## Admin Support Gating

- Admin Support / Developer Diagnostics no longer render for normal users.
- The diagnostics block only renders when `VITE_MARKETING_SUPPORT_MODE=true`.
- Diagnostics queries only run when support mode is enabled and opened.

## Platform Connector Truth

- Settings continues export-first behavior.
- Social connection rows show connected/missing state, required scopes when known, missing scopes/reason when known, and export/manual fallback.
- Direct posting remains locked unless a real connector reports publish readiness and real platform IDs are returned.

## Validation Outputs

- `npm run check` passed.
- `npm test` passed: 85 test files, 670 tests.
- `npm run preflight` passed dependency and Express route validation.
- `npm run build` passed. Existing CSS import-order and large-chunk warnings remain.

## Smoke Outputs

The local Windows host does not provide `bash`, so Bash wrappers returned `bash: command not found`. Their underlying commands were executed directly:

- `marketing_workspace_smoke.sh` underlying command passed: 3 files, 12 tests passed.
- `marketing_render_fallback_smoke.sh` underlying command passed: 2 files, 8 tests passed.
- `marketing_provider_routes_smoke.sh` underlying command passed: 4 files, 14 tests passed.
- `marketing_runtime_smoke.sh` underlying command passed: 1 file, 8 tests passed.
- `deploy_validate_marketing.sh` is present with `set -euo pipefail`; it must be run on the Linux VPS where `bash` exists.

## Exact Remaining Blockers

- Live VPS must run runtime smoke with real environment variables.
- Linux VPS must run `bash scripts/deploy_validate_marketing.sh`.
- Live browser proof must confirm uploaded Brand Kit logo URL returns 200.
- Live browser proof must confirm rendered MP4 public URL returns 200 and plays.
- Direct social publishing remains credential/scope/adapter dependent and must not be called complete without real platform IDs.
