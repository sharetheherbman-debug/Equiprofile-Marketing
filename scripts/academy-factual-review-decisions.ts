export type ClaimReviewOutcome = "ACCEPTED" | "REWRITTEN_AS_PRINCIPLE";

export type ClaimReviewDecision = {
  reviewedAt: "2026-08-21" | "2026-08-22";
  reviewedBy: "academy-source-comparison";
  sourceUrl: string;
  additionalSourceUrls?: string[];
  claimReviewed: string;
  outcome: ClaimReviewOutcome;
};

function rewrittenAsPrinciple(
  sourceUrl: string,
  claimReviewed: string,
  additionalSourceUrls?: string[],
): ClaimReviewDecision {
  return {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl,
    additionalSourceUrls,
    claimReviewed,
    outcome: "REWRITTEN_AS_PRINCIPLE",
  };
}

const WHW_HEALTH =
  "https://www.worldhorsewelfare.org/advice/horse-health-essentials";
const WHW_EMERGENCY =
  "https://www.worldhorsewelfare.org/advice/welfare-wednesdays/preparing-for-an-emergency-equine-first-aid";
const WHW_FEEDING = "https://www.worldhorsewelfare.org/advice/feeding-horses";
const WHW_HOT_WEATHER =
  "https://www.worldhorsewelfare.org/advice/hot-weather-horse-care-tips";
const BHS_FEEDING =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/feeding-horses/";
const BHS_PASTURE =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/pasture-management/";
const FEI_DRESSAGE =
  "https://inside.fei.org/sites/default/files/FEI_Dressage_Rules_2026_Clean_Version_6.pdf";
const GOV_KEEPING_HORSES = "https://www.gov.uk/keeping-horses";
const EXTENSION_GROOMING = "https://horses.extension.org/how-to-groom-a-horse/";
const RUTGERS_MOUNTING =
  "https://esc.rutgers.edu/fact_sheet/mounting-dismounting-and-riding-horses-safely/";
const UKY_EQUINE_ANATOMY =
  "https://afs.mgcafe.uky.edu/files/equine_anatomy.pdf";
const PENN_SAFE_HANDLING = "https://extension.psu.edu/safe-horse-handling/";
const BHS_HOOF_ANATOMY =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/hoof-care/hoof-anatomy/";
const AQHA_STIRRUP_SAFETY = "https://www.aqha.com/widget/-/stirrup-safety-ti-1";
const MISSOURI_SAFE_RIDING =
  "https://extension.missouri.edu/publications/g2882";
const BHS_FITNESS_PROGRAMME =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/horse-fitness/implementing-a-fitness-programme/";
const BHS_HOT_WEATHER =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/seasonal-care/exercise-travel-and-competing-in-hot-weather/";
const BHS_TACK_FIT =
  "https://www.bhs.org.uk/go-riding-and-learn/stable-mates/tack-fit/";
const UKY_EQUIPMENT =
  "https://equine.mgcafe.uky.edu/saddle-up-safely/equipment";
const MISSOURI_GROUND_HANDLING =
  "https://extension.missouri.edu/publications/g2878";
const MISSISSIPPI_BASIC_SAFETY =
  "https://4h.extension.msstate.edu/resources/publications/basic-horse-safety";
const UKY_GROUND_SAFETY =
  "https://equine.mgcafe.uky.edu/saddle-up-safely/ground-safety-tips";
const PENN_FIRE_SAFETY =
  "https://extension.psu.edu/fire-safety-in-horse-stables";
const BLUE_CROSS_YARD_SAFETY =
  "https://www.bluecross.org.uk/advice/horse/wellbeing-and-care/horse-yard-safety";
const HSE_MANAGING_RISK =
  "https://www.hse.gov.uk/simple-health-safety/risk/steps-needed-to-manage-risk.htm";
const HSE_RIDDOR_TYPES =
  "https://www.hse.gov.uk/riddor/types-of-reportable-incidents.htm";
const HSE_LONE_WORK =
  "https://www.hse.gov.uk/lone-working/employer/manage-the-risks-of-working-alone.htm";
const BHS_RIDER_INTRODUCTION =
  "https://www.bhs.org.uk/media/5rijjjt5/introduction-about-the-rider-checklist-guidance.pdf";
