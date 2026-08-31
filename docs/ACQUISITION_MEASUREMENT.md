# EquiProfile acquisition and Google measurement contract

## Runtime configuration

The server uses `PUBLIC_SITE_URL` as the canonical Management origin and the
existing `ACADEMY_PUBLIC_ORIGIN` for Academy. `SHOP_PUBLIC_ORIGIN` is retained
for the deferred Store. Origins must be absolute HTTP(S) URLs and must never be
temporary VPS addresses.

Google account values are optional and must be supplied through the runtime or
build environment:

- `VITE_GTM_CONTAINER_ID` — a real `GTM-...` container ID. When absent or
  malformed, no Google script request is emitted.
- `GOOGLE_SITE_VERIFICATION` — optional Search Console HTML-meta token. DNS
  Domain verification is preferred. When unset, the tag is absent.

GA4 Measurement IDs, Google Ads IDs, conversion IDs and conversion labels do
not belong in Core source. Configure them in the approved GTM container after
deployment.

## Consent and attribution

The initial HTTP HTML establishes denied Consent Mode v2 defaults for
`analytics_storage`, `ad_storage`, `ad_user_data` and `ad_personalization`
before the GTM bootstrap. The first-party privacy control lets a visitor accept,
reject or later revise optional measurement. Application authentication and
security storage remain necessary and are not represented as optional Google
consent.

Campaign values are limited to `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `gclid`, `gbraid` and `wbraid`. They are stored in
session storage and attached to data-layer events only after acceptance. They
are never added to canonical URLs.

Private page measurement is reduced to the first route segment. Record IDs,
passport/share tokens and query strings are never included in page paths or
titles sent to the data layer.

## Data-layer events

All events pass through `client/src/analytics.ts`. Unknown fields, PII-shaped
field names, email-like values, phone-like values, multiline free text and
oversized strings are rejected. Events are ignored until optional measurement
is accepted, and immediate duplicates are suppressed.

| Event                              | Allowed fields                         | Core firing point                                                   |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `page_view`                        | `page_path`, `page_title`              | One canonical path change                                           |
| `sign_up`                          | `method`                               | Successful account creation response                                |
| `login`                            | `method`                               | Successful login response                                           |
| `generate_lead`                    | `lead_source`                          | Successful real Management or Academy contact submission            |
| `search`                           | `search_term`                          | Contract available for a genuine public search; not currently wired |
| `academy_course_view`              | `course_id`, `pathway_id`              | Learner opens a published pathway                                   |
| `academy_enrollment`               | `course_id`, `enrollment_type`         | Authorised Academy invitation acceptance                            |
| `academy_lesson_complete`          | `lesson_id`, `pathway_id`              | First persisted lesson completion                                   |
| `academy_assessment_complete`      | `lesson_id`, `score`, `question_count` | Server-scored knowledge check completion                            |
| `management_opened`                | `entry_point`                          | Authenticated Management dashboard entry                            |
| `horse_record_created`             | `record_type`                          | Successful horse record creation, without record ID or horse name   |
| `management_task_created`          | `task_type`, `recurring`               | Successful task creation                                            |
| `management_calendar_item_created` | `item_type`                            | Successful calendar item creation                                   |
| `marketing_opened`                 | `entry_point`                          | Owner receives a valid standalone Marketing redirect                |
| `marketing_campaign_created`       | `campaign_type`                        | Standalone Marketing contract; not manufactured in Core             |
| `marketing_asset_approved`         | `asset_type`                           | Standalone Marketing contract; not manufactured in Core             |
| `marketing_content_published`      | `channel`                              | Standalone Marketing contract; not manufactured in Core             |

Opening a page is not a paid conversion. GTM/Ads conversion mapping is a later
Google-account configuration step.

## Academy curriculum publication

Learner traffic performs a read-only readiness check and cannot seed or replace
curriculum. Inspect the deployed database first:

`npm run academy:curriculum:bootstrap`

For a clean database, publish the factual-source curriculum explicitly:

`npm run academy:curriculum:bootstrap -- --apply --confirm-version=2026.2`

The default apply mode refuses to overwrite canonical rows. Updating an
existing source-managed curriculum requires the additional explicit
`--update-source-managed` flag, an approved source release, a database backup
and the same version confirmation. Custom non-canonical curriculum rows and
learner completion history are not deleted by the source sync.
