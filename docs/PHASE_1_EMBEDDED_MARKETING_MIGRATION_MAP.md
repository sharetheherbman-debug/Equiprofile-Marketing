# Phase 1 Embedded Marketing Migration and Deletion Map

## Final product boundary

EquiProfile Marketing is **not** an EquiProfile customer feature.

The standalone white-label EquiProfile Marketing application is an owner-only operational system used to market EquiProfile itself. The only EquiProfile launch control belongs in the hidden owner administration area and opens the separate Marketing application through signed one-use SSO.

EquiProfile and Marketing must keep separate databases, sessions, cookies and runtime secrets.

## Current safety boundary

Before physical deletion, the embedded EquiProfile Marketing runtime is being converted into a read-only migration source:

- customer/public `/ai-marketing` exposure is deleted;
- the embedded Marketing UI is disconnected;
- Marketing campaign/outreach/autopilot schedulers are removed from the EquiProfile runtime;
- embedded Marketing tRPC writes are centrally rejected;
- the standalone launcher is owner-only and server-gated to `PRIMARY_ADMIN_EMAIL`;
- historical records are retained temporarily for migration/reconciliation only.

No legacy Marketing database table is to be dropped until backup, migration, row-count reconciliation and rollback validation are complete.

## Standalone replacement surfaces already present

The standalone Marketing API currently mounts dedicated product surfaces for:

- campaigns;
- content;
- agents;
- prompts;
- Brand DNA;
- knowledge;
- competitors;
- trends;
- content studio;
- templates;
- calendar;
- campaign AI;
- controlled social publishing;
- CRM and CRM AI actions;
- integrations;
- billing;
- Generation Credits;
- Relaunch Control Centre;
- studio production;
- GenX administration;
- long-form video/production.

These are the preferred destinations for useful embedded EquiProfile Marketing capabilities. They are **not** to be rebuilt inside EquiProfile.

## Data/capability migration classes

### A. Migrate/reconcile before deletion

Historical business records that can provide operational continuity, compliance evidence or learning value:

- Marketing contacts and source metadata;
- unsubscribe/suppression records;
- campaign definitions and historical status;
- campaign recipients and send history;
- follow-up sequence history;
- campaign replies where lawfully retained;
- campaign results and performance history;
- attribution/conversion records that remain useful and consent-compatible;
- Brand/creative configuration that can be represented by standalone Brand DNA;
- useful content/media metadata and generated-asset references;
- useful schedule/calendar history;
- useful CRM relationship/history data;
- useful competitor/trend/content-gap intelligence;
- useful product/brand memory and learning insights;
- useful experiment/winner/creative-performance history.

Migration must preserve suppression/unsubscribe state before any campaign-capable data is activated in the standalone application.

### B. Merge into an existing standalone capability

Embedded implementations with a clear standalone destination:

| Embedded EquiProfile capability | Standalone destination |
| --- | --- |
| Campaign builder / campaign records | Campaigns / Campaign AI |
| Content generation / creative workflow | Content / Content Studio |
| Brand kits / brand context | Brand DNA |
| Agent workforce / campaign agents | Agents |
| Brand memory / product intelligence | Knowledge / Brand DNA |
| Competitor intelligence | Competitors |
| Trend intelligence | Trends |
| Templates | Templates / Template Library |
| Marketing schedules | Calendar |
| Social publishing | Controlled Social via Relaunch Control Centre |
| Contact/customer marketing history | CRM |
| Channel/provider connections | Integrations |
| Generation cost/billing | Generation Credits / Billing |
| Studio/media composition | Studio / long-form production |
| Autonomous policy/execution | Relaunch Control Centre |

### C. Do not migrate as executable configuration

The following legacy state must not be copied into the standalone runtime as trusted executable configuration:

- old provider API keys or browser-entered credentials;
- legacy Qwen/Hugging Face/provider failover configuration;
- EquiProfile session cookies or JWTs;
- EquiProfile database credentials;
- old cron/scheduler registrations;
- old autonomous-send state that could immediately trigger delivery;
- old ad-spend activation state;
- raw connector secrets from browser/database records.

Standalone Marketing remains GenX-only and receives production secrets from its own server environment.

### D. Retain in EquiProfile

Only EquiProfile-core functions:

- normal product/account transactional email;
- event and horse-management reminders;
- trial/account notices;
- EquiProfile account/subscription/horse analytics;
- backend-only consent-safe conversion signals to standalone Marketing;
- hidden owner Marketing connection/status launcher.

## Physical deletion sequence

Physical code deletion should be done in dependency-safe batches after migration coverage is confirmed:

1. remove legacy `Marketing Studio` navigation/section from the oversized Admin page;
2. delete the now-unreachable embedded Marketing frontend app/components;
3. delete legacy Marketing-specific workers/schedulers already disconnected from startup;
4. remove Marketing-only provider/runtime execution code from EquiProfile;
5. remove Marketing write procedures from `server/routers.ts` after required read/migration exports are extracted;
6. remove Marketing-only Growth Engine/runtime modules no longer referenced by EquiProfile core;
7. remove obsolete tests/audit assertions that exist only for deleted embedded runtime code, replacing them with product-boundary tests;
8. archive legacy Marketing tables/data after production migration evidence is captured;
9. only then prepare a reviewed drop migration for obsolete tables, if still desired.

## Migration acceptance evidence

Before a source category is deleted, record:

- source record count;
- destination record count or explicit archive decision;
- deterministic mapping/key strategy;
- duplicate handling;
- suppression/unsubscribe preservation;
- timestamp/timezone preservation where material;
- asset/file existence checks where applicable;
- a sampled record reconciliation;
- rollback/archive location.

## Release rule

EquiProfile must be able to run safely with the standalone Marketing service unavailable. The hidden owner card may report `Not configured` or unavailable, but no customer-facing EquiProfile workflow may depend on Marketing being online.
