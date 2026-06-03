# PR64L — Drawtext-Free Fallback Render Repair

## Why PR64K Still Failed

- PR64K fixed stale `EQUIPROFILE_STORAGE_ROOT` capture and made the renderer write to the current dynamic storage root.
- VPS validation still failed after PR64K because FFmpeg readiness was true, but the installed FFmpeg build did not include the `drawtext` filter.
- Exact VPS failure:

```text
[AVFilterGraph] No such filter: 'drawtext'
Error initializing a simple filtergraph
```

- The old guaranteed fallback video path used FFmpeg `drawtext` to render brand/caption text directly into scenes.
- That made `drawtext` a hidden runtime requirement, which violated the guarantee that fallback MP4 rendering should work without stock media, voice, music, Pexels, Pixabay, GenX, Qwen, Hugging Face, or special FFmpeg filter builds.

## Root Cause Confirmed

- `server/modules/marketing/media-factory/marketingRenderer.ts` used `buildSceneOverlayFilter()` for text-card fallback scenes.
- `buildSceneOverlayFilter()` emits FFmpeg `drawtext` filters for brand name, domain, scene text, CTA, and end cards.
- On VPS, `ffmpeg -version` and storage probes passed, but `ffmpeg -filters` lacked `drawtext`.

## New Renderer Architecture

1. `getMarketingRenderRuntimeReadiness()` now checks `ffmpeg -filters`.
2. Readiness includes:
   - `drawtextAvailable`,
   - `filterCheckError`.
3. Missing `drawtext` does not make renderer readiness fail.
4. Text-card fallback scenes now render via:
   - SVG branded card generated in Node,
   - SVG rendered to PNG via `sharp`,
   - FFmpeg loops the PNG into an MP4 segment without `drawtext`.
5. If `sharp` or SVG card rendering fails, the renderer falls back again to:
   - FFmpeg solid-colour video source without `drawtext`,
   - warning: branded text-card PNG failed; plain colour fallback used.

## Colour And Text Safety

- Brand colours are sanitized before use.
- Supported colour inputs:
  - `#RGB`,
  - `#RRGGBB`,
  - `#RRGGBBAA` reduced to `#RRGGBB`,
  - safe named colours.
- Invalid colours fall back to safe defaults.
- SVG text is XML-escaped.
- Long text is wrapped/truncated.
- Apostrophes, colons, commas, ampersands, slashes, and newlines are covered by regression tests.

## Tests

- Added `server/pr64l.drawtextFreeFallbackRender.test.ts`.
- Updated the previously failing PR64I/PR64K tests to throw exact renderer errors when status is not `completed`.
- Regression coverage proves:
  - drawtext can be unavailable while readiness stays true,
  - real MP4 fallback render completes with `MARKETING_RENDER_DISABLE_DRAWTEXT=1`,
  - output exists,
  - MP4 header contains `ftyp`,
  - special text and invalid colours do not break card generation.

## Smoke Behaviour

- `scripts/marketing_runtime_render_smoke.ts` now prints:
  - generated public URL,
  - storage root,
  - `drawtextAvailable`,
  - render warnings.
- `scripts/marketing_runtime_smoke.sh` now runs the PR64L drawtext-free regression.

## Forensic Go-Live / UX Audit

Render blocker aside, the Marketing App is still not truly go-live friendly.

### Still Broken Or Weak

- The Create view still carries too much weight: prompt, outcome, plan, preview, StudioWorkbench, and advanced/export controls all live in one long flow.
- Product profile and Brand Kit actions are nested inside `ProductContextPanel`, then duplicated conceptually inside Settings.
- “Media Studio / Advanced tools” is still a collapsed details block inside Create rather than a first-class top-menu section.
- Provider keys, stock media, social connections, SMTP, tracking, export/schedule, and media readiness are all packed into one large Settings grid.
- The user asked for a cleaner dashboard with main sections in the top menu; current top menu is only `Create | Library | Calendar | Results | Settings`.
- The next UI PR should promote major operational areas into top-level workspace views:
  - `Create`,
  - `Product`,
  - `Brand Kit`,
  - `Media Studio`,
  - `Library`,
  - `Calendar`,
  - `Results`,
  - `Connections`,
  - `Settings`.
- Settings should become lighter and only hold account/preferences/admin-support details once Product, Brand Kit, Connections, Tracking, and Media Studio have their own pages.

### Why This PR Does Not Redesign The UI

- The PR64L brief explicitly says this is a blocker repair, not frontend polish.
- It also says not to continue frontend polish until the render tests pass on VPS.
- Therefore this PR fixes the rendering blocker and documents the UI go-live backlog for the next PR.

## Validation To Run On VPS

```bash
npm run check
npm test
npm run preflight
npm run build
bash scripts/marketing_runtime_smoke.sh
bash scripts/deploy_validate_marketing.sh
```

## Local Validation Results

- `npm.cmd run check` — passed.
- `npm.cmd test` — passed: 87 test files, 676 tests.
- `npm.cmd run preflight` — passed.
- `npm.cmd run build` — passed with existing Vite CSS-order/chunk-size warnings.
- `npx.cmd vitest run server/pr64l.drawtextFreeFallbackRender.test.ts server/pr64k.realRenderStorageRootRepair.test.ts server/pr64i.liveGenerationRenderHardening.test.ts -t "PR64L drawtext-free fallback render|PR64K dynamic storage root repair|executes the real FFmpeg branded-caption path"` — passed.
- Direct Windows equivalent of `scripts/marketing_runtime_smoke.sh` — passed, including `MARKETING_RENDER_DISABLE_DRAWTEXT=1`.
- `scripts/marketing_runtime_render_smoke.ts` produced real MP4 files and printed `drawtextAvailable=false`.
- `bash scripts/marketing_runtime_smoke.sh` and `bash scripts/deploy_validate_marketing.sh` could not execute locally because this Windows shell does not have Bash installed.

## Remaining Blockers

- Run full Linux/VPS validation because local Windows cannot execute Bash scripts.
- After PR64L is green on VPS, create a dedicated UX PR to move Product, Brand Kit, Connections, Media Studio, Tracking/Export, and Settings into top-menu workspace sections.
