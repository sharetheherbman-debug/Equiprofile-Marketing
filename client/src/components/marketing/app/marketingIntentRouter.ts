import type { MarketingContentType } from "@shared/_core/marketingStudioPlan";

export type MarketingIntent =
  | {
    workflow: "image_ad";
    label: string;
    platform: string;
  }
  | {
    workflow: "assembled_video";
    label: string;
    contentType: MarketingContentType;
    platform: string;
    durationSeconds: number;
  }
  | {
    workflow: "campaign";
    label: string;
    packageType: "signup_campaign" | "weekly_content_pack" | "email_campaign" | "social_post" | "paid_social_ad";
  }
  | {
    workflow: "clarify";
    label: string;
    question: string;
  };

function readDurationSeconds(prompt: string) {
  const minuteMatch = prompt.match(/(\d{1,2})[\s-]*(?:minute|minutes|min)\b/i);
  if (minuteMatch) return Number(minuteMatch[1]) * 60;
  const secondMatch = prompt.match(/(\d{1,3})[\s-]*(?:second|seconds|sec|secs|s)\b/i);
  return secondMatch ? Number(secondMatch[1]) : null;
}

function videoType(prompt: string, durationSeconds: number): Pick<Extract<MarketingIntent, { workflow: "assembled_video" }>, "contentType" | "platform"> {
  const lower = prompt.toLowerCase();
  if (/youtube/.test(lower) && (durationSeconds >= 120 || /explainer|long[-\s]?form|3[\s-]?minute/.test(lower))) {
    return { contentType: "youtube_3min_video", platform: "YouTube" };
  }
  if (/youtube|shorts?/.test(lower)) return { contentType: "youtube_short", platform: "YouTube" };
  if (/tiktok/.test(lower)) return { contentType: "tiktok_video", platform: "TikTok" };
  if (/instagram/.test(lower)) return { contentType: "instagram_reel", platform: "Instagram" };
  return { contentType: "facebook_ad", platform: "Facebook" };
}

export function inferMarketingWorkspaceIntent(prompt: string): MarketingIntent {
  const lower = prompt.trim().toLowerCase();
  if (!lower) {
    return {
      workflow: "clarify",
      label: "Tell us what to create",
      question: "What would you like to create: an image advert, a video, or a campaign?",
    };
  }

  if (/\b(signup|sign up|sign-up|trial|growth|relaunch)\b/.test(lower) && /\bcampaign\b/.test(lower)) {
    return { workflow: "campaign", label: "Signup campaign", packageType: "signup_campaign" };
  }
  if (/\b(email|newsletter)\b/.test(lower)) {
    return { workflow: "campaign", label: "Email campaign", packageType: "email_campaign" };
  }
  if (/\b(weekly|7[\s-]?day)\b/.test(lower) && /\b(content|campaign|plan)\b/.test(lower)) {
    return { workflow: "campaign", label: "Weekly content pack", packageType: "weekly_content_pack" };
  }

  const durationSeconds = readDurationSeconds(lower);
  const videoRequested = /\b(video|reel|short|shorts|tiktok|youtube|avatar)\b/.test(lower);
  if (videoRequested) {
    const duration = durationSeconds ?? (/short|reel|tiktok/.test(lower) ? 30 : /youtube/.test(lower) ? 180 : 60);
    const type = videoType(lower, duration);
    return {
      workflow: "assembled_video",
      label: `${type.platform} assembled video`,
      contentType: type.contentType,
      platform: type.platform,
      durationSeconds: duration,
    };
  }

  if (/\b(image|static|graphic|banner|poster|thumbnail|advert|advertisement|ad creative)\b/.test(lower)) {
    return {
      workflow: "image_ad",
      label: "Image advert",
      platform: /instagram/.test(lower) ? "Instagram" : /linkedin/.test(lower) ? "LinkedIn" : "Facebook",
    };
  }
  if (/\b(paid social|\bad\b)\b/.test(lower)) {
    return { workflow: "campaign", label: "Paid social advert", packageType: "paid_social_ad" };
  }
  if (/\b(post|caption|social)\b/.test(lower)) {
    return { workflow: "campaign", label: "Social post", packageType: "social_post" };
  }
  if (/\bcampaign\b/.test(lower)) {
    return { workflow: "campaign", label: "Campaign package", packageType: "signup_campaign" };
  }

  return {
    workflow: "clarify",
    label: "One quick question",
    question: "Should I create an image advert, an assembled video, or a multi-day campaign?",
  };
}
