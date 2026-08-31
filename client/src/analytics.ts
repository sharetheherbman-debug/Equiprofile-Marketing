/**
 * EquiProfile measurement boundary.
 *
 * Google Tag Manager is the only Google measurement entry point. Consent and
 * event payloads are centralised here so product components never call gtag or
 * write arbitrary objects to dataLayer.
 */

export const COOKIE_CONSENT_KEY = "equiprofile_cookie_consent";
const ATTRIBUTION_KEY = "equiprofile_acquisition_attribution";
const CONSENT_EVENT = "equiprofile:consent-change";
const DUPLICATE_WINDOW_MS = 1_000;

export type ConsentChoice = "accepted" | "declined";
export type MeasurementEventName =
  | "page_view"
  | "sign_up"
  | "login"
  | "generate_lead"
  | "search"
  | "academy_course_view"
  | "academy_enrollment"
  | "academy_lesson_complete"
  | "academy_assessment_complete"
  | "management_opened"
  | "horse_record_created"
  | "management_task_created"
  | "management_calendar_item_created"
  | "marketing_opened"
  | "marketing_campaign_created"
  | "marketing_asset_approved"
  | "marketing_content_published";

type SafeValue = string | number | boolean;
export type MeasurementPayload = Record<string, SafeValue | null | undefined>;

const EVENT_FIELDS: Record<MeasurementEventName, ReadonlySet<string>> = {
  page_view: new Set(["page_path", "page_title"]),
  sign_up: new Set(["method"]),
  login: new Set(["method"]),
  generate_lead: new Set(["lead_source"]),
  search: new Set(["search_term"]),
  academy_course_view: new Set(["course_id", "pathway_id"]),
  academy_enrollment: new Set(["course_id", "enrollment_type"]),
  academy_lesson_complete: new Set(["lesson_id", "pathway_id"]),
  academy_assessment_complete: new Set([
    "lesson_id",
    "score",
    "question_count",
  ]),
  management_opened: new Set(["entry_point"]),
  horse_record_created: new Set(["record_type"]),
  management_task_created: new Set(["task_type", "recurring"]),
  management_calendar_item_created: new Set(["item_type"]),
  marketing_opened: new Set(["entry_point"]),
  marketing_campaign_created: new Set(["campaign_type"]),
  marketing_asset_approved: new Set(["asset_type"]),
  marketing_content_published: new Set(["channel"]),
};

const ATTRIBUTION_PARAMETERS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
]);
const PUBLIC_PAGE_PATHS = new Set([
  "/",
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/for-stables",
  "/for-academies",
  "/ai-operations",
  "/terms",
  "/privacy",
  "/academy",
  "/academy/features",
  "/academy/pricing",
  "/academy/about",
  "/academy/contact",
]);

const OBVIOUS_PII_KEY =
  /(^|_)(email|e_mail|phone|mobile|name|first_name|last_name|full_name|horse_name|message|chat|medical|health|answer|address|postcode|token)($|_)/i;
const OBVIOUS_EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const OBVIOUS_PHONE = /(?:\+?\d[\d\s().-]{7,}\d)/;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __EQUIPROFILE_MEASUREMENT_BOOTSTRAPPED__?: boolean;
    __EQUIPROFILE_MEASUREMENT_INITIALIZED__?: boolean;
  }
}

const recentEvents = new Map<string, number>();
let lastPageKey = "";

function hasBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function ensureDataLayer() {
  if (!hasBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

function consentState(granted: boolean) {
  const value = granted ? "granted" : "denied";
  return {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  };
}

export function readConsentChoice(): ConsentChoice | null {
  if (!hasBrowser()) return null;
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

function validGtmContainerId(value: string | undefined): string | null {
  const candidate = String(value || "")
    .trim()
    .toUpperCase();
  return /^GTM-[A-Z0-9]+$/.test(candidate) ? candidate : null;
}

function loadGtmIfConfigured() {
  if (!hasBrowser()) return;
  const id = validGtmContainerId(import.meta.env.VITE_GTM_CONTAINER_ID);
  if (!id || document.getElementById("equiprofile-gtm")) return;
  window.dataLayer?.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "equiprofile-gtm";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

function isSafeString(value: string): boolean {
  return (
    value.length <= 200 &&
    !OBVIOUS_EMAIL.test(value) &&
    !OBVIOUS_PHONE.test(value) &&
    !/[\r\n]/.test(value)
  );
}

export function sanitizeEventPayload(
  event: MeasurementEventName,
  payload: MeasurementPayload = {},
): Record<string, SafeValue> | null {
  const allowed = EVENT_FIELDS[event];
  const clean: Record<string, SafeValue> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue;
    if (!allowed.has(key) || OBVIOUS_PII_KEY.test(key)) return null;
    if (typeof value === "string") {
      if (!isSafeString(value)) return null;
      clean[key] = value;
      continue;
    }
    if (typeof value === "number") {
      if (!Number.isFinite(value)) return null;
      clean[key] = value;
      continue;
    }
    if (typeof value === "boolean") {
      clean[key] = value;
      continue;
    }
    return null;
  }
  return clean;
}

function attributionFromLocation(): Record<string, string> {
  if (!hasBrowser() || readConsentChoice() !== "accepted") return {};
  const output: Record<string, string> = {};
  const params = new URL(window.location.href).searchParams;
  for (const [rawKey, rawValue] of params) {
    const key = rawKey.toLowerCase();
    const value = rawValue.trim();
    if (ATTRIBUTION_PARAMETERS.has(key) && value && isSafeString(value)) {
      output[key] = value;
    }
  }
  return output;
}

function captureAttribution() {
  if (!hasBrowser() || readConsentChoice() !== "accepted") return;
  const current = attributionFromLocation();
  if (!Object.keys(current).length) return;
  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
  } catch {
    // Measurement must never interfere with application behaviour.
  }
}

export function readAcquisitionAttribution(): Record<string, string> {
  if (!hasBrowser() || readConsentChoice() !== "accepted") return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) =>
          ATTRIBUTION_PARAMETERS.has(key) &&
          typeof value === "string" &&
          isSafeString(value),
      ),
    ) as Record<string, string>;
  } catch {
    return {};
  }
}

