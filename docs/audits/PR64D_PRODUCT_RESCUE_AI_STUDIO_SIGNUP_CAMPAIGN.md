# PR64D Product Rescue — AI Studio Signup Campaign

## Audit findings
- The Studio creation menu exposed backend-only diagnostic group labels in the main user flow.
- Creation buttons leaked backend/internal labels such as `Output:` and `Expected:`.
- First-class package generators were missing for social posts, paid social ads, email campaigns, and weekly content packs.
- Signup campaign package persistence included a default blog item that did not match the desired campaign output.
- Regression coverage needed to be stricter for both frontend Studio UI behavior and backend package composition.

## Changes made
- Simplified the Studio left rail to show a single primary creation list without diagnostic grouping.
- Moved future/not wired capabilities into a collapsed `Advanced` details block.
- Added a `Plan campaign` action, `campaignPlan` state, and plan rendering in the Plan tab.
- Added deliverable composer generators for:
  - `social_post`
  - `paid_social_ad`
  - `email_campaign`
  - `weekly_content_pack`
- Updated `composeMarketingDeliverablePackage` to route the new package types explicitly.
- Removed the default signup-campaign blog item from campaign item creation.
- Wired new backend procedures in `server/routers.ts` for the new package generators.
- Added PR64D regression tests for Studio source constraints and backend package generation behavior.

## Validation target
- Preserve existing TheMarketingApp source-string and render tests.
- Keep `setup_needed`, `waiting_for_backend`, and other internal readiness markers in source logic.
- Ensure unsupported package types still throw `UnsupportedDeliverablePackageTypeError`.