const BRITISH_EQUESTRIAN_FIRST_LESSON =
  "https://www.britishequestrian.org.uk/getInvolved/participation/your-first-lesson";
const BHS_STAGE_2_COACH =
  "https://www.bhs.org.uk/bhs-professional-qualifications-and-careers/bhs-qualifications-and-stages/stage-2/stage-2-coach-syllabus/";
const BHS_STAGE_4 =
  "https://www.bhs.org.uk/bhs-professional-qualifications-and-careers/bhs-qualifications-and-stages/stage-4/";
const BHS_PRACTICAL_CPD =
  "https://www.bhs.org.uk/events/find-a-cpd-course/practical-cpd-courses/";
const BRITISH_SHOWJUMPING_WELFARE =
  "https://www.britishshowjumping.co.uk/membership/Equine-Welfare";
const BRITISH_EQUESTRIAN_WELFARE =
  "https://www.britishequestrian.org.uk/equine/ethics-and-welfare/equine-welfare-fundamentals";
const BRITISH_EQUESTRIAN_SAFEGUARDING =
  "https://www.britishequestrian.org.uk/getInvolved/safeguarding/what-is-safeguarding";
const NHS_ANXIETY =
  "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/";
const NHS_BREATHING =
  "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/";
const BRITISH_EQUESTRIAN_WELLBEING =
  "https://www.britishequestrian.org.uk/getInvolved/mental-wellbeing/introduction-to-mental-wellbeing";
const MISSISSIPPI_EQUINE_SAFETY =
  "https://extension.msstate.edu/programs/safety-awareness-equine";
const BHS_STAGE_3_LUNGE =
  "https://www.bhs.org.uk/bhs-professional-qualifications-and-careers/bhs-qualifications-and-stages/stage-3/stage-3-lunge-syllabus/";
const WHW_GROUNDWORK =
  "https://www.worldhorsewelfare.org/advice/welfare-wednesdays/building-your-horses-strength-through-groundwork";
const WHW_RETURN_TO_WORK =
  "https://www.worldhorsewelfare.org/blog/bringing-horses-back-into-work-how-to-restart-youngsters-progress-a-horses-rehabilitation-programme-or-get-an-established-all-rounder-fit-again";
const BHS_HORSE_FITNESS =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/horse-fitness/";
const BHS_EMS =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/horse-health/equine-diseases/equine-metabolic-syndrome/";
const WHW_EMS =
  "https://www.worldhorsewelfare.org/advice/equine-metabolic-syndrome";
const DEFRA_HORSE_WELFARE_CODE =
  "https://www.gov.uk/government/publications/code-of-practice-for-the-welfare-of-horses-ponies-donkeys-and-their-hybrids";
const WHW_FIVE_DOMAINS =
  "https://www.worldhorsewelfare.org/advice/the-five-domains-of-animal-welfare";
const WHW_WORRIED =
  "https://www.worldhorsewelfare.org/what-we-do/in-the-uk/worried-about-a-horse";
const ANIMAL_WELFARE_ACT =
  "https://www.legislation.gov.uk/ukpga/2006/45/contents";
const GOV_HORSE_PASSPORT = "https://www.gov.uk/horse-passport";
const WHW_HORSE_LEARNING =
  "https://www.worldhorsewelfare.org/advice/training-how-do-horses-learn";
const WHW_BEHAVIOUR_CHECKLIST =
  "https://www.worldhorsewelfare.org/advice/behaviour-checklist-is-your-horse-trying-to-tell-you-something";
const WHW_END_OF_LIFE =
  "https://www.worldhorsewelfare.org/advice/equine-end-of-life";
const BHS_EUTHANASIA =
  "https://www.bhs.org.uk/horse-care-and-welfare/health-care-management/euthanasia/";
const WHW_REHOMING =
  "https://www.worldhorsewelfare.org/advice/responsible-rehoming-of-horses";
const AAEP_EUTHANASIA = "https://aaep.org/resource/euthanasia-guidelines/";

/**
 * A decision exists only after a reviewer has identified the precise remaining
 * claim or confirmed that the lesson was rewritten as an individual,
 * qualified-professional principle. It intentionally omits unreviewed lessons.
 */
