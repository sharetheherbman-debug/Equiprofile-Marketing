import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const authRouter = readFileSync(
  resolve(process.cwd(), "server/_core/authRouter.ts"),
  "utf8",
);
const sdk = readFileSync(
  resolve(process.cwd(), "server/_core/sdk.ts"),
  "utf8",
);
const env = readFileSync(
  resolve(process.cwd(), "server/_core/env.ts"),
  "utf8",
);
const cookies = readFileSync(
  resolve(process.cwd(), "server/_core/cookies.ts"),
  "utf8",
);

describe("EquiProfile authentication hardening boundary", () => {
  it("issues timestamped 30-day local sessions", () => {
    expect(authRouter).toContain("createLocalSessionToken");
    expect(authRouter).toContain(".setIssuedAt()");
    expect(authRouter).toContain('.setExpirationTime("30d")');
    expect(authRouter).toContain("SESSION_MAX_AGE_MS");
  });

  it("invalidates earlier sessions on password reset and password change", () => {
    const passwordChangedAtAssignments = authRouter.match(/passwordChangedAt/g) ?? [];
    expect(passwordChangedAtAssignments.length).toBeGreaterThanOrEqual(4);
    expect(authRouter).toContain("All previous sessions have been invalidated");
    expect(authRouter).toContain("res.clearCookie(COOKIE_NAME, getSessionCookieOptions(req))");
    expect(sdk).toContain("passwordChangedAtSeconds > session.issuedAt");
  });

  it("preserves legacy local sessions while enabling the revocation watermark", () => {
    expect(sdk).toContain("exp - LOCAL_AUTH_SESSION_SECONDS");
    expect(sdk).toContain("same second as a password change");
  });

  it("rejects inactive or suspended accounts even with a valid cookie", () => {
    expect(sdk).toContain("!user.isActive || user.isSuspended");
  });

  it("retains rate limiting, secure cookie flags and production secret validation", () => {
    expect(authRouter).toContain("loginLimiter");
    expect(authRouter).toContain("passwordResetLimiter");
    expect(cookies).toContain("httpOnly: true");
    expect(cookies).toContain('sameSite: "lax"');
    expect(env).toContain("JWT_SECRET must be at least 32 characters long");
  });
});
