import type { MarketingEventEnvelope } from "./marketingPublisher";

type MarketingConsentState = MarketingEventEnvelope["consentState"];

function parsePreferences(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

/**
 * Marketing publishing is opt-in only. Service-notification settings, account
 * state, subscription state and historic preference records never imply consent.
 */
export function resolveMarketingConsent(
  rawPreferences: unknown,
): MarketingConsentState {
  const preferences = parsePreferences(rawPreferences);
  const notifications = preferences.notifications;
  if (
    notifications &&
    typeof notifications === "object" &&
    !Array.isArray(notifications) &&
    (notifications as Record<string, unknown>).marketingAnalyticsConsent ===
      true
  ) {
    return "marketing_opt_in";
  }
  return "unknown";
}
