# EquiProfile / AmarktAI platform handover — 2026-09-03

## Candidate set

| Repository | Branch | Audited start | Release-code SHA |
| --- | --- | --- | --- |
| Core / Management / Academy / Shop | `chatgpt/final-client-handover-2026-09-02` | `c6dc23ef6f69bd563bf28a6381870d0517788baa` | `114f85a722f34cb9fbcb9c5c2dd70dcc85f41937` |
| White-label Marketing | `chatgpt/final-client-handover-2026-09-02` | `e69a8b3ca1c216715dbcf448aeaaecfafa8b299a` | `f1578041266c98e4fcb95b290832cae24245245c` |
| Central Billing | `chatgpt/final-client-handover-2026-09-02` | `d1dc171549bae84635bc0eba8a9a27e0984ed09c` | `c0ab6cc0453c481795dea31e5e65cb6bc948d080` |

Documentation-only commits follow these release-code SHAs. Use the three final pushed branch SHAs/PR heads as the immutable review references.

## Architecture and ownership

Core owns identity, customer/admin access, Management, Academy, School and the non-transactional Shop preview. Marketing is one reusable, tenant-configured engine with a canonical crawler, governed Company Brain, product-scope isolation, lifecycle-aware claims, explicit approval boundaries and GenX-backed generation. Billing is the only Stripe customer/subscription/invoice ledger and keeps Management and Academy subscriptions independent.

All remote AI generation is routed through GenX. Pexels/Pixabay may supply licensed stock media; they are not AI fallbacks. Provider failure must remain visible and must not be replaced by deterministic fake generated content.

## Cross-system contracts

- Core → Marketing and Core → Billing use signed, timestamped, nonced server requests and one-time browser handoffs.
- Marketing connector data must be approved, public business knowledge; horse records, private messages, teacher feedback and other operational/private fields are excluded.
- Marketing knowledge is organisation-scoped and optionally product-scoped. Combined campaigns intentionally opt into multiple scopes.
- Product lifecycle is data: `live`, `coming_soon`, `beta`, `waitlist`, `paused`, or `retired`. Non-live products cannot produce live purchase claims.
- Billing sync changes paid access only. Core preserves complimentary grants and administrators.
- Consent remains denied until choice. GTM has not been published by this work.

## Prepared deployment order — do not execute from this task

1. Review and approve all three continuation-branch PR heads and CI evidence.
2. Back up the existing databases and record current deployment revisions.
3. Apply reviewed additive database migrations: Core, Marketing (46 ordered SQL files), then Billing (1 initial schema for its dedicated database).
4. Deploy Core, then Marketing, then Billing without changing DNS.
5. Run health checks, Core auth, Academy entitlement/Tutor, Marketing SSO/Company Brain/product isolation, and Billing SSO/webhook replay acceptance.
6. Only after explicit approval, handle any separate DNS/GTM work.

Rollback assumes the previous application artifacts and database backups remain available. Prefer application rollback while retaining compatible additive schema; never run destructive down migrations casually.

## Known external/environment boundaries

- `billing.equiprofile.online` DNS must be verified separately. If unresolved, status is **BLOCKED — EXTERNAL DNS**; do not claim Billing is live.
- Local Marketing migration/E2E execution requires disposable PostgreSQL and Redis endpoints. They were absent on the source-completion host; CI is the authoritative infrastructure-backed gate.
- Paid GenX live acceptance requires a real tenant session, model/request fixture, a bounded credit ceiling, and the exact explicit cost-consent environment flag. It was not spent or bypassed here.
- Social publication acceptance requires tenant-owned third-party credentials.
- No VPS deployment, production migration, DNS update, production restart, or GTM publication was performed.
