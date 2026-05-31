export type MarketingFrameworkFit = {
  platformFit: string[];
  riskNotes: string[];
  scoringHints: string[];
};

export type MarketingHookFramework = {
  id: string;
  name: string;
  whenToUse: string;
  whenNotToUse: string;
  structure: string[];
  exampleSkeleton: string;
} & MarketingFrameworkFit;

export type MarketingAngleFramework = {
  id: string;
  name: string;
  whenToUse: string;
  whenNotToUse: string;
  structure: string[];
} & MarketingFrameworkFit;

export type MarketingCtaEntry = {
  id: string;
  intent: string;
  examples: string[];
  platformFit: string[];
  caution: string;
};

export type MarketingNicheTemplate = {
  id: string;
  title: string;
  audience: string;
  goal: string;
  recommendedHooks: string[];
  recommendedAngles: string[];
  ctaIntent: string;
  structure: string[];
};

const HOOK_FRAMEWORKS: MarketingHookFramework[] = [
  { id: "problem_agitate_solve", name: "Problem Agitate Solve", whenToUse: "Audience feels pain but not urgency.", whenNotToUse: "Sensitive crisis messaging.", structure: ["Problem", "Consequence", "Solution", "Proof", "CTA"], platformFit: ["TikTok", "Instagram", "Facebook"], riskNotes: ["Avoid fear manipulation."], scoringHints: ["Strong if pain is specific and measurable."], exampleSkeleton: "Are you struggling with X? Here is what it costs. Here is how to fix it today." },
  { id: "contrarian_insight", name: "Contrarian Insight", whenToUse: "Crowded niche with repeated advice.", whenNotToUse: "When proof is missing.", structure: ["Common belief", "Contrarian claim", "Evidence", "Action"], platformFit: ["LinkedIn", "YouTube"], riskNotes: ["Needs evidence or trust drops."], scoringHints: ["Score up when backed by data."], exampleSkeleton: "Everyone says X. In our experience, Y works better because Z." },
  { id: "before_after", name: "Before / After", whenToUse: "Transformation is observable.", whenNotToUse: "No clear baseline.", structure: ["Before state", "After state", "Mechanism", "CTA"], platformFit: ["Instagram", "Facebook", "YouTube"], riskNotes: ["Avoid unrealistic outcomes."], scoringHints: ["Needs believable time window."], exampleSkeleton: "Before: X. After: Y. We changed A and B to get there." },
  { id: "mistake_to_avoid", name: "Mistake To Avoid", whenToUse: "Educational authority positioning.", whenNotToUse: "When tone should stay celebratory.", structure: ["Mistake", "Impact", "Fix", "Checklist", "CTA"], platformFit: ["LinkedIn", "Email", "Blog / SEO"], riskNotes: ["Do not shame audience."], scoringHints: ["Higher score with practical fix steps."], exampleSkeleton: "Most teams make this mistake. Here is why it hurts and how to fix it." },
  { id: "hidden_cost", name: "Hidden Cost", whenToUse: "Need urgency for operational pain.", whenNotToUse: "If cost cannot be estimated.", structure: ["Hidden cost", "Real-world impact", "Alternative", "CTA"], platformFit: ["LinkedIn", "Facebook"], riskNotes: ["Avoid fabricated numbers."], scoringHints: ["Only score high with source-backed cost."], exampleSkeleton: "This hidden cost drains your team every week. Here is a safer path." },
  { id: "quick_win", name: "Quick Win", whenToUse: "Top-of-funnel trust building.", whenNotToUse: "Complex enterprise change.", structure: ["Tiny change", "Immediate result", "Next step", "CTA"], platformFit: ["TikTok", "Instagram", "Email"], riskNotes: ["Do not over-promise speed."], scoringHints: ["High if win is actionable in <10 min."], exampleSkeleton: "Try this quick change today to reduce friction by tonight." },
  { id: "founder_story", name: "Founder Story", whenToUse: "Brand trust and mission building.", whenNotToUse: "Urgent direct response push.", structure: ["Origin moment", "Challenge", "Breakthrough", "Lesson", "CTA"], platformFit: ["LinkedIn", "YouTube", "Email"], riskNotes: ["Keep story relevant to audience pain."], scoringHints: ["Score grows with clear lesson-to-action."], exampleSkeleton: "We built this after seeing X. Here is what we learned and built." },
  { id: "social_proof", name: "Social Proof", whenToUse: "Decision-stage prospects.", whenNotToUse: "No verifiable proof.", structure: ["Who achieved result", "What changed", "How", "CTA"], platformFit: ["Facebook", "LinkedIn", "Landing page"], riskNotes: ["Proof must be attributable."], scoringHints: ["Names/roles increase trust score."], exampleSkeleton: "Teams like yours used this process and improved Y." },
  { id: "myth_busting", name: "Myth Busting", whenToUse: "Correcting bad industry habits.", whenNotToUse: "When audience trusts myth deeply and no data exists.", structure: ["Myth", "Reality", "Evidence", "Alternative", "CTA"], platformFit: ["Blog / SEO", "LinkedIn", "YouTube"], riskNotes: ["Avoid hostile framing."], scoringHints: ["Needs at least one evidence citation."], exampleSkeleton: "Myth: X. Reality: Y. Here is what to do instead." },
  { id: "urgency_event", name: "Urgency / Event", whenToUse: "Seasonal and deadline campaigns.", whenNotToUse: "Evergreen content without deadline.", structure: ["Event", "Opportunity/risk", "Action now", "Deadline", "CTA"], platformFit: ["Email", "Facebook", "Instagram"], riskNotes: ["No fake scarcity."], scoringHints: ["Deadline clarity boosts score."], exampleSkeleton: "With [event] coming, do this now before [date]." },
  { id: "transformation", name: "Transformation", whenToUse: "Narrative growth marketing.", whenNotToUse: "No measurable destination.", structure: ["Starting state", "Journey", "Destination", "CTA"], platformFit: ["YouTube", "Instagram", "Blog / SEO"], riskNotes: ["Avoid unrealistic promises."], scoringHints: ["Needs concrete markers of progress."], exampleSkeleton: "From chaotic workflows to clear daily control in 30 days." },
  { id: "checklist_listicle", name: "Checklist / Listicle", whenToUse: "Scannable educational content.", whenNotToUse: "Complex strategic context needed.", structure: ["Intro", "Numbered steps", "Summary", "CTA"], platformFit: ["Blog / SEO", "LinkedIn", "Email"], riskNotes: ["Avoid shallow tips."], scoringHints: ["Specificity and order matter."], exampleSkeleton: "Use this 7-step checklist before your next campaign launch." },
  { id: "curiosity_gap", name: "Curiosity Gap", whenToUse: "Short-form attention hooks.", whenNotToUse: "High-stakes compliance content.", structure: ["Unexpected statement", "Tension", "Reveal", "CTA"], platformFit: ["TikTok", "Instagram Reels", "YouTube Shorts"], riskNotes: ["Do not bait-and-switch."], scoringHints: ["Opening line novelty drives score."], exampleSkeleton: "Most teams miss this one step. Here is why it matters." },
  { id: "data_stat_insight", name: "Data / Stat Insight", whenToUse: "Authority and trust-led campaigns.", whenNotToUse: "No reliable data source.", structure: ["Stat", "Interpretation", "Implication", "Action", "CTA"], platformFit: ["LinkedIn", "Blog / SEO", "Email"], riskNotes: ["Stats must be sourced."], scoringHints: ["Higher score if source and sample context are clear."], exampleSkeleton: "Data shows X. Here is what that means for your next campaign." },
  { id: "objection_flip", name: "Objection Flip", whenToUse: "Middle/bottom funnel.", whenNotToUse: "Audience has not seen offer yet.", structure: ["Objection", "Reframe", "Evidence", "Low-risk next step", "CTA"], platformFit: ["Email", "LinkedIn", "Landing page"], riskNotes: ["Never dismiss legitimate risk."], scoringHints: ["Needs evidence plus low-risk CTA."], exampleSkeleton: "If you think X, here is what we found and what to try first." },
];

