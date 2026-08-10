// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
import express, { Router } from "express";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { SignJWT } from "jose";
import rateLimit from "express-rate-limit";
import * as db from "../db";
import * as email from "./email";
import { ENV } from "./env";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { isTrustedCookieWrite } from "./requestSecurity";

/** Hours before a verification token expires */
const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/** Extract plan-related flags from a JSON preferences string. */
function extractPlanInfo(preferences: string | null | undefined): {
  planTier: string | null;
  freeAccess: boolean;
  bothDashboardsUnlocked: boolean;
  needsOnboarding: boolean;
} {
  const emptyPlanInfo = {
    planTier: null,
    freeAccess: false,
    bothDashboardsUnlocked: false,
    needsOnboarding: true,
  } as const;
  if (!preferences) return emptyPlanInfo;
  try {
    const prefs = JSON.parse(preferences);
    const choseExperience = !!prefs?.activationChecklist?.choseExperience;
    return {
      planTier: prefs?.planTier ?? null,
      freeAccess: !!prefs?.freeAccess,
      bothDashboardsUnlocked: !!prefs?.bothDashboardsUnlocked,
      needsOnboarding: !choseExperience,
    };
  } catch {
    return emptyPlanInfo;
  }
}

async function createLocalSessionToken(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(ENV.cookieSecret));
}

function setSessionCookie(
  req: express.Request,
  res: express.Response,
  token: string,
) {
  res.cookie(COOKIE_NAME, token, {
    ...getSessionCookieOptions(req),
    maxAge: SESSION_MAX_AGE_MS,
  });
}

const router: Router = express.Router();

// Cookie-authenticated unsafe requests must originate from EquiProfile. Public
// unauthenticated auth endpoints remain usable because no session cookie exists.
router.use((req, res, next) => {
  if (!isTrustedCookieWrite(req)) {
    return res
      .status(403)
      .json({ error: "Cross-site authenticated request rejected" });
  }
  next();
});

// Rate limiter for signup attempts — prevents abuse and fake signups.
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many requests",
    message:
      "Too many signup attempts from this IP, please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Rate limiter for verification resend — prevents email abuse.
const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many requests",
    message: "Too many resend requests. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Only failed login attempts count toward the IP limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    error: "Too many requests",
    message:
      "Too many login attempts from this IP, please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many requests",
    message:
      "Too many password reset requests. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/** POST /api/auth/signup */
