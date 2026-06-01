# PR64B Deliverable-First Studio + Output Guarantee Contract

## What PR64B changed

- Extended `getMarketingCreationCapabilities` contract with:
  - `outputGuarantee`
  - `viewerContract`
  - `deliverableKind`
  - `executionLevel`
  - `proofRequired`
- Updated Studio creation lane in `TheMarketingApp` to group capabilities by truth:
  - Ready now
  - Package / plan only
  - Needs setup
  - Future / not wired
- Added output-type-aware action labels:
  - Generate media
  - Generate package
  - Create plan
  - Queue / check setup
  - Setup needed / Not wired / Blocked
- Separated output panel into explicit lanes:
  - Playable media output
  - Deliverable package output
  - Plan-only output
  - Setup/blocker output
  - Not-wired output
- Removed silent unsupported package fallback in deliverable composer:
  - Unsupported types now raise `UnsupportedDeliverablePackageTypeError`
  - No silent fallback to `signup_campaign`
- Updated Settings to include contract-based “Output guarantee truth” status summary.

## Output Guarantee Contract (current truth)

- `image_ad`: `playable_media` when route-ready, otherwise `setup_needed`
- `video_ad_30s`: `package_only` (never claims rendered video)
- `assembled_video_3m`: `plan_only` (never claims rendered video without render proof)
- `signup_campaign`: `package_only` when text/package+schedule paths are ready
- `avatar_video`: `queued_media` / `setup_needed` (not first-class playable proof yet)
- `social_post`: `not_wired`
- `email_campaign`: `not_wired`
- `weekly_content_pack`: `not_wired`
- `blog_seo`: `not_wired`

## Frontend confusion removed

- 30-second and 3-minute flows no longer visually masquerade as rendered video.
- Blockers are now visible in the main preview panel (not toast-only).
- Future/not-wired capabilities remain visible but not executable.
- Avatar/voice/music remain in vision but are marked truthful queued/setup states.

## What remains incomplete

- No guaranteed playable avatar/voice/music output yet.
- No first-class social/email/weekly/blog generation/viewer lane yet.
- Rendered assembled video still depends on real Media Factory runtime output.
- Direct posting still correctly blocked until connector readiness + real platform IDs.

## Recommended next PR

**PR64C — First-class social/email/signup deliverable execution and viewer contracts**

Reason:
- Fastest path to increase real operator value without waiting on heavy media runtime.
- Converts currently `not_wired` high-frequency creation types into truthful first-class package outputs.
- Keeps media-heavy avatar/voice/music executable completion as the following PR once text/campaign deliverables are consistently operator-ready.
