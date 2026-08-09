# SSO and Host-App Event Contract Draft

## SSO claims

The one-time authorization code may resolve to:

- `iss`: trusted host application identifier
- `aud`: EquiProfile Marketing
- `sub`: stable host user identifier
- `tenant_id`: stable host tenant identifier
- `role`: mapped entitlement role
- `plan`: marketing entitlement
- `nonce`: unique random value
- `iat` and `exp`: issued and expiry timestamps

Do not place horse health records, documents, contact lists or API keys in the browser redirect.

## Initial EquiProfile events

- `user.registered`
- `user.verified`
- `trial.started`
- `onboarding.completed`
- `horse.created`
- `stable.created`
- `subscription.started`
- `subscription.upgraded`
- `subscription.cancelled`
- `user.inactive`
- `feature.adopted`

Each event requires an immutable event ID, occurred-at timestamp, host app ID, tenant ID, pseudonymous user ID, schema version and consent classification. Delivery must be signed, idempotent and retried from an outbox.

## Data minimization

The marketing platform receives only data necessary for segmentation, attribution and approved campaign personalization. Sensitive veterinary records and private documents remain in EquiProfile unless the user explicitly selects and approves a specific item for marketing use.
