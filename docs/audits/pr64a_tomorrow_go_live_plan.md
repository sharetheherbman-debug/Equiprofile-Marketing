# PR64A Tomorrow Go-Live Plan

## Objective
Ship a truthful, usable Marketing App creation flow by tomorrow without pretending unsupported media capabilities are complete.

## Ground Rules
- Keep export-first default.
- No fake media/publishing/analytics states.
- Only expose first-class actions in the primary creation lane.
- Anything not executable must be visibly `setup_needed` or `planned_only`.

## Plan Option A (PR-by-PR, safest)

### PR64B (First, mandatory)
Goal: Deliverable-first Studio clarity and output guarantee contract.

Changes:
- Extend `getMarketingCreationCapabilities` with explicit `outputGuarantee` and `viewerContract` fields.
- Frontend primary actions: keep only actionable first-class types.
- Hard-separate package outputs from playable media outputs in preview panel.
- Collapse diagnostics by default; keep blockers visible.

Validation:
- `npm run check`
- `npm test`
- `npm run preflight`
- `npm run build`
- Manual smoke:
  - image_ad with missing provider -> setup_needed reason visible
  - image_ad with provider -> completed playable preview
  - video_ad_30s -> plan/package label only, no fake render

### PR64C (Second, mandatory for media credibility)
Goal: Make avatar/voice/music flow executable-or-truthful end-to-end.

Changes:
- Tighten job execution/resolver wiring.
- Require playable output proof before completed status.
- Improve frontend previews for resolved media jobs.

Validation:
- Same 4 commands.
- Manual smoke with queued and resolved job paths.

### PR64D (Third, mandatory for operational go-live)
Goal: Lock in deploy verification and analytics loop minimum.

Changes:
- Add smoke endpoints/scripts for creation/render/schedule/results.
- Enforce attribution link insertion path for campaign CTAs.
- Surface results updates in next-action guidance.

Validation:
- Same 4 commands.
- VPS smoke sequence (below).

## Plan Option B (Hour-by-Hour Tomorrow)

1. 08:00-10:00: Ship PR64B and deploy.
2. 10:00-12:00: VPS smoke on image/package flows and UI truth states.
3. 12:00-15:00: Ship PR64C and deploy.
4. 15:00-17:00: Validate avatar/voice/music execution truth.
5. 17:00-19:00: Ship PR64D and deploy.
6. 19:00-20:00: Final go-live checklist and rollback readiness.

## VPS Validation Commands (after each repair PR)

```bash
cd /var/equiprofile/app
git rev-parse --short HEAD
npm run check
npm test
npm run preflight
npm run build
sudo systemctl restart equiprofile.service
sudo systemctl status equiprofile.service --no-pager
journalctl -u equiprofile.service -n 200 --no-pager
```

## Manual Product Smoke Set (must pass before go-live)

1. Image ad prompt returns either playable image preview or exact setup_needed reason.
2. 30-second ad returns package deliverables with truthful non-rendered status.
3. 3-minute assembled video returns package + render dependency status, no fake completion.
4. Signup campaign persists campaign items + review + schedule/export records.
5. Schedule list works when empty and populated.
6. Publishing remains blocked unless connector returns real platform ID.
7. Attribution link click increments and redirect works.

## What To Hide/Lock Until Working
- Keep social_post/email/blog/weekly_content_pack out of primary creation actions until first-class endpoints + viewers exist.
- Keep avatar_video visible only as `planned_only/setup_needed` until resolved playable outputs are proven.
- Keep advanced diagnostics in Settings/Details, not primary composition panel.

## What Cannot Be Honestly Claimed By Tomorrow Unless Already Proven
- Full autonomous closed-loop self-improving campaign execution at scale.
- Guaranteed playable avatar/voice/music outputs across providers without real provider validation.
- Fully automated rendered long-form video reliability without environment + asset quality proof.
