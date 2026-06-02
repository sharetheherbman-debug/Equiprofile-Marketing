# PR64F Frontend Flow Rescue and Product Gate Fix

## What PR64E made too strict

PR64E correctly added persistent product intelligence and product-aware model copy, but the active Studio treated a missing or low-confidence product profile as a hard stop. The Generate button was disabled and the primary UI exposed too many legacy capability, readiness, media, and diagnostic concepts at once.

## Product profile gate repair

`getSafeMarketingProductContext(...)` now resolves campaign context in this order:

1. Confirmed stored profile when confidence is ready.
2. Saved draft profile when one exists.
3. Safe EquiProfile defaults when `hostAppId` is `equiprofile`.
4. Manual product-notes draft when notes exist for another host app.
5. Friendly setup questions when the product is truly unknown.

EquiProfile defaults are intentionally factual and conservative. They describe EquiProfile as an equine and stable-management platform for stable owners, horse owners, riding schools, trainers, yards, and equestrian businesses. They cover horse health records, document tracking, stable management, scheduling, staff visibility, and operational growth support. They do not invent proof, publishing, analytics, pricing, or customer outcomes.

The shared deliverable composer now uses this safe context helper before social posts, paid social ads, email campaigns, weekly content packs, signup campaigns, and existing creative package flows. Missing EquiProfile persistence no longer prevents deterministic product-aware draft copy.

## New frontend layout

The active Marketing App is now a desktop-first three-column workspace:

- Left: 280px product context and Brand Kit status.
- Center: flexible campaign prompt, plan, and output review.
- Right: 340px workflow status, export truth, tracking truth, and connector guidance.

The centered shell uses a 1600px maximum width and protects the flexible column from horizontal overflow. It is designed for 1366px, 1440px, and 1920px desktop widths.

## Primary user flow

The visible workflow is:

1. Product context
2. Prompt
3. Plan campaign
4. Generate campaign
5. Review, export, schedule, and track

The prompt `Create a 7-day Facebook signup campaign for EquiProfile` routes to `signup_campaign`, not image generation. Image generation runs only when the prompt explicitly asks for an image, banner, visual, graphic, or creative asset.

## Product setup UX

When the profile is missing or needs review, the left panel shows one friendly card:

`Let’s learn what we’re marketing.`

The card includes:

- Website URL
- Signup URL
- Product notes
- Scan site
- Save draft
- Use EquiProfile defaults
- Confirm profile
- Logo upload or asset selection entry point

Planning and draft campaign generation remain available while the profile is incomplete. Missing signup URLs are shown as a tracking-link limitation, not a workspace blocker.

## Clutter removed from the primary path

The primary workflow no longer renders the legacy top-level Creative, Media, Details, readiness-grid, capability-grid, raw-provider, or raw-diagnostic wall. Existing guided creative tools remain available inside a collapsed Advanced tools drawer. Developer Diagnostics remain in settings.

## Fallback copy behavior

When product context or providers are incomplete, EquiProfile campaigns use safe deterministic defaults and keep:

- `textGeneratedByModel=false`
- `fallbackUsed=true`

The UI explains:

`Draft campaign generated from saved product defaults. Scan your website or sync providers for stronger AI copy.`

When a ready model route returns copy, existing model truth remains unchanged:

- `textGeneratedByModel=true`
- `fallbackUsed=false` unless a mixed package genuinely used a fallback

## Still incomplete

- Live VPS proof of website scraping and stored profile confirmation.
- Live Standard Qwen or Hugging Face provider proof for model-generated copy.
- Final Brand Kit logo confirmation flow beyond the existing Assets entry point.
- Connected Facebook publishing proof. Export remains the truthful default.
- Connected analytics and tracking proof. The UI only reports tracking readiness from the signup URL.
- Avatar, voice, music, and video execution. These remain outside PR64F.

## Exact VPS smoke test

1. Deploy the PR branch and sign in as an admin.
2. Open The Marketing App at 1366px, 1440px, and 1920px desktop widths.
3. Confirm the three-column layout has no horizontal scroll.
4. With no stored product profile, confirm the left panel shows `Use EquiProfile defaults`.
5. Leave Website URL and Signup URL blank.
6. Enter `Create a 7-day Facebook signup campaign for EquiProfile`.
7. Click `Plan campaign` and confirm the plan renders without requiring a product scan.
8. Click `Generate campaign` and confirm a signup campaign draft renders summary, schedule, Facebook posts, ad variants, export state, and signup-URL guidance.
9. Confirm the draft notice says saved product defaults were used when providers are incomplete.
10. Add the EquiProfile landing page URL, scan the site, review the extracted profile, and confirm it.
11. Add the signup URL and confirm the right rail changes from `Signup URL needed` to `Tracking link ready`.
12. Sync Standard Qwen or Hugging Face providers and generate again.
13. Confirm model-backed output only reports AI copy when a real provider response was used.
14. Open Advanced tools and confirm the guided creative workbench is collapsed by default.
15. Open Settings and confirm Developer Diagnostics stay outside the main workflow.
