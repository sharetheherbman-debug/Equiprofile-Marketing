# Provider and Connector Policy

## AI providers

1. GenX is the primary provider for text, image, video, voice and other supported AI operations.
2. Together and DeepInfra may be configured as optional fallback providers where they support the required operation.
3. Provider selection, executed provider, executed model, cost, latency and failure reason must be recorded.
4. A fallback provider may be used only when enabled by the organization and allowed for the task.
5. Deterministic templates are not AI output and must be labelled as fallback drafts.
6. API keys remain server-side, encrypted at rest, masked in the UI and never returned to the browser.

## Non-AI connectors

The following services require credentials separate from GenX, Together or DeepInfra:

- Social network OAuth and publishing permissions
- Google Ads and Meta Ads accounts and tokens
- Analytics properties and service credentials
- SMTP or transactional email provider credentials
- Stripe billing credentials
- Domain and DNS control

The product must never claim that an AI key replaces those credentials.

## Spend and publishing guardrails

- Organic drafts can be created without paid media credentials.
- Direct publishing requires a tested connection and the platform's required scopes.
- Paid advertising requires an explicit budget, account selection and authorization.
- No campaign may increase spend beyond an approved cap without a new approval.
- Failed or unverifiable publish attempts must remain failed; never mark them published locally.
- Unsupported platforms use export/manual posting rather than bypasses, scraping or block avoidance.
