# Disposable Migration Test Matrix

**Status:** **INCOMPLETE — RELEASE-BLOCKING**

All observations below were made only against locally created disposable databases. No production database, production backup, VPS, DNS configuration or live service was accessed.

| Test                                | Intended state                                                                                      | Current result                             | Evidence and boundary                                                                                                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A — Fresh zero database             | Empty database reaches the exact final Core schema through the canonical migration chain            | **Blocked**                                | The historical journal cannot be reconstructed from orphaned artifacts. No canonical forward reconciliation migration exists yet, so a fresh path cannot be accepted truthfully.  |
| B — Tracked Management baseline     | Supported tracked Management baseline upgrades forward with representative data preserved           | **Blocked**                                | A supported baseline manifest and a new forward reconciliation migration have not yet been defined. No existing database was reset or altered.                                    |
| C — Untracked exact legacy baseline | Read-only inspector recognises a named exact baseline; later explicit adoption is separately tested | **Not implemented**                        | The inspector exists and is read-only, but no legacy baseline fingerprint has been approved. It therefore must not identify any untracked legacy schema as eligible for adoption. |
| D — Partial historical schema       | Inspector fails closed without mutation                                                             | **Pass**                                   | The disposable partial rehearsal returned `PARTIAL_OR_DRIFTED`, `safeToUpgrade: false`, `humanReviewRequired: true`.                                                              |
| E — Unknown or drifted schema       | Inspector fails closed without mutation                                                             | **Pass by policy; matrix fixture pending** | Any non-exact untracked schema is classified `UNKNOWN` or `AMBIGUOUS` and is not safe to upgrade. A dedicated drift fixture remains to be added.                                  |
| F — Current final Core schema       | Inspector reports `CURRENT_NO_ACTION_REQUIRED`                                                      | **Blocked**                                | The typed manifest exists, but the complete canonical forward schema and migration path have not yet been accepted.                                                               |

## Non-negotiable safety conditions

- Historical migrations `0014`–`0024` were **not** executed automatically.
- Historical migrations `0014`–`0024` were **not** retroactively marked as applied.
- No automatic baseline adoption exists.
- The inspector issues read-only `information_schema` queries only.
- Partial, unknown and ambiguous states fail closed.

## Required next implementation increment

The next migration increment must define one new, non-conflicting canonical forward reconciliation migration and a named supported Management baseline. It must be verified against fresh and tracked disposable database fixtures before this matrix can be marked complete.
