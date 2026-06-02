# PR64E Product Intelligence and LLM Copy Repair

## What Was Missing

PR64D added first-class package composers for signup, social, paid social, email, and weekly content. Those composers still relied on structured template copy and could mark copy as model-generated when no provider output had been used. The Studio also had no reusable product truth profile, so visuals and copy could drift away from the app being marketed.

## Product Intelligence Layer

PR64E adds `marketingProductProfiles`, scoped by `tenantId`, `workspaceId`, and `hostAppId`.

Stored product profile fields:

- host app, app name, domain, landing-page URL, signup URL
- selected logo asset, candidate logo URLs, candidate logo asset IDs, brand colors
- target audiences, primary offer, trial or pricing details
- core features, benefits, pain points solved, objections, proof points, differentiators
- forbidden claims, tone of voice, CTA library, platform positioning notes
- extracted source URLs, scrape source mode, last scraped time, confirmed time
- confidence score and missing-info fields
- raw scrape summary for Developer Diagnostics only

## Scraper and Ingestion Behavior

`scanMarketingProductSite` validates public HTTP or HTTPS URLs and blocks localhost, internal domains, and private or loopback IP ranges.

Execution order:

1. Use Firecrawl `/v1/scrape` when `FIRECRAWL_API_KEY` is configured.
2. Fall back to guarded basic HTML fetch when Firecrawl is not configured or fails.
3. Revalidate each basic-fetch redirect target before following it.
4. Extract title, metadata, headings, body text, links, signup or trial links, CTA text, trial or pricing text, audiences, features, benefits, proof text, colors, and logo candidates.
5. Save the clean reusable profile for campaign generation.
6. Save raw scrape summary separately for Settings -> Developer Diagnostics.
7. Register detected logo URLs as candidate-only assets where the media registry is available. The scan does not overwrite the Brand Kit logo.

If scraping cannot run, the procedure returns manual setup questions. Product notes can be ingested as a manual profile. Campaign generation remains blocked until the profile is sufficiently complete.

## EquiProfile Product Truth

When EquiProfile or equestrian stable-management context is detected, extraction enriches the profile with known product context:

- EquiProfile is an equine and stable management platform.
- Audiences include stable owners, horse owners, riding schools, trainers, yards, and equestrian businesses.
- Features include horse health records, document tracking, stable management, scheduling, staff visibility, and operational growth support.
- Benefits include organized stable operations, visible horse records, document tracking, schedule and staff coordination, and growth support.
- CTA output points to the configured signup or free-trial URL where present.

## Campaign Prompt Wiring

The package composers load product profile and brand memory before creating campaign records. Missing or low-confidence product profiles raise a setup blocker with two to four product questions instead of producing generic filler.

The existing marketing model execution route is reused:

- Standard copy: Qwen first, then Hugging Face, then GenX.
- Elite copy: GenX first where supported, then Qwen or Hugging Face fallback routes.
- Export-first and human review remain the defaults.

Model prompts now include product profile facts, Brand Memory context, configured CTA, and forbidden claims.

## LLM-Generated Copy

Real provider calls now drive final copy where the route succeeds:

- `social_post`: platform hook, caption, CTA, hashtags, proof note
- `paid_social_ad`: primary text, headline, description, CTA, audience angle, offer note
- `email_campaign`: subject, preview text, body, CTA, timing
- `weekly_content_pack`: day-by-day social and email outputs
- `signup_campaign`: coherent seven-day social and email conversion plan

Truth flags are corrected:

- `textGeneratedByModel=true` only when provider output is parsed and used.
- `fallbackUsed=true` only when product-aware deterministic fallback copy is used.
- Provider setup or availability blockers remain visible without claiming model generation.

## Frontend Product Setup

The main Studio now renders a Product Intelligence card with:

- "Let's learn what we're marketing first."
- website or landing-page URL
- signup URL
- short product notes
- Scan product, Edit profile, Confirm profile
- product name, audience, offer, benefits, CTA, missing info, confidence score
- logo candidate preview and Upload logo / Choose from Assets path

Raw scrape diagnostics do not render in the main Studio. They are available only inside Settings -> Developer Diagnostics.

## Remaining Incomplete Work

- Logo candidates are registered and previewed, but remote logo download, image normalization, and deduplication can be expanded.
- The Brand Kit logo still requires explicit user selection; scans never overwrite it automatically.
- Product-profile enrichment currently uses extraction rules and EquiProfile context. A future PR can add model-assisted profile review after scrape while preserving source attribution.
- Live Firecrawl, Qwen, Hugging Face, and GenX smoke tests require configured production keys.
- Direct publishing and measured analytics remain connector-gated and are not simulated.

## Exact Live Smoke Tests

1. Open hidden Admin -> Marketing Studio.
2. Confirm Standard and Export-first are selected by default.
3. With no product profile, confirm the Product Intelligence card appears and generation is blocked.
4. Enter the EquiProfile landing-page URL and configured signup URL, then click Scan product.
5. Confirm the extracted card shows EquiProfile, stable-owner and equestrian audiences, the free-trial offer, top stable-management benefits, CTA, confidence score, and any missing info.
6. Confirm no raw scrape HTML, provider payload, or scrape summary appears in the main Studio.
7. Open Settings -> Developer Diagnostics and confirm `productIntelligence.rawScrapeSummary` appears there only.
8. If a logo was detected, confirm it appears as a candidate and the Brand Kit logo is unchanged until explicitly selected.
9. Generate Social Post, Paid Social Ad, Email Campaign, Weekly Content Pack, and Signup Campaign packages.
10. Confirm each package uses EquiProfile features, benefits, audience pain points, configured offer, and signup or free-trial CTA.
11. With Qwen or Hugging Face configured for Standard copy, confirm model copy is used and `textGeneratedByModel=true`.
12. Disable the Standard copy route, regenerate, and confirm product-aware fallback copy uses `fallbackUsed=true` with a friendly provider setup blocker.
13. Confirm no UI claims publishing or analytics results unless the corresponding connector is configured.
