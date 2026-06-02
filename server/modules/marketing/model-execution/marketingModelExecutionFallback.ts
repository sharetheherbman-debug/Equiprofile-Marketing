import type { MarketingModelExecutionInput } from "./marketingModelExecutionTypes";

function slug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
}

export function buildMarketingFallbackOutput(input: MarketingModelExecutionInput): Record<string, unknown> {
  const brandName = String(input.brandKit.brandName ?? input.campaignBrief.brandName ?? "Brand");
  const goal = String(input.campaignBrief.goal ?? "campaign growth");
  const audience = String(input.audience ?? input.campaignBrief.audience ?? "audience");
  const offer = String(input.offer ?? input.campaignBrief.offer ?? "offer");
  const cta = String(input.campaignBrief.primaryCta ?? input.brandKit.primaryCta ?? "Learn more");
  const platform = String(input.platform ?? "General");
  const language = String(input.language ?? "English");
  const productProfile = (input.campaignBrief.productProfile ?? {}) as Record<string, unknown>;
  const benefits = Array.isArray(productProfile.benefits) ? productProfile.benefits.map(String).filter(Boolean) : [];
  const features = Array.isArray(productProfile.coreFeatures) ? productProfile.coreFeatures.map(String).filter(Boolean) : [];
  const benefit = benefits[0] ?? features[0] ?? "make the next step clearer";
  const feature = features[0] ?? "a practical workflow";

  switch (input.task) {
    case "platform_copywriting":
      const opening = platform === "LinkedIn"
        ? `${brandName} gives ${audience} a clearer way to ${benefit}.`
        : `${audience}: bring ${feature} into one calmer workflow.`;
      return {
        angle: `${benefit} for ${audience}`,
        hook: `${brandName} helps ${audience} ${benefit}.`,
        body: `${opening} ${brandName} helps with ${feature}. ${offer}. ${cta}`,
        cta,
        hashtags: [`#${slug(brandName)}`, `#${slug(platform)}`, `#${slug(goal.split(" ").slice(0, 3).join(" "))}`],
        visualPrompt: `${platform} creative for ${brandName}, ${goal}, ${offer}`,
        platform,
        contentType: String(input.contentType ?? "post"),
        language,
        reviewStatus: "needs_review",
      };
    case "localization":
      return {
        hook: `${language}: ${brandName} helps ${audience} unlock ${goal}.`,
        body: `${language}: ${brandName} supports ${audience} with ${offer}.`,
        cta,
        reviewStatus: "needs_review",
      };
    case "email_generation":
      const subject = `${brandName}: ${benefit}`;
      return {
        subject,
        previewText: `${benefit}. ${offer}.`,
        body: `Hi ${audience},\n\n${brandName} helps you ${benefit} with ${feature}.\n\n${offer}.\n\n${cta}`,
        cta,
        reviewStatus: "needs_review",
      };
    case "blog_seo_generation":
      return {
        title: `${brandName}: ${goal}`,
        outline: [`Challenge for ${audience}`, `How ${brandName} helps`, `Offer: ${offer}`, `CTA: ${cta}`],
        metaDescription: `${brandName} helps ${audience} reach ${goal}.`,
        reviewStatus: "needs_review",
      };
    default:
      return {
        content: `${brandName} ${input.task} output for ${audience}. Goal: ${goal}. Offer: ${offer}. CTA: ${cta}.`,
        reviewStatus: "needs_review",
      };
  }
}
