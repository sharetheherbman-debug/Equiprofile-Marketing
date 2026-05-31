export type MarketingMediaTemplate = {
  id: string;
  name: string;
  category: "video" | "thumbnail" | "caption";
  suitableFor: string[];
  pacingRules: string[];
  overlayRules: string[];
  notes: string[];
};

const MEDIA_TEMPLATES: MarketingMediaTemplate[] = [
  { id: "remotion_branded_short", name: "Branded Short Form", category: "video", suitableFor: ["tiktok", "instagram", "youtube"], pacingRules: ["Cut every 1-2s", "Hook in first 2s"], overlayRules: ["Logo in safe corner", "Captions stay in safe area"], notes: ["Requires real render output."] },
  { id: "before_after_split", name: "Before/After Split Screen", category: "video", suitableFor: ["instagram", "youtube", "facebook"], pacingRules: ["Contrast before vs after in first 4s"], overlayRules: ["Label each side clearly"], notes: ["Use only when both source assets exist."] },
  { id: "testimonial_layout", name: "Testimonial Layout", category: "video", suitableFor: ["linkedin", "facebook", "youtube"], pacingRules: ["Proof clip first", "CTA at end"], overlayRules: ["Name/title lower-third"], notes: ["Do not fabricate testimonials."] },
  { id: "product_demo_layout", name: "Product Demo Layout", category: "video", suitableFor: ["linkedin", "youtube", "instagram"], pacingRules: ["Show workflow before narration detail"], overlayRules: ["Feature labels"], notes: ["Pair with voice clarity checks."] },
  { id: "short_form_thumbnail", name: "Short-form Thumbnail", category: "thumbnail", suitableFor: ["youtube", "instagram"], pacingRules: ["N/A"], overlayRules: ["High-contrast text", "Single focal subject"], notes: ["No misleading clickbait claims." ] },
  { id: "high_legibility_captions", name: "High Legibility Captions", category: "caption", suitableFor: ["all"], pacingRules: ["Sync to speech beats"], overlayRules: ["Min 2-line blocks", "Safe area and contrast"], notes: ["Auto captions must be reviewed."] },
];

export function listMarketingMediaTemplates() {
  return MEDIA_TEMPLATES;
}

export function recommendMarketingMediaTemplate(input: {
  platform: string;
  contentType: string;
  includesAvatar?: boolean;
  includesBeforeAfter?: boolean;
}) {
  const platform = input.platform.toLowerCase();
  const candidates = MEDIA_TEMPLATES.filter((template) => template.suitableFor.includes("all") || template.suitableFor.some((fit) => platform.includes(fit)));

  let preferred = candidates[0] ?? null;
  if (input.includesBeforeAfter) {
    preferred = candidates.find((template) => template.id === "before_after_split") ?? preferred;
  }
  if (input.contentType.toLowerCase().includes("thumbnail")) {
    preferred = candidates.find((template) => template.category === "thumbnail") ?? preferred;
  }

  return {
    status: preferred ? "ok" : "setup_needed",
    template: preferred,
    alternatives: candidates.slice(0, 5),
  } as const;
}

export function buildMarketingVideoPacingPlan(input: {
  durationSeconds: number;
  platform: string;
  hasVoiceover: boolean;
  hasMusic: boolean;
}) {
  const beat = input.platform.toLowerCase().includes("linkedin") ? 3 : 2;
  const beats = Math.max(1, Math.ceil(input.durationSeconds / beat));
  const warnings: string[] = [];
  if (!input.hasVoiceover) warnings.push("voiceover_missing");
  if (!input.hasMusic) warnings.push("background_music_missing");

  return {
    status: "ok" as const,
    beatSeconds: beat,
    beatCount: beats,
    pacingRules: ["Hook in first 2 seconds", `Visual change every ~${beat}s`],
    warnings,
  };
}

export function buildMarketingThumbnailPlan(input: {
  platform: string;
  keyMessage: string;
  hasLogo: boolean;
}) {
  const warnings: string[] = [];
  if (!input.hasLogo) warnings.push("logo_missing");
  return {
    status: "ok" as const,
    recommendedText: input.keyMessage.slice(0, 48),
    contrastRule: "Use high-contrast foreground/background pair",
    safeAreaRule: "Keep text within central 80% frame",
    warnings,
  };
}

export function buildMarketingCaptionStylePlan(input: {
  platform: string;
  voiceTone?: string;
}) {
  return {
    status: "ok" as const,
    style: input.platform.toLowerCase().includes("linkedin") ? "clean-professional" : "bold-short-form",
    maxCharsPerLine: input.platform.toLowerCase().includes("youtube") ? 42 : 36,
    maxLines: 2,
    emphasisRule: "Highlight one keyword per caption block",
    toneHint: input.voiceTone ?? "neutral",
  };
}

export function validateMarketingMediaExcellence(input: {
  hasRenderedOutput: boolean;
  hasCaptionTrack: boolean;
  hasLogoSafeOverlay: boolean;
  musicLicenseStatus?: "approved" | "missing" | "unknown";
  voiceQualityStatus?: "ok" | "noisy" | "missing";
}) {
  const blockingIssues: string[] = [];
  const warnings: string[] = [];

  if (!input.hasRenderedOutput) blockingIssues.push("render_output_missing");
  if (!input.hasCaptionTrack) warnings.push("captions_missing");
  if (!input.hasLogoSafeOverlay) warnings.push("logo_safe_overlay_missing");
  if (input.musicLicenseStatus === "missing" || input.musicLicenseStatus === "unknown") {
    blockingIssues.push("music_license_review_required");
  }
  if (input.voiceQualityStatus === "missing") blockingIssues.push("voice_track_missing");
  if (input.voiceQualityStatus === "noisy") warnings.push("voice_quality_noisy");

  return {
    status: blockingIssues.length ? "manual_review_required" : "ok",
    blockingIssues,
    warnings,
  } as const;
}