const ANGLE_FRAMEWORKS: MarketingAngleFramework[] = [
  { id: "pain_point", name: "Pain Point", whenToUse: "Clear user frustration.", whenNotToUse: "Aspirational brand moments.", structure: ["Pain", "Impact", "Fix"], platformFit: ["Facebook", "Email", "TikTok"], riskNotes: ["Do not exaggerate harm."], scoringHints: ["Specific pain beats generic pain."] },
  { id: "aspiration", name: "Aspiration", whenToUse: "Identity-led campaigns.", whenNotToUse: "Urgent tactical fixes.", structure: ["Desired identity", "Bridge", "Proof"], platformFit: ["Instagram", "YouTube"], riskNotes: ["Avoid unrealistic outcomes."], scoringHints: ["Show believable path."] },
  { id: "status", name: "Status", whenToUse: "Authority positioning.", whenNotToUse: "Community support messaging.", structure: ["Status marker", "Mechanism", "Call"], platformFit: ["LinkedIn", "YouTube"], riskNotes: ["Can feel exclusionary."], scoringHints: ["Pair with value-first message."] },
  { id: "fomo", name: "FOMO", whenToUse: "Time-bound windows.", whenNotToUse: "No real deadline.", structure: ["What is missed", "Deadline", "Action"], platformFit: ["Email", "Instagram"], riskNotes: ["No fake scarcity."], scoringHints: ["Real deadlines only."] },
  { id: "time_saving", name: "Time Saving", whenToUse: "Operational buyers.", whenNotToUse: "Luxury/aesthetic campaigns.", structure: ["Current time waste", "Saved time", "Use case"], platformFit: ["LinkedIn", "Facebook"], riskNotes: ["Must be grounded."], scoringHints: ["Quantify where possible."] },
  { id: "money_saving", name: "Money Saving", whenToUse: "Cost-sensitive prospects.", whenNotToUse: "Premium status campaigns.", structure: ["Leak", "Savings path", "Caveat"], platformFit: ["Facebook", "Email"], riskNotes: ["No fake ROI."], scoringHints: ["Needs transparent assumptions."] },
  { id: "trust_safety", name: "Trust / Safety", whenToUse: "Risk-aware audiences.", whenNotToUse: "Edgy trend content.", structure: ["Risk", "Guardrail", "Proof"], platformFit: ["LinkedIn", "Email", "Blog / SEO"], riskNotes: ["Avoid fear tactics."], scoringHints: ["Clarity of safeguards."] },
  { id: "authority", name: "Authority", whenToUse: "Expert-driven offers.", whenNotToUse: "UGC/community-first narratives.", structure: ["Credibility", "Framework", "Result"], platformFit: ["LinkedIn", "YouTube"], riskNotes: ["Must be verifiable."], scoringHints: ["Evidence depth."] },
  { id: "community", name: "Community", whenToUse: "Belonging and retention.", whenNotToUse: "Hard-sell one-off pushes.", structure: ["Shared identity", "Participation", "Next step"], platformFit: ["Facebook", "Instagram", "Email"], riskNotes: ["Do not manufacture social proof."], scoringHints: ["Specific invitation quality."] },
  { id: "seasonal_event", name: "Seasonal / Event", whenToUse: "Calendar moments.", whenNotToUse: "Out-of-season messaging.", structure: ["Event", "Need", "Offer"], platformFit: ["Instagram", "Email", "TikTok"], riskNotes: ["Window must be real."], scoringHints: ["Timing relevance."] },
  { id: "demo_proof", name: "Demo / Proof", whenToUse: "Skeptical audiences.", whenNotToUse: "No demonstrable workflow.", structure: ["Demo", "Result", "Takeaway"], platformFit: ["YouTube", "LinkedIn", "TikTok"], riskNotes: ["Show real outputs only."], scoringHints: ["Concrete demonstration."] },
  { id: "comparison", name: "Comparison", whenToUse: "Alternative evaluation.", whenNotToUse: "Direct legal risk markets.", structure: ["Option A vs B", "Tradeoff", "Recommendation"], platformFit: ["LinkedIn", "Blog / SEO"], riskNotes: ["Avoid defamatory claims."], scoringHints: ["Fairness and evidence."] },
];