router.post("/signup", signupLimiter, async (req, res) => {
  try {
    const { email: rawEmail, password, name, planType } = req.body;

    if (!rawEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userEmail = rawEmail.trim().toLowerCase();

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const existingUser = await db.getUserByEmail(userEmail);

    if (existingUser) {
      if (
        existingUser.emailVerified === false &&
        existingUser.loginMethod === "email"
      ) {
        const verificationToken = nanoid(32);
        const verificationTokenExpiry = new Date();
        verificationTokenExpiry.setHours(
          verificationTokenExpiry.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS,
        );

        await db.updateUser(existingUser.id, {
          verificationToken,
          verificationTokenExpiry,
        } as any);

        email
          .sendVerificationEmail(
            userEmail,
            verificationToken,
            existingUser.name || undefined,
          )
          .catch((err) =>
            console.error("[Auth] Failed to send verification email:", err),
          );

        return res.json({
          success: true,
          requiresVerification: true,
          message:
            "A verification email has been sent. Please check your inbox.",
        });
      }
      return res.status(400).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const openId = `local_${nanoid(16)}`;
    const verificationToken = nanoid(32);
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(
      verificationTokenExpiry.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS,
    );

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await db.upsertUser({
      openId,
      email: userEmail,
      passwordHash,
      name: name || null,
      loginMethod: "email",
      emailVerified: false,
      subscriptionStatus: "trial",
      trialEndsAt: trialEnd,
      lastSignedIn: new Date(),
    });

    const user = await db.getUserByOpenId(openId);
    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    const userUpdates: Record<string, unknown> = {
      verificationToken,
      verificationTokenExpiry,
    };

    if (
      ENV.primaryAdminEmail &&
      userEmail === ENV.primaryAdminEmail &&
      user.role !== "admin"
    ) {
      userUpdates.role = "admin";
    }
    if (
      planType === "stable" ||
      planType === "normal" ||
      planType === "standard" ||
      planType === "student"
    ) {
      let prefs: Record<string, unknown> = {};
      if (user.preferences) {
        try {
          prefs = JSON.parse(user.preferences);
        } catch {
          prefs = {};
        }
      }
      if (planType === "stable") {
        prefs.planTier = "stable";
      } else if (planType === "student") {
        prefs.planTier = "student";
      } else {
        prefs.planTier = "pro";
      }
      userUpdates.preferences = JSON.stringify(prefs);
    }

    await db.updateUser(user.id, userUpdates as any);

    email
      .sendVerificationEmail(userEmail, verificationToken, name || undefined)
      .catch((err) =>
        console.error("[Auth] Failed to send verification email:", err),
      );

    res.json({
      success: true,
      requiresVerification: true,
      message: "Account created! Please check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[Auth] Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/login */
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;

    if (!rawEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userEmail = rawEmail.trim().toLowerCase();
    const user = await db.getUserByEmail(userEmail);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isActive || user.isSuspended) {
      return res.status(403).json({
        error: user.isSuspended ? "Account suspended" : "Account inactive",
        reason: user.suspendedReason,
      });
    }

    if (!user.emailVerified && user.loginMethod === "email") {
      if (!user.verificationToken) {
        try {
          await db.updateUser(user.id, { emailVerified: true });
        } catch (err) {
          console.error("[Auth] Failed to auto-verify legacy user:", err);
        }
      } else {
        return res.status(403).json({
          error: "Email not verified",
          requiresVerification: true,
          email: user.email,
          message:
            "Please verify your email address before signing in. Check your inbox for the verification link.",
        });
      }
    }

    await db.updateUser(user.id, { lastSignedIn: new Date() });

    if (
      ENV.primaryAdminEmail &&
      user.email?.toLowerCase() === ENV.primaryAdminEmail &&
      user.role !== "admin"
    ) {
      await db.updateUser(user.id, { role: "admin" });
    }

    const token = await createLocalSessionToken(user.id);
    setSessionCookie(req, res, token);

    const { planTier, freeAccess, bothDashboardsUnlocked, needsOnboarding } =
      extractPlanInfo(user.preferences);

    res.json({
      success: true,
      planTier,
      freeAccess,
      bothDashboardsUnlocked,
      needsOnboarding,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Auth] Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/request-reset */
router.post("/request-reset", passwordResetLimiter, async (req, res) => {
  try {
    const { email: rawEmail } = req.body;

    if (!rawEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    const userEmail = rawEmail.trim().toLowerCase();
    const user = await db.getUserByEmail(userEmail);

    if (!user) {
      console.log(
        "[Auth] Password reset requested for non-existent email:",
        userEmail,
      );
      return res.json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
    }

    const resetToken = nanoid(32);
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await db.updateUser(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    await email.sendPasswordResetEmail(
      userEmail,
      resetToken,
      user.name || undefined,
    );

    res.json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("[Auth] Request reset error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/reset-password */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const user = await db.getUserByResetToken(token);

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: "Reset token has expired" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const passwordChangedAt = new Date();

    await db.updateUser(user.id, {
      passwordHash,
      passwordChangedAt,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.clearCookie(COOKIE_NAME, getSessionCookieOptions(req));
    res.json({
      success: true,
      message:
        "Password reset successful. All previous sessions have been invalidated; please login with your new password.",
    });
  } catch (error) {
    console.error("[Auth] Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/verify-email */
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    const user = await db.getUserByVerificationToken(token);

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    if (
      !user.verificationTokenExpiry ||
      user.verificationTokenExpiry < new Date()
    ) {
      return res.status(400).json({
        error: "Verification token has expired. Please request a new one.",
      });
    }

    await db.updateUser(user.id, {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    } as any);

    const jwtToken = await createLocalSessionToken(user.id);
    setSessionCookie(req, res, jwtToken);

    email
      .sendWelcomeEmail(user)
      .catch((err) =>
        console.error("[Auth] Failed to send welcome email:", err),
      );

    const { planTier, freeAccess, bothDashboardsUnlocked, needsOnboarding } =
      extractPlanInfo(user.preferences);

    res.json({
      success: true,
      message: "Email verified successfully! Welcome to EquiProfile.",
      planTier,
      freeAccess,
      bothDashboardsUnlocked,
      needsOnboarding,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Auth] Verify email error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/resend-verification */
router.post("/resend-verification", resendLimiter, async (req, res) => {
  try {
    const { email: rawEmail } = req.body;

    if (!rawEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    const userEmail = rawEmail.trim().toLowerCase();
    const user = await db.getUserByEmail(userEmail);

    if (!user || user.emailVerified) {
      return res.json({
        success: true,
        message:
          "If that email needs verification, a new link has been sent.",
      });
    }

    const verificationToken = nanoid(32);
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(
      verificationTokenExpiry.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS,
    );

    await db.updateUser(user.id, {
      verificationToken,
      verificationTokenExpiry,
    } as any);

    await email.sendVerificationEmail(
      userEmail,
      verificationToken,
      user.name || undefined,
    );

    res.json({
      success: true,
      message: "If that email needs verification, a new link has been sent.",
    });
  } catch (error) {
    console.error("[Auth] Resend verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** POST /api/auth/logout */
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, getSessionCookieOptions(req));
  res.json({ success: true });
});

/** POST /api/auth/change-password */
router.post("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "currentPassword and newPassword are required" });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });
    }

    const cookieHeader = req.headers.cookie || "";
    const cookiePairs = cookieHeader.split(";").map((c) => c.trim());
    let sessionCookieValue: string | undefined;
    for (const pair of cookiePairs) {
      const [key, ...vals] = pair.split("=");
      if (key.trim() === COOKIE_NAME) {
        sessionCookieValue = vals.join("=");
        break;
      }
    }

    if (!sessionCookieValue) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let user;
    try {
      const { sdk } = await import("./sdk");
      user = await sdk.authenticateRequest(req as any);
    } catch {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        error:
          "No password set. Use forgot-password to create a password for your account.",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const passwordChangedAt = new Date();
    await db.updateUser(user.id, {
      passwordHash: newPasswordHash,
      passwordChangedAt,
    });

    res.clearCookie(COOKIE_NAME, getSessionCookieOptions(req));
    res.json({
      success: true,
      message:
        "Password changed successfully. All previous sessions have been invalidated; please login again.",
    });
  } catch (error) {
    console.error("[Auth] Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
