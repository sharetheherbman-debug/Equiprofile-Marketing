# PR64H AI-Guided Workspace Wiring Rescue

## Objective

PR64H turns the existing Marketing App modules into one usable embedded EquiProfile workspace. It does not add a duplicate engine. It reconnects the active UI to the existing Studio workbench, render queue, media asset registry, schedule drafts, results, learning, product profile, Brand Kit, deliverable composer, and provider routes.

## Phase 0 Audit Findings

### Existing frontend systems inspected

- `TheMarketingApp.tsx` was a campaign-focused long-scroll shell. It imported assets and calendar hooks but rendered their counts in a hidden span instead of exposing Library or Calendar views.
- `workspace/*` already contained product context, prompt, plan, output, status, and collapsed advanced panels. They were useful pieces but not a complete app shell.
- `StudioWorkbench.tsx` already implemented the guided pipeline: brief → script → scene plan → media selection → voice audio → captions → brand overlay → render → export.
- `CreateTypeSelector.tsx` already defined assembled Facebook, Instagram, TikTok, YouTube Short, and YouTube 3-minute workflows.
- `RenderStep.tsx`, `ExportStep.tsx`, `useMarketingRenderJob.ts`, and `useMarketingSceneMedia.ts` already connected render jobs, scene sourcing, playable URLs, captions, review, QA, and truthful setup states.
- `useMarketingAssets.ts` and `MarketingAppAssetStore.ts` already exposed the media registry, playable asset selection, logo candidates, deletion, and branding actions.
- `useMarketingCalendar.ts` already exposed schedule drafts, rescheduling, cancellation, and export-pack mutation.
- `MarketingAppSettings.tsx` already had user-facing provider, stock-media, connection, tracking, export, and media readiness cards with diagnostics collapsed under Admin Support.

### Existing backend systems inspected

- `deliverable-composer/*` already created product-aware campaign packages with brain, brand-memory, performance, learning, specialist, tracking, quality-gate, review, schedule, and export context.
- `media-factory/*` already supplied stock sourcing, localization, captions, voice, timeline compilation, overlay, render queue, render worker, renderer, render job persistence, and playable-output truth.
- `autonomous-campaign/*`, `brand-memory/*`, `results-conversion/*`, and `result-learning/*` already held orchestration and learning context.
- `product-intelligence/*` already enforced invalid public-site URL rejection, safe EquiProfile defaults only for EquiProfile context, and public same-origin crawling.
- `server/routers.ts` already exposed Studio plan generation, scene sourcing, render create/get/list/cancel, preview rendering, assets, schedule drafts, results, patterns, and learning procedures.
- `drizzle/schema.ts` and `server/db.ts` already contained the persistence tables needed by this rescue.

### Disconnected or hidden behavior

- Natural-language requests in the active Create shell routed only to campaign packages or image ads.
- Video prompts could not reach `StudioWorkbench` from the active product.
- The existing Library and Calendar hooks were hidden rather than productized.
- Results and self-learning procedures existed but had no normal workspace page.
- Settings was reachable primarily through a dialog rather than a full workspace view.
- Reusable weekly fallback copy and render-overlay fallback paths still contained unconditional EquiProfile wording.

## What PR64H Wires

## Top-menu workspace shell

The active app now uses one top menu under the existing EquiProfile dashboard shell:

`Create | Library | Calendar | Results | Settings`

No second left sidebar was added. Settings is a full workspace page, not a modal-only path. Admin Support remains collapsed.

## AI-guided Create routing

`marketingIntentRouter.ts` maps natural language into existing workflows:

- advert, advertisement, image, static, graphic, banner, thumbnail → image-ad route
- reel, video, Shorts, TikTok, Facebook reel → assembled Studio video route
- 2-minute video → assembled Studio route with 120-second target
- 3-minute YouTube video or long-form YouTube explainer → `youtube_3min_video` with 180-second target
- signup, trial, relaunch, growth campaign → signup campaign deliverable composer
- weekly / 7-day content plan → weekly content pack
- email / newsletter → email campaign
- unclear request → one concise clarification question

“Create an advert” no longer becomes a seven-day campaign. “Create me a 30 second Facebook reel” no longer stops as a text plan.

## Studio and render integration

For assembled video requests, the active Create view now:

1. Calls existing `createMarketingStudioPlan`.
2. Passes the generated plan into existing `StudioWorkbench`.
3. Uses the existing guided stepper rather than the default content-type grid.
4. Sources scene media through existing `sourceMarketingSceneMedia`.
5. Queues render work through existing `createMarketingRenderJob`.
6. Keeps existing `getMarketingRenderJob`, `listMarketingRenderJobs`, and `cancelMarketingRenderJob` contracts.
7. Shows render truth and playable output only when `outputPublicUrl` exists.
8. Leaves the manual type grid available only behind “Media Studio / Advanced tools”.

The existing renderer remains truthful: missing stock keys or optional media providers do not become fake completed assets.

## Shared Preview

