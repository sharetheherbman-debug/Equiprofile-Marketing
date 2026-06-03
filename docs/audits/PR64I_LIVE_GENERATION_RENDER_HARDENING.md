# PR64I Live Generation and Render Hardening Audit

## Baseline

- Started from merged PR64H commit `8b23c71e91e5c293fbbcb94b31bca44d01b0f9e9`.
- PR64H already provides the embedded top-menu workspace: Create, Library, Calendar, Results, Settings.
- This PR keeps that shell and repairs the final generation-to-visible-output path.

## What PR64H Wired

- Natural-language intent routing in `client/src/components/marketing/app/marketingIntentRouter.ts`.
- The active Create workspace in `client/src/components/marketing/app/TheMarketingApp.tsx`.
- Existing `StudioWorkbench` mounting for assembled-video requests.
- Existing render-job procedures, queue fallback, FFmpeg renderer, generated media asset persistence, Preview, Library, Calendar, Results, and Settings workspace views.
- Existing Pexels/Pixabay scene sourcing, provider capability routing, product profile, Brand Kit, tracking, results, and learning modules.

## Code Inspection Findings

### Working foundations

- `server/modules/marketing/media-factory/marketingRenderer.ts` already contains a real FFmpeg text-card scene path. It creates MP4 segments, concatenates them, attempts caption burn-in, continues silently when audio is unavailable, stores the generated MP4, and returns a playable public URL.
- `server/modules/marketing/media-factory/marketingRenderQueue.ts` already processes jobs inline when Redis is unavailable, so low-volume fallback rendering does not require Redis.
- `server/modules/marketing/media-factory/marketingRenderWorker.ts` already persists completed render output as a Library media asset.
- Image advert generation already returns media output to the active Preview and invalidates Library assets.

### Go-live gaps

- `client/src/components/marketing/app/studio/StudioWorkbench.tsx` can auto-source and auto-render before script/scenes are valid. Scene-source failure is swallowed, so the render handoff is not deterministic.
- The same file hardcodes equine keywords, horse scenes, and replacement of unrelated words with `stable`. Reusable fallback logic must use host/product category truth instead of prompt-word substitution.
- `server/modules/marketing/studio-generation/index.ts` creates only three fallback scenes and does not guarantee that fallback duration matches 30, 120, or 180 second requests.
- `server/modules/marketing/media-factory/marketingStockMediaService.ts` infers equine category from arbitrary prompt text. Category-specific stock terms must only come from product profile context.
- `client/src/components/marketing/app/workspace/MarketingPreviewPanel.tsx` does not treat `completed` render status without `outputPublicUrl` as a hard error.
- `client/src/components/marketing/app/workspace/MarketingLibraryView.tsx` lacks filters, search, metadata clarity, reusable-reference action, and delete confirmation.
- `client/src/components/marketing/app/workspace/MarketingCalendarView.tsx` is a flat list despite FullCalendar already being installed.
- `client/src/components/marketing/app/workspace/MarketingResultsView.tsx` surfaces metrics and learning but lacks a clear return-to-Create action.
- `client/src/components/marketing/app/MarketingAppSettings.tsx` stores provider and stock keys but does not show clean route-by-route text/media truth or lightweight stock search proof.
- `server/routers.ts` defaults `createMarketingStudioPlan` to Elite instead of Standard.

## Acceptance Gates

- Image-ad prompts route to image generation and display a returned URL or an exact provider/setup failure.
- Video prompts route to assembled video with 30, 120, or 180 second target durations.
- Assembled-video plans always contain a valid script and scenes before render-job creation.
- Missing stock/generated media becomes an explicit branded-caption fallback scene, not fake media.
- Missing voice or music never blocks MP4 rendering; warnings explain the silent/no-music result.
- Completed render status without a playable URL is a hard failure.
- Equine fallback scenes and stock terms appear only for genuine EquiProfile/equine context.
- Provider readiness remains truthful: Qwen text can be ready while Qwen native media remains disabled until executable output is proven.
- Smoke scripts validate contracts and targeted tests without claiming browser proof.

## Planned Touch Points

- Shared Studio fallback preparation helper.
- StudioWorkbench auto-source/render handoff.
- Studio generation fallback duration handling.
- Renderer warnings and render-worker output URL guard.
- Stock query category handling and lightweight stock provider test.
- Create wording, adaptive plan, Preview, Library, Calendar, Results, and Settings views.
- Router Standard default and stock test procedure.
- Focused tests and smoke scripts.

## Live Browser Check After Deploy

1. Generate an EquiProfile image advert and confirm Preview and Library display the returned image URL.
2. Generate 30-second Facebook reel, 2-minute video, and 3-minute YouTube video prompts with stock/media keys removed.
3. Confirm each render produces a playable MP4 with branded-caption fallback warnings.
4. Confirm voice/music absence is shown as an optional-media warning.
5. Confirm a completed render without URL is shown as an error.
6. Confirm property and automotive product profiles never receive horse/stable fallback scenes or stock terms.
7. Confirm Settings reports Qwen text and Qwen media separately, and stock key tests show exact success/failure.

