export type ClaimReviewOutcome = "ACCEPTED" | "REWRITTEN_AS_PRINCIPLE";

export type ClaimReviewDecision = {
  reviewedAt: "2026-08-21";
  reviewedBy: "academy-source-comparison";
  sourceUrl: string;
  claimReviewed: string;
  outcome: ClaimReviewOutcome;
};

const WHW_HEALTH =
  "https://www.worldhorsewelfare.org/advice/horse-health-essentials";
const WHW_EMERGENCY =
  "https://www.worldhorsewelfare.org/advice/welfare-wednesdays/preparing-for-an-emergency-equine-first-aid";
const WHW_FEEDING = "https://www.worldhorsewelfare.org/advice/feeding-horses";
const BHS_FEEDING =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/feeding-horses/";
const BHS_PASTURE =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/pasture-management/";
const FEI_DRESSAGE =
  "https://inside.fei.org/sites/default/files/FEI_Dressage_Rules_2026_Clean_Version_6.pdf";
const GOV_KEEPING_HORSES = "https://www.gov.uk/keeping-horses";

/**
 * A decision exists only after a reviewer has identified the precise remaining
 * claim or confirmed that the lesson was rewritten as an individual,
 * qualified-professional principle. It intentionally omits unreviewed lessons.
 */
export const REVIEWED_LESSON_CLAIMS: Record<string, ClaimReviewDecision> = {
  "signs-of-good-health": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Healthy adult horse calmly at rest: temperature 37.5–38.5°C, pulse 36–42 bpm and respiration 8–12 breaths/minute. Other quiz values are intentionally incorrect distractors, not teaching ranges.",
    outcome: "ACCEPTED",
  },
  "daily-health-check-and-vital-signs": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Healthy adult horse calmly at rest: temperature 37.5–38.5°C, pulse 36–42 bpm and respiration 8–12 breaths/minute. The lesson requires individual baseline recording and professional escalation rather than numeric self-triage.",
    outcome: "ACCEPTED",
  },
  "when-to-call-the-vet": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "The same adult-at-rest TPR reference is used only with individual baseline and symptom context. Residual numeric quiz options are deliberately incorrect distractors, not clinical thresholds.",
    outcome: "ACCEPTED",
  },
  "hoof-care-awareness": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Qualified, registered farrier trimming and/or shoeing occurs on average every 6–8 weeks, while some horses need more regular individual care.",
    outcome: "ACCEPTED",
  },
  "feeding-basics": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_FEEDING,
    claimReviewed:
      "World Horse Welfare describes forage-based eating for approximately 16–18 hours; BHS states feed changes are ideally gradual over 10–14 days. The lesson retains both only with its individual-plan context.",
    outcome: "ACCEPTED",
  },
  "arena-etiquette": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "The former universal 20 m × 40 m claim was rewritten as a small-arena example; Article 411 identifies the FEI international Dressage arena as 60 m × 20 m and current organiser diagrams govern the event layout.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "basic-school-figures": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Arena dimensions and school-figure geometry were rewritten as facility- and coach-specific examples; they are not presented as universal competition or fitting rules.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "circles-and-school-figures": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Article 411 supports the FEI international 60 m × 20 m reference. Small-arena figures are explicitly contextual examples and current organiser diagrams govern competition layouts.",
    outcome: "ACCEPTED",
  },
  "dressage-test-riding": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "The lesson no longer states a universal introductory arena, score, pace or preparation rule; it requires the current published test, organiser schedule and approved diagram.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "equine-first-aid-basics": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_EMERGENCY,
    claimReviewed:
      "Fixed cooling, wound-treatment and waiting regimens were removed. Learners now use scene safety, factual observation, prompt veterinary contact and current professional direction.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "understanding-equine-digestion": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    claimReviewed:
      "The universal dietary-transition period and categorical colic ranking were removed; the lesson now requires an individual feeding plan, factual records and prompt veterinary escalation for concerns.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "feeding-routines-and-rules": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_FEEDING,
    claimReviewed:
      "Generic pre/post-exercise and transition intervals were removed. Feeding and work planning now follow the documented individual plan and current professional advice.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "responsible-horse-ownership": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    claimReviewed:
      "Universal lifespan and routine-service calendar claims were removed. The lesson now teaches long-term welfare, financial and contingency responsibility with horse-specific professional care.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "end-of-life-decisions": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Fixed quality-of-life review cadence and trend windows were removed. The lesson requires a documented veterinary-led review process and current individual welfare plan.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "cross-country-fundamentals": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic warm-up durations, transition counts and stride-distance decision rules were removed. Course preparation now requires qualified coaching, current course conditions and event procedure.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "competition-etiquette-and-sportsmanship": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic warm-up observation and SMART-practice measurements were removed. Preparation and reflection now follow the current organiser procedure and coach-agreed context.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "mental-skills-for-performance": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic arena-size, visualisation-duration and breathing-count prescriptions were removed. Goals and mental preparation are individual, coach-aware and welfare-sensitive.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "competition-day-management": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic arrival buffers, schedule cut-offs, breathing counts and post-event calendars were removed. Preparation follows current organiser, coach and horse-specific plans.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "pasture-management-basics": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_PASTURE,
    claimReviewed:
      "Fixed pasture measures, rotation intervals, paddock counts and treatment instructions were removed; the lesson requires a current local plan and qualified review.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "advanced-grooming-and-coat-management": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Unsourced cosmetic measurements and supplement-result timing were removed; skin and coat concerns now use observation, hygiene and veterinary escalation.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "bit-selection-basics": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Generic centimetre and wrinkle fitting rules were removed; the lesson requires qualified fitting or oral-health assessment, manufacturer guidance and current discipline rules.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "daily-stable-routines": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    claimReviewed:
      "Generated task-duration, temperature and review-cadence prescriptions were removed; daily care is now an individual-care, risk-based procedure with authorised current variations.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "emergency-first-aid-procedures": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_EMERGENCY,
    claimReviewed:
      "Learner-led bleeding, colic and eye-management procedures were replaced with safe preparation, prompt veterinary escalation and current yard emergency instructions.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "feeding-for-workload": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_FEEDING,
    claimReviewed:
      "Generic workload bands, pre-exercise and recovery timing, transition intervals, ration templates and supplement assumptions were removed; qualified review now uses factual individual records.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "first-crossrail-fences": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic cross-rail height, placing-pole distance, stride cues, course count and repetition thresholds were removed; setup and progression require qualified coach supervision.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "health-safety-in-the-yard": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    claimReviewed:
      "Fixed repair, inspection, evacuation-drill and record-review schedules were removed; the lesson requires current risk-based legal, insurer, fire-authority and yard procedures.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "horse-welfare-under-workload": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Universal recovery thresholds, rest calendars, conditioning durations and age-band programmes were removed; the lesson now uses individual baseline monitoring, qualified planning and veterinary escalation.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "introduction-to-jumping-position": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic pole spacing and drill timing or repetition prescriptions were removed from the lesson and enhancement; progression is coach-set and horse-specific.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "introduction-to-polework": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic pole adjustment increments, approach dimensions, duration and repetition targets were removed; a qualified coach now sets safe individual exercises.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "lameness-awareness": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_EMERGENCY,
    claimReviewed:
      "Learner-led lameness testing, grading, treatment directions and wait intervals were removed; the lesson teaches observation recording, stop-work and veterinary escalation.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "preparing-for-competition-day": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic arrival and course-walk requirements were removed; learners must use an event-specific travel, arrival and briefing plan.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "riding-assessment-and-self-coaching": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic improvement timelines and review schedules were removed; riders now use coach-agreed, welfare-aware goals and review points.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "risk-incident-awareness": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    claimReviewed:
      "The fixed risk-assessment review interval was removed; review now follows current employer, insurer, legal and responsible-yard requirements when circumstances change.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "safe-approach-handling": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    claimReviewed:
      "Generic horse-weight, vision-angle and hindquarter-distance rules were removed; handling requires supervised, horse-specific positioning and an escape route.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "seasonal-horse-care": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    claimReviewed:
      "The generic hot-weather water-volume target was removed; the lesson now requires individual access and monitoring within the current welfare plan.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "stable-checks": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    claimReviewed:
      "Universal stable-size, ventilation and parasite-treatment instructions were removed; the lesson now requires individual welfare, current yard procedures and professional escalation.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "turnout-and-rugs": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Generic rug-fill and temperature-chart prescriptions were removed; rugging follows the individual horse’s written plan, conditions and observed comfort.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "tying-up-correctly": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    claimReviewed:
      "The generic tie-rope length was removed; the lesson now requires a competent-person setup and continuous safety checks.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "understanding-competition-types": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: FEI_DRESSAGE,
    claimReviewed:
      "Generic arena, pace, fault, refusal and elimination rules were removed; learners must use the current organiser schedule and governing-body rules.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "vaccination-and-worming-schedules": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "Generic vaccination and worming schedules, drug thresholds and universal treatment directions were removed; the lesson retains professional-plan, record-keeping and current governing-body guidance.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "water-requirements": {
    reviewedAt: "2026-08-21",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    claimReviewed:
      "Generic water-volume totals, fixed checking intervals and one-test dehydration diagnosis were removed; the lesson uses clean-water access, individual monitoring and escalation guidance.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
};
