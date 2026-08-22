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
      "Recognise that teaching riding requires appropriate qualification, authorisation, safeguarding, and current site procedures",
      "Use factual observation and qualified-coach escalation rather than diagnosing a learner, horse, or cause",
      "Understand that a qualified coach adapts communication, support, progression, and feedback to the individual",
      "Prepare appropriate questions for a qualified coach about lesson planning, risk, welfare, safeguarding, and progression",
    ],
    content: `Riding well does not by itself authorise someone to teach. Coaching adults or children requires the appropriate qualification, authority, safeguarding, insurance, current legal and site requirements, horse-and-rider suitability, risk assessment, and responsible-person procedures. This lesson helps learners recognise those boundaries and prepare questions for a qualified coach; it does not qualify the learner to teach, select horses, plan an activity, supervise a rider, or make welfare, medical, safeguarding, or emergency decisions.

## Preparing for Qualified Coaching

Official beginner-riding guidance describes a coach taking a new rider step-by-step through mounting, basic controls, and position, with leader support where appropriate. Professional coach standards include participant-centred planning, horse welfare, safety, safeguarding, risk awareness, suitable equipment and environment, communication, feedback, adaptation, and evaluation. The qualified coach and responsible person decide whether the rider, horse, lesson environment, support, and task are suitable.

A learner can prepare by asking the qualified coach what the current plan covers: the lesson aim, participant needs, safety arrangements, horse and equipment suitability, supervision, safeguarding, communication, stop/escalation route, welfare checks, and how the activity will be reviewed. Do not create or alter those arrangements independently from a generic lesson.

## Observing Without Diagnosing

A coach may observe a rider’s position, confidence, communication, attention, balance, or response to an instruction. An observation does not prove a psychological, medical, biomechanical, tack, welfare, or behavioural cause. Do not label a rider’s “fault,” attribute it to anxiety, weakness, tiredness, or confidence, or prescribe an exercise or correction from this lesson.

If a learner appears uncomfortable, nervous, unable to understand, unsafe, tired, or distressed—or if the horse, tack, footing, weather, or environment becomes unsuitable—the activity must be paused, adapted, stopped, or escalated through the qualified coach and current site procedure. The rider should be encouraged to ask questions and communicate discomfort or concern to the coach.

## Communication and Adaptation

Professional coach standards require communication and feedback that meet the rider’s needs. A qualified coach decides what language, demonstration, support, visual cue, progression, repetition, or adaptation is appropriate for the individual. Generic imagery, position cues, mounted exercises, no-stirrup work, lunge work, poles, reins, whips, or transitions are not automatically safe or suitable. Use only the current coach-approved activity and support.

A learner may practise neutral, factual communication within their authority: report what was observed, say when they do not understand, and ask what the current qualified plan requires. Do not promise confidentiality where safeguarding requires reporting, investigate an incident, or give a rider medical, legal, welfare, or technical instruction beyond the approved role.

## Understanding Qualified Lesson Planning

Professional coaching qualifications use plans that can include risk assessment, aims, rider and horse suitability, equipment, timings, preparation, activity, cool-down, conclusion, feedback, progression, adaptation, and evaluation. The exact content and duration vary by qualification, rider, horse, discipline, environment, local requirements, and current conditions. Assessment-specific timings are not a universal lesson template.

A qualified coach should adapt or stop a plan when it is no longer suitable. A learner should report the changed condition, follow the designated stop/escalation route, and obtain qualified direction rather than selecting a “Plan B” or progression alone.`,
    keyPoints: [
      "Riding ability does not by itself authorise teaching; coaching requires appropriate qualification, authority, safeguarding, and current site procedures",
      "An observation does not establish a rider’s or horse’s medical, psychological, biomechanical, welfare, tack, or behavioural cause",
      "A qualified coach adapts communication, support, feedback, and progression to the individual rider, horse, activity, and conditions",
      "Professional lesson plans may include risk, suitability, aims, equipment, preparation, activity, review, adaptation, and evaluation; no fixed template applies to every context",
      "Report changed conditions and follow the qualified coach’s designated stop/escalation route rather than selecting an activity or progression alone",
    ],
    safetyNote:
      "Do not teach, supervise, select a horse, choose equipment, set a duration, or progress a beginner activity unless you are authorised, competent, and following the current qualified coaching and responsible-person procedures. Pause, stop, or escalate if rider security, understanding, consent, horse welfare or behaviour, tack, footing, weather, supervision, safeguarding, or emergency arrangements become unsuitable.",
    practicalApplication:
      "Ask a qualified coach how their current lesson plan addresses rider and horse suitability, risk, welfare, safeguarding, communication, support, progression, adaptation, and review. Practise reporting factual observations and asking clarifying questions within an authorised setting. Do not design, rehearse, or deliver a lesson to a real beginner from this lesson alone.",
    commonMistakes: [
      "Assuming that because you can ride a skill well, you can automatically explain it clearly to someone else",
      "Diagnosing a rider’s or horse’s “root cause,” health, confidence, biomechanics, welfare, tack fit, or behaviour from a generic observation",
      "Giving instruction, selecting a horse or activity, or changing a progression outside an authorised qualified-coaching role",
    ],
    knowledgeCheck: [
      {
        question:
          "What must a learner establish before teaching or supervising a beginner rider?",
        options: [
          "That they can ride the skill themselves",
          "The appropriate qualification, authority, safeguarding, current site procedure, and qualified coaching responsibility",
          "That the beginner has watched an online lesson",
          "That the learner has a generic fixed lesson plan",
        ],
        correctIndex: 1,
        explanation:
          "Riding ability alone does not authorise coaching. Professional standards require safety, welfare, safeguarding, suitability, communication, risk management, and qualified responsibility.",
      },
      {
        question:
          "How should a learner respond to an observed rider-position concern?",
        options: [
          "Diagnose the rider’s root cause and prescribe an exercise",
          "Assume the horse or saddle is responsible",
          "Report factual observations and follow the qualified coach’s current instruction and escalation route",
          "Continue the activity without mentioning it",
        ],
        correctIndex: 2,
        explanation:
          "A generic observation does not establish a medical, psychological, biomechanical, welfare, tack, or behavioural cause. A learner should report factual observations and follow the authorised coaching procedure.",
      },
      {
        question:
          "Who decides whether a communication cue, demonstration, support, or progression is suitable for a beginner rider?",
        options: [
          "Any experienced rider using a generic lesson",
          "The qualified coach within the current responsible-person and safeguarding arrangements",
          "The rider alone before mounting",
          "A fixed time-based lesson template",
        ],
        correctIndex: 1,
        explanation:
          "Professional coaching standards require communication, feedback, support, adaptation, and progressive activity to meet the individual rider’s needs while maintaining safety, welfare, and safeguarding.",
      },
    ],
    aiTutorPrompts: [
      "What qualification, authority, safeguarding, and current site procedure are required before I teach or supervise a beginner rider?",
      "How should I report a factual rider, horse, tack, footing, or safety observation to the qualified coach?",
      "Which current planning, risk, welfare, safeguarding, support, adaptation, and evaluation questions should I discuss with a qualified coach?",
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
      "Use qualified coaching to reflect on rider position, balance, and security",
      "Recognise that position cues must be adapted to the individual rider, horse, saddle, activity, and conditions",
      "Recognise when any mounted or off-horse exercise requires qualified approval or health-professional input",
      "Report rider-security, horse-comfort, tack, footing, or conditions concerns through the qualified coaching route",
    ],
    content: `“Independent seat” is a coaching term that may describe a rider’s developing balance, security, and ability to follow qualified instruction without using the reins as support. It is not a medical diagnosis, a universal position standard, proof of horse comfort, or a substitute for assessment by a qualified coach, health professional, saddle fitter, or veterinarian. The reviewed coach guidance requires ridden work on horses suitable for the participant level and under coach instruction and supervision; every position cue and exercise must be adapted to the individual partnership and current conditions.

A qualified coach may observe how the rider appears positioned in the current saddle, task, pace, and setting. Familiar reference points such as the head, shoulders, hips, legs, feet, hands, and stirrups can help a coach communicate, but no single line, posture, or cue is correct for every rider, horse, discipline, or circumstance. An observation does not establish a rider’s anatomy, saddle fit, horse comfort, centre of gravity, or the cause of a movement concern.

A coach may use terms such as stability, balance, comfort, tension, and security in an individual coaching discussion. Learners should not infer that apparent tension, weakness, asymmetry, pain, or loss of balance has one cause or can be corrected through a generic lesson. Persistent pain, injury, limitation, or health concern requires an appropriately qualified health professional; horse discomfort, behaviour, or tack concerns require the appropriate responsible or qualified person.

A qualified coach may use a cue about the rider’s pelvis, upper body, hips, or seat only after considering the individual rider, horse, saddle, pace, task, comfort, and safety context. The cue is not a diagnosis or a fixed anatomical treatment. If a rider feels pain, numbness, insecurity, or persistent discomfort, they should stop and seek appropriate qualified advice rather than attempting to self-correct through a generic instruction.

The reviewed coach guidance supports a focus on rider position, balance, security, appropriate assistance, and safe foot placement in the stirrup. The qualified coach must determine any further leg, knee, foot, or stirrup cue for the individual rider and activity. Do not assume that a visible position feature proves a cause, creates a particular horse response, or can be changed safely without qualified input.

Riders should not use reins or other equipment in a way that conflicts with their current coach instruction or compromises safety. If the rider feels insecure, the coach may select a safe support or change the exercise; the reviewed guidance allows aids such as a neck strap where required. Do not treat a generic hand, arm, shoulder, rein, or contact description as a universal rule or a means to diagnose horse comfort or behaviour.

A qualified coach may select an exercise, level of assistance, and progression only after assessing the current partnership and conditions. No-stirrup work, arm movements, transitions, lunge work, and any unfamiliar task are not universal balance tests or programmes. They require explicit coach approval, a suitable horse, appropriate equipment and setting, supervision, and current emergency arrangements. Stop or postpone the activity when rider security, horse comfort or behaviour, tack, footing, weather, or support is unsuitable.

Any off-horse activity must suit the individual’s health, experience, and current professional advice. This lesson does not prescribe yoga, Pilates, core work, rehabilitation, stretching, strength training, duration, frequency, or a health outcome. Seek an appropriately qualified health or exercise professional for pain, injury, persistent limitation, or individual exercise planning.

Developing rider balance should follow an individual, welfare-aware coaching plan. The qualified coach and responsible person decide whether the current horse, rider, tack, setting, supervision, and exercise remain suitable. Use this lesson to prepare questions for a qualified coach, not to self-prescribe a correction, blame the rider or horse, or progress an activity independently.`,
    keyPoints: [
      "“Independent seat” is a coaching term, not a diagnosis, universal standard, proof of horse comfort, or substitute for qualified assessment",
      "Position cues must be adapted by a qualified coach to the individual rider, horse, saddle, task, and current conditions",
      "Pain, injury, persistent limitation, horse discomfort, behaviour, or tack concerns require the appropriate qualified professional",
      "An observation of the rider’s pelvis, seat, legs, hands, or shoulders does not establish cause or a safe correction",
      "No-stirrup work, lunge work, or any new exercise require explicit coach approval, suitable conditions, and current safety controls",
      "Off-horse exercise must be individualised and must not be prescribed from this lesson as a treatment or guaranteed riding outcome",
    ],
    safetyNote:
      "Do not begin or progress no-stirrup work, lunge work, or any new balance exercise without coach instruction and the responsible person’s current safety arrangements. Stop if rider security, horse comfort or behaviour, tack, footing, weather, supervision, or emergency arrangements become unsuitable, then obtain qualified advice.",
    practicalApplication:
      "Ask a qualified coach which position observation, support, and exercise are suitable for your current horse-and-rider partnership. Follow the individual plan rather than starting no-stirrup, lunge, fitness, strengthening, stretching, or position-correction work from this lesson. Report any safety, comfort, tack, footing, or conditions concern promptly.",
    commonMistakes: [
      "Using a position cue to diagnose rider health, horse comfort, saddle fit, or the cause of a performance concern",
      "Continuing an exercise without the instruction, supervision, support, or conditions identified in the current coaching plan",
      "Progressing to no-stirrup, lunge, a faster pace, or a new exercise without explicit coach approval",
      "Self-prescribing an off-horse fitness, rehabilitation, or treatment programme from a generic riding lesson",
      "Blaming either rider or horse without qualified assessment of the individual partnership and current context",
    ],
    knowledgeCheck: [
      {
        question: "How should a learner use the term ‘independent seat’?",
        options: [
          "As a medical diagnosis of the rider",
          "As a coach-led description that must be adapted to the individual partnership and current conditions",
          "As proof that the horse is comfortable",
          "As a reason to begin no-stirrup work alone",
        ],
        correctIndex: 1,
        explanation:
          "Independent seat is a coaching term. It does not diagnose a rider or horse, prove horse comfort, or replace qualified assessment and coach-approved progression.",
      },
      {
        question: "Who should determine whether a position cue is suitable for a rider?",
        options: [
          "The rider alone using a fixed online diagram",
          "A qualified coach considering the rider, horse, saddle, task, discipline, and current conditions",
          "Any spectator who sees the horse move",
          "A generic assessment that applies to every partnership",
        ],
        correctIndex: 1,
        explanation:
          "A visible position feature does not establish anatomy, saddle fit, horse comfort, or cause. The qualified coach must adapt a cue to the individual partnership and context.",
      },
      {
        question: "What should a rider do if a position concern is accompanied by pain, persistent limitation, insecurity, horse discomfort, or a tack concern?",
        options: [
          "Continue until a generic exercise fixes it",
          "Diagnose the cause from the rider’s position",
          "Stop or move to safety as directed and seek the appropriate qualified advice",
          "Progress to a more difficult balance exercise",
        ],
        correctIndex: 2,
        explanation:
          "A generic lesson cannot diagnose the cause of a concern. Stop, follow the current safety arrangement, and obtain qualified coaching, health, tack, or horse-care advice as appropriate.",
      },
      {
        question:
          "How should a rider choose an off-horse exercise for a position or balance concern?",
        options: [
          "Use a generic programme as treatment",
          "Choose the most difficult online exercise",
          "Use an individual plan from an appropriate qualified professional when needed",
          "Assume that all core exercises transfer directly to riding",
        ],
        correctIndex: 2,
        explanation:
          "This lesson does not prescribe fitness, rehabilitation, stretching, or treatment. Pain, injury, persistent limitation, and individual exercise planning require an appropriately qualified professional.",
      },
      {
        question:
          "When may lunge work or no-stirrup work be considered?",
        options: [
          "For every rider as a required balance test",
          "Only when a qualified coach explicitly approves it for the individual partnership and current safety conditions",
          "Whenever the rider wants a harder activity",
          "When there is no supervision available",
        ],
        correctIndex: 1,
        explanation:
          "Lunge and no-stirrup work are not universal balance tests or programmes. They require coach approval, suitable conditions, appropriate equipment, supervision, and current safety controls.",
      },
    ],
    aiTutorPrompts: [
      "Which individual position, balance, or off-horse support should I discuss with a qualified coach or health professional?",
      "Which current coach-approved observation and support are appropriate for my horse-and-rider partnership?",
      "When should I stop a balance exercise and seek qualified coaching, health, tack, or horse-care advice?",
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
      "Recognise that confidence, fear, stress, and anxiety experiences vary and are not diagnoses a riding lesson can make",
      "Use factual self-observation and qualified-coach communication without self-diagnosing a cause",
      "Understand that any riding activity or progression requires qualified coach approval and current safety, welfare, and consent arrangements",
      "Know when anxiety, fear, or panic requires appropriate health support or urgent local help",
    ],
    content: `Feeling less confident, worried, tense, fearful, or stressed around riding can have many possible causes and can affect people differently. A lesson cannot diagnose anxiety, trauma, panic, a horse’s behaviour, a rider’s health, or the cause of a concern. This content is a non-clinical wellbeing and safety aid; it does not replace a qualified coach, health professional, emergency service, veterinarian, saddle fitter, or responsible-person procedure.

## Safety, Welfare, and Choice Come First

No rider should be pressured to start, continue, or progress an activity that is outside their current qualified coaching plan or safety arrangements. The qualified coach and responsible person must consider the individual rider, horse, task, equipment, environment, footing, weather, supervision, consent, welfare, safeguarding, and emergency arrangements. If the rider feels unsafe, uncomfortable, unable to continue, or declines an activity—or if the horse, tack, conditions, or support become unsuitable—the activity must be paused, adapted, stopped, or escalated through the current procedure.

A rider can describe factual experiences to the qualified coach, such as feeling worried before a particular activity, feeling less secure after time away, or noticing a change in comfort. These observations are a starting point for a coach-led safety conversation, not proof of a psychological, medical, welfare, tack, or behavioural cause. Do not use this lesson to self-diagnose, to decide a horse is reliable or suitable, or to select a replacement activity independently.

## Supported, Individual Progression

NHS guidance advises setting small targets and, where appropriate, slowly building time in worrying situations rather than avoiding everything at once. In riding, this does **not** mean self-directed exposure, forcing an exercise, repeating a frightening event, or using a generic progression. A qualified coach must decide whether any coach-approved activity is suitable, what support is needed, and whether it should stop. The rider may ask for the current plan, support, options, and stop/escalation route to be explained.

British Equestrian’s wellbeing material recognises that equestrian activity can contribute to wellbeing and connection, but riding is not a treatment and no horse, lesson, phrase, breathing technique, visualisation exercise, or goal guarantees confidence or mental-health improvement. Avoid comparing progress with other riders or treating a setback as evidence of failure.

## Optional Calming Support

NHS describes a comfortable, unforced breathing exercise as one option some people use for stress, anxiety, or panic. A rider may discuss a suitable approach with an appropriate health professional and use it only when it does not distract from safety or current coach instruction. Do not force the breath, use fixed counts as a prescription, continue if it causes discomfort or dizziness, or attempt a breathing exercise instead of responding to an immediate riding safety concern.

Some riders find it helpful to talk to a trusted person or set a small, coach-agreed goal. Others may need different support. A qualified coach can support the riding context but cannot diagnose or treat mental-health conditions, investigate safeguarding concerns, or promise confidentiality where reporting may be required.

## When to Seek Further Help

NHS advises obtaining medical help if a person is struggling to cope with anxiety, fear, or panic, especially when self-help is not helping or symptoms affect daily life. Seek urgent local mental-health or emergency support for a crisis or emergency. The appropriate route depends on location and individual circumstances; a riding lesson must not delay urgent help.`,
    keyPoints: [
      "Confidence, fear, stress, and anxiety experiences vary; a riding lesson must not diagnose their cause or a rider’s health",
      "Rider, horse, tack, welfare, environment, and safety concerns require factual observation and the appropriate qualified assessment, not a generic causal conclusion",
      "Any riding activity or progression must be qualified-coach approved, welfare-aware, individual, and stopped or escalated when conditions are unsuitable",
      "Comfortable, unforced breathing may be an optional support for some people but is not a treatment, fixed prescription, or substitute for immediate safety action",
      "Seek appropriate health support when struggling to cope with anxiety, fear, or panic; obtain urgent local help for a mental-health crisis or emergency",
    ],
    safetyNote:
      "Do not start, continue, or progress a riding activity outside the current qualified coaching and responsible-person procedure. Pause, stop, adapt, or escalate if rider understanding, consent, security, horse welfare or behaviour, tack, footing, weather, supervision, safeguarding, privacy, or emergency arrangements become unsuitable. Seek urgent local help for a mental-health crisis or emergency.",
    practicalApplication:
      "Discuss a factual confidence or safety concern with a qualified coach and ask what the current support, activity, stop/escalation route, and responsible-person procedure are. Do not set or progress a riding exposure, horse, pace, exercise, or goal from this lesson alone; obtain appropriate health support if anxiety, fear, or panic is difficult to cope with or affects daily life.",
    commonMistakes: [
      "Forcing, self-directing, or continuing an activity without qualified coach approval and current safety, welfare, consent, and support arrangements",
      "Using a generic lesson to diagnose a rider’s anxiety, health, confidence, a horse’s behaviour, tack fit, welfare, or the cause of a concern",
      "Treating riding, a particular horse, visualisation, breathing, or a self-set target as a guaranteed confidence or mental-health treatment",
      "Delaying appropriate health help when anxiety, fear, or panic is difficult to cope with, affects daily life, or is a crisis or emergency",
      "Promising confidentiality, investigating a safeguarding concern, or providing mental-health treatment outside an authorised qualified role",
    ],
    knowledgeCheck: [
      {
        question: "What should happen if a rider feels unsafe, uncomfortable, unable to continue, or declines an activity—or if current conditions become unsuitable?",
        options: [
          "Continue to build confidence through repetition",
          "Choose a different activity alone",
          "Pause, stop, adapt, or escalate through the current qualified coaching and responsible-person procedure",
          "Diagnose the rider or horse from the concern",
        ],
        correctIndex: 2,
        explanation:
          "The individual rider, horse, task, welfare, consent, safety, and current conditions determine the next step. A generic lesson cannot diagnose the cause or choose a safe progression.",
      },
      {
        question:
          "How should a rider use the NHS suggestion to set small targets or gradually build time in worrying situations?",
        options: [
          "As an instruction to force a riding exercise alone",
          "As a reason to repeat a frightening event regardless of welfare or safety",
          "Only within an individual, qualified-coach-approved plan with current safety, welfare, consent, and stop/escalation arrangements",
          "As proof that the rider does not need health support",
        ],
        correctIndex: 2,
        explanation:
          "NHS guidance is not a riding progression protocol. A qualified coach and responsible person must decide whether a riding activity is appropriate, while health concerns require the appropriate health support.",
      },
    ],
    aiTutorPrompts: [
      "How should I discuss a factual confidence or safety concern with my qualified coach and understand the current support and stop/escalation procedure?",
      "When should I seek appropriate health help for anxiety, fear, or panic rather than treating a riding lesson as mental-health care?",
      "What authority, safeguarding, welfare, and current site procedure are required before I support another rider’s confidence concern?",
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
      "Recognise that qualified coaching must adapt safely to individual rider needs, age, experience, and current conditions",
      "Use factual observation and qualified-coach escalation rather than assigning a learner type or diagnosing a cause",
      "Understand that participant-centred communication, safety, welfare, safeguarding, and adaptation require qualified-coach responsibility",
      "Prepare appropriate questions for a qualified coach about inclusion, support, consent, privacy, safeguarding, and progression",
    ],
    content: `Rider needs are individual. Qualified coaching must consider age, experience, ability, disability or long-term health conditions where relevant and appropriately disclosed, communication needs, current consent, safety, horse welfare, safeguarding, equipment, environment, and the current responsible-person procedure. This lesson is a reflection aid for an authorised context; it does not authorise a learner to coach, supervise, select a horse or exercise, assess health or ability, obtain personal information, make a safeguarding decision, or determine a rider’s support or progression alone.

## Participant-Centred Qualified Coaching

Professional coach standards require participant-centred coaching, suitable adaptation, consideration of age and experience, safety, welfare, safeguarding, communication, and feedback. The qualified coach and responsible person decide how rider needs are identified, which information is necessary, how consent and privacy are handled, what support is suitable, and when specialist guidance is required.

Do not apply a generic rule to children, teenagers, adults, disabled riders, riders with special educational needs, returning riders, or anyone else. A learner’s age, appearance, disclosure, behaviour, or one session does not establish attention, strength, coordination, confidence, anxiety, learning capacity, risk, or a coaching intervention. Observe factual information within the authorised role and report or ask the qualified coach which current procedure applies.

## Communication and Adaptation

Do not label a rider as a visual, auditory, kinaesthetic, anxious, difficult, or “type” learner and then select a generic exercise, demonstration, explanation, no-stirrup activity, lunge work, game, pace, or progression. The qualified coach decides whether a communication method, support, adaptation, or activity is appropriate for the individual rider, horse, task, setting, equipment, and conditions.

If a rider does not understand, appears uncomfortable, feels unsafe, declines an activity, discloses a need, or if the horse, tack, footing, weather, supervision, consent, or safeguarding circumstances become unsuitable, the activity must be paused, adapted, stopped, or escalated under the current qualified procedure. Do not diagnose the cause, promise confidentiality where reporting may be required, collect unnecessary personal information, contact a carer independently, or investigate a safeguarding concern.

## Respectful Rapport and Boundaries

An authorised coach may use respectful communication and encourage riders to ask questions or report discomfort and concern. The exact approach must be individual, professional, and consistent with safeguarding and current site policy. Do not assume that a particular phrase, praise, discussion, or progression creates confidence, trust, or learning for every person.

A learner can prepare for qualified coaching by asking the responsible coach how the current plan addresses rider and horse suitability, support, privacy, consent, safeguarding, safety, welfare, communication, adaptation, incident response, and review. The qualified coach remains responsible for selecting and adapting instruction, feedback, support, and progression.

## Records and Escalation

Only authorised people should create, access, use, store, or share rider records, and only through current privacy, safeguarding, organisational, and legal procedures. A learner should report factual observations promptly through the designated route and follow the stop/escalation instruction rather than creating a profile or action plan independently. Where needs exceed the current qualified coach’s remit, the responsible person should use the approved route to obtain appropriate specialist or organisational support.`,
    keyPoints: [
      "Qualified coaching must adapt to individual rider needs, age, experience, safety, welfare, safeguarding, consent, privacy, and current conditions",
      "Do not assign a learner type or select a generic intervention; the qualified coach adapts communication and support to the individual context",
      "Do not assume a phrase, praise, discussion, or progression will create confidence, trust, or learning for every rider",
      "Pause, stop, adapt, or escalate through the qualified procedure when understanding, consent, safety, welfare, or safeguarding conditions are unsuitable",
      "Only authorised people may create, access, use, store, or share rider records through current privacy, safeguarding, organisational, and legal procedures",
    ],
    safetyNote:
      "Do not coach, supervise, select a horse or activity, obtain learner information, or continue an activity outside your authority and the current qualified coaching procedure. Pause, stop, adapt, or escalate if rider understanding, consent, security, horse welfare or behaviour, tack, footing, weather, supervision, privacy, safeguarding, or emergency arrangements become unsuitable.",
    practicalApplication:
      "Ask a qualified coach how their current procedure identifies and supports rider needs while addressing consent, privacy, safeguarding, safety, welfare, and adaptation. Within an authorised setting, practise reporting factual observations and asking clarifying questions; do not create a rider profile, determine an intervention, or select an activity from this lesson alone.",
    commonMistakes: [
      "Assigning a learner type, cause, health status, confidence level, or support need from a generic observation",
      "Giving instruction, selecting a horse or activity, or changing a progression outside an authorised qualified-coaching role",
      "Creating, accessing, using, storing, or sharing rider information outside the current privacy, safeguarding, organisational, and legal procedure",
    ],
    knowledgeCheck: [
      {
        question:
          "Who determines how coaching is adapted for an individual rider, including a child or a rider with a disclosed additional need?",
        options: [
          "Any learner using an age-based generic rule",
          "The qualified coach within current responsible-person, privacy, safeguarding, safety, and welfare arrangements",
          "A fixed online profile",
          "The rider’s appearance alone",
        ],
        correctIndex: 1,
        explanation:
          "Professional coaching standards require participant-centred adaptation that considers individual needs, age and experience while maintaining safety, welfare, safeguarding, consent, and current procedures.",
      },
      {
        question:
          "What should happen if a rider does not understand, declines an activity, feels unsafe, or if conditions become unsuitable?",
        options: [
          "Continue using a generic alternative exercise",
          "Label the rider’s learning style and decide a correction",
          "Pause, stop, adapt, or escalate through the current qualified coaching procedure",
          "Collect personal information and create an independent profile",
        ],
        correctIndex: 2,
        explanation:
          "A generic lesson cannot determine the cause of a concern or the correct support. The current qualified coach and responsible-person procedure determine whether the activity is paused, adapted, stopped, or escalated.",
      },
      {
        question: "How should a learner handle rider information and observations?",
        options: [
          "Create and share a personal profile with anyone who helps on the yard",
          "Use only the current authorised privacy, safeguarding, organisational, and legal procedure, and report factual observations through the designated route",
          "Promise absolute confidentiality in all circumstances",
          "Infer a support plan from one conversation",
        ],
        correctIndex: 1,
        explanation:
          "Only authorised people may create, access, use, store, or share rider records. Safeguarding and privacy requirements may require a designated reporting route rather than confidentiality or independent action.",
      },
    ],
    aiTutorPrompts: [
      "Which current qualified procedure governs adaptation, privacy, consent, safeguarding, safety, welfare, and escalation for individual rider needs?",
      "How should I report a factual rider, horse, tack, footing, consent, privacy, or safety concern to the qualified coach?",
      "What authority, safeguarding, privacy, and current site procedure are required before I coach or supervise a rider?",
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
      "Recognise that beginner lesson planning requires appropriate qualification, authority, risk assessment, safeguarding, and current site procedures",
      "Understand that a qualified coach adapts preparation, activity, recovery, support, and review to the individual context",
      "Recognise that assessment-specific timings do not create a universal lesson duration or phase allocation",
      "Prepare appropriate questions for a qualified coach about objectives, suitability, risk, welfare, safeguarding, progression, and evaluation",
    ],
    content: `Riding ability does not by itself authorise someone to plan or teach a beginner lesson. Professional coaching requires appropriate qualification, authority, safeguarding, current legal and site procedures, responsible-person arrangements, horse-and-rider suitability, risk assessment, welfare, suitable equipment, and an environment appropriate to the activity. This lesson is a reflection aid for an authorised context; it does not qualify the learner to select a horse, plan or deliver an activity, set a duration, assess health or readiness, supervise a rider, manage an incident, or make a welfare, safeguarding, medical, legal, or emergency decision.

## Qualified Lesson Planning in Context

Professional coaching standards require plans to address risk assessment, aims and objectives, equipment, preparation, activity, cool-down, conclusion, feedback, progression, adaptation, evaluation, and horse/rider suitability. The qualified coach and responsible person decide whether those elements are appropriate for the individual rider, horse, discipline, task, setting, weather, footing, equipment, supervision, safeguarding, and current conditions.

A qualified plan may include preparation, a main activity, recovery or cool-down, and a conclusion, but it is not a universal three-phase template. The content, sequence, duration, exercise, pace, support, review, and stopping point are individual decisions. Assessment-specific durations or timings from a coaching qualification must not be turned into a public universal lesson duration or percentage allocation.

## Risk, Welfare, and Suitability

The qualified coach must assess and respond to the current horse, rider, equipment, environment, risk, welfare, safety, safeguarding, and support needs. A learner must not use a generic lesson to decide that a horse is suitable, that a rider is ready, that a warm-up, exercise, transition, no-stirrup activity, pace, circle, game, or cool-down is appropriate, or that an observed concern has a particular cause.

If the rider does not understand, feels unsafe, declines an activity, appears uncomfortable or distressed, or if the horse, tack, footing, weather, supervision, consent, safeguarding, or emergency arrangements become unsuitable, the activity must be paused, adapted, stopped, or escalated through the current qualified procedure. Do not continue to a planned next phase because a predetermined time, objective, or plan says so.

## Aims, Progression, and Adaptation

A qualified coach may select aims, progressive activities, communication, support, feedback, and adaptations that meet the rider’s needs while maintaining horse welfare and safety. Do not assume one objective, exercise sequence, or progression is appropriate for every beginner. Do not label a rider’s response as anxiety, fatigue, lack of confidence, poor coordination, or a behavioural cause from a generic observation.

An authorised learner can prepare by asking the qualified coach how the current plan addresses suitability, risk, welfare, safeguarding, equipment, communication, support, adaptation, incident response, progression, review, and evaluation. Report factual observations through the designated route and follow the current stop/escalation instruction rather than selecting a substitute activity or progression independently.

## Records and Review

Only authorised people may create, access, use, store, or share lesson or rider records through current privacy, safeguarding, organisational, and legal procedures. The qualified coach remains responsible for reviewing the session and determining any next step. Where the current coach’s remit or information is insufficient, the responsible organisation should use the approved route to obtain appropriate support before an activity resumes.`,
    keyPoints: [
      "Professional lesson planning requires qualified consideration of risk, aims, suitability, equipment, preparation, activity, recovery, conclusion, adaptation, and evaluation",
      "Preparation, main activity, recovery, and conclusion are context-specific; no universal phase structure, exercise, duration, or percentage applies to every lesson",
      "A qualified coach selects aims, support, progression, communication, and adaptation for the individual while maintaining safety and welfare",
      "Do not use a generic plan to decide horse/rider suitability, readiness, medical or behavioural cause, or a safe next exercise",
      "Only authorised people may create, access, use, store, or share lesson or rider records under current privacy, safeguarding, organisational, and legal procedures",
    ],
    safetyNote:
      "Do not plan, coach, supervise, select a horse or activity, set a duration, assess suitability, or continue an activity outside your authority and the current qualified procedure. Pause, stop, adapt, or escalate if rider understanding, consent, security, horse welfare or behaviour, tack, footing, weather, supervision, safeguarding, privacy, or emergency arrangements become unsuitable.",
    practicalApplication:
      "Ask a qualified coach how their current plan addresses horse/rider suitability, risk, welfare, safeguarding, equipment, preparation, activity, recovery, communication, support, adaptation, progression, review, and evaluation. Within an authorised setting, practise reporting factual observations and asking clarifying questions; do not write, deliver, or alter a beginner lesson from this lesson alone.",
    commonMistakes: [
      "Assuming that a fixed phase sequence, duration, percentage, objective, or exercise is safe or appropriate for every beginner lesson",
      "Selecting a horse, activity, progression, timing, support, or adaptation outside an authorised qualified-coaching role",
      "Creating, accessing, using, storing, or sharing lesson or rider records outside current privacy, safeguarding, organisational, and legal procedures",
    ],
    knowledgeCheck: [
      {
        question:
          "Who determines the appropriate lesson structure, activity sequence, support, duration, and progression for a beginner rider?",
        options: [
          "Any experienced rider using a fixed online template",
          "The qualified coach within the current responsible-person, safety, welfare, safeguarding, and site procedures",
          "The planned duration alone",
          "The rider’s wish to progress to a faster pace",
        ],
        correctIndex: 1,
        explanation:
          "Professional planning requires qualified consideration of risk, suitability, welfare, equipment, activity, adaptation, progression, and evaluation. Assessment-specific timings are not universal public coaching rules.",
      },
      {
        question:
          "What should occur if rider understanding, consent, security, horse welfare, tack, footing, weather, supervision, safeguarding, or emergency arrangements become unsuitable?",
        options: [
          "Continue because the planned objective is not complete",
          "Use a generic substitute exercise without consulting the coach",
          "Pause, stop, adapt, or escalate through the current qualified procedure",
          "Diagnose the cause from a generic lesson plan",
        ],
        correctIndex: 2,
        explanation:
          "A generic lesson cannot determine the cause of a concern or the correct activity. The current qualified coach and responsible-person procedure determine whether the plan is paused, adapted, stopped, or escalated.",
      },
      {
        question:
          "How should a learner handle lesson or rider records?",
        options: [
          "Create a personal record and share it with any yard helper",
          "Use only the current authorised privacy, safeguarding, organisational, and legal procedure",
          "Store notes on a personal device without permission",
          "Write a profile based on one lesson observation",
        ],
        correctIndex: 1,
        explanation:
          "Only authorised people may create, access, use, store, or share lesson or rider records. The qualified coach remains responsible for review and next-step decisions.",
      },
    ],
    aiTutorPrompts: [
      "Which current qualified procedure governs planning, risk, welfare, safeguarding, support, adaptation, timing, progression, and review for a beginner lesson?",
      "How should I report a factual rider, horse, tack, footing, consent, privacy, or safety concern to the qualified coach?",
      "What qualification, authority, safeguarding, privacy, and current site procedure are required before I plan, coach, or supervise a beginner rider?",
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
      "Recognise that coaching communication requires appropriate qualification, authority, safeguarding, and current site procedures",
      "Understand that a qualified coach adapts communication and feedback to the individual rider, horse, activity, and conditions",
      "Use factual observation and qualified-coach escalation rather than assigning a learner type or diagnosing a cause",
      "Prepare appropriate questions about communication, feedback, safety, welfare, and safeguarding for a qualified coach",
    ],
    content: `Riding ability does not by itself authorise someone to coach. Professional coaching requires the appropriate qualification, authority, safeguarding, current legal and site procedures, rider and horse suitability, safety, welfare, and responsible-person arrangements. This lesson is a reflection aid for an authorised coaching context; it does not qualify the learner to instruct, supervise, select an activity, assess a rider or horse, manage an incident, or make safeguarding, medical, legal, welfare, or emergency decisions.

## Qualified Communication in Context

Professional coach standards require effective verbal and non-verbal communication, demonstrations, coach positioning, rapport, motivation, receiving and providing feedback, participant-centred adaptation, safety, horse welfare, and safeguarding. The qualified coach decides what language, timing, demonstration, support, question, feedback, pause, and escalation route are appropriate for the individual rider, horse, activity, environment, and current conditions.

A learner may prepare by asking the qualified coach what the current communication and safety plan requires. If a rider does not understand, feels unsafe, uncomfortable, nervous, or distressed—or if the horse, tack, footing, weather, supervision, consent, safeguarding, or environment becomes unsuitable—the activity must be paused, adapted, stopped, or escalated under the current qualified procedure.

## Feedback Is Individual, Not a Formula

There is no universal feedback sequence, “sandwich,” timing interval, correction cue, or emotional outcome. A qualified coach must consider the rider’s needs, age, experience, communication preferences, culture, disability or health needs where disclosed and relevant, task, horse welfare, safeguarding, and safety. Do not assume that praise, criticism, imagery, repetition, silence, a question, or a demonstration will have the same effect for every person.

A learner should not label someone as a visual, auditory, kinaesthetic, anxious, disruptive, or difficult “type” and then select a generic intervention. Observe and report factual information within the authorised role. The coach should adapt communication and support appropriately and may seek further qualified guidance where required.

## Questions and Boundaries

A qualified coach may use questions to check understanding, invite reflection, or clarify what the rider noticed, but questions must be suitable for the moment and must not distract from safety. Do not use a question to diagnose a horse’s behaviour, rider’s health, tack fit, welfare, or the cause of a movement concern. Stop and follow the escalation route if a concern arises.

Tone, body language, and communication should remain respectful and consistent with safeguarding and current site requirements. Do not shout, intimidate, promise confidentiality where reporting may be required, conduct a safeguarding investigation, or continue an activity when communication or conditions are no longer safe.

## Reflecting Within Your Role

Within an authorised setting, a learner can practise neutral, factual communication: say when they do not understand, identify a safety concern, report what was observed, and ask the qualified coach which current instruction or procedure applies. The qualified coach remains responsible for selecting and adapting communication, feedback, instruction, and progression.`,
    keyPoints: [
      "Professional communication, feedback, demonstration, positioning, adaptation, safety, welfare, and safeguarding require qualified-coach responsibility",
      "No universal feedback formula, timing, cue, or emotional outcome applies to every learner or context",
      "Do not label a learner type or infer a cause; use factual observation and the qualified coach’s individual adaptation",
      "A qualified coach decides whether a question is suitable and safe in the current activity; questions must not replace safety-critical instruction",
      "Tone, body language, communication, and feedback must remain respectful and consistent with safeguarding and current site procedures",
    ],
    safetyNote:
      "Do not coach, supervise, give safety-critical instruction, select a communication method, or continue an activity outside your authority and the current qualified coaching procedure. Pause, stop, or escalate if communication, rider security, consent, horse welfare or behaviour, tack, footing, weather, supervision, safeguarding, or emergency arrangements become unsuitable.",
    practicalApplication:
      "Ask a qualified coach how their current communication and feedback approach addresses the individual rider, horse, activity, safety, welfare, safeguarding, support, and escalation route. Within an authorised setting, practise reporting factual observations and asking clarifying questions; do not coach, diagnose, or select an intervention from this lesson alone.",
    commonMistakes: [
      "Assuming that a fixed amount, sequence, or timing of feedback is safe or effective for every rider and activity",
      "Labelling a learner or inferring a psychological, medical, biomechanical, welfare, tack, or behavioural cause from a generic observation",
      "Giving instruction, feedback, or a communication intervention outside an authorised qualified-coaching role",
      "Using questions or discussion in a way that distracts from immediate safety or current qualified instruction",
      "Ignoring a change in rider understanding, consent, security, horse welfare, or safeguarding conditions that requires pause or escalation",
    ],
    knowledgeCheck: [
      {
        question: "Who decides whether a feedback approach, question, or communication cue is suitable for a rider?",
        options: [
          "Any experienced rider using a fixed feedback formula",
          "The qualified coach within the current responsible-person and safeguarding arrangements",
          "The rider alone while moving at any pace",
          "A generic learning-style label",
        ],
        correctIndex: 1,
        explanation:
          "Professional coaching standards require communication, feedback, adaptation, safety, welfare, and safeguarding that meet the individual rider’s needs in the current activity.",
      },
      {
        question: "What should happen if a rider does not understand, feels unsafe, or if the horse, tack, footing, or conditions become unsuitable?",
        options: [
          "Continue the activity while trying a different generic feedback cue",
          "Pause, stop, adapt, or escalate through the current qualified coaching procedure",
          "Diagnose the rider or horse from the observation",
          "Ignore the concern if the planned lesson has not finished",
        ],
        correctIndex: 1,
        explanation:
          "A generic lesson cannot diagnose the cause of a concern. The current qualified coach and responsible-person arrangements determine whether the activity is paused, adapted, stopped, or escalated.",
      },
    ],
    aiTutorPrompts: [
      "Which current communication, feedback, safety, welfare, safeguarding, and escalation questions should I discuss with a qualified coach?",
      "How should I report a factual rider, horse, tack, footing, or safety concern to the qualified coach?",
      "What authority, safeguarding, and current site procedure are required before I coach or supervise a rider?",
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
      "Recognise that approach and catching require individual-horse assessment, qualified instruction, and current site procedures",
      "Use factual observation and appropriate escalation rather than diagnosing horse behaviour or applying a fixed handling method",
      "Understand that a qualified handler must select, check, fit, and use the appropriate headcollar and lead rope for the individual horse",
      "Know when to stop and seek responsible-person or experienced-handler support rather than pursuing, restraining, or treating a horse independently",
    ],
    content: `Approaching and catching a horse are handling activities that require individual-horse assessment, qualified instruction, appropriate equipment, supervision, and current site procedures. Horses may respond quickly to changes in their surroundings; a generic lesson cannot predict a particular horse’s behaviour, diagnose fear or aggression, establish a blind-spot distance, decide that a horse is safe to approach, or replace the responsible person, experienced handler, veterinarian, or emergency procedure.

## Before Entering the Horse’s Space

The responsible person or qualified handler must decide whether the horse, location, group of horses, task, equipment, handler experience, support, footing, weather, gates, and current conditions are suitable. Do not enter a stable, field, pen, or other enclosure, approach a horse, or attempt catching if you do not have permission, instruction, a safe route, or the required support.

Penn State Extension advises a slow, confident approach from the front toward the shoulder, speaking to the horse and avoiding approach from the rear. The exact route and position must be demonstrated by a qualified handler for that horse and setting. Make sure the horse knows where you are; do not run, surprise the horse, stand directly in front of it, put yourself behind it, block its escape route, or rely on a generic body-language rule.

## Equipment and Headcollar Safety

Before handling, a qualified person should check that the headcollar and lead rope are in suitable condition and fit appropriately for the individual horse. Follow the equipment instructions, site procedure, and qualified handler’s demonstrated method; do not use a fixed finger measurement, copied fitting rule, or one side of the horse as a universal instruction. Penn State describes approaching calmly, placing the halter over the muzzle, and fastening it carefully; a learner should practise this only under appropriate qualified supervision.

Use a lead rope attached to the appropriate halter or bridle connection as directed. Never wrap a lead rope around your hand or body, and do not allow excess rope to create an entanglement hazard. The qualified handler should teach the individual method for holding, leading, turning, releasing, and responding to a horse movement. Do not hold the horse by the headcollar alone or try to overpower a horse.

## Field and Group Contexts

Horses in a field or group can respond to each other and the environment. If a horse moves away, is alert, appears uncomfortable, pins its ears, changes body position, becomes difficult to control, or if you are unsure, stop at a safe position and obtain experienced-handler support. Do not chase, corner, use food, separate horses, enter a smaller area, restrain, or attempt a “difficult horse” method from this lesson. These actions can create additional risks for people and horses.

The University of Kentucky and Mississippi State materials support controlled handling and responsible release practices, but release or turnout must follow the local procedure and an experienced person’s instruction. It is outside this lesson’s scope to teach an individual release process.

## Stop and Escalate

Pause, move to safety as directed, and seek the responsible person or qualified handler if the horse, handler, equipment, gate, surface, environment, supervision, consent, welfare, or emergency arrangements are unsuitable. Do not diagnose the cause, punish a horse, continue alone, or use advice from a generic lesson as a substitute for in-person instruction.`,
    keyPoints: [
      "Approach and catching require individual-horse assessment, qualified instruction, appropriate equipment, supervision, and current site procedures",
      "Penn State Extension advises a slow approach from the front toward the shoulder while making sure the horse knows where the handler is; the exact route is context-specific",
      "Do not rely on generic body-language, eye-contact, blind-spot, distance, or horse-behaviour rules to decide that an approach is safe",
      "A qualified person must select, inspect, fit, and use the appropriate headcollar and lead rope for the individual horse and setting",
      "Stop and seek responsible-person or experienced-handler support if a horse moves away, appears unsettled, or cannot be approached or caught safely",
    ],
    safetyNote:
      "Never wrap a lead rope around your hand or body, allow excess rope to create an entanglement hazard, hold a horse by the headcollar alone, or try to overpower a horse. Pause, move to safety as directed, and obtain qualified help if handling conditions are unsuitable.",
    practicalApplication:
      "Only under qualified supervision and the responsible person’s current procedure, observe an experienced handler’s approach and equipment check for a suitable horse. Ask how the current horse, setting, equipment, group context, safety route, and escalation process were assessed. Do not approach, catch, release, pursue, separate, or restrain a horse from this lesson alone.",
    commonMistakes: [
      "Approaching, catching, releasing, or entering a stable, field, pen, or other enclosure without permission, instruction, a safe route, or required support",
      "Using a generic body-language, eye-contact, distance, equipment-fitting, or horse-behaviour rule as proof that an approach is safe",
      "Wrapping a lead rope around the hand or body, allowing an entanglement hazard, holding a horse by the headcollar alone, or trying to overpower a horse",
      "Chasing, cornering, using food, separating horses, entering a smaller area, restraining, punishing, or using a ‘difficult horse’ method without qualified direction",
      "Selecting, fitting, checking, leading, turning, releasing, or responding to a horse movement without the individual qualified method and current procedure",
    ],
    knowledgeCheck: [
      {
        question:
          "What should be established before someone approaches or catches a horse?",
        options: [
          "That the person has watched a generic lesson",
          "Individual-horse assessment, qualified instruction, appropriate equipment, supervision, a safe route, and current site procedures",
          "That the horse was easy to handle yesterday",
          "That the handler can use a treat if needed",
        ],
        correctIndex: 1,
        explanation:
          "Approach and catching are context-specific. The responsible person or qualified handler must assess the individual horse, location, support, equipment, and conditions before the activity begins.",
      },
      {
        question:
          "What should happen if a horse moves away, appears unsettled, or cannot be approached or caught safely?",
        options: [
          "Chase, corner, or restrain the horse using a generic method",
          "Use food or move the horse into a smaller area without instruction",
          "Stop at a safe position and obtain responsible-person or experienced-handler support",
          "Assume the horse is testing the handler and continue alone",
        ],
        correctIndex: 2,
        explanation:
          "A generic lesson cannot identify the cause of a horse’s behaviour or authorise a catching method. Stop and obtain qualified support rather than escalating the situation.",
      },
    ],
    aiTutorPrompts: [
      "What current responsible-person and qualified-handler procedure applies if a horse cannot be approached or caught safely?",
      "How should I report a factual horse, equipment, field, gate, footing, welfare, or safety concern to the qualified handler?",
      "What authority, instruction, equipment check, supervision, and current site procedure are required before I approach, catch, lead, or release a horse?",
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
      "Recognise that tying requires individual-horse assessment, qualified instruction, appropriate equipment, and current site emergency procedures",
      "Understand that the responsible person or qualified handler must select and inspect the tie point, equipment, and supervision for the individual context",
      "Recognise that breakaway arrangements and knot choice are site- and equipment-specific safety decisions, not universal instructions",
      "Know when to move to safety and obtain experienced-handler or emergency support rather than attempting a pull-back remedy independently",
    ],
    content: `Tying a horse is a handling activity that requires individual-horse assessment, qualified instruction, appropriate equipment, active supervision, and current site emergency procedures. A generic lesson cannot decide whether a horse is safe to tie, identify the cause of a pull-back, select an appropriate tie point or breakaway arrangement, guarantee that any knot will release in an emergency, or replace the responsible person, experienced handler, veterinarian, or emergency response.

## Before a Horse Is Tied

The responsible person or qualified handler must assess the horse, handling history, location, tie point, equipment condition, rope material and length, surrounding hazards, supervision, access, group context, weather, footing, welfare, and emergency arrangements. Do not tie a horse, select a location, alter equipment, or practise a knot if you do not have current permission, in-person instruction, and the required support.

Mississippi State Extension describes using a quick-release knot as part of safe tying practice and explains that a sturdy tie point and an appropriate amount of rope can reduce entanglement risk. Its approximate examples are context-specific; they are not a universal height, length, or equipment prescription. A qualified handler must demonstrate the knot, tie point, rope handling, supervision, emergency release, and any site-specific breakaway arrangement for the individual horse and setting.

## Knot and Equipment Boundaries

A quick-release knot may be appropriate when it is selected and taught by the qualified handler under the current site procedure. Do not claim that it is the only acceptable knot, copy a sequence from text alone, assume it can be released instantly under load, or use a knot as a substitute for supervision and emergency planning. The handler must know the site’s designated emergency response before tying begins.

Do not use a fixed centimetre measurement, an “eye-level” rule, baler twine, cross-tie, fixed ring, bridle rein, rope, or breakaway material as a universal recommendation. The responsible person must select equipment that is in good condition and appropriate to the horse, task, tie point, local procedure, and current risks. Never wrap rope around the hand or body, leave it where it may entangle a person or horse, or use damaged equipment.

## If a Horse Pulls Back or Becomes Unsettled

If a horse becomes tense, pulls back, moves unexpectedly, entangles equipment, or conditions change, do not punish, hold against the horse, lengthen a rope, start a training session, or attempt a self-directed remedy from this lesson. Move to safety as directed, follow the current emergency procedure, and obtain the responsible person or an experienced handler. Call emergency or veterinary support when the current procedure requires it.

## Supervision and Review

A tied horse requires the supervision and safety arrangements set by the responsible person. Do not assume a generic maximum unattended time, “short session,” repeated practice count, or progress schedule is safe. Use factual observation and ask the qualified handler how the tie point, equipment, horse suitability, supervision, welfare checks, and stop/escalation route were assessed.`,
    keyPoints: [
      "Tying requires individual-horse assessment, qualified instruction, appropriate equipment, active supervision, and current site emergency procedures",
      "A qualified handler must select and demonstrate the appropriate tie point, rope handling, knot, equipment, supervision, and emergency release for the individual context",
      "Do not treat a fixed height, length, knot, rope, breakaway material, baler twine, or tie point as a universal recommendation",
      "Follow the responsible person’s current supervision and welfare arrangements; no generic unattended-time rule applies to every horse and setting",
      "If a horse becomes tense, pulls back, moves unexpectedly, or entangles equipment, move to safety as directed and obtain experienced-handler or emergency support",
    ],
    safetyNote:
      "Do not tie, alter equipment, choose a knot, or attempt a pull-back remedy outside the current qualified handling and emergency procedure. Never wrap rope around the hand or body, use damaged equipment, or continue if horse behaviour, welfare, tie point, equipment, supervision, or emergency arrangements are unsuitable.",
    practicalApplication:
      "Only under qualified in-person instruction and the responsible person’s current procedure, observe how the appropriate tie point, equipment, knot, supervision, emergency release, welfare checks, and escalation route are selected. Do not practise knot tying, tie a horse, test an emergency release, or respond to a pull-back from this lesson alone.",
    commonMistakes: [
      "Using a knot, tie point, rope, breakaway material, height, length, or equipment arrangement without the individual qualified method and current site procedure",
      "Assuming a fixed rope measurement, eye-level reference, or generic unattended-time rule applies to every horse and setting",
      "Copying a breakaway, baler-twine, cross-tie, or emergency-release arrangement without qualified assessment of the horse, tie point, equipment, and current risks",
      "Continuing to tie or attempting a self-directed pull-back remedy when horse behaviour, welfare, equipment, tie point, supervision, or emergency arrangements are unsuitable",
      "Wrapping rope around the hand or body, allowing entanglement, using damaged equipment, punishing a horse, or trying to hold against the horse",
    ],
    knowledgeCheck: [
      {
        question: "Who decides the appropriate tie point, knot, rope handling, breakaway arrangement, supervision, and emergency release for a horse?",
        options: [
          "Any learner using a generic online measurement or knot diagram",
          "The responsible person or qualified handler after assessing the individual horse, equipment, location, risks, and current site procedure",
          "The horse’s previous tie arrangement alone",
          "A fixed baler-twine rule",
        ],
        correctIndex: 1,
        explanation:
          "Tying arrangements are context-specific. A generic lesson cannot select a safe knot, tie point, breakaway material, height, length, or supervision plan for every horse and setting.",
      },
      {
        question: "What should happen if a tied horse becomes tense, pulls back, moves unexpectedly, or entangles equipment?",
        options: [
          "Hold against the horse and add more rope",
          "Punish the horse or begin a training session alone",
          "Move to safety as directed, follow the current emergency procedure, and obtain responsible-person or experienced-handler support",
          "Assume a generic knot will solve the problem",
        ],
        correctIndex: 2,
        explanation:
          "A pull-back or entanglement can become an emergency. Do not use a generic remedy; move to safety, follow the current procedure, and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current qualified-handler and site procedure governs tying, supervision, emergency release, and escalation for this individual horse?",
      "How should I report a factual tie-point, equipment, rope, horse-welfare, behaviour, or safety concern to the responsible person?",
      "What authority, in-person instruction, equipment check, supervision, and emergency procedure are required before I tie a horse?",
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
      "Recognise that lungeing is a specialist handling activity requiring qualified professional competence, individual assessment, and current site procedures",
      "Understand that a qualified professional must select, inspect, fit, and adjust equipment, protective equipment, circle, environment, and support for the individual horse",
      "Recognise that handler, horse, line, whip, command, and position techniques require in-person qualified instruction rather than a fixed diagram",
      "Know when to stop, move to safety, and obtain qualified or emergency support rather than attempting lungeing or a correction independently",
    ],
    content: `Lungeing is a specialist horse-handling activity in which a horse works on a circle around a qualified handler. It requires in-person professional competence, individual-horse assessment, appropriate personal protective equipment, current site procedures, welfare checks, equipment inspection and fit, suitable space and surface, active supervision, and an emergency plan. This lesson does not qualify a learner to lunge, assess movement, choose equipment, select a circle, use a whip, apply pressure, direct a horse, train a horse, or make a welfare, medical, veterinary, behavioural, or emergency decision.

## Qualified Scope and Welfare

Professional lungeing standards include horse welfare, handler protective equipment, equipment safety and fit, appropriate circle size, handler position, horse position and balance, use of commands and aids, duration, surroundings, and progression. These are professional competencies assessed in context, not a universal self-teaching sequence. A lunge line, whip, cavesson, headcollar, side rein, protective equipment, line length, circle size, surface, pace, command, and duration must be selected by the qualified professional for the individual horse, task, environment, and current conditions.

A learner must not infer that lungeing is required for warm-up, exercise, training, assessment, behaviour management, “freshness,” rider preparation, rehabilitation, or any other purpose. The appropriate purpose, if any, is decided by the qualified professional after considering the individual horse’s health, welfare, training, behaviour, fitness, equipment, space, surface, weather, support, and current risk.

## Equipment, Space, and Position

Before any lungeing activity, the responsible person or qualified professional must inspect the equipment and setting, decide whether the horse and handler are suitable, identify the safe working area and access, establish supervision and emergency arrangements, and determine whether the activity should take place at all. Do not rely on a generic line length, triangle diagram, whip position, command word, “centre” position, distance, circle size, or equipment list.

The handler should receive in-person instruction for the individual method of holding and managing the line, using any whip or aid, communicating, moving, maintaining awareness of surroundings, and responding to a horse change. Never wrap a lunge line around the hand or body, allow it to create an entanglement hazard, use equipment beyond your competence, stand in an unsafe position, or use a whip to punish or force a horse.

## Progression, Time, and Assessment

Professional standards consider circle size, paces, transitions, responsiveness, equipment adjustment, duration, surroundings, and horse welfare. No fixed number of minutes, paces, exercises, progressions, or assessment method is appropriate for every horse. A learner must not copy a session, judge movement quality, or adjust equipment based on a generic lesson.

## Stop and Escalate

Stop, move to safety as directed, and obtain the responsible person or qualified professional if the horse becomes unsettled, difficult to control, uncomfortable, lame, distressed, or unsafe; equipment, surface, weather, space, gate, support, supervision, welfare, or emergency arrangements change; or the learner is unsure. Follow the current emergency procedure and obtain veterinary or emergency support when required.`,
    keyPoints: [
      "Lungeing is a specialist handling activity requiring qualified professional competence, individual assessment, welfare checks, equipment inspection, suitable space, active supervision, and emergency planning",
      "A qualified professional selects and fits any line, whip, cavesson, headcollar, protective equipment, circle, surface, pace, command, and duration for the individual horse and current conditions",
      "Handler, horse, line, whip, command, and position techniques require in-person qualified instruction rather than a fixed diagram or cue",
      "Do not infer that lungeing is required for a particular purpose or use a generic lesson to assess movement, behaviour, fitness, welfare, or a safe progression",
      "Never wrap the lunge line around the hand or body, allow an entanglement hazard, use equipment beyond competence, stand in an unsafe position, or use a whip to punish or force a horse",
    ],
    safetyNote:
      "Do not lunge, direct a horse, choose or adjust equipment, select a circle or duration, judge movement, or continue an activity outside qualified professional instruction and the current site procedure. Stop, move to safety as directed, and obtain qualified or emergency support if horse behaviour, welfare, equipment, surface, space, support, supervision, or emergency arrangements are unsuitable.",
    practicalApplication:
      "Only under qualified in-person professional instruction and the responsible person’s current procedure, observe how the horse, handler, equipment, protective equipment, space, surface, circle, welfare, supervision, duration, and emergency route are assessed. Do not lunge, copy a session, use a line or whip, direct a horse, or adjust equipment from this lesson alone.",
    commonMistakes: [
      "Lungeing, directing a horse, selecting or adjusting equipment, choosing a circle, surface, duration, pace, or progression outside qualified professional instruction and the current procedure",
      "Using a fixed triangle, whip position, command, line length, circle size, pace, duration, or equipment list as a universal technique",
      "Wrapping the lunge line around the hand or body, allowing entanglement, standing in an unsafe position, or using a whip to punish or force a horse",
      "Assessing movement, behaviour, fitness, welfare, lameness, or a horse’s training needs from a generic lungeing observation",
      "Continuing when horse behaviour, welfare, equipment, surface, space, weather, support, supervision, or emergency arrangements are unsuitable",
    ],
    knowledgeCheck: [
      {
        question: "Who determines whether lungeing is appropriate and how the horse, handler, equipment, protective equipment, space, circle, duration, and emergency arrangements are managed?",
        options: [
          "Any learner using a generic triangle diagram",
          "The qualified professional and responsible person after individual assessment and current risk review",
          "A copied lunge-line length",
          "The horse’s previous session alone",
        ],
        correctIndex: 1,
        explanation: "Professional lungeing standards require individual assessment, welfare, equipment safety and fit, handler position, safe control, space, circle, duration, surroundings, and emergency planning. A generic lesson cannot select a safe protocol.",
      },
      {
        question: "What should happen if a lungeing activity becomes unsafe, the horse is unsettled or uncomfortable, or equipment, space, surface, supervision, or emergency conditions change?",
        options: [
          "Continue until the planned duration has finished",
          "Use more force or a larger whip movement",
          "Stop, move to safety as directed, and obtain qualified or emergency support through the current procedure",
          "Diagnose the horse and adjust the equipment alone",
        ],
        correctIndex: 2,
        explanation: "A lungeing concern may require qualified or emergency action. Do not use a generic technique; follow the current procedure and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current qualified-professional and site procedure applies if a horse cannot be lunged safely or becomes unsettled?",
      "How should I report a factual horse-welfare, equipment, surface, space, handler-safety, or emergency concern to the responsible person?",
      "What authority, in-person instruction, protective equipment, equipment check, supervision, welfare, and emergency procedure are required before any lungeing activity?",
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
      "Recognise that long-reining is a specialist handling activity requiring qualified professional competence, individual assessment, and current site procedures",
      "Understand that a qualified professional must select, inspect, fit, and use equipment, protective equipment, space, environment, and support for the individual horse",
      "Recognise that handler position, line management, communication, and horse-response techniques require in-person qualified instruction rather than a fixed learner method",
      "Know when to stop, move to safety, and obtain qualified or emergency support rather than attempting long-reining or a correction independently",
    ],
    content: `Long-reining is a specialist horse-handling activity that may involve long lines and a horse’s response to handling from the ground. It requires in-person qualified professional competence, individual-horse assessment, appropriate equipment and protective equipment, current site procedures, welfare checks, suitable space and surface, active supervision, and an emergency plan. This lesson does not qualify a learner to long-rein, select equipment, position themselves, manage lines, guide a horse, train a horse, assess movement, choose a circle or route, apply pressure, decide a progression, or make a welfare, medical, veterinary, behavioural, or emergency decision.

## Evidence and Scope Boundary

The reviewed professional coaching standard requires qualified assessment of horse and rider suitability, equipment, environment, risks, safety, welfare, safeguarding, response to concerns or emergencies, and reporting for support. It does not provide a public long-reining procedure, equipment configuration, line length, attachment point, handler position, contact, distance, turn, transition, training purpose, or progression protocol. Therefore, this lesson deliberately does not teach those actions.

A learner must not infer that long-reining is suitable for a young, unfamiliar, nervous, recovering, fresh, trained, or any other horse; is required for training, exercise, rehabilitation, behaviour management, assessment, or rider preparation; or is safer because the handler is on the ground. Only the qualified professional and responsible person can decide whether it is appropriate after reviewing the individual horse, task, equipment, environment, welfare, fitness, health information available to them, handler competence, support, weather, footing, access, and current risk.

## Equipment, Space, and Handler Safety

Before any specialist ground-handling activity, the responsible person or qualified professional must inspect the equipment and setting, identify the safe working area and access, establish supervision and emergency arrangements, and decide whether the activity should take place at all. Do not rely on a generic line length, attachment point, rein route, surcingle, stirrup, headcollar, bit, cavesson, handler location, distance, surface, enclosure, communication cue, or exercise sequence.

The handler must receive in-person instruction for the individual method of handling any line, maintaining awareness of surroundings, communicating, moving, responding to the horse, and using safety equipment. Never wrap lines around the hand or body, allow an entanglement hazard, use equipment beyond your competence, place yourself in an unsafe position, or attempt to hold or force a horse through a response.

## Stop and Escalate

Stop, move to safety as directed, and obtain the responsible person or qualified professional if the horse becomes unsettled, difficult to control, uncomfortable, lame, distressed, or unsafe; equipment, surface, weather, space, gate, support, supervision, welfare, safeguarding, or emergency arrangements change; or the learner is unsure. Follow the current emergency procedure and obtain veterinary or emergency support when required.

## Learning Boundary

Use this lesson to prepare questions for a qualified professional, not to copy a method. Ask how the horse, handler, equipment, protective equipment, space, welfare, supervision, emergency route, and stop/escalation criteria are assessed for the current situation.`,
    keyPoints: [
      "Long-reining is a specialist handling activity requiring qualified professional competence, individual assessment, welfare checks, appropriate equipment, suitable space, active supervision, and emergency planning",
      "The reviewed professional standard does not provide a public long-reining equipment configuration, line length, attachment point, handler position, contact, or training protocol",
      "A qualified professional must decide whether long-reining is appropriate and select the individual horse, handler, equipment, setting, support, welfare, and safety method",
      "Handler position, line management, communication, horse response, exercise, route, duration, and progression require in-person qualified instruction rather than a generic learner method",
      "Stop, move to safety as directed, and obtain qualified or emergency support when horse behaviour, welfare, equipment, surface, space, support, supervision, safeguarding, or emergency arrangements are unsuitable",
    ],
    safetyNote:
      "Do not long-rein, manage lines, select or adjust equipment, choose a route or duration, guide a horse, judge movement, or continue an activity outside qualified professional instruction and the current site procedure. Never wrap lines around the hand or body or allow an entanglement hazard. Stop, move to safety as directed, and obtain qualified or emergency support if conditions are unsuitable.",
    practicalApplication:
      "Only under qualified in-person professional instruction and the responsible person’s current procedure, observe how the individual horse, handler, equipment, protective equipment, space, surface, welfare, supervision, and emergency route are assessed. Do not long-rein, copy a configuration, manage lines, direct a horse, or adjust equipment from this lesson alone.",
    commonMistakes: [
      "Long-reining, managing lines, selecting or adjusting equipment, choosing a route, surface, duration, or progression outside qualified professional instruction and the current procedure",
      "Using a generic equipment configuration, attachment point, line length, handler position, contact, distance, route, cue, or progression as a universal technique",
      "Wrapping lines around the hand or body, allowing entanglement, standing in an unsafe position, or trying to force or hold a horse through a response",
      "Assessing movement, behaviour, fitness, welfare, lameness, health, or training needs from a generic long-reining observation",
      "Continuing when horse behaviour, welfare, equipment, surface, space, weather, support, supervision, safeguarding, or emergency arrangements are unsuitable",
    ],
    knowledgeCheck: [
      {
        question: "Who determines whether long-reining is appropriate and how the horse, handler, equipment, protective equipment, space, welfare, supervision, and emergency arrangements are managed?",
        options: [
          "Any learner using a generic online diagram",
          "The qualified professional and responsible person after individual assessment and current risk review",
          "A copied line length or attachment point",
          "The horse’s previous activity alone",
        ],
        correctIndex: 1,
        explanation:
          "The reviewed professional standard supports qualified assessment of suitability, equipment, environment, risk, safety, welfare, safeguarding, and emergencies. It does not provide a generic long-reining protocol.",
      },
      {
        question: "What should happen if long-reining becomes unsafe, the horse is unsettled or uncomfortable, or equipment, space, surface, supervision, welfare, or emergency conditions change?",
        options: [
          "Continue until the planned exercise is complete",
          "Use a generic correction or change equipment alone",
          "Stop, move to safety as directed, and obtain qualified or emergency support through the current procedure",
          "Assume the horse needs more pressure",
        ],
        correctIndex: 2,
        explanation:
          "A specialist ground-handling concern may require qualified or emergency action. Do not use a generic technique; follow the current procedure and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current qualified-professional and site procedure applies if long-reining is proposed or becomes unsafe?",
      "How should I report a factual horse-welfare, equipment, surface, space, handler-safety, or emergency concern to the responsible person?",
      "What authority, in-person instruction, protective equipment, equipment check, supervision, welfare, and emergency procedure are required before any specialist ground-handling activity?",
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
      "Recognise that advanced groundwork, fitness, and rehabilitation planning require individual assessment and qualified professional direction",
      "Understand that exercise selection, equipment, handler position, and progression cannot be taken from a generic lesson",
      "Use factual observation and appropriate escalation rather than diagnosing behaviour, pain, fitness, welfare, or training needs",
      "Know when a veterinary, rehabilitation, welfare, or qualified professional concern requires the authorised support route",
    ],
    content: `Advanced groundwork may include specialist non-ridden training or conditioning activity, but it is not a generic exercise programme and is not rehabilitation advice. It requires individual-horse assessment, qualified professional competence, current site procedures, appropriate equipment and personal protective equipment, welfare checks, safe space and surface, supervision, and an emergency plan. This lesson does not qualify a learner to select or perform in-hand collection, lateral work, long-reining, lungeing, whip work, body-language techniques, rehabilitation activity, muscle conditioning, training progression, or a veterinary, behavioural, welfare, or emergency decision.

## Individual Planning, Not a Copied Exercise

World Horse Welfare identifies groundwork, fitness, and rehabilitation as expert-led topics. Its return-to-work guidance says plans must be tailored and adapted to each horse, with expert help when readiness or health is uncertain. British Horse Society fitness guidance similarly advises slow, practical, individual plans rather than rushing or copying another horse’s workload. Therefore, a lesson cannot establish that a particular exercise, step count, distance, circle, rein aid, whip, position, amount of “engagement,” movement pattern, session length, or progression is suitable or beneficial for any individual horse.

The responsible person and qualified professional must assess the horse’s current health information, welfare, fitness, training, behaviour, history, equipment, tack, environment, surface, space, access, support, weather, handler competence, and current risks before considering any activity. A horse’s changed behaviour, resistance, discomfort, lameness, reduced performance, tack concern, or unusual response has many possible causes. Do not diagnose pain, stiffness, weakness, asymmetry, attitude, training need, or a rehabilitation stage from a generic observation.

## Training and Handling Boundary

A qualified professional must select and demonstrate any advanced handling or training method, including the equipment, position, contact, communication, exercise, line, whip, rein, pace, route, surface, timing, rest, progression, and stop criteria for the individual horse. Do not use a bridle, whip, reins, lines, or body position as a generic instruction; ask a horse for collection, engagement, lateral work, response to a cue, or a rehabilitation exercise; or copy a demonstration from text alone.

Never wrap a line or rein around the hand or body, use equipment beyond your competence, force a response, punish a horse, attempt to work through discomfort, or continue when safety or welfare conditions are unsuitable. A learner should not infer that advanced groundwork is required before ridden work, that it replaces ridden work, or that it is safer because it is performed from the ground.

## Rehabilitation, Health, and Welfare

If a horse is returning from injury, has lameness, changed behaviour, pain, poor performance, fitness, tack, hoof, feeding, dental, health, welfare, or rehabilitation concerns, use the authorised veterinary and qualified-professional route. Do not begin, restart, progress, reduce, or substitute an exercise plan from this lesson. Rehabilitation and workload decisions must follow the individual professional plan and current welfare procedure.

## Stop and Escalate

Stop, move to safety as directed, and obtain the responsible person, qualified professional, veterinary support, or emergency support when required if the horse becomes unsettled, difficult to control, uncomfortable, lame, distressed, or unsafe; equipment, surface, space, weather, support, supervision, welfare, safeguarding, or emergency arrangements change; or the learner is unsure.`,
    keyPoints: [
      "Advanced groundwork, fitness, and rehabilitation planning require individual-horse assessment, qualified professional competence, welfare checks, suitable equipment and environment, supervision, and emergency planning",
      "A generic lesson cannot select an advanced in-hand exercise, equipment, position, cue, pace, route, surface, duration, progression, or claimed biomechanical outcome for an individual horse",
      "Changed behaviour, resistance, discomfort, lameness, reduced performance, tack concern, or unusual response requires factual observation and appropriate qualified assessment, not a generic diagnosis",
      "Rehabilitation, health, welfare, fitness, workload, tack, hoof, feeding, dental, and behaviour concerns require the authorised veterinary and qualified-professional route",
      "Do not use a bridle, whip, rein, line, body position, or advanced exercise as a copied learner instruction or substitute for individual professional guidance",
    ],
    safetyNote:
      "Do not perform or direct advanced groundwork, select or adjust equipment, choose a route or duration, assess movement, or continue outside qualified professional instruction and the current site procedure. Never force a response, punish a horse, use equipment beyond competence, or continue if health, welfare, safety, supervision, or emergency arrangements are unsuitable.",
    practicalApplication:
      "Only under qualified in-person professional instruction and the responsible person’s current procedure, observe how the individual horse, handler, health information, welfare, equipment, space, surface, fitness, support, supervision, and emergency route are assessed. Do not select, perform, copy, or progress an advanced groundwork or rehabilitation activity from this lesson alone.",
    commonMistakes: [
      "Selecting, performing, copying, or progressing an advanced groundwork, conditioning, or rehabilitation exercise without individual qualified direction and the current procedure",
      "Using a generic exercise, equipment, position, cue, distance, timing, surface, route, or progression as a universal method or claimed treatment",
      "Using a bridle, whip, rein, line, or body position beyond competence; wrapping equipment around the hand or body; forcing a response; or punishing a horse",
      "Diagnosing pain, lameness, weakness, asymmetry, behaviour, fitness, welfare, tack fit, health, or a rehabilitation stage from a generic observation",
      "Continuing when the horse is unsettled, difficult to control, uncomfortable, lame, distressed, or unsafe, or when health, welfare, equipment, surface, space, support, supervision, or emergency arrangements are unsuitable",
    ],
    knowledgeCheck: [
      {
        question: "Who decides whether an advanced groundwork, conditioning, or rehabilitation activity is appropriate and how it is selected, performed, progressed, monitored, or stopped?",
        options: [
          "Any learner using a generic lesson or copied exercise",
          "The responsible person and appropriate qualified or veterinary professional after individual assessment and current risk review",
          "A fixed distance or session duration",
          "A horse’s previous response alone",
        ],
        correctIndex: 1,
        explanation:
          "World Horse Welfare and British Horse Society guidance support tailored, adaptable individual planning and expert help when readiness or health is uncertain. A generic lesson cannot prescribe a rehabilitation or advanced training programme.",
      },
      {
        question: "What should happen if a horse shows changed behaviour, discomfort, lameness, reduced performance, a tack concern, or an unusual response during or around advanced groundwork?",
        options: [
          "Select a harder exercise to improve engagement",
          "Diagnose the cause and adjust the exercise alone",
          "Stop, move to safety as directed, and use the authorised responsible-person, qualified-professional, veterinary, or emergency route",
          "Treat the response as resistance and continue",
        ],
        correctIndex: 2,
        explanation:
          "These observations can have many causes. Do not diagnose, force, or work through a concern; follow the current welfare and escalation procedure and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current qualified-professional and site procedure applies if advanced groundwork or a rehabilitation activity is proposed or becomes unsafe?",
      "How should I report a factual health, lameness, welfare, equipment, surface, handler-safety, or emergency concern through the authorised route?",
      "What authority, in-person instruction, health and welfare assessment, equipment check, supervision, and emergency procedure are required before any advanced groundwork activity?",
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
      "Recognise broad feed categories while understanding that the individual feeding plan, not a generic list, determines suitability",
      "Understand that forage, concentrates, balancers, supplements, water, quality, and storage decisions require individual welfare and nutrition assessment",
      "Know that a qualified nutrition or veterinary professional may be required before selecting, adding, removing, or changing feed or supplements",
      "Use factual observation and the current responsible-person procedure to identify and report feed, forage, storage, water, condition, health, welfare, or safety concerns",
    ],
    content: `Feed selection is an individual horse-health, welfare, nutrition, management, and safety decision. This lesson introduces broad categories only. It does not prescribe a diet, calculate quantities, diagnose a nutritional or health problem, decide that a feed is safe or unsafe for an individual horse, select a supplement, treat a condition, interpret a laboratory analysis, replace a veterinary or qualified nutrition assessment, or authorise a feed, forage, hydration, storage, grazing, weight, or workload change.

## Broad Feed Categories

World Horse Welfare and British Horse Society describe forage as high-fibre material that can include grass, hay, haylage, chaffs, fibre products, and other sources selected for the individual horse. They describe concentrates as energy-dense feeds that may be used for some horses, while balancers and supplements may have different purposes. Category names do not establish that a particular product, ingredient, amount, nutrient content, texture, moisture level, energy level, or feed type is suitable for every horse.

A responsible person and, where needed, a qualified nutrition or veterinary professional must consider the individual horse’s current feeding plan, body condition, age, workload, health information, welfare, dental and hoof information, access to water, forage, grazing, environment, management, feed analysis, manufacturer information, storage, and current risks. Do not decide that a horse needs extra calories, concentrates, chaff, a balancer, a supplement, haylage, straw, soaked forage, or a restriction from this lesson alone.

## Forage and Concentrate Boundaries

Both reviewed sources describe forage-led feeding and regular access to clean water as central general principles, but the quantity, type, method, timing, and access arrangement must follow the individual plan. Some horses need a tailored approach to control calories, condition, chewing opportunity, health, work, turnout, or other circumstances. Do not use “majority,” “constant,” “natural,” “rich,” “high energy,” “little and often,” or a copied percentage as a universal instruction.

Concentrates, balancers, and supplements are not interchangeable. A product’s label, an ingredient list, a scoop, a feed type, a yard routine, or another horse’s diet is not enough to select the correct feeding plan. Consult the responsible person and obtain appropriate qualified support before changing a diet, adding a supplement, responding to a weight, condition, hydration, health, workload, or grazing concern, or using a product for a claimed health outcome.

## Feed, Forage, Water, and Storage Quality

The reviewed sources support good hygiene, clean feed and utensils, dry and appropriate storage, clean water, and not feeding visibly mouldy feed or forage. These principles do not let a learner diagnose respiratory disease, toxicity, contamination, spoilage, a feed-borne illness, a water problem, or a horse’s condition from a smell, dust, appearance, date, or generic rule. Follow the current site procedure, record factual observations, remove access only when instructed by the responsible person or emergency procedure, and seek the appropriate professional support.

## Stop and Escalate

Stop and use the current responsible-person, veterinary, qualified nutrition, welfare, or emergency route if feed, forage, water, storage, hygiene, condition, behaviour, appetite, chewing, droppings, comfort, health, safety, or welfare becomes concerning; if a product is damaged, contaminated, expired, unidentified, incorrectly stored, or not in the current plan; or if the learner is unsure. Do not feed, withhold, substitute, dose, or change a product independently.`,
    keyPoints: [
      "Forage, concentrates, balancers, supplements, water, quality, and storage decisions must follow the individual horse’s current feeding, welfare, and professional plan",
      "Forage, concentrate, balancer, supplement, product, ingredient, quantity, nutrient, texture, moisture, and energy claims are not universal instructions",
      "A product name, label, ingredient list, scoop, feed type, yard routine, or another horse’s diet does not establish suitability for an individual horse",
      "Use factual observation and the current procedure to report feed, forage, water, storage, hygiene, condition, health, safety, or welfare concerns; do not diagnose the cause",
      "Do not feed, withhold, substitute, dose, add, remove, or change a feed product independently when it is outside the current plan or conditions are uncertain",
    ],
    safetyNote:
      "Do not use appearance, smell, dust, a date, or a generic rule to diagnose contamination, respiratory disease, toxicity, spoilage, a feed-borne illness, a water problem, or a horse’s condition. Follow the current site procedure, report factual concerns, and use responsible-person, veterinary, qualified nutrition, welfare, or emergency support when required.",
    practicalApplication:
      "With the responsible person’s permission, read the current written feeding plan and observe how authorised people check product identity, storage, water access, hygiene, and records. Ask who selected the plan and what current professional, welfare, and escalation procedures apply. Do not categorise a product as suitable, feed a horse, change a product, or make a health or nutrition decision from this lesson alone.",
    commonMistakes: [
      "Selecting, adding, removing, withholding, substituting, dosing, or changing forage, concentrate, balancer, supplement, water, or another product outside the individual current plan and authorised procedure",
      "Using a generic category, product label, ingredient, scoop, feed type, yard routine, or another horse’s diet as proof that a product is suitable",
      "Diagnosing contamination, respiratory disease, toxicity, spoilage, a feed-borne illness, a water problem, or a horse’s condition from appearance, smell, dust, a date, or a generic rule",
      "Treating a concentrate, balancer, supplement, chaff, haylage, straw, soaked forage, or restriction as a universal response to workload, weight, condition, hydration, health, grazing, or welfare",
      "Continuing when feed, forage, water, storage, hygiene, condition, behaviour, appetite, chewing, droppings, comfort, health, safety, or welfare is concerning or outside the current plan",
    ],
    knowledgeCheck: [
      {
        question: "What determines whether a particular forage, concentrate, balancer, supplement, or product is suitable for a horse?",
        options: [
          "Its category name or another horse’s diet",
          "The individual horse’s current feeding, welfare, and professional plan after appropriate assessment",
          "A generic online list",
          "The product’s colour or smell alone",
        ],
        correctIndex: 1,
        explanation: "Broad feed categories do not select an individual diet. The responsible person and, where needed, qualified nutrition or veterinary professionals must consider the current plan and individual context.",
      },
      {
        question: "What should happen if feed, forage, water, storage, hygiene, condition, behaviour, appetite, chewing, droppings, comfort, health, safety, or welfare is concerning or outside the current plan?",
        options: [
          "Choose a replacement feed from a generic list",
          "Make a rapid change to test whether the concern improves",
          "Use the current responsible-person, veterinary, qualified nutrition, welfare, or emergency route and report factual observations",
          "Assume the problem is caused by a single ingredient",
        ],
        correctIndex: 2,
        explanation:
          "A generic lesson cannot diagnose the cause or select a diet change. Follow the current procedure and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current responsible-person and qualified-professional procedure applies if feed, forage, water, storage, or a horse’s condition is concerning?",
      "How should I report factual feed, forage, water, appetite, condition, health, welfare, or safety observations without selecting a product or diagnosing a cause?",
      "What authority, written feeding plan, product check, storage procedure, professional support, and emergency route apply before any feed change?",
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
      "Recognise that diet balancing requires individual assessment of welfare, condition, workload, health information, forage, management, and the current approved plan",
      "Use factual observations and authorised condition-monitoring processes without diagnosing health, nutrition, fitness, pain, or welfare causes",
      "Understand that only the responsible person and appropriate qualified nutrition or veterinary professional can select, change, restrict, or progress a diet",
      "Know when condition, behaviour, appetite, water, droppings, coat, hoof, health, or welfare observations require the authorised support route",
    ],
    content: `Balancing a horse’s diet is an individual health, welfare, nutrition, management, and safety decision. This lesson is not a ration calculator, a body-condition scoring protocol, a diagnostic tool, a laminitis risk assessment, a feed prescription, or a substitute for the responsible person, qualified nutrition professional, veterinarian, farrier, dental professional, or current emergency procedure. It does not authorise a learner to add, remove, restrict, substitute, dose, or change feed, forage, water, supplements, grazing, turnout, exercise, or medication.

## Individual Plans, Not Fixed Scores

World Horse Welfare and British Horse Society describe diet and fitness planning as individual processes that consider condition, workload, forage, water, management, health information, welfare, and the horse’s current needs. They support regular condition monitoring, but a fixed 0–5 system, “ideal” score, body-part checklist, timeline, quantity, or diet response is not a universal instruction in this lesson. Use only the authorised site method and current plan, and do not diagnose a horse’s condition, health, fitness, pain, nutritional status, or welfare from an appearance, scale, weigh tape, coat, hoof, rib, crest, spine, or generic score.

A responsible person and, where needed, a qualified nutrition or veterinary professional must consider the individual horse’s age, current feeding plan, forage and feed information, body condition, workload, health information, dental and hoof information, behaviour, appetite, water access, droppings, environment, grazing, turnout, equipment, management, season, support, and current risks. Do not assume that workload alone determines energy needs, that a leisure horse needs only forage, that a thin horse needs concentrates, that an overweight horse needs restriction, or that a particular product will correct an observed concern.

## Observations and Current Plan

Factual records can help the authorised professional review an existing plan. Record only what is observed through the current site process—for example, the approved condition measurement, appetite, water access, droppings, current workload, forage or feed identity, and a change in comfort or behaviour. Do not label a cause, rank a risk, choose a feed change, or promise a result.

Changes in coat, hoof quality, weight, body shape, appetite, droppings, energy, behaviour, comfort, performance, chewing, or water intake can have many possible causes. The reviewed sources do not allow a learner to conclude that an observation is a dietary imbalance, nutritional deficiency, excess energy, laminitis, pain, or another health condition. Report factual observations and use the current responsible-person, qualified nutrition, veterinary, welfare, or emergency route.

## Health and Welfare Escalation

A nutrition, condition, workload, or feed concern may require professional review. Stop and use the authorised procedure if a horse’s condition, appetite, water, droppings, behaviour, comfort, health, welfare, feed, forage, storage, hygiene, grazing, turnout, workload, or safety becomes concerning or is outside the current plan. Do not make a rapid diet or exercise change, restrict forage, add a supplement, treat an apparent condition, or delay veterinary or emergency support when required.

## Learning Boundary

Use this lesson to understand why individual planning matters and to prepare questions for authorised professionals. Ask who selected the current plan, how condition and workload are monitored, what factual records are required, and which support or emergency route applies if a concern arises.`,
    keyPoints: [
      "Diet balancing requires individual assessment of welfare, condition, workload, health information, forage, management, and the current approved plan",
      "A fixed score, ideal condition, body-part checklist, timeline, quantity, feed type, or diet response is not a universal instruction for an individual horse",
      "Workload, condition, feed, forage, water, health, behaviour, comfort, hoof, coat, and welfare observations require factual recording and appropriate qualified assessment, not a generic causal conclusion",
      "Do not diagnose a dietary imbalance, deficiency, excess energy, laminitis, pain, fitness, or health condition from an appearance, score, coat, hoof, weight, body shape, appetite, droppings, or behaviour",
      "Use the authorised responsible-person, qualified nutrition, veterinary, welfare, or emergency route before changing feed, forage, water, supplements, grazing, turnout, exercise, or medication",
    ],
    safetyNote:
      "Do not use a generic score, appearance, weight, body shape, coat, hoof, appetite, droppings, workload, or behaviour observation to diagnose laminitis, health, pain, nutrition, or welfare. Record factual observations and follow the current responsible-person, veterinary, qualified nutrition, welfare, or emergency procedure when concerns arise.",
    practicalApplication:
      "With the responsible person’s permission, observe how authorised people use the current written feeding plan and approved condition-monitoring process. Ask who reviews workload, forage, feed, water, condition, welfare, records, and escalation criteria. Do not score, diagnose, rank, feed, restrict, supplement, or change an individual horse’s plan from this lesson alone.",
    commonMistakes: [
      "Adding, removing, restricting, substituting, dosing, or changing feed, forage, water, supplements, grazing, turnout, exercise, or medication outside the individual current plan and authorised procedure",
      "Using a generic body score, ideal range, body-part checklist, timeline, quantity, product, workload, or appearance as proof that a diet change is suitable",
      "Diagnosing dietary imbalance, deficiency, excess energy, laminitis, pain, fitness, health, or welfare from condition, weight, coat, hoof, appetite, droppings, energy, behaviour, or performance observations",
      "Assuming a horse’s age, leisure status, workload, season, thinness, body shape, or weight alone determines a forage, concentrate, balancer, supplement, or restriction",
      "Continuing when condition, appetite, water, droppings, behaviour, comfort, health, welfare, feed, forage, storage, grazing, turnout, workload, or safety is concerning or outside the current plan",
    ],
    knowledgeCheck: [
      {
        question: "What determines whether a condition, workload, feed, forage, water, supplement, grazing, turnout, or exercise change is suitable for a horse?",
        options: [
          "A generic ideal score or range",
          "The individual horse’s current approved plan after responsible-person and appropriate qualified assessment",
          "Another horse’s diet",
          "A coat or body-shape observation alone",
        ],
        correctIndex: 1,
        explanation: "A generic lesson cannot select a diet or workload change. The individual plan and appropriate assessment determine what is suitable.",
      },
      {
        question: "What should happen if a change in condition, appetite, water, droppings, coat, hoof, behaviour, comfort, health, welfare, feed, forage, or workload is concerning or outside the current plan?",
        options: [
          "Choose a generic diet change or supplement",
          "Diagnose a nutritional deficiency or laminitis from the observation",
          "Record factual observations and use the current responsible-person, qualified nutrition, veterinary, welfare, or emergency route",
          "Wait until the horse’s appearance changes further",
        ],
        correctIndex: 2,
        explanation:
          "Many observations have multiple possible causes. Do not diagnose or change the plan from a generic lesson; follow the current procedure and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current approved condition-monitoring and responsible-person procedure applies to this individual horse?",
      "How should I report factual condition, feed, forage, water, appetite, droppings, comfort, health, welfare, or safety observations without changing the plan or diagnosing a cause?",
      "What authority, written feeding plan, qualified nutrition or veterinary review, welfare procedure, and emergency route apply before any diet or workload change?",
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
      "Understand that supplement, balancer, hydration, and special-diet decisions require an individual current plan and appropriate veterinary or qualified nutrition review",
      "Recognise that EMS, PPID, laminitis, metabolic, health, hydration, and dietary concerns require authorised veterinary assessment and management",
      "Use factual observations and current procedures without diagnosing a condition or selecting, dosing, mixing, administering, or changing a product",
      "Know how to refer feed-label, product-identity, supplement, water, welfare, and safety questions through the authorised support route",
    ],
    content: `Supplements, balancers, special diets, metabolic conditions, hydration, and feed-product decisions are individual health, welfare, nutrition, management, and safety matters. This lesson does not diagnose a horse, interpret laboratory results, prescribe a diet, identify a deficiency, recommend an ingredient, assess a product’s efficacy, select a supplement, calculate a dose, choose an administration route, mix a product, alter water, feed, forage, grazing, turnout, exercise, medication, or treatment, or replace veterinary, qualified nutrition, responsible-person, or emergency procedures.

## Supplements and Product Decisions

British Horse Society feeding guidance explains that supplements may support nutritional deficiencies but advises veterinary or nutritionist guidance before a horse is given them. It also distinguishes supplements from balancers and the wider feeding plan. A product category, marketing statement, ingredient list, brand, review, feed label, yard routine, sport, workload, horse type, coat, hoof, age, behaviour, condition, or another horse’s plan does not establish that a product is needed, effective, safe, permitted, compatible, correctly stored, correctly prepared, or suitable for an individual horse.

Do not use a generic lesson to identify a joint, hoof, calming, vitamin, mineral, metabolic, electrolyte, hydration, recovery, performance, or health need. Do not diagnose nutrient overlap, toxicity, an allergy, dehydration, a condition, a product interaction, a feeding error, or the reason a horse looks, feels, performs, drinks, eats, sweats, behaves, or moves differently. The responsible person and appropriate qualified nutrition or veterinary professional must review the current written plan, product information, health information, diet, forage, water, workload, condition, environment, welfare, medication, competition rules where applicable, and current risks.

## Metabolic and Health Boundaries

The reviewed welfare and professional guidance describes equine metabolic syndrome (EMS) as a condition that requires veterinary assessment and a veterinary-agreed management plan. Diagnosis uses veterinary testing, and EMS can be confused with Cushing’s disease/PPID. A learner must not diagnose EMS, PPID, insulin dysregulation, laminitis, obesity, pain, a metabolic disorder, a dietary condition, or an associated risk from weight, fat deposits, body condition, thirst, urination, coat, hoof, gait, appetite, behaviour, a feed label, or an online rule.

Do not create or modify a special diet, restrict or change forage, soak or substitute feed, alter grazing, use a muzzle, start or change exercise, give a supplement, use an electrolyte, or delay professional support for a suspected metabolic, laminitis, hydration, health, welfare, or dietary concern. Follow the individual veterinary and current site plan. If a horse has a suspected or known condition, only authorised professionals can decide the assessment, diagnosis, treatment, product, diet, monitoring, workload, progression, or stop criteria.

## Hydration and Electrolyte Boundary

Water is essential, and changes in water access or intake can be important observations. However, a generic lesson cannot decide whether a horse needs an electrolyte, diagnose dehydration, select a formulation, amount, timing, route, preparation, or mixing method, or assume that competition, heat, sweating, travel, or workload alone determines use. Record factual observations using the current procedure and obtain the responsible person, veterinary, or qualified nutrition guidance before any change.

## Label and Escalation Practice

An authorised person may use product identity, instructions, storage requirements, label information, current plan, and professional advice to manage a feed or supplement. A learner may observe and report factual information but must not infer efficacy, safety, necessity, a health claim, a legal status, or a treatment result. Stop and use the current responsible-person, veterinary, qualified nutrition, welfare, or emergency route if product identity, storage, water, feeding, condition, appetite, droppings, sweating, behaviour, comfort, health, welfare, or safety is concerning, outside the current plan, or unclear.`,
    keyPoints: [
      "Supplements, balancers, special diets, hydration, and product decisions require the individual horse’s current plan and appropriate veterinary or qualified nutrition review",
      "A generic lesson cannot diagnose EMS, PPID, insulin dysregulation, laminitis, dehydration, nutritional deficiency, a product interaction, or a health condition",
      "Do not select, dose, mix, administer, change, or recommend a supplement, balancer, electrolyte, forage, feed, grazing, turnout, exercise, medication, or treatment from general information",
      "Product identity, marketing, ingredient lists, labels, brands, reviews, workload, coat, hoof, age, behaviour, condition, and another horse’s plan do not establish suitability for an individual horse",
      "Record factual concerns and use the authorised responsible-person, veterinary, qualified nutrition, welfare, or emergency route when product, water, feeding, condition, health, or welfare is uncertain",
    ],
    safetyNote:
      "Do not diagnose toxicity, overlap, deficiency, allergy, dehydration, a product interaction, a feeding error, EMS, PPID, laminitis, pain, or another condition from a generic observation. Do not alter a product, diet, water, feed, forage, grazing, turnout, exercise, medication, or treatment independently; follow the current procedure and obtain appropriate support.",
    practicalApplication:
      "With the responsible person’s permission, observe how authorised people confirm product identity, storage, current written plan, label instructions, water access, records, professional support, and escalation routes. Do not compare products to select a diet, infer a health benefit, prepare, dose, mix, administer, or change a product from this lesson alone.",
    commonMistakes: [
      "Selecting, adding, removing, withholding, substituting, dosing, mixing, administering, or changing a supplement, balancer, electrolyte, feed, forage, water, grazing, turnout, exercise, medication, or treatment outside the individual current plan and authorised procedure",
      "Diagnosing EMS, PPID, insulin dysregulation, laminitis, obesity, dehydration, deficiency, pain, health, welfare, or a product interaction from condition, weight, fat deposits, thirst, urination, coat, hoof, gait, appetite, behaviour, a label, or a generic rule",
      "Using a category, marketing statement, ingredient list, brand, review, label, yard routine, sport, workload, horse type, coat, hoof, age, behaviour, condition, or another horse’s plan as proof that a product is needed, effective, safe, permitted, compatible, or suitable",
      "Creating or modifying a special diet, forage, feed, grazing, muzzle, turnout, exercise, supplement, electrolyte, medication, treatment, or monitoring plan without the authorised veterinary and qualified-professional direction",
      "Continuing when product identity, storage, water, feeding, condition, appetite, droppings, sweating, behaviour, comfort, health, welfare, or safety is concerning, outside the current plan, or unclear",
    ],
    knowledgeCheck: [
      {
        question: "Who determines the diagnosis, management plan, diet, product, monitoring, workload, progression, and stop criteria for a horse with suspected or known EMS, PPID, laminitis, metabolic, hydration, or other health concern?",
        options: [
          "Any learner using a generic lesson or online rule",
          "The responsible person and appropriate veterinary or qualified professional through the individual current plan",
          "A feed label alone",
          "Another horse’s plan",
        ],
        correctIndex: 1,
        explanation:
          "The reviewed welfare and professional guidance describes EMS as requiring veterinary assessment and a veterinary-agreed plan. A generic lesson cannot diagnose or prescribe management.",
      },
      {
        question: "What should happen if a product, water access, feeding, condition, appetite, droppings, sweating, behaviour, comfort, health, welfare, or safety concern is outside the current plan or unclear?",
        options: [
          "Choose, dose, mix, or administer a product based on workload or weather",
          "Diagnose dehydration, a deficiency, EMS, PPID, or laminitis from the observation",
          "Record factual observations and use the current responsible-person, veterinary, qualified nutrition, welfare, or emergency route",
          "Delay action until a product review is available online",
        ],
        correctIndex: 2,
        explanation:
          "Do not infer a diagnosis or product decision from general information. Follow the current procedure and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current veterinary, qualified-nutrition, responsible-person, welfare, and emergency procedure applies if a metabolic, hydration, supplement, or dietary concern arises?",
      "How should I report factual product, water, feeding, condition, appetite, droppings, sweating, comfort, health, welfare, or safety observations without selecting a product or diagnosing a cause?",
      "What authority, current written plan, product-identity check, storage procedure, professional support, and emergency route apply before any supplement or dietary change?",
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
      "Describe the Five Freedoms as a historical welfare prompt and distinguish them from current individual welfare assessment",
      "Use an individual welfare lens that considers nutrition, environment, health, behaviour, mental state, current procedures, and the horse’s circumstances",
      "Record factual observations without diagnosing welfare, pain, health, legal responsibility, or reportability",
      "Know when to use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route",
    ],
    content: `The Five Freedoms are a historic way to prompt discussion about animal welfare. They are not a diagnostic checklist, a legal decision tool, a welfare investigation, a complete measure of a horse’s experience, or a substitute for the responsible person, veterinarian, qualified professional, current site procedure, emergency service, or relevant local authority. A learner must not diagnose pain, illness, distress, neglect, a welfare breach, a legal offence, an unsuitable environment, a social problem, or a reportable situation from one observation or this lesson alone.

## A Historical Prompt and a Current Assessment Lens

The Five Freedoms are commonly summarised as freedom from hunger and thirst; discomfort; pain, injury, or disease; inability to express normal behaviour; and fear or distress. UK horse-welfare guidance describes related responsibilities: suitable environment, healthy diet, normal behaviour, appropriate company, and protection from pain, suffering, injury, and disease. Contemporary welfare guidance also uses a Five Domains approach: nutrition, environment, health, behaviour, and mental state. These frameworks encourage consideration of the whole horse and its individual circumstances, rather than a single visual check or a universal rule.

The frameworks do not establish that every horse must have the same diet, water arrangement, turnout, company, shelter, rug, environment, space, management, exercise, training, restraint, treatment, or reporting route. An apparent concern may have context that a learner cannot see. For example, a horse may be temporarily alone, natural shelter may be available, a water source may be out of view, or a current veterinary and responsible-person plan may apply. Equally, an apparently calm horse may need an appropriate welfare review. Do not assume a cause or outcome.

## Factual Observation, Not Diagnosis

A learner may record factual observations through the current approved procedure: location, date and time, the individual horse’s visible condition, access that can actually be seen, behaviour, environment, weather, hazards, interaction, and any immediate safety concern. Do not infer pain, hunger, thirst, fear, social deprivation, discomfort, disease, neglect, legal responsibility, a welfare breach, or reportability. Do not enter private land, confront a person, move a horse, offer feed or water, provide treatment, take action beyond your competence, or share identifying information outside the authorised procedure.

If you are responsible for a horse, use the current horse-specific care, welfare, health, feeding, management, training, safeguarding, incident, and emergency procedures. The responsible person and appropriate qualified professionals must decide what action, assessment, care, treatment, management, monitoring, welfare plan, or escalation is suitable. A court may consider the statutory code in a welfare case, but breach of the code is not by itself an offence; do not give legal advice or make legal conclusions from this lesson.

## When to Escalate

Use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route if factual observations suggest an immediate danger, injury, collapse, non-weight-bearing lameness, road risk, inability to safely manage the situation, or another condition covered by the current emergency procedure. For non-urgent welfare concerns, follow the authorised local process and provide first-hand factual information if requested. Routes vary by location and scenario. If you are unsure, do not delay required emergency support; use the current procedure and seek authorised advice.

## Reflective Use

Use the Five Freedoms and Five Domains as prompts to ask: what information is known, what is unknown, what current procedure applies, who is responsible, what individual needs have been assessed, and what support or escalation route is appropriate? The aim is respectful, evidence-based attention to welfare, not a learner diagnosis or a generic instruction.`,
    keyPoints: [
      "The Five Freedoms are a historical welfare prompt; current individual welfare assessment also considers nutrition, environment, health, behaviour, and mental state",
      "Welfare assessment requires individual context, factual observation, current procedures, responsible-person oversight, and appropriate qualified support",
      "A single observation does not diagnose pain, illness, distress, neglect, a welfare breach, legal responsibility, or reportability",
      "Diet, water, turnout, company, shelter, rugging, environment, space, management, exercise, training, restraint, treatment, and reporting routes are not universal learner instructions",
      "Use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route when factual observations require escalation",
    ],
    safetyNote:
      "Do not diagnose, confront, enter private land, move a horse, offer feed or water, provide treatment, or share identifying information outside the authorised procedure. If factual observations suggest immediate danger or a condition covered by the current emergency procedure, use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route without delay; routes vary by location and scenario.",
    practicalApplication:
      "With the responsible person’s permission, observe how the current horse-specific welfare, health, feeding, management, safeguarding, incident, and emergency procedures are applied. Record only authorised factual observations and ask who is responsible for assessment and which escalation route applies. Do not assess, diagnose, investigate, report, move, feed, water, treat, or change management from this lesson alone.",
    commonMistakes: [
      "Using a single observation or a generic framework to diagnose pain, illness, distress, neglect, a welfare breach, legal responsibility, or reportability",
      "Assuming that a horse alone, without a visible rug, without visible shelter, or without a visible water container establishes a welfare failure without the individual context and current procedure",
      "Entering private land, confronting a person, moving a horse, offering feed or water, providing treatment, or taking action beyond competence instead of following the authorised route",
      "Giving legal advice or treating the statutory welfare code as a standalone offence rather than following current authorised procedures and appropriate professional guidance",
      "Continuing without escalation when factual observations suggest immediate danger, injury, collapse, non-weight-bearing lameness, road risk, inability to safely manage the situation, or another condition covered by the current emergency procedure",
    ],
    knowledgeCheck: [
      {
        question: "What is the appropriate use of the Five Freedoms in this lesson?",
        options: [
          "A complete diagnostic checklist that proves welfare or legal status from one observation",
          "A historical prompt that supports a wider individual welfare assessment alongside current responsible-person and professional procedures",
          "A universal diet, turnout, company, shelter, treatment, and reporting rule",
          "A substitute for veterinary, welfare, emergency, or local-authority advice",
        ],
        correctIndex: 1,
        explanation: "The Five Freedoms can prompt reflection, but individual welfare assessment also considers nutrition, environment, health, behaviour, mental state, context, and current procedures.",
      },
      {
        question: "What should a learner do if factual observations create a welfare concern?",
        options: [
          "Diagnose the welfare breach and confront the person responsible",
          "Enter private land and alter the horse’s food, water, shelter, turnout, treatment, or management",
          "Record authorised factual observations and use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route appropriate to the location and scenario",
          "Assume that a horse alone, without a visible rug, without visible shelter, or without a visible water container proves a reportable breach",
        ],
        correctIndex: 2,
        explanation:
          "Context matters. Do not diagnose, confront, trespass, or take unauthorised action; follow the current authorised procedure and emergency route where required.",
      },
    ],
    aiTutorPrompts: [
      "How can I use the Five Freedoms and Five Domains as prompts without diagnosing the individual horse or applying a universal rule?",
      "What current responsible-person, welfare, veterinary, safeguarding, incident, emergency, and relevant local authority procedure applies if a factual concern arises?",
      "How should I record first-hand factual welfare observations without entering private land, confronting a person, moving a horse, treating a horse, or making a legal conclusion?",
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
      "Recognise that factual welfare observations may require authorised review but do not prove neglect, abuse, a welfare breach, legal responsibility, or reportability",
      "Understand that a generic lesson cannot determine intent, abuse, neglect, poor management, criminality, or the appropriate legal or welfare outcome",
      "Know how to use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route without confrontation or unauthorised intervention",
      "Record first-hand factual observations and understand the legal-information boundary of this lesson",
    ],
    content: `Welfare concerns should be taken seriously, but a generic lesson cannot diagnose neglect, abuse, pain, illness, distress, a welfare breach, a legal duty, a criminal offence, intent, poor management, reportability, or the correct remedy. Individual context, location, first-hand evidence, current procedures, professional assessment, and emergency circumstances matter. This lesson does not authorise a learner to investigate, confront, enter private land, move a horse, feed or water a horse, provide treatment, seize property, publish information, make an accusation, give legal advice, or take action beyond competence.

## Factual Observation, Not a Verdict

Visible condition, hoof length, coat condition, water access, shelter, injury, behaviour, training, equipment, movement, environment, weather, hazards, or interaction can be important factual observations. They do not by themselves establish neglect, abuse, deliberate harm, excessive force, pain, lameness, disease, a welfare breach, criminality, or reportability. A horse may have circumstances that are not visible to a learner, including natural shelter, water out of view, temporary management arrangements, a current veterinary or responsible-person plan, or a context that needs professional assessment.

Record only what you have first-hand observed using the current approved process: the location, date and time, identity or description where appropriate, visible facts, immediate risks, and what was seen or heard. Do not interpret a cause, assert an intention, diagnose a condition, make a legal conclusion, create a public record, share personal information, or pressure another person to act. Do not rely on images, social media, hearsay, a single appearance, breed type, age, body shape, turnout arrangement, rug, or a generic checklist as proof.

## Safe and Authorised Escalation

If factual observations suggest an immediate danger, injury, collapse, non-weight-bearing lameness, road risk, inability to safely manage the situation, or another condition in the current emergency procedure, use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route without delay. For non-urgent concerns, follow the authorised local process and provide first-hand factual information if requested. Routes, reporting thresholds, contact methods, confidentiality rules, age limits, legal responsibilities, and urgency arrangements vary by location and scenario.

Do not confront an owner, handler, rider, or another person. Do not enter private land, remove or move a horse, offer feed or water, adjust equipment, provide treatment, take photographs or video outside the authorised procedure, post on social media, or make an allegation. If the concern is within a school, yard, workplace, event, or organisation, use its safeguarding, incident, welfare, and emergency procedures as well as any relevant external authorised route.

## Legal Information Boundary

UK welfare guidance describes responsibilities for people responsible for a horse and explains that a court may consider the statutory code in welfare proceedings, but breach of the code is not itself an offence. Law and enforcement arrangements can vary by jurisdiction and change over time. Do not give legal advice, state that a person has committed an offence, or decide which authority has jurisdiction from this lesson. Use current official guidance and authorised advice.

## Reflective Use

The purpose of this lesson is to help a learner recognise the importance of careful factual observation, personal safety, confidentiality, individual context, and authorised escalation. Ask: what did I actually see, what do I not know, what immediate risk exists, who is responsible, which current procedure applies, and what support route is appropriate?`,
    keyPoints: [
      "Visible condition, hoof length, coat condition, water access, shelter, injury, behaviour, training, equipment, movement, environment, weather, hazards, or interaction can be factual observations but do not prove neglect, abuse, a welfare breach, or a legal outcome",
      "A generic lesson cannot determine intent, deliberate harm, excessive force, pain, lameness, illness, abuse, neglect, poor management, criminality, or reportability",
      "Use the current responsible-person, veterinary, welfare, emergency, or relevant local authority route appropriate to the location, scenario, and urgency",
      "Record only authorised first-hand factual observations; do not investigate, confront, trespass, make an accusation, share personal information, or take unauthorised action",
      "Do not give legal advice or make legal conclusions; follow current official guidance and authorised advice because law and enforcement arrangements vary and can change",
    ],
    safetyNote:
      "Do not confront, investigate, enter private land, move a horse, offer feed or water, adjust equipment, provide treatment, publish information, make an allegation, or take action beyond competence. Follow the current responsible-person, veterinary, welfare, emergency, safeguarding, incident, or relevant local authority procedure; routes vary by location and scenario.",
    practicalApplication:
      "With the responsible person’s permission, identify the current organisation’s welfare, safeguarding, incident, emergency, and relevant external escalation procedures. Practise recording authorised factual observations without diagnosing a cause, identifying a person publicly, confronting anyone, entering private land, moving a horse, or taking an unauthorised action.",
    commonMistakes: [
      "Assuming a single observation, image, social-media post, hearsay, breed type, age, body shape, turnout arrangement, rug, or generic checklist proves neglect, abuse, a welfare breach, a legal duty, criminality, or reportability",
      "Diagnosing intent, deliberate harm, excessive force, pain, lameness, illness, welfare, or legal responsibility rather than recording factual observations and using authorised assessment",
      "Confronting, investigating, trespassing, moving a horse, offering feed or water, adjusting equipment, treating a horse, publishing information, making an accusation, or taking action beyond competence",
      "Giving legal advice or deciding an offence, jurisdiction, enforcement route, reportability, confidentiality requirement, or remedy from this lesson",
      "Failing to use the authorised immediate-danger, veterinary, welfare, emergency, safeguarding, incident, or relevant local authority route when factual observations suggest an urgent condition covered by current procedure",
    ],
    knowledgeCheck: [
      {
        question: "What should a learner do if factual observations create a welfare concern?",
        options: [
          "Diagnose neglect or abuse and confront the person responsible",
          "Enter private land and change the horse’s food, water, equipment, treatment, or management",
          "Record authorised first-hand factual observations and use the current responsible-person, veterinary, welfare, emergency, safeguarding, incident, or relevant local authority route appropriate to the situation",
          "Publish the concern on social media",
        ],
        correctIndex: 2,
        explanation:
          "Do not diagnose, confront, trespass, or take unauthorised action. Follow current authorised procedures and use emergency routes when factual observations indicate an urgent condition.",
      },
      {
        question: "What can a generic Academy lesson determine from a single concerning welfare observation?",
        options: [
          "That neglect, abuse, intent, an offence, and the required enforcement action have been proved",
          "That a named person must be confronted or publicly identified",
          "Only that an observation may require factual recording and the authorised current assessment or escalation route",
          "That the learner should enter private land and intervene",
        ],
        correctIndex: 2,
        explanation:
          "Individual context, professional assessment, location, current procedures, and emergency circumstances matter. This lesson does not diagnose, make legal conclusions, or authorise intervention.",
      },
    ],
    aiTutorPrompts: [
      "How can I record first-hand factual welfare observations without diagnosing neglect, abuse, pain, illness, a legal duty, or a reportable breach?",
      "What current responsible-person, veterinary, welfare, safeguarding, incident, emergency, and relevant local authority procedure applies in this location and scenario?",
      "How do I maintain personal safety, confidentiality, individual context, and authorised escalation boundaries when a welfare concern arises?",
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
      "Recognise that UK welfare law, codes, passport rules, enforcement, and reporting routes require current official guidance, individual facts, and authorised advice",
      "Understand that passport, identification, microchip, ownership, movement, sale, treatment, import/export, vaccination, and record requirements vary by jurisdiction, activity, document, and current rule",
      "Know that a generic lesson cannot determine legal responsibility, an offence, enforcement, a penalty, jurisdiction, or the correct legal or welfare action",
      "Use factual records and the current responsible-person, veterinary, welfare, emergency, regulatory, or authorised-advice route when an official requirement or concern arises",
    ],
    content: `This lesson introduces a legal-information boundary for horse welfare and identification. It is not legal advice, a statement of every current rule, a passport or microchip inspection procedure, an enforcement guide, a licence to determine legal responsibility, an offence, a penalty, a jurisdiction, a reportable matter, or the correct action in an individual case. Rules can change and differ between England, Scotland, Wales, Northern Ireland, activities, documents, horses, owners, keepers, journeys, sales, veterinary treatment, competitions, import/export, and local arrangements. Use current official guidance and authorised advice before acting.

## Welfare Law and Codes

The Animal Welfare Act 2006 contains provisions about responsibility for animals, unnecessary suffering, welfare, enforcement, prosecution, fines, disqualification, and other matters. The DEFRA horse-welfare code describes responsibilities for a person responsible for a horse, including suitable environment, healthy diet, normal behaviour, appropriate company, and protection from pain, suffering, injury, and disease. The code also states that breach of a code provision is not itself an offence, although a court may consider compliance with the code in welfare proceedings.

A generic lesson cannot decide whether a person is responsible, whether a welfare need has been met, whether an observation proves suffering, whether an offence or breach has occurred, which law applies, which authority has jurisdiction, whether enforcement is appropriate, or what outcome, penalty, remedy, report, or action is required. Do not give legal advice, make a legal conclusion, accuse a person, investigate, enter private land, move a horse, alter management, or take action beyond competence.

## Passport and Identification Boundary

GOV.UK states that a horse passport is required for listed equines and must be kept with the animal. It describes information a passport can contain and specific situations where the document is needed. The current rules include specified ownership-update and death-return actions, and GOV.UK identifies particular microchip guidance for horses born before July 2009 while noting that rules differ in Scotland, Wales, and Northern Ireland. A generic lesson cannot decide whether a particular passport is valid, current, complete, correctly issued, correctly updated, sufficient for a sale, movement, treatment, competition, import/export, or other activity; whether a microchip is required or correctly recorded; or whether vaccination information is required or sufficient for a particular purpose.

Do not inspect, alter, retain, complete, transfer, destroy, submit, travel with, buy, sell, loan, import, export, treat, compete, or make a legal or commercial decision about a passport or identification document from this lesson alone. The responsible person must use the current official route, issuing organisation, veterinary professional, regulator, organiser, transport provider, insurer, or other authorised adviser appropriate to the jurisdiction and activity.

## Factual Records and Authorised Routes

You may record only authorised factual information such as the document that is present, the horse identity information that can be seen, date and time, location, current responsible person, stated activity, and an identified question or concern. Do not diagnose a document problem, interpret a legal effect, disclose personal information, make an allegation, or rely on another person’s account, social media, or a generic rule.

If an immediate horse-welfare, health, safety, road, or emergency concern arises, follow the current responsible-person, veterinary, welfare, emergency, safeguarding, incident, or relevant local authority procedure without delay. For non-urgent legal, welfare, passport, identification, ownership, movement, sale, treatment, competition, insurance, import/export, or record questions, obtain current official guidance and authorised advice for the specific jurisdiction and activity.

## Reflective Use

Use this lesson to prepare appropriate questions: which current jurisdiction and activity apply; who is responsible; which official document or rule governs the situation; what factual information is known; what information is missing; and which authorised route can provide current advice?`,
    keyPoints: [
      "The Animal Welfare Act 2006 and the horse-welfare code provide an important legal and welfare context, but current rules, facts, jurisdiction, enforcement, and action require official and authorised advice",
      "The horse-welfare code describes suitable environment, healthy diet, normal behaviour, appropriate company, and protection from pain, suffering, injury, and disease, but breach of the code itself is not an offence",
      "Passport, identification, microchip, ownership, movement, sale, treatment, import/export, vaccination, and record requirements vary by jurisdiction, activity, document, current rule, and individual circumstances",
      "A generic lesson cannot determine legal responsibility, an offence, enforcement, a penalty, jurisdiction, reportability, or the correct legal or welfare action",
      "Record authorised factual information and use the current responsible-person, veterinary, welfare, emergency, regulatory, or authorised-advice route when an official requirement or concern arises",
    ],
    safetyNote:
      "Do not give legal advice or determine passport validity, microchip status, ownership, document sufficiency, sale, movement, treatment, competition, insurance, import/export, an offence, enforcement, a penalty, jurisdiction, or reportability from this lesson. Follow current official guidance and authorised advice for the specific jurisdiction and activity.",
    practicalApplication:
      "With the responsible person’s permission, identify the current local process for passport, identification, ownership, movement, sale, treatment, competition, insurance, import/export, welfare, incident, emergency, and authorised-advice questions. Observe only authorised factual document information and ask which jurisdiction, activity, current official guidance, and responsible route apply. Do not inspect, alter, retain, complete, transfer, destroy, submit, travel with, buy, sell, loan, or make a decision about a document from this lesson alone.",
    commonMistakes: [
      "Using a generic lesson, document, image, social-media post, another person’s account, or one observation to determine legal responsibility, an offence, enforcement, a penalty, jurisdiction, reportability, or the correct legal or welfare action",
      "Deciding that a passport is valid, current, complete, correctly issued, correctly updated, sufficient for a sale, movement, treatment, competition, import/export, or other activity without current official and authorised advice",
      "Assuming that a passport, microchip, ownership, movement, sale, treatment, competition, import/export, vaccination, or record rule is universal across jurisdictions, activities, documents, and current regulations",
      "Giving legal advice, making a legal conclusion, accusing a person, investigating, entering private land, moving a horse, altering management, or taking action beyond competence instead of using the authorised route",
      "Failing to use the current responsible-person, veterinary, welfare, emergency, regulatory, safeguarding, incident, or authorised-advice route when a factual horse-welfare, health, safety, road, or document concern requires escalation",
    ],
    knowledgeCheck: [
      {
        question: "What can this generic Academy lesson determine from a horse-welfare or legal observation?",
        options: [
          "That an offence, legal responsibility, enforcement action, penalty, and jurisdiction have been proved",
          "That a court will reach a particular conclusion",
          "Only that current official guidance, individual facts, and an authorised responsible-person, professional, regulatory, welfare, or emergency route may be required",
          "That the learner should investigate or intervene directly",
        ],
        correctIndex: 2,
        explanation: "The lesson provides a legal-information boundary. It does not give legal advice or determine responsibility, offences, enforcement, penalties, jurisdiction, or required action.",
      },
      {
        question: "What is the appropriate response to a passport, identification, ownership, movement, sale, treatment, competition, insurance, import/export, or record question?",
        options: [
          "Assume one generic rule applies across every UK jurisdiction and activity",
          "Decide document validity or legal effect from an online lesson",
          "Use the current official guidance and the authorised responsible-person, issuing-organisation, veterinary, regulatory, organiser, transport, insurer, or other relevant advice route for the specific jurisdiction and activity",
          "Alter, transfer, retain, submit, or destroy the document without authority",
        ],
        correctIndex: 2,
        explanation: "Official requirements can vary by jurisdiction, activity, document, and current rule. A generic lesson cannot determine validity or the correct legal or commercial action.",
      },
    ],
    aiTutorPrompts: [
      "What current official guidance and authorised advice route applies to this specific horse-welfare, legal, passport, identification, ownership, movement, sale, treatment, competition, insurance, import/export, or record question?",
      "How can I record only authorised factual document information without deciding validity, legal effect, responsibility, an offence, enforcement, or a penalty?",
      "What responsible-person, veterinary, welfare, emergency, regulatory, safeguarding, incident, and authorised-advice route applies if a factual concern needs escalation?",
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
      "Recognise that compassionate, consistent training should consider the individual horse’s physical and emotional welfare, safety, current procedures, and qualified professional support",
      "Describe high-level learning-theory terms without using the lesson as a training, handling, riding, force, reward, pressure-release, exposure, desensitisation, or behaviour-treatment procedure",
      "Record factual behavioural observations without diagnosing stress, fear, pain, discomfort, learned helplessness, safety risk, welfare, or a training cause",
      "Know when to stop and use the current responsible-person, qualified trainer, equine behaviour professional, veterinary, welfare, safety, or emergency route",
    ],
    content: `Training can affect a horse’s physical and emotional welfare, safety, learning, and relationship with people. This lesson introduces high-level concepts only. It is not a procedure for training, handling, riding, leading, lunging, loading, restraint, pressure-release, cueing, force, punishment, reward, treat use, exposure, desensitisation, habituation, behaviour modification, pain assessment, welfare assessment, diagnosis, treatment, or emergency response. A learner must not use a generic definition, a behaviour, an online rule, a video, or another horse’s experience to decide why an individual horse behaves as it does, whether a method is safe or suitable, whether pain, fear, stress, discomfort, distress, learned helplessness, a welfare concern, or a safety risk is present, or which intervention is appropriate.

## Learning-Theory Vocabulary

The reviewed welfare guidance explains that horses learn through the consequences of actions and that every interaction can matter. In an operant-conditioning context, reinforcement aims to make a behaviour more likely and punishment aims to make a behaviour less likely; “positive” means something is added and “negative” means something is removed. Positive reinforcement can describe adding something a horse values after a desired behaviour. Negative reinforcement can describe removing something the horse finds uncomfortable after a desired behaviour. Positive punishment can describe adding something a horse finds unpleasant after an undesired behaviour. Negative punishment can describe removing something the horse values after an undesired behaviour.

These are technical descriptions, not learner instructions or endorsements. They do not decide what a horse values, whether a stimulus is pleasant or uncomfortable, whether timing is safe, what pressure, reward, exposure, equipment, environment, progression, distance, duration, frequency, intensity, trainer, handler, rider, horse, or context is appropriate, or whether a method causes physical or emotional harm. The reviewed guidance says methods that risk injury or physical or emotional harm should not be used and identifies flooding and positive punishment as ethically questionable. A qualified professional and the responsible person must consider the individual horse, medical and welfare history, behaviour, environment, equipment, training context, human safety, current procedure, and applicable rules.

## Behaviour Is Information, Not a Diagnosis

Horses communicate through behaviour and subtle changes can be important observations. Behaviours or body-language changes may have many possible explanations and do not prove pain, fear, stress, discomfort, injury, learned helplessness, intent, defiance, a training problem, a welfare breach, or a safety outcome. Do not label a horse as difficult, stubborn, lazy, naughty, dangerous, shut down, or “in pain” from this lesson alone. Do not attempt to correct a behaviour, increase pressure, add a punishment, use food, remove food, repeat an exposure, continue a session, or change equipment, management, exercise, handling, riding, treatment, or medication based on a generic observation.

Record factual observations through the current approved procedure: date, time, context, environment, activity, equipment, people present, behaviour, and any immediate safety concern. If a behaviour, welfare, health, pain, comfort, handling, riding, equipment, or safety concern is outside the current plan or unclear, stop where it is safe to do so and use the current responsible-person, qualified trainer, equine behaviour professional, veterinary, welfare, safety, or emergency route. Do not diagnose the cause or delay required emergency support.

## Compassionate and Qualified Practice

Compassionate, consistent training requires a current individual plan, appropriate competence, suitable supervision, attention to the horse’s experience, human safety, welfare, environment, equipment, and escalation routes. Fear or high emotional arousal can impede learning, but a learner must not assess a horse’s emotional state, decide a threshold, or prescribe how to change it. The responsible person and appropriate qualified professional decide whether training can proceed, pause, change, or stop and what assessment, support, plan, progression, or referral is needed.

## Reflective Use

Use this lesson to ask: what factual observation was made; what is unknown; what current plan and supervision apply; who is responsible; what welfare and safety boundary applies; and which qualified route should review the concern? The aim is to support careful, welfare-led escalation, not self-directed technique or diagnosis.`,
    keyPoints: [
      "Learning-theory terms describe possible relationships between behaviour and consequences; they are not learner instructions or endorsements",
      "Reviewed welfare guidance states that methods risking injury or physical or emotional harm should not be used, and identifies flooding and positive punishment as ethically questionable",
      "Behaviour and body-language changes can be factual observations but do not diagnose pain, fear, stress, discomfort, distress, learned helplessness, a welfare concern, or a safety risk",
      "Do not choose, apply, increase, reduce, time, repeat, or evaluate pressure, reward, punishment, food, exposure, desensitisation, equipment, handling, riding, or exercise from a generic lesson",
      "Use the current responsible-person, qualified trainer, equine behaviour professional, veterinary, welfare, safety, or emergency route when a behavioural, welfare, health, pain, comfort, handling, riding, equipment, or safety concern is outside the current plan or unclear",
    ],
    safetyNote:
      "Do not diagnose fear, pain, stress, discomfort, distress, learned helplessness, a welfare concern, a safety risk, or a cause from behaviour. Do not correct a behaviour, increase pressure, add punishment, use food, remove food, repeat exposure, continue a session, or change equipment, management, exercise, handling, riding, treatment, or medication from this lesson alone. Follow the current procedure and obtain appropriate qualified support.",
    practicalApplication:
      "With the responsible person’s permission, observe how authorised people use the current horse-specific training, welfare, safety, incident, and escalation procedures. Record only authorised factual context and observations. Do not label the method, assess timing, diagnose a cause, direct a person, handle, ride, train, reward, punish, expose, desensitise, alter equipment, or change a plan from this lesson alone.",
    commonMistakes: [
      "Treating a technical learning-theory definition as a learner instruction, endorsement, proof of safety, or proof that a method is suitable for an individual horse",
      "Choosing, applying, increasing, reducing, timing, repeating, or evaluating pressure, reward, punishment, food, exposure, desensitisation, equipment, handling, riding, exercise, or a training progression from a generic lesson",
      "Diagnosing fear, pain, stress, discomfort, distress, learned helplessness, intent, defiance, a training problem, welfare, or safety from a behaviour or body-language change",
      "Labelling a horse difficult, stubborn, lazy, naughty, dangerous, shut down, or “in pain” instead of recording factual observations and using authorised assessment",
      "Continuing, correcting a behaviour, increasing pressure, adding punishment, using food, removing food, repeating exposure, or changing equipment, management, exercise, handling, riding, treatment, or medication when a concern is outside the current plan or unclear",
    ],
    knowledgeCheck: [
      {
        question: "In the high-level operant-conditioning vocabulary used in this lesson, what does negative reinforcement describe?",
        options: [
          "A synonym for punishment",
          "Removing something the horse finds uncomfortable after a desired behaviour, with the aim of making that behaviour more likely",
          "Ignoring the horse",
          "A learner-approved procedure for applying pressure or timing release",
        ],
        correctIndex: 1,
        explanation:
          "This is a technical description, not a technique instruction or a decision that any pressure, timing, method, or context is suitable for an individual horse.",
      },
      {
        question: "What should a learner conclude from a concerning behavioural or body-language observation?",
        options: [
          "That pain, fear, stress, learned helplessness, a welfare breach, and a specific intervention have been diagnosed",
          "That the horse is deliberately difficult or dangerous",
          "Only that a factual observation may require the current responsible-person, qualified trainer, equine behaviour professional, veterinary, welfare, safety, or emergency review route",
          "That the learner should independently increase pressure, add punishment, use food, repeat exposure, or change equipment",
        ],
        correctIndex: 2,
        explanation:
          "Behaviour can be important information but does not diagnose a cause. Record facts, follow current procedure, and obtain appropriate qualified support.",
      },
    ],
    aiTutorPrompts: [
      "How do the current horse-specific training, welfare, safety, incident, supervision, and escalation procedures apply before any training activity?",
      "How can I record factual behavioural and contextual observations without diagnosing fear, pain, stress, discomfort, learned helplessness, welfare, or safety?",
      "When should I stop where safe and use the responsible-person, qualified trainer, equine behaviour professional, veterinary, welfare, safety, or emergency route?",
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
      "Recognise that end-of-life, retirement, rehoming, euthanasia, aftercare, legal, insurance, document, emergency, and welfare decisions require advance planning and individual veterinary, qualified-professional, responsible-person, and current local guidance",
      "Understand that a generic lesson cannot choose or recommend retirement, rehoming, euthanasia, treatment, transport, aftercare, legal, insurance, or document decisions for an individual horse",
      "Record factual welfare observations without assessing quality of life, pain, prognosis, suffering, transport fitness, rehoming suitability, emergency status, or an end-of-life threshold",
      "Know when to use the current responsible-person, veterinary, qualified-professional, welfare, emergency, legal, insurance, document, bereavement, or authorised local route",
    ],
    content: `End-of-life, retirement, rehoming, euthanasia, aftercare, legal, insurance, document, emergency, and welfare decisions can be deeply difficult and are individual to the horse, the responsible person, the professional advice available, the location, and current circumstances. This lesson is not a quality-of-life assessment, diagnosis, prognosis, pain or suffering assessment, treatment recommendation, euthanasia decision, euthanasia-method instruction, transport-fitness assessment, rehoming decision, retirement plan, legal advice, insurance advice, passport process, aftercare procedure, emergency plan, or substitute for veterinary, qualified-professional, responsible-person, welfare, legal, insurance, document, or emergency advice.

## Plan Before a Crisis

Reviewed welfare guidance supports making an end-of-life plan before an illness, accident, or emergency. The plan should be individual and maintained by the responsible person with the appropriate veterinary and qualified-professional support. It may identify responsible contacts, current professional routes, the horse’s existing records, welfare and safety information, emergency procedure, who can make or communicate decisions, and where to obtain current local guidance. A generic lesson cannot prepare, approve, replace, interpret, or execute that plan.

## Quality of Life and Professional Assessment

Quality of life is important, but it is not a learner checklist or a single observation. Do not decide that a horse is in chronic pain, suffering, comfortable, deteriorating, fit or unfit for travel, suitable for retirement, suitable for rehoming, in an emergency, or at an end-of-life threshold from appetite, movement, behaviour, condition, social interaction, age, a diagnosis, an online rule, or another horse’s experience. The reviewed veterinary guidance explains that the attending veterinarian can assist in the determination, particularly regarding suffering, and the welfare sources state that every situation is different and veterinary or professional advice should be sought.

Record only authorised factual observations through the current procedure, such as date, time, context, activity, visible behaviour, comfort-related observations, and any immediate safety concern. Do not infer a diagnosis, prognosis, pain level, quality of life, a treatment outcome, suitability, a decision, a cause, or a required action. If a welfare, health, pain, comfort, handling, transport, safety, or emergency concern is outside the current plan or unclear, use the current responsible-person, veterinary, qualified-professional, welfare, emergency, or authorised local route without delay.

## Retirement and Rehoming Boundary

Retirement and rehoming can require continuing care and careful planning, but neither is a generic solution. Welfare guidance encourages early exploration of rehoming options, accurate and up-to-date information, suitability consideration, written arrangements where relevant, contingency planning, and individual quality-of-life consideration. It also explains that rehoming may not be appropriate in some circumstances. A learner must not select a retirement setting, new owner, loan arrangement, organisation, transport, workload, turnout, management, treatment, document, contract, or legal or welfare outcome from this lesson. The responsible person, appropriate veterinary and qualified professionals, and current authorised legal/document routes must decide what is suitable for the individual horse.

## Euthanasia and Aftercare Boundary

Euthanasia may be a responsible treatment option when it is best for the horse, but a learner must not determine need, timing, method, drugs, equipment, personnel, location, transport, safety, insurance, document handling, body collection, burial, cremation, or aftercare. These decisions depend on the individual horse, veterinary assessment, law, training, experience, safety, insurance, documents, final disposition, location, and current procedures. Do not delay required emergency veterinary or welfare support for insurance, logistics, convenience, emotion, or a generic lesson. Do not provide any euthanasia method, treatment, procedure, restraint, transport, aftercare, legal, insurance, or document instruction.

## Respectful Escalation and Support

If an immediate safety, injury, collapse, non-weight-bearing lameness, pain, welfare, health, road, transport, or emergency concern occurs, follow the current responsible-person, veterinary, welfare, emergency, safeguarding, incident, and authorised local procedure without delay. For non-urgent planning, use appropriate veterinary, qualified-professional, welfare, legal, insurance, document, and bereavement support routes. Personal grief and support needs can be significant; seek appropriate support without allowing it to replace required professional and emergency action.

## Reflective Use

Use this lesson to ask: what facts are known; what is unknown; who is responsible; which current plan and professional advice apply; what welfare and safety issue needs escalation; and what authorised route can provide support? The goal is informed planning and timely professional support, not learner diagnosis or self-directed decision-making.`,
    keyPoints: [
      "End-of-life, retirement, rehoming, euthanasia, aftercare, legal, insurance, document, emergency, and welfare decisions are individual and require advance planning plus current veterinary, qualified-professional, responsible-person, and local guidance",
      "A generic lesson cannot assess quality of life, pain, prognosis, suffering, transport fitness, rehoming suitability, emergency status, or an end-of-life threshold",
      "Retirement and rehoming are not generic solutions; suitability, accurate information, written arrangements where relevant, contingency planning, welfare, legal, document, and professional assessment are individual matters",
      "Do not determine euthanasia need, timing, method, drugs, equipment, personnel, location, transport, safety, insurance, document handling, body collection, burial, cremation, or aftercare from this lesson",
      "Use the current responsible-person, veterinary, qualified-professional, welfare, emergency, legal, insurance, document, bereavement, and authorised local route when a concern or plan requires support",
    ],
    safetyNote:
      "Do not diagnose pain, suffering, quality of life, prognosis, transport fitness, rehoming suitability, emergency status, or an end-of-life threshold. Do not select, recommend, perform, assist, instruct, delay, or arrange a treatment, euthanasia, transport, aftercare, legal, insurance, document, or body-disposal action from this lesson. Follow the current responsible-person, veterinary, welfare, emergency, and authorised local procedure without delay when required.",
    practicalApplication:
      "With the responsible person’s permission, identify the current horse-specific end-of-life, welfare, health, safety, emergency, contact, legal, insurance, document, aftercare, bereavement, and authorised local support procedures. Record only authorised factual information and ask who is responsible for decisions. Do not assess quality of life, diagnose, decide, recommend, treat, transport, rehome, retire, euthanise, arrange aftercare, or handle documents from this lesson alone.",
    commonMistakes: [
      "Using a generic lesson, age, appetite, movement, behaviour, condition, social interaction, diagnosis, online rule, or another horse’s experience to assess quality of life, pain, prognosis, suffering, transport fitness, rehoming suitability, emergency status, or an end-of-life threshold",
      "Selecting a retirement setting, new owner, loan arrangement, organisation, transport, workload, turnout, management, treatment, document, contract, or legal or welfare outcome without individual responsible-person, veterinary, qualified-professional, and current authorised advice",
      "Determining, recommending, performing, assisting, instructing, delaying, or arranging a euthanasia, treatment, transport, aftercare, legal, insurance, document, body-collection, burial, cremation, or other procedure from a generic lesson",
      "Allowing insurance, logistics, convenience, emotion, or a generic lesson to delay required emergency veterinary, welfare, safety, or authorised local support",
      "Failing to record authorised facts and use the current responsible-person, veterinary, qualified-professional, welfare, emergency, legal, insurance, document, bereavement, or authorised local route when a concern or plan requires escalation",
    ],
    knowledgeCheck: [
      {
        question: "What can this generic Academy lesson determine about an individual horse’s end-of-life, retirement, rehoming, or euthanasia situation?",
        options: [
          "That quality of life, pain, prognosis, suffering, transport fitness, rehoming suitability, emergency status, and the required action have been established",
          "That a specific euthanasia method, transport, aftercare, legal, insurance, document, or body-disposal action is appropriate",
          "Only that current responsible-person, veterinary, qualified-professional, welfare, emergency, legal, insurance, document, bereavement, and authorised local support may be required",
          "That a learner should decide or act alone",
        ],
        correctIndex: 2,
        explanation: "Every situation is individual. The lesson supports timely planning and authorised escalation, not learner diagnosis or self-directed decisions.",
      },
      {
        question: "What is the appropriate boundary when retirement or rehoming is being considered?",
        options: [
          "Assume retirement or rehoming is always suitable and select a home from a generic lesson",
          "Choose a loan, transport, workload, turnout, management, treatment, document, contract, or legal outcome without individual review",
          "Use early planning, accurate information, suitability and contingency consideration, and current responsible-person, veterinary, qualified-professional, welfare, legal, document, and authorised advice for the individual horse",
          "Delay emergency welfare support while searching for a new arrangement",
        ],
        correctIndex: 2,
        explanation: "Rehoming may not be appropriate in every circumstance. Suitability and welfare require individual, current, authorised review.",
      },
    ],
    aiTutorPrompts: [
      "What current responsible-person, veterinary, qualified-professional, welfare, emergency, legal, insurance, document, bereavement, and authorised local route applies to this individual horse and situation?",
      "How can I record authorised factual welfare and context observations without assessing quality of life, pain, prognosis, suffering, transport fitness, rehoming suitability, emergency status, or an end-of-life threshold?",
      "What current authorised professional, legal, insurance, document, aftercare, bereavement, and local support route applies without selecting a procedure or action from this lesson?",
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
      "Recognise that gridwork and related-distance activity are qualified-coach decisions requiring individual horse/rider suitability, welfare, safety, current procedures, and supervision",
      "Understand that a generic lesson cannot set up, measure, build, adjust, ride, jump, teach, assess, or progress a grid or related-distance exercise",
      "Know that no universal grid, pole, fence, placing-pole, bounce, one-stride, height, distance, stride, track, approach, speed, equipment, or progression rule is suitable for every horse, rider, venue, surface, and circumstance",
      "Record factual observations and use the current responsible-person, qualified coach, welfare, safety, veterinary, incident, or emergency route when a concern is outside the current plan or unclear",
    ],
    content: `Gridwork and related-distance activities can involve poles, fences, approaches, landing areas, tracks, rider balance, horse movement, equipment, speed, surfaces, space, weather, other people, and changing risks. This lesson provides an educational boundary only. It is not a procedure for building, measuring, placing, adjusting, dismantling, riding, jumping, teaching, coaching, supervising, progressing, modifying, or troubleshooting a grid, bounce, related distance, placing pole, fence, height, track, approach, stride, speed, distance, equipment, surface, horse, or rider.

## Qualified-Coach Scope

Reviewed professional coaching guidance treats gridwork and related distances as qualified-coach content. The guidance requires risk assessment; suitability of horse and rider; consideration of horse welfare, participant needs, equipment, environment, and potential risks; appropriate measurement; adjustment where required; logical progression; safe supervision; incident response; and support or referral to an experienced coach or mentor. It does not provide a universal learner distance table, self-directed setup procedure, fixed component definition, height rule, approach rule, progression rule, or correction.

A qualified coach and the responsible person must decide whether an activity is appropriate; whether it can begin, continue, change, pause, or stop; what risk assessment, supervision, equipment, space, surface, rider, horse, warm-up, training, welfare, safety, and emergency arrangements apply; and which measurements, adjustments, or alternatives are suitable for the individual session. A generic lesson cannot determine suitability, fitness, soundness, pain, behaviour, balance, rider ability, horse ability, confidence, welfare, safety, equipment suitability, a cause, a correction, an outcome, or a stop threshold.

## No Universal Distance or Setup Rule

Do not use a generic chart, measurement, number of strides, distance, speed, height, placing-pole position, bounce, one-stride description, rider level, horse type, another horse’s setup, online example, video, or a previous session as a rule for this horse, rider, venue, surface, equipment, condition, weather, or day. Do not build, alter, ride, jump, measure, teach, supervise, raise, lower, widen, narrow, add, remove, reposition, or test an exercise based on this lesson alone.

## Factual Observation and Escalation

A learner may record authorised factual observations such as date, time, current activity, environment, surface, equipment present, people present, visible horse/rider behaviour, and any immediate safety concern. Do not diagnose lameness, pain, fear, stress, discomfort, fitness, ability, balance, welfare, a training problem, equipment failure, a distance issue, a cause, or a correction. Do not continue, repeat, increase, decrease, change, or troubleshoot the activity from a generic observation.

If a horse, rider, welfare, health, pain, comfort, surface, equipment, environment, supervision, incident, or safety concern is outside the current plan or unclear, stop where it is safe to do so and use the current responsible-person, qualified coach, welfare, safety, veterinary, incident, or emergency route. Do not delay required emergency support.

## Reflective Use

Use this lesson to ask: who is responsible; what current risk assessment and supervision apply; what individual suitability has been assessed by the authorised coach; what factual information is known; what is unknown; and what escalation route applies? The aim is safe, welfare-led recognition of professional scope, not self-directed gridwork.`,
    keyPoints: [
      "Gridwork and related-distance activity are qualified-coach decisions that require individual horse/rider suitability, risk assessment, welfare, safety, current procedures, and supervision",
      "There is no universal grid, pole, fence, placing-pole, bounce, one-stride, height, distance, stride, track, approach, speed, equipment, or progression rule for every horse, rider, venue, surface, and circumstance",
      "Do not build, alter, ride, jump, measure, teach, supervise, raise, lower, widen, narrow, add, remove, reposition, test, or troubleshoot an activity from a generic lesson",
      "A learner may record authorised factual observations but must not diagnose fitness, soundness, pain, fear, stress, discomfort, ability, balance, welfare, safety, equipment suitability, a cause, or a correction",
      "If a horse, rider, welfare, health, pain, comfort, surface, equipment, environment, supervision, incident, or safety concern is outside the current plan or unclear, use the current responsible-person, qualified coach, welfare, safety, veterinary, incident, or emergency route",
    ],
    safetyNote:
      "Do not use a generic chart, measurement, stride count, speed, height, placing-pole position, bounce, one-stride description, rider level, horse type, another horse’s setup, online example, video, or previous session to build or alter an exercise. Do not diagnose a grid, distance, safety, welfare, training, or performance issue; follow the current procedure and obtain qualified support.",
    practicalApplication:
      "With the responsible person’s permission, observe how an authorised qualified coach applies the current risk assessment, supervision, welfare, safety, equipment, incident, and escalation procedures. Record only authorised factual context and observations. Do not build, alter, ride, jump, measure, teach, supervise, assess, modify, or troubleshoot an activity from this lesson alone.",
    commonMistakes: [
      "Treating a generic distance, stride count, component description, height, speed, placing-pole position, rider level, horse type, online example, video, previous session, or another horse’s setup as suitable for an individual activity",
      "Building, altering, riding, jumping, measuring, teaching, supervising, raising, lowering, widening, narrowing, adding, removing, repositioning, testing, or troubleshooting an exercise without authorised qualified-coach direction",
      "Diagnosing fitness, soundness, pain, fear, stress, discomfort, ability, balance, welfare, safety, equipment suitability, a cause, or a correction from an observation",
      "Continuing, repeating, increasing, decreasing, changing, or troubleshooting an activity when a horse, rider, welfare, health, pain, comfort, surface, equipment, environment, supervision, incident, or safety concern is outside the current plan or unclear",
      "Failing to use the current responsible-person, qualified coach, welfare, safety, veterinary, incident, or emergency route when factual observations require escalation",
    ],
    knowledgeCheck: [
      {
        question: "What determines the appropriate setup, measurement, adjustment, and progression for a gridwork or related-distance activity?",
        options: [
          "A universal chart from a generic lesson",
          "Another horse’s setup or an online example",
          "The current responsible person and qualified coach using individual horse/rider suitability, risk assessment, welfare, safety, equipment, environment, supervision, and current procedures",
          "A learner’s preferred height or speed",
        ],
        correctIndex: 2,
        explanation: "Professional coaching guidance requires individual suitability, risk assessment, welfare, safety, appropriate measurement, adjustment where required, supervision, and escalation rather than a universal distance table.",
      },
      {
        question: "What should a learner do when a horse, rider, welfare, health, pain, comfort, surface, equipment, environment, supervision, incident, or safety concern is outside the current plan or unclear?",
        options: [
          "Independently change distance, height, speed, equipment, position, or the exercise",
          "Diagnose the cause and continue to test a correction",
          "Stop where it is safe to do so and use the current responsible-person, qualified coach, welfare, safety, veterinary, incident, or emergency route",
          "Use another horse’s setup as a solution",
        ],
        correctIndex: 2,
        explanation: "Do not self-direct gridwork or diagnose a cause. Follow the current authorised procedure and obtain qualified support.",
      },
    ],
    aiTutorPrompts: [
      "What current responsible-person, qualified-coach, risk-assessment, welfare, safety, equipment, supervision, incident, and escalation procedure applies before any gridwork or related-distance activity?",
      "How can I record authorised factual horse, rider, environment, surface, equipment, supervision, and safety observations without deciding setup, suitability, measurement, adjustment, progression, or a correction?",
      "When should I stop where safe and use the responsible-person, qualified coach, welfare, safety, veterinary, incident, or emergency route rather than self-directing a gridwork change?",
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
      "Recognise that course walking, route, line, turn, pace, terrain, distance, footing, obstacle, and competition decisions require authorised qualified-coach, venue, current-rule, welfare, safety, and responsible-person oversight",
      "Understand that a generic lesson cannot walk, assess, plan, select, ride, jump, alter, coach, supervise, or troubleshoot a course, route, line, turn, approach, track, pace, distance, stride, surface, obstacle, horse, rider, or venue",
      "Know that no universal stride, line, pace, turn, recovery point, warm-up, equipment, footing, surface, obstacle, fitness, suitability, safety, welfare, rule, or performance decision applies to every course and combination",
      "Record authorised factual observations and use the current responsible-person, qualified coach, venue, welfare, safety, veterinary, incident, emergency, and current-rule route when a concern is outside the current plan or unclear",
    ],
    content: `Competition course awareness can involve course design, route, lines, turns, approaches, pace, distances, terrain, surfaces, obstacles, equipment, weather, venue conditions, rules, horse welfare, rider safety, individual ability, supervision, and changing risks. This lesson provides an educational boundary only. It is not a procedure for course walking, course design, route selection, line planning, turn planning, pace selection, stride counting, footing assessment, obstacle assessment, warm-up, equipment selection, fitness assessment, safety assessment, welfare assessment, riding, jumping, competing, coaching, supervising, changing a plan, or troubleshooting a horse, rider, course, surface, venue, or competition.

## Authorised Professional and Venue Scope

Reviewed professional course-walk and coaching material treats course design, course walking, safety, rider decision-making, pace, lines, terrain, welfare, materials, positioning, arena size, surface, and distance as expert-led content. Competition-welfare guidance requires welfare to take precedence over competitive interests, and requires fit, competent horse/rider combinations plus suitable and safe surfaces and obstacles. These sources do not create a universal learner procedure, a universal route/line/turn/stride/pace rule, a method for deciding fitness or safety, a claim that any plan will improve performance, or a right to override venue, official, responsible-person, welfare, safety, veterinary, or current-rule decisions.

The responsible person, authorised qualified coach, venue, officials, and current rules decide whether participation is appropriate; whether activity can begin, continue, change, pause, or stop; what route, course access, supervision, equipment, area, surface, horse, rider, welfare, safety, emergency, incident, and reporting arrangements apply; and what qualified support is needed. A generic lesson cannot determine fitness, competence, soundness, pain, behaviour, fear, stress, discomfort, welfare, rider ability, horse ability, confidence, surface safety, obstacle safety, weather risk, venue compliance, current rules, a cause, a correction, an outcome, or a stop threshold.

## No Universal Course Plan

Do not use a generic line, turn, approach, track, pace, stride count, distance, recovery point, “horse perspective,” warm-up, equipment choice, footing observation, obstacle observation, online example, video, another combination, previous round, previous course, or a stated performance aim as a rule for the current horse, rider, surface, venue, weather, class, official instructions, or day. Do not walk, enter, ride, jump, measure, count, select, alter, rehearse, continue, repeat, speed up, slow down, shorten, lengthen, turn, correct, or test a route or course from this lesson alone.

## Factual Observation and Escalation

A learner may record authorised factual observations such as date, time, venue, class, current instruction, visible surface/obstacle context, equipment present, weather, people present, visible horse/rider behaviour, and any immediate safety concern. Do not diagnose lameness, pain, fear, stress, discomfort, fitness, ability, balance, welfare, surface safety, obstacle safety, rule compliance, a distance issue, a cause, a correction, a performance outcome, or an emergency status. Do not independently change a plan or continue activity from a generic observation.

If a horse, rider, welfare, health, pain, comfort, surface, obstacle, equipment, weather, venue, official instruction, supervision, incident, safety, or rule concern is outside the current plan or unclear, stop where safe to do so and use the current responsible-person, qualified coach, venue, official, welfare, safety, veterinary, incident, emergency, and authorised current-rule route. Do not delay required emergency support or allow competitive pressure to override welfare.

## Reflective Use

Use this lesson to ask: who is responsible; what current venue/official instructions and rules apply; what authorised qualified-coach and welfare/safety oversight applies; what factual context is known; what is unknown; and which escalation route applies? The aim is safe recognition of professional and venue scope, not self-directed competition planning.`,
    keyPoints: [
      "Course walking, route, line, turn, pace, terrain, distance, footing, obstacle, and competition decisions require authorised qualified-coach, venue, current-rule, welfare, safety, and responsible-person oversight",
      "There is no universal stride, line, pace, turn, recovery point, warm-up, equipment, footing, surface, obstacle, fitness, suitability, safety, welfare, rule, or performance decision for every horse, rider, course, venue, weather, and circumstance",
      "Do not walk, enter, ride, jump, measure, count, select, alter, rehearse, continue, repeat, speed up, slow down, shorten, lengthen, turn, correct, or test a route or course from a generic lesson",
      "A learner may record authorised factual observations but must not diagnose fitness, soundness, pain, fear, stress, discomfort, ability, balance, welfare, surface safety, obstacle safety, rule compliance, a cause, a correction, or a performance outcome",
      "If a horse, rider, welfare, health, pain, comfort, surface, obstacle, equipment, weather, venue, official instruction, supervision, incident, safety, or rule concern is outside the current plan or unclear, use the current responsible-person, qualified coach, venue, official, welfare, safety, veterinary, incident, emergency, and authorised current-rule route",
    ],
    safetyNote:
      "Do not use a generic route, line, turn, approach, track, pace, stride count, distance, recovery point, “horse perspective,” warm-up, equipment choice, footing observation, obstacle observation, online example, video, another combination, previous round, previous course, or performance aim as a rule for an individual course. Do not diagnose fitness, surface safety, obstacle safety, welfare, safety, rule compliance, or a course problem; follow the current procedure and obtain authorised qualified support.",
    practicalApplication:
      "With the responsible person’s permission, observe how authorised qualified coaches, venue staff, and officials use the current venue, welfare, safety, supervision, incident, emergency, and current-rule procedures. Record only authorised factual context and observations. Do not walk, enter, ride, jump, measure, count, select, alter, rehearse, supervise, assess, modify, or troubleshoot a course, route, line, turn, pace, stride, surface, obstacle, horse, rider, or venue from this lesson alone.",
    commonMistakes: [
      "Treating a generic route, line, turn, approach, track, pace, stride count, distance, recovery point, “horse perspective,” warm-up, equipment choice, footing observation, obstacle observation, online example, video, another combination, previous round, previous course, or performance aim as suitable for an individual course",
      "Walking, entering, riding, jumping, measuring, counting, selecting, altering, rehearsing, continuing, repeating, speeding up, slowing down, shortening, lengthening, turning, correcting, or testing a route/course without authorised qualified-coach, venue, official, welfare, safety, and current-rule direction",
      "Diagnosing fitness, soundness, pain, fear, stress, discomfort, ability, balance, welfare, surface safety, obstacle safety, rule compliance, a cause, a correction, a performance outcome, or an emergency status from an observation",
      "Independently changing a plan or continuing when a horse, rider, welfare, health, pain, comfort, surface, obstacle, equipment, weather, venue, official instruction, supervision, incident, safety, or rule concern is outside the current plan or unclear",
      "Failing to use the current responsible-person, qualified coach, venue, official, welfare, safety, veterinary, incident, emergency, and authorised current-rule route when factual observations require escalation",
    ],
    knowledgeCheck: [
      {
        question: "What determines whether and how course walking, route, line, turn, pace, distance, surface, obstacle, and competition decisions are made?",
        options: [
          "A universal lesson procedure",
          "Another rider’s plan or an online example",
          "Current responsible-person, authorised qualified-coach, venue, official, welfare, safety, veterinary, incident, emergency, and current-rule oversight for the individual horse/rider/course/venue context",
          "A learner’s preferred line or performance objective",
        ],
        correctIndex: 2,
        explanation: "The reviewed sources treat these as expert-led, individual, venue- and welfare-dependent decisions rather than a universal learner procedure.",
      },
      {
        question: "What should a learner do when a horse, rider, welfare, health, pain, comfort, surface, obstacle, equipment, weather, venue, official instruction, supervision, incident, safety, or rule concern is outside the current plan or unclear?",
        options: [
          "Independently change the route, line, turn, pace, stride count, equipment, surface, or course plan",
          "Diagnose the cause and continue to test a correction",
          "Stop where safe to do so and use the current responsible-person, qualified coach, venue, official, welfare, safety, veterinary, incident, emergency, and authorised current-rule route",
          "Allow competitive pressure to override welfare",
        ],
        correctIndex: 2,
        explanation: "Do not self-direct a competition change or diagnose a cause. Follow the current authorised procedure and obtain appropriate support.",
      },
    ],
    aiTutorPrompts: [
      "What current responsible-person, authorised qualified-coach, venue, official, welfare, safety, supervision, incident, emergency, and current-rule procedure applies before any course activity?",
      "How can I record authorised factual horse, rider, venue, surface, obstacle, weather, equipment, supervision, and safety observations without deciding route, line, turn, pace, stride, suitability, correction, or performance?",
      "When should I stop where safe and use the responsible-person, qualified coach, venue, official, welfare, safety, veterinary, incident, emergency, and current-rule route rather than self-directing a course change?",
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
