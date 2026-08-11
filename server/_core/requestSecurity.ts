import type { Request } from "express";
import { COOKIE_NAME } from "@shared/const";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function trustedOrigins(): Set<string> {
  const values = new Set<string>();

  const configured = process.env.EQUIPROFILE_TRUSTED_ORIGINS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  for (const value of configured ?? []) {
    const origin = normalizeOrigin(value);
    if (origin) values.add(origin);
  }

  const baseUrl = process.env.BASE_URL || "https://equiprofile.online";
  const baseOrigin = normalizeOrigin(baseUrl);
  if (baseOrigin) {
    values.add(baseOrigin);
    try {
      const url = new URL(baseOrigin);
      if (url.hostname === "equiprofile.online") {
        url.hostname = "www.equiprofile.online";
        values.add(url.origin);
      }
    } catch {
      // baseOrigin has already been validated; this is only a defensive guard.
    }
  }

  if (process.env.NODE_ENV !== "production") {
    for (const local of [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3100",
      "http://127.0.0.1:3100",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]) {
      values.add(local);
    }
  }

  return values;
}

function hasSessionCookie(req: Request): boolean {
  const cookieHeader = req.headers.cookie || "";
  return cookieHeader
    .split(";")
    .some((pair) => pair.trim().startsWith(`${COOKIE_NAME}=`));
}

/**
 * Protect cookie-authenticated state changes from cross-site requests.
 *
 * Public unauthenticated endpoints (login, signup, password reset request) do
 * not rely on an existing session cookie and therefore are not CSRF targets.
 * Once a session cookie is present, unsafe methods must carry an Origin header
 * matching the EquiProfile application origin (or an explicitly configured
 * trusted origin).
 */
export function isTrustedCookieWrite(req: Request): boolean {
  if (process.env.NODE_ENV === "test") return true;
  if (SAFE_METHODS.has(req.method.toUpperCase())) return true;
  if (!hasSessionCookie(req)) return true;

  const originHeader = req.headers.origin;
  if (typeof originHeader !== "string" || !originHeader) return false;
  const origin = normalizeOrigin(originHeader);
  if (!origin) return false;

  return trustedOrigins().has(origin);
}

export function assertTrustedCookieWrite(req: Request): void {
  if (!isTrustedCookieWrite(req)) {
    const error = new Error(
      "Cross-site cookie-authenticated request rejected by EquiProfile origin policy",
    );
    error.name = "EquiProfileOriginError";
    throw error;
  }
}