const EMOTIONAL_TRIGGERS = ["relief", "trust", "confidence", "urgency", "curiosity", "pride", "belonging", "authority", "simplicity", "safety", "control", "transformation"] as const;

const CTA_LIBRARY: MarketingCtaEntry[] = [
  { id: "trial_signup", intent: "trial signup", examples: ["Start free trial", "Try it in your workflow"], platformFit: ["LinkedIn", "Email", "Landing page"], caution: "Only when onboarding is ready." },
  { id: "demo_booking", intent: "demo booking", examples: ["Book a live demo", "See your setup walkthrough"], platformFit: ["LinkedIn", "Email"], caution: "Needs clear calendar path." },
  { id: "lead_magnet", intent: "lead magnet", examples: ["Get checklist", "Download planner"], platformFit: ["Blog / SEO", "Facebook"], caution: "Asset must exist." },
  { id: "consultation", intent: "consultation", examples: ["Request consultation", "Talk to strategist"], platformFit: ["LinkedIn", "Email"], caution: "Avoid aggressive urgency." },
  { id: "waitlist", intent: "waitlist", examples: ["Join waitlist", "Reserve early access"], platformFit: ["Instagram", "TikTok", "Email"], caution: "No fake availability claims." },
  { id: "direct_purchase", intent: "direct purchase", examples: ["Buy now", "Secure your seat"], platformFit: ["Facebook", "Email"], caution: "Requires pricing clarity." },
  { id: "app_install", intent: "app install", examples: ["Install the app", "Get started on mobile"], platformFit: ["TikTok", "Instagram", "YouTube"], caution: "Store links must be valid." },
  { id: "community_join", intent: "community join", examples: ["Join community", "Get peer support"], platformFit: ["Facebook", "Instagram", "Email"], caution: "Community endpoint must exist." },
  { id: "referral", intent: "referral", examples: ["Refer a teammate", "Share with your yard manager"], platformFit: ["Email", "In-app"], caution: "Rewards must be real." },
  { id: "reactivation", intent: "reactivation", examples: ["Resume your trial", "Pick up where you left off"], platformFit: ["Email", "SMS"], caution: "Do not imply recent activity if none." },
];

