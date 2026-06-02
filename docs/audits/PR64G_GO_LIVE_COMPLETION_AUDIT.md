# PR64G Go-Live Completion Audit

## Scope

PR64G audits and repairs the active Marketing App route after PR64F. It reuses the existing product-intelligence, provider routing, composer, media factory, brand kit, publishing, attribution, results, learning, specialist, manager, genius, and workforce modules. It does not add a parallel campaign engine.

## Audit Findings

### Active frontend

- `TheMarketingApp.tsx` was the active route, but it still carried standalone-width assumptions and exposed an old `StudioHome` card wall from the primary journey.
- `MarketingAppSettings.tsx` was an internal diagnostics surface rather than a normal settings page.
- The Brand Kit logo upload procedure returned a placeholder instead of storing an asset.

### Product intelligence

- The free fallback scraper fetched only one page.
- A scanned site inherited EquiProfile truth when `hostAppId === "equiprofile"`, even when the supplied URL was an unrelated or private AI chat URL.
- Product category was inferred transiently but not stored as profile truth.
- Invalid scans could reach mutation logic instead of being rejected before profile mutation.

### Copy and orchestration

- Deterministic fallback copy leaked package labels and template scaffolding such as `signup_campaign`, `day_1`, `variant for`, and `fastest route to`.
- The normal deliverable composer loaded product and brand context but bypassed performance context, learning insights, specialist context, campaign-manager guidance, genius recommendations, and media-template recommendations.
- Schedule and export records were created before a deterministic quality boundary rejected internal or wrong-category copy.

### Providers and media

- Standard provider policy already prefers Qwen. Elite already prefers GenX.
- Hugging Face used only the legacy `api-inference.huggingface.co/models/...` host. The repaired adapter tries the current HF Inference router contract first: `router.huggingface.co/hf-inference/models/...`, then the legacy compatibility host.
- Pexels and Pixabay integrations were real and preserved provider asset IDs, URLs, source links, and attribution metadata, but stock queries did not accept explicit product category.
- Backend readiness checked stock-media key aliases that differed from the keys saved by Marketing App Settings.

### Publishing, tracking, and learning

- Publishing persistence is truthful: a schedule draft is not marked published unless the adapter returns a real `platformPostId` or `uploadId`.
- Facebook, Instagram, TikTok, YouTube, LinkedIn, Email, and Blog adapters still resolve through `createPlatformPublisherStub`. Direct posting is therefore not go-live and must not be described as complete.
- Attribution links, `/m/:code` click redirect recording, conversion recording, manual metric import, results aggregation, experiment scoring, and learning insight storage already existed.

## Implemented Repairs

### Embedded dashboard workspace

- Replaced the standalone three-column shell with an embedded dashboard workspace.
- Added a compact product strip, campaign stepper (`Product → Plan → Generate → Review → Schedule → Results`), stacked output, and a collapsed inspector.
- Removed `StudioHome` from the primary user journey. Advanced tools now present a small Media Studio entry instead of the legacy card wall.

### Settings cleanup

Normal Settings now shows only:

1. Product profile
2. Brand Kit
3. Provider keys
4. Stock media
5. Social connections
6. Email / SMTP
7. Tracking & Results
8. Export / Schedule
9. Media Studio readiness

Raw diagnostics render only inside collapsed `Admin Support`, and the diagnostics query does not run until that section opens.

### Public product crawl and universal truth

- Added stored `category` to `marketingProductProfiles`.
- Added an 8-second-per-page, 2 MB-per-page, same-origin crawler with maximum 12 pages and depth 2.
- Added discovery from homepage anchors, `sitemap.xml`, and common product paths.
- Rejects AI chat URLs, login/conversation paths, social primary URLs, and non-HTML download/media URLs before profile mutation.
- EquiProfile defaults now apply only to EquiProfile draft contexts. Scanned property, automotive, SaaS, and equine sites keep category-specific truth.
- Invalid scans return: `This does not look like a public product website. Add the real website or enter product details manually.`

### Product-aware campaign generation

- The normal composer now loads saved product truth, brand memory, performance context, learning insights, platform specialist context, campaign-manager guidance, genius structure/playbook guidance, and media-template recommendations before copy execution.
- Added per-package orchestration metadata for Strategy, Copy, Media, QA, Scheduler, and Results roles.
- Real model output remains marked `textGeneratedByModel=true` only after provider execution. Deterministic fallback remains `fallbackUsed=true`.

### Campaign quality gate

Before schedule/export readiness, the deterministic quality gate rejects:

- internal labels and raw metadata,
- repeated blocks,
- copied prompts,
- setup instructions inside copy,
- missing CTA,
- missing product-specific facts,
- equine language for non-equine products,
- automotive language for non-automotive products.

Failed campaigns remain partial, do not create schedule drafts, and do not become export-ready or postable.

### Hugging Face repair

