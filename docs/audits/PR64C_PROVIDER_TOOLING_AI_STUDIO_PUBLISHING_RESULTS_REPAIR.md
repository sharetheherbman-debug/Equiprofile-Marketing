# PR64C Provider/Tooling + AI Studio + Publishing/Results Repair Audit

## Root cause of `setup_needed` everywhere
- Marketing provider routes were matching only raw marketing task names.
- Synced provider `supportedTasks` are canonical executable tasks (`strategy`, `copywriting`, `text_to_image`, etc.).
- Because canonical fallback matching was missing, valid providers were rejected and surfaced as `setup_needed`.

## Provider routing fix
- Updated resolver matching to accept:
  - exact marketing task match, or
  - canonical task match from the marketing capability matrix.
- Added route decision truth context:
  - `marketingTask`, `canonicalTask`
  - accepted `candidates`
  - `rejectedCandidates` with reasons
  - `budgetStatus`, `setupStatus`.

## Hugging Face degraded handling
- Added provider tooling truth service with explicit Hugging Face degraded reason classification:
  - invalid key
  - missing permissions
  - endpoint unavailable
  - rate-limited
  - no model resolved
  - unsupported task
  - unknown.

## Provider tooling truth endpoint
- Added admin endpoint: `admin.getMarketingProviderToolingTruth`.
- Returns:
  - provider key/config/health/model counts/task counts/recommendations
  - required task route truth map
  - publishing readiness truth
  - attribution/results availability truth
  - blockers and recommendations.

## AI-first Studio changes
- Main composer now leads with:
  - **“Hi, what are we marketing today?”**
- Added product-facing example prompts and brand context in the center panel.
- Updated default prompt placeholder to a campaign-oriented example.

## Brand/logo upload status
- Brand panel now clearly guides users to upload logos via Assets and then select a saved image asset as the active Brand Kit logo.
- Removed “setup-needed” final messaging from the primary brand upload guidance.

## Publishing connector truth
- Settings now includes clearer publishing connector state language and export-first fallback explanation.
- Existing publish pipeline still requires real platform IDs before marking success.

## Email connector truth
- Connector readiness remains explicit for missing SMTP/config states through connector readiness service.

## Attribution/results status
- Settings now surfaces attribution/result readiness states from tooling truth:
  - redirect route
  - click tracking
  - conversion recording
  - manual metrics import.

## Learning loop status
- Result-learning pathways remain wired through existing results/brand-memory modules; tooling truth now surfaces readiness dependencies and blockers.

## What is fully working
- Canonical task-aware provider route matching.
- Provider tooling truth endpoint contract and diagnostics surface.
- AI-first main studio prompt entry experience.
- Friendly package summary and diagnostics separation in deliverable viewer.

## What requires external credentials/scopes
- Provider keys and model-specific readiness (GenX/Qwen/Hugging Face).
- Social connector tokens/scopes.
- SMTP/blog connector config where applicable.

## Exact live smoke tests
- Run “Test all providers” in Marketing Settings.
- Run “Sync all capabilities”.
- Run “Test route map”.
- Verify `getMarketingProviderToolingTruth` payload includes providers/routes/publishing/attribution.
- Generate an example campaign prompt and verify user-facing composer content.

## Remaining blockers
- Real platform connector provisioning and scopes are external dependencies.
- Provider live readiness still depends on valid credentials and reachable endpoints.
- Full manual-logo direct upload API path remains out-of-scope; asset-based logo workflow is the current safe path.

## Recommended next PR
- **PR64D — First-class Social / Email / Signup Campaign Deliverables**
