# PR63A Marketing App Truth Contract Repair

Date: 2026-06-01
Branch: pr63a-marketing-truth-contract

## What was broken

- Backend runtime table creation for `marketingBeastModeVariants` had an index/column contract mismatch risk in startup SQL shape checks.
- `listMarketingScheduleDrafts` could fail at runtime on legacy/partial rows and bubble 500 instead of safely returning an empty list for clean or bootstrap states.
- Frontend creation menu was hardcoded and could imply readiness for creation types that were not first-class wired.
- Frontend defaulted to `elite` quality mode instead of `standard`.
- Settings checklist used generic provider-live signals instead of task-route truth for image/voice/music/avatar/render readiness.

## What was fixed

- Added `getMarketingCreationCapabilities` backend truth contract and wired it to tRPC.
- Fixed `marketingBeastModeVariants` runtime `CREATE TABLE` indexes to reference real columns only.
- Hardened schedule draft listing with safe date serialization + narrow fallback for missing-table/field DB errors.
- Updated The Marketing App creation flow to:
  - fetch/render creation types from backend capability contract,
  - default quality mode to `standard`,
  - visibly show setup/broken/not-wired reasons in main preview panel,
  - mark planned-only flows clearly as plan/package outputs.
- Updated settings setup checklist to route-level truth using `getMarketingTaskCapabilityMap`, backend readiness, and connector readiness.

## What is genuinely ready now

- `image_ad` readiness status is determined by real `image_generation` route readiness.
- `video_ad_30s` and `assembled_video_3m` are truthfully represented as package/plan outputs unless render stack readiness is proven.
- `signup_campaign` readiness is tied to task routes plus schedule/export persistence health.
- Schedule listing returns safe empty results in bootstrap states instead of crashing.

## What remains scaffolded / setup_needed

- `social_post`, `email_campaign`, `blog_seo`, `weekly_content_pack` remain `not_wired` until first-class procedures + viewers exist.
- `avatar_video` remains `planned_only`/`setup_needed` until end-to-end playable output is proven.
- Rendered assembled-video output remains setup-dependent on real FFmpeg/Remotion/media-factory runtime completion.

## Capability status model used

- `ready`
- `setup_needed`
- `planned_only`
- `not_wired`
- `broken`

## Validation commands

- `npm run check`
- `npm test`
- `npm run preflight`
- `npm run build`

Results in this PR:

- `npm run check` passed.
- `npm test` passed (`77` files, `607` tests).
- `npm run preflight` passed.
- `npm run build` passed (non-blocking chunk-size/CSS import-order warnings only).

## Next recommended PR

PR63B: First-class deliverable wiring for `social_post`, `email_campaign`, `blog_seo`, and `weekly_content_pack` with explicit procedures, persisted campaign items, and preview/render contracts so these types can move from `not_wired` to truthful `ready`/`setup_needed` states.