`MarketingPreviewPanel.tsx` supports:

- image preview with `<img>`
- video preview with `<video controls>`
- audio preview with `<audio controls>`
- campaign package cards
- queued / processing / failed render truth
- exact failure message
- warnings
- open and download actions
- source footer where available

The latest output is shown near the Create prompt instead of being buried at the bottom of a tool wall.

## Library

`MarketingLibraryView.tsx` reuses `useMarketingAssets` and `MarketingAppAssetStore`.

It displays generated/imported images, videos, and audio with:

- playable preview
- open
- download
- copy URL
- use image as Brand Kit logo
- permanent delete through the existing asset mutation

Render-worker output and imported stock assets remain part of the existing media registry; no duplicate asset backend was created.

## Calendar

`MarketingCalendarView.tsx` reuses `useMarketingCalendar`.

It displays:

- date and time
- platform
- title
- review state
- export/posting state
- move-by-one-day reschedule action
- cancel
- schedule export pack

## Results and Learning

`MarketingResultsView.tsx` reuses:

- `getMarketingPerformanceScore`
- `getMarketingWinningPatterns`
- `getMarketingLearningInsights`

It displays clicks, conversions, conversion rate, CTA signals, platform patterns, hooks, CTA styles, audience-angle proxy patterns, saved AI learning notes, insufficient-data truth, and the next recommended action.

No fake result values are introduced.

## Settings

Settings is now a full top-menu workspace view. It retains:

1. Product Profile / scraper
2. Brand Kit
3. Provider Keys: GenX, Qwen, Hugging Face
4. Stock Media: Pexels, Pixabay
5. Social connections
6. Email / SMTP
7. Tracking & Results
8. Export / Schedule
9. Media Studio readiness
10. Admin Support collapsed

Developer Diagnostics remain hidden until Admin Support is explicitly opened.

## Product truth and fallback cleanup

- Weekly reusable fallback copy now uses the current product profile name, audience, benefit, and CTA instead of hardcoded EquiProfile wording.
- Image generation no longer silently inserts EquiProfile when no host app is supplied.
- Render-overlay and render-job mapping fallback branding is EquiProfile-specific only when `hostAppId` is genuinely `equiprofile`; other workspaces get generic placeholders.
- Existing invalid `chat.qwen.ai`, ChatGPT, Claude, Gemini, login-only, social-primary, private, and non-HTML scan rejection remains active.
- Confirmed product profiles remain protected from invalid scans.

## Provider and media truth

- Qwen remains suitable for healthy text, script, scene, caption, and campaign-copy paths.
- GenX and Hugging Face remain media-route candidates only when capability and live-route truth permit execution.
- Qwen media is not falsely promoted to ready when DashScope-native execution is unavailable.
- Pexels/Pixabay remain the stock-image/video sources when keys are present.
- Missing stock keys block stock sourcing only; they do not block planning or campaign text generation.

## Remaining blockers

- Live VPS browser proof is still required after deployment.
- Real image/video/audio generation still depends on valid provider keys and executable provider routes.
- Real Pexels/Pixabay sourcing still depends on valid stock-media keys.
- Direct platform publishing remains export-first until credential-backed social and SMTP adapters are implemented; no fake posted/sent state was added.

## Local Validation Output

- `npm run check` passed: TypeScript completed with `tsc --noEmit`.
- `npm test` passed: 83 test files and 648 tests.
- `npm run preflight` passed: dependency specs and Express route patterns validated.
- `npm run build` passed. The existing generated CSS `@import` ordering warning and bundle chunk-size warnings remain visible; PR64H did not hide or misreport them.
- `bash scripts/marketing_workspace_smoke.sh` passed: 12 PR64H wiring contracts plus shell source checks.
- Local browser visual proof could not run: the disposable production server could not connect to local MySQL at `127.0.0.1:3306`, and the Codex browser surface reported no active browser pane. Run the VPS smoke checklist after deployment.

## VPS Smoke Checklist

1. Open The Marketing App inside the EquiProfile dashboard.
2. Confirm the top menu shows Create, Library, Calendar, Results, Settings with no extra left sidebar.
3. Run “Create an advert for EquiProfile” and verify image route truth: playable image or exact setup failure.
4. Run “Create me a 30 second Facebook reel for EquiProfile” and verify Studio plan, scene sourcing, queued render, truthful status, and playable video when complete.
5. Run “Create a 2 minute video for EquiProfile” and confirm 120-second target.
6. Run “Create a 3 minute YouTube video for EquiProfile” and confirm `youtube_3min_video` with 180-second target.
7. Run “Create a 7 day Facebook signup campaign for EquiProfile” and confirm campaign package Preview.
8. Open Library and verify generated/imported media previews.
9. Open Calendar and verify schedule drafts, reschedule, cancel, and export pack.
10. Open Results and verify insufficient-data truth or tracked results and learning notes.
11. Open Settings and confirm diagnostics stay hidden until Admin Support opens.
12. Run `bash scripts/marketing_workspace_smoke.sh`.
