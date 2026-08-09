# Tonight Release Gates

A same-day release may proceed only if these gates are satisfied.

## EquiProfile maintenance deployment

- Confirm the live Git origin, branch and commit.
- Create and verify database and upload backups.
- Build the exact deployed commit.
- Verify the maintenance page on mobile and desktop.
- Verify old PWA caches are removed.
- Verify health checks remain available.
- Record and test the rollback command.

## EquiProfile reopen

- CI green on the release commit.
- Clean and upgrade migrations pass.
- Login, registration, verification, reset, logout and subscription flows pass.
- Standard and stable dashboards pass mobile smoke tests.
- Tenant and role authorization checks pass.
- Marketing link/SSO is hidden unless the standalone service is ready.
- Backup restore and rollback are proven.

## EquiProfile Marketing launch

- API tests and Caddy validation green.
- Docker and Compose checks green.
- GenX representative live tests pass.
- Together and DeepInfra fallback tests pass when configured.
- Login, SSO, organization isolation, roles and metering pass.
- Real sandbox connector tests pass for every enabled external integration.
- Paid advertising has budget caps and approval gates.
- DNS and TLS for `marketing.equiprofile.online` pass.
- Public and authenticated smoke tests pass after deployment.

A release must not be described as complete when a required gate is skipped because credentials, VPS access or third-party approvals are unavailable.
