export type MarketingPlatformSpecialist = {
  id: string;
  name: string;
  platform: string;
  platformRules: string[];
  idealContentLength: string;
  openingHookRules: string[];
  pacingRules: string[];
  ctaStyle: string[];
  hashtagRules: string[];
  visualRules: string[];
  trustProofRequirements: string[];
  commonMistakes: string[];
  reviewChecklist: string[];
  scoringWeights: Record<string, number>;
  bestFormats: string[];
  badFitFormats: string[];
  exampleStructures: string[];
};

const SPECIALISTS: MarketingPlatformSpecialist[] = [
  { id: "tiktok_reels", name: "TikTok/Reels Specialist", platform: "TikTok", platformRules: ["Hook in first 1-2 seconds", "Native camera language"], idealContentLength: "8-35 seconds", openingHookRules: ["Pattern interrupt first", "No long intro"], pacingRules: ["Cut every 1-2 seconds"], ctaStyle: ["Soft CTA at end", "Comment keyword CTA"], hashtagRules: ["3-5 hashtags mix niche+broad"], visualRules: ["High motion", "On-screen captions"], trustProofRequirements: ["Show process/proof fast"], commonMistakes: ["Corporate opener", "Overlong context"], reviewChecklist: ["Hook speed", "Caption readability", "Clear CTA"], scoringWeights: { hook: 0.2, pacing: 0.2, cta: 0.1, platformFit: 0.2, proof: 0.15, clarity: 0.15 }, bestFormats: ["short-form demo", "before_after", "quick_tip"], badFitFormats: ["long webinar clip", "dense static text"], exampleStructures: ["Hook > pain > fix > CTA"] },
  { id: "instagram", name: "Instagram Specialist", platform: "Instagram", platformRules: ["Visual first", "Story+Reel cadence"], idealContentLength: "7-45 seconds", openingHookRules: ["Strong visual first frame"], pacingRules: ["Rhythm aligned with beat/transitions"], ctaStyle: ["Save/share CTA", "Bio link CTA"], hashtagRules: ["5-10 targeted hashtags"], visualRules: ["Brand palette consistency", "Readable text overlays"], trustProofRequirements: ["Proof tile or outcome frame"], commonMistakes: ["Tiny text", "No first-frame impact"], reviewChecklist: ["Cover quality", "Visual consistency", "CTA clarity"], scoringWeights: { hook: 0.15, visualImpact: 0.25, cta: 0.1, platformFit: 0.2, proof: 0.1, clarity: 0.2 }, bestFormats: ["reels", "carousel"], badFitFormats: ["long text monologue"], exampleStructures: ["Visual hook > context > payoff > CTA"] },
  { id: "linkedin_authority", name: "LinkedIn Authority Specialist", platform: "LinkedIn", platformRules: ["Insight-led", "Proof-backed claims"], idealContentLength: "80-250 words or 30-90s video", openingHookRules: ["State contrarian or data insight"], pacingRules: ["One idea per post"], ctaStyle: ["Discussion CTA", "Demo CTA"], hashtagRules: ["2-4 professional hashtags"], visualRules: ["Clean charts/screens", "Readable slides"], trustProofRequirements: ["Citations, case references"], commonMistakes: ["Discount language", "Hype without proof"], reviewChecklist: ["Evidence clarity", "Audience relevance", "Professional tone"], scoringWeights: { hook: 0.15, trust: 0.25, clarity: 0.2, cta: 0.1, platformFit: 0.2, compliance: 0.1 }, bestFormats: ["authority post", "mini case study"], badFitFormats: ["meme-first hard sell"], exampleStructures: ["Insight > evidence > implication > CTA"] },
  { id: "facebook_ads", name: "Facebook Ads Specialist", platform: "Facebook", platformRules: ["Thumb-stop visual", "Benefit-first copy"], idealContentLength: "Primary text 60-180 chars", openingHookRules: ["Pain/benefit in first line"], pacingRules: ["Single focused promise"], ctaStyle: ["Learn more", "Book now"], hashtagRules: ["Optional; minimal"], visualRules: ["Clear subject", "High contrast"], trustProofRequirements: ["Social proof snippets"], commonMistakes: ["Multiple offers", "No landing fit"], reviewChecklist: ["Offer clarity", "CTA match", "Compliance checks"], scoringWeights: { hook: 0.2, clarity: 0.2, cta: 0.15, trust: 0.15, platformFit: 0.2, risk: 0.1 }, bestFormats: ["single image", "short video"], badFitFormats: ["dense tutorial"], exampleStructures: ["Pain > promise > proof > CTA"] },
  { id: "youtube_shorts", name: "YouTube Shorts Specialist", platform: "YouTube", platformRules: ["Immediate promise", "Retention-focused sequence"], idealContentLength: "15-50 seconds", openingHookRules: ["Promise + curiosity"], pacingRules: ["Escalating payoff"], ctaStyle: ["Subscribe/comment CTA", "Link CTA"], hashtagRules: ["0-3 topical tags"], visualRules: ["Safe-area captions", "Strong thumbnail frame"], trustProofRequirements: ["Demonstrable claim"], commonMistakes: ["Late hook", "No payoff"], reviewChecklist: ["Retention moments", "CTA placement", "Caption safety"], scoringWeights: { hook: 0.2, pacing: 0.2, payoff: 0.2, cta: 0.1, platformFit: 0.2, clarity: 0.1 }, bestFormats: ["demo", "comparison", "myth_bust"], badFitFormats: ["slow intro lecture"], exampleStructures: ["Promise > proof > takeaway > CTA"] },
  { id: "email_conversion", name: "Email Conversion Specialist", platform: "Email", platformRules: ["Clear subject line", "Single intent"], idealContentLength: "80-220 words", openingHookRules: ["Subject + first line alignment"], pacingRules: ["One narrative arc"], ctaStyle: ["Single button or reply CTA"], hashtagRules: ["None"], visualRules: ["Minimal formatting"], trustProofRequirements: ["Specific proof point"], commonMistakes: ["Too many CTAs", "Vague benefit"], reviewChecklist: ["Subject relevance", "CTA strength", "Proof validity"], scoringWeights: { hook: 0.1, clarity: 0.25, cta: 0.25, trust: 0.2, platformFit: 0.15, risk: 0.05 }, bestFormats: ["reactivation", "launch", "nurture"], badFitFormats: ["hashtag-heavy social copy"], exampleStructures: ["Hook > value > proof > CTA"] },
  { id: "seo_blog", name: "SEO/Blog Specialist", platform: "Blog / SEO", platformRules: ["Search intent fit", "Scannable structure"], idealContentLength: "600-1800 words", openingHookRules: ["Problem + promise"], pacingRules: ["Section hierarchy"], ctaStyle: ["Inline resource CTA", "End-of-article CTA"], hashtagRules: ["None"], visualRules: ["Helpful diagrams/screens"], trustProofRequirements: ["Source links"], commonMistakes: ["Thin content", "No entity clarity"], reviewChecklist: ["Intent match", "Evidence links", "Readable hierarchy"], scoringWeights: { clarity: 0.25, trust: 0.2, platformFit: 0.25, cta: 0.1, novelty: 0.1, risk: 0.1 }, bestFormats: ["how_to", "comparison", "checklist"], badFitFormats: ["pure short-form script"], exampleStructures: ["Intro > sections > summary > CTA"] },
  { id: "launch_strategist", name: "Launch Campaign Strategist", platform: "Multi-platform", platformRules: ["Pre-launch warmup", "Launch day cadence", "Post-launch proof"], idealContentLength: "Sequence-based", openingHookRules: ["Outcome + timing"], pacingRules: ["Phased content"], ctaStyle: ["Waitlist", "Apply", "Buy"], hashtagRules: ["Platform-specific"], visualRules: ["Consistent launch motif"], trustProofRequirements: ["Proof and FAQ"], commonMistakes: ["No preheat", "No objection handling"], reviewChecklist: ["Phase coverage", "Proof coverage", "CTA alignment"], scoringWeights: { strategy: 0.25, cta: 0.2, trust: 0.2, platformFit: 0.2, clarity: 0.15 }, bestFormats: ["countdown", "proof", "FAQ"], badFitFormats: ["single-post launch"], exampleStructures: ["Tease > educate > reveal > proof > close"] },
  { id: "retargeting", name: "Retargeting Specialist", platform: "Paid + Email", platformRules: ["Message by stage", "Objection-led follow-up"], idealContentLength: "Short and stage-specific", openingHookRules: ["Reference prior touchpoint"], pacingRules: ["Progressive specificity"], ctaStyle: ["Resume", "Book", "Buy"], hashtagRules: ["Not required"], visualRules: ["Reminder creative variants"], trustProofRequirements: ["Stage-appropriate proof"], commonMistakes: ["Repeating top-funnel copy"], reviewChecklist: ["Stage map", "Objection fit", "Frequency controls"], scoringWeights: { relevance: 0.25, cta: 0.2, trust: 0.2, platformFit: 0.2, clarity: 0.15 }, bestFormats: ["objection flip", "case snippet"], badFitFormats: ["generic awareness post"], exampleStructures: ["Seen us? > objection > proof > CTA"] },
  { id: "community_growth", name: "Community Growth Specialist", platform: "Community", platformRules: ["Participation loops", "Recognition mechanics"], idealContentLength: "Prompt-based", openingHookRules: ["Invite contribution"], pacingRules: ["Question then follow-up"], ctaStyle: ["Comment", "Share example", "Join"], hashtagRules: ["Minimal"], visualRules: ["Human and authentic"], trustProofRequirements: ["Real member stories"], commonMistakes: ["Broadcast-only posting"], reviewChecklist: ["Prompt quality", "Response plan", "Community safety"], scoringWeights: { engagement: 0.3, trust: 0.2, platformFit: 0.2, clarity: 0.15, cta: 0.15 }, bestFormats: ["Q&A", "member spotlight"], badFitFormats: ["hard conversion push"], exampleStructures: ["Prompt > response examples > join CTA"] },
];

