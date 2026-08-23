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
  grooming: {
    organisation: "Cooperative Extension",
    title: "How to Groom a Horse",
    url: "https://horses.extension.org/how-to-groom-a-horse/",
    checkedAt: "2026-08-22",
  },
  mounting: {
    organisation: "Rutgers Equine Science Center",
    title: "Mounting, Dismounting, and Riding Horses Safely",
    url: "https://esc.rutgers.edu/fact_sheet/mounting-dismounting-and-riding-horses-safely/",
    checkedAt: "2026-08-22",
  },
  anatomy: {
    organisation: "University of Kentucky",
    title: "Equine Anatomy",
    url: "https://afs.mgcafe.uky.edu/files/equine_anatomy.pdf",
    checkedAt: "2026-08-22",
  },
  safeHandling: {
    organisation: "Penn State Extension",
    title: "Safe Horse Handling",
    url: "https://extension.psu.edu/safe-horse-handling/",
    checkedAt: "2026-08-22",
  },
  hoofAnatomy: {
    organisation: "British Horse Society",
    title: "Hoof anatomy",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/hoof-care/hoof-anatomy/",
    checkedAt: "2026-08-22",
  },
  stirrupSafety: {
    organisation: "American Quarter Horse Association",
    title: "Stirrup Safety Tips",
    url: "https://www.aqha.com/widget/-/stirrup-safety-ti-1",
    checkedAt: "2026-08-22",
  },
  safeRiding: {
    organisation: "University of Missouri Extension",
    title: "Safe Riding: Practical Guidelines for Horse and Rider",
    url: "https://extension.missouri.edu/publications/g2882",
    checkedAt: "2026-08-22",
  },
  fitnessProgramme: {
    organisation: "British Horse Society",
    title: "Implementing a fitness programme",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/horse-fitness/implementing-a-fitness-programme/",
    checkedAt: "2026-08-22",
  },
  hotWeatherExercise: {
    organisation: "British Horse Society",
    title: "Exercise, competing and travelling a horse in the heat",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/seasonal-care/exercise-travel-and-competing-in-hot-weather/",
    checkedAt: "2026-08-22",
  },
  hotWeatherCare: {
    organisation: "World Horse Welfare",
    title: "Hot weather horse care tips",
    url: "https://www.worldhorsewelfare.org/advice/hot-weather-horse-care-tips",
    checkedAt: "2026-08-22",
  },
  tackFit: {
    organisation: "British Horse Society",
    title: "Make sure your tack is fitted correctly",
    url: "https://www.bhs.org.uk/go-riding-and-learn/stable-mates/tack-fit/",
    checkedAt: "2026-08-22",
  },
  equipment: {
    organisation: "University of Kentucky Equine Programs",
    title: "Equipment",
    url: "https://equine.mgcafe.uky.edu/saddle-up-safely/equipment",
    checkedAt: "2026-08-22",
  },
  groundHandling: {
    organisation: "University of Missouri Extension",
    title: "Safe Ground Handling of Horses",
    url: "https://extension.missouri.edu/publications/g2878",
    checkedAt: "2026-08-22",
  },
  basicHorseSafety: {
    organisation: "Mississippi State University Extension",
    title: "Basic Horse Safety",
    url: "https://4h.extension.msstate.edu/resources/publications/basic-horse-safety",
    checkedAt: "2026-08-22",
  },
  groundSafety: {
    organisation: "University of Kentucky Equine Programs",
    title: "Ground Safety Tips",
    url: "https://equine.mgcafe.uky.edu/saddle-up-safely/ground-safety-tips",
    checkedAt: "2026-08-22",
  },
  fireSafety: {
    organisation: "Penn State Extension",
    title: "Fire Safety in Horse Stables",
    url: "https://extension.psu.edu/fire-safety-in-horse-stables",
    checkedAt: "2026-08-22",
  },
  yardSafety: {
    organisation: "Blue Cross",
    title: "Horse yard safety",
    url: "https://www.bluecross.org.uk/advice/horse/wellbeing-and-care/horse-yard-safety",
    checkedAt: "2026-08-22",
  },
  managingRisk: {
    organisation: "Health and Safety Executive",
    title: "Managing risks and risk assessment at work",
    url: "https://www.hse.gov.uk/simple-health-safety/risk/steps-needed-to-manage-risk.htm",
    checkedAt: "2026-08-22",
  },
  riddorTypes: {
    organisation: "Health and Safety Executive",
    title: "Types of reportable incidents",
    url: "https://www.hse.gov.uk/riddor/types-of-reportable-incidents.htm",
    checkedAt: "2026-08-22",
  },
  loneWork: {
    organisation: "Health and Safety Executive",
    title: "Lone working: Protect those working alone",
    url: "https://www.hse.gov.uk/lone-working/employer/manage-the-risks-of-working-alone.htm",
    checkedAt: "2026-08-22",
  },
  riderIntroduction: {
    organisation: "British Horse Society",
    title: "About the Rider Introduction award – coach guidance",
    url: "https://www.bhs.org.uk/media/5rijjjt5/introduction-about-the-rider-checklist-guidance.pdf",
    checkedAt: "2026-08-22",
  },
  firstLesson: {
    organisation: "British Equestrian",
    title: "Your first lesson",
    url: "https://www.britishequestrian.org.uk/getInvolved/participation/your-first-lesson",
    checkedAt: "2026-08-22",
  },
  stage2Coach: {
    organisation: "British Horse Society",
    title: "Stage 2 Coach Syllabus",
    url: "https://www.bhs.org.uk/bhs-professional-qualifications-and-careers/bhs-qualifications-and-stages/stage-2/stage-2-coach-syllabus/",
    checkedAt: "2026-08-22",
  },
  stage4: {
    organisation: "British Horse Society",
    title: "Stage 4",
    url: "https://www.bhs.org.uk/bhs-professional-qualifications-and-careers/bhs-qualifications-and-stages/stage-4/",
    checkedAt: "2026-08-22",
  },
  practicalCpd: {
    organisation: "British Horse Society",
    title: "Practical CPD courses",
    url: "https://www.bhs.org.uk/events/find-a-cpd-course/practical-cpd-courses/",
    checkedAt: "2026-08-22",
  },
  britishShowjumpingWelfare: {
    organisation: "British Showjumping",
    title: "Equine Welfare",
    url: "https://www.britishshowjumping.co.uk/membership/Equine-Welfare",
    checkedAt: "2026-08-22",
  },
  anxiety: {
    organisation: "National Health Service",
    title: "Anxiety, fear and panic",
    url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/",
    checkedAt: "2026-08-22",
  },
  breathing: {
    organisation: "National Health Service",
    title: "Breathing exercises for stress",
    url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
    checkedAt: "2026-08-22",
  },
  equestrianWellbeing: {
    organisation: "British Equestrian",
    title: "Introduction to mental wellbeing",
    url: "https://www.britishequestrian.org.uk/getInvolved/mental-wellbeing/introduction-to-mental-wellbeing",
    checkedAt: "2026-08-22",
  },
  equineSafety: {
    organisation: "Mississippi State University Extension",
    title: "Safety Awareness with Equine",
    url: "https://extension.msstate.edu/programs/safety-awareness-equine",
    checkedAt: "2026-08-22",
  },
  stage3Lunge: {
    organisation: "British Horse Society",
    title: "Stage 3 Lunge Syllabus",
    url: "https://www.bhs.org.uk/bhs-professional-qualifications-and-careers/bhs-qualifications-and-stages/stage-3/stage-3-lunge-syllabus/",
    checkedAt: "2026-08-22",
  },
  groundwork: {
    organisation: "World Horse Welfare",
    title: "Building your horse's strength through groundwork",
    url: "https://www.worldhorsewelfare.org/advice/welfare-wednesdays/building-your-horses-strength-through-groundwork",
    checkedAt: "2026-08-22",
  },
  returnToWork: {
    organisation: "World Horse Welfare",
    title: "Bringing horses back into work",
    url: "https://www.worldhorsewelfare.org/blog/bringing-horses-back-into-work-how-to-restart-youngsters-progress-a-horses-rehabilitation-programme-or-get-an-established-all-rounder-fit-again",
    checkedAt: "2026-08-22",
  },
  horseFitness: {
    organisation: "British Horse Society",
    title: "Horse fitness",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/horse-fitness/",
    checkedAt: "2026-08-22",
  },
  bhsEms: {
    organisation: "British Horse Society",
    title: "Equine Metabolic Syndrome",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/equine-diseases/equine-metabolic-syndrome/",
    checkedAt: "2026-08-22",
  },
  whwEms: {
    organisation: "World Horse Welfare",
    title: "Equine Metabolic Syndrome",
    url: "https://www.worldhorsewelfare.org/advice/equine-metabolic-syndrome",
    checkedAt: "2026-08-22",
  },
  horseWelfareCode: {
    organisation: "DEFRA / GOV.UK",
    title:
      "Code of practice for the welfare of horses, ponies, donkeys and their hybrids",
    url: "https://www.gov.uk/government/publications/code-of-practice-for-the-welfare-of-horses-ponies-donkeys-and-their-hybrids",
    checkedAt: "2026-08-22",
  },
  fiveDomains: {
    organisation: "World Horse Welfare",
    title: "The Five Domains of animal welfare",
    url: "https://www.worldhorsewelfare.org/advice/the-five-domains-of-animal-welfare",
    checkedAt: "2026-08-22",
  },
  worriedAboutHorse: {
    organisation: "World Horse Welfare",
    title: "Worried about a horse?",
    url: "https://www.worldhorsewelfare.org/what-we-do/in-the-uk/worried-about-a-horse",
    checkedAt: "2026-08-22",
  },
  animalWelfareAct: {
    organisation: "UK Legislation",
    title: "Animal Welfare Act 2006",
    url: "https://www.legislation.gov.uk/ukpga/2006/45/contents",
    checkedAt: "2026-08-22",
  },
  horsePassport: {
    organisation: "GOV.UK",
    title: "Getting and using a horse passport",
    url: "https://www.gov.uk/horse-passport",
    checkedAt: "2026-08-22",
  },
  horseLearning: {
    organisation: "World Horse Welfare",
    title: "Training: how do horses learn?",
    url: "https://www.worldhorsewelfare.org/advice/training-how-do-horses-learn",
    checkedAt: "2026-08-22",
  },
  behaviourChecklist: {
    organisation: "World Horse Welfare",
    title: "Behaviour checklist",
    url: "https://www.worldhorsewelfare.org/advice/behaviour-checklist-is-your-horse-trying-to-tell-you-something",
    checkedAt: "2026-08-22",
  },
  endOfLife: {
    organisation: "World Horse Welfare",
    title: "Equine end of life",
    url: "https://www.worldhorsewelfare.org/advice/equine-end-of-life",
    checkedAt: "2026-08-22",
  },
  euthanasia: {
    organisation: "British Horse Society",
    title: "Euthanasia",
    url: "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/euthanasia/",
    checkedAt: "2026-08-22",
  },
  rehoming: {
    organisation: "World Horse Welfare",
    title: "Responsible rehoming of horses",
    url: "https://www.worldhorsewelfare.org/advice/responsible-rehoming-of-horses",
    checkedAt: "2026-08-22",
  },
  aaepEuthanasia: {
    organisation: "American Association of Equine Practitioners",
    title: "Euthanasia Guidelines",
    url: "https://aaep.org/resource/euthanasia-guidelines/",
    checkedAt: "2026-08-22",
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
  "parts-of-the-horse":
    "Replaced every learner-facing factual field with a reviewed external-anatomy and hoof-vocabulary lesson, safe approach, factual non-diagnostic reporting and professional escalation.",
  "rider-position-basics":
    "Replaced every learner-facing factual field with individual coach-reviewed alignment, safe stirrup/footwear fit, equipment checks and explicit stop/escalation boundaries.",
  "warmup-cooldown":
    "Replaced every learner-facing factual field with individual progressive preparation/recovery, contextual observation, current hot-weather cooling and professional escalation.",
  "lesson-preparation":
    "Replaced every learner-facing factual field with fail-closed plan, equipment, tack-fit, rider, horse, environment and supervision checks.",
  "leading-safely":
    "Replaced every learner-facing factual field with reviewed position, folded-rope, turn, gate/release and people-first escalation principles.",
  "yard-hazard-awareness":
    "Replaced every learner-facing factual field with reviewed prevention, housekeeping, storage, specialist-authority, evacuation and factual-reporting boundaries.",
  "risk-incident-awareness":
    "Replaced every learner-facing factual field with a current UK risk-management example, factual records, responsible-person review and bounded RIDDOR explanation.",
  "advanced-safety-awareness":
    "Replaced every learner-facing factual field with site-specific lone-work, competence, supervision, monitoring, contact, welfare and safeguarding controls.",
  "advanced-rider-position-analysis":
    "Replaced every learner-facing factual field with context-specific observation, safe equipment, one qualified change and professional referral boundaries.",
  "trot-rhythm-and-balance":
    "Replaced every learner-facing factual field with suitable-horse, qualified-supervision, position, balance, security and support principles.",
  "rider-balance-independent-seat":
    "Replaced every learner-facing factual field with a participant-centred functional coaching aim, appropriate support, consent and neutral observation.",
  "teaching-the-foundations":
    "Replaced every learner-facing factual field with qualified-coach scope, individual suitability, safeguards, an observable aim, adaptation and welfare-led progression.",
  "communication-and-feedback-skills":
    "Replaced every learner-facing factual field with participant-centred communication, factual feedback, adaptation, consent, privacy and safeguarding.",
  "understanding-your-learners":
    "Replaced every learner-facing factual field with authorised relevant information, respectful questions, individual adaptation, consent, privacy and referral.",
  "structuring-a-beginner-lesson":
    "Replaced every learner-facing factual field with qualified risk/suitability planning, an observable aim, adaptable activity, conclusion and evaluation.",
  "building-riding-confidence":
    "Replaced every learner-facing factual field with participant choice, small coach-approved steps, optional unforced breathing, non-clinical reflection and health referral.",
  "safe-approach-and-catching":
    "Replaced every learner-facing factual field with a slow shoulder approach, authorised equipment, supervised release and qualified difficult-horse escalation.",
  "tying-up-safely":
    "Replaced every learner-facing factual field with competent site-specific setup, sturdy approved point, supervision, quick-release limitations and emergency response.",
  "lungeing-basics":
    "Replaced every learner-facing factual field with professional competency, suitability, equipment, environment, welfare, observation and emergency boundaries.",
  "long-reining-introduction":
    "Replaced every learner-facing factual field with an explicit non-procedural professional-scope lesson covering decisions, roles, welfare and line-risk boundaries.",
  "advanced-groundwork-exercises":
    "Replaced every learner-facing factual field with an individual expert-led planning, veterinary, observation, welfare and referral framework.",
  "understanding-equine-digestion":
    "Replaced every learner-facing factual field with individual forage-led plan, clean feed/water, gradual change, factual record and prompt veterinary boundaries.",
  "types-of-feed":
    "Replaced every learner-facing factual field with bounded feed-category, label, batch, quality, water, hygiene and qualified-suitability teaching.",
  "feeding-routines-and-rules":
    "Replaced every learner-facing factual field with written-plan authority, identity, measurement, hygiene, water, error and truthful-record controls.",
  "balancing-a-diet":
    "Replaced every learner-facing factual field with a qualified whole-ration review using authorised condition, weight, workload, forage, water and health evidence.",
  "feeding-for-workload":
    "Replaced every learner-facing factual field with factual work and feeding evidence for qualified whole-plan review and explicit no-formula boundaries.",
  "supplements-and-special-diets":
    "Replaced every learner-facing factual field with whole-ration qualified review, label/overlap controls, written electrolyte decisions and veterinary-led special diets.",
  "five-freedoms-of-animal-welfare":
    "Replaced every learner-facing factual field with historic welfare prompts, the individual Five Domains lens, factual observation and current local reporting.",
  "responsible-horse-ownership":
    "Replaced every learner-facing factual field with individual welfare, professional-care, record, finance, emergency-authority and contingency responsibilities.",
  "recognising-neglect-and-abuse":
    "Replaced every learner-facing factual field with first-hand factual observation and current emergency, veterinary, welfare, authority and safeguarding reporting boundaries.",
  "welfare-legislation-uk":
    "Replaced every learner-facing factual field with jurisdiction-labelled law/code/policy distinctions and current official passport/document routes.",
  "ethical-training-methods":
    "Replaced every learner-facing factual field with high-level learning definitions, compassionate welfare principles, factual observation and qualified referral.",
  "end-of-life-decisions":
    "Replaced every learner-facing factual field with advance planning, factual quality-of-life records, veterinarian-led decisions and current authorised routes.",
  "grooming-basics":
    "Rewrote the full lesson and checks around reviewed grooming-tool use, supervised safe handling, factual observation and veterinary or farrier escalation.",
  "mounting-dismounting":
    "Rewrote the full lesson and checks around reviewed tack and area checks, controlled mounting/dismounting and supervised emergency-practice boundaries.",
  "common-equine-ailments":
    "Rewrote the full lesson and checks as non-diagnostic colic and laminitis awareness with factual observation, stop-work and prompt responsible-person or veterinary escalation.",
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
    "Rewrote the complete lesson and checks around early factual veterinary contact, current emergency planning and case-specific direction; removed diagnostic lists, fixed triage thresholds, delayed measurement gathering and generic interim treatment.",
  "grid-work-and-related-distances":
    "Rewrote the complete lesson and checks to reserve grid purpose, measurement, construction, adjustment and progression for qualified coaches; removed universal distances, stride tables, heights and learner-led setup.",
  "course-awareness-and-planning":
    "Rewrote the complete lesson and checks around current official information, authorised observation, welfare and incident boundaries; removed route, line, stride, course-design and surface-safety instruction.",
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
  const decisionSources = reviewDecision
    ? Object.values(SOURCES).filter((source) =>
        [
          reviewDecision.sourceUrl,
          ...(reviewDecision.additionalSourceUrls ?? []),
        ].includes(source.url),
      )
    : [];
  const reviewedSourceRows = decisionSources.length
    ? [
        ...new Map(
          [...sourceRows, ...decisionSources].map((source) => [
            source.url,
            source,
          ]),
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
    sourceCheckDate: reviewDecision?.reviewedAt ?? REVIEW_DATE,
    materialNumberOrRuleMentions: [...new Set(materialClaims)],
    whatWasVerified: reviewDecision
      ? `${reviewDecision.outcome}: ${reviewDecision.claimReviewed}`
      : "This generated register maps lesson topics to reviewed authoritative sources and records material-number/rule candidates. It does not itself establish a specific claim as verified.",
    lessonChangeMade:
      changedLessons[lesson.slug] ??
      (reviewDecision?.outcome === "REWRITTEN_AS_PRINCIPLE"
        ? `Replaced the complete learner-facing lesson, assessments and Tutor prompts within this reviewed boundary: ${reviewDecision.claimReviewed}`
        : "No source-text change is recorded by this mapping step."),
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
