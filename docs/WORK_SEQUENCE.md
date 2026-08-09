# Proposed Work Sequence

## Workstream A — EquiProfile recovery and improvement

1. Confirm the live VPS source, branch, commit, service, database and storage paths.
2. Deploy the temporary maintenance page with a tested rollback.
3. Establish a green CI baseline on the real source branch.
4. Back up and test restore of MySQL and uploads.
5. Audit authentication, account lifecycle, subscriptions, user deletion, permissions and admin access.
6. Standardize on the V2 dashboard and remove the V1/V2 deployment ambiguity.
7. Redesign the dashboard around daily priorities, horse health alerts, due tasks, appointments and recent activity.
8. Repair mobile navigation, loading, empty, error and offline states.
9. Add an EquiProfile Marketing launch card with entitlement-aware SSO.
10. Remove embedded marketing in staged, reversible migrations.
11. Run production-shaped upgrade tests and deploy EquiProfile.

## Workstream B — standalone EquiProfile Marketing

1. Fix the current failing API tests, Caddy configuration and remaining CI blockers.
2. Rebrand the platform as EquiProfile Marketing while retaining multi-tenant host-app support.
3. Make GenX the primary AI runtime and Together/DeepInfra the only optional AI fallbacks.
4. Implement secure local login plus one-time SSO handoff from connected applications.
5. Add organizations, roles, entitlements, quotas, usage metering and audit logs.
6. Complete Campaign Autopilot as a durable state machine.
7. Complete Growth Memory and conversion/revenue attribution.
8. Add compliant organic, SEO, email, social and paid-ad connectors.
9. Require QA and human approval controls for external publishing and spend changes.
10. Deploy to `marketing.equiprofile.online`, run real acceptance tests and only then expose the link from EquiProfile.

## Release order

1. Maintenance page live.
2. EquiProfile account and dashboard repairs proven in staging.
3. Standalone Marketing green in CI and staging.
4. SSO and event bridge proven.
5. EquiProfile production reopened.
6. EquiProfile Marketing enabled for approved users.
7. Academy work begins after both products are stable.