## PR64I Repairs Completed

### Guided Create Flow

- Replaced campaign-only wording with AI-neutral `Plan output` wording.
- Made the plan panel adapt to image ads, assembled video, and campaign package requests.
- Preserved the PR64H single-prompt workspace and top navigation without adding a sidebar or visible tool grid.

### Studio And Render Hardening

- Added `shared/_core/marketingStudioFallback.ts` as the reusable duration-aware scene preparation helper.
- Removed prompt-keyword equine inference and reusable hardcoded stable-scene cleanup from `StudioWorkbench`.
- Scoped equine fallback scenes to genuine EquiProfile host context or equine product categories.
- Added property, automotive, SaaS/app, and product-safe generic branded text-card fallback scenes.
- Guaranteed that assembled-video plans have scripts and valid scenes before render starts.
- Continued rendering with branded caption fallback scenes when optional generated or stock media cannot be sourced.
- Continued rendering silently with captions when voice is unavailable and without music when no music asset exists.
- Failed render jobs truthfully when the renderer reports completion without a playable public URL.

### Preview, Library, Calendar, Results

- Preview now renders image, video, audio, campaign output, render warnings, provider/source details, failures, and open/download actions.
- Preview treats a completed render without `outputPublicUrl` as a hard error.
- Library now supports All, Images, Videos, Audio, Logos, Stock, and Exports filters, searchable metadata, source/license details, reference reuse, logo selection, and permanent-delete confirmation.
- Calendar now uses FullCalendar month/week views with platform and status filters, drag rescheduling, cancel, and export-pack actions while retaining a clear scheduled-item list.
- Results now makes clicks, conversions, conversion rate, hooks, CTAs, platforms, learning notes, insufficient-data status, and the next Create action visible without inventing metrics.

### Settings And Provider Truth

- Settings now distinguishes Qwen text readiness from Qwen native media readiness.
- Qwen native media remains disabled truthfully while `dashscope_native_pending` returns `setup_needed`.
- GenX and Hugging Face media readiness remain route-specific and depend on live provider output or a valid queued job.
- Pexels and Pixabay now expose lightweight stock-search tests when keys are configured.
- Missing stock keys do not block campaign planning or branded caption fallback rendering.
- Developer Diagnostics remain behind collapsed Admin Support.

### Stock Media Truth

- Stock-media queries now use explicit product-category context rather than horse-related prompt inference.
- Equine terms are removed from non-equine stock queries.
- Missing stock media is represented as a branded caption fallback, not a fabricated selected asset.

## Files Touched

- Active workspace: `client/src/components/marketing/app/TheMarketingApp.tsx`, workspace panels, Studio workbench, scene-media hook, and settings.
- Render and provider wiring: renderer, render worker, stock-media service, studio-generation service, and admin router.
- Shared fallback engine: `shared/_core/marketingStudioFallback.ts`.
- Validation: focused Vitest coverage, updated wiring assertions, and three Marketing App smoke scripts.

## Validation Outputs

Executed successfully on the local Windows development host:

```text
npm run check
> tsc --noEmit
PASS

npm test
Test Files  84 passed (84)
Tests       662 passed (662)
PASS

npm run preflight
✅ All dependency specs in package.json are valid.
✅ No invalid Express route patterns found in server sources.
PASS

npm run build
PASS
```

The build still reports pre-existing CSS import-order and large-chunk warnings. No new build failure was introduced.

## Smoke Outputs

The Windows development host does not provide `bash`, so the Linux shell wrappers could not be launched locally. Their targeted Vitest commands were executed directly:

```text
marketing_workspace_smoke.sh underlying Vitest command
Test Files  2 passed
Tests       9 passed | 14 skipped

marketing_render_fallback_smoke.sh underlying Vitest command
Test Files  1 passed
Tests       6 passed | 5 skipped

marketing_provider_routes_smoke.sh underlying Vitest command
Test Files  4 passed
Tests       14 passed | 24 skipped
```

The render-fallback coverage proves:

- 30-second, 120-second, and 180-second timelines can be constructed without stock or generated media.
- Test-mode render jobs emit fixture playable MP4 contract URLs for each required duration.
- A representative real FFmpeg branded text-card path produces an MP4 without stock, voice, or music credentials.

## Local Browser Smoke Limitation

A local browser smoke could not start because the development service correctly refused to boot without:

```text
DATABASE_URL
JWT_SECRET
ADMIN_UNLOCK_PASSWORD
```

The deployed VPS still needs live browser proof for the exact natural-language prompts, playable public URLs, and Library persistence.

## Remaining External Proof

- Run the three Bash smoke wrappers on the Linux VPS.
- Verify live Qwen text generation with the configured key.
- Keep Qwen media disabled until the DashScope native executor returns usable output or a valid queued job.
- Verify GenX image/video/voice routes with configured credentials and models.
- Verify Hugging Face fallback routes with configured credentials and compatible models.
- Verify Pexels and Pixabay lightweight stock searches with configured keys.
- Run the live browser checklist after the deployment environment variables are present.
