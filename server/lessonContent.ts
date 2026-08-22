// ─────────────────────────────────────────────────────────────────────────────
// Lesson Content Data — complete educational content for the EquiProfile
// structured learning engine. All material is original EquiProfile educational content.
// ─────────────────────────────────────────────────────────────────────────────
import { LESSON_QUALITY_ENHANCEMENTS } from "./academy/lessonQualityEnhancements.generated";

export interface LessonPathwayData {
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
  iconName: string;
}

export interface KnowledgeCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonUnitData {
  slug: string;
  pathwaySlug: string;
  title: string;
  level: "beginner" | "developing" | "intermediate" | "advanced";
  category: string;
  sortOrder: number;
  objectives: string[];
  content: string;
  keyPoints: string[];
  safetyNote: string;
  practicalApplication: string;
  commonMistakes: string[];
  knowledgeCheck: KnowledgeCheckQuestion[];
  aiTutorPrompts: string[];
  /** Competency keys from the standard competency framework that this lesson directly supports. */
  linkedCompetencies: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PATHWAYS
// ─────────────────────────────────────────────────────────────────────────────

export const LESSON_PATHWAYS: LessonPathwayData[] = [
  {
    slug: "horse-care-foundations",
    title: "Horse Care Foundations",
    description:
      "Learn the essential skills of horse care including grooming, feeding, watering and daily health checks. Build a strong foundation of practical care knowledge.",
    sortOrder: 1,
    iconName: "Heart",
  },
  {
    slug: "rider-foundations",
    title: "Rider Foundations",
    description:
      "Develop your riding skills from first mounting to confident control at walk and trot. Learn correct position, basic aids, and arena awareness.",
    sortOrder: 2,
    iconName: "User",
  },
  {
    slug: "stable-yard-safety",
    title: "Stable & Yard Safety",
    description:
      "Understand how to stay safe around horses and in the yard. Learn hazard awareness, emergency procedures and safe working practices.",
    sortOrder: 3,
    iconName: "Shield",
  },
  {
    slug: "horse-behaviour-welfare",
    title: "Horse Behaviour & Welfare",
    description:
      "Understand how horses think, communicate and feel. Learn to read body language, recognise signs of distress and promote good welfare.",
    sortOrder: 4,
    iconName: "Eye",
  },
  {
    slug: "tack-equipment",
    title: "Tack & Equipment",
    description:
      "Identify, fit and care for saddles, bridles and other equipment. Learn what each piece does and how to maintain it properly.",
    sortOrder: 5,
    iconName: "Wrench",
  },
  {
    slug: "developing-rider-skills",
    title: "Developing Rider Skills",
    description:
      "Progress beyond the basics with transitions, school figures, canter work and an introduction to lateral movements. Build fitness, balance and rider awareness.",
    sortOrder: 6,
    iconName: "TrendingUp",
  },
  {
    slug: "polework-jump-foundations",
    title: "Polework & Jump Foundations",
    description:
      "Build confidence over ground poles and progress to jumping. Learn distances, grids, the jumping position and course awareness.",
    sortOrder: 7,
    iconName: "Zap",
  },
  {
    slug: "horse-health-first-response",
    title: "Horse Health & First Response",
    description:
      "Recognise signs of good and poor health, understand common ailments, and learn first-aid skills to respond quickly and effectively.",
    sortOrder: 8,
    iconName: "Thermometer",
  },
  {
    slug: "stable-management",
    title: "Stable Management",
    description:
      "Master the daily routines of stable and yard management including mucking out, pasture care, record keeping and facility organisation.",
    sortOrder: 9,
    iconName: "Home",
  },
  {
    slug: "competitions-preparation",
    title: "Competitions & Preparation",
    description:
      "Understand competition types, prepare horse and rider for shows, learn dressage tests and show-jumping courses, and develop a winning mindset.",
    sortOrder: 10,
    iconName: "Award",
  },
  {
    slug: "rider-fitness-mindset",
    title: "Rider Fitness & Mindset",
    description:
      "Improve your riding through targeted fitness, core stability, flexibility work and mental skills including confidence building and performance psychology.",
    sortOrder: 11,
    iconName: "Activity",
  },
  {
    slug: "coaching-teaching-skills",
    title: "Coaching & Teaching Skills",
    description:
      "Develop the knowledge and communication skills needed to coach and teach riders of all ages and abilities safely and effectively.",
    sortOrder: 12,
    iconName: "BookOpen",
  },
  {
    slug: "handling-groundwork",
    title: "Handling & Groundwork",
    description:
      "Master the essential skills of handling horses safely on the ground, including leading, tying up, turning out, and lungeing techniques.",
    sortOrder: 13,
    iconName: "Hand",
  },
  {
    slug: "nutrition-feeding",
    title: "Nutrition & Feeding",
    description:
      "Understand equine nutrition principles, feed types, feeding routines, and how to create balanced diets for different horses and workloads.",
    sortOrder: 14,
    iconName: "Apple",
  },
  {
    slug: "equine-welfare-ethics",
    title: "Equine Welfare & Ethics",
    description:
      "Explore the ethical responsibilities of horse ownership and care, including the Five Freedoms, welfare legislation, and responsible horsemanship.",
    sortOrder: 15,
    iconName: "Heart",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON UNITS
// ─────────────────────────────────────────────────────────────────────────────

const BASE_LESSON_UNITS: LessonUnitData[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 1 — Horse Care Foundations
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Lesson 1 ──────────────────────────────────────────────────────────────
  {
    slug: "parts-of-the-horse",
    pathwaySlug: "horse-care-foundations",
    title: "Parts of the Horse",
    level: "beginner",
    category: "Horse Care Foundations",
    sortOrder: 1,
    objectives: [
      "Identify and name at least 20 external parts of the horse",
      "Understand the difference between points and markings",
      "Describe the basic function of key anatomical areas",
      "Use correct terminology when discussing a horse's conformation",
    ],
    content: `Understanding external anatomy — commonly called the "points of the horse" — helps learners use clear, shared terminology. This lesson introduces the visible terms shown in the University of Kentucky anatomy reference. It does not teach diagnosis, conformation assessment, passport completion, or veterinary decision-making.

## The Head

Starting at the front of the horse, the **poll** is the highest point of the skull, located between the ears. Just below the poll is the **forelock**, the tuft of mane that falls between the ears onto the forehead. The bony ridge running down the front of the face is the **nasal bone**, and the area either side of the face is the **cheek**. The soft, flexible part of the nose is the **muzzle**, which includes the **nostrils** and the **lips**. The **chin groove** is the indentation behind the lower lip where a curb chain sits. The **jaw** or **jowl** runs along the lower edge of the head. The **throat** or **throatlatch** area is where the head meets the neck.

## The Neck and Body

The **crest** is the top line of the neck, from the poll to the **withers** — the bony ridge where the neck meets the back and where a horse's height is measured. The **mane** grows along the crest. Below the neck on the underside is the **gullet** or **windpipe** area. The **shoulder** is a large, sloping area of muscle that greatly influences the horse's movement and stride length.

Moving along the body, the **back** runs from the withers to the **loins**, which sit behind the saddle area. The **croup** is the highest point of the hindquarters, sloping down to the **dock**, where the tail begins. The **barrel** is the rounded section of the body enclosing the ribcage. Below the barrel on the underside is the **belly** and further back the **flank**, the soft area in front of the hind legs. The **chest** is the front of the body between the forelegs. The **girth** area is where the girth or cinch fastens around the barrel behind the elbow.

## The Forelegs

The **elbow** is the joint at the top of the foreleg, close to the body. Below it is the **forearm**, a muscular section leading to the **knee** (technically the carpus). Below the knee is the **cannon bone**. The **tendons** run at the back of this area. The **fetlock** joint sits below the cannon bone, followed by the **pastern** and the **coronet band** at the top of the hoof. British Horse Society guidance describes the coronary band as the strip where skin meets the hoof wall and where new hoof growth begins. The hoof contains several external structures, including wall, sole and frog. On the back of the fetlock is a small tuft of hair called the **ergot**.

## The Hind Legs

The hindquarters include the **hip**, **point of hip**, **point of buttock**, **stifle**, **gaskin**, and **hock**. The stifle sits high on the hind leg. Below the hock, the visible lower-limb terms include cannon bone, fetlock, pastern, coronet band and hoof. The **chestnut** is a small, flat, horny growth found on the inside of each leg — on the forelegs above the knee and on the hind legs below the hock.

## Markings and Colours

It is important to distinguish between anatomical points and **markings**. Markings are coat-pattern terms that can be distinguished from anatomical points. This lesson uses the descriptive examples star, stripe, snip, blaze, sock and stocking. Requirements for identification records and passports vary by jurisdiction and must be checked with the relevant current authority.

Knowing these terms helps learners follow teaching and discuss locations clearly. If a horse appears uncomfortable or a learner notices a concerning change, they should stop and report it to the responsible yard person, veterinarian, or farrier rather than attempting a diagnosis.`,
    keyPoints: [
      "The poll is the highest point of the skull; the withers is where height is measured",
      "The cannon bone, tendons, fetlock and pastern are lower-leg terms learners should be able to identify",
      "Markings (star, stripe, blaze, sock, stocking) are used for identification, not anatomy",
      "The hock is a named joint on the hind leg; use qualified guidance for concerns about movement or comfort",
      "The coronary band is where skin meets the hoof wall and contributes to new hoof growth",
    ],
    safetyNote:
      "When examining or pointing out parts of the horse, always approach calmly and avoid sudden movements. Stand to the side of the horse — never directly behind — and let the horse know you are there by speaking quietly. Be especially careful when handling the lower legs, as some horses are sensitive and may kick or stamp.",
    practicalApplication:
      "Before every ride or lesson, you should run your hands down each leg to check for heat, swelling or sensitivity in the tendons, fetlock and pastern. Being able to name the exact location of any abnormality helps your instructor or vet act quickly. When filling in a horse's passport or accident report, correct anatomical terms and marking descriptions are essential for accurate identification.",
    commonMistakes: [
      "Confusing the knee (foreleg) with the hock (hind leg) — they are not equivalent joints",
      "Calling the fetlock the 'ankle' — the fetlock is unique to equine anatomy",
      "Mixing up markings (star, stripe, blaze) with anatomical points",
      "Forgetting that height is measured at the withers, not the top of the head",
      "Assuming both front and hind legs have identical structure — the stifle has no foreleg equivalent visible externally",
    ],
    knowledgeCheck: [
      {
        question: "Where on the horse is height officially measured?",
        options: ["The poll", "The croup", "The withers", "The shoulder"],
        correctIndex: 2,
        explanation:
          "A horse's height is measured from the ground to the highest point of the withers, the bony ridge where the neck meets the back.",
      },
      {
        question:
          "Which part of the horse is the equivalent of the human knee?",
        options: ["The hock", "The stifle", "The fetlock", "The pastern"],
        correctIndex: 1,
        explanation:
          "The stifle joint on the hind leg is the anatomical equivalent of the human knee. The horse's 'knee' on the foreleg is actually equivalent to the human wrist.",
      },
      {
        question: "What is the coronet band?",
        options: [
          "A type of bridle fitting",
          "The ring of tissue at the top of the hoof",
          "The area behind the saddle",
          "A marking on the horse's face",
        ],
        correctIndex: 1,
        explanation:
          "The coronet band is the ring of soft tissue at the top of the hoof wall from which the hoof grows. Injury to the coronet band can cause permanent hoof defects.",
      },
      {
        question: "Where would you find the 'dock' on a horse?",
        options: [
          "Under the chin",
          "At the point where the tail begins",
          "On the front of the chest",
          "Behind the knee",
        ],
        correctIndex: 1,
        explanation:
          "The dock is the muscular root of the tail, where the tail hair grows from the end of the spine.",
      },
      {
        question:
          "What term describes the soft, flexible end of a horse's nose including the nostrils and lips?",
        options: ["The jowl", "The crest", "The muzzle", "The gullet"],
        correctIndex: 2,
        explanation:
          "The muzzle is the soft, mobile area at the end of the horse's face, encompassing the nostrils, lips and chin area.",
      },
    ],
    aiTutorPrompts: [
      "Can you quiz me on the parts of the horse by describing a location and asking me to name it?",
      "What is the difference between a horse's knee and a human's knee anatomically?",
      "Help me practise describing a horse's markings using correct terminology.",
    ],
    linkedCompetencies: ["horse_behaviour_awareness"],
  },

  // ── Lesson 2 ──────────────────────────────────────────────────────────────
  {
    slug: "grooming-basics",
    pathwaySlug: "horse-care-foundations",
    title: "Grooming Basics",
    level: "beginner",
    category: "Horse Care Foundations",
    sortOrder: 2,
    objectives: [
      "Explain why grooming is important for horse health and welfare",
      "Identify the main items in a grooming kit and their uses",
      "Demonstrate the correct order of a grooming routine",
      "Recognise signs of skin problems or injury during grooming",
    ],
    content: `Grooming is a routine part of horse care, not only a way to make a horse look tidy. Cooperative Extension guidance describes grooming as supporting skin care and horse–handler bonding. Work calmly, use suitable tools gently, and use the routine to notice changes that should be reported through the yard's current care process.

## Why We Groom

There are four main reasons for grooming:

1. **Safe observation** — Working over the horse can help a handler notice visible changes, lodged debris, or signs of discomfort. Do not diagnose or treat; pause and tell the responsible yard person, veterinarian, or farrier when something is concerning.
2. **Comfort and cleanliness** — Suitable grooming tools remove loose dirt, old hair, and debris. Take particular care around sensitive or bony areas.
3. **Coat care** — A body brush removes fine dust and can bring out natural oils in the hair coat.
4. **Calm handling** — Grooming should be slow, predictable, and appropriate to the horse and the handler's experience. Ask an experienced person for help with an anxious, unfamiliar, or unsafe horse.

## The Grooming Kit

A standard grooming kit should contain the following items:

- **Hoof pick** — Used to clean out the hooves. Always pick feet out from heel to toe to avoid pushing debris into the sensitive frog area. Many hoof picks have a small brush attachment for sweeping away remaining dirt.
- **Rubber curry comb** — An oval rubber tool with short rubber teeth, used in circular motions on the body to loosen dried mud, dead hair and scurf. Do not use on bony areas such as the legs, spine or face.
- **Dandy brush** — A stiff-bristled brush used to flick away the mud and debris loosened by the curry comb. Use short, flicking strokes. Avoid using on clipped horses or sensitive areas.
- **Body brush** — A soft, short-bristled brush used after the dandy brush to remove finer dust and distribute oils. Can be used on the face and legs with care. Use long, sweeping strokes in the direction of the coat.
- **Metal curry comb** — Used to clean the body brush, not the horse. After every few strokes with the body brush, draw the bristles across the metal curry comb to remove accumulated dust.
- **Mane comb** — A wide-toothed plastic or metal comb for detangling and laying the mane flat. Always work from the ends upward to avoid pulling and discomfort.
- **Sponges** — At least two sponges: one for cleaning the eyes and nostrils, another for the dock area. Keep them labelled or colour-coded and never mix them up, for hygiene reasons.
- **Stable rubber** — A cloth (often a tea-towel type fabric) used at the end of grooming to give the coat a final polish and remove any last traces of dust.
- **Tail brush or detangling spray** — Use a human-style wide-toothed brush or fingers to gently separate the tail hairs. A detangling spray helps reduce breakage.

## The Grooming Routine — Correct Order

A systematic approach ensures nothing is missed:

1. **Tie up safely** — With a solid fixture and active supervision, use a quick-release knot; alternatively, have an experienced handler hold the horse. Do not leave a tied horse unattended.
2. **Pick out feet** — Follow the safe method you have been taught, using the hoof pick downward toward the toe. Remove visible dirt, rocks and debris; if something is concerning, stop and consult the responsible yard person, veterinarian, or farrier.
3. **Curry comb** — Use the rubber curry comb in circular motions over the muscular areas of the body: neck, shoulder, barrel and hindquarters. Avoid bony prominences.
4. **Dandy brush** — Flick away loosened dirt with short strokes, working from the neck backwards. Skip sensitive or clipped areas.
5. **Body brush** — Use long, smooth strokes over the whole body, cleaning the brush on the metal curry comb regularly.
6. **Face and ears** — Use the body brush very gently on the face. Some horses are head-shy, so be patient and use slow movements.
7. **Mane and tail** — Comb or brush out the mane and tail, working through tangles carefully from the bottom up.
8. **Sponge eyes, nostrils and dock** — Use the appropriate sponge dampened with clean water. Wipe gently around the eyes, then nostrils, using the separate sponge for the dock.
9. **Stable rubber** — Give the coat a final wipe-down to polish.
10. **Final check** — Stand back and look over the horse for anything you may have missed.

## Adjusting the Routine

The appropriate grooming routine depends on the individual horse, weather, turnout, coat condition, work, current care plan, and the handler's competence. Do not copy another horse's routine or use grooming as a substitute for veterinary, farriery, or qualified yard guidance. When a horse is anxious, unfamiliar, or difficult to handle safely, stop and ask an experienced person for help.`,
    keyPoints: [
      "Grooming supports safe observation; report concerning changes rather than diagnosing or treating them",
      "Use the rubber curry comb in circles on muscular areas only; never on bony legs, spine or face",
      "Always pick out hooves from heel to toe to protect the frog",
      "Use clean, separate equipment as required by the current yard hygiene process",
      "Use the current individual care plan and ask for experienced help when a horse is anxious or unsafe to handle",
      "Clean the body brush regularly on the metal curry comb during use",
    ],
    safetyNote:
      "With a solid fixture and active supervision, use a quick-release knot or an experienced handler. Work calmly, stay aware of the horse's position, and do not stand directly behind it. When picking up feet, use the safe close-working position you have been taught. If the horse is fidgety, anxious, unfamiliar, or unsafe, stop and ask an experienced person for help rather than continuing alone.",
    practicalApplication:
      "Under appropriate supervision, use the routine your yard or care plan requires. Remove visible debris with suitable tools, use the safe hoof-cleaning method you have been taught, and report concerning changes rather than attempting to diagnose or treat them. Keep the routine calm and predictable, but do not continue when the horse or situation is unsafe.",
    commonMistakes: [
      "Using the dandy brush on a clipped or thin-skinned horse, causing discomfort",
      "Picking out feet from toe to heel, which can push stones into the frog",
      "Using the same sponge for the face and dock, spreading bacteria",
      "Forgetting to check the legs and hooves because you focused only on the body",
      "Continuing alone when a horse is anxious, unfamiliar, or unsafe to handle",
    ],
    knowledgeCheck: [
      {
        question:
          "Which grooming tool should be used in circular motions on muscular areas to loosen mud?",
        options: [
          "The dandy brush",
          "The body brush",
          "The rubber curry comb",
          "The metal curry comb",
        ],
        correctIndex: 2,
        explanation:
          "The rubber curry comb is used in circular motions on muscular areas like the neck, shoulder and barrel to loosen dried mud, dead hair and scurf.",
      },
      {
        question: "In which direction should you pick out a hoof?",
        options: [
          "Toe to heel",
          "Heel to toe",
          "Side to side",
          "It does not matter",
        ],
        correctIndex: 1,
        explanation:
          "Always pick out from heel to toe to avoid pushing stones or debris into the sensitive frog and sulci of the hoof.",
      },

      {
        question: "What is the metal curry comb used for?",
        options: [
          "Removing mud from the horse's legs",
          "Cleaning the body brush during grooming",
          "Combing the mane",
          "Scraping sweat off after exercise",
        ],
        correctIndex: 1,
        explanation:
          "The metal curry comb is used to clean the body brush by drawing the bristles across its teeth to remove accumulated dust and hair. It should never be used directly on the horse.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through the grooming routine in order and explain what each step achieves?",
      "What skin conditions should I look out for during grooming?",
      "How does grooming differ for a stabled horse versus a grass-kept horse?",
    ],
    linkedCompetencies: ["grooming_safely"],
  },

  // ── Lesson 3 ──────────────────────────────────────────────────────────────
  {
    slug: "feeding-basics",
    pathwaySlug: "horse-care-foundations",
    title: "Feeding Basics",
    level: "beginner",
    category: "Horse Care Foundations",
    sortOrder: 3,
    objectives: [
      "Explain why fibre is the foundation of a horse's diet",
      "Identify the difference between forage and concentrate feeds",
      "List the golden rules of feeding",
      "Understand how a horse's digestive system influences feeding management",
    ],
    content: `Correct feeding supports a horse’s health, energy, behaviour and body condition. World Horse Welfare describes horses as predominantly grazing animals designed to eat small amounts frequently, with forage-based diets for approximately 16–18 hours a day. Feeding decisions must still be individual: age, body condition, dental health, medical history, pasture, climate and workload all matter.

## The Digestive System in Brief

The horse’s digestive system is adapted to frequent forage intake rather than large, infrequent meals. Feed passes through the stomach and small intestine before reaching the **hindgut** (caecum and large colon), where microorganisms ferment fibre. Sudden dietary change can disrupt this system. Learners should not calculate or alter a ration alone; follow the written feed plan and ask the yard manager, vet or qualified nutrition adviser before changing it.

## Fibre First

The core principle in equine nutrition is **fibre first**. Forage — grass, hay, haylage and suitable fibre feeds — forms the basis of the diet, supports chewing and provides fibre for hindgut function. The British Horse Society states that a daily ration should be no less than 1.5% of bodyweight and notes that the appropriate amount and calorie density depend on the individual horse. Use an accurate weight estimate, monitor body condition and follow the plan set with a vet or nutrition professional rather than copying another horse’s quantity.

Forage provides:
- A constant supply of fibre for the hindgut microbes
- Chew time, which produces saliva that buffers stomach acid and reduces the risk of gastric ulcers
- Mental occupation, reducing boredom and stress behaviours like weaving or crib-biting
- Slow-release energy that maintains a steady blood sugar level

## Types of Feed

**Forage (roughage):**
- **Hay** — Dried grass, typically meadow hay or seed hay. Should smell sweet and be free of dust and mould.
- **Haylage** — Semi-wilted, vacuum-packed grass. Higher in moisture and usually more palatable. Bags must be sealed; if a bag is punctured, the contents can spoil quickly.
- **Grass** — The most natural forage. Quality varies by season and pasture management.
- **Chaff** — Chopped hay or straw, often mixed into hard feed to slow eating and add fibre.

**Concentrates (hard feed):**
- **Cubes/nuts** — Compressed, balanced feeds available for different workloads (e.g., maintenance, competition, conditioning).
- **Mixes (coarse mixes)** — Blended grains, pellets and sometimes molasses. Often more palatable but can be higher in sugar.
- **Straights** — Individual ingredients such as oats, barley or sugar beet. These require more knowledge to balance correctly and are not recommended for beginners.

**Supplements:**
- **Salt lick or loose salt** — Horses need sodium and chloride daily. A salt lick in the stable or field is the simplest way to provide this.
- **Vitamin and mineral supplements** — Only needed if the horse's diet is deficient. Over-supplementation can be harmful.
- **Balancers** — Low-calorie feeds designed to provide vitamins, minerals and protein without excess energy. Ideal for good doers on a forage-only diet.

## The Golden Rules of Feeding

These rules have been taught in equestrian education for generations and are based on the horse's digestive physiology:

1. **Feed little and often** — This reflects the horse’s natural feeding pattern.
2. **Make suitable forage the foundation** — Provide forage and foraging opportunities in the way set out in the individual horse’s plan.
3. **Make changes gradually** — The British Horse Society advises introducing feed changes gradually, ideally over 10–14 days; ask a professional to set a different plan if the horse’s health requires it.
4. **Feed according to body condition and workload** — Review weight and condition regularly. More energy-dense feed is not automatically the right response to low energy or workload change.
5. **Keep a consistent routine** — Record any changes and make sure every carer follows the written plan.
6. **Plan exercise and meals safely** — Follow the yard, veterinary or nutrition guidance about timing exercise around meals; do not improvise a fast-work routine after a large meal.
7. **Provide a constant supply of clean, fresh water** — Check access, cleanliness and intake, especially when grazing is restricted or forage is conserved.
8. **Use hygienic feed and utensils** — Do not feed mouldy or contaminated forage; clean containers and prevent cross-contamination.
9. **Use the written feed plan and accurate measuring method it specifies** — Never guess quantities or substitute products.
10. **Treat each horse as an individual** — Age, breed, temperament, workload, health status, weight and body condition all influence nutritional requirements.

## Body Condition Scoring

Regularly assess body condition using the recognised system and method agreed by the yard, vet or nutrition professional. Observe the ribs, crest, shoulder, back and hindquarters consistently, record the trend, and ask for professional advice before changing a ration in response to a score.`,
    keyPoints: [
      "Forage forms the foundation of the diet; use the individual written plan and monitor condition rather than copying another horse’s ration",
      "Horses are adapted to frequent, forage-based feeding and benefit from suitable foraging opportunities",
      "The British Horse Society advises gradual feed changes, ideally over 10–14 days, unless a professional sets a different health plan",
      "Review workload, weight and condition with a qualified adviser before changing energy-dense feed",
      "Follow the written plan’s quantity and measuring instructions; do not guess or substitute feed",
      "Clean, hygienic forage, water and utensils are part of safe feeding management",
    ],
    safetyNote:
      "Never enter a stable or field with a bucket of feed if multiple horses are loose together — this can trigger aggression and kicking. Always feed horses in separate areas or tie them up to prevent resource guarding. Store feed securely in vermin-proof bins, as a horse that breaks into a feed room and gorges on concentrates is at high risk of colic and laminitis, both of which can be fatal.",
    practicalApplication:
      "When you arrive at the yard each morning, check that each horse has access to forage and water. Learn to body-condition-score the horses in your care and report any changes to the yard manager. If you are asked to prepare feeds, always follow the written feed chart exactly — do not guess quantities. Weigh feeds on a scale rather than relying on scoops, and double-check that the correct horse receives the correct feed.",
    commonMistakes: [
      "Feeding too much concentrate and not enough forage, leading to digestive problems",
      "Making sudden changes to the diet without a gradual transition period",
      "Measuring feed by scoops rather than weighing it accurately",
      "Exercising a horse immediately after a large concentrate feed",
      "Leaving hay nets at ground level where horses can get a foot caught",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the safest response when you think a horse’s forage ration needs changing?",
        options: [
          "Copy the quantity fed to the nearest horse",
          "Remove forage immediately so the horse eats less",
          "Record the concern and ask the yard manager, vet or qualified nutrition adviser to review the individual plan",
          "Add concentrate feed without changing the written chart",
        ],
        correctIndex: 2,
        explanation:
          "Rations depend on the individual horse’s weight, condition, health, workload and forage. World Horse Welfare and the British Horse Society both emphasise individual needs and condition monitoring rather than using another horse’s quantity as a prescription.",
      },
      {
        question: "Why must dietary changes be introduced gradually?",
        options: [
          "Horses are fussy eaters and may refuse new feed",
          "The hindgut microbes need time to adapt to new feedstuffs",
          "It prevents the horse from gaining weight too quickly",
          "New feed needs time to acclimatise to the stable temperature",
        ],
        correctIndex: 1,
        explanation:
          "Diet changes should be gradual because the hindgut microbial population needs time to adapt. The British Horse Society advises changes ideally over 10–14 days; use professional advice where a horse’s health needs a different plan.",
      },
      {
        question: "Which of the following is a 'straight' feed?",
        options: ["A competition cube", "A coarse mix", "Oats", "A balancer"],
        correctIndex: 2,
        explanation:
          "Straights are single, unprocessed ingredients such as oats, barley or sugar beet pulp. They are not pre-balanced and require nutritional knowledge to feed correctly.",
      },
      {
        question:
          "Why is it important to feed by weight rather than by volume?",
        options: [
          "Horses prefer weighed feeds",
          "Different feeds have different densities, so a scoop of oats weighs less than a scoop of cubes",
          "It is a legal requirement",
          "Volume measurements are not available for horse feed",
        ],
        correctIndex: 1,
        explanation:
          "A scoop of oats weighs significantly less than the same scoop filled with cubes or mix. Feeding by volume can lead to under- or over-feeding, which affects health and performance.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain the golden rules of feeding and why each one matters?",
      "What would happen if I suddenly changed my horse's feed without a transition period?",
      "What information should a vet or qualified nutrition adviser review before changing a horse’s diet?",
    ],
    linkedCompetencies: ["feeding_awareness"],
  },

  // ── Lesson 4 ──────────────────────────────────────────────────────────────
  {
    slug: "water-requirements",
    pathwaySlug: "horse-care-foundations",
    title: "Water Requirements",
    level: "beginner",
    category: "Horse Care Foundations",
    sortOrder: 4,
    objectives: [
      "Explain why water intake and access must be monitored for the individual horse",
      "Explain why clean water access is critical for digestive health",
      "Recognise potentially concerning changes in drinking or wellbeing and escalate them safely",
      "Describe best practice for providing water in the stable and field",
    ],
    content: `Water is essential to digestion, temperature regulation, transport of nutrients and waste removal. World Horse Welfare and the British Horse Society both state that horses need a constant supply of clean, fresh water. The amount an individual horse drinks varies with body size, forage and grass intake, weather, work, lactation, health and travel. The learner’s role is to make sure water is accessible and clean, notice a meaningful change from that horse’s normal intake or behaviour, and report it promptly.

## Monitoring water access and intake

Do not use a generic litre figure to decide whether a horse is adequately hydrated. Instead, check the specific horse’s normal pattern and the written care plan. Water demand may change with:

- **Exercise, sweating and hot weather** — monitor access and recovery closely under the yard’s exercise and veterinary plan.
- **Forage and grazing** — grass and conserved forage provide different amounts of moisture; World Horse Welfare specifically notes closer water-intake monitoring where grazing is restricted or conserved forage is fed.
- **Lactation, illness, travel and medication** — these situations need an individual plan from the responsible professional.
- **Environment and group access** — a trough or bucket must be accessible, clean and large enough for every horse in the group to drink safely.

## Why Water Matters for Digestion

The horse's large intestine acts as a reservoir of water. If the horse becomes dehydrated, water is reabsorbed from the gut contents, causing them to become dry and compacted. This is a major cause of **impaction colic**, a painful and potentially life-threatening condition. Consistent access to clean water is one of the simplest ways to reduce the risk of colic.

Water also supports saliva production and normal digestive function. A carer should not diagnose the cause of a change in drinking, gut function or appetite; record the observation and follow the yard’s veterinary-escalation procedure.

## Providing Water in the Stable

In the stable, water can be provided via:

- **Buckets** — Use sturdy containers positioned and secured so they are safe for the horse and accessible for cleaning. Buckets can help carers observe changes in intake. Clean and refresh them as the written yard routine requires.
- **Automatic drinkers** — These require regular checking to confirm they are clean, working and not blocked. Because individual intake can be harder to observe, record concerns and use the yard’s monitoring method. Some horses may need time and supervision when introduced to an unfamiliar system.

Whichever method is used, water should be **clean, fresh and available at all times**. Horses are naturally cautious drinkers and may refuse water that smells or tastes different from what they are used to.

## Providing Water in the Field

In the field, water sources include:

- **Troughs** — Check that the source is functioning, the water remains clean and every horse can access it safely. In freezing conditions, use the yard’s safe winter-water procedure so ice does not prevent access. Clean troughs regularly and maintain the system.
- **Natural water sources** — The British Horse Society cautions that streams, rivers and ponds can present contamination, drying, sand-ingestion and unsafe-access risks. Assess these risks with a competent person and provide a safe alternative where necessary.

## When to escalate a concern

A change in drinking, appetite, demeanour, urine, gums, comfort or gut signs can be clinically important, but no single lay observation confirms dehydration or identifies its cause. Do not force water, diagnose dehydration from one test, or use an unapproved supplement. Record what you observed, make clean water available, contact the instructor or yard manager, and seek veterinary advice promptly if the horse is unwell, does not drink, shows colic signs or the responsible person is concerned.

## Electrolytes and supplements

Sweating and work can change electrolyte needs. Only use an electrolyte or other supplement under the individual horse’s veterinary, nutrition or written yard plan. Plain clean water must remain available; a supplement must not become the only drinking option.`,
    keyPoints: [
      "Provide a constant supply of clean, fresh water and check that every horse can access it safely",
      "Monitor the individual horse’s usual intake, behaviour and written care plan rather than using a generic litre target",
      "Report a meaningful change in drinking or signs of illness; do not self-diagnose dehydration from one observation",
      "Buckets, drinkers and troughs must be clean, functioning and checked according to the yard routine",
      "Use the yard’s safe winter-water procedure so freezing conditions do not prevent access",
    ],
    safetyNote:
      "Follow the yard’s safe winter-water procedure and take care on slippery ground. Do not add unapproved substances to drinking water. If water access is interrupted, a horse’s drinking pattern changes or the horse seems unwell, make clean water available, tell the responsible person and seek veterinary advice according to the yard’s escalation procedure.",
    practicalApplication:
      "Check water sources according to the written yard routine. In stables, confirm buckets or drinkers are clean and functioning. In fields, confirm troughs are clean, working and accessible. After exercise, follow the individual recovery and hydration plan, record any concern about access, intake, appetite, comfort or behaviour, and report it through the yard’s escalation procedure rather than relying on one lay test.",
    commonMistakes: [
      "Assuming a horse will drink when it is thirsty — some horses are reluctant drinkers, especially in new environments",
      "Not cleaning water buckets or troughs regularly, allowing algae and bacteria to build up",
      "Failing to check automatic drinkers, which can malfunction without being noticed",
      "Not breaking ice on field troughs frequently enough in freezing weather",
      "Offering only electrolyte water without providing plain water as an alternative",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the most reliable daily approach to water management?",
        options: [
          "Use one litre target for every horse",
          "Ensure constant clean-water access, observe the individual horse’s normal pattern and report a meaningful change",
          "Offer water only after exercise",
          "Assume a horse will drink enough without checking the supply",
        ],
        correctIndex: 1,
        explanation:
          "Water intake varies with the individual horse, diet, weather, work and health. World Horse Welfare and the British Horse Society emphasise constant clean-water access and individual monitoring rather than one universal daily volume.",
      },
      {
        question:
          "What should you do if a horse’s drinking pattern changes and it also seems unwell?",
        options: [
          "Diagnose dehydration from one home test",
          "Withhold water until the next feed",
          "Record the observations, ensure clean water is available and follow the yard’s veterinary-escalation procedure",
          "Give an electrolyte without checking the plan",
        ],
        correctIndex: 2,
        explanation:
          "A drinking change can have different causes. The safe action is to record it, keep water accessible and obtain appropriate responsible-person or veterinary advice rather than self-diagnosing or improvising treatment.",
      },
      {
        question: "Why is dehydration a risk factor for colic?",
        options: [
          "Dehydrated horses eat too quickly",
          "Water is reabsorbed from the gut, causing dry, compacted contents",
          "Dehydration makes horses more likely to eat sand",
          "It causes the horse's stomach to expand",
        ],
        correctIndex: 1,
        explanation:
          "When a horse is dehydrated, the body reabsorbs water from the large intestine, causing the gut contents to become dry and compacted, leading to impaction colic.",
      },
    ],
    aiTutorPrompts: [
      "What observations should I record if a horse’s drinking pattern changes?",
      "Why can a horse’s water needs vary between days?",
      "How should I manage water provision differently in winter versus summer?",
    ],
    linkedCompetencies: ["feeding_awareness"],
  },

  // ── Lesson 5 ──────────────────────────────────────────────────────────────
  {
    slug: "stable-checks",
    pathwaySlug: "horse-care-foundations",
    title: "Daily Stable Checks",
    level: "beginner",
    category: "Horse Care Foundations",
    sortOrder: 5,
    objectives: [
      "Describe the standard morning and evening stable routine",
      "Identify what to check in the stable environment for safety and hygiene",
      "Recognise signs that a horse is unwell during routine checks",
      "Understand the importance of consistent daily routines for horse welfare",
    ],
    content: `A consistent daily routine is fundamental to good horse management. Horses are creatures of habit and thrive when they know what to expect. Regular stable checks allow you to monitor each horse's health, ensure the environment is safe and clean, and catch problems early before they escalate.

## The Morning Routine

When you arrive at the yard, the first priority is to check on every horse. Before you do anything else, walk through the yard and look at each horse. You are checking that every horse is:

- **Standing normally** — Is the horse alert, with ears forward? Is it bearing weight evenly on all four legs? A horse standing with one foreleg pointed forward may have laminitis. A horse that is lying down and not getting up, or repeatedly getting up and lying down, may be suffering from colic.
- **Comfortable** — Has the horse eaten its hay overnight? Is the water bucket empty or untouched (both can be cause for concern)? Are there fresh droppings of normal consistency?
- **Uninjured** — Look for fresh cuts, swelling, lumps, discharge from the eyes or nose, or signs that the horse has been rubbing or scratching.

Once you have confirmed all horses are well, the morning routine typically follows this order:

1. **Check water** — Refill or scrub and replace water buckets. Check automatic drinkers are working.
2. **Check rugs** — If the horse is wearing a rug, check for slipping, twisting, rubbing, heat or damage. Follow the individual written rugging plan and report a concern rather than making a generic weather-based change.
3. **Hay** — Provide fresh hay or haylage. Remove any leftover, soiled forage from the previous day.
4. **Mucking out** — Remove all droppings and wet bedding from the stable. This keeps the environment hygienic, reduces ammonia levels that damage the horse's respiratory system, and allows you to check the droppings for abnormalities (loose, very hard, mucus-covered or discoloured droppings can all indicate health issues).
5. **Bed down** — Replace clean bedding. The bed should be deep enough to cushion the horse when it lies down, banked up at the walls to prevent the horse getting cast (stuck against the wall when lying down).
6. **Feed** — Prepare and deliver the morning feed according to the feed chart.
7. **Check the horse** — While the horse is eating, run your hands down its legs to feel for heat, swelling or sensitivity. Check the eyes, nostrils and general demeanour.
8. **Turnout or exercise** — Depending on the yard routine, prepare the horse for turnout or for riding.

## The Evening Routine

The evening check mirrors the morning, with some additions:

1. **Bring in from the field** (if applicable) — Check the horse for injuries as you lead it in.
2. **Check water and hay** — Refill water, provide hay for the night.
3. **Skip out** — Remove droppings and any wet patches. A full muck-out may not be needed if done thoroughly in the morning, but the bed must be tidy and comfortable.
4. **Evening feed** — Deliver according to the feed chart.
5. **Rug check** — Follow the individual written rugging plan if a night rug is used, and report a comfort or fit concern.
6. **Final health check** — Look at each horse one last time: are they eating, drinking, moving comfortably? Are there any signs of distress?
7. **Secure the yard** — Check that stable doors are properly bolted (top and bottom bolts), lights are off or on a timer, taps are turned off, and the yard is tidy. Remove any hazards.

## The Stable Environment

The stable itself must be safe and suitable:

- **Ventilation** — Good airflow and dust/ammonia control are essential. Use the yard’s ventilation and stable-door procedure, taking account of the horse, weather, safe supervision and avoidance of draughts at horse height.
- **Light** — Horses benefit from a suitable, safe environment with appropriate light and observation.
- **Size and layout** — The stable must provide safe, suitable space for the individual horse to stand, lie down, turn, eat, drink and be managed without unnecessary injury or distress. Confirm the applicable welfare-code, planning and yard requirements rather than applying one lesson measurement to every horse.
- **Bedding** — Should be deep, clean and absorbent. Common types include straw, shavings, paper and rubber matting with a shavings top layer.
- **Sharp edges or protrusions** — Check for exposed nails, broken fittings, or sharp edges on automatic drinkers or hay racks.
- **Drainage** — The floor should slope slightly towards a drain to prevent urine pooling.

## Droppings: What to Look For

Healthy horse droppings are formed into soft balls that break on hitting the ground. They should be greenish-brown, moist but not loose, and have a mild smell. Abnormal signs include:
- Very loose or watery droppings (may indicate infection, stress or dietary issues)
- Very hard, dry balls (possible dehydration or insufficient forage)
- Mucus-covered droppings (may indicate irritation in the gut)
- Worms visible in droppings (record the observation and seek veterinary/SQP/RAMA advice; do not select medicine from a generic rule)
- Reduced or absent droppings (may be an early sign of colic)`,
    keyPoints: [
      "Always check every horse first thing in the morning before starting other tasks",
      "Mucking out daily reduces ammonia levels and protects the horse's respiratory system",
      "Check droppings for consistency, colour and quantity — they reveal digestive health",
      "Good ventilation, low dust and ammonia control are essential; follow the yard’s safe ventilation procedure for the individual stable",
      "The evening check should include a final visual assessment of every horse before leaving the yard",
      "Banks of bedding around stable walls help prevent the horse from becoming cast",
    ],
    safetyNote:
      "When mucking out, always tie the horse up or remove it from the stable to avoid being knocked by the wheelbarrow or stepped on. Store pitchforks and rakes safely — never leave them propped against walls where they can fall. Check that the stable floor is not slippery after mucking out before putting the horse back in. Always bolt both the top and bottom stable door when securing for the night.",
    practicalApplication:
      "Develop a written checklist for your morning and evening routines so that nothing is missed, even when you are in a hurry. Record water intake, droppings, any health concerns and rug changes in a daily diary. This information is invaluable if a horse later shows signs of illness, as the vet will ask when the problem first appeared. Consistency is key — horses notice disruptions to routine and may become anxious or unsettled.",
    commonMistakes: [
      "Rushing through morning checks without properly assessing each horse's health",
      "Not removing wet bedding thoroughly, allowing ammonia to build up and damage airways",
      "Forgetting to bolt both top and bottom stable doors, risking escape",
      "Closing the top door in cold weather, compromising essential ventilation",
      "Not recording observations, making it difficult to spot patterns of illness",
    ],
    knowledgeCheck: [
      {
        question: "Why should the top stable door always remain open?",
        options: [
          "To allow the horse to look out",
          "To provide essential ventilation and reduce respiratory disease risk",
          "To make it easier for staff to check on the horse",
          "To allow natural light in during the day",
        ],
        correctIndex: 1,
        explanation:
          "Good airflow, low dust and ammonia control support respiratory health. Follow the yard’s safe ventilation procedure rather than relying on one fixed door position in every condition.",
      },
      {
        question:
          "What might it indicate if a horse's water bucket is completely full in the morning?",
        options: [
          "The water was topped up overnight automatically",
          "The horse may not have been drinking, which could signal illness",
          "The horse prefers to drink during the day",
          "Nothing — horses rarely drink overnight",
        ],
        correctIndex: 1,
        explanation:
          "If the water level has not dropped overnight, the horse may not have been drinking. Reduced water intake can be an early sign of illness, dental problems, or that the water is contaminated.",
      },
      {
        question: "What are banks of bedding around the stable walls used for?",
        options: [
          "Decoration and tidiness",
          "Insulation against cold walls",
          "Preventing the horse from becoming cast",
          "Soaking up moisture from the walls",
        ],
        correctIndex: 2,
        explanation:
          "Bedding banked up against the walls makes it harder for the horse to roll and get stuck with its legs against the wall (becoming 'cast'), which can be dangerous.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through a complete morning stable routine step by step?",
      "What signs in the droppings should concern me and why?",
      "How do I assess whether a stable environment is safe and suitable for a horse?",
    ],
    linkedCompetencies: ["stable_checks"],
  },

  // ── Lesson 6 ──────────────────────────────────────────────────────────────
  {
    slug: "turnout-and-rugs",
    pathwaySlug: "horse-care-foundations",
    title: "Turnout & Rugging",
    level: "developing",
    category: "Horse Care Foundations",
    sortOrder: 6,
    objectives: [
      "Explain the benefits of turnout for horse welfare",
      "Identify different rug types and their purposes",
      "Understand when and how to rug a horse appropriately",
      "Describe safe field management practices for turnout",
      "Recognise hazards in the field environment",
    ],
    content: `Turnout — time spent in the field or paddock — is one of the most important aspects of horse welfare. Horses are naturally designed to live outdoors, moving and grazing for most of the day. Access to turnout provides physical exercise, mental stimulation, socialisation, and allows natural behaviours that are essential for the horse's psychological wellbeing.

## Benefits of Turnout

- **Physical health** — Movement promotes circulation, joint mobility, hoof health and gut motility (reducing colic risk).
- **Mental wellbeing** — Horses that spend excessive time in stables may develop stereotypic behaviours such as weaving, crib-biting, box-walking or wind-sucking. These are signs of stress and boredom.
- **Socialisation** — Horses are herd animals and benefit from being turned out with compatible companions. Isolation is stressful.
- **Natural grazing** — Allows the horse to trickle-feed on grass, which is the most natural way to provide fibre and keep the digestive system working properly.

## Field Management

Good field management ensures that turnout is safe and beneficial:

- **Fencing** — Post-and-rail is the safest type of fencing for horses. Barbed wire, sheep netting and low-visibility electric tape on its own are hazardous. Electric fencing can be used as a secondary barrier but should be clearly visible.
- **Poisonous plants** — Check fields regularly for ragwort (the most common equine poison in the UK), yew, oak leaves and acorns (in autumn), deadly nightshade, foxglove, buttercups (in large quantities) and sycamore seeds (which cause atypical myopathy). Remove or fence off any dangerous plants.
- **Ground conditions** — Avoid turnout on waterlogged ground, which can cause mud fever (a bacterial skin infection of the lower legs). In summer, hard, baked ground can jar joints and cause foot bruising.
- **Shelter** — Horses must have access to natural or man-made shelter from wind, rain and sun. Trees, hedges or field shelters serve this purpose.
- **Water** — A constant supply of clean, fresh water is essential. See the Water Requirements lesson for details.
- **Droppings** — Regularly collect droppings from the field (at least twice a week) to reduce parasite burden and keep grazing areas clean.
- **Stocking density** — As a guide, allow a minimum of one acre per horse for year-round turnout, with rest and rotation of paddocks to allow grass recovery.

## Understanding Rugs

Horses have evolved excellent thermoregulation. A healthy, unclipped horse with a full winter coat can comfortably withstand temperatures well below freezing, provided they have shelter from wind and rain. However, clipped horses, elderly horses, sick horses or those with very fine coats may need rugging to maintain body temperature.

### Types of Rugs

- **Turnout rug** — A waterproof, breathable outer layer with an insulation level selected for the individual horse and conditions. It is used in the field only when the horse’s competent carer has decided it is appropriate.
- **Stable rug** — A non-waterproof rug used indoors when the individual horse’s management plan calls for it. It must not be substituted for a turnout rug in wet weather.
- **Cooler/fleece rug** — A moisture-wicking rug used to dry a wet or sweating horse. Place over the horse after exercise to draw moisture away from the coat.
- **Fly rug** — A lightweight mesh rug used in summer to protect from flies and UV rays. Some include a neck cover and belly flap.
- **Exercise sheet** — A rug worn over the hindquarters during ridden exercise in cold weather, especially on clipped horses.

### When to Rug

There is no single answer, as it depends on:
- Whether and how the horse is clipped
- The horse’s age, health, coat, body condition and previous rugging response
- Weather conditions, including wind, rain, temperature and rapid changes
- Access to effective shelter and the horse’s turnout/work plan
- Observed comfort: sweating, shivering, altered behaviour, rubbing or a changed body temperature should be reported rather than managed by guessing

**Over-rugging is a welfare risk** because a horse cannot remove its own rug. Under-rugging can also be harmful for some individuals. Do not use a generic temperature chart or rug-fill weight as a prescription. Follow the individual horse’s written plan and seek advice from the yard manager, vet or other competent professional if the decision is unclear.

### Fitting a Rug

A well-fitting rug should:
- Sit just in front of the withers without pressing on the mane
- Not be too tight across the chest — you should be able to fit a hand's width between the chest straps and the horse
- Have cross surcingles that pass under the belly, loosely fitted to allow movement but not so loose they could catch a leg
- Have leg straps (on turnout rugs) that loop through each other and sit around the inner thigh without rubbing
- Cover the whole body without pulling at the shoulders or riding back

Check rugs at the frequency set in the written care plan and whenever conditions or the horse’s behaviour change. Remove, repair or replace a damaged rug promptly and report rubbing, slipping, heat, sweating or a change in comfort.`,
    keyPoints: [
      "Turnout provides essential physical exercise, mental stimulation and socialisation for horses",
      "Check fields regularly for poisonous plants, especially ragwort, yew and sycamore seeds",
      "Over-rugging is a common welfare issue — horses can generate warmth through movement but cannot cool themselves under an excessive rug",
      "Clipping can change rugging needs, but the decision must account for the individual horse, weather, shelter, health and observed comfort",
      "A turnout rug is intended for field conditions; a stable rug is not a waterproof replacement",
      "Check rug fit and condition under the written care plan and whenever the horse or conditions change",
    ],
    safetyNote:
      "When turning horses out together, introduce new horses gradually under supervision to avoid aggressive encounters. Always lead a horse to and from the field in a headcollar with a lead rope — never by the rug or mane. When removing rugs in the field, be aware that the horse may become excited and try to move away. Release the horse only once you are safely positioned and the field gate is securely fastened.",
    practicalApplication:
      "Follow each horse’s written turnout and rugging plan. Check the horse’s comfort, rug fit and field conditions, then report any change rather than selecting a rug from a generic temperature chart. When collecting droppings from the field, also walk the fence line, check for hazards, broken rails or poisonous plants, record concerns and report them to the manager.",
    commonMistakes: [
      "Over-rugging horses that still have a full winter coat, causing them to sweat and lose condition",
      "Not checking rug fit regularly, leading to rubs on the shoulders, withers and chest",
      "Failing to inspect fields for poisonous plants, particularly ragwort in summer",
      "Turning out incompatible horses together without proper introduction",
      "Using a torn or damaged turnout rug that lets in rain, making the horse colder than if unrugged",
    ],
    knowledgeCheck: [
      {
        question: "Why is over-rugging a welfare concern?",
        options: [
          "It is expensive and wasteful",
          "The horse cannot remove the rug and may overheat, sweat and develop skin problems",
          "It makes the horse's coat grow longer",
          "Over-rugging only affects appearance, not welfare",
        ],
        correctIndex: 1,
        explanation:
          "A horse cannot remove its own rug. Over-rugging can cause overheating, sweating, discomfort and skin irritation. Rugging decisions must follow the individual horse’s plan rather than a generic rule.",
      },
      {
        question:
          "Which plant is the most common cause of equine poisoning in the UK?",
        options: ["Buttercups", "Ragwort", "Clover", "Dandelions"],
        correctIndex: 1,
        explanation:
          "Ragwort is the most common cause of equine poisoning in the UK. It causes cumulative, irreversible liver damage and is particularly dangerous when dried in hay, as horses lose their ability to detect and avoid it.",
      },
      {
        question: "What type of rug is used to dry a horse after exercise?",
        options: [
          "A heavyweight stable rug",
          "A turnout rug",
          "A cooler or fleece rug",
          "A fly rug",
        ],
        correctIndex: 2,
        explanation:
          "A cooler or fleece rug is designed to wick moisture away from the horse's coat, helping it dry efficiently while preventing chill after exercise.",
      },
      {
        question: "What is the safest type of fencing for horse paddocks?",
        options: [
          "Barbed wire",
          "Post-and-rail",
          "Sheep netting",
          "Chain link",
        ],
        correctIndex: 1,
        explanation:
          "Post-and-rail fencing is the safest type for horses. It is clearly visible, strong and unlikely to cause injury. Barbed wire and netting are hazardous as horses can become entangled.",
      },
    ],
    aiTutorPrompts: [
      "What observations should I record before asking a competent person to review a horse’s rugging plan?",
      "What poisonous plants should I look for when checking a horse's field?",
      "Why is a generic rug-fill or temperature chart not enough to make a safe rugging decision?",
    ],
    linkedCompetencies: ["stable_checks", "welfare_awareness"],
  },

  // ── Lesson 7 ──────────────────────────────────────────────────────────────
  {
    slug: "hoof-care-awareness",
    pathwaySlug: "horse-care-foundations",
    title: "Hoof Care Awareness",
    level: "developing",
    category: "Horse Care Foundations",
    sortOrder: 7,
    objectives: [
      "Describe the basic external and internal structure of the hoof",
      "Demonstrate how to safely pick out a horse's feet",
      "Explain the farrier's role and why hoof-care intervals must be set for the individual horse",
      "Identify common hoof problems and when to seek professional help",
    ],
    content: `"No foot, no horse" is one of the oldest and most important sayings in horsemanship. The health of the hoof directly determines the horse's soundness, comfort and ability to work. Every person who handles horses must understand basic hoof anatomy, be able to pick out feet safely and recognise when something is wrong.

## Hoof Structure — External

The hoof is a complex structure made primarily of **keratin** — the same protein that forms human fingernails, but much thicker and stronger.

- **Hoof wall** — The hard, visible outer shell. It grows downward from the **coronet band**. Growth, wear and trimming needs vary between horses, work, footing, season and health. In a shod horse, the wall is where a qualified farrier places nails; learners should not attempt trimming or shoeing.
- **Sole** — The concave underside of the hoof, providing protection to the internal structures. It should be slightly concave (arched inward), not flat. A flat sole provides less shock absorption and increases the risk of bruising.
- **Frog** — The triangular, rubbery structure on the underside of the hoof. It acts as a shock absorber, aids blood circulation through the foot (the "frog pump"), and provides grip on the ground. The frog should be firm but slightly yielding, with a central groove (cleft) that should be clean and dry.
- **Bars** — The inward folds of the hoof wall at the heel, which provide structural support.
- **White line** — The junction between the hoof wall and the sole. This is a vulnerable area where separation can occur, allowing bacteria and gravel to enter (a condition called "white line disease" or "seedy toe").
- **Heel bulbs** — The soft, rounded structures at the back of the hoof.

## Hoof Structure — Internal

Beneath the hoof capsule are vital living structures:

- **Sensitive laminae** — Interlocking leaf-like structures that bond the hoof wall to the pedal bone. Inflammation of the laminae is called **laminitis**, a serious and painful condition.
- **Pedal bone (P3 or coffin bone)** — The bone within the hoof that mirrors the shape of the hoof capsule.
- **Navicular bone** — A small bone at the back of the foot, involved in the flexor mechanism. Navicular disease causes chronic heel pain.
- **Digital cushion** — A fibro-fatty pad above the frog that absorbs concussion.

## Picking Out Feet

Picking out feet is part of daily hoof care and may also be appropriate before or after exercise, provided the horse can be handled safely and the yard’s competent person has shown the learner the procedure. The procedure:

1. Stand beside the horse's shoulder (for a front foot) or hip (for a hind foot), facing the tail.
2. Run your nearest hand down the leg from the shoulder or hip to the fetlock.
3. Lean gently into the horse's shoulder or hip to shift its weight to the other leg.
4. Squeeze or pinch gently above the fetlock, and as the horse lifts its foot, support it with your hand.
5. Use the hoof pick from **heel to toe**, cleaning out the grooves (sulci) on either side of the frog and the central cleft.
6. Check for:
   - **Stones** lodged in the sole or frog
   - **Thrush** — a foul-smelling, black, tarry discharge from the frog, caused by bacteria in wet or dirty conditions
   - **Cracks** in the hoof wall
   - **Loose or shifted shoes** — a shoe that has moved, sprung a clip, or has risen nails ("risen clinches") needs farrier attention
   - **Bruising** on the sole (may appear as reddish-purple discolouration)
   - **Heat** in the hoof wall, which may indicate infection or laminitis
7. Lower the foot gently — do not drop it.

## The Farrier and Shoeing Cycle

World Horse Welfare advises that hooves should be trimmed and/or shod by a **qualified, registered farrier on average every 6–8 weeks**, while noting that some horses need more regular care. The individual interval depends on the horse’s hoof growth, conformation, health, work, footing and whether remedial support is needed. Keep the farrier’s recommended appointment schedule in the horse’s record; do not apply an interval from a lesson as a universal rule.

During a farrier visit, the farrier will:
- Remove the old shoes (if shod)
- Trim excess hoof growth
- Rebalance the foot
- Fit new or reset shoes, ensuring correct fit

Shoeing and trimming decisions are individual professional decisions. A farrier may discuss protection, traction, wear, conformation or a veterinary-led therapeutic plan, but the learner’s role is to maintain daily observation, report changes and follow the plan set by the horse’s farrier and veterinary team.

## Common Hoof Problems

- **Thrush** — Bacterial infection of the frog. Prevention: keep stables clean and dry, pick out feet regularly.
- **Laminitis** — Inflammation of the sensitive laminae. Causes include overfeeding, obesity, hormonal disorders (Cushing's disease, EMS), and excessive concussion. Signs: rocking back on the heels, reluctance to walk, heat in the hoof, bounding digital pulse. This is a veterinary emergency.
- **Possible abscess or sudden severe lameness** — A horse may become acutely lame or unwilling to bear weight. Stop work, keep handling safe and seek prompt veterinary/farrier advice rather than attempting invasive treatment.
- **Cracks or abnormal wear** — Report cracks, chips, flares or a changed hoof shape to the farrier. Do not self-diagnose the cause or use a product as a substitute for assessment.
- **Lost or loose shoe** — Inform the yard manager and contact the farrier promptly. Follow their advice about turnout, protection and whether the horse should be worked.`,
    keyPoints: [
      "Hoof growth, wear and trimming needs vary; a learner should observe and report rather than attempt trimming or shoeing",
      "The frog contributes to the foot’s function and should be checked as part of safe daily hoof care",
      "Use the safe picking-out procedure shown by a competent person and stop if the horse becomes unsafe to handle",
      "World Horse Welfare gives an average qualified-farrier interval of 6–8 weeks, while some horses need more frequent individual care",
      "Laminitis is a veterinary emergency — signs include heat in the hoof, reluctance to walk and rocking back on the heels",
      "Thrush is prevented by clean, dry conditions and regular hoof picking",
    ],
    safetyNote:
      "When picking out feet, always stand beside the horse, not in front of or behind the leg. If the horse snatches its foot away, do not hold on — let go and try again calmly. Never sit or kneel beside the horse; always bend from the waist so you can move away quickly if needed. If you notice signs of laminitis (heat, digital pulse, reluctance to move), do not force the horse to walk — contact the vet immediately.",
    practicalApplication:
      "Make picking out feet part of your daily routine — every time you bring a horse in from the field and before and after every ride. Keep a record of when the farrier last visited and when the next appointment is due. If you notice a risen clench, a loose shoe or a crack, inform the yard manager and call the farrier. Learning to spot problems early prevents minor issues from becoming serious lameness.",
    commonMistakes: [
      "Picking out feet from toe to heel, risking damage to the frog",
      "Not picking out feet regularly enough, allowing thrush to develop",
      "Ignoring a loose shoe and continuing to ride, which can cause hoof damage",
      "Confusing normal warmth in the hoof with the excessive heat associated with laminitis",
      "Leaving too long between farrier visits, causing hoof imbalance and cracks",
    ],
    knowledgeCheck: [
      {
        question: "What is the function of the frog?",
        options: [
          "It is purely decorative and has no function",
          "It acts as a shock absorber and aids blood circulation through the foot",
          "It protects the hoof wall from cracking",
          "It is where horseshoe nails are driven",
        ],
        correctIndex: 1,
        explanation:
          "The frog is a vital structure that absorbs concussion, provides grip and helps pump blood through the foot via the digital cushion above it.",
      },
      {
        question: "Which statement best reflects routine farrier planning?",
        options: [
          "Every horse must follow the same four-week interval",
          "Only shod horses need professional hoof care",
          "World Horse Welfare gives an average 6–8-week interval, but the qualified farrier sets the individual horse’s schedule",
          "Wait until a shoe is lost before arranging a visit",
        ],
        correctIndex: 2,
        explanation:
          "World Horse Welfare advises qualified, registered farrier trimming and/or shoeing on average every 6–8 weeks, with some horses needing more regular care. Follow the individual professional plan.",
      },
      {
        question: "What are the signs of laminitis?",
        options: [
          "Runny eyes and coughing",
          "Heat in the hoof, bounding digital pulse and reluctance to walk",
          "Swollen legs and loss of appetite",
          "A foul-smelling frog",
        ],
        correctIndex: 1,
        explanation:
          "Laminitis causes inflammation of the sensitive laminae within the hoof. Classic signs include heat in the hoof wall, a strong digital pulse, a 'pottery' gait, and the horse leaning back to take weight off the toes.",
      },
      {
        question: "What is thrush?",
        options: [
          "A fungal infection of the mane",
          "A bacterial infection of the frog, causing a foul-smelling black discharge",
          "A viral infection of the respiratory tract",
          "A bruise on the sole of the hoof",
        ],
        correctIndex: 1,
        explanation:
          "Thrush is a bacterial infection that develops in the frog and its grooves, usually due to standing in wet or dirty conditions. Prevention involves regular hoof picking and clean, dry stabling.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain the internal structure of the hoof and what laminitis does to it?",
      "Walk me through the correct procedure for picking out a horse's hind foot.",
      "What are the differences between the main types of horseshoes and their uses?",
    ],
    linkedCompetencies: ["grooming_safely", "stable_checks"],
  },

  {
    slug: "seasonal-horse-care",
    pathwaySlug: "horse-care-foundations",
    title: "Seasonal Horse Care",
    level: "intermediate",
    category: "Horse Care Foundations",
    sortOrder: 8,
    objectives: [
      "Adapt daily care routines to suit summer, winter, and transitional seasons",
      "Make informed decisions about clipping and rugging for different conditions",
      "Implement effective fly protection and heat management in summer",
      "Manage field care and turnout adjustments throughout the year",
    ],
    content: `Horses live outdoors in all weathers and their care needs change significantly with the seasons. A good horseperson anticipates these changes and adjusts routines proactively rather than reactively. This lesson covers the practical management decisions you will face across the year, from the heat and flies of summer to the cold, wet days of winter, and the tricky transitional periods in between.

## Summer Care

Summer brings warmth, longer days, and increased fly activity. While many horses thrive in summer, the season presents its own management challenges.

**Heat management** is a priority. Horses regulate their body temperature primarily through sweating, but in extreme heat or humidity, they can overheat. Key measures include:
- Providing constant access to fresh, clean water. Monitor the individual horse’s normal intake, access and behaviour closely in hot weather or after work; water needs vary with the horse, forage, workload, climate and health.
- Offering shade in the field, whether natural (trees and hedgerows) or man-made (field shelters).
- Avoiding hard work during the hottest part of the day. Ride early in the morning or in the evening.
- Hosing down the horse after exercise, particularly the large blood vessels on the inside of the hind legs, to aid cooling.

**Fly protection** is essential for horse welfare and comfort. Flies cause irritation, skin reactions, and can transmit diseases such as sweet itch (caused by *Culicoides* midge bites). Protection strategies include:
- Fly rugs and masks to provide a physical barrier.
- Fly repellent sprays applied before turnout — reapply as directed.
- Bringing horses in during peak fly times (dawn and dusk for midges, midday for horse flies).
- Keeping muck heaps away from stables and fields to reduce fly breeding sites.

**Pasture management** in summer includes monitoring grass quality (avoiding lush, high-sugar grass for laminitis-prone horses), rotating fields where possible, and ensuring water troughs are clean and topped up daily.

## Winter Care

Winter requires the most intensive daily management. Shorter days, cold temperatures, wet conditions, and limited grazing all demand careful planning.

**Rugging decisions** are among the most debated topics in horse management. The key factors are:
- The horse's natural coat thickness and body condition.
- Whether the horse is clipped.
- Whether the horse lives in or out.
- The weather — temperature, wind chill, and rain are all relevant.

A native breed with a full coat living out may need little more than a waterproof turnout rug in heavy rain. A clipped Thoroughbred stabled at night may need a heavy stable rug plus a neck cover. Over-rugging is a common mistake — it can cause sweating, skin irritation, and overheating. Always check under the rug by sliding your hand beneath it — the horse should feel warm but not sweaty.

**Mud management** is critical in winter. Mud fever (*Dermatophilus congolensis*) is a bacterial skin infection caused by prolonged exposure to wet, muddy conditions. Prevention includes:
- Avoiding leaving horses standing in deep mud for extended periods.
- Drying legs thoroughly before applying barrier creams.
- Rotating gateways and high-traffic areas.
- Checking legs daily for scabs, heat, or swelling.

**Feeding adjustments** in winter are necessary because grass quality and availability decline. Horses in work and those without access to good grazing will need supplementary hay or haylage, and possibly hard feed adjusted to their workload and condition. Monitor body condition regularly — a thick winter coat can hide weight loss.

## Transitional Seasons — Spring and Autumn

Spring and autumn are often overlooked but require careful management.

**Spring** brings rapidly growing grass with high sugar content, which is a significant laminitis risk, particularly for native breeds, overweight horses, and those with Equine Metabolic Syndrome (EMS) or Cushing's disease (PPID). Manage grazing carefully — strip grazing, limited turnout, and grazing muzzles may all be necessary.

Spring is also the time for:
- Reviewing vaccination and worming programmes.
- Beginning to reduce rugs as temperatures rise.
- Assessing body condition after winter and adjusting feed accordingly.

**Autumn** is the time to prepare for winter:
- Book the farrier for any shoeing changes (e.g., fitting studs for slippery conditions).
- Service and repair rugs before they are needed.
- Stock up on hay, bedding, and feed.
- Consider whether clipping is needed and, if so, what type of clip suits the horse's workload.

## Clipping

Clipping removes the horse's winter coat to prevent excessive sweating during work, allow faster drying, and make grooming easier. The decision to clip depends on:
- The horse's workload — a horse in regular work will benefit from clipping; a horse on light hacking may not need it.
- The horse's coat type — some horses grow very thick coats that make even light work uncomfortable.
- The management system — a clipped horse will need more rugs and may need to be stabled in cold weather.

**Common clip types:**
- **Trace clip** — Removes hair from the underside of the neck, belly, and upper legs. Suitable for horses in light to moderate work.
- **Blanket clip** — Leaves hair on the back and quarters (like a blanket shape) and removes the rest. Good for horses in moderate work.
- **Hunter clip** — Removes all hair except a saddle patch and the legs. For horses in hard, regular work.
- **Full clip** — Removes all hair. Typically used for competition horses or those with very heavy coats.

Always clip in a well-lit, dry area using sharp, well-maintained clippers. Clip against the direction of hair growth and take care around sensitive areas such as the head, elbows, and stifle.`,
    keyPoints: [
      "Summer care priorities include hydration, shade, fly protection, and avoiding work in extreme heat",
      "Rugging decisions depend on coat, clip, living conditions, and weather — over-rugging is as harmful as under-rugging",
      "Spring grass poses a significant laminitis risk, especially for native breeds and metabolically compromised horses",
      "Mud fever prevention requires dry legs, barrier creams, and avoiding prolonged standing in wet mud",
      "Clip type should match the horse's workload, coat type, and management system",
    ],
    safetyNote:
      "When clipping, always use a residual current device (RCD) with electric clippers and never clip a wet horse. Keep the horse tied securely and have an experienced handler present, particularly for horses that are nervous about clipping. If a horse is extremely distressed, stop and seek veterinary advice about sedation rather than forcing the process. When hosing a hot horse in summer, start at the feet and work upwards to avoid shocking the system.",
    practicalApplication:
      "Create a seasonal care calendar for a horse in your care. For each season, list the key management tasks, any changes to feeding, rugging, and turnout, and any veterinary or farrier appointments to schedule. Review the calendar monthly and adjust based on the actual weather conditions and the horse's individual needs. Share the calendar with other people who help manage the horse to ensure consistency.",
    commonMistakes: [
      "Over-rugging horses in winter, causing sweating and skin problems under the rug",
      "Failing to restrict grazing in spring for laminitis-prone horses, leading to a potentially life-threatening episode",
      "Neglecting to check legs daily in muddy conditions, allowing mud fever to develop unnoticed",
    ],
    knowledgeCheck: [
      {
        question: "What is the primary risk associated with lush spring grass?",
        options: [
          "It makes horses run too fast in the field",
          "It has a high sugar content that can trigger laminitis in susceptible horses",
          "It turns the horse's coat green",
          "It causes respiratory problems due to pollen",
        ],
        correctIndex: 1,
        explanation:
          "Spring grass grows rapidly and contains high levels of fructans (sugars). For horses prone to laminitis — particularly native breeds, overweight horses, and those with EMS or PPID — this poses a serious risk. Grazing management is essential during spring.",
      },
      {
        question:
          "Which clip type is most suitable for a horse in light to moderate work?",
        options: [
          "Full clip",
          "Hunter clip",
          "Trace clip",
          "No clip is ever suitable for working horses",
        ],
        correctIndex: 2,
        explanation:
          "A trace clip removes hair from the underside of the neck, belly, and upper legs, which are the areas that sweat most. It is ideal for horses in light to moderate work as it prevents excessive sweating while leaving the back and quarters protected.",
      },
      {
        question: "How should you check whether a horse is over-rugged?",
        options: [
          "Check if the horse is shivering",
          "Look at the weather forecast only",
          "Slide your hand under the rug — the horse should feel warm but not sweaty",
          "Over-rugging is not a real concern and does not need to be checked",
        ],
        correctIndex: 2,
        explanation:
          "The most reliable way to check is to slide your hand under the rug, particularly behind the shoulder and along the back. The horse should feel comfortably warm but not damp or sweaty. A sweating horse under a rug needs a lighter rug or no rug at all.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me decide what type of clip my horse needs based on its workload and living arrangements?",
      "What is the best fly protection strategy for a horse that reacts badly to midge bites?",
      "How do I create a mud fever prevention plan for winter?",
    ],
    linkedCompetencies: ["stable_checks", "welfare_awareness"],
  },

  {
    slug: "advanced-grooming-and-coat-management",
    pathwaySlug: "horse-care-foundations",
    title: "Advanced Grooming & Coat Management",
    level: "advanced",
    category: "Horse Care Foundations",
    sortOrder: 9,
    objectives: [
      "Prepare a horse to competition standard through advanced grooming techniques",
      "Perform trimming, plaiting, and quartering to a professional standard",
      "Identify and manage common skin conditions affecting coat health",
      "Understand the role of nutrition and supplements in maintaining coat quality",
    ],
    content: `Advanced grooming goes far beyond keeping a horse clean. It encompasses competition preparation, coat health management, and the specialist skills of trimming, plaiting, and quartering that present a horse to the highest standard. Whether you are preparing for a dressage test, a showing class, or an organised yard assessment, the ability to turn a horse out immaculately demonstrates horsemanship, attention to detail, and pride in your animal.

## Competition Preparation Grooming

Preparing a horse for competition begins days — not hours — before the event. A thorough pre-competition grooming routine ensures the horse looks its best and gives you time to address any issues.

**Three days before:**
- Give the horse a thorough bath using an equine shampoo. Pay particular attention to white markings, the mane, and the tail. Use a stain remover for stubborn marks on grey or white areas.
- Check the mane and tail for tangles. Apply a detangling spray and comb through carefully, starting at the ends and working up to avoid breaking hairs.
- Assess the coat condition. If the coat is dull, a final hot-cloth treatment can bring up a shine.

**The day before:**
- Trim the horse (see below) — jaw line, ears (if appropriate to the discipline), fetlocks, and bridle path.
- Pull or plait the mane to the required standard for the discipline.
- Apply a light coat of baby oil or coat shine to the mane and tail to lay the hairs flat and add sheen.
- Check shoes and ensure they are secure. A lost shoe the morning of a competition is a disaster.

**On the day:**
- Quarter the horse (see below) to remove stable stains and bring up the coat.
- Apply hoof oil for a polished finish.
- Wipe around the eyes, nostrils, and dock with a damp cloth.
- Final check: mane lying flat, tail bandage applied for travelling, rugs clean and correctly fitted.

## Trimming

Trimming neatens the horse's appearance and is expected in most competitive disciplines. The key areas are:

**Jaw and throat:** Use a small pair of curved trimming scissors or quiet clippers to remove long hairs from under the jaw and along the throatlatch. Follow the natural line of the jaw.

**Ears:** Trimming practice varies by discipline. In showing, the inside of the ears may be neatly trimmed (never remove all the hair, as it protects against insects and debris). In dressage and general competition, tidying the tufts at the tips of the ears is usually sufficient. Always check the rules of your discipline.

**Fetlocks and heels:** Remove excess feather from the fetlock area using scissors or clippers, following the line of the tendon. For native breeds shown in their natural state, this trimming is not appropriate — feather is part of breed character.

**Bridle path:** Some disciplines or yards choose to tidy a small section of mane behind the ears so a headpiece sits neatly. This is a cosmetic decision, not a universal requirement; use the current discipline rules and the horse’s comfort as the guide.

**Whiskers:** Note that trimming or removing a horse's whiskers (vibrissae) is banned under FEI rules and many national governing body regulations, as whiskers serve a sensory function. Always check current regulations before trimming.

## Plaiting

Plaiting (braiding) the mane and tail is a skill that improves with practice. It is required for many competitive disciplines and demonstrates turnout standards.

**Mane plaiting:**
- Dampen the mane and divide it into even sections. The number of plaits depends on the horse's neck length — traditionally an odd number plus the forelock.
- Plait each section tightly and evenly, securing with a rubber band or thread. Thread produces a neater finish and is preferred at higher levels.
- Roll or fold each plait under and secure. Plaits should sit on top of the crest, evenly spaced and uniform in size.

**Tail plaiting:**
- A plaited tail follows a French-plait technique down the centre of the dock, incorporating small sections of hair from each side.
- The plait should be tight, even, and extend approximately two-thirds of the way down the dock before being secured.
- This is a skill that requires significant practice. Work on a willing horse and have someone hold the tail still while you learn.

## Quartering

Quartering is a short, efficient grooming session performed before exercise or competition. Its purpose is a safe, calm tidy-up and observation check; its duration depends on the horse, conditions and task.
- Sponging the eyes, nostrils, and dock.
- Picking out the feet.
- Brushing over the coat with a body brush to remove surface dust and stable stains without removing the natural oils.
- Laying the mane flat with a damp water brush.
- A quick check for any injuries, heat, or swelling.

Quartering is not a full groom — it is a rapid tidy-up that ensures the horse is presentable and comfortable before work.

## Managing Skin Conditions and Coat Health

A healthy coat starts from the inside. Nutrition plays a vital role:
- **Omega-3 and omega-6 fatty acids** (found in linseed, fish oil, and specific supplements) promote a glossy coat and healthy skin.
- **Supplements** should only be considered after reviewing the horse’s whole diet and health needs with a vet or qualified nutrition adviser. Do not promise a cosmetic outcome or use one product as a substitute for assessment.
- **Zinc and copper** are essential trace minerals for skin health and pigmentation.
- A balanced diet with adequate protein provides the building blocks for hair growth.

**Common skin conditions:**
- **Possible rain scald, sweet itch, ringworm or other skin problem** — Crusts, hair loss, itching, circular lesions or skin change can have different causes. Record what you observe, use clean separate equipment where infection is a concern, follow the yard’s hygiene procedure and seek veterinary advice. Do not diagnose, remove scabs, isolate or apply treatment solely from this lesson.
- **Skin and coat changes** — A changed coat, hair loss, soreness or persistent itching should be reported promptly so the responsible professional can decide the appropriate examination, biosecurity and treatment plan.
- **Mud fever** — Bacterial infection of the lower legs caused by wet, muddy conditions. Prevention and management were covered in the seasonal care lesson.

Always consult a vet if you are unsure about a skin condition. Early treatment prevents spread and long-term damage to the coat.`,
    keyPoints: [
      "Competition preparation begins days before the event — bathing, trimming, and plaiting cannot be rushed",
      "Quartering is a short pre-exercise groom focused on safe observation, eyes, nostrils, dock, feet and a light brush over",
      "Whisker trimming is banned under FEI and many national rules — always check current regulations",
      "Coat condition should be considered through the whole diet and health history with qualified nutrition or veterinary advice before adding a supplement",
      "Skin or coat changes require prompt observation, hygienic equipment practices and veterinary advice rather than self-diagnosis or treatment",
    ],
    safetyNote:
      "When using electric clippers, follow the yard’s electrical-safety procedure and ensure the horse is calm and safely managed by a competent person. Keep clippers maintained so they do not pull hair. When plaiting, avoid pulling the mane too tightly. If you observe a possible infectious skin condition, stop sharing equipment, record the concern and follow the yard’s veterinary and biosecurity procedure rather than diagnosing or initiating treatment alone.",
    practicalApplication:
      "Practise plaiting only on a willing horse under competent supervision. Create a competition-preparation timeline using the current organiser rules, the horse’s comfort and the available preparation time. If you are concerned about coat condition or considering a supplement, discuss the complete diet and health history with a vet or qualified equine nutrition adviser before making changes.",
    commonMistakes: [
      "Leaving competition grooming until the morning of the event, resulting in a rushed and untidy turnout",
      "Trimming whiskers without checking current regulations, risking elimination from competition",
      "Ignoring early signs of skin conditions such as small scabs or patches of hair loss, allowing them to worsen",
    ],
    knowledgeCheck: [
      {
        question: "What is quartering?",
        options: [
          "Dividing the horse into four sections for grooming",
          "A quick, efficient pre-exercise groom focusing on eyes, nostrils, dock, feet, and a light brush over",
          "A thorough deep-clean groom taking at least an hour",
          "A technique for plaiting the tail into four sections",
        ],
        correctIndex: 1,
        explanation:
          "Quartering is a short grooming and observation session before exercise or competition. It focuses on eyes, nostrils, dock, feet and a light brush to remove surface dust without replacing a full health check.",
      },
      {
        question:
          "Why is trimming a horse's whiskers now restricted or banned in many competitions?",
        options: [
          "Whiskers grow back too quickly to be worth trimming",
          "Whiskers are a vital sensory organ (vibrissae) and their removal affects the horse's welfare",
          "Trimmed whiskers are considered unfashionable in modern showing",
          "It is too expensive to trim whiskers professionally",
        ],
        correctIndex: 1,
        explanation:
          "Whiskers (vibrissae) serve an important sensory function, helping the horse detect objects close to its muzzle. The FEI and many national governing bodies have banned their removal on welfare grounds.",
      },
      {
        question:
          "Which nutrient is particularly associated with promoting a glossy coat?",
        options: [
          "Vitamin C",
          "Calcium",
          "Omega-3 and omega-6 fatty acids",
          "Iron",
        ],
        correctIndex: 2,
        explanation:
          "Omega-3 and omega-6 fatty acids, found in sources such as linseed and fish oil, are well-documented for promoting a healthy, glossy coat and supporting overall skin health in horses.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through how to plait a mane for a dressage competition step by step?",
      "What observations and hygiene steps should I take before seeking advice about a possible skin condition?",
      "How do I assess whether my horse's diet is supporting good coat and skin health?",
    ],
    linkedCompetencies: ["grooming_safely", "welfare_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 2 — Rider Foundations
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Lesson 8 ──────────────────────────────────────────────────────────────
  {
    slug: "mounting-dismounting",
    pathwaySlug: "rider-foundations",
    title: "Mounting & Dismounting",
    level: "beginner",
    category: "Rider Foundations",
    sortOrder: 1,
    objectives: [
      "Describe the correct procedure for mounting from the ground",
      "Explain the importance of checking the girth before mounting",
      "Demonstrate a safe dismounting technique",
      "Understand when a mounting block should be used and why",
    ],
    content: `Mounting and dismounting are practical skills that must be learned with a qualified instructor on a suitable, quiet horse in a safe setting. Before riding, check the horse, tack, girth, stirrups, and surroundings using the current yard procedure. Stop and seek instruction if the horse is not standing quietly or the equipment is not ready.

## Pre-Mount Checks

Before you mount, carry out these checks every single time:

1. **Girth check** — Check that the girth is snug but not overtight and that the saddle is secure. Follow your instructor's and saddle manufacturer's fitting guidance. Walk the horse briefly and recheck before mounting if your current procedure requires it.
2. **Stirrup length** — Adjust stirrups roughly before mounting and refine them only when mounted safely. Correct length depends on the rider, saddle, discipline, and physical needs; ask an instructor for help rather than relying on a universal body measurement.
3. **Tack check** — Ensure the bridle is correctly fitted, the noseband and throatlash are fastened properly, and the reins are not twisted. Check that the saddle is sitting correctly on the horse's back with the numnah smooth underneath.
4. **Surroundings** — Make sure you have enough space to mount safely, away from walls, other horses and obstacles.

## Mounting from a Mounting Block

A mounting block or an instructor-approved leg-up can assist a rider where appropriate. The horse must be prepared to stand quietly, the area must be clear, and the mounting aid must be stable and suitable for the rider and horse.

**Procedure from a mounting block:**
1. Position the horse parallel to the mounting block on the horse's **near (left) side**.
2. Gather the reins in your left hand, short enough to maintain a light contact but not so tight that the horse steps backward. Place your left hand on the pommel of the saddle or the horse's neck.
3. Step onto the mounting block. Place your left foot in the stirrup iron, pressing your weight into the heel.
4. Push off with your right leg, swinging it smoothly and carefully over the horse's hindquarters without kicking the horse.
5. Lower yourself gently into the saddle — do not thump down. Sit quietly and find your balance.
6. Place your right foot in the right stirrup.
7. Take up the reins in both hands and check your girth once more.

## Mounting from the Ground

If no mounting block is available:
1. Stand at the horse's near shoulder, facing the tail.
2. Gather the reins in your left hand on the horse's neck or mane (not pulling).
3. Turn the left stirrup iron towards you with your right hand and place your left foot in the stirrup, toe pointing forward (not digging into the horse's side).
4. Place your right hand on the waist of the saddle (the far side of the seat).
5. Spring up from your right foot, straighten your left leg and swing your right leg smoothly over the hindquarters.
6. Lower yourself gently into the saddle.

Use this method only as taught and approved by a qualified instructor. If a mounting block, leg-up, or other assistance is appropriate for the rider or horse, use the approved option rather than improvising.

## Dismounting

The standard dismounting procedure is:

1. Bring the horse to a **square halt**.
2. Take both feet out of the stirrups.
3. Place both reins in your left hand on the horse's neck.
4. Lean forward slightly, swinging your right leg back and over the horse's hindquarters.
5. Slide down the near side, landing lightly on both feet with your knees slightly bent to absorb the impact.
6. Keep hold of the reins as you land so you maintain control of the horse.

Keep control of the horse through the reins while dismounting. Do not put a foot on the ground while the other is still in a stirrup: both Rutgers and Missouri Extension direct riders to release their feet from the stirrups before reaching the ground.

## Emergency Dismount

Emergency dismounting carries significant risk and must not be attempted from written instructions alone. Missouri Extension describes progressive practice only with a quiet, well-trained horse and qualified supervision. Follow the instructor's, facility's, and emergency-service directions; prioritise getting both feet free of the stirrups when safe to do so.`,
    keyPoints: [
      "Check the girth and saddle under the current instructor and yard procedure before mounting",
      "Use an instructor-approved mounting aid when it is appropriate for the rider, horse, and setting",
      "When mounting from the ground, face the tail and spring up from the right foot",
      "When dismounting, always remove both feet from the stirrups before sliding down",
      "Remove both feet from the stirrups before ground contact and maintain control through the reins",
      "Follow the current yard and instructor procedure for girth rechecking before riding",
    ],
    safetyNote:
      "Before mounting or dismounting, work in a clear safe area with a horse that is standing quietly, check tack under the current procedure, and keep control through the reins. Beginning riders should use qualified instruction and appropriate assistance. Never improvise a mounting or emergency-dismount technique from written guidance alone.",
    practicalApplication:
      "Before every lesson or ride, use the yard's documented tack, girth, stirrup, horse-readiness, and area checks. Practise mounting and dismounting only with qualified instruction and a suitable quiet horse. Ask for appropriate assistance or an approved mounting aid rather than improvising when a rider, horse, or setting needs it.",
    commonMistakes: [
      "Forgetting to check the girth before mounting, risking the saddle slipping",
      "Digging the left toe into the horse's side when mounting, causing discomfort or the horse to walk off",
      "Landing abruptly in the saddle rather than mounting smoothly and sitting gently",
      "Leaving the left foot in the stirrup while dismounting, creating a dragging risk",
      "Improvising a mounting method instead of using the instructor-approved aid or procedure",
    ],
    knowledgeCheck: [
      {
        question:
          "What must be true before using a mounting block or other mounting aid?",
        options: [
          "The horse can move around while the rider mounts",
          "The aid is stable, the area is clear, and the horse is prepared to stand quietly",
          "The rider can skip the tack and girth check",
          "The aid is used without any instruction",
        ],
        correctIndex: 1,
        explanation:
          "A mounting aid is appropriate only when it is stable and approved for the rider and horse, the area is clear, and the horse is standing quietly under control.",
      },
      {
        question: "What should you do if you are unsure whether the girth and saddle are ready for mounting?",
        options: [
          "Mount quickly before the horse moves",
          "Use a fixed hand-span rule regardless of horse or tack",
          "Stop and ask a qualified instructor to check the fit and current procedure",
          "Ignore it if the saddle appears level",
        ],
        correctIndex: 2,
        explanation:
          "The girth should be snug but not overtight, and tack checks must follow the current instruction and equipment guidance. Do not use a universal measurement in place of a qualified fit check.",
      },
      {
        question: "When dismounting, what should you do with your feet?",
        options: [
          "Keep the left foot in the stirrup and swing the right leg over",
          "Remove both feet from the stirrups before sliding down",
          "Keep both feet in the stirrups until you are on the ground",
          "It does not matter",
        ],
        correctIndex: 1,
        explanation:
          "Both feet must be removed from the stirrups before dismounting. A foot caught in a stirrup during dismount is one of the most dangerous situations in riding, as it can result in being dragged.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through the mounting procedure step by step?",
      "What are the pre-mount checks I should do every time before riding?",
      "How do I adjust my stirrup length once I am in the saddle?",
    ],
    linkedCompetencies: ["rider_position", "yard_safety_awareness"],
  },

  // ── Lesson 9 ──────────────────────────────────────────────────────────────
  {
    slug: "rider-position-basics",
    pathwaySlug: "rider-foundations",
    title: "Rider Position Basics",
    level: "beginner",
    category: "Rider Foundations",
    sortOrder: 2,
    objectives: [
      "Describe the correct classical riding position from head to heel",
      "Explain the importance of alignment for balance and communication",
      "Identify common position faults and their effects",
      "Understand how correct position helps the horse move freely",
    ],
    content: `Rider position should be developed with a qualified instructor for the individual rider, horse, saddle, activity, and current safety setting. The aim is a balanced, comfortable, effective position rather than a copied pose or a fixed measurement. Stop and seek coaching when a position is uncomfortable, unsafe, or requires the rider to use the reins for balance.

## The Classical Alignment

A commonly taught visual check is **ear — shoulder — hip — heel** alignment when viewed from the side. AQHA guidance uses this as a balance reference, but position and stirrup length vary with the rider, horse, saddle, discipline, and activity. Use an instructor's observation rather than forcing a fixed geometry.

## Head and Eyes

Keep attention on the riding environment and use an instructor's feedback to develop an appropriate head, eye, and upper-body position. Do not rely on the reins or the horse's mouth for balance. Position should be adjusted for the individual rider and activity rather than prescribed from a written cue alone.

## Shoulders and Upper Body

The shoulders should be **relaxed and level**, drawn gently back and down. Hunching the shoulders forward is one of the most common faults in beginners — it tightens the arms, blocks the seat and makes the rider top-heavy. The upper body should be tall and upright but not rigid. Think of growing taller through your spine rather than stiffening. A slight natural curve in the lower back is correct; a hollow back or a rounded back are both faults.

## Arms and Hands

The arms hang naturally from the shoulders, bending at the elbow to create a soft, straight line from the rider's elbow through the wrist and rein to the horse's mouth. This is called the **elbow–hand–bit line**. The elbow should remain comfortably soft and allow a straight, elastic connection without forcing a fixed angle.

The hands should be carried just above and slightly in front of the withers, with the thumbs on top and the knuckles facing forward. Their position and separation should allow a quiet, even contact and be reviewed with a qualified instructor rather than set by a fixed measurement. The fingers close softly around the rein — not gripping tightly, not holding loosely. Imagine holding a small bird: firmly enough that it cannot escape, gently enough that you do not hurt it.

The wrists should remain straight and supple, not bent upward, downward or sideways. Stiff, rigid hands transmit every movement of the rider's body down the rein to the horse's mouth, causing discomfort and confusion.

## The Seat

The seat is the most important part of the rider's position because it is the primary communication tool. Sit centrally in the deepest part of the saddle on your two **seat bones** (the bony prominences at the base of the pelvis). Your weight should be distributed evenly on both seat bones. Sitting more heavily on one side causes the horse to drift or become crooked.

The pelvis should be in a **neutral position** — neither tipped forward (hollow back) nor tucked under (rounded back). Imagine your pelvis as a bowl of water: you do not want to spill it forward, backward or sideways.

Engage your core muscles lightly — not bracing or gripping, but supporting your upper body so that it stays upright without relying on the reins or the horse's mouth for balance.

## Legs

The legs rest against the horse's sides with a long, draped quality. The thigh should lie flat against the saddle with the knee bent comfortably. The lower leg sits just behind the girth, in a position where it can give aids (signals) without having to move significantly.

The stirrup iron should sit on the **ball of the foot** — the widest part, just behind the toes. The heel should be the lowest point of the rider's body, pressed gently downward. This deep heel acts as a shock absorber and anchor, preventing the rider from being tipped forward. If the heel rises above the toe, the rider's leg can slide through the stirrup and become trapped — a serious safety hazard.

**Do not grip with the knees.** Gripping pushes the seat out of the saddle and pivots the lower leg backward, making aids ineffective. The leg should drape around the horse through relaxed, toned muscles, not clamped tension.

## Common Faults and Their Effects

| Fault | Effect |
|---|---|
| Looking down | Shifts weight forward, unbalances horse |
| Rounded shoulders | Collapses core, restricts breathing |
| Gripping with knees | Lifts seat, pushes lower leg back |
| Heels up | Insecure position, risk of foot going through stirrup |
| Hands too high | Unstable rein contact, stiffens shoulders |
| Sitting to one side | Horse drifts, uneven muscle development |

Good position is not something you achieve once and forget — it requires constant awareness and regular correction. Even experienced riders revisit their position regularly.`,
    keyPoints: [
      "The classical alignment is ear–shoulder–hip–heel in a vertical line when viewed from the side",
      "Looking ahead — not down — is essential for balance and giving directional cues",
      "The seat is the primary communication tool; sit on both seat bones with a neutral pelvis",
      "The heel must be the lowest point; a raised heel is a safety hazard",
      "Do not grip with the knees — this lifts the seat and weakens the leg aids",
      "The elbow–hand–bit line should be a straight, soft connection from elbow to horse's mouth",
    ],
    safetyNote:
      "Use riding boots, stirrups, and saddle safety features appropriate to the rider and discipline. Missouri Extension advises that the ball of the foot rests over the stirrup tread with heel lower than toe for most riding, and warns against equipment that secures a rider to the saddle. Ask a qualified instructor to check fit, equipment condition, and helmet selection before riding.",
    practicalApplication:
      "At the start of every lesson, spend a few minutes in the halt checking your position: are your shoulders level and relaxed? Is your weight even on both seat bones? Are your heels down? Is there a straight line from your ear to your heel? Ask your instructor for feedback, or have someone take a photograph from the side so you can see your alignment. Over time, correct position becomes muscle memory, but it takes consistent practice.",
    commonMistakes: [
      "Looking down at the horse's neck instead of ahead, causing the rider to lean forward",
      "Gripping with the knees, which pushes the seat out of the saddle",
      "Allowing the heel to rise above the toe, creating an insecure base",
      "Rounding the shoulders and collapsing through the upper body",
      "Holding the reins too tightly and using them for balance instead of the seat and legs",
    ],
    knowledgeCheck: [
      {
        question: "What are the four points of the classical rider alignment?",
        options: [
          "Head, hand, knee, toe",
          "Ear, shoulder, hip, heel",
          "Eye, elbow, knee, ankle",
          "Hat, back, thigh, stirrup",
        ],
        correctIndex: 1,
        explanation:
          "The classical alignment places the ear, shoulder, hip and heel in a vertical line when viewed from the side, ensuring the rider's weight is centred over the horse's centre of gravity.",
      },
      {
        question: "Where should the stirrup iron sit on the rider's foot?",
        options: [
          "Under the arch of the foot",
          "On the ball of the foot",
          "On the toes only",
          "Against the heel",
        ],
        correctIndex: 1,
        explanation:
          "The stirrup iron should rest on the ball of the foot — the widest part behind the toes. This allows the heel to press down and prevents the foot from sliding through the stirrup.",
      },
      {
        question: "Why is gripping with the knees a problem?",
        options: [
          "It causes knee pain in the rider",
          "It lifts the seat out of the saddle and pushes the lower leg backward",
          "It makes the horse go faster",
          "It damages the saddle",
        ],
        correctIndex: 1,
        explanation:
          "Gripping with the knees acts as a pivot point, pushing the rider's seat up out of the saddle and swinging the lower leg behind the correct position, weakening the leg aids.",
      },
      {
        question: "What is the 'elbow–hand–bit line'?",
        options: [
          "The angle of the rider's elbow when mounting",
          "A straight line from the rider's elbow through the hand and rein to the horse's mouth",
          "The distance between the elbow and the pommel",
          "A measurement for fitting a bridle",
        ],
        correctIndex: 1,
        explanation:
          "The elbow–hand–bit line describes the straight, unbroken line from the rider's elbow through the wrist, hand and rein to the bit in the horse's mouth, creating a soft, consistent contact.",
      },
    ],
    aiTutorPrompts: [
      "Can you describe the correct riding position from head to heel?",
      "What exercises can I do to improve my position in the saddle?",
      "How does my position affect the horse's way of going?",
    ],
    linkedCompetencies: ["rider_position"],
  },

  // ── Lesson 10 ─────────────────────────────────────────────────────────────
  {
    slug: "arena-etiquette",
    pathwaySlug: "rider-foundations",
    title: "Arena Etiquette",
    level: "beginner",
    category: "Rider Foundations",
    sortOrder: 3,
    objectives: [
      "State the basic rules of the school for shared arena use",
      "Explain the convention of passing left-hand to left-hand",
      "Describe how to announce movements to other riders",
      "Understand arena markers and their layout",
    ],
    content: `When multiple riders share an arena, a set of conventions — collectively known as arena etiquette or "rules of the school" — keeps everyone safe and allows each rider to work effectively. These rules are standard across riding schools in the UK and are based on common sense and courtesy.

## Arena Markers

A **20 m × 40 m small arena** is commonly used for introductory schooling and some national tests. Arena dimensions and letter layouts vary by test level, organiser and jurisdiction; always use the current schedule or organiser’s diagram for competition. In this small-arena example, the letters are:

- **A** — The entrance end, centre of the short side
- **C** — The far end, centre of the opposite short side
- **B** — Centre of the right long side
- **E** — Centre of the left long side
- **K, E, H** — Along the left long side (from A)
- **F, B, M** — Along the right long side (from A)

A common mnemonic for the letters going clockwise from A is: **A-K-E-H-C-M-B-F** — "All King Edward's Horses Can Make Big Fences."

The invisible centre line runs from **A to C** through **X**, the centre point of the arena. Knowing these letters is essential for understanding school figures and for following instructions.

## The Track

The **track** is the path around the outside of the arena, approximately one metre in from the fence or wall. Riders on the track have priority. This is the most commonly used path and is sometimes called the "outside track."

The **inside track** is a line slightly inside the outer track, used to avoid horses working on the outer track or for exercises that require a slightly different line.

## Passing Other Riders

The most important rule when riding in a shared arena is: **pass left hand to left hand**. This means when two riders approach each other from opposite directions, each moves slightly to the right so they pass with their left hands closest to each other. This is the equine equivalent of driving on the right and prevents collisions.

If one rider is on the track and another is on an inside line, the rider on the track has right of way.

## The Rein

The "rein" refers to the direction of travel around the arena. Riding clockwise is "right rein" (the centre of the arena is to your left, and the fence is to your right). Riding anti-clockwise is "left rein" (the centre is to your right, the fence to your left).

When the majority of riders are on the same rein, any rider wishing to change rein should check it is safe to do so and call out their intention clearly.

## Calling Out

In a shared arena, riders should call out:
- **"Passing left!"** or **"Inside!"** — when overtaking another rider on the inside
- **"Door, please!"** or **"Door free!"** — when entering or leaving the arena
- **"Heads up!"** — to warn of a loose horse or any hazard
- **"Circle at [letter]!"** — when about to circle, alerting others to move out of the way if needed

Clear communication prevents confusion and accidents.

## General Rules

1. **Do not halt on the track.** If you need to stop, come off the track onto an inner line or to the centre so you do not block other riders.
2. **Do not ride too close behind another horse.** Maintain at least one horse's length gap — some horses kick when crowded from behind.
3. **Faster gaits have priority.** A rider in canter has right of way over riders in walk or trot. Slower riders should move to an inner track to allow faster work on the outside.
4. **Do not lunge in a busy arena** — lunging requires a large circle and limits the space available for ridden work.
5. **Close the gate** behind you when entering or leaving the arena, unless another rider is directly behind you.
6. **Ride with awareness.** Keep your eyes up and look ahead. Plan your movements so you do not cut across other riders' paths.
7. **Be considerate.** If your horse is known to be unpredictable, tie a red ribbon in its tail to warn others. If another horse is wearing a red ribbon, give it extra space.

## Why Arena Etiquette Matters

These conventions exist to prevent accidents. Horses are flight animals and can react unpredictably when startled by other horses passing too close or cutting across their path. A collision between two horses can cause serious injury to riders and horses alike. Consistent, predictable behaviour in the arena allows everyone to ride with confidence.`,
    keyPoints: [
      "Pass left hand to left hand — the fundamental rule for passing other riders in the arena",
      "Riders on the outer track have priority over those on inner lines",
      "Faster gaits (canter) take priority over slower gaits (walk, trot) on the track",
      "Always call out your intentions clearly: movements, entering, exiting, or hazards",
      "Never halt on the track; move to an inner line or the centre",
      "Maintain at least one horse-length distance behind the horse in front",
    ],
    safetyNote:
      "Always close the arena gate behind you to prevent horses from escaping. If a horse gets loose in the arena, all riders should halt immediately, call out 'Loose horse!' and remain still until the situation is resolved. Never ride directly behind a horse you do not know, as some horses kick. A red ribbon in a horse's tail is a warning that it kicks — always give such horses extra space.",
    practicalApplication:
      "Before your first ride in a shared arena, spend time watching other riders to observe the etiquette in action. Learn the arena letters by walking around and reading them. When you ride, keep your eyes up and plan your path two or three strides ahead. If you are unsure of the rules, ask your instructor before starting work. Good arena etiquette becomes instinctive with practice and makes every session safer and more productive.",
    commonMistakes: [
      "Halting on the outer track and blocking other riders",
      "Forgetting to call out when changing the rein or making a circle",
      "Passing too close to another horse, risking kicks or startling",
      "Not looking ahead and cutting across another rider's line of travel",
      "Leaving the arena gate open when entering or exiting",
    ],
    knowledgeCheck: [
      {
        question:
          "When two riders approach each other from opposite directions, how should they pass?",
        options: [
          "Right hand to right hand",
          "Left hand to left hand",
          "The faster rider chooses",
          "They should both halt and wait",
        ],
        correctIndex: 1,
        explanation:
          "The standard convention is to pass left hand to left hand. Each rider moves slightly to the right, just as you would when walking on a pavement in the UK.",
      },
      {
        question: "What does a red ribbon in a horse's tail indicate?",
        options: [
          "The horse is for sale",
          "The horse is a stallion",
          "The horse is known to kick — give it extra space",
          "The rider is a beginner",
        ],
        correctIndex: 2,
        explanation:
          "A red ribbon tied in a horse's tail warns other riders and handlers that the horse may kick. Always maintain extra distance from a horse wearing a red ribbon.",
      },
      {
        question: "Which rider has priority on the outer track?",
        options: [
          "The rider in the slowest gait",
          "The rider who arrived first",
          "The rider in the fastest gait",
          "The most experienced rider",
        ],
        correctIndex: 2,
        explanation:
          "Riders working at faster gaits (canter) have priority on the outside track. Riders in walk or trot should use the inside track to allow the faster rider space.",
      },
    ],
    aiTutorPrompts: [
      "Can you quiz me on the arena letters and their positions?",
      "What should I call out in a shared arena and when?",
      "Explain the difference between left rein and right rein in the school.",
    ],
    linkedCompetencies: ["yard_safety_awareness", "risk_awareness"],
  },

  // ── Lesson 11 ─────────────────────────────────────────────────────────────
  {
    slug: "walk-trot-transitions",
    pathwaySlug: "rider-foundations",
    title: "Walk to Trot Transitions",
    level: "developing",
    category: "Rider Foundations",
    sortOrder: 4,
    objectives: [
      "Describe the aids for an upward transition from walk to trot",
      "Describe the aids for a downward transition from trot to walk",
      "Explain the difference between rising trot and sitting trot at a basic level",
      "Understand the importance of preparation and timing in transitions",
    ],
    content: `Transitions — the changes between gaits — are among the most fundamental riding skills. A good transition is smooth, prompt and balanced. It demonstrates that the rider can communicate clearly with the horse and that the horse is listening and responsive. This lesson focuses on the walk-to-trot and trot-to-walk transitions, which are the first transitions a developing rider masters.

## Understanding the Walk and the Trot

The **walk** is a four-beat gait, meaning each of the horse's four feet hits the ground independently in a regular sequence. It is the slowest gait and gives the rider time to think and apply aids carefully. A good walk is relaxed, rhythmic and forward-going, with the horse stepping actively underneath itself.

The **trot** is a two-beat gait in which the horse moves its legs in diagonal pairs (near fore with off hind, off fore with near hind), with a moment of suspension (all four feet off the ground) between each beat. The trot is bouncier than the walk and requires the rider to manage the increased movement.

## Aids for Walk to Trot (Upward Transition)

An "aid" is a signal from the rider to the horse. The aids for a walk-to-trot transition are:

1. **Prepare** — Before asking for the transition, ensure the walk is active and forward. A lazy, shuffling walk will produce a poor, stumbling trot. Sit tall, engage your core and think "forward."
2. **Seat** — Allow your seat to follow the horse's movement. As you prepare, lighten your seat very slightly to free the horse's back.
3. **Legs** — Apply both legs inward against the horse's sides just behind the girth with a gentle squeeze. This is the primary driving aid. The pressure should be quick and clear — squeeze and release — not a constant grip.
4. **Hands** — Maintain a soft, allowing contact through the reins. Do not pull back or throw the reins away. The hands should "follow" — as the horse moves into trot, allow the rein to accommodate the change in head carriage without losing contact.
5. **Voice** — In a lesson situation, you may use a cluck or "trot on" as a supporting aid. Voice aids should not replace leg aids, but they can reinforce them, especially on school horses.

The upward transition should feel like the horse steps forward into trot from behind, not lurching forward from the front.

## Aids for Trot to Walk (Downward Transition)

1. **Prepare** — Sit taller and engage your core. Think "walk" in your mind — your body will subtly change its rhythm, and many horses respond to this.
2. **Seat** — Stop following the trot rhythm. Allow your seat to become heavier and stiller.
3. **Legs** — Keep a gentle leg contact to maintain the horse's forward energy even as you slow down. Without leg, the horse may fall into a sloppy, unbalanced walk.
4. **Hands** — Close your fingers around the reins and resist the forward movement with gentle, steady pressure. This is not a pull — it is a resistance. Imagine squeezing a sponge in each hand. Apply the aid rhythmically, in time with the trot, rather than holding rigidly.
5. **Release** — As soon as the horse responds and walks, soften your hands immediately to reward the response. Keeping the rein tight after the horse has obeyed teaches the horse to ignore the aids.

## Rising Trot

In **rising trot** (also called posting trot), the rider rises out of the saddle on one beat of the trot and sits back on the next. This absorbs the bounce, making it more comfortable for both rider and horse.

The rising movement comes from the hips and thighs, not from pushing off the stirrups or pulling on the reins. Think of your hip angle opening (rising) and closing (sitting). Rise forward, not straight up. Rise on the correct diagonal: you should sit when the horse's outside foreleg comes back (i.e., sit when the outside shoulder moves backward).

## Timing and Preparation

The quality of a transition depends on the preparation:

- **Half-halt** — A brief, coordinated aid that rebalances the horse before a transition. It consists of a momentary closing of the seat, leg and hand, followed by an immediate softening. Think of it as saying "attention" before "action." This concept will be developed further in later lessons.
- **Plan ahead** — Know where you will make your transition. For example, "I will trot at A" or "I will walk at E." Deciding in advance gives you time to prepare, rather than giving sudden, unexpected aids.
- **Quality matters** — A rushed, unbalanced transition is worse than waiting an extra stride for a smooth one. Aim for promptness, not haste.`,
    keyPoints: [
      "The walk is a four-beat gait; the trot is a two-beat diagonal gait",
      "For an upward transition: prepare with an active walk, then squeeze both legs behind the girth while maintaining a soft rein contact",
      "For a downward transition: sit deeper, stop following the trot rhythm and close the fingers on the reins — then soften immediately when the horse responds",
      "Rising trot absorbs the bounce; rise from the hips, not the stirrups",
      "Always prepare for transitions — a half-halt rebalances the horse before the change",
    ],
    safetyNote:
      "During your first trot transitions, hold a neck strap or the front of the saddle if you feel unbalanced. Never grab the reins for balance, as this pulls on the horse's mouth and may cause it to stop suddenly or throw its head up. If the trot feels too fast, sit tall, breathe, and use your body and voice to reassure both yourself and the horse. Always work within your comfort zone under instruction.",
    practicalApplication:
      "Practise transitions at planned markers in the arena: 'Walk at C, trot at A.' This develops your ability to prepare and plan ahead. Count the strides between your preparation and the transition — aim for the horse to respond within one to two strides. Ask your instructor to call transitions for you so you learn to respond promptly. As your skill develops, aim for transitions that are smooth enough that a cup of tea on the pommel would not spill.",
    commonMistakes: [
      "Kicking hard with the heels instead of squeezing with the calves",
      "Pulling on the reins to slow down instead of using seat and core",
      "Leaning forward during the upward transition, unbalancing the horse",
      "Collapsing in the downward transition instead of sitting tall",
      "Forgetting to soften the hands once the horse has responded to the downward aid",
    ],
    knowledgeCheck: [
      {
        question: "How many beats does the trot have?",
        options: ["One", "Two", "Three", "Four"],
        correctIndex: 1,
        explanation:
          "The trot is a two-beat gait in which the horse moves its legs in diagonal pairs, with a moment of suspension between each beat.",
      },
      {
        question:
          "What is the primary aid for asking a horse to move from walk to trot?",
        options: [
          "Pulling the reins forward",
          "Leaning forward",
          "Squeezing both legs behind the girth",
          "Clicking with the tongue only",
        ],
        correctIndex: 2,
        explanation:
          "The primary driving aid is a squeeze of both legs against the horse's sides just behind the girth. Voice and seat aids support the leg, but the leg is the main signal.",
      },
      {
        question:
          "What should you do with your hands once the horse has responded to a downward transition aid?",
        options: [
          "Keep pulling to make sure the horse stays in walk",
          "Drop the reins completely",
          "Soften the contact immediately to reward the horse's response",
          "Move the hands higher",
        ],
        correctIndex: 2,
        explanation:
          "Softening the rein contact immediately after the horse responds rewards the correct behaviour and teaches the horse to listen to light aids. Maintaining pressure teaches the horse to ignore the aids.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain the difference between rising trot and sitting trot?",
      "How do I apply the aids correctly for a walk-to-trot transition?",
      "What is a half-halt and how does it help transitions?",
    ],
    linkedCompetencies: ["control_at_walk", "control_at_trot"],
  },

  // ── Lesson 12 ─────────────────────────────────────────────────────────────
  {
    slug: "basic-school-figures",
    pathwaySlug: "rider-foundations",
    title: "Basic School Figures",
    level: "developing",
    category: "Rider Foundations",
    sortOrder: 5,
    objectives: [
      "Ride a 20-metre circle accurately using arena markers",
      "Execute a change of rein across the diagonal and through the centre",
      "Understand the purpose of school figures for developing balance and suppleness",
      "Describe the aids for riding a turn and a circle",
    ],
    content: `School figures are prescribed patterns ridden in the arena. They are not just exercises to fill time — they serve essential purposes: they develop the horse's suppleness, balance and straightness, and they teach the rider to use their aids accurately and to plan ahead. Every riding test, from introductory dressage to Grand Prix, is built from combinations of school figures.

## The 20-Metre Circle

The 20-metre circle is a common school figure and one of the first a rider learns. In any arena that is 20 m wide, including a 20 m × 40 m small arena, a 20-metre circle spans the arena’s width. Check the current arena diagram and test instructions before practising for a competition. Key circles are:

- **At A or C** — The circle touches the short side at A or C, reaches E or B on the long side, and returns to A or C. It passes through the centre line at X.
- **At B or E** — The circle touches the two long sides and crosses the centre line at two points.

**Riding a good circle:**
The shape must be truly round — not egg-shaped, square or wobbly. To achieve this:
1. **Look around the curve** — Your eyes should follow the line of the circle, looking ahead to where you are going, not down at the horse.
2. **Inside leg at the girth** — Your inside leg (the one closest to the centre of the circle) stays at the girth and acts as the bending and driving aid. The horse bends around this leg.
3. **Outside leg behind the girth** — Your outside leg moves slightly behind the girth to prevent the hindquarters from swinging out.
4. **Inside rein** — A gentle opening rein or light squeeze asks for flexion (the horse looks slightly to the inside). The inside rein should not pull the horse around the circle.
5. **Outside rein** — This is the controlling rein. It limits the amount of bend, prevents the horse from falling out through the outside shoulder, and regulates the speed. Many riders underestimate the importance of the outside rein.

The horse should bend uniformly through its whole body to match the curve of the circle. This is called **lateral bend**. The horse's hind feet should follow the same track as the front feet.

## Changes of Rein

A **change of rein** means changing direction. There are several standard ways:

- **Across the diagonal** — The most common change of rein. From the track, turn at a marker (e.g., K), ride diagonally across the arena to the opposite marker (e.g., M), and resume the track in the new direction. The diagonal line should be straight and the transitions onto and off it should be smooth.
- **Across the centre** — Ride from E straight across to B (or vice versa). This is a shorter, more direct change.
- **Down the centre line** — Turn at A, ride straight down the centre line to C, and turn onto the track in the new direction.
- **Through a half-circle and return** — Ride a 10 or 15-metre half-circle from the track, then ride an oblique line back to the track on the new rein.

When changing rein, change your diagonal in rising trot (sit for two beats, then rise on the new diagonal) to avoid tiring one side of the horse.

## Half School (Half Arena)

Riding in the half school means using only one half of the arena — from A to E/B, or from C to E/B. This reduces the space and is often used when the arena is shared or for exercises that require shorter distances.

## Three-Quarter Line and Quarter Lines

The **three-quarter line** runs parallel to the long sides, approximately 5 metres in from the track. The **quarter lines** are 5 metres from each long side. Riding on these inner lines tests the rider's ability to ride straight without the support of the wall or fence. The horse naturally drifts toward the track (called "magnetism to the wall"), so riding inner lines develops the rider's use of guiding aids.

## Why School Figures Matter

- **Suppleness** — Circles, loops and serpentines encourage the horse to bend through its body, stretching one side and contracting the other, improving flexibility.
- **Balance** — Accurate figures help the horse carry its weight more evenly, especially through turns and transitions.
- **Straightness** — Riding straight lines and precise shapes highlights and corrects crookedness.
- **Rider development** — Planning and executing figures teaches the rider to coordinate multiple aids simultaneously, look ahead and think strategically.

School figures should be ridden with purpose and precision. A rider who rides accurate figures at walk demonstrates more skill than one who canters inaccurately around the arena.`,
    keyPoints: [
      "In a 20 m-wide arena, a 20-metre circle spans the arena width; use the current organiser’s diagram for any competition layout",
      "On a circle: inside leg at the girth for bend, outside leg behind the girth to control the hindquarters",
      "The outside rein is the controlling rein — it limits bend and regulates speed",
      "When changing rein across the diagonal, change your rising trot diagonal as you cross",
      "School figures develop suppleness, balance and straightness in both horse and rider",
    ],
    safetyNote:
      "When riding school figures in a shared arena, always be aware of other riders. Call out your intended figure, especially circles, so others can avoid your path. When changing rein across the diagonal, check both directions for oncoming riders before turning off the track. Maintain the 'left hand to left hand' passing convention at all times.",
    practicalApplication:
      "Place cones or markers at the four compass points of your 20-metre circle to help visualise the correct shape. Ride the circle at walk first, checking each quarter. Then progress to trot once the shape is consistent. Practise changes of rein across the diagonal, focusing on a straight diagonal line. Film yourself from above if possible, or ask your instructor to watch from the gallery, to check the accuracy of your figures.",
    commonMistakes: [
      "Riding egg-shaped circles instead of truly round ones",
      "Pulling the horse around circles with the inside rein instead of using inside leg and outside rein",
      "Forgetting to change the rising trot diagonal when changing rein",
      "Allowing the horse to drift toward the track on inner lines",
      "Not planning ahead — turning too late or too early at markers",
    ],
    knowledgeCheck: [
      {
        question: "In a 20m × 40m arena, how wide is a 20-metre circle?",
        options: [
          "Half the arena width",
          "The full width of the arena",
          "Quarter of the arena",
          "10 metres across",
        ],
        correctIndex: 1,
        explanation:
          "In an arena that is 20 metres wide, a 20-metre circle spans that width. The exact markers and layout depend on the arena and current organiser instructions.",
      },
      {
        question:
          "Which rein controls the speed and limits the bend on a circle?",
        options: [
          "The inside rein",
          "The outside rein",
          "Both reins equally",
          "Neither — speed is controlled by the seat only",
        ],
        correctIndex: 1,
        explanation:
          "The outside rein is the controlling rein. It limits the degree of bend, prevents the horse from falling out through the shoulder, and regulates the tempo.",
      },
      {
        question:
          "What should you do with your rising trot when you change rein?",
        options: [
          "Continue on the same diagonal",
          "Change diagonal by sitting for two beats and rising on the other diagonal",
          "Switch to sitting trot",
          "Rise higher to compensate",
        ],
        correctIndex: 1,
        explanation:
          "When changing rein, you need to change your rising trot diagonal so you continue to sit when the new outside foreleg comes back. Sit for two beats to make the switch.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain how to ride an accurate 20-metre circle using the arena markers?",
      "What are the different ways to change the rein in a standard arena?",
      "How do school figures improve a horse's way of going?",
    ],
    linkedCompetencies: ["control_at_walk", "balance_and_coordination"],
  },

  // ── Lesson 13 ─────────────────────────────────────────────────────────────
  {
    slug: "warmup-cooldown",
    pathwaySlug: "rider-foundations",
    title: "Warm-Up & Cool-Down Routines",
    level: "developing",
    category: "Rider Foundations",
    sortOrder: 6,
    objectives: [
      "Explain why warming up and cooling down are essential for horse welfare",
      "Describe a suitable warm-up routine for a flatwork session",
      "Outline a correct cool-down procedure after exercise",
      "Understand the physiological reasons behind warming up muscles and joints",
    ],
    content: `Plan exercise with an individual, progressive warm-up and cool-down that reflects the horse's current fitness, health, workload, weather, ground, temperament, and qualified guidance. Current welfare guidance recognises that there are no rigid rules; do not copy a fixed routine or continue when the horse appears unable to cope.

## Why Warm Up?

The warm-up serves several critical physiological purposes:

1. **Increases blood flow to muscles** — Cold muscles are stiff and more prone to strains and tears. Gradual exercise increases blood circulation, delivering oxygen and nutrients to the muscles and preparing them for work.
2. **Lubricates joints** — Movement stimulates the production of synovial fluid within the joints, which reduces friction and protects cartilage. This is particularly important for older horses or those with joint stiffness.
3. **Prepares the respiratory system** — The horse's breathing rate increases gradually, allowing the lungs to expand fully and exchange oxygen efficiently.
4. **Mental preparation** — The warm-up allows the horse to settle, focus and tune in to the rider's aids. A horse brought straight from the stable and asked to work hard immediately may be tense, distracted or resistant.
5. **Checks for soundness** — Walking and trotting at the beginning of a session allows you to feel whether the horse is moving evenly. If the horse feels uneven or unlevel, you can investigate before asking for more demanding work.

## A Standard Warm-Up Routine

A warm-up can progress from easy movement to more dynamic work, but its duration and detail must be adjusted for the individual horse and conditions:

**Phase 1 — Easy movement:**
- Begin with free walk on a long rein, allowing the horse to stretch its head and neck forward and down.
- Walk on both reins, using large shapes (20-metre circles, changes of rein) to loosen the horse evenly on both sides.
- This phase allows the horse to warm the muscles, loosen the joints and mentally settle.

**Phase 2 — Progressive movement:**
- Move into a working trot, starting with rising trot to ease the horse's back.
- Ride large circles, serpentines and changes of rein to encourage the horse to use both sides of its body equally.
- Gradually take up more contact as the horse begins to soften and engage.
- Include some transitions within trot (lengthening and shortening the stride) to develop responsiveness.

**Phase 3 — Further work (if appropriate):**
- A brief canter on each rein further warms the muscles and prepares the horse for the main session.
- Keep the canter steady and balanced; this is not the time for collection or extension.

After the warm-up, the horse should feel supple, forward-going and responsive. If it still feels stiff or tense, extend the warm-up rather than pushing into harder work.

## The Main Work Session

Once warmed up, the main work can begin. This may include more demanding exercises such as smaller circles, lateral work, transitions, canter work or jumping. The intensity should build progressively and peak in the middle of the session, then ease off toward the end.

## Cool-Down Procedure

The cool-down is just as important as the warm-up:

**Phase 1 — Reduce intensity gradually:**
- Drop from canter to trot, then from trot to walk over several minutes. Do not go from hard work directly to halt.
- Include some stretchy trot (allowing the horse to lower its head and stretch over the back) to help the muscles begin to relax.

**Phase 2 — Walk and recover:**
- Walk the horse on a loose rein, allowing it to stretch its neck fully forward and down.
- Gradually walk until respiration has recovered, encourage comfortable stretching, and monitor energy and movement quality.
- In hot weather, reduce intensity and duration, allow extra recovery time, offer water, use shade where available, and apply cool water over the body when active cooling is needed.

**Phase 3 — Post-ride checks:**
- Once dismounted, check the horse's legs for heat or swelling.
- Offer water.
- In cold weather, throw a cooler rug over the horse to prevent chilling while the coat dries.
- Ensure the horse is dry and comfortable before rugging and returning to the stable or field.

## Signs of a Horse That Has Not Been Cooled Down Properly

- Heavy or excessive sweating
- Fast or laboured breathing
- Feeling hot to the touch
- Lethargy, a drop in performance, tiredness, or declining movement quality

If these concerns occur, stop exercise, begin the appropriate cooling measures, and seek responsible professional guidance rather than self-diagnosing.

A consistent warm-up and cool-down routine protects the horse's body, improves performance over time and demonstrates responsible horsemanship.`,
    keyPoints: [
      "Warm-up and cool-down plans are individualised for the horse, conditions, workload, and qualified guidance",
      "Start with easy movement and progress only as the individual horse is ready",
      "Gradually reduce work and walk until respiration has recovered, monitoring the horse's energy and movement quality",
      "If movement quality declines or the horse appears unable to cope, stop exercise and seek responsible qualified guidance",
      "In hot weather, adapt workload and recovery, offer water and shade, and use active cooling when needed",
    ],
    safetyNote:
      "If movement quality declines, the horse appears unable to cope, or you are concerned about heat or comfort, stop exercise and report it to the responsible yard person, instructor, veterinarian, or other appropriate professional. In hot conditions, recognised welfare guidance supports active cooling with cool water over the body alongside recovery walking, shade where available, and access to water.",
    practicalApplication:
      "Plan the session around the individual horse, current fitness, weather, ground and recovery. Begin with easy movement, progress only as appropriate, and reduce work gradually afterwards. Observe behaviour, breathing, energy and movement quality; if concerns arise, stop and seek qualified guidance rather than applying a copied timing or self-diagnostic rule.",
    commonMistakes: [
      "Skipping the walk phase and going straight into trot or canter",
      "Using a copied warm-up duration instead of adapting the session to the horse, conditions, and current fitness",
      "Stopping hard work abruptly instead of reducing work gradually and monitoring recovery",
      "Not checking for lameness during the warm-up trot",
      "Dismounting immediately after hard work instead of walking on a long rein first",
    ],
    knowledgeCheck: [
      {
        question:
          "What should determine the duration and detail of a warm-up?",
        options: [
          "A fixed time copied for every horse",
          "The individual horse, fitness, workload, weather, ground and qualified guidance",
          "The rider's preference alone",
          "Whether the horse is already sweating",
        ],
        correctIndex: 1,
        explanation:
          "There are no rigid warm-up rules. Use easy movement and progress according to the individual horse, conditions, workload and qualified advice.",
      },
      {
        question:
          "What is the purpose of walking on a long rein during the cool-down?",
        options: [
          "To reward the horse for working hard",
          "To allow the heart rate to return to normal and flush waste products from the muscles",
          "To practise loose rein control",
          "It is not important and can be skipped if short on time",
        ],
        correctIndex: 1,
        explanation:
          "Gradually reducing work and walking supports recovery. Monitor respiration, energy and movement quality, and adjust recovery to the horse, workload and conditions.",
      },
      {
        question:
          "What should you do if the horse feels unlevel during the warm-up?",
        options: [
          "Push on — the horse will warm out of it",
          "Trot faster to loosen up the stiffness",
          "Stop and investigate — check legs and feet, and report to your instructor",
          "Switch to canter, which is easier for the horse",
        ],
        correctIndex: 2,
        explanation:
          "A change in movement quality or a horse that appears unable to cope is a reason to stop exercise and seek responsible qualified guidance rather than pushing on or attempting a diagnosis.",
      },
    ],
    aiTutorPrompts: [
      "Can you design a 15-minute warm-up routine for a flatwork session?",
      "What happens physiologically when a horse is warmed up properly?",
      "How should I adjust my warm-up routine in very cold weather?",
    ],
    linkedCompetencies: ["welfare_awareness", "rider_position"],
  },

  // ── Lesson 14 ─────────────────────────────────────────────────────────────
  {
    slug: "lesson-preparation",
    pathwaySlug: "rider-foundations",
    title: "Lesson Preparation",
    level: "intermediate",
    category: "Rider Foundations",
    sortOrder: 7,
    objectives: [
      "Plan the components of a ridden lesson or schooling session",
      "Describe the correct sequence for tacking up a horse",
      "Understand how to assess arena conditions and set up equipment",
      "Explain the importance of mental readiness and goal-setting before riding",
    ],
    content: `Preparing for a riding lesson or schooling session includes responsible pre-ride checks, a realistic plan, and a decision not to ride when horse, tack, rider, ground, or facility conditions are not safe. Saddle, bridle, bit, and noseband fit are individual matters requiring qualified assessment; do not treat this lesson as a substitute for a qualified fitter, instructor, veterinarian, or manufacturer guidance.

## Tacking Up

Tacking up requires careful handling and individual fit assessment. Follow the current qualified instruction, equipment guidance, and yard procedure for the horse rather than applying copied measurements or a universal sequence:

**Putting on the saddle:**
1. Place the numnah (saddle cloth) on the horse's back, slightly forward of where the saddle will sit, then slide it back into position so the hair lies flat underneath.
2. Place the saddle only as instructed for the individual horse and saddle. If fit, placement, balance, or comfort is uncertain, stop and obtain a qualified saddle-fitting assessment.
3. Secure the girth in accordance with the current instruction for the horse and equipment. A girth should be snug but not overtight; recheck it before mounting under the current procedure and seek help where fit is uncertain.
4. Pull the numnah up into the gullet of the saddle so it is not pressing down on the withers.
5. Check that the saddle is level and balanced when viewed from behind.

**Putting on the bridle:**
1. Stand at the horse's near side, facing the same direction as the horse.
2. Undo the headcollar and refasten it around the neck so you maintain control.
3. Fit the bridle only by the safe method you have been taught. Do not force the bit, and stop for qualified advice if the horse resists, appears distressed, or has oral-health concerns.
4. Lift the headpiece over the ears, one at a time, being gentle with each ear.
5. Fasten the throatlash, noseband and bit only in accordance with qualified tack-fitting, oral-health and manufacturer guidance for the individual horse.
6. Check for signs of restriction, discomfort, rubbing or altered behaviour and stop if the horse becomes distressed.
7. Do not rely on a copied finger-width, wrinkle or measurement rule to determine fit; obtain qualified assessment when there is any doubt.
8. Ensure the browband is not pinching the ears and the forelock is pulled free.

## Arena Assessment

Before you ride, check the arena:
- **Surface** — Consider whether the surface is level, excessively hard, deep, slippery, wet, or dusty. Adapt or cancel the session if conditions are unsuitable for the horse, activity, and qualified guidance.
- **Obstacles** — Are there poles, jumps or equipment left out that need to be moved?
- **Fencing** — Is the fence intact? Are gates secure?
- **Other users** — Who else will be riding? Adjust your plan to share space safely.

## Planning the Session

An effective lesson has three phases:
1. **Warm-up** — Gradual preparation of horse and rider (covered in the previous lesson).
2. **Main work** — The productive phase focused on a specific goal. Choose a small number of objectives appropriate to the current horse, rider, facility and qualified coach guidance rather than trying to improve everything at once. For example, focus on a coach-selected figure or a smooth trot-canter transition.
3. **Cool-down** — Gradual return to resting state.

Set goals that are **specific**, **measurable** and **achievable** within the session. “Ride better” is too vague; “practise the coach-selected figure with even bend and rhythm, then record the agreed observation” is specific and measurable.

## Mental Readiness

Riding is as much a mental skill as a physical one. Before mounting:
- Take a few moments to breathe and focus. Leave distractions behind.
- Visualise what you want to achieve in the session.
- Remind yourself of any corrections from your last lesson.
- Approach the session with a positive, patient mindset. Horses respond to the rider's emotional state — a tense, frustrated rider creates a tense, resistant horse.

## Equipment Check

Before every ride, verify:
- Riding helmet is correctly fitted, in sound condition, and suitable for the activity and applicable current safety requirements
- Boots or jodhpur boots have a suitable sole and heel for the current stirrup, riding activity and applicable safety guidance
- Gloves provide grip on the reins
- Body protector if required by the yard or activity
- Whip and spurs are only carried if appropriate for the rider's level and the horse's needs`,
    keyPoints: [
      "Use only the individual horse's qualified saddle-placement and fitting guidance; stop if fit or comfort is uncertain",
      "Bridle and bit fit require individual qualified assessment; do not use copied finger-width or wrinkle rules as a substitute",
      "Check the arena surface, fencing and any obstacles before riding",
      "Set a small number of specific, measurable goals appropriate to the current horse, rider and qualified coach guidance",
      "Plan calmly, set realistic goals, and stop rather than ride when the rider or setting is not ready",
    ],
    safetyNote:
      "Never ride in footwear without a heel, such as trainers or wellies, as your foot can slide through the stirrup. Always wear a correctly fitted, current-standard riding hat — even for a short session. Check all tack for wear and damage before every ride: stitching on stirrup leathers, girth straps and reins should be strong and intact. If any piece of tack is damaged, do not use it.",
    practicalApplication:
      "Create a personal pre-ride checklist that covers tack, equipment, arena check and session plan. Run through it every time you ride until it becomes automatic. Keep a riding diary where you record your goals, what went well and what needs work. Over time, this becomes an invaluable tool for tracking your progress and giving your instructor insight into your development.",
    commonMistakes: [
      "Rushing the tacking-up process and missing poor saddle fit or twisted straps",
      "Not pulling the numnah up into the gullet, causing withers pressure",
      "Fastening the noseband too tightly, restricting the horse's jaw and breathing",
      "Riding without a plan and drifting aimlessly around the arena",
      "Ignoring mental preparation and bringing stress or frustration into the session",
    ],
    knowledgeCheck: [
      {
        question:
          "How much space should there be between the throatlash and the horse's jaw?",
        options: [
          "Two fingers' width",
          "One finger's width",
          "A fist's width",
          "It should be snug against the jaw",
        ],
        correctIndex: 2,
        explanation:
          "The throatlash should be loose enough to fit a fist's width between the strap and the horse's jaw. This allows the horse to flex at the poll without restriction.",
      },
      {
        question:
          "Why should the saddle be slid back into position rather than forward?",
        options: [
          "Forward movement damages the saddle",
          "Sliding back ensures the hair lies flat underneath, preventing rubs",
          "The horse prefers backward movement",
          "It positions the saddle further back, which is always better",
        ],
        correctIndex: 1,
        explanation:
          "Sliding the saddle backward smooths the coat hair in its natural direction, preventing it from being ruffled and causing discomfort or saddle sores under the numnah.",
      },
      {
        question: "What makes a good session goal?",
        options: [
          "Ride better than last time",
          "Have fun",
          "Ride three accurate 20-metre circles on each rein at trot",
          "Try everything you can think of",
        ],
        correctIndex: 2,
        explanation:
          "Effective goals are specific and measurable. 'Ride three accurate 20-metre circles on each rein at trot' tells you exactly what to do and how to know if you've achieved it.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through the correct procedure for putting on a bridle?",
      "How do I check that a saddle is fitted correctly before riding?",
      "Help me plan a structured 45-minute schooling session with warm-up, main work and cool-down.",
    ],
    linkedCompetencies: ["yard_safety_awareness", "welfare_awareness"],
  },

  {
    slug: "advanced-rider-position-analysis",
    pathwaySlug: "rider-foundations",
    title: "Advanced Rider Position Analysis",
    level: "advanced",
    category: "Rider Foundations",
    sortOrder: 8,
    objectives: [
      "Use qualified coaching observation to reflect on rider position and comfort",
      "Recognise when a position concern needs qualified coaching or health-professional input",
      "Work toward an individual, coach-approved balanced seat at suitable paces",
      "Understand that any no-stirrup exercise requires individual coach approval and safety controls",
    ],
    content: `Rider position is individual to the rider, horse, saddle, activity, pace, experience, health, comfort, and current coaching plan. This lesson offers a vocabulary for reflection; it does not diagnose a rider or horse, prescribe exercise, prove the cause of a movement concern, or replace a qualified coach, medical professional, physiotherapist, saddle fitter, or veterinarian. Any mounted exercise must be approved for the individual partnership and current conditions by the responsible qualified person.

## Biomechanics of the Rider

Rider and horse movement are dynamic and vary between individual partnerships, paces, footing, tack, fatigue, training, and the task. A qualified coach can observe whether a rider appears balanced, comfortable, and able to respond safely without excessive tension. Learners should not use a generic description to diagnose a horse’s back movement, a rider’s body, saddle fit, or the cause of a performance issue.

A coach may use neutral terms such as **pelvis**, **upper body**, **shoulders**, **hands**, **legs**, **feet**, and **stirrups** when describing what they observe. The coach should adapt any position cue to the individual rider, horse, saddle, task, and discipline. Avoid treating a cue, posture, or apparent asymmetry as a medical finding, a guarantee of horse comfort, or a universal correction.

University of Missouri Extension advises riders to use tack that fits both horse and rider, footwear and stirrups that fit safely, and—when appropriate for the riding context—place the ball of the foot over the stirrup tread with the heel lower than the toe. It also recognises rider and discipline variation. A qualified coach should decide whether any additional position cue is suitable.

## Asymmetry Correction

A rider or coach may notice that the two sides of a rider’s position do not look or feel identical. Observation alone cannot establish the cause, whether it affects the horse, or what intervention is appropriate. A qualified coach should assess the riding context; persistent pain, limitation, or a health concern requires an appropriately qualified health professional.

**Observing with qualified help:**
- A qualified coach may use live observation or, where appropriate and consented to, video to discuss a position cue in the actual riding context.
- Treat a difference between reins, paces, or days as information to discuss—not proof of its cause or a reason to blame the rider or horse.
- Seek an appropriately qualified health professional for pain, injury, persistent limitation, or questions outside coaching scope.

**Responding safely:**
- Follow the individual coach-approved plan; do not self-prescribe a fitness, rehabilitation, or mounted correction programme from a lesson.
- Stop an exercise that causes pain, loss of balance, horse discomfort, or an unsafe change in conditions, and obtain qualified advice.
- Review tack, horse, rider, and environment with the relevant qualified professional rather than assuming a single cause.

## The Effective Seat at All Paces

A coach may describe an effective seat as balanced, comfortable, responsive, and suitable for the individual partnership’s current task. The coach decides which pace, exercise, cue, and duration are appropriate. Do not treat a generic description of walk, trot, or canter as a universal prescription; stop and seek coaching if the rider feels unsafe or the horse appears uncomfortable or difficult to control.

## Any No-Stirrup Exercise Requires Individual Approval

Riding without stirrups is not a universal diagnostic tool, progression test, fitness intervention, or indicator that a rider’s position is “sound.” It may be an appropriate coach-supervised exercise for some horse-and-rider partnerships in a suitable setting, but it can increase risk or discomfort for others.

Before any no-stirrup exercise, the qualified coach and responsible person must consider the rider, horse, tack, setting, pace, supervision, current conditions, and emergency arrangements. The coach decides whether the exercise is suitable, how it is set up, whether stirrups are moved or retained, and when it stops. Do not use a fixed duration, progress alone to a faster pace, or continue if balance, comfort, horse behaviour, tack, or conditions are unsuitable.`,
    keyPoints: [
      "Position cues must be adapted by a qualified coach to the individual rider, horse, saddle, activity, and current conditions",
      "A position concern is not a diagnosis; persistent pain, limitation, or comfort concern needs the appropriate qualified professional",
      "Observation can inform a coach-led discussion but does not establish the cause of an apparent asymmetry or its effect on the horse",
      "The coach determines which pace and exercise are appropriate; stop if the rider feels unsafe or the horse appears uncomfortable or difficult to control",
      "No-stirrup work is not a universal test and requires coach approval, a suitable partnership, and current safety controls",
    ],
    safetyNote:
      "Do not start or progress any no-stirrup exercise without coach approval and the responsible person’s current safety arrangements. Stop if balance, rider comfort, horse behaviour, tack, footing, weather, supervision, or emergency arrangements become unsuitable; obtain qualified advice before resuming.",
    practicalApplication:
      "Ask a qualified coach which current position and safety observations are appropriate for your horse-and-rider partnership. With consent, the coach may use observation or video as part of an individual coaching discussion. Do not prescribe a no-stirrup, fitness, rehabilitation, or position-correction programme from this lesson; discuss pain, persistent limitation, tack, or horse-comfort concerns with the appropriate qualified professional.",
    commonMistakes: [
      "Assuming a position cue proves a rider’s strength, injury status, horse comfort, saddle fit, or cause of a performance concern",
      "Continuing a mounted exercise despite pain, loss of balance, horse discomfort, unsafe conditions, or a qualified instruction to stop",
      "Blaming either rider or horse without a qualified assessment of the individual partnership and current context",
    ],
    knowledgeCheck: [
      {
        question: "What is the role of the pelvis in the rider's position?",
        options: [
          "It is not important — balance comes primarily from the legs",
          "It is the foundation of the seat, and its position affects the entire kinetic chain",
          "It should be locked rigidly in place to prevent movement",
          "It only matters at canter, not at walk or trot",
        ],
        correctIndex: 1,
        explanation:
          "The pelvis is the foundation of the rider's seat. Its alignment — whether level, tilted forward, or tilted back — affects the rider's back, core, legs, and ultimately how the horse moves.",
      },
      {
        question: "How can a rider identify their own asymmetries?",
        options: [
          "Asymmetries cannot be identified without expensive laboratory equipment",
          "By always riding on the same rein and noting how the horse feels",
          "Through video analysis from behind, comparing left and right, and consulting a physiotherapist",
          "By riding faster to see which direction the horse drifts",
        ],
        correctIndex: 2,
        explanation:
          "Video analysis from behind at all paces is one of the most effective ways to identify rider asymmetry. Consulting a physiotherapist who understands equestrian biomechanics provides professional assessment of muscular imbalances.",
      },
      {
        question: "Why is riding without stirrups a useful assessment tool?",
        options: [
          "It makes the session more exciting for the horse",
          "It reveals grip patterns, tension, and reliance on the stirrup that are hidden during normal riding",
          "It is only useful for beginners who need to learn balance",
          "It strengthens the arms and improves rein control",
        ],
        correctIndex: 1,
        explanation:
          "Without stirrups, any reliance on gripping or the stirrup for balance becomes immediately apparent. This reveals the true quality of the rider's seat, core stability, and ability to follow the horse's movement.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain how a rider's pelvic tilt affects the horse's way of going?",
      "What off-horse exercises can help correct a tendency to collapse the right hip?",
      "How should I structure a progressive no-stirrup training programme over six weeks?",
    ],
    linkedCompetencies: ["rider_position", "schooling_exercises"],
  },

  {
    slug: "teaching-the-foundations",
    pathwaySlug: "rider-foundations",
    title: "Teaching the Foundations",
    level: "advanced",
    category: "Rider Foundations",
    sortOrder: 9,
    objectives: [
      "Break down fundamental riding skills into clear, teachable components",
      "Identify common beginner rider faults and understand their root causes",
      "Apply effective correction strategies for foundational position and aid problems",
      "Structure a progressive beginner lesson plan using sound pedagogical principles",
    ],
    content: `Being an accomplished rider is not the same as being able to teach riding. Teaching the foundations requires you to break down skills you perform instinctively into their component parts, understand why beginners make the mistakes they do, and communicate corrections in a way that is clear, encouraging, and effective. This lesson bridges the gap between advanced riding ability and the capacity to pass that knowledge on to others.

## Breaking Down the Basics

When you learned to ride, you went through a process of acquiring skills that have since become automatic. Rising trot, applying a leg aid, and maintaining your position are things you now do without conscious thought. To teach these skills, you must reverse-engineer them.

**The process of skill decomposition:**
1. **Identify the skill** — For example, "performing a balanced halt from walk."
2. **List the component actions** — Sit tall, close the fingers on the reins, apply a gentle squeeze with both legs to keep the horse straight, soften the hand the moment the horse halts, praise the horse.
3. **Sequence the actions** — What comes first? What happens simultaneously?
4. **Identify the feel** — What should the rider feel when it is done correctly? "You should feel the horse step underneath you and stop squarely. Your weight should be evenly distributed through both seat bones."
5. **Prepare for common errors** — What will beginners typically get wrong? Too much hand, not enough leg, leaning forward, looking down.

This process applies to every foundational skill: mounting, dismounting, steering, transitions, rising trot, and the basic position itself. Write out decompositions for each and practise explaining them in simple language.

## Common Rider Faults and Their Root Causes

Understanding *why* a fault occurs is far more useful than simply identifying *what* is wrong. Here are the most common beginner faults and their typical root causes:

**Looking down:** Beginners look down because they are anxious and want to see the horse. The root cause is usually a lack of confidence. The correction is to build confidence gradually — once the rider trusts the horse, they naturally look up. In the meantime, give them focal points: "Look at the letter C" or "Look between the horse's ears and out to the fence."

**Gripping with the knees:** This is almost always a balance issue. The rider feels insecure and clamps on with the strongest part of their leg. Paradoxically, this makes them *less* secure by lifting them out of the saddle. The correction is to address balance — exercises without stirrups, holding the pommel, and riding on the lunge all help. Telling the rider to "relax your knee" without addressing the underlying balance problem rarely works.

**Round shoulders and collapsed core:** Beginners often slouch because they are tense, tired, or trying to absorb the movement by rounding their back. The correction involves building core strength and giving imagery: "Imagine a string attached to the crown of your head pulling you towards the sky" or "Pretend you have a headlight on your chest — shine it straight ahead."

**Hands too high, too wide, or too busy:** This usually stems from using the hands for balance rather than communication. The correction is to develop an independent seat so the hands are freed from a balance role. Exercises such as riding with one hand on the thigh or carrying a whip horizontally between both hands can help stabilise the arm position.

**Stiff, non-following elbows:** If the elbows are locked, the contact becomes rigid and the horse cannot move freely. This is often caused by tension in the shoulders. Encourage the rider to let their arms feel heavy and think of their elbows as hinges that open and close with the horse's head movement.

## Correction Strategies

Effective correction requires timing, tact, and variety. Not every rider responds to the same approach, so you need a toolkit of strategies:

- **Imagery and analogy** — "Imagine your legs are made of lead" is more effective for many riders than "Push your heels down." Imagery bypasses conscious overthinking and speaks directly to the body.
- **Exaggeration exercises** — Ask the rider to exaggerate the correct position. If they tend to lean forward, ask them to lean so far back they feel they might fall off (within safe limits). This recalibrates their sense of "centre."
- **Progressive exercises** — Build the skill in stages. Do not ask a beginner to rise to the trot on the open track until they can do it on the lunge with a neck strap for security.
- **Positive framing** — Instead of "Stop gripping with your knees," say "Think about letting your legs hang long and heavy." The brain responds better to positive instructions than negative ones.
- **Repetition with variation** — Repeat the same skill but in different contexts — on a circle, on a straight line, with poles, on a different rein. This builds the skill without tedious repetition of the identical exercise.

## Structuring a Lesson Plan

A well-structured beginner lesson plan follows a logical progression:

1. **Introduction (2–3 minutes)** — Greet the rider, ask how they are feeling, recap the previous session, and state today's objective.
2. **Warm-up (8–10 minutes)** — Mounted exercises at halt and walk to loosen up, followed by walk work on both reins.
3. **Main work (15–20 minutes)** — Two or three exercises that build towards the session objective. Use progressive difficulty.
4. **Cool-down (5 minutes)** — Walk on a long rein, praise the horse, recap the session with the rider.
5. **Review (2 minutes)** — What went well? What will we work on next time?

Always have a **Plan B**. If the planned exercise is too difficult, have a simpler version ready. If the rider achieves the objective quickly, have a progression prepared. Flexibility within a clear structure is the hallmark of good teaching.`,
    keyPoints: [
      "Decompose automatic riding skills into their component parts before attempting to teach them",
      "Understand the root cause of each beginner fault — addressing the cause is more effective than correcting the symptom",
      "Use a variety of correction strategies: imagery, exaggeration, progressive exercises, and positive framing",
      "Structure every lesson with a clear warm-up, main work, and cool-down, with Plan B alternatives ready",
      "Effective teaching requires patience, empathy, and the ability to communicate complex movements in simple language",
    ],
    safetyNote:
      "When teaching beginners, always use a calm, reliable horse and work in an enclosed arena. Have a helper on the ground if needed, especially for first-time riders. Never ask a beginner to attempt an exercise without first demonstrating or explaining it clearly. Keep sessions short enough that the rider does not become fatigued, as tiredness leads to poor position and increased risk of falls.",
    practicalApplication:
      "Choose one foundational skill — such as rising trot — and write a full decomposition: list every component action, the correct sequence, the desired feel, and the three most common errors with their root causes. Then write a 30-minute lesson plan centred on teaching this skill to a complete beginner, including warm-up, two progressive exercises, and a cool-down. Practise delivering the lesson to a friend or colleague before using it with a real beginner.",
    commonMistakes: [
      "Assuming that because you can ride a skill well, you can automatically explain it clearly to someone else",
      "Correcting the symptom of a fault (e.g., 'Relax your knee') without addressing the root cause (e.g., poor balance)",
      "Overloading the beginner with too many corrections in one session instead of focusing on one key improvement area",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the first step in teaching a foundational riding skill?",
        options: [
          "Tell the rider to copy what you do",
          "Decompose the skill into its component actions and sequence them logically",
          "Ask the rider to read a textbook about it",
          "Let the rider figure it out through trial and error",
        ],
        correctIndex: 1,
        explanation:
          "Skill decomposition — breaking a complex movement into its individual parts, sequencing them, and identifying the desired feel — is essential before you can teach it clearly to someone else.",
      },
      {
        question:
          "What is the most common root cause of a beginner rider gripping with their knees?",
        options: [
          "They are deliberately trying to grip",
          "Their stirrups are too long",
          "They feel unbalanced and are using the knee for security",
          "They are too relaxed in the saddle",
        ],
        correctIndex: 2,
        explanation:
          "Knee gripping is almost always a balance issue. The rider instinctively clamps on with the strongest part of their leg because they feel insecure. Addressing the underlying balance problem is more effective than simply telling them to relax their knee.",
      },
      {
        question:
          "Why is imagery often more effective than direct instruction for correcting rider position?",
        options: [
          "Riders prefer creative language to technical terms",
          "Imagery bypasses conscious overthinking and speaks directly to the body's movement patterns",
          "Direct instruction is always too complicated for riders to understand",
          "Imagery is only useful for children, not adult riders",
        ],
        correctIndex: 1,
        explanation:
          "Imagery and analogy bypass the conscious, analytical mind and create a physical response. 'Imagine your legs are made of lead' often produces a better result than 'Push your weight down into your heels' because it evokes a whole-body sensation rather than a mechanical action.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me decompose the skill of a walk-to-trot transition into teachable components?",
      "What are the best imagery cues for helping a beginner rider develop a deeper seat?",
      "How should I structure a progressive series of lessons for a complete beginner over six weeks?",
    ],
    linkedCompetencies: ["rider_position", "coaching_fundamentals"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 3 — Stable & Yard Safety
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Lesson 15 ─────────────────────────────────────────────────────────────
  {
    slug: "safe-approach-handling",
    pathwaySlug: "stable-yard-safety",
    title: "Safe Approach & Handling",
    level: "beginner",
    category: "Stable & Yard Safety",
    sortOrder: 1,
    objectives: [
      "Describe how to approach a horse safely in the stable and field",
      "Explain the importance of voice, body language and personal space",
      "Demonstrate safe positioning when working around a horse",
      "Understand why horses may react defensively and how to prevent it",
    ],
    content: `Horses are large, powerful flight animals and can react with great speed when startled. The majority of accidents around horses happen on the ground, not while riding. Learning to approach, handle and work around horses safely is therefore one of the most important skills in equestrianism. This lesson covers the principles of safe approach and handling.

## Understanding the Horse's Perspective

Horses are **prey animals** with a highly developed flight response. Their survival instincts tell them to flee first and investigate later. Key points:

- **Vision** — Horses have side vision but may not see a person directly in front of the forehead or directly behind the tail. Do not surprise a horse from an area where it may not see you; use voice, safe visibility and a competent person’s handling procedure.
- **Hearing** — Horses have excellent hearing and are sensitive to sudden or loud noises. Always speak to a horse before approaching so it knows you are there.
- **Sensitivity** — Horses can feel a fly landing on their skin. They are extremely responsive to touch, which means rough or sudden handling can provoke a defensive reaction (kicking, biting, barging).

## How to Approach Safely

1. **Speak first** — Call the horse's name or speak in a calm, low voice as you approach. This alerts the horse to your presence.
2. **Approach the shoulder** — Move calmly toward the shoulder on a visible diagonal, without stepping into the horse’s direct front or directly behind it. A competent instructor should show the learner the position appropriate to that horse and setting.
3. **Extend your hand** — Allow the horse to see and smell your hand. Let the horse come to you rather than grabbing at it.
4. **Move calmly** — No sudden movements, no running, no shouting. Fast or erratic behaviour triggers the flight response.
5. **Read the horse** — Before touching, observe the horse's body language. Ears forward usually indicates curiosity or friendliness. Ears flat back indicates aggression or irritation. A raised head, wide eyes and flared nostrils indicate fear or alarm.

## Safe Positioning

When working around a horse on the ground:

- **Stand to the side**, never directly in front or behind.
- Avoid moving directly behind the hindquarters. If it is necessary to change sides, follow the yard’s taught route with the horse under suitable control, maintain awareness of its body language and preserve an escape route. Ask for help rather than attempting this alone with an unfamiliar, unsettled or reactive horse.
- When working on the near side, position your feet so you can step away quickly.
- **Never kneel or sit beside a horse** — always bend from the waist so you can move away quickly.
- **Never wrap lead ropes, lunge lines or reins around your hand or body** — if the horse pulls away, you will be dragged.
- Never stand on a lead rope or rein.

## Working in the Stable

When entering a stable:
1. Speak to the horse before opening the door.
2. Open the top door first to check the horse's position and demeanour.
3. Ask the horse to move over if it is blocking the door — use your voice and a gentle push on the shoulder.
4. Enter calmly, close the door behind you and put the headcollar on before doing anything else.

When mucking out, feeding or grooming in the stable:
- Always tie the horse up with a quick-release knot, or remove the horse from the stable.
- Keep tools (pitchfork, wheelbarrow) where the horse cannot step on them.
- Do not crouch down in a confined space with a loose horse.

## Approaching in the Field

Approaching a horse in the field requires patience:
1. Walk into the field calmly. Do not chase the horse.
2. Approach the shoulder, speaking as you go.
3. If the horse walks away, do not run after it. Stand still and let it come to you, or use a treat or feed bucket (only if the horse is alone — in a group, a feed bucket can cause aggressive competition).
4. Put the headcollar on before leading the horse to the gate.
5. Always close and secure the field gate behind you.

## Communication and Confidence

Horses are extremely perceptive of human body language and emotional state. A nervous handler creates a nervous horse. Develop calm confidence through practice and knowledge. If you are unsure about handling a particular horse, ask for help — there is no shame in admitting uncertainty, and it is far safer than pretending confidence you do not have.`,
    keyPoints: [
      "Always speak to a horse before approaching — never surprise it",
      "Approach calmly toward the visible shoulder area using the supervised position taught for that horse and setting",
      "Never stand directly behind a horse or in its forehead blind spot",
      "Never wrap ropes, reins or lines around your hand — you risk being dragged",
      "Avoid moving directly behind the hindquarters; use the yard’s taught route, preserve an escape path and ask for help with an unfamiliar or unsettled horse",
      "Horses read human body language — calm, confident handling produces calm, confident horses",
    ],
    safetyNote:
      "Most handling accidents happen because the person was in the wrong position. Always maintain an escape route — never position yourself between a horse and a wall with no way to step aside. If a horse becomes aggressive (ears flat, teeth bared, threatening to kick), do not punish it — move away calmly, reassess the situation and ask for help. Never shout at, hit or startle a nervous horse.",
    practicalApplication:
      "Practise approaching and handling horses under the supervision of your instructor. Begin with calm, experienced horses and progress to those with more challenging behaviours as your confidence grows. Pay attention to the horse's body language at all times — ears, eyes, tail, muscle tension — and adjust your approach accordingly. Develop a habit of speaking to every horse before touching it, every single time.",
    commonMistakes: [
      "Approaching a horse directly from the front or behind, where it cannot see you",
      "Moving too quickly or making sudden movements around the horse",
      "Wrapping the lead rope around the hand for a 'better grip', risking being dragged",
      "Ignoring the horse's warning signs (pinned ears, swishing tail, raised hind leg)",
      "Crouching or kneeling beside a horse, reducing your ability to move away quickly",
    ],
    knowledgeCheck: [
      {
        question: "Where are a horse's main blind spots?",
        options: [
          "To the left and right sides",
          "Directly in front of the forehead and directly behind the tail",
          "Above the head and below the belly",
          "Horses have no blind spots",
        ],
        correctIndex: 1,
        explanation:
          "A horse may not see a person directly in front of its forehead or directly behind its tail. Approaching from these areas can startle the horse, so use voice, safe visibility and the handling route taught by a competent person.",
      },
      {
        question: "Why should you never wrap a lead rope around your hand?",
        options: [
          "It damages the rope",
          "It looks untidy",
          "If the horse pulls away, you cannot release the rope and may be dragged",
          "It confuses the horse",
        ],
        correctIndex: 2,
        explanation:
          "If a rope is wrapped around your hand and the horse bolts, you cannot release it. Being dragged by a panicking horse is one of the most dangerous handling situations.",
      },
      {
        question: "What is the safest way to move past a horse's hindquarters?",
        options: [
          "Run past quickly",
          "Walk directly behind while looking at the ground",
          "Avoid the hindquarters, follow the supervised route taught at the yard and ask for help if the horse is unfamiliar or unsettled",
          "Crawl underneath the horse",
        ],
        correctIndex: 2,
        explanation:
          "Directly behind the hindquarters is a higher-risk area. Use the yard’s supervised handling procedure, observe the horse and preserve an escape route rather than relying on a universal distance rule.",
      },
    ],
    aiTutorPrompts: [
      "What body language signs tell me a horse is feeling aggressive or scared?",
      "How should I approach a horse in the field that does not want to be caught?",
      "Can you explain why horses react the way they do when startled?",
    ],
    linkedCompetencies: ["horse_behaviour_awareness", "yard_safety_awareness"],
  },

  // ── Lesson 16 ─────────────────────────────────────────────────────────────
  {
    slug: "leading-safely",
    pathwaySlug: "stable-yard-safety",
    title: "Leading Safely",
    level: "beginner",
    category: "Stable & Yard Safety",
    sortOrder: 2,
    objectives: [
      "Demonstrate the correct way to hold a lead rope when leading",
      "Describe safe leading practices through doorways, gates and on public roads",
      "Explain how to turn a horse safely when leading",
      "Understand the risks associated with poor leading technique",
    ],
    content: `Leading requires deliberate handling, suitable equipment, an appropriate setting, and supervision or qualified help when the horse, handler, or situation is unfamiliar. Do not try to out-pull a horse; use a safe position, a lead rope handled without wrapping, and a plan to step away if safety is compromised.

## Basic Leading Position

When leading a horse:
1. **Walk beside the horse**, level with its shoulder on the near (left) side. Do not walk in front of the horse (you cannot see it and it may walk over you) or behind it (you have no control and risk being kicked).
2. **Hold the lead rope** correctly: keep a safe, manageable amount of rope between your hand and the headcollar clip, as demonstrated by a competent person for the individual horse and setting. Hold excess rope folded—never coiled around the hand—and keep the loose end clear of the ground.
3. **Walk purposefully** at the horse's pace. Look ahead to where you are going, not back at the horse. Your body language and direction of travel guide the horse.
4. **Maintain a safe working space** that permits control without standing directly in front of or behind the horse. The suitable distance varies with the horse, lead, environment, and competent instruction.

## Turning

When turning a horse while leading:
- Always push the horse's head **away from you** when turning, so the horse turns around you rather than walking over you.
- If you are on the near side and want to turn right, push the horse's head to the right and step slightly back so it walks around you.
- Never pull the horse toward you, as this brings its body (and feet) directly into your space.

## Leading Through Doorways and Gateways

This is one of the most hazardous activities on the yard:
1. **Check the route and opening first.** Use a gate or doorway only when it is wide enough, the footing is suitable, and the handler has a clear route away from the horse.
2. **Use the safe doorway method taught for the individual horse and facility.** Missouri and Mississippi Extension guidance both emphasise avoiding crowding, maintaining control, and moving clear of the horse’s path.
3. **Close or secure the gate when it is safe to do so.** Do not place yourself in a pinch point or try to manage a rushing horse alone.

## Leading on Roads and Public Areas

Leading a horse on a road creates additional risk. Follow the current law and official road-safety guidance for the jurisdiction, use appropriate visibility and protective equipment, and do not proceed unless the responsible qualified person has assessed the route, horse, handler, traffic conditions, and supervision.

## Leading Difficult Horses

Some horses are reluctant to lead (they plant their feet and refuse to move) or are too enthusiastic (they jog, push forward or try to overtake the handler). Strategies include:
- Do not pull against a reluctant horse or attempt to overpower a forward horse.
- Do not introduce chain leads, bridles, whips, or other control equipment without qualified instruction for the individual horse.
- If the horse becomes dangerous, prioritise the handler’s safe exit. Do not risk being dragged; alert the responsible person and obtain qualified help before trying again.

## Leading to and from the Field

Leading to and from turnout is one of the highest-risk times on the yard:
- The horse may be excited to go out or reluctant to leave its companions.
- Always use a headcollar and lead rope — never lead by the mane or forelock.
- Lead completely through the gate, turn the horse back toward the entry direction, use the facility’s safe gate-closing procedure, then release only when the handler has an escape route.
- Step clear after release. If the horse is excited, unfamiliar, or likely to rush, do not manage the turnout alone; obtain qualified help.
- When catching, approach calmly, put the headcollar on, and lead the horse sensibly to the gate.`,
    keyPoints: [
      "Walk level with the horse's shoulder — never in front or behind",
      "Keep a lead rope at a safe manageable length with excess folded rather than wrapped around the hand, wrist, or body",
      "Push the horse's head away from you when turning — never pull it toward you",
      "Use a route and opening that are suitable for the horse, footing, and handler’s safe escape path",
      "Lead through the gate, turn the horse back toward the entry direction, and release only with a clear safe exit",
    ],
    safetyNote:
      "Do not wrap lead equipment around the body. If a horse becomes unsafe to handle, prioritise a safe exit rather than risking being dragged, alert the responsible person, and obtain qualified help. Wear suitable closed, protective footwear for the current handling task.",
    practicalApplication:
      "Practise leading on both sides of the horse (near and off side) so you are confident on either side when needed. Lead through gateways and doorways regularly, focusing on opening the door or gate wide and walking through calmly alongside the horse. If you are leading a horse that is new to you, ask about its behaviour when being led — does it rush? Is it nervous in certain areas? Knowledge prevents accidents.",
    commonMistakes: [
      "Walking in front of the horse and pulling it, losing control and visibility",
      "Coiling the lead rope around the hand for a 'better grip'",
      "Leading through half-open doorways where the horse or handler can be crushed",
      "Releasing the horse in the field facing away from the gate, risking being kicked as it runs off",
      "Trying to out-muscle a pulling horse instead of using technique and repositioning",
    ],
    knowledgeCheck: [
      {
        question: "Where should you walk when leading a horse?",
        options: [
          "In front of the horse",
          "Behind the horse",
          "Level with the horse's shoulder",
          "It does not matter",
        ],
        correctIndex: 2,
        explanation:
          "Walking level with the horse's shoulder gives you the best control and visibility. You can see where you are going and the horse can see you.",
      },
      {
        question:
          "When turning a horse while leading, which direction should the horse's head go?",
        options: [
          "Toward you",
          "Away from you",
          "Downward",
          "It does not matter",
        ],
        correctIndex: 1,
        explanation:
          "The horse's head should be pushed away from you so the horse walks around you, keeping its body and feet out of your personal space.",
      },
      {
        question:
          "What should you do if a horse bolts while you are leading it?",
        options: [
          "Hold on as tightly as possible",
          "Let go of the lead rope immediately",
          "Wrap the rope around your wrist for grip",
          "Run alongside the horse",
        ],
        correctIndex: 1,
        explanation:
          "Let go immediately. Being dragged by a bolting horse causes serious injuries. A loose horse can be recaptured; your safety comes first.",
      },
    ],
    aiTutorPrompts: [
      "Can you describe the correct leading position and rope handling in detail?",
      "What techniques can I use to lead a horse that tries to rush ahead?",
      "How should I safely lead a horse through a narrow gateway?",
    ],
    linkedCompetencies: ["leading_safely"],
  },

  // ── Lesson 17 ─────────────────────────────────────────────────────────────
  {
    slug: "tying-up-correctly",
    pathwaySlug: "stable-yard-safety",
    title: "Tying Up Correctly",
    level: "beginner",
    category: "Stable & Yard Safety",
    sortOrder: 3,
    objectives: [
      "Tie a quick-release knot confidently and correctly",
      "Explain why the type of knot matters for horse safety",
      "Describe the correct height, position and attachment for tying a horse",
      "Identify unsafe tying practices and explain the risks",
    ],
    content: `Tying a horse safely is a fundamental yard skill. Horses are tied up for grooming, tacking up, veterinary treatment, farrier visits and many other tasks. An incorrectly tied horse can injure itself or others. The key principles are: use the correct knot, tie to a fixed point at the right height, and never leave a tied horse unsupervised for extended periods.

## The Quick-Release Knot

The **quick-release knot** (also called a "slip knot" or "safety knot") is the only knot you should use to tie a horse. Its defining feature is that it can be untied instantly with a single pull on the free end of the rope, even when the horse is pulling against it. In an emergency — such as a horse that has fallen, become tangled, or panicked — you must be able to release the horse in seconds.

**How to tie a quick-release knot:**
1. Pass the rope through the tie ring from right to left (or left to right — either way works).
2. Form a loop (bight) in the free end of the rope.
3. Pass this loop under and around the taut section of the rope (the part attached to the headcollar).
4. Pull the loop through to form the knot, leaving a long free end hanging down.
5. To release: pull the free end sharply. The knot unravels immediately.
6. To secure against a horse that has learned to untie itself, pass the free end of the rope through the loop (this takes slightly longer to release but is still quicker than a hard knot).

**Never use a hard knot** (such as a reef knot or double knot) to tie a horse. If the horse panics and pulls back with its full weight, a hard knot tightens and becomes impossible to undo quickly. This can lead to the horse injuring its neck, breaking the headcollar, breaking the tie ring, or being trapped in a dangerous position.

## Where and How to Tie

- **Tie to a fixed, solid tie ring** that is bolted to a wall or post. The ring should be at approximately the horse's **eye height or above** — never below chest height, as a low tie point increases the risk of the horse getting a leg over the rope.
- **Use a loop of baler twine** tied to the ring, and tie the lead rope to the twine. The baler twine acts as a breakaway — if the horse panics and pulls back with its full weight, the twine breaks before the horse injures itself. This is much safer than tying directly to a solid metal ring, which will not give at all.
- **Set the rope length with a competent person** so the individual horse can stand naturally but cannot step over, become entangled in or pull against excess rope. Attachment height, rope length, horse size, equipment and setting all affect the safe setup; check it continuously rather than copying a single measurement.
- **Never tie to a moveable object** — a gate, a jump wing, a wheelbarrow, or a loose rail. If the horse pulls back, the object will follow, terrifying the horse further and causing chaos.
- **Never tie to a bridle.** Tie only to a headcollar and lead rope. A bridle is not designed to withstand the force of a pulling horse and the bit can injure the horse's mouth.

## Multiple Horses

When tying multiple horses:
- Leave at least one horse's length between each horse to prevent them from kicking or biting each other.
- Ensure each horse can be released independently.
- Be aware of herd dynamics — do not tie horses that are known to be aggressive toward each other in close proximity.

## Supervision

A tied horse should be supervised or checked regularly. Horses can become tangled, slip, or panic if left alone for too long. If you must step away, ensure another person is nearby and aware of the tied horse.

## Cross-Tying

In some yards, horses are cross-tied using two ropes attached to opposite walls. This prevents the horse from turning around. Cross-ties should:
- Have quick-release clips or breakaway mechanisms on both sides
- Be positioned at eye height
- Only be used with calm, experienced horses
- Never be used as the only restraint for a nervous or young horse`,
    keyPoints: [
      "Always use a quick-release knot — it can be undone instantly with one pull in an emergency",
      "Tie to a fixed, solid tie ring at eye height or above, using baler twine as a breakaway",
      "Never tie below chest height, or to moveable objects, gates, bridles or loose fittings",
      "Keep the rope short enough to prevent the horse getting a leg over, but long enough for natural head height",
      "Never use a hard knot — it becomes impossible to undo if the horse pulls against it",
    ],
    safetyNote:
      "If a horse panics while tied, do not stand directly in front of it. Approach from the side, speak calmly and release the quick-release knot as quickly as possible. If the baler twine breaks and the horse is loose, stay calm and out of the way — a panicking horse can strike out in any direction. Never try to grab a panicking horse by the rope. Wait until the horse calms, then approach quietly to regain control.",
    practicalApplication:
      "Practise tying a quick-release knot on a fence post or ring before tying a real horse. You should be able to tie it confidently in a few seconds. Check every tie ring on the yard regularly to ensure they are firmly attached. Always carry a penknife on the yard in case you need to cut a rope in an emergency — but this should be a last resort, as the quick-release knot and baler twine should give way first.",
    commonMistakes: [
      "Using a hard knot instead of a quick-release knot",
      "Tying directly to a metal ring without baler twine as a breakaway",
      "Tying too long, allowing the horse to get a foot over the rope",
      "Tying to a moveable object such as a gate, jump wing or wheelbarrow",
      "Leaving a tied horse unsupervised for long periods",
    ],
    knowledgeCheck: [
      {
        question: "Why is a quick-release knot essential when tying a horse?",
        options: [
          "It looks neater",
          "It is stronger than other knots",
          "It can be undone instantly in an emergency, even under tension",
          "Horses cannot untie it themselves",
        ],
        correctIndex: 2,
        explanation:
          "A quick-release knot can be undone with a single pull on the free end, even when the horse is pulling against it. This is vital in emergencies where the horse must be released immediately.",
      },
      {
        question: "What is the purpose of using baler twine at the tie ring?",
        options: [
          "It looks more professional",
          "It acts as a breakaway — if the horse pulls hard enough, the twine breaks before the horse is injured",
          "It makes the knot easier to tie",
          "It prevents the rope from wearing out",
        ],
        correctIndex: 1,
        explanation:
          "Baler twine is a deliberate weak point. If the horse panics and pulls back with full force, the twine snaps before the horse injures its neck or breaks the headcollar.",
      },
      {
        question: "At what height should a tie ring be positioned?",
        options: [
          "At ground level",
          "At the horse's knee height",
          "At the horse's eye height or above",
          "Above the horse's ears",
        ],
        correctIndex: 2,
        explanation:
          "The tie ring should be at approximately eye height or above. A low tie point increases the risk of the horse getting a leg over the rope, which can cause panic and injury.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through tying a quick-release knot step by step?",
      "What should I do if a horse panics and pulls back while tied?",
      "Why is tying to a moveable object so dangerous?",
    ],
    linkedCompetencies: ["tying_up_safely"],
  },

  // ── Lesson 18 ─────────────────────────────────────────────────────────────
  {
    slug: "yard-hazard-awareness",
    pathwaySlug: "stable-yard-safety",
    title: "Yard Hazard Awareness",
    level: "developing",
    category: "Stable & Yard Safety",
    sortOrder: 4,
    objectives: [
      "Identify common hazards found on an equestrian yard",
      "Explain fire safety procedures and prevention measures",
      "Describe safe storage and handling of chemicals and equipment",
      "Understand the importance of a tidy, well-maintained yard for accident prevention",
    ],
    content: `An equestrian yard is a working environment with many potential hazards. Horses, heavy equipment, vehicles, chemicals, electrical systems and variable weather all create risks. Awareness of hazards, local procedures, and appropriate escalation can reduce risk for everyone who works on or visits a yard. Housekeeping, maintenance, supervision, and current site-specific procedures should be reviewed by the responsible person.

## Common Yard Hazards

### Slips, Trips and Falls
Common yard hazards can include:
- Wet concrete or cobblestones, especially in winter
- Loose bedding, straw or muck on walkways
- Hose pipes left across paths
- Uneven surfaces, potholes or damaged drain covers
- Icy, muddy, or otherwise unsafe conditions — use the responsible yard’s current access-control and surface-safety procedure

### Equipment Hazards
- **Pitchforks** left prongs-up or propped against walls
- **Wheelbarrows** blocking doorways or paths
- **Ladders** not secured or stored properly
- **Machinery** (tractors, ATVs) used without the required training, suitable controls, or separation from people and horses
- **Riding equipment** left on the ground (whips, poles, jump cups)

### Animal-Related Hazards
- Loose horses in the yard
- Kicking, biting or barging — especially when horses are fed or when unfamiliar horses are in close proximity
- Dogs on the yard that may chase or startle horses

## Fire Safety

Fire can spread rapidly in stables because hay, straw, shavings, wood, dust, and other materials may be combustible. Prevention and a current, rehearsed site-specific emergency plan are essential.

**Prevention:**
- No smoking anywhere on the yard
- Manage hay, bedding, fuels, rags, equipment, dust, and other combustible materials in accordance with the site fire-risk assessment and current local requirements
- Arrange inspection, maintenance, and repair of electrical systems by a competent qualified person; remove damaged equipment from use
- Use electrical and heating equipment only in accordance with the manufacturer instructions, the site procedure, and current fire-safety requirements
- Store fuels, solvents, chemicals, and other hazardous materials in their original labelled containers and in accordance with their label, safety data sheet (SDS), applicable law, and the responsible person’s procedure

**Preparedness:**
- Know the location of fire equipment, emergency contacts, alarms, exits, and the site evacuation plan; the responsible person must maintain these in accordance with current requirements
- Keep designated emergency routes and access for responders clear
- Make sure the plan identifies the people responsible for emergency decisions, the safe assembly area for people, and any horse-evacuation arrangements that trained staff can carry out safely
- Display or make available the current site emergency contacts and procedures

**In a Fire:**
1. Raise the alarm, call the applicable emergency service, provide the site information requested, and keep safe access clear for responders.
2. Prioritise human safety, follow the current site evacuation plan, and do not enter a hazardous area or re-enter a burning building.
3. Only trained, capable people should move horses, and only when the incident lead and conditions make it safe to do so; use the pre-identified safe area and follow emergency-service instructions.
4. Do not attempt to fight a fire unless it is immediately containable, suitable equipment is available, you have been trained, and you have a safe escape route.

## Chemical Safety

Yards commonly use:
- Wormers, fly spray, wound treatments (veterinary chemicals)
- Weedkillers, fertilisers (paddock maintenance)
- Cleaning products, disinfectants
- Fuel for vehicles and machinery

Keep chemicals and veterinary products secure and accessible only to authorised people. Retain original labels, follow the current product label and SDS for use, storage, disposal, and required protective equipment, and seek competent advice when the product, task, or legal requirement is unclear.

## Electrical Safety

- Use electrical installations and equipment only in accordance with current legal, manufacturer, and site requirements; arrange competent inspection and repair where required
- Use appropriate residual-current protection where specified for the equipment and setting
- Keep cables away from horses, water, traffic routes, and damage; remove damaged or frayed cables and plugs from use and report them
- Use protective fittings or guards where required by the current electrical and fire-safety assessment

## Yard Maintenance and Tidiness

Good housekeeping, clear routes, timely reporting of damaged fittings, and suitable drainage can reduce hazards. The responsible person should set and maintain the current inspection, reporting, and repair procedure for the site.

- Sweep the yard regularly
- Repair broken door bolts, latches and hinges promptly
- Fill potholes in the yard surface
- Ensure adequate lighting in all working areas, especially during winter when work is done in the dark
- Know the location of the current first-aid provisions and follow the responsible person’s restocking, training, and emergency procedure`,
    keyPoints: [
      "Keep walkways, exits, and emergency access clear; report unsafe surfaces, fittings, and equipment through the yard’s current procedure",
      "Reduce fire risk through a no-smoking control, management of combustible materials, competent electrical maintenance, and the current site fire-risk procedure",
      "Know the location of the site’s fire equipment, alarm, exits, emergency contacts, and current evacuation plan",
      "Keep chemicals and veterinary products secure in their original labelled containers and follow the current label, SDS, and site procedure",
      "Good housekeeping, clear routes, maintenance, and reporting can reduce hazards but do not remove the need for supervision and site-specific controls",
      "In an emergency: raise the alarm, call the applicable emergency service, prioritise people, and follow the trained site evacuation plan",
    ],
    safetyNote:
      "Do not enter a hazardous area, re-enter a burning building, or improvise a horse-handling technique during a fire. Prioritise people, raise the alarm, follow the current trained site plan, and act only within your competence and a safe escape route while following emergency-service instructions.",
    practicalApplication:
      "With the responsible person’s permission, walk around the yard to identify observable hazards and report them through the current procedure. Confirm how to locate the emergency plan, exits, contacts, and fire equipment. Do not inspect, service, move, or handle fire equipment, chemicals, electrical systems, or horse-evacuation arrangements unless authorised and competent to do so. Good safety awareness includes timely reporting and following the site plan.",
    commonMistakes: [
      "Leaving tools and equipment out where they can be tripped over or stepped on by horses",
      "Assuming fire safety is someone else's responsibility",
      "Storing chemicals in unmarked containers or accessible to children and animals",
      "Not gritting icy paths and yard areas in winter",
      "Ignoring damaged electrical cables or broken fittings that could cause injury",
    ],
    knowledgeCheck: [
      {
        question: "What is the most common type of accident on a yard?",
        options: [
          "Burns",
          "Slips, trips and falls",
          "Animal bites",
          "Chemical spills",
        ],
        correctIndex: 1,
        explanation:
          "Wet or uneven surfaces, loose bedding, hoses, and unsafe weather conditions can create slip, trip, and fall hazards. The responsible yard procedure should control, report, and address them.",
      },
      {
        question: "In a fire on the yard, who should be evacuated first?",
        options: ["Horses", "Equipment and tack", "People", "Feed and hay"],
        correctIndex: 2,
        explanation:
          "Human safety is the priority. Follow the current site emergency plan and emergency-service instructions; horses are moved only when trained capable people can do so safely.",
      },
      {
        question:
          "Why is rodent damage to electrical cables a concern on yards?",
        options: [
          "It is unsightly",
          "Rodents may chew through insulation, exposing live wires and causing fire or electrocution",
          "It wastes electricity",
          "It attracts more rodents",
        ],
        correctIndex: 1,
        explanation:
          "Damaged electrical cables can create a shock or fire hazard. Remove damaged equipment from use, report it, and arrange competent inspection or repair under the current site procedure.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me create a yard hazard checklist for a weekly inspection?",
      "What should a yard fire evacuation plan include?",
      "How should chemicals and veterinary products be stored safely on a yard?",
    ],
    linkedCompetencies: ["yard_safety_awareness", "risk_awareness"],
  },

  // ── Lesson 19 ─────────────────────────────────────────────────────────────
  {
    slug: "risk-incident-awareness",
    pathwaySlug: "stable-yard-safety",
    title: "Risk & Incident Awareness",
    level: "intermediate",
    category: "Stable & Yard Safety",
    sortOrder: 5,
    objectives: [
      "Explain the purpose of risk assessments in an equestrian setting",
      "Describe how to report an incident or near-miss",
      "Understand why the responsible person may record incidents and near misses for learning and current procedures",
      "Identify the key elements of a basic risk assessment",
    ],
    content: `Risk management and incident reporting are practical parts of a responsible yard’s current safety procedure. In an equestrian environment, horses, equipment, vehicles, chemicals, weather, and people can create hazards. Learners should identify observable hazards, follow the responsible person’s procedure, and obtain competent help rather than attempting to set legal, insurance, safeguarding, or emergency controls independently.

## What Is a Risk Assessment?

A risk assessment is a structured process for identifying hazards, assessing risk, deciding and implementing controls, recording significant findings where required, and reviewing whether controls work. The Health and Safety Executive (HSE) describes this framework for UK workplaces; the applicable process, responsible person, and legal duties vary by jurisdiction, work arrangement, insurer, and site.

**A UK HSE workplace example has five linked stages:**

1. **Identify hazards** — consider work, equipment, substances, premises, non-routine tasks, and observable unsafe conditions.
2. **Assess the risks** — consider who may be harmed, how, existing controls, and whether further action is needed.
3. **Control the risks** — use controls determined by the responsible person and current requirements; do not attempt technical, legal, or safeguarding decisions outside your competence.
4. **Record significant findings where required** — the responsible person decides the authorised record, access, personal-data handling, and actions; in the UK HSE example, significant findings must be recorded when five or more people are employed.
5. **Review the controls** — report changes, worker concerns, accidents, near misses, or ineffective controls through the current procedure so the responsible person can review and update the assessment.

## Types of Hazards in an Equestrian Setting

- **Physical** — Surfaces, fencing, equipment, vehicles, weather conditions
- **Animal-related** — Horse behaviour, kicking, biting, bolting, trampling
- **Chemical** — Wormers, fly sprays, cleaning products, fuel
- **Biological** — Parasites, zoonotic diseases, contaminated water
- **Environmental** — Weather extremes, flooding, lightning, poor lighting
- **Human** — Fatigue, inexperience, distraction, failure to follow procedures

## Incident Reporting

An **incident** or **near miss** is an event that the yard’s current procedure identifies for reporting or review. Timely factual reporting can help the responsible person address hazards, recognise patterns, preserve required information, and meet current legal, insurer, safeguarding, employment, and organisational requirements.

In the UK, **RIDDOR** is not a report for every accident or near miss. HSE says reportability depends on a work-related event and the current listed reportable injury, disease, dangerous-occurrence, or other criteria. The responsible person must assess and make any report under the current rule; learners must not make legal conclusions from this lesson.

## What to Record

The responsible person’s approved report process determines what information is recorded, who may access it, and how personal information is handled. A learner should report factual observations promptly through that process, such as the time and location, what was observed, immediate safe actions taken within their competence, and who has been informed. Do not diagnose injuries, assign blame, conduct an investigation, collect unnecessary personal data, or make legal conclusions unless authorised and competent.

## Near-Miss Recording

A **near miss** is an event that could have led to harm but did not. It can identify a hazard before an injury occurs. Examples include a loose horse contained before it reaches a public area, an unsafe route reported before someone trips, or damaged safety equipment found and removed from use.

Report near misses through the yard’s current procedure. The responsible person decides whether and how an event is recorded, investigated, escalated, or reported externally under current requirements.

## Creating a Safety Culture

Risk assessment and incident reporting work best when everyone on the yard takes them seriously. This means:
- Providing a clear, accessible route to report hazards and near misses
- Acting on reports within the site’s current responsibilities and procedure
- Discussing safety in an appropriate, respectful way and protecting confidentiality where required
- Providing competent training, supervision, and refreshers appropriate to each role
- Modelling the current safe procedures and escalating concerns through the designated route`,
    keyPoints: [
      "A risk-management process identifies hazards, assesses risk, implements controls, records significant findings where required, and reviews controls",
      "The HSE UK workplace example is: identify hazards, assess risks, control risks, record findings, and review controls",
      "Use the responsible person’s approved reporting process and provide factual observations only within your competence",
      "Report near misses through the current site procedure so the responsible person can decide the required action",
      "In the UK, the responsible person must assess current RIDDOR criteria; not every accident or near miss is RIDDOR-reportable",
      "A positive safety culture encourages reporting and acts on findings promptly",
    ],
    safetyNote:
      "If there is an immediate risk to life or safety, raise the alarm and contact the applicable emergency service. Do not enter danger, attempt a medical assessment, move an injured person, or provide care beyond your training and current emergency procedure. Once safe, report factual observations to the responsible person and follow emergency-service instructions.",
    practicalApplication:
      "Ask the responsible person how hazards, incidents, and near misses are reported at the yard. With permission, identify observable hazards and report them through the designated route. Do not create, alter, access, or share risk or incident records unless authorised; do not investigate, collect personal information, or determine legal reporting requirements yourself.",
    commonMistakes: [
      "Treating risk assessment as a paper exercise rather than a practical safety tool",
      "Not recording near-misses because 'nothing happened'",
      "Failing to review and update risk assessments when circumstances change",
      "Assuming only the yard owner or manager is responsible for safety",
      "Not investigating the root cause of incidents, leading to repeat occurrences",
    ],
    knowledgeCheck: [
      {
        question: "What is the purpose of a risk assessment?",
        options: [
          "To eliminate all risk completely",
          "To identify hazards, evaluate risk and implement measures to reduce harm",
          "To comply with insurance paperwork only",
          "To record accidents after they happen",
        ],
        correctIndex: 1,
        explanation:
          "A risk-management process identifies hazards, assesses who may be harmed and how, implements controls through the responsible person, records significant findings where required, and reviews whether controls work.",
      },
      {
        question: "Why should near-misses be recorded?",
        options: [
          "They are legally required under all circumstances",
          "They provide warnings before someone is actually hurt, allowing preventive action",
          "They are needed for insurance discounts",
          "They are only recorded if the yard owner requests it",
        ],
        correctIndex: 1,
        explanation:
          "Near misses can reveal hazards before injury occurs. They should be reported through the current yard procedure so the responsible person can decide the appropriate action.",
      },
      {
        question: "How often should risk assessments be reviewed?",
        options: [
          "Only when an accident occurs",
          "At a fixed interval regardless of whether circumstances change",
          "Whenever circumstances change and in accordance with the current employer, insurer and legal requirements",
          "They only need to be done once",
        ],
        correctIndex: 2,
        explanation:
          "Risk assessments should be reviewed whenever circumstances change and according to current employer, insurer and legal requirements. A fixed lesson timetable must not replace an active review of the actual risk.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me conduct a basic risk assessment for a stable yard?",
      "What should be included in an incident report form for an equestrian yard?",
      "Explain the difference between a hazard, a risk and a control measure.",
    ],
    linkedCompetencies: ["risk_awareness", "yard_safety_awareness"],
  },

  // ── Lesson 20 ─────────────────────────────────────────────────────────────
  {
    slug: "advanced-safety-awareness",
    pathwaySlug: "stable-yard-safety",
    title: "Advanced Safety Awareness",
    level: "advanced",
    category: "Stable & Yard Safety",
    sortOrder: 6,
    objectives: [
      "Explain the concept of duty of care in an equestrian setting",
      "Describe the responsibilities of supervising less experienced people around horses",
      "Understand the safety considerations for lone working on a yard",
      "Apply risk management principles to complex real-world scenarios",
    ],
    content: `As experience and responsibility increase, safety decisions must remain within the learner’s competence, authority, current site procedure, and applicable law. Advanced safety awareness means recognising a hazard, stopping when needed, reporting it through the designated route, and obtaining competent help rather than making legal, safeguarding, medical, welfare, or horse-management decisions alone.

## Duty of Care

The legal meaning and allocation of **duty of care** varies by jurisdiction, employment/volunteer arrangement, contract, safeguarding role, insurance, and the facts of an incident. This lesson is not legal advice and does not allocate legal liability.

At a yard, learners should follow the current designated roles and procedures. A responsible person should arrange competent risk management, supervision, equipment and premises controls, emergency arrangements, and any required disclosures. Staff, volunteers, owners, instructors, and visitors should report observable hazards and follow the site procedure; no one should repair equipment, supervise others, handle a difficult horse, or make formal safety, welfare, or safeguarding decisions unless authorised and competent.

## Supervision Responsibilities

Supervision arrangements must be set by the responsible person and reflect the activity, horse, person’s capability, safeguarding requirements, local law, and current risk assessment. If you are not authorised and competent to supervise, do not take on that role.

When acting within an approved role, follow the documented plan, verify that the activity is authorised and appropriately supervised, explain the stop/escalation route, and stop or report an activity that becomes unsafe. Do not teach handling, riding, machinery, child-contact, or safeguarding techniques from this lesson alone; obtain qualified instruction and use the current site policy.

## Lone Working

Working alone may add risks because assistance, communication, emergency response, supervision, access, and the worker’s circumstances can differ from a staffed setting. HSE requires UK employers to assess, control, train, supervise, monitor, keep in contact with, and respond to incidents involving lone workers; applicable duties and arrangements vary elsewhere.

**Before working alone:**
- Follow the written lone-working assessment and authorisation for the actual activity, location, horse, equipment, and conditions.
- Use the authorised contact, monitoring, emergency, access, and escalation arrangements; do not assume a personal phone or a generic check-in plan is sufficient.
- Do not begin or continue a task where the assessment, competence, equipment, conditions, support, or emergency arrangements are inadequate.
- Stop, move to a safe position if possible, and contact the designated responsible person or applicable emergency service if circumstances become unsafe.

## Applying Risk Management to Complex Scenarios

Advanced safety awareness means recognising when a situation exceeds a learner’s authority or competence. For example, a new horse, changing weather, a child visitor, unfamiliar equipment, a behavioural concern, or a welfare/safeguarding issue must be referred to the responsible person and managed under the current written site policy and qualified guidance.

In an unfamiliar or changing situation, pause before acting. Identify immediate danger, move to a safe position without creating further risk, raise the appropriate alarm, and report factual observations through the designated route. Do not improvise turnout, weather, riding, child-contact, safeguarding, medical, or horse-handling procedures from a generic scenario. Ask the responsible person or an appropriate qualified professional which current procedure applies before any further action.`,
    keyPoints: [
      "Legal duties and responsibilities depend on the jurisdiction, role, site, and facts; follow the responsible person’s current procedure",
      "Supervision must be authorised, competent, activity-specific, and consistent with current safeguarding and site requirements",
      "Lone-working controls must come from the current risk assessment, authorised contact and emergency arrangements, not a generic checklist",
      "Do not undertake or supervise a task beyond your authority or competence; stop and obtain qualified help when risk changes",
      "In an unfamiliar situation, identify immediate danger, use the designated stop/escalation route, and follow the responsible person’s current plan",
    ],
    safetyNote:
      "Do not begin or continue lone work, supervision, horse handling, or an emergency action outside the current authorised assessment, your competence, and a safe escalation route. In immediate danger, raise the alarm and contact the applicable emergency service; then follow the current site plan and emergency-service instructions.",
    practicalApplication:
      "Ask the responsible person how the yard authorises supervision, lone work, adverse-weather decisions, visitor access, and emergency escalation. Review the current procedure with a qualified person and report any gap or changed condition. Do not create a supervision, child-contact, horse-introduction, or lone-working plan independently from this lesson.",
    commonMistakes: [
      "Assuming novice handlers understand basic safety without being told",
      "Failing to report an observable hazard or changed condition through the designated responsible-person route",
      "Working alone without the current authorised risk assessment, contact, monitoring, and emergency arrangements",
      "Attempting a task alone when the current assessment, conditions, competence, or support make it unsafe",
      "Waiting for accidents to happen before addressing unsafe behaviour",
    ],
    knowledgeCheck: [
      {
        question: "What should a learner do when a safety decision may exceed their authority or competence?",
        options: [
          "Make the legal and risk decision alone to avoid delay",
          "Follow the designated stop/escalation route and obtain competent help",
          "Ignore the concern if no incident has occurred yet",
          "Apply a generic online scenario as the site procedure",
        ],
        correctIndex: 1,
        explanation:
          "Legal duties and risk controls depend on the jurisdiction, role, site, and facts. A learner should stop or move to safety where necessary, report factual observations through the designated route, and obtain competent help.",
      },
      {
        question:
          "What should determine whether and how someone works alone at a yard?",
        options: [
          "A generic lesson checklist",
          "Whether the horse seems calm that day",
          "The current authorised risk assessment, competence, contact, monitoring, and emergency arrangements",
          "Finishing the job as quickly as possible",
        ],
        correctIndex: 2,
        explanation:
          "HSE requires UK employers to manage lone-worker risks through assessment, training, supervision, monitoring, contact, and incident response. The site’s current authorised arrangements—not a generic checklist—must govern the work.",
      },
      {
        question:
          "What should happen when a new-horse turnout or group-management decision is outside the learner’s authority or competence?",
        options: [
          "Use the first generic method they remember",
          "Refer the decision to the responsible person and follow the current written site policy",
          "Proceed alone if the field appears large enough",
          "Ask a child visitor to help observe",
        ],
        correctIndex: 1,
        explanation:
          "Turnout and group-management decisions depend on the individual horses, facilities, supervision, welfare needs, and site procedure. A learner should not improvise a generic introduction method.",
      },
    ],
    aiTutorPrompts: [
      "Can you give me a scenario-based safety question and talk me through how to assess the risk?",
      "How can I identify when a safety decision should be escalated to the responsible person or a qualified professional?",
      "What information should I obtain from the responsible person before an authorised supervised handling activity?",
    ],
    linkedCompetencies: ["risk_awareness", "welfare_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 4 — Horse Behaviour & Welfare
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Lesson 21 ─────────────────────────────────────────────────────────────
  {
    slug: "understanding-horse-behaviour",
    pathwaySlug: "horse-behaviour-welfare",
    title: "Understanding Horse Behaviour",
    level: "beginner",
    category: "Horse Behaviour & Welfare",
    sortOrder: 1,
    objectives: [
      "Explain why horses behave as flight animals and what this means for handlers",
      "Describe the importance of herd instinct in horse behaviour",
      "Identify basic body language signals including ear position, tail carriage and posture",
      "Understand how natural behaviour influences how we manage and handle horses",
    ],
    content: `Understanding why horses behave the way they do is fundamental to safe, effective horsemanship. Horses are not being 'naughty' or 'difficult' when they spook, refuse to leave their companions, or become tense in new situations. They are responding to millions of years of evolutionary programming. By understanding this, we can work with the horse's nature rather than against it.

## The Horse as a Prey Animal

Horses evolved as prey animals on open grasslands. Their primary survival strategy is **flight** — when something frightens them, their instinct is to run first and assess the threat later. This has profound implications for how we handle and ride them:

- **Sudden movements, loud noises and unfamiliar objects** can trigger the flight response, even in well-trained horses. A plastic bag blowing across the arena, a sudden clap of thunder or an unfamiliar vehicle can all cause a horse to spook (startle and shy away or bolt).
- **Spooking is not misbehaviour** — it is a survival instinct. Punishing a horse for spooking increases its anxiety and makes the behaviour worse.
- **Desensitisation** works with this instinct by gradually introducing the horse to scary stimuli in a controlled way, teaching it that the stimulus is not a threat.

## Herd Instinct

Horses are social herd animals. In the wild, the herd provides safety — many pairs of eyes watch for predators, and there is safety in numbers. This herd instinct influences domestic horse behaviour in several ways:

- **Separation anxiety** — Many horses become distressed when separated from their companions. They may call (whinny), become agitated, refuse to move away from the group, or try to return. This is not stubbornness; it is a deep-seated survival instinct.
- **Herd hierarchy** — Within any group of horses, a pecking order develops. Dominant horses control access to food, water and preferred resting spots. Understanding this hierarchy helps you manage field groups and prevent bullying.
- **Following behaviour** — Horses naturally follow each other. A confident lead horse can help a nervous horse through a scary situation.
- **Need for companionship** — Keeping a horse in complete isolation is a significant welfare concern. Horses need the company of other equines (or at least other animals) to be mentally healthy.

## Reading Body Language

Horses communicate primarily through body language. Learning to read these signals makes you safer and a more effective handler.

**Ears:**
- **Forward** — Alert, interested, focused on something ahead
- **Sideways (relaxed)** — Calm, at ease, listening to the rider or handler
- **Flat back** — Anger, aggression, warning. This is a threat signal — do not approach a horse with its ears pinned flat back
- **One forward, one back** — Listening to two things simultaneously (e.g., the rider and something in the environment)
- **Rapidly flicking** — Anxiety, confusion, sensory overload

**Tail:**
- **Carried softly** — Relaxed and content
- **Clamped down** — Fear, pain or cold
- **Swishing vigorously** — Irritation, annoyance or pain (beyond normal fly-swatting)
- **Raised high** — Excitement, alertness or playfulness

**Head and Neck:**
- **Low, relaxed head** — Calm, comfortable, possibly resting
- **High head, wide eyes, flared nostrils** — Fear, alarm, preparing to flee
- **Snaking (head low and swinging side to side)** — Aggression, herding behaviour, threat — this is dangerous

**Overall Posture:**
- **Weight shifted to one hind leg, head low** — Resting, comfortable
- **Tense muscles, tight mouth, rigid body** — Anxiety, pain or preparing for action
- **Pawing the ground** — Frustration, anticipation or (in some cases) a sign of colic
- **Rolling** — Normal behaviour for relaxation and coat care, but repeated rolling and looking at the flanks may indicate colic

## How Natural Behaviour Affects Management

Understanding natural behaviour helps us make better management decisions:
- Horses need to graze for extended periods — restricting forage access causes stress and ulcers
- Horses need companionship — isolation causes stereotypic behaviours (weaving, crib-biting)
- Horses need space to move — prolonged confinement in stables causes physical and mental problems
- Horses learn through release of pressure — when we apply an aid (pressure) and the horse responds correctly, we must release immediately to reward the response
- Horses have excellent memories — both positive and negative experiences are remembered long-term`,
    keyPoints: [
      "Horses are flight animals — spooking is an instinctive survival response, not misbehaviour",
      "Herd instinct means horses need companionship; isolation causes stress and behavioural problems",
      "Ears flat back is a warning signal indicating aggression — do not approach",
      "A high head, wide eyes and flared nostrils indicate fear or alarm",
      "Horses learn through the release of pressure — the timing of the release is the reward",
      "Understanding natural behaviour helps us manage horses in ways that support their welfare",
    ],
    safetyNote:
      "Never approach a horse that is showing aggressive body language (ears flat, teeth bared, head snaking, threatening to kick). Give the horse space and assess the situation. If a horse is exhibiting fear responses (high head, wide eyes, prancing, attempting to flee), do not block its escape route — a cornered, frightened horse is extremely dangerous. Allow it space to move away from the perceived threat while maintaining your own safety.",
    practicalApplication:
      "Spend time observing horses in a field without interacting with them. Watch how they communicate with each other through body language — who is dominant? Who defers? How do they signal to each other? Then observe horses in stables — what does their body language tell you about their state of mind? The more time you spend reading horses, the more intuitive it becomes. Keep a journal of your observations and discuss them with your instructor.",
    commonMistakes: [
      "Punishing a horse for spooking, which increases anxiety and makes spooking worse",
      "Assuming a horse is being 'naughty' when it is actually frightened or in pain",
      "Ignoring warning body language such as pinned ears or a swishing tail",
      "Keeping a horse in isolation without adequate companionship",
      "Misreading a resting horse (one hind leg cocked, head low) as lame",
    ],
    knowledgeCheck: [
      {
        question:
          "Why do horses spook at sudden movements or unfamiliar objects?",
        options: [
          "They are poorly trained",
          "They are being deliberately difficult",
          "Their flight instinct as a prey animal tells them to flee from potential threats",
          "They have poor eyesight and cannot see properly",
        ],
        correctIndex: 2,
        explanation:
          "As prey animals, horses evolved to flee first and assess threats later. Spooking is an instinctive survival response, not misbehaviour.",
      },
      {
        question: "What does it mean when a horse pins its ears flat back?",
        options: [
          "It is listening to something behind it",
          "It is relaxed and happy",
          "It is expressing aggression or a warning",
          "It is about to lie down",
        ],
        correctIndex: 2,
        explanation:
          "Ears pinned flat back against the head is a clear warning signal indicating anger or aggression. Do not approach a horse showing this signal.",
      },
      {
        question: "Why is it a welfare concern to keep a horse in isolation?",
        options: [
          "Isolated horses eat too much",
          "Horses are herd animals and need companionship for mental wellbeing",
          "It is illegal in all countries",
          "Isolated horses become physically weaker",
        ],
        correctIndex: 1,
        explanation:
          "As herd animals, horses have a deep-seated need for social interaction. Isolation causes chronic stress and can lead to stereotypic behaviours such as weaving, crib-biting and box-walking.",
      },
    ],
    aiTutorPrompts: [
      "Can you describe the main body language signals a horse uses and what each one means?",
      "How does the flight instinct affect the way we should train and handle horses?",
      "What are stereotypic behaviours and why do they develop?",
    ],
    linkedCompetencies: ["horse_behaviour_awareness"],
  },

  // ── Lesson 22 ─────────────────────────────────────────────────────────────
  {
    slug: "signs-of-good-health",
    pathwaySlug: "horse-behaviour-welfare",
    title: "Signs of Good Health",
    level: "beginner",
    category: "Horse Behaviour & Welfare",
    sortOrder: 2,
    objectives: [
      "Use the World Horse Welfare adult-at-rest TPR reference alongside each horse’s individual baseline",
      "Describe what a healthy horse looks and behaves like",
      "Explain how to take a horse's temperature, pulse and respiration rate",
      "Recognise early signs that a horse may be unwell",
    ],
    content: `Being able to assess a horse's health is a core stable management skill. Every day, you should observe each horse for signs of good health and be alert to any deviations from normal. Early detection of illness or injury can be the difference between a simple treatment and a serious veterinary emergency.

## What Does a Healthy Horse Look Like?

A healthy horse should display the following characteristics:

- **Bright, alert expression** — The eyes should be bright, clear and open, with no discharge or excessive tearing.
- **Clean nostrils** — Both nostrils should be clean, with no thick or coloured discharge. A small amount of clear, watery discharge is normal.
- **Good coat condition** — The coat should be smooth, shiny and lie flat (in an unclipped horse in summer). A dull, staring (standing up) coat can indicate illness, worm burden or poor nutrition.
- **Good body condition** — Neither too thin nor too fat. You should be able to feel (but not see) the ribs. The spine, hip bones and shoulder blades should not be prominently visible.
- **Normal appetite** — The horse should eat its forage and hard feed readily. Loss of appetite is often one of the first signs of illness.
- **Normal droppings** — Observe the horse’s normal pattern, consistency and appearance. A material change in droppings, appetite or behaviour should be recorded and reported through the yard’s health procedure.
- **Normal urine** — Pale yellow to amber, produced several times a day. Should not be dark, bloody or excessively cloudy.
- **Active and interested** — A healthy horse is alert to its surroundings, interested in other horses and its environment, and moves willingly.
- **Even weight-bearing** — Standing squarely on all four legs, with weight distributed evenly. Resting a hind leg occasionally is normal; pointing a foreleg (stretching it forward) is not.
- **Clean limbs** — No swelling, heat or discharge on the legs.
- **Comfortable skin** — No excessive itching, hair loss, sores or lumps.

## Temperature, Pulse and Respiration (TPR)

Knowing a horse's TPR is essential for assessing health. You should learn each horse's individual resting TPR, as there is natural variation between animals.

### Temperature
- **World Horse Welfare adult-at-rest reference:** 37.5°C to 38.5°C for a healthy adult horse calmly at rest.
- **How to take:** Only take a temperature if you have been shown the safe technique by a competent person. Use a suitable digital thermometer, stand to the side rather than directly behind, and stop if the horse becomes unsafe to handle. Clean equipment according to the yard procedure.
- **Interpretation:** A reading must be considered with the individual horse’s usual baseline, recent exercise, weather, behaviour and other signs. Report a concerning change rather than self-diagnosing the cause.

### Pulse (Heart Rate)
- **World Horse Welfare adult-at-rest reference:** 36 to 42 beats per minute for a healthy adult horse calmly at rest.
- **How to take:** The **facial artery** runs under the jaw where it crosses the mandible. A competent person can show the learner how to locate it and obtain a reliable reading without restricting the horse’s movement.
- **Interpretation:** A material change from the individual baseline, especially with illness signs, needs responsible-person or veterinary advice.

### Respiration (Breathing Rate)
- **World Horse Welfare adult-at-rest reference:** 8 to 12 breaths per minute for a healthy adult horse calmly at rest.
- **How to take:** Observe the horse at rest from a safe position and follow the competent person’s method for recording a reliable rate.
- **Interpretation:** Laboured, noisy or unusually rapid breathing at rest requires prompt escalation; do not rely on a number alone.

### Mucous membranes and circulation observations
- A change in gum appearance, behaviour, appetite, comfort or breathing can be relevant, but a learner should not use one home observation to diagnose dehydration, shock or circulation problems. Record what is seen and follow the yard’s veterinary-escalation procedure.

### Gut Sounds
- Listen to the horse's flank with your ear or a stethoscope. You should hear regular gurgling and rumbling sounds, indicating healthy gut motility. **Absent gut sounds** can indicate a serious problem, such as colic.

## When to Call the Vet

While not every change in TPR requires an emergency call, the following signs warrant immediate veterinary attention:
- A persistent material departure from the horse’s known calm-at-rest baseline, especially alongside illness signs
- Laboured or unusually rapid breathing at rest
- Absent gut sounds
- Signs of colic (rolling, pawing, looking at flanks, sweating without exercise)
- Severe lameness (non-weight-bearing)
- Profuse bleeding or a deep wound
- Difficulty breathing, coughing repeatedly or nasal discharge that is thick or discoloured
- Sudden loss of appetite or refusal to drink`,
    keyPoints: [
      "For a healthy adult horse calmly at rest, World Horse Welfare lists temperature 37.5–38.5°C, pulse 36–42 bpm and respiration 8–12 breaths per minute; record the individual horse’s baseline and seek veterinary advice for concerning changes.",
      "A bright eye, shiny coat, good appetite and normal droppings are key indicators of good health",
      "The pulse is most easily felt at the facial artery under the jawbone",
      "Record concerning changes in gums, appetite, comfort or breathing and follow the yard’s veterinary-escalation procedure rather than diagnosing from a single test",
      "Absent gut sounds can indicate colic and require urgent veterinary attention",
      "Learn each horse's individual resting TPR, as normal ranges vary between animals",
    ],
    safetyNote:
      "When taking a horse's temperature, always stand to the side, not directly behind. Have someone hold the horse's head if it is not tied up. Some horses react to the thermometer by kicking or clamping their tail. If the horse becomes agitated, stop and try again later with assistance. When checking the pulse at the facial artery, approach the head calmly and do not restrict the horse's ability to move its head.",
    practicalApplication:
      "Practise taking TPR readings on a calm, healthy horse until you can do it confidently and quickly. Record each horse's resting TPR so you have a baseline. Include a TPR check in your daily stable routine, especially for horses that seem quieter than usual. If a horse's readings deviate from its normal baseline, monitor closely and report to the yard manager or vet.",
    commonMistakes: [
      "Not knowing the normal TPR ranges and therefore not recognising when values are abnormal",
      "Standing directly behind the horse when taking its temperature",
      "Counting the pulse for too short a period and getting an inaccurate reading",
      "Confusing normal resting behaviour (dozing, cocking a hind leg) with signs of illness",
      "Ignoring subtle changes such as a slightly dull coat or a minor reduction in appetite",
    ],
    knowledgeCheck: [
      {
        question: "What is the normal resting heart rate range for a horse?",
        options: ["10–20 bpm", "36–42 bpm", "60–80 bpm", "80–120 bpm"],
        correctIndex: 1,
        explanation:
          "World Horse Welfare lists 36–42 beats per minute as the usual pulse range for a healthy adult horse calmly at rest. Use the individual horse’s recorded baseline and the wider clinical picture; seek veterinary advice for a concerning change.",
      },
      {
        question: "Where is the easiest place to feel a horse's pulse?",
        options: [
          "On the neck",
          "At the facial artery under the jaw",
          "On the chest",
          "At the fetlock",
        ],
        correctIndex: 1,
        explanation:
          "The facial artery runs under the jaw and crosses the mandible, making it the most accessible point to feel the pulse by pressing gently with two or three fingers.",
      },
      {
        question: "What might absent gut sounds indicate?",
        options: [
          "The horse has just eaten",
          "The horse is sleeping deeply",
          "A potential colic situation requiring veterinary attention",
          "The horse is dehydrated but otherwise healthy",
        ],
        correctIndex: 2,
        explanation:
          "Normal gut sounds (gurgling and rumbling) indicate healthy digestive activity. Absent gut sounds can indicate gut stasis, which is often associated with colic — a veterinary emergency.",
      },
    ],
    aiTutorPrompts: [
      "Can you quiz me on the normal TPR values for horses?",
      "What signs should make me call the vet immediately?",
      "How do I take a horse's temperature safely?",
    ],
    linkedCompetencies: ["welfare_awareness", "stable_checks"],
  },

  // ── Lesson 23 ─────────────────────────────────────────────────────────────
  {
    slug: "behaviour-around-other-horses",
    pathwaySlug: "horse-behaviour-welfare",
    title: "Behaviour Around Other Horses",
    level: "developing",
    category: "Horse Behaviour & Welfare",
    sortOrder: 3,
    objectives: [
      "Describe how herd dynamics influence horse behaviour in group settings",
      "Explain the process of safe field introductions",
      "Recognise signs of aggression, dominance and submission in horses",
      "Understand how to manage horses safely when they are in close proximity to each other",
    ],
    content: `Horses are highly social animals with complex relationships. Understanding how horses interact within a group is essential for managing turnout safely, preventing injuries and supporting good welfare. Poor management of group dynamics is one of the most common causes of kick and bite injuries on yards.

## Herd Dynamics

In any group of horses, a social hierarchy develops. This hierarchy determines access to resources (food, water, shelter, preferred resting spots) and reduces the need for constant physical conflict. Once the hierarchy is established, lower-ranking horses defer to higher-ranking ones with subtle signals — a look, a slight ear movement or a shift in body weight — rather than through overt aggression.

**Dominance is not about size or breed.** A small pony can dominate a much larger horse. Dominance is about confidence, consistency and personality. The dominant horse (or horses) in a group typically:
- Eat first and at the best grazing spots
- Move other horses away from resources with a look or a gesture
- Have the most relaxed body language because they feel secure in their position
- Are not necessarily the most aggressive — truly confident horses rarely need to resort to violence

**Submissive horses** typically:
- Eat last or at the edges of the group
- Move away when a dominant horse approaches
- May show appeasement behaviours such as licking and chewing, lowering the head or turning the hindquarters (which can also be a defensive posture, so context matters)

## Signs of Aggression

Aggressive behaviour between horses includes:
- **Ears flat back** — A clear threat signal
- **Biting or attempting to bite** — Targeting the neck, shoulder or hindquarters
- **Kicking or threatening to kick** — Lifting or cocking a hind leg, turning the hindquarters toward another horse
- **Chasing** — Pursuing another horse aggressively through the field
- **Snaking** — Lowering the head and swinging it from side to side while approaching — this is a herding/threatening behaviour
- **Striking** — Lifting a foreleg and striking forward — extremely dangerous

Occasional squealing, nipping and posturing are normal parts of horse social interaction, especially when horses are first introduced. Sustained, aggressive behaviour that results in injury is not normal and requires management intervention.

## Safe Field Introductions

Introducing a new horse to an established group must be done carefully:

1. **Quarantine period** — New arrivals should be kept separate for a period to ensure they are not carrying infectious diseases.
2. **Introduction over a fence** — Turn the new horse out in a paddock adjacent to the existing group, separated by a safe fence (post-and-rail, not wire). Allow them to see, smell and interact without physical contact for several days.
3. **One-to-one introduction** — If possible, introduce the new horse to one calm, tolerant member of the group first, in a large space with good footing.
4. **Group introduction** — Gradually introduce the new horse to the full group in a large field with plenty of room to move away. Remove hind shoes from all horses to reduce kick injuries. Have experienced handlers nearby (but at a safe distance) to observe and intervene only if absolutely necessary.
5. **Monitor** — Watch the group closely for the first few days. Ensure the new horse has access to food, water and shelter and is not being bullied excessively.

## Managing Horses in Close Proximity

When multiple horses are in close proximity — in the yard, in the arena or at feed time:
- Maintain at least one horse's length between horses at all times
- When leading past another horse, give a wide berth, especially around hindquarters
- Never feed treats to one horse in a group without feeding all of them — this causes jealousy and aggression
- If a horse has a red ribbon in its tail, give it extra space — it is known to kick
- Be aware that horses can become possessive of their stable, feed, handler or companion

## Separation Issues

Some horses form very strong bonds with one or two companions. When separated, they may become extremely distressed — calling, running the fence line, sweating, refusing to eat, or becoming dangerous to handle. This is sometimes called being "herd-bound" or "buddy sour."

Management strategies include:
- Gradually increasing separation time
- Ensuring the horse can see or hear other horses even when separated
- Providing a calm, experienced companion during initial separations
- Working with a professional behaviourist if the problem is severe`,
    keyPoints: [
      "Herd hierarchy reduces conflict — once established, horses communicate through subtle body language rather than fighting",
      "Dominance is about confidence, not size — a small pony can dominate a large horse",
      "New horses must be introduced gradually: quarantine, fence-line contact, one-to-one, then group",
      "Remove hind shoes before introducing horses to reduce kick injuries",
      "Always maintain at least one horse-length between horses when leading or working in close proximity",
      "Separation anxiety is a real welfare issue — manage it with gradual desensitisation",
    ],
    safetyNote:
      "Never stand between two horses that are interacting aggressively. If a fight breaks out in the field, do not try to separate the horses physically — you will be injured. Instead, make loud noises from a safe distance (bang a bucket, shout) to distract them. If the aggression is sustained, separate the horses by leading one away (the calmer one first) using a headcollar and lead rope, never by grabbing manes or tails.",
    practicalApplication:
      "Observe the horses in your yard's field and identify the hierarchy. Which horse is dominant? Which is most submissive? How do they communicate this? Understanding these dynamics helps you predict behaviour and prevents you from putting yourself in dangerous situations. If a new horse is being introduced, volunteer to help with the supervision — it is an excellent learning opportunity.",
    commonMistakes: [
      "Introducing a new horse directly into a group without a gradual process",
      "Assuming all aggression is abnormal — some posturing and squealing during introductions is expected",
      "Standing between two aggressive horses to try to separate them",
      "Feeding treats to individual horses in a group, causing jealousy and conflict",
      "Ignoring persistent bullying that prevents a lower-ranking horse from accessing food and water",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the first step when introducing a new horse to a group?",
        options: [
          "Turn it out directly with the group",
          "Keep it separate for a quarantine period and then introduce over a fence",
          "Let it run loose in the yard to meet the others",
          "Put it in a stable next to the dominant horse",
        ],
        correctIndex: 1,
        explanation:
          "New horses should first be quarantined to check for infectious diseases, then introduced over a safe fence so horses can interact without physical contact before meeting face to face.",
      },
      {
        question:
          "Why should hind shoes be removed before a field introduction?",
        options: [
          "To make the horses run slower",
          "To reduce the severity of kick injuries if the horses fight",
          "Shoes damage the grass",
          "Horses behave better without shoes",
        ],
        correctIndex: 1,
        explanation:
          "A shod hind foot can cause much more serious kick injuries than an unshod one. Removing hind shoes before introductions significantly reduces the risk of severe injuries.",
      },
      {
        question: "What does 'snaking' behaviour indicate in a horse?",
        options: [
          "Playfulness",
          "Sleepiness",
          "Aggressive herding or threatening behaviour",
          "Curiosity",
        ],
        correctIndex: 2,
        explanation:
          "Snaking — where a horse lowers its head and swings it from side to side — is aggressive herding behaviour. It is a clear threat display and the horse should be given space.",
      },
    ],
    aiTutorPrompts: [
      "How can I identify the dominant horse in a field group?",
      "What is the safest procedure for introducing a new horse to an established group?",
      "How should I handle a horse that becomes extremely anxious when separated from its companion?",
    ],
    linkedCompetencies: ["horse_behaviour_awareness", "yard_safety_awareness"],
  },

  // ── Lesson 24 ─────────────────────────────────────────────────────────────
  {
    slug: "recognising-pain-discomfort",
    pathwaySlug: "horse-behaviour-welfare",
    title: "Recognising Pain & Discomfort",
    level: "developing",
    category: "Horse Behaviour & Welfare",
    sortOrder: 4,
    objectives: [
      "Describe the facial and behavioural signs that indicate a horse may be in pain",
      "Explain how chronic and acute pain present differently",
      "Understand the concept of the equine pain face",
      "Recognise basic lameness indicators during handling and observation",
    ],
    content: `Horses are stoic animals. As prey species, showing pain or weakness in the wild could attract predators, so horses have evolved to mask pain signals. This means that by the time a horse shows obvious distress, the pain may already be significant. Developing the ability to recognise subtle signs of pain and discomfort is one of the most important welfare skills in horsemanship.

## The Equine Pain Face

Research has identified a consistent set of facial expressions associated with pain in horses, collectively known as the **Horse Grimace Scale (HGS)**. These include:

- **Stiffly backward ears** — Not just pinned back in aggression, but held rigidly behind the vertical with tension in the ear muscles
- **Orbital tightening** — The area above the eye appears tense, with increased angularity and a visible furrow. The eye may appear more triangular than round.
- **Tension above the eye area** — A furrowed brow or prominent supraorbital ridge
- **Strained nostrils and flattening of the nose** — The nostrils may dilate or the nostril profile may change shape, appearing more angular
- **Mouth tension** — The chin and lips appear tight. The lower lip may be drawn back, exposing the teeth slightly. The jaw may be clenched.
- **Prominent strained chewing muscles** — Tension in the masseter muscles gives the face a gaunt, angular look

These signs may be subtle — a slight change in the expression that you would not notice unless you knew the horse's normal face. Photographing your horse's normal resting face provides a useful comparison.

## Behavioural Signs of Pain

Beyond facial expression, horses in pain may display:

- **Changed posture** — Standing differently, shifting weight, pointing a foreleg (stretching it forward), or resting one leg excessively
- **Reluctance to move** — Walking slowly, being unwilling to trot, or refusing to move in a particular direction
- **Altered eating behaviour** — Dropping food (quidding, which may indicate dental pain), eating slowly, or loss of appetite entirely
- **Changed attitude** — A normally friendly horse becoming withdrawn, or a quiet horse becoming aggressive
- **Increased respiration or heart rate** — At rest, without exercise, pain can elevate TPR
- **Sweating without exercise** — Pain-related sweating, particularly on the flanks and behind the ears
- **Rolling, pawing, looking at the flanks** — Classic signs of abdominal pain (colic)
- **Grinding teeth (bruxism)** — A sign of pain or stress
- **Flinching or reacting to touch** — Pain in a specific area causes the horse to flinch, move away or threaten when touched there

## Acute vs Chronic Pain

**Acute pain** is sudden and intense — such as from an abscess, a kick, or colic. The signs are usually obvious: the horse may be non-weight-bearing, sweating, rolling or clearly distressed. Acute pain demands immediate action and often a veterinary call.

**Chronic pain** is long-standing and more subtle — such as arthritis, low-grade back pain or dental issues. The horse adapts to the pain over time, and the signs may be very quiet: a slight stiffness in the morning, a reluctance to bend in one direction, a subtle change in temperament, or a gradual decline in performance. Chronic pain is harder to detect but equally important to address.

## Lameness Indicators

Lameness is one of the most common signs of pain in horses. At its simplest, a lame horse will **nod its head** when the sound (non-painful) leg hits the ground. This is because the horse lifts its head to take weight off the painful leg and drops it onto the sound one.

Other lameness indicators include:
- Shortened stride on one or both sides
- Uneven hoof placement — the horse may land toe-first to protect a sore heel
- Reluctance to turn in one direction
- Differences in muscle development between the left and right sides (muscle atrophy on the painful side)
- Heat, swelling or sensitivity in a limb

## Why Pain Recognition Matters

Recognising pain early allows for:
- Faster treatment, improving the outcome
- Reduced suffering — no animal should be left in pain unnecessarily
- Prevention of further injury — a horse in pain may compensate by overloading other limbs, creating secondary problems
- Better welfare decision-making — is this horse fit to work? Does it need veterinary attention?

Dismissing behavioural changes as "attitude" or "laziness" without considering pain as a potential cause is a serious welfare failing. Always rule out pain before attributing behaviour to temperament.`,
    keyPoints: [
      "Horses are stoic and may mask pain — subtle changes in facial expression and behaviour are often the first signs",
      "The Horse Grimace Scale identifies orbital tightening, ear position, nostril tension and mouth tension as pain indicators",
      "A lame horse nods its head onto the sound (non-painful) leg",
      "Chronic pain is harder to spot than acute pain but is equally important to identify and treat",
      "Always rule out pain before attributing behavioural changes to temperament or attitude",
    ],
    safetyNote:
      "A horse in severe pain can be unpredictable and dangerous. It may kick, bite, strike or barge without warning. If you suspect a horse is in significant pain (e.g., colicking, severely lame, traumatic injury), approach with extreme caution, speak calmly and avoid sudden movements. Do not attempt to examine the painful area without experienced supervision. Call the vet and follow their guidance while keeping yourself safe.",
    practicalApplication:
      "Learn each horse's normal facial expression and behaviour. Photograph horses at rest to create a baseline reference. During daily checks, compare their current expression to the baseline. If something looks different — even subtly — investigate further. Practise assessing lameness by watching horses trot on a straight line on hard ground. Ask your instructor or vet to demonstrate the head-nod test.",
    commonMistakes: [
      "Assuming a horse is being lazy or difficult when it is actually in pain",
      "Waiting for obvious distress before investigating — subtle signs indicate earlier, more treatable stages",
      "Not knowing the horse's normal behaviour and therefore missing changes",
      "Ignoring chronic, low-grade signs such as slight stiffness, reluctance to bend or gradual temperament changes",
      "Attempting to examine a painful area without experienced help, risking injury from the horse's reaction",
    ],
    knowledgeCheck: [
      {
        question: "When a horse is lame on a foreleg, what does its head do?",
        options: [
          "It drops onto the lame leg to protect it",
          "It nods onto the sound (non-painful) leg",
          "It stays level throughout",
          "It shakes from side to side",
        ],
        correctIndex: 1,
        explanation:
          "A lame horse lifts its head as the painful leg hits the ground (to reduce weight on it) and drops its head as the sound leg lands, creating a nodding motion.",
      },
      {
        question: "What is the Horse Grimace Scale used for?",
        options: [
          "Scoring a horse's temperament",
          "Assessing facial expressions associated with pain",
          "Grading the severity of lameness",
          "Measuring fitness levels",
        ],
        correctIndex: 1,
        explanation:
          "The Horse Grimace Scale is a research-validated tool that identifies specific facial expressions — including orbital tightening, ear position and mouth tension — that are associated with pain in horses.",
      },
      {
        question: "Why is chronic pain harder to detect than acute pain?",
        options: [
          "Chronic pain is less painful",
          "The horse adapts over time and the signs become subtle",
          "Chronic pain only affects internal organs",
          "Horses with chronic pain act normally",
        ],
        correctIndex: 1,
        explanation:
          "Horses adapt to chronic pain over time. The signs become subtle — slight stiffness, minor behavioural changes, gradual performance decline — making it easy to miss unless you know the horse well.",
      },
    ],
    aiTutorPrompts: [
      "Can you describe the facial signs of pain in a horse according to the Horse Grimace Scale?",
      "How can I tell if a horse is lame by watching it move?",
      "What is the difference between acute and chronic pain in horses, and how does each present?",
    ],
    linkedCompetencies: ["welfare_awareness", "horse_behaviour_awareness"],
  },

  // ── Lesson 25 ─────────────────────────────────────────────────────────────
  {
    slug: "horse-welfare-under-workload",
    pathwaySlug: "horse-behaviour-welfare",
    title: "Horse Welfare Under Workload",
    level: "intermediate",
    category: "Horse Behaviour & Welfare",
    sortOrder: 5,
    objectives: [
      "Recognise the signs that a horse is fatigued during exercise",
      "Explain the concept of overtraining and its effects on horse welfare",
      "Describe appropriate recovery periods for different levels of work",
      "Understand how to adapt workload to the individual horse's fitness and age",
    ],
    content: `Working horses have specific welfare needs that go beyond basic care. A horse that is consistently pushed beyond its physical or mental capacity will suffer — from physical injuries like tendon strain and back pain, to psychological effects such as anxiety, resistance and behavioural deterioration. Understanding how to manage workload responsibly is a key marker of an educated, ethical equestrian.

## Recognising Fatigue During Exercise

A fit, well-prepared horse in moderate work should maintain a steady rhythm, respond willingly to aids, and carry itself in balance. Signs that a horse is becoming fatigued include:

- **Stumbling or tripping** — Tired muscles lose coordination. A horse that begins to trip during work is losing the ability to move safely.
- **Breaking gait** — Falling from canter to trot, or from trot to walk, without being asked. This indicates the horse cannot maintain the gait.
- **Heavy breathing** — Laboured, rapid or open-mouthed breathing during or after moderate work suggests the horse's cardiovascular system is struggling.
- **Excessive sweating** — While sweating during exercise is normal, profuse sweating disproportionate to the work level may indicate the horse is overheating or overstressed.
- **Loss of impulsion** — The horse becomes reluctant to move forward, needing increasing amounts of leg to maintain the pace.
- **Leaning on the reins** — A tired horse may begin to lean on the rider's hands for support, indicating loss of self-carriage.
- **Tail swishing and ear-pinning** — Irritability during work that was previously comfortable can indicate muscular discomfort.
- **Recovery that is not returning toward the horse’s normal baseline** — Record the horse’s response to work and compare it with its known individual pattern. If breathing, demeanour, gait or recovery concerns persist, stop work and seek veterinary advice rather than relying on one generic cut-off.

## Overtraining

Overtraining occurs when a horse is worked too hard, too often, without adequate recovery time. It is a cumulative process and the signs may develop gradually:

- Declining performance despite continued or increased training
- Chronic fatigue — the horse seems tired even at rest
- Weight loss despite adequate feeding
- Increased susceptibility to illness and infection (the immune system is compromised)
- Behavioural changes — becoming resistant, anxious, aggressive or withdrawn
- Recurrent minor injuries — soft tissue strains, splints, joint inflammation
- Dull coat, loss of muscle condition

Overtraining is a significant welfare issue. A horse cannot tell you it needs a rest day — it is the rider's and trainer's responsibility to build rest and recovery into the training programme.

## Recovery and Rest

Recovery needs depend on the individual horse, the work completed, fitness, age, previous condition, footing, travel, heat, hydration and veterinary advice. Build an individual plan with a qualified coach and, where health or conditioning is involved, a veterinary professional. Do not apply a generic calendar rule for rest after hacking, schooling, jumping or competition.

Rest does not automatically mean confinement in a stable. Discuss safe turnout, light activity or in-hand work with the people responsible for the horse, taking account of the horse’s condition and any veterinary restriction.

## Fitness and Conditioning

A horse must be conditioned gradually for the work it is expected to do, just like a human athlete:

1. **Establish a baseline** — Discuss the horse’s current condition, history and intended work with qualified professionals.
2. **Increase demands gradually** — Add duration, intensity, terrain or discipline-specific exercises one change at a time, observing the horse’s response.
3. **Review continuously** — Adapt or stop the plan when the horse shows fatigue, discomfort, illness, altered movement or behavioural concern.
4. **Vary responsibly** — Use appropriate variety and recovery rather than monotonous loading, while remaining within the horse’s current capacity.

A horse returning after time off, illness or injury needs an individual reconditioning plan. Do not resume a previous workload until a qualified professional has assessed readiness.

## Age and Individual Considerations

Young, mature and older horses can have very different developmental, health and conditioning needs. Workload decisions must account for the individual horse’s maturity, soundness, health history, training, management and veterinary advice; chronological age alone does not prescribe a safe programme.`,
    keyPoints: [
      "Fatigue signs include stumbling, heavy breathing, loss of impulsion and breaking gait — stop and rest if you see these",
      "Compare recovery with the horse’s individual baseline and seek veterinary advice if breathing, gait, demeanour or recovery concerns persist",
      "Overtraining is cumulative — declining performance, weight loss and behavioural changes are warning signs",
      "Set recovery and workload with qualified professionals; do not use a generic rest calendar for every horse",
      "Condition horses gradually for the level of work expected, especially after time off",
    ],
    safetyNote:
      "Never push a tired horse to continue working. A fatigued horse is more likely to stumble, fall or have a catastrophic tendon injury. If a horse is showing signs of heat stress (profuse sweating, rapid breathing, incoordination, lack of sweating in a horse that should be sweating), stop immediately, move to shade, apply cool water to the large blood vessels (neck, inner thighs) and call the vet.",
    practicalApplication:
      "Monitor each horse's fitness level and adjust the workload accordingly. Learn to take the heart rate after exercise to check recovery times. Keep a training diary recording the type and intensity of each session, rest days and any observations about the horse's condition. Discuss training plans with your instructor or trainer, and always advocate for the horse's welfare if you feel it is being asked to do too much.",
    commonMistakes: [
      "Pushing through fatigue signs instead of stopping and resting the horse",
      "Not building adequate rest days into the training schedule",
      "Resuming full work too quickly after a period of rest, risking injury",
      "Assuming a horse that does not complain is coping — horses are stoic and may not show distress until the damage is done",
      "Treating all horses the same regardless of age, fitness and individual limitations",
    ],
    knowledgeCheck: [
      {
        question:
          "What is a key indicator that a horse has been worked beyond its fitness level?",
        options: [
          "The horse sweats during exercise",
          "Recovery, breathing, gait or demeanour remains concerning when compared with the horse’s normal baseline",
          "The horse wants to canter",
          "The horse is hungry after exercise",
        ],
        correctIndex: 1,
        explanation:
          "Use the horse’s own documented baseline and the full clinical picture rather than a single generic number. Stop work and seek veterinary advice when recovery, breathing, gait or demeanour remains concerning.",
      },
      {
        question: "What is overtraining?",
        options: [
          "Training for more than one hour",
          "Cumulative fatigue from working too hard, too often, without adequate recovery",
          "Training in hot weather",
          "Working a horse in a discipline it does not enjoy",
        ],
        correctIndex: 1,
        explanation:
          "Overtraining is a cumulative condition resulting from excessive work without sufficient rest. It leads to declining performance, weight loss, susceptibility to illness and behavioural changes.",
      },
      {
        question:
          "How should a horse return to work after time off, illness or injury?",
        options: [
          "Follow an individual reconditioning plan agreed with qualified professionals",
          "Resume the previous workload immediately",
          "Start intense work to build fitness quickly",
          "Copy a generic programme without considering the horse’s history",
        ],
        correctIndex: 0,
        explanation:
          "A return-to-work programme must reflect the individual horse’s condition, reason for time off and professional advice. Do not use a one-size-fits-all timeline.",
      },
    ],
    aiTutorPrompts: [
      "How can I tell if my horse is becoming fatigued during a schooling session?",
      "What information should I take to a qualified coach or veterinary professional when discussing a return-to-work plan?",
      "What are the signs of overtraining and how should I respond?",
    ],
    linkedCompetencies: ["welfare_awareness"],
  },

  // ── Lesson 26 ─────────────────────────────────────────────────────────────
  {
    slug: "lameness-awareness",
    pathwaySlug: "horse-behaviour-welfare",
    title: "Lameness Awareness",
    level: "intermediate",
    category: "Horse Behaviour & Welfare",
    sortOrder: 6,
    objectives: [
      "Recognise observable changes in gait, stance or willingness to move",
      "Explain why lameness assessment and grading are veterinary tasks",
      "Identify when work must stop and veterinary advice is needed",
      "Record useful observations without attempting to diagnose or treat lameness",
    ],
    content: `Lameness is the most common reason for loss of performance and time off work in horses. It is defined as any alteration in the horse's normal gait caused by pain or mechanical dysfunction. The ability to recognise lameness, grade its severity and know when to involve the vet is an important intermediate-level skill.

## Observe, Record and Escalate

Lameness means a change from the horse’s normal way of moving, standing or willingness to move. It can arise from many different conditions, and observation alone cannot identify the cause. A learner’s role is to stop ridden or strenuous work, keep people safe and contact the responsible person and veterinary professional promptly.

Record what you observed without attempting to diagnose: when the change started; which activity was being done; whether movement, stance, behaviour, heat, swelling, wound or discharge was noticed; and whether the horse appears generally unwell. A veterinarian may ask for a controlled in-hand observation or other examination, but that should be performed only as they direct. Do not perform flexion tests, grade lameness, repeatedly circle or otherwise provoke movement in an effort to identify the cause.

## When to Seek Urgent Veterinary Advice

Seek urgent veterinary advice if a horse is unwilling or unable to bear weight, shows a sudden or marked change in movement, has a wound, heat, swelling or discharge associated with the concern, or appears generally unwell. If you are uncertain, treat the situation as a welfare concern and contact a veterinary professional rather than waiting for a generic interval.

While awaiting advice, do not force the horse to walk, trot, lunge or continue ridden work. Follow the veterinary practice’s emergency instructions and the yard’s safe-management procedure. Do not act independently until a veterinary professional has provided direction.

## Safe Observation Boundaries

A movement concern can be subtle, intermittent or obvious, but it is not made safer by repeated testing. Avoid the temptation to compare legs, manipulate joints, remove shoes, use force, or ask another person to reproduce the movement change. Those actions can increase discomfort, place people at risk and make it harder for the veterinary team to assess the original presentation. The responsible person should decide who handles the horse and how other horses, riders and members of the public are kept clear of the area.

If the horse must remain in a stable, field or other location while advice is obtained, use the current yard procedure for safe supervision, access and communication. Do not make confinement, turnout, bedding, transport or exercise changes based on a generic lesson. These decisions depend on the individual horse and the veterinary instruction received.

## Preparing a Useful Handover

A factual handover is more useful than a guessed diagnosis. Record when the concern was first noticed; what the horse was doing beforehand; whether the change was sudden or gradual; what was visibly different in movement, stance or behaviour; and whether there was any wound, heat, swelling, discharge or sign of general illness. State what has already been done only in factual terms, including that work was stopped and the responsible person was contacted.

When the veterinary practice responds, follow its questions and instructions exactly. If the horse’s condition changes while waiting, update the practice promptly. After the situation is resolved, the responsible person can decide whether the written health record, risk assessment or management plan needs review. This is how a careful learner contributes to welfare without crossing into clinical assessment.`,
    keyPoints: [
      "A change in gait, stance or willingness to move is a welfare concern, not a learner diagnosis task",
      "Record observations and contact the responsible person and veterinary professional promptly",
      "Do not use a lameness grade, a generic wait interval or repeated movement tests to decide whether care is needed",
      "Do not force a horse with a movement concern to continue work or testing",
      "A horse unwilling or unable to bear weight, or showing marked sudden change, needs urgent veterinary advice",
    ],
    safetyNote:
      "Do not undertake a lameness examination or provoke movement without veterinary direction. Keep people safe, stop work and follow the yard’s emergency procedure while obtaining veterinary advice. A horse in severe pain or distress should be handled only by appropriate experienced people following professional direction.",
    practicalApplication:
      "With an instructor, practise completing a concise observation record for a horse that appears uncomfortable: activity, time, changes in movement or behaviour, and any visible concern. Report observations before the horse is ridden and ask a veterinary professional to explain the practice’s safe assessment and escalation process.",
    commonMistakes: [
      "Continuing to ride or test a horse with an observed movement concern",
      "Trying to identify the cause by repeated trotting, circling or flexion tests without veterinary direction",
      "Using a generic grading scale or wait interval instead of seeking appropriate advice",
      "Acting independently before veterinary direction is provided",
      "Assuming an observation establishes the cause of the problem",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the appropriate learner response to a new change in gait, stance or willingness to move?",
        options: [
          "Stop ridden or strenuous work, record observations and seek appropriate veterinary advice",
          "Repeat movement tests until the cause is clear",
          "Continue work if the horse is willing",
          "Independently manage the concern without professional direction",
        ],
        correctIndex: 0,
        explanation:
          "Observation cannot establish the cause of lameness. Stop work, keep people safe, record what was observed and contact the responsible person and veterinary professional promptly.",
      },
      {
        question:
          "Which information is useful to record before contacting a veterinary professional about a movement concern?",
        options: [
          "When it started, the activity, observed changes and any visible heat, swelling, wound or discharge",
          "A self-assigned lameness grade only",
          "An independent management plan chosen by the learner",
          "Only the horse’s competition record",
        ],
        correctIndex: 0,
        explanation:
          "A concise factual observation record helps the veterinary team assess urgency and decide what they need next. Do not turn observations into a diagnosis.",
      },
      {
        question: "Which situation needs urgent veterinary advice?",
        options: [
          "A horse unwilling or unable to bear weight, or showing a marked sudden change in movement",
          "Only a concern that lasts for a generic number of days",
          "Only a concern in a competition horse",
          "Only a concern with visible blood",
        ],
        correctIndex: 0,
        explanation:
          "A horse that cannot bear weight or has a marked sudden movement change needs urgent veterinary advice. If you are uncertain, treat the situation as a welfare concern and seek professional guidance.",
      },
    ],
    aiTutorPrompts: [
      "What observations should I record if a horse’s movement changes?",
      "When should work stop and veterinary advice be sought for a movement concern?",
      "Why should I not diagnose or perform movement tests without veterinary direction?",
    ],
    linkedCompetencies: ["welfare_awareness", "stable_checks"],
  },

  // ── Lesson 27 ─────────────────────────────────────────────────────────────
  {
    slug: "welfare-based-decision-making",
    pathwaySlug: "horse-behaviour-welfare",
    title: "Welfare-Based Decision Making",
    level: "advanced",
    category: "Horse Behaviour & Welfare",
    sortOrder: 7,
    objectives: [
      "Explain the Five Freedoms and Five Domains of animal welfare",
      "Apply ethical reasoning to complex welfare decisions",
      "Understand when retirement or euthanasia may be in the horse's best interest",
      "Describe how welfare science informs modern equine management",
    ],
    content: `At the advanced level, equestrians must move beyond simply recognising welfare issues to making complex, ethical decisions about horse management. This requires a framework for thinking about welfare, an understanding of the science behind welfare assessment, and the emotional maturity to make difficult decisions when a horse's quality of life is in question.

## The Five Freedoms

The **Five Freedoms** were developed by the Farm Animal Welfare Council and have been widely adopted in equine welfare. They state that every animal should have:

1. **Freedom from hunger and thirst** — Access to fresh water and a diet that maintains full health and vigour.
2. **Freedom from discomfort** — An appropriate environment including shelter and a comfortable resting area.
3. **Freedom from pain, injury or disease** — Prevention or rapid diagnosis and treatment.
4. **Freedom to express normal behaviour** — Sufficient space, proper facilities and company of the animal's own kind.
5. **Freedom from fear and distress** — Conditions and treatment which avoid mental suffering.

These freedoms provide a minimum standard. Meeting all five does not guarantee good welfare — it means the horse is not suffering. True good welfare goes further: the horse should experience positive states, not merely the absence of negative ones.

## The Five Domains Model

The **Five Domains** model is a more modern and nuanced framework developed by Professor David Mellor. It recognises that welfare is not just about avoiding suffering but also about promoting positive experiences:

1. **Nutrition** — Is the horse receiving adequate, appropriate nutrition? Is it able to eat in a natural way?
2. **Environment** — Is the physical environment safe, comfortable and appropriate? Does it provide shelter, space and stimulation?
3. **Health** — Is the horse free from disease, injury and pain? Is preventive healthcare in place?
4. **Behavioural interactions** — Can the horse interact with other horses? Can it express natural behaviours? Does it have positive experiences with humans?
5. **Mental state** — What is the overall mental state of the horse? Is it content, engaged and comfortable, or anxious, frustrated and distressed?

The key insight of the Five Domains model is that the first four domains all feed into the fifth — the animal's mental state. The goal is not just to prevent suffering but to create conditions where the horse experiences a positive quality of life.

## Ethical Decision-Making

Equestrian decisions often involve competing interests: the rider's ambitions, the owner's finances, the horse's welfare, the trainer's reputation. Welfare-based decision-making puts the horse's interests first. Examples of difficult decisions include:

**Is this horse fit to compete?**
- A horse that is subtly lame, recovering from illness, or showing signs of stress should not be competed, regardless of the entry fee paid or the importance of the event.
- "He'll be fine once he warms up" is one of the most dangerous phrases in equestrianism. If a horse is not sound before work, it should not work.

**Is this horse suitable for this purpose?**
- Not every horse is suited to every job. A horse that is consistently anxious, in pain or struggling with the demands of its work may need a change of job, not more training.

**Should this horse be retired?**
- Retirement is a positive welfare decision when a horse can no longer work comfortably due to age, chronic pain, injury or disease. A retired horse can live a fulfilling life at grass with companions, provided its ongoing needs (dental care, farrier, veterinary attention, appropriate feeding) are met.
- Retirement should never be an excuse for neglect. A horse in a field still needs care.

**When is euthanasia the right decision?**
- This is the hardest decision any horse owner faces. Euthanasia is the right decision when a horse's quality of life has deteriorated to the point where suffering outweighs any positive experiences, and treatment or management cannot improve the situation.
- Factors to consider: Is the horse in chronic, unmanageable pain? Can it eat, drink and move comfortably? Does it show interest in its environment and companions? Has veterinary advice confirmed that the prognosis is poor?
- Euthanasia is an act of compassion, not failure. Allowing a horse to suffer because an owner cannot face the decision is a welfare failing.

## Welfare Assessment in Practice

Modern welfare assessment combines:
- **Physical measures** — Body condition score, TPR, lameness assessment, dental health
- **Behavioural measures** — Activity levels, social interactions, stereotypic behaviours, responsiveness
- **Environmental measures** — Housing quality, turnout access, companionship, nutrition
- **Outcome-based measures** — What is the actual experience of the horse, not just the resources provided?

Regular, honest welfare assessment — ideally involving an objective third party such as a vet or welfare advisor — helps prevent the gradual normalisation of poor welfare, where small deteriorations go unnoticed over time.`,
    keyPoints: [
      "The Five Freedoms provide a minimum welfare standard; the Five Domains model also promotes positive experiences",
      "Welfare-based decisions always prioritise the horse's quality of life over human ambition or convenience",
      "Retirement is a positive welfare decision when managed properly — retired horses still need ongoing care",
      "Euthanasia is an act of compassion when suffering cannot be managed and quality of life is poor",
      "Regular welfare assessment prevents the gradual normalisation of poor welfare",
    ],
    safetyNote:
      "Welfare decisions, particularly around euthanasia and retirement, should always involve veterinary advice. Do not make these decisions alone or under emotional pressure. If you have concerns about any horse's welfare — whether it is in your care or someone else's — speak to a vet, an appropriate welfare charity, your local authority, or a trusted mentor. Reporting a welfare concern is not disloyalty; it is advocacy for an animal that cannot speak for itself.",
    practicalApplication:
      "Apply the Five Domains framework to a horse in your care. For each domain, assess whether the horse's needs are being met and whether there are opportunities to improve its experience. Discuss your assessment with your instructor or yard manager. If you observe a horse whose welfare may be compromised — anywhere, not just on your own yard — know the process for reporting concerns: contact an appropriate welfare charity or your local authority.",
    commonMistakes: [
      "Confusing the absence of suffering with positive welfare — a horse can be free from pain but still have poor welfare if it lacks companionship, space or mental stimulation",
      "Allowing personal attachment to prevent a necessary euthanasia decision, prolonging suffering",
      "Assuming retirement means the horse needs no further care — retired horses need dental, farrier and veterinary attention",
      "Ignoring welfare concerns in others' horses because 'it is not my business'",
      "Making welfare decisions based on cost rather than the horse's needs",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the main difference between the Five Freedoms and the Five Domains model?",
        options: [
          "The Five Domains apply only to competition horses",
          "The Five Freedoms focus on preventing suffering; the Five Domains also promote positive experiences",
          "The Five Domains are less scientific",
          "The Five Freedoms are more modern",
        ],
        correctIndex: 1,
        explanation:
          "The Five Freedoms aim to prevent suffering (freedom from hunger, pain, distress, etc.). The Five Domains model goes further by also considering positive mental states and quality of life, not just the absence of negative experiences.",
      },
      {
        question:
          "When is euthanasia considered a compassionate welfare decision?",
        options: [
          "When the horse is old and no longer useful for riding",
          "When treatment costs exceed the horse's monetary value",
          "When the horse's suffering cannot be managed and its quality of life is poor",
          "When the owner wants a different horse",
        ],
        correctIndex: 2,
        explanation:
          "Euthanasia is a compassionate act when a horse's quality of life has deteriorated to the point where suffering outweighs any positive experiences and cannot be improved by treatment or management.",
      },
      {
        question:
          "What does 'freedom to express normal behaviour' include for horses?",
        options: [
          "Being able to canter at any time",
          "Sufficient space, facilities, and company of other horses",
          "Being ridden every day",
          "Having a varied diet of different feeds",
        ],
        correctIndex: 1,
        explanation:
          "Normal behaviours for horses include grazing, socialising with other horses, moving freely and resting. Providing space, companions and appropriate facilities allows these behaviours.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain the Five Domains model and how I can apply it to assess a horse's welfare?",
      "How do I know when a horse should be retired from work?",
      "What factors should I consider when making a difficult welfare decision about a horse in poor health?",
    ],
    linkedCompetencies: ["welfare_awareness", "risk_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 5 — Tack & Equipment
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Lesson 28 ─────────────────────────────────────────────────────────────
  {
    slug: "basic-tack-identification",
    pathwaySlug: "tack-equipment",
    title: "Basic Tack Identification",
    level: "beginner",
    category: "Tack & Equipment",
    sortOrder: 1,
    objectives: [
      "Identify and name the main parts of a general-purpose saddle",
      "Identify and name the main parts of a snaffle bridle",
      "Explain the function of each piece of tack",
      "Understand the difference between a saddle, bridle and headcollar",
    ],
    content: `Tack is the term for the equipment used on a horse for riding and handling. The two primary pieces of tack are the saddle and the bridle. Understanding what each part is called, what it does and how it fits is fundamental to safe riding and horse welfare.

## Parts of the Saddle

A **general-purpose (GP) saddle** is the most common type of saddle for everyday riding. Its parts are:

- **Pommel** — The front arch of the saddle, above the withers. It should clear the horse's withers with approximately three fingers' width when the rider is mounted.
- **Cantle** — The raised back of the saddle seat, providing security and preventing the rider from sliding backward.
- **Seat** — The padded central area where the rider sits. The deepest point of the seat should be in the centre, not tipped forward or backward.
- **Waist** — The narrowest part of the seat between the pommel and cantle.
- **Saddle flap** — The large panel on each side that covers the girth straps and stirrup bars. The rider's legs rest against the saddle flaps.
- **Knee roll** — A padded roll at the front of the saddle flap that helps keep the rider's knee in the correct position.
- **Stirrup bar** — A hinged metal bar attached to the saddle tree (hidden beneath the flap) from which the stirrup leather hangs. The safety catch on the stirrup bar should always be **down** (open) so the stirrup leather can slide free if the rider falls.
- **Stirrup leather** — The adjustable strap that hangs from the stirrup bar and holds the stirrup iron.
- **Stirrup iron** — The metal foot rest. Its fit must be assessed with the rider’s boot, current equipment, manufacturer guidance and applicable safety standard; it must not trap the foot or allow it to pass through.
- **Girth** — The broad strap that passes under the horse's belly to hold the saddle in place. Available in leather, synthetic materials or string (cord). Fastens to girth straps on both sides of the saddle.
- **Girth straps (billets)** — Three straps hanging from each side of the saddle tree. Typically the first and third (or first and second) are used.
- **Panel** — The padded underside of the saddle that distributes the rider's weight over the horse's back. Should be evenly stuffed and smooth.
- **Gullet** — The channel running down the centre of the underside of the saddle. It must be wide enough to clear the horse's spine — the saddle should never press on the spine.
- **Numnah or saddle cloth** — A pad placed under the saddle to absorb sweat and provide a thin layer of cushioning. It must be pulled up into the gullet to avoid pressing on the withers.

## Parts of the Bridle

A standard **snaffle bridle** consists of:

- **Headpiece** — The main strap that goes over the horse's poll (behind the ears) and supports the entire bridle.
- **Browband** — The strap across the horse's forehead, keeping the headpiece from sliding backward. Should sit just below the ears without pressing on them.
- **Throatlash** — A strap attached to the headpiece that fastens under the throat. Prevents the bridle from being pulled forward over the ears. Fitting: one fist's width between strap and jaw.
- **Cheekpieces** — Two straps running down each side of the face from the headpiece to the bit rings. Adjustable to raise or lower the bit in the horse's mouth.
- **Noseband** — A strap around the horse's nose. The most common type is the **cavesson noseband**, which sits approximately two fingers' width below the cheekbone. It helps keep the mouth closed and provides an attachment point for certain training aids. Fitting: two fingers between the noseband and the face.
- **Bit** — The metal mouthpiece that sits in the horse's mouth, resting on the bars (the gum between the front and back teeth). The most common type for beginners is the **single-jointed snaffle** or the **French-link snaffle**.
- **Reins** — The straps running from the bit rings to the rider's hands, providing communication between rider and horse. Types include plain leather, rubber-covered, plaited and laced.

## The Headcollar

A **headcollar** (called a halter in some countries) is used for leading, tying up and handling. It has no bit and fits over the horse's nose and behind the ears. It provides control without acting on the mouth. Always use a headcollar with a lead rope — never lead a horse by the headcollar alone.

## Why Identification Matters

Knowing the name and function of each piece of tack allows you to:
- Communicate clearly with instructors, saddlers and other riders
- Check that tack is fitted correctly and safely
- Identify worn or damaged parts that need repair or replacement
- Understand how each piece contributes to the horse's comfort and the rider's control`,
    keyPoints: [
      "The pommel must clear the withers by three fingers' width when the rider is mounted",
      "The stirrup bar safety catch must always be down (open) so the leather can release if the rider falls",
      "The gullet must clear the horse's spine — the saddle should never press on the backbone",
      "The throatlash allows a fist's width; the noseband allows two fingers' width",
      "The bit rests on the bars of the mouth and should create one to two wrinkles at the corners",
    ],
    safetyNote:
      "Before every ride, check that the stirrup bar safety catch is in the open (down) position. If it is up (closed), the stirrup leather cannot release in a fall, and the rider may be dragged. Check all stitching on stirrup leathers, girth straps and reins — worn stitching can fail suddenly under load, with catastrophic consequences. Never ride with cracked, dried-out leather that has not been cleaned and conditioned.",
    practicalApplication:
      "Spend time in the tack room handling each piece of tack, naming each part and explaining its function to yourself or a fellow student. When tacking up, check each component as you fit it. Ask your instructor to quiz you on tack identification — it is a common topic in stable management assessments and practical exams.",
    commonMistakes: [
      "Confusing the pommel (front of saddle) with the cantle (back of saddle)",
      "Not checking that the stirrup bar safety catch is open before riding",
      "Fitting the noseband too tightly, restricting the horse's breathing and jaw movement",
      "Not knowing which girth straps to use and fastening to the wrong ones",
      "Confusing the headcollar with the bridle and attempting to ride in a headcollar",
    ],
    knowledgeCheck: [
      {
        question: "What is the function of the stirrup bar safety catch?",
        options: [
          "It keeps the stirrup leather at the correct length",
          "It locks the stirrup iron in place for mounting",
          "When open (down), it allows the stirrup leather to release if the rider falls, preventing dragging",
          "It adjusts the width of the stirrup iron",
        ],
        correctIndex: 2,
        explanation:
          "The stirrup bar safety catch, when in the open (down) position, allows the stirrup leather to slide free from the bar if the rider falls. This prevents the rider from being dragged by a caught stirrup.",
      },
      {
        question: "What does the gullet of a saddle do?",
        options: [
          "It holds the girth in place",
          "It is a decorative feature",
          "It provides a channel that clears the horse's spine so the saddle never presses on it",
          "It adjusts the saddle's balance",
        ],
        correctIndex: 2,
        explanation:
          "The gullet is the channel running down the centre underside of the saddle. It must be wide enough to ensure the saddle never contacts the horse's spine, which would cause pain and back damage.",
      },
      {
        question: "Where does the bit sit in the horse's mouth?",
        options: [
          "On the tongue only",
          "On the bars — the gum between the front teeth and the back teeth",
          "Against the front teeth",
          "On the roof of the mouth",
        ],
        correctIndex: 1,
        explanation:
          "The bit rests on the bars of the mouth — the area of gum between the incisors (front teeth) and the molars (back teeth). This area has no teeth, allowing the bit to sit comfortably.",
      },
    ],
    aiTutorPrompts: [
      "Can you quiz me on the parts of the saddle?",
      "What are all the parts of a snaffle bridle and what does each do?",
      "How do I check that a saddle and bridle are safe to use before riding?",
    ],
    linkedCompetencies: ["tack_identification"],
  },

  // ── Lesson 29 ─────────────────────────────────────────────────────────────
  {
    slug: "putting-on-a-headcollar",
    pathwaySlug: "tack-equipment",
    title: "Putting On a Headcollar",
    level: "beginner",
    category: "Tack & Equipment",
    sortOrder: 2,
    objectives: [
      "Demonstrate the correct procedure for putting on a headcollar",
      "Explain how to check the fit of a headcollar",
      "Describe safe practices when approaching a horse to fit a headcollar",
      "Understand when to use a headcollar versus other restraint options",
    ],
    content: `The headcollar is the most frequently used piece of equipment on any yard. Every time you catch, lead, tie up, groom or handle a horse, you will use a headcollar. Fitting one correctly, quickly and safely is an essential skill that you will use multiple times every day.

## Anatomy of a Headcollar

A standard headcollar consists of:
- **Headpiece** — Goes over the poll behind the ears. Has a buckle on the near (left) side for fastening and adjustment.
- **Noseband** — The band around the horse's nose. Sits approximately halfway between the eyes and the nostrils.
- **Cheekpieces** — Connect the headpiece to the noseband on each side.
- **Throatlash** — A strap running from the cheekpiece under the throat (on some designs, the headpiece and throatlash are combined).
- **Back strap** — The strap connecting the cheekpiece to the headpiece on the off (right) side. On some headcollars, this is a fixed ring rather than a strap.
- **Lead rope attachment ring** — A metal ring under the chin for clipping the lead rope. This is always positioned under the jaw, not on the side.

## Procedure for Fitting a Headcollar

### In the Stable

1. **Prepare** — Have the headcollar ready with the buckle undone and the lead rope attached. Loop the excess lead rope over your arm (not wrapped around it).
2. **Approach** — Speak to the horse and approach the shoulder at a 45-degree angle. Let the horse see and smell you.
3. **Position** — Stand at the horse's near shoulder, facing the same direction as the horse.
4. **Rope around the neck** — Pass the lead rope over the horse's neck as a temporary restraint. This gives you control while you fit the headcollar, so the horse cannot walk away.
5. **Present the noseband** — Hold the headcollar open with the noseband in your left hand. Use your right hand to guide the noseband over the horse's muzzle and up the face.
6. **Lift the headpiece** — With your right hand, take the headpiece and lift it over the horse's ears, one ear at a time, gently.
7. **Fasten the buckle** — Fasten the buckle on the near side. The fit should allow two fingers between the noseband and the horse's face, and one fist's width at the throatlash.
8. **Remove the rope from the neck** — Bring the lead rope down from the neck so it hangs from the chin ring normally.

### In the Field

The procedure is the same, but with additional considerations:
- Approach calmly and let the horse come to you if possible.
- If the horse is difficult to catch, do not chase it. Walk slowly, avoid direct eye contact (which can be confrontational) and offer a treat in a flat hand.
- Put the headcollar on before attempting to lead the horse to the gate.
- Never grab a loose horse by the forelock or mane to hold it while fitting the headcollar — this is unreliable and puts you in a vulnerable position near the horse's front feet.

## Checking the Fit

A correctly fitted headcollar:
- Sits approximately two fingers below the cheekbone on the noseband
- Allows two fingers between the noseband and the face — too tight restricts breathing; too loose may slide off or catch on something
- Has the headpiece sitting comfortably behind the ears without rubbing
- Does not pull the eye area or press on the facial bones
- Is not so loose that the horse could get a foot through it if it drops its head to graze while tied up

## Types of Headcollar

- **Nylon/webbing** — Most common. Available in adjustable sizes. Durable and washable. Will not break under pressure, so must always be used with baler twine when tying up.
- **Leather** — Traditional and smart. Will break under extreme pressure, providing a natural safety release. More expensive and requires maintenance.
- **Padded** — Extra padding on the noseband and headpiece for sensitive horses or for travel.
- **Foal slip** — A small, lightweight headcollar for foals, often with a leather crown that will break under pressure to prevent entrapment injuries.
- **Controller or pressure headcollar** — Provides additional control for strong or difficult horses. Should only be used by experienced handlers.

## Safety Considerations

- **Never leave a headcollar on a horse in the field.** If the horse rolls, grazes or scratches, the headcollar can catch on fencing, branches or even the horse's own hind foot, causing panic and serious injury. Many horses have been found trapped and injured, or even died, from headcollars caught on objects in the field.
- The only exception is a leather "field-safe" headcollar that is designed to break under pressure, but even this carries risk.
- When tying up, always tie to baler twine with a quick-release knot.`,
    keyPoints: [
      "Always put the lead rope around the horse's neck first for temporary control before fitting the headcollar",
      "The noseband should allow two fingers' width between it and the horse's face",
      "Never leave a headcollar on a horse turned out in the field — it can catch and trap the horse",
      "Hold the headcollar open and guide the noseband over the muzzle before lifting the headpiece over the ears",
      "Nylon headcollars will not break under pressure — always use baler twine as a breakaway when tying",
    ],
    safetyNote:
      "Never chase a horse in a field to catch it. A galloping horse in a confined space is extremely dangerous. If a horse will not be caught, seek advice from experienced staff. Never leave a headcollar on an unattended horse in a field, as it can become entangled and cause injury or death. When putting the headcollar over the ears, be gentle — some horses are ear-shy and may throw their head up violently if the ears are handled roughly.",
    practicalApplication:
      "Practise putting on and removing a headcollar quickly and calmly until you can do it with confidence. Time yourself — with practice, it should take less than 30 seconds. Learn to put the headcollar on from both the near and off sides, as you may not always be able to approach from the left. After removing a headcollar, hang it on the stable door or designated hook, buckle fastened, ready for next use.",
    commonMistakes: [
      "Not putting the lead rope around the neck first, allowing the horse to walk away during fitting",
      "Pulling the headcollar roughly over the ears, making the horse head-shy",
      "Leaving a headcollar on a horse in the field, creating an entanglement risk",
      "Fitting the noseband too tightly, restricting the horse's breathing and comfort",
      "Using a damaged headcollar with frayed webbing or a broken buckle",
    ],
    knowledgeCheck: [
      {
        question:
          "Why should you put the lead rope around the horse's neck before fitting the headcollar?",
        options: [
          "To warm the horse's neck",
          "To provide temporary control so the horse cannot walk away",
          "To check the horse's pulse",
          "It is not necessary",
        ],
        correctIndex: 1,
        explanation:
          "Looping the lead rope over the horse's neck gives you a degree of control while both hands are occupied fitting the headcollar. Without it, the horse can simply walk away.",
      },
      {
        question:
          "Why must you never leave a headcollar on a horse in the field?",
        options: [
          "It gets dirty",
          "Other horses will chew it",
          "It can catch on fencing, branches or the horse's own hoof, causing entrapment, panic and injury",
          "The horse does not like wearing it",
        ],
        correctIndex: 2,
        explanation:
          "A headcollar left on in the field can catch on fences, trees, water troughs or even the horse's own hind foot when scratching. Trapped horses can panic, sustain serious injuries or die.",
      },
      {
        question:
          "How much clearance should there be between the noseband and the horse's face?",
        options: [
          "No gap — it should be snug",
          "One finger's width",
          "Two fingers' width",
          "A fist's width",
        ],
        correctIndex: 2,
        explanation:
          "Two fingers should fit comfortably between the noseband and the horse's face. This ensures the headcollar is secure without being too tight (restricting breathing) or too loose (risk of sliding off or catching).",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through the complete procedure for putting on a headcollar?",
      "What should I do if a horse is difficult to catch in the field?",
      "What are the different types of headcollar and when would I use each?",
    ],
    linkedCompetencies: ["tack_identification", "leading_safely"],
  },

  // ── Lesson 30 ─────────────────────────────────────────────────────────────
  {
    slug: "tack-care-cleaning",
    pathwaySlug: "tack-equipment",
    title: "Tack Care & Cleaning",
    level: "developing",
    category: "Tack & Equipment",
    sortOrder: 3,
    objectives: [
      "Explain why regular tack cleaning is important for safety and longevity",
      "Describe the step-by-step process for cleaning leather tack",
      "Identify the difference between saddle soap and leather conditioner",
      "Understand how to store tack correctly to prolong its life",
    ],
    content: `Tack care is not just about keeping equipment looking smart — it is a safety-critical task. Leather that is dry, cracked or weakened by dirt and sweat can fail without warning. A snapped stirrup leather, a broken girth strap or a rein that gives way mid-ride can have catastrophic consequences. Regular cleaning also gives you the opportunity to inspect every part of the tack for wear, damage and early signs of failure.

## Why Clean Tack?

1. **Safety** — Dirty, dry leather becomes brittle and can snap under load. The areas most at risk are stitching on stirrup leathers, girth straps, reins and cheekpieces. Cleaning allows you to check these stress points regularly.
2. **Comfort** — Dried sweat and grease build up on the underside of the bridle and girth, causing rubbing and skin irritation on the horse. Clean tack prevents sores and discomfort.
3. **Longevity** — Properly maintained leather tack can last for decades. Neglected leather dries out, cracks and becomes unsafe in a fraction of that time.
4. **Hygiene** — Tack harbours bacteria and fungal spores. Regular cleaning reduces the risk of skin infections, particularly in shared tack used by multiple horses.

## Equipment Needed

- A bucket of warm water (not hot — hot water damages leather)
- A sponge
- Saddle soap (glycerine-based, available in bar or liquid form)
- Leather conditioner or leather balsam (used less frequently to deeply nourish the leather)
- A clean, dry cloth
- A small brush (an old toothbrush works well for buckle holes and hard-to-reach areas)
- Metal polish for stirrup irons and bit (optional but recommended)

## Step-by-Step Cleaning Process

### Bridle Cleaning

1. **Dismantle the bridle** — Undo the buckles and take the bridle apart. If you are unfamiliar with bridle assembly, lay the parts out in order or take a photograph before dismantling.
2. **Wash the bit** — Rinse the bit under warm running water and scrub with a brush to remove all residue. Bits should be cleaned after every ride.
3. **Wipe down leather** — Use a damp sponge to wipe all dirt, sweat and grease from each strap. Pay attention to the underside of the noseband, the browband and the areas around buckle holes.
4. **Apply saddle soap** — Using a barely damp sponge, work the saddle soap into the leather on both sides. The sponge should not be dripping wet — excess water damages leather. Work the soap in with circular motions.
5. **Check for damage** — As you clean each piece, inspect the stitching, buckle holes, leather surface and metal fittings. Look for cracks, stretched holes, worn stitching and corroded buckles.
6. **Reassemble** — Put the bridle back together, ensuring all buckles are fastened correctly and the bit hangs at the right height.

### Saddle Cleaning

1. **Remove the girth, stirrup leathers and stirrup irons.**
2. **Wipe the saddle** with a damp sponge, removing dirt and sweat from the seat, flaps, panels and girth area.
3. **Apply saddle soap** to all leather surfaces with a barely damp sponge, working in circular motions.
4. **Check the panels** — Feel the underside for lumps, uneven stuffing or hardened areas.
5. **Check the tree** — Press down on the pommel and cantle with one hand on each. The saddle should have a slight give but should not flex or creak. A broken tree (the internal frame) makes the saddle unsafe and uncomfortable.
6. **Clean the girth** — Leather girths should be cleaned like the rest of the tack. Synthetic girths can be washed according to manufacturer instructions. String girths should be scrubbed and dried thoroughly.
7. **Clean stirrup irons** — Remove the treads and wash the irons in warm water. Polish if desired.

## Saddle Soap vs Leather Conditioner

- **Saddle soap** — Cleans the leather surface, removing dirt and sweat, and provides a light protective layer. Used every time you clean the tack.
- **Leather conditioner (balsam, oil, or cream)** — Deeply nourishes the leather, replacing natural oils lost through use and exposure. Used less frequently — typically once a week or fortnightly, depending on how often the tack is used. Over-conditioning can make leather too soft and stretchy, weakening it.

## Storage

- **Saddle** — Store on a saddle rack or sturdy saddle horse in a dry, well-ventilated tack room. Cover with a saddle cover to protect from dust.
- **Bridle** — Hang on a rounded bridle bracket (not a narrow hook or nail, which distorts the headpiece). Fasten the throatlash and noseband to keep the shape.
- **General** — Keep the tack room dry and at a stable temperature. Damp causes mould; extreme heat dries leather. Never store tack in direct sunlight, which bleaches and cracks leather.`,
    keyPoints: [
      "Tack cleaning is a safety inspection — check stitching, buckle holes and leather condition every time you clean",
      "Use a barely damp sponge with saddle soap; excess water damages leather",
      "Saddle soap cleans and lightly protects; leather conditioner deeply nourishes — do not over-condition",
      "A broken saddle tree makes the saddle unsafe — check by pressing on the pommel and cantle",
      "Store tack in a dry, well-ventilated tack room away from direct sunlight and damp",
    ],
    safetyNote:
      "If you find cracked leather, worn stitching, stretched buckle holes or a broken saddle tree during cleaning, do not use that piece of tack. Label it clearly as 'not safe for use' and inform the yard manager. A snapped stirrup leather, girth or rein during riding can cause a serious accident. Tack inspection during cleaning is your first line of defence against equipment failure.",
    practicalApplication:
      "Develop a habit of cleaning your tack after every ride, or at minimum once a week. Start with a quick wipe-down after each ride (5 minutes) and a thorough clean at the weekend (20–30 minutes for saddle and bridle). Record any wear or damage and bring it to the attention of the yard manager. If you ride in a riding school, volunteer to help with tack cleaning — it is an excellent way to learn and develop your skills.",
    commonMistakes: [
      "Using too much water when cleaning, which soaks and damages the leather",
      "Not cleaning the underside of the tack, where sweat and grease accumulate",
      "Forgetting to check stitching and buckle holes during cleaning",
      "Over-conditioning the leather, making it soft and stretchy",
      "Storing tack in damp or poorly ventilated rooms, causing mould and deterioration",
    ],
    knowledgeCheck: [
      {
        question: "Why is tack cleaning considered a safety task?",
        options: [
          "Clean tack looks better in competitions",
          "It gives you the opportunity to inspect every piece for wear, damage and failing stitching",
          "Dirty tack makes horses misbehave",
          "Insurance requires daily tack cleaning",
        ],
        correctIndex: 1,
        explanation:
          "Tack cleaning is an opportunity to inspect every strap, buckle, stitch and fitting for wear and damage. Finding a problem during cleaning prevents a failure during riding.",
      },
      {
        question:
          "What is the difference between saddle soap and leather conditioner?",
        options: [
          "They are the same thing",
          "Saddle soap cleans and lightly protects; conditioner deeply nourishes the leather",
          "Saddle soap is for saddles; conditioner is for bridles",
          "Conditioner cleans and saddle soap conditions",
        ],
        correctIndex: 1,
        explanation:
          "Saddle soap is used every time you clean to remove dirt and provide a light protective layer. Leather conditioner is used less frequently to deeply nourish and restore moisture to the leather.",
      },
      {
        question: "How do you check a saddle tree for damage?",
        options: [
          "Lift the saddle above your head and listen for creaking",
          "Press down on the pommel and cantle simultaneously — it should have slight give but not flex or creak abnormally",
          "Check the colour of the leather",
          "Weigh the saddle — a broken tree makes it lighter",
        ],
        correctIndex: 1,
        explanation:
          "Place one hand on the pommel and one on the cantle and press toward each other. A healthy tree has a slight give but holds its shape. A broken tree may flex significantly, creak or feel unstable. A broken tree makes the saddle unsafe.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through the complete process for cleaning a bridle?",
      "How often should I use leather conditioner versus saddle soap?",
      "What signs of damage should I look for during tack cleaning?",
    ],
    linkedCompetencies: ["tack_care"],
  },

  // ── Lesson 31 ─────────────────────────────────────────────────────────────
  {
    slug: "fitting-a-saddle",
    pathwaySlug: "tack-equipment",
    title: "Fitting a Saddle",
    level: "developing",
    category: "Tack & Equipment",
    sortOrder: 4,
    objectives: [
      "Explain the importance of correct saddle fit for horse welfare and rider performance",
      "Describe the key checks for assessing saddle fit",
      "Understand the role of a qualified saddle fitter",
      "Recognise signs that a saddle may not fit correctly",
    ],
    content: `A poorly fitting saddle is one of the most common causes of back pain, behavioural problems and poor performance in horses. The saddle must distribute the rider's weight evenly over the horse's back without creating pressure points, restricting movement or causing pain. Every rider should understand the basics of saddle fit, even though professional saddle fitting should always involve a qualified saddler.

## Why Saddle Fit Matters

The horse's back is not designed to carry weight. In the wild, nothing sits on a horse's back except rain. The saddle's job is to spread the rider's weight as evenly as possible over the large muscle groups on either side of the spine, avoiding bony prominences, sensitive areas and the spine itself.

A poorly fitting saddle can cause:
- **Pain and muscle tension** in the back, leading to resistance, bucking, napping or reluctance to go forward
- **White hairs** — Permanent white patches where pressure has damaged hair follicles (the hair regrows white)
- **Muscle atrophy** — Wasting of the muscles under the saddle due to pressure restricting blood flow
- **Saddle sores** — Open wounds or galls caused by friction
- **Behavioural changes** — A horse that was previously well-behaved may become difficult, cold-backed (dipping or flinching when the saddle is placed on its back), or reluctant to be tacked up
- **Reduced performance** — The horse cannot use its back freely, limiting impulsion, engagement and suppleness

## Basic Saddle Fit Checks

While a professional saddle fitter should assess fit regularly, these checks help you identify obvious problems:

### 1. Wither Clearance
When the saddle is on the horse's back (without a numnah initially), you should be able to fit **three fingers vertically** between the top of the pommel and the horse's withers. When the rider is mounted, there should still be at least **two fingers' clearance**. If the pommel sits on the withers, the saddle is too wide or too low. If there is excessive clearance, the saddle may be too narrow.

### 2. Gullet Clearance
Look down the gullet from behind. You should see clear daylight — the gullet should not touch the horse's spine at any point. The gullet should be at least **3–4 fingers wide** to ensure the spine is not compressed.

### 3. Panel Contact
The panels (the padded underside of the saddle) should make even contact with the horse's back along their entire length. There should be no **bridging** (where the panels only contact at the front and back, with a gap in the middle) and no **rocking** (where the saddle sits on the middle and lifts at the front and back).

### 4. Balance
When viewed from the side, the saddle should sit level. The lowest point of the seat should be in the centre, not tipped forward (rider slides to the front) or backward (rider slides to the back). A level saddle allows the rider to sit in the correct position naturally.

### 5. Shoulder Freedom
The saddle must not sit on or over the horse's shoulder blade (scapula). Place your hand flat under the front of the saddle at the point of the shoulder — there should be enough room for the shoulder to move freely without being pinched. If the saddle restricts the shoulder, the horse's stride will be shortened and uncomfortable.

### 6. Symmetry
Look at the saddle from behind. Both panels should be evenly stuffed and make equal contact. An asymmetric saddle causes the rider to sit crooked and puts uneven pressure on the horse's back.

## The Numnah

A numnah or saddle pad is not a solution for a poorly fitting saddle. Its purpose is to absorb sweat and provide a thin layer of cushioning. Adding thick pads to compensate for a saddle that is too wide or has insufficient stuffing creates additional pressure on the withers. Always pull the numnah up into the gullet at the front to avoid pressing on the withers.

## When to Call a Saddle Fitter

- At intervals determined by the qualified fitter, the horse’s current shape, workload, tack condition and any signs of discomfort
- If the horse has gained or lost weight significantly
- If the horse has changed shape (e.g., muscled up through work, or lost muscle through time off)
- If you notice dry spots, sweat patches, white hairs or sore areas under the saddle after riding
- If the horse's behaviour has changed — becoming resistant, cold-backed or reluctant to work
- If the saddle visibly moves or slips during riding

A qualified saddle fitter (look for Society of Master Saddlers or equivalent qualification) can assess, adjust and reflock the saddle to improve the fit.`,
    keyPoints: [
      "A poorly fitting saddle causes pain, white hairs, muscle atrophy and behavioural problems",
      "Pommel, wither and spinal clearance require qualified assessment in the horse’s current ridden and unmounted context; do not use copied finger-count rules",
      "The gullet must provide suitable spinal clearance as assessed by a qualified fitter and current manufacturer guidance",
      "The panels should make even contact with no bridging or rocking",
      "A numnah is not a fix for a badly fitting saddle — professional fitting is essential",
      "Have the saddle assessed by a qualified fitter whenever the horse, rider, workload, tack condition or comfort indicators warrant review",
    ],
    safetyNote:
      "Never ride in a saddle that is obviously too big, too small, too wide or too narrow for the horse. A saddle that rocks, slips or sits on the withers is unsafe and causing the horse pain. If you suspect a saddle fit problem, stop riding in that saddle and seek professional advice. Riding in pain causes the horse to compensate with abnormal movement, which can lead to secondary injuries.",
    practicalApplication:
      "Before every ride, do a quick saddle fit check: wither clearance, gullet clearance, level balance. After riding, check the sweat pattern under the numnah — it should be even on both sides. Dry spots indicate pressure points where blood flow was restricted. Report any concerns to the yard manager or owner. If you are buying or borrowing a saddle, always have it professionally fitted to the specific horse that will wear it.",
    commonMistakes: [
      "Using thick pads to compensate for a poorly fitting saddle, which worsens the pressure",
      "Not checking wither clearance when the rider is mounted, only unmounted",
      "Ignoring dry spots or uneven sweat patterns under the saddle after riding",
      "Assuming a saddle that fitted last year still fits — horses change shape with work and season",
      "Placing the saddle too far forward over the shoulder, restricting movement",
    ],
    knowledgeCheck: [
      {
        question:
          "How much wither clearance should there be with the rider mounted?",
        options: [
          "No clearance — the pommel should rest on the withers",
          "One finger",
          "At least two fingers",
          "A fist's width",
        ],
        correctIndex: 2,
        explanation:
          "There should be at least two fingers' clearance between the pommel and the withers when the rider is mounted. Less than this indicates the saddle is sitting on the withers, causing pain and damage.",
      },
      {
        question: "What do white hairs under the saddle area indicate?",
        options: [
          "The horse is changing colour naturally",
          "The horse has been groomed too vigorously",
          "Previous pressure damage from a poorly fitting saddle",
          "The horse has been out in the sun too much",
        ],
        correctIndex: 2,
        explanation:
          "White hairs in the saddle area indicate that past pressure has damaged the hair follicles, causing the hair to regrow white. This is a permanent sign of previous poor saddle fit.",
      },
      {
        question: "What is 'bridging' in saddle fit?",
        options: [
          "The saddle sits too far forward",
          "The panels only contact at the front and back, with a gap in the middle",
          "The gullet is too narrow",
          "The saddle is too long for the horse's back",
        ],
        correctIndex: 1,
        explanation:
          "Bridging occurs when the saddle panels make contact at the front and rear but not in the middle, creating a gap. This concentrates pressure at two points instead of spreading it evenly.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through the basic checks for saddle fit?",
      "What signs tell me a saddle is not fitting my horse correctly?",
      "How does poor saddle fit affect a horse's behaviour and performance?",
    ],
    linkedCompetencies: ["tacking_up_correctly", "tack_identification"],
  },

  // ── Lesson 32 ─────────────────────────────────────────────────────────────
  {
    slug: "bit-selection-basics",
    pathwaySlug: "tack-equipment",
    title: "Bit Selection Basics",
    level: "intermediate",
    category: "Tack & Equipment",
    sortOrder: 5,
    objectives: [
      "Describe the main snaffle bit families and their actions",
      "Explain how different mouthpiece types affect the horse's comfort",
      "Recognise signs that a bit may not suit a horse",
      "Understand the principle that the bit is only as kind or severe as the hands that hold the reins",
    ],
    content: `The bit is the primary means of direct communication between the rider's hands and the horse's mouth. Choosing the correct bit is important for the horse's comfort, acceptance and responsiveness. However, it is crucial to understand from the outset that the bit itself is neither kind nor harsh — it is the rider's hands that determine how the bit acts in the horse's mouth. The kindest bit in rough hands is cruel; a stronger bit in educated, quiet hands can be effective and comfortable.

## How the Bit Works

The bit sits on the **bars** of the mouth — the area of gum between the front teeth (incisors) and the back teeth (molars). This area has no teeth and is sensitive to pressure. When the rider applies rein pressure, the bit presses on the bars, tongue, lips and (depending on the type) the palate and chin groove. The horse responds to this pressure by yielding — softening its jaw, flexing at the poll, slowing down or turning.

The key principle is **pressure and release**: pressure asks for a response; the instant the horse responds, the pressure is released. This release is the reward and the primary way the horse learns what is being asked.

## Snaffle Bit Families

Snaffle bits are the most commonly used family of bits and act primarily on the bars, lips and tongue. They have a ring on each side of the mouthpiece and no leverage action (unlike curb bits).

**By ring type:**
- **Loose ring snaffle** — The mouthpiece slides freely through the rings, encouraging the horse to mouth the bit and salivate. A popular choice for many horses. However, the rings can pinch the lips — using bit guards can prevent this.
- **Eggbutt snaffle** — The rings are fixed to the mouthpiece with a smooth, egg-shaped joint that prevents pinching. Provides a slightly more stable feel in the mouth.
- **Full cheek snaffle** — Has extended bars above and below the rings that rest against the horse's face. Helps with steering (the bars press on the outside of the face during turns) and prevents the bit from being pulled through the mouth. Should be used with keepers (leather loops) to hold the upper cheeks in position.
- **D-ring snaffle** — The rings are D-shaped, providing some lateral guidance similar to a full cheek but less pronounced.

**By mouthpiece type:**
- **Single-jointed** — The mouthpiece has a single central joint, creating a "nutcracker" action when both reins are applied simultaneously. It presses on the bars and can contact the palate in some horses with low palates. Very common but not suitable for every horse.
- **French link** — A double-jointed mouthpiece with a flat, kidney-shaped plate in the centre. This lies flat on the tongue, distributing pressure more evenly and eliminating the nutcracker action. Generally considered kinder than a single joint.
- **Lozenge** — Similar to a French link but with a rounded bean-shaped centre piece. Contours well to the tongue.
- **Straight bar** — A single, solid bar with no joints. Applies even pressure across the tongue and bars. Used for horses that dislike jointed bits. Can be severe in uneducated hands because there is no "give."
- **Mullen mouth** — A slightly curved straight bar that follows the shape of the horse's mouth. More comfortable than a truly straight bar.

## Bit Material

- **Stainless steel** — The most common. Durable, easy to clean and tasteless.
- **Sweet iron** — Develops a rust-coloured patina and has a sweet taste that encourages salivation and acceptance.
- **Copper** — Warm to the touch and encourages salivation. Often used as inlays or rollers.
- **Rubber or synthetic** — Softer on the mouth. Available in varying thicknesses. Can be chewed through and must be checked regularly for damage.

## Bit Sizing and Fitting

Bit fitting is individual to the horse’s mouth, dental status, bridle, discipline rules and way of going. There is no universal width extension or wrinkle count that proves a bit is suitable. A qualified instructor, bit fitter and appropriate equine dental professional should assess fit and comfort, using the manufacturer’s instructions and the current discipline rules where relevant.

Do not infer that a thicker, thinner, stronger or more complex mouthpiece is automatically kinder or more suitable. The rider’s hands, the horse’s anatomy, health and training all matter.

## Signs the Bit Is Not Suitable

- **Head tossing or shaking** — The horse throws its head up or shakes it to avoid the bit contact
- **Opening the mouth excessively** — Trying to escape the bit pressure
- **Tongue over the bit** — Putting the tongue over the mouthpiece to avoid pressure on the bars
- **Excessive salivation or dry mouth** — Either extreme can indicate discomfort
- **Leaning on the bit** — Using the bit for support rather than carrying itself
- **Tilting the head** — Trying to avoid pressure on one side
- **Resistance to turning** — Difficulty steering or bending may be bit-related

If a horse shows these signs, consult an experienced instructor, bit fitter or equine dentist before changing the bit. Dental issues (sharp edges, wolf teeth, mouth ulcers) can cause identical symptoms.`,
    keyPoints: [
      "The bit is only as kind or severe as the hands holding the reins — educated hands make any bit kinder",
      "Snaffle bits act on the bars, tongue and lips with no leverage action",
      "A French link distributes pressure more evenly than a single joint by eliminating the nutcracker action",
      "A suitable bit fit is individual; do not use one generic width or wrinkle measurement as proof of comfort",
      "Signs of possible bit discomfort include head tossing, mouth opening, tongue displacement and resistance",
      "Ask qualified tack and dental professionals to assess fit and oral-health concerns before changing equipment",
    ],
    safetyNote:
      "Never change a horse's bit without consulting an experienced instructor. An inappropriate bit can cause pain, mouth injuries and dangerous behaviour. If you notice a horse showing signs of bit discomfort, report it immediately rather than continuing to ride. A horse in pain from its bit may become unpredictable, tossing its head, bolting or rearing. Always ensure the bit is checked for sharp edges, cracks or damage before fitting.",
    practicalApplication:
      "Learn to identify the bits used on the horses you ride. Ask your instructor why each horse wears a particular bit and how the responsible qualified professional checks its fit. Focus on soft, following hands and record any possible discomfort for discussion with the instructor, bit fitter and appropriate dental professional rather than changing equipment yourself.",
    commonMistakes: [
      "Blaming the bit when the real issue is rough or unsteady hands",
      "Choosing a stronger bit to solve a problem caused by poor riding rather than improving skill",
      "Not checking bit width and height during tacking up",
      "Ignoring signs of bit discomfort such as head tossing or mouth opening",
      "Not considering dental issues as a cause of apparent bit problems",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the 'nutcracker' action of a single-jointed snaffle?",
        options: [
          "The bit cracks nuts placed in the mouth",
          "The single joint collapses when both reins are used, squeezing the bars and potentially contacting the palate",
          "The rings pinch the lips",
          "The bit spins in the mouth",
        ],
        correctIndex: 1,
        explanation:
          "When rein pressure is applied to a single-jointed bit, the joint collapses inward, creating a V-shape that squeezes the bars and may press upward against the palate. This is called the nutcracker action.",
      },
      {
        question:
          "What is the safe approach to deciding whether a bit fits a particular horse?",
        options: [
          "Use a qualified fitting and oral-health assessment, manufacturer guidance and current discipline rules",
          "Apply one generic width measurement to every horse",
          "Count wrinkles only",
          "Choose the strongest available bit",
        ],
        correctIndex: 0,
        explanation:
          "No universal measurement proves a bit fits every horse. Suitability depends on the individual horse, equipment, health, riding and applicable rules.",
      },
      {
        question:
          "What should you investigate before changing a horse's bit due to apparent discomfort?",
        options: [
          "The horse's colour preferences",
          "Dental issues such as sharp edges, wolf teeth or mouth ulcers",
          "The brand of the current bit",
          "The weather forecast",
        ],
        correctIndex: 1,
        explanation:
          "Oral-health concerns can contribute to apparent bit discomfort. Discuss them with the appropriate qualified equine dental and veterinary professionals before assuming the bit is the cause.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain the differences between the main snaffle bit types?",
      "What information should a qualified professional consider when assessing bit fit and comfort?",
      "What signs should tell me that a horse is uncomfortable with its bit?",
    ],
    linkedCompetencies: ["tack_identification", "tacking_up_correctly"],
  },

  // ── Lesson 33 ─────────────────────────────────────────────────────────────
  {
    slug: "advanced-equipment-awareness",
    pathwaySlug: "tack-equipment",
    title: "Advanced Equipment Awareness",
    level: "advanced",
    category: "Tack & Equipment",
    sortOrder: 6,
    objectives: [
      "Identify common training aids and understand their intended purposes",
      "Describe the correct fitting and use of boots and bandages",
      "Explain the risks of misusing training aids or protective equipment",
      "Understand when and why specific equipment might be used",
    ],
    content: `As riders progress, they encounter a wider range of equipment beyond the basic saddle and bridle. Training aids, boots, bandages and specialist equipment all have specific purposes — but they also carry risks if used incorrectly. Understanding what each piece does, when it is appropriate and how to fit it safely is an important part of advanced horsemanship.

## Training Aids

Training aids are pieces of equipment designed to encourage the horse to work in a particular posture or frame. They should be used as temporary tools to support training, **not as permanent fixtures** or shortcuts to replace correct riding. Common training aids include:

**Side reins:**
- Attach from the bit to the girth or roller, restricting the horse's ability to raise its head above a certain point.
- Used during lungeing to encourage the horse to work in a rounded frame and accept a consistent contact.
- Must be adjusted evenly on both sides and should not be too tight — the horse must be able to stretch slightly forward and down.
- Never lunge a horse in side reins without proper training.

**Running reins (draw reins):**
- Run from the girth, through the bit rings and back to the rider's hands.
- Provide a leveraged, lowering action on the horse's head carriage.
- Extremely powerful and must only be used by experienced riders under instruction. Misuse can cause the horse to overbend (drop behind the vertical), creating a false frame and muscle tension.
- Should always be used with a direct rein as well.

**Pessoa lungeing system:**
- A system of ropes and pulleys attached from the bit, through the roller and around the hindquarters.
- Encourages the horse to work from behind, engaging the hindquarters and lifting the back.
- Must be fitted correctly and adjusted gradually. Improper use can cause the horse to panic.

**Chambon and de Gogue:**
- Devices that act on the poll and bit to encourage the horse to lower and stretch its head and neck.
- Used in lungeing or ridden work. Require knowledge and experience to fit and use safely.

**All training aids carry this principle:** They encourage a posture but cannot teach the horse to carry itself. Over-reliance on training aids produces a horse that only works in a shape when constrained, rather than one that carries itself through correct muscular development. Training aids should be introduced by a qualified instructor and removed as the horse's way of going improves.

## Boots

Protective boots are commonly used to protect the horse's legs during exercise:

**Brushing boots:**
- Protect the cannon bone and fetlock from strikes by the opposite leg (brushing).
- Fitted from just below the knee to just above the fetlock, with fastenings on the outside of the leg.
- Straps should fasten from front to back (so they do not catch and unwrap if the horse catches a leg).

**Tendon boots:**
- Protect the tendons at the back of the cannon bone from strikes by the hind feet (overreach).
- Open-fronted tendon boots are used for jumping, allowing the horse to feel poles with the front of the cannon bone (encouraging careful jumping) while protecting the tendons behind.

**Overreach boots:**
- Bell-shaped boots that fit over the front hooves to protect the bulbs of the heels from being struck by the hind feet.
- Essential for horses that overreach (the hind foot strikes the heel of the front foot during movement).

**Travel boots:**
- Full-length boots protecting the legs from the knee or hock down to the coronet band during transport.
- Must be fitted securely but not too tightly.

## Bandages

Bandages require more skill to apply than boots:

**Exercise bandages:**
- Elasticated bandages applied over padding to support and protect the lower leg during work.
- Must be applied with even pressure — too tight restricts blood flow and can cause tendon damage; too loose and they unwrap during work, creating a tripping hazard.
- Only apply exercise bandages if you have been taught by a qualified person and have practised extensively.

**Stable bandages:**
- Wider, non-elasticated bandages used for warmth, support or to hold a poultice in place.
- Applied over padding from just below the knee to the coronet band.
- Must be smooth, even and not too tight.

**The golden rule of bandaging:** If you are not confident in your ability, use boots instead. A poorly applied bandage is worse than no bandage at all.

## When to Use Equipment

Each piece of equipment should be used for a specific purpose:
- **Boots for exercise** — When the horse is known to brush, overreach or when jumping
- **Bandages** — For specific therapeutic purposes or travel, applied by experienced handlers
- **Training aids** — Only under the guidance of a qualified instructor, as a temporary training tool
- **Specialist equipment** — Only when prescribed by a vet, physiotherapist or qualified trainer

Equipment should never be used to mask a problem (e.g., using a stronger bit instead of improving riding, or using draw reins instead of correct schooling). The goal is always to develop the horse's natural ability and the rider's skill.`,
    keyPoints: [
      "Training aids are temporary tools to support training, not permanent fixtures or shortcuts",
      "Running reins are extremely powerful and must only be used by experienced riders under instruction",
      "Brushing boots fasten from front to back with straps on the outside to prevent catching",
      "Exercise bandages require skilled application — if in doubt, use boots instead",
      "A poorly applied bandage is worse than no bandage, as it can cause tendon damage or become a tripping hazard",
      "Equipment should never mask a problem — address the root cause through training and riding improvement",
    ],
    safetyNote:
      "Never use training aids without instruction from a qualified teacher. Running reins, side reins and similar equipment can cause pain, panic and dangerous behaviour if fitted incorrectly. A horse that suddenly feels restricted may rear, bolt or flip over backward. Exercise bandages applied too tightly can cause pressure damage to tendons — this condition, called 'bandage bow,' causes permanent harm. If you are unsure about any piece of equipment, ask before using it.",
    practicalApplication:
      "Learn to fit brushing boots and overreach boots on a calm horse. Practise until you can do it quickly and correctly. If your instructor introduces a training aid, ask them to explain exactly what it does, how it is fitted, and when it should be removed. Keep notes in your riding diary about what equipment you have used and why. Build your confidence with boots before progressing to bandages under expert guidance.",
    commonMistakes: [
      "Using training aids as permanent fixtures instead of temporary teaching tools",
      "Applying exercise bandages unevenly, creating pressure points on the tendons",
      "Fitting brushing boot straps from back to front, which can catch and unwrap",
      "Using draw reins to force a head position instead of developing correct riding",
      "Not checking boots and bandages during a long ride to ensure they have not slipped",
    ],
    knowledgeCheck: [
      {
        question: "Why should training aids only be used as temporary tools?",
        options: [
          "They wear out quickly",
          "They teach the horse a shape but not self-carriage; the goal is for the horse to carry itself without the aid",
          "They are expensive",
          "Horses do not like wearing them",
        ],
        correctIndex: 1,
        explanation:
          "Training aids encourage a posture but cannot replace correct muscular development. Over-reliance produces a horse that only works correctly when constrained, rather than one that has developed genuine self-carriage.",
      },
      {
        question:
          "What is the risk of applying an exercise bandage too tightly?",
        options: [
          "The bandage will not stay on",
          "The horse's leg will sweat",
          "Blood flow can be restricted, causing pressure damage to the tendons (bandage bow)",
          "The horse will refuse to move",
        ],
        correctIndex: 2,
        explanation:
          "An exercise bandage applied too tightly restricts blood flow and compresses the tendons. This can cause a condition called 'bandage bow,' which results in permanent tendon damage.",
      },
      {
        question: "In which direction should brushing boot straps fasten?",
        options: [
          "Back to front",
          "Front to back, with the buckle or fastening on the outside",
          "Top to bottom",
          "It does not matter",
        ],
        correctIndex: 1,
        explanation:
          "Brushing boot straps should fasten from front to back on the outside of the leg. This ensures that if the horse catches a leg, the strap is pushed tighter rather than pulled loose.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain the different types of training aids and when each is appropriate?",
      "How do I fit brushing boots correctly?",
      "What is the difference between exercise bandages and stable bandages, and when should each be used?",
    ],
    linkedCompetencies: ["tacking_up_correctly", "tack_care"],
  },

  // ── Pathway 6: Developing Rider Skills ──────────────────────────────────────
  {
    slug: "walk-trot-transitions-developing",
    pathwaySlug: "developing-rider-skills",
    title: "Walk to Trot Transitions",
    level: "developing",
    category: "Flatwork",
    sortOrder: 1,
    objectives: [
      "Understand the correct aids for upward and downward transitions between walk and trot",
      "Develop the ability to maintain a balanced position during transitions",
      "Learn to prepare the horse before asking for a transition",
      "Recognise and correct common faults in transitions",
    ],
    content: `Walk to trot transitions are one of the most fundamental skills a developing rider must master. A good transition demonstrates harmony between horse and rider and lays the groundwork for all future schooling work. Understanding how to ride smooth, balanced transitions will improve every aspect of your riding.

Before asking for an upward transition from walk to trot, the rider must first establish a good quality walk. The horse should be walking with purpose and energy, stepping actively forward into a light, elastic contact. The rider's position should be tall and balanced, with the weight distributed evenly through both seat bones, the shoulders back and the lower leg resting quietly on the horse's side just behind the girth.

Preparation is the key to a successful transition. Before applying the aids, the rider should use a half-halt to rebalance the horse and gain its attention. A half-halt involves a momentary closing of the fingers on the reins combined with a brief engagement of the seat and leg. This tells the horse to listen for the next instruction. Without adequate preparation, the horse may fall onto the forehand during the transition or rush into a hurried trot.

The aids for a walk to trot transition are as follows: the rider closes both legs gently against the horse's sides, just behind the girth, while softening the hands slightly to allow the horse to move forward into the new gait. The seat should remain deep and following. It is important that the rider does not tip forward, grip with the knees, or throw the hands forward, as these common faults will unbalance both horse and rider.

The trot should begin smoothly and in a consistent rhythm. If the horse rushes, the rider should sit quietly and use half-halts to steady the pace rather than pulling on the reins. If the horse is sluggish or ignores the leg, a tap with the schooling whip behind the leg may be needed to reinforce the aid. The goal is for the horse to respond promptly to a light aid.

For the downward transition from trot to walk, the rider sits deep in the saddle, braces the lower back slightly, and closes the fingers on the reins. The legs remain in contact to prevent the horse from falling behind the leg or stopping abruptly. The transition should feel as though the horse gently steps from trot into a purposeful, active walk — not a shuffling halt.

Practising transitions at specific markers in the arena helps develop accuracy and discipline. For example, the rider might plan to trot at A and return to walk at C. Over time, this develops the rider's ability to plan ahead and communicate clearly with the horse. Transitions ridden at set points also encourage the horse to pay attention to the rider rather than drifting along on autopilot.

Common problems in transitions include the horse hollowing its back, throwing its head up, or leaning on the rider's hands. These issues often stem from the rider applying the aids too sharply or without sufficient preparation. A calm, methodical approach — prepare, ask, allow — will produce the best results. Riders should also be aware of their own body, ensuring they do not collapse at the waist or round the shoulders during transitions.

Regular practice of walk to trot and trot to walk transitions builds the rider's coordination, timing, and feel. These are the building blocks upon which more advanced work, such as canter transitions, lateral movements, and collected work, are developed.`,
    keyPoints: [
      "Always prepare the horse with a half-halt before asking for a transition",
      "Close both legs gently behind the girth for the upward transition while softening the hand",
      "For the downward transition, sit deep, brace the back, and close the fingers on the reins",
      "Maintain a balanced, upright position throughout the transition",
      "Practise transitions at specific markers to develop accuracy and timing",
    ],
    safetyNote:
      "Always ensure the girth is correctly tightened before beginning flatwork. If the horse becomes excited or strong during transitions, use calming half-halts and circles to regain control rather than pulling sharply on the reins.",
    practicalApplication:
      "During your next schooling session, plan a series of transitions at set markers around the arena. Aim for at least ten upward and ten downward transitions, focusing on smooth preparation and a calm, balanced execution. Ask your instructor for feedback on your position and the quality of your horse's response.",
    commonMistakes: [
      "Tipping forward or collapsing the upper body during the upward transition",
      "Gripping with the knees, which pushes the lower leg away from the horse's side",
      "Using the reins to pull the horse into a downward transition rather than using the seat and back",
      "Failing to prepare the horse with a half-halt before the transition",
      "Allowing the horse to rush into the trot or fall into a lazy walk",
    ],
    knowledgeCheck: [
      {
        question:
          "What should a rider do immediately before asking for a walk to trot transition?",
        options: [
          "Lean forward to encourage the horse",
          "Apply a half-halt to prepare and rebalance the horse",
          "Kick the horse firmly with both heels",
          "Drop the reins to give the horse freedom",
        ],
        correctIndex: 1,
        explanation:
          "A half-halt prepares the horse by rebalancing it and gaining its attention. This ensures the transition is smooth and the horse does not fall onto the forehand.",
      },
      {
        question:
          "Where should the rider's legs be positioned when asking for a trot transition?",
        options: [
          "Well behind the girth near the horse's flank",
          "On the girth",
          "Just behind the girth",
          "In front of the girth",
        ],
        correctIndex: 2,
        explanation:
          "The rider's legs should close gently just behind the girth. This is the correct position for asking the horse to move forward into a new gait.",
      },
      {
        question:
          "What is a common fault when transitioning from trot to walk?",
        options: [
          "Sitting too deep in the saddle",
          "Pulling sharply on the reins without using the seat",
          "Looking straight ahead",
          "Keeping the legs in contact with the horse",
        ],
        correctIndex: 1,
        explanation:
          "Pulling on the reins without engaging the seat and back causes the horse to hollow its back and raise its head. The downward transition should be ridden primarily from the seat.",
      },
      {
        question:
          "Why is practising transitions at specific markers beneficial?",
        options: [
          "It makes the lesson shorter",
          "It develops accuracy, planning, and clear communication with the horse",
          "It is only needed for competition riders",
          "It tires the horse out more quickly",
        ],
        correctIndex: 1,
        explanation:
          "Riding transitions at specific markers teaches the rider to plan ahead, prepare the horse in good time, and develop accuracy — all essential skills for progression.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain what a half-halt is and how I should use it before a transition?",
      "What exercises can help me stop tipping forward during walk to trot transitions?",
      "How can I tell if my horse is properly prepared for a transition?",
    ],
    linkedCompetencies: ["control_at_trot", "control_at_walk"],
  },
  {
    slug: "trot-rhythm-and-balance",
    pathwaySlug: "developing-rider-skills",
    title: "Trot Rhythm and Balance",
    level: "developing",
    category: "Flatwork",
    sortOrder: 2,
    objectives: [
      "Use qualified coaching to recognise a suitable, individual trot rhythm and balance task",
      "Practise rising trot only within a coach-approved progression",
      "Recognise when a trot exercise requires more support, a slower progression, or a stop",
      "Report changes in rider security, horse comfort, tack, footing, or conditions to the qualified coach",
    ],
    content: `Trot work must be planned for the individual rider, horse, saddle, footing, setting, level of instruction, and current conditions. Reviewed coach guidance directs that ridden work is undertaken on safe horses suitable for the participant level and under coach instruction and supervision. This lesson is a reflective vocabulary aid, not a substitute for an instructor’s real-time assessment, a horse-health or tack assessment, or a fixed progression.

A coach may use **rhythm**, **balance**, **security**, **position**, and **contact** as coaching terms. Whether a trot is suitable depends on the individual partnership and task. A learner must not use a change in feel or appearance to diagnose horse balance, rider error, pain, tack fit, or a particular cause. If the rider loses security, the horse appears uncomfortable or difficult to control, the tack or footing is unsuitable, or conditions change, stop and obtain qualified advice.

A qualified coach may introduce rising trot when the rider, horse, setting, tack, support, and current safety arrangements are appropriate. The coach selects the position cue, pace, duration, exercise, aids, and level of assistance for the individual. The reviewed coach guidance focuses on balance and security in the saddle and permits support, such as a neck strap, where required. Do not treat a generic cue as a universal anatomical instruction or continue when the rider is insecure.

**Diagonal** is a coaching concept that a qualified instructor may introduce at an appropriate stage. The reviewed introductory coach guidance states that a rider need not recognise a “correct diagonal” to demonstrate security in rising trot at that level. A coach should decide whether, when, and how diagonal awareness is taught for the individual rider and task; do not look down, change a diagonal, or apply a fixed rule in a way that compromises balance, safety, or current instruction.

Sitting-trot work is not appropriate for every horse-and-rider partnership or every stage of learning. A qualified coach must decide whether it is suitable and how to support the rider. Do not interpret tension, discomfort, loss of balance, or an uneven feel as a diagnosis or a reason to force a rider or horse through an exercise. Stop and obtain qualified guidance if rider security, horse comfort, tack, footing, or conditions are unsuitable.

Balance and position must be observed in context by a qualified coach. Tack fit, horse comfort, rider health, task, environment, and training can all require appropriate review. A position observation alone does not prove why a horse moves in a particular way or establish a correction. Persistent pain, limitation, horse discomfort, or tack concern requires the relevant qualified professional.

A qualified coach may select an appropriately simple trot exercise and may modify, stop, or postpone it as conditions change. Do not set a generic pattern, duration, diagonal task, speed, no-stirrup exercise, or progression from this lesson. Any no-stirrup activity requires explicit coach approval, a suitable partnership, and current safety controls; it is not a universal assessment or fitness tool.

If a qualified coach selects a verbal, visual, or physical cue, use it only as directed and within a safe, supported setting. A cue can help a coaching conversation but does not establish a “correct” tempo, diagnose a change, or authorise a learner to alter the horse’s pace independently.

Trot schooling should progress only through an individual, welfare-aware coaching plan. The qualified coach and responsible person must decide whether the partnership is ready for any new exercise, pace, or movement.`,
    keyPoints: [
      "Trot work must use a horse, rider, tack, setting, supervision, and exercise appropriate to the individual partnership",
      "A qualified coach selects any rising-trot position cue and support; learners should not treat one cue as universal anatomy",
      "Diagonal awareness is coach-led and stage-specific; the reviewed introductory coach guidance does not require a rider to recognise it to demonstrate rising-trot security",
      "Sitting trot is not automatically appropriate; stop and seek coaching if rider security, horse comfort, tack, footing, or conditions are unsuitable",
      "Position observations do not diagnose rider health, saddle fit, horse comfort, or the cause of a movement concern",
      "Use a verbal or physical cue only as coach-directed support, not as a universal diagnosis or self-correction method",
    ],
    safetyNote:
      "Do not begin or progress trot, sitting-trot, diagonal, or no-stirrup work without coach instruction and the responsible person’s current safety arrangements. Stop if rider security, horse comfort or behaviour, tack, footing, weather, supervision, or emergency arrangements become unsuitable, then obtain qualified advice.",
    practicalApplication:
      "Ask a qualified coach which trot work, support, and observation are suitable for your current horse-and-rider partnership. Follow the coach’s individual plan rather than setting a fixed diagonal, circle, sitting-trot, no-stirrup, or counting exercise from this lesson. Report any safety, comfort, tack, or conditions concern promptly.",
    commonMistakes: [
      "Continuing a trot exercise without the instruction, supervision, support, or conditions identified in the current coaching plan",
      "Using a position observation to diagnose rider health, horse comfort, tack fit, or the cause of a performance concern",
      "Treating a coach-selected diagonal concept as a universal rule rather than stage- and partnership-specific instruction",
      "Progressing to sitting trot, no-stirrup work, a faster pace, or a new exercise without coach approval",
      "Trying to correct a perceived rhythm change independently rather than stopping and seeking qualified coaching when needed",
    ],
    knowledgeCheck: [
      {
        question: "Who should decide whether a developing rider’s trot exercise is suitable and how it progresses?",
        options: [
          "The rider alone, using a generic online checklist",
          "A qualified coach within the current responsible-person safety arrangements",
          "Any spectator who sees the horse moving",
          "The rider’s desire to progress to a faster pace",
        ],
        correctIndex: 1,
        explanation:
          "The reviewed coach guidance requires ridden work to be on safe horses suitable for the participant level and under coach instruction and supervision. The individual partnership and current conditions determine the suitable exercise.",
      },
      {
        question: "What does the reviewed introductory coach guidance say about recognising a correct diagonal?",
        options: [
          "It must be recognised before any rising trot",
          "It is never used in coaching",
          "It is not required at that introductory stage for a rider to demonstrate security in rising trot",
          "It may be selected only by a spectator",
        ],
        correctIndex: 2,
        explanation:
          "The reviewed introductory coach guidance says the correct diagonal does not have to be recognised at that level, while coach instruction and supervision remain required. A coach decides when diagonal awareness is suitable for the individual rider and task.",
      },
      {
        question: "What should a rider do if they lose security or notice a horse-comfort, tack, footing, or conditions concern during trot work?",
        options: [
          "Continue until the planned exercise is complete",
          "Try a faster pace to test the issue",
          "Stop or move to safety as directed and obtain qualified coaching or responsible-person advice",
          "Diagnose the cause and prescribe an exercise",
        ],
        correctIndex: 2,
        explanation:
          "A generic lesson cannot diagnose the cause of a concern. Stop, follow the current safety arrangement, and obtain qualified advice before continuing or progressing the work.",
      },
      {
        question: "When is no-stirrup trot work appropriate?",
        options: [
          "For every rider as a required balance test",
          "Whenever the rider wants a harder exercise",
          "Only when a qualified coach approves it for the individual partnership and current safety conditions",
          "Only after the rider counts aloud for a set time",
        ],
        correctIndex: 2,
        explanation:
          "No-stirrup work is not a universal assessment or progression. It requires coach approval, a suitable horse-and-rider partnership, and current safety controls.",
      },
      {
        question: "How should a learner use a verbal rhythm cue selected by a coach?",
        options: [
          "As universal proof that the horse’s tempo is correct",
          "Only as coach-directed support in the current safe exercise",
          "As a reason to change the horse’s pace independently",
          "As a substitute for instruction and supervision",
        ],
        correctIndex: 1,
        explanation:
          "A verbal cue can support a coach-led exercise, but it does not diagnose horse movement or authorise a learner to make independent pace corrections.",
      },
    ],
    aiTutorPrompts: [
      "What current coach-approved trot exercise and support are appropriate for my horse-and-rider partnership?",
      "When is diagonal awareness appropriate in my current coach-led progression?",
      "What safety or comfort changes should make me stop and seek qualified advice during trot work?",
    ],
    linkedCompetencies: ["control_at_trot", "balance_and_coordination"],
  },
  {
    slug: "steering-and-accuracy",
    pathwaySlug: "developing-rider-skills",
    title: "Steering and Accuracy",
    level: "developing",
    category: "Flatwork",
    sortOrder: 3,
    objectives: [
      "Understand the aids for turning and steering at walk and trot",
      "Learn to plan lines and ride accurately to specific markers",
      "Develop coordination of the inside and outside aids",
      "Recognise when the horse is falling in or drifting out on turns",
    ],
    content: `Steering a horse accurately is far more complex than simply pulling on one rein. Effective steering requires the coordinated use of the hands, legs, seat, and eyes, and it is a skill that develops progressively as the rider gains experience and body awareness. For the developing rider, learning to steer with precision lays the groundwork for all future school figures, dressage movements, and even jumping courses.

The rider's eyes play a critical role in steering. Looking in the direction of travel — well ahead and around the turn — naturally aligns the rider's shoulders and hips with the intended line. If the rider looks down at the horse's neck or at the ground, the body tends to collapse and the horse receives mixed signals. A simple rule to remember is: look where you want to go, and the horse will follow.

The inside rein is used to ask for flexion — a slight bend through the horse's poll and neck in the direction of the turn. This should be a gentle, guiding action, not a strong pull. Over-use of the inside rein is one of the most common faults in developing riders. It causes the horse to tilt its head rather than bend evenly through the body, and it can also cause the horse to fall inward on the turn.

The outside rein is equally important, if not more so, than the inside rein. It controls the degree of bend, prevents the horse's outside shoulder from drifting outward, and maintains the horse's balance. The outside rein should maintain a steady, supportive contact while the inside rein asks for flexion. Thinking of the outside rein as a guiding wall or boundary can help the rider understand its role.

The rider's legs are essential for steering. The inside leg, applied on or just behind the girth, acts as a pillar around which the horse bends. It also maintains impulsion and prevents the horse from falling inward. The outside leg, positioned slightly further behind the girth, prevents the horse's hindquarters from swinging out and supports the bend. Together, the inside and outside legs create a channel through which the horse moves.

The rider's seat and weight also contribute to steering. Sitting centrally and weighting the inside seat bone slightly (without collapsing the hip) helps the horse understand the direction of the turn. However, excessive weight shifts can unbalance both horse and rider, so subtlety is key.

Accuracy means riding exactly where you intend to go — hitting the markers, making turns at the correct points, and maintaining straight lines on the long sides. This requires planning ahead. The rider should be thinking about the next movement two or three strides before it happens. For example, when approaching the corner of the arena, the rider should begin preparing the aids a few strides before the turn, not in the middle of it.

Common accuracy exercises include riding from marker to marker in straight lines, making turns at specific letters, and changing the rein through the diagonal or across the centre line. The rider should aim to ride deep into the corners of the arena, using them as quarter-circles rather than cutting across them. Good use of corners is one of the hallmarks of an educated rider.

When the horse falls in on a turn — drifting towards the inside of the arena — it is usually because the rider's inside leg is not active enough or the rider is pulling on the inside rein. The correction is to apply more inside leg and steady the outside rein. When the horse drifts out — moving towards the outside — the outside rein and outside leg need to be more effective.

Practising steering exercises at walk before attempting them at trot allows the rider to develop the coordination of the aids without the added complexity of the trot's movement. As confidence grows, the same exercises can be ridden at trot, and eventually at canter, building progressively towards more demanding school figures and lateral movements.`,
    keyPoints: [
      "Always look in the direction of travel — the rider's eyes lead the turn",
      "The inside rein asks for flexion; the outside rein controls the bend and supports the horse's balance",
      "The inside leg on the girth creates a pillar for the horse to bend around and maintains impulsion",
      "The outside leg behind the girth prevents the hindquarters from swinging out",
      "Plan ahead — begin preparing aids two or three strides before a turn or transition",
      "Ride deep into corners to develop accuracy and improve the horse's balance",
    ],
    safetyNote:
      "When practising steering exercises, be aware of other riders in the arena. Follow the rules of the school — pass left hand to left hand — and always call out when changing the rein. Avoid sudden turns that could startle other horses.",
    practicalApplication:
      "Set up a simple course of cones or markers around the arena. Ride the course at walk first, focusing on looking ahead, coordinating your aids, and hitting each marker precisely. Then ride the course at trot. Note any points where you lose accuracy and discuss corrections with your instructor.",
    commonMistakes: [
      "Over-using the inside rein and pulling the horse around the turn instead of guiding with all aids",
      "Looking down at the horse's neck instead of ahead around the turn",
      "Failing to use the outside rein to support the horse's balance",
      "Cutting corners instead of riding deep into them",
      "Not planning ahead, leading to late and rushed turns",
    ],
    knowledgeCheck: [
      {
        question: "What is the primary role of the outside rein during a turn?",
        options: [
          "To pull the horse around the turn",
          "To control the degree of bend and support the horse's balance",
          "To slow the horse down",
          "To signal a change of gait",
        ],
        correctIndex: 1,
        explanation:
          "The outside rein controls the degree of bend in the horse's neck, prevents the outside shoulder from drifting, and supports overall balance during the turn.",
      },
      {
        question: "Where should the rider look when making a turn?",
        options: [
          "At the horse's ears",
          "At the ground near the horse's feet",
          "In the direction of travel, well ahead around the turn",
          "At the inside rein",
        ],
        correctIndex: 2,
        explanation:
          "Looking in the direction of travel naturally aligns the rider's body and helps guide the horse accurately through the turn.",
      },
      {
        question: "What does the inside leg do during a turn?",
        options: [
          "It pushes the horse sideways",
          "It acts as a pillar for the horse to bend around and maintains impulsion",
          "It has no role during turning",
          "It slows the horse down",
        ],
        correctIndex: 1,
        explanation:
          "The inside leg, applied on or just behind the girth, acts as the central point around which the horse bends. It also keeps the horse moving forward with impulsion.",
      },
      {
        question: "What should a rider do if the horse falls in on a circle?",
        options: [
          "Pull on the inside rein more firmly",
          "Lean to the outside",
          "Apply more inside leg and steady the outside rein",
          "Let go of the reins entirely",
        ],
        correctIndex: 2,
        explanation:
          "When a horse falls in, the rider should use more inside leg to push the horse out onto the line of the circle, supported by a steady outside rein to prevent the horse from over-bending.",
      },
    ],
    aiTutorPrompts: [
      "How can I improve my coordination between inside and outside aids?",
      "What exercises can help me ride more accurately to markers?",
      "Can you explain why pulling on the inside rein actually makes steering worse?",
    ],
    linkedCompetencies: ["control_at_walk", "balance_and_coordination"],
  },
  {
    slug: "circles-and-school-figures",
    pathwaySlug: "developing-rider-skills",
    title: "Circles and School Figures",
    level: "intermediate",
    category: "Flatwork",
    sortOrder: 4,
    objectives: [
      "Understand the geometry and purpose of common school figures",
      "Learn to ride accurate 20-metre and 15-metre circles",
      "Develop the ability to maintain bend, rhythm, and balance on curved lines",
      "Know when and how to use school figures to improve the horse's way of going",
    ],
    content: `School figures are the geometric shapes and patterns ridden in a manège or arena. They are not merely exercises for the rider to follow; they are fundamental training tools that develop the horse's suppleness, straightness, balance, and obedience. Understanding the purpose behind each figure — and riding it with accuracy — is a mark of an educated rider and a well-schooled horse.

Dressage arena layouts vary by level, organiser and jurisdiction. The FEI 2026 international specification is 20 m wide by 60 m long, while a 20 m × 40 m small arena is used in some introductory schooling and national tests. Use the current organiser’s approved diagram for any competition. Letters around an arena provide reference points for planning and executing school figures; learn the layout used for the arena in which you are riding.

The 20-metre circle is the most basic circle and is ridden by touching the track at one end of the arena and passing through the centre point X. For example, a 20-metre circle at A would touch the track at A, pass through the centre line at X, touch the long side at E or B (depending on direction), and return to A. The shape should be truly round — not egg-shaped, diamond-shaped, or lopsided. Riding an accurate circle requires the rider to use all four aids: the inside leg on the girth to maintain bend and impulsion, the outside leg behind the girth to prevent the quarters from swinging out, the inside rein for flexion, and the outside rein to control the bend and the size of the circle.

Smaller circles are more demanding because they require more balance, bend and coordination. Practise them only with an instructor’s guidance, at a size appropriate to the horse, rider, arena and current test or exercise instructions.

Other important school figures include the half-circle and return to the track (sometimes called a demi-volte), the figure of eight, the serpentine and the shallow loop. A serpentine consists of a series of balanced loops across the arena, with a smooth change of bend each time the centre line is crossed. A shallow loop leaves the track, follows a gentle inward curve and returns to the track. Use the current arena diagram and instructor direction to choose the size and placement of each figure.

Straightness on the long sides and centre line is just as important as accuracy on curved lines. The horse should travel parallel to the sides of the arena, not drifting inward or outward. On the centre line, the horse should be perfectly straight, with the nose, shoulders, and hindquarters all aligned. Any deviation is immediately visible and is penalised in dressage tests.

To ride accurate school figures, the rider must plan each figure before beginning it, identify reference points to guide the shape, and maintain a consistent rhythm and tempo throughout. Looking up and around the figure — rather than down — is essential for accuracy. The rider should also be aware of the horse's balance and adjust the aids accordingly: applying more inside leg if the horse falls in, or more outside rein if the horse drifts out.

Regular practice of school figures at walk, trot, and canter develops the rider's spatial awareness, coordination, and feel. It also systematically improves the horse's suppleness, balance, and responsiveness to the aids. School figures are not just patterns on a page — they are the language of classical equitation.`,
    keyPoints: [
      "School figures are training tools that develop suppleness, straightness, and balance in the horse",
      "A 20-metre circle should be truly round, touching the track and passing through the centre of the arena",
      "Smaller circles demand more bend and balance; only attempt them when horse and rider are ready",
      "Serpentines require a change of bend each time the centre line is crossed",
      "Accurate riding of school figures requires planning, looking ahead, and coordinated use of all aids",
    ],
    safetyNote:
      "When riding school figures in a shared arena, be aware of other riders' lines. Call out clearly when changing the rein or riding across the arena. Give way to riders on the outside track and adjust your figures to avoid collisions.",
    practicalApplication:
      "Practise a circle at the markers specified by your instructor or current arena diagram. Use markers or cones to check a consistent shape. When horse and rider are ready, practise a smaller figure or a serpentine under instruction, focusing on balance and smooth changes of bend rather than copying a fixed size from another arena.",
    commonMistakes: [
      "Riding egg-shaped or lopsided circles instead of truly round ones",
      "Losing rhythm or balance when riding smaller circles",
      "Failing to change the bend when crossing the centre line on serpentines",
      "Cutting corners instead of riding them as quarter-circles",
      "Looking down instead of ahead around the figure, causing loss of accuracy",
    ],
    knowledgeCheck: [
      {
        question:
          "What are the four key points of a 20-metre circle at A in a 20x40 arena?",
        options: [
          "A, E or B, X, and C",
          "A, the centre line at X, the opposite long side at E or B, and back to A",
          "K, H, M, F",
          "A, B, C, D",
        ],
        correctIndex: 1,
        explanation:
          "A 20-metre circle at A touches the track at A, passes through X on the centre line, touches the long side at E or B, and returns to A, creating a truly round shape.",
      },
      {
        question:
          "How many loops does a standard three-loop serpentine have, and where does the bend change?",
        options: [
          "Three loops, with the bend changing at each long side",
          "Three loops, with the bend changing each time the centre line is crossed",
          "Two loops, with the bend changing at X",
          "Four loops, with the bend changing at each letter",
        ],
        correctIndex: 1,
        explanation:
          "A three-loop serpentine has three equal loops, each touching the long side. The bend must change smoothly each time the rider crosses the centre line.",
      },
      {
        question: "What is the purpose of a shallow loop along the long side?",
        options: [
          "To practise canter transitions",
          "To test the rider's ability to maintain bend and balance on a gentle curve",
          "To warm the horse up before jumping",
          "To practise halting at markers",
        ],
        correctIndex: 1,
        explanation:
          "Shallow loops develop the rider's ability to maintain consistent bend and balance while keeping the horse on a gentle curve away from and back to the track.",
      },
      {
        question: "Why is straightness on the centre line important?",
        options: [
          "It is only important in competitions",
          "Because the horse naturally goes straight on the centre line",
          "Because any deviation is clearly visible and indicates lack of balance or rider control",
          "It is not particularly important",
        ],
        correctIndex: 2,
        explanation:
          "Straightness on the centre line demonstrates the rider's control and the horse's balance. Any deviation — the horse drifting left or right — is immediately obvious and indicates a training issue.",
      },
    ],
    aiTutorPrompts: [
      "How do I know if my circle is truly round and not egg-shaped?",
      "What are the key differences in the aids for a 20-metre circle versus a 15-metre circle?",
      "Can you explain the correct way to ride a three-loop serpentine with changes of bend?",
    ],
    linkedCompetencies: ["balance_and_coordination", "control_at_trot"],
  },
  {
    slug: "rider-balance-independent-seat",
    pathwaySlug: "developing-rider-skills",
    title: "Rider Balance and Independent Seat",
    level: "intermediate",
    category: "Rider Development",
    sortOrder: 5,
    objectives: [
      "Understand what an independent seat is and why it matters for effective riding",
      "Identify the key elements of a balanced riding position",
      "Learn exercises to develop core stability and an independent seat",
      "Recognise how rider balance directly affects the horse's way of going",
    ],
    content: `An independent seat is the ability to maintain a stable, balanced position in the saddle without relying on the reins for support or the stirrups for security. It means the rider can use each aid — hands, legs, and seat — independently and with precision, without one action interfering with another. Developing an independent seat is one of the most important goals for any rider, as it directly affects how well the rider communicates with the horse and how freely the horse can move.

The foundation of the independent seat is correct alignment. When viewed from the side, the rider's ear, shoulder, hip, and heel should be in a vertical line. This alignment places the rider's centre of gravity directly over the horse's centre of gravity, creating a partnership in balance. If any of these points fall out of alignment — the shoulder ahead of the hip, the heel drawn up, or the hip behind the shoulder — the rider becomes unbalanced and must compensate, often by gripping with the knees, hanging on the reins, or bracing in the stirrups.

Core stability is central to the independent seat. The rider's core muscles — the abdominals, obliques, and lower back muscles — act as the stabilising centre from which all movement radiates. A strong core allows the rider to absorb the horse's movement without stiffening, to follow the motion of each gait, and to apply aids clearly and effectively. However, core engagement does not mean rigidity; the rider must be firm yet elastic, stable yet supple.

The pelvis plays a crucial role in balance. The rider should sit on the two seat bones and the pubic bone — the three-point seat — with the pelvis in a neutral position, neither tipped too far forward (which hollows the back) nor too far back (which rounds the back and causes the rider to sit on the back of the seat bones). A neutral pelvis allows the lower back to absorb movement and the hips to follow the horse's stride.

The legs contribute to balance but should not be the primary source of stability. The thigh should lie flat against the saddle with a long, draped feel. The knee should be soft and slightly bent, not gripping. The lower leg should hang naturally at the horse's side, with the ball of the foot on the stirrup and the heel gently stretching down. Gripping with the knee or calf is a common fault that actually reduces stability by lifting the rider out of the saddle and preventing the seat from deepening.

The hands and arms must operate independently of the rider's balance. Many developing riders use the reins as a balancing aid, holding on when they feel insecure. This creates a hard, unforgiving contact that restricts the horse's movement and causes the horse to resist or become tense. The arms should hang naturally from relaxed shoulders, with a straight line from elbow to hand to the horse's mouth. The fingers should close softly around the reins, maintaining an elastic contact that follows the horse's head movement.

Exercises to develop an independent seat include riding without stirrups at walk and trot, arm exercises while riding (such as placing hands on hips, raising arms to the side, or touching the horse's ears and tail), and transitions within and between gaits. Lunging lessons — where the rider is on a lunge line controlled by the instructor — are particularly valuable because the rider can focus entirely on position without worrying about steering.

Off-horse exercises are equally important. Yoga, Pilates, and core stability work all develop the suppleness, strength, and body awareness that transfer directly to riding. Specific exercises include the plank, single-leg balance work, hip flexor stretches, and exercises on a stability ball that mimic the movement of the saddle.

The independent seat is not achieved overnight. It is a gradual process that requires patience, consistent practice, and honest self-assessment. Riders should regularly check their position — are the shoulders back, is the core engaged, is the seat deep, are the hands independent? — and be willing to return to basics whenever faults creep in. The reward is a rider who sits in true harmony with the horse, communicating through subtle shifts of weight and gentle aids rather than force and tension.`,
    keyPoints: [
      "An independent seat means the rider can use hands, legs, and seat independently without relying on any one for balance",
      "Correct alignment — ear, shoulder, hip, heel in a vertical line — is the foundation of balance",
      "Core stability provides the stabilising centre for all rider movement; it should be firm yet elastic",
      "The pelvis should be in a neutral position, allowing the lower back to absorb the horse's movement",
      "Riding without stirrups and lunge lessons are invaluable for developing an independent seat",
      "Off-horse exercises such as Pilates and core stability work directly benefit the rider's position",
    ],
    safetyNote:
      "Riding without stirrups should only be done on a calm, reliable horse in an enclosed arena and under supervision. If you feel unbalanced, take your stirrups back immediately. Never attempt exercises without stirrups at canter until your instructor confirms you are ready.",
    practicalApplication:
      "During your next lesson, ask your instructor for five minutes of walk work without stirrups. Focus on letting your legs hang long and heavy, sitting on your seat bones, and maintaining a tall upper body. If comfortable, try a short period of trot without stirrups on a 20-metre circle. Between rides, practise a two-minute plank and single-leg balance exercises at home.",
    commonMistakes: [
      "Gripping with the knees, which lifts the seat out of the saddle and reduces stability",
      "Using the reins for balance, creating a hard contact that restricts the horse",
      "Tipping forward from the waist, placing the rider ahead of the horse's centre of gravity",
      "Rounding the lower back and sitting on the back of the seat bones instead of maintaining a neutral pelvis",
      "Stiffening through the hips and lower back instead of absorbing the horse's movement",
    ],
    knowledgeCheck: [
      {
        question: "What is an independent seat?",
        options: [
          "The ability to ride without a saddle",
          "The ability to maintain balance without relying on the reins or stirrups, using each aid independently",
          "A type of saddle designed for balance",
          "The ability to ride with one hand",
        ],
        correctIndex: 1,
        explanation:
          "An independent seat means the rider can maintain a stable, balanced position without using the reins for support or stirrups for security, and can apply each aid independently.",
      },
      {
        question: "Which alignment is correct for a balanced riding position?",
        options: [
          "Ear, knee, toe in a line",
          "Shoulder, hand, heel in a line",
          "Ear, shoulder, hip, heel in a vertical line",
          "Head, elbow, knee, ankle in a line",
        ],
        correctIndex: 2,
        explanation:
          "The ear, shoulder, hip, and heel should form a vertical line when viewed from the side. This places the rider's centre of gravity over the horse's centre of gravity.",
      },
      {
        question: "Why is gripping with the knee a fault?",
        options: [
          "It causes the rider to lean forward",
          "It lifts the seat out of the saddle and pushes the lower leg away, reducing stability",
          "It makes the horse go faster",
          "It wears out the saddle",
        ],
        correctIndex: 1,
        explanation:
          "Gripping with the knee acts as a pivot point, lifting the seat out of the saddle and swinging the lower leg away from the horse's side. This reduces stability and makes it harder to apply effective leg aids.",
      },
      {
        question:
          "What off-horse activity is particularly beneficial for developing rider balance?",
        options: [
          "Running long distances",
          "Weightlifting with heavy weights",
          "Pilates or core stability exercises",
          "Swimming",
        ],
        correctIndex: 2,
        explanation:
          "Pilates and core stability exercises develop the suppleness, strength, and body awareness that directly transfer to the riding position. They specifically target the core muscles that stabilise the rider in the saddle.",
      },
      {
        question:
          "What is the benefit of lunge lessons for developing an independent seat?",
        options: [
          "The rider can go faster on the lunge",
          "The rider can focus entirely on position without worrying about steering",
          "The horse learns to lunge better",
          "The instructor can stand further away",
        ],
        correctIndex: 1,
        explanation:
          "On the lunge, the instructor controls the horse, freeing the rider to concentrate fully on their position, balance, and the feel of the horse's movement without the distraction of steering.",
      },
    ],
    aiTutorPrompts: [
      "What are the best off-horse exercises I can do to improve my seat and core stability?",
      "How do I know if I am gripping with my knees, and what does it feel like when I stop?",
      "Can you explain the concept of a three-point seat and neutral pelvis in more detail?",
    ],
    linkedCompetencies: ["balance_and_coordination", "rider_position"],
  },
  {
    slug: "warmup-cooldown-basics",
    pathwaySlug: "developing-rider-skills",
    title: "Warm-Up and Cool-Down Basics",
    level: "beginner",
    category: "Lesson Management",
    sortOrder: 6,
    objectives: [
      "Understand why warming up and cooling down are essential for horse welfare and performance",
      "Learn a structured warm-up routine suitable for flatwork sessions",
      "Know how to cool a horse down properly after exercise",
      "Recognise signs that a horse is adequately warmed up or insufficiently cooled down",
    ],
    content: `Every riding session should begin with a thorough warm-up and end with a proper cool-down. These are not optional extras or time-fillers — they are essential for the horse's physical welfare, mental preparation, and long-term soundness. A well-planned warm-up prepares the horse's muscles, tendons, and joints for the work ahead, while a proper cool-down allows the body to recover gradually and prevents stiffness or injury.

The warm-up should begin on a long rein at walk. Walking allows the horse to stretch its muscles gently, loosen its joints, and settle mentally into the session. The rider should walk on both reins, using large figures such as 20-metre circles and changes of rein through the diagonal. This initial walking phase should last at least five to ten minutes, longer in cold weather or if the horse has been standing in a stable. During this time, the rider should observe the horse's way of going — is it stepping under with the hind legs, is the walk relaxed and purposeful, is there any stiffness or unevenness?

After the initial walk, the rider can pick up a working trot. The trot should be established gradually, beginning with a forward, active rhythm on a long rein before shortening the reins and taking up a contact. Rising trot is preferable during the warm-up as it is easier on the horse's back. The rider should trot on both reins, incorporating 20-metre circles, changes of rein, and transitions between walk and trot. The goal is to encourage the horse to swing through its back, step under with the hind legs, and seek the contact forward and down.

As the horse loosens up, the rider can begin to introduce more demanding exercises — smaller circles, changes of bend, and transitions within the trot (lengthening and shortening the stride). However, the warm-up is not the time for intense collected work, lateral movements, or demanding exercises. These should be saved for the main body of the session when the horse's muscles are fully warmed and ready.

Signs that the horse is warmed up include a relaxed, swinging back, an even rhythm, willingness to stretch into the contact, and a general sense of looseness and suppleness. If the horse feels stiff, tight, or resistant, more time should be spent warming up before progressing to harder work. Pushing a horse into demanding exercises before it is properly warmed up significantly increases the risk of muscle strain or soft tissue injury.

The cool-down is equally important. After the main work of the session, the rider should gradually reduce the intensity — returning to a working trot, then a free walk on a long rein. The walk phase at the end of the session should last at least ten minutes, allowing the horse's heart rate, breathing, and body temperature to return to normal gradually.

During the cool-down, the horse should be encouraged to stretch its neck forward and down, which helps release tension in the back muscles. The rider should walk on both reins, using gentle changes of direction to keep the horse attentive but relaxed. If the horse has worked hard, particularly in warm weather, the rider should check for excessive sweating, rapid breathing, or signs of distress.

In hot weather, additional cooling measures may be necessary. Sponging the horse with cool water on the neck, chest, and between the hind legs helps reduce body temperature. The horse should be offered small sips of water but not allowed to drink large quantities while still hot. Walking the horse in hand after dismounting can also aid the cooling process.

In cold weather, the horse may need a cooler rug placed over its quarters during the walking phase to prevent the muscles from cooling too rapidly, which can cause stiffness and discomfort.

Failing to cool a horse down properly can lead to muscle stiffness, tying-up (a painful muscle condition), dehydration, and general discomfort. It also makes the horse less willing to work in future sessions, as it associates exercise with the unpleasant feeling of not being properly looked after afterwards.

A responsible rider always prioritises the horse's welfare by allowing adequate time for both warming up and cooling down. This is a fundamental principle of good horsemanship that applies to every riding session, regardless of its intensity or duration.`,
    keyPoints: [
      "Every session must begin with at least five to ten minutes of walk on a long rein",
      "The warm-up should progress gradually from walk to trot, using large figures on both reins",
      "Signs of a warmed-up horse include a relaxed back, even rhythm, and willingness to stretch into the contact",
      "The cool-down should include at least ten minutes of walk to return the horse's heart rate and breathing to normal",
      "In hot weather, sponge the horse with cool water; in cold weather, use a cooler rug during the walk phase",
    ],
    safetyNote:
      "Never skip the warm-up, especially in cold weather. A horse with cold, stiff muscles is more likely to stumble, spook, or injure itself. If the horse shows signs of distress during or after exercise — excessive sweating, rapid breathing, trembling, or reluctance to move — stop work immediately and seek advice.",
    practicalApplication:
      "Before your next lesson, arrive early enough to walk the horse for ten minutes on a long rein before the instructor begins the session. After the lesson, spend a full ten minutes walking on a long rein, changing the rein several times. Note how the horse's way of going changes from the beginning of the warm-up to the end.",
    commonMistakes: [
      "Rushing the warm-up and asking for demanding work before the horse is ready",
      "Skipping the cool-down walk and putting the horse away while it is still hot or breathing heavily",
      "Using the warm-up for intense schooling rather than gentle preparation",
      "Not walking on both reins during the warm-up and cool-down",
      "Ignoring signs that the horse is still stiff or not properly warmed up",
    ],
    knowledgeCheck: [
      {
        question: "How long should the initial walk phase of a warm-up last?",
        options: [
          "One to two minutes",
          "At least five to ten minutes",
          "Thirty seconds",
          "Warming up at walk is not necessary",
        ],
        correctIndex: 1,
        explanation:
          "The initial walk phase should last at least five to ten minutes to allow the horse's muscles, tendons, and joints to warm up gradually. Longer may be needed in cold weather.",
      },
      {
        question: "What is a sign that a horse is properly warmed up?",
        options: [
          "The horse is sweating profusely",
          "The horse has a relaxed, swinging back and even rhythm",
          "The horse is moving very slowly",
          "The horse is trying to canter",
        ],
        correctIndex: 1,
        explanation:
          "A properly warmed-up horse shows a relaxed, swinging back, an even and consistent rhythm, and willingness to stretch into the contact. These signs indicate the muscles are loose and ready for work.",
      },
      {
        question: "Why is the cool-down important?",
        options: [
          "It is only important for competition horses",
          "It allows the horse's heart rate, breathing, and temperature to return to normal gradually",
          "It teaches the horse to walk slowly",
          "It is not particularly important if the horse was not worked hard",
        ],
        correctIndex: 1,
        explanation:
          "The cool-down allows the horse's body to recover gradually. Without it, the horse risks muscle stiffness, tying-up, dehydration, and general discomfort.",
      },
      {
        question:
          "What additional measure should be taken when cooling down in hot weather?",
        options: [
          "Put a heavy rug on the horse",
          "Allow the horse to drink as much water as it wants immediately",
          "Sponge the horse with cool water on the neck, chest, and between the hind legs",
          "Trot the horse to cool it down faster",
        ],
        correctIndex: 2,
        explanation:
          "In hot weather, sponging with cool water on key areas — the neck, chest, and between the hind legs — helps reduce the horse's body temperature safely and effectively.",
      },
    ],
    aiTutorPrompts: [
      "How should I adjust my warm-up routine in very cold or very hot weather?",
      "What are the signs of tying-up, and how does a proper cool-down help prevent it?",
      "Can you suggest a ten-minute warm-up plan I can use before my flatwork sessions?",
    ],
    linkedCompetencies: ["welfare_awareness", "rider_position"],
  },
  {
    slug: "preparing-for-a-lesson",
    pathwaySlug: "developing-rider-skills",
    title: "Preparing for a Lesson",
    level: "beginner",
    category: "Lesson Management",
    sortOrder: 7,
    objectives: [
      "Understand how to prepare yourself and the horse before a riding lesson",
      "Learn the importance of punctuality, appropriate clothing, and equipment checks",
      "Know how to groom, tack up, and present a horse ready for a lesson",
      "Develop a pre-lesson routine that promotes safety and good horsemanship",
    ],
    content: `Preparing properly for a riding lesson is a skill in itself and one that is often overlooked by beginner riders. Good preparation ensures that the lesson time is used effectively, that the horse is comfortable and ready to work, and that safety standards are maintained. Arriving flustered, improperly dressed, or with a poorly groomed horse wastes valuable lesson time and can create unnecessary risks.

The first aspect of preparation is the rider. Every rider should arrive at the yard with enough time to get ready before the lesson begins — at least thirty minutes for riders who need to catch, groom, and tack up their horse. Appropriate clothing is essential: a correctly fitted, current-standard riding hat (meeting PAS015, SNELL, or ASTM/SEI standards), jodhpurs or breeches, riding boots with a small heel (not trainers or wellington boots), and gloves. A body protector is recommended for jumping and cross-country work and may be required by the riding school. Jewellery should be removed, and long hair tied back. These are not arbitrary rules — they are safety measures designed to protect the rider.

Grooming the horse before riding is both a welfare requirement and a bonding opportunity. The rider should check the horse over for any signs of injury, swelling, heat in the legs, or changes in behaviour that might indicate discomfort. Begin grooming with a rubber curry comb or plastic curry comb in circular motions to loosen dirt and mud, paying particular attention to the areas where the saddle and girth will sit. Follow with a dandy brush to remove the loosened debris, then a body brush for a finer finish. The feet should be picked out thoroughly — checking for stones, signs of thrush, and the condition of the shoes. A dirty hoof or a loose shoe can cause serious problems during a ride.

Tacking up correctly is a critical skill. The saddle should be placed gently on the horse's back, positioned behind the withers with the girth hanging evenly on both sides. The girth should be tightened gradually and checked again before mounting. The bridle should be fitted so that the bit sits comfortably in the corners of the horse's mouth, the browband is not pinching the ears, and the noseband allows two fingers' width of space. The throatlatch should permit a fist's width between it and the horse's cheek.

Before mounting, the rider should perform a final safety check: is the girth tight enough, are the stirrups the correct length, is the bridle fitted properly, are all buckles and straps fastened securely? The rider should also check the arena or riding area for hazards — loose poles, puddles, uneven ground, or anything that might spook the horse.

Mental preparation is often neglected but equally important. Before mounting, the rider should think about what they want to achieve in the lesson. Do they have specific goals — improving their rising trot, working on transitions, or practising a dressage test? Having a focus helps the rider engage with the lesson and make progress rather than simply going through the motions. If the rider has concerns or questions, these should be discussed with the instructor before mounting.

Warming up the horse properly is the final step in preparation and is covered in detail in the warm-up lesson. However, the rider should know that the first few minutes of the lesson should always be spent walking on a long rein to allow the horse to stretch and settle.

After the lesson, the rider's responsibilities continue. The horse should be untacked carefully, checked over for any rubs or injuries, and rugged or turned out as appropriate. Tack should be cleaned and put away tidily. Leaving a horse sweaty and unkempt after a lesson is poor horsemanship and reflects badly on the rider.

Good preparation becomes second nature with practice, and it is a mark of a committed, responsible rider. Whether you are preparing for a casual hack, a schooling session, or a competition, the principles are the same: plan ahead, check everything twice, and always put the horse's welfare first.`,
    keyPoints: [
      "Arrive at least thirty minutes before the lesson to allow time for grooming and tacking up",
      "Wear appropriate, correctly fitted safety equipment including a current-standard riding hat",
      "Groom the horse thoroughly, paying attention to the saddle and girth areas, and pick out all four feet",
      "Tack up carefully, checking the fit of the saddle, girth, and bridle before mounting",
      "Perform a final safety check of all equipment and the riding area before getting on",
      "Set a mental goal for the lesson to make the most of the time with your instructor",
    ],
    safetyNote:
      "Never ride without a correctly fitted, current-standard riding hat. Check that the hat's harness is fastened securely and that the hat has not been dropped or damaged. If in doubt about the hat's safety, replace it before riding.",
    practicalApplication:
      "Create a personal pre-lesson checklist that you can follow each time you ride. Include items such as: hat check, clothing check, grooming routine, tacking-up checks, girth tightness, stirrup length, bridle fit, and a mental goal for the session. Use the checklist for your next three lessons and note how it improves your preparation.",
    commonMistakes: [
      "Arriving late and rushing through grooming and tacking up",
      "Not picking out the horse's feet before riding",
      "Failing to check the girth before mounting, leading to a slipping saddle",
      "Wearing inappropriate footwear such as trainers or shoes without a heel",
      "Neglecting to check the bridle fit, resulting in a pinching browband or incorrectly adjusted noseband",
    ],
    knowledgeCheck: [
      {
        question:
          "How early should a rider aim to arrive before a lesson if they need to groom and tack up?",
        options: [
          "Five minutes before",
          "At least thirty minutes before",
          "Exactly on time",
          "One hour before",
        ],
        correctIndex: 1,
        explanation:
          "Arriving at least thirty minutes before the lesson allows adequate time to groom the horse properly, tack up carefully, and perform all safety checks without rushing.",
      },
      {
        question:
          "What should the rider check when picking out the horse's feet?",
        options: [
          "Only whether the shoes are shiny",
          "Stones, signs of thrush, and the condition of the shoes",
          "Only the colour of the hoof",
          "Whether the feet are wet",
        ],
        correctIndex: 1,
        explanation:
          "When picking out feet, the rider should check for lodged stones, signs of thrush (a foul-smelling black discharge), and the condition of the shoes — looking for loose nails, worn shoes, or risen clenches.",
      },
      {
        question: "How should a noseband be fitted?",
        options: [
          "As tight as possible",
          "So loose that it hangs below the bit",
          "Allowing two fingers' width of space",
          "It does not matter how tight the noseband is",
        ],
        correctIndex: 2,
        explanation:
          "A correctly fitted noseband allows two fingers' width of space between the noseband and the horse's face. Too tight causes discomfort; too loose serves no purpose and may interfere with the bit.",
      },
      {
        question: "Why is mental preparation before a lesson important?",
        options: [
          "It is not important",
          "It helps the rider set goals and engage with the lesson for better progress",
          "It makes the horse behave better",
          "It is only necessary for competition riders",
        ],
        correctIndex: 1,
        explanation:
          "Mental preparation — setting goals and thinking about what to work on — helps the rider focus during the lesson, engage with the instructor's guidance, and make measurable progress.",
      },
      {
        question: "What standard should a riding hat meet?",
        options: [
          "Any standard is acceptable",
          "PAS015, SNELL, or ASTM/SEI current standards",
          "The hat only needs to fit well",
          "Standards are only important for competitions",
        ],
        correctIndex: 1,
        explanation:
          "Riding hats must meet current safety standards such as PAS015, SNELL, or ASTM/SEI. These standards ensure the hat provides adequate protection in the event of a fall.",
      },
    ],
    aiTutorPrompts: [
      "Can you walk me through the correct order for grooming a horse before a lesson?",
      "How do I check that my saddle and bridle are fitted correctly?",
      "What should I include in a pre-lesson safety checklist?",
    ],
    linkedCompetencies: ["yard_safety_awareness", "tacking_up_correctly"],
  },
  {
    slug: "reflecting-on-performance",
    pathwaySlug: "developing-rider-skills",
    title: "Reflecting on Performance and Improvement",
    level: "developing",
    category: "Rider Development",
    sortOrder: 8,
    objectives: [
      "Understand the value of self-reflection and feedback in rider development",
      "Learn how to evaluate a riding session objectively",
      "Develop the habit of setting specific, measurable goals for improvement",
      "Know how to use a riding journal or diary to track progress over time",
    ],
    content: `Reflection is one of the most powerful tools available to any rider, yet it is one of the most underused. Many riders finish a lesson, untack their horse, and move on without pausing to consider what went well, what was difficult, and what they should focus on next time. Developing the habit of structured reflection transforms the learning process, turning every ride into a stepping stone towards genuine improvement.

Reflection begins during the lesson itself. A good rider pays attention to how things feel — not just whether they got the right answer, but how they got it. Did the transition feel smooth? Was the circle truly round? Did the horse respond to a light aid, or did the rider have to ask repeatedly? This kind of in-the-moment awareness is sometimes called proprioception or kinaesthetic awareness, and it develops with practice. The rider who can feel a good canter transition without being told by the instructor is further along in their development than the rider who only knows it was good because someone said so.

After the lesson, the rider should spend a few minutes reviewing the session. This can be done mentally or, even better, by writing in a riding journal or diary. A useful framework for reflection is to ask three questions: What went well? What was challenging? What will I focus on next time? This simple structure ensures that the rider acknowledges progress (which builds confidence), identifies areas for improvement (which gives direction), and sets a specific goal for the next session (which creates motivation).

Setting goals is a critical part of the improvement process. Goals should be specific, measurable, and realistic. "I want to be a better rider" is too vague to be useful. "I want to ride three smooth walk-to-trot transitions on each rein in my next lesson" is specific, measurable, and achievable. Specific goals give the rider something concrete to work towards and make it easier to evaluate progress.

A riding journal or diary is an invaluable tool. Each entry might include the date, the horse ridden, the exercises covered, the rider's assessment of what went well and what was difficult, any feedback from the instructor, and a goal for the next session. Over time, the journal becomes a detailed record of the rider's development. Looking back through previous entries reveals patterns — recurring difficulties, gradual improvements, and the exercises or techniques that made the biggest difference.

Feedback from the instructor is another essential component of reflection. A good instructor observes the rider objectively and provides clear, constructive feedback. However, the rider's role is not passive — they should actively listen to feedback, ask questions if something is unclear, and consider how the feedback relates to their own experience during the ride. Did the instructor's comment match what the rider felt? If not, why not? This kind of engaged dialogue between rider and instructor accelerates learning.

Video can be a powerful aid to reflection. Having a friend or family member film part of a lesson allows the rider to see their position and the horse's way of going from the outside. Many riders are surprised by what they see — they may feel straight but appear crooked, or think they are sitting deeply but can see their seat lifting out of the saddle. Video provides objective evidence that complements the rider's subjective feel.

It is also important to reflect on the horse's performance, not just the rider's. Was the horse relaxed and willing, or tense and resistant? Did it respond to light aids, or was it dull and unresponsive? Were there any signs of discomfort or unwillingness that might indicate a physical issue? The rider's reflection should always include consideration of the horse's welfare and way of going.

Emotional reflection is part of the process too. Riding is an emotional activity — riders experience frustration, elation, anxiety, and satisfaction, sometimes all in the same lesson. Acknowledging these emotions is healthy and helps the rider understand their own responses. A rider who recognises that they become tense and grip with their legs when anxious can work on relaxation techniques. A rider who celebrates small victories maintains motivation through difficult periods.

Finally, reflection should be balanced. It is easy to focus only on what went wrong and ignore what went right. Equally, it is tempting to gloss over difficulties and only remember the highlights. A balanced, honest assessment — recognising both strengths and weaknesses — is the hallmark of a mature and developing rider. Every ride offers lessons, and the rider who takes time to learn from each one will progress faster and with greater enjoyment than the rider who simply turns up and rides without thinking.`,
    keyPoints: [
      "Structured reflection after every session accelerates learning and improvement",
      "Use the framework: What went well? What was challenging? What will I focus on next time?",
      "Set specific, measurable goals rather than vague aspirations",
      "Keep a riding journal to track progress, feedback, and goals over time",
      "Actively engage with instructor feedback and consider how it relates to what you felt during the ride",
    ],
    safetyNote:
      "Reflection includes considering the horse's physical state. If you notice any signs of discomfort, lameness, or unusual behaviour during your review, report these to the yard manager or instructor immediately, even if the lesson has ended.",
    practicalApplication:
      "Start a riding journal today. After your next lesson, write down three things that went well, two things that were challenging, and one specific goal for your next session. Include any feedback your instructor gave you. Review your journal entries after five lessons and note any patterns or improvements.",
    commonMistakes: [
      "Not reflecting at all — finishing a lesson and moving on without considering what was learned",
      "Focusing only on negatives and ignoring what went well, which erodes confidence",
      "Setting vague goals such as 'ride better' instead of specific, measurable targets",
      "Ignoring instructor feedback or not asking for clarification when something is unclear",
      "Forgetting to reflect on the horse's performance and welfare alongside the rider's own progress",
    ],
    knowledgeCheck: [
      {
        question:
          "What is a useful framework for reflecting on a riding session?",
        options: [
          "Rate the session out of ten",
          "What went well? What was challenging? What will I focus on next time?",
          "Only think about what the horse did wrong",
          "Ask the instructor to write a report",
        ],
        correctIndex: 1,
        explanation:
          "This three-question framework ensures the rider acknowledges progress, identifies areas for improvement, and sets a concrete goal — covering all the essential elements of productive reflection.",
      },
      {
        question: "What makes a good riding goal?",
        options: [
          "It should be as ambitious as possible",
          "It should be vague so the rider does not feel pressured",
          "It should be specific, measurable, and realistic",
          "It should only focus on competition results",
        ],
        correctIndex: 2,
        explanation:
          "Specific, measurable, and realistic goals give the rider a clear target to work towards and make it possible to evaluate whether progress has been made.",
      },
      {
        question: "Why is a riding journal valuable?",
        options: [
          "It is required by riding schools",
          "It creates a detailed record of progress, patterns, and instructor feedback over time",
          "It replaces the need for an instructor",
          "It is only useful for advanced riders",
        ],
        correctIndex: 1,
        explanation:
          "A riding journal provides a written record that reveals patterns, tracks improvements, and preserves instructor feedback. Over time, it becomes an invaluable tool for understanding the rider's development.",
      },
      {
        question: "How can video help with reflection?",
        options: [
          "It allows the rider to see their position objectively from the outside",
          "It is only useful for social media",
          "It replaces the need for an instructor",
          "It is not helpful for reflection",
        ],
        correctIndex: 0,
        explanation:
          "Video provides objective evidence of the rider's position and the horse's way of going. It often reveals things the rider cannot feel, such as crookedness, a lifting seat, or uneven contact.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me create a template for a riding journal entry?",
      "How do I set effective goals for my riding improvement?",
      "What should I look for when reviewing a video of my riding?",
    ],
    linkedCompetencies: ["rider_position", "welfare_awareness"],
  },

  {
    slug: "advanced-flatwork-and-collection",
    pathwaySlug: "developing-rider-skills",
    title: "Advanced Flatwork & Collection",
    level: "advanced",
    category: "Developing Rider Skills",
    sortOrder: 9,
    objectives: [
      "Understand the concepts of true collection, engagement, and throughness",
      "Ride medium and extended gaits with control and balance",
      "Introduce lateral movements including half-pass",
      "Understand the aids and preparation for flying changes",
    ],
    content: `Advanced flatwork represents the pinnacle of communication between horse and rider on the flat. It demands a deep understanding of biomechanics, subtle aids, and the ability to feel and influence the horse's balance, rhythm, and suppleness at every moment. This lesson builds on your existing knowledge of basic school movements and introduces the concepts and skills required to achieve true collection and advanced lateral work.

## True Collection

Collection is one of the most misunderstood concepts in riding. It is **not** simply slowing the horse down or shortening the stride. True collection involves the horse shifting its centre of gravity rearward by engaging the hindquarters more actively, lowering the croup slightly, and lightening the forehand. The result is a horse that feels elevated, powerful, and supremely manoeuvrable.

The key elements of collection are:

- **Engagement** — The hind legs step further under the horse's body, carrying more of the weight. This is generated through effective half-halts and progressive training.
- **Self-carriage** — The horse maintains its frame and balance without relying on the rider's hand for support. You can test self-carriage by momentarily softening the rein contact — a collected horse will maintain its outline.
- **Throughness** (*Durchlässigkeit*) — This German training term refers to the horse being permeable to the aids, with energy flowing from the hindquarters through a supple back to a soft, accepting contact. A horse that is truly 'through' responds instantly and lightly to the rider's seat, leg, and hand.

Achieving collection takes months of progressive training. It cannot be forced or faked by pulling the horse's head in with the reins. A progressive training approach treats collection as a later-stage outcome built upon rhythm, suppleness, contact, impulsion, and straightness.

## Medium and Extended Gaits

Medium and extended gaits are the natural counterpart to collection. They demonstrate the horse's ability to lengthen its frame and stride while maintaining rhythm and balance.

**Medium trot and canter** require the horse to cover more ground with each stride without rushing. The tempo (speed of the rhythm) should remain the same — only the stride length increases. Common faults include the horse running onto the forehand, losing rhythm, or hollowing the back.

To ride a medium trot:
1. Establish a good working or collected trot on a short side.
2. As you turn onto the diagonal, use both legs to ask for more energy while allowing with the hand so the horse can lengthen its frame.
3. Maintain the rhythm — count in your head if needed.
4. Before the next short side, half-halt to rebalance and return to working or collected trot.

**Extended gaits** require even greater engagement and expression. The horse should reach maximum stride length with clear overtrack (the hind foot landing in front of the forefoot print). This is physically demanding and should only be asked for when the horse is well warmed up and established in medium gaits.

## Half-Pass

Half-pass is a lateral movement in which the horse moves simultaneously forward and sideways, bent in the direction of travel. It is ridden in trot or canter and requires a high degree of collection, suppleness, and rider coordination.

**The aids for half-pass (to the left):**
- Weight slightly into the left seat bone.
- Left (inside) leg at the girth to maintain bend and forward impulsion.
- Right (outside) leg behind the girth to push the horse sideways.
- Left rein to maintain flexion; right rein to control the degree of sideways movement.

**Common faults:**
- Trailing hindquarters — the shoulders lead too much because the outside leg is not effective.
- Losing bend — the horse straightens or bends the wrong way.
- Losing impulsion — the horse slows because the rider focuses on the sideways movement at the expense of forward energy.

Start by practising shoulder-in and travers (haunches-in) to develop the necessary suppleness and responsiveness before combining them into half-pass.

## Flying Changes — An Introduction

A flying change is a change of canter lead during the moment of suspension. It is a natural movement for the horse — you will see horses performing flying changes when playing in the field — but achieving it under saddle with balance and precision requires careful preparation.

**Prerequisites for flying changes:**
- The horse must be balanced and responsive in counter-canter.
- Clear, prompt simple changes (through trot or walk) must be established.
- The horse must be straight and not anticipating the change.

The aid involves a clear switch of the rider's leg position during the moment of suspension, combined with a subtle shift of weight. Timing is critical. Initially, flying changes are best introduced with the help of an experienced trainer, as incorrect technique can lead to the horse becoming tense, crooked, or anticipating changes at every opportunity.

This lesson provides the theoretical foundation — practical work on flying changes should always be supervised by a qualified coach.`,
    keyPoints: [
      "True collection involves engagement, self-carriage, and throughness — not simply slowing down",
      "Medium and extended gaits maintain the same tempo but increase stride length and ground cover",
      "Half-pass combines forward and sideways movement with bend in the direction of travel",
      "Flying changes require thorough preparation in counter-canter and simple changes before attempting",
      "Collection is the final stage of the training scale, built upon rhythm, suppleness, contact, impulsion, and straightness",
    ],
    safetyNote:
      "Advanced flatwork demands a fit, well-schooled horse and a balanced, independent rider. Attempting collected or lateral work on a horse that is not physically prepared risks muscle strain and joint injury. If the horse shows signs of resistance, tension, or discomfort, simplify the exercise and consult a qualified trainer. Flying changes should only be introduced under expert supervision.",
    practicalApplication:
      "Begin by assessing your horse's current level of engagement. Can you ride a half-halt and feel the horse lighten the forehand? Practise transitions within the pace — working trot to medium trot and back — focusing on maintaining rhythm while increasing stride length. Work on shoulder-in and travers independently before combining them. Keep a training diary to track incremental progress towards collection.",
    commonMistakes: [
      "Pulling the horse's head in with the reins to create a false outline rather than developing true engagement from behind",
      "Rushing medium gaits so the horse falls onto the forehand instead of lengthening with balance",
      "Attempting half-pass before the horse is established in shoulder-in and travers, resulting in loss of bend and impulsion",
    ],
    knowledgeCheck: [
      {
        question: "What is the key characteristic of true collection?",
        options: [
          "The horse moves slowly with its head pulled in by the reins",
          "The horse shifts its centre of gravity rearward with engaged hindquarters and a lightened forehand",
          "The horse stops moving forward and only moves sideways",
          "The rider holds the horse in place with strong rein contact",
        ],
        correctIndex: 1,
        explanation:
          "True collection involves the horse engaging its hindquarters to carry more weight, lowering the croup, and lightening the forehand. It is generated from behind, not created by the rider's hands.",
      },
      {
        question:
          "In a medium trot, what should remain the same as in working trot?",
        options: [
          "The stride length",
          "The frame and outline",
          "The tempo (speed of the rhythm)",
          "The amount of rein contact",
        ],
        correctIndex: 2,
        explanation:
          "In medium trot, the stride length and frame increase but the tempo — the speed of the rhythm — should remain the same. Rushing or quickening the tempo indicates a loss of balance.",
      },
      {
        question: "What are the prerequisites for introducing flying changes?",
        options: [
          "The horse must be able to gallop fast and stop quickly",
          "The rider must be able to ride without reins",
          "The horse must be balanced in counter-canter and established in simple changes",
          "Flying changes require no preparation and can be attempted at any stage of training",
        ],
        correctIndex: 2,
        explanation:
          "Flying changes require the horse to be balanced and responsive in counter-canter, with clear and prompt simple changes already established. Without this foundation, the horse may become tense or crooked.",
      },
    ],
    aiTutorPrompts: [
      "How can I tell the difference between true collection and a horse that is just being held in by the reins?",
      "What exercises can I use to improve my horse's engagement and preparation for medium trot?",
      "Can you explain the aids for half-pass step by step?",
    ],
    linkedCompetencies: ["rider_position", "schooling_exercises"],
  },

  {
    slug: "riding-assessment-and-self-coaching",
    pathwaySlug: "developing-rider-skills",
    title: "Riding Assessment & Self-Coaching",
    level: "advanced",
    category: "Developing Rider Skills",
    sortOrder: 10,
    objectives: [
      "Use video analysis to objectively assess your own riding",
      "Develop the skill of honest self-assessment without a coach present",
      "Set effective training goals based on identified weaknesses",
      "Create structured improvement plans with measurable milestones",
    ],
    content: `As you advance in your riding, the ability to assess your own performance and coach yourself between professional lessons becomes increasingly important. Relying solely on a coach for all feedback limits your development — the best riders are those who can critically and honestly evaluate themselves, identify areas for improvement, and create actionable plans to address them. This lesson teaches you the tools and techniques for effective self-coaching.

## Video Analysis of Riding

Video is the single most powerful tool for self-assessment. What you feel in the saddle does not always match reality. A rider who feels they are sitting upright may be leaning forward; a horse that feels engaged may be on the forehand. Video provides objective evidence.

**Setting up video analysis:**
- Ask a friend or use a tripod and smartphone to record your sessions. Position the camera at the centre of the long side of the arena, at hip height, for the best angle. Recording from multiple angles (long side and short side) gives a more complete picture.
- Record entire sessions, not just the best moments. Mistakes are where the most learning occurs.
- Use slow-motion playback to examine transitions, aids, and the horse's way of going in detail.

**What to look for:**
- **Rider position** — Is your ear, shoulder, hip, and heel aligned? Are your hands steady? Is your head up and looking ahead? Do you collapse to one side?
- **Horse's way of going** — Is the horse tracking up? Is the back swinging? Is the outline consistent, or does the horse drop behind the vertical or come above the bit?
- **Transitions** — Are they smooth and balanced, or abrupt and hollow?
- **Accuracy** — Are your circles round? Are your changes of rein through X? Do you ride into the corners?
- **Rhythm and tempo** — Is the horse's rhythm consistent, or does it speed up and slow down?

Compare your video with footage of riders you admire or demonstrations from suitably qualified coaches. Note the differences without being self-critical — the goal is objective assessment, not self-punishment.

## Objective Self-Assessment

Self-assessment is a skill that must be developed. Most riders are either too harsh on themselves (focusing only on faults) or too lenient (ignoring consistent issues). The key is to be **objective and balanced**.

**A structured self-assessment framework:**
1. **What went well?** — Identify at least three things you did well in the session. This builds positive reinforcement and helps you recognise your strengths.
2. **What could be improved?** — Identify one or two specific areas that need work. Be precise: "My left shoulder drops in canter" is more useful than "My position was bad."
3. **What was the horse's feedback?** — How did the horse respond? Resistance, tension, or evasion from the horse often indicates an issue with the rider's aids or balance.
4. **What will I focus on next time?** — Turn your assessment into an action point for the next session.

Keep a **riding journal**. After each session, spend five minutes writing down your answers to these four questions. Over weeks and months, patterns will emerge that highlight consistent strengths and weaknesses.

## Setting Training Goals

Effective goals follow the **SMART** framework:
- **Specific** — "I will improve my canter-to-trot transitions" rather than "I will ride better."
- **Measurable** — How will you know you have achieved it? "I will perform three balanced canter-to-trot transitions on each rein without the horse falling onto the forehand."
- **Achievable** — Set goals that stretch you but are realistic given your current level and the horse's training.
- **Relevant** — The goal should address a genuine weakness or support your broader riding ambitions.
- **Time-aware** — Agree a realistic review point with your coach or responsible instructor, taking account of the horse, rider, welfare and access to suitable supervision.

Break larger goals into smaller, coach-agreed milestones. For a balanced medium trot, this might mean first checking that the horse and rider are ready for the work; then practising preparation under suitable supervision; then reviewing the quality of a brief attempt; and finally deciding with the coach whether the next progression is appropriate. Stop, simplify or seek advice if the horse becomes tense, uncomfortable or unbalanced.

## Creating Improvement Plans

An improvement plan brings goals and self-assessment together into a practical roadmap.

**Structure of an improvement plan:**
- **Current assessment** — Where are you now? (Use video and journal evidence.)
- **Target** — What improvement is appropriate for the horse and rider at this stage?
- **Focus areas** — What coach-agreed skill or welfare observation will you work on next?
- **Resources needed** — Do you need a coach session, a different horse, or specific equipment?
- **Review points** — Agree review points with the coach and revise the plan when welfare, safety, progress or circumstances change.

Share the improvement plan with a qualified coach. External perspective helps keep assessment honest, welfare-aware and realistic. Re-film only when it is safe and useful, then review the footage against the coach-agreed focus rather than a generic schedule.

Self-coaching is not a replacement for professional coaching — it is a complement. The most effective approach combines regular self-assessment with periodic lessons from a qualified coach who can identify issues you cannot see or feel yourself.`,
    keyPoints: [
      "Video analysis provides an objective record that can complement qualified coaching",
      "Use a structured self-assessment framework after a suitable session: what went well, what to improve, horse feedback, next focus",
      "Set goals that are specific, measurable, achievable, relevant and reviewed at a coach-agreed time",
      "Break larger goals into coach-agreed milestones that can be revised for welfare, safety and progress",
      "Self-coaching complements professional coaching — it does not replace it",
    ],
    safetyNote:
      "When filming your riding, ensure the camera is positioned safely outside the arena and does not obstruct the horse's path. If you are riding alone to practise self-coaching, always tell someone where you are and when you expect to finish. Never attempt challenging exercises without supervision for the first time, regardless of your self-assessment confidence.",
    practicalApplication:
      "With a qualified coach’s agreement, record a suitable schooling session from a safe position. Review it using the four-point reflection: what went well, what to improve, horse feedback and next focus. Agree one appropriate goal and a review point with the coach; only re-film when it is safe and useful for that review.",
    commonMistakes: [
      "Only recording the good parts of a session rather than filming the entire ride for honest assessment",
      "Setting vague goals such as 'ride better' instead of specific, measurable targets",
      "Relying solely on self-coaching without seeking periodic input from a qualified coach for external perspective",
    ],
    knowledgeCheck: [
      {
        question: "Why is video analysis valuable for self-assessment?",
        options: [
          "It allows you to share your riding on social media",
          "It provides objective evidence that may differ from what you feel in the saddle",
          "It replaces the need for a riding coach entirely",
          "It is only useful for competition riders",
        ],
        correctIndex: 1,
        explanation:
          "What you feel in the saddle does not always match reality. Video provides an objective record that highlights issues you may not be aware of, such as positional asymmetry or the horse's way of going.",
      },
      {
        question: "What does the 'M' in SMART goals stand for?",
        options: ["Motivated", "Measurable", "Mounted", "Multiple"],
        correctIndex: 1,
        explanation:
          "The 'M' stands for Measurable. A measurable goal has clear criteria for success, such as 'Perform three balanced transitions on each rein,' so you know when you have achieved it.",
      },
      {
        question: "What is the recommended approach to self-coaching?",
        options: [
          "Replace professional coaching entirely with self-assessment",
          "Only assess yourself when you feel the session went badly",
          "Use structured self-assessment after every session, complemented by periodic professional coaching",
          "Avoid video analysis as it can be discouraging",
        ],
        correctIndex: 2,
        explanation:
          "Self-coaching works best as a complement to professional coaching. Regular structured self-assessment builds awareness, while periodic lessons with a qualified coach provide external perspective on issues you cannot see yourself.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me create a SMART goal for improving my canter transitions?",
      "What specific things should I look for when analysing a video of my trot work?",
      "How do I create a coach-agreed improvement plan that can be revised for welfare, safety and progress?",
    ],
    linkedCompetencies: ["rider_position", "welfare_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 7 — Polework & Jump Foundations
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: "introduction-to-polework",
    pathwaySlug: "polework-jump-foundations",
    title: "Introduction to Polework",
    level: "beginner",
    category: "Polework & Jump Foundations",
    sortOrder: 1,
    objectives: [
      "Understand the purpose and benefits of polework for horse and rider",
      "Know how to set up single poles and basic pole layouts safely",
      "Walk and trot over single ground poles with correct rhythm and balance",
      "Recognise common rider faults over poles such as looking down and tipping forward",
    ],
    content: `Polework is one of the most versatile and valuable training tools available to riders of all levels. Working over poles on the ground improves the horse's balance, rhythm, coordination, and proprioception — the awareness of where its limbs are in space. For the rider, polework develops timing, eye coordination, balance, and the ability to maintain a consistent rhythm while navigating obstacles.

## Why Polework Matters

Poles encourage the horse to lift its feet higher, engage its hindquarters, and use its back more effectively. This strengthens the muscles needed for correct, balanced movement. For riders, poles provide a clear visual and physical challenge that develops focus and forward planning. Even a single pole on the ground transforms a schooling session from repetitive flatwork into an exercise with purpose and variety.

## Setting Up Poles Safely

Ground poles should be sturdy, heavy enough not to roll easily, and placed on flat, even ground. When setting up poles, ensure there is enough space around the working area for the horse to approach and move away comfortably. Poles should be clearly visible — bright colours help horses judge distances. Never leave poles in walkways or gateways where horses could trip over them.

## Walking Over a Single Pole

Start at walk. Approach the pole in a straight line, looking ahead — not down at the pole. Maintain a steady rhythm and allow the horse to lower its head slightly to assess the obstacle. Keep your leg gently on to maintain forward momentum. As the horse steps over the pole, follow its movement through your hips without tipping forward or leaning back.

## Progressing to Trot

Once confident at walk, progress to trot. The key is to maintain the same rhythm before, over, and after the pole. Count the rhythm in your head: one-two, one-two. The horse should step over the pole without rushing, breaking stride, or hollowing its back. If the horse speeds up on approach, circle away and re-approach at a steadier tempo.

## Common Faults to Avoid

The most common rider fault is looking down at the pole. Looking down shifts your weight forward and can unbalance the horse. Instead, glance at the pole as you approach, then lift your eyes to a point beyond it. Other common issues include gripping with the knees (which lifts the seat), collapsing the upper body forward on landing, and pulling on the reins instead of maintaining a steady contact.

## Building Confidence

Polework should be introduced gradually. Start with one pole, then add more as confidence grows. Keep sessions short and positive. If the horse or rider becomes tense, return to comfortable work and try again another day. The goal is rhythm, calmness, and enjoyment — not perfection on day one.`,
    keyPoints: [
      "Polework improves horse balance, rhythm, coordination, and rider timing",
      "Always set up poles on flat ground with clear visibility and safe approaches",
      "Look ahead over poles, not down — looking down shifts your weight and unbalances the horse",
      "Maintain consistent rhythm before, over, and after the pole",
      "Start at walk with a single pole before progressing to trot and multiple poles",
    ],
    safetyNote:
      "Ensure poles are placed securely and cannot roll. Check the footing around poles is not slippery. Always have someone nearby when working over poles for the first time. Wear a correctly fitted hat and appropriate footwear.",
    practicalApplication:
      "Set up a single ground pole in the arena. Walk over it five times on each rein, focusing on rhythm and looking ahead. Then trot over it five times on each rein. Note whether your horse changes speed on the approach and work on maintaining a steady tempo.",
    commonMistakes: [
      "Looking down at the pole instead of ahead",
      "Tipping the upper body forward as the horse steps over",
      "Gripping with the knees and lifting out of the saddle",
      "Allowing the horse to rush or break rhythm on the approach",
      "Setting poles too close to the arena fence, restricting the approach",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the most important thing to look at when riding over a ground pole?",
        options: [
          "The pole itself",
          "Your horse's ears",
          "A point ahead beyond the pole",
          "The ground on the other side",
        ],
        correctIndex: 2,
        explanation:
          "Looking ahead beyond the pole keeps your weight centred and allows you to plan your line. Looking down at the pole causes you to tip forward and unbalances the horse.",
      },
      {
        question:
          "What should happen to the rhythm when trotting over a single pole?",
        options: [
          "The horse should speed up to jump it",
          "The rhythm should stay the same before, over, and after",
          "The horse should slow to walk",
          "You should post higher",
        ],
        correctIndex: 1,
        explanation:
          "The rhythm should remain consistent. The pole is simply part of the track — the horse should maintain its tempo without rushing or hesitating.",
      },
    ],
    aiTutorPrompts: [
      "What are the benefits of polework for a young or green horse?",
      "How do I stop my horse rushing at ground poles?",
      "What distances should I use between trot poles?",
    ],
    linkedCompetencies: ["riding_position", "balance_and_rhythm"],
  },
  {
    slug: "trot-pole-distances-and-grids",
    pathwaySlug: "polework-jump-foundations",
    title: "Trot Pole Distances & Simple Grids",
    level: "developing",
    category: "Polework & Jump Foundations",
    sortOrder: 2,
    objectives: [
      "Understand why pole spacing must be set for the individual horse, exercise and conditions",
      "Prepare a coach-approved pole exercise with a safe approach and exit",
      "Ride through a pole exercise while maintaining rhythm, balance and straightness",
      "Observe the horse’s response and seek qualified adjustment when spacing or setup needs review",
    ],
    content: `Once you are confident walking and trotting over single poles, the next step is to work through a row of poles — commonly called a grid. Grids develop the horse's ability to judge distances, improve its coordination, and build the strength needed for jumping. For the rider, grids demand consistent rhythm, accurate steering, and core stability.

## Individual Pole Spacing

Pole spacing is not a universal horse-versus-pony table. It depends on the individual horse’s way of going, fitness, current training, rider, surface, pole type and exercise objective. A qualified coach should set, observe and adjust the exercise; a learner must not apply a copied measurement from a lesson as an instruction.

## Setting Up a Pole Exercise

Use a straight, level area with a clear approach and exit, and set the number and arrangement of poles only as approved for the individual horse and exercise. Confirm that poles are secure, visible and not placed on a turn, in a gateway or where surface conditions create a risk.

## Riding Through the Grid

Approach in a steady working trot, looking ahead beyond the last pole. Maintain even rein contact and keep your leg gently on to sustain the rhythm. As you enter the grid, allow the horse to work — do not pull or push. Your job is to stay in balance, keep the rhythm, and steer straight. The horse should step neatly between each pole, lifting its feet cleanly.

## Adjusting Distances

If the horse consistently clips poles or takes choppy steps, the distance may need adjusting. Watch from the ground first: if the horse is stretching too much, bring the poles slightly closer. If the horse is cramping its stride, move them apart. Every horse is different, and conditions such as footing and energy level affect stride length.

## Progressing the Exercise

Once the basic grid is comfortable, you can raise alternate poles onto small blocks to create a bouncing effect that encourages greater engagement. You can also add a small cross-pole after the grid as an introduction to jumping from trot.`,
    keyPoints: [
      "Pole spacing must be set, observed and adjusted for the individual horse, exercise, surface and qualified-coach guidance",
      "Use a straight, level setup with a clear approach and exit that has been assessed as safe for the current exercise",
      "Maintain consistent rhythm — the horse should step neatly between each pole",
      "Adjust distances to suit the individual horse's stride length",
      "Progress by raising alternate poles or adding a small fence after the grid",
    ],
    safetyNote:
      "Do not set or alter pole spacing from a copied generic table. Use a qualified coach to assess the horse, rider, surface, pole arrangement and current exercise; stop if the horse appears uncomfortable, unsettled or unsafe. Check that poles have not rolled between uses.",
    practicalApplication:
      "With a qualified coach, set a pole exercise appropriate to the individual horse and current conditions. Ride only the coach-agreed approaches, observe rhythm and straightness, and report any concern for the setup to be reassessed rather than changing it independently.",
    commonMistakes: [
      "Not measuring distances accurately — guessing leads to incorrect spacing",
      "Allowing the horse to drift sideways through the grid instead of staying straight",
      "Looking down at the poles instead of beyond them",
      "Pulling on the reins through the grid instead of maintaining steady contact",
      "Setting poles on a curve where the distances are inconsistent",
    ],
    knowledgeCheck: [
      {
        question: "How should trot-pole spacing be determined?",
        options: [
          "By copying the same measurement for every horse",
          "By a qualified coach assessing the individual horse, exercise, rider, surface and current conditions",
          "By placing poles as close together as possible",
          "By changing several parts of the exercise at once until the horse stops touching poles",
        ],
        correctIndex: 1,
        explanation:
          "Pole spacing is individual. A qualified coach should set and observe the exercise, then make safe adjustments based on the horse, rider, footing and learning objective rather than a copied table.",
      },
      {
        question:
          "What should you do if your horse consistently clips the trot poles?",
        options: [
          "Ride faster",
          "Shout at the horse",
          "Adjust the pole distances",
          "Remove the poles",
        ],
        correctIndex: 2,
        explanation:
          "Clipping poles is a reason to stop and ask a qualified coach to reassess the horse, approach, rhythm, surface and setup. Do not independently apply a generic spacing correction.",
      },
    ],
    aiTutorPrompts: [
      "How do I measure trot pole distances accurately without a tape measure?",
      "My horse rushes through trot poles — how can I slow it down?",
      "When should I start raising poles onto blocks?",
    ],
    linkedCompetencies: ["balance_and_rhythm", "jumping_foundations"],
  },
  {
    slug: "introduction-to-jumping-position",
    pathwaySlug: "polework-jump-foundations",
    title: "The Jumping Position",
    level: "developing",
    category: "Polework & Jump Foundations",
    sortOrder: 3,
    objectives: [
      "Understand the key elements of a correct jumping position (light seat / two-point)",
      "Practise the jumping position at halt, walk, and trot without poles",
      "Know how the jumping position differs from the flatwork seat",
      "Identify common faults in the jumping position",
    ],
    content: `The jumping position — also called the light seat, forward seat, or two-point position — is essential for any rider who wants to ride over poles and fences. It allows the rider to stay in balance with the horse's movement over obstacles, keeping weight off the horse's back and allowing freedom through the shoulders.

## Key Elements of the Jumping Position

The jumping position involves shortening the stirrups one or two holes shorter than flatwork length, folding forward from the hip (not the waist), keeping the heels sunk down, the lower leg slightly behind the girth, and the hands following forward along the horse's neck through the crest. The rider's seat lifts slightly out of the saddle, and the weight drops into the heels and stirrup irons.

## The Upper Body

Fold forward from the hip joint, keeping the back flat — not rounded. Think of closing the angle between your thigh and your torso. Your chest should be open, shoulders back, and eyes looking ahead. Many riders curl their shoulders forward, which collapses the chest and rounds the back. This is one of the most common faults.

## The Lower Leg

The lower leg is the anchor of the jumping position. It should stay in contact with the horse's side, with the ball of the foot on the stirrup iron and the heel sunk deep. If the lower leg swings forward, the rider will fall behind the movement. If it swings back, the rider will tip onto the horse's neck.

## The Hands and Arms

In the jumping position, the hands should follow forward. As the horse takes off over a fence, its head and neck extend forward and down. The rider must allow this movement by pushing the hands forward along the crest — this is called a "crest release." Do not pull back on the reins over a jump, as this catches the horse in the mouth and discourages it from jumping freely.

## Practising Without Poles

The jumping position can and should be practised without poles first. At halt, stand in your stirrups with your weight in your heels and fold forward from the hip. Hold the position for 10 seconds, then sit gently. Repeat at walk and trot. This builds the strength and balance needed before adding poles or fences.`,
    keyPoints: [
      "The jumping position involves folding from the hip, sinking the heels, and staying in balance over the horse's centre",
      "Shorten stirrups one to two holes for jumping work",
      "The lower leg must remain stable — it is the anchor of the position",
      "Hands follow forward to allow the horse freedom through its head and neck",
      "Practise the position at halt, walk, and trot before attempting poles or fences",
    ],
    safetyNote:
      "Never attempt jumping without a correctly fitted, current-standard hat with secured chin strap. A body protector is recommended for all jumping work. Ensure stirrup irons are the correct size — large enough for the foot to release in a fall.",
    practicalApplication:
      "In your next schooling session, shorten your stirrups one hole and practise the jumping position at walk and trot for five minutes. Focus on keeping your heels down and your lower leg stable. Have someone observe or film you.",
    commonMistakes: [
      "Rounding the back instead of folding from the hip",
      "Looking down, which shifts the rider's weight forward",
      "Gripping with the knees and letting the lower leg swing back",
      "Standing too tall in the stirrups instead of folding at the hip",
      "Pulling on the reins for balance instead of using the mane or neckstrap",
    ],
    knowledgeCheck: [
      {
        question:
          "Where should the rider fold when adopting the jumping position?",
        options: [
          "From the waist",
          "From the hip",
          "From the knee",
          "From the shoulders",
        ],
        correctIndex: 1,
        explanation:
          "The rider folds from the hip joint, closing the angle between thigh and torso. Folding from the waist rounds the back, which is incorrect.",
      },
      {
        question: "What is a 'crest release'?",
        options: [
          "Dropping the reins completely",
          "Pushing hands forward along the horse's neck crest over a fence",
          "Gripping the mane",
          "Letting the horse slow down",
        ],
        correctIndex: 1,
        explanation:
          "A crest release involves pushing the hands forward along the crest of the horse's neck to allow the head and neck to stretch over the fence without catching the mouth.",
      },
    ],
    aiTutorPrompts: [
      "How can I improve my lower leg stability in the jumping position?",
      "What exercises can I do off the horse to strengthen my jumping position?",
      "How do I know if my stirrups are the right length for jumping?",
    ],
    linkedCompetencies: ["jumping_foundations", "rider_position"],
  },
  {
    slug: "first-crossrail-fences",
    pathwaySlug: "polework-jump-foundations",
    title: "Riding Your First Cross-Rail Fences",
    level: "intermediate",
    category: "Polework & Jump Foundations",
    sortOrder: 4,
    objectives: [
      "Understand what a cross-rail fence is and why it is used for early jumping",
      "Approach and jump a small cross-rail from trot with correct position and rhythm",
      "Know how to follow a qualified coach’s safe, horse-specific plan for a simple fence exercise",
      "Identify and correct common faults when jumping small fences",
    ],
    content: `A cross-rail (or cross-pole) is the ideal first fence for a novice jumper. The poles cross in the centre, creating a low point in the middle that naturally guides the horse to jump in the centre. Cross-rails are inviting, forgiving, and build confidence for both horse and rider.

## Setting Up a Cross-Rail

A cross-rail is made by resting two poles in an X shape—one end of each pole is on the ground and the other end is raised on a suitable support. Height, placing-pole use and all distances must be set, checked and observed by a qualified coach for the individual horse, rider, surface and current exercise; do not copy a generic setup from this lesson.

## Approaching the Fence

Approach in a steady, balanced trot. Look beyond the fence, not at it. Maintain your rhythm and keep your leg on to sustain the forward energy. Adopt the position and timing directed by the qualified coach for the current approach; do not apply a copied stride-count cue. Trust the horse — do not interfere with the reins.

## Over the Fence

As the horse takes off, fold forward from the hip and push your hands forward along the crest (crest release). Let the horse's movement carry you. Do not try to lift the horse with your body or pull yourself forward. After landing, sit up gently, re-establish your rhythm, and ride forward in a straight line.

## Building a Short Course

Once the qualified coach judges horse and rider ready, the coach may introduce an appropriate linked-fence exercise with turns between elements. Plan your track before you start: know which fences you will jump, in what order, and how you will turn between them. Ride each fence as if it were the only one — maintain rhythm, straightness, and balance throughout.

## What Makes a Good Jump?

A good jump is not about height — it is about quality. A good jump has a rhythmic approach, a correct take-off distance, a balanced flight, and a controlled landing. The rider stays in balance throughout, allows the horse freedom through its head and neck, and re-establishes rhythm quickly after landing.`,
    keyPoints: [
      "Cross-rails guide the horse to jump centrally and are ideal first fences",
      "Approach in balanced trot, looking beyond the fence, maintaining rhythm",
      "Fold from the hip on take-off and push hands forward (crest release)",
      "After landing, sit up gently and re-establish rhythm immediately",
      "Quality of the jump matters more than height — focus on rhythm, balance, and straightness",
    ],
    safetyNote:
      "Always wear a body protector for jumping. Never jump alone — always have someone on the ground who can rebuild fences and assist in an emergency. Start with fences well within your comfort zone and build up gradually.",
    practicalApplication:
      "Under qualified-coach supervision, use the current horse-specific cross-rail exercise. Focus on position, rhythm and straightness, stop if safety or welfare concerns arise, and ask the coach to reassess the setup rather than changing height, distance or placing poles independently.",
    commonMistakes: [
      "Looking down at the fence instead of beyond it",
      "Getting in front of the movement — leaning too far forward before take-off",
      "Catching the horse in the mouth by not releasing the hands forward",
      "Losing rhythm after landing and not riding forward",
      "Approaching on a crooked line rather than straight to the centre of the fence",
    ],
    knowledgeCheck: [
      {
        question: "Why are cross-rails ideal first fences for novice riders?",
        options: [
          "They are very high",
          "The X shape guides the horse to jump centrally",
          "They are the hardest type",
          "They don't need a ground pole",
        ],
        correctIndex: 1,
        explanation:
          "The crossed poles create a low central point that naturally guides the horse to take off and land in the centre, building confidence and encouraging straightness.",
      },
      {
        question:
          "What should the rider do with their hands as the horse takes off?",
        options: [
          "Pull back firmly",
          "Drop the reins",
          "Push forward along the crest",
          "Hold the pommel",
        ],
        correctIndex: 2,
        explanation:
          "Pushing the hands forward along the crest (crest release) allows the horse to stretch its head and neck over the fence without being caught in the mouth.",
      },
    ],
    aiTutorPrompts: [
      "Why must a qualified coach set a cross-rail’s height, placing pole and distances for the current horse and rider?",
      "My horse runs out at fences — what should I do?",
      "How do I know when I'm ready to raise the fences?",
    ],
    linkedCompetencies: [
      "jumping_foundations",
      "rider_position",
      "balance_and_rhythm",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 8 — Horse Health & First Response
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: "daily-health-check-and-vital-signs",
    pathwaySlug: "horse-health-first-response",
    title: "Recognising Signs of Good Health",
    level: "beginner",
    category: "Horse Health & First Response",
    sortOrder: 1,
    objectives: [
      "Identify the key indicators of a healthy horse",
      "Know the normal vital signs: temperature, pulse, and respiration (TPR)",
      "Carry out a basic daily health check",
      "Understand why daily observation is essential for early detection of problems",
    ],
    content: `Knowing what a healthy horse looks like — and being able to spot when something is wrong — is one of the most fundamental skills in horse care. Problems caught early are almost always easier and cheaper to treat, and early intervention can be life-saving in serious conditions like colic or laminitis.

## The Healthy Horse

A healthy horse is bright, alert, and interested in its surroundings. Its eyes are clear and fully open, its ears are mobile, and its expression is relaxed. The coat should be smooth and glossy (though this varies with season — a thick winter coat is normal). The horse should be standing evenly on all four feet, shifting weight occasionally but not persistently resting one leg (hind leg resting is normal; foreleg resting is not).

## Normal Vital Signs

Every horse owner and carer should know the normal vital signs — collectively known as TPR:

- **Temperature**: 37.5–38.5°C (99.5–101.3°F), taken rectally with a digital thermometer
- **Pulse**: 36–42 beats per minute for a healthy adult horse calmly at rest, taken at the facial artery under the jaw
- **Respiration**: 8–12 breaths per minute for a healthy adult horse calmly at rest, counted by watching the flank rise and fall

These figures represent resting values. Exercise, stress, pain, and hot weather all increase them. Know what is normal for your horse so you can recognise deviations.

## The Daily Health Check

Follow the horse’s written daily-care and health-observation plan. Observe from a safe distance first: is the horse standing, eating and behaving as usual? Then, where you are trained and authorised to do so, complete the checks required by the yard procedure:

- **Eyes**: bright, clear, no discharge
- **Nostrils**: clean, no unusual discharge
- **Legs**: cool, tight (no heat or swelling), no cuts or scratches
- **Feet**: pick out and check for stones, thrush, or shoe condition
- **Body**: no new lumps, cuts, or swellings
- **Droppings**: formed, regular colour, not too hard or too soft
- **Water**: check intake — the bucket or trough should show evidence of drinking
- **Appetite**: the horse should eat its feed within a reasonable time

## When Something Is Wrong

Signs that something may be wrong include: dullness, loss of appetite, abnormal droppings, nasal discharge, coughing, lameness, heat or swelling in the legs, excessive sweating, rolling repeatedly (colic warning), and reluctance to move. Any significant change from normal should be reported immediately.`,
    keyPoints: [
      "A healthy horse is bright, alert, and interested with clear eyes and a smooth coat",
      "World Horse Welfare’s usual adult-at-rest TPR reference: temperature 37.5–38.5°C, pulse 36–42 bpm and respiration 8–12 breaths/min; record an individual baseline.",
      "Daily health checks should cover eyes, nostrils, legs, feet, body, droppings, water, and appetite",
      "Know what is normal for your individual horse so you can spot deviations quickly",
      "Report any significant change from normal to the yard manager or vet immediately",
    ],
    safetyNote:
      "When taking a horse's temperature rectally, stand to the side of the hindquarters, not directly behind. Have someone hold the horse's head. Use a digital thermometer with a string attached so it cannot be lost inside the horse.",
    practicalApplication:
      "With a competent person, record calm-at-rest TPR and routine observations using the yard’s approved health record. Establish the individual baseline over repeated observations appropriate to the horse’s management plan, and report concerning changes through the yard’s veterinary-escalation procedure.",
    commonMistakes: [
      "Only checking the horse when something seems obviously wrong, rather than daily",
      "Not knowing normal TPR values and therefore not recognising abnormal readings",
      "Checking legs only visually — always run your hands down them to feel for heat or swelling",
      "Dismissing subtle signs like a slightly dull coat or reduced appetite",
      "Forgetting to check water intake as part of the daily assessment",
    ],
    knowledgeCheck: [
      {
        question: "What is the normal resting pulse rate for a horse?",
        options: ["10–15 bpm", "36–42 bpm", "60–80 bpm", "100+ bpm"],
        correctIndex: 1,
        explanation:
          "World Horse Welfare lists 36–42 beats per minute as the usual pulse range for a healthy adult horse calmly at rest. Interpret a reading in context and seek advice for a concerning departure from that horse’s known baseline.",
      },
      {
        question: "Which is NOT a normal sign in a healthy horse at rest?",
        options: [
          "Bright, alert expression",
          "Resting a hind leg occasionally",
          "Persistently resting a foreleg",
          "Clear, open eyes",
        ],
        correctIndex: 2,
        explanation:
          "Horses commonly rest a hind leg. A persistent change in stance or comfort should be recorded and reported through the yard’s health procedure rather than self-diagnosed.",
      },
    ],
    aiTutorPrompts: [
      "How do I take a horse's pulse correctly?",
      "What are the early signs of colic I should watch for?",
      "Why must calm-at-rest TPR values be interpreted against the individual horse’s baseline and the wider clinical picture?",
    ],
    linkedCompetencies: ["daily_health_check", "welfare_awareness"],
  },
  {
    slug: "common-equine-ailments",
    pathwaySlug: "horse-health-first-response",
    title: "Common Equine Ailments",
    level: "developing",
    category: "Horse Health & First Response",
    sortOrder: 2,
    objectives: [
      "Recognise the signs of common ailments including colic, laminitis, thrush, and mud fever",
      "Understand when a condition is a vet emergency versus manageable first aid",
      "Know basic first-response actions for each common ailment",
      "Understand the importance of not delaying veterinary attention when needed",
    ],
    content: `Horses are surprisingly prone to a range of common ailments. Understanding what these look like and how to respond is essential for every horse carer. Recognising the difference between a minor issue and a veterinary emergency can save a horse's life.

## Colic

Colic is abdominal pain and is the single biggest emergency in horse care. Signs include: looking at the flanks, pawing the ground, lying down and getting up repeatedly, rolling, sweating, and loss of appetite. Colic ranges from mild (gas build-up) to life-threatening (twisted gut). Any sign of colic should be treated seriously. Remove food, keep the horse walking gently if it wants to roll violently, and call the vet immediately. Do not wait to see if it passes.

## Laminitis

Laminitis is inflammation of the sensitive laminae inside the hoof — it is extremely painful and can be career-ending or fatal if not treated. Signs include: reluctance to move, shifting weight, the classic "rocking horse" stance (leaning back to take weight off the front feet), heat in the hooves, and a bounding digital pulse. Laminitis is triggered by overfeeding (especially rich grass or grain), obesity, stress, or toxins. At first signs, remove the horse from grass, do not force it to walk, and call the vet urgently.

## Thrush

Thrush is a bacterial infection of the frog of the hoof, recognised by a foul-smelling black discharge. It is caused by standing in wet, dirty conditions. Treatment involves cleaning the frog thoroughly, applying antibacterial spray or solution, and improving the horse's living conditions. Prevention is better than cure — regular hoof picking and clean bedding are key.

## Mud Fever

Mud fever (pastern dermatitis) affects the lower legs, causing scabs, swelling, and soreness. It is caused by prolonged exposure to wet, muddy conditions. Treatment involves gently washing and drying the legs, removing scabs carefully, and applying antibacterial cream. Severe cases may need veterinary treatment including antibiotics.

## When to Call the Vet

Call the vet immediately for: any sign of colic, suspected laminitis, deep or joint-near wounds, eye injuries, severe lameness, difficulty breathing, profuse bleeding, or any condition that is worsening despite first aid.`,
    keyPoints: [
      "Colic is an emergency — any sign of abdominal pain requires immediate veterinary attention",
      "Laminitis signs include reluctance to move, heat in the hooves, and the rocking horse stance",
      "Thrush is recognised by foul-smelling black discharge from the frog and is caused by poor conditions",
      "Mud fever affects the lower legs and requires cleaning, drying, and antibacterial treatment",
      "When in doubt, always call the vet — delayed treatment can turn a minor problem into a major one",
    ],
    safetyNote:
      "A colicky horse can be dangerous — it may throw itself to the ground without warning. Stay alert, keep a safe distance, and do not attempt to restrain a horse that is thrashing. Wait for the vet.",
    practicalApplication:
      "Create a quick-reference card listing the signs and first-response actions for colic, laminitis, thrush, and mud fever. Keep it in the tack room or feed room where it can be accessed quickly in an emergency.",
    commonMistakes: [
      "Waiting to see if colic improves on its own before calling the vet",
      "Continuing to exercise a horse showing early signs of laminitis",
      "Neglecting regular hoof picking, allowing thrush to develop",
      "Ripping off mud fever scabs without softening them first, causing pain and infection risk",
      "Assuming a horse is fine because it is still eating — some horses eat through significant pain",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the most important first action if you suspect colic?",
        options: [
          "Give the horse a feed to see if appetite returns",
          "Walk the horse briskly for an hour",
          "Remove food, keep the horse calm, and call the vet immediately",
          "Apply a poultice to the stomach area",
        ],
        correctIndex: 2,
        explanation:
          "Colic is a potential emergency. Remove food to prevent further gut problems, keep the horse calm, and contact the vet immediately. Do not wait.",
      },
      {
        question: "What is the classic stance of a horse with laminitis?",
        options: [
          "Standing on three legs",
          "Leaning forward",
          "Rocking horse stance — leaning back to reduce weight on the front feet",
          "Lying flat on its side",
        ],
        correctIndex: 2,
        explanation:
          "The rocking horse stance — with hind legs pushed under the body and front legs stretched forward — is the classic sign of laminitic pain in the front feet.",
      },
    ],
    aiTutorPrompts: [
      "What are the different types of colic and how do they differ?",
      "How can I prevent laminitis in a good doer on rich pasture?",
      "What should be in a basic equine first-aid kit?",
    ],
    linkedCompetencies: [
      "daily_health_check",
      "first_aid_basics",
      "welfare_awareness",
    ],
  },
  {
    slug: "equine-first-aid-basics",
    pathwaySlug: "horse-health-first-response",
    title: "Equine First Aid Basics",
    level: "intermediate",
    category: "Horse Health & First Response",
    sortOrder: 3,
    objectives: [
      "Assemble a basic equine first-aid kit",
      "Understand the limits of a non-veterinary first response",
      "Recognise when to contact a veterinary professional without delay",
      "Record useful observations and follow current veterinary or yard emergency instructions",
    ],
    content: `A first response is not a diagnosis or treatment plan. If a horse is injured, unwell, distressed or behaves outside its normal pattern, protect people from immediate danger, contact the veterinary professional promptly and follow the directions you are given. Do not delay contact while attempting additional checks or online research.

## The First-Response Kit and Plan

Keep the yard’s current emergency contacts, horse identification details, authorised first-response supplies and written emergency procedure accessible. Check supplies under the responsible person’s procedure and use products or equipment only within your competence and the current veterinary or manufacturer directions.

## Observation and Escalation

From a safe position, record factual observations such as the time concern was noticed, what changed, the horse’s demeanour, visible swelling, bleeding or damage, and any relevant recent events. Do not diagnose, probe a wound, administer medication, apply products, bandage, cool an area, move the horse or withhold feed unless a veterinary professional or the current written emergency procedure directs you to do so.

## Waiting for Veterinary Direction

Keep people safe and follow the veterinary professional’s instructions about containment, access, handling and any further observation. Give the veterinary professional the factual record, including any measurements taken only when competent and requested. Escalate immediately if the horse’s condition changes or safety cannot be maintained.`,
    keyPoints: [
      "Keep current emergency contacts, horse details, authorised supplies and the yard procedure accessible",
      "A non-veterinary first response is observation, scene safety, accurate recording and prompt escalation—not diagnosis or treatment",
      "Use products, cooling, bandaging, medication, feeding changes or movement only when current professional direction and competence permit",
      "Give the veterinary professional a factual record and report any material change promptly",
      "When in doubt or when safety cannot be maintained, contact the veterinary professional without delay",
    ],
    safetyNote:
      "Do not place yourself in a position where a painful, frightened or distressed horse could injure you. Follow the current yard emergency procedure and veterinary direction; do not attempt a clinical technique beyond your competence.",
    practicalApplication:
      "With the responsible person, locate the current yard emergency procedure, veterinary contacts, horse-identification records and authorised supplies. Identify the information that should be recorded if a concern is observed; do not practise clinical techniques except within an approved, professionally supervised training context.",
    commonMistakes: [
      "Delaying veterinary contact while attempting extra checks, internet research or unapproved treatment",
      "Diagnosing from appearance alone or assuming a concern is minor",
      "Applying products, bandages, cooling or medication outside current professional direction and competence",
      "Putting people in an unsafe position around a painful, frightened or distressed horse",
      "Failing to record observations and communicate changes to the veterinary professional",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the appropriate first response when a horse has an injury or acute health concern?",
        options: [
          "Choose a treatment from a generic online guide before contacting anyone",
          "Protect people from immediate danger, record factual observations, contact the veterinary professional promptly and follow current instructions",
          "Assume the issue is minor if the horse is still standing",
          "Keep trying different treatments until the horse appears more comfortable",
        ],
        correctIndex: 1,
        explanation:
          "A learner’s role is safety, accurate observation and prompt professional escalation. Diagnosis and treatment depend on the horse, concern and veterinary direction.",
      },
      {
        question:
          "Which action should be avoided without current professional direction and appropriate competence?",
        options: [
          "Recording what was observed and when",
          "Providing the veterinary professional with the horse’s identification details",
          "Applying a treatment, product, bandage or cooling regimen",
          "Locating the yard emergency procedure",
        ],
        correctIndex: 2,
        explanation:
          "Do not apply treatment or carry out a clinical technique beyond your competence or the direction given for the current situation.",
      },
    ],
    aiTutorPrompts: [
      "What factual observations should I record before speaking with the veterinary professional?",
      "Where should a responsible yard keep its current emergency contacts and horse-identification records?",
      "Why must a first response remain within current professional direction and my competence?",
    ],
    linkedCompetencies: ["first_aid_basics", "welfare_awareness"],
  },
  {
    slug: "vaccination-and-worming-schedules",
    pathwaySlug: "horse-health-first-response",
    title: "Vaccination & Worming Programmes",
    level: "intermediate",
    category: "Horse Health & First Response",
    sortOrder: 4,
    objectives: [
      "Understand why vaccination and worming are essential for horse health",
      "Understand why vaccination timing must follow a current veterinary plan and relevant governing-body rules",
      "Understand targeted worming programmes based on faecal egg counts",
      "Keep accurate health records including vaccination and worming dates",
    ],
    content: `Vaccination and parasite control are parts of preventive health care. A programme must protect the individual horse while also accounting for its age, health, history, location, travel and contact with other horses. The correct plan is set and reviewed with the veterinary team and, where relevant, against the current rules of the event organiser or governing body.

## Vaccination plans

Equine influenza and tetanus are commonly included in a horse’s preventive-health plan. The Royal Veterinary College notes that vaccine protocols differ by vaccine and that competition requirements can differ from a general health plan. Do not use an old calendar, a lesson handout or another horse’s record to decide whether an injection is due. Instead, take the passport and the complete vaccination history to the veterinary team, confirm the current product instructions and check the rules that apply to any planned competition or travel.

If a record is missing, late or unclear, do not guess at the next dose. Tell the vet exactly what is known, including the date, product and batch number of the last recorded injection, then follow the plan they set. This protects the horse and avoids presenting a competition-specific requirement as a universal rule.

## Evidence-led parasite control

World Horse Welfare advises that worm-control decisions should be based on appropriate testing and a bespoke plan developed with a vet or SQP/RAMA. A faecal egg count, saliva test or blood test may be relevant depending on the parasite question and time of year, but no single test answers every question. Collect and label samples as instructed by the laboratory, record results, and ask the professional adviser to explain what the result does and does not show before using any medicine.

Practical pasture measures matter as well: remove droppings, avoid unnecessary sharing of contaminated equipment, review grazing pressure and keep a clear record of new arrivals, test results and treatments. Do not select, dose or repeat a wormer solely from a fixed calendar or a generic internet threshold.

## Record keeping and escalation

Keep a health record for each horse with passport/ID details, vaccination dates, product and batch information, laboratory reports, veterinary advice, treatment authorisation and any adverse observations. Before an event or journey, check the current organiser, governing-body and official requirements directly. If the horse is unwell, has a suspected infectious disease or there is uncertainty about a health record, follow veterinary advice before mixing, travelling or competing.`,
    keyPoints: [
      "Use a current veterinary preventive-health plan and check the applicable event or governing-body rules before travel or competition",
      "Do not infer a vaccination due date from a generic timetable, an old record or another horse’s programme",
      "World Horse Welfare advises bespoke parasite control using appropriate testing and a vet or SQP/RAMA plan",
      "Pasture management, test records and careful sample handling support evidence-led parasite control",
      "Accurate health records should include vaccination, product, batch, test-result and professional-advice details",
    ],
    safetyNote:
      "Only administer wormers that are appropriate for your horse's weight — overdosing and underdosing both cause problems. If in doubt, weigh the horse with a weigh tape and consult your vet. Never give medication to a horse you are not authorised to treat.",
    practicalApplication:
      "Review your horse's vaccination record and check whether boosters are due. If your yard uses a targeted worming programme, find out when the next faecal egg count is scheduled and ensure your horse is included.",
    commonMistakes: [
      "Using a generic timetable instead of confirming the individual horse’s current veterinary and competition plan",
      "Treating or repeating medicine without appropriate testing and professional advice",
      "Not recording vaccination product, batch, test result and treatment advice",
      "Assuming an isolated horse needs no parasite-risk assessment",
      "Treating a laboratory result as a complete diagnosis rather than discussing its limits with the adviser",
    ],
    knowledgeCheck: [
      {
        question:
          "Why are faecal egg counts (FEC) now preferred over routine worming schedules?",
        options: [
          "They are cheaper",
          "They reduce chemical resistance by only treating horses that need it",
          "They are more convenient",
          "They eliminate the need for any worming",
        ],
        correctIndex: 1,
        explanation:
          "Targeted worming based on FEC reduces unnecessary chemical use, slowing the development of wormer resistance — a serious problem in equine parasitology.",
      },
      {
        question:
          "What is the safest way to confirm whether a horse is currently eligible to travel or compete after a vaccination history concern?",
        options: [
          "Use the timetable from another horse’s passport",
          "Ask the vet to review the complete record and check the current organiser or governing-body requirements",
          "Assume one missed date is harmless if the horse looks well",
          "Give a medicine dose without professional advice",
        ],
        correctIndex: 1,
        explanation:
          "Vaccination products, veterinary plans and competition requirements can differ. The correct route is a veterinary review of the record plus the current organiser or governing-body requirements, not a generic schedule.",
      },
    ],
    aiTutorPrompts: [
      "What information should I give my vet when a vaccination record is unclear?",
      "What can a parasite test tell me, and what are its limits?",
      "How do I work with a vet or SQP/RAMA on a targeted parasite-control plan for my yard?",
    ],
    linkedCompetencies: [
      "daily_health_check",
      "welfare_awareness",
      "record_keeping",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 9 — Stable Management
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: "mucking-out-and-bedding",
    pathwaySlug: "stable-management",
    title: "Mucking Out & Bedding Management",
    level: "beginner",
    category: "Stable Management",
    sortOrder: 1,
    objectives: [
      "Understand the importance of a clean stable for horse health and welfare",
      "Know the correct tools and technique for mucking out a stable",
      "Compare different bedding types and their advantages and disadvantages",
      "Manage a muck heap efficiently and safely",
    ],
    content: `A clean, well-bedded stable is essential for horse health. Horses standing on wet, dirty bedding develop foot problems like thrush, respiratory issues from ammonia, and skin conditions. Mucking out is one of the most basic and important daily stable management tasks.

## Tools Required

The basic mucking-out kit includes: a four-pronged fork (for straw) or shavings fork, a shovel, a wheelbarrow, a broom, and a skip (a rubber or plastic tub for picking up droppings during the day). Having the right tools makes the job quicker and less physically demanding.

## Mucking-Out Technique

The standard process is: remove the horse from the stable or tie it safely to one side. Remove droppings and the wettest bedding first, placing them in the wheelbarrow. Bank the clean, dry bedding against the walls to expose the floor. Sweep the floor and allow it to air-dry if possible. Then pull the banked bedding back down, add fresh bedding as needed, and create a level, comfortable bed. The bedding should be deep enough to cushion the horse when lying down and should be banked slightly up the walls to prevent the horse getting cast (stuck against the wall when rolling).

## Bedding Types

Common bedding types include:
- **Straw**: traditional, widely available, good drainage, but can be eaten and is dusty
- **Wood shavings**: absorbent, less dusty than straw, does not encourage eating
- **Wood pellets**: very absorbent, compact to store, expand when wet
- **Paper/cardboard**: dust-free, good for horses with allergies, but can be difficult to manage
- **Rubber matting with a thin layer of shavings**: reduces bedding cost, easy to clean, but initial outlay is higher

## The Muck Heap

A well-managed muck heap should be square-sided and compact, built up in layers. It should be sited away from the stables and water sources. Loose, scattered muck heaps attract flies, look untidy, and take longer to decompose. Compost management is increasingly important for environmental responsibility.`,
    keyPoints: [
      "A clean stable prevents thrush, respiratory issues, and skin conditions",
      "Muck out daily: remove droppings and wet bedding, bank clean bedding, air the floor, then re-bed",
      "Choose bedding to suit the horse's needs — shavings or paper for horses with respiratory issues",
      "Banks of bedding against the walls help prevent the horse getting cast",
      "Manage the muck heap as a square, compact structure away from stables and water sources",
    ],
    safetyNote:
      "Always wear sturdy footwear when mucking out — never sandals or soft shoes. Be aware of the horse's position at all times if it remains in the stable. Use correct lifting technique for heavy wheelbarrows to avoid back injury.",
    practicalApplication:
      "Muck out a stable following the full technique described above. Time yourself — with practice, a standard stable should take 15–20 minutes. Compare the bedding level and bank quality with an experienced groom's standard.",
    commonMistakes: [
      "Not removing all wet bedding, leaving damp patches that cause hoof problems",
      "Insufficient bedding depth — the horse should be cushioned when lying down",
      "Leaving the stable floor wet without allowing it to dry before re-bedding",
      "Forgetting to bank bedding up the walls, increasing the risk of the horse getting cast",
      "Overloading the wheelbarrow, making it heavy and dangerous to push",
    ],
    knowledgeCheck: [
      {
        question: "Why should bedding be banked up against the stable walls?",
        options: [
          "To save bedding",
          "To make the stable look tidy",
          "To help prevent the horse getting cast",
          "To keep the walls clean",
        ],
        correctIndex: 2,
        explanation:
          "Banking bedding against the walls creates a cushion that helps prevent the horse from getting stuck (cast) against the wall when it lies down or rolls.",
      },
      {
        question:
          "Which bedding type is best for a horse with a respiratory condition?",
        options: ["Straw", "Dust-extracted shavings or paper", "Hay", "Sand"],
        correctIndex: 1,
        explanation:
          "Dust-extracted shavings or paper bedding produce minimal dust, reducing airborne irritants for horses with respiratory conditions like COPD/RAO.",
      },
    ],
    aiTutorPrompts: [
      "How often should I fully strip a stable and start fresh?",
      "What are the signs that bedding is too dusty for my horse?",
      "How do I manage a deep-litter system properly?",
    ],
    linkedCompetencies: ["stable_management", "welfare_awareness"],
  },
  {
    slug: "pasture-management-basics",
    pathwaySlug: "stable-management",
    title: "Pasture Management Basics",
    level: "developing",
    category: "Stable Management",
    sortOrder: 2,
    objectives: [
      "Understand the principles of good pasture management for horses",
      "Know how to carry out regular field checks for safety and maintenance",
      "Understand rotational grazing and its benefits",
      "Identify common poisonous plants found in horse pastures",
    ],
    content: `Good pasture management is essential for horse health, safety, and welfare. Well-managed grazing provides nutrition, exercise, and social opportunities. Poorly managed fields become bare, weed-infested, and potentially dangerous.

## Daily Field Checks

Follow a written, risk-based field-inspection routine appropriate to the yard, weather, turnout pattern and known hazards. Check boundaries, gates, water, foreign objects and ground condition often enough to identify and address changes safely. Escalate fencing, water, ground or plant hazards through the responsible yard procedure.

## Pasture Quality

Pasture suitability depends on the horse, soil, climate, forage analysis, grazing pressure, local plant risks and the individual nutrition plan. Manage weeds, droppings and ground condition through a written pasture and parasite-control plan agreed with appropriate veterinary, nutrition and land-management professionals. Do not rely on a universal droppings-removal or harrowing interval.

## Rotational Grazing

Dividing fields into sections can support grass recovery and pasture management, but the rotation pattern must be designed for the local soil, season, stocking, forage condition, parasite plan and individual horses. Discuss cross-grazing, harrowing and any parasite-control approach with qualified local professionals; do not assume a universal rest period or outcome.

## Poisonous Plants

Potentially harmful plants vary by region and season. Learn to identify local hazards using current official or qualified local guidance, and report any suspected plant hazard before horses can access it. Do not attempt removal, disposal or plant-risk assessment without the yard’s approved procedure and appropriate competent supervision.

## Seasonal Considerations

Seasonal grass growth, mud, forage availability and turnout management should be reviewed within each horse’s individual welfare, nutrition and veterinary plan. Discuss any restricted grazing, supplementary forage, muzzle use, hard-standing or field-layout change with the responsible professionals rather than applying a generic seasonal intervention.`,
    keyPoints: [
      "Use the yard’s risk-based field-inspection routine to identify fencing, water, ground and plant hazards",
      "Manage droppings, pasture condition and parasites through an individual written plan rather than a universal interval",
      "Rotational grazing patterns must reflect local soil, season, stocking, forage condition and the parasite-control plan",
      "Use current official or qualified local guidance to identify and manage plant hazards",
      "Manage grass intake and seasonal turnout within each horse’s individual welfare, nutrition and veterinary plan",
    ],
    safetyNote:
      "Do not handle or remove a suspected hazardous plant unless the yard’s approved procedure, current local guidance and appropriate competent supervision are in place. Use the specified protective equipment and keep horses away from the area while the concern is managed.",
    practicalApplication:
      "Walk a field used for horses and conduct a full safety and maintenance check. Note any fencing issues, poisonous plants, water supply problems, or areas of poaching. Create an action list and address the most urgent items first.",
    commonMistakes: [
      "Not checking fields daily — hazards can appear overnight",
      "Using a generic droppings, pasture or parasite-control interval instead of the written local plan",
      "Applying a rotation pattern without considering soil, season, stocking and forage condition",
      "Trying to identify, remove or dispose of a hazardous plant without current local guidance and competent supervision",
      "Changing grazing management for a susceptible horse without the individual welfare, nutrition and veterinary plan",
    ],
    knowledgeCheck: [
      {
        question:
          "What should you do when you find a plant you suspect may be hazardous in a horse field?",
        options: [
          "Keep horses away from the area and report it through the yard’s approved procedure",
          "Assume it is safe if you cannot identify it",
          "Remove it without guidance or protective equipment",
          "Wait for a fixed calendar interval before acting",
        ],
        correctIndex: 0,
        explanation:
          "Plant hazards vary by region and season. Keep horses away from a suspected concern and use current official or qualified local guidance with the yard’s approved procedure.",
      },
      {
        question:
          "How should droppings, pasture condition and parasite risk be managed?",
        options: [
          "Through an individual written plan with appropriate professional guidance",
          "Using one universal calendar interval at every yard",
          "Only before a competition",
          "By waiting until horses show signs of illness",
        ],
        correctIndex: 0,
        explanation:
          "Pasture and parasite management depend on local conditions, horses, stocking and the professional control plan. Do not apply a generic interval as a universal rule.",
      },
    ],
    aiTutorPrompts: [
      "What information should a local land-management professional review when planning rotational grazing?",
      "How can I obtain current local guidance about pasture species and potential plant hazards?",
      "What should be included in the individual welfare, nutrition and veterinary plan for a horse with grazing sensitivities?",
    ],
    linkedCompetencies: ["stable_management", "welfare_awareness"],
  },
  {
    slug: "stable-routines-and-record-keeping",
    pathwaySlug: "stable-management",
    title: "Stable Routines & Record Keeping",
    level: "intermediate",
    category: "Stable Management",
    sortOrder: 3,
    objectives: [
      "Design an efficient daily stable routine covering all essential tasks",
      "Understand why written records and checklists improve horse care",
      "Know what records should be kept for each horse",
      "Organise a feed room, tack room, and storage area for safety and efficiency",
    ],
    content: `An efficient daily routine is the backbone of any well-run yard. Routines ensure nothing is forgotten, tasks are completed safely, and every horse receives consistent care. Written records and checklists transform good intentions into reliable practice.

## The Morning Routine

A typical morning routine: check all horses (health check — see signs of good health), provide water, feed breakfast, muck out stables, sweep the yard, turn out or prepare for exercise. The order may vary between yards, but the principles are consistent: horses' welfare needs come first, followed by environmental maintenance.

## The Evening Routine

Typical evening tasks: bring horses in from turnout, provide hay and water, feed evening meal, check all horses are settled, skip out stables (remove droppings), check field gates and fencing, secure the yard. A final check last thing at night — even a quick walk through the yard — is good practice.

## Record Keeping

For each horse, records should include: daily feed amounts and any changes, health observations, medications and supplements, farrier and dentist visits, vaccination and worming records, exercise and training notes, any incidents or injuries, and weight and body condition scores. These records help the vet, farrier, and any other professional who works with the horse.

## Checklists

Daily, weekly, and monthly checklists prevent tasks from being overlooked. A daily checklist might include: health check, feed, water, muck out, exercise, skip out. A weekly checklist might add: deep-clean water buckets, check first-aid kit, order feed and bedding. Monthly: check fire extinguishers, review feeding plans, schedule farrier and dentist.

## Feed Room and Tack Room Organisation

A well-organised feed room has clearly labelled bins for each type of feed, a written feed chart showing what each horse gets, and supplements stored in a dry area. The tack room should have each horse's tack on its own saddle rack and bridle hook, with cleaning supplies accessible. A tidy tack room protects expensive equipment and prevents mistakes.`,
    keyPoints: [
      "A consistent daily routine ensures no horse is overlooked and every task is completed",
      "Morning and evening routines should prioritise horse welfare before environmental tasks",
      "Keep written records for every horse covering feed, health, farrier, vet, and worming",
      "Use daily, weekly, and monthly checklists to prevent tasks being forgotten",
      "Organise feed rooms and tack rooms clearly with labels, charts, and assigned storage",
    ],
    safetyNote:
      "Feed rooms must be secured so horses cannot access them. Overeating grain can cause colic or laminitis. Store chemicals, medications, and cleaning products separately from feed and bedding. Ensure fire extinguishers are accessible and staff know how to use them.",
    practicalApplication:
      "Create a daily, weekly, and monthly checklist for your yard. Include all essential tasks. Trial the checklist for one week and note any tasks you need to add or adjust. Share it with other carers on the yard for consistency.",
    commonMistakes: [
      "Relying on memory instead of written routines — tasks get forgotten, especially by relief staff",
      "Not keeping health records, making it impossible to spot trends or brief the vet accurately",
      "Disorganised feed rooms leading to the wrong horse getting the wrong feed",
      "Skipping the final evening check — problems can develop overnight if not caught",
      "Neglecting to update records when routines or feeds change",
    ],
    knowledgeCheck: [
      {
        question: "Why is a written feed chart important in the feed room?",
        options: [
          "It looks professional",
          "It ensures every horse gets the correct feed, especially when different people are feeding",
          "It is a legal requirement",
          "It helps sell the horse",
        ],
        correctIndex: 1,
        explanation:
          "A written feed chart prevents feeding mistakes, especially when multiple carers are involved. The wrong feed can cause colic, weight gain, or nutritional imbalance.",
      },
      {
        question: "What should the last task of the day be on a yard?",
        options: [
          "Sweep the yard",
          "A final check that all horses are settled, safe, and have water",
          "Lock the tack room",
          "Close the office",
        ],
        correctIndex: 1,
        explanation:
          "A final check ensures all horses are comfortable, have water, and are not showing signs of distress. Issues caught at night can be addressed before they worsen overnight.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me design a daily routine for a small livery yard?",
      "What digital tools are available for equine record keeping?",
      "How do I organise a feed room for 10 horses with different diets?",
    ],
    linkedCompetencies: ["stable_management", "record_keeping"],
  },
  {
    slug: "yard-maintenance-and-facilities",
    pathwaySlug: "stable-management",
    title: "Yard Maintenance & Facility Care",
    level: "advanced",
    category: "Stable Management",
    sortOrder: 4,
    objectives: [
      "Understand the ongoing maintenance needs of a working equestrian yard",
      "Know how to maintain arenas, fencing, water systems, and drainage",
      "Plan seasonal maintenance schedules for facilities and equipment",
      "Identify potential hazards through regular facility audits",
    ],
    content: `Running a yard involves more than caring for horses — the facilities themselves need regular maintenance to stay safe, functional, and fit for purpose. Neglected facilities create hazards, reduce the working life of equipment, and project an unprofessional image.

## Arena Maintenance

Arenas require regular harrowing to prevent the surface becoming compacted, rutted, or uneven. Rubber or sand-and-fibre surfaces should be levelled weekly and watered in dry conditions to control dust. Check the kickboards and fence line for damage after jumping sessions. Remove any foreign objects that may have blown in.

## Fencing

Post-and-rail fencing should be inspected weekly for loose posts, broken rails, and protruding nails. Electric fencing requires regular testing of the energiser and checking for vegetation touching the wire, which earths the charge and makes it ineffective. Replace any fencing that is not safe — temporary repairs should be truly temporary.

## Water Systems

Automatic waterers should be checked daily for function and cleanliness. Troughs should be scrubbed regularly to prevent algae build-up. In winter, check for ice and have a plan for defrosting or providing alternative water. Pipes should be lagged to prevent freezing.

## Drainage

Poor drainage creates dangerous muddy areas, contributes to conditions like mud fever, and makes the yard unpleasant to work in. Maintain existing drainage systems, clear gutters and downpipes regularly, and consider installing hard-standing at gateways and high-traffic areas to reduce poaching.

## Seasonal Planning

Create a seasonal maintenance calendar: spring — arena servicing, fencing check, grass management; summer — dust control, watering, fly management; autumn — gutter clearing, winter preparation, drainage checks; winter — ice management, lighting checks, indoor arena priority. Forward planning prevents emergencies and spreads costs throughout the year.`,
    keyPoints: [
      "Regular arena maintenance prevents surface compaction and creates safer riding conditions",
      "Inspect fencing weekly — broken or unsafe fencing is a serious hazard",
      "Clean water systems regularly and prepare for winter freezing",
      "Good drainage prevents mud, health problems, and hazardous working conditions",
      "A seasonal maintenance calendar prevents facility emergencies and spreads costs",
    ],
    safetyNote:
      "When working on maintenance tasks, use appropriate safety equipment: steel-toed boots, gloves, and eye protection when using power tools. Never carry out electrical work unless qualified. Report structural concerns to a professional.",
    practicalApplication:
      "Conduct a full facility audit of your yard. Walk every area and note any maintenance needs. Categorise them as urgent (safety risk), important (needs attention this month), or routine (schedule for next quarter). Create an action plan with priorities and estimated costs.",
    commonMistakes: [
      "Ignoring gradual deterioration until a facility becomes unsafe",
      "Temporary fence repairs that become permanent — creating weak points in the perimeter",
      "Not maintaining arena surfaces, leading to uneven, hard, or waterlogged footing",
      "Failing to prepare water systems for winter, resulting in frozen pipes and no water supply",
      "No written maintenance schedule, relying on ad-hoc repairs instead of planned upkeep",
    ],
    knowledgeCheck: [
      {
        question: "How often should an arena surface typically be harrowed?",
        options: [
          "Once a year",
          "At least weekly depending on usage",
          "Only when it rains",
          "Never — let it compact naturally",
        ],
        correctIndex: 1,
        explanation:
          "Regular harrowing — typically weekly or more for busy arenas — prevents compaction, maintains an even surface, and ensures consistent footing for safe riding.",
      },
      {
        question: "Why is drainage important on an equestrian yard?",
        options: [
          "It makes the yard look nicer",
          "It prevents mud, health conditions like mud fever, and hazardous working conditions",
          "It is only important for competition yards",
          "Drainage is not important for horse yards",
        ],
        correctIndex: 1,
        explanation:
          "Poor drainage creates mud that causes health problems (mud fever, thrush), makes areas dangerous to work in, and deteriorates the ground surface over time.",
      },
    ],
    aiTutorPrompts: [
      "What type of arena surface is best for all-weather use?",
      "How do I create a seasonal maintenance plan for a 12-stable yard?",
      "What are the regulations around muck heap management and disposal?",
    ],
    linkedCompetencies: ["stable_management", "yard_safety_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 10 — Competitions & Preparation
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: "understanding-competition-types",
    pathwaySlug: "competitions-preparation",
    title: "Understanding Competition Types",
    level: "beginner",
    category: "Competitions & Preparation",
    sortOrder: 1,
    objectives: [
      "Know the main types of equestrian competition: dressage, show jumping, cross-country, showing, and combined training",
      "Understand what happens at each type of competition",
      "Know the basic rules and etiquette expected at competitions",
      "Identify which type of competition suits your current level",
    ],
    content: `Competitions are a wonderful way to test your skills, measure progress, and enjoy the social side of equestrianism. Understanding the different types of competition helps you choose the right starting point and set realistic goals.

## Dressage

Dressage tests are performed in a marked arena. The permitted arena, movements, scoring and level requirements are set by the current organiser and governing-body rules. A beginner should choose an appropriate class with their instructor, read the published test and schedule, and follow the layout supplied for that event.

## Show Jumping

Show jumping involves riding a course of coloured fences under a published class format. Penalties, time allowances, refusals, eliminations and clear-round conditions vary by organiser, level and current rules. Read the schedule and ask an instructor to help select an appropriate novice or clear-round class.

## Cross-Country

Cross-country involves riding over fixed natural-looking fences across open countryside within an optimum time. This is the most exciting but also the most demanding discipline. It requires courage, fitness, and good training. Beginners should build considerable experience in arena jumping before attempting cross-country.

## Showing

Showing classes judge the horse's conformation, way of going, and overall quality. The horse is presented in hand (led) or ridden in a group. Turnout — how well the horse is presented — matters greatly. Showing teaches excellent stable management and horse presentation skills.

## Combined Training

Combined training (or hunter trials, one-day events) combines two or three disciplines. An unaffiliated one-day event might include a dressage test and a show-jumping round. Eventing at higher levels combines dressage, cross-country, and show jumping. Starting with combined training at intro level is an excellent way to gain all-round experience.`,
    keyPoints: [
      "Dressage tests assess accuracy and the horse’s way of going under the current published test and arena specification",
      "Show jumping class rules, penalties and time conditions are event-specific; choose an appropriate class using the organiser’s current schedule",
      "Cross-country is exciting but demanding — build arena experience first",
      "Showing judges turnout and the horse's quality — it develops excellent presentation skills",
      "Combined training is a great way to experience multiple disciplines at a low level",
    ],
    safetyNote:
      "Always check competition rules for required safety equipment. Most competitions require a current-standard hat, and many require body protectors for jumping phases. Hi-vis is recommended when hacking to and from events.",
    practicalApplication:
      "Research three local unaffiliated competitions suitable for your level. Note the classes available, entry requirements, and dates. Attend one as a spectator before entering — watching helps you understand the format and feel less nervous on your first competition day.",
    commonMistakes: [
      "Entering competitions beyond your current level, which can be demoralising and unsafe",
      "Not reading the rules or schedule before attending",
      "Forgetting to learn a dressage test before the day",
      "Underestimating the preparation time needed on competition morning",
      "Focusing only on results rather than the learning experience",
    ],
    knowledgeCheck: [
      {
        question:
          "What level of dressage test is most suitable for a complete beginner?",
        options: [
          "Grand Prix",
          "Medium",
          "Introductory (walk and trot)",
          "Advanced medium",
        ],
        correctIndex: 2,
        explanation:
          "Choose a class with your instructor using the current organiser’s schedule, published test and eligibility requirements. Beginner-friendly classes vary between organisers and jurisdictions.",
      },
      {
        question:
          "Where should you confirm penalties, time conditions and elimination rules for a show-jumping class?",
        options: [
          "The organiser’s current schedule and governing-body rules for that class",
          "A generic lesson from a different venue",
          "Another competitor’s recollection",
          "The colour of the fences",
        ],
        correctIndex: 0,
        explanation:
          "Penalty, time and elimination rules vary by class, organiser, level and jurisdiction. Use the current published schedule and official rules for the class you enter.",
      },
    ],
    aiTutorPrompts: [
      "What should I pack for my first competition day?",
      "How do I learn a dressage test efficiently?",
      "What is the difference between affiliated and unaffiliated competitions?",
    ],
    linkedCompetencies: ["competition_awareness", "riding_position"],
  },
  {
    slug: "preparing-for-competition-day",
    pathwaySlug: "competitions-preparation",
    title: "Preparing for Competition Day",
    level: "developing",
    category: "Competitions & Preparation",
    sortOrder: 2,
    objectives: [
      "Plan and execute a thorough preparation routine for competition day",
      "Know how to present horse and rider to a good standard",
      "Understand the importance of arriving early and walking the course",
      "Manage competition-day nerves effectively",
    ],
    content: `Thorough preparation is the difference between a stressful competition day and an enjoyable one. Most problems at competitions stem from insufficient preparation rather than lack of skill.

## The Week Before

In the week before a competition: confirm your entry, check your horse's shoes and health, wash and prepare rugs and equipment, learn your dressage test if applicable, plan your travel route and timing, and lay out your competition clothes. Check the schedule for your times and warm-up arrangements.

## Competition Morning

Build a competition-day timeline from the published start time, travel conditions, horse-care routine, organiser arrival instructions and the time needed to settle, prepare and warm up safely. Do not copy another rider’s arrival interval: late changes, venue procedures and the individual horse can alter the safe plan.

## Turnout

Presentation matters at every level. The horse should be clean, with mane and tail neatly presented. Tack should be clean and well-fitted. The rider should wear correct, clean attire for the discipline. First impressions count — good turnout shows respect for the sport and the judges.

## Walking the Course

Where the organiser allows and requires it, walk a jumping or cross-country course before riding. Study the published route, fences, ground and any briefing; ask a qualified instructor for help with planning. Follow event access restrictions and do not assume every class offers the same course-walk procedure.

## Managing Nerves

Competition nerves are normal and can actually improve performance at moderate levels. Manage excessive nerves through: deep breathing, visualising a successful round, focusing on your preparation rather than the outcome, warming up calmly, and remembering that every competitor — even the professionals — was a beginner once.`,
    keyPoints: [
      "Prepare everything in the week before — do not leave anything to competition morning",
      "Allow much more time than you think, especially for your first few competitions",
      "Good turnout shows respect for the sport and creates a positive impression",
      "Always walk the course for jumping — study each fence and plan your line",
      "Competition nerves are normal — manage them through preparation, breathing, and positive visualisation",
    ],
    safetyNote:
      "Check all equipment the day before — do not discover a broken bridle or missing girth on competition morning. Ensure your hat and body protector meet current standards and tag requirements for the competition level.",
    practicalApplication:
      "Create a competition-day checklist covering everything you need to pack for the horse and rider. Include tack, grooming kit, feed, water, first-aid kit, competition paperwork, and clothing. Use this checklist every time you compete.",
    commonMistakes: [
      "Leaving preparation until the morning of the competition, leading to rushing and stress",
      "Not learning the dressage test until the day before — or the day of",
      "Arriving late and having to rush the warm-up",
      "Not walking the course before a jumping class",
      "Letting nerves take over and forgetting the preparation that has gone into the day",
    ],
    knowledgeCheck: [
      {
        question: "When should you ideally arrive at a competition venue?",
        options: [
          "5 minutes before your class",
          "At the time and by the process stated in the organiser’s current schedule",
          "Only after the class has started",
          "It doesn't matter as long as you make your start time",
        ],
        correctIndex: 1,
        explanation:
          "Arrival, check-in and warm-up arrangements are event-specific. Use the current organiser’s schedule, travel plan and horse-care needs to allow adequate safe preparation time.",
      },
      {
        question: "Why is walking a show-jumping course important?",
        options: [
          "To exercise before riding",
          "To study each fence, plan your line, and count strides",
          "It is not important",
          "To warm up the horse",
        ],
        correctIndex: 1,
        explanation:
          "Where the organiser permits a course walk, it helps the rider understand the route, fences and ground. Follow the event briefing and seek qualified instruction for any planning decision.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me create a timeline for competition morning?",
      "What techniques can I use to manage competition nerves?",
      "How do I learn a dressage test quickly and reliably?",
    ],
    linkedCompetencies: ["competition_awareness", "tacking_up_correctly"],
  },
  {
    slug: "dressage-test-riding",
    pathwaySlug: "competitions-preparation",
    title: "Riding a Dressage Test",
    level: "intermediate",
    category: "Competitions & Preparation",
    sortOrder: 3,
    objectives: [
      "Understand dressage test structure and marking system",
      "Know how to learn and memorise a dressage test effectively",
      "Ride accurate school figures as required in dressage tests",
      "Understand what judges are looking for at introductory and preliminary levels",
    ],
    content: `Riding a dressage test is one of the best ways to measure your training progress. The test provides a structured assessment of the horse's basic paces, obedience, and the rider's ability to perform movements accurately and fluently.

## Test Structure

A dressage test is a set sequence of movements performed in a marked arena. Arena letters mark points where movements begin and end, but the layout, movements, scoring and eligibility are defined by the current organiser and governing-body rules. Use the published test, schedule and approved arena diagram for the class you enter.

## Learning the Test

The most effective way to learn a test is: read through it several times, visualise riding it from above (like a bird's-eye view), walk through it on foot in a marked area, then ride through it on horseback. Many riders use test-reading apps or record themselves reading the test aloud to play during warm-up.

## Accuracy

Accuracy is crucial. When the test says "at C, transition to walk," the transition should happen at C — not before and not after. Circles should be the correct size and shape. Straight lines should be truly straight. The judge wants to see that the rider can place the horse precisely where the test demands.

## What Judges Look For

At introductory and preliminary levels, judges look for: correct rhythm (regularity of the pace), relaxation (lack of tension), contact (a steady, elastic connection to the bit), straightness, and impulsion (energy and willingness to go forward). They also mark collective marks for the rider's position and effectiveness, and the horse's overall submission and paces.

## Making the Most of Your Score

After the test, collect your score sheet where the event provides one. Read the feedback, discuss it with your instructor and use it to identify appropriate training priorities. Do not treat a generic percentage as a universal measure of success; marking, qualification and progression requirements are set by the current organiser and governing body.`,
    keyPoints: [
      "Dressage tests assess accuracy, rhythm, relaxation, contact, and the rider's effectiveness",
      "Learn tests by reading, visualising from above, walking on foot, and riding through",
      "Accuracy matters — transitions and movements should happen at the correct marker",
      "At introductory level, judges look for basic rhythm, relaxation, and a willing horse",
      "Score sheets contain valuable training feedback — always read the judge's comments",
    ],
    safetyNote:
      "In a dressage arena, be aware of other competitors warming up nearby. Maintain safe distances and follow warm-up arena etiquette — pass left-to-left when riding in opposite directions.",
    practicalApplication:
      "Download an introductory dressage test from your national federation website. Learn it using the method described above. Ride through it at home or in a lesson, then ask someone to mark your accuracy at each letter.",
    commonMistakes: [
      "Not learning the test thoroughly — forgetting a movement in the arena causes marks to be lost",
      "Riding inaccurate circles — too small, too large, or egg-shaped",
      "Making transitions too early or too late relative to the arena marker",
      "Tension — a tense horse with a hollow back scores poorly regardless of accuracy",
      "Ignoring the score sheet feedback instead of using it to improve training",
    ],
    knowledgeCheck: [
      {
        question:
          "Where should you confirm the permitted paces, movements, arena layout and eligibility for the dressage class you intend to enter?",
        options: [
          "The current organiser’s schedule, published test and governing-body rules",
          "A generic online example from another jurisdiction",
          "A previous competitor’s score sheet",
          "The colour of the arena markers",
        ],
        correctIndex: 0,
        explanation:
          "Dressage requirements vary by organiser, level and jurisdiction. Use the current published test, schedule and approved arena diagram for the class you enter.",
      },
      {
        question:
          "How should you use a dressage score sheet or judge feedback after a test?",
        options: [
          "Identify appropriate training priorities with your instructor",
          "Treat one generic percentage as a universal pass/fail rule",
          "Ignore comments and repeat the same plan",
          "Compare only the total score with an unrelated class",
        ],
        correctIndex: 0,
        explanation:
          "Where feedback is provided, review the movement comments with your instructor. Qualification, progression and scoring expectations are set by the current organiser and governing body.",
      },
    ],
    aiTutorPrompts: [
      "How do I ride an accurate 20-metre circle in a dressage arena?",
      "What do the dressage arena letters mean and where are they positioned?",
      "How can I improve my horse's transitions for better dressage scores?",
    ],
    linkedCompetencies: [
      "competition_awareness",
      "riding_position",
      "balance_and_rhythm",
    ],
  },
  {
    slug: "competition-etiquette-and-sportsmanship",
    pathwaySlug: "competitions-preparation",
    title: "Competition Etiquette & Sportsmanship",
    level: "developing",
    category: "Competitions & Preparation",
    sortOrder: 4,
    objectives: [
      "Understand the written and unwritten rules of competition etiquette",
      "Demonstrate good sportsmanship regardless of results",
      "Know the correct warm-up arena protocol",
      "Represent yourself and your yard positively at competitions",
    ],
    content: `Good sportsmanship and etiquette are essential at every level of competition. How you behave at a competition reflects on you, your instructor, your yard, and the equestrian community as a whole.

## Warm-Up Arena Etiquette

The warm-up arena is shared by all competitors. Key rules: ride on the left rein when possible, pass left-to-left when riding toward another rider, call "fence" clearly when approaching a practice fence, give way to the rider on the fence, keep to a safe distance from other horses, and do not block the entrance.

## In the Competition Arena

Enter the arena calmly and prepared. Salute the judge at the beginning and end of a dressage test. In a jumping class, wait for the bell or starting signal. Thank the fence judges or arena party if appropriate. If something goes wrong, stay calm — how you handle adversity shows your character.

## Sportsmanship

Congratulate other riders on their performance. Accept results gracefully — win or lose. If you disagree with a judge's decision, the correct route is through official channels, not public confrontation. Cheer for others in jump-offs and finals. Share equipment and information with fellow competitors. Help someone in difficulty if it is safe to do so.

## Representing Your Yard

You are an ambassador for your instructor and yard. Tidy, well-turned-out riders who behave respectfully create a positive image. Thank show organisers and volunteers. Leave your lorry park space clean. Be kind to your horse in public — the equestrian community watches how competitors treat their horses.

## After the Competition

Regardless of results, the most important thing is that you and your horse return home safely. Cool down properly, check the horse for any minor injuries from the day, and reflect on what went well and what to work on. Every competition is a learning experience.`,
    keyPoints: [
      "Follow warm-up arena rules: pass left-to-left, call 'fence', keep safe distances",
      "Accept results gracefully and congratulate other riders regardless of your placing",
      "You represent your instructor, yard, and the equestrian community at every event",
      "Treat your horse kindly in public — the community watches how competitors handle their horses",
      "Every competition is a learning experience — reflect on it afterwards and set goals for next time",
    ],
    safetyNote:
      "Warm-up arenas can be crowded and tense. Stay alert, communicate clearly, and remove yourself if the environment becomes unsafe. Your safety and your horse's safety are more important than any warm-up exercise.",
    practicalApplication:
      "At your next competition (or as a spectator), observe the warm-up arena and note which riders follow good etiquette and which do not. Consider what impression each creates. Then review your own behaviour at your last competition.",
    commonMistakes: [
      "Hogging the practice fence in the warm-up without giving way to others",
      "Making excuses publicly when results are disappointing",
      "Taking frustration out on the horse after a poor round",
      "Leaving the lorry park messy or blocking other vehicles",
      "Not thanking show organisers, judges, or volunteers for their time",
    ],
    knowledgeCheck: [
      {
        question:
          "What should you call when approaching a practice fence in the warm-up arena?",
        options: [
          "Nothing",
          "The horse's name",
          "'Fence!' clearly and in good time",
          "'Move!'",
        ],
        correctIndex: 2,
        explanation:
          "Calling 'fence' alerts other riders that you are committed to jumping and need a clear approach. It is essential for safety in a busy warm-up arena.",
      },
      {
        question:
          "What is the correct response if you disagree with a judge's score?",
        options: [
          "Argue with the judge immediately",
          "Post a complaint on social media",
          "Use official channels to query the result respectfully",
          "Refuse to leave the arena",
        ],
        correctIndex: 2,
        explanation:
          "Disagreements with judging should be handled through official channels — typically speaking to the show secretary or submitting a formal query. Public confrontation is unprofessional.",
      },
    ],
    aiTutorPrompts: [
      "What should I do if my horse misbehaves in the competition arena?",
      "How do I handle competition disappointment constructively?",
      "What are the rules about warming up over fences at competitions?",
    ],
    linkedCompetencies: ["competition_awareness", "welfare_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 11 — Rider Fitness & Mindset
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: "why-rider-fitness-matters",
    pathwaySlug: "rider-fitness-mindset",
    title: "Why Rider Fitness Matters",
    level: "beginner",
    category: "Rider Fitness & Mindset",
    sortOrder: 1,
    objectives: [
      "Understand why physical fitness is important for riding performance and horse welfare",
      "Know the key fitness components for riders: core strength, balance, flexibility, and cardio",
      "Identify areas of personal fitness that affect your riding",
      "Begin a simple fitness routine that supports riding improvement",
    ],
    content: `Riding is a physically demanding sport, even though the horse does much of the visible work. A fit rider is safer, more effective, less likely to be injured, and kinder to the horse. An unfit rider is a burden — they tire quickly, lose balance, grip too tightly, and make the horse's job harder.

## The Demands of Riding

Riding requires core stability (to maintain position without gripping), leg strength (to give clear aids and absorb the horse's movement), flexibility (to follow the horse's motion through the hips and lower back), cardiovascular fitness (to sustain effort over a full lesson or competition), and balance (to stay centred over the horse's centre of gravity).

## Core Strength

The core — the muscles of the abdomen, lower back, and pelvis — is the rider's foundation. A strong core allows you to sit deeply, absorb the horse's movement, and give independent aids without losing balance. Without core strength, riders compensate by gripping with the knees, rounding the shoulders, or relying on the reins for balance.

## Balance and Proprioception

Riding balance is different from standing balance. It requires constant micro-adjustments to stay aligned with the horse's movement. Off-horse exercises like standing on one leg, using a balance board, or yoga improve proprioception — the body's awareness of its position in space.

## Flexibility

Tight hips, hamstrings, and lower back restrict the rider's ability to sit correctly and follow the horse. Stretching after riding (when muscles are warm) improves flexibility over time. Hip-opening stretches, hamstring stretches, and gentle lower-back mobilisation are particularly beneficial.

## Cardiovascular Fitness

A 45-minute riding lesson is physically demanding. Riders who get breathless or tired halfway through the lesson lose concentration and effectiveness. Regular cardiovascular exercise — walking, jogging, cycling, swimming — builds the stamina needed to ride well for a full session.

## Starting a Routine

You do not need a gym membership. A simple 15-minute routine three times a week can make a significant difference: 2 minutes of marching on the spot, 3 sets of 10 squats, a 30-second plank (building to 60 seconds), 10 lunges each leg, and a 5-minute stretch focusing on hips and hamstrings. Consistency matters more than intensity.`,
    keyPoints: [
      "Rider fitness directly impacts riding performance, safety, and the horse's welfare",
      "Core strength is the foundation — it enables independent aids and a deep, stable seat",
      "Balance, flexibility, and cardiovascular fitness are all essential for effective riding",
      "A simple 15-minute routine three times a week can significantly improve riding fitness",
      "Consistency is more important than intensity — small regular efforts compound over time",
    ],
    safetyNote:
      "Start any new fitness routine gradually. If you have existing health conditions or injuries, consult a healthcare professional before beginning. Always warm up before exercising and cool down afterwards.",
    practicalApplication:
      "Try the 15-minute routine described above three times this week. Note how you feel during your next riding lesson — particularly your core stability and stamina. Adjust the routine based on what your riding needs most.",
    commonMistakes: [
      "Assuming riding alone is enough exercise — off-horse fitness training is essential for improvement",
      "Focusing only on strength and ignoring flexibility, which leads to stiffness in the saddle",
      "Starting too intensely and giving up after a week — consistency beats intensity",
      "Neglecting core exercises in favour of general gym work that doesn't transfer to riding",
      "Stretching cold muscles — always warm up first or stretch after riding",
    ],
    knowledgeCheck: [
      {
        question:
          "Which fitness component is considered the rider's foundation?",
        options: [
          "Arm strength",
          "Core strength",
          "Running speed",
          "Upper body power",
        ],
        correctIndex: 1,
        explanation:
          "Core strength — the muscles of the abdomen, lower back, and pelvis — is the foundation for a stable, effective riding position and independent aids.",
      },
      {
        question:
          "When is the best time to stretch for flexibility improvement?",
        options: [
          "Before any warm-up",
          "After riding or exercise when muscles are warm",
          "Only on non-riding days",
          "Never — stretching is not important for riders",
        ],
        correctIndex: 1,
        explanation:
          "Stretching warm muscles (after riding or exercise) is safer and more effective than stretching cold. Post-ride stretching improves flexibility over time.",
      },
    ],
    aiTutorPrompts: [
      "Can you suggest a rider fitness routine I can do at home?",
      "What yoga poses are best for improving hip flexibility for riding?",
      "How can I improve my core strength specifically for riding?",
    ],
    linkedCompetencies: ["rider_position", "balance_and_rhythm"],
  },
  {
    slug: "building-riding-confidence",
    pathwaySlug: "rider-fitness-mindset",
    title: "Building Riding Confidence",
    level: "developing",
    category: "Rider Fitness & Mindset",
    sortOrder: 2,
    objectives: [
      "Understand why confidence issues are common in riding and that they are normal",
      "Identify personal confidence triggers and patterns",
      "Learn practical strategies for rebuilding and maintaining confidence",
      "Know when to seek professional help for anxiety that impacts riding",
    ],
    content: `Confidence is one of the most important factors in riding — and one of the most fragile. A fall, a spook, a bad experience, or even watching someone else's accident can dent riding confidence profoundly. Understanding confidence, recognising when it is struggling, and knowing how to rebuild it are vital skills.

## Why Confidence Matters

A confident rider makes clear, decisive aids. The horse responds to confidence — horses are herd animals that look to their leader for reassurance. A nervous rider transmits tension through their body: tightened muscles, restricted breathing, and unclear aids. The horse picks up on this and becomes tense or uncertain itself, creating a negative spiral.

## Common Confidence Challenges

Loss of confidence can stem from: a fall or near-miss, a horse that is too strong or unpredictable, advancing too quickly to new skills, a period away from riding, peer pressure to attempt things you are not ready for, or a gradual accumulation of small anxious moments. All of these are normal and common — you are not alone.

## Rebuilding Confidence

The most effective confidence-building strategy is systematic desensitisation — gradually re-exposing yourself to the thing you find difficult, starting from a level that feels manageable and building up slowly. If canter worries you, go back to work that feels comfortable — walk and trot — and rebuild from there. Set small, achievable goals and celebrate reaching them.

## Practical Strategies

Breathing techniques help enormously: breathe in for 4 counts, hold for 2, out for 6. This activates the body's relaxation response. Positive self-talk matters — replace "I can't do this" with "I am working on this and improving." Visualisation — imagining yourself riding successfully — programmes the brain for success. Riding a reliable schoolmaster horse can rebuild trust.

## When to Seek Help

If anxiety around riding is significantly impacting your enjoyment, sleep, or daily life, consider speaking to a sports psychologist or counsellor who understands equestrian sport. There is no shame in seeking help — many professional riders use sports psychology regularly.`,
    keyPoints: [
      "Confidence loss is normal and common — every rider experiences it at some point",
      "Nervous riding creates tension that the horse picks up, creating a negative spiral",
      "Rebuild confidence gradually — go back to a comfortable level and build up slowly",
      "Breathing techniques, positive self-talk, and visualisation are practical confidence tools",
      "Seek professional help if anxiety is significantly impacting your riding or daily life",
    ],
    safetyNote:
      "Never let anyone pressure you into doing something that feels unsafe. A good instructor will support your confidence journey and respect your boundaries. If your gut says no, listen to it.",
    practicalApplication:
      "Identify one area of your riding where confidence is lower than you would like. Set three small, progressive goals to build your confidence in that area over the next month. Discuss these goals with your instructor so they can support you.",
    commonMistakes: [
      "Pushing through fear without addressing it — this usually makes confidence worse, not better",
      "Comparing yourself to other riders instead of measuring your own progress",
      "Avoiding the thing you find difficult forever — gradual exposure is the path forward",
      "Believing you should never feel nervous — some nervousness is normal and healthy",
      "Not telling your instructor about confidence concerns — they need to know to help you",
    ],
    knowledgeCheck: [
      {
        question: "How does a rider's tension affect the horse?",
        options: [
          "It has no effect",
          "The horse becomes more relaxed",
          "The horse picks up on the tension and may become tense or uncertain too",
          "The horse goes faster",
        ],
        correctIndex: 2,
        explanation:
          "Horses are highly attuned to their rider's body language and tension. A tense rider transmits anxiety through muscle tension and unclear aids, causing the horse to become unsettled.",
      },
      {
        question:
          "What is the most effective strategy for rebuilding riding confidence?",
        options: [
          "Force yourself to do the scary thing immediately",
          "Stop riding altogether",
          "Gradually re-expose yourself starting from a comfortable level",
          "Only ride in competitions",
        ],
        correctIndex: 2,
        explanation:
          "Gradual, systematic re-exposure — starting from a level that feels manageable and building up — is the most effective way to rebuild confidence sustainably.",
      },
    ],
    aiTutorPrompts: [
      "I lost confidence after a fall — how do I start riding again?",
      "What breathing exercises can I use to calm myself before riding?",
      "How do I talk to my instructor about my confidence issues?",
    ],
    linkedCompetencies: ["rider_position", "welfare_awareness"],
  },
  {
    slug: "core-exercises-for-riders",
    pathwaySlug: "rider-fitness-mindset",
    title: "Core Exercises for Riders",
    level: "intermediate",
    category: "Rider Fitness & Mindset",
    sortOrder: 3,
    objectives: [
      "Perform a targeted core routine designed specifically for equestrian demands",
      "Understand how each exercise translates to improved riding performance",
      "Develop a sustainable weekly exercise habit",
      "Monitor progress through riding improvement rather than gym metrics",
    ],
    content: `Core strength is the single most impactful fitness area for riders. Every aid you give, every transition you ride, and every moment of balance in the saddle depends on your core. This lesson provides a targeted routine designed specifically for the demands of riding.

## The Rider's Core Routine

This routine takes 20 minutes and should be done 3–4 times per week. No equipment is needed.

**1. Plank (30–60 seconds × 3)**: Hold a straight plank on forearms and toes. Keep the back flat and hips level. This builds the deep stabilising muscles that hold your position in the saddle. Rest 30 seconds between sets.

**2. Dead Bug (10 each side × 3)**: Lie on your back with arms extended to the ceiling and knees at 90 degrees. Slowly extend opposite arm and leg toward the floor, keeping your lower back pressed into the ground. This teaches independent limb movement while maintaining core stability — exactly what you need for independent aids.

**3. Glute Bridge (15 reps × 3)**: Lie on your back with knees bent and feet flat. Push hips toward the ceiling, squeezing the glutes at the top. This strengthens the glutes and lower back, supporting the deep seat needed for sitting trot and canter.

**4. Side Plank (20–30 seconds each side × 2)**: This targets the obliques, which prevent the rider collapsing to one side — a common issue in canter and on circles.

**5. Bird Dog (10 each side × 3)**: On hands and knees, extend opposite arm and leg simultaneously while keeping the back flat and hips level. This develops the cross-body coordination and stability riders need.

**6. Hip Flexor Stretch (30 seconds each side)**: Kneel on one knee, push hips forward gently. Tight hip flexors are the enemy of a deep seat — this stretch counteracts hours of sitting at desks.

## Tracking Progress

Do not measure progress by how many planks you can do — measure it by how your riding improves. After four weeks of consistent core training, riders typically notice: a more stable position at sitting trot, less reliance on the reins for balance, clearer leg aids, and less fatigue at the end of a lesson.`,
    keyPoints: [
      "A 20-minute core routine 3–4 times per week significantly improves riding performance",
      "Plank, dead bug, glute bridge, side plank, and bird dog are the key exercises for riders",
      "Each exercise targets specific riding skills: stability, independent aids, deep seat, straightness",
      "Track progress through riding improvement, not gym metrics",
      "Include hip flexor stretches — tight hip flexors prevent a deep, effective seat",
    ],
    safetyNote:
      "Maintain correct form rather than pushing for more repetitions. Poor form in exercises like planks can strain the lower back. If you experience pain (not just muscle fatigue), stop and consult a professional.",
    practicalApplication:
      "Perform this routine three times this week. Before your next lesson, note your current level of stability at sitting trot and how tired you feel at the end. After four weeks of consistent training, compare your notes.",
    commonMistakes: [
      "Letting the hips sag in plank position, which strains the lower back",
      "Rushing through exercises instead of performing them slowly and with control",
      "Doing the routine once and expecting immediate results — consistency over weeks is needed",
      "Ignoring stretching and only doing strengthening exercises",
      "Exercising to exhaustion before a riding lesson, reducing performance in the saddle",
    ],
    knowledgeCheck: [
      {
        question:
          "Which exercise specifically targets the ability to give independent aids?",
        options: [
          "Squats",
          "Dead bug — extending opposite arm and leg while stabilising the core",
          "Running",
          "Bicep curls",
        ],
        correctIndex: 1,
        explanation:
          "The dead bug teaches the body to move limbs independently while maintaining a stable core — exactly what a rider needs to give separate hand and leg aids without losing balance.",
      },
      {
        question: "Why are hip flexor stretches important for riders?",
        options: [
          "They make you run faster",
          "Tight hip flexors prevent a deep, effective seat in the saddle",
          "They strengthen the arms",
          "They are not important for riders",
        ],
        correctIndex: 1,
        explanation:
          "Tight hip flexors — common from sitting at desks — prevent the rider from dropping their weight into the saddle and achieving a deep, following seat.",
      },
    ],
    aiTutorPrompts: [
      "Can you explain the correct form for a plank?",
      "What core exercises can I do with a stability ball?",
      "How do I know if my core is strong enough for my current riding level?",
    ],
    linkedCompetencies: ["rider_position", "balance_and_rhythm"],
  },
  {
    slug: "mental-skills-for-performance",
    pathwaySlug: "rider-fitness-mindset",
    title: "Mental Skills for Riding Performance",
    level: "advanced",
    category: "Rider Fitness & Mindset",
    sortOrder: 4,
    objectives: [
      "Understand the role of sports psychology in equestrian performance",
      "Apply goal-setting, visualisation, and focus techniques to riding",
      "Manage pressure and perform under competition conditions",
      "Develop a growth mindset that supports long-term improvement",
    ],
    content: `At every level of riding, the mind is as important as the body. The difference between a rider who performs well in training but poorly in competition, and one who performs consistently, is often mental preparation rather than physical skill.

## Goal Setting for Riders

Effective goal setting uses the SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound. “I will practise a coach-selected, appropriate figure in trot with even bend and rhythm, then review it at the agreed point” is SMART. “I want to be better” is not. Set outcome goals (results you want), performance goals (specific improvements) and process goals (actions you can control). Goals must remain appropriate to the horse, rider, facility, current coach guidance and welfare context.

## Visualisation

Visualisation can be used as one optional preparation exercise. Before riding, use a brief, comfortable rehearsal that suits the rider’s current plan: imagine the approach, aids, feel of a balanced transition and rhythm of the canter. Stop or adapt the exercise if it increases distress, and seek appropriate professional support when anxiety is persistent or overwhelming.

## Focus and Concentration

Riding demands sustained concentration. Your focus should be on the present — this stride, this half-halt, this corner. When your mind wanders to the future (what if this goes wrong?) or the past (that was terrible), gently bring it back to the now. Use focus cues: a word or phrase like "soft" or "rhythm" that brings your attention back to the present.

## Managing Pressure

Competition pressure is not something to eliminate — it is something to manage. The Yerkes-Dodson curve shows that moderate arousal (nervousness) actually improves performance. Too little arousal leads to flat, unfocused riding. Too much leads to tension and panic. The goal is to find your optimal arousal zone through preparation, breathing, and confidence in your training.

## Growth Mindset

A growth mindset means believing that ability is developed through effort, practice, and learning. A fixed mindset believes talent is innate and unchangeable. Riders with a growth mindset see mistakes as learning opportunities, seek challenges, and persist through difficulties. This mindset is scientifically linked to greater long-term achievement.`,
    keyPoints: [
      "Mental skills are as important as physical skills for riding performance",
      "Use SMART goal setting with outcome, performance, and process goals",
      "Visualisation activates the same neural pathways as physical practice — use it before every ride",
      "Stay present-focused during riding — use focus cues to redirect a wandering mind",
      "A growth mindset — believing ability is developed through effort — supports long-term improvement",
    ],
    safetyNote:
      "Mental pressure that causes persistent anxiety, sleep disturbance, or avoidance of riding should be addressed with professional support. Sports psychology is a recognised field — using it is a sign of strength, not weakness.",
    practicalApplication:
      "Before your next ride, spend 3 minutes visualising the session going well. Set one SMART goal for the ride. During the ride, use a focus cue (a single word) whenever your mind wanders. After the ride, reflect on how mental preparation affected your performance.",
    commonMistakes: [
      "Neglecting mental preparation because it seems less 'real' than physical training",
      "Visualising things going wrong instead of right — this programmes the brain for failure",
      "Setting only outcome goals (win, get a rosette) without performance or process goals",
      "Believing that nerves are always bad — moderate arousal improves performance",
      "Having a fixed mindset about talent — ability is developed through practice and effort",
    ],
    knowledgeCheck: [
      {
        question: "What does the SMART goal framework stand for?",
        options: [
          "Simple, Managed, Active, Reasonable, Tested",
          "Specific, Measurable, Achievable, Relevant, Time-bound",
          "Strong, Motivated, Athletic, Ready, Tough",
          "Set, Maintain, Assess, Review, Track",
        ],
        correctIndex: 1,
        explanation:
          "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound — this framework ensures goals are clear and actionable.",
      },
      {
        question: "Why is visualisation effective for riders?",
        options: [
          "It is not effective",
          "It replaces the need for physical practice",
          "It activates the same neural pathways as physical practice",
          "It only works for professional riders",
        ],
        correctIndex: 2,
        explanation:
          "Research shows that mental rehearsal activates the same brain areas and neural pathways as physical practice, making it a powerful complement to training.",
      },
    ],
    aiTutorPrompts: [
      "Can you guide me through a riding visualisation exercise?",
      "How do I develop a pre-competition mental routine?",
      "What focus cues work best for riders at intermediate level?",
    ],
    linkedCompetencies: ["rider_position", "competition_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATHWAY 12 — Coaching & Teaching Skills
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: "introduction-to-coaching-concepts",
    pathwaySlug: "coaching-teaching-skills",
    title: "Introduction to Coaching Concepts",
    level: "beginner",
    category: "Coaching & Teaching Skills",
    sortOrder: 1,
    objectives: [
      "Understand the difference between coaching and instructing",
      "Identify the core communication skills needed for coaching",
      "Describe the key qualities of a good equestrian coach",
      "Recognise the safety responsibilities that come with coaching riders",
    ],
    content: `Coaching riders is one of the most rewarding roles in the equestrian world, but it carries significant responsibility. Before you begin working with riders of any level, it is essential to understand what coaching actually means, how it differs from simply giving instructions, and what qualities you need to develop in yourself to be effective and safe.

## Coaching vs. Instructing

Many people use the words "coaching" and "instructing" interchangeably, but they describe different approaches. **Instructing** is primarily about telling someone what to do: "Sit up straight," "Shorten your reins," "Kick on." It is directive and task-focused. **Coaching**, on the other hand, is a broader, more holistic approach. A coach helps the rider understand *why* they are doing something, encourages them to think independently, and supports their long-term development.

A good coach asks questions as well as giving directions. For example, instead of saying "You're leaning forward," a coach might ask, "Where do you feel your weight is?" This encourages the rider to develop their own body awareness and become a more self-reliant horseperson. Effective coaching blends instruction with guided discovery, praise, and ongoing assessment of the rider's progress.

## Basic Communication Skills

Communication is at the heart of coaching. You must be able to convey information clearly, concisely, and at the right moment. In the arena, riders are managing a living animal, so your voice must carry without startling horses, and your instructions must be timed so the rider can act on them safely.

**Verbal communication** should be simple, positive, and well-timed. Avoid long explanations while the rider is actively riding — save detailed theory for halted moments or post-session discussions. Use the rider's name to get their attention before giving a direction.

**Non-verbal communication** matters too. Your body language, facial expressions, and positioning in the arena all send messages to your riders. Stand where you can see the whole arena, maintain an encouraging posture, and use hand signals where appropriate.

**Active listening** is equally important. When a rider tells you something feels wrong, or asks a question, listen carefully before responding. Understanding the rider's perspective helps you tailor your coaching to their needs.

## Qualities of a Good Coach

A good coach is more than a knowledgeable rider. Key qualities include:

- **Patience** — Every rider learns at a different pace. Repeating exercises without frustration is vital.
- **Empathy** — Understanding a nervous rider's feelings helps you support them rather than push them too fast.
- **Enthusiasm** — Your energy is infectious. If you are positive and engaged, your riders will be too.
- **Adaptability** — Lessons rarely go exactly to plan. Weather changes, horses have off days, and riders have varying energy levels. A good coach adjusts on the fly.
- **Knowledge** — You must understand horse behaviour, riding technique, and welfare to keep sessions safe and educational.
- **Integrity** — Always be honest with your riders about their progress, and never put them in situations beyond their current ability for the sake of impressing others.

## Safety Responsibilities

Safety is the single most important aspect of coaching. As a coach, you are responsible for the wellbeing of both the riders and the horses in your care. This means:

- **Risk assessment** — Before every session, check the arena surface, fencing, weather conditions, and the suitability of the horse for the rider's level.
- **Appropriate equipment** — Ensure every rider wears a correctly fitted, current-standard hat, appropriate footwear with a heel, and a body protector where required.
- **Knowing your limits** — Never coach exercises you have not been trained to teach. If a rider needs help beyond your current qualification, refer them to a more experienced coach.
- **Emergency procedures** — Know the yard's emergency plan, the location of the first-aid kit, and how to contact emergency services. You should hold a current first-aid certificate.
- **Safeguarding** — If coaching children or vulnerable adults, you must understand and follow safeguarding policies, including appropriate conduct and reporting procedures.

Understanding these fundamentals will give you the strongest possible foundation as you develop your coaching skills further.`,
    keyPoints: [
      "Coaching is holistic and encourages rider understanding, whereas instructing is purely directive",
      "Clear, well-timed verbal and non-verbal communication is essential in the arena",
      "Patience, empathy, adaptability, and integrity are core qualities of a good coach",
      "Safety responsibilities include risk assessment, equipment checks, and emergency preparedness",
      "Always coach within your qualification level and refer riders on when necessary",
    ],
    safetyNote:
      "As a coach, you have a duty of care to every rider and horse in your session. Always carry out a risk assessment before the lesson, ensure all riders wear correctly fitted hats and appropriate footwear, and never allow a rider to attempt an exercise beyond their current ability. Keep a charged mobile phone accessible and know the location of the nearest first-aid kit.",
    practicalApplication:
      "Begin by observing experienced coaches at your yard and noting how they communicate, manage safety, and adapt their sessions. Practise explaining simple riding concepts to a friend in clear, concise language. Write a short checklist of safety checks you would carry out before a lesson and use it every time you help with a session.",
    commonMistakes: [
      "Talking too much while the rider is actively managing the horse, causing information overload",
      "Focusing only on what the rider is doing wrong rather than balancing corrections with praise",
      "Neglecting to carry out a risk assessment before the session begins",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the main difference between coaching and instructing?",
        options: [
          "Coaching focuses on holistic development and understanding, while instructing is purely directive",
          "Instructing is more modern than coaching",
          "Coaching only applies to advanced riders",
          "There is no difference; the terms are identical",
        ],
        correctIndex: 0,
        explanation:
          "Coaching encourages riders to understand the 'why' behind what they do and supports long-term development, whereas instructing is focused on telling riders what to do in the moment.",
      },
      {
        question:
          "Which of the following is NOT a key quality of a good equestrian coach?",
        options: [
          "Patience and empathy",
          "Willingness to push riders beyond their ability to accelerate progress",
          "Adaptability and enthusiasm",
          "Integrity and honesty about rider progress",
        ],
        correctIndex: 1,
        explanation:
          "A good coach never pushes riders beyond their current ability. Safety and progressive development are always prioritised over rapid advancement.",
      },
      {
        question: "What should a coach always carry out before every lesson?",
        options: [
          "A social media post about the lesson",
          "A risk assessment covering arena, equipment, weather, and horse suitability",
          "A written exam for each rider",
          "A veterinary check on every horse",
        ],
        correctIndex: 1,
        explanation:
          "A risk assessment before every session ensures that the environment, equipment, and horse–rider combinations are safe and appropriate.",
      },
    ],
    aiTutorPrompts: [
      "Can you give me examples of coaching questions I could ask a rider instead of just telling them what to do?",
      "What communication techniques work best for nervous or anxious riders?",
      "Walk me through a pre-lesson safety checklist for a group session.",
    ],
    linkedCompetencies: ["coaching_fundamentals", "yard_safety_awareness"],
  },

  {
    slug: "understanding-your-learners",
    pathwaySlug: "coaching-teaching-skills",
    title: "Understanding Your Learners",
    level: "beginner",
    category: "Coaching & Teaching Skills",
    sortOrder: 2,
    objectives: [
      "Recognise how different ages and abilities affect learning in the saddle",
      "Identify the main learning styles and how to accommodate them",
      "Understand how to build confidence and rapport with riders",
      "Appreciate the importance of adapting your approach to individual needs",
    ],
    content: `Every rider who comes to you for coaching is unique. They bring different physical abilities, emotional states, previous experiences, and ways of learning. Understanding your learners is fundamental to being an effective coach — it allows you to pitch sessions at the right level, communicate in a way that resonates, and build the trust needed for genuine progress.

## Different Ages and Abilities

The age of your rider significantly affects how you should coach them. **Young children** (under 8) have short attention spans and learn best through games and fun activities. Keep instructions simple, sessions short, and praise frequent. They may not yet have the physical strength or coordination to perform advanced movements, so focus on balance, confidence, and enjoyment.

**Older children and teenagers** can handle more structured sessions and begin to understand theory. However, they may also be self-conscious, especially in group lessons. Be sensitive to peer dynamics and avoid singling out individuals for criticism. Positive reinforcement works well with this age group.

**Adult learners** often bring anxiety or self-consciousness, particularly if they are returning to riding after a long break or starting as complete beginners. They may overthink instructions and tense up physically. Adults appreciate understanding the reasoning behind exercises, so include brief explanations of why you are asking them to do something. Respect their life experience and treat them as partners in the learning process.

**Riders with additional needs** — whether physical disabilities, learning difficulties, or sensory impairments — require you to adapt your communication and exercises. Work with the rider (and their carers if appropriate) to understand their specific requirements. Organisations such as the Riding for the Disabled Association (RDA) offer excellent training in adaptive coaching.

## Learning Styles

People absorb information in different ways. While modern research suggests learning is more complex than simple categories, it is useful as a coach to be aware of three broad approaches:

- **Visual learners** benefit from demonstrations, watching other riders, and using markers or visual aids in the arena. Show them what you want rather than just describing it.
- **Auditory learners** respond well to clear verbal instructions, analogies, and discussion. They may benefit from talking through what they are going to do before they do it.
- **Kinaesthetic learners** learn by doing. They need to feel the movement in their body. Exercises that exaggerate a position or movement — such as riding without stirrups to develop feel — are particularly effective for these riders.

In practice, most people use a blend of styles, and a good coach will naturally incorporate visual, auditory, and kinaesthetic elements into every session. If a rider is not responding to one approach, try another.

## Building Confidence and Rapport

Confidence is the foundation of all riding progress. A nervous rider will grip, tense up, and be unable to learn effectively. Building confidence starts from the very first interaction.

**Rapport** is the connection between coach and rider. To build it:

- Learn your rider's name and use it regularly.
- Ask about their goals, fears, and previous experience before the first lesson.
- Be consistent in your manner — calm, positive, and professional.
- Celebrate small achievements genuinely. Progress in riding is often incremental, and acknowledging each step matters.
- Never dismiss a rider's fear. If someone is anxious about cantering, acknowledge that feeling and work at their pace.

**Trust** is built over time. Follow through on what you say, be reliable, and always prioritise the rider's safety and comfort. If you promise to keep a session at walk and trot, do not suddenly ask for canter without discussion.

## Adapting Your Approach

No single coaching method works for everyone. You must be prepared to change your plan mid-session based on what you observe. If a rider is becoming frustrated, simplify the exercise and rebuild. If they are finding something easy, progress them gently. Reading your rider's body language and energy level is a skill you will develop with experience.

Keep notes on each rider between sessions — what went well, what they struggled with, and what to focus on next time. This shows professionalism and helps you plan effective, personalised lessons.`,
    keyPoints: [
      "Children, teenagers, adults, and riders with additional needs all require different coaching approaches",
      "Visual, auditory, and kinaesthetic learning styles should all be incorporated into sessions",
      "Building confidence through rapport and trust is essential before riders can progress",
      "Never dismiss a rider's fear — acknowledge it and work at their pace",
      "Keep notes on each rider to plan personalised, progressive sessions",
    ],
    safetyNote:
      "When working with nervous riders, always ensure the horse is calm and well-suited to the rider's level. A frightened rider on an excitable horse is a dangerous combination. If a rider becomes genuinely distressed, halt the session calmly, bring the horse to a stop, and allow the rider to dismount if they wish. Never force a rider to continue an exercise they are clearly not ready for.",
    practicalApplication:
      "Before your next session, spend five minutes talking to the rider about their experience, goals, and any concerns. During the session, try giving the same instruction three different ways — as a verbal direction, as a demonstration, and as a physical exercise. Afterwards, note which approach seemed to work best. Over time, build a simple profile for each regular rider to guide your lesson planning.",
    commonMistakes: [
      "Assuming all riders learn the same way and only using verbal instructions",
      "Pushing a nervous rider too fast to 'get them past their fear' rather than building confidence progressively",
      "Failing to adapt the lesson when a rider is clearly struggling or losing engagement",
    ],
    knowledgeCheck: [
      {
        question:
          "Which approach is most effective for coaching young children?",
        options: [
          "Long theoretical explanations before mounting",
          "Short, fun sessions with games and frequent praise",
          "Strict discipline and repetitive drills",
          "Allowing them to ride unsupervised to build independence",
        ],
        correctIndex: 1,
        explanation:
          "Young children have short attention spans and respond best to fun, game-based sessions with plenty of positive reinforcement. This builds confidence and a love of riding.",
      },
      {
        question:
          "What should you do if a rider is not responding to verbal instructions?",
        options: [
          "Repeat the same instruction more loudly",
          "Tell them they are not trying hard enough",
          "Try a different approach, such as a demonstration or a physical exercise",
          "Move on to a harder exercise to challenge them",
        ],
        correctIndex: 2,
        explanation:
          "Different riders learn in different ways. If verbal instructions are not working, switching to a visual demonstration or a kinaesthetic exercise may help the rider understand what is being asked.",
      },
      {
        question: "How can a coach best build rapport with a new rider?",
        options: [
          "Immediately start the lesson to make the most of the time",
          "Learn their name, ask about their goals and experience, and be consistent and positive",
          "Focus only on correcting their faults so they improve quickly",
          "Avoid personal conversation and keep the session strictly professional",
        ],
        correctIndex: 1,
        explanation:
          "Building rapport starts with showing genuine interest in the rider as a person. Learning their name, understanding their goals, and being consistently positive creates a foundation of trust.",
      },
    ],
    aiTutorPrompts: [
      "How can I adapt a group lesson when riders have very different confidence levels?",
      "What are some fun mounted games I can use with young children to develop their balance?",
      "How should I approach coaching an adult beginner who is very nervous about riding?",
    ],
    linkedCompetencies: ["coaching_fundamentals", "welfare_awareness"],
  },

  {
    slug: "structuring-a-beginner-lesson",
    pathwaySlug: "coaching-teaching-skills",
    title: "Structuring a Beginner Lesson",
    level: "developing",
    category: "Coaching & Teaching Skills",
    sortOrder: 3,
    objectives: [
      "Plan a safe, progressive lesson structure for novice riders",
      "Understand the purpose of warm-up, main work, and cool-down phases",
      "Manage lesson time effectively to cover all planned content",
      "Identify how to set achievable objectives for each beginner lesson",
    ],
    content: `A well-structured lesson is the backbone of effective coaching. For beginner riders, clear structure is especially important — it keeps the session safe, progressive, and focused. Without a plan, lessons can drift, become repetitive, or overwhelm the learner. In this lesson, you will learn how to build a beginner lesson from scratch, manage your time, and ensure every session has a clear purpose.

## Why Structure Matters

Beginner riders are often anxious and unsure of what to expect. A structured lesson provides a reassuring framework: the rider knows there is a beginning, a middle, and an end. Structure also helps you, as the coach, to track progress. If every session follows a logical format, you can see what the rider has mastered and what needs more work.

A sound progressive lesson structure uses three phases: **warm-up, main work, and cool-down**. Each phase serves a specific purpose and should be planned in advance.

## The Warm-Up Phase (10–15 minutes)

The warm-up prepares both horse and rider for the work ahead. For beginner riders, it also serves as a confidence-building phase.

**For the rider**, the warm-up should include:
- A brief chat to check how they are feeling and remind them of the previous session's achievements.
- Gentle mounted exercises at halt and walk, such as arm circles, toe touches, and looking left and right. These loosen the rider's muscles and improve body awareness.
- Walking on both reins to establish rhythm and relaxation. Encourage the rider to breathe deeply and soften their seat.

**For the horse**, the warm-up allows muscles to loosen and joints to mobilise. Walk work on large circles and changes of rein ensures the horse is moving freely before you ask for more demanding work.

Avoid rushing the warm-up. For beginners, feeling settled and secure at walk is more important than getting quickly into trot.

## The Main Work Phase (20–25 minutes)

This is where the lesson's primary objective is addressed. For a beginner, this might be:
- Establishing a rising trot on both reins.
- Practising smooth transitions between walk and trot.
- Riding accurate shapes — circles, changes of rein through the diagonal or across the centre line.
- Beginning to understand basic aids for steering and pace control.

**Set one clear objective** for each session. Trying to cover too much confuses the beginner rider. For example, if the objective is "Rider will maintain a steady rising trot on both reins," all exercises in the main work phase should support this goal.

**Progressive difficulty** is important. Start with the easiest version of the exercise and gradually increase the challenge. For example:
1. Rising trot on a large circle with the coach leading.
2. Rising trot on a large circle independently.
3. Rising trot on the outside track with a change of rein.

Use frequent halts to check in with the rider, offer praise, and make adjustments. Beginners tire quickly — both physically and mentally — so intersperse active riding with brief rest periods.

## The Cool-Down Phase (5–10 minutes)

The cool-down is essential but often overlooked. It allows:
- The horse to stretch and relax after work, usually on a long rein at walk.
- The rider to reflect on what they have learnt and ask questions.
- You, as the coach, to summarise the session and set expectations for next time.

Encourage the rider to pat the horse and walk on a loose rein. This promotes a positive end to the session and reinforces the partnership between horse and rider.

## Time Management

A typical beginner lesson lasts 30–45 minutes. Managing your time well ensures all three phases are covered without rushing. A useful rule of thumb:
- **Warm-up**: 25–30% of the session.
- **Main work**: 50–55% of the session.
- **Cool-down**: 15–20% of the session.

Keep a watch or arena clock visible. It is easy to spend too long on the warm-up or overrun on the main work, leaving no time for a proper cool-down.

## Writing a Lesson Plan

Before every session, write a brief lesson plan. Include:
- The rider's name and current level.
- The session objective (one clear goal).
- Warm-up exercises.
- Main work exercises with progressions.
- Cool-down plan.
- Equipment or arena setup needed.

This need not be elaborate — a few bullet points on a notepad are sufficient. The act of planning ensures you arrive prepared and confident. After the session, make a brief note of what went well and what to work on next time.`,
    keyPoints: [
      "Every lesson should follow a three-phase structure: warm-up, main work, and cool-down",
      "The warm-up builds confidence and prepares horse and rider physically and mentally",
      "Set one clear, achievable objective per beginner lesson to avoid information overload",
      "Use progressive difficulty within the main work phase to build skills gradually",
      "Always write a brief lesson plan and review it after the session for continuous improvement",
    ],
    safetyNote:
      "Before every beginner lesson, check that the horse is suitable for the rider's level, the arena surface is safe, and all equipment fits correctly. During the warm-up, assess the rider's confidence and the horse's behaviour — if either seems unsettled, adapt your plan accordingly. Never skip the warm-up phase, as cold muscles in both horse and rider increase the risk of injury.",
    practicalApplication:
      "Write a lesson plan for a 30-minute beginner lesson with the objective of 'Rider will perform smooth walk-to-trot transitions on both reins.' Include specific warm-up exercises, two or three main work progressions, and a cool-down plan. Time each section and use the plan in your next session. Afterwards, note what you would change for next time.",
    commonMistakes: [
      "Trying to cover too many skills in one session, leaving the rider overwhelmed and confused",
      "Skipping the warm-up to save time, increasing the risk of injury and rider anxiety",
      "Failing to plan the lesson in advance, resulting in a disorganised and unfocused session",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the recommended three-phase structure for a riding lesson?",
        options: [
          "Theory, practical, exam",
          "Warm-up, main work, cool-down",
          "Trot, canter, gallop",
          "Mounting, riding, dismounting",
        ],
        correctIndex: 1,
        explanation:
          "A warm-up, main work, and cool-down structure helps prepare horse and rider, address the learning objective, and end the session calmly.",
      },
      {
        question:
          "How many main objectives should a beginner lesson typically have?",
        options: [
          "As many as possible to maximise learning",
          "Three or four to cover a range of skills",
          "One clear, achievable objective",
          "None — beginner lessons should be unstructured",
        ],
        correctIndex: 2,
        explanation:
          "Setting one clear objective per session keeps the lesson focused and prevents information overload. All exercises in the main work phase should support this single goal.",
      },
      {
        question:
          "What percentage of the lesson should the warm-up typically occupy?",
        options: [
          "5% — just a quick walk around",
          "25–30% of the total session time",
          "50% — half the lesson should be warm-up",
          "There is no need for a warm-up in beginner lessons",
        ],
        correctIndex: 1,
        explanation:
          "The warm-up should take approximately 25–30% of the session. For a 30-minute lesson, that is roughly 8–10 minutes — enough to prepare horse and rider physically and mentally.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me write a lesson plan for a 45-minute beginner group lesson focused on steering?",
      "What mounted warm-up exercises are best for beginner riders to improve balance?",
      "How do I manage time effectively when a beginner takes longer than expected to master an exercise?",
    ],
    linkedCompetencies: ["coaching_fundamentals", "lesson_planning"],
  },

  {
    slug: "effective-demonstrations-and-feedback",
    pathwaySlug: "coaching-teaching-skills",
    title: "Effective Demonstrations & Feedback",
    level: "developing",
    category: "Coaching & Teaching Skills",
    sortOrder: 4,
    objectives: [
      "Demonstrate riding exercises effectively for learners to observe",
      "Give constructive, balanced feedback that promotes improvement",
      "Identify common rider faults and understand their causes",
      "Use positive reinforcement techniques to motivate riders",
    ],
    content: `The ability to demonstrate effectively and give clear, constructive feedback separates a competent coach from a great one. Riders learn by watching, feeling, and hearing — and your demonstrations and feedback address all three. In this lesson, you will develop the skills to show riders what you mean, help them understand what they are doing well, and guide them towards improvement without damaging their confidence.

## How to Demonstrate Effectively

A demonstration shows the rider exactly what the desired outcome looks like. It is particularly powerful for visual learners, but benefits all riders by providing a concrete reference point.

**Principles of a good demonstration:**

1. **Position yourself so the rider can see clearly.** If the rider is mounted, demonstrate from the ground using your own body to show position, or ride the exercise yourself if a spare horse is available. If demonstrating from the ground, face the rider so they can mirror your movements.

2. **Demonstrate the whole skill first, then break it down.** Show the complete exercise so the rider understands the goal, then repeat it step by step with commentary. For example, demonstrate a rising trot transition smoothly, then repeat it in slow motion, explaining each aid as you give it.

3. **Keep demonstrations brief and focused.** A long demonstration loses the rider's attention. Show the key point, explain it in one or two sentences, and then let the rider try.

4. **Use another rider as a model.** In group lessons, if one rider performs an exercise well, ask their permission and then use them as a positive example. This is motivating for the model rider and helpful for the rest of the group.

5. **Use visual aids.** Cones, poles, and markers in the arena can support your demonstration by showing the rider exactly where to ride and what shape to make.

**Common pitfalls** include demonstrating something you cannot perform well yourself (which undermines your credibility), demonstrating too many things at once, and forgetting to explain what the rider should be watching for during the demonstration.

## Giving Constructive Feedback

Feedback is the tool that drives improvement. Without it, riders have no way of knowing whether they are performing correctly. However, poorly delivered feedback can crush confidence and stall progress.

**The feedback sandwich** is a well-known technique:
1. Start with something positive — what the rider did well.
2. Offer the correction or area for improvement.
3. End with encouragement or another positive comment.

For example: "Really good rhythm in that trot, well done. Try to keep your heels a little further down — think about your weight dropping through your leg. You're doing brilliantly; let's try that again."

**Be specific.** "That was good" tells the rider very little. "Your transition to trot was really smooth because you used your leg clearly and sat tall" gives the rider precise, actionable information about what they did right.

**Timing matters.** Give feedback as close to the moment of performance as possible. If you wait until the end of the session, the rider may not remember the specific moment you are referring to. Short, immediate feedback during the exercise is more effective than a long debrief afterwards.

**Avoid overloading.** Give the rider one thing to work on at a time. If you point out three faults simultaneously, the rider will feel overwhelmed and may not correct any of them. Prioritise the most important correction and address the rest in later sessions.

## Identifying Common Rider Faults

Part of giving effective feedback is knowing what to look for. Common beginner faults include:

- **Looking down** — Riders often look at the horse's neck or their own hands instead of ahead. This affects balance and steering. Encourage the rider to look where they are going.
- **Gripping with the knees** — Tension in the knee pushes the lower leg away from the horse and lifts the rider out of the saddle. Suggest the rider imagine their leg as heavy, draping around the horse.
- **Collapsing at the waist** — Slouching forward rounds the spine and puts the rider behind the movement. Use imagery such as "imagine a string pulling the top of your head towards the sky."
- **Hands too high or too wide** — This is often a balance issue. Encourage a straight line from elbow to bit.
- **Holding the breath** — Nervous riders frequently hold their breath, which causes tension throughout the body. Remind them to breathe and even ask them to count out loud or sing.

Understanding *why* a fault occurs helps you address the root cause rather than just the symptom. For example, a rider gripping with their knees may be doing so because they feel unbalanced — the solution is to improve their balance, not just tell them to stop gripping.

## Positive Reinforcement Techniques

Positive reinforcement means rewarding desired behaviour to encourage its repetition. In coaching, this is primarily achieved through praise, but it can also include tangible rewards for younger riders, such as stickers or rosettes for achievement.

**Genuine, specific praise** is the most powerful motivator. Riders know when praise is hollow. "Well done" is fine occasionally, but "That was your best canter transition yet — you really sat tall and used your leg clearly" has far more impact.

**Celebrate effort, not just outcome.** A rider who tries hard but does not quite manage the exercise deserves recognition for their effort. This encourages a growth mindset — the belief that skills improve through practice and persistence.

**Use praise publicly, correct privately.** In group lessons, praise individuals openly but be discreet with corrections. Taking a rider aside to offer a quiet suggestion is far more respectful than calling out their mistakes in front of others.`,
    keyPoints: [
      "Position demonstrations so the rider can see clearly and break the skill down step by step",
      "Use the feedback sandwich: positive, correction, encouragement",
      "Be specific and timely with feedback — vague comments do not help riders improve",
      "Address the root cause of rider faults rather than just the visible symptom",
      "Praise effort and progress genuinely to build confidence and motivation",
    ],
    safetyNote:
      "When demonstrating from the ground, always maintain a safe distance from the horses. If demonstrating mounted, ensure the horse you ride is calm and predictable. Never attempt to demonstrate an exercise you are not confident performing, as a poor demonstration or fall would damage rider confidence and pose a safety risk.",
    practicalApplication:
      "During your next coaching session, consciously use the feedback sandwich for every correction you give. After the session, write down three rider faults you observed and note both the fault and the likely root cause. Practise demonstrating one simple exercise — such as a correct halt — in front of a mirror, talking through each step as you would for a rider.",
    commonMistakes: [
      "Giving too many corrections at once, overwhelming the rider and preventing effective learning",
      "Using vague feedback such as 'That was good' without explaining what specifically was good",
      "Correcting riders loudly in front of a group, damaging their confidence and trust",
    ],
    knowledgeCheck: [
      {
        question: "What is the 'feedback sandwich' technique?",
        options: [
          "Giving feedback only at the start and end of the lesson",
          "Starting with praise, offering a correction, then ending with encouragement",
          "Writing feedback in a sandwich-shaped diagram",
          "Giving three negative corrections followed by one positive comment",
        ],
        correctIndex: 1,
        explanation:
          "The feedback sandwich structures feedback as: positive comment, correction or improvement area, then encouragement. This approach maintains confidence while still addressing areas for development.",
      },
      {
        question:
          "Why should a coach address the root cause of a rider fault rather than just the symptom?",
        options: [
          "To impress the rider with technical knowledge",
          "Because fixing the underlying issue resolves the visible fault more effectively and permanently",
          "Root causes are easier to explain than symptoms",
          "It is not necessary — correcting the symptom is sufficient",
        ],
        correctIndex: 1,
        explanation:
          "Faults often stem from deeper issues such as poor balance or tension. Addressing the root cause — for example, improving balance rather than just telling a rider to stop gripping — leads to lasting improvement.",
      },
      {
        question: "When is the best time to give feedback to a rider?",
        options: [
          "Only at the end of the entire lesson",
          "Before the rider has attempted the exercise",
          "As close to the moment of performance as possible",
          "Only in writing after the session",
        ],
        correctIndex: 2,
        explanation:
          "Immediate feedback is most effective because the rider can still recall what they were doing. Delayed feedback loses context and is harder for the rider to apply.",
      },
    ],
    aiTutorPrompts: [
      "How can I demonstrate a rising trot effectively from the ground without a horse?",
      "Give me examples of specific, positive feedback I could use for a beginner rider working on their position.",
      "What are the best strategies for correcting a rider who consistently looks down while riding?",
    ],
    linkedCompetencies: ["coaching_fundamentals", "rider_position"],
  },

  {
    slug: "foundations-of-equestrian-coaching",
    pathwaySlug: "coaching-teaching-skills",
    title: "Foundations of Equestrian Coaching",
    level: "intermediate",
    category: "Coaching & Teaching Skills",
    sortOrder: 1,
    objectives: [
      "Understand the role and responsibilities of an equestrian coach",
      "Know the difference between coaching and instructing",
      "Identify the key qualities of an effective equestrian coach",
      "Understand the importance of safeguarding, insurance, and qualifications",
    ],
    content: `Equestrian coaching is a rewarding but responsible role. A good coach does far more than call out instructions — they shape riders' development, build confidence, ensure safety, and promote a lifelong love of horses. Understanding the foundations of coaching is essential before stepping into the role.

## Coaching vs. Instructing

Instructing is telling someone what to do: "shorten your reins." Coaching is developing someone's understanding and ability: "what do you think would happen if your reins were shorter here?" Good coaching combines both approaches — direct instruction when safety or clarity requires it, and questioning or guided discovery when developing understanding. The best coaches adapt their approach to each individual.

## Key Qualities of a Good Coach

Effective equestrian coaches share several qualities: clear communication (they explain things in ways the learner understands), patience (learning takes time and involves setbacks), observation (they see what is happening and diagnose the cause), safety consciousness (they never compromise on safety), empathy (they remember what it feels like to be a beginner), and adaptability (they adjust the lesson to what the learner needs, not what they planned to teach).

## Responsibilities

Coaches are responsible for: the physical safety of riders and horses during their sessions, appropriate lesson content for the level, honest progress assessment, safeguarding (especially with young riders), maintaining their own qualifications and professional development, having appropriate insurance, and following their governing body's code of conduct.

## Safeguarding and Insurance

Anyone coaching children or vulnerable adults must have appropriate safeguarding training and checks (DBS in the UK). Professional indemnity and public liability insurance are mandatory. Working without insurance is irresponsible and potentially illegal. Coaches should also have a current first-aid qualification — both human and preferably equine.

## Qualifications Pathway

In the UK, coaches should hold qualifications and insurance appropriate to the activity, setting, rider age, and level being taught. Before booking a coach, check their current training, safeguarding arrangements, first-aid provision, and professional indemnity cover.`,
    keyPoints: [
      "Coaching develops understanding; instructing tells — effective coaches use both approaches appropriately",
      "Key coaching qualities: clear communication, patience, observation, safety, empathy, and adaptability",
      "Coaches are responsible for safety, appropriate content, safeguarding, insurance, and professional development",
      "Safeguarding training and DBS checks are mandatory for coaching children and vulnerable adults",
      "Choose a coach with current qualifications, safeguarding arrangements, first-aid provision, and suitable insurance",
    ],
    safetyNote:
      "Never coach without appropriate insurance and qualifications. If you witness a safeguarding concern, follow your organisation's reporting procedures immediately. The safety of riders — especially children — is the absolute top priority.",
    practicalApplication:
      "Research the coaching qualification pathway for your national equestrian federation. Identify the first qualification you would need and what it involves. If you are already coaching, check that your insurance, safeguarding training, and first-aid certificate are all current.",
    commonMistakes: [
      "Trying to coach beyond your qualification level or competence",
      "Coaching without insurance — this puts you, riders, and horses at legal and financial risk",
      "Teaching every rider the same way instead of adapting to the individual",
      "Focusing only on what is wrong rather than acknowledging what the rider does well",
      "Neglecting CPD and relying on outdated knowledge or methods",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the main difference between coaching and instructing?",
        options: [
          "There is no difference",
          "Coaching develops understanding; instructing directs actions",
          "Instructing is better than coaching",
          "Coaching is only for advanced riders",
        ],
        correctIndex: 1,
        explanation:
          "Coaching aims to develop the learner's understanding and problem-solving ability, while instructing provides direct guidance. Both are needed at different times.",
      },
      {
        question: "What is mandatory when coaching children in the UK?",
        options: [
          "A university degree",
          "DBS check and safeguarding training",
          "Olympic experience",
          "None of the above",
        ],
        correctIndex: 1,
        explanation:
          "DBS (Disclosure and Barring Service) checks and safeguarding training are mandatory for anyone working with children and vulnerable adults in the UK.",
      },
    ],
    aiTutorPrompts: [
      "What qualifications do I need to start coaching riders?",
      "How do I adapt my coaching style for nervous riders?",
      "What should be in a coaching session plan?",
    ],
    linkedCompetencies: [
      "coaching_skills",
      "welfare_awareness",
      "yard_safety_awareness",
    ],
  },
  {
    slug: "planning-effective-lessons",
    pathwaySlug: "coaching-teaching-skills",
    title: "Planning Effective Lessons",
    level: "intermediate",
    category: "Coaching & Teaching Skills",
    sortOrder: 2,
    objectives: [
      "Create a structured lesson plan with clear objectives, activities, and progression",
      "Understand how to adapt a plan during the lesson based on what is happening",
      "Know how to plan for different ability levels within the same session",
      "Use warm-up, main activity, and cool-down structure effectively",
    ],
    content: `A well-planned lesson is the foundation of effective coaching. While the best coaches adapt in the moment, they always start with a clear plan. Planning ensures the lesson has purpose, progression, and structure — which means better learning outcomes for the rider.

## The Lesson Plan Structure

Every lesson plan should include:
1. **Objective**: What will the rider be able to do better by the end of the lesson?
2. **Warm-up** (10–15 minutes): Get horse and rider moving, loosening, and focused
3. **Main activity** (20–25 minutes): The core learning exercise, taught in progressive steps
4. **Cool-down** (5–10 minutes): Gentle work, stretching, and a positive finish
5. **Review**: What went well? What to work on next?

## Writing Clear Objectives

Objectives should be observable and achievable within one lesson. "Improve canter" is too vague. "Ride three smooth walk-to-canter transitions on each rein" is specific and measurable. Good objectives guide the lesson — every exercise should connect to the objective.

## The Warm-Up

Never skip the warm-up. Both horse and rider need time to loosen muscles and joints. Warm-up exercises include: walking on a long rein, large circles and changes of rein, progressive transitions (walk-trot-walk), and gentle stretching exercises in the saddle.

## Teaching in Steps

Break complex skills into steps. If the objective is a 10m circle in trot, the progression might be: revise the 20m circle, practice a 15m circle, attempt the 10m circle with support, then independently. Each step builds on the previous one. Move forward when the rider is ready, not when the clock says so.

## Adapting the Plan

A good lesson plan is a guide, not a script. If the rider is struggling with something fundamental, go back a step. If they are finding the exercise easy, progress further. The ability to read the situation and adapt is what separates good coaches from average ones.

## Mixed-Ability Groups

In group lessons, plan exercises that can be differentiated. A polework exercise, for example, can be walked by a beginner, trotted by an intermediate, and cantered by an advanced rider — all in the same session. Clear, safe organisation is essential when managing different levels simultaneously.`,
    keyPoints: [
      "Every lesson needs an objective, warm-up, main activity, cool-down, and review",
      "Objectives must be specific, observable, and achievable within one lesson",
      "Break complex skills into progressive steps — each building on the previous one",
      "Adapt the plan during the lesson based on what the rider needs, not what the clock says",
      "For group lessons, choose exercises that can be differentiated for different ability levels",
    ],
    safetyNote:
      "Always include a safety check at the start of every lesson: tack, hats, footwear, and arena conditions. Have an emergency plan and ensure riders know what to do if someone falls. Never leave a lesson unsupervised.",
    practicalApplication:
      "Write a lesson plan for a 30-minute individual lesson for a developing rider. Include a clear objective, warm-up exercises, a progressive main activity, and a cool-down. Then consider how you would adapt it if the rider was struggling with the main exercise.",
    commonMistakes: [
      "Teaching without a plan — random exercises do not create systematic improvement",
      "Sticking rigidly to the plan when the rider clearly needs something different",
      "Skipping the warm-up to save time — cold muscles and joints are more prone to injury",
      "Setting objectives that are too ambitious for the lesson length or rider level",
      "Not reviewing at the end — the review consolidates learning and sets direction for next time",
    ],
    knowledgeCheck: [
      {
        question: "What must a good lesson objective be?",
        options: [
          "Vague and aspirational",
          "Specific, observable, and achievable within one lesson",
          "Only about jumping",
          "The same for every rider",
        ],
        correctIndex: 1,
        explanation:
          "Good objectives are specific (clear what is being worked on), observable (the coach can see it happening), and achievable within the lesson timeframe for that rider.",
      },
      {
        question:
          "What should a coach do if a rider is struggling with the main exercise?",
        options: [
          "Push through regardless",
          "End the lesson early",
          "Go back a step and rebuild",
          "Move to a completely different exercise",
        ],
        correctIndex: 2,
        explanation:
          "Going back to a step the rider can manage, then rebuilding progressively, is the most effective response. It maintains confidence while still working toward the objective.",
      },
    ],
    aiTutorPrompts: [
      "Can you help me write a lesson plan for a beginner's first canter?",
      "How do I differentiate exercises in a mixed-ability group?",
      "What warm-up exercises work best for stiff horses?",
    ],
    linkedCompetencies: ["coaching_skills"],
  },
  {
    slug: "communication-and-feedback-skills",
    pathwaySlug: "coaching-teaching-skills",
    title: "Communication & Feedback Skills",
    level: "advanced",
    category: "Coaching & Teaching Skills",
    sortOrder: 3,
    objectives: [
      "Communicate instructions clearly and concisely during lessons",
      "Give effective feedback that builds confidence and supports improvement",
      "Understand different communication styles for different learner types",
      "Use questioning techniques to develop riders' understanding",
    ],
    content: `Communication is the coach's most important tool. A coach who knows everything but cannot communicate it effectively will not develop riders. Clear, timely, and encouraging communication transforms a coaching session from a series of instructions into a genuine learning experience.

## Clarity and Timing

Instructions should be short, specific, and timed correctly. "Shorten your reins slightly and ask for trot at C" is clear and timely. "Try to sort of get the horse going a bit more" is vague and unhelpful. Give instructions when the rider can act on them — not in the middle of a complex movement, and not too far in advance.

## The Feedback Sandwich

Effective feedback follows a positive-constructive-positive structure:
1. What the rider did well (genuine, specific praise)
2. What to improve (one thing at a time, with a clear how-to)
3. An encouraging statement or look-forward

For example: "That circle was much rounder — well done. On the next one, try to keep your inside leg on a little more through the second half. Let's try it again — I think you'll feel the difference."

## Types of Learner

Riders learn in different ways. Visual learners benefit from demonstrations and watching others. Auditory learners respond well to verbal instructions and explanations. Kinaesthetic learners need to feel it — exercises, body positioning, and practice. Most people use a mix, but recognising a rider's primary learning style helps you communicate more effectively.

## Questioning Techniques

Questions develop thinking and understanding. Closed questions check facts: "Which leg should be on the inside of a canter circle?" Open questions develop thinking: "Why do you think the horse fell out of canter on that corner?" Guided questions lead to discovery: "What did you notice about your balance when the horse turned?" Use questions throughout the lesson, not just at the end.

## Tone and Body Language

Your tone of voice carries as much meaning as your words. Calm, encouraging, and clear tones build trust. Shouting creates anxiety. Your body language matters too — open, relaxed posture invites communication. Crossed arms and frustrated sighing shut it down. Remember: riders are watching you even when you do not think they are.`,
    keyPoints: [
      "Instructions must be short, specific, and timed so the rider can act on them",
      "Use the feedback sandwich: praise, one improvement point, encouragement",
      "Recognise different learning styles — visual, auditory, kinaesthetic — and adapt accordingly",
      "Use open and guided questions to develop riders' understanding, not just tell them what to do",
      "Tone and body language are as important as the words — stay calm, clear, and encouraging",
    ],
    safetyNote:
      "Never shout in anger at a rider — it creates anxiety, erodes trust, and can cause dangerous loss of concentration. If frustration builds, take a breath and reset. Safety-critical instructions should be given firmly and clearly, not in anger.",
    practicalApplication:
      "In your next coaching session, consciously practise the feedback sandwich for every piece of feedback you give. After the session, reflect on how many times you used open questions versus closed questions. Aim to increase your use of open questions next time.",
    commonMistakes: [
      "Giving too many corrections at once — riders can only process one thing at a time",
      "Only pointing out faults without acknowledging what is going well",
      "Using jargon the rider does not understand without explaining it",
      "Talking too much — sometimes silence allows the rider to feel and process",
      "Inconsistent tone — alternating between encouraging and frustrated confuses the rider",
    ],
    knowledgeCheck: [
      {
        question: "What is the 'feedback sandwich'?",
        options: [
          "A snack break during lessons",
          "Praise, constructive improvement point, encouragement",
          "Three criticisms in a row",
          "Only positive feedback with no correction",
        ],
        correctIndex: 1,
        explanation:
          "The feedback sandwich delivers constructive feedback within a supportive framework: genuine praise, one improvement point with a clear how-to, and an encouraging statement.",
      },
      {
        question: "Why are open questions valuable in coaching?",
        options: [
          "They test memory",
          "They develop the rider's thinking and understanding",
          "They save time",
          "They are not valuable",
        ],
        correctIndex: 1,
        explanation:
          "Open questions encourage riders to think, reflect, and develop understanding rather than just following instructions. This leads to deeper, more lasting learning.",
      },
    ],
    aiTutorPrompts: [
      "Can you give me examples of effective open questions for a riding lesson?",
      "How do I communicate with a very nervous adult rider?",
      "What feedback techniques work best for children versus adults?",
    ],
    linkedCompetencies: ["coaching_skills"],
  },
  {
    slug: "managing-groups-and-progression",
    pathwaySlug: "coaching-teaching-skills",
    title: "Managing Groups & Rider Progression",
    level: "advanced",
    category: "Coaching & Teaching Skills",
    sortOrder: 4,
    objectives: [
      "Manage group lessons safely and effectively with riders of varying abilities",
      "Plan a long-term progression pathway for individual riders",
      "Assess rider readiness for progression to the next level",
      "Handle common challenges: disruptive riders, anxious riders, and plateaus",
    ],
    content: `Managing groups and guiding riders' long-term progression are among the most challenging aspects of equestrian coaching. A well-managed group session develops every rider. A poorly managed one is chaotic, unsafe, and frustrating for everyone.

## Group Management Basics

In group lessons (typically 4–6 riders): establish clear rules from the first session (maintain safe distances, follow instructions immediately, halt when asked). Use arena management techniques: ride in open order where riders manage their own track, or use a ride (following the leader) format for less experienced groups. Always position yourself where you can see all riders.

## Differentiation in Group Lessons

Plan exercises that can be adjusted for different levels. Use cone work, polework, and school figures that offer natural differentiation. For example: "A and B ride a 20m circle at trot, C and D ride a 15m circle, E rides the 20m circle at walk." Everyone is working on circles, but at the appropriate level. Clear, calm organisation prevents confusion.

## Long-Term Progression Planning

Create a progression map for each rider: what they can do now, what they need to learn next, and what the goal is for the term or season. Progression should be systematic — building skills in a logical order. A rider who can maintain trot confidently is ready to learn canter. A rider who cannot steer at trot is not ready for jumping. Resist the temptation to progress riders too quickly under pressure from parents or the riders themselves.

## Assessing Readiness

A rider is ready for the next level when they can perform current-level skills consistently and without excessive effort. If walk-to-trot transitions are still effortful and unbalanced, the rider is not ready for canter. Assessment should be ongoing — not a one-off test — and should consider confidence as well as physical ability.

## Common Challenges

**Disruptive riders**: Set clear expectations privately. If behaviour continues, it must be addressed for the safety of the group. **Anxious riders**: Build trust gradually, never force progression, and celebrate small wins. **Plateaus**: Riders who feel stuck need variety and fresh challenges, not more of the same exercise. Change the approach, try a different exercise targeting the same skill, or set a new mini-goal to reignite motivation.`,
    keyPoints: [
      "Establish clear safety rules from the first group session and enforce them consistently",
      "Plan differentiated exercises so every rider works at their appropriate level",
      "Create a systematic progression map for each rider based on current ability and next steps",
      "Assess readiness based on consistent performance at the current level, including confidence",
      "Address common challenges (disruption, anxiety, plateaus) with specific, appropriate strategies",
    ],
    safetyNote:
      "In group lessons, safety is paramount. Maintain safe distances between horses. Never allow riders to ride too close behind another horse. Have an emergency stop plan and ensure all riders know the halt command.",
    practicalApplication:
      "For a rider you currently teach, create a term-long (10 lesson) progression plan. Identify where they are now, three milestone skills to achieve during the term, and the exercises you will use to get there. Review and adjust the plan after every third lesson.",
    commonMistakes: [
      "Allowing group dynamics to override safety — if a group is chaotic, stop and reorganise",
      "Progressing riders too quickly because they or their parents want faster results",
      "Teaching every group lesson the same way without adapting to the individuals present",
      "Ignoring quiet riders in the group while focusing on the most vocal or challenging",
      "Not keeping records of individual progress, making long-term planning impossible",
    ],
    knowledgeCheck: [
      {
        question:
          "How should you manage a group of riders with different ability levels?",
        options: [
          "Teach to the highest level and let others keep up",
          "Teach to the lowest level only",
          "Plan differentiated exercises where each rider works at their appropriate level",
          "Refuse to teach mixed groups",
        ],
        correctIndex: 2,
        explanation:
          "Differentiation allows every rider to work productively at their level. The same type of exercise (e.g., circles) can be adapted in size, pace, and complexity.",
      },
      {
        question:
          "How do you know when a rider is ready to progress to the next level?",
        options: [
          "When they ask to",
          "When they can perform current-level skills consistently with confidence",
          "After a set number of lessons",
          "When their parents request it",
        ],
        correctIndex: 1,
        explanation:
          "Readiness is based on consistent, confident performance at the current level. Rushing progression leads to gaps in skills and loss of confidence.",
      },
    ],
    aiTutorPrompts: [
      "How do I handle a group lesson where one rider is much weaker than the others?",
      "What does a typical progression plan look like for a beginner rider over six months?",
      "How do I motivate a rider who seems to have plateaued?",
    ],
    linkedCompetencies: ["coaching_skills", "welfare_awareness"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW LESSON UNITS — Handling & Groundwork, Nutrition & Feeding,
  // Equine Welfare & Ethics, plus pathway expansions
  // ═══════════════════════════════════════════════════════════════════════════

  {
    slug: "safe-approach-and-catching",
    pathwaySlug: "handling-groundwork",
    title: "Safe Approach & Catching",
    level: "beginner",
    category: "Handling & Groundwork",
    sortOrder: 1,
    objectives: [
      "Approach a horse safely in the stable and field",
      "Understand the horse's flight zone and how to work with it",
      "Catch a horse using a headcollar and lead rope correctly",
      "Recognise signs that a horse is reluctant to be caught",
    ],
    content: `Approaching and catching a horse correctly is the very first practical skill every equestrian must master. Horses are prey animals whose survival instincts are triggered by sudden movements or unfamiliar approaches.

## Approaching in the Stable

Always speak to the horse before entering the stable. Approach at the shoulder — never from directly behind. Keep your body language calm and your voice steady. Allow the horse to see and smell you before touching.

## Approaching in the Field

Walk towards the horse at an angle, not head-on. Avoid making prolonged direct eye contact as horses can interpret this as predatory behaviour. If the horse moves away, stop, turn slightly sideways, and wait.

## Using a Headcollar

Hold the headcollar open with the noseband ready. Approach from the left (near) side. Slide the noseband over the muzzle, then bring the headpiece behind the ears and fasten the buckle. You should be able to fit two fingers under the noseband.

## Dealing with a Difficult-to-Catch Horse

Never chase a horse — this confirms their fear response. Use a calm, patient approach. Carry a small treat as a positive association. In extreme cases, bring the horse into a smaller area first.`,
    keyPoints: [
      "Always speak to the horse before approaching or entering its space",
      "Approach at the shoulder, never directly from behind",
      "Walk at an angle in the field — avoid head-on body language",
      "Fit the headcollar correctly with the noseband over the muzzle first",
      "Never chase a horse that is difficult to catch",
    ],
    safetyNote:
      "Never wrap a lead rope around your hand or fingers. If a horse pulls away unexpectedly, you could be dragged.",
    practicalApplication:
      "Practise approaching and catching three different horses in the field. Note the differences in their responses.",
    commonMistakes: [
      "Approaching from directly behind — this is a blind spot",
      "Making sudden movements or loud noises when approaching",
      "Wrapping the lead rope around your hand",
      "Chasing a horse that moves away",
      "Putting the headcollar on incorrectly",
    ],
    knowledgeCheck: [
      {
        question:
          "From which direction should you approach a horse in the stable?",
        options: [
          "Directly from behind",
          "From the front",
          "At the shoulder",
          "From the right side only",
        ],
        correctIndex: 2,
        explanation:
          "Approaching at the shoulder allows the horse to see you clearly and is the safest position.",
      },
      {
        question:
          "What should you do if a horse moves away from you in the field?",
        options: [
          "Run after it",
          "Shout its name loudly",
          "Stop, turn slightly sideways, and wait",
          "Give up",
        ],
        correctIndex: 2,
        explanation:
          "Stopping and turning sideways reduces pressure and shows non-threatening body language.",
      },
    ],
    aiTutorPrompts: [
      "How do I catch a horse that always runs away?",
      "Why does my horse pin its ears when I approach?",
      "What is the correct way to fit a headcollar?",
    ],
    linkedCompetencies: ["safety_awareness", "groundwork_skills"],
  },

  {
    slug: "leading-and-turning",
    pathwaySlug: "handling-groundwork",
    title: "Leading & Turning Correctly",
    level: "beginner",
    category: "Handling & Groundwork",
    sortOrder: 2,
    objectives: [
      "Lead a horse safely in walk on a level surface",
      "Maintain correct positioning at the horse's shoulder",
      "Execute safe turns including turning away from the handler",
      "Understand how to lead past obstacles or through gateways",
    ],
    content: `Leading a horse correctly is a fundamental handling skill. The handler should walk level with the horse's shoulder on the left (near) side.

## Correct Position

Walk forward confidently. Look where you are going — not at the horse. Hold the lead rope in the right hand close to the headcollar with excess folded in the left hand — never coiled around the hand.

## Turning

When turning, always turn the horse away from you. If you are on the left side, turn the horse to the right. This keeps you safely on the outside of the turn.

## Leading Through Gateways

Open the gate fully before leading through. Position yourself between the gate and the horse. Never let the horse rush through.

## Stopping

Say "whoa" clearly, slow your own pace, and apply gentle backward pressure on the lead rope. The horse should stop beside you.`,
    keyPoints: [
      "Walk at the horse's shoulder on the near (left) side",
      "Hold the lead rope in the right hand near the headcollar",
      "Always turn the horse away from you for safety",
      "Open gates fully and maintain control when leading through",
      "Use voice commands and body language for transitions",
    ],
    safetyNote:
      "Never wrap the lead rope around your hand. If the horse spooks, you could be dragged or injured.",
    practicalApplication:
      "Practise leading a horse in walk, halting, and making three turns. Focus on keeping your position at the shoulder.",
    commonMistakes: [
      "Walking too far ahead of the horse",
      "Looking back at the horse constantly",
      "Turning the horse towards you",
      "Allowing the horse to rush through gateways",
      "Coiling the lead rope around the hand",
    ],
    knowledgeCheck: [
      {
        question:
          "When turning a horse while leading, which direction should you turn them?",
        options: [
          "Towards you",
          "Away from you",
          "It doesn't matter",
          "Always to the left",
        ],
        correctIndex: 1,
        explanation:
          "Turning the horse away from you keeps you on the outside of the turn.",
      },
      {
        question: "Where should you hold the excess lead rope?",
        options: [
          "Wrapped around your right hand",
          "Dragging on the ground",
          "Folded in your left hand",
          "Tied to the headcollar",
        ],
        correctIndex: 2,
        explanation:
          "The excess rope should be neatly folded in the left hand.",
      },
    ],
    aiTutorPrompts: [
      "My horse always walks too fast when I lead",
      "What should I do if a horse won't move when I try to lead it?",
      "How do I lead two horses at once safely?",
    ],
    linkedCompetencies: ["safety_awareness", "groundwork_skills"],
  },

  {
    slug: "tying-up-safely",
    pathwaySlug: "handling-groundwork",
    title: "Tying Up Safely",
    level: "beginner",
    category: "Handling & Groundwork",
    sortOrder: 3,
    objectives: [
      "Tie a quick-release knot correctly",
      "Choose appropriate tying locations and equipment",
      "Understand why baler twine breakpoints are used",
      "Handle a horse that pulls back when tied",
    ],
    content: `Tying a horse up safely is an essential everyday skill.

## The Quick-Release Knot

The quick-release knot is the only knot you should use. It can be undone instantly by pulling the free end. Loop the rope through the tie ring, create a bight, pass it through the loop, and tighten.

## Tying Height and Length

Tie at approximately the horse's eye level. The rope should be short enough that the horse cannot get a leg over it, but long enough for comfort — roughly 60-80cm.

## Baler Twine Breakpoints

Always tie to a piece of baler twine attached to a solid ring, not directly to a fixed ring. If the horse panics and pulls back, the baler twine breaks before the horse injures itself.

## Dealing with Horses That Pull Back

Never punish a horse for pulling back. Use a longer rope initially and stand nearby. Build confidence with short tying sessions.`,
    keyPoints: [
      "Always use a quick-release knot",
      "Tie at eye level with 60-80cm of rope",
      "Use baler twine as a breakpoint",
      "Never leave a tied horse unattended for long periods",
      "Build confidence gradually with horses that pull back",
    ],
    safetyNote:
      "Never tie a horse using the reins of a bridle. If the horse pulls back, it can injure its mouth.",
    practicalApplication:
      "Practise tying a quick-release knot 10 times until you can do it smoothly.",
    commonMistakes: [
      "Using a dead knot",
      "Tying the rope too long",
      "Tying directly to a solid object without baler twine",
      "Leaving a tied horse completely unattended",
      "Tying with the reins",
    ],
    knowledgeCheck: [
      {
        question: "Why should you always use baler twine when tying a horse?",
        options: [
          "It looks neater",
          "It acts as a breakpoint if the horse panics",
          "It's cheaper than rope",
          "It's tradition",
        ],
        correctIndex: 1,
        explanation:
          "Baler twine breaks under extreme force, preventing injury.",
      },
      {
        question: "What type of knot should you use?",
        options: [
          "A reef knot",
          "A bowline",
          "A quick-release knot",
          "A double knot",
        ],
        correctIndex: 2,
        explanation:
          "A quick-release knot can be undone instantly in emergencies.",
      },
    ],
    aiTutorPrompts: [
      "How to tie a quick-release knot step by step?",
      "My horse always pulls back when tied",
      "Is it safe to cross-tie a horse?",
    ],
    linkedCompetencies: ["safety_awareness", "groundwork_skills"],
  },

  {
    slug: "lungeing-basics",
    pathwaySlug: "handling-groundwork",
    title: "Lungeing Basics",
    level: "developing",
    category: "Handling & Groundwork",
    sortOrder: 4,
    objectives: [
      "Understand the purpose and benefits of lungeing",
      "Set up for lungeing with correct equipment",
      "Maintain a safe triangle position",
      "Control pace and direction on the lunge",
    ],
    content: `Lungeing is a groundwork technique where the horse works on a circle around the handler at the end of a lunge line.

## Equipment

You need a lunge line (8-10 metres), a lunge whip, a lunge cavesson or headcollar, and protective boots.

## The Triangle

The handler, horse, and lunge whip should form a triangle. The handler stands at the centre. The lunge line goes to the horse's head, and the whip points towards the hindquarters.

## Voice and Body Language

Use clear commands: "walk on", "trot", "whoa". Stepping ahead of the horse's shoulder slows them; stepping behind encourages forward movement.

## Starting and Stopping

Begin in walk. Ask for trot with voice and a gentle lift of the whip. To stop, lower the whip, say "whoa", and gently take up the lunge line.`,
    keyPoints: [
      "Lungeing is for exercise, training, warm-up, and movement assessment",
      "Equipment: lunge line, lunge whip, cavesson, protective boots",
      "Maintain the triangle: handler, horse, whip",
      "Use consistent voice commands",
      "Never wrap the lunge line around your hand",
    ],
    safetyNote:
      "Never wrap the lunge line around your hand or wrist. Hold the line in controlled folds.",
    practicalApplication:
      "Practise lungeing a calm horse in walk and trot on both reins for 10 minutes each side.",
    commonMistakes: [
      "Wrapping the lunge line around the hand",
      "Standing too close to the horse",
      "Using the whip aggressively",
      "Inconsistent voice commands",
      "Letting the circle become too small",
    ],
    knowledgeCheck: [
      {
        question: "What shape should handler, horse, and whip form?",
        options: ["A straight line", "A triangle", "A square", "A circle"],
        correctIndex: 1,
        explanation: "The triangle formation gives the best control.",
      },
      {
        question: "How should you hold the lunge line?",
        options: [
          "Wrapped around your hand",
          "In controlled folds",
          "Dragging on the ground",
          "Tied to your belt",
        ],
        correctIndex: 1,
        explanation: "Controlled folds keep the line managed safely.",
      },
    ],
    aiTutorPrompts: [
      "My horse keeps cutting in on the circle",
      "When should I introduce side reins?",
      "How long should a lungeing session last?",
    ],
    linkedCompetencies: ["groundwork_skills", "horse_care"],
  },

  {
    slug: "long-reining-introduction",
    pathwaySlug: "handling-groundwork",
    title: "Long-Reining Introduction",
    level: "intermediate",
    category: "Handling & Groundwork",
    sortOrder: 5,
    objectives: [
      "Understand the purpose of long-reining",
      "Set up equipment for basic long-reining",
      "Walk behind a horse safely while maintaining rein contact",
      "Guide a horse through simple turns and transitions",
    ],
    content: `Long-reining is an advanced groundwork technique where the handler works behind or to the side of the horse using two long reins.

## Purpose

Long-reining develops the horse's response to rein aids, straightness, and obedience without a rider's weight.

## Equipment Setup

Two long reins (7-8 metres each) attached to the bit rings or cavesson. The reins pass through the stirrups or surcingle rings back to the handler.

## Handler Position

Walk behind the horse at a safe distance. Maintain light, elastic contact similar to riding contact.

## Basic Exercises

Start in an enclosed arena. Walk on straight lines first. Gradually introduce gentle turns. Progress to halts and walk-to-halt transitions.`,
    keyPoints: [
      "Long-reining develops rein response and straightness from the ground",
      "Use two long reins through stirrups or surcingle",
      "Maintain light elastic contact",
      "Start with straight lines then simple turns",
      "Always work in an enclosed area",
    ],
    safetyNote:
      "Long-reining requires experience. Work under supervision. A horse unaccustomed to reins around its hindquarters may kick.",
    practicalApplication:
      "Under supervision, practise walking a trained horse in straight lines using long reins.",
    commonMistakes: [
      "Working a horse unfamiliar with reins around hindquarters",
      "Pulling on the reins instead of guiding",
      "Standing too close behind the horse",
      "Not working in an enclosed area",
      "Using equipment that is too long or short",
    ],
    knowledgeCheck: [
      {
        question: "What is the primary purpose of long-reining?",
        options: [
          "To tire the horse",
          "To develop rein response and straightness from the ground",
          "To replace riding entirely",
          "To teach jumping",
        ],
        correctIndex: 1,
        explanation:
          "Long-reining develops rein aids understanding and straightness without rider weight.",
      },
      {
        question: "Where should the long reins pass through?",
        options: [
          "Through the horse's legs",
          "Through the stirrup irons or surcingle rings",
          "Over the horse's back loosely",
          "Through the noseband",
        ],
        correctIndex: 1,
        explanation:
          "The reins pass through stirrups or surcingle rings for correct contact angle.",
      },
    ],
    aiTutorPrompts: [
      "How do I introduce long-reining to a young horse?",
      "What exercises improve straightness with long reins?",
      "Is long-reining suitable for all horses?",
    ],
    linkedCompetencies: ["groundwork_skills", "riding_position"],
  },

  {
    slug: "advanced-groundwork-exercises",
    pathwaySlug: "handling-groundwork",
    title: "Advanced Groundwork Exercises",
    level: "advanced",
    category: "Handling & Groundwork",
    sortOrder: 6,
    objectives: [
      "Use in-hand work to develop collection and engagement",
      "Understand lateral work from the ground",
      "Develop the horse's response to subtle body language cues",
      "Apply groundwork principles to rehabilitation",
    ],
    content: `Advanced groundwork goes beyond basic handling into training and rehabilitation.

## In-Hand Work for Collection

Using a bridle and short whip as an extension of the hand, the handler walks beside the horse asking for increased engagement of the hindquarters. This develops balance and self-carriage.

## Lateral Work from the Ground

Shoulder-in and travers can be introduced from the ground before the rider attempts them in the saddle, teaching the horse the movement pattern.

## Body Language Refinement

At advanced levels, the handler's body position, energy, and intention become primary communication tools.

## Rehabilitation Applications

Groundwork is invaluable for horses returning from injury. Controlled in-hand work allows targeted muscle development without the strain of carrying a rider.`,
    keyPoints: [
      "Advanced groundwork includes in-hand work for collection and lateral exercises",
      "Shoulder-in and travers can be taught from the ground first",
      "Body language becomes primary communication at advanced levels",
      "Groundwork is essential for rehabilitation",
      "Classical in-hand work develops self-carriage",
    ],
    safetyNote:
      "Advanced groundwork requires an experienced handler and well-established basic groundwork.",
    practicalApplication:
      "Under expert supervision, practise asking a schooled horse for three steps of shoulder-in from the ground.",
    commonMistakes: [
      "Attempting advanced exercises before basics are solid",
      "Over-using the whip",
      "Working for too long",
      "Not recognising confusion vs resistance",
      "Ignoring the horse's physical condition",
    ],
    knowledgeCheck: [
      {
        question: "Why is groundwork valuable for rehabilitation?",
        options: [
          "It's easier than riding",
          "It allows controlled exercise without rider weight",
          "It doesn't require equipment",
          "Horses prefer it",
        ],
        correctIndex: 1,
        explanation:
          "Groundwork allows targeted exercise without the strain of carrying a rider.",
      },
      {
        question: "What is the foundation of classical in-hand work?",
        options: [
          "Speed",
          "Jumping",
          "Developing collection and engagement of the hindquarters",
          "Lunging",
        ],
        correctIndex: 2,
        explanation:
          "Classical in-hand work focuses on engaging the hindquarters for balance and collection.",
      },
    ],
    aiTutorPrompts: [
      "How do I start teaching shoulder-in from the ground?",
      "What groundwork exercises help tendon recovery?",
      "How does in-hand work relate to ridden collection?",
    ],
    linkedCompetencies: ["groundwork_skills", "horse_care"],
  },

  {
    slug: "understanding-equine-digestion",
    pathwaySlug: "nutrition-feeding",
    title: "Understanding Equine Digestion",
    level: "beginner",
    category: "Nutrition & Feeding",
    sortOrder: 1,
    objectives: [
      "Describe the basic structure of the horse's digestive system",
      "Understand why horses must eat little and often",
      "Identify the role of the hindgut in fibre digestion",
      "Recognise the link between feeding management and colic",
    ],
    content: `The horse's digestive system is designed for continuous grazing on fibrous forage.

## Stomach

The horse's stomach is surprisingly small — approximately the size of a rugby ball. It should never be completely empty, as stomach acid is produced continuously. This is why horses must have access to forage for most of the day.

## Small Intestine

The small intestine handles digestion and absorption of proteins, fats, sugars, and some starches.

## Hindgut

The hindgut is where fibre is fermented by a microbial population that may be disrupted by abrupt dietary change. Any change to feed, forage or routine must follow an individual plan agreed with the responsible person and, where needed, a qualified nutrition or veterinary professional.

## Colic Awareness

Colic can be an emergency. Support a consistent, individually appropriate feeding and forage plan, maintain access to clean water, record relevant changes, and contact the veterinary professional promptly if abdominal-pain signs or other concerns are observed.`,
    keyPoints: [
      "The horse's stomach is small — designed for little and often",
      "The hindgut ferments fibre using sensitive microbial populations",
      "Sudden diet changes can cause colic",
      "Any dietary change must follow an individual, professionally informed plan rather than a universal timetable",
      "Constant forage access is essential",
    ],
    safetyNote:
      "Colic is a veterinary emergency. If a horse shows signs of abdominal pain, call the vet immediately.",
    practicalApplication:
      "Observe the feeding routine at your yard for one week. Note forage access and any feed changes.",
    commonMistakes: [
      "Feeding large meals infrequently",
      "Making sudden feed changes",
      "Leaving horses without forage",
      "Over-feeding concentrates",
      "Not providing clean fresh water",
    ],
    knowledgeCheck: [
      {
        question: "Why must horses eat little and often?",
        options: [
          "They are greedy",
          "Their stomach is small and produces acid continuously",
          "They prefer it",
          "It's cheaper",
        ],
        correctIndex: 1,
        explanation:
          "The horse's small stomach and continuous acid production require frequent small meals.",
      },
      {
        question: "How should a change to feed or forage be managed?",
        options: [
          "Use the same timetable for every horse",
          "Make the change immediately so the horse gets used to it",
          "Follow an individual plan agreed with the responsible person and qualified professional where needed",
          "Change several feeding factors at once so results are faster",
        ],
        correctIndex: 2,
        explanation:
          "Horses and circumstances differ. Feeding changes require an individual approach, records and appropriate professional input rather than a copied universal schedule.",
      },
    ],
    aiTutorPrompts: [
      "Why do horses get colic?",
      "How does the horse's digestive system differ from a human's?",
      "What happens if a horse doesn't have enough forage?",
    ],
    linkedCompetencies: ["nutrition_knowledge", "horse_care"],
  },

  {
    slug: "types-of-feed",
    pathwaySlug: "nutrition-feeding",
    title: "Types of Feed",
    level: "beginner",
    category: "Nutrition & Feeding",
    sortOrder: 2,
    objectives: [
      "Identify common types of horse feed",
      "Understand the difference between forage and hard feed",
      "Recognise when supplementary feeding is needed",
      "Describe the importance of quality control in feed",
    ],
    content: `Horse feed falls into two broad categories: forage and concentrates.

## Forage

Hay is dried grass. Good hay should smell sweet, feel dry, and be free of dust and mould. Haylage is semi-dried wrapped grass — more palatable but higher in energy. Grass is the most natural forage.

## Concentrates

Concentrates include cubes, coarse mixes, and straights (oats, barley, sugar beet). These supplement the diet for horses in work or needing extra calories.

## Chaff

Chaff (chopped hay or straw) is added to hard feeds to slow eating and encourage chewing, promoting better digestion.

## Quality Control

Always check feed for mould, dust, or unusual smells. Store in dry, rodent-proof containers. Check use-by dates.`,
    keyPoints: [
      "Forage should form the majority of every horse's diet",
      "Concentrates are supplementary",
      "Chaff slows eating and improves digestion",
      "Always check feed quality",
      "Store feed properly",
    ],
    safetyNote:
      "Dusty or mouldy hay causes serious respiratory conditions. Always inspect before feeding.",
    practicalApplication:
      "Identify five different types of feed at your yard and categorise each.",
    commonMistakes: [
      "Overfeeding concentrates",
      "Feeding dusty hay",
      "Not storing feed properly",
      "Assuming all horses need hard feed",
      "Feeding rich haylage to laminitis-prone horses",
    ],
    knowledgeCheck: [
      {
        question: "What should form the majority of a horse's diet?",
        options: ["Concentrates", "Forage", "Supplements", "Treats"],
        correctIndex: 1,
        explanation: "Forage should always be the bulk of the diet.",
      },
      {
        question: "Why is chaff added to hard feed?",
        options: [
          "Better taste",
          "Cheaper",
          "To slow eating and improve digestion",
          "To add colour",
        ],
        correctIndex: 2,
        explanation:
          "Chaff encourages chewing and saliva production for better digestion.",
      },
    ],
    aiTutorPrompts: [
      "What's the difference between hay and haylage?",
      "How do I know if my horse needs hard feed?",
      "What are the signs of poor-quality hay?",
    ],
    linkedCompetencies: ["nutrition_knowledge", "horse_care"],
  },

  {
    slug: "feeding-routines-and-rules",
    pathwaySlug: "nutrition-feeding",
    title: "Feeding Routines & Rules",
    level: "beginner",
    category: "Nutrition & Feeding",
    sortOrder: 3,
    objectives: [
      "List the golden rules of feeding",
      "Establish a consistent feeding routine",
      "Understand feeding before and after exercise",
      "Weigh feed correctly using scales",
    ],
    content: `Consistent feeding routines should be based on the individual horse’s current written feeding plan, workload, condition, management and professional advice.
## The Golden Rules
1. Provide an individually appropriate forage-led plan  2. Feed by weight, not volume  3. Record and manage dietary changes through the agreed individual plan  4. Keep accurate feeding records  5. Ensure access to clean water  6. Review the plan when workload, condition, health, forage or management changes
## Weighing Feed
A scoop of one feed can weigh differently from a scoop of another. Use suitable scales and the current individual plan rather than estimating by volume.
## Exercise and Feeding
Plan feeding and exercise around the individual horse and current professional advice. Do not apply a copied interval or make abrupt changes before or after work.`,
    keyPoints: [
      "Feed little and often with plenty of forage",
      "Always weigh feed",
      "Manage dietary changes through the documented individual plan rather than a universal timetable",
      "Keep current, accurate feeding records",
      "Plan feed and exercise around the individual horse and current professional advice",
    ],
    safetyNote:
      "Riding immediately after a large feed can cause discomfort or colic.",
    practicalApplication:
      "Weigh out the feed for one horse using scales. Compare this to a level scoop.",
    commonMistakes: [
      "Feeding by scoop volume instead of weight",
      "Inconsistent feeding times",
      "Riding immediately after feeding",
      "Too much hard feed, not enough forage",
      "No fresh water at feeding time",
    ],
    knowledgeCheck: [
      {
        question: "Why should you weigh feed rather than use scoops?",
        options: [
          "It's more traditional",
          "Different feeds weigh differently per scoop",
          "It's faster",
          "Horses prefer it",
        ],
        correctIndex: 1,
        explanation: "A scoop of oats weighs differently to a scoop of cubes.",
      },
      {
        question: "How should feeding and exercise be planned?",
        options: [
          "Use the same interval for every horse",
          "Follow the documented individual plan and current professional advice",
          "Make a last-minute change whenever a horse seems energetic",
          "Ignore the workload and management context",
        ],
        correctIndex: 1,
        explanation:
          "Feeding and exercise planning is individual. A lesson should not substitute a fixed generic interval for the horse’s current plan and appropriate professional input.",
      },
    ],
    aiTutorPrompts: [
      "What are the golden rules of feeding?",
      "How much hay per day?",
      "How to create a feeding routine?",
    ],
    linkedCompetencies: ["nutrition_knowledge", "horse_care"],
  },

  {
    slug: "balancing-a-diet",
    pathwaySlug: "nutrition-feeding",
    title: "Balancing a Diet",
    level: "developing",
    category: "Nutrition & Feeding",
    sortOrder: 4,
    objectives: [
      "Understand basic nutritional needs",
      "Assess body condition using scoring",
      "Adjust feed to match workload",
      "Recognise signs of imbalance",
    ],
    content: `A balanced diet provides the correct amount of energy, protein, fibre, vitamins, and minerals.

## Body Condition Scoring

Use the 0-5 system. Score 0 is emaciated; 5 is obese. Ideal for most riding horses is 2.5-3. Check neck crest, ribs, spine, and quarters.

## Energy Requirements

Energy needs increase with workload. Most leisure horses thrive on good forage alone. Over-feeding energy leads to weight gain and behavioural issues.

## Signs of Imbalance

A dull coat, poor hoof quality, weight changes, lethargy, or behavioural changes can indicate dietary imbalance. Consult an equine nutritionist if in doubt.`,
    keyPoints: [
      "Assess body condition regularly using the 0-5 system",
      "Most leisure horses thrive on forage alone",
      "Energy needs increase with workload",
      "Signs of poor nutrition include dull coat and weight changes",
      "Consult an equine nutritionist for complex needs",
    ],
    safetyNote:
      "Overweight horses are at serious risk of laminitis. Monitor body condition closely.",
    practicalApplication:
      "Condition score three horses at your yard using the 0-5 system.",
    commonMistakes: [
      "Over-feeding treats without accounting for them",
      "Assuming thin horses always need more hard feed",
      "Not scoring regularly",
      "Feeding the same ration year-round",
      "Relying on visual assessment alone",
    ],
    knowledgeCheck: [
      {
        question: "Ideal body condition score for riding horses?",
        options: ["0-1", "2.5-3", "4-5", "It doesn't matter"],
        correctIndex: 1,
        explanation: "2.5-3 on the 0-5 scale indicates a healthy weight.",
      },
      {
        question: "What can a dull coat indicate?",
        options: [
          "Needs a bath",
          "Possible dietary imbalance",
          "The horse is cold",
          "Nothing",
        ],
        correctIndex: 1,
        explanation:
          "A dull coat is often a first sign of nutritional deficiency.",
      },
    ],
    aiTutorPrompts: [
      "How do I body condition score a horse?",
      "My horse is overweight — what should I change?",
      "What vitamins and minerals does my horse need?",
    ],
    linkedCompetencies: ["nutrition_knowledge", "health_awareness"],
  },

  {
    slug: "feeding-for-workload",
    pathwaySlug: "nutrition-feeding",
    title: "Feeding for Workload & Condition",
    level: "intermediate",
    category: "Nutrition & Feeding",
    sortOrder: 5,
    objectives: [
      "Explain why workload, season and management need an individual nutrition review",
      "Recognise observations that should be recorded for a qualified nutrition or veterinary professional",
      "Understand that young, older, working and retired horses may have different individual needs",
      "Use a written feeding record without independently prescribing a ration",
    ],
    content: `Feeding must reflect the individual horse’s body condition, forage, work, health, dental status, environment and current professional advice. A lesson cannot prescribe a ration, feeding interval, pre-exercise meal or supplement plan for every horse.

## Workload and Condition

Record the horse’s actual work, behaviour, appetite, water intake, droppings and body-condition observations using the yard’s approved process. A change in perceived energy or condition may have many causes; discuss it with the responsible person and an appropriate qualified nutrition or veterinary professional before changing the diet.

## Seasonal and Management Changes

Grass availability, forage quality, weather, turnout, travel and stabling can all change the feeding plan. Any seasonal change should be planned gradually within the horse’s individual nutrition and veterinary guidance. Do not assume that a generic forage, concentrate, muzzle, supplement or grazing change is suitable.

## Different Horses, Individual Plans

Young, older, working, retired and competition horses can have different requirements, but category alone does not determine a safe diet. Oral health, disease, growth, workload, forage analysis and management all need professional consideration. Keep accurate records and ask the qualified professional who knows the horse to explain the purpose of any approved change.`,
    keyPoints: [
      "Workload and condition observations should be recorded before any diet change is considered",
      "Seasonal feeding changes belong in the individual nutrition and veterinary plan",
      "Young, older, working and retired horses may have different needs, but category is not a ration",
      "Base every feeding decision on the individual horse and qualified professional guidance",
      "Do not introduce electrolytes, supplements or feed changes without an informed review",
    ],
    safetyNote:
      "Do not independently increase, restrict or time feeds, supplements or electrolytes in response to workload. Record observations and seek qualified nutrition or veterinary guidance before changing the individual plan.",
    practicalApplication:
      "With the responsible person, practise completing a factual feeding and workload record for review by the qualified professional who manages the horse’s nutrition plan.",
    commonMistakes: [
      "Copying a ration or supplement plan from a horse with different needs",
      "Changing feed because of one observation without reviewing the individual plan",
      "Ignoring seasonal, forage or workload changes that should be recorded",
      "Assuming a horse category determines its diet without professional assessment",
      "Failing to record changes and seek qualified review",
    ],
    knowledgeCheck: [
      {
        question:
          "What is the appropriate response to a change in a horse’s workload, condition or forage availability?",
        options: [
          "Record the change and review the individual nutrition plan with qualified guidance",
          "Copy a generic ration from another horse",
          "Make a large unrecorded feed change immediately",
          "Assume that season alone determines the diet",
        ],
        correctIndex: 0,
        explanation:
          "Dietary needs are individual. Record the relevant observations and obtain qualified nutrition or veterinary guidance before changing the plan.",
      },
      {
        question:
          "Why should feeding decisions for young, older or competition horses be individually reviewed?",
        options: [
          "Category alone does not account for health, oral status, forage, workload and management",
          "All horses in one category need the same ration",
          "The highest-energy feed is always appropriate for working horses",
          "Age or activity makes professional review unnecessary",
        ],
        correctIndex: 0,
        explanation:
          "Age and activity can influence needs, but the individual horse’s health, forage, management and professional plan determine safe feeding decisions.",
      },
    ],
    aiTutorPrompts: [
      "What observations should I record before asking for a qualified review of a competition horse’s nutrition plan?",
      "What factors should a qualified professional consider for a retired horse’s feeding plan?",
      "When should a perceived energy or condition change be reviewed by a nutrition or veterinary professional?",
    ],
    linkedCompetencies: ["nutrition_knowledge", "horse_care"],
  },

  {
    slug: "supplements-and-special-diets",
    pathwaySlug: "nutrition-feeding",
    title: "Supplements & Special Diets",
    level: "advanced",
    category: "Nutrition & Feeding",
    sortOrder: 6,
    objectives: [
      "Understand when supplements are appropriate",
      "Manage diets for metabolic conditions",
      "Apply electrolyte and hydration knowledge",
      "Critically evaluate feed marketing claims",
    ],
    content: `At advanced levels, nutrition management includes supplements, metabolic conditions, and critical evaluation of feeding advice.

## Supplements

Common categories: joint support (glucosamine, MSM), hoof supplements (biotin), calmers, and vitamin/mineral balancers. Always check for nutrient overlap with existing feed.

## Metabolic Conditions

EMS and PPID (Cushing's) require strict low-sugar, low-starch diets. Soak hay to reduce sugar. Manage grazing carefully.

## Electrolytes

Horses lose electrolytes through sweat. Competition horses need supplementation. Dissolve in water or add to damp feed — never give dry.

## Critical Evaluation

Learn to read feed labels, understand guaranteed analysis, and consult independent nutritionists.`,
    keyPoints: [
      "Supplements should address genuine gaps",
      "EMS and PPID need strict low-sugar diets",
      "Electrolytes are essential for hard work in heat",
      "Read feed labels critically",
      "Consult independent equine nutritionists",
    ],
    safetyNote:
      "Feeding inappropriate supplements can cause toxicity or imbalance.",
    practicalApplication:
      "Read the labels of three different horse feeds. Compare protein, fibre, and energy content.",
    commonMistakes: [
      "Adding multiple supplements without checking overlap",
      "Feeding high-sugar feeds to metabolic horses",
      "Giving dry electrolytes",
      "Believing all marketing claims",
      "Over-supplementing young healthy horses",
    ],
    knowledgeCheck: [
      {
        question: "What dietary management for a horse with EMS?",
        options: [
          "High-protein diet",
          "Low-sugar, low-starch diet with managed grazing",
          "Unlimited rich pasture",
          "Double the hard feed",
        ],
        correctIndex: 1,
        explanation:
          "EMS horses are insulin resistant and need strict sugar/starch control.",
      },
      {
        question: "When are electrolyte supplements most needed?",
        options: [
          "In winter",
          "During rest days",
          "During hard work or hot weather",
          "When the horse won't eat",
        ],
        correctIndex: 2,
        explanation:
          "Electrolytes lost through sweat must be replaced during heavy sweating.",
      },
    ],
    aiTutorPrompts: [
      "How to manage diet for a horse with Cushing's?",
      "Are joint supplements actually effective?",
      "How to read and understand a feed label?",
    ],
    linkedCompetencies: ["nutrition_knowledge", "health_awareness"],
  },

  {
    slug: "five-freedoms-of-animal-welfare",
    pathwaySlug: "equine-welfare-ethics",
    title: "Five Freedoms of Animal Welfare",
    level: "beginner",
    category: "Equine Welfare & Ethics",
    sortOrder: 1,
    objectives: [
      "List and explain the Five Freedoms",
      "Apply them to everyday horse management",
      "Identify situations where freedoms are compromised",
      "Understand the moral responsibility of ownership",
    ],
    content: `The Five Freedoms form the foundation of animal welfare assessment worldwide.

## The Five Freedoms

1. Freedom from Hunger and Thirst  2. Freedom from Discomfort  3. Freedom from Pain, Injury, or Disease  4. Freedom to Express Normal Behaviour  5. Freedom from Fear and Distress

## Applying to Horse Care

Every decision should consider these freedoms. Is the horse warm enough? Does it have friends? Is it in pain? Does it have enough to eat and drink?

## Recognising Compromise

Welfare compromise can be subtle. A horse standing alone without shelter may appear fine but is actually denied comfort and social behaviour.`,
    keyPoints: [
      "The Five Freedoms are the foundation of welfare assessment",
      "Every management decision should be evaluated against them",
      "Welfare compromise can be subtle",
      "Horses need social contact, space, shelter, and appropriate diet",
      "Ownership carries moral obligation",
    ],
    safetyNote:
      "If you see a horse in clear distress, contact the RSPCA or World Horse Welfare.",
    practicalApplication:
      "Assess a horse at your yard against all Five Freedoms. Identify improvement areas.",
    commonMistakes: [
      "Assuming welfare only concerns food and water",
      "Keeping horses isolated",
      "Ignoring low-grade pain",
      "Not providing adequate shelter",
      "Focusing only on physical needs",
    ],
    knowledgeCheck: [
      {
        question: "Which is NOT one of the Five Freedoms?",
        options: [
          "Freedom from hunger",
          "Freedom to express normal behaviour",
          "Freedom to compete in shows",
          "Freedom from pain",
        ],
        correctIndex: 2,
        explanation: "Competition is not a welfare right.",
      },
      {
        question: "A horse is kept alone. Which freedom is compromised?",
        options: [
          "Freedom from hunger",
          "Freedom from fear",
          "Freedom to express normal behaviour",
          "Freedom from disease",
        ],
        correctIndex: 2,
        explanation:
          "Horses are herd animals. Isolation prevents normal social behaviour.",
      },
    ],
    aiTutorPrompts: [
      "How do the Five Freedoms apply to stabled horses?",
      "What does good welfare look like?",
      "What should I do if I see a neglected horse?",
    ],
    linkedCompetencies: ["welfare_awareness", "horse_care"],
  },

  {
    slug: "responsible-horse-ownership",
    pathwaySlug: "equine-welfare-ethics",
    title: "Responsible Horse Ownership",
    level: "beginner",
    category: "Equine Welfare & Ethics",
    sortOrder: 2,
    objectives: [
      "Understand the commitments of horse ownership",
      "Recognise the lifetime responsibility",
      "Identify key welfare obligations",
      "Consider ethical alternatives to ownership",
    ],
    content: `Owning a horse is a significant long-term commitment that can extend across changing health, welfare, financial and care needs.

## Financial Commitment

Costs can include livery, feed, hoof-care and veterinary professional services, dental care, insurance, tack and transport. The necessary frequency, scope and cost vary by horse, location, current professional advice and the arrangement in place. Unexpected costs can be substantial.

## Time Commitment

Horses need daily care regardless of weather, holidays, or personal circumstances.

## Lifetime Responsibility

When you take on a horse, you commit to its entire life — including old age and end-of-life care.

## Alternatives to Ownership

Sharing or loaning allows enjoyment without full financial commitment. Always use written agreements.`,
    keyPoints: [
      "Horse ownership requires a long-term, welfare-led commitment that can change over the horse’s lifetime",
      "Costs include farrier, vet, feed, livery, insurance, and emergencies",
      "Daily care needed regardless of circumstances",
      "Sharing or loaning are ethical alternatives",
      "Welfare must come before convenience",
    ],
    safetyNote: "Never take on a horse if you cannot provide for its needs.",
    practicalApplication:
      "Calculate the estimated monthly and annual cost of keeping a horse at your yard.",
    commonMistakes: [
      "Under-estimating costs",
      "Not considering long-term commitment",
      "No emergency fund",
      "Buying on impulse",
      "No plan for holidays or illness",
    ],
    knowledgeCheck: [
      {
        question:
          "What should a prospective owner plan for before taking responsibility for a horse?",
        options: [
          "Only the first few months, because later needs can be ignored",
          "A long-term welfare, financial, care and contingency commitment that can change over the horse’s lifetime",
          "Only the purchase price and routine feed",
          "A standard service timetable that will be identical for every horse",
        ],
        correctIndex: 1,
        explanation:
          "Responsible ownership requires a realistic long-term plan, current professional care, contingency arrangements and welfare-led decision-making. There is no single lifespan or service calendar that safely applies to every horse.",
      },
      {
        question: "What is a responsible alternative to ownership?",
        options: [
          "Abandoning when costs get high",
          "Sharing or loaning with a written agreement",
          "Selling every year",
          "Keeping without vet care to save money",
        ],
        correctIndex: 1,
        explanation:
          "Sharing or loaning allows responsible enjoyment without full commitment.",
      },
    ],
    aiTutorPrompts: [
      "How much does it cost to own a horse per year in the UK?",
      "What should I include in a loan agreement?",
      "What do I do when my horse gets old?",
    ],
    linkedCompetencies: ["welfare_awareness", "horse_care"],
  },

  {
    slug: "recognising-neglect-and-abuse",
    pathwaySlug: "equine-welfare-ethics",
    title: "Recognising Neglect & Abuse",
    level: "developing",
    category: "Equine Welfare & Ethics",
    sortOrder: 3,
    objectives: [
      "Identify signs of neglect",
      "Distinguish between abuse and poor management",
      "Know who to contact for welfare concerns",
      "Understand legal and moral obligations",
    ],
    content: `Recognising neglect or abuse is a critical welfare skill.

## Signs of Neglect

Poor body condition, overgrown hooves, matted or lice-infested coat, no access to clean water, no shelter, or untreated injuries.

## Signs of Abuse

Deliberate physical harm, excessive force during training, riding a clearly lame horse, or using equipment that causes pain.

## Reporting Concerns

Contact the RSPCA, World Horse Welfare, or the Blue Cross. Provide specific details: location, description, what you observed.

## Your Responsibility

Under the Animal Welfare Act 2006, every owner has a legal duty of care. Reporting concerns is responsible, not interfering.`,
    keyPoints: [
      "Signs include poor body condition, overgrown hooves, untreated illness",
      "Abuse includes deliberate harm and misuse of equipment",
      "Contact RSPCA or World Horse Welfare to report",
      "Provide specific factual details",
      "Under the Animal Welfare Act 2006, owners have a legal duty of care",
    ],
    safetyNote:
      "Do not confront a suspected abuser directly. Report to welfare organisations.",
    practicalApplication:
      "Learn the contact details for your local equine welfare organisation.",
    commonMistakes: [
      "Assuming someone else will report",
      "Not recognising subtle neglect",
      "Confusing breed type with neglect",
      "Confronting owners directly",
      "Not documenting what you see",
    ],
    knowledgeCheck: [
      {
        question: "What should you do if you suspect neglect?",
        options: [
          "Ignore it",
          "Confront the owner aggressively",
          "Report to a welfare organisation with specific details",
          "Post on social media",
        ],
        correctIndex: 2,
        explanation:
          "Reporting to a welfare organisation allows professional investigation.",
      },
      {
        question: "Which UK law requires a duty of care for horses?",
        options: [
          "The Horse Act 1998",
          "The Animal Welfare Act 2006",
          "The Countryside Act 2000",
          "There is no such law",
        ],
        correctIndex: 1,
        explanation:
          "The Animal Welfare Act 2006 places a legal duty of care on animal owners.",
      },
    ],
    aiTutorPrompts: [
      "What are early warning signs of neglect?",
      "How to report a welfare concern in the UK?",
      "What is the Animal Welfare Act?",
    ],
    linkedCompetencies: ["welfare_awareness", "health_awareness"],
  },

  {
    slug: "welfare-legislation-uk",
    pathwaySlug: "equine-welfare-ethics",
    title: "Welfare Legislation (UK)",
    level: "developing",
    category: "Equine Welfare & Ethics",
    sortOrder: 4,
    objectives: [
      "Understand the Animal Welfare Act 2006",
      "Know legal requirements for horse identification",
      "Understand duty of care and offences",
      "Recognise the role of welfare organisations",
    ],
    content: `The primary UK legislation is the Animal Welfare Act 2006.

## Animal Welfare Act 2006

It makes it an offence to cause unnecessary suffering, and places a positive duty of care on owners. Five needs must be met: environment, diet, normal behaviour, appropriate housing, and protection from pain and disease.

## Horse Passports

All UK horses must have a passport with identification details, microchip number, and vaccination records.

## Enforcement

Local authorities and the RSPCA enforce the Act. Offences can result in fines, disqualification, or imprisonment.`,
    keyPoints: [
      "The Animal Welfare Act 2006 is the key UK legislation",
      "Owners must meet five welfare needs",
      "All UK horses must have a passport and microchip",
      "Offences can lead to fines, bans, or imprisonment",
      "Duty of care applies to anyone with a horse in their charge",
    ],
    safetyNote:
      "Buying or selling a horse without a valid passport is illegal.",
    practicalApplication:
      "Check the passport of a horse at your yard for microchip number and vaccination records.",
    commonMistakes: [
      "Assuming legislation only applies to owners",
      "Not keeping passports updated",
      "Ignoring duty of care for others' horses",
      "Not understanding that causing suffering can be an offence even without intent",
      "Failing to microchip horses",
    ],
    knowledgeCheck: [
      {
        question: "What does the Animal Welfare Act 2006 require?",
        options: [
          "Ride the horse regularly",
          "Meet five specific welfare needs",
          "Keep the horse in a stable",
          "Compete the horse",
        ],
        correctIndex: 1,
        explanation: "The Act requires five welfare needs to be met.",
      },
      {
        question: "Who has a duty of care under the Act?",
        options: [
          "Only the registered owner",
          "Only vets",
          "Anyone responsible for an animal",
          "Only professional breeders",
        ],
        correctIndex: 2,
        explanation:
          "The duty applies to any person responsible for an animal.",
      },
    ],
    aiTutorPrompts: [
      "What happens if I break the Animal Welfare Act?",
      "Do I need a passport for my horse?",
      "What are the five welfare needs under UK law?",
    ],
    linkedCompetencies: ["welfare_awareness"],
  },

  {
    slug: "ethical-training-methods",
    pathwaySlug: "equine-welfare-ethics",
    title: "Ethical Training Methods",
    level: "intermediate",
    category: "Equine Welfare & Ethics",
    sortOrder: 5,
    objectives: [
      "Distinguish ethical and unethical training",
      "Understand learning theory for horses",
      "Recognise signs of mental distress during training",
      "Apply welfare-first principles",
    ],
    content: `Training methods directly impact a horse's welfare. We must use ethical, evidence-based methods.

## Learning Theory

Positive reinforcement: adding something pleasant. Negative reinforcement: removing pressure when the horse responds correctly. Positive punishment: adding something unpleasant (generally unethical). Negative punishment: removing something pleasant.

## Ethical Practice

Relies on negative reinforcement (correct pressure-release timing) and positive reinforcement. Avoids excessive force and fear.

## Signs of Mental Distress

Teeth grinding, excessive sweating, tail swishing, white around the eyes, tension, or complete shutdown (learned helplessness).

## Welfare-First Principle

If a method causes fear, pain, or distress, it is not acceptable.`,
    keyPoints: [
      "Ethical training uses reinforcement, not punishment",
      "Excessive force and fear-based methods are unethical",
      "Signs of distress include teeth grinding and learned helplessness",
      "Good timing of pressure-release is foundational",
      "If a method causes fear, pain, or distress, it is not acceptable",
    ],
    safetyNote:
      "A horse trained with fear-based methods can become unpredictable and dangerous.",
    practicalApplication:
      "Watch a training session and identify which learning quadrants are being used.",
    commonMistakes: [
      "Using punishment because it appears to work quickly",
      "Poor timing of pressure-release",
      "Not recognising learned helplessness",
      "Escalating force when the horse is confused",
      "Ignoring emotional state during training",
    ],
    knowledgeCheck: [
      {
        question: "What is negative reinforcement?",
        options: [
          "Punishing the horse",
          "Removing pressure when the horse responds correctly",
          "Ignoring the horse",
          "Using treats",
        ],
        correctIndex: 1,
        explanation:
          "Removing an aversive stimulus when the horse responds correctly.",
      },
      {
        question: "What might learned helplessness look like?",
        options: [
          "Energetic responsive behaviour",
          "A shut-down horse that has stopped trying",
          "Excited bucking",
          "Curiosity",
        ],
        correctIndex: 1,
        explanation:
          "Learned helplessness occurs when a horse gives up because nothing it does makes discomfort stop.",
      },
    ],
    aiTutorPrompts: [
      "What does ethical horse training look like?",
      "How can I tell if my horse is stressed during training?",
      "What is learned helplessness?",
    ],
    linkedCompetencies: ["welfare_awareness", "coaching_skills"],
  },

  {
    slug: "end-of-life-decisions",
    pathwaySlug: "equine-welfare-ethics",
    title: "End of Life Decisions & Retirement",
    level: "advanced",
    category: "Equine Welfare & Ethics",
    sortOrder: 6,
    objectives: [
      "Understand ethical end-of-life considerations",
      "Know options: retirement, rehoming, euthanasia",
      "Recognise when quality of life is unacceptable",
      "Handle end-of-life with dignity",
    ],
    content: `End-of-life decisions are among the most difficult an equestrian faces.

## Quality of Life Assessment

Is the horse in chronic pain? Can it move comfortably? Does it enjoy eating and socialising? Is its condition deteriorating despite treatment?

## Retirement

Retired horses still need farrier, dental, vet care, social contact, and appropriate diet.

## Rehoming

Responsible rehoming through reputable organisations protects the horse.

## Euthanasia

When quality of life cannot be maintained, euthanasia is the kindest option. It should be performed by a vet and can be done at home.`,
    keyPoints: [
      "Quality of life is the primary consideration",
      "Retirement still requires full ongoing care",
      "Responsible rehoming through reputable organisations",
      "Euthanasia is compassionate when quality of life fails",
      "These decisions should involve veterinary advice",
    ],
    safetyNote:
      "Never delay euthanasia when a horse is clearly suffering. The horse's welfare comes before human emotion.",
    practicalApplication:
      "Discuss with your vet what a quality-of-life assessment involves.",
    commonMistakes: [
      "Delaying because of emotional attachment",
      "Rehoming without proper vetting",
      "Assuming retirement needs no care",
      "Not discussing with a vet until emergency",
      "Passing elderly horses from owner to owner",
    ],
    knowledgeCheck: [
      {
        question:
          "What should be the primary consideration in end-of-life decisions?",
        options: [
          "Owner's emotions",
          "Financial value",
          "The horse's quality of life",
          "What others think",
        ],
        correctIndex: 2,
        explanation:
          "Quality of life must always be the primary consideration.",
      },
      {
        question: "What does responsible rehoming require?",
        options: [
          "Selling to anyone",
          "Finding a home through a reputable organisation",
          "Abandoning in a field",
          "Giving away online",
        ],
        correctIndex: 1,
        explanation:
          "Reputable organisations vet new homes and monitor welfare.",
      },
    ],
    aiTutorPrompts: [
      "How do I know when it's time for end-of-life?",
      "What is a quality-of-life assessment?",
      "What options after a horse has been put to sleep?",
    ],
    linkedCompetencies: ["welfare_awareness", "horse_care"],
  },

  {
    slug: "grid-work-and-related-distances",
    pathwaySlug: "polework-jump-foundations",
    title: "Grid Work & Related Distances",
    level: "intermediate",
    category: "Polework & Jump Foundations",
    sortOrder: 5,
    objectives: [
      "Understand the purpose of grid work",
      "Set up a basic bounce and one-stride grid",
      "Know standard distances for grid components",
      "Recognise how grids develop horse and rider",
    ],
    content: `Grid work (gymnastics) is a series of fences at related distances, developing rhythm, balance, and confidence.

## Purpose

Grids teach the horse to adjust stride and maintain balance. For riders, they develop secure position and quick reactions.

## Components

Bounce: two fences with no stride between (3-3.6m). One stride: two fences with one canter stride (7.3-7.9m). Placing pole: ground pole before the first fence at trot distance (2.4-2.7m).

## Setting Up

Build grids gradually from ground poles. Raise the last element first. Add height progressively. Accurate distances are critical.

## Safety

Grid work should be supervised. Horses must be warmed up. Use appropriate jump fillers and falling cups.`,
    keyPoints: [
      "Grid work develops rhythm, balance, and confidence",
      "Bounce: 3-3.6m; one stride: 7.3-7.9m",
      "Always build grids progressively",
      "Accurate distances are critical for safety",
      "Supervision by a qualified instructor is essential",
    ],
    safetyNote:
      "Incorrect distances can cause crashes or loss of confidence. Always measure carefully.",
    practicalApplication:
      "Set up a simple placing pole to crossrail to bounce grid under instruction.",
    commonMistakes: [
      "Distances too tight or wide",
      "Making the grid too high too quickly",
      "Approaching too fast",
      "Leaning forward through the grid",
      "Not warming up adequately",
    ],
    knowledgeCheck: [
      {
        question: "Approximate distance for a bounce?",
        options: ["1-2 metres", "3-3.6 metres", "7-8 metres", "10 metres"],
        correctIndex: 1,
        explanation: "3-3.6 metres allows landing and immediate takeoff.",
      },
      {
        question: "Why build grids progressively?",
        options: [
          "To save time",
          "To build confidence gradually",
          "It doesn't matter",
          "To confuse the horse",
        ],
        correctIndex: 1,
        explanation:
          "Progressive building allows confidence and balance to develop.",
      },
    ],
    aiTutorPrompts: [
      "Difference between bounce and one-stride?",
      "How to set up my first grid?",
      "My horse rushes through grids — how to fix?",
    ],
    linkedCompetencies: ["riding_position", "safety_awareness"],
  },

  {
    slug: "course-awareness-and-planning",
    pathwaySlug: "polework-jump-foundations",
    title: "Course Awareness & Planning",
    level: "advanced",
    category: "Polework & Jump Foundations",
    sortOrder: 6,
    objectives: [
      "Walk a show jumping course effectively",
      "Plan lines, turns, and approaches",
      "Count strides between related fences",
      "Apply course awareness to improve performance",
    ],
    content: `At competition level, walking a course and riding an accurate plan is essential.

## Walking the Course

Walk every fence in order. Stand at each and look from the horse's perspective. Check footing, fillers, and spooky elements.

## Planning Lines

Count strides between related fences on the actual track. Plan whether each section needs forward or steady canter. Identify recovery points.

## Turns

Well-planned turns give straight, balanced approaches. Cutting corners leads to run-outs and knockdowns.

## Riding the Plan

Commit to your plan once in the ring. Hesitation and last-minute changes are the most common causes of errors.`,
    keyPoints: [
      "Walk every fence in order from the horse's perspective",
      "Count strides between related fences",
      "Well-planned turns create better approaches",
      "Commit to your plan in the ring",
      "Course walking improves with practice",
    ],
    safetyNote:
      "Never jump a course at height without proper warm-up and equipment check.",
    practicalApplication:
      "Walk a course, plan your route, count strides, then ride it and compare plan vs reality.",
    commonMistakes: [
      "Not walking the course",
      "Walking a shortcut instead of the actual track",
      "Failing to plan first and last fences",
      "Changing plan mid-course",
      "Not accounting for ground conditions",
    ],
    knowledgeCheck: [
      {
        question: "Why walk the exact track your horse will take?",
        options: [
          "For exercise",
          "To count accurate strides and plan turns",
          "Because the judge watches",
          "It doesn't matter",
        ],
        correctIndex: 1,
        explanation:
          "The exact track gives accurate stride counts and turn planning.",
      },
      {
        question: "Most common cause of show jumping errors?",
        options: [
          "Horse too tired",
          "Last-minute plan changes and hesitation",
          "Course too high",
          "Bad luck",
        ],
        correctIndex: 1,
        explanation: "Hesitation disrupts rhythm and balance.",
      },
    ],
    aiTutorPrompts: [
      "How to walk a show jumping course?",
      "How to count strides between fences?",
      "What to focus on when planning turns?",
    ],
    linkedCompetencies: ["riding_position", "competition_preparation"],
  },

  {
    slug: "when-to-call-the-vet",
    pathwaySlug: "horse-health-first-response",
    title: "When to Call the Vet",
    level: "developing",
    category: "Horse Health & First Response",
    sortOrder: 5,
    objectives: [
      "Identify situations requiring immediate vet attention",
      "Know what info to have ready",
      "Recognise that uncertainty should be escalated to a veterinary professional rather than self-triaged",
      "Take and record vital signs accurately",
    ],
    content: `Knowing when to call the vet is critical. Delay in emergencies costs lives.

## Always Call Immediately For

Potential emergencies include signs of colic, a marked movement change, a wound, difficulty breathing, an eye concern or choke. Contact the veterinary practice promptly and follow its emergency instructions; do not wait to classify the condition yourself.

## Information to Have Ready

Your name, location, horse age and breed, observations, vital signs, and any first aid given.

## Vital Signs

For a healthy adult horse calmly at rest, World Horse Welfare lists temperature 37.5–38.5°C, pulse 36–42 bpm and respiration 8–12 breaths/min. Record the individual horse’s baseline and tell the veterinary team about concerning changes alongside the horse’s symptoms.

## The Golden Rule

If in doubt, call. A vet would rather have a false alarm than be called too late.`,
    keyPoints: [
      "Signs of colic, marked movement change, wounds, breathing difficulty, eye concerns or choke need prompt veterinary contact and the practice’s instructions",
      "Have safe observations and the horse’s individual baseline information ready where this does not delay the call",
      "Usual adult-at-rest reference: temperature 37.5–38.5°C, pulse 36–42 bpm and respiration 8–12 breaths/min; use the horse’s baseline and symptoms when speaking to the vet",
      "When in doubt, always call the vet",
      "Delay in emergencies can be fatal",
    ],
    safetyNote:
      "Keep your vet's emergency number saved in your phone and posted at the yard.",
    practicalApplication:
      "With a competent person, practise recording calm-at-rest observations using the approved yard procedure. Contact the veterinary practice first in an emergency; do not delay the call to collect extra information.",
    commonMistakes: [
      "Waiting to see if the horse improves",
      "Not knowing the emergency number",
      "Delaying a veterinary call in order to collect extra information",
      "Treating joint wounds without vet assessment",
      "Assuming colic will pass on its own",
    ],
    knowledgeCheck: [
      {
        question: "Normal resting heart rate for a horse?",
        options: ["10-20 bpm", "36-42 bpm", "60-80 bpm", "100-120 bpm"],
        correctIndex: 1,
        explanation:
          "World Horse Welfare lists 36–42 bpm as the usual pulse range for a healthy adult horse calmly at rest. A concerning change from the individual baseline, particularly with symptoms, should be discussed with a vet.",
      },
      {
        question: "Which is always an emergency?",
        options: [
          "Small scratch",
          "Mild dandruff",
          "A wound near a joint or tendon",
          "A loose shoe",
        ],
        correctIndex: 2,
        explanation:
          "A wound near a joint or tendon needs prompt veterinary assessment. Contact the veterinary practice and follow its instructions rather than attempting to assess depth or manage it yourself.",
      },
    ],
    aiTutorPrompts: [
      "What observations may be useful to the veterinary practice when it is safe to collect them?",
      "What should I do if I observe possible colic signs?",
      "Why should I contact the veterinary practice rather than self-triage a wound?",
    ],
    linkedCompetencies: ["health_awareness", "safety_awareness"],
  },

  {
    slug: "emergency-first-aid-procedures",
    pathwaySlug: "horse-health-first-response",
    title: "Emergency First Aid Procedures",
    level: "advanced",
    category: "Horse Health & First Response",
    sortOrder: 6,
    objectives: [
      "Recognise that emergency first response is preparation and prompt veterinary escalation, not diagnosis or treatment",
      "Keep people safe while obtaining professional emergency instructions",
      "Record only safe observations that may assist the veterinary practice",
      "Check that the yard’s approved emergency supplies and contact details are accessible",
    ],
    content: `Emergency first response is about keeping people safe, contacting the veterinary practice promptly and following the instructions given for the individual horse and situation. It does not replace veterinary assessment, diagnosis or treatment.

## Immediate Response

If you observe serious bleeding, signs of colic, an eye concern, a wound, marked movement change, breathing difficulty or another urgent welfare concern, keep yourself safe, contact the veterinary practice and follow its emergency instructions. Do not delay the call to complete a generic checklist, and do not undertake clinical procedures unless specifically directed.

## Safe Preparation

Record the time, observed changes, relevant history and any information the veterinary practice requests, where doing so does not increase risk or delay contact. Keep the horse and people as safe as the circumstances allow, following the yard’s emergency procedure. Do not force movement, apply a generic protocol or act independently in a clinical emergency.

## Emergency Supplies and Contacts

Know the location of the yard’s approved emergency supplies, the veterinary practice contact details and the current yard emergency procedure. The contents, checks and use of any kit must be set by the responsible professionals and reviewed when procedures change.`,
    keyPoints: [
      "Emergency first response is prompt veterinary escalation and safe preparation, not learner diagnosis or treatment",
      "In a potential emergency, keep people safe and follow the veterinary practice’s instructions for the individual horse",
      "Do not delay calling to complete a generic protocol or gather information",
      "Know the location of approved emergency supplies, contacts and the current yard procedure",
      "Emergency preparation supports — and never replaces — veterinary assessment",
    ],
    safetyNote:
      "Your own safety comes first. Never put yourself at risk. Contact the veterinary practice promptly and follow the current yard emergency procedure; do not undertake clinical action without professional direction.",
    practicalApplication:
      "With the responsible person, locate the approved emergency supplies, veterinary contact details and current yard emergency procedure. Confirm who is authorised to review and replenish supplies.",
    commonMistakes: [
      "Delaying veterinary contact while attempting a generic procedure",
      "Acting independently in a clinical emergency",
      "Not knowing the current yard emergency procedure or veterinary contact route",
      "Putting yourself at risk around a distressed horse",
      "Attempting to diagnose or manage a wound without professional direction",
    ],
    knowledgeCheck: [
      {
        question: "What is the first priority in a potential equine emergency?",
        options: [
          "Keep people safe, contact the veterinary practice promptly and follow its instructions",
          "Apply a generic clinical procedure before calling",
          "Wait for a fixed interval to see whether it improves",
          "Attempt to diagnose the cause from one observation",
        ],
        correctIndex: 0,
        explanation:
          "Emergency first response is prompt professional escalation and safe preparation. The veterinary practice directs action for the individual horse and situation.",
      },
      {
        question:
          "What should a learner do while waiting for emergency guidance?",
        options: [
          "Follow the yard emergency procedure and veterinary instructions without acting independently",
          "Try several home procedures until one works",
          "Force the horse to move for a clearer diagnosis",
          "Delay contact while assembling a generic kit",
        ],
        correctIndex: 0,
        explanation:
          "Keep people safe, avoid clinical action without direction and follow the current yard and veterinary emergency instructions.",
      },
    ],
    aiTutorPrompts: [
      "Where can I find the approved emergency supplies and veterinary contact route for this yard?",
      "Why must emergency action follow the veterinary practice’s instructions for the individual horse?",
      "What safe observations may I record while waiting for veterinary guidance?",
    ],
    linkedCompetencies: ["health_awareness", "safety_awareness"],
  },

  {
    slug: "daily-stable-routines",
    pathwaySlug: "stable-management",
    title: "Daily Stable Routines",
    level: "developing",
    category: "Stable Management",
    sortOrder: 5,
    objectives: [
      "Plan a structured daily routine",
      "Understand the importance of consistency",
      "Prioritise tasks effectively",
      "Record-keep daily observations",
    ],
    content: `A well-managed yard runs on routine. Horses thrive on consistency.

## Morning

Check all horses first: standing, eating, behaving normally. Provide fresh water, hay, feeds. Muck out stables.

## Midday

Check water, adjust rugs, bring in or turn out as appropriate.

## Evening

Feed, provide overnight hay, fill water buckets, adjust rugs, final visual check.

## Record Keeping

Maintain a daily diary noting observations, vet visits, farrier dates, worming dates, and concerns.`,
    keyPoints: [
      "Check all horses first thing every morning",
      "Consistent times reduce stress",
      "Record daily observations",
      "Prioritise water, feed, and health checks",
      "A structured routine ensures nothing is missed",
    ],
    safetyNote: "Morning health checks must happen before anything else.",
    practicalApplication: "Write out a complete daily routine for your yard.",
    commonMistakes: [
      "Skipping morning health checks",
      "Inconsistent feeding times",
      "Not recording observations",
      "Leaving water checks until end of day",
      "Not adjusting for seasonal changes",
    ],
    knowledgeCheck: [
      {
        question: "Very first morning task?",
        options: [
          "Mucking out",
          "Feeding",
          "Checking all horses are healthy and safe",
          "Tacking up",
        ],
        correctIndex: 2,
        explanation: "A health check of every horse must come first.",
      },
      {
        question: "Why is a daily yard diary important?",
        options: [
          "To impress visitors",
          "To track changes and maintain records",
          "It's not important",
          "To plan social events",
        ],
        correctIndex: 1,
        explanation:
          "A diary tracks health changes and provides records for the vet.",
      },
    ],
    aiTutorPrompts: [
      "What does a good daily routine look like?",
      "How to manage when short-staffed?",
      "What should I include in a yard diary?",
    ],
    linkedCompetencies: ["stable_management", "horse_care"],
  },

  {
    slug: "health-safety-in-the-yard",
    pathwaySlug: "stable-management",
    title: "Health & Safety in the Yard",
    level: "intermediate",
    category: "Stable Management",
    sortOrder: 6,
    objectives: [
      "Identify common yard hazards",
      "Understand fire safety procedures",
      "Know legal safety requirements",
      "Create a basic risk assessment",
    ],
    content: `Health and safety protects both humans and horses. Many accidents are preventable.

## Common Hazards

Slippery surfaces, loose dogs, unattended machinery, poorly stored chemicals, protruding nails, broken fencing, unsecured gates.

## Fire Safety

Fire extinguishers accessible and serviced, no smoking, hay stored away from stables, electrical wiring inspected, evacuation plan with headcollars on every door.

## Risk Assessment

Identifies hazards, who might be harmed, existing controls, and additional measures needed.

## Legal Requirements

Under the Health and Safety at Work Act, yard owners have a duty of care to visitors and livery clients.`,
    keyPoints: [
      "Identify and mitigate hazards: slippery floors, broken fencing",
      "Fire safety is paramount — headcollars on doors, extinguishers accessible",
      "Conduct and review risk assessments regularly",
      "Yard owners have legal safety responsibilities",
      "An evacuation plan must exist and be practised",
    ],
    safetyNote:
      "Keep a headcollar and lead rope on every stable door at all times for fire evacuation.",
    practicalApplication:
      "Walk around your yard and identify five potential hazards with control measures.",
    commonMistakes: [
      "Storing hay adjacent to stables",
      "Not having fire extinguishers",
      "Ignoring broken fencing",
      "No evacuation plan",
      "Assuming legislation doesn't apply to small yards",
    ],
    knowledgeCheck: [
      {
        question: "What should be on every stable door?",
        options: [
          "A nameplate",
          "A headcollar and lead rope",
          "A mirror",
          "A bucket",
        ],
        correctIndex: 1,
        explanation: "Headcollars allow fast evacuation in fire emergencies.",
      },
      {
        question: "Where should hay be stored?",
        options: [
          "Inside the stables",
          "Away from stables and ignition sources",
          "In the tack room",
          "Outside uncovered",
        ],
        correctIndex: 1,
        explanation: "Hay is highly flammable — store away from stables.",
      },
    ],
    aiTutorPrompts: [
      "What fire safety measures should every yard have?",
      "How to do a risk assessment?",
      "Legal requirements for equestrian premises?",
    ],
    linkedCompetencies: ["safety_awareness", "stable_management"],
  },

  {
    slug: "cross-country-fundamentals",
    pathwaySlug: "competitions-preparation",
    title: "Cross-Country Fundamentals",
    level: "intermediate",
    category: "Competitions & Preparation",
    sortOrder: 5,
    objectives: [
      "Understand cross-country principles",
      "Know key safety equipment",
      "Identify common fence types",
      "Plan safe cross-country approach",
    ],
    content: `Cross-country combines jumping over solid fences in open terrain.

## Key Principles

Fences are solid — they don't fall down. Accurate riding is essential. The horse must be fit, forward-thinking, and obedient.

## Safety Equipment

Body protector (BETA standards), certified helmet, air-jacket vests at some competitions, medical armbands.

## Common Fence Types

Log, ditch, trakehner (log over ditch), steps/banks, water combinations.

## Approach

Maintain strong rhythmic canter. Sit up and look ahead. Ride positively — hesitation causes stops.`,
    keyPoints: [
      "Fences are solid — accuracy essential",
      "Body protector and certified helmet compulsory",
      "Common fences: logs, ditches, trakehners, steps, water",
      "Maintain forward rhythm — hesitation causes refusals",
      "Horse fitness and rider confidence both critical",
    ],
    safetyNote:
      "Never attempt cross-country without a properly fitted body protector.",
    practicalApplication:
      "Walk a cross-country course and identify each fence type with approach plan.",
    commonMistakes: [
      "Approaching too slowly",
      "Looking down at fences",
      "Not wearing a body protector",
      "Horse not fit enough",
      "Not walking the course",
    ],
    knowledgeCheck: [
      {
        question: "Key difference between cross-country and show jumping?",
        options: [
          "Cross-country fences are smaller",
          "Cross-country fences are solid and fixed",
          "No difference",
          "Show jumping is harder",
        ],
        correctIndex: 1,
        explanation: "Solid, fixed fences leave no margin for error.",
      },
      {
        question: "Compulsory cross-country safety equipment?",
        options: [
          "Gloves only",
          "Body protector and certified helmet",
          "Knee pads",
          "Nothing specific",
        ],
        correctIndex: 1,
        explanation:
          "Body protector and certified helmet are compulsory at all levels.",
      },
    ],
    aiTutorPrompts: [
      "How to prepare for cross-country?",
      "What is a trakehner?",
      "How to ride into water on cross-country?",
    ],
    linkedCompetencies: ["competition_preparation", "safety_awareness"],
  },

  {
    slug: "competition-day-management",
    pathwaySlug: "competitions-preparation",
    title: "Competition Day Management",
    level: "advanced",
    category: "Competitions & Preparation",
    sortOrder: 6,
    objectives: [
      "Plan a successful competition day",
      "Manage nerves and time pressure",
      "Handle unexpected situations",
      "Conduct post-competition review",
    ],
    content: `A successful competition day requires planning and calm execution.

## Preparation

Plan backwards from your competition time. Allow for travel, unloading, registration, warm-up, course walking. Pack the night before.

## On the Day

Arrive early. Check in. Walk courses. Warm up calmly. Manage nerves with breathing and positive visualisation.

## Handling the Unexpected

Horses may behave differently at competitions. Be prepared for tension or excitement. Ride proactively.

## Post-Competition Review

Assess what went well and what needs improvement. Note specific exercises for home practice.`,
    keyPoints: [
      "Plan backwards from competition time",
      "Arrive early for registration, walking, warm-up",
      "Manage nerves with breathing and positive focus",
      "Be prepared for different horse behaviour",
      "Review every competition honestly",
    ],
    safetyNote:
      "Always check your horse's soundness before loading for a competition.",
    practicalApplication: "Create a complete competition day checklist.",
    commonMistakes: [
      "Arriving late and rushing",
      "Not walking the course",
      "Over-jumping in warm-up",
      "Forgetting documents",
      "Not reviewing afterwards",
    ],
    knowledgeCheck: [
      {
        question: "How to plan competition day timeline?",
        options: [
          "Wing it",
          "Plan backwards from start time",
          "Arrive just before class",
          "Copy someone else",
        ],
        correctIndex: 1,
        explanation: "Planning backwards ensures enough time for every stage.",
      },
      {
        question: "What to do after a competition?",
        options: [
          "Forget about it",
          "Review what went well and what to improve",
          "Only focus on what went wrong",
          "Immediately enter another",
        ],
        correctIndex: 1,
        explanation: "Balanced review helps learn from every experience.",
      },
    ],
    aiTutorPrompts: [
      "What to pack for competition day?",
      "How to manage competition nerves?",
      "Good warm-up routine before a class?",
    ],
    linkedCompetencies: ["competition_preparation"],
  },

  {
    slug: "stretching-for-riders",
    pathwaySlug: "rider-fitness-mindset",
    title: "Stretching for Riders",
    level: "developing",
    category: "Rider Fitness & Mindset",
    sortOrder: 5,
    objectives: [
      "Understand why flexibility matters for riding",
      "Perform key stretches for hips, hamstrings, shoulders, back",
      "Incorporate stretching into pre/post-ride routine",
      "Distinguish stretching from warming up",
    ],
    content: `Flexibility directly impacts your riding. Tight hips restrict your seat; stiff shoulders block arm aids.

## Key Stretches

Hip flexors: kneeling lunge (30 seconds each side). Hamstrings: forward fold (30 seconds). Shoulders: cross-body arm stretch (20 seconds each). Lower back: cat-cow stretch (10 reps). Inner thighs: butterfly stretch (30 seconds).

## Pre-Ride vs Post-Ride

Pre-ride: dynamic stretches (leg swings, arm circles). Post-ride: static stretches (held positions).

## Consistency

Stretch daily for best results. Even 10 minutes a day makes a significant difference.`,
    keyPoints: [
      "Tight muscles restrict your ability to follow the horse",
      "Focus on hips, hamstrings, shoulders, lower back",
      "Dynamic stretches before riding, static after",
      "Consistency is key — 10 minutes daily",
      "Flexibility improves comfort and prevents injury",
    ],
    safetyNote: "Never stretch cold muscles aggressively. Warm up first.",
    practicalApplication:
      "Create a 10-minute daily stretching routine for one week and note riding changes.",
    commonMistakes: [
      "Static stretching before riding without warmup",
      "Bouncing in stretches",
      "Only stretching occasionally",
      "Ignoring hip flexibility",
      "Pushing through pain",
    ],
    knowledgeCheck: [
      {
        question: "What type of stretching before riding?",
        options: [
          "Static held 60 seconds",
          "Dynamic like leg swings",
          "None",
          "Stretching while mounted",
        ],
        correctIndex: 1,
        explanation: "Dynamic stretches warm muscles with movement.",
      },
      {
        question: "Most important flexibility area for riders?",
        options: ["Wrists", "Hips", "Ankles", "Neck"],
        correctIndex: 1,
        explanation:
          "Hip flexibility directly affects seat, balance, and following the horse.",
      },
    ],
    aiTutorPrompts: [
      "What stretches before and after riding?",
      "I have tight hips — how to improve?",
      "How does yoga help riding?",
    ],
    linkedCompetencies: ["rider_fitness"],
  },

  {
    slug: "overcoming-fear-and-anxiety",
    pathwaySlug: "rider-fitness-mindset",
    title: "Overcoming Fear & Anxiety in Riding",
    level: "intermediate",
    category: "Rider Fitness & Mindset",
    sortOrder: 6,
    objectives: [
      "Understand why fear is normal",
      "Identify personal triggers",
      "Apply practical strategies to manage fear",
      "Build a confidence-rebuilding plan",
    ],
    content: `Fear and anxiety in riding are common and normal. Horses are large and the risk of falling is real.

## Understanding

Fear can stem from a fall, gradual loss of confidence, returning after a break, or a new horse.

## Practical Strategies

Breathing: in for 4, hold for 4, out for 4. Progressive exposure: start easy, build gradually. Positive self-talk. Anchor activities that feel safe.

## Building a Plan

Start with activities 90 percent comfortable. Add challenge gradually. Never jump to the hardest thing.

## When to Seek Help

If anxiety severely impacts enjoyment, consider a sports psychologist or confidence coach.`,
    keyPoints: [
      "Fear is completely normal — acknowledge without shame",
      "Controlled breathing reduces the stress response",
      "Progressive exposure is the most effective approach",
      "Replace negative self-talk with positive statements",
      "Seek professional help if severely impacted",
    ],
    safetyNote:
      "Never force yourself or allow others to force you into situations that feel dangerous.",
    practicalApplication:
      "Write down your top three anxiety triggers with a small first step for each.",
    commonMistakes: [
      "Pushing through extreme fear",
      "Comparing to fearless riders",
      "Avoiding riding altogether",
      "Not telling your instructor",
      "Expecting overnight recovery",
    ],
    knowledgeCheck: [
      {
        question: "Most effective approach to riding anxiety?",
        options: [
          "Force the scariest thing first",
          "Gradual progressive exposure",
          "Ignore the fear",
          "Give up riding",
        ],
        correctIndex: 1,
        explanation:
          "Progressive exposure starting with safe activities builds lasting confidence.",
      },
      {
        question: "Breathing technique for anxiety?",
        options: [
          "Hold breath",
          "Breathe as fast as possible",
          "In for 4, hold for 4, out for 4",
          "Panting",
        ],
        correctIndex: 2,
        explanation:
          "Box breathing activates the parasympathetic nervous system.",
      },
    ],
    aiTutorPrompts: [
      "How to rebuild confidence after a fall?",
      "I feel sick before every ride — what to do?",
      "How to talk to my instructor about fear?",
    ],
    linkedCompetencies: ["rider_fitness", "welfare_awareness"],
  },

  {
    slug: "safeguarding-and-duty-of-care",
    pathwaySlug: "coaching-teaching-skills",
    title: "Safeguarding & Duty of Care",
    level: "intermediate",
    category: "Coaching & Teaching Skills",
    sortOrder: 5,
    objectives: [
      "Understand the coach's duty of care",
      "Recognise safeguarding responsibilities",
      "Know reporting procedures",
      "Apply appropriate boundaries",
    ],
    content: `Every coach has a legal and moral duty of care. This is critical with children and vulnerable adults.

## Duty of Care

Taking reasonable steps to ensure safety and wellbeing — physical and emotional.

## Safeguarding Children

Never be alone with a child without parental consent and visibility. Recognise signs of abuse. Know your safeguarding officer and reporting procedures.

## Reporting

Report concerns to your designated safeguarding officer. If a child is in immediate danger, contact police. Record exactly what you saw using the child's own words.

## Professional Boundaries

Use professional communication channels. Do not share personal social media with young riders. Keep session records.`,
    keyPoints: [
      "Duty of care covers physical and emotional wellbeing",
      "Never be alone with a child without consent and visibility",
      "Report concerns to the designated officer — don't investigate yourself",
      "Record concerns factually",
      "Maintain professional boundaries",
    ],
    safetyNote:
      "If a child tells you something concerning, listen calmly, reassure them, and report immediately. Never promise secrecy.",
    practicalApplication:
      "Find out who the safeguarding officer is at your yard.",
    commonMistakes: [
      "Ignoring concerns because they seem minor",
      "Investigating yourself instead of reporting",
      "Promising confidentiality to a child at risk",
      "Not having DBS checks",
      "Blurring professional boundaries",
    ],
    knowledgeCheck: [
      {
        question: "What to do if a child discloses something concerning?",
        options: [
          "Promise secrecy",
          "Investigate yourself",
          "Listen, reassure, and report to safeguarding officer",
          "Ignore it",
        ],
        correctIndex: 2,
        explanation: "Listen, reassure, report. Never promise secrecy.",
      },
      {
        question: "What does duty of care mean?",
        options: [
          "Being friends with all riders",
          "Taking reasonable steps to ensure safety and wellbeing",
          "Winning competitions",
          "Providing free lessons",
        ],
        correctIndex: 1,
        explanation:
          "Taking all reasonable steps to protect physical and emotional wellbeing.",
      },
    ],
    aiTutorPrompts: [
      "What safeguarding training do I need?",
      "How to handle difficult parent conversations?",
      "What records should I keep as a coach?",
    ],
    linkedCompetencies: ["coaching_skills", "safety_awareness"],
  },

  {
    slug: "inclusive-coaching-adaptive-riding",
    pathwaySlug: "coaching-teaching-skills",
    title: "Inclusive Coaching & Adaptive Riding",
    level: "advanced",
    category: "Coaching & Teaching Skills",
    sortOrder: 6,
    objectives: [
      "Understand inclusive coaching principles",
      "Adapt teaching methods for different needs",
      "Know basics of para-equestrian sport",
      "Create an inclusive environment",
    ],
    content: `Inclusive coaching ensures every rider has access to high-quality education regardless of ability or background.

## Principles

Adapt teaching to the individual. This includes communication style, exercise complexity, equipment, and pace.

## Adapting for Different Needs

Physical disabilities: adapted mounting blocks, specialised saddles, side walkers. Learning differences: small steps, visual aids, extra processing time. Sensory needs: reduce noise, clear verbal cues. Anxiety: calm, patient approach with praise.

## Para-Equestrian

Competitive riding for athletes with physical disabilities. Grades I-V accommodate different impairment levels.

## Inclusive Environment

Physically accessible, culturally welcoming, free from discrimination.`,
    keyPoints: [
      "Inclusion means adapting to the individual",
      "Physical, learning, sensory, emotional needs all require different adaptations",
      "The RDA provides standards for working with disabled riders",
      "Para-equestrian offers competitive pathways",
      "An inclusive environment is welcoming and free from discrimination",
    ],
    safetyNote:
      "When working with riders with specific needs, conduct thorough risk assessment. Additional helpers may be required.",
    practicalApplication:
      "Plan a lesson for a fictional rider with a specific need.",
    commonMistakes: [
      "Assuming all people with a condition have the same needs",
      "Over-helping instead of allowing independence",
      "Not asking the rider what they need",
      "Ignoring accessibility when planning events",
      "Lacking patience with adaptive teaching",
    ],
    knowledgeCheck: [
      {
        question: "Core principle of inclusive coaching?",
        options: [
          "Treating everyone exactly the same",
          "Adapting teaching to meet individual needs",
          "Only teaching riders without disabilities",
          "Lowering standards for everyone",
        ],
        correctIndex: 1,
        explanation:
          "Adapting methods ensures every rider can learn effectively.",
      },
      {
        question: "UK organisation for working with disabled riders?",
        options: [
          "The Jockey Club",
          "The BHA",
          "The Riding for the Disabled Association (RDA)",
          "The Kennel Club",
        ],
        correctIndex: 2,
        explanation:
          "The RDA provides training and standards for equestrian centres.",
      },
    ],
    aiTutorPrompts: [
      "How to adapt a lesson for limited mobility?",
      "What training to teach riders with disabilities?",
      "How to make my yard more inclusive?",
    ],
    linkedCompetencies: ["coaching_skills", "welfare_awareness"],
  },
];

const VETERINARY_REVIEW_TOPIC =
  /\b(colic|laminitis|wound|vital signs?|first aid|vaccin|worm|parasite|nutrition|supplement|dental|farrier)\b/i;
const CURRENT_REQUIREMENTS_TOPIC =
  /\b(transport|insurance|competition|legal|legislation|passport)\b/i;
const SAFEGUARDING_REVIEW_TOPIC = /\bsafeguarding\b/i;

function factualSafetyBoundary(lesson: LessonUnitData): string | null {
  const searchable = [
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
  const boundaries: string[] = [];
  if (VETERINARY_REVIEW_TOPIC.test(searchable)) {
    boundaries.push(
      "This lesson supports observation and preparation only; obtain individual advice from a veterinarian or other appropriately qualified professional before diagnosing, treating, medicating, or changing a health plan.",
    );
  }
  if (CURRENT_REQUIREMENTS_TOPIC.test(searchable)) {
    boundaries.push(
      "Transport, insurance, competition and legal requirements can change and depend on the activity, journey, policy and jurisdiction; verify the current official rules, organiser requirements and professional advice before acting.",
    );
  }
  if (SAFEGUARDING_REVIEW_TOPIC.test(searchable)) {
    boundaries.push(
      "Follow your organisation's safeguarding policy and designated reporting route. In an immediate emergency, contact the relevant emergency services.",
    );
  }
  return boundaries.length ? boundaries.join(" ") : null;
}

/**
 * Applies independently reviewed, additive teaching-depth supplements and
 * lesson-aware professional boundaries by stable lesson slug. No browser data
 * can alter this source or the server-held answer key used for completion scoring.
 */
export const LESSON_UNITS: LessonUnitData[] = BASE_LESSON_UNITS.map(
  (lesson) => {
    const enhancement = LESSON_QUALITY_ENHANCEMENTS[lesson.slug];
    const expandedLesson: LessonUnitData = enhancement
      ? {
          ...lesson,
          content: `${lesson.content}\n\n${enhancement.contentExtension}`,
          knowledgeCheck: [
            ...lesson.knowledgeCheck,
            enhancement.knowledgeCheck,
          ],
        }
      : lesson;
    const boundary = factualSafetyBoundary(expandedLesson);
    if (!boundary) return expandedLesson;
    return {
      ...expandedLesson,
      safetyNote: `${expandedLesson.safetyNote} ${boundary}`,
    };
  },
);
