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
