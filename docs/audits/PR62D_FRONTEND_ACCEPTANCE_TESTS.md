# PR62D Frontend Acceptance Tests

Manual test scripts for The Marketing App Studio creation-first flow.

---

## 1. Image Ad

**Click path:**
1. Open The Marketing App (Admin → Marketing)
2. In the left creation menu, click **Image Ad**
3. In the center composer, fill in "Description" (e.g. "Premium image ad for stable owners")
4. Set Audience: "Stable owners", Platform: "Instagram"
5. Click **Generate Image Ad**

**Expected UI output:**
- Generate button shows loading state while running
- Right preview panel shows image result (if provider ready):
  - Image preview fills the panel
  - Title and status badge visible
- If provider not ready:
  - Status badge shows `setup_needed`
  - Clear next action: e.g. "Add a GenX or Hugging Face API key"

**setup_needed behavior:**
- No fake/placeholder image shown
- "setup_needed" badge visible in preview
- Blocker message explains what is missing

**Must NOT appear:**
- A completed/generated image if provider is not configured
- Raw JSON dump
- Empty agent cards

---

## 2. 30-Second Video Ad

**Click path:**
1. Select **30-Second Video Ad** from creation menu
2. Fill in description: "30-second Facebook and Instagram ad for EquiProfile to get stable owners to start a free trial"
3. Set Platforms: "Facebook, Instagram"
4. Click **Generate 30-Second Video Ad**

**Expected UI output:**
- Preview panel shows package summary:
  - Strategy
  - Hooks
  - Ad copy
  - CTA
  - 30-second script
  - 3–5 scene timeline (scene number, duration, narration, visual prompt)
  - Media requirements
  - Review/export state
- Status badge: `draft` or `ready_for_review`
- Post-generation tabs appear: Preview, Plan, Creative, Media, Review, Schedule / Export, Details

**setup_needed behavior:**
- Setup Needed section shows which blocker is missing
- No fake video shown
- `render_status: not_required` (video ad package does not require render)

**Must NOT appear:**
- Raw JSON in main view
- Empty agent timeline cards before generation runs

---

## 3. 3-Minute Assembled Video

**Click path:**
1. Select **3-Minute Assembled Video** from creation menu
2. Fill in description: "3-minute marketing video for EquiProfile explaining why stable owners should use it"
3. Click **Generate 3-Minute Assembled Video**

**Expected UI output:**
- Preview panel shows:
  - Package type: `assembled_video_3m`
  - 180-second scene timeline (8–15 scenes with durations)
  - Full narration script
  - Media slots per scene
  - Render status: **`not_rendered`**
  - Message: "No fake video is shown because render output is missing"
- Post-generation tabs appear

**setup_needed behavior:**
- Render status `not_rendered` is clearly labelled
- No fake video or placeholder player shown
- Blockers listed if render tools (Remotion/FFmpeg) unavailable

**Must NOT appear:**
- A fake video player
- `completed` render status without actual render
- Raw package JSON in the main panel

---

## 4. Signup Campaign

**Click path:**
1. Select **Signup Campaign** from creation menu
2. Fill in description: "Get me 50 signups this month from stable owners"
3. Click **Generate Signup Campaign**

**Expected UI output:**
- Preview panel shows:
  - Campaign strategy
  - Conversion goal
  - Hooks
  - Social / ad / email output plan
  - Video package recommendation
  - Review queue item count
  - Schedule/export draft count
  - Measurement plan

**setup_needed behavior:**
- Setup Needed section shows missing capabilities
- No fake scheduled posts or published state

**Must NOT appear:**
- "Published" status without a real connector
- Fake analytics numbers
- Raw JSON in main view

---

## 5. Setup Wizard

**Click path:**
1. Click **Settings** button in the Studio header
2. Review the Setup Checklist at the top of the settings panel

**Expected UI output:**
- 10-item checklist visible:
  - Text generation
  - Image generation
  - Campaign / ad packages
  - 3-minute video package planning
  - Media rendering / Remotion / FFmpeg
  - Stock media
  - Voiceover
  - Music / audio
  - Export / schedule
  - Publishing connectors
- Each item shows: status badge (`ready` / `setup_needed`), enables description, next action if not ready
- Provider key inputs appear below with test buttons for GenX, Qwen, Hugging Face
- Advanced Diagnostics section is **collapsed** by default

**Must NOT appear:**
- Raw secrets in the UI
- Uncollapsed diagnostics dump on first load

---

## 6. Asset Library Truth

**Click path:**
1. Open The Marketing App
2. Navigate to the Creative tab (after a generation run)
3. Review existing asset cards in the asset library

**Expected UI output (playable asset):**
- Image preview shown
- Title and status `completed`
- Open / Download / Copy URL actions available

**Expected UI output (non-playable / setup_needed asset):**
- Status badge: `setup_needed` or `failed`
- Short reason visible
- Full prompt collapsed inside a Details toggle

**Must NOT appear:**
- `setup_needed` asset shown as `completed`
- Full prompt wall dominating the card
- Fake media preview for a non-playable asset

---

## 7. No Diagnostics-First Screen

**Click path:**
1. Open The Marketing App fresh (no previous generation)

**Expected UI output:**
- Left creation menu visible
- Center composer ready for input
- Right preview panel shows readiness badge only (no output)
- Simple header with app name and Settings button

**Must NOT appear:**
- Readiness grid / capability strip as the first visible element
- Connector debug cards
- Provider diagnostics table
- Raw command-centre JSON state
- Empty agent timeline cards (7 cards showing `waiting_for_backend`)
- Backend endpoint names

**Where diagnostics live:**
- Settings dialog → Setup Checklist shows user-friendly setup status
- Post-generation Details tab → Advanced Diagnostics (collapsed `<details>` element)
