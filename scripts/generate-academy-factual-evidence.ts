import fs from "node:fs";
import path from "node:path";
import { LESSON_UNITS } from "../server/lessonContent";
import { REVIEWED_LESSON_CLAIMS } from "./academy-factual-review-decisions";

type Source = {
  organisation: string;
  title: string;
  url: string;
  checkedAt: string;
};

type RiskClass = "LOW_RISK_DESCRIPTIVE" | "HIGH_RISK";
type ReviewStatus =
  | "NOT_MATERIAL_FACT_CHECK_REQUIRED"
  | "SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW"
  | "CLAIM_REVIEWED_AND_ACCEPTED";

const REVIEW_DATE = "2026-08-21";
const SOURCES = {
  health: {
    organisation: "World Horse Welfare",
    title: "Horse health essentials",
    url: "https://www.worldhorsewelfare.org/advice/horse-health-essentials",
    checkedAt: REVIEW_DATE,
  },
  disease: {
    organisation: "World Horse Welfare",
    title: "Disease prevention in horses",
    url: "https://www.worldhorsewelfare.org/advice/disease-prevention-in-horses",
    checkedAt: REVIEW_DATE,
  },
  emergency: {
    organisation: "World Horse Welfare",
    title: "Preparing for an emergency – equine first aid",
    url: "https://www.worldhorsewelfare.org/advice/welfare-wednesdays/preparing-for-an-emergency-equine-first-aid",
    checkedAt: REVIEW_DATE,
  },
  feeding: {
    organisation: "World Horse Welfare",
    title: "Feeding horses",
    url: "https://www.worldhorsewelfare.org/advice/feeding-horses",
    checkedAt: REVIEW_DATE,
  },
  bhsFeeding: {
    organisation: "British Horse Society",
    title: "Feeding horses",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/feeding-horses/",
    checkedAt: REVIEW_DATE,
  },
  bhsPasture: {
    organisation: "British Horse Society",
    title: "Pasture management",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/pasture-management/",
    checkedAt: REVIEW_DATE,
  },
  feiDressage: {
    organisation: "Fédération Equestre Internationale",
    title: "FEI Dressage Rules 2026",
    url: "https://inside.fei.org/sites/default/files/FEI_Dressage_Rules_2026_Clean_Version_6.pdf",
    checkedAt: REVIEW_DATE,
  },
  welfare: {
    organisation: "British Equestrian",
    title: "Equine welfare fundamentals",
    url: "https://www.britishequestrian.org.uk/equine/ethics-and-welfare/equine-welfare-fundamentals",
    checkedAt: REVIEW_DATE,
  },
  safeguarding: {
    organisation: "British Equestrian",
    title: "What is safeguarding?",
    url: "https://www.britishequestrian.org.uk/getInvolved/safeguarding/what-is-safeguarding",
    checkedAt: REVIEW_DATE,
  },
  ukHorseKeeping: {
    organisation: "GOV.UK",
    title: "Keeping horses",
    url: "https://www.gov.uk/keeping-horses",
    checkedAt: REVIEW_DATE,
  },
  export: {
    organisation: "Animal and Plant Health Agency / GOV.UK",
    title: "Export horses and ponies: special rules",
    url: "https://www.gov.uk/guidance/export-horses-and-ponies-special-rules",
    checkedAt: REVIEW_DATE,
  },
  transport: {
    organisation: "World Horse Welfare",
    title: "Protection of equines during transport",
    url: "https://www.worldhorsewelfare.org/what-we-do/our-positions/protection-of-equines-during-transport",
    checkedAt: REVIEW_DATE,
  },
} satisfies Record<string, Source>;

