export type CoreProductContext = "management" | "academy";

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

export function getCoreProductContext(): CoreProductContext {
  const configured = String(import.meta.env.VITE_SITE || "").toLowerCase();
  if (configured === "academy" || configured === "school") return "academy";
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    if (
      host === "academy.equiprofile.online" ||
      host.startsWith("academy.") ||
      host === "school.equiprofile.online" ||
      host.startsWith("school.")
    ) {
      return "academy";
    }
  }
  return "management";
}

export function isAcademyContext() {
  return getCoreProductContext() === "academy";
}

export function getProductHomePath(product = getCoreProductContext()) {
  return product === "academy" ? "/academy" : "/";
}

export function getProductName(product = getCoreProductContext()) {
  return product === "academy" ? "EquiProfile Academy" : "EquiProfile Management";
}

export function resolveAcademyDashboard(user?: {
  role?: string | null;
  preferences?: unknown;
} | null) {
  if (user?.role === "admin") return "/academy-dashboard";
  const prefs = parsePreferences(user?.preferences);
  const experience = String(prefs.selectedExperience ?? prefs.academyPlan ?? prefs.planTier ?? "").toLowerCase();
  if (experience === "teacher") return "/teacher-dashboard";
  if (experience === "school_owner" || experience === "owner") return "/academy-dashboard";
  return "/student-dashboard";
}

const ACADEMY_REDIRECT_PREFIXES = [
  "/academy",
  "/student-dashboard",
  "/teacher-dashboard",
  "/academy-dashboard",
  "/school-dashboard",
  "/academy-invite",
  "/profile",
  "/settings",
] as const;

export function isSafeProductRedirect(path: string, product = getCoreProductContext()) {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (product !== "academy") return true;
  return ACADEMY_REDIRECT_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`),
  );
}