export const REVIEWED_LESSON_CLAIMS: Record<string, ClaimReviewDecision> = {
  "parts-of-the-horse": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: UKY_EQUINE_ANATOMY,
    additionalSourceUrls: [PENN_SAFE_HANDLING, BHS_HOOF_ANATOMY],
    claimReviewed:
      "The complete lesson and all assessments now retain only reviewed external-anatomy and hoof vocabulary, a source-supported safe approach, factual non-diagnostic reporting and current professional or authority escalation. Unsupported functional, clinical, conformation, passport and prognosis claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "rider-position-basics": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: AQHA_STIRRUP_SAFETY,
    additionalSourceUrls: [MISSOURI_SAFE_RIDING],
    claimReviewed:
      "The complete lesson and all assessments now use alignment only as individual coach-reviewed guidance, make stirrup fit dependent on the actual rider, horse, saddle, footwear and activity, preserve safe-release and equipment checks, and remove universal biomechanics, measurements, causal outcomes and exercise prescriptions.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "warmup-cooldown": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_FITNESS_PROGRAMME,
    additionalSourceUrls: [BHS_HOT_WEATHER, WHW_HOT_WEATHER],
    claimReviewed:
      "The complete lesson and all assessments now teach individual progressive preparation and recovery, contextual observation, current hot-weather reduction and cool-water cooling, and prompt professional escalation. Fixed timings, thresholds, biological certainty and self-diagnosis were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "lesson-preparation": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_TACK_FIT,
    additionalSourceUrls: [UKY_EQUIPMENT, MISSOURI_SAFE_RIDING],
    claimReviewed:
      "The complete lesson and all assessments now separate visible equipment inspection from qualified tack fit, require current horse/rider/area/supervision checks, and fail closed for damage, uncertain fit or incomplete preparation. Universal fitting measurements and unsupported outcome claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "leading-safely": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: MISSOURI_GROUND_HANDLING,
    additionalSourceUrls: [MISSISSIPPI_BASIC_SAFETY, UKY_GROUND_SAFETY],
    claimReviewed:
      "The complete lesson and all assessments now retain reviewed shoulder position, folded lead-rope handling, turns away from the handler, planned gate/release procedures and people-first escalation. Fixed lengths, force, chains, road positioning, punishment and self-management of dangerous horses were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "yard-hazard-awareness": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: PENN_FIRE_SAFETY,
    additionalSourceUrls: [BLUE_CROSS_YARD_SAFETY],
    claimReviewed:
      "The complete lesson and all assessments now retain reviewed prevention, housekeeping, storage, access, chemical/electrical authority and site-plan evacuation principles. Unsupported frequencies, distances, firefighting thresholds, horse-release techniques and causal conclusions were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "risk-incident-awareness": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: HSE_MANAGING_RISK,
    additionalSourceUrls: [HSE_RIDDOR_TYPES],
    claimReviewed:
      "The complete lesson and all assessments now use the current UK identify-assess-control-record-review example, factual authorised records and urgent-help-first boundary. Universal legal claims, fixed reviews, learner investigations and the assertion that every incident is RIDDOR-reportable were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "advanced-safety-awareness": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: HSE_LONE_WORK,
    additionalSourceUrls: [GOV_KEEPING_HORSES],
    claimReviewed:
      "The complete lesson and all assessments now require site- and task-specific lone-work risk management, competence, supervision, monitoring, contact and response, with welfare and safeguarding escalation. Invented universal task, weather, contact and legal rules were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "advanced-rider-position-analysis": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: MISSOURI_SAFE_RIDING,
    claimReviewed:
      "The complete lesson and all assessments now use context-specific factual coaching observations, safe equipment and one qualified change at a time. Universal biomechanics, therapeutic claims, causal diagnosis and fixed no-stirrup or self-assessment programmes were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "trot-rhythm-and-balance": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_RIDER_INTRODUCTION,
    additionalSourceUrls: [MISSOURI_SAFE_RIDING],
    claimReviewed:
      "The complete lesson and all assessments now centre suitable horses, qualified supervision, position, balance, security and approved support. Universal gait, tempo, diagonal, no-stirrup, repetition and diagnostic claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "rider-balance-independent-seat": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_RIDER_INTRODUCTION,
    additionalSourceUrls: [MISSOURI_SAFE_RIDING],
    claimReviewed:
      "The complete lesson and all assessments now define independence as an individual coach-observed functional aim with suitable support, consent and neutral observation. Fixed anatomy, therapeutic causation and prescribed no-stirrup, lunge, device or off-horse programmes were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "teaching-the-foundations": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BRITISH_EQUESTRIAN_FIRST_LESSON,
    additionalSourceUrls: [BHS_STAGE_2_COACH],
    claimReviewed:
      "The complete lesson and all assessments now require qualified authorised coaching, individual horse-rider suitability, safeguards, a small observable aim, adaptation, feedback and welfare-led progression. Fixed timings, fault diagnoses and unqualified beginner-teaching procedures were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "communication-and-feedback-skills": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_STAGE_2_COACH,
    claimReviewed:
      "The complete lesson and all assessments now use factual participant-centred communication, understanding checks, adaptation, feedback, consent, privacy and safeguarding. Universal feedback formulas, learning-style labels, timing rules and diagnostic claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "understanding-your-learners": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_STAGE_2_COACH,
    claimReviewed:
      "The complete lesson and all assessments now use authorised relevant information, respectful questions, individual adaptation, consent, privacy, safeguarding and appropriate referral. Age prescriptions, stereotypes, learning-style labels, confidence treatment and unauthorised personal-data handling were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "structuring-a-beginner-lesson": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_STAGE_2_COACH,
    claimReviewed:
      "The complete lesson and all assessments now structure qualified planning around risk, suitability, an observable aim, preparation, adaptable activity, conclusion and evaluation. Assessment-specific timings, compulsory progression and unqualified teaching procedures were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "building-riding-confidence": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: NHS_ANXIETY,
    additionalSourceUrls: [NHS_BREATHING, BRITISH_EQUESTRIAN_WELLBEING],
    claimReviewed:
      "The complete lesson and all assessments now use participant-chosen small targets, optional gradual coach-approved steps, unforced breathing, honest reflection and health referral. Diagnosis, treatment, forced exposure, universal psychological claims and fixed breathing or progression rules were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "safe-approach-and-catching": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: PENN_SAFE_HANDLING,
    additionalSourceUrls: [UKY_GROUND_SAFETY, MISSISSIPPI_EQUINE_SAFETY],
    claimReviewed:
      "The complete lesson and all assessments now retain the reviewed slow shoulder approach, authorised equipment, unwrapped lead rope, supervised release and qualified difficult-horse escalation. Fixed distances, fitting gaps, eye-contact rules, chasing, treats and containment techniques were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "tying-up-safely": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: MISSISSIPPI_EQUINE_SAFETY,
    additionalSourceUrls: [UKY_GROUND_SAFETY, PENN_SAFE_HANDLING],
    claimReviewed:
      "The complete lesson and all assessments now require competent horse- and site-specific tying decisions, an approved sturdy point, supervised quick-release setup and current emergency response. Fixed measurements, guaranteed release, universal breakaway material, punishment and pull-back remediation were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "lungeing-basics": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_STAGE_3_LUNGE,
    additionalSourceUrls: [BHS_STAGE_2_COACH],
    claimReviewed:
      "The complete lesson and all assessments now present lungeing as a trained professional competency and limit learners to observing suitability, equipment, environment, welfare and stop decisions. Line, circle, position, cue, duration, training-aid and diagnostic procedures were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "long-reining-introduction": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_STAGE_2_COACH,
    claimReviewed:
      "The complete lesson and all assessments now make the evidentiary limit explicit: learners observe qualified suitability, equipment, environment, role, welfare and stop decisions but receive no line routing, handler position, contact, cue, distance, progression or training-effect procedure.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "advanced-groundwork-exercises": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_GROUNDWORK,
    additionalSourceUrls: [WHW_RETURN_TO_WORK, BHS_HORSE_FITNESS],
    claimReviewed:
      "The complete lesson and all assessments now require an individual expert-led plan, veterinary control of health or rehabilitation, factual observation and welfare-led stop decisions. Prescribed exercises, biomechanics, behaviour diagnosis, force, fixed measures and rehabilitation procedures were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "understanding-equine-digestion": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    additionalSourceUrls: [BHS_FEEDING],
    claimReviewed:
      "The complete lesson and all assessments now retain only practical individual forage-led planning, clean feed/water, gradual change, factual records and prompt veterinary escalation. Unsupported digestive anatomy, acid, fermentation, causal, transition and colic self-triage claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "types-of-feed": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    additionalSourceUrls: [BHS_FEEDING],
    claimReviewed:
      "The complete lesson and all assessments now describe forage, concentrate, balancer and supplement only as categories within an individual plan, with label, batch, quality, water and hygiene controls. Universal suitability, nutrient, disease and treatment claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "feeding-routines-and-rules": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    additionalSourceUrls: [BHS_FEEDING],
    claimReviewed:
      "The complete lesson and all assessments now make the written individual plan authoritative, with identity, measurement, hygiene, water, error and truthful-record controls. Universal times, exercise intervals, amounts, transitions and unauthorised changes were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "balancing-a-diet": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    additionalSourceUrls: [BHS_FEEDING],
    claimReviewed:
      "The complete lesson and all assessments now frame balance as a qualified whole-ration review using authorised condition, weight, workload, forage, water, health and management records. Fixed scores, ideal values, causal diagnoses and learner diet changes were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "feeding-for-workload": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_FEEDING,
    additionalSourceUrls: [BHS_FEEDING],
    claimReviewed:
      "The complete lesson and all assessments now use factual work, condition, appetite, forage, water, health and management records for qualified whole-plan review. Universal workload bands, ration changes, feed timings, seasonal templates and supplement assumptions were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "supplements-and-special-diets": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_FEEDING,
    additionalSourceUrls: [BHS_EMS, WHW_EMS],
    claimReviewed:
      "The complete lesson and all assessments now require whole-ration qualified review, label and overlap controls, written electrolyte decisions and veterinary-led special diets. Ingredient benefits, toxicity diagnosis, doses, metabolic diagnosis and generic soaking/grazing/treatment instructions were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "five-freedoms-of-animal-welfare": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: DEFRA_HORSE_WELFARE_CODE,
    additionalSourceUrls: [WHW_FIVE_DOMAINS, WHW_WORRIED],
    claimReviewed:
      "The complete lesson and all assessments now use the Five Freedoms only as historic prompts alongside the individual Five Domains lens, factual observation and current local reporting. Diagnostic, universal management, legal-verdict, confrontation and one-route claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "responsible-horse-ownership": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: GOV_KEEPING_HORSES,
    additionalSourceUrls: [WHW_REHOMING, WHW_END_OF_LIFE],
    claimReviewed:
      "The complete lesson and all assessments now frame ownership as ongoing individual welfare, professional-care, record, finance, emergency-authority and contingency responsibility. Universal lifespan, cost and service calendars plus generic legal, transport, loan, rehoming and end-of-life claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "recognising-neglect-and-abuse": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: DEFRA_HORSE_WELFARE_CODE,
    additionalSourceUrls: [WHW_WORRIED],
    claimReviewed:
      "The complete lesson and all assessments now restrict learners to first-hand factual observation and current local emergency, veterinary, welfare, authority and safeguarding reporting. Legal verdicts, diagnostic checklists, confrontation, trespass, intervention, public allegations and promised outcomes were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "welfare-legislation-uk": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: ANIMAL_WELFARE_ACT,
    additionalSourceUrls: [DEFRA_HORSE_WELFARE_CODE, GOV_HORSE_PASSPORT],
    claimReviewed:
      "The complete lesson and all assessments now distinguish legislation, code, policy and rules, label jurisdiction, and require current official passport guidance. Automatic-offence, enforcement, penalty, universal microchip/vaccination, document-inspection and legal-advice claims were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "ethical-training-methods": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HORSE_LEARNING,
    additionalSourceUrls: [WHW_BEHAVIOUR_CHECKLIST],
    claimReviewed:
      "The complete lesson and all assessments now retain high-level learning-term definitions, compassionate welfare principles, factual observation and veterinary/qualified behaviour referral. Pressure, reward, punishment, desensitisation, force, diagnosis and guaranteed-outcome procedures were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "end-of-life-decisions": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_END_OF_LIFE,
    additionalSourceUrls: [BHS_EUTHANASIA, WHW_REHOMING, AAEP_EUTHANASIA],
    claimReviewed:
      "The complete lesson and all assessments now teach advance planning, factual quality-of-life records, veterinarian-led individual assessment, urgent-welfare priority and current authorised rehoming/insurance/aftercare routes. Scores, thresholds, methods, drugs, legal details and learner decisions were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "understanding-horse-behaviour": rewrittenAsPrinciple(
    WHW_BEHAVIOUR_CHECKLIST,
    "The complete lesson and assessments now teach individual contextual observation, neutral behavioural records and veterinary or qualified-behaviour referral. Temperament labels, diagnosis, provocation, punishment and guaranteed interpretations were removed.",
    [WHW_HORSE_LEARNING],
  ),
  "behaviour-around-other-horses": rewrittenAsPrinciple(
    WHW_BEHAVIOUR_CHECKLIST,
    "The complete lesson and assessments now limit learners to authorised group observation and factual sequence records under the current management plan. Universal hierarchy claims, forced introductions, conflict entry and aggression diagnosis were removed.",
    [DEFRA_HORSE_WELFARE_CODE],
  ),
  "recognising-pain-discomfort": rewrittenAsPrinciple(
    WHW_BEHAVIOUR_CHECKLIST,
    "The complete lesson and assessments now treat behavioural checklists only as observation prompts and require stopping plus early veterinary referral. Learner pain scoring, ridden tests, palpation, medication, diagnosis and soundness declarations were removed.",
    [WHW_HEALTH],
  ),
  "welfare-based-decision-making": rewrittenAsPrinciple(
    WHW_FIVE_DOMAINS,
    "The complete lesson and assessments now use welfare domains to organise individual facts and authorised reporting. Checklist verdicts, universal management, legal conclusions, confrontation, trespass and public allegations were removed.",
    [DEFRA_HORSE_WELFARE_CODE, WHW_WORRIED],
  ),
  "basic-tack-identification": rewrittenAsPrinciple(
    BHS_TACK_FIT,
    "The complete lesson and assessments now separate component identification and visible condition reporting from qualified fit and suitability decisions. Universal measurements, learner fitting, repair and uncertain-equipment use were removed.",
    [UKY_EQUIPMENT],
  ),
  "putting-on-a-headcollar": rewrittenAsPrinciple(
    PENN_SAFE_HANDLING,
    "The complete lesson and assessments now require a calm supervised horse-specific approach, escape space and the current yard sequence. Fixed fitting measures, rope wrapping, force, improvised equipment and solo handling of a difficult horse were removed.",
    [UKY_GROUND_SAFETY, MISSISSIPPI_BASIC_SAFETY],
  ),
  "tack-care-cleaning": rewrittenAsPrinciple(
    BHS_TACK_FIT,
    "The complete lesson and assessments now use material-specific manufacturer and owner instructions, condition records and qualified repair referral. Generic chemicals, soaking, heating, structural repair, part substitution and serviceability declarations were removed.",
    [UKY_EQUIPMENT],
  ),
  "fitting-a-saddle": rewrittenAsPrinciple(
    BHS_TACK_FIT,
    "The complete lesson and assessments now reserve saddle fit and alteration for qualified fitters while learners make only visible pre-use and response observations. Fixed clearance rules, pad prescriptions, pain diagnosis and riding to test disputed fit were removed.",
    [UKY_EQUIPMENT],
  ),
  "advanced-equipment-awareness": rewrittenAsPrinciple(
    BHS_TACK_FIT,
    "The complete lesson and assessments now require current purpose, fit, condition, rule and professional authorisation for additional equipment. Stronger-equipment selection, copied adjustments, behaviour control, diagnosis and treatment claims were removed.",
    [BHS_STAGE_2_COACH],
  ),
  "walk-trot-transitions-developing": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now make aids, repetitions, progression and adaptation individual qualified-coach decisions. Universal aid sequences, punishment, biomechanical diagnosis, unsupervised repetition and teaching others were removed.",
    [MISSOURI_SAFE_RIDING],
  ),
  "steering-and-accuracy": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now use current coach-directed routes, traffic awareness, factual observations and welfare-led adaptation. Universal aid formulas, fixed geometry, force, resistance diagnosis and self-coaching through difficulty were removed.",
    [MISSOURI_SAFE_RIDING],
  ),
  "warmup-cooldown-basics": rewrittenAsPrinciple(
    BHS_FITNESS_PROGRAMME,
    "The complete lesson and assessments now require gradual individual coach-led preparation and recovery with contextual observations and professional escalation. Fixed durations, numeric triage cut-offs, fitness diagnosis and forced exercise were removed.",
    [BHS_HOT_WEATHER, WHW_HOT_WEATHER],
  ),
  "preparing-for-a-lesson": rewrittenAsPrinciple(
    BRITISH_EQUESTRIAN_FIRST_LESSON,
    "The complete lesson and assessments now require verified identity, clothing, equipment, horse-rider suitability, area, briefing, supervision and emergency arrangements. Learner fitting, allocation, substitution and unapproved starts were removed.",
    [BHS_TACK_FIT, BHS_STAGE_2_COACH],
  ),
  "reflecting-on-performance": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now separate factual session evidence, participant report and coach feedback, with authorised next steps. Horse blame, causal diagnosis, universal improvement deadlines and unsupervised progression were removed.",
  ),
  "advanced-flatwork-and-collection": rewrittenAsPrinciple(
    BHS_STAGE_4,
    "The complete lesson and assessments now reserve advanced movement terminology, aids, readiness and progression for appropriately qualified coaching. Forced outlines, fixed repetitions, universal aids, movement diagnosis and self-teaching were removed.",
    [BHS_STAGE_2_COACH],
  ),
  "trot-pole-distances-and-grids": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now reserve measurement, construction, helper control, adjustment and progression for the qualified coach. Distance tables, stride formulas, personal pacing, learner setup and unauthorised line entry were removed.",
  ),
  "mucking-out-and-bedding": rewrittenAsPrinciple(
    GOV_KEEPING_HORSES,
    "The complete lesson and assessments now use a current site-specific welfare, material, tool, fire and waste procedure. Universal bedding types, depths and schedules plus learner chemical, contamination and disposal decisions were removed.",
    [BLUE_CROSS_YARD_SAFETY, PENN_FIRE_SAFETY],
  ),
  "stable-routines-and-record-keeping": rewrittenAsPrinciple(
    GOV_KEEPING_HORSES,
    "The complete lesson and assessments now require current individual plans, time-stamped factual records, error transparency and prompt escalation. Universal schedules, copied records, backdating, diagnosis and unauthorised care or medication changes were removed.",
    [DEFRA_HORSE_WELFARE_CODE],
  ),
  "yard-maintenance-and-facilities": rewrittenAsPrinciple(
    HSE_MANAGING_RISK,
    "The complete lesson and assessments now require risk-based inspection, controlled access, competent maintenance and change review. Universal dimensions or intervals and learner structural, electrical, machinery, chemical or compliance decisions were removed.",
    [PENN_FIRE_SAFETY, BLUE_CROSS_YARD_SAFETY],
  ),
  "why-rider-fitness-matters": rewrittenAsPrinciple(
    BHS_RIDER_INTRODUCTION,
    "The complete lesson and assessments now frame rider fitness as individual preparation coordinated with qualified coaching and healthcare. Body judgement, diagnosis, mandatory targets, treatment claims and training through concerning symptoms were removed.",
    [BRITISH_EQUESTRIAN_WELLBEING],
  ),
  "core-exercises-for-riders": rewrittenAsPrinciple(
    BHS_RIDER_INTRODUCTION,
    "The complete lesson and assessments now require individually approved activity and qualified exercise or healthcare direction. Prescribed sets, holds, loads and technique, weakness diagnosis, rehabilitation claims and exercise through pain were removed.",
    [BRITISH_EQUESTRIAN_WELLBEING],
  ),
  "introduction-to-coaching-concepts": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now teach duty of care, welfare, participant-centred communication, risk awareness, feedback and reflective boundaries through observation and simulation. Unsupervised coaching and qualification, clinical or safeguarding-authority claims were removed.",
  ),
  "foundations-of-equestrian-coaching": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now centre qualified planning, participant safety, horse welfare, communication, adaptation, feedback and evaluation. Unsupervised delivery, horse allocation, clinical decisions and qualification claims were removed.",
  ),
  "planning-effective-lessons": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now use risk, aims, equipment, suitability, preparation, adaptable activity, conclusion and evaluation as qualified-review categories. Fixed templates, self-authorised delivery and unassessed progression were removed.",
  ),
  "managing-groups-and-progression": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now require qualified group positioning, consistent expectations, individual adaptation, welfare, feedback and progression. Public ranking, forced progression, punishment, horse swaps and unsupervised instruction were removed.",
  ),
  "stretching-for-riders": rewrittenAsPrinciple(
    BHS_RIDER_INTRODUCTION,
    "The complete lesson and assessments now require individual healthcare-aware approval and comfortable non-forced participation. Fixed holds, ranges and repetitions, partner force, rehabilitation claims and stretching through pain were removed.",
    [BRITISH_EQUESTRIAN_WELLBEING],
  ),
  "overcoming-fear-and-anxiety": rewrittenAsPrinciple(
    NHS_ANXIETY,
    "The complete lesson and assessments now use participant choice, a safe pause, privacy, qualified coaching support and appropriate healthcare referral. Diagnosis, forced exposure, promised cures, pressure to continue and replacement of treatment were removed.",
    [BRITISH_EQUESTRIAN_WELLBEING, NHS_BREATHING],
  ),
  "safeguarding-and-duty-of-care": rewrittenAsPrinciple(
    BRITISH_EQUESTRIAN_SAFEGUARDING,
    "The complete lesson and assessments now require immediate-safety action, calm listening, exact contemporaneous records and prompt reporting through the current safeguarding route. Investigation, leading questions, confrontation, secret promises and learner verdicts were removed.",
  ),
  "inclusive-coaching-adaptive-riding": rewrittenAsPrinciple(
    BHS_STAGE_2_COACH,
    "The complete lesson and assessments now require participant-centred consent, respectful functional questions, competent adaptation, privacy and horse welfare. Medical assumptions, forced assistance, unqualified equipment modification and universal suitability promises were removed.",
  ),
  "grid-work-and-related-distances": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_STAGE_2_COACH,
    additionalSourceUrls: [BHS_STAGE_4],
    claimReviewed:
      "The complete lesson and all assessments now reserve grid and related-distance purpose, measurement, construction, adjustment, progression and incident decisions for an appropriately qualified coach. Universal distances, stride tables, heights, setup recipes, diagnoses and learner-led changes were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "course-awareness-and-planning": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: BHS_PRACTICAL_CPD,
    additionalSourceUrls: [
      BRITISH_SHOWJUMPING_WELFARE,
      BRITISH_EQUESTRIAN_WELFARE,
    ],
    claimReviewed:
      "The complete lesson and all assessments now teach official-information, authorised-observation, venue, surface, obstacle, welfare and incident boundaries. Route, line, pace, stride, course-design, surface-safety and horse-rider suitability decisions remain with current officials and qualified professionals.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "when-to-call-the-vet": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    additionalSourceUrls: [WHW_EMERGENCY],
    claimReviewed:
      "The complete lesson and all assessments now require early veterinary contact for concern and prompt contact in an emergency, with concise factual observations and case-specific direction. Diagnostic checklists, fixed triage thresholds, delayed measurement gathering and generic interim treatment were removed.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "grooming-basics": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: EXTENSION_GROOMING,
    claimReviewed:
      "The complete lesson and assessment were rewritten around source-supported grooming tools, safe supervised handling, factual observation and veterinary or farrier escalation without diagnosis or treatment claims.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "mounting-dismounting": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: RUTGERS_MOUNTING,
    claimReviewed:
      "The complete lesson and assessment retain supervised tack and area checks, controlled mounting and dismounting, and safe stirrup release while removing universal measurements, injury outcomes and unsupervised emergency procedures.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
  "common-equine-ailments": {
    reviewedAt: "2026-08-22",
    reviewedBy: "academy-source-comparison",
    sourceUrl: WHW_HEALTH,
    claimReviewed:
      "The complete lesson and assessment were rewritten as non-diagnostic colic and laminitis awareness, authorised factual observation, stop-work and prompt responsible-person or veterinary escalation without learner treatment or self-triage.",
    outcome: "REWRITTEN_AS_PRINCIPLE",
  },
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