const TOPIC_RULES: Array<{
  topic: string;
  pattern: RegExp;
  sources: Source[];
}> = [
  {
    topic:
      "Veterinary health, vital signs, preventative health, hoof, dental or tack-fit care",
    pattern:
      /\b(vital signs?|temperature|pulse|respiration|colic|laminitis|wound|lameness|vaccin|worm|parasite|dental|farrier|hoof|tack fit|first aid)\b/i,
    sources: [SOURCES.health, SOURCES.emergency],
  },
  {
    topic: "Nutrition, hydration, condition, feeding or supplements",
    pattern:
      /\b(feed|feeding|nutrition|water|hydration|supplement|diet|forage|condition score)\b/i,
    sources: [SOURCES.health, SOURCES.welfare, SOURCES.ukHorseKeeping],
  },
  {
    topic: "Infectious disease, hygiene or biosecurity",
    pattern:
      /\b(infectious|disease|biosecurity|isolation|quarantine|disinfect|outbreak)\b/i,
    sources: [SOURCES.disease, SOURCES.health],
  },
  {
    topic:
      "Transport, passports, export, ownership or current legal requirements",
    pattern:
      /\b(transport|travel|export|passport|microchip|legal|legislation|insurance)\b/i,
    sources: [SOURCES.export, SOURCES.transport, SOURCES.ukHorseKeeping],
  },
  {
    topic: "Safeguarding and reporting",
    pattern:
      /\b(safeguard|abuse|neglect|child|adult at risk|reporting route)\b/i,
    sources: [SOURCES.safeguarding, SOURCES.ukHorseKeeping],
  },
  {
    topic: "Welfare, ethics, management or end-of-life decision-making",
    pattern:
      /\b(welfare|ethic|end.of.life|retirement|responsible ownership)\b/i,
    sources: [SOURCES.welfare, SOURCES.ukHorseKeeping],
  },
  {
    topic: "Competition and riding safety",
    pattern:
      /\b(competition|cross.country|jump|pole|grid|protective equipment|body protector|riding hat)\b/i,
    sources: [SOURCES.welfare],
  },
];

const MATERIAL_NUMBER_OR_RULE =
  /\b\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?\s*(?:m|metres?|cm|mm|kg|g|ml|litres?|bpm|°c|degrees?|hours?|minutes?|mins?|seconds?|secs?|days?|weeks?|months?|years?|strides?|steps?|times?|repetitions?|reps?|holes?|fingers?|horse.lengths?|beats?|percent|%)\b|\b(?:must|required|legal|law|rule)\b/gi;

function fullText(lesson: (typeof LESSON_UNITS)[number]): string {
  return [
    lesson.title,
    lesson.content,
    lesson.safetyNote,
    lesson.practicalApplication,
    ...lesson.objectives,
    ...lesson.keyPoints,
    ...lesson.commonMistakes,
    ...lesson.knowledgeCheck.flatMap((question) => [
      question.question,
      ...question.options,
      question.explanation,
    ]),
    ...lesson.aiTutorPrompts,
  ].join("\n");
}

