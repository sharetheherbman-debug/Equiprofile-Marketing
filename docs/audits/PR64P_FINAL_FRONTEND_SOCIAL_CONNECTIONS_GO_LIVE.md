# PR64P Final Frontend, Social Connections, and Go-Live Audit

## Scope

PR64P finishes the user-facing Marketing App workspace after the PR64O media/audio/publish-truth work. The goal is not a new engine layer; it is the final app-side wiring and cleanup needed to make the existing Marketing App usable inside the EquiProfile dashboard.

## Forensic Findings

### What existed

- The PR64P branch already had a top-menu shell with `Create`, `Campaigns`, `Media Library`, `Calendar`, `Results`, `Brand Kit`, `Connections`, and `Settings`.
- Create already routed natural-language prompts into campaign, image-ad, and Studio/video workflows.
- Media Library, Calendar, Results, Brand Kit, Connections, and Settings existed as workspace sections instead of one endless dashboard.
- PR64O render/media truth contracts were present, including fallback reel rendering, provider route truth, audio warnings, and publish-readiness restrictions.

### What was still broken or risky

- Normal UI could still show internal-ish statuses such as `setup_needed` through latest outcome and preview badges.
- The package viewer exposed a raw JSON diagnostics panel by default.
- Connection cards always submitted `connected`, even when credentials, token refs, account IDs, or scopes were missing.
- Email appeared in the Connections UI but was not accepted by the connector persistence enum.
- The smoke script had mojibake status glyphs that were unreliable on Windows/PowerShell environments.
- Source tests still expected older PR64F wording and panels instead of the final PR64P top-menu workspace.

## Implemented Fixes

### Frontend section flow

- The top-menu workspace remains the primary navigation: `Create`, `Campaigns`, `Media Library`, `Calendar`, `Results`, `Brand Kit`, `Connections`, `Settings`.
- Create remains compact with one prompt, quick actions, next actions, preview, plan, and video builder only when needed.
- The Studio section label is user-facing as `Video Builder`; old backend/developer wording is not shown in the normal Create flow.

### Diagnostics cleanup

- Package diagnostics are hidden unless `VITE_MARKETING_SUPPORT_MODE=true`.
- Preview provider/source details and render warnings remain support-mode only.
- Normal preview status labels are mapped to friendly text such as `Needs setup`, `Provider unavailable`, `Queued`, `Ready`, and `Needs review`.

### Social and email connection truth

- Connections now compute a truthful requested status:
  - missing credential fields or missing token/account information -> `missing_token`
  - missing required scopes -> `permission_missing`
  - complete setup -> `connected`
- Email is now accepted by the backend connector persistence enum so the Email/SMTP card no longer calls an unsupported connector route.
- Direct posting remains locked behind real connector readiness and real platform IDs. This PR does not fake posted/sent states.

### Tests and smoke contracts

- Updated source tests for the final PR64P wording and sections.
- Added coverage that a real platform ID results in `Published` rather than a pre-posting label.
- Smoke script output is ASCII-safe and continues to validate source contracts without claiming browser proof.

## Go-Live Status

### Ready app-side

- Top-menu workspace replaces the cluttered long-scroll dashboard.
- Product setup is separated into Brand Kit/Product Profile rather than permanent Create clutter.
- Create is natural-language first and keeps image/video/campaign workflows distinct.
- Preview shows image, video, audio, campaign, render status, and failure states.
- Media Library, Campaigns, Calendar, Results, Brand Kit, Connections, and Settings each have their own section.
- Diagnostics and raw backend details are hidden from normal users.
- Social/email setup screens are truthful about missing credentials and scopes.

### External blockers remaining

- Real direct posting still requires external OAuth credentials/scopes and credential-backed platform adapters for Facebook, Instagram, TikTok, YouTube, LinkedIn, and SMTP.
- Provider-backed image/video/audio generation still depends on valid GenX/Qwen/Hugging Face credentials and supported model routes.
- Pexels/Pixabay stock sourcing requires valid keys.
- Live browser proof after deployment is still required; shell smoke checks validate contracts only.

## Validation Plan

Required validation:

- `npm run check`
- `npm test`
- `npm run preflight`
- `npm run build`
- `bash scripts/marketing_go_live_smoke.sh` where Bash is available

Windows note: run the smoke script in Git Bash/WSL on Windows because PowerShell does not execute Bash scripts directly.

## Recommended Next PR

PR64Q should focus only on live external-credential setup and browser/VPS proof:

- OAuth connection wizards and secure token storage verification.
- SMTP test-send with real message IDs.
- Provider route live proof for GenX/Qwen/Hugging Face on the VPS.
- Browser E2E smoke for Create -> Preview -> Library -> Calendar -> Results.
