# PR62C Acceptance Smoke Tests

## 1) 30-second ad package

### Prompt

Create a 30-second Facebook and Instagram ad for EquiProfile to get stable owners to start a free trial.

### Expected frontend sections

- Package summary
- Strategy
- Hooks
- Copy
- Script
- Scene Plan
- Media Requirements
- Review
- Export / Schedule
- Setup Needed

### Expected persisted records

- Campaign record created/updated
- Campaign items persisted: `campaign_plan`, `ad_copy`, `script_30s`, `scene_plan`, `visual_prompt`, `export_pack`
- Review records for created campaign items
- Export-first schedule draft records

### setup_needed behavior

- If image/render connectors are missing, package still returns text/script/scene sections.
- Media blockers are surfaced in **Setup Needed**.
- No fake completed media is shown.

## 2) 3-minute assembled video package

### Prompt

Create a 3-minute marketing video for EquiProfile explaining why stable owners should use it.

### Expected frontend sections

- All package viewer sections above
- Assembled video timeline
- Scene durations
- Voiceover plan
- Media slots
- Render/export status

### Expected persisted records

- Campaign items persisted: `campaign_plan`, `script_longform`, `scene_plan`, `video_plan`, `visual_prompt`, `export_pack`
- Review records for all generated campaign items
- Export-first schedule drafts

### setup_needed behavior

- If render/provider setup is missing, response is `setup_needed`/partial with exact blockers.
- No fake rendered 3-minute output is returned.

## 3) Signup campaign package

### Prompt

Get me 50 signups this month from stable owners.

### Expected frontend sections

- Package summary + strategy
- Hooks/copy/script recommendations
- Scene plan/video recommendation
- Export / Schedule
- Setup Needed

### Expected persisted records

- Campaign items persisted: `campaign_plan`, `social_post`, `ad_copy`, `email`, `blog`, `scene_plan`, `script_30s`, `export_pack`
- Review records for generated items
- Schedule drafts for export-first operations

### setup_needed behavior

- Missing media connectors do not block text deliverables.
- Package includes blockers and next action requirements without fake publishing/video completion.
