# Old Marketing Extraction Rules

## Keep in EquiProfile only when independently required

- Transactional account email
- EquiProfile product analytics
- Subscription billing
- Secure file/media storage used by horse records
- General AI assistant functions for horse/stable management
- Audit logging
- Consent and unsubscribe records required for EquiProfile communications
- Conversion event emission to the standalone marketing service

## Move to EquiProfile Marketing

- Campaign workspaces and campaign items
- Brand kits and marketing product profiles
- Social connections and publishing adapters
- Marketing provider/model catalogues and telemetry
- Marketing generation, render and avatar jobs
- Marketing audio, voice and creative assets
- Campaign schedules, reviews and approvals
- Campaign results, attribution links and conversion analysis
- Marketing agents, tasks, memory and optimization loops
- External lead lists and outreach sequences intended for marketing operations
- Marketing marketplace packages

## Remove after migration and retention review

- Embedded Marketing App pages and components
- Admin Marketing Studio screens
- Marketing-only tRPC procedures
- Marketing-only cron jobs and queue consumers
- Duplicate AI provider code replaced by the standalone platform
- Dead feature flags and environment variables
- Old marketing database tables after export, archive and rollback window

No removal is allowed to break EquiProfile password reset, verification, subscription messages, support communication, internal analytics or legally required suppression records.
