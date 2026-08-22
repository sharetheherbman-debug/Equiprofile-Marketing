# EquiProfile Core Migration Baseline Policy

## Scope and safety boundary

The final Core database must support **Management**, **Academy** and **Shop** without destroying existing Management data. This policy defines the only permitted migration and legacy-inspection behavior for the release candidate.

> **Production was not inspected or modified while this policy was prepared.** Any later production inspection must be owner-controlled, read-only, and use the baseline inspector described below.

| Database state                                  | Classification rule                                                                 | Permitted action                                                             | Prohibited action                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| Fresh zero database                             | No application schema or migration-tracking table exists                            | Run the canonical fresh-install path and verify the final schema fingerprint | Import or infer orphaned migration history         |
| Tracked supported database                      | Tracking matches a named supported checkpoint exactly                               | Apply only explicitly declared forward reconciliation migrations             | Reset, rebuild, or rewrite tracking history        |
| Existing untracked legacy database              | Application schema exists but migration tracking is absent, incomplete or ambiguous | Run the read-only inspector only                                             | Automatic baseline adoption or migration execution |
| Partial, drifted, unknown or ambiguous database | Inspector detects any mismatch outside a named supported baseline                   | Fail closed and require human review                                         | Any automatic adoption or mutation                 |
| Current final Core database                     | Inspector matches the final manifest exactly                                        | Report `CURRENT_NO_ACTION_REQUIRED`                                          | Reapply reconciliation migrations                  |

## Canonical migration history

The historical files `0014` through `0024` are preserved for forensic review but are **untrusted orphaned artifacts**. They are not evidence that an existing database has the effects described by those files. They must not be:

- executed automatically merely because they are present;
- inserted retroactively into migration tracking;
- renamed, reordered or treated as a reliable supported baseline;
- used by an automatic production-baselining path.

`docs/MIGRATION_HISTORY_AUDIT.md` records their source-level effects and compatibility risks. The canonical forward strategy must use a new, clearly identified reconciliation marker and explicit supported baselines rather than attempting to repair old history.

## Actual Drizzle replay and tracking behavior

The installed package declarations are `drizzle-orm` `^0.45.2` and `drizzle-kit` `^0.31.4`. The application migration wrapper is `scripts/migrate.sh`, which performs a read-only preflight and then invokes `npx drizzle-kit migrate`; it does not forge migration hashes or tracking entries.

The installed MySQL dialect creates the tracking table as `__drizzle_migrations (id serial primary key, hash text not null, created_at bigint)`. A disposable rehearsal confirmed the resulting MariaDB table has an unsigned bigint primary key, a non-null `hash` text field and nullable bigint `created_at` field.

> The installed migration reader calculates SHA-256 over the **entire SQL file text** and splits statements only on the literal marker `--> statement-breakpoint`. The MySQL dialect reads only the newest row ordered by `created_at` and applies a migration when `lastDbMigration.created_at < migration.folderMillis`; after execution it stores that migration's SHA-256 and `folderMillis` in `__drizzle_migrations`.

The current MySQL dialect source **stores** the SQL hash but does not compare the stored hash with current file contents when deciding whether a historic migration should run. Application is timestamp-driven against the latest `created_at` value. This behavior is not permission to edit canonical historical files: their integrity remains an explicit forensic and operational constraint, and the current instruction prohibits edits to `0002`, `0005`, `0008`, `0012` and `0013` pending later owner approval.

The exact reader behavior also explains the replay failure mechanism: a migration file without `--> statement-breakpoint` is passed as one SQL string to the driver, even if it contains multiple SQL statements. The replay fixture may add only these marker comments to copied disposable-only files; it must prove SQL semantic equivalence before testing.

### Completed disposable replay experiment

On 22 August 2026, a local-only harness invoked the installed Drizzle MySQL migrator API against two fresh, uniquely named disposable MariaDB databases. The canonical `drizzle/` path failed at `0005_fix_site_settings` after five tracking rows: the three standalone statements in that un-delimited canonical file were delivered as one query. The generated ignored `.tmp/migrations-replay-fixed/` path then applied all 14 journal entries successfully.

The generator copies the full canonical directory and changes only generated copies of `0005`, `0008` and `0012`, inserting non-terminal `--> statement-breakpoint` comments between statements. `0002` and `0013` already contain routine-safe inline markers and were copied byte-for-byte. Before execution, the generator emits SHA-256 evidence and proves that stripping parser markers and normalising insignificant whitespace yields equivalent SQL for all five protected files. The fixture path is passed directly to the library API by the harness; `scripts/migrate.sh`, `drizzle.config.ts`, the canonical `drizzle/` directory, and all journal metadata remain untouched.

> This result is a **replay diagnostic**, not approval to modify history or a deployable fresh-install design. A permanent strategy must still be selected and separately owner-approved before any new canonical migration is written.

## Read-only baseline inspection

The planned `scripts/audit-migration-baseline.ts` command must connect with read-only credentials and report:

1. whether `__drizzle_migrations` exists and its latest tracked marker;
2. a deterministic schema fingerprint, including tables, columns, types, nullability, defaults, indexes, unique constraints and foreign keys;
3. expected and actual differences, including missing/extra tables and columns, incompatible types and missing constraints;
4. one of `CURRENT_NO_ACTION_REQUIRED`, `SUPPORTED_EXACT_BASELINE`, `SUPPORTED_BASELINE_WITH_KNOWN_ADDITIONS`, `PARTIAL_OR_DRIFTED`, `UNKNOWN` or `AMBIGUOUS`;
5. whether upgrade is safe and whether human review is required.

The inspector must perform **no writes**. It must not offer automatic migration or adoption.

## Explicit legacy adoption

A future adoption command, if implemented, must require all of the following:

- an exact recognised baseline fingerprint from a preceding read-only report;
- an explicit operator flag naming that baseline;
- a dry-run that prints every intended tracking change;
- a separate owner-authorised execution step;
- refusal on any missing, extra, unexpected or incompatible schema detail.

It must insert only a clearly documented canonical adoption marker. It must never forge tracking entries for orphaned migrations `0014`–`0024`.

## Required disposable acceptance matrix

| Test                                      | Required outcome                                                                       |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| Fresh zero database                       | Canonical path reaches the final manifest exactly                                      |
| Tracked Management baseline               | Forward reconciliation preserves representative Management data                        |
| Untracked exact supported legacy baseline | Inspector recognises the exact baseline; explicit disposable adoption can then proceed |
| Partial historical schema                 | Inspector fails closed with no mutation                                                |
| Unknown or drifted schema                 | Inspector fails closed with no mutation                                                |
| Current final Core schema                 | Inspector reports `CURRENT_NO_ACTION_REQUIRED`                                         |

## Operational procedure

The future production procedure is deliberately two-stage: first run the inspector read-only under owner control; only then, after comparing a recognised result to the documented supported baseline, consider a separately authorised migration or adoption plan. Rollback is logical and operational: take a verified backup first, stop on any unexpected inspector result, and never reset or recreate an existing database as part of an upgrade.
