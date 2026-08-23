import type { LessonUnitData } from "../lessonContent";

type FactualLessonRevision = Pick<
  LessonUnitData,
  | "objectives"
  | "content"
  | "keyPoints"
  | "safetyNote"
  | "practicalApplication"
  | "commonMistakes"
  | "knowledgeCheck"
  | "aiTutorPrompts"
>;

type BoundaryLesson = {
  title: string;
  evidence: string;
  learnerRole: string;
  decisionOwner: string;
  observations: string;
  excluded: string;
  stopAndEscalate: string;
  practice: string;
};

/**
 * Shared teaching structure for the final source-bounded reviews. Every call
 * supplies topic-specific evidence, observations, exclusions and authority.
 * The resulting copy is deliberately procedural about reporting and stopping,
 * but never turns a learner into the relevant clinician, fitter or coach.
 */
function reviewedBoundaryLesson(input: BoundaryLesson): FactualLessonRevision {
  const {
    title,
    evidence,
    learnerRole,
    decisionOwner,
    observations,
    excluded,
    stopAndEscalate,
    practice,
  } = input;

  return {
    objectives: [
      `Explain the evidence boundary for ${title}`,
      `Record relevant facts without exceeding the learner role: ${learnerRole}`,
      `Use the current plan and refer decisions to ${decisionOwner}`,
    ],
    content: `## What this lesson establishes

${evidence} This lesson turns that reviewed material into a safe awareness and communication workflow. The learner role is limited to ${learnerRole}. Completion is not a practical qualification, clinical assessment, fitting approval, coaching licence or authority to change an individual plan.

The central distinction is between an observation and a decision. An observation states what was directly seen, heard, reported or recorded, with the relevant time and context. A decision interprets those facts, selects an intervention or declares something suitable, safe, healthy, fitted or complete. In this topic, those decisions belong to ${decisionOwner}. A confident guess does not become evidence because it is written in a lesson record.

## Prepare from the current plan

Before participating, identify the responsible person, the current written or verbal instruction, the individual horse or participant, the authorised area, equipment and communication route, and the stop or emergency process. Check that the activity is within the learner's assigned role. Conditions, people, horses, equipment and rules can change, so an old routine, internet diagram or memory of another situation is not authority for today's activity.

Do not fill gaps with universal numbers, fixed schedules or assumed cause and effect. If required information, supervision, competence or equipment is missing, pause and ask. A truthful “not known” is safer than an invented answer. Personal information and records must remain in the approved system and be shared only with people who need them for their role.

## Observe and describe

Relevant factual observations for this lesson include ${observations}. Use neutral language: identify the subject, location, time, sequence and visible change. Separate a person's own report from what the learner directly witnessed. Preserve the original wording where it matters and avoid labels about motive, character, diagnosis or blame.

Compare only with an authorised individual baseline or current plan. A checklist can prompt observation, but it cannot prove comfort, fitness, competence, causation or absence of risk. One normal-looking sign does not cancel another concern. Do not provoke a response, repeat a difficult task, manipulate equipment, examine a body area or move closer merely to make the record more complete.

## Keep the decision with the right person

${decisionOwner} reviews the individual facts, current standards and context. The learner supplies an accurate handover and follows the resulting instruction. The learner must not perform or recommend ${excluded}. Those exclusions matter because similar outward facts can have different causes and because an inappropriate intervention can increase risk or conceal a welfare, health, equipment, participation or safeguarding problem.

If advice from two people appears inconsistent, stop and use the named escalation route rather than choosing the instruction that is easiest. Record who made the decision, what was authorised and what was actually done. Do not rewrite the earlier observation after a later explanation becomes available.

## Stop, protect and escalate

${stopAndEscalate} Protect people first, create space where appropriate, keep emergency access clear and contact the responsible route promptly. Do not delay an urgent report to collect extra measurements, images or opinions. Do not promise confidentiality, diagnosis, a particular outcome or a return time that the responsible professional has not given.

After escalation, monitor only what is safe and requested. Follow case-specific instructions; generic treatment, exercise, equipment, confrontation or “try it once more” advice is outside this lesson. If the situation changes, report the new facts rather than assuming the original decision still applies.

## Practise the boundary

${practice} A strong response identifies the evidence source, states only the known facts, names the decision owner, records the instruction and explains what would trigger an immediate stop. A weak response invents a cause, applies a universal rule, acts outside authority or hides uncertainty.

The intended outcome is disciplined participation: prepare, observe, report, follow the authorised decision and preserve a truthful record. That workflow is useful precisely because it respects the limits of written learning and keeps individual judgement with the competent person who can assess the real situation.`,
    keyPoints: [
      `${title} uses current individual context, not a universal recipe`,
      `The learner role is ${learnerRole}`,
      `Decisions remain with ${decisionOwner}`,
      `Record observable facts, source, time, context and instruction without diagnosis or blame`,
      `Missing information, changing conditions or concern requires pausing and escalation`,
    ],
    safetyNote: `${stopAndEscalate} Do not perform or recommend ${excluded}. Stop if supervision, current instructions, suitable equipment or safe conditions are missing, and use the responsible professional or emergency route.`,
    practicalApplication: practice,
    commonMistakes: [
      "Treating a checklist or old routine as proof of safety or suitability",
      "Turning an observation into a diagnosis, motive or promised outcome",
      `Taking a decision that belongs to ${decisionOwner}`,
      "Continuing when authority, information, supervision or conditions are unclear",
      "Editing the original factual record to match a later explanation",
    ],
    knowledgeCheck: [
      {
        question: `What is the learner's role in ${title}?`,
        options: [
          learnerRole,
          `Independently replace ${decisionOwner}`,
          "Apply a universal online procedure",
          "Guarantee the outcome",
        ],
        correctIndex: 0,
        explanation: `The reviewed boundary limits learners to ${learnerRole}; individual decisions remain with ${decisionOwner}.`,
      },
      {
        question: "What should a factual record separate?",
        options: [
          "Direct observation and reported information from interpretation and later decisions",
          "A diagnosis from the professional who might disagree",
          "Private details from the approved system",
          "The easiest instruction from the current plan",
        ],
        correctIndex: 0,
        explanation:
          "A reliable handover preserves sources, timing and facts without converting them into an unsupported conclusion.",
      },
      {
        question:
          "What should happen when required authority or information is missing?",
        options: [
          "Pause and use the current responsible-person or professional escalation route",
          "Copy a procedure from another setting",
          "Continue once to obtain more evidence",
          "Invent a safe default",
        ],
        correctIndex: 0,
        explanation:
          "Uncertainty is recorded and escalated; it is not permission for an unauthorised decision.",
      },
    ],
    aiTutorPrompts: [
      `Quiz me on observation versus decision in ${title}`,
      `Give me a ${title} handover scenario and check that I stay within my role`,
      `Ask me to identify stop points and the correct decision owner for ${title}`,
    ],
  };
}

/**
 * Complete, source-bounded replacements for lessons whose earlier copy mixed
 * reviewed principles with unsupported detail. A revision replaces every
 * learner-facing factual field as one unit; no generated enhancement is added
 * afterwards.
 */
