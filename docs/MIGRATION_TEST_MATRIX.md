# Final-Core migration acceptance matrix

**Status:** **PASS on disposable local MariaDB 11.4.** This is not production migration authorisation. No production database, backup, VPS, DNS, TLS, payment system or secret store was accessed.

The classification-first inspector compares the complete **162-table** Management/Academy/Shop contract, including columns, types, nullability, primary keys, indexes, unique constraints and foreign keys. It performs no writes.

| Path                                   | Final rehearsal result            | Evidence and safety boundary                                                                                                                                                                                                                                              |
| -------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Historical canonical replay diagnostic | **Expected failure retained**     | The real canonical replay stopped at `0005_fix_site_settings` after the genuine five tracked entries because undelimited statements reached the installed runner as one query. Historical SQL/journal files were not edited.                                              |
| Marker-only replay fixture             | **PASS — diagnostic only**        | The ignored `.tmp/migrations-replay-fixed` fixture added statement-boundary comments only; semantic equivalence and canonical hashes were checked before use. It is not production history.                                                                               |
| Fresh zero database                    | **PASS**                          | `--mode=fresh` produced schema fingerprint `87d5a30e0b27fe38ec786954b704032fc6127a715419423e837564ecbb9dc922`; the strict audit reported `CURRENT_NO_ACTION_REQUIRED`, 162 tables and zero table/column/index/foreign-key differences.                                    |
| Supported tracked Management baseline  | **PASS**                          | Canonical five-entry replay classified `SUPPORTED_TRACKED_MANAGEMENT_BASELINE`, upgraded to `CURRENT_NO_ACTION_REQUIRED`, and preserved representative user/settings rows. Historical files and tracking were not forged.                                                 |
| Exact untracked legacy baseline        | **PASS — explicit adoption only** | Inspector returned `EXACT_LEGACY_MANAGEMENT_BASELINE`, `safeToUpgrade: false`. A real disposable logical backup was created and identified by SHA-256 before the named `--mode=exact-legacy-adoption` command. It reached current Core and preserved representative rows. |
| Partial/drifted baseline               | **PASS — fail closed**            | An exact baseline with one unexpected column classified `PARTIAL_OR_DRIFTED`; dispatcher exited 2 and left the drift column untouched.                                                                                                                                    |
| Unknown schema                         | **PASS — fail closed**            | A one-table unknown database classified `UNKNOWN`; dispatcher exited 2 and table count remained one.                                                                                                                                                                      |
| Current final Core                     | **PASS — no-op**                  | Normal dispatcher reported `CURRENT_NO_ACTION_REQUIRED` and performed no migration action.                                                                                                                                                                                |

## Portability correction from this rehearsal

Windows MariaDB reports table identifiers case-folded with `lower_case_table_names=1`, and a Windows checkout may hash canonical migrations with CRLF bytes. The inspector now compares table/referenced-table identifiers case-insensitively while keeping columns, indexes and constraints strict. The supported-baseline manifest records explicit, reviewed CRLF/lower-case aliases for the same canonical five files and schema; no broad or unrecognised fingerprint is accepted. The named upgrader now launches its inspector through the current Node runtime, avoiding Windows `npx` executable resolution failures.

## Supported commands

```bash
# Read-only classification
npm run db:inspect

# Conservative classification-first dispatcher
npm run db:migrate

# Fresh zero database only
npm run db:provision-fresh

# Explicit legacy path: owner-controlled backup reference required
npx tsx scripts/upgrade-supported-management-baseline.ts \
  --mode=exact-legacy-adoption \
  --owner-backup-reference=<owner-controlled-backup-identifier>
```

## Source contracts

- Final manifest: `docs/final-core-schema-manifest.json`, fingerprint `87d5a30e0b27fe38ec786954b704032fc6127a715419423e837564ecbb9dc922`.
- Commerce contract: `schema/final-core-commerce.sql`, SHA-256 `674f2226bf9006ed9bede4cd3a4338cb605045c9e797a7364c72890ce63e78c2`, 46 statements.
- Strict index/FK contract: `schema/final-core-structural-contract.json`, SHA-256 `ab5e71712e3f838e7fd6c627666bed58fd247b48aafb9357e644c04025d3718d`.
- Supported Management baseline: `schema/supported-management-baseline.json`; exact primary and platform-alias fingerprints only.

Historical migrations remain immutable. Orphaned `0014`–`0024` files are not automatically executed or retroactively marked. `coreSchemaState` is final-Core bookkeeping only. Production migration still requires an owner-controlled read-only inspection, verified backup and deployment approval.