export function updateConsent(choice: ConsentChoice) {
  if (!hasBrowser()) return;
  ensureDataLayer();
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    if (choice === "declined") sessionStorage.removeItem(ATTRIBUTION_KEY);
  } catch {
    // The consent command still applies for the current page when storage is unavailable.
  }
  window.gtag?.("consent", "update", consentState(choice === "accepted"));
  if (choice === "accepted") captureAttribution();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

export function trackMeasurementEvent(
  event: MeasurementEventName,
  payload: MeasurementPayload = {},
): boolean {
  if (!hasBrowser() || readConsentChoice() !== "accepted") return false;
  const safePayload = sanitizeEventPayload(event, payload);
  if (!safePayload) return false;
  const eventKey = `${event}:${JSON.stringify(safePayload)}`;
  const now = Date.now();
  const previous = recentEvents.get(eventKey) ?? 0;
  if (now - previous < DUPLICATE_WINDOW_MS) return false;
  recentEvents.set(eventKey, now);
  ensureDataLayer();
  window.dataLayer?.push({
    event,
    ...safePayload,
    acquisition: readAcquisitionAttribution(),
  });
  return true;
}

export function trackPageView(): boolean {
  if (!hasBrowser()) return false;
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const pageKey = `${window.location.origin}${path}`;
  if (lastPageKey === pageKey) return false;
  const safePath = PUBLIC_PAGE_PATHS.has(path)
    ? path
    : `/${path.split("/").filter(Boolean)[0] || "application"}`;
  const sent = trackMeasurementEvent("page_view", {
    page_path: safePath,
    page_title: PUBLIC_PAGE_PATHS.has(path)
      ? document.title.slice(0, 200)
      : "EquiProfile Application",
  });
  if (sent) lastPageKey = pageKey;
  return sent;
}

function initializeRouteMeasurement() {
  if (!hasBrowser()) return;
  const measure = () => {
    trackPageView();
    const site = String(import.meta.env.VITE_SITE || "management");
    const path = window.location.pathname;
    if (
      site === "management" &&
      (path === "/dashboard" || path === "/stable-dashboard")
    ) {
      trackMeasurementEvent("management_opened", { entry_point: "dashboard" });
    }
  };
  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);
  history.pushState = (...args) => {
    originalPushState(...args);
    queueMicrotask(measure);
  };
  history.replaceState = (...args) => {
    originalReplaceState(...args);
    queueMicrotask(measure);
  };
  window.addEventListener("popstate", measure);
  window.addEventListener(CONSENT_EVENT, measure);
  queueMicrotask(measure);
}

function initializeOptionalLegacyAnalytics() {
  if (!hasBrowser() || readConsentChoice() !== "accepted") return;
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  if (
    !endpoint ||
    !websiteId ||
    endpoint.includes("%VITE_") ||
    websiteId.includes("%VITE_") ||
    document.getElementById("equiprofile-legacy-analytics")
  ) {
    return;
  }
  const script = document.createElement("script");
  script.id = "equiprofile-legacy-analytics";
  script.defer = true;
  script.src = `${endpoint.replace(/\/$/, "")}/umami`;
  script.setAttribute("data-website-id", websiteId);
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (!hasBrowser() || window.__EQUIPROFILE_MEASUREMENT_INITIALIZED__) return;
  window.__EQUIPROFILE_MEASUREMENT_INITIALIZED__ = true;
  ensureDataLayer();
  if (!window.__EQUIPROFILE_MEASUREMENT_BOOTSTRAPPED__) {
    window.gtag?.("consent", "default", {
      ...consentState(false),
      wait_for_update: 500,
    });
    if (readConsentChoice() === "accepted") {
      window.gtag?.("consent", "update", consentState(true));
    }
    window.__EQUIPROFILE_MEASUREMENT_BOOTSTRAPPED__ = true;
  }
  captureAttribution();
  loadGtmIfConfigured();
  initializeOptionalLegacyAnalytics();
  window.addEventListener(CONSENT_EVENT, initializeOptionalLegacyAnalytics);
  initializeRouteMeasurement();
}

export function resetMeasurementForTests() {
  recentEvents.clear();
  lastPageKey = "";
}
