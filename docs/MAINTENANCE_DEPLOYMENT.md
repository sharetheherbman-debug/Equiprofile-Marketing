# Temporary EquiProfile Maintenance Deployment

The rebuild branch replaces the management frontend entry page with a dependency-free maintenance screen.

## Important

The maintenance screen is committed in Git but is not live until the VPS deploys the branch or the commit is merged into the branch used by production.

The current repository documentation indicates that the live server may use a different origin repository. Confirm the live values before deployment:

```bash
cd /var/equiprofile/app
git remote -v
git branch --show-current
git rev-parse HEAD
systemctl status equiprofile.service --no-pager
```

## Safe deployment outline

1. Back up the database, uploads and current environment file.
2. Record the current deployed commit SHA.
3. Fetch the rebuild branch.
4. Build both frontends and the server.
5. Run preflight, type checks and tests.
6. Deploy the build and restart the service.
7. Verify `https://equiprofile.online`, a protected dashboard URL, `/healthz` and `/build`.
8. Keep the recorded commit available for immediate rollback.

The maintenance page unregisters prior service workers and clears browser caches so returning PWA users receive the maintenance screen rather than an old cached dashboard.

## Restore at launch

Before reopening EquiProfile, restore the production management `index.html`, rebuild, deploy, verify account and dashboard flows, and confirm the maintenance page is no longer cached.
