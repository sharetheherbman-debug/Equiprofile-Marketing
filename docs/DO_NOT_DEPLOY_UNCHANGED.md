# Do Not Deploy Unchanged

The repository's current Docker Compose file is development-oriented and must not be used unchanged for a public production deployment. It contains default database credentials, publishes MySQL to the host and overrides `DATABASE_URL` with a default password.

The maintenance page can be deployed using the existing live service process only after the live origin, branch, environment, database and storage paths are confirmed and backed up.