- Added current-router-first execution with legacy-host compatibility fallback.
- Added candidate model retries before legacy host fallback.
- Added failure classification for network/DNS/TLS/fetch, token, permission, model unavailable/loading, rate limit, unsupported task, and response schema mismatch.
- Added last successful Hugging Face model/task route memory.
- Hugging Face is not marked ready merely because a key exists; live provider success remains required for healthy routing.

### Stock media

- Added category-aware stock queries for equine, property, automotive, and SaaS/app contexts.
- Repaired readiness to read the Marketing App keys saved by Settings.
- Missing Pexels/Pixabay keys remain a stock-media setup notice and do not block text campaigns.

### Brand Kit and tracking

- Repaired direct logo upload: validates image type and size, stores the file, registers the media asset, activates it in Brand Kit, and mirrors the logo asset onto product truth.
- Generated packages now create a real attribution link when a signup URL exists and show the tracking state when it does not.
- Added `runMarketingLiveSmokeCheck` for product profile, invalid URL rejection, provider copy proof, Hugging Face diagnostics, quality gate, stock keys, media readiness, Brand Kit, export contract, attribution, connectors, results, and learning.

## What Fully Works App-Side

- Embedded campaign workspace and clean settings.
- Public multi-page scraper without Firecrawl.
- Universal product category persistence and invalid URL rejection.
- Qwen-first Standard routing and GenX-first Elite routing.
- Hugging Face current router contract, candidate retry, compatibility fallback, and actionable failure classification.
- Product-aware deterministic fallback, model truth markers, orchestration context, campaign quality gate, export-first behavior, Brand Kit logo upload, attribution link creation, `/m/:code` click records, conversions, manual results, aggregation, and learning storage.
- Pexels/Pixabay sourcing when keys exist.

## Remaining Blockers

### Direct publishing is not go-live

The social/email publishing adapters are still stubs. Existing persistence correctly refuses to mark a draft posted or sent without a provider ID. A follow-up must implement credential-backed adapters and test-send/test-post contracts for:

- Facebook Pages: OAuth app, page token, page ID, publish scopes.
- Instagram Business: Meta OAuth, page-linked Instagram business account, content publish scopes.
- TikTok: OAuth app, creator publish scopes, approved posting access.
- YouTube: Google OAuth client, upload scope, channel access.
- LinkedIn: OAuth app, organization/member posting scopes.
- Email: SMTP host, port, username, password, from address, and a real message-ID-returning send adapter.

### Live credential proof is environment-dependent

This local workspace does not contain production provider or stock-media secrets. VPS smoke must run real provider tests after adding valid:

- `QWEN_API_KEY` or `marketing_qwen_api_key`
- `HUGGINGFACE_API_KEY` or `marketing_huggingface_api_key`
- `GENX_API_KEY` or `marketing_genx_api_key` when Elite/media execution is allowed
- `MARKETING_PEXELS_API_KEY`
- `MARKETING_PIXABAY_API_KEY`

## Smoke Commands

```bash
bash scripts/marketing_scraper_smoke.sh
bash scripts/marketing_huggingface_smoke.sh
bash scripts/marketing_stock_media_smoke.sh
bash scripts/marketing_media_smoke.sh
bash scripts/marketing_connector_smoke.sh
bash scripts/marketing_live_smoke.sh
```

On VPS, invoke `admin.runMarketingLiveSmokeCheck` with `executeLiveProviders=true` after saving provider keys. A healthy result proves Qwen/Hugging Face live execution instead of key presence alone.

## Local Validation Output

- `npm run check`: passed.
- `npm test`: passed (`82` files, `636` tests).
- `npm run preflight`: passed.
- `npm run build`: passed. Existing CSS `@import` ordering and chunk-size warnings remain non-blocking.
- `marketing_scraper_smoke.sh`: passed (`5` focused tests). Public crawl works without Firecrawl.
- `marketing_huggingface_smoke.sh`: passed (`7` focused tests, `10` skipped). A local live-provider proof still requires `HUGGINGFACE_API_KEY` or `marketing_huggingface_api_key`.
- `marketing_stock_media_smoke.sh`: passed (`11` focused tests, `8` skipped). Live sourcing still requires Pexels/Pixabay keys.
- `marketing_media_smoke.sh`: passed (`20` focused tests).
- `marketing_connector_smoke.sh`: passed its truth-contract tests and reported the remaining blocker: social and email posting adapters remain stubs, so export/manual delivery is available but direct posting is not go-live.
- `marketing_live_smoke.sh`: passed type-check, `19` focused tests, and route contract checks.
- Browser visual smoke could not attach because this Codex desktop thread had no active browser pane. Static embedded-shell tests and the production build passed.

## Recommended Next PR

PR64H should implement real credential-backed social and SMTP publishers, secure token dereferencing, OAuth setup actions, safe test-post/test-send procedures, and provider-ID persistence tests. That is the remaining app-side blocker to direct publishing go-live.