const NICHE_TEMPLATES: MarketingNicheTemplate[] = [
  { id: "stable_owner_time_saving", title: "Stable owner time-saving campaign", audience: "Stable owners", goal: "Reduce admin overhead", recommendedHooks: ["hidden_cost", "quick_win"], recommendedAngles: ["time_saving", "trust_safety"], ctaIntent: "demo booking", structure: ["Pain", "Time cost", "Workflow fix", "Demo CTA"] },
  { id: "horse_health_record", title: "Horse health record campaign", audience: "Horse owners and caretakers", goal: "Improve compliance and visibility", recommendedHooks: ["checklist_listicle", "problem_agitate_solve"], recommendedAngles: ["trust_safety", "authority"], ctaIntent: "trial signup", structure: ["Missed record risk", "Checklist", "Platform walkthrough", "Trial CTA"] },
  { id: "livery_yard_organisation", title: "Livery yard organisation campaign", audience: "Livery yard teams", goal: "Operational consistency", recommendedHooks: ["before_after", "mistake_to_avoid"], recommendedAngles: ["time_saving", "community"], ctaIntent: "consultation", structure: ["Chaos snapshot", "Structured process", "Team adoption", "Consultation CTA"] },
  { id: "student_academy_onboarding", title: "Student/academy onboarding campaign", audience: "Students and admins", goal: "Faster onboarding", recommendedHooks: ["quick_win", "checklist_listicle"], recommendedAngles: ["simplicity", "community"], ctaIntent: "lead_magnet", structure: ["First-day friction", "Onboarding map", "Checklist download"] },
  { id: "instructor_authority", title: "Instructor authority campaign", audience: "Riders and parents", goal: "Build instructor trust", recommendedHooks: ["founder_story", "social_proof"], recommendedAngles: ["authority", "trust_safety"], ctaIntent: "demo booking", structure: ["Instructor philosophy", "Proof", "Program CTA"] },
  { id: "seasonal_yard_management", title: "Seasonal yard management campaign", audience: "Yard managers", goal: "Season readiness", recommendedHooks: ["urgency_event", "checklist_listicle"], recommendedAngles: ["seasonal_event", "time_saving"], ctaIntent: "lead_magnet", structure: ["Season risk", "Preparation checklist", "Export template CTA"] },
  { id: "inactive_trial_reactivation", title: "Inactive trial reactivation campaign", audience: "Dormant trial users", goal: "Win-back", recommendedHooks: ["objection_flip", "quick_win"], recommendedAngles: ["reactivation", "trust_safety"], ctaIntent: "reactivation", structure: ["Where they stalled", "One-step restart", "Resume CTA"] },
  { id: "school_teacher_seat", title: "School/teacher seat campaign", audience: "School admins", goal: "Seat adoption", recommendedHooks: ["hidden_cost", "comparison"], recommendedAngles: ["money_saving", "authority"], ctaIntent: "consultation", structure: ["Underutilization cost", "Role-based rollout", "Consultation CTA"] },
];

