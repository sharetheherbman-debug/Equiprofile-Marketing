# Client Workflow Assurance

**Status:** Release candidate assurance note
**Product:** EquiProfile Core Management and Academy host applications
**Marketing relationship:** Signed connector only; no embedded Marketing engine.

## Management

Management retains the canonical horse, health, calendar, task, training, feeding, document, reporting, contact, message, and stable workflows. The Management browser-acceptance suite builds the Management target and verifies entitlement-sensitive navigation, Stable-route access, responsive Settings at a 390px viewport, and Billing rendering on a tablet-sized viewport.

The in-app AI assistant now receives a compact, signed-in-user-only workspace snapshot for questions about horses, upcoming care, due tasks, and recent training. The context includes only the user-owned records returned by the existing Core database helpers and is bounded before the configured AI route is called.

| Context category | Source | Assistant boundary |
|---|---|---|
| Active horses | `getHorsesByUserId` | Names and concise profile attributes only |
| Care due in 14 days | `getUpcomingReminders` | Type and due date; no diagnosis or invented record |
| Tasks due in 14 days | `getUpcomingTasks` | Title, due date, priority, and state |
| Recent training | `getTrainingSessionsByUserId` | Date, type, and bounded notes |

The assistant must state when relevant workspace data is absent. It may propose the existing Task or Calendar save actions, but it must not claim an action was completed, invent a record, or diagnose a health condition.

> AI responses remain informational assistance. Users must obtain professional veterinary guidance for health or welfare concerns.

## Academy

Academy remains a dedicated learner, teacher, and Academy-owner product surface. The canonical student procedures load reviewed published lessons, enforce level unlocking, server-score lesson knowledge checks, persist completion state, and expose durable progress. Lesson-aware AI Tutor prompts carry the current lesson’s reviewed objectives and competencies, retain a daily usage bound, and record tutor interactions for teacher visibility.

The Academy release candidate passed the Academy production build plus the factual-evidence generation and audit commands. Legacy study topics withheld pending individual safety and factual review remain unavailable by design; reviewed Academy lessons and authorized teacher-assigned work remain the supported learner paths.

| User | Canonical workflow |
|---|---|
| Student | Reviewed lesson → knowledge check → server-scored completion → persistent progress → lesson-aware tutor |
| Teacher | Learner membership and assignments → activity/progress visibility → tutor engagement visibility |
| Academy owner | Organization, member/invite, curriculum, activity, and billing-test configuration surfaces |

## Marketing Host Boundary

EquiProfile Core does not contain a second Marketing implementation. The retained `marketingConnector` is the only host integration: authorized Core owners and administrators can obtain a short-lived signed launch to standalone Marketing. Core does not surface Studio controls, Marketing asset-generation details, campaign/CRM/analytics modules, publishing controls, or provider credentials.

The focused owner-boundary regression suite passed for this candidate. It verifies the signed standalone Marketing connector and host role boundary without reintroducing embedded Marketing product logic.

## Candidate Verification Posture

The final Core regression suite and Core TypeScript check passed. The Management browser-acceptance suite passed eight client scenarios. Academy build and factual-audit commands passed. These are release-candidate checks rather than a production deployment assertion; public production endpoints are not changed by this candidate note.

This document supplements [`MARKETING_BOUNDARY.md`](./MARKETING_BOUNDARY.md) and is intentionally explicit about the distinction between a verified release candidate and an already deployed production release.
