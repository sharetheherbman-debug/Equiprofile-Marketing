# Current Red Flags

1. **Live source-of-truth conflict** — repository documentation points to a different live Git origin. Do not deploy destructive changes until the VPS remote, branch and commit are confirmed.
2. **No verified CI run on current EquiProfile main** — a workflow exists, but no current commit run was available during the audit.
3. **Production Docker defaults are unsafe** — database credentials are hardcoded, MySQL is published on port 3306, and Compose overrides a secure database URL with default credentials.
4. **Authentication hardening is incomplete** — sessions use a 30-day JWT cookie without a complete device/session management experience; MFA, recovery codes, session revocation and security-event notifications are not yet proven.
5. **Admin access is high risk** — a primary admin can be promoted by matching an environment-configured email, and privileged operations rely on a shared admin-unlock mechanism. Strong MFA and per-user privileged sessions are required.
6. **Old marketing is deeply coupled** — frontend components, admin sections, server procedures, AI routers, queues, media jobs and many MySQL tables must be extracted in stages.
7. **Do not drop old marketing tables immediately** — export and archive records first, then remove tables only after the standalone platform is live and rollback has been tested.
8. **Standalone Marketing CI is currently red** — its current PR fails API tests and Caddy validation even though TypeScript and builds pass.
9. **AI keys cannot replace platform credentials** — social publishing, Google/Meta advertising, analytics, SMTP/email and Stripe require their own OAuth/API credentials.
10. **No universal free publishing** — each social platform controls API access and permissions. Unsupported channels need compliant export/manual workflows; blocking or platform restrictions must not be bypassed.
11. **PWA caching can mask deployments** — maintenance and release deployments must explicitly retire stale service workers and caches.
12. **Forty-eight hours is a target, not a guarantee** — the code can be substantially repaired in that window, but live acceptance depends on DNS, VPS access, production-shaped data, third-party credentials and real connector tests.