export function listMarketingHookFrameworks() {
  return HOOK_FRAMEWORKS;
}

export function listMarketingAngleFrameworks() {
  return ANGLE_FRAMEWORKS;
}

export function listMarketingCtaLibrary() {
  return CTA_LIBRARY;
}

export function listMarketingNicheCampaignTemplates() {
  return NICHE_TEMPLATES;
}

export function recommendMarketingPlaybook(input: {
  platform: string;
  goal: string;
  audience?: string;
  campaignType?: string;
}) {
  const platform = input.platform.toLowerCase();
  const hooks = HOOK_FRAMEWORKS.filter((framework) => framework.platformFit.some((item) => item.toLowerCase().includes(platform))).slice(0, 3);
  const angles = ANGLE_FRAMEWORKS.filter((framework) => framework.platformFit.some((item) => item.toLowerCase().includes(platform))).slice(0, 3);
  const ctas = CTA_LIBRARY.filter((entry) => entry.platformFit.some((item) => item.toLowerCase().includes(platform))).slice(0, 3);
  const nicheTemplate = NICHE_TEMPLATES.find((template) => input.campaignType && template.id === input.campaignType) ?? null;

  return {
    status: "ok" as const,
    goal: input.goal,
    audience: input.audience ?? null,
    selectedHooks: hooks,
    selectedAngles: angles,
    selectedCtas: ctas,
    nicheTemplate,
    emotionalTriggerLibrary: EMOTIONAL_TRIGGERS,
    notes: hooks.length === 0 || angles.length === 0
      ? ["insufficient_platform_specific_examples", "fallback_to_generic_playbook"]
      : [],
  };
}

export function buildMarketingGeniusPromptContext(input: {
  platform: string;
  goal: string;
  audience?: string;
  campaignType?: string;
}) {
  const playbook = recommendMarketingPlaybook(input);
  return {
    playbook,
    frameworkIds: playbook.selectedHooks.map((item) => item.id),
    angleIds: playbook.selectedAngles.map((item) => item.id),
    ctaIntents: playbook.selectedCtas.map((item) => item.intent),
    sourceLabel: "generic_playbook",
  };
}