const changedLessons: Record<string, string> = {
  "introduction-to-polework":
    "Removed unsupported generic 3.0 m consecutive trot-pole spacing and rewrote the knowledge check around qualified-coach, horse-specific adjustment.",
  "introduction-to-jumping-position":
    "Removed generic 1.8–2.0 m pole spacing and rewrote the drill as coach-set, individual-horse guidance.",
  "first-crossrail-fences":
    "Removed generic 12–18 m related-distance instruction, corrected the true-bounce definition and removed rule-of-thumb distance changes.",
  "signs-of-good-health":
    "Aligned adult-at-rest temperature, pulse and respiration references with the reviewed World Horse Welfare source; removed conflicting ranges and single-test diagnosis thresholds.",
  "vaccination-and-worming-schedules":
    "Removed generic vaccination/worming schedules, drug thresholds and universal treatment directions; retained professional-plan, record-keeping and current-governing-body guidance.",
  "hoof-care-awareness":
    "Reframed routine hoof-care timing as World Horse Welfare’s average 6–8-week reference subject to individual qualified-farrier planning; removed growth-rate and treatment-prescriptive claims.",
  "feeding-basics":
    "Removed generic 500 kg ration examples and unsupported feed-change timing; uses reviewed forage-first, individual-plan and British Horse Society gradual-change guidance.",
  "water-requirements":
    "Removed generic water-volume totals, fixed checking intervals and one-test dehydration diagnosis; uses clean-water access, individual monitoring and escalation guidance.",
  "seasonal-horse-care":
    "Removed the generic hot-weather water-volume target and directs learners to individual access and monitoring.",
  "turnout-and-rugs":
    "Removed generic rug-fill and temperature-chart prescriptions; rugging now follows the individual horse’s written plan, conditions and observed comfort.",
  "stable-checks":
    "Removed the universal stable-size measurement, fixed ventilation instruction and generic parasite-treatment direction; uses individual welfare, yard procedure and professional escalation guidance.",
  "safe-approach-handling":
    "Removed generic horse-weight, vision-angle and hindquarter-distance rules; handling now requires supervised, horse-specific positioning and an escape route.",
  "tying-up-correctly":
    "Removed the generic tie-rope length and directs learners to competent-person setup and continuous safety checks.",
  "advanced-grooming-and-coat-management":
    "Removed unsourced cosmetic measurements and supplement-result timings; moved skin-condition content to observation, hygiene and veterinary escalation.",
  "risk-incident-awareness":
    "Removed the fixed risk-assessment review interval and directs learners to current employer, insurer and legal requirements when circumstances change.",
  "horse-welfare-under-workload":
    "Removed generic recovery thresholds, rest calendars, conditioning durations and age-band programmes; now uses individual baseline monitoring, qualified planning and veterinary escalation.",
  "lameness-awareness":
    "Removed learner-led lameness testing, grading, treatment directions and wait intervals; now teaches observation recording, stop-work and veterinary escalation.",
  "bit-selection-basics":
    "Removed generic centimetre and wrinkle fitting rules; directs learners to qualified fitting/oral-health assessment, manufacturer guidance and current discipline rules.",
  "arena-etiquette":
    "Replaced the universal-standard 20 m × 40 m wording with a small-arena example and requires the current organiser’s diagram for competition layouts.",
  "basic-school-figures":
    "Replaced universal arena-layout language with a 20 m-wide training example and current organiser-diagram guidance.",
  "circles-and-school-figures":
    "Corrected the international FEI Dressage arena reference to 20 m × 60 m and removed unsupported fixed school-figure prescriptions.",
  "understanding-competition-types":
    "Removed generic arena, pace, fault, refusal and elimination rules; requires the current organiser schedule and governing-body rules.",
  "preparing-for-competition-day":
    "Removed generic arrival and course-walk requirements; requires an event-specific travel, arrival and briefing plan.",
  "dressage-test-riding":
    "Removed generic introductory pace, arena and score-threshold rules; requires the current published test, schedule and approved arena diagram.",
  "daily-health-check-and-vital-signs":
    "Retained reviewed World Horse Welfare adult-at-rest TPR values while removing the fixed-duration and fixed-day health-check routine in favour of the individual written plan.",
  "pasture-management-basics":
    "Removed fixed sward heights, pasture percentages, grazing intervals, rotation counts and plant-removal instructions from both base and enhancement text; now requires current local and professional plans.",
  "when-to-call-the-vet":
    "Retained the reviewed adult-at-rest TPR reference while removing self-triage expectations and requiring prompt veterinary contact without delaying for extra observations.",
  "emergency-first-aid-procedures":
    "Replaced learner-led bleeding, colic and eye-management procedures with safe preparation, veterinary escalation and current yard emergency-procedure guidance.",
  "feeding-for-workload":
    "Removed generic workload bands, pre-exercise/recovery timing, feed-transition intervals, ration-template adjustments and supplement assumptions from both base and enhancement text; now uses factual records and qualified individual-plan review.",
  "riding-assessment-and-self-coaching":
    "Removed generic improvement timelines and milestone schedules; learners now use coach-agreed, welfare-aware goals and review points rather than universal calendar prescriptions.",
  "health-safety-in-the-yard":
    "Removed generated repair, inspection, drill and record-review timelines; the lesson now requires a risk-based procedure consistent with current legal, insurer, fire-authority and yard requirements.",
  "daily-stable-routines":
    "Removed generated task-duration, temperature and review-cadence prescriptions; the lesson now requires an individual-care, risk-based routine and authorised current variations record.",
  "equine-first-aid-basics":
    "Replaced fixed cold-hosing and learner-led wound-treatment directions with a first-response scope of scene safety, factual observation, prompt veterinary contact and current professional instruction.",
  "understanding-equine-digestion":
    "Removed the universal dietary-transition calendar and categorical colic ranking; the lesson now requires an individual feeding plan, factual records and prompt veterinary escalation for concerns.",
  "feeding-routines-and-rules":
    "Removed generic pre- and post-exercise intervals and transition timing; feeding and work planning now follows the documented individual plan and current professional advice.",
  "responsible-horse-ownership":
    "Removed universal lifespan and routine-service calendar claims; ownership is now presented as a long-term, welfare-led responsibility with horse-specific professional care and contingency planning.",
  "end-of-life-decisions":
    "Removed fixed quality-of-life review cadence and trend windows; the lesson requires a documented veterinary-led review process and current individual welfare plan.",
  "cross-country-fundamentals":
    "Removed generic warm-up durations, transition counts and stride-distance decision rules; course preparation and safety choices now require a qualified coach, current course conditions and event procedure.",
  "competition-etiquette-and-sportsmanship":
    "Removed generic warm-up observation and SMART-practice measurements; competition reflection and preparation now use the current organiser procedure and coach-agreed context.",
  "mental-skills-for-performance":
    "Removed generic arena-size, visualisation-duration and breathing-count prescriptions; goals and mental preparation are now individual, coach-aware and welfare-sensitive.",
  "competition-day-management":
    "Removed generic arrival buffers, schedule cut-offs, breathing counts and post-event practice calendars; preparation now follows current organiser, coach and horse-specific plans.",
};

