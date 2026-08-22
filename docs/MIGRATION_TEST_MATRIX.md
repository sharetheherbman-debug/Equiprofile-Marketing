# Final-Core Migration Acceptance Matrix

**Status:** **Internally accepted on disposable local MariaDB only.** This is **not** deployment authorization. No production database, VPS, DNS configuration, production backup, live payment system, or secret store was accessed.

The supported migration dispatcher is intentionally classification-first. The read-only inspector compares the complete final-Core contract across **162 Management, Academy, and Shop tables**, including table names, columns, nullability, primary keys, types, indexes, unique constraints, and foreign keys. It does not modify a database.

| Path | Required starting state | Result | Acceptance evidence and safety boundary |
| --- | --- | --- | --- |
| Historical replay diagnostic | Canonical Drizzle files, byte-for-byte | **Expected failure retained** | A local canonical replay stops at `0005_fix_site_settings` after the genuine five tracked rows because the installed runner receives three undelimited statements as one query. Canonical SQL and journal metadata remain unchanged. |
| Marker-only replay diagnostic | Ignored generated fixture | **Pass — diagnostic only** | The generated `.tmp/migrations-replay-fixed` fixture adds only statement-boundary comments and replayed 14 entries. Its fixture hashes must never be treated as production journal history. |
| A — Fresh zero database | No application tables | **PASS** | `provision-final-core-schema.ts --mode=fresh` regenerated the semantic-equivalence fixture, applied the verified final-Core Commerce contract, reconciled the typed Core schema, and then passed the strict inspector: 162 tables and zero table/column/index/foreign-key differences. |
| B — Supported tracked Management baseline | Exact five-entry canonical tracked fingerprint `a933cc79…ca847` and exact canonical hashes | **PASS** | The named dispatcher path ran from the known pre-`0005` baseline through `CURRENT_NO_ACTION_REQUIRED`, with Management user and settings rows preserved. It neither changed historical SQL nor forged `__drizzle_migrations` history. |
| C — Exact legacy Management baseline | Same exact baseline fingerprint with no migration tracking table | **PASS — explicit adoption only** | Inspector returns `EXACT_LEGACY_MANAGEMENT_BASELINE`, `safeToUpgrade: false`. The automatic dispatcher refuses it. The named command requires `--mode=exact-legacy-adoption` and a non-empty `--owner-backup-reference`; a local rehearsal then reached the final schema with representative data preserved. |
| D — Partial historical schema | Any tracked state other than the approved five-entry fingerprint/history | **PASS — fail closed** | Inspector reports `PARTIAL_OR_DRIFTED` and the dispatcher does not mutate it. |
| E — Unknown or drifted schema | An unrecognised application table or schema fingerprint | **PASS — fail closed** | A local `unknown_schema_probe` database reported `UNKNOWN`; dispatcher exited `2` and table count remained one, proving no automatic reconciliation occurred. |
| F — Current final Core schema | Exact final-Core structure | **PASS** | Inspector reports `CURRENT_NO_ACTION_REQUIRED` with zero table, column, index, or foreign-key differences; dispatcher is a no-op. |

## Supported commands

> **The normal command is intentionally conservative.** It only provisions a verified zero database, upgrades the exact tracked Management baseline, or returns a no-op for an already current schema.

```bash
# Read-only classification, never mutates
npm run db:inspect

# Normal classification-first dispatcher
npm run db:migrate

# Verify routing without mutation
DRY_RUN=1 npm run db:migrate

# Fresh zero database only; the dispatcher invokes this only after inspection
npm run db:provision-fresh
```

An exact untracked legacy baseline is **not** an automatic path. After an owner-controlled backup exists and its identifier has been recorded outside the repository, use the separately named command under controlled deployment supervision:

```bash
npx tsx scripts/upgrade-supported-management-baseline.ts \
  --mode=exact-legacy-adoption \
  --owner-backup-reference=<owner-controlled-backup-identifier>
```

The backup reference is a human-control gate, not a backup implementation. The repository does not create, upload, or expose production backups.

## Final-Core source contract

| Contract | Purpose | Integrity boundary |
| --- | --- | --- |
| `docs/final-core-schema-manifest.json` | Complete final-Core table, column, index, and foreign-key contract | Deterministically generated; current expected fingerprint `87d5a30e0b27fe38ec786954b704032fc6127a715419423e837564ecbb9dc922`. |
| `schema/final-core-commerce.sql` | Recovered authorized Shop foundation/lifecycle contract used only in explicit migration commands | SHA-256 `674f2226bf9006ed9bede4cd3a4338cb605045c9e797a7364c72890ce63e78c2`; never invoked on ordinary server startup. |
| `schema/final-core-structural-contract.json` | Reviewed strict index and foreign-key contract derived from a successful disposable fresh install | SHA-256 `ab5e71712e3f838e7fd6c627666bed58fd247b48aafb9357e644c04025d3718d`. |
| `schema/supported-management-baseline.json` | Exact genuine five-entry canonical Management baseline accepted for named upgrade | Fingerprint `a933cc79c0c9624505e287cefcda973e464c62419216daad51140707411ca847`; no marker-only fixture history is accepted. |

## Non-negotiable safety conditions

- Historical journalled migrations remain immutable, including `0002`, `0005`, `0008`, `0012`, and `0013`.
- Orphaned `0014`–`0024` files are neither executed automatically nor retroactively marked as applied.
- The ignored marker-only fixture remains diagnostic evidence only and cannot establish production migration history.
- `coreSchemaState` is final-Core state bookkeeping only; it does not modify or forge `__drizzle_migrations`.
- The explicit Commerce and Management forward contracts run only through named migration commands. Ordinary application startup does not invoke broad reconciliation.
- SMTP, GenX, Stripe, supplier, connector, and other deployment credentials remain deferred to the approved secret store. They are not embedded in this repository or needed for these schema rehearsals.
- This matrix does not authorize merge, deployment, production migration, live Stripe, supplier activation, paid advertising, or any production-side action.