export function listMarketingPlatformSpecialists() {
  return SPECIALISTS;
}

export function getMarketingPlatformSpecialist(input: { id: string }) {
  return SPECIALISTS.find((item) => item.id === input.id) ?? null;
}

export function recommendSpecialistsForCampaign(input: {
  platforms: string[];
  goal: string;
  contentTypes?: string[];
}) {
  const lowerPlatforms = input.platforms.map((item) => item.toLowerCase());
  const matched = SPECIALISTS.filter((item) => {
    if (item.platform === "Multi-platform" || item.platform === "Paid + Email" || item.platform === "Community") return true;
    return lowerPlatforms.some((platform) => item.platform.toLowerCase().includes(platform) || platform.includes(item.platform.toLowerCase()));
  });
  return {
    status: matched.length ? "ok" : "insufficient_data",
    specialists: matched,
    notes: matched.length ? [] : ["No platform specialist match found; fallback to generic playbook."],
  } as const;
}

export function buildPlatformSpecialistPromptContext(input: {
  platforms: string[];
  goal: string;
  contentTypes?: string[];
}) {
  const recommendation = recommendSpecialistsForCampaign(input);
  return {
    source: "platform_specialist",
    status: recommendation.status,
    specialists: recommendation.specialists.map((item) => ({
      id: item.id,
      name: item.name,
      rules: item.platformRules,
      checklist: item.reviewChecklist,
      bestFormats: item.bestFormats,
    })),
    notes: recommendation.notes,
  };
}

export function scoreMarketingPlatformFit(input: {
  specialistId: string;
  contentFormat: string;
  contentLengthHint?: string;
  hasCta: boolean;
  hasProof: boolean;
}) {
  const specialist = getMarketingPlatformSpecialist({ id: input.specialistId });
  if (!specialist) {
    return { status: "setup_needed" as const, reason: "specialist_missing", score: 0, warnings: ["specialist_missing"] };
  }

  let score = 0;
  const warnings: string[] = [];
  if (specialist.bestFormats.includes(input.contentFormat)) score += 40;
  if (specialist.badFitFormats.includes(input.contentFormat)) {
    score -= 25;
    warnings.push("bad_fit_format");
  }
  if (input.hasCta) score += 20;
  else warnings.push("missing_cta");
  if (input.hasProof) score += 20;
  else warnings.push("missing_proof");
  if (input.contentLengthHint) score += 10;

  return {
    status: "ok" as const,
    score: Math.max(0, Math.min(100, score)),
    warnings,
    checklist: specialist.reviewChecklist,
  };
}