const rows = LESSON_UNITS.map((lesson) => {
  const text = fullText(lesson);
  const topicMatches = TOPIC_RULES.filter((rule) => rule.pattern.test(text));
  const materialClaims = [...text.matchAll(MATERIAL_NUMBER_OR_RULE)].map(
    (match) => match[0],
  );
  const riskClass: RiskClass = topicMatches.length
    ? "HIGH_RISK"
    : "LOW_RISK_DESCRIPTIVE";
  const sourceRows = [
    ...new Map(
      topicMatches
        .flatMap((rule) => rule.sources)
        .map((source) => [source.url, source]),
    ).values(),
  ];
  const reviewDecision = REVIEWED_LESSON_CLAIMS[lesson.slug];
  const decisionSource = reviewDecision
    ? Object.values(SOURCES).find(
        (source) => source.url === reviewDecision.sourceUrl,
      )
    : undefined;
  const reviewedSourceRows = decisionSource
    ? [
        ...new Map(
          [...sourceRows, decisionSource].map((source) => [source.url, source]),
        ).values(),
      ]
    : sourceRows;
  const reviewStatus: ReviewStatus = reviewDecision
    ? "CLAIM_REVIEWED_AND_ACCEPTED"
    : riskClass === "LOW_RISK_DESCRIPTIVE" && materialClaims.length === 0
      ? "NOT_MATERIAL_FACT_CHECK_REQUIRED"
      : "SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW";
  return {
    lessonSlug: lesson.slug,
    title: lesson.title,
    pathwaySlug: lesson.pathwaySlug,
    level: lesson.level,
    claimTopics:
      topicMatches.length > 0
        ? topicMatches.map((rule) => rule.topic)
        : ["General descriptive educational content"],
    riskClass,
    sources: reviewedSourceRows,
    sourceCheckDate: REVIEW_DATE,
    materialNumberOrRuleMentions: [...new Set(materialClaims)],
    whatWasVerified: reviewDecision
      ? `${reviewDecision.outcome}: ${reviewDecision.claimReviewed}`
      : "This generated register maps lesson topics to reviewed authoritative sources and records material-number/rule candidates. It does not itself establish a specific claim as verified.",
    lessonChangeMade:
      changedLessons[lesson.slug] ??
      "No source-text change is recorded by this mapping step.",
    reviewStatus,
    reviewDecision: reviewDecision ?? null,
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  scope:
    "Per-lesson factual evidence mapping. SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW is intentionally unresolved until a reviewer records source-to-claim verification or rewrites the claim as a variable professional principle.",
  summary: {
    lessonsRegistered: rows.length,
    lowRiskNoMaterialFactCheckRequired: rows.filter(
      (row) => row.reviewStatus === "NOT_MATERIAL_FACT_CHECK_REQUIRED",
    ).length,
    sourceMappedRequiresSpecificClaimReview: rows.filter(
      (row) =>
        row.reviewStatus === "SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW",
    ).length,
    claimReviewedAndAccepted: rows.filter(
      (row) => row.reviewStatus === "CLAIM_REVIEWED_AND_ACCEPTED",
    ).length,
  },
  lessons: rows,
};

const outputDirectory = path.join(process.cwd(), "docs", "academy");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "lesson-factual-evidence-register.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
process.stdout.write(`${JSON.stringify(report.summary, null, 2)}\n`);