export const FACTUAL_LESSON_REVISIONS: Record<string, FactualLessonRevision> = {
  "parts-of-the-horse": {
    objectives: [
      "Use a reviewed set of external-anatomy terms to describe visible locations on a horse",
      "Distinguish anatomical terms from coat-marking descriptions",
      "Apply safe observation and professional-escalation boundaries while identifying parts",
    ],
    content: `## Purpose and scope

External-anatomy vocabulary gives riders, carers and professionals a shared way to describe a visible location. This lesson uses the external points shown in the University of Kentucky equine-anatomy reference, supported for lower-limb terminology by the University of Calgary Faculty of Veterinary Medicine and for external hoof terms by Cooperative Extension and the British Horse Society. It is a terminology lesson. It does not teach diagnosis, conformation judging, passport completion, treatment or a hands-on clinical examination.

## Head, neck and body

At the head, the **poll** is between the ears. The **forelock** falls forward from that area. The **cheek**, **jaw**, **chin**, **lips**, **muzzle** and **throat** are useful visible-location terms. The **crest** follows the top of the neck towards the **withers**. Along the body, the reviewed reference identifies the **shoulder**, **back**, **loin**, **barrel**, **flank**, **croup** and **dock**. The dock is the tail-root area. These names help a learner point to a location accurately; they do not establish what a change at that location means.

## Forelimb, hindlimb and hoof terms

Visible forelimb terms include the **elbow**, **knee or carpus**, **cannon**, **fetlock**, **pastern**, **coronary band** and **hoof**. Visible hindlimb terms include the **point of hip**, **stifle**, **gaskin**, **hock**, cannon, fetlock, pastern and hoof. The University of Calgary anatomy material uses the stifle as the horse's knee in comparative discussion; the joint commonly called the foreleg knee is the carpus. This comparison is only a memory aid for location and must not be used to infer injury or function.

The external hoof includes the **wall**, **sole** and **frog**. Reviewed hoof guidance places the coronary band or coronet at the junction between skin and hoof wall and describes it as the area from which new hoof wall grows. That supports the vocabulary only. A learner must not predict an outcome from the appearance of the coronary band or decide that an injury is minor, permanent or safe to manage without professional assessment.

## Anatomy terms and markings

An anatomical term names a body location. A marking describes a visible coat pattern. Descriptions such as star, stripe, snip, blaze, sock and stocking may be useful when distinguishing horses, but official identification and passport requirements depend on the current authority and jurisdiction. Do not complete or alter an official record from this lesson alone.

## Safe observation

Penn State Extension advises a calm, slow approach from the front towards the shoulder, speaking so the horse is aware of the handler, avoiding the rear and standing beside rather than directly in front of or behind the horse. Follow the responsible person's instructions for the individual horse and environment. Observe from a safe position without independently lifting limbs, palpating tissue or carrying out a health check. If the horse moves away, becomes tense, appears uncomfortable or the situation feels unsafe, stop, create space and tell the responsible person. A concerning change belongs with a veterinarian, farrier or other appropriately qualified professional.

## Communicating a factual observation

A useful report separates location from interpretation. For example: “There is a visible change on the outside of the left fore pastern” records where and what was seen. “The tendon is damaged” would be an unsupported diagnosis. Record the time, side and visible observation only when authorised, then use the current yard and professional escalation route. Clear terminology supports communication; it never replaces professional judgement.`,
    keyPoints: [
      "External-anatomy terms identify visible locations; they do not diagnose a condition",
      "The reviewed vocabulary includes poll, withers, shoulder, back, loin, croup, dock, cannon, fetlock, pastern, stifle and hock",
      "Hoof wall, sole, frog and coronary band are external hoof terms",
      "Anatomical points and coat markings serve different descriptive purposes",
      "Approach and observe only within the responsible person's safe procedure, then escalate concerns",
    ],
    safetyNote:
      "Use this lesson for supervised visual identification only. Approach slowly from the front towards the shoulder, avoid standing directly in front of or behind the horse, and stop if the horse or situation becomes unsafe. Do not lift a limb, examine an injury, diagnose, treat or alter an official identification record from this material; use the responsible-person, veterinarian, farrier and current-authority route.",
    practicalApplication:
      "Using an instructor-approved photograph or a calm horse observed from a safe position, identify ten reviewed external terms without touching the horse. Then write one factual location statement that avoids diagnosis, and explain who should receive it if the observation were a real concern.",
    commonMistakes: [
      "Turning a location term into a diagnosis or prognosis",
      "Standing directly behind or in front of the horse to point out a part",
      "Treating the foreleg knee and hindlimb stifle as the same visible joint",
      "Confusing a coat marking with an anatomical structure",
      "Assuming a lesson can replace current passport or identification guidance",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the main purpose of external-anatomy vocabulary in this lesson?",
        options: [
          "To describe a visible location clearly",
          "To diagnose the cause of swelling",
          "To decide whether an injury is permanent",
          "To complete every jurisdiction's passport record",
        ],
        correctIndex: 0,
        explanation:
          "The reviewed terms provide a shared description of location. Diagnosis, prognosis and official identification decisions need the appropriate professional or current authority.",
      },
      {
        question: "Which group contains only reviewed external hoof terms?",
        options: [
          "Wall, sole, frog and coronary band",
          "Croup, dock, cheek and throat",
          "Saddle, girth, bridle and bit",
          "Star, stripe, sock and stocking",
        ],
        correctIndex: 0,
        explanation:
          "Wall, sole, frog and coronary band are external hoof terms. The other choices describe body locations, equipment or coat markings.",
      },
      {
        question:
          "A learner notices a visible change near a horse's pastern. What is the correct response?",
        options: [
          "Record the factual location if authorised and report it through the current responsible-person or professional route",
          "Diagnose a tendon injury from the location",
          "Lift the limb and test it without instruction",
          "Promise that the change will resolve on its own",
        ],
        correctIndex: 0,
        explanation:
          "The learner may make a factual, authorised observation but must not diagnose, examine independently or predict the outcome.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on reviewed external-anatomy locations without adding clinical claims",
      "Help me distinguish anatomical terms from coat markings",
      "Practise turning an observation into a factual, non-diagnostic report",
    ],
  },

  "rider-position-basics": {
    objectives: [
      "Describe balance alignment as coach-reviewed guidance rather than a universal fixed shape",
      "Explain how stirrup and footwear choices affect basic riding safety",
      "Use feedback from the individual horse-rider-tack combination to decide when to stop and seek help",
    ],
    content: `## A balanced starting point

Rider position is not a rigid pose. It is an adaptable starting point that a qualified coach checks for the individual rider, horse, saddle and activity. The American Quarter Horse Association describes an ear–shoulder–hip–heel line as a useful balance reference, while also explaining that stirrup length varies with the rider, horse, saddle, activity and discipline. The University of Missouri Extension likewise treats position together with suitable tack, footwear, stirrups, horse, setting and assistance. This lesson therefore teaches observation and communication, not a universal measurement or a self-correction formula.

## Alignment as a reference

From the side, a coach may compare the rider's ear, shoulder, hip and heel to consider whether the rider is balanced over the saddle. The line is a visual reference, not proof that a rider is safe, comfortable or biomechanically identical to somebody else. Body proportions, mobility, saddle design, the horse's shape and the current activity can all affect what is appropriate. Avoid forcing a body part into a copied position. Tell the coach about pain, numbness, instability or difficulty following the horse's movement.

The rider's head and eyes should support awareness of the route and surroundings. Shoulders and arms should remain free enough to follow the coached task. The seat and legs should not be held through strain or a fixed grip. These are practical prompts for coach observation, not medical or performance guarantees.

## Stirrups, feet and equipment

Reviewed Extension guidance supports boots and stirrups that fit, with the ball of the foot over the tread and the heel lower than the toe for most riding. It also warns against equipment that secures a rider to the saddle. A coach or other competent person should check stirrup length and safe release for the actual rider, boot and stirrup. Arm-length checks can be rough starting estimates only; they are not a mounted fit decision.

Before riding, use the facility's current tack and equipment check. Do not ride with worn, damaged or unsuitable equipment. A correctly selected and inspected riding helmet and activity-appropriate footwear form part of the safety context. Current standards and discipline rules must be checked with the relevant governing body, manufacturer and qualified person rather than copied from a general lesson.

## Coach-led adjustment

Make one coach-agreed adjustment at a time and observe the effect. Useful factual feedback includes whether a stirrup repeatedly shifts, a boot catches, the rider feels uneven, or balance is lost during a specific transition. Do not infer that one body feature causes a horse's behaviour or discomfort. If the horse appears uncomfortable, the rider feels unsafe, or equipment fit is in doubt, stop and use the appropriate coach, tack fitter, healthcare or veterinary route.

## Reflection without self-diagnosis

After an authorised session, compare the intended task with what happened: Was the rider able to look ahead? Did both feet remain able to release? Could the rider follow the coach's instruction without pain or loss of control? Record neutral observations and one coach-agreed next step. Do not prescribe fixed no-stirrup work, stretching, strength exercises or repetition targets from this lesson; those choices depend on the individual and suitable professional guidance.`,
    keyPoints: [
      "Ear–shoulder–hip–heel is a coach-reviewed balance reference, not a universal fixed rule",
      "Stirrup length and fit depend on the rider, horse, saddle, footwear, activity and discipline",
      "For most riding, reviewed guidance places the ball of the foot over the tread with the heel lower than the toe",
      "Equipment must allow safe release and must not secure the rider to the saddle",
      "Pain, instability, horse discomfort or doubtful equipment fit requires a stop and appropriate escalation",
    ],
    safetyNote:
      "Practise only with a suitable horse, inspected tack and rider equipment, and qualified supervision. Do not force alignment, change equipment beyond your authority, use apparatus that secures the rider to the saddle, or copy a fixed exercise programme. Stop for pain, instability, horse discomfort, damaged equipment or loss of safe control.",
    practicalApplication:
      "With a qualified coach, review a still image or an authorised halt from the side. Use the alignment reference to make one neutral observation, confirm that footwear and stirrups allow safe release, and record one coach-agreed adjustment without diagnosing the rider or horse.",
    commonMistakes: [
      "Treating a visual alignment reference as an identical rule for every rider and saddle",
      "Using an arm-length estimate as a final mounted stirrup-fit decision",
      "Forcing the heel or another joint into position through pain or strain",
      "Changing several position or equipment factors at once",
      "Claiming that rider position alone diagnoses the cause of a horse's behaviour",
    ],
    knowledgeCheck: [
      {
        question: "How should the ear–shoulder–hip–heel line be used?",
        options: [
          "As a coach-reviewed balance reference for the individual combination",
          "As proof that every rider must hold an identical pose",
          "As a medical assessment of the rider",
          "As a guarantee of the horse's comfort",
        ],
        correctIndex: 0,
        explanation:
          "The line is a useful visual reference, but suitability depends on the rider, horse, saddle, activity and qualified observation.",
      },
      {
        question: "What determines an appropriate stirrup setup?",
        options: [
          "The rider, horse, saddle, footwear, activity and competent mounted check",
          "One universal arm-length measurement",
          "The rider's height alone",
          "A fixed setting copied from another saddle",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance treats arm length only as a rough start and requires adjustment for the actual combination and activity.",
      },
      {
        question:
          "What should happen if a rider feels pain or unsafe instability?",
        options: [
          "Stop and tell the qualified coach or appropriate professional",
          "Force the position until it looks correct",
          "Remove both stirrups and continue without approval",
          "Assume the horse is causing the problem",
        ],
        correctIndex: 0,
        explanation:
          "Pain and unsafe instability are stop points. They require individual assessment rather than a generic exercise or diagnosis.",
      },
    ],
    aiTutorPrompts: [
      "Help me describe rider alignment as an observation rather than a fixed prescription",
      "Quiz me on basic stirrup and footwear safety boundaries",
      "Give me a scenario where I should stop and ask a qualified coach for help",
    ],
  },

  "warmup-cooldown": {
    objectives: [
      "Explain why preparation and recovery must be individual rather than governed by fixed universal timings",
      "Describe a qualified coach's progressive warm-up and cool-down principles",
      "Recognise stop points and use current heat, welfare and professional procedures",
    ],
    content: `## Individual preparation, not a copied clock

A warm-up prepares the individual horse and rider for the planned work; a cool-down reduces effort progressively and supports observation after exercise. British Horse Society fitness guidance says there are no rigid rules because fitness, age, temperament, current condition, weather, ground and the work itself differ. This lesson therefore gives decision principles, not fixed minutes, pace counts, heart-rate targets or a diagnosis of readiness.

Before starting, the responsible rider and qualified coach should consider the horse's current plan, recent work, observed comfort, surface, weather, tack and the rider's ability. Check the riding area and equipment under the facility's procedure. If the horse appears unwell, uncomfortable or unsound, or the surface or weather makes the plan unsuitable, do not use a warm-up to “test” the concern. Stop and use the current responsible-person and veterinary route.

## Progressive warm-up

Reviewed guidance supports beginning with easy movement such as walking and then, where appropriate for the individual plan, introducing trotting and dynamic movement. The qualified coach chooses the sequence and observes rhythm, balance, behaviour and response. The purpose is gradual preparation, not fatigue or proof that the horse is fit. A copied routine may be too much, too little or inappropriate for the combination.

During the warm-up, report neutral observations: a change in rhythm, reluctance to move forward, unusual behaviour, unevenness noticed by the coach, tack movement or rider instability. Do not diagnose a muscle, tendon, respiratory or behavioural condition from those observations. The coach or responsible person decides whether to simplify, stop or seek appropriate professional advice.

## Progressive cool-down

At the end of authorised work, reduce effort through the paces according to the individual plan and qualified direction. Reviewed guidance supports walking while recovery is observed and allowing an appropriate stretch where safe. Recovery must be judged in context; this lesson does not provide a fixed respiration threshold, waiting period or universal return-to-stable rule. Continue to follow the horse's written aftercare plan, including tack removal, water access and any current professional directions.

Record what was actually observed rather than declaring the horse “fully recovered.” Useful notes include the work completed, weather and surface, changes noticed, when the responsible person was told and what authorised decision followed. These records help the qualified team adjust later sessions.

## Heat and active cooling

British Horse Society and World Horse Welfare hot-weather guidance supports reducing pace or duration, providing breaks, shade and recovery time, offering water and monitoring sweating, breathing, temperature, behaviour and performance. If heat-related concern develops, stop work, begin the current approved cooling procedure and seek responsible-person or veterinary help. Reviewed guidance supports using cool water over the body to assist cooling; old blanket warnings against cool water must not override current professional instructions.

The individual emergency and cooling plan determines safe location, water application, movement and escalation. A learner must not delay help to collect extra measurements, force a horse to continue walking or copy an internet cooling schedule. People should also consider their own heat safety and the facility's emergency arrangements.

## A useful reflection

After the session, ask whether the chosen work matched the current plan, whether horse and rider remained comfortable and controlled, which factual changes were observed and whether the stop/escalation boundary was followed. Discuss one qualified adjustment for next time. The aim is a responsive process that protects welfare, not completion of a fixed checklist.`,
    keyPoints: [
      "Warm-up and cool-down planning is individual; reviewed guidance explicitly rejects rigid universal rules",
      "Preparation begins progressively and the qualified coach chooses the sequence for the horse, rider, work and conditions",
      "Cool-down reduces effort progressively while recovery is observed in context",
      "Hot-weather plans may require less work, breaks, shade, water and active cooling with cool water",
      "Concern about health, comfort, recovery, heat or safety is a stop-and-escalate decision, not a self-diagnosis task",
    ],
    safetyNote:
      "Follow the individual horse's current fitness, aftercare and emergency plans under qualified supervision. Do not use fixed timings or thresholds, continue work to test a concern, diagnose from recovery signs, or delay escalation. In heat, stop for concern and follow current active-cooling, responsible-person and veterinary instructions.",
    practicalApplication:
      "Given an instructor-approved fictional session and weather description, identify the factors a qualified coach must consider, outline a progressive start and finish without adding times, and mark the observations that require stopping or escalation.",
    commonMistakes: [
      "Copying a fixed number of minutes for every horse and session",
      "Using warm-up movement to test suspected pain or unsoundness",
      "Treating one recovery observation as a diagnosis or universal threshold",
      "Following outdated blanket advice that prevents appropriate cool-water cooling",
      "Recording a conclusion such as fully recovered instead of factual observations",
    ],
    knowledgeCheck: [
      {
        question: "Why does this lesson avoid a fixed warm-up duration?",
        options: [
          "Because the horse, rider, work, fitness, ground and weather require an individual qualified plan",
          "Because warm-up has no purpose",
          "Because every horse should begin at the fastest pace",
          "Because only competition horses need preparation",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed fitness guidance explicitly says there are no rigid rules and requires individualisation to the current combination and conditions.",
      },
      {
        question: "What is a safe cool-down principle?",
        options: [
          "Reduce effort progressively and observe recovery within the current individual plan",
          "Use one universal respiration threshold",
          "Keep working until a copied time has elapsed despite concern",
          "Declare recovery from a single observation",
        ],
        correctIndex: 0,
        explanation:
          "Progressive reduction and contextual observation are supported; fixed thresholds and self-triage are not.",
      },
      {
        question:
          "What should happen if heat-related concern develops during work?",
        options: [
          "Stop, follow the current approved cooling procedure and escalate to the responsible person or veterinarian",
          "Delay action until several measurements are collected",
          "Avoid cool water in every circumstance",
          "Continue at the same pace to maintain circulation",
        ],
        correctIndex: 0,
        explanation:
          "Current reviewed guidance supports stopping, cooling—including cool water where directed—and prompt professional escalation.",
      },
    ],
    aiTutorPrompts: [
      "Help me plan an individual warm-up without inventing fixed timings",
      "Quiz me on the difference between factual recovery observations and diagnosis",
      "Give me a hot-weather scenario and ask where the stop and escalation points are",
    ],
  },

  "lesson-preparation": {
    objectives: [
      "Use a current pre-ride preparation process without relying on copied fitting measurements",
      "Distinguish a learner equipment observation from a qualified tack-fit decision",
      "Identify preparation stop points involving horse, rider, equipment, environment or authority",
    ],
    content: `## Preparation is a decision process

Lesson preparation brings together the horse, rider, tack, protective equipment, environment and the coach's plan. It is not a promise that a session will be safe, and it is not a substitute for qualified saddle, bridle, health or facility assessment. British Horse Society tack guidance says correct fit is important, saddles require checks by a qualified fitter and bridle fit should be checked whenever the horse is tacked up. University of Kentucky and University of Missouri Extension guidance supports routine equipment inspection, suitable boots and stirrups, an appropriate inspected helmet and professional instruction.

## Confirm the current plan and authority

Before handling equipment, confirm which horse, rider, activity and responsible person the session involves. Read the facility's current lesson, horse-care and emergency instructions. Ask what the learner is authorised to do and which tasks require a competent person. Changes in the horse's condition, rider's needs, weather, surface, staffing or activity may require a different plan or cancellation.

The coach is responsible for judging the suitability of the horse-rider combination and the intended exercise within their professional scope. A learner should share relevant factual information, such as pain, fear, unfamiliarity with equipment or a damaged item, rather than hiding it to keep the lesson going.

## Observe equipment without inventing a fit rule

Use the current inspection procedure to look for damage, excessive wear, missing parts, contamination or an item that is not the one authorised for the horse or rider. Do not use a general lesson to repair tack, select a different bit, change a saddle, tighten a noseband to a copied gap or decide that a saddle fits. Manufacturer instructions, qualified fitters, the responsible person and current discipline rules govern those decisions.

Bridle components should be present, correctly assembled and reviewed for the individual horse under competent direction. Saddle and girth choice and placement require the horse-specific plan and qualified checks. A clean saddle cloth or pad must be the authorised item and positioned under the current procedure; this lesson does not state a universal placement measurement.

Rider equipment also needs an individual check. Footwear and stirrups must work together so the foot can release. The helmet must be the correct activity-appropriate item, fitted and inspected under current standards and competent guidance. Do not claim a helmet, boot or body protector is compliant from appearance alone.

## Horse and environment readiness

Approach and handle the horse under the current individual procedure. Record visible changes without diagnosing them. If the horse appears uncomfortable, behaviour differs from the known baseline, tack contact causes concern or the horse cannot be handled safely, stop and tell the responsible person. Veterinary, dental, farriery, tack-fitting or behaviour expertise may be required depending on the concern.

Check that the mounting and working area is available, appropriately supervised and free from a hazard the learner is authorised to address. Weather, footing, other users, gates and emergency access all affect readiness. The responsible person decides whether the environment is suitable.

## Handover and final confirmation

Before mounting, the qualified coach should confirm the plan, horse, rider, tack, equipment, area and assistance. A useful handover states what was checked, what changed and what remains for a qualified person. “No visible damage found under today's authorised check” is factual; “the saddle definitely fits” is an unsupported conclusion unless made by the appropriate qualified person. If any required check is incomplete, do not treat the checklist as permission to proceed.`,
    keyPoints: [
      "Preparation combines the current plan, horse, rider, tack, protective equipment, environment and supervision",
      "Saddle fit requires a qualified fitter and bridle fit requires an individual check whenever tacking up",
      "Routine inspection can identify visible damage but does not authorise repair or prove fit",
      "Rider footwear, stirrups and helmet require compatible, current and competent checks",
      "An incomplete check or concern is a stop-and-escalate result, not permission to continue",
    ],
    safetyNote:
      "Prepare only within your authority and under qualified instruction. Do not repair, substitute or refit tack from generic guidance; do not claim equipment compliance from appearance. Stop for visible damage, uncertain fit, horse discomfort, rider pain or fear, unsafe handling, unsuitable footing or incomplete supervision and use the current responsible-person or professional route.",
    practicalApplication:
      "Using instructor-provided photographs and a fictional lesson plan, complete a preparation handover that separates visible observations from qualified fit decisions. Identify the responsible person or professional for each unresolved item and state whether the session may proceed.",
    commonMistakes: [
      "Treating a checklist as a guarantee of safety",
      "Using copied finger, hand or wrinkle measurements as universal tack-fit rules",
      "Repairing or substituting equipment without authority",
      "Ignoring rider pain, fear or unfamiliarity during preparation",
      "Saying an item fits when only a visual damage check was completed",
    ],
    knowledgeCheck: [
      {
        question: "Who should make the individual saddle-fit decision?",
        options: [
          "An appropriately qualified saddle fitter within the current horse-specific process",
          "Any learner using a copied measurement",
          "The rider based only on saddle colour",
          "A generic online checklist",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance requires qualified saddle-fit checks; a learner inspection cannot prove fit.",
      },
      {
        question:
          "What may a learner safely report during an authorised equipment inspection?",
        options: [
          "A factual observation such as visible cracking or a missing part",
          "A diagnosis that the saddle causes back pain",
          "A guarantee that a helmet meets every current standard",
          "A decision to repair tack without permission",
        ],
        correctIndex: 0,
        explanation:
          "Visible observations support escalation. Diagnosis, compliance decisions and repairs require the appropriate authority or professional.",
      },
      {
        question: "What does an incomplete required check mean?",
        options: [
          "The session must not proceed until the responsible person resolves it",
          "The learner may assume the missing check would pass",
          "The check can be replaced by a fixed time limit",
          "The horse should be mounted to test the equipment",
        ],
        correctIndex: 0,
        explanation:
          "Preparation is fail-closed: missing or unresolved checks are not permission to continue.",
      },
    ],
    aiTutorPrompts: [
      "Give me a preparation scenario and ask which observations need qualified escalation",
      "Help me distinguish equipment inspection from tack fitting",
      "Quiz me on fail-closed lesson preparation decisions",
    ],
  },

  "leading-safely": {
    objectives: [
      "Describe reviewed lead-rope, handler-position and turning principles",
      "Apply current gate and doorway procedures without inventing universal distances or force methods",
      "Recognise when to release, stop or escalate rather than trying to overpower a horse",
    ],
    content: `## Scope and supervision

Leading is a practical handling skill that must be taught with a suitable horse, correctly fitted authorised equipment, a safe environment and competent supervision. University of Missouri Extension and Mississippi State University Extension support walking beside the shoulder, holding excess lead rope in folds rather than wrapping it around the hand, turning the horse away from the handler and using proper protective footwear. University of Kentucky guidance supports handler safety over attempting to hold a horse that becomes unmanageable. This lesson does not teach chain use, force, striking, road positioning or management of a dangerous horse.

## Prepare before moving

Follow the responsible person's procedure for approaching, fitting or checking the halter or headcollar and attaching the authorised lead rope. Do not improvise equipment or use a control device without specific competent instruction and authority. Wear footwear suitable for the environment and task. Gloves, helmet or other protective equipment may be required by the current risk assessment.

Look at the intended route before setting off. Check gates, doors, people, other horses, vehicles, loose equipment, footing and the destination. Decide with the responsible person who will open and close barriers. Keep an exit route for people and do not enter a confined or hazardous area simply because the horse has started moving.

## Position and rope handling

Walk alongside the horse near the shoulder as taught for that individual horse and facility. Maintain an appropriate space without standing directly in front of the horse or drifting behind the shoulder. Hold the lead rope so it can be adjusted and released; fold excess rope rather than winding it around a hand, wrist or body. Never attach the handler to the horse.

Use calm, current cues taught by the competent handler. This lesson does not prescribe a rope length, hand position, pressure sequence or correction for every horse. Observe the horse and surroundings while keeping attention on the route. If control deteriorates, do not wrap the rope tighter or try to win a contest of strength.

## Turns, doors and gates

Reviewed guidance supports turning the horse away from the handler so the person is not crowded by the horse's body. The exact turn and spacing depend on the area and individual procedure. At a doorway or gate, use the facility's trained method, keep clear of posts, latches and narrowing space, and move fully through before completing the next authorised step.

For turnout release, reviewed guidance supports leading fully through the entry, turning the horse back towards the gate or entry direction, securing the barrier as the procedure requires, releasing and moving clear. The responsible person determines the sequence and whether another handler is needed. Do not copy this description into an unfamiliar facility or use it without practical instruction.

## When control or safety changes

If the horse surges, pulls away, becomes frightened or threatens safety, protect people and follow the current emergency procedure. University of Kentucky guidance says not to risk serious injury by holding a changing horse; it can be caught again. Whether and when to release depends on the immediate hazard, containment, roads, people and the trained incident plan. A learner must not chase, corner, punish or independently recapture the horse.

Stop and escalate if equipment fails, the route becomes unsafe, the horse cannot be handled within the plan, or the learner is unsure. Dangerous or unfamiliar behaviour belongs with the responsible person and an appropriately qualified handler, behaviour professional or veterinarian as relevant. Record the factual event without claiming a behavioural or medical diagnosis.

## Review

After an authorised leading exercise, review whether the route was checked, excess rope stayed folded, the handler remained in the taught position, turns created space, barriers were managed by the planned person and stop points were respected. One competent correction practised safely is more useful than a collection of unsupervised techniques.`,
    keyPoints: [
      "Lead beside the shoulder in the position taught for the individual horse and facility",
      "Fold excess lead rope; never wrap or attach it around the hand, wrist or body",
      "Turn the horse away from the handler and use the current doorway or gate procedure",
      "Turnout release requires a planned, supervised sequence and a clear escape route",
      "Do not risk serious injury by trying to overpower an unmanageable horse; follow the emergency plan and escalate",
    ],
    safetyNote:
      "Practise only with a suitable horse, authorised equipment, proper footwear, a checked route and competent supervision. Never wrap the rope around any part of the body or attach yourself to the horse. Do not use chains, force, punishment, road procedures or difficult-horse techniques from generic material. Stop or release only under the current incident plan and prioritise people's safety.",
    practicalApplication:
      "With a competent instructor and an approved calm horse, rehearse the route and barrier roles before moving. Demonstrate folded-rope handling, the taught shoulder position and one turn away from the handler, then explain the exact stop and escalation points for that setting.",
    commonMistakes: [
      "Wrapping the lead rope around a hand or body",
      "Walking directly in front of the horse or drifting into a kick-risk position",
      "Turning the horse into the handler's space",
      "Entering a doorway or gate without a barrier and escape plan",
      "Trying to overpower, chase or punish a horse when control is lost",
    ],
    knowledgeCheck: [
      {
        question: "How should excess lead rope be held?",
        options: [
          "In folds that can be adjusted or released",
          "Wrapped tightly around the hand",
          "Looped around the waist",
          "Tied to the handler's clothing",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed Extension guidance says excess rope should be folded rather than wrapped; the handler must never be attached to the horse.",
      },
      {
        question: "What is the reviewed turning principle?",
        options: [
          "Turn the horse away from the handler under the current supervised procedure",
          "Pull the horse into the handler's space",
          "Use the same fixed circle in every doorway",
          "Stand directly in front and push the horse backwards",
        ],
        correctIndex: 0,
        explanation:
          "Turning away protects the handler's space, while the exact method depends on the horse and environment.",
      },
      {
        question: "What should a learner do when a horse becomes unmanageable?",
        options: [
          "Prioritise people, follow the current incident plan and escalate to the responsible qualified handler",
          "Wrap the rope tighter and use body weight",
          "Chase the horse immediately if it gets loose",
          "Apply an unfamiliar chain or force method",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance prioritises avoiding serious injury. Containment, release and recapture decisions belong to the trained incident procedure.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on folded lead-rope handling and safe positioning",
      "Give me a gate scenario and ask which roles must be planned before moving",
      "Help me identify when leading must stop and be escalated",
    ],
  },

  "yard-hazard-awareness": {
    objectives: [
      "Identify factual yard hazards without making unsupported risk or legal conclusions",
      "Explain reviewed fire-prevention, housekeeping, chemical and electrical controls",
      "Use the current site emergency plan and competent escalation route",
    ],
    content: `## Hazard awareness has a local context

A hazard is something with the potential to cause harm. Risk depends on who or what may be exposed, the circumstances and the controls already in place. This lesson supports factual observation and the current yard process; it does not provide a universal legal inspection, declare a premises safe or unsafe, or authorise a learner to repair, isolate or investigate specialist equipment.

Blue Cross yard-safety guidance and Penn State Extension fire-safety guidance support prevention, good housekeeping, suitable storage, electrical attention and a documented emergency plan. The responsible person must combine those principles with current law, fire-service advice, insurer requirements, product instructions and the actual premises.

## Fire prevention and combustible material

Prevention is the primary protection. Reviewed guidance supports no-smoking controls, removal of accumulated dust, cobwebs and discarded bedding, and appropriate storage of hay, bedding, fuel and other combustible material. Heat and ignition sources, electrical equipment, machinery and charging devices must be managed under the current site procedure.

Do not invent a universal storage distance, service interval or fire-size rule. A competent person determines building separation, electrical inspection, fire detection, extinguishers, access and evacuation controls for the premises. A learner may report a factual condition—such as a blocked exit or damaged cable—but must not energise, repair or test an electrical system.

## Walkways, gates and working areas

Reviewed guidance supports keeping walkways clear and using doors and gates in a way that does not create a collision or trapping hazard. Observe footing, weather, lighting, tools, hoses, vehicles, machinery, stored items and horse access. Follow the responsible person's priority and authority rules before moving anything. Some objects may be evidence of an incident, chemically contaminated, electrically live or needed for emergency access.

Horse and human routes should be considered together. Do not assume that an open gate, loose horse or frightened horse can be managed by a generic technique. Use the current containment and emergency plan and keep people out of danger.

## Chemicals, medicines and electricity

Medicines and chemicals should be securely stored and used only by authorised people. Product labels, safety data, veterinary or prescriber directions and competent advice govern identity, protective equipment, handling, mixing, disposal and spill response. A learner should not smell, taste, combine or decant an unknown substance. Isolate the area only if the current procedure allows this without exposure, then report it.

Electrical cables and equipment must be protected from horses, damage and water under the premises plan. Do not touch exposed conductors, enter water near electricity or attempt a repair. Keep others away if this can be done safely and contact the responsible person or emergency service required by the site procedure.

## Emergency response

Blue Cross guidance directs people to alert the fire service, keep emergency access clear, follow the evacuation plan and prioritise human and then animal life. A frightened loose horse may return to a stable, so improvising release can increase danger. Horse evacuation is undertaken only when the trained incident lead judges it safe and directs the current plan.

Do not attempt firefighting from this lesson. The premises plan and trained responders determine whether any immediately containable fire may be approached with suitable equipment. If there is doubt, raise the alarm, leave by the safe route, go to the assembly point and follow emergency-service instructions.

## Report, control and review

Use factual language: location, time, what was seen or smelled, who may be exposed and what immediate authorised control was used. Avoid conclusions such as “the wiring caused the fire” unless established by a competent investigation. Record and review according to the current site, legal and insurer process. Changed circumstances, an incident or a near miss may require a responsible-person review rather than a fixed calendar interval.`,
    keyPoints: [
      "Fire prevention, housekeeping, safe storage and a documented emergency plan are reviewed yard-safety principles",
      "Keep routes and emergency access clear under the current premises procedure",
      "Chemicals, medicines and electrical systems require authorised handling and competent guidance",
      "Raise the alarm and follow the evacuation plan; do not improvise horse release or firefighting",
      "Report factual observations and let authorised people make technical, legal and causal decisions",
    ],
    safetyNote:
      "Do not repair electrical equipment, handle unknown substances, fight a fire, release horses or enter a hazardous area from this lesson. Raise the alarm, protect people, follow the current premises evacuation and incident plan, keep emergency access clear and obey the responsible incident lead or emergency services.",
    practicalApplication:
      "Using an instructor-created yard diagram, identify visible hazards, state the factual observation, choose only an authorised immediate control and name the responsible competent route. Include one fire, one chemical or medicine, one electrical and one access scenario.",
    commonMistakes: [
      "Declaring a premises legally compliant from a general checklist",
      "Using invented universal inspection or storage intervals",
      "Touching damaged electrical equipment or an unknown substance",
      "Releasing horses or attempting firefighting without incident-lead direction",
      "Reporting an assumed cause instead of a factual observation",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the primary reviewed fire-safety principle for a horse yard?",
        options: [
          "Prevent ignition and fuel build-up through current premises controls",
          "Release every horse as soon as smoke is seen",
          "Use one universal distance for all hay stores",
          "Let learners repair damaged wiring immediately",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance prioritises prevention; evacuation, storage and specialist systems must follow the actual premises plan and competent advice.",
      },
      {
        question:
          "What should a learner do with an unknown leaking chemical container?",
        options: [
          "Keep clear, prevent exposure if safely authorised and report through the current procedure",
          "Open it to identify the smell",
          "Mix it with water",
          "Move it by hand without checking the label or plan",
        ],
        correctIndex: 0,
        explanation:
          "Identity, protective equipment and spill response come from labels, safety data and authorised competent direction.",
      },
      {
        question: "What is the correct response to a fire alarm?",
        options: [
          "Follow the current evacuation plan and incident-lead or emergency-service instructions",
          "Improvise a horse-release route",
          "Return for personal equipment",
          "Decide from this lesson whether the fire is small enough to fight",
        ],
        correctIndex: 0,
        explanation:
          "The current site plan and trained responders govern evacuation and any firefighting decision; human safety comes first.",
      },
    ],
    aiTutorPrompts: [
      "Give me a yard-hazard scenario and ask for a factual report",
      "Quiz me on fire evacuation boundaries without inventing local rules",
      "Help me separate an authorised immediate control from specialist repair",
    ],
  },

  "risk-incident-awareness": {
    objectives: [
      "Distinguish a hazard, a risk and a factual incident observation in a current workplace process",
      "Describe the reviewed identify-assess-control-record-review sequence without inventing legal duties",
      "Escalate emergencies, incidents and near misses through the authorised route",
    ],
    content: `## A bounded workplace example

The United Kingdom Health and Safety Executive describes risk management as identifying hazards, assessing risks, controlling risks, recording significant findings where required and reviewing controls. This lesson uses that sequence as a clearly labelled UK workplace example. It is not legal advice, does not apply one jurisdiction's rules everywhere and does not authorise a learner to create, alter or submit a formal employer, insurer or regulator record.

A **hazard** has the potential to cause harm. **Risk** considers the likelihood and possible severity of harm in the actual circumstances and with current controls. An **incident** is an event; a **near miss** is an event that did not cause harm but could still provide useful information. Exact definitions, record categories and reporting routes come from the current organisation and applicable authority.

## Identify and assess

Start with facts: the location, task, people or animals present, equipment, environment and what was observed. Avoid diagnosing a horse, person or system and avoid declaring fault. The responsible competent person assesses who may be harmed, how exposure could occur, which controls already exist and whether more is needed.

A learner can contribute first-hand information and follow an authorised immediate control, such as stopping a task or keeping people away, when the current plan permits. They should not perform a technical investigation, interview people informally, move evidence, test equipment or decide that work may restart.

## Control and record

Controls should be selected by the responsible person using the current risk assessment, law, insurer terms, manufacturer instructions and professional advice. A copied checklist does not establish that a control is sufficient. If the situation changes, stop and seek review rather than adapting a high-risk task independently.

Records should separate observations from conclusions. Include the time, place, task, people notified, immediate authorised action and any relevant first-hand detail. Protect personal information and follow safeguarding and confidentiality requirements. Do not promise secrecy, publish an incident account or name individuals outside the authorised route.

## Review after change

Health and Safety Executive guidance supports review when controls may no longer be effective, work changes, workers raise concerns, or an accident or near miss occurs. It does not establish one universal calendar interval or require every learner to conduct a root-cause investigation. The responsible competent person decides the scope, evidence, corrective action and communication.

Review should test whether controls remain suitable and whether the current procedure was followed. It should not be used to assign blame or to hide an event. Learners may be asked for factual information and should correct inaccuracies through the authorised process.

## Emergency and regulatory boundaries

In an emergency, protect people, call the appropriate emergency service and follow the site plan. Do not delay urgent help to complete a form. Veterinary, welfare, safeguarding and environmental concerns may have separate routes.

Under the UK Reporting of Injuries, Diseases and Dangerous Occurrences Regulations, not every accident or near miss is reportable. Reportability depends on the work relationship and the current listed category, and the legally responsible person must apply the current Health and Safety Executive rules and time limits. This lesson intentionally gives no fixed clinical trigger, form or deadline. Never state that an event is or is not regulator-reportable without authorised current review.

## Learning from a scenario

When discussing a fictional event, use the sequence: make the area safe within authority; obtain emergency help if needed; preserve factual information; notify the responsible person; follow the organisation's record and specialist routes; and wait for authorised review before resuming. The aim is reliable learning and safer controls, not a premature legal or causal conclusion.`,
    keyPoints: [
      "Risk management uses identify, assess, control, record and review within the current organisation and jurisdiction",
      "A learner contributes factual first-hand information but does not conduct an unauthorised investigation",
      "Changed work, ineffective controls, concerns, accidents or near misses can trigger responsible-person review",
      "Not every UK incident is reportable under RIDDOR; the legally responsible person applies current official rules",
      "Urgent safety, medical, veterinary, welfare or safeguarding help comes before paperwork",
    ],
    safetyNote:
      "In an emergency, protect people, call the appropriate emergency service and follow the current site plan; do not delay for forms. Do not move evidence, test equipment, diagnose, assign fault, publish personal information or decide regulatory reportability. Use the responsible-person, veterinary, welfare, safeguarding, insurer and current official routes.",
    practicalApplication:
      "For an instructor-provided fictional near miss, write a short first-hand record containing only time, place, task, observation, immediate authorised control and people notified. Then list the decisions reserved for the responsible competent person.",
    commonMistakes: [
      "Treating a hazard and a risk as identical conclusions",
      "Adding blame, diagnosis or assumed cause to a factual incident record",
      "Using one fixed review interval for every organisation and change",
      "Assuming every accident or near miss is regulator-reportable",
      "Delaying emergency help while completing paperwork",
    ],
    knowledgeCheck: [
      {
        question:
          "Which sequence reflects the reviewed workplace risk-management process?",
        options: [
          "Identify hazards, assess risks, control risks, record required findings and review controls",
          "Assign blame, publish names and restart immediately",
          "Use a universal checklist without considering the workplace",
          "Wait for an injury before considering controls",
        ],
        correctIndex: 0,
        explanation:
          "The Health and Safety Executive sequence is contextual and must be applied by the responsible competent people under current requirements.",
      },
      {
        question:
          "Who decides whether a UK work incident is RIDDOR-reportable?",
        options: [
          "The legally responsible person applying the current official rules to the facts",
          "Any learner using a generic near-miss label",
          "The first person who posts about the event",
          "A fixed rule that every accident is reportable",
        ],
        correctIndex: 0,
        explanation:
          "Reportability depends on the work relationship and current listed categories; not every incident qualifies.",
      },
      {
        question: "What belongs in a learner's authorised factual record?",
        options: [
          "What was directly observed, when and where, the immediate authorised action and who was notified",
          "An unsupported medical diagnosis",
          "A final legal conclusion",
          "A public list of people believed to be at fault",
        ],
        correctIndex: 0,
        explanation:
          "Factual records support the later authorised review without replacing professional, technical or legal decisions.",
      },
    ],
    aiTutorPrompts: [
      "Give me a fictional incident and test whether my record stays factual",
      "Quiz me on the difference between internal reporting and RIDDOR reportability",
      "Help me identify which decisions belong to the responsible competent person",
    ],
  },

  "advanced-safety-awareness": {
    objectives: [
      "Apply a site-specific safety review to changing work rather than using invented universal horse-yard rules",
      "Explain the reviewed management needs for lone work, supervision, monitoring and response",
      "Integrate welfare, weather, safeguarding and emergency escalation within authorised roles",
    ],
    content: `## Advanced means contextual judgement

Advanced safety awareness is the ability to recognise when a familiar task has changed and when existing controls may no longer be enough. It does not mean that a learner may override the responsible person, work outside competence or invent a universal list of tasks that are always safe or always prohibited. The current organisation, jurisdiction, insurer, site, horse, worker, weather and emergency arrangements determine the plan.

The United Kingdom Health and Safety Executive's lone-working guidance requires employers to manage risks for people working alone, including training, supervision, monitoring, regular contact and response to incidents. It identifies factors such as rural isolation, medical suitability, violence, stress and the work setting. Its named mandatory two-person examples do not create a generic horse-yard list, so this lesson does not claim that every named equestrian task has the same rule.

## Decide whether lone work is permitted

Before work starts, the responsible person determines whether lone work is permitted and which controls apply. The assessment should consider the task, competence, horse behaviour and familiarity, equipment, communication coverage, travel, location, weather, lighting, public access, manual handling, emergency access and how help will arrive.

A lone worker needs the training and information required for the role, a working contact method where the plan relies on one, agreed check-in or monitoring arrangements and a response when contact is missed. The organisation decides the frequency and method; this lesson gives no universal interval, application or device. A signal may fail, a battery may run down or a worker may be unable to call, so escalation arrangements must not rely on an untested assumption.

If a condition falls outside the approved assessment—such as an unfamiliar horse, changed behaviour, failed communication, severe weather, damaged equipment, unsafe public interaction or a task requiring assistance—do not improvise. Stop, withdraw to a safe position and contact the responsible person.

## Supervision and competence

Supervision should reflect the person's competence, the task and the changing risk. Being experienced in one activity does not confer competence in clinical care, electrical work, machinery, safeguarding investigation, dangerous-horse handling or another specialist area. Ask for instruction and document the limit of authorisation.

When more than one person is needed, define roles before beginning: who controls the horse, who operates equipment, who observes, who calls for help and who may stop the task. Avoid simultaneous conflicting cues or an assumption that somebody else completed a check.

## Weather, environment and welfare

Weather and ground can change visibility, access, footing, temperature exposure, fire risk and the horse's current suitability. Use current official warnings, site thresholds and the individual horse plan. Do not invent wind, temperature or rainfall limits or use a general lesson to diagnose heat stress, cold stress or unsoundness.

Horse welfare remains part of the decision. If the horse appears uncomfortable, distressed or unable to continue safely, stop and use the responsible-person and veterinary or behaviour-professional route. Do not treat pressure to finish a task, avoid delay or protect a schedule as a reason to continue.

## Safeguarding and personal security

Lone work can affect safeguarding and personal-security arrangements. Follow the organisation's safeguarding policy, communication boundaries and designated reporting route. Do not meet a child or adult at risk outside the approved arrangement, share private contact information, investigate a disclosure or promise secrecy. Immediate danger requires the relevant emergency service.

## Scenario review and escalation

For each advanced scenario, state the approved task, current controls, change observed, safe stop point, contact route and response if contact fails. Record facts rather than a diagnosis or legal conclusion. After an incident or near miss, the responsible competent person reviews controls before work resumes. Advanced safety is shown by recognising limits early and using the plan, not by managing every problem alone.`,
    keyPoints: [
      "Lone work requires current risk management, training, supervision, monitoring, contact and incident response",
      "The organisation decides task-specific permissions and controls; there is no universal horse-yard lone-working list",
      "Failed communication or changed conditions can invalidate the approved plan",
      "Competence and supervision are task-specific and do not extend automatically to specialist work",
      "Welfare, safeguarding, weather and personal security use their current professional and emergency routes",
    ],
    safetyNote:
      "Do not begin or continue lone or advanced work outside the current risk assessment, competence and communication plan. Stop for failed contact, changed horse behaviour, unsafe weather or environment, damaged equipment, personal-security or safeguarding concern. Follow the responsible-person and emergency response; immediate danger requires the relevant emergency service.",
    practicalApplication:
      "Review an instructor-provided fictional lone-working task. Identify the permitted scope, competence, supervision, contact and missed-check response, then introduce one changed condition and explain why the work must continue, change or stop under the responsible person's plan.",
    commonMistakes: [
      "Assuming experience in one horse task covers every specialist activity",
      "Using a fixed check-in interval without the organisation's assessment",
      "Continuing after the communication method required by the plan fails",
      "Inventing universal weather or lone-task prohibitions",
      "Handling a safeguarding disclosure informally or promising secrecy",
    ],
    knowledgeCheck: [
      {
        question: "What must a lone-working plan include?",
        options: [
          "Task-specific risk controls, competence, supervision or monitoring, contact and incident response",
          "One universal phone interval for every yard",
          "Permission to attempt any familiar-looking task",
          "A promise that mobile coverage will always work",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance requires risk management, training, supervision, monitoring and response suited to the actual work and person.",
      },
      {
        question:
          "What should happen if the required communication method fails?",
        options: [
          "Follow the plan's stop and escalation response rather than continuing outside approved controls",
          "Continue because the worker is experienced",
          "Invent a new check-in interval",
          "Ignore the failure until the task ends",
        ],
        correctIndex: 0,
        explanation:
          "A failed control changes the assessed conditions and may require the work to stop.",
      },
      {
        question: "How should a safeguarding concern be handled?",
        options: [
          "Use the organisation's designated reporting route and emergency services for immediate danger",
          "Investigate it alone",
          "Promise that the information will remain secret",
          "Publish the details so others can decide",
        ],
        correctIndex: 0,
        explanation:
          "Safeguarding requires the current designated route, protection of information and emergency escalation where necessary.",
      },
    ],
    aiTutorPrompts: [
      "Give me a lone-working scenario and ask which control has failed",
      "Quiz me on competence limits and responsible-person decisions",
      "Help me include weather, welfare and safeguarding in an advanced safety review",
    ],
  },

  "advanced-rider-position-analysis": {
    objectives: [
      "Analyse rider-position observations without turning them into diagnosis or universal biomechanics",
      "Plan one qualified, horse-and-rider-specific change while preserving safe equipment and supervision",
      "Recognise when pain, asymmetry, horse discomfort or loss of control needs professional escalation",
    ],
    content: `## Analysis is structured observation

Advanced rider-position analysis compares what a qualified coach intended with what was observed in a specific horse, rider, saddle, task and environment. It does not diagnose a rider's body, a horse's behaviour or a tack problem. University of Missouri Extension safe-riding guidance supports suitable rider equipment, boots and stirrup fit, ball-of-foot placement with the heel lower than the toe for most riding, routine tack inspection and appropriate assistance. It also recognises that position and fit vary with the rider and discipline.

Begin with the safety context: a suitable horse, an inspected and appropriately fitted tack setup, rider protective equipment, a safe area, qualified supervision and a task within the combination's current plan. If any of those conditions is missing, recording more video or applying an exercise does not solve the problem.

## Choose an observable question

Analyse one clear question at a time. Examples include whether the rider's foot remains able to release, whether the upper body repeatedly moves ahead of the coached balance point in a particular transition, whether one stirrup changes position, or whether control is lost on a specific line. State the gait, direction, task and moment. Avoid vague labels such as crooked, weak or unbalanced without describing what was visible.

A single frame can be misleading because riding is movement. Where authorised, a coach may compare several moments or directions and ask the rider what they felt. Camera position, clothing, arena angle and the horse's movement can change the appearance. Video is a coaching aid, not a medical assessment or proof of cause.

## Separate observation from explanation

“The left stirrup moved behind the girth during the downward transition” is an observation. “The rider has a pelvic disorder” is an unsupported diagnosis. “The horse hollowed because the rider's right shoulder dropped” states a cause that the footage alone cannot establish. Horse behaviour and comfort can have many contributors and require the appropriate coach, tack fitter, veterinarian or other professional.

The coach should consider the rider's report, the horse's response, tack and stirrup compatibility, task difficulty, fatigue, instructions and environment. The learner must report pain, numbness, previous injury, fear or a feeling of unsafe instability. Healthcare advice belongs to a suitably qualified healthcare professional, not an equestrian analysis lesson.

## Test one qualified change

Select one coach-agreed change that stays within the current plan. It may be a clearer cue, a simpler task, a rest, an equipment check by the responsible person or a different teaching explanation. The coach decides whether any mounted exercise is suitable. This lesson does not prescribe no-stirrup work, lunge work, fixed repetitions, off-horse treatment or a universal alignment correction.

Observe the same question again under comparable safe conditions. Record whether the intended task became easier, unchanged or harder and whether horse and rider remained comfortable and controlled. Do not claim that a short improvement proves a permanent correction or identifies the original cause.

## Stop and escalate

Stop for rider pain, dizziness, numbness, unsafe instability, inability to release the foot, equipment damage or unexpected horse discomfort or behaviour. The responsible person determines the next step. Qualified tack, veterinary, behaviour, coaching or healthcare assessment may be needed. Do not continue to collect evidence at the expense of welfare or safety.

## Produce a useful review note

A strong note records the question, conditions, factual observations, rider feedback, coach-agreed change, result and escalation. It protects privacy and uses authorised media storage. It avoids body shaming, diagnosis, guarantees and comparison with an idealised rider. The goal is a safe, individual coaching decision—not a score for how closely someone matches a picture.`,
    keyPoints: [
      "Advanced analysis describes movement in a specific horse-rider-tack-task context",
      "Video and still images support coaching observation but cannot diagnose or prove cause",
      "Equipment, rider feedback, task, environment and horse response all belong in the review",
      "Test only one qualified coach-agreed change within the current plan",
      "Pain, unsafe instability, equipment concern or horse discomfort requires stopping and appropriate escalation",
    ],
    safetyNote:
      "Analyse only an authorised, safely supervised session with suitable horse, tack, rider equipment and environment. Do not prescribe no-stirrup or lunge work, diagnose asymmetry, infer a medical or behavioural cause, or continue for footage when horse or rider welfare is in doubt. Protect private recordings and use the relevant coach, tack, veterinary or healthcare route.",
    practicalApplication:
      "Review an instructor-provided fictional clip description. Write one observable question, separate three observations from possible explanations, select one coach-agreed low-risk change and identify the stop points and professional referrals without diagnosing either horse or rider.",
    commonMistakes: [
      "Diagnosing the rider or horse from one frame or direction",
      "Treating a visual alignment as identical for every rider and saddle",
      "Changing tack, task and position at the same time",
      "Prescribing unsupervised no-stirrup, lunge or therapeutic work",
      "Claiming a short change proves cause or permanent improvement",
    ],
    knowledgeCheck: [
      {
        question: "Which statement is a factual position observation?",
        options: [
          "The left stirrup moved behind the girth during the downward transition",
          "The rider has a pelvic disorder",
          "The horse behaved badly because the rider is weak",
          "The saddle definitely caused the movement",
        ],
        correctIndex: 0,
        explanation:
          "The first statement records what was visible and when. The others are unsupported diagnoses or causal conclusions.",
      },
      {
        question: "How should a coach test a possible adjustment?",
        options: [
          "Choose one suitable coach-agreed change and observe the same question under safe comparable conditions",
          "Change every factor and assume improvement proves the cause",
          "Prescribe a fixed no-stirrup programme",
          "Ignore the rider's report of pain",
        ],
        correctIndex: 0,
        explanation:
          "One bounded change makes the coaching observation useful without turning it into diagnosis or a universal prescription.",
      },
      {
        question: "What requires the analysis session to stop?",
        options: [
          "Rider pain or unsafe instability, damaged equipment, or horse discomfort",
          "The camera angle is not ideal",
          "The rider does not match a reference picture exactly",
          "The coach wants more footage despite welfare concern",
        ],
        correctIndex: 0,
        explanation:
          "Welfare and safety override the desire for more data; the appropriate professional route should take over.",
      },
    ],
    aiTutorPrompts: [
      "Help me turn a position judgement into a factual observation",
      "Give me a fictional analysis and ask what one factor a coach could review",
      "Quiz me on when video analysis must stop and be escalated",
    ],
  },

  "trot-rhythm-and-balance": {
    objectives: [
      "Describe rhythm and balance through qualified coach observation rather than universal gait claims",
      "Use a suitable horse, current equipment and appropriate support for introductory rising trot",
      "Respond safely to loss of rhythm, security, comfort or control",
    ],
    content: `## What this lesson can teach

Trot rhythm and rider balance are learned through supervised practice on a horse suitable for the participant. British Horse Society coach guidance for an introductory rider award focuses on position, balance and security, allows support such as a neck strap where required and places ridden work under coach instruction and supervision. It also makes clear that a rider at this introductory level does not need to recognise the correct diagonal merely to demonstrate security in rising trot. This lesson therefore avoids presenting diagonal recognition, gait mechanics or a fixed exercise as a universal safety requirement.

## Establish the safe context

The qualified coach selects the horse, tack, activity, area and assistance. The rider uses appropriate inspected protective equipment, compatible boots and stirrups and any coach-approved support. A leader or other assistance may be required. The rider should tell the coach about pain, fear, fatigue, unfamiliarity or difficulty releasing a foot.

Before trotting, the coach confirms that the rider can follow instructions, maintain safe control at the preceding pace and use the agreed stop signal. The horse's current comfort and suitability remain the responsible person's decision. Do not use trot work to test suspected pain, lameness, tack fit or behavioural concern.

## Observe rhythm without inventing a number

Rhythm can be discussed as the regularity of the steps heard and felt during the authorised exercise. The coach may ask the rider to notice whether the pattern stays regular, changes through a turn or transition, or becomes hurried. This lesson does not prescribe a universal beats-per-minute target, stride length or correction. Surface, horse, pace, balance and task all affect what the coach observes.

Use factual language: “the rhythm became quicker before the corner” is an observation. “The horse has a joint problem” is a diagnosis. If the pattern changes repeatedly or the horse appears uncomfortable, the coach should stop and use the appropriate responsible-person or veterinary route.

## Security in rising trot

At introduction level, the goal is a secure, coach-guided rising trot rather than a claim of perfect technique. The coach may use simple verbal cues and support such as a neck strap. Foot and stirrup position must still allow safe release. The rider should avoid pulling on the reins or gripping through pain to create the rise.

The qualified coach determines whether the rider should continue, return to a simpler pace, use a leader, pause or end. No-stirrup work, lunge lessons, fixed repetition sets or a copied rise-sit count are outside this lesson unless a qualified coach specifically selects them for the individual horse and rider.

## Diagonals in context

Riders may later learn how a coach identifies and changes a rising-trot diagonal for a particular exercise or discipline. The reviewed introductory guidance does not make diagonal recognition necessary for basic security. Do not tell a learner that being on a named diagonal proves safety, prevents injury or corrects the horse. Current coach instruction and discipline context govern its use.

## When to simplify or stop

Return to the simpler task or stop when the rider loses safe control, a foot becomes trapped or unstable, pain or fear increases, the horse becomes uncomfortable, tack moves unexpectedly, the surface changes or the coach can no longer supervise effectively. Do not continue to reach a time, lap or repetition target.

After the authorised session, record the horse and task, the support used, one factual rhythm observation, one rider feeling and the coach's next step. Avoid diagnosis and guarantees. Progress is a qualified judgement based on repeated safe work and the individual combination.`,
    keyPoints: [
      "Introductory trot work uses a suitable horse and qualified coach supervision",
      "The reviewed focus is rider position, balance and security, with support such as a neck strap where required",
      "Rhythm is observed in context; this lesson gives no universal tempo or stride prescription",
      "Correct-diagonal recognition is not required merely to demonstrate introductory rising-trot security",
      "Loss of control, pain, fear, tack concern or horse discomfort requires simplification, stopping or escalation",
    ],
    safetyNote:
      "Practise only on a suitable horse with inspected tack, appropriate rider equipment, qualified supervision and any required leader or support. Do not prescribe no-stirrup, lunge, tempo, stride or repetition programmes. Stop for loss of safe control, trapped or unstable foot, pain, fear, tack movement, unsafe surface or horse discomfort.",
    practicalApplication:
      "In a qualified lesson, use an instructor-approved short rising-trot observation. Record whether the step pattern stayed regular, which support was used and when the coach simplified or stopped, without judging a diagonal or diagnosing horse or rider.",
    commonMistakes: [
      "Treating one tempo, stride or exercise as correct for every horse",
      "Claiming diagonal recognition proves basic safety or prevents injury",
      "Using the reins or painful gripping to create the rise",
      "Removing stirrups or using a lunge exercise without qualified approval",
      "Continuing to reach a repetition target after security or comfort changes",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the reviewed priority for an introductory rider in rising trot?",
        options: [
          "Position, balance and security under qualified coach supervision",
          "Recognising a named diagonal before any rising trot",
          "Completing a fixed number of laps",
          "Riding without support as early as possible",
        ],
        correctIndex: 0,
        explanation:
          "The reviewed introductory guidance focuses on security and allows support; diagonal recognition is not required for that basic demonstration.",
      },
      {
        question: "How should a change in trot rhythm be recorded?",
        options: [
          "As a factual change in regularity, pace, place and task for the coach to review",
          "As proof of a joint diagnosis",
          "As a reason to apply a universal stride correction",
          "As evidence that the rider must remove stirrups",
        ],
        correctIndex: 0,
        explanation:
          "A rhythm observation supports qualified review but cannot establish diagnosis or a universal exercise.",
      },
      {
        question: "When should the trot task be simplified or stopped?",
        options: [
          "When security, control, comfort, equipment, surface or horse welfare is in doubt",
          "Only after a copied time target",
          "Only if the rider cannot name the diagonal",
          "Never when a leader is present",
        ],
        correctIndex: 0,
        explanation:
          "The qualified coach responds to the current safe conditions rather than a fixed target or terminology test.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on factual rhythm observations without gait diagnosis",
      "Explain why diagonal recognition is separate from introductory security",
      "Give me a trot scenario and ask when the coach should simplify or stop",
    ],
  },

  "rider-balance-independent-seat": {
    objectives: [
      "Explain an independent seat as an individual coach-observed aim rather than a fixed anatomical claim",
      "Use suitable support and progressive tasks while protecting horse and rider welfare",
      "Separate balance observations from medical, tack or behavioural diagnosis",
    ],
    content: `## A coach-observed aim

An independent seat is a coaching description for a rider who can remain secure and follow the horse's movement while using aids without relying on the reins for balance. It is not a medical state, a single body shape or proof that the horse is comfortable. British Horse Society introductory coach guidance requires a safe horse suitable for the participant, ridden work under coach instruction and supervision, and attention to position, balance and security. It allows support such as a neck strap where required.

The qualified coach decides what independence means for the individual rider, horse, saddle and task. Age, experience, confidence, disability, health, body proportions and the current activity may affect suitable support and progression. The rider should not be compared with a fixed ideal or encouraged to hide pain, fear or difficulty.

## Build the safe context

Use a suitable horse, inspected and appropriately fitted tack, compatible footwear and stirrups, a correctly selected and inspected helmet and a safe working area. Confirm the rider understands the stop signal and can use any support safely. A leader or other assistance may be appropriate. Support is not failure; it is part of a participant-centred plan.

If there is concern about horse comfort, rider health, saddle fit, equipment or the environment, stop and use the responsible professional route. Do not use balance exercises to test suspected pain or compensate for unsuitable tack.

## Observe function, not a pose

Useful observations relate to the authorised task: whether the rider stays secure through a transition, whether the foot can release, whether hands repeatedly bear body weight, whether the rider can follow a simple line and whether the horse remains calm and comfortable. Record the direction, pace, task and support.

Avoid unsupported causal statements. A rider leaning to one side does not prove a musculoskeletal condition. A horse changing rhythm does not prove that the rider's seat caused discomfort. Camera angle and a single moment can mislead. Qualified coaching, tack fitting, veterinary, behaviour or healthcare review may be appropriate depending on the facts.

## Progressive coach-selected practice

The coach may choose simple, short tasks that the current combination can perform safely, then observe and adapt. This lesson deliberately does not prescribe no-stirrup work, lunge lessons, balance devices, fixed durations, repetition counts or off-horse treatment. Each can introduce risk or be unsuitable without individual assessment.

One useful learning process is to choose a familiar task, name the support, make one neutral observation, apply one coach-agreed cue and compare the result. If the rider becomes less secure, relies more heavily on the reins, grips through pain or the horse becomes uncomfortable, simplify or stop. Progression is based on repeated safe performance and qualified judgement, not removal of support on a schedule.

## Communication and autonomy

Ask the rider what they felt and what support helped. Obtain consent for touch, video or equipment changes. Respect privacy and do not body-shame. A participant-centred coach explains the purpose of an exercise, gives a clear stop option and adapts communication to the individual.

## Stop and refer

Stop for pain, dizziness, numbness, fear that affects safe control, trapped or unstable footwear, equipment movement or damage, unsafe surroundings or horse discomfort. Healthcare concerns go to the appropriate healthcare professional; horse health to a veterinarian; tack fit to a qualified fitter; behaviour concerns to the relevant qualified professional. The lesson supports recognising the boundary, not selecting treatment.

After practice, record the task, support, factual observation, rider feedback, coach decision and any escalation. The aim is a safer, more responsive partnership, not a universal claim about anatomy or performance.`,
    keyPoints: [
      "An independent seat is a coach-observed functional aim, not a fixed pose or diagnosis",
      "Suitable horses, equipment, supervision and participant-centred support are required",
      "Neck straps, leaders or other approved support can be appropriate and do not represent failure",
      "No-stirrup, lunge, balance-device or fixed exercise programmes require separate qualified selection",
      "Record neutral observations and stop for rider, equipment, environment or horse-welfare concerns",
    ],
    safetyNote:
      "Use only qualified, participant-centred instruction with a suitable horse, inspected tack and appropriate support. Do not prescribe no-stirrup, lunge, balance-device or off-horse programmes, diagnose the rider or horse, remove support on a schedule, or continue through pain, fear, unsafe instability, equipment concern or horse discomfort.",
    practicalApplication:
      "With a qualified coach, observe one familiar transition using any approved support. Record the task, one neutral security observation and rider feedback, apply one coach-agreed cue, then decide whether to repeat, simplify, stop or refer without diagnosing.",
    commonMistakes: [
      "Treating independence as a fixed body shape",
      "Removing a neck strap, leader or other support simply to appear advanced",
      "Prescribing no-stirrup or lunge work without individual qualified assessment",
      "Diagnosing asymmetry or horse discomfort from a single observation",
      "Ignoring consent, privacy, pain or fear during analysis",
    ],
    knowledgeCheck: [
      {
        question: "What does an independent seat mean in this lesson?",
        options: [
          "A coach-observed ability to remain secure and follow movement without relying on the reins for balance",
          "One identical body shape for every rider",
          "A medical diagnosis",
          "Proof that the horse has no discomfort",
        ],
        correctIndex: 0,
        explanation:
          "It is a functional coaching aim assessed in the individual context, not a universal anatomical or health conclusion.",
      },
      {
        question: "How should approved support such as a neck strap be viewed?",
        options: [
          "As a participant-centred safety and learning aid when the coach judges it appropriate",
          "As failure that must be removed quickly",
          "As permission to pull for balance",
          "As a replacement for qualified supervision",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance explicitly allows support where required; progression remains individual and coach-led.",
      },
      {
        question:
          "Which observation requires stopping and appropriate referral?",
        options: [
          "Pain, unsafe instability, equipment concern or horse discomfort",
          "The rider asks to keep an approved neck strap",
          "The rider's position differs from a photograph",
          "A fixed repetition target has not been reached",
        ],
        correctIndex: 0,
        explanation:
          "Safety and welfare concerns override targets or appearance and belong with the relevant qualified route.",
      },
    ],
    aiTutorPrompts: [
      "Help me describe an independent seat without using fixed anatomy claims",
      "Quiz me on participant-centred support and progression",
      "Give me a balance observation and ask which professional boundary applies",
    ],
  },

  "teaching-the-foundations": {
    objectives: [
      "Explain the professional scope and safeguards required before teaching a beginner",
      "Describe participant-centred planning, communication, progression and review principles",
      "Recognise decisions reserved for a qualified coach, responsible person or safeguarding route",
    ],
    content: `## This is professional preparation, not permission to teach

Teaching a beginner rider carries responsibility for the participant, horse, environment, equipment and other people. British Equestrian's first-lesson guidance says a coach takes a new rider step by step through mounting and basic controls, that a beginner may have a leader and that the rider should tell the coach if they feel uncomfortable or nervous. The British Horse Society Stage 2 Coach syllabus places duty of care, horse-and-rider suitability, risk assessment, safeguarding, communication, progressive activity, adaptation, feedback and evaluation within a professional coaching standard.

This lesson is therefore a preparation and reflection aid for an appropriately qualified and authorised coach or a learner working under that coach. It does not qualify a learner, authorise unsupervised teaching, endorse the course or provide a universal beginner lesson plan.

## Establish authority and safeguards

Before planning, confirm the coach's qualification, insurance, employer or facility authority, safeguarding requirements, emergency procedure and permitted scope. Identify the responsible person for the horses, arena and equipment. Check how consent, health or support information and personal data are collected and protected. A learner must not gather sensitive information informally or promise confidentiality outside the safeguarding policy.

The qualified coach assesses the participant's age, experience, communication needs, confidence, disability or health context only within competence and with appropriate consent. Healthcare assessment belongs to a healthcare professional. Safeguarding concern belongs to the designated reporting route; immediate danger requires the relevant emergency service.

## Select the individual horse and activity

Horse suitability is a responsible professional decision based on the horse's current welfare, temperament, training, workload, tack, the participant and the environment. A generic description such as “quiet horse” is not a selection test. Do not use a beginner session to test an unfamiliar or concerning horse.

The coach chooses inspected tack, rider equipment, leaders or helpers and a safe area. Roles must be clear: who controls the horse, who supports the rider, who observes and who may stop. A helper is not a substitute for qualified supervision and must work within training and safeguarding boundaries.

## Plan a clear learning aim

Choose a small, observable aim suitable for the current participant and horse. Explain it in plain language, demonstrate only where safe and check understanding. The coach should break the task into manageable steps, observe the response and adapt. The Stage 2 syllabus includes preparation, main activity, cool-down, conclusion and evaluation, but any durations in a qualification assessment are not universal public lesson timings.

Avoid diagnosing a rider “fault” or prescribing one correction for everyone. Use neutral observations and ask what the participant feels. If pain, fear, confusion or loss of control develops, simplify or stop. Horse discomfort or behaviour change also requires a welfare-led stop and the responsible professional route.

## Feedback and progression

Feedback should identify what was observed, connect it to the agreed aim and offer one suitable next action. Invite the participant's view. Praise must be truthful and must not hide a safety issue. Progression occurs only when the qualified coach judges the horse-rider combination safe and ready; it is not triggered by a fixed number of repetitions or minutes.

At the end, review the aim, participant feedback, horse response, safeguards, changes made and any follow-up. Record only authorised information. Do not claim accreditation, competence or completion beyond what was actually assessed.

## Stop and escalate

Stop for unsafe control, rider pain or distress, unsuitable equipment or environment, horse discomfort, failed supervision, safeguarding concern or work outside competence. Use the current responsible-person, veterinary, healthcare, safeguarding or emergency route. Sound foundational teaching is demonstrated by safe limits, clear communication and individual adaptation—not by completing a script.`,
    keyPoints: [
      "Only an appropriately qualified, authorised and safeguarded coach may take responsibility for teaching a beginner",
      "Horse, rider, equipment, environment, assistance and emergency arrangements require individual assessment",
      "A lesson uses a small observable aim, clear communication, progressive activity, adaptation and evaluation",
      "Qualification-assessment timings are not universal public lesson prescriptions",
      "Progression is a qualified welfare-led decision; pain, distress, unsafe control or concern requires stopping and escalation",
    ],
    safetyNote:
      "This lesson does not qualify or authorise anyone to teach. Work only under the applicable professional, insurance, safeguarding and facility arrangements with a suitable horse, equipment, helpers and environment. Stop for unsafe control, rider pain or distress, horse discomfort, failed supervision, safeguarding concern or work beyond competence.",
    practicalApplication:
      "Under a qualified coach, prepare a fictional beginner-session outline with one observable aim. Record the authority, safeguarding and emergency checks, horse/rider suitability decisions, helper roles, one adaptation, feedback question, stop points and evaluation without adding fixed timings.",
    commonMistakes: [
      "Treating educational material as a coaching qualification or authorisation",
      "Selecting a horse from a generic temperament label",
      "Copying qualification-assessment timings into every public lesson",
      "Diagnosing rider faults or using one correction for everyone",
      "Progressing to finish a plan despite rider or horse welfare concerns",
    ],
    knowledgeCheck: [
      {
        question: "Who may take responsibility for teaching a beginner rider?",
        options: [
          "An appropriately qualified and authorised coach working within current safeguards",
          "Any learner who has read this lesson",
          "An untrained helper acting alone",
          "A rider who copies a fixed online plan",
        ],
        correctIndex: 0,
        explanation:
          "The reviewed sources place beginner instruction within qualified coaching, duty of care, safety, welfare and safeguarding.",
      },
      {
        question: "How should a beginner activity progress?",
        options: [
          "In coach-selected manageable steps adapted to the participant and horse",
          "After a universal number of repetitions",
          "Whenever the written plan says, even if control is unsafe",
          "By removing all support as soon as possible",
        ],
        correctIndex: 0,
        explanation:
          "Progression is individual, participant-centred and welfare-led rather than controlled by a fixed target.",
      },
      {
        question:
          "What should happen when a rider reports pain or unsafe fear?",
        options: [
          "Simplify or stop and use the appropriate professional support route",
          "Dismiss it as a normal beginner fault",
          "Increase the task difficulty to build confidence",
          "Ask an untrained helper to continue the lesson",
        ],
        correctIndex: 0,
        explanation:
          "Pain, distress and unsafe control are stop points; healthcare or other qualified support may be needed.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on the authority and safeguards needed before beginner teaching",
      "Help me turn a broad lesson goal into one observable participant-centred aim",
      "Give me a beginner scenario and ask when the qualified coach must adapt or stop",
    ],
  },

  "communication-and-feedback-skills": {
    objectives: [
      "Use clear verbal, non-verbal and demonstration choices within qualified coaching scope",
      "Give factual participant-centred feedback without fixed formulas or learner labels",
      "Protect safety, welfare, privacy and safeguarding during communication",
    ],
    content: `## Communication serves the participant and horse

Coaching communication should help the participant understand the current task while protecting safety and horse welfare. The British Horse Society Stage 2 Coach syllabus requires effective verbal and non-verbal communication, demonstration, positioning, rapport, motivation, receiving and providing feedback, rider-centred adaptation, suitable content, safety, welfare and safeguarding. It does not prescribe one feedback sandwich, a learning-style taxonomy, a fixed timing interval or a universal cue.

This lesson supports appropriately qualified and authorised coaching. It does not permit an unqualified learner to coach independently, handle private participant information outside policy or make healthcare, psychological or safeguarding assessments.

## Choose clear communication

Start with the agreed aim and the participant's current understanding. Use concise language appropriate to the person and task. Explain one action at a time where complexity could affect safety. Check understanding by inviting the participant to explain or demonstrate, rather than relying on “Do you understand?” alone.

Position yourself so the participant can hear or see without compromising horse, rider or other arena users. A demonstration must use a suitable demonstrator, horse, equipment and area and must remain within the coach's competence. Never demonstrate a risky action merely to make a point.

Non-verbal information can include posture, expression, gesture and the participant's response, but it is not a diagnosis. Ask rather than assume why somebody is quiet, tense, distracted or reluctant. Hearing, language, disability, neurodiversity, confidence and previous experience may require individual adaptation with consent.

## Give factual feedback

Useful feedback identifies an observation, relates it to the agreed aim and offers a suitable next action. For example: “On the last transition your hands moved back and the contact changed; on the next coach-approved attempt, think about following forward.” It does not label the person, claim a medical cause or guarantee an outcome.

Positive feedback should be specific and truthful. Corrective feedback should prioritise safety and avoid humiliation. There is no requirement to hide a necessary safety correction between two compliments. The coach decides the timing: some issues need an immediate stop, while others are better discussed when horse and rider are settled.

Invite the participant's perspective: what did they feel, what was clear and what support would help? Receiving feedback is part of coaching. The coach should change an explanation that is not working rather than blaming a supposed learner type.

## Adapt without stereotyping

Do not assign people fixed visual, auditory or kinaesthetic learning labels. Instead, offer appropriate combinations of explanation, demonstration, observation and practice, then check which supports the individual in that context. Avoid age, disability, gender, culture or confidence stereotypes.

Any physical guidance requires consent, professional appropriateness and safeguarding compliance. Personal, health and support information is collected and shared only through authorised systems and on a need-to-know basis.

## Safety, welfare and safeguarding

Communication must not distract from safe control. Use the current stop signal and emergency procedure. If the horse appears uncomfortable, the rider reports pain or distress, control deteriorates or instructions are misunderstood in a way that creates risk, stop and reassess.

For a safeguarding concern or disclosure, follow the organisation's designated reporting route. Do not investigate, confront, promise secrecy or use a coaching conversation as counselling. Immediate danger requires the relevant emergency service.

## Review the exchange

After the session, record the aim, factual feedback, participant response, adaptation and agreed next step. Avoid subjective labels and unnecessary private detail. Evaluate whether communication improved understanding while preserving welfare and dignity. Effective feedback is responsive and evidence-aware, not adherence to a fashionable formula.`,
    keyPoints: [
      "Communication must suit the participant, task, horse, environment and current safety context",
      "Feedback uses a factual observation, agreed aim and suitable next action",
      "No universal feedback sandwich, learning-style label or timing interval is required",
      "Ask and adapt rather than infer a medical, psychological or personal cause",
      "Consent, privacy, safeguarding and immediate safety remain active throughout coaching",
    ],
    safetyNote:
      "Communicate only within qualified coaching, consent, privacy and safeguarding arrangements. Stop when instructions create unsafe control, horse discomfort, rider pain or distress. Do not diagnose, counsel beyond competence, use non-consensual physical guidance, investigate a safeguarding concern or promise secrecy; use the designated route and emergency services for immediate danger.",
    practicalApplication:
      "Rewrite three instructor-provided judgemental feedback statements as factual observation–aim–next-action feedback. For each, add one understanding check, one participant-centred adaptation and the safety or safeguarding stop point.",
    commonMistakes: [
      "Using a fixed feedback sandwich when an immediate safety correction is needed",
      "Labelling a participant with a permanent learning style",
      "Interpreting body language as a diagnosis",
      "Giving physical guidance without consent and safeguarding checks",
      "Recording unnecessary private or judgemental information",
    ],
    knowledgeCheck: [
      {
        question: "What are the core elements of useful coaching feedback?",
        options: [
          "A factual observation, connection to the agreed aim and a suitable next action",
          "A personality label and guaranteed result",
          "Two compliments around every correction",
          "A medical explanation for the participant's movement",
        ],
        correctIndex: 0,
        explanation:
          "Factual participant-centred feedback supports the task without diagnosis, labelling or a rigid formula.",
      },
      {
        question:
          "How should a coach respond when an explanation is not working?",
        options: [
          "Ask the participant, adapt the communication and check understanding again",
          "Blame the participant's supposed learning style",
          "Repeat the same words more loudly regardless of need",
          "Progress the task without understanding",
        ],
        correctIndex: 0,
        explanation:
          "The reviewed standard is participant-centred and requires adaptation rather than stereotyping.",
      },
      {
        question: "What should a coach do after a safeguarding disclosure?",
        options: [
          "Use the designated reporting route and emergency services if danger is immediate",
          "Investigate the allegation personally",
          "Promise complete secrecy",
          "Discuss identifying details with the whole group",
        ],
        correctIndex: 0,
        explanation:
          "Safeguarding information follows the organisation's authorised route; the coach must not investigate or promise secrecy.",
      },
    ],
    aiTutorPrompts: [
      "Help me rewrite judgemental feedback as a factual coaching statement",
      "Quiz me on why fixed learning-style labels are inappropriate",
      "Give me a communication scenario with a safety or safeguarding stop point",
    ],
  },

  "understanding-your-learners": {
    objectives: [
      "Gather relevant participant information through authorised, consent-based processes",
      "Adapt coaching to individual needs without stereotypes, diagnosis or fixed learner labels",
      "Use safety, welfare, privacy, safeguarding and professional referral boundaries",
    ],
    content: `## Know the person without labelling them

Participant-centred coaching begins with the individual rather than assumptions about an age group, diagnosis, disability or supposed learning style. The British Horse Society Stage 2 Coach syllabus explicitly includes adults, children, participants with special educational needs, disability or long-term health conditions and other individual needs. It requires suitable adaptation, communication, safety, horse welfare, safeguarding and consideration of age and experience. It does not prescribe age thresholds, confidence treatment, a generic learner profile or unauthorised handling of personal data.

This lesson supports an appropriately qualified and authorised coach. It does not teach healthcare assessment, diagnose anxiety or disability, replace specialist advice or permit collection of sensitive information outside the organisation's approved process.

## Gather what is relevant and authorised

Use the current registration, consent and safeguarding process to obtain only information needed for safe participation and suitable coaching. Explain why information is requested, who can access it and how it is used. For a child or participant who requires support, follow the organisation's rules for parent, guardian, carer or support-person involvement without assuming that another person should answer for the participant.

Ask open, respectful questions about experience, aims, communication preferences, previous contact with horses, equipment needs and what helps the person feel able to learn. Do not ask for unnecessary medical detail. Where a health condition may affect participation, the coach should follow the current professional and organisation route for appropriate advice rather than making a clinical judgement.

## Observe in context

During an authorised session, observe whether the participant can hear or see the instruction, understands the task, uses equipment safely, remains comfortable and can communicate a stop. A quiet, hesitant or excited response does not prove a personality, diagnosis or motivation. Ask what the participant experienced and consider the horse, environment, task and explanation.

Record factual information such as “requested a written sequence before mounting” rather than labels such as difficult, lazy or visual learner. Protect privacy and share information only with authorised people who need it for safe support.

## Adapt the coaching

Adapt one or more elements: language, pace of explanation, demonstration, position, equipment reviewed by the responsible competent person, approved support, task complexity, rest, environment or the chosen horse. The qualified coach decides whether an adaptation is safe and within competence. An adaptation should preserve dignity and the intended learning purpose; it is not automatically a lower standard.

Avoid fixed learning-style taxonomies. A participant may benefit from different methods in different tasks. Combine clear explanation, demonstration and supported practice where appropriate, then check understanding and invite feedback. Do not force exposure to fear, use a generic confidence exercise or claim that riding treats a mental-health condition.

## Safety, horse welfare and inclusion

Match horse and activity to the individual through responsible professional assessment. The horse's welfare and workload remain active constraints. Inclusion does not mean attempting an unsafe task or using an unsuitable horse; it means seeking reasonable, participant-centred ways to enable access while respecting competence and welfare.

Stop for pain, distress that affects safety, loss of control, unsuitable equipment, horse discomfort or a support need outside the coach's competence. Use the appropriate healthcare, accessibility, safeguarding, veterinary, tack or other qualified route.

## Safeguarding and boundaries

Follow the designated safeguarding policy for communication, touch, media, transport, changing areas, digital contact and disclosures. Obtain consent for physical guidance and recording. Do not meet outside approved arrangements, share private contact details, investigate a concern or promise secrecy. Immediate danger requires the relevant emergency service.

## Review with the participant

At the end, ask what supported learning, what was difficult and what the participant would change. Record the agreed adaptation and next step without unnecessary private detail. Review the horse's response and the safety controls as well as participant progress. Understanding a learner is an ongoing respectful conversation, not a one-time label.`,
    keyPoints: [
      "Participant-centred coaching starts with authorised information and respectful questions, not assumptions",
      "Age, disability, health context, confidence and experience require individual consideration without diagnosis or stereotypes",
      "Adapt communication, support, task and environment within qualified competence and horse-welfare limits",
      "Fixed learning-style labels and generic confidence treatment are not supported",
      "Consent, privacy, safeguarding and appropriate professional referral are essential",
    ],
    safetyNote:
      "Gather and use participant information only through authorised consent, privacy and safeguarding processes. Do not diagnose, demand unnecessary health details, force fearful exposure, use non-consensual touch or media, or attempt support outside competence. Stop for pain, unsafe distress, loss of control, unsuitable equipment or horse discomfort and use the relevant qualified route.",
    practicalApplication:
      "Given a fictional participant profile containing only authorised information, identify respectful questions, one communication adaptation, one task or support adaptation, the horse-welfare check, privacy limits and the exact professional or safeguarding stop points.",
    commonMistakes: [
      "Assuming needs from age, disability, diagnosis or appearance",
      "Assigning a permanent visual, auditory or kinaesthetic learner label",
      "Collecting or sharing unnecessary health and personal information",
      "Treating inclusion as permission to attempt an unsafe or unsuitable task",
      "Using coaching as mental-health treatment or informal safeguarding investigation",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the best starting point for understanding a participant?",
        options: [
          "Authorised relevant information, respectful questions and observation in context",
          "Assumptions based on age or diagnosis",
          "A permanent learning-style test",
          "Unrestricted access to private health records",
        ],
        correctIndex: 0,
        explanation:
          "Participant-centred coaching gathers only relevant authorised information and avoids stereotypes or unnecessary private detail.",
      },
      {
        question: "What makes an adaptation appropriate?",
        options: [
          "It meets the individual's current need within coach competence, safety and horse welfare",
          "It is identical for everyone with the same condition",
          "It removes all learning expectations",
          "It was copied from an unrelated participant",
        ],
        correctIndex: 0,
        explanation:
          "Adaptation is individual and context-specific and must preserve safe, welfare-aware participation.",
      },
      {
        question:
          "What should happen when a need is outside the coach's competence?",
        options: [
          "Pause or adapt safely and use the appropriate qualified or safeguarding referral route",
          "Diagnose the issue from observation",
          "Ignore the need to avoid delay",
          "Ask the participant to keep it secret",
        ],
        correctIndex: 0,
        explanation:
          "Professional limits protect the participant and horse; the coach should refer rather than improvise.",
      },
    ],
    aiTutorPrompts: [
      "Help me replace a learner stereotype with respectful questions",
      "Quiz me on authorised information, consent and privacy",
      "Give me an inclusion scenario and ask where coach competence or horse welfare sets a limit",
    ],
  },

  "structuring-a-beginner-lesson": {
    objectives: [
      "Build a qualified, participant-centred lesson structure around a clear observable aim",
      "Integrate risk, horse-rider suitability, preparation, progression, adaptation and review",
      "Avoid universal phase timings, exercises and unauthorised beginner teaching",
    ],
    content: `## Structure supports judgement

A lesson structure helps a qualified coach prepare, observe, adapt and review; it is not a script that overrides the individual participant, horse or conditions. The British Horse Society Stage 2 Coach syllabus expects planning to consider risk assessment, aims and objectives, equipment, preparation, main activity, cool-down, conclusion, progression, adaptation, feedback, evaluation and horse-and-rider suitability. Durations used in a professional qualification assessment describe that assessment, not universal public lesson timings.

This lesson is a planning aid for an appropriately qualified and authorised coach or a learner under that coach's supervision. It does not qualify a person to teach a beginner, select a horse independently or use generic mounted exercises without current assessment.

## Begin with safeguards and information

Confirm professional scope, facility authority, insurance, safeguarding, consent, emergency arrangements and the participant-information process. Identify the responsible person for the horse, tack and area. Review the participant's authorised experience, aims, communication or support needs and any information relevant to safe participation.

The qualified coach selects a suitable horse and activity after considering horse welfare, current workload and behaviour, participant size and ability, tack, assistance, environment and the planned learning aim. A generic label such as beginner-safe does not replace current individual assessment.

## Set one observable aim

Write an aim that describes what the participant will be able to demonstrate under the lesson conditions. “Follow the agreed stop signal at walk with leader support” is clearer than “improve control.” State the support and safety boundary. Do not promise mastery, confidence or independence in one session.

Decide how understanding will be checked and what factual evidence the coach will observe. Plan alternatives that simplify the task or change communication if the original activity is unsuitable.

## Preparation

Preparation includes the horse, participant, tack, rider equipment, area, helpers and current condition. Explain the aim and stop signal, check communication and allow the participant to report pain, fear or uncertainty. A warm-up is selected for the individual plan; this lesson gives no fixed pace or duration.

If a required check is incomplete, equipment is damaged or uncertain, supervision fails, the horse appears uncomfortable or the participant cannot take part safely, the lesson does not proceed merely because it is scheduled.

## Main learning activity

Introduce the task in manageable coach-selected steps. Use clear explanation and safe demonstration where appropriate. Observe the participant and horse continuously, invite feedback and make one suitable adjustment at a time. Helpers need defined roles and must stay within training and safeguarding boundaries.

Progression is optional, not an obligation. The qualified coach decides whether to repeat, simplify, change pace, use more support, pause or finish. Do not use fixed repetition counts, universal school figures, no-stirrup work or mounted exposure to fear from this structure.

## Cool-down and conclusion

Reduce activity and complete aftercare according to the individual horse and current professional plan. A fixed cool-down time is not provided. Confirm the participant is safe to dismount or leave the activity under the current procedure.

Review the observable aim using factual evidence, participant feedback and the horse's response. Give specific feedback and agree one suitable next step. Record attendance, support, relevant observations, adaptations, incidents and follow-up only in the authorised system.

## Evaluation

Evaluate the plan as well as the participant: Was the horse suitable? Did communication work? Were helpers clear? Were risk controls effective? Did the activity support the aim without compromising welfare? An incident, near miss, safeguarding concern or changed condition uses the designated route and may require responsible-person review.

A strong structure is flexible and fail-closed. It allows the qualified coach to protect people and horses even when that means abandoning the original plan.`,
    keyPoints: [
      "A qualified lesson plan covers risk, suitability, aim, equipment, preparation, activity, adaptation, conclusion and evaluation",
      "Professional-assessment durations are not universal lesson timings",
      "The aim should be small, observable and state the current support",
      "Progression is optional and depends on qualified judgement, safety and horse welfare",
      "Incomplete checks or changed concerns close the activity rather than being worked around",
    ],
    safetyNote:
      "This structure does not qualify or authorise a learner to teach. Use it only within current professional, facility, insurance, consent and safeguarding arrangements. Do not copy fixed timings or exercises. Stop when checks are incomplete, control or supervision is unsafe, rider pain or distress develops, equipment is uncertain or the horse shows discomfort.",
    practicalApplication:
      "Under qualified supervision, create a fictional beginner lesson with one observable aim. Include safeguards, individual suitability, preparation, main activity, two simplifications, optional progression, aftercare, conclusion, evaluation and stop points without assigning universal minutes.",
    commonMistakes: [
      "Treating a structure as permission for an unqualified person to teach",
      "Copying qualification-assessment timings into every lesson",
      "Choosing a horse from a generic beginner-safe label",
      "Making progression compulsory because it appears in the plan",
      "Evaluating only the participant and not the horse, communication or controls",
    ],
    knowledgeCheck: [
      {
        question: "What makes a beginner lesson aim useful?",
        options: [
          "It is observable, suitable for the individual and states the current support",
          "It promises independence in one session",
          "It uses a fixed time for every participant",
          "It ignores the horse and environment",
        ],
        correctIndex: 0,
        explanation:
          "A bounded observable aim guides teaching and review without making a universal outcome claim.",
      },
      {
        question: "How should progression be handled?",
        options: [
          "As an optional qualified decision based on safety, welfare and the participant's response",
          "As a required final phase even when control is unsafe",
          "After a universal number of repetitions",
          "By removing all support on schedule",
        ],
        correctIndex: 0,
        explanation:
          "The coach may repeat, simplify or finish; the written plan never overrides current conditions.",
      },
      {
        question:
          "What should happen if a required preparation check is incomplete?",
        options: [
          "The activity must not proceed until the responsible person resolves it",
          "The coach should assume it passed",
          "The learner should test it while mounted",
          "A different fixed timing should replace the check",
        ],
        correctIndex: 0,
        explanation:
          "The structure is fail-closed: a missing safety or suitability check is not permission to continue.",
      },
    ],
    aiTutorPrompts: [
      "Help me write an observable beginner lesson aim with support stated",
      "Quiz me on the difference between lesson structure and fixed timing",
      "Give me a plan change and ask whether to repeat, simplify, stop or escalate",
    ],
  },

  "building-riding-confidence": {
    objectives: [
      "Discuss confidence as an individual experience without diagnosis or treatment claims",
      "Use small coach-approved steps, choice and honest reflection within safe riding conditions",
      "Recognise when anxiety or distress needs healthcare, safeguarding or emergency support",
    ],
    content: `## Confidence is individual

Confidence can change with the person, horse, task, environment and previous experience. Anxiety can also have many causes and effects. National Health Service guidance advises talking to someone, setting small targets, slowly building time in worrying situations and using comfortable calming breathing; it also says not to self-diagnose and to seek medical help when someone is struggling to cope. British Equestrian wellbeing material presents equestrian activity as something that can contribute to wellbeing and connection, not as a mental-health treatment.

This lesson supports non-clinical coaching reflection. A qualified riding coach works within coaching competence and the current safety and safeguarding arrangements. They do not diagnose anxiety, provide psychotherapy, prescribe exposure or claim that riding, a particular horse or an exercise will treat a health condition.

## Start with safety and choice

The qualified coach selects a suitable horse, inspected tack, rider equipment, area and support for the individual. Ask what the participant is comfortable sharing, what they would like to achieve and what currently feels manageable. Agree a stop signal and make it clear that the participant can pause or decline without shame.

Pain, dizziness, medication questions, panic symptoms, trauma, persistent anxiety or a health condition may require appropriate healthcare advice. Safeguarding concerns use the designated reporting route. Immediate danger or a medical emergency requires the relevant emergency service.

## Use small coach-approved steps

A small target should be observable and safely within the person's current ability, such as preparing equipment with the coach, standing near a suitable horse, mounting with approved assistance or completing a familiar task at the preceding safe level. The coach decides whether a mounted step is appropriate and keeps horse welfare central.

Do not force a participant into a feared situation, remove support to prove courage or use a universal progression ladder. Slowly building time in a worrying situation is an NHS self-help principle, but its use in riding must remain optional, coach-approved, safe and within health-professional advice where needed. If distress rises or safe control reduces, return to the agreed simpler step or stop.

## Breathing and attention

NHS guidance offers gentle, comfortable breathing as one possible calming tool. It should be unforced and must not use a fixed count presented as clinically necessary. A participant may choose to pause in a safe place, notice a comfortable breath and refocus on one clear coach instruction. Breathing does not prove that the person is safe to continue and must not delay healthcare or emergency help.

Other non-clinical supports may include clear information, predictable routines, observing first, an approved leader, extra time, a trusted support person within safeguarding arrangements or choosing a different goal. Ask what helps rather than assuming.

## Factual reflection

After a step, record the task, support, what the participant reported, what was observed, the horse's response and the coach's decision. Avoid labels such as cowardly, anxious type or cured. A useful reflection might be: “With leader support, the participant completed the agreed halt and chose to finish.” It does not infer a psychological cause or guarantee future performance.

Celebrate truthful progress, including a safe decision to stop. Confidence is not measured by height, speed, removed support or a fixed number of repetitions. The next step should be agreed with the participant and reviewed each time.

## Know the referral boundary

Encourage appropriate health support when anxiety persists, affects everyday life, causes significant distress or is difficult to cope with. A coach can listen, maintain boundaries, adapt the session and signpost through the organisation's procedure; they should not become the participant's therapist. Protect privacy, obtain consent for records or media and never promise secrecy in a safeguarding context.

The purpose is safe participation, autonomy and gradual learning—not a claim that fear has been eliminated.`,
    keyPoints: [
      "Confidence and anxiety vary by person and context; coaches must not diagnose or promise treatment",
      "Use suitable horses, equipment, support, a stop signal and genuine participant choice",
      "Small targets and optional gradual steps remain coach-approved and safety dependent",
      "Comfortable unforced breathing may help some people but is not a clinical test or permission to continue",
      "Persistent or life-impacting anxiety needs appropriate health support; safeguarding and emergencies use their designated routes",
    ],
    safetyNote:
      "Do not force exposure, remove support to prove courage, diagnose anxiety or claim riding is treatment. Use a suitable horse, qualified coach, agreed stop signal and safeguarding arrangements. Stop for unsafe distress, loss of control, pain or horse discomfort. Use appropriate healthcare support for persistent or life-impacting anxiety and emergency services for immediate danger.",
    practicalApplication:
      "Create a fictional confidence plan with one participant-chosen observable target, suitable horse and support, an optional simpler step, the stop signal, one unforced calming option, factual reflection language and the exact healthcare or safeguarding referral boundary.",
    commonMistakes: [
      "Treating confidence as a fixed personality trait or diagnosis",
      "Forcing a participant into a feared mounted task",
      "Using a fixed breathing count as treatment or a safety test",
      "Measuring courage by speed, height or removal of support",
      "Acting as a therapist or promising secrecy outside professional scope",
    ],
    knowledgeCheck: [
      {
        question: "What is a suitable confidence-building target?",
        options: [
          "A small participant-agreed and coach-approved step within current safe ability",
          "A forced exposure chosen without consent",
          "A universal height or speed target",
          "Removal of all support to prove courage",
        ],
        correctIndex: 0,
        explanation:
          "Small, optional and safe steps support learning while preserving participant choice and horse welfare.",
      },
      {
        question: "How may a calming breathing exercise be used?",
        options: [
          "As an optional comfortable unforced aid that never replaces safety or healthcare decisions",
          "As proof that the participant is medically safe",
          "With one clinically required count for everyone",
          "To delay help during an emergency",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed NHS guidance presents comfortable breathing as a self-help option, not diagnosis, treatment proof or emergency assessment.",
      },
      {
        question: "When should a coach signpost to health support?",
        options: [
          "When anxiety persists, significantly affects life or is difficult for the participant to cope with",
          "Whenever a rider asks for leader support",
          "Only after forced exposure fails",
          "Never, because riding treats anxiety",
        ],
        correctIndex: 0,
        explanation:
          "The coach stays within non-clinical scope and routes significant or persistent anxiety to appropriate health support.",
      },
    ],
    aiTutorPrompts: [
      "Help me write a participant-chosen confidence step without treatment claims",
      "Quiz me on coach scope versus healthcare support",
      "Give me a scenario where stopping safely is genuine progress",
    ],
  },

  "safe-approach-and-catching": {
    objectives: [
      "Describe a reviewed slow approach towards the shoulder with horse-specific supervision",
      "Use authorised halter and lead-rope handling without universal fitting or difficult-horse techniques",
      "Recognise when catching or release must stop and pass to a qualified handler",
    ],
    content: `## Scope and individual procedure

Approaching and catching a horse is a practical handling task that depends on the individual horse, location, equipment and handler competence. Penn State Extension advises approaching slowly and confidently from the front towards the shoulder, speaking so the horse is aware of the handler and avoiding approach from the rear. It supports use of a halter and lead rope, never wrapping the rope around a hand, and seeking an experienced equine professional when problems occur. Horse behaviour and circumstances vary, so this lesson is not a universal catching recipe.

University of Kentucky and Mississippi State Extension ground-safety guidance reinforces beginner instruction, familiar safe practices, suitable lead-rope use, handler space and turning a horse towards the gate or doorway before release. It does not authorise a learner to chase, corner, lure, restrain or independently solve a horse that cannot be caught.

## Prepare the environment

Confirm the responsible person, the horse's current handling plan, the authorised equipment and whether the learner may enter the area. Check gates, other horses, footing, public access and an escape route. Wear the protective equipment required by the current risk assessment. Do not enter a field or enclosure alone when supervision, another handler or a different arrangement is required.

Observe the horse from outside the immediate space. Report factual changes in posture, movement or location without interpreting them as dominance, trust, aggression, pain or a diagnosis. The responsible person decides whether the horse is suitable to approach.

## Approach

Under competent supervision, move slowly from the front towards the shoulder and speak calmly so the horse is aware of you. Avoid standing directly in front, behind or in a trapped position. Keep the approved route back to safety. The exact distance, body angle, eye contact and pace depend on the horse and the responsible handler; this lesson sets no universal number or body-language rule.

If the horse moves away, becomes tense, threatens safety or another horse changes the situation, stop and follow the current plan. Do not chase, block escape, use food without permission or push the horse into a smaller area.

## Fit authorised equipment

Only use the halter or headcollar and lead rope authorised for that horse. Learn the sequence hands-on from a competent handler. This lesson does not provide a universal finger-gap, strap order or adjustment measurement and does not authorise equipment substitution. Keep fingers clear of fittings and never wrap the lead rope around the hand, wrist or body.

Once attached, use the taught shoulder position and handler space. The responsible person confirms fit and decides whether the horse may be led. If equipment is damaged, uncertain or cannot be fitted without unsafe contact, stop.

## Difficult catching and professional boundary

A horse may not approach or may move away for many reasons. Do not diagnose the reason or apply a reward, pressure, chasing or training programme from this lesson. Repeated difficulty, sudden change or possible discomfort belongs with the responsible person and, where appropriate, a qualified behaviour professional or veterinarian.

If the horse cannot be caught within the approved simple process, leave the area safely and escalate. A successful outcome can be a safe decision not to proceed.

## Release

At a gate or doorway, use the facility's current trained procedure. Reviewed guidance supports turning the horse towards the exit direction before release and maintaining handler space. The exact barrier, latch and release order depends on the environment and responsible person. Do not copy the process into an unfamiliar field, release into other horses without the plan or remain within kicking distance.

## Review

Record the authorised equipment, location, approach outcome, factual horse response, any stop and who was notified. Avoid statements such as “the horse was stubborn” or “the treat fixed trust.” Safe catching is built through consistent qualified handling and respect for the individual horse, not a generic trick.`,
    keyPoints: [
      "Approach slowly from the front towards the shoulder, speak to the horse and avoid the rear",
      "Use only authorised fitted equipment under competent instruction and never wrap the rope around the body",
      "Distances, eye contact, fitting gaps and catching responses are horse- and site-specific",
      "Do not chase, corner, lure without permission or independently manage a difficult horse",
      "Turn towards the gate or doorway before release under the current trained procedure and keep a safe exit route",
    ],
    safetyNote:
      "Practise only with a suitable horse, authorised equipment, checked environment and competent supervision. Never approach from the rear, wrap the lead rope around the body, chase, corner, restrain or improvise difficult-horse methods. Stop for horse tension, unsafe movement, damaged equipment or changed surroundings and use the responsible qualified handler or veterinary/behaviour route.",
    practicalApplication:
      "With a competent instructor and approved calm horse, rehearse the area and escape-route check, supervised approach towards the shoulder and authorised equipment handover. Explain the exact points where the learner must stop rather than chase or improvise.",
    commonMistakes: [
      "Approaching from behind or standing in a trapped position",
      "Using fixed eye-contact, distance or finger-gap rules for every horse",
      "Wrapping the lead rope around a hand or body",
      "Chasing, cornering or using food without the responsible person's plan",
      "Diagnosing why a horse is difficult to catch",
    ],
    knowledgeCheck: [
      {
        question: "What is the reviewed approach direction?",
        options: [
          "Slowly from the front towards the shoulder while speaking calmly",
          "Quickly from directly behind",
          "Directly at the horse's head with no escape route",
          "From any direction using the same fixed distance",
        ],
        correctIndex: 0,
        explanation:
          "Penn State Extension supports a slow approach from the front towards the shoulder and avoiding the rear.",
      },
      {
        question:
          "What should a learner do if the horse cannot be caught within the approved simple process?",
        options: [
          "Leave safely and escalate to the responsible qualified handler",
          "Chase until the horse stops",
          "Corner the horse in a smaller area",
          "Invent a pressure-and-reward programme",
        ],
        correctIndex: 0,
        explanation:
          "Difficult catching requires horse-specific qualified assessment, not an improvised learner technique.",
      },
      {
        question: "Which release principle is source-supported?",
        options: [
          "Use the current procedure and turn the horse towards the gate or doorway before release",
          "Release while the horse faces away from the gate in every setting",
          "Stand close behind the horse after release",
          "Use one latch sequence for every facility",
        ],
        correctIndex: 0,
        explanation:
          "Turning towards the exit and maintaining handler space are supported, while the exact barrier sequence remains site-specific.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on safe approach direction and handler space",
      "Give me a difficult-catching scenario and ask when to stop",
      "Help me separate horse observation from a behaviour diagnosis",
    ],
  },

  "tying-up-safely": {
    objectives: [
      "Explain why tying requires a horse-specific site procedure, competent instruction and supervision",
      "Describe reviewed quick-release, sturdy tie-point and entanglement-prevention principles",
      "Use emergency stop and escalation boundaries without fixed measurements or pull-back training",
    ],
    content: `## Tying is a supervised practical skill

Tying a horse creates restraint and entanglement risks and must be taught in person by a competent handler using the current site procedure. Mississippi State University Extension, University of Kentucky and Penn State Extension support a quick-release knot, a sturdy tie point, attention to rope length and supervision. Their guidance provides context, not a universal centimetre measurement, guarantee that any knot will release under every load, or permission for a learner to manage a horse that pulls back.

This lesson teaches preparation, observation and professional boundaries. It does not provide an independent knot tutorial, prescribe baler twine or another breakaway material, specify a fixed height or length, or teach punishment, pressure or pull-back remediation.

## Decide whether tying is permitted

The responsible person decides whether the individual horse may be tied, where, with what equipment and under whose supervision. Some horses, tasks or locations require a handler to hold the horse or another approved arrangement. A history of pulling back, panic, unfamiliarity, pain, damaged equipment or an unsuitable area is a stop and escalation point.

Check the horse's authorised halter or headcollar and lead rope, the tie point, surrounding fittings, doors, vehicles, other horses, public access, footing and escape route. Remove or control entanglement hazards only within authority. Do not tie to a movable, sharp, weak, electrical or otherwise unapproved object.

## Competent setup

The competent instructor selects the tie point and demonstrates the site's approved quick-release method. The setup should limit avoidable entanglement while allowing the horse the movement judged appropriate for that horse and task. Exact height, rope length and material depend on the horse, equipment, structure and procedure; do not copy a measurement.

The release end must remain accessible under the current design, but no knot or device is guaranteed to release instantly in every emergency or while heavily loaded. The incident plan may require cutting equipment or another trained response using authorised tools. A learner should know whom to call and where to move, not improvise.

## Supervision while tied

Remain within the supervision arrangement and observe without standing in a trapped position. Do not leave the horse unattended, sit on the ground, step over or under the rope, wrap rope around the body, or place equipment where the horse can become entangled. Keep other people and horses at the distance required by the site plan.

The handler may complete an authorised task such as basic grooming only if the horse remains comfortable and the setup remains safe. Changes in posture, pulling, pawing, equipment movement or surrounding activity should be reported factually. Do not diagnose the behaviour or punish it.

## Pull-back or emergency response

If the horse pulls back or panics, protect people, avoid entering the tensioned rope's danger area and follow the current emergency procedure. Do not stand in front, grab loaded hardware, wrap the rope tighter, shout, strike or attempt an untrained release. The responsible qualified handler directs release, containment and follow-up.

A horse that pulls back or becomes distressed needs horse-specific review. Equipment fit, pain, previous learning, environment and behaviour may all be relevant and require the appropriate veterinarian, qualified behaviour professional or competent handler. This lesson does not select a cause or training plan.

## Finish and record

Release only when directed and positioned under the current procedure. Check the horse and equipment through the authorised process and report any factual concern. Record the location, setup, task, observation, action and person notified without diagnosis. Safe tying is demonstrated by consistent supervised preparation and a reliable emergency boundary, not by a horse remaining tied for a target time.`,
    keyPoints: [
      "The responsible person decides whether, where and how the individual horse may be tied",
      "Use a sturdy approved tie point and the site's competently taught quick-release method",
      "Exact rope length, height and breakaway material are not universal",
      "A tied horse remains supervised and the area must minimise entanglement and trapping",
      "Pull-back or panic uses the current emergency procedure and qualified follow-up, not punishment or learner remediation",
    ],
    safetyNote:
      "Do not tie a horse without competent in-person instruction, site authority and supervision. Never use an unapproved object, copied measurement or improvised breakaway material; never enter a tensioned rope's danger area or grab loaded hardware. For pull-back or panic, protect people and follow the current emergency and qualified-handler procedure.",
    practicalApplication:
      "Using instructor-provided equipment without a live horse, identify approved versus unsafe tie points, state the pre-checks and emergency contact route, and explain why the competent instructor—not a copied measurement—sets rope length and release method.",
    commonMistakes: [
      "Assuming every horse may be tied",
      "Using a fixed height, rope length or breakaway material in every setting",
      "Believing a quick-release knot is guaranteed to open under every load",
      "Leaving the horse unattended or entering the rope's danger area",
      "Punishing or independently retraining a horse that pulls back",
    ],
    knowledgeCheck: [
      {
        question: "Who decides the tying setup for an individual horse?",
        options: [
          "The responsible competent person using the current horse- and site-specific procedure",
          "Any learner using a universal measurement",
          "The first person to find a rope",
          "A generic diagram without inspecting the location",
        ],
        correctIndex: 0,
        explanation:
          "Horse, equipment, structure, task and history all affect the safe setup and require competent judgement.",
      },
      {
        question: "What does quick-release mean in this lesson?",
        options: [
          "An approved method intended to support release, without guaranteeing opening under every emergency load",
          "A knot guaranteed to release instantly in every circumstance",
          "Permission to leave the horse unattended",
          "A fixed type of improvised breakaway material",
        ],
        correctIndex: 0,
        explanation:
          "The incident plan must account for the fact that knots and hardware may be loaded or inaccessible.",
      },
      {
        question: "What should a learner do if a tied horse pulls back?",
        options: [
          "Protect people, avoid the tensioned-rope area and follow the current emergency procedure",
          "Grab the loaded fitting",
          "Stand directly in front and pull harder",
          "Punish the horse and repeat the setup",
        ],
        correctIndex: 0,
        explanation:
          "Pull-back creates serious rope and hardware risk and requires the trained site response and qualified follow-up.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on tying preparation and entanglement hazards",
      "Explain why quick-release is not a guarantee",
      "Give me a pull-back scenario and ask for the safe emergency boundary",
    ],
  },

  "lungeing-basics": {
    objectives: [
      "Explain why lungeing is a trained professional competency rather than a self-teaching exercise",
      "Identify the horse, handler, equipment, environment and welfare decisions in a qualified lunge plan",
      "Recognise stop points and refer concerns without diagnosing movement or behaviour",
    ],
    content: `## Professional scope

Lungeing places a horse on a circle around a handler and can involve specialised equipment, positioning, timing and control. The British Horse Society Stage 3 Lunge syllabus treats handler protective equipment, horse welfare, equipment safety and fit, appropriate circle size, handler–horse–whip position, commands and aids, duration, surroundings, horse suitability and safe control as assessed professional competencies. The Stage 2 Coach syllabus also places suitability, risk, safety, welfare and progression within qualified coaching.

These sources do not turn a written lesson into a public lungeing procedure. This lesson therefore explains decisions and boundaries. It does not specify a line length, circle diameter, triangle position, whip angle, verbal cue, pace sequence, duration or training outcome, and it does not authorise an untrained learner to lunge a horse.

## Decide whether lungeing is appropriate

The responsible qualified professional considers the purpose, horse's current health and welfare, age and training, behaviour, fitness, footing, enclosure, weather, equipment, handler competence and other people or horses. Veterinary or rehabilitation plans may control whether and how the horse works. A general lesson cannot decide that lungeing is suitable exercise, treatment, assessment or preparation for an individual horse.

If the horse appears uncomfortable, unsound, distressed, unusually reactive or unable to work safely, do not lunge to test the concern. Stop and use the responsible-person and veterinary or qualified behaviour route.

## Equipment and environment

The qualified professional selects, fits and checks the horse's equipment for the intended method and current plan. The handler uses the protective equipment required by the risk assessment. Do not improvise attachments, route a line through tack, select a bit, use side reins or another training aid, or copy a generic fitting configuration.

The area must be suitable for the horse, exercise and handler, with safe footing, secure boundaries, controlled access and sufficient space as judged by the professional. There is no universal circle measurement in this lesson. The professional manages gates, other users, loose equipment and emergency access before work starts.

## Observe a qualified demonstration

A learner may observe how the qualified handler maintains safe control, organises equipment, communicates, monitors horse welfare and adapts or stops. The learner should focus on decision points rather than copying hand, line or whip mechanics. Ask why the professional selected the horse, method, area and level of work and what would make the plan change.

Factual observation includes the task, direction, pace requested by the professional, changes in rhythm or behaviour, surface and the handler's decision. It must not become a gait diagnosis, lameness assessment, pain conclusion or claim that an exercise strengthens a named structure.

## Control and emergency boundaries

Line entanglement, horse escape, loss of handler control, equipment failure or a person entering the area can create immediate risk. The qualified professional's site-specific procedure governs stopping, release, containment and emergency response. A learner must not wrap the line around a hand or body, enter the circle, grab loaded equipment, chase a loose horse or improvise an emergency technique.

If observation or assistance is authorised, the learner stays in the assigned safe position and follows the stop instruction. Protect people first and use emergency services where the plan requires.

## Duration, progression and review

The professional decides duration, changes of direction or pace, rest and progression for the individual horse. Do not copy a time, number of circles or gait sequence. Fatigue, surface, behaviour and horse response are continually reviewed, and the plan may end early.

After an authorised demonstration, record the stated purpose, qualified decisions, equipment check, environment, factual horse response, changes and stop points. Do not claim competence to lunge or reproduce the exercise. Further practical learning requires formal qualified instruction with a suitable horse and controlled setting.`,
    keyPoints: [
      "Lungeing is an assessed professional competency and not a self-teaching procedure",
      "Horse suitability, welfare, equipment, handler competence, area and purpose require qualified decisions",
      "This lesson gives no line, circle, position, cue, duration or progression recipe",
      "Observe factual professional decisions without diagnosing gait, pain, behaviour or training effects",
      "Entanglement, loss of control, equipment failure or horse concern requires the current qualified emergency response",
    ],
    safetyNote:
      "Do not lunge a horse from this lesson. Practical lungeing requires qualified instruction, suitable horse and area, professionally selected and fitted equipment, handler protective equipment and current emergency controls. Never wrap a line around the body, enter the circle, copy training-aid configurations, diagnose movement or use lungeing to test suspected pain.",
    practicalApplication:
      "Observe an instructor-approved video or live demonstration by a qualified professional. Record the suitability, equipment, environment, welfare and stop decisions without reproducing hand, line, whip, cue, circle, pace or duration instructions.",
    commonMistakes: [
      "Treating a syllabus topic as a public self-teaching protocol",
      "Copying a line length, circle size, cue or duration",
      "Improvising equipment or training aids",
      "Diagnosing movement, pain or behaviour from circle work",
      "Entering the circle or handling a loaded line during loss of control",
    ],
    knowledgeCheck: [
      {
        question: "Who should design and conduct a lungeing session?",
        options: [
          "An appropriately qualified professional using an individual horse and site assessment",
          "Any learner who has read a written summary",
          "A spectator copying a video",
          "A rider using a universal line and circle measurement",
        ],
        correctIndex: 0,
        explanation:
          "The reviewed syllabus treats lungeing as a professional competency involving safety, equipment, welfare and control.",
      },
      {
        question:
          "What should a learner record during a qualified demonstration?",
        options: [
          "The purpose, conditions, factual observations, professional decisions and stop points",
          "A diagnosis of lameness from the circle",
          "A universal whip angle and verbal cue",
          "A training-aid configuration to copy later",
        ],
        correctIndex: 0,
        explanation:
          "Observation can support learning about decisions without creating a self-directed procedure or diagnosis.",
      },
      {
        question: "What is the correct response to loss of line control?",
        options: [
          "Follow the qualified handler's current emergency procedure and protect people",
          "Wrap the line around the hand",
          "Enter the circle to catch the horse",
          "Pull loaded equipment with body weight",
        ],
        correctIndex: 0,
        explanation:
          "Line and horse-control emergencies require the trained site response; improvised handling can increase risk.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on why lungeing needs qualified practical instruction",
      "Help me identify professional decisions in a demonstration without copying technique",
      "Give me a lungeing concern and ask where the stop boundary is",
    ],
  },

  "long-reining-introduction": {
    objectives: [
      "Explain the evidentiary and professional limits of an introduction to long-reining",
      "Identify the suitability, equipment, environment, welfare and risk decisions reserved for a qualified professional",
      "Observe and report a demonstration without copying a procedural configuration",
    ],
    content: `## Why this lesson is deliberately non-procedural

Long-reining involves controlling a horse from the ground with long lines and can place people, lines and equipment around or behind the horse. The reviewed British Horse Society Stage 2 Coach syllabus supports professional decisions about horse and participant suitability, equipment, environment, risk, safety, welfare, safeguarding, response to concerns and referral. It does not provide a public long-reining procedure, line route, equipment configuration, handler position, distance, contact, cue sequence or progression.

The responsible evidence boundary is therefore explicit: this lesson introduces the decision framework and vocabulary of professional scope but does not teach anyone to long-rein a horse. Practical learning requires an appropriately qualified professional, a suitable experienced horse, controlled environment, correctly selected and fitted equipment and current emergency arrangements.

## Suitability comes first

The qualified professional decides whether long-reining serves a legitimate purpose in the horse's current plan. They consider health and welfare, training history, behaviour, fitness, equipment familiarity, environment, other people or horses and the competence of everyone involved. A learner must not choose long-reining as exercise, rehabilitation, desensitisation, ridden preparation or behaviour training from a generic description.

If the horse appears uncomfortable, unsound, distressed, unfamiliar with the setup or unsafe to handle, do not use the activity to test the concern. Stop and use the responsible-person, veterinary or qualified behaviour route.

## Equipment and line risk

The professional selects and fits every item and chooses the line route for the individual method and horse. This lesson intentionally does not name a universal bridle, bit, roller, surcingle, saddle, training aid or attachment. Manufacturer instructions and qualified fitting still apply.

Long lines can entangle a person or horse, become loaded, catch on equipment or transfer unexpected force. Never wrap a line around a hand or body, step into a loop, stand in an assigned danger area, route a line through equipment or attempt to release loaded hardware. The site's qualified emergency plan controls any line, horse-escape or equipment incident.

## Environment and roles

The qualified professional chooses a secure area with suitable footing, access control, visibility and emergency space. There is no universal minimum size, distance from the horse or handler track in this lesson. Gates, other users, dogs, vehicles, machinery and loose objects must be managed.

Roles are agreed before a demonstration: who handles the horse, who controls lines, who observes, who opens a gate and who calls for help. An observer remains in the assigned safe position and does not walk behind the horse, cross lines or take hold unless the professional explicitly directs a trained role.

## What an observer can learn

Observe how the professional checks suitability, prepares the environment, inspects equipment, communicates, protects horse welfare and decides to adapt or stop. Record neutral facts such as the purpose stated by the professional, the conditions, the horse's visible response and the decision made. Do not transcribe hand placement, contact, line routing, distance, pace or cue as a procedure to use independently.

Avoid claimed outcomes such as “this builds collection,” “this corrects crookedness” or “this rehabilitates the back” unless an appropriate qualified source and individual plan establish the specific use. A short response does not prove training effect or diagnosis.

## Stop and escalation boundaries

Stop the demonstration if the qualified professional loses safe control, equipment shifts or fails, a line tangles, someone enters the working area, footing changes, the horse appears uncomfortable or behaviour creates risk. The professional directs the emergency response. Observers protect themselves and call for help as assigned rather than grabbing horse or lines.

Healthcare, rehabilitation, lameness or pain decisions belong to the veterinarian and relevant qualified professionals. Behaviour concerns require appropriate qualified assessment. Safeguarding and consent apply to participants and recordings.

## Next steps

An introduction is complete when the learner can explain why long-reining requires qualified practical teaching, identify the decision categories and recognise the no-copy boundary. It does not certify competence. Any future practical session begins again with current horse, person, equipment, environment, risk and welfare assessment.`,
    keyPoints: [
      "The reviewed source supports professional safety and suitability decisions, not a public long-reining procedure",
      "A qualified professional selects the horse, purpose, equipment, line route, environment and roles",
      "Lines create entanglement and loading hazards; observers must not copy or handle the setup",
      "Observe welfare and professional decisions without recording a technique recipe or claimed treatment effect",
      "Practical competence requires separate qualified instruction and cannot be awarded by this lesson",
    ],
    safetyNote:
      "Do not attempt long-reining from this material. Do not select or route equipment, handle long lines, stand behind the horse, enter loops, grab loaded hardware or copy a demonstration. Observe only from the qualified professional's assigned safe position with a suitable horse, controlled area and current emergency plan.",
    practicalApplication:
      "Observe an instructor-approved professional demonstration or video. Produce a decision map covering purpose, horse suitability, equipment authority, environment, roles, welfare and stop points while deliberately excluding line routing, contact, position, distance, cues and progression.",
    commonMistakes: [
      "Treating an introduction as practical authorisation",
      "Copying a line route, handler position or equipment configuration",
      "Standing behind the horse or inside line loops",
      "Claiming a training or rehabilitation result from a short observation",
      "Trying to grab lines or equipment during loss of control",
    ],
    knowledgeCheck: [
      {
        question: "What does this introduction teach?",
        options: [
          "The professional decision and safety boundaries around long-reining",
          "A complete line-routing procedure",
          "A universal equipment setup",
          "Independent practical competence",
        ],
        correctIndex: 0,
        explanation:
          "The reviewed source supports professional scope and safety decisions but not a public procedural protocol.",
      },
      {
        question: "What may an observer safely record?",
        options: [
          "The purpose, conditions, suitability, welfare observations, professional decisions and stop points",
          "A line route to reproduce alone",
          "A fixed handler distance",
          "A guaranteed rehabilitation effect",
        ],
        correctIndex: 0,
        explanation:
          "Decision-focused observation preserves the evidentiary boundary and avoids creating an unsafe recipe.",
      },
      {
        question: "Who selects and fits the long-reining equipment?",
        options: [
          "The appropriately qualified professional for the individual horse and method",
          "Any observer using a diagram",
          "The learner after completing this knowledge check",
          "A universal list in a general lesson",
        ],
        correctIndex: 0,
        explanation:
          "Equipment and line routing are method- and horse-specific professional decisions with significant safety implications.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on the non-procedural boundary of this lesson",
      "Help me make a decision map without including line technique",
      "Give me a demonstration scenario and ask what makes it stop",
    ],
  },

  "advanced-groundwork-exercises": {
    objectives: [
      "Evaluate whether advanced groundwork belongs within an individual qualified plan",
      "Separate factual observations from claimed biomechanical, behavioural or rehabilitation effects",
      "Use horse-welfare, handler-safety and professional referral boundaries",
    ],
    content: `## Advanced does not mean self-directed

Advanced groundwork can describe many in-hand, conditioning, training or rehabilitation activities. World Horse Welfare material on building strength through groundwork and bringing horses back into work presents these as expert-led subjects and says return-to-work plans must be tailored and adapted to the individual horse, with expert help where health or readiness is uncertain. British Horse Society horse-fitness guidance likewise supports slow, practical, individual plans and professional help for concerns.

Those sources do not establish a universal in-hand collection, lateral-work, pole, whip, rehabilitation or behaviour procedure. This lesson therefore teaches evaluation and observation. It does not prescribe an exercise, distance, duration, repetition, cue, equipment configuration or promised biomechanical result.

## Define the purpose and professional team

The responsible qualified professional states why groundwork is being considered and who holds the relevant decisions. A veterinarian controls medical diagnosis and rehabilitation restrictions. A suitably qualified rehabilitation, physiotherapy, coaching, behaviour, farriery or tack professional may contribute within scope. The horse's owner or responsible person authorises the plan and the current facility controls the environment.

Do not use “strength,” “suppleness,” “collection,” “rehabilitation” or “confidence” as a vague justification. The plan should identify an individual observable aim, current restrictions, welfare measures, equipment, handler competence, stop points and review route. A general learner cannot decide that an exercise treats weakness, pain or asymmetry.

## Suitability and preparation

Review the horse's current health, comfort, handling history, behaviour, fitness, footing, environment and equipment with the appropriate professionals. Sudden behaviour change, suspected pain, lameness, illness, injury or uncertainty about readiness is a stop and veterinary or relevant qualified-professional referral—not a reason to test the horse with groundwork.

Use a controlled area, current risk assessment, suitable protective equipment and defined roles. Any pole, obstacle, line, whip or training aid introduces hazards and requires qualified selection and setup. This lesson provides no layout or handling instruction.

## Observe without diagnosing

A learner may record the professional's stated aim, exercise category, conditions, factual horse responses and decisions. Useful observations include where a change occurred, the direction, task and whether the professional simplified or stopped. Avoid conclusions that a named muscle strengthened, a joint mobilised, the horse submitted, pain resolved or behaviour was corrected.

Movement and behaviour can have multiple causes. One repetition or short session cannot prove a training or rehabilitation effect. Progress requires the professional team's chosen measures and review period; this lesson gives no fixed schedule.

## Welfare and learning

World Horse Welfare guidance supports individual tailoring and adjustment. The professional monitors the horse and may change or end the plan based on comfort, fatigue, behaviour, surface or other conditions. Work should not continue to meet a copied target, create a dramatic response or demonstrate handler authority.

Pressure, reward and equipment use belong to an appropriate qualified training plan. Do not punish confusion, escalate force, flood the horse with a feared stimulus or claim that one body-language sign proves consent, dominance or learned helplessness. If behaviour creates danger, protect people and use the current incident and qualified behaviour route.

## Rehabilitation boundary

Rehabilitation is veterinary-led where health or injury is involved. The veterinarian and relevant professionals determine whether exercise is allowed, what work is appropriate, and when the plan changes. A learner must not substitute groundwork for veterinary assessment, change a prescribed plan or add a popular exercise.

## Review and next decision

After an authorised observation, record the stated purpose, professional roles, conditions, factual response, adaptations, stop points and follow-up. Ask which evidence the professional uses to continue, simplify or refer. Completion of this lesson means the learner can protect the boundary; it does not certify practical advanced-groundwork competence.`,
    keyPoints: [
      "Advanced groundwork and return-to-work planning must be tailored and expert-led",
      "Health, pain, lameness and rehabilitation decisions require veterinary and relevant qualified input",
      "This lesson gives no exercise, equipment, distance, duration, cue or repetition procedure",
      "Record factual responses and professional decisions without claiming biomechanical or behavioural outcomes",
      "Welfare, handler safety and the current incident plan override any exercise target",
    ],
    safetyNote:
      "Do not perform an advanced groundwork or rehabilitation exercise from this lesson. Use an individual veterinary or qualified-professional plan, controlled environment, suitable equipment and competent handling. Stop for pain, lameness, sudden behaviour change, fatigue, equipment or surface concern, or loss of control; never escalate force or improvise a rehabilitation programme.",
    practicalApplication:
      "Review an instructor-provided fictional groundwork proposal. Identify its claimed purpose, required professional roles, missing suitability evidence, equipment/environment risks, factual observations, prohibited causal claims and the stop or referral decision.",
    commonMistakes: [
      "Selecting a popular exercise without an individual qualified plan",
      "Claiming a named muscle, joint or behaviour changed from a short observation",
      "Using groundwork to test suspected pain or lameness",
      "Changing a veterinary rehabilitation plan without authority",
      "Escalating force when the horse is confused or distressed",
    ],
    knowledgeCheck: [
      {
        question:
          "Who decides whether advanced groundwork is suitable for rehabilitation?",
        options: [
          "The veterinarian and relevant qualified professionals within the individual plan",
          "Any learner using a generic exercise",
          "A social-media demonstration",
          "The equipment manufacturer alone",
        ],
        correctIndex: 0,
        explanation:
          "Health and rehabilitation work requires veterinary-led individual assessment and appropriate professional collaboration.",
      },
      {
        question: "Which is a factual observation?",
        options: [
          "The professional stopped after the horse changed rhythm on the left turn",
          "The exercise strengthened the horse's core",
          "The horse submitted to the handler",
          "The movement cured the asymmetry",
        ],
        correctIndex: 0,
        explanation:
          "The first statement records events and a decision; the others claim unsupported biomechanical, behavioural or clinical outcomes.",
      },
      {
        question: "What should happen when pain or readiness is uncertain?",
        options: [
          "Stop and obtain the appropriate veterinary or qualified-professional review",
          "Test the horse with a harder exercise",
          "Add fixed repetitions",
          "Change the rehabilitation plan independently",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance says individual plans must be adapted and expert help is needed when health or readiness is uncertain.",
      },
    ],
    aiTutorPrompts: [
      "Help me identify unsupported outcome claims in a groundwork plan",
      "Quiz me on veterinary versus coaching scope",
      "Give me a groundwork scenario and ask whether to continue, simplify or refer",
    ],
  },

  "understanding-equine-digestion": {
    objectives: [
      "Explain the practical feeding implications of an individual forage-led plan without diagnosing digestion",
      "Use factual feed, water, appetite and management records for qualified review",
      "Recognise digestive or welfare concerns that require prompt responsible-person or veterinary escalation",
    ],
    content: `## A practical, non-clinical introduction

Understanding equine digestion at learner level should support safe feeding records and professional decisions, not self-diagnosis. World Horse Welfare and British Horse Society feeding guidance describe horses as adapted to a forage-led pattern of eating, with individual requirements influenced by size, condition, workload, health and management. They emphasise clean feed and water, gradual changes and veterinary or qualified nutrition support where needed.

This lesson does not teach digestive anatomy beyond that practical context, quantify acid production or fibre fermentation, rank causes of colic, prescribe a transition calendar or tell a learner how to treat digestive signs. The written individual feeding plan and current professional advice remain authoritative.

## Forage-led eating and individual needs

Forage is the foundation of many horse diets, but the suitable type, amount, presentation and access depend on the individual horse and plan. Grazing, hay and haylage differ, and health or management needs may require specialist analysis or restriction. A learner must not assume that unlimited access, a copied bodyweight percentage or a particular forage is appropriate for every horse.

The responsible person and qualified nutrition or veterinary professional consider body condition, weight trend, workload, dental and health status, pasture, conserved forage, other feed and management. The learner follows the labelled, measured and recorded plan rather than calculating or changing a ration from this lesson.

## Feed changes

Reviewed guidance supports gradual feed changes. The exact transition depends on what is changing, the horse and professional plan, so no universal number of days is given here. Do not switch forage, concentrate, supplement, turnout or meal routine independently. Record the authorised change and the horse's factual response for the responsible team.

A change in supply, forage batch, appetite, water access, droppings, behaviour or condition may be relevant, but none is a diagnosis on its own. Use the current escalation process rather than selecting a digestive cause.

## Water and hygiene

Clean, fresh water access is essential and must be checked under the current individual and yard plan. Containers, automatic systems and natural sources have different hazards and require responsible-person review. A learner should record access or a visible problem but must not diagnose dehydration from a single sign, force water, add electrolytes or change management without direction.

Feed should be stored, prepared and offered under current hygiene, label and contamination controls. Report mould, foreign material, damage, pests, an unexpected product or a label mismatch. Do not taste feed, use an unlabelled product or decide from appearance alone that a feed is safe.

## Factual observation and records

Useful authorised records include feed identity and batch where the system requires it, amount offered according to the plan, amount left, water-access issue, appetite change, droppings observation, turnout or workload change and who was notified. Separate observation from interpretation. “Half the labelled evening feed remained” is factual; “the horse has an ulcer” is a diagnosis.

Records help the responsible person, veterinarian or qualified nutrition professional see patterns. They do not authorise the learner to withhold feed, walk the horse, add a product or wait for more signs.

## Digestive concern and escalation

Abdominal pain or colic signs can arise from different conditions and require prompt veterinary assessment under the current emergency plan. Do not diagnose severity, decide whether signs are mild, administer medication, force movement, remove or offer feed, or delay the veterinary call to complete observations. Protect people and follow the veterinary practice's current directions.

Sudden appetite change, repeated altered droppings, weight or condition concern, difficulty eating, behaviour change or a feeding error also needs responsible-person review and may need veterinary or nutrition input. The professional determines urgency and action.

## Review a feeding decision safely

When studying a fictional case, identify what the written plan says, what changed, which facts are known, what is outside learner authority and which professional route applies. The educational goal is disciplined observation and safe escalation, not a universal explanation of the digestive system.`,
    keyPoints: [
      "Reviewed guidance supports forage-led, individual feeding with clean feed and water",
      "Feed changes should be gradual under the current professional plan, without a universal transition calendar",
      "Learners record authorised facts and do not diagnose from appetite, droppings, behaviour or condition",
      "Ration, supplement, water and management changes belong to the responsible qualified team",
      "Possible colic or other urgent digestive concern requires prompt veterinary contact and current directions",
    ],
    safetyNote:
      "Do not diagnose digestive disease, change feed or forage, add supplements or electrolytes, force water or movement, administer medication, or delay veterinary contact. Follow the written individual plan and current responsible-person or veterinary directions. Possible colic or significant concern uses the emergency veterinary route immediately.",
    practicalApplication:
      "Review an instructor-provided fictional feeding record. Separate facts from diagnostic claims, identify the authorised plan, note any feed/water/hygiene change, state what the learner must not alter and choose the responsible-person, nutrition or veterinary escalation route.",
    commonMistakes: [
      "Using digestive anatomy claims to diagnose a feeding concern",
      "Applying one forage amount or transition period to every horse",
      "Changing feed, turnout, water or supplements from a general lesson",
      "Treating appetite or droppings as a stand-alone diagnosis",
      "Delaying veterinary contact while collecting more colic observations",
    ],
    knowledgeCheck: [
      {
        question: "What is the safe role of this digestion lesson?",
        options: [
          "To support individual-plan feeding records, factual observation and professional escalation",
          "To diagnose digestive disease",
          "To prescribe a universal ration",
          "To teach a home colic treatment",
        ],
        correctIndex: 0,
        explanation:
          "The lesson keeps practical feeding implications while reserving diagnosis and diet decisions for the responsible qualified team.",
      },
      {
        question: "How should a feed change be made?",
        options: [
          "Gradually according to the individual written plan and current professional advice",
          "Immediately using one universal calendar",
          "Whenever a learner prefers a different product",
          "Without recording the product or response",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance supports gradual changes, but the exact plan depends on the horse and change.",
      },
      {
        question: "What should happen if possible colic signs are observed?",
        options: [
          "Use the current emergency plan and contact the veterinarian promptly",
          "Diagnose severity from a checklist",
          "Administer medication before calling",
          "Delay contact until feed and exercise experiments are completed",
        ],
        correctIndex: 0,
        explanation:
          "Colic is a non-diagnostic emergency concern and interim actions must follow the veterinary practice's advice.",
      },
    ],
    aiTutorPrompts: [
      "Help me separate a feeding observation from a digestive diagnosis",
      "Quiz me on individual plans and gradual change boundaries",
      "Give me a possible colic scenario and ask what not to do before veterinary advice",
    ],
  },

  "types-of-feed": {
    objectives: [
      "Distinguish forage, concentrate and balancer categories without claiming universal suitability",
      "Use product identity, label, quality and hygiene checks within an individual feeding plan",
      "Escalate feed, water, health or contamination concerns to the responsible qualified team",
    ],
    content: `## Categories are not prescriptions

Feed categories help learners read a written plan and communicate accurately. World Horse Welfare and British Horse Society feeding guidance describe forage-led feeding, individual requirements, condition and workload review, clean feed and water, gradual changes and professional nutrition or veterinary input where needed. British Horse Society guidance also describes hay and haylage, concentrates and balancers while emphasising individual suitability.

This lesson does not decide which category, product or amount a horse needs. It does not claim that haylage always provides more energy, that chaff always improves digestion, that a balancer is required, or that any feed prevents or causes a named disease. Follow the current individual plan, product label and professional advice.

## Forage

Forage can include grazing and conserved forage such as hay or haylage. Source, plant mix, harvest, conservation, storage and analysis can affect a batch. The responsible person and qualified professional select suitable forage for the horse and management system. A learner should identify the authorised product or forage area, follow the plan and report visible or recorded changes.

Do not decide quality or safety from colour or smell alone. Report mould, dust, heating, foreign objects, damaged wrapping, pests, an unknown plant or an unexpected batch under the current procedure. Do not taste, sort, soak, steam, discard or substitute forage without authority; those actions may affect safety, nutrition and records.

## Concentrates and complementary feeds

Concentrates are feeds designed to supply nutrients in a smaller quantity than forage, but products differ substantially. Mixes, cubes, mashes, fibres and other commercial descriptions do not guarantee suitability for an individual horse. The label, manufacturer instructions, batch identity and current professional plan matter.

Measure only with the authorised method and equipment. A scoop volume is not automatically a weight and one product's scoop cannot define another product's ration. This lesson gives no ration, meal size or conversion. Report a label mismatch, damaged package, changed formulation or measuring-equipment issue before feeding.

## Balancers and supplements

A balancer is a category of concentrated product intended to provide specified nutrients, but whether one is needed depends on the whole ration and horse. Supplements are separate products and may duplicate nutrients or interact with health, medication, competition or another feed. Do not add either category based on advertising, a generic deficiency claim or another horse's plan. Veterinary or qualified nutrition advice and current competition rules may be required.

## Water

Clean, fresh water access is an essential part of the feeding context. Follow the individual and yard plan for containers, automatic systems or natural sources and record an access problem. Do not diagnose dehydration, add electrolytes, flavour water or force intake from this lesson. Escalate reduced drinking, supply failure, contamination or health concern.

## Storage and hygiene

Store and handle feed under the label, site pest-control, contamination and stock-rotation procedure. Keep products identified and separated as required. Do not use unlabelled feed or decant without traceability. Cleaning routines and protective equipment depend on the product and site plan.

## Factual comparison

When comparing feeds for education, record the category, declared purpose, ingredient and analytical information from the label, directions, warnings, batch and storage requirements. Do not rank products or infer health effects beyond the label and qualified evidence. Supplier marketing is not proof of a clinical outcome.

If the horse's appetite, condition, behaviour, droppings, health or workload changes, record facts and refer the plan for qualified review. Do not switch category or product independently.`,
    keyPoints: [
      "Forage, concentrates, balancers and supplements are categories, not universal feeding recommendations",
      "The individual plan, product label, batch identity and qualified advice control selection and amount",
      "Visible quality concerns require reporting; appearance alone does not prove safety",
      "A scoop volume is not automatically a weight and products cannot share assumed measures",
      "Water, hygiene, storage, traceability and professional escalation are part of every feed decision",
    ],
    safetyNote:
      "Do not select, substitute, measure, soak, steam, discard or add a feed, balancer, supplement or electrolyte without authority. Use only identified products under the written individual plan and label. Report mould, contamination, label or batch mismatch, water failure, appetite change or health concern to the responsible person and veterinarian or qualified nutrition professional as appropriate.",
    practicalApplication:
      "Compare three instructor-provided fictional labels—one forage record, one concentrate and one balancer. Record only category, declared purpose, label directions, batch/storage facts and questions for the qualified reviewer; do not recommend a product or ration.",
    commonMistakes: [
      "Treating a feed category as suitable for every horse",
      "Using colour or smell alone to declare forage safe",
      "Assuming one scoop or product measure transfers to another feed",
      "Adding a balancer or supplement from an advertising claim",
      "Changing product after a health or appetite concern without qualified review",
    ],
    knowledgeCheck: [
      {
        question: "What does a feed category tell a learner?",
        options: [
          "How the product is broadly described, not whether it is suitable for an individual horse",
          "The exact ration every horse needs",
          "That the product prevents disease",
          "That its scoop equals a fixed weight",
        ],
        correctIndex: 0,
        explanation:
          "Suitability and amount depend on the whole individual plan, label and qualified review.",
      },
      {
        question:
          "What should happen when a forage batch appears mouldy or contaminated?",
        options: [
          "Do not use or alter it; follow the current quarantine/reporting decision of the responsible person",
          "Feed a small amount to test it",
          "Mix it with another batch",
          "Remove visible material and assume the rest is safe",
        ],
        correctIndex: 0,
        explanation:
          "Quality and contamination concerns need the authorised site and professional process, not a learner test.",
      },
      {
        question:
          "Who decides whether a balancer or supplement belongs in the ration?",
        options: [
          "The responsible person with veterinary or qualified nutrition advice for the whole individual plan",
          "Any learner reading an advertisement",
          "Another horse owner using the same product",
          "The product category alone",
        ],
        correctIndex: 0,
        explanation:
          "Need and compatibility depend on the individual horse, complete ration, health and other requirements.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on feed categories without recommending a ration",
      "Help me read label facts separately from marketing claims",
      "Give me a feed-quality concern and ask for the fail-closed response",
    ],
  },

  "feeding-routines-and-rules": {
    objectives: [
      "Follow a written horse-specific feeding routine without inventing universal times or amounts",
      "Maintain identity, measurement, hygiene, water and record controls",
      "Respond safely to errors, refusals, exercise changes and health concerns",
    ],
    content: `## The written plan is the rule

A feeding routine turns an individual nutrition plan into consistent authorised actions. World Horse Welfare and British Horse Society guidance supports forage-led individual feeding, clean water, regular condition review, clean feed, gradual changes and professional advice. The exact feed, amount, presentation and timing depend on the horse, management, health, workload and current plan.

This lesson does not set universal meal times, pre- or post-exercise intervals, transition days, forage percentages or water volumes. It does not authorise a learner to change a routine because the horse appears hungry, has worked harder or left feed.

## Before preparing feed

Confirm the horse, date and current authorised plan. Check for a documented change, temporary instruction or hold. Identify each product by label and batch where required. Use the assigned clean equipment and measurement method. Do not rely on colour, an unlabelled bin or memory when horses have different plans.

Check storage and preparation areas for contamination, pests, damage, foreign objects and product or label mismatch. Keep medicines, supplements and special-diet products within their separate authorised controls. If anything is uncertain, stop before mixing and contact the responsible person.

## Measure and prepare

Measure exactly as the plan specifies using the authorised weighed or calibrated method. A scoop is only meaningful when its product-specific measure is established by the plan. Do not round, substitute, top up, share feed or add water, oil, salt, electrolyte, medication or supplement unless the current instruction requires it.

Follow label and site hygiene requirements. Avoid cross-contamination between horses and products, especially where allergies, health conditions, medicines or competition rules may apply. Record preparation or administration only after the authorised step actually occurs.

## Deliver and confirm

Use the current safe handling and stable or turnout procedure. Confirm the correct horse and location before placing feed. Manage other horses and people so feed cannot be stolen, swapped or create conflict. The responsible person determines supervision and whether the horse may be fed around work.

Exercise and feeding arrangements are individual. Do not apply a fixed waiting period before or after exercise. If the work plan changes, ask the responsible person how the feeding plan is affected rather than making an adjustment.

## Water and forage checks

Confirm clean fresh water access under the current plan and report supply, contamination or access problems. Do not force intake, add flavour or electrolytes, or diagnose dehydration. Forage access and presentation also follow the written plan; do not provide extra, remove it or substitute a batch without authority.

## Refusals, errors and changes

Record what was offered, what remained and any factual observation. Do not diagnose a refusal or make the feed more attractive independently. Sudden reduced appetite, difficulty eating, repeated altered droppings, behaviour change, weight or condition concern, possible colic or a health change requires prompt responsible-person review and may require veterinary help.

If the wrong feed, amount, product, horse or time is involved, stop, prevent further access if this can be done safely and report immediately. Do not hide, dilute or compensate at the next meal. The veterinarian, prescriber, qualified nutrition professional or responsible person decides the response.

## Records and handover

Record horse, product, authorised amount, actual delivery, leftovers, water or access issue, change, error and person notified in the approved system. Separate facts from conclusions and protect sensitive health information. A good handover allows the next authorised person to follow the same current plan.

## Review

The responsible team reviews the plan using condition, weight, workload, health, forage, records and professional advice. A learner may supply accurate records but does not rebalance the diet. Consistency means following and reporting accurately—not rigidly continuing an outdated instruction when a responsible-person hold or welfare concern exists.`,
    keyPoints: [
      "Use the current written individual feeding plan and verify horse, product, measure and any change",
      "Universal meal, exercise, transition, forage or water rules are not provided",
      "Prevent cross-contamination and do not add products, water, supplements or medication without authority",
      "Feed errors, refusal, water failure or health concerns require immediate factual reporting",
      "Record actual actions and leftovers; qualified professionals review the ration",
    ],
    safetyNote:
      "Do not feed an unidentified product, guess a measure, substitute or add feed, water, supplement, electrolyte or medication, or compensate for an error independently. For a wrong feed/horse/amount, refusal, possible colic, water failure or health concern, stop and contact the responsible person and veterinarian or qualified nutrition professional as required by the current plan.",
    practicalApplication:
      "Using a fictional written plan and preparation area, perform a paper feed check: verify horse/product/measure, identify contamination and label risks, record a refusal and a wrong-feed near miss, and state the authorised escalation without changing the ration.",
    commonMistakes: [
      "Feeding from memory or an unlabelled container",
      "Treating scoop volume as a universal weight",
      "Using fixed pre- or post-exercise feeding intervals",
      "Hiding or compensating for a feeding error",
      "Changing feed after a refusal instead of reporting the fact",
    ],
    knowledgeCheck: [
      {
        question: "What controls a horse's feeding routine?",
        options: [
          "The current written individual plan and authorised updates",
          "One universal timetable",
          "The learner's estimate of hunger",
          "Another horse's routine",
        ],
        correctIndex: 0,
        explanation:
          "Feed, amount, preparation and timing depend on the individual plan and current qualified decisions.",
      },
      {
        question: "What should happen after a wrong-feed near miss?",
        options: [
          "Stop further access if safely possible, report immediately and record facts",
          "Hide the error and reduce the next meal",
          "Dilute the feed with another product",
          "Wait for symptoms before telling anyone",
        ],
        correctIndex: 0,
        explanation:
          "Prompt factual reporting lets the responsible and veterinary/nutrition team decide the safe response.",
      },
      {
        question: "How should feeding around exercise be decided?",
        options: [
          "By the horse-specific current plan and responsible qualified team",
          "By one fixed waiting period for all horses",
          "By the rider after every session",
          "By adding feed automatically after harder work",
        ],
        correctIndex: 0,
        explanation:
          "Work and feeding decisions are individual; this lesson intentionally provides no universal interval.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on feed identity, measurement and cross-contamination controls",
      "Give me a feeding error and ask for the immediate truthful response",
      "Help me distinguish consistent routine from unauthorised rigid continuation",
    ],
  },

  "balancing-a-diet": {
    objectives: [
      "Explain diet balance as an individual qualified review of the whole ration",
      "Collect factual condition, weight, workload, forage, feed, water and health records without scoring or diagnosis",
      "Recognise when welfare or health concerns require veterinary or qualified nutrition input",
    ],
    content: `## Balance belongs to the whole individual plan

A balanced diet is one that meets the individual horse's needs within its current health, condition, workload and management context. World Horse Welfare and British Horse Society feeding guidance supports individual feeding decisions, forage-led plans, clean water, gradual changes, regular condition monitoring and veterinary or qualified nutrition input where needed. The sources also caution that weight, condition and behaviour can have multiple causes.

This lesson does not teach a universal ration, diagnose a deficiency, use a fixed zero-to-five body-condition score, name one ideal score or authorise a learner to alter feed. It teaches how to prepare accurate evidence for the responsible qualified team.

## Define the current question

The responsible person may ask whether the current plan still suits a change in condition, weight trend, workload, forage supply, season, health or management. State the question without assuming the cause. “The recorded weight trend changed after the forage batch changed” is a review question; “the forage caused metabolic disease” is an unsupported conclusion.

Confirm who owns nutrition and veterinary decisions, which records are authorised and which measurement method the organisation uses. Different weight and condition methods have limits and require training. This lesson does not replace that method with a generic visual score.

## Review the whole ration

List every authorised source of intake in the current plan: grazing or conserved forage, concentrate or complementary feed, balancer, supplement, treats, medication-related feed and water arrangements. Use labels, batch records and actual authorised measures. Do not assume a product supplies a nutrient or health effect beyond its label and appropriate evidence.

Forage quality and analysis, pasture, storage, dental health, access, competition rules, medicines and other horses can affect the plan. The veterinarian or qualified nutrition professional decides what information and analysis are needed.

## Condition, weight and factual observations

Condition and weight are monitored using the current trained method and equipment. A single visual impression is not a diagnosis and a measurement can vary with method and conditions. Record date, method, operator, result and relevant context. Do not label the horse or infer health, welfare, feed requirement or laminitis risk from one result.

Other useful facts may include appetite, leftovers, droppings, water access, behaviour during feeding, workload records and visible changes. Each can have multiple causes. Protect health information and escalate rather than interpreting it independently.

## Forage, water and change control

Reviewed guidance supports forage-led feeding and constant clean-water access, but suitability and amount remain individual. Do not claim that forage alone meets every horse's needs or that a particular quantity prevents disease. Gradual change is a principle, while the exact process belongs to the written plan.

Do not reduce, increase, soak, substitute or remove feed or grazing, add a supplement, change turnout, or restrict water. A qualified plan may use management controls, but the learner does not select them.

## Health and welfare boundary

Unexpected condition or weight change, reduced appetite, difficulty eating, possible colic, laminitis concern, abnormal behaviour, dehydration concern or another health issue requires prompt responsible-person review and may need a veterinarian. Do not delay professional contact to complete a diet calculation or experiment.

Laminitis and metabolic disease are veterinary conditions. A body shape, crest or weight score does not let a learner diagnose them or prescribe a “strict diet.” Veterinarian-led assessment and an individual management team control any plan.

## Present evidence without recommending a ration

Prepare a neutral summary: current plan, actual records, changed circumstances, missing information, errors and questions for the professional. Avoid recommending product, energy, protein, vitamin, mineral or supplement changes unless that is within a qualified role and supported by full analysis.

After review, follow the written authorised update and monitor the facts requested. Diet balance is an ongoing professional process, not a one-time arithmetic answer.`,
    keyPoints: [
      "Diet balance is assessed across the whole individual ration, health, condition, workload and management",
      "Use the organisation's trained condition and weight method; one observation or score is not a diagnosis",
      "Forage-led feeding, clean water and gradual change remain individual-plan principles",
      "Learners collect accurate evidence and do not alter feed, grazing, water or supplements",
      "Weight, condition, appetite, behaviour or laminitis concern requires appropriate professional review",
    ],
    safetyNote:
      "Do not diagnose a deficiency, metabolic disease or laminitis; do not change feed, forage, grazing, water, turnout or supplements from a score or calculation. Record the authorised facts and use the responsible person, veterinarian and qualified nutrition professional. Possible colic, laminitis or significant health concern requires prompt veterinary contact.",
    practicalApplication:
      "Prepare a neutral fictional diet-review pack listing the current full ration, label/batch records, authorised measures, weight/condition method, workload and water facts, changes and missing information. Write questions for the qualified reviewer without recommending any ration change.",
    commonMistakes: [
      "Using a fixed body-condition scale or ideal score without the current trained method",
      "Diagnosing health or welfare from one weight or visual observation",
      "Reviewing one bucket feed while ignoring forage, grazing, water and other intake",
      "Changing the ration before the qualified whole-plan review",
      "Treating a product claim as proof of nutrient need or health benefit",
    ],
    knowledgeCheck: [
      {
        question: "What must a diet-balance review consider?",
        options: [
          "The whole individual ration, condition, workload, health, management, water and reliable records",
          "One supplement advertisement",
          "A single visual score",
          "Only the concentrate feed",
        ],
        correctIndex: 0,
        explanation:
          "Balance depends on the complete individual context and qualified interpretation, not one product or observation.",
      },
      {
        question:
          "What may a learner do after recording unexpected weight change?",
        options: [
          "Report the factual record for responsible veterinary or qualified nutrition review",
          "Diagnose metabolic disease",
          "Restrict forage immediately",
          "Add a weight-management supplement",
        ],
        correctIndex: 0,
        explanation:
          "Weight and condition changes have multiple possible causes and require the appropriate whole-plan review.",
      },
      {
        question: "What is the learner's role in a ration review?",
        options: [
          "Provide accurate authorised records and follow the resulting written plan",
          "Prescribe energy and nutrient changes",
          "Choose a universal ideal score",
          "Experiment with feed and grazing before referral",
        ],
        correctIndex: 0,
        explanation:
          "The learner supports qualified decision-making without independently changing or prescribing the diet.",
      },
    ],
    aiTutorPrompts: [
      "Help me build a whole-ration evidence list without recommending changes",
      "Quiz me on why one condition or weight observation is not a diagnosis",
      "Give me a diet concern and ask which professional route applies",
    ],
  },

  "feeding-for-workload": {
    objectives: [
      "Describe workload and feeding as linked individual professional decisions",
      "Maintain factual work, condition, appetite, forage, water and health records",
      "Avoid universal workload bands, ration changes, feed timing and supplement assumptions",
    ],
    content: `## Workload is not a ration formula

Work changes may affect an individual horse's nutrition plan, but workload does not translate directly into a universal feed increase. World Horse Welfare and British Horse Society feeding guidance says individual requirements depend on factors including condition, workload, health and management and supports forage-led plans, clean water, gradual changes and qualified review. The reviewed sources do not justify generic workload bands, pre-exercise meals, recovery intervals, percentage adjustments or automatic supplements.

This lesson helps learners collect accurate information and follow a written plan. It does not calculate energy need, prescribe a ration or diagnose why a horse gains or loses condition, changes behaviour, leaves feed or performs differently.

## Record the actual work

Use the authorised training record to describe what happened: type of work, pace or activity categories used by the organisation, duration as actually recorded, surface, weather, travel, rest and any change from the plan. Do not upgrade a workload label to make a ration change or use one session to define the horse's long-term demand.

The coach or responsible professional evaluates intensity and progression for the individual horse. The nutrition professional uses the appropriate workload history together with condition, forage, health and management. A learner should not convert distance, time or a competition result into feed quantities.

## Condition, appetite and behaviour

Record condition and weight using the current trained method, with date and context. Record appetite, leftovers, water access, droppings and factual behaviour changes. Each can have multiple causes. “The horse left part of the labelled evening feed after travel” is useful; “the horse needs more energy feed” is an unsupported recommendation.

Dental problems, pain, illness, ulcers, stress and management changes are professional considerations, not learner diagnoses. Unexpected or persistent change should be referred to the responsible person and veterinarian or qualified nutrition professional.

## Review forage and the whole plan

Forage, grazing, conserved forage, concentrate, balancer, supplement, treats, medicines and water all belong in the review. Seasonal forage and pasture can change, but this lesson gives no seasonal ration template. Product labels and batch or analysis records may be relevant.

Do not reduce forage to make room for concentrate, add oil or a supplement, change meal frequency, soak feed, alter turnout or introduce a “performance” product. Qualified review determines whether the current plan changes and how a gradual transition is made.

## Feeding around work and recovery

Exercise and feeding timing depends on the horse, feed, work, health, management and current professional plan. Do not apply a fixed before- or after-work interval. Water access, travel and recovery arrangements also follow the individual plan and current welfare guidance.

If the schedule changes, ask for an authorised instruction. Do not skip, delay or add a feed based on a generic rule. Record what actually occurred so the team can review it.

## Health and welfare escalation

Possible colic, laminitis, significant appetite or water change, difficulty eating, abnormal behaviour, weight or condition concern, poor recovery, pain or suspected illness requires prompt responsible-person review and may require a veterinarian. Do not use a feed change to test a medical concern or delay professional assessment.

Horse welfare takes priority over a training or competition schedule. If work, travel or heat conditions no longer fit the plan, the responsible team may reduce, postpone or stop the activity rather than compensate with feed.

## Qualified review and implementation

Present a factual summary containing the current ration, forage and water arrangements, recent work history, condition/weight records, appetite and leftovers, health or dental context known through authorised records, management changes and product information. Identify missing data instead of guessing.

The veterinarian or qualified nutrition professional recommends any change with the responsible person. Follow the resulting written plan, label and gradual-change instruction. Monitor only the requested facts. The safe connection between workload and feeding is an evidence-led team process, not a fixed table.`,
    keyPoints: [
      "Workload informs an individual whole-plan review but does not directly prescribe feed",
      "Record actual work, condition, appetite, leftovers, water, forage, management and health context",
      "Do not use universal workload bands, ration percentages, feed timing or seasonal templates",
      "Feed, forage, turnout, supplements and water remain controlled by the written qualified plan",
      "Health, welfare or recovery concerns require appropriate professional review before diet experiments",
    ],
    safetyNote:
      "Do not increase or reduce feed, forage, grazing, water, meal timing or supplements because workload changed. Record actual work and horse observations and use the responsible person, veterinarian and qualified nutrition professional. Possible colic, laminitis, poor recovery, appetite/water change, pain or health concern requires prompt escalation, not a ration experiment.",
    practicalApplication:
      "Build a fictional workload-and-feeding review pack containing actual work records, current full ration, forage/water facts, trained condition/weight records, appetite, management changes and questions. Do not calculate or recommend a feed change.",
    commonMistakes: [
      "Turning a workload label into an automatic ration increase",
      "Using one session, distance or competition result as a feed formula",
      "Applying fixed pre- or post-exercise feeding intervals",
      "Adding a performance supplement without whole-plan review",
      "Diagnosing appetite, behaviour, condition or recovery changes as nutrition problems",
    ],
    knowledgeCheck: [
      {
        question: "How should workload affect feeding decisions?",
        options: [
          "As one part of an individual whole-plan professional review",
          "Through a universal feed-increase table",
          "By automatically adding concentrate after harder work",
          "By reducing forage to match a workload label",
        ],
        correctIndex: 0,
        explanation:
          "Workload must be considered with condition, forage, health, management and qualified interpretation.",
      },
      {
        question: "What is a useful factual workload record?",
        options: [
          "The actual activity, conditions, changes from plan and authorised observations",
          "A diagnosis that poor performance is nutritional",
          "A feed quantity calculated from one ride",
          "A promise that the horse needs a supplement",
        ],
        correctIndex: 0,
        explanation:
          "Accurate records help the team review the whole context without unsupported diagnosis or prescription.",
      },
      {
        question: "Who determines feeding around exercise?",
        options: [
          "The responsible qualified team through the individual current plan",
          "A fixed universal before-and-after interval",
          "Any rider after a hard session",
          "The supplement manufacturer alone",
        ],
        correctIndex: 0,
        explanation:
          "The safe timing depends on the horse, feed, work, health and management and must remain plan-owned.",
      },
    ],
    aiTutorPrompts: [
      "Help me separate workload facts from a feed recommendation",
      "Quiz me on whole-plan review inputs",
      "Give me a schedule change and ask what the learner must record and escalate",
    ],
  },

  "supplements-and-special-diets": {
    objectives: [
      "Evaluate supplement identity and claims without selecting or prescribing a product",
      "Explain why special diets for health conditions require veterinary and qualified nutrition plans",
      "Maintain label, dose, overlap, competition, hydration and adverse-event boundaries",
    ],
    content: `## No product is automatically needed

Supplements are products added to a ration for a stated purpose. British Horse Society feeding guidance says supplements may support nutritional deficiencies but advises veterinary or nutritionist guidance before use. It also emphasises individual diets, clean water and consideration of health, workload and condition. A claim on a label or advertisement does not prove that an individual horse needs the product or will obtain a health or performance benefit.

This lesson does not recommend ingredients, diagnose deficiency, compare brands, calculate doses, prescribe electrolytes or design diets for metabolic or other disease. Selection belongs to the responsible person with veterinarian and qualified nutrition professional input after reviewing the whole ration.

## Review identity and evidence

For an authorised educational review, record the product name, manufacturer, batch, expiry, ingredient and analytical declarations, directions, warnings, storage, intended species and stated purpose. Separate label facts from marketing language. Terms such as natural, calming, joint, detox, immune or performance are not diagnoses or guaranteed outcomes.

Do not taste, open, decant, mix or administer a product. An unlabelled, expired, damaged or mismatched product is not used and is reported under the current procedure. Keep traceability where the yard or competition rules require it.

## Whole-ration overlap

Several feeds, balancers and supplements may supply the same nutrient or ingredient. Whether overlap is relevant depends on the actual declared composition, measures, forage and individual horse. A learner should list products and authorised amounts but must not calculate toxicity, deficiency, interaction or a new dose from this lesson.

Medicines, health conditions, allergies, pregnancy, age and competition participation may create additional restrictions. The veterinarian, prescriber, qualified nutrition professional and current governing-body rules determine compatibility and permitted use. Never use a supplement as a substitute for veterinary assessment or prescribed treatment.

## Electrolytes and hydration

Water is essential, and hydration management depends on the individual horse, work, weather, travel, feed and health. Electrolyte products vary. Do not select a product, dose, route or timing; do not add one to water or feed without the written plan; and do not force intake. A horse must retain access to the clean fresh water required by its plan.

Reduced drinking, heat concern, poor recovery, diarrhoea, possible colic or other health change requires prompt responsible-person and veterinary review. An electrolyte does not make continued work safe and must not delay cooling or professional help.

## Special diets and veterinary conditions

Equine Metabolic Syndrome is a veterinary condition. British Horse Society and World Horse Welfare material describes veterinary assessment and an agreed management plan; blood testing may be part of diagnosis. It is distinct from other conditions such as pituitary pars intermedia dysfunction, and a learner cannot diagnose either from body shape, a crest, obesity or laminitis risk.

Weight-loss, metabolic, laminitis, allergy, dental, gastrointestinal, kidney, liver, respiratory or other special-diet decisions require individual veterinary and qualified nutrition oversight. Do not prescribe soaking, grazing restriction, a “low sugar” product, strict ration, fasting or turnout change. Management controls can cause harm if applied to the wrong horse or without suitable forage and welfare planning.

## Administration and records

Only an authorised person prepares and administers a supplement or special-diet product exactly under the current written plan, label and measurement method. Record product, batch, authorised amount, actual administration, leftovers, errors and observations. Do not double a missed amount, borrow another horse's product or compensate independently.

For a wrong product, amount or horse, stop further access if safely possible and report immediately. If an adverse reaction or health concern is suspected, use the veterinary route and preserve product information. Do not wait for proof or diagnose the cause.

## Decision summary

A safe supplement review asks: What is the qualified purpose? Is the horse assessed? What does the whole ration already provide? What do label and reliable evidence say? Are medicines, conditions, competition or duplication relevant? Who authorises and monitors it? If those answers are incomplete, the product remains out of use.`,
    keyPoints: [
      "Supplements require a defined individual purpose and veterinary or qualified nutrition review of the whole ration",
      "Labels and marketing do not prove need, safety, deficiency correction or outcome",
      "Ingredient overlap, medicines, health and competition rules require qualified assessment",
      "Electrolyte product, dose, route and timing remain written-plan decisions and never replace water or urgent care",
      "Metabolic and other special diets are veterinary-led; learners do not diagnose or prescribe management",
    ],
    safetyNote:
      "Do not select, dose, mix or administer a supplement, electrolyte or special-diet product without the written authorised plan. Do not diagnose deficiency, metabolic disease or another condition, or prescribe soaking, grazing, fasting or feed restriction. For wrong product/amount/horse, possible adverse reaction, heat, hydration, colic or laminitis concern, report promptly and use veterinary guidance.",
    practicalApplication:
      "Review a fictional supplement label and whole-ration list. Separate label facts from marketing, identify missing evidence, possible overlap, medicine/competition questions, authorisation and monitoring needs, and conclude whether the fail-closed product decision is use or do not use.",
    commonMistakes: [
      "Selecting a supplement from an ingredient or marketing claim",
      "Ignoring overlap with balancers, feeds and other products",
      "Choosing an electrolyte dose or adding it to the only water source",
      "Diagnosing metabolic disease from appearance",
      "Applying a special-diet management technique without veterinary and nutrition oversight",
    ],
    knowledgeCheck: [
      {
        question: "What is required before adding a supplement?",
        options: [
          "An individual qualified purpose and review of the whole ration, health and other constraints",
          "A persuasive advertisement",
          "A recommendation for another horse",
          "A learner's diagnosis of deficiency",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance advises veterinary or nutritionist input; product claims alone do not establish need or safety.",
      },
      {
        question: "Who designs a diet for suspected Equine Metabolic Syndrome?",
        options: [
          "The veterinarian and qualified nutrition team after individual assessment",
          "Any learner using body shape",
          "A supplement manufacturer without health records",
          "A universal strict-diet template",
        ],
        correctIndex: 0,
        explanation:
          "Equine Metabolic Syndrome is a veterinary condition requiring diagnosis and an individual professional management plan.",
      },
      {
        question:
          "What should happen after a wrong supplement amount is given?",
        options: [
          "Stop further access, report immediately, preserve product details and follow veterinary/responsible-person advice",
          "Hide it and skip the next amount",
          "Give extra water with another product",
          "Wait for proof of harm before reporting",
        ],
        correctIndex: 0,
        explanation:
          "Prompt factual reporting lets the responsible and veterinary team assess the individual risk safely.",
      },
    ],
    aiTutorPrompts: [
      "Help me separate supplement label facts from marketing claims",
      "Quiz me on whole-ration overlap and professional authorisation",
      "Give me a special-diet scenario and ask which decisions are veterinary-led",
    ],
  },

  "five-freedoms-of-animal-welfare": {
    objectives: [
      "Use the Five Freedoms as a historic welfare prompt rather than a diagnostic or legal checklist",
      "Relate welfare review to the modern Five Domains and individual horse context",
      "Report factual welfare concerns through current local professional and authority routes",
    ],
    content: `## A historic framework, not a verdict

The Five Freedoms are widely used historic prompts for thinking about animal welfare: freedom from hunger and thirst; discomfort; pain, injury and disease; fear and distress; and freedom to express normal behaviour. They are useful conversation headings, but a learner cannot use them as a diagnostic test, legal verdict or guarantee that a horse has good welfare.

The Department for Environment, Food and Rural Affairs code of practice for horses describes long-term responsibility for a suitable environment, healthy diet, normal behaviour, appropriate company and protection from pain, suffering, injury and disease. It also makes clear that breach of the code is not itself an offence, although a court may consider it in welfare proceedings. Current law and the facts of an individual case require authorised advice.

## Add the Five Domains lens

World Horse Welfare describes the Five Domains model: nutrition, physical environment, health, behavioural interactions and mental state. This modern lens encourages review of both negative and positive experiences and reminds us that observable conditions interact. The individual horse, group, environment, season, health and management all matter.

Do not assume that one visible feature proves welfare status. A horse without a rug, a horse alone at a moment in time or a field without visible built shelter does not by itself establish neglect. Conversely, a tidy stable or well-fed appearance does not rule out pain, distress, social or behavioural concerns. Gather first-hand facts and use qualified assessment.

## Nutrition and water

Review whether the horse has access to clean fresh water and a suitable individual diet under the current plan. A learner may report an empty or contaminated source, feed-access problem or factual condition change. They must not diagnose dehydration, malnutrition, digestive disease or deliberately alter the ration without authority.

## Environment and comfort

Consider footing, space, ventilation, weather protection, hazards, cleanliness, rest and safe access in the horse's actual management system. Suitability varies by horse and conditions. Do not apply a universal rug, shelter, stable-size, bedding or turnout rule. The responsible person and relevant professionals use current welfare guidance and local requirements.

## Health

Record visible or known changes within authority and use the veterinarian, farrier, dental, behaviour or other qualified route. Do not diagnose pain, disease, lameness, injury or treatment need from the framework. In an emergency, call the appropriate professional or emergency service under the current plan rather than completing a welfare score.

## Behavioural interactions and mental state

Horses are social animals and welfare review includes opportunities for appropriate behaviour and interactions, but arrangements depend on the individuals and management. Behaviour is information, not diagnosis. A change may relate to health, environment, learning or other factors and requires responsible qualified review.

## Factual concern reporting

World Horse Welfare reporting guidance asks for first-hand factual information and distinguishes urgent circumstances. Reporting routes depend on location and situation. Follow the current yard or organisation procedure when safe. For serious or urgent welfare concerns, use the local veterinarian, welfare organisation, relevant authority or emergency service as applicable.

Do not confront, trespass, remove an animal, publish identifying allegations, investigate or promise a legal outcome. Record date, place, what was directly seen, duration if known, immediate danger and who was contacted. Protect people and information.

## Use the framework responsibly

For a fictional case, consider each domain, list facts, identify missing information and name the qualified decision-maker. The result may be “insufficient information—report for assessment.” Welfare education is strongest when it prompts careful observation, individual context and timely professional action rather than confident unsupported labels.`,
    keyPoints: [
      "The Five Freedoms are historic welfare prompts, not a diagnostic or legal checklist",
      "The Five Domains consider nutrition, environment, health, behavioural interactions and mental state",
      "Individual context matters and one visible feature rarely establishes overall welfare",
      "Learners report first-hand facts and do not diagnose, confront or intervene without authority",
      "Use the current local veterinarian, welfare, authority and emergency routes for concerns",
    ],
    safetyNote:
      "Do not diagnose welfare, pain or disease, confront a person, trespass, remove an animal, publish allegations or alter care from this framework. Record first-hand facts and use the current responsible-person, veterinarian, welfare organisation, relevant authority or emergency route. Immediate danger requires the appropriate emergency service.",
    practicalApplication:
      "Review a fictional welfare scenario through the Five Domains. For each domain, list only known facts and missing information, then write a safe first-hand report and choose the current qualified route without making a legal or diagnostic conclusion.",
    commonMistakes: [
      "Treating the Five Freedoms as a pass/fail legal test",
      "Diagnosing welfare from a missing rug, solitary moment or one visual feature",
      "Assuming tidy facilities prove every welfare need is met",
      "Confronting, trespassing or intervening without authority",
      "Naming one organisation as the correct reporting route in every location",
    ],
    knowledgeCheck: [
      {
        question: "How should the Five Freedoms be used?",
        options: [
          "As historic prompts within a wider individual welfare assessment",
          "As a legal verdict issued by a learner",
          "As a diagnosis of pain or disease",
          "As proof that one visible feature establishes neglect",
        ],
        correctIndex: 0,
        explanation:
          "The framework guides questions but qualified assessment, context and current law determine conclusions.",
      },
      {
        question: "What does the Five Domains model add?",
        options: [
          "Consideration of nutrition, environment, health, behavioural interactions and mental state",
          "A universal rugging rule",
          "A learner treatment protocol",
          "A fixed legal penalty",
        ],
        correctIndex: 0,
        explanation:
          "The Five Domains broadens welfare review while still requiring individual context and qualified decisions.",
      },
      {
        question: "What is the correct response to a welfare concern?",
        options: [
          "Record first-hand facts and use the current local responsible professional or authority route",
          "Confront the person believed responsible",
          "Remove the horse without authority",
          "Publish an allegation before assessment",
        ],
        correctIndex: 0,
        explanation:
          "Safe factual reporting protects the horse, people and integrity of the authorised assessment.",
      },
    ],
    aiTutorPrompts: [
      "Help me apply the Five Domains without making a welfare diagnosis",
      "Quiz me on facts versus conclusions in a concern report",
      "Give me a welfare scenario where the correct answer is insufficient information and referral",
    ],
  },

  "responsible-horse-ownership": {
    objectives: [
      "Describe ownership as a long-term welfare, financial, professional-care and contingency responsibility",
      "Use horse-specific current plans rather than universal lifespan or service calendars",
      "Recognise legal, transport, loan, rehoming and end-of-life decisions that need authorised advice",
    ],
    content: `## Responsibility continues every day

Owning or taking responsibility for a horse is a long-term commitment to welfare, suitable management, professional care, finance, records and contingency planning. The United Kingdom government's Keeping horses guidance sets responsibilities for a suitable environment and diet, protection from pain, injury, suffering and disease, treatment records, veterinary-controlled vaccination and passport or identification requirements. The detailed rules depend on jurisdiction and activity and must be checked currently.

This lesson does not state a universal horse lifespan, routine veterinary, dental, farriery or parasite calendar, annual cost or legal answer. Each horse's plan is individual and changes with health, age, use, management, location and professional advice.

## Daily welfare plan

The responsible person ensures clean water, suitable feed, safe environment, appropriate social and behavioural opportunities, observation and response to concerns under the individual plan. They arrange competent staffing and handover when absent. A checklist supports consistency but does not prove welfare or replace judgement.

Record authorised facts and contact the relevant professional for pain, illness, injury, behaviour, condition, hoof, dental or feeding concerns. Do not diagnose or treat from an ownership lesson.

## Professional care

Maintain current contacts and plans for veterinarian, qualified farrier, appropriate dental professional, nutrition, tack fitting, behaviour and other services as the horse requires. The frequency and content of care belong to those professionals and the individual plan. Competition and travel may add current governing-body or official requirements.

Keep treatment, vaccination, medication and other required records accurately. Medicines remain under veterinary or prescriber direction. Do not alter a schedule or administer a product because another horse follows it.

## Financial planning

Budget for routine care, forage, feed, bedding, land or livery, equipment, transport and professional services, and maintain a contingency for unexpected care. Costs vary widely, so this lesson gives no amount. Insurance can transfer some financial risk but exclusions, limits, notification and authorisation depend on the policy; current insurer terms must be read.

Financial pressure never authorises delayed emergency care or inadequate welfare. Seek early responsible, veterinary, welfare, financial or rehoming advice rather than hiding a problem.

## Emergency and absence arrangements

Maintain accessible emergency contacts, horse identification, health information and clear authority for decisions if the owner cannot be reached. The yard and veterinary practice should know the current arrangement. Plans should cover severe weather, fire, disease, transport disruption, hospitalisation of the owner and loss of normal facilities as applicable.

Review contingencies when circumstances change rather than on one universal timetable. Test contact details and ensure an authorised person can access the required records and funds.

## Sharing, loan and sale

Sharing or loaning a horse does not remove the need for welfare, suitability, accurate information, written agreements and current legal advice. Define care, costs, insurance, use, professional decisions, records, visits, emergency authority and return or termination arrangements. A template is not a guarantee and may need legal review.

Provide truthful health, behaviour, training and management information within privacy and legal obligations. Do not conceal a concern or promise that a horse is suitable without appropriate assessment.

## Transport, identification and movement

Passports, microchips, transport, disease control and movement or export requirements depend on jurisdiction, journey and destination. Use the current official authority, veterinarian and competent transporter. This lesson does not reproduce deadlines or declare a horse fit to travel.

## Retirement, rehoming and end of life

Plan before a crisis. Retirement and rehoming require individual welfare, suitability, resources, accurate disclosure, written arrangements and contingency review. Rehoming is not always appropriate. End-of-life decisions require veterinarian-led individual quality-of-life and emergency assessment; do not delay urgent welfare action for insurance or paperwork.

## Ownership review

Periodically and after change, review welfare, care plans, records, finances, support, emergency authority and future options with the relevant professionals. Responsible ownership means noticing limits and seeking help early, not claiming to manage every problem alone.`,
    keyPoints: [
      "Ownership combines daily welfare, professional care, accurate records, finance and contingency planning",
      "Care frequency, lifespan, cost and legal requirements are individual and current, not universal lesson facts",
      "Emergency authority and accessible contacts must work when the owner is unavailable",
      "Loan, sale, transport, rehoming and insurance need accurate information and current authorised advice",
      "Veterinary and welfare needs take priority over schedules, finance and paperwork",
    ],
    safetyNote:
      "Do not delay emergency or welfare care for cost, insurance, paperwork or a generic calendar. Do not diagnose, treat, declare travel fitness or alter professional care. Use the current veterinarian, qualified care professionals, insurer, competent transporter, welfare organisation and official authority for the individual horse and jurisdiction.",
    practicalApplication:
      "Create a fictional ownership continuity plan covering daily care, professional contacts, records, budget categories, emergency authority, owner absence, severe-weather or fire contingency, loan/rehoming questions and end-of-life professional routes without adding fixed costs or service intervals.",
    commonMistakes: [
      "Using a universal lifespan, cost or routine-care calendar",
      "Assuming ownership skill replaces veterinary or other qualified care",
      "Leaving no authorised emergency decision-maker when the owner is absent",
      "Using a generic loan agreement without accurate disclosure or current advice",
      "Delaying welfare action because insurance or finances are uncertain",
    ],
    knowledgeCheck: [
      {
        question: "What makes horse ownership responsible?",
        options: [
          "Ongoing individual welfare, professional care, records, finance and contingency planning",
          "Following one universal service calendar",
          "Managing every health issue without professionals",
          "Focusing only on purchase price",
        ],
        correctIndex: 0,
        explanation:
          "Responsibility is continuous and individual, with early qualified help and plans for routine and unexpected needs.",
      },
      {
        question: "How should routine care timing be decided?",
        options: [
          "By the individual horse's current professional plan",
          "By one fixed interval for every horse",
          "By another owner's calendar",
          "Only when an emergency occurs",
        ],
        correctIndex: 0,
        explanation:
          "Veterinary, farriery, dental and other needs vary and belong to the appropriate professionals.",
      },
      {
        question: "What should an absence contingency include?",
        options: [
          "Accessible records, contacts and a clearly authorised decision-maker",
          "A promise that no emergency will occur",
          "Unlabelled medicines for anyone to use",
          "No financial or welfare arrangements",
        ],
        correctIndex: 0,
        explanation:
          "The horse's care must continue safely when the owner cannot be contacted.",
      },
    ],
    aiTutorPrompts: [
      "Help me build an ownership contingency checklist without fixed costs or calendars",
      "Quiz me on which decisions need current professional or official advice",
      "Give me an owner-absence scenario and ask what authority and records are missing",
    ],
  },

  "recognising-neglect-and-abuse": {
    objectives: [
      "Record first-hand welfare observations without diagnosing neglect, abuse or legal fault",
      "Use current local reporting, veterinary, welfare, safeguarding and emergency routes",
      "Protect people, evidence, privacy and the horse by avoiding confrontation or unauthorised intervention",
    ],
    content: `## Recognition means noticing and reporting facts

Learners may notice conditions that cause concern, but they are not investigators, veterinarians or courts. The Department for Environment, Food and Rural Affairs horse welfare code describes responsibilities for environment, diet, normal behaviour, company and protection from pain, suffering, injury and disease. It also says breach of the code is not itself an offence, though a court may consider it in welfare proceedings.

World Horse Welfare reporting guidance asks for first-hand factual information and distinguishes urgent circumstances. It warns that some observations that look concerning can have context. This lesson therefore does not give a checklist that proves neglect or abuse, define legal guilt or prescribe one organisation as the route in every location.

## Observe without diagnosing

Record what you directly see or hear: date, time, location, horse identification if safely known, environment, feed or water access as observed, visible condition, behaviour, injury or hazard, duration if actually known and immediate danger. Describe rather than interpret. “No water was visible in the accessible container during two visits” is factual; “the owner deliberately deprived the horse” states motive and legal fault.

A horse's weight, coat, feet, behaviour, isolation, lack of rug or absence of visible shelter can have different explanations and does not by itself establish a case. Conversely, one normal feature does not rule out a concern. Veterinarians, welfare officers and relevant authorities assess the whole context.

Do not perform a clinical examination, enter private land, move objects, feed, water, handle, transport or remove a horse without authority. Unauthorised intervention can endanger people and animals, alter evidence or create legal problems.

## Urgent situations

Immediate danger to people requires the relevant emergency service. A horse with an urgent health or injury concern may require a veterinarian or emergency welfare route under current local arrangements. Do not wait to collect perfect evidence, confront a person or post online.

If it is safe, note the location and factual nature of the emergency and follow instructions from the responder. Do not diagnose, administer treatment or decide that the horse is safe to move.

## Non-urgent concerns

Use the organisation or yard responsible-person route where appropriate and safe. If that route is implicated, unavailable or unsuitable, use the current local welfare organisation or relevant authority process. Reporting routes and thresholds vary by country and circumstance; verify the official current contact.

Provide accurate first-hand information, distinguish what you saw from what somebody else said and disclose uncertainty. Do not exaggerate to secure a response or minimise a concern to avoid involvement. Keep any reference number and follow the authorised advice.

## Safeguarding and interpersonal risk

A welfare concern may overlap with threats, domestic circumstances, a child or adult at risk, or criminal activity. Follow the designated safeguarding route. Do not investigate, mediate, promise secrecy or put yourself at risk. Immediate danger uses emergency services.

Do not confront the person believed responsible. Do not publish names, addresses, photographs or allegations on social media. Protect personal information and the integrity of the professional assessment.

## Evidence and records

Only create photographs or video when lawful, safe and requested or permitted by the reporting process. Do not trespass or provoke activity for an image. Preserve original notes and mark date, time and source. Avoid editing that could misrepresent context.

The learner's role may end after reporting. Do not promise rescue, prosecution or a particular outcome. Professional confidentiality may mean updates are limited.

## Avoid false distinctions

Do not try to classify a situation as neglect versus abuse from generic material. Welfare failures, deliberate harm, poor knowledge, poverty, illness and emergency can overlap and legal definitions vary. The important learner decision is whether first-hand facts indicate a possible concern and which current qualified route can assess it safely.

## Review a fictional case

Separate facts, second-hand claims, unknowns and immediate hazards. Write a concise report and identify the route. A responsible answer may say “possible welfare concern—professional assessment required,” not a legal verdict.`,
    keyPoints: [
      "Learners notice and report first-hand facts; they do not diagnose neglect, abuse or legal guilt",
      "Single signs can have context and require whole-case professional assessment",
      "Urgent danger uses emergency, veterinary or welfare routes without delay",
      "Do not confront, trespass, intervene, investigate or publish identifying allegations",
      "Reporting routes depend on location and circumstances and must be checked currently",
    ],
    safetyNote:
      "Do not confront anyone, trespass, handle/feed/move/remove a horse, perform an examination, investigate or publish allegations. Protect yourself and record only first-hand facts. Use the current local responsible-person, veterinarian, welfare organisation, relevant authority, safeguarding and emergency routes; immediate danger requires emergency services.",
    practicalApplication:
      "For a fictional concern, separate direct observations, second-hand information, assumptions and unknowns. Write a factual report with time, place and immediate danger, select a current local route, and list actions the learner must not take.",
    commonMistakes: [
      "Treating one visible sign as proof of neglect or abuse",
      "Stating motive, diagnosis or legal guilt in a factual report",
      "Confronting, trespassing or trying to rescue the horse",
      "Publishing names, images or allegations online",
      "Promising a particular enforcement or welfare outcome",
    ],
    knowledgeCheck: [
      {
        question: "Which statement is an appropriate first-hand observation?",
        options: [
          "No water was visible in the accessible container at the recorded time",
          "The owner deliberately caused suffering",
          "The horse definitely has a named disease",
          "A crime has been proved",
        ],
        correctIndex: 0,
        explanation:
          "The first statement records what was observed; motive, diagnosis and legal conclusions require authorised professional assessment.",
      },
      {
        question: "What should a learner do in an urgent welfare emergency?",
        options: [
          "Use the current emergency, veterinary or welfare route without delaying for confrontation or perfect evidence",
          "Enter the property and move the horse",
          "Post allegations online first",
          "Administer treatment before calling",
        ],
        correctIndex: 0,
        explanation:
          "Urgent concerns need prompt qualified response while the learner protects people, facts and the horse.",
      },
      {
        question: "Why should a learner avoid confronting the person involved?",
        options: [
          "It can endanger people and animals and interfere with authorised assessment",
          "Because welfare concerns should never be reported",
          "Because social media is the preferred route",
          "Because one generic checklist already proves the case",
        ],
        correctIndex: 0,
        explanation:
          "Safe formal reporting is more reliable than personal confrontation or unauthorised intervention.",
      },
    ],
    aiTutorPrompts: [
      "Help me rewrite an accusation as a factual first-hand observation",
      "Quiz me on urgent versus non-urgent reporting boundaries",
      "Give me a welfare scenario and ask which actions would be unsafe or unauthorised",
    ],
  },

  "welfare-legislation-uk": {
    objectives: [
      "Explain the difference between UK legislation, welfare-code guidance and a learner observation",
      "Use current official passport and identification guidance for the relevant UK nation and activity",
      "Avoid legal conclusions and route welfare concerns to authorised professionals and authorities",
    ],
    content: `## Scope and jurisdiction

This lesson gives a bounded introduction to England and Wales examples and is not legal advice. Animal welfare, horse identification, transport, medicines, employment, safeguarding and competition can involve different legislation, authorities and rules across England, Scotland, Wales and Northern Ireland. Requirements also change over time. Always check the current official source for the relevant jurisdiction, facts and activity.

The Animal Welfare Act 2006 contains provisions about responsibility for animals, unnecessary suffering, welfare, enforcement, prosecution, fines, disqualification and other matters in England and Wales. The Department for Environment, Food and Rural Affairs code of practice for horses describes suitable environment, healthy diet, normal behaviour, appropriate company and protection from pain, suffering, injury and disease.

The code itself explains that breach is not automatically an offence, although a court may consider compliance in proceedings. A learner must not state that an observation proves an offence, identify who is legally responsible or predict enforcement or penalty.

## Legislation, code and policy are different

Legislation is law enacted through the relevant legal process. A statutory or official code may explain expected practice and may have evidential relevance, but its legal effect depends on the instrument. An organisation's policy sets internal procedures and may reflect law, insurer or governing-body requirements. A competition rule governs participation under that body. Do not merge them into a single universal rule.

When recording a concern, cite the current source and date only if authorised and accurate. Do not copy a summary from this lesson into legal correspondence or rely on an old version.

## Welfare observation and professional assessment

Learners may record first-hand facts about environment, feed or water access, behaviour, visible condition or a hazard. They do not diagnose suffering, pain, disease, neglect or an offence. Use the responsible-person, veterinarian, welfare organisation, relevant authority or emergency route according to the current situation.

Do not confront, trespass, remove an animal, seize records, investigate or publish identifying allegations. Immediate danger requires the relevant emergency service.

## Passports and identification

United Kingdom government guidance on horse passports states that listed equines need a passport and describes keeping it with the animal, its contents and owner responsibilities. It includes specific update, death-return and microchip provisions and notes that rules differ across the UK nations. The exact requirements and exceptions must be checked on the current official page.

This lesson does not claim that every horse has the same microchip rule, that vaccination records are universally passport contents, or that a learner may inspect, complete, alter or retain a passport. The owner or authorised responsible person manages documents with the passport-issuing organisation, veterinarian and relevant authority.

Before transport, competition, sale, loan, movement or export, use current official, organiser, veterinarian and competent-transporter guidance. A passport alone does not prove travel fitness, ownership, eligibility or legal compliance.

## Records, medicines and professional care

Keep treatment and other required records under the current official and veterinary plan. Medicines remain under veterinary or authorised prescriber control. Do not infer a legal retention period, administer a product or disclose private records from this lesson.

Farriery, dental, vaccination, parasite and other professional-care requirements depend on current law, professional scope, governing rules and the individual horse. Avoid a universal service calendar or claim that one credential applies in every jurisdiction.

## Enforcement and advice

Authorities and courts apply law to evidence and facts. Welfare organisations may assess and support cases but do not all have identical powers. Police, local authorities, government agencies, veterinarians and courts have different roles. Use the current official contact and do not promise that a report will produce a visit, seizure, prosecution or conviction.

For a real legal question, seek appropriately qualified legal or official advice. For an emergency or welfare concern, use the operational route promptly rather than waiting for legal certainty.

## Source discipline

A sound learner answer states the jurisdiction, source, date and limit. For example: “Current GOV.UK guidance should be checked for the passport rule applying to this horse and movement.” It does not invent a deadline or penalty. The educational goal is knowing where authority sits and when to escalate.`,
    keyPoints: [
      "The Animal Welfare Act, official welfare code, organisation policy and competition rules have different roles",
      "Breach of the horse welfare code is not itself automatically an offence",
      "Learners report facts and do not decide legal responsibility, offence, enforcement or penalty",
      "Passport and microchip requirements differ by circumstance and UK nation and must be checked currently",
      "Use official, veterinary, legal, welfare and emergency routes rather than a static lesson summary",
    ],
    safetyNote:
      "This lesson is not legal advice. Do not confront, trespass, remove an animal, investigate, alter or retain official documents, publish allegations or declare an offence. Check the current official rule for the jurisdiction and use the responsible-person, veterinarian, welfare organisation, relevant authority, qualified legal adviser or emergency service as the situation requires.",
    practicalApplication:
      "Compare a fictional Act excerpt, welfare-code paragraph, yard policy and competition rule. Label each source type, identify jurisdiction and date, write one factual observation, and state which current official or professional route must answer the unresolved question.",
    commonMistakes: [
      "Treating the welfare code as if every breach automatically proves an offence",
      "Applying England guidance unchanged across all UK nations",
      "Stating a universal passport, microchip or vaccination-record rule",
      "Assuming a passport proves ownership, travel fitness or competition eligibility",
      "Promising a particular enforcement or court outcome",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the legal status of the horse welfare code described here?",
        options: [
          "Breach is not itself automatically an offence, though a court may consider the code",
          "Every departure automatically proves a crime",
          "It replaces the Animal Welfare Act",
          "It is a competition rule only",
        ],
        correctIndex: 0,
        explanation:
          "The code explains expected practice and possible evidential relevance without making every breach an automatic offence.",
      },
      {
        question: "How should a passport question be answered?",
        options: [
          "Check current official guidance for the relevant UK nation, horse and activity",
          "Use one universal rule from memory",
          "Assume the passport proves ownership and travel fitness",
          "Allow any learner to alter the document",
        ],
        correctIndex: 0,
        explanation:
          "Official identification requirements vary and change, so the current jurisdiction-specific source is required.",
      },
      {
        question: "Who decides whether observed facts amount to an offence?",
        options: [
          "The authorised legal and enforcement process applying current law to evidence",
          "A learner using a checklist",
          "A social-media audience",
          "The owner of a different horse",
        ],
        correctIndex: 0,
        explanation:
          "Learners report facts; authorities and courts make legal determinations within their powers.",
      },
    ],
    aiTutorPrompts: [
      "Help me distinguish legislation, code, policy and competition rule",
      "Quiz me on current passport guidance without inventing deadlines",
      "Give me a welfare fact pattern and ask which conclusions a learner must not make",
    ],
  },

  "ethical-training-methods": {
    objectives: [
      "Define reinforcement and punishment at a high level without teaching a force or timing procedure",
      "Place horse welfare, safety, consistency and qualified assessment before a training outcome",
      "Recognise behaviour or pain concerns that require veterinary or qualified behaviour support",
    ],
    content: `## Learning terms and welfare

World Horse Welfare guidance explains that horses learn through consequences and describes positive reinforcement, negative reinforcement, positive punishment and negative punishment within operant conditioning. In this terminology, positive and negative mean adding or removing something, not good and bad. Reinforcement is intended to make a behaviour more likely; punishment is intended to make a behaviour less likely.

Definitions alone do not make a method ethical, safe or effective. Timing, intensity, horse history, environment, health, handler skill and the behaviour all matter. This lesson provides no pressure-release, reward, punishment, desensitisation or equipment procedure and does not authorise an unqualified learner to retrain a horse.

Reviewed guidance recommends compassionate, consistent training and says methods risking injury or physical or emotional harm should not be used. It identifies flooding and positive punishment as ethically questionable and notes that fear and stress can impede learning. The individual horse's welfare remains the priority over compliance or performance.

## Start with health and context

Behaviour may provide information about stress, pain, discomfort, confusion, environment or learning, but it is not a diagnosis. World Horse Welfare behaviour guidance directs people concerned about behaviour to an equine behaviour professional or veterinarian. Sudden change, possible pain, lameness, illness, tack concern or unsafe behaviour is a stop and professional-assessment point—not a training problem to work through.

Record what happened: location, trigger if directly known, horse response, handler action and outcome. Avoid labels such as naughty, dominant, stubborn, learned helplessness or pain unless an appropriate professional assessment supports them.

## Define a qualified plan

An appropriately qualified professional identifies the desired observable behaviour, current context, safety controls, equipment, handler competence, welfare measures, stop points and review. The veterinarian or relevant professional addresses health contributors. The plan should be understandable to authorised handlers and applied consistently within scope.

Do not use a universal hierarchy, dominance theory, fixed repetition count or escalating force. Do not copy an online timing rule. A plan for one horse or behaviour cannot be transferred automatically to another.

## Reinforcement boundaries

Positive reinforcement adds something the horse values after a behaviour; negative reinforcement removes an applied stimulus after a behaviour. Those definitions do not prescribe a reward type, pressure, timing, intensity or handling sequence. Food use may introduce diet, medication, biting, competition, welfare and safety considerations and requires the current responsible plan.

Removing pressure is not automatically humane if the pressure or context creates fear, pain or harm. Adding a reward is not automatically safe or effective. Qualified observation and welfare review determine the plan.

## Punishment and aversive risk

Punishment aims to reduce behaviour, but it can involve welfare and safety risks and may not teach the desired alternative. Do not strike, shout, jerk equipment, flood, corner, chase or apply force from this lesson. Do not punish behaviour that may reflect pain, fear, confusion or an unsafe environment.

If a horse or person is at immediate risk, protect people and follow the site incident plan. Emergency containment is not a training session and should be reviewed by qualified professionals afterwards.

## Observe and review

During an authorised qualified session, record the observable goal, conditions, horse responses, professional adaptations and stop points. Do not infer an internal emotional state or claim a permanent result. The professional decides whether evidence supports continuing, simplifying, changing environment, referring or ending.

Progress should not be measured only by task completion. Include relaxation or distress observations within professional interpretation, safety, horse willingness to engage and whether the method avoids harm. A dramatic response is not proof of learning.

## Ethical decision test

Ask: Is health assessed where relevant? Is the aim necessary and observable? Are horse and handler safe? Is the method within professional competence? Can the horse respond without fear, pain or confusion? Are stop points clear? Is there a less harmful suitable option? Is the plan reviewed? If essential information is missing, do not train—seek qualified help.

Ethical practice is a continuing welfare decision, not allegiance to a label or technique.`,
    keyPoints: [
      "Positive and negative mean adding or removing; reinforcement and punishment describe intended effects on behaviour",
      "Definitions do not make a method safe, ethical or suitable for an individual horse",
      "Fear, stress, pain, health, environment and learning context require qualified assessment",
      "This lesson gives no pressure, reward, punishment, desensitisation, equipment or force procedure",
      "Use compassionate, consistent qualified planning with clear welfare stop points and professional referral",
    ],
    safetyNote:
      "Do not retrain a horse, apply pressure/force, strike, shout, jerk equipment, chase, corner, flood, punish or use food rewards from this lesson. Stop for sudden behaviour change, possible pain, fear, distress or loss of safe control and use the responsible person, veterinarian and appropriately qualified behaviour professional. Follow the site incident plan for immediate danger.",
    practicalApplication:
      "Review an instructor-provided fictional training claim. Identify the learning term used, observable behaviour, missing health/context evidence, potential welfare risks, professional competence needed, factual monitoring and the decision to proceed, simplify, refer or stop—without designing a technique.",
    commonMistakes: [
      "Assuming positive means ethical and negative means harmful",
      "Treating reinforcement or punishment definitions as a handling recipe",
      "Labelling behaviour as naughty, dominant or pain without assessment",
      "Escalating force when the horse is afraid, confused or uncomfortable",
      "Measuring success only by visible compliance or a dramatic response",
    ],
    knowledgeCheck: [
      {
        question:
          "What do positive and negative mean in operant-conditioning terminology?",
        options: [
          "Adding or removing something",
          "Kind and cruel",
          "Successful and unsuccessful",
          "Safe and dangerous",
        ],
        correctIndex: 0,
        explanation:
          "The terms describe whether something is added or removed; ethics and welfare require separate assessment.",
      },
      {
        question:
          "What should happen after a sudden behaviour change that may involve pain?",
        options: [
          "Stop and seek responsible veterinary or qualified behaviour assessment",
          "Increase pressure until the horse complies",
          "Diagnose dominance",
          "Apply a punishment sequence",
        ],
        correctIndex: 0,
        explanation:
          "Behaviour can have health and other causes and should not be trained through without appropriate assessment.",
      },
      {
        question: "What makes a training decision ethical?",
        options: [
          "Individual health/context review, competent planning, safety, welfare, least-harmful suitable choice and clear stop points",
          "Use of any method called positive",
          "Fast visible compliance",
          "A universal technique copied from another horse",
        ],
        correctIndex: 0,
        explanation:
          "Ethics depends on the individual context, welfare and competent process rather than a label or outcome alone.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on reinforcement and punishment terms without teaching a procedure",
      "Help me rewrite a behaviour label as a factual observation",
      "Give me a training claim and ask which health, welfare and competence questions are missing",
    ],
  },

  "end-of-life-decisions": {
    objectives: [
      "Explain advance end-of-life planning and veterinarian-led individual welfare assessment",
      "Distinguish factual quality-of-life observations from diagnosis or a euthanasia decision",
      "Use authorised emergency, insurance, document, rehoming, aftercare and bereavement routes",
    ],
    content: `## Plan before a crisis

End-of-life planning is part of responsible ownership and should begin before an emergency. World Horse Welfare and British Horse Society guidance supports advance planning, individual quality-of-life consideration, veterinary and other professional advice and not delaying urgent welfare action for insurance. Every situation is different. This lesson therefore gives no fixed review cadence, quality-of-life score, trend window, prognosis, method, cost or decision threshold.

The attending veterinarian and authorised owner or responsible person lead medical and welfare decisions. The American Association of Equine Practitioners euthanasia guidance supports euthanasia where appropriate for the horse and describes the veterinarian's role in assessing need, especially suffering; method choice involves law, training, experience and final disposition. Learners do not select or perform a method.

## Build the advance plan

Keep current veterinarian and emergency contacts, horse identification and health information, owner wishes, authorised substitute decision-maker, insurance details, transport constraints, location options and aftercare contacts accessible. Discuss the plan with the veterinary practice and relevant yard before an emergency. Confirm how costs and consent are handled when the owner cannot be reached.

The plan should identify who may make decisions, who may be present, how other horses and people are managed and who contacts insurers or document authorities. It must remain adaptable; it is not a promise that one route will be possible.

## Quality-of-life observations

Owners and carers can keep factual records requested by the veterinarian: appetite, drinking, movement, rest, interaction, pain behaviours identified through professional guidance, response to current treatment and ability to perform the individual care plan. Do not diagnose pain, disease, prognosis or suffering from a generic checklist or decide that one good or bad day settles the outcome.

The veterinarian interprets health and treatment information with the owner. Other qualified professionals may contribute within scope. If welfare deteriorates or an emergency develops, contact the veterinarian promptly rather than waiting for a scheduled review or collecting more scores.

## Emergency decision boundary

In an emergency, protect people and call the veterinarian or emergency service under the current plan. Do not move, feed, medicate or treat the horse unless the veterinarian directs it. Do not delay urgent welfare action for insurance pre-authorisation, paperwork, transport comparison or a second opinion that cannot arrive safely.

This lesson does not describe euthanasia techniques, drugs, equipment, handling, restraint, body movement or confirmation of death. Those are restricted professional and legal matters.

## Retirement and rehoming

World Horse Welfare rehoming guidance supports early exploration, accurate information, suitability review, written loan arrangements and contingency planning and recognises that rehoming may not be appropriate. Retirement also requires adequate resources, welfare monitoring and a realistic professional plan.

Do not treat rehoming as an automatic alternative to an end-of-life decision or promise that an organisation will accept or protect the horse. The veterinarian and responsible owner consider health, welfare, safety, suitability, finance, legal and practical facts. Concealing a condition or behaviour is unacceptable.

## Insurance, passports and aftercare

Insurance terms, notification, evidence and authorisation vary. Read the current policy and speak to the insurer, but welfare remains the priority. Passport or identification, death notification, medicines and aftercare requirements depend on jurisdiction and chosen authorised route. Use current veterinarian, official authority and licensed or competent service-provider guidance.

Aftercare options and availability vary by location, method, land, disease control, law and owner preference. This lesson does not recommend burial, cremation, collection or another route or provide legal dimensions or time limits.

## People and bereavement

End-of-life decisions affect owners, carers, staff and learners. Communicate with consent and protect privacy. Children and adults at risk need safeguarding-appropriate support. A coach or yard worker should not provide counselling beyond competence; use appropriate bereavement, healthcare or support services.

Do not pressure, blame or publicly debate an individual's decision. Staff safety, other horses and the veterinary team's instructions must be respected.

## Review the plan

After a planned discussion or event, update authorised records and contacts, record decisions factually and review operational lessons without disclosing private clinical details. The educational goal is timely veterinarian-led welfare action, clear authority and compassionate preparation—not teaching a learner to decide or perform euthanasia.`,
    keyPoints: [
      "Advance planning establishes contacts, authority, information, insurance and possible operational routes",
      "Quality-of-life records are factual inputs to veterinarian-led individual assessment, not a learner score or diagnosis",
      "Urgent welfare action must not be delayed for insurance or paperwork",
      "This lesson teaches no euthanasia method, drug, equipment, threshold or aftercare prescription",
      "Retirement, rehoming, documents, aftercare and bereavement require current individual professional and legal review",
    ],
    safetyNote:
      "Do not diagnose suffering, decide or perform euthanasia, describe or use methods/drugs/equipment, move or treat an emergency horse without veterinary direction, or delay urgent welfare action for insurance or paperwork. Use the attending veterinarian, authorised owner, emergency plan, insurer, current authority and licensed aftercare routes. Protect privacy and safeguarding needs.",
    practicalApplication:
      "Create a fictional advance-plan checklist containing veterinary contacts, substitute authority, horse information, insurance, emergency communication, possible aftercare questions, other-horse/people safety and support routes. Exclude methods, clinical thresholds and fixed review intervals.",
    commonMistakes: [
      "Using a generic quality-of-life score as the final decision",
      "Waiting for a fixed review date despite urgent deterioration",
      "Delaying veterinary welfare action for insurer or document approval",
      "Treating rehoming as automatically suitable",
      "Discussing euthanasia methods or private clinical details with unauthorised people",
    ],
    knowledgeCheck: [
      {
        question: "Who leads the individual medical and welfare assessment?",
        options: [
          "The attending veterinarian with the authorised owner or responsible person",
          "Any learner using a generic score",
          "The insurer alone",
          "A social-media group",
        ],
        correctIndex: 0,
        explanation:
          "The veterinarian interprets the individual clinical and welfare context with the authorised decision-maker.",
      },
      {
        question: "What should happen in an urgent welfare emergency?",
        options: [
          "Contact the veterinarian promptly and do not delay necessary action for insurance or paperwork",
          "Wait for the next scheduled score",
          "Choose and perform a method from educational material",
          "Move and medicate the horse without direction",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed guidance prioritises timely welfare action and veterinary direction over administrative delay.",
      },
      {
        question: "How should rehoming be considered?",
        options: [
          "Through early individual welfare, health, suitability, resource and contingency review",
          "As an automatic alternative for every horse",
          "By concealing health and behaviour concerns",
          "As a guarantee that an organisation will accept the horse",
        ],
        correctIndex: 0,
        explanation:
          "Rehoming can be appropriate in some cases but requires honest individual professional review and may not be suitable.",
      },
    ],
    aiTutorPrompts: [
      "Help me build an advance plan without clinical thresholds or methods",
      "Quiz me on factual quality-of-life records versus veterinary decisions",
      "Give me an insurance delay scenario and ask which welfare action takes priority",
    ],
  },

  "understanding-horse-behaviour": reviewedBoundaryLesson({
    title: "understanding horse behaviour",
    evidence:
      "Reviewed World Horse Welfare guidance supports regular observation of the individual horse, precise behavioural language and referral to a veterinarian or suitably qualified behaviour professional when change, stress, pain or discomfort is suspected.",
    learnerRole:
      "observe behaviour safely, compare it with an authorised individual baseline and report change factually",
    decisionOwner:
      "the responsible person, veterinarian and suitably qualified equine behaviour professional",
    observations:
      "body position, movement, orientation, vocalisation, interaction, location, sequence, frequency and change from the horse's recorded normal pattern",
    excluded:
      "diagnosis, temperament labels, provocation, punishment, behaviour modification or a guaranteed interpretation",
    stopAndEscalate:
      "Stop for threat to people or horses, sudden change, possible pain or distress, loss of control or any behaviour the current plan marks for urgent review.",
    practice:
      "Review a fictional observation log, separate visible behaviour from interpretation, and prepare a neutral handover to the named responsible professional.",
  }),
  "behaviour-around-other-horses": reviewedBoundaryLesson({
    title: "behaviour around other horses",
    evidence:
      "Reviewed welfare guidance treats behaviour as communication affected by the individual horse and context. Introductions, turnout groups, spacing and handling must follow the current management plan rather than a universal hierarchy formula.",
    learnerRole:
      "observe interactions from an authorised safe position and report sequence, distance and change without entering the group",
    decisionOwner:
      "the responsible yard manager with veterinary or qualified behaviour support where needed",
    observations:
      "approach and withdrawal, orientation, movement, access to resources, displacement, separation, repeated pursuit and any change from the current group pattern",
    excluded:
      "entering a conflict, assigning dominance labels, forcing proximity, changing a group or diagnosing aggression",
    stopAndEscalate:
      "Use the emergency route for an injured, trapped, loose or uncontrollable horse; otherwise report repeated pursuit, exclusion, distress or marked behavioural change promptly.",
    practice:
      "Annotate a fictional group-observation timeline from outside the enclosure, then identify facts, unknowns, stop points and the authorised management decision.",
  }),
  "recognising-pain-discomfort": reviewedBoundaryLesson({
    title: "recognising pain and discomfort",
    evidence:
      "World Horse Welfare guidance says subtle behavioural change can accompany pain, discomfort or stress and that concern should be referred to an equine veterinarian or behaviour professional. A checklist is a prompt, not a diagnosis.",
    learnerRole:
      "notice and record change, stop the relevant activity and make an early factual report",
    decisionOwner:
      "the veterinarian, supported by the responsible person and other qualified professionals",
    observations:
      "posture, facial or ridden behaviour, movement, appetite, interaction, response to tack or work, onset and change from the individual baseline",
    excluded:
      "pain scoring as diagnosis, flexion or ridden testing, palpation, medication, treatment or declaring the horse sound",
    stopAndEscalate:
      "Stop work for possible pain or discomfort and contact the responsible person; use the veterinary emergency plan for severe, sudden or rapidly worsening concern.",
    practice:
      "Turn a fictional set of loaded statements such as 'naughty' or 'stubborn' into time-stamped behavioural observations and an appropriate veterinary handover.",
  }),
  "welfare-based-decision-making": reviewedBoundaryLesson({
    title: "welfare-based decision making",
    evidence:
      "The reviewed equine welfare framework uses nutrition, physical environment, health, behavioural interactions and mental state as connected domains. It supports individual, evidence-led review without turning a learner checklist into a legal or clinical verdict.",
    learnerRole:
      "collect authorised facts across welfare domains and raise concerns through the current route",
    decisionOwner:
      "the responsible owner or organisation with relevant veterinary, welfare and legal professionals",
    observations:
      "resources, environment, health-related change, opportunities and constraints on behaviour, interaction and the horse's observable responses over time",
    excluded:
      "a welfare score as proof, legal conclusions, public allegations, trespass, confrontation or unilateral management changes",
    stopAndEscalate:
      "Escalate immediate danger through the current emergency route and other concerns through the authorised welfare process, preserving factual records and confidentiality.",
    practice:
      "Sort a fictional welfare record by domain, identify gaps and urgent facts, and draft a neutral report that makes no diagnosis or legal finding.",
  }),
  "basic-tack-identification": reviewedBoundaryLesson({
    title: "basic tack identification",
    evidence:
      "Reviewed British Horse Society and University of Kentucky material supports identifying common saddle and bridle components while making correct condition, fit and suitability essential to horse and rider comfort and safety.",
    learnerRole:
      "name visible components on instructor-approved equipment and report damage, contamination or uncertainty",
    decisionOwner:
      "the responsible coach and appropriately qualified saddle, bridle or bit fitter",
    observations:
      "equipment identity, attachment points, visible wear, cracks, distortion, stitching, cleanliness, symmetry and the horse or rider response reported during use",
    excluded:
      "declaring fit, selecting tack, adjusting unfamiliar equipment, repairing safety-critical parts or using equipment with uncertain identity",
    stopAndEscalate:
      "Do not tack up or ride with damaged, incomplete, incorrectly assembled, unknown or disputed equipment; isolate it as directed and tell the responsible person.",
    practice:
      "Use labelled photographs to distinguish saddle and bridle components, then write an inspection handover without making a fit decision.",
  }),
  "putting-on-a-headcollar": reviewedBoundaryLesson({
    title: "putting on a headcollar",
    evidence:
      "Reviewed safe-handling guidance supports a calm approach from the front towards the shoulder, avoidance of blind areas, secure controlled equipment and horse-specific supervision. The exact headcollar method depends on the individual and current yard procedure.",
    learnerRole:
      "rehearse the approved sequence under direct competent supervision with a suitable horse and escape route",
    decisionOwner:
      "the responsible competent handler for the individual horse and setting",
    observations:
      "horse awareness and position, handler escape space, gate state, headcollar condition and orientation, lead-rope control and changes in tension or movement",
    excluded:
      "catching an unknown or difficult horse alone, wrapping rope around the body, force, improvised equipment or universal fitting measurements",
    stopAndEscalate:
      "Step away and seek the competent handler if the horse moves unpredictably, threatens, pulls away, becomes trapped or the area, equipment or procedure is unsafe.",
    practice:
      "Order picture cards for the site's approved supervised headcollar process and identify at every stage where the learner pauses for the handler's confirmation.",
  }),
  "tack-care-cleaning": reviewedBoundaryLesson({
    title: "tack care and cleaning",
    evidence:
      "Reviewed tack guidance makes regular inspection, correct assembly and horse comfort important. Materials and products vary, so cleaning and maintenance must follow manufacturer, owner and qualified-fitter instructions.",
    learnerRole:
      "identify equipment, follow an authorised product-specific cleaning plan and report defects before reassembly or use",
    decisionOwner:
      "the equipment owner, responsible coach and appropriately qualified fitter or repairer",
    observations:
      "material, label, contamination, moisture, cracking, stretching, corrosion, stitching, fasteners, symmetry, missing parts and the authorised storage condition",
    excluded:
      "unlabelled chemicals, soaking or heating by default, structural repair, altering holes, substituting parts or declaring damaged tack serviceable",
    stopAndEscalate:
      "Stop for unknown materials or products, damaged safety-critical parts, missing components, contamination or an assembly that cannot be verified against the current record.",
    practice:
      "For fictional leather and synthetic items, match each to its current manufacturer instruction and create a condition record without attempting repair or fit approval.",
  }),
  "fitting-a-saddle": reviewedBoundaryLesson({
    title: "fitting a saddle",
    evidence:
      "Reviewed British Horse Society guidance states that saddle fit affects horse and rider comfort and can change with work, age, season and body shape. Qualified saddle fitting and periodic reassessment cannot be replaced by fixed finger, clearance or balance rules.",
    learnerRole:
      "make pre-use visible checks, note horse and rider responses and stop when fit or condition is uncertain",
    decisionOwner:
      "a Society of Master Saddlers qualified saddle fitter with the coach, owner and veterinarian where relevant",
    observations:
      "saddle identity, visible condition and placement, pad and girth arrangement, slipping or movement, unevenness, new rubs and factual horse or rider responses",
    excluded:
      "fit approval, flocking or structural adjustment, pad prescriptions, fixed clearance measurements, pain diagnosis or riding to test disputed fit",
    stopAndEscalate:
      "Do not mount or continue when the saddle is damaged, wrongly identified, unstable, disputed, associated with discomfort or due for review under the current plan.",
    practice:
      "Review fictional pre-use records and decide which observations can be reported immediately and which questions require the qualified fitter's assessment.",
  }),
  "advanced-equipment-awareness": reviewedBoundaryLesson({
    title: "advanced equipment awareness",
    evidence:
      "Reviewed tack, coaching and welfare sources make additional equipment purpose-, rule-, fit- and individual-dependent. Complexity does not justify learner selection, and equipment must not mask pain, fear or a training problem.",
    learnerRole:
      "identify authorised equipment, verify the current record and report visible condition or horse-response concerns",
    decisionOwner:
      "the qualified coach and relevant fitter, veterinarian or current governing official",
    observations:
      "item identity, authorised purpose, attachment, condition, current rule status, changes from the recorded setup and factual responses before, during and after use",
    excluded:
      "selecting stronger equipment, inventing a purpose, copying adjustments, tightening to control behaviour or using equipment to diagnose or treat",
    stopAndEscalate:
      "Stop when an item is unrecorded, damaged, incorrectly assembled, prohibited, associated with discomfort or being used outside the qualified plan.",
    practice:
      "Audit a fictional equipment sheet against photographs, flag identity and authorisation gaps, and route each decision to the correct professional.",
  }),
  "walk-trot-transitions-developing": reviewedBoundaryLesson({
    title: "developing walk-trot transitions",
    evidence:
      "Reviewed safe-riding and coach material places rider position, communication, progression, horse suitability and welfare within an individual supervised lesson. It does not support fixed repetition counts or a universal aid sequence for every combination.",
    learnerRole:
      "ride only the exercise and aids set by the present qualified coach and report loss of balance, control or comfort",
    decisionOwner:
      "the qualified coach assessing the actual horse, rider, tack, arena and conditions",
    observations:
      "coach instruction, pace change, route, balance, control, horse response, rider confidence, surface and any change during the session",
    excluded:
      "self-prescribed repetitions, stronger aids, punishment, biomechanical diagnosis, teaching others or continuing after the coach's stop signal",
    stopAndEscalate:
      "Stop or simplify under the coach's direction for loss of control or balance, horse discomfort, rider fear, equipment concern, unsafe traffic or deteriorating surface.",
    practice:
      "From an instructor-approved video, record the instruction-response sequence and identify which progression and stop decisions belong to the coach.",
  }),
  "steering-and-accuracy": reviewedBoundaryLesson({
    title: "steering and accuracy",
    evidence:
      "Reviewed coach guidance treats steering, position, communication and progressive activities as supervised individual skills. Arena figures, aids, accuracy targets and progression depend on the horse, rider, facility and lesson goal.",
    learnerRole:
      "follow the qualified coach's current route and aids while maintaining awareness of other users and boundaries",
    decisionOwner: "the qualified coach and responsible arena operator",
    observations:
      "announced route, spacing, pace, line actually travelled, balance, traffic, surface, horse response, rider understanding and coach feedback",
    excluded:
      "unannounced figures, universal rein or leg formulas, force, fixed geometry, self-coaching through difficulty or diagnosing resistance",
    stopAndEscalate:
      "Use the arena stop process for loss of control, collision risk, horse or rider discomfort, unclear instruction, equipment concern or unsafe footing.",
    practice:
      "Mark factual route and traffic observations on a fictional arena diagram, without prescribing aids or declaring the cause of an inaccurate line.",
  }),
  "warmup-cooldown-basics": reviewedBoundaryLesson({
    title: "warm-up and cool-down basics",
    evidence:
      "Reviewed horse-fitness and hot-weather guidance supports gradual individual preparation and recovery, reduction or stopping when conditions or responses are concerning, and prompt cooling with cool water for heat-related concern while professional advice is obtained.",
    learnerRole:
      "follow the current coach-led individual plan and report contextual changes without applying numeric self-triage",
    decisionOwner:
      "the qualified coach with the responsible person and veterinarian for health concerns",
    observations:
      "planned activity, weather and surface, pace, breathing appearance, movement, behaviour, sweating, rider control and change against the individual's normal response",
    excluded:
      "fixed durations, pulse or temperature cut-offs, fitness diagnosis, forced exercise, universal stretching or restarting after a concern",
    stopAndEscalate:
      "Stop for distress, unusual movement or behaviour, excessive heat concern, poor control, pain suspicion or failure to recover as the individual plan expects, then use the professional route.",
    practice:
      "Compare two fictional session records and explain why the coach needs individual context rather than a universal warm-up or recovery time.",
  }),
  "preparing-for-a-lesson": reviewedBoundaryLesson({
    title: "preparing for a riding lesson",
    evidence:
      "Reviewed first-lesson, equipment and coaching guidance supports suitable clothing, correctly fitted equipment, horse-rider suitability, risk assessment and a clear briefing before practical activity.",
    learnerRole:
      "complete the assigned identity, clothing, equipment, area and briefing checks and report any gap",
    decisionOwner: "the responsible qualified coach and facility team",
    observations:
      "participant identity and needs, horse allocation, protective equipment, tack record, visible damage, arena condition, weather, access, emergency process and understanding of signals",
    excluded:
      "declaring horse-rider suitability, fitting tack or helmets, substituting equipment, entering an unapproved area or starting without the coach",
    stopAndEscalate:
      "Do not start when the coach, suitable horse, approved protective equipment, verified tack, safe area, briefing or emergency arrangements are missing.",
    practice:
      "Use a fictional lesson manifest to identify verified items, uncertainties and the people who must resolve them before the session begins.",
  }),
  "reflecting-on-performance": reviewedBoundaryLesson({
    title: "reflecting on performance",
    evidence:
      "Reviewed coaching material includes receiving feedback and evaluating strengths and areas for improvement. Reflection should use agreed goals and factual evidence without diagnosing a horse, blaming a person or setting unsafe unsupervised practice.",
    learnerRole:
      "compare factual session evidence with the coach-agreed goal and record questions, strengths and next-review points",
    decisionOwner:
      "the qualified coach with the participant and, for horse health or welfare, the relevant professional",
    observations:
      "original aim, coach instruction, task attempted, observable result, participant report, horse response, conditions, stop decisions and exact feedback received",
    excluded:
      "self-diagnosis, horse blame, invented causation, universal improvement deadlines or independent progression into higher-risk work",
    stopAndEscalate:
      "Escalate any pain, fear, welfare, equipment or safeguarding concern instead of turning it into a performance target; do not plan repetition of an unsafe event.",
    practice:
      "Rewrite a judgemental fictional reflection into evidence, uncertainty, coach feedback and one authorised next step with a defined review owner.",
  }),
  "advanced-flatwork-and-collection": reviewedBoundaryLesson({
    title: "advanced flatwork and collection",
    evidence:
      "Reviewed professional coach and competition material makes advanced flatwork dependent on correct current terminology, horse-rider readiness, progressive qualified training and welfare. A written lesson cannot prescribe collection or advanced movements.",
    learnerRole:
      "observe or ride only the individual exercise, aids and progression directed by the qualified coach",
    decisionOwner:
      "an appropriately qualified coach with veterinary and tack professionals where concern arises",
    observations:
      "the stated aim, current movement, rhythm, balance, control, horse and rider response, surface, equipment and the coach's adaptation or stop decision",
    excluded:
      "forcing an outline, fixed repetitions, universal aids, movement diagnosis, self-teaching advanced work or equating head position with collection",
    stopAndEscalate:
      "Stop or return to simpler work under the coach for loss of rhythm, balance or control, resistance, discomfort, fatigue, equipment concern or unsuitable conditions.",
    practice:
      "Analyse an instructor-selected clip using neutral movement observations and identify every interpretation or progression decision that belongs to the coach.",
  }),
  "trot-pole-distances-and-grids": reviewedBoundaryLesson({
    title: "trot-pole distances and grids",
    evidence:
      "Reviewed coaching standards require poles and related distances to be suitable, measured correctly and adjusted for the actual horse, rider and session. That is qualified-coach work, not a universal distance table.",
    learnerRole:
      "observe the coach-led setup, helper roles, horse-rider response and stop process without deriving measurements",
    decisionOwner:
      "the appropriately qualified coach controlling the exercise and arena",
    observations:
      "exercise purpose, equipment and surface checks, authorised helper positions, approach and response, displaced poles, balance, control and coach-directed adjustment",
    excluded:
      "distances, personal pacing, stride formulas, construction, adjustment, unauthorised entry into the line or riding from an online diagram",
    stopAndEscalate:
      "Keep the line clear while a horse approaches; stop for a fall, loose horse, damaged equipment, repeated difficulty, discomfort, loss of control or unsafe surface.",
    practice:
      "Review a measurement-free fictional polework plan and identify decision roles, helper boundaries, observations and stop triggers without reconstructing the exercise.",
  }),
  "mucking-out-and-bedding": reviewedBoundaryLesson({
    title: "mucking out and bedding",
    evidence:
      "Reviewed welfare, horse-keeping and yard-safety guidance requires a clean, suitable environment, safe tools and work methods, hazard control and an individual management plan. Bedding type, depth, disposal and cleaning frequency are not universal.",
    learnerRole:
      "follow the current site method under supervision, control tools and record condition or resource concerns",
    decisionOwner:
      "the responsible yard manager with veterinary, fire, waste and supplier advice where relevant",
    observations:
      "horse location, entry control, bedding identity and condition, wet or soiled areas, sharp objects, dust, mould, pests, drainage, tool condition and disposal route",
    excluded:
      "mixing products, changing bedding, prescribing depths or schedules, entering with an unsafe horse, tasting or directly handling unknown material",
    stopAndEscalate:
      "Stop for an unsecured horse, blocked exit, fire or chemical risk, sharp object, unstable stack, excessive dust, suspected contamination, unsafe tool or unknown disposal route.",
    practice:
      "Audit a fictional stable-work card for horse separation, tool control, material hazards, authorised disposal, completion checks and escalation gaps.",
  }),
  "stable-routines-and-record-keeping": reviewedBoundaryLesson({
    title: "stable routines and record keeping",
    evidence:
      "Reviewed horse-keeping and welfare material supports regular individual care, current records and prompt response to change. Exact frequency, order and content depend on the horse, facility, legal duties and professional plan.",
    learnerRole:
      "perform only assigned routine checks and enter time-stamped facts and authorised actions in the approved record",
    decisionOwner:
      "the responsible yard manager and relevant veterinary or welfare professional",
    observations:
      "horse identity and location, feed and water provision, environment, droppings or urination observation, behaviour, visible health change, turnout, work, medication instructions and completed tasks",
    excluded:
      "backdating, copying another horse's plan, recording an action not done, diagnosis, medication changes or omitting an error",
    stopAndEscalate:
      "Report missed or incorrect care, identity uncertainty, health or behaviour change, inaccessible records, medication discrepancy or immediate welfare risk through the current route.",
    practice:
      "Correct a fictional shift record containing copied values, missing sources and an undocumented error, preserving what is known and escalating what is not.",
  }),
  "yard-maintenance-and-facilities": reviewedBoundaryLesson({
    title: "yard maintenance and facilities",
    evidence:
      "Reviewed yard, fire and workplace risk guidance supports planned inspection, competent maintenance, controlled access and review when conditions change. It does not justify universal dimensions, repair intervals or learner-led structural work.",
    learnerRole:
      "observe assigned areas, isolate or mark hazards only as authorised and report exact location and condition",
    decisionOwner:
      "the responsible facility manager and competent trade, fire, electrical, structural or safety professional",
    observations:
      "boundaries, gates, floors, drainage, lighting, ventilation appearance, storage, traffic routes, electrical or fire equipment condition, sharp edges, access and recent change",
    excluded:
      "structural, electrical or machinery repair, confined-space entry, chemical treatment, declaring compliance or reopening an isolated area",
    stopAndEscalate:
      "Prevent access only within the site procedure and escalate fire, electrical, structural, machinery, chemical, blocked-exit or horse-containment hazards immediately.",
    practice:
      "From a fictional site map and defect log, write precise hazard locations, choose the authorised isolation route and assign competent review without prescribing repair.",
  }),
  "why-rider-fitness-matters": reviewedBoundaryLesson({
    title: "why rider fitness matters",
    evidence:
      "Reviewed rider and public-health guidance supports individual physical preparation, gradual activity and attention to pain, illness, medication, disability and wellbeing. Fitness is personal and cannot be inferred from appearance or a single test.",
    learnerRole:
      "reflect on personal demands and responses, follow approved coaching and healthcare advice and report relevant limitations privately",
    decisionOwner:
      "the participant with an appropriate healthcare professional and qualified coach",
    observations:
      "the activity attempted, perceived effort and confidence, control, coordination, fatigue, pain or dizziness report, recovery experience and environmental conditions",
    excluded:
      "diagnosis, body judgement, mandatory targets, exercise prescription for others, training through illness or sharing private health information",
    stopAndEscalate:
      "Stop activity for chest pain, fainting, severe breathing difficulty, sudden neurological symptoms, injury or other urgent concern and use local emergency care; seek healthcare advice for uncertainty.",
    practice:
      "Build a fictional confidential demand-and-support profile that records rider goals, current advice, access needs and stop criteria without grading body shape or diagnosing fitness.",
  }),
  "core-exercises-for-riders": reviewedBoundaryLesson({
    title: "core exercises for riders",
    evidence:
      "Reviewed public-health and rider guidance supports gradual, suitable strength and balance activity while recognising individual health, pain, pregnancy, disability and injury considerations. No exercise is universally safe or required for riding.",
    learnerRole:
      "choose only activities already approved for the individual and use qualified instruction for technique and progression",
    decisionOwner:
      "the participant and relevant healthcare or appropriately qualified exercise professional, coordinated with the riding coach",
    observations:
      "exercise identity, instruction source, starting condition, comfort, control, pain or dizziness report, adaptation, environment and actual response",
    excluded:
      "prescribing sets, holds or loads, diagnosing weakness, training through pain, breath-holding rules or using riding as a medical test",
    stopAndEscalate:
      "Stop for pain, dizziness, faintness, unusual shortness of breath, loss of control or a health-plan conflict and seek appropriate healthcare or emergency advice.",
    practice:
      "Review fictional exercise cards and retain only those with a named instruction source, individual approval, accessible adaptation, clear stop point and review owner.",
  }),
  "introduction-to-coaching-concepts": reviewedBoundaryLesson({
    title: "introductory coaching concepts",
    evidence:
      "Reviewed professional coach guidance identifies duty of care, horse welfare, participant-centred practice, communication, rapport, motivation, feedback, risk management and reflective development as coaching responsibilities.",
    learnerRole:
      "observe qualified coaching and practise planning or communication only in authorised simulated or supervised settings",
    decisionOwner:
      "the qualified coach and responsible organisation under its current policies",
    observations:
      "stated aim, participant needs, horse suitability decision, risk controls, communication method, engagement, feedback, adaptation, timing and welfare response",
    excluded:
      "unsupervised coaching, qualification claims, clinical advice, horse-rider matching, safeguarding investigation or practice beyond competence",
    stopAndEscalate:
      "Stop a practice activity for safety, welfare, safeguarding, distress, equipment or competence concern and use the organisation's named reporting process.",
    practice:
      "Observe a fictional coaching segment and map each action to planning, communication, adaptation, welfare, feedback or escalation without judging accreditation.",
  }),
  "foundations-of-equestrian-coaching": reviewedBoundaryLesson({
    title: "foundations of equestrian coaching",
    evidence:
      "Reviewed professional guidance makes participant safety, horse welfare, suitable planning, effective communication, adaptation, feedback and evaluation core coaching responsibilities. Written study does not confer practical coaching competence.",
    learnerRole:
      "develop supervised planning and observation skills while making competence and authority limits explicit",
    decisionOwner:
      "the qualified coach, facility and safeguarding lead within current organisational policy",
    observations:
      "participant goal and needs, horse suitability decision, risk assessment, equipment, lesson stages, communication, progression, response, feedback and review",
    excluded:
      "leading unsupervised sessions, horse allocation, high-risk progression, medical or mental-health treatment, qualification claims or policy overrides",
    stopAndEscalate:
      "Pause when scope, supervision, horse suitability, participant consent, welfare, safeguarding, equipment or emergency arrangements are not confirmed.",
    practice:
      "Critique a fictional lesson outline for evidence, role clarity, horse and participant welfare, adaptations, feedback and escalation before any practical delivery.",
  }),
  "planning-effective-lessons": reviewedBoundaryLesson({
    title: "planning effective lessons",
    evidence:
      "Reviewed coach standards include risk assessment, aims, objectives, equipment, introduction and suitability, preparation, main activity, adaptation, cool-down, conclusion and evaluation. Actual choices remain contextual.",
    learnerRole:
      "draft a plan for qualified review and update it when authorised facts or conditions change",
    decisionOwner: "the qualified coach and responsible facility team",
    observations:
      "participant needs and consent, horse suitability decision, environment, equipment, aim, observable objective, sequence, communication, contingency, stop criteria and review evidence",
    excluded:
      "self-authorising delivery, fixed one-size timings, unassessed horse-rider matching, clinical decisions or progression beyond participant competence",
    stopAndEscalate:
      "Do not deliver when the responsible coach has not approved the plan or when horse, participant, equipment, environment, safeguarding or emergency controls differ materially.",
    practice:
      "Draft a fictional plan with each assumption labelled for qualified confirmation and a contingency that simplifies or stops instead of forcing the objective.",
  }),
  "managing-groups-and-progression": reviewedBoundaryLesson({
    title: "managing groups and progression",
    evidence:
      "Reviewed coach guidance requires consistent expectations, conflict handling, time management, individual adaptation, suitable horses and progressive activities within a supervised group lesson.",
    learnerRole:
      "observe group positioning, communication, individual response and coach decisions without directing a live group",
    decisionOwner:
      "the qualified coach with the facility and safeguarding lead where relevant",
    observations:
      "group size and layout, individual goals and access needs, horse suitability, spacing, traffic, understanding, confidence, behaviour, welfare, feedback and progression decision",
    excluded:
      "ranking people publicly, forced progression, group punishment, unsupervised instruction, horse swaps or disclosure of private support information",
    stopAndEscalate:
      "Stop or reorganise only under the coach's direction for collision risk, loss of control, distress, welfare concern, conflict, exclusion, safeguarding concern or unequal access to help.",
    practice:
      "Use a fictional group map to identify observation positions, communication channels, individual adaptations, regroup points and the coach's progression authority.",
  }),
  "stretching-for-riders": reviewedBoundaryLesson({
    title: "stretching for riders",
    evidence:
      "Reviewed public-health guidance supports individual, comfortable physical activity and professional advice when health conditions, pain, injury, pregnancy or disability affect exercise. A generic stretch list cannot assess or treat an individual.",
    learnerRole:
      "follow only an individually suitable, approved routine and report discomfort or health conflicts",
    decisionOwner:
      "the participant with a qualified healthcare or exercise professional and the riding coach",
    observations:
      "activity identity and source, body position as instructed, comfort, range without forcing, pain or dizziness report, balance, environment and response afterwards",
    excluded:
      "diagnosis, forced range, partner pressure, bouncing prescriptions, fixed holds, rehabilitation claims or stretching through pain",
    stopAndEscalate:
      "Stop for pain, dizziness, numbness, weakness, loss of balance, acute injury or a conflict with healthcare advice; use urgent care for serious symptoms.",
    practice:
      "Evaluate fictional stretching instructions for named source, individual approval, accessible support, non-forced range, stop criteria and professional review.",
  }),
  "overcoming-fear-and-anxiety": reviewedBoundaryLesson({
    title: "fear and anxiety in equestrian activity",
    evidence:
      "Reviewed National Health Service and British Equestrian wellbeing guidance recognises that anxiety can affect thoughts, feelings, behaviour and the body, and that support should be individual. Coaching support is not mental-health diagnosis or treatment.",
    learnerRole:
      "name personal experience voluntarily, use agreed low-risk support and retain the right to pause or stop",
    decisionOwner:
      "the participant, qualified coach and appropriate healthcare or mental-health professional",
    observations:
      "the participant's own words, consent, trigger context, requested support, confidence, ability to understand and control the task, horse response and change during the session",
    excluded:
      "diagnosis, forced exposure, promised cures, disclosure without a lawful safety reason, pressure to remount or replacing professional treatment",
    stopAndEscalate:
      "Pause for distress, inability to consent or follow safety instructions, panic, unsafe control, horse welfare concern, self-harm risk or a request to stop; use urgent support when necessary.",
    practice:
      "Respond to a fictional participant disclosure with acknowledgement, choice, a safe pause, privacy boundaries and referral, without diagnosing or pressuring continuation.",
  }),
  "safeguarding-and-duty-of-care": reviewedBoundaryLesson({
    title: "safeguarding and duty of care",
    evidence:
      "Reviewed British Equestrian safeguarding guidance supports creating safe environments, recognising concerns, listening, recording accurately and reporting through current organisational and statutory routes. Learners do not investigate.",
    learnerRole:
      "receive information calmly, protect immediate safety, record the person's words and report promptly through the named route",
    decisionOwner:
      "the organisation's safeguarding lead and current emergency or statutory authorities",
    observations:
      "the exact words used, date, time, context, people present, direct observations, immediate safety issue, actions taken and person to whom the report was handed",
    excluded:
      "investigation, leading questions, confrontation, secret promises, mediation, evidence collection outside policy or deciding whether abuse occurred",
    stopAndEscalate:
      "Use emergency services for immediate danger and the current safeguarding route promptly for every concern; do not delay to obtain proof or agreement from others.",
    practice:
      "Turn a fictional disclosure into a contemporaneous record that preserves exact words, separates observation and report, avoids questions and names the next safeguarding contact.",
  }),
  "inclusive-coaching-adaptive-riding": reviewedBoundaryLesson({
    title: "inclusive coaching and adaptive riding",
    evidence:
      "Reviewed coach standards require participant-centred practice and adaptations for individual needs, age and experience. Inclusion requires consent, dignity, accessible communication and competent assessment rather than assumptions based on diagnosis or appearance.",
    learnerRole:
      "ask respectful functional questions, record agreed support and observe how the current adaptation works",
    decisionOwner:
      "the participant with the qualified coach, facility and relevant healthcare or specialist support",
    observations:
      "participant-stated goals and preferences, consent, communication method, access, transfer and emergency needs, horse suitability decision, equipment authorisation, response and requested change",
    excluded:
      "medical assumptions, public disclosure, unqualified equipment modification, forced assistance, lowered welfare standards or promising that every activity is suitable",
    stopAndEscalate:
      "Pause when consent, competent support, accessible emergency arrangements, suitable horse, authorised equipment or safe participation cannot be confirmed, and seek the relevant specialist route.",
    practice:
      "Revise a fictional lesson plan after a participant requests an adaptation, documenting choice, privacy, competence, horse welfare, trial observation and review owner.",
  }),

  "grid-work-and-related-distances": {
    objectives: [
      "Explain why gridwork and related-distance setup are qualified-coach responsibilities",
      "Observe risk, horse-rider suitability, equipment, surface, welfare and adjustment decisions",
      "Avoid universal distances, construction instructions and learner-led progression",
    ],
    content: `## A professional setup, not a distance table

Gridwork and related distances involve poles or fences arranged to create a particular exercise. Small errors in measurement, construction, surface, pace, horse suitability or rider control can increase risk. The British Horse Society Stage 2 Coach syllabus treats related distances and gridwork as qualified-coach content and requires risk assessment, horse-and-rider suitability, welfare, safe equipment, measurement, adjustment, progression, supervision and response to incidents. Stage 4 material likewise places course and exercise design within advanced professional competence.

This lesson therefore teaches how to recognise qualified decisions. It gives no metres, feet, strides, fence heights, component recipe, construction sequence or instruction to ride a grid. Practical setup and riding require an appropriately qualified coach with the actual horse, rider, arena, equipment and current plan.

## Define the purpose

The coach states an observable purpose that is suitable for the horse and rider. Terms such as rhythm, straightness, confidence, technique or strength do not by themselves justify a grid. The coach considers current training, health, fitness, jumping experience, rider competence, tack, protective equipment and environment.

Do not use gridwork to diagnose movement, fix a behaviour, rehabilitate an injury or test suspected pain. Veterinary, rehabilitation, tack or behaviour concerns use their qualified route before any exercise decision.

## Inspect equipment and area

The coach or assigned competent person checks the arena, footing, boundaries, access, poles, wings, cups, blocks, fillers and any other equipment. Items must be suitable, stable and positioned under the current professional method. The exact materials and safety features depend on the exercise and rules.

A learner must not build, move, raise or adjust an element without the coach's direct instruction. Do not pace a distance, use a body measure, count generic horse strides or copy an online diagram. The professional uses suitable measurement and then observes the individual horse before making any adjustment.

## Related distance is contextual

A related distance links elements in an intentional exercise, but the appropriate setup depends on element type, pace, horse stride and balance, rider, surface and purpose. A “bounce,” one-stride or other label is not a universal measurement. The coach verifies terminology and configuration for the actual session and current discipline context.

Do not treat a stride count observed in one round as permission to recreate the distance. Horse size alone does not determine it, and a fixed table cannot replace on-site qualified assessment.

## Briefing and roles

Before the horse enters, the coach explains the route, pace, stop signal, rider task, observer and pole-helper roles, where people may stand and what triggers adjustment or stopping. Helpers must wait until the coach confirms the horse is clear and the area is safe. Nobody enters the line or lifts an element while the horse is approaching.

The rider must have suitable protective equipment and a horse appropriate to the task. The coach decides whether the exercise begins as a single pole, separate fence or another simpler activity. This lesson does not prescribe that progression.

## Observe welfare and performance

Record factual observations: route, pace selected by the coach, whether rhythm changed, where a pole moved, horse or rider loss of balance and the coach's decision. Do not diagnose soreness, weakness, confidence or cause. Repeated rushing, stopping, clipping, loss of control, rider insecurity or horse discomfort is not solved by a generic distance adjustment.

The coach may simplify, stop, inspect equipment, seek veterinary or other professional review or redesign later. Welfare and safety override completing the grid.

## Incident boundary

For a fall, loose horse, damaged equipment or injury concern, stop the area and follow the current incident and emergency plan. Do not chase, reconstruct or resume until the responsible qualified people authorise it.

## Learning outcome

After observing an authorised professional session, a learner should be able to name the decision categories and explain why the actual numbers are withheld. Completion does not confer setup or coaching competence.`,
    keyPoints: [
      "Gridwork and related-distance design, measurement, adjustment and progression are qualified-coach responsibilities",
      "Setup depends on exercise, horse, rider, pace, surface, equipment and purpose",
      "This lesson gives no distance, stride, height, component or construction recipe",
      "Helpers follow defined roles and never enter or adjust the line while a horse approaches",
      "Loss of control, repeated difficulty, horse discomfort, equipment damage or incident requires simplification, stopping or escalation",
    ],
    safetyNote:
      "Do not build, measure, alter or ride a grid from this lesson. Work only with an appropriately qualified coach, suitable horse/rider, inspected equipment and surface, protective equipment, controlled access and current incident plan. Never enter the line while a horse approaches or use copied distances, stride counts, heights or diagrams.",
    practicalApplication:
      "Observe an instructor-approved professional gridwork video or diagram with all measurements removed. Identify purpose, suitability, equipment/surface checks, roles, welfare observations, adjustment authority and stop points without reconstructing the exercise.",
    commonMistakes: [
      "Copying a distance or stride table into a real arena",
      "Assuming horse height alone determines a related distance",
      "Entering the line or moving a pole while the horse approaches",
      "Using a distance change to diagnose or fix rushing, stopping or clipping",
      "Treating lesson completion as practical setup competence",
    ],
    knowledgeCheck: [
      {
        question: "Who determines and adjusts a grid or related distance?",
        options: [
          "An appropriately qualified coach assessing the actual horse, rider, exercise and conditions",
          "Any learner using a generic table",
          "A helper counting personal paces",
          "The rider based on horse height alone",
        ],
        correctIndex: 0,
        explanation:
          "The reviewed professional standard requires measurement, suitability, observation and safe adjustment in context.",
      },
      {
        question: "When may a pole helper enter the line?",
        options: [
          "Only when the coach confirms the horse is clear and the area is safe",
          "While the horse is approaching",
          "Whenever a pole looks uneven",
          "Without an assigned role",
        ],
        correctIndex: 0,
        explanation:
          "Defined roles and controlled access protect people and horses during setup and adjustment.",
      },
      {
        question:
          "What should happen after repeated rushing or horse discomfort?",
        options: [
          "The qualified coach simplifies or stops and uses the appropriate professional review",
          "A learner changes the distance by a fixed amount",
          "The fence is raised automatically",
          "The same line is repeated to force compliance",
        ],
        correctIndex: 0,
        explanation:
          "Difficulty may have many causes and welfare concerns require qualified assessment rather than a generic adjustment.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on gridwork decision roles without asking for distances",
      "Help me identify unsafe helper actions in a grid scenario",
      "Give me a horse/rider response and ask when the coach should simplify, stop or refer",
    ],
  },

  "course-awareness-and-planning": {
    objectives: [
      "Explain course walking and riding decisions as qualified coach, venue and current-rule responsibilities",
      "Observe surface, obstacles, access, welfare and horse-rider suitability without designing a route",
      "Use current briefing, incident and professional escalation boundaries",
    ],
    content: `## Awareness before strategy

Course awareness means understanding that a jumping course combines venue, surface, obstacles, lines, rules, horse-rider suitability, officials, other users and changing conditions. British Horse Society coach-development material treats course design, course walking, pace, lines, terrain, welfare, materials, positioning, arena size, surface and distance as expert-led content. British Showjumping and British Equestrian welfare guidance places horse welfare above competitive interests and expects fit, competent combinations and suitable surfaces and obstacles.

This lesson does not teach a learner to design, walk or ride a course independently. It gives no stride plan, line, turn, pace, warm-up, equipment, obstacle or performance instruction. Use the current event schedule, governing-body rules, venue briefing, officials and qualified coach for the actual course.

## Confirm authority and current information

Identify the organiser, governing rules, class or training purpose, venue plan, briefing, coach, officials and emergency arrangements. Rules, penalties, permitted equipment, access and course changes can vary. Do not rely on an old diagram or generic summary.

The coach and responsible team determine whether horse and rider are suitable and fit for the activity. A learner cannot declare fitness, soundness, competence or eligibility from records or appearance alone. Veterinary, farriery, tack, qualification and rule questions use their relevant current route.

## Venue and surface observations

Observe only from authorised areas. Note the type and visible condition of the surface, weather, slopes, changes of footing, boundaries, entries and exits, warm-up access, spectator or vehicle interaction and emergency routes. Report a hole, slippery area, damaged boundary or obstruction factually to the venue or official; do not repair, test or declare the surface safe.

Conditions can change after a course walk. The venue, officials and coach reassess. A rider's desire to compete does not override a safety or welfare decision.

## Obstacles and course elements

Obstacles differ in construction, material, visibility, width, height, spread, approach and landing. Officials and course designers control the layout under current rules. Do not touch, measure, move or alter an element without authority. Do not infer that an obstacle is safe because it looks familiar.

Record identifiers and visible concerns where permitted. The qualified coach may explain how the current horse and rider should prepare, but this lesson does not reproduce a route, stride count or technique.

## Course walking and planning boundary

An authorised course walk can help a qualified rider and coach understand the official route and conditions. Route, lines, pace, turns, alternatives and decisions require current professional judgement and must account for the individual horse and rider. A generic “horse's perspective” or personal stride measurement is not a safe planning method.

The rider must follow official access, timing and conduct rules. Do not enter a closed course, obstruct others, obtain unauthorised information or use a device where rules prohibit it.

## Welfare-led decision

The horse should not start or continue when health, soundness, fatigue, behaviour, tack, surface, weather or rider control creates concern. The coach, veterinarian, official or responsible person may withdraw or stop. Competition interest, entry fees, qualification or pressure from others does not override welfare.

Record factual horse responses and professional decisions without diagnosing. A refusal, rail, pace change or unusual behaviour can have many causes and is not solved by a generic line or equipment change.

## Incident and change management

For a fall, loose horse, damaged obstacle, injury concern, extreme weather or course change, follow officials and the venue incident plan. Keep access clear and do not resume until authorised. Report changes through the current briefing channel.

## Reflect safely

After an authorised event or observation, compare the current official information with what occurred: conditions, changes, decisions, horse and rider welfare, incidents and follow-up. Do not publish private veterinary data or unsupported criticism of officials or participants. The goal is disciplined awareness and respect for professional boundaries, not a copied course-riding formula.`,
    keyPoints: [
      "Course design, walking, route, pace, lines and distance are expert and qualified-coach decisions",
      "Use current organiser rules, venue briefing, officials and course information",
      "Learners observe and report surface or obstacle concerns but do not test, alter or declare safety",
      "Horse welfare and competent horse-rider suitability take priority over competition interests",
      "Falls, loose horses, course damage, weather and changes use the current official incident process",
    ],
    safetyNote:
      "Do not design, enter, walk, measure, alter or ride a course from this lesson. Follow current organiser rules, venue officials, qualified coach, suitable horse-rider assessment and incident plan. Never touch obstacles or test surfaces without authority. Stop or withdraw for health, soundness, fatigue, tack, weather, surface or control concerns.",
    practicalApplication:
      "Using an instructor-provided fictional venue map with no route strategy, identify officials, current-information sources, authorised observation areas, surface/obstacle facts, horse-rider suitability questions, welfare stop points and incident channels without planning lines, pace or strides.",
    commonMistakes: [
      "Using an old course diagram or rule summary",
      "Measuring distances with personal strides or designing a route without authority",
      "Touching obstacles or declaring a surface safe from appearance",
      "Letting entry cost or competition goals override horse welfare",
      "Diagnosing a refusal or rail and applying a generic correction",
    ],
    knowledgeCheck: [
      {
        question: "Who controls the current course layout and access?",
        options: [
          "The organiser, officials and authorised course team under current rules",
          "Any learner with an old diagram",
          "Spectators who arrive early",
          "A rider measuring personal strides",
        ],
        correctIndex: 0,
        explanation:
          "Course information, changes and access are official matters and must be obtained through current channels.",
      },
      {
        question:
          "What may a learner do after noticing a visible surface hazard?",
        options: [
          "Report the factual location to the venue or official through the current process",
          "Repair or test it independently",
          "Declare the entire surface unsafe online",
          "Move the course around it",
        ],
        correctIndex: 0,
        explanation:
          "The venue and competent officials assess and control the surface; the learner supplies a factual observation.",
      },
      {
        question: "What takes priority over a competition goal?",
        options: [
          "Horse welfare and safe competent participation",
          "Entry fees already paid",
          "A qualification target",
          "Pressure to complete the course",
        ],
        correctIndex: 0,
        explanation:
          "Reviewed welfare guidance places the horse's welfare above competitive or commercial interests.",
      },
    ],
    aiTutorPrompts: [
      "Quiz me on official course information and learner boundaries",
      "Give me a surface concern and ask what may be observed versus changed",
      "Help me identify welfare-led withdrawal points without planning a route",
    ],
  },

  "when-to-call-the-vet": {
    objectives: [
      "Use the individual horse's normal pattern and current emergency plan to recognise concern without self-triage",
      "Make prompt veterinary contact with concise factual information",
      "Avoid diagnosis, treatment, fixed thresholds and delay for extra observations",
    ],
    content: `## The decision is contact, not diagnosis

World Horse Welfare health guidance says carers should learn the individual horse's normal health patterns, seek early veterinary intervention when something is wrong and always call the veterinarian in an emergency. Emergency first-aid guidance emphasises helping the horse while protecting people and knowing when to call. This lesson teaches the contact process and factual preparation. It does not diagnose a condition, determine severity or replace the veterinary practice's triage.

An emergency can present in many ways and an apparently small change can still matter in context. Do not use a generic list or a single number to decide that veterinary help is unnecessary. If the responsible person or current plan identifies an emergency, call promptly. If uncertain, contact the veterinary practice for professional guidance rather than waiting for certainty.

## Know the individual plan

Keep the veterinary practice's routine and emergency contacts, horse identification, location, owner or authorised decision-maker, relevant health history and transport or access information available through the current plan. Confirm who may call and consent when the owner cannot be reached. The plan should also identify the responsible yard person and how emergency access is managed.

Do not copy contact details, medicines or clinical history into unauthorised personal notes. Protect privacy while ensuring authorised responders can access what they need.

## Observe only what is safe and authorised

Useful factual information includes what changed, when it was first observed, the horse's location, recent known events, visible behaviour, movement, appetite or water change, droppings or urination observation, injury or bleeding, breathing appearance and whether immediate danger exists. State what you saw, not what you think caused it.

Do not perform a rectal temperature, pulse, respiration, capillary-refill, gut-sound, flexion, hoof-pulse or other clinical examination unless you are trained, authorised and the veterinarian or current plan directs it. Do not delay the call to collect measurements. Adult-at-rest reference values in other reviewed material are contextual education, not emergency cut-offs.

## Make the call

Give the horse and caller identity, exact location and access, the factual concern and onset, immediate hazards, known recent events and current authorised treatment or medicines if asked. Answer questions honestly, say when information is unknown and write down the veterinarian's instructions. Ask who will attend, what the team should prepare and when to call again if the situation changes.

The veterinary practice decides urgency and interim action. A learner should not downplay, exaggerate or select a diagnosis to influence the response.

## While waiting

Protect people, keep access clear and follow the veterinarian's and yard's current instructions. Do not feed, water, walk, move, transport, bandage, cool, medicate, restrain or treat the horse unless specifically directed by the authorised professional for that case. Generic first-aid actions can be wrong for the individual condition.

Monitor only what the veterinarian requests and can be observed safely. Report deterioration or a new hazard promptly. Do not leave an unsafe person with an unpredictable horse, and do not put yourself in danger to continue an observation.

## Common urgent contexts

Possible severe pain, colic signs, laminitis concern, significant injury or bleeding, eye injury, breathing difficulty, collapse, inability to rise, neurological change, foaling problem, suspected poisoning, acute lameness or rapid deterioration can require urgent veterinary response. These descriptions are non-diagnostic and not exhaustive. The responsible answer is prompt contact, not deciding type, cause, prognosis or home treatment.

## Non-emergency concerns

Changes in appetite, condition, behaviour, movement, skin, eyes, teeth, hooves, droppings, water intake or response to current treatment also need timely responsible-person review and may need a routine or urgent veterinary appointment. The practice determines timing. Do not wait for a fixed number of days or attempt a feed, supplement, tack or exercise change as a test.

## Record and hand over

Record the time, facts reported, veterinary advice, people notified, actions actually taken and subsequent change in the authorised system. Do not alter wording later to match a diagnosis. A clear record supports continuity and event review.

Knowing when to call the veterinarian means recognising the limit of learner judgement, using the current plan early and following professional direction honestly.`,
    keyPoints: [
      "Learn the individual horse's normal patterns and call the veterinarian early for concern or always in an emergency",
      "If uncertain, seek veterinary guidance rather than using a generic threshold to rule out help",
      "Make the call before collecting extra measurements or attempting clinical examination",
      "Interim feed, water, movement, transport, cooling, medication or treatment follows case-specific veterinary direction",
      "Record factual observations, advice and actions without diagnosis or prognosis",
    ],
    safetyNote:
      "In an emergency or when directed by the current plan, call the veterinarian promptly; do not delay for measurements or diagnosis. Protect people and follow case-specific veterinary instructions. Do not feed, water, walk, move, transport, cool, bandage, medicate, restrain, examine or treat the horse unless trained, authorised and specifically directed.",
    practicalApplication:
      "Practise a fictional veterinary call: provide horse identity, exact location/access, onset, factual observations, known recent events and immediate hazards; mark unknowns honestly; write the professional instructions and actions without naming a diagnosis.",
    commonMistakes: [
      "Using one number or checklist to decide veterinary help is unnecessary",
      "Delaying the call to collect more measurements",
      "Giving a diagnosis or minimising facts instead of describing observations",
      "Applying generic walking, feeding, cooling or treatment advice while waiting",
      "Changing feed, tack or exercise to test a non-emergency concern",
    ],
    knowledgeCheck: [
      {
        question:
          "What should a learner do when uncertain whether a concern is urgent?",
        options: [
          "Contact the veterinary practice for professional guidance",
          "Use a single generic threshold to rule out help",
          "Wait for a fixed number of days",
          "Try treatment before calling",
        ],
        correctIndex: 0,
        explanation:
          "The veterinary practice—not the learner—triages the individual facts and gives case-specific advice.",
      },
      {
        question: "What information belongs in the initial veterinary call?",
        options: [
          "Horse and caller identity, exact location, onset, factual observations, known events and immediate hazards",
          "A confident learner diagnosis",
          "A promised prognosis",
          "Only measurements collected after delaying the call",
        ],
        correctIndex: 0,
        explanation:
          "Concise factual information helps the veterinary practice assess urgency and direct the next steps.",
      },
      {
        question: "What may a learner do while waiting?",
        options: [
          "Protect people and follow the current case-specific veterinary and yard instructions",
          "Apply a universal walking or feeding protocol",
          "Administer medication from another horse",
          "Move the horse to test soundness",
        ],
        correctIndex: 0,
        explanation:
          "Interim actions depend on the individual condition and professional direction; generic treatment can cause harm.",
      },
    ],
    aiTutorPrompts: [
      "Help me practise a concise factual veterinary call",
      "Quiz me on why measurements must not delay contact",
      "Give me an uncertain concern and ask what decisions belong to the veterinary practice",
    ],
  },
};

export const FACTUALLY_REVISED_LESSON_SLUGS = new Set(
  Object.keys(FACTUAL_LESSON_REVISIONS),
);

export function applyFactualLessonRevision(
  lesson: LessonUnitData,
): LessonUnitData {
  const revision = FACTUAL_LESSON_REVISIONS[lesson.slug];
  return revision ? { ...lesson, ...revision } : lesson;
}
