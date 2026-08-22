// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
// Academy organization router — manages Academy entities, members, and invites.
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  organizations,
  organizationMembers,
  organizationInvites,
  users,
} from "../drizzle/schema";
import { nanoid } from "nanoid";
import { FREE_TRIAL_DAYS, INVITE_EXPIRY_DAYS } from "@shared/pricing";
import { sendAcademyInviteEmail } from "./_core/email";
import { resolveMarketingConsent } from "./_core/marketingConsent";
import { publishMarketingEvent } from "./_core/marketingPublisher";
import {
  academyBillingConfig,
  getAcademyStripe,
  type AcademyBillingInterval,
  type AcademyPlanTier,
} from "./academy/billing";

/** Safely parse user preferences JSON. */
function parseUserPrefs(raw: string | null | undefined): Record<string, any> {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Academy owner procedure — checks an Academy owner or admin.
 * Stored `school_owner` values remain LEGACY_DATABASE_COMPAT_ONLY.
 */
const academyOwnerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await db.getUserById(ctx.user.id);
  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }
  const prefs = parseUserPrefs(user.preferences);
  const isAdmin = user.role === "admin";
  // LEGACY_DATABASE_COMPAT_ONLY: historical persisted values are mapped to the
  // canonical Academy owner concept without a destructive data migration.
  const isAcademyOwner =
    prefs.planTier === "school_owner" ||
    prefs.selectedExperience === "school_owner";
  if (!isAdmin && !isAcademyOwner) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This feature requires the Academy Owner plan.",
    });
  }
  return next({ ctx });
});

export const academyRouter = router({
  /** Create a new organization. */
  createOrganization: academyOwnerProcedure
    .input(
      z.object({
        name: z.string().min(2).max(200),
        description: z.string().max(1000).optional(),
        // LEGACY_DATABASE_COMPAT_ONLY: existing plan keys are persisted values.
        planTier: z
          .enum(["school_10", "school_20", "school_50", "school_enterprise"])
          .default("school_10"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Check user doesn't already own an organization
      const existing = await dbConn
        .select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You already own an organization. You can manage it from your dashboard.",
        });
      }

      const maxStudents = {
        school_10: 10,
        school_20: 20,
        school_50: 50,
        school_enterprise: 999,
      }[input.planTier];

      const [result] = await dbConn.insert(organizations).values({
        ownerId: ctx.user.id,
        name: input.name,
        description: input.description ?? null,
        planTier: input.planTier,
        maxStudents,
        maxTeachers:
          input.planTier === "school_enterprise"
            ? 50
            : Math.ceil(maxStudents / 5),
        trialEndsAt: new Date(
          Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000,
        ),
      });

      // Add owner as first member
      const orgId = result.insertId;
      await dbConn.insert(organizationMembers).values({
        organizationId: orgId,
        userId: ctx.user.id,
        // LEGACY_DATABASE_COMPAT_ONLY: existing organization role value.
        role: "school_owner",
      });

      return { id: orgId, name: input.name };
    }),

  /** Get the current user's organization. */
  getMyOrganization: protectedProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    // Check if user is an owner
    const [owned] = await dbConn
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);

    if (owned) return { ...owned, myRole: "school_owner" as const };

    // Check if user is a member
    const [membership] = await dbConn
      .select({
        org: organizations,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .innerJoin(
        organizations,
        eq(organizationMembers.organizationId, organizations.id),
      )
      .where(eq(organizationMembers.userId, ctx.user.id))
      .limit(1);

    if (membership) return { ...membership.org, myRole: membership.role };

    return null;
  }),

  /** Academy billing remains a Stripe TEST-mode-only, owner-authorized product flow. */
  billingStatus: academyOwnerProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
    const [org] = await dbConn
      .select({
        id: organizations.id,
        planTier: organizations.planTier,
        academyBillingStatus: organizations.academyBillingStatus,
        academyBillingInterval: organizations.academyBillingInterval,
        academyBillingPriceId: organizations.academyBillingPriceId,
        academyBillingCurrentPeriodEndsAt:
          organizations.academyBillingCurrentPeriodEndsAt,
      })
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found.",
      });
    return {
      ...org,
      testModeOnly: true,
      billingConfigured: academyBillingConfig(
        process.env,
        org.planTier as AcademyPlanTier,
        (org.academyBillingInterval ?? "monthly") as AcademyBillingInterval,
      ).configured,
    };
  }),

  createBillingCheckout: academyOwnerProcedure
    .input(
      z.object({
        planTier: z.enum([
          "school_10",
          "school_20",
          "school_50",
          "school_enterprise",
        ]),
        interval: z.enum(["monthly", "yearly"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const configuration = academyBillingConfig(
        process.env,
        input.planTier,
        input.interval,
      );
      const stripe = getAcademyStripe();
      if (!configuration.configured || !stripe) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: configuration.configured
            ? "Academy Stripe TEST checkout is unavailable."
            : configuration.reason,
        });
      }
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const [org] = await dbConn
        .select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found.",
        });
      if (
        org.academyBillingStatus === "active" &&
        org.academyStripeSubscriptionId
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "An Academy subscription is already active. Use the billing portal to manage it.",
        });
      }
      const [owner] = await dbConn
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);
      const publicBaseUrl = (
        process.env.ACADEMY_PUBLIC_URL ?? "https://academy.equiprofile.online"
      ).replace(/\/$/, "");
      let parsedPublicUrl: URL;
      try {
        parsedPublicUrl = new URL(publicBaseUrl);
      } catch {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "ACADEMY_PUBLIC_URL must be a valid absolute URL.",
        });
      }
      const localHttp =
        process.env.NODE_ENV !== "production" &&
        parsedPublicUrl.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(parsedPublicUrl.hostname);
      if (parsedPublicUrl.protocol !== "https:" && !localHttp) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "ACADEMY_PUBLIC_URL must use HTTPS outside local development.",
        });
      }
      const metadata = {
        academyScope: "academy",
        organizationId: String(org.id),
        planTier: input.planTier,
        interval: input.interval,
      };
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        client_reference_id: String(org.id),
        customer: org.academyStripeCustomerId ?? undefined,
        customer_email: org.academyStripeCustomerId
          ? undefined
          : (owner?.email ?? undefined),
        metadata,
        subscription_data: { metadata },
        line_items: [{ price: configuration.priceId, quantity: 1 }],
        success_url: `${publicBaseUrl}/academy-dashboard?academy_billing=success`,
        cancel_url: `${publicBaseUrl}/academy/pricing?academy_billing=cancelled`,
      });
      if (!session.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe TEST checkout did not return a redirect URL.",
        });
      }
      await dbConn
        .update(organizations)
        .set({
          planTier: input.planTier,
          academyBillingStatus: "checkout_pending",
          academyBillingInterval: input.interval,
          academyBillingPriceId: configuration.priceId,
          academyStripeCheckoutSessionId: session.id,
        })
        .where(
          and(
            eq(organizations.id, org.id),
            eq(organizations.ownerId, ctx.user.id),
          ),
        );
      return { checkoutUrl: session.url, testModeOnly: true };
    }),

  createBillingPortal: academyOwnerProcedure.mutation(async ({ ctx }) => {
    const stripe = getAcademyStripe();
    if (!stripe) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Academy Stripe TEST billing portal is unavailable.",
      });
    }
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
    const [org] = await dbConn
      .select({
        academyStripeCustomerId: organizations.academyStripeCustomerId,
      })
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org?.academyStripeCustomerId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message:
          "Complete Academy TEST checkout before opening the billing portal.",
      });
    }
    const publicBaseUrl = (
      process.env.ACADEMY_PUBLIC_URL ?? "https://academy.equiprofile.online"
    ).replace(/\/$/, "");
    const configurationId =
      process.env.ACADEMY_STRIPE_BILLING_PORTAL_CONFIGURATION_ID?.trim();
    const portal = await stripe.billingPortal.sessions.create({
      customer: org.academyStripeCustomerId,
      return_url: `${publicBaseUrl}/academy-dashboard`,
      ...(configurationId ? { configuration: configurationId } : {}),
    });
    return { portalUrl: portal.url, testModeOnly: true };
  }),

  /** List members of the user's organization. */
  listMembers: academyOwnerProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const [org] = await dbConn
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found",
      });

    const members = await dbConn
      .select({
        id: organizationMembers.id,
        userId: organizationMembers.userId,
        role: organizationMembers.role,
        joinedAt: organizationMembers.joinedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(organizationMembers)
      .leftJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, org.id));

    return members;
  }),

  /** Invite a student or teacher to the organization. */
  inviteMember: academyOwnerProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["teacher", "student"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [org] = await dbConn
        .select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });

      // Check seat limits
      const memberCount = await dbConn
        .select({ count: sql<number>`count(*)` })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, org.id),
            eq(
              organizationMembers.role,
              input.role === "student" ? "student" : "teacher",
            ),
          ),
        );
      const count = memberCount[0]?.count ?? 0;

      if (input.role === "student" && count >= org.maxStudents) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Your plan allows up to ${org.maxStudents} students. Upgrade to add more.`,
        });
      }
      if (input.role === "teacher" && count >= org.maxTeachers) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Your plan allows up to ${org.maxTeachers} teachers. Upgrade to add more.`,
        });
      }

      const invitedEmail = input.email.trim().toLowerCase();
      const [existingInvite] = await dbConn
        .select()
        .from(organizationInvites)
        .where(
          and(
            eq(organizationInvites.organizationId, org.id),
            eq(organizationInvites.invitedEmail, invitedEmail),
            eq(organizationInvites.role, input.role),
            sql`${organizationInvites.acceptedAt} IS NULL`,
            sql`${organizationInvites.expiresAt} > NOW()`,
          ),
        )
        .orderBy(desc(organizationInvites.createdAt))
        .limit(1);

      const expiresAt =
        existingInvite?.expiresAt ??
        new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      const token = existingInvite?.token ?? nanoid(32);
      const inviteId =
        existingInvite?.id ??
        (
          await dbConn.insert(organizationInvites).values({
            organizationId: org.id,
            invitedEmail,
            role: input.role,
            token,
            expiresAt,
          })
        )[0].insertId;

      const delivery = await sendAcademyInviteEmail({
        recipientEmail: invitedEmail,
        inviterName: ctx.user.name ?? "An Academy owner",
        organizationName: org.name,
        role: input.role,
        token,
        expiresAt,
      });
      const nextAttemptCount = (existingInvite?.deliveryAttemptCount ?? 0) + 1;
      await dbConn
        .update(organizationInvites)
        .set({
          deliveryStatus: delivery.delivered ? "DELIVERED" : "FAILED",
          deliveryAttemptCount: nextAttemptCount,
          lastDeliveryAttemptAt: new Date(),
          deliveredAt: delivery.delivered
            ? new Date()
            : (existingInvite?.deliveredAt ?? null),
          lastDeliveryError: delivery.delivered ? null : delivery.error,
        })
        .where(eq(organizationInvites.id, Number(inviteId)));

      return {
        inviteId: Number(inviteId),
        email: invitedEmail,
        role: input.role,
        deliveryStatus: delivery.delivered ? "DELIVERED" : "FAILED",
        deliveryReason: delivery.delivered ? null : delivery.reason,
        deliveryMessage: delivery.delivered
          ? "Invitation email sent."
          : "Invitation was saved, but email delivery failed. Review SMTP settings and resend from the pending-invites list.",
        reusedActiveInvite: Boolean(existingInvite),
      };
    }),

  /** List pending invites for the organization. */
  listInvites: academyOwnerProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const [org] = await dbConn
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org) throw new TRPCError({ code: "NOT_FOUND" });

    return dbConn
      .select({
        id: organizationInvites.id,
        invitedEmail: organizationInvites.invitedEmail,
        role: organizationInvites.role,
        expiresAt: organizationInvites.expiresAt,
        acceptedAt: organizationInvites.acceptedAt,
        deliveryStatus: organizationInvites.deliveryStatus,
        deliveryAttemptCount: organizationInvites.deliveryAttemptCount,
        lastDeliveryAttemptAt: organizationInvites.lastDeliveryAttemptAt,
        deliveredAt: organizationInvites.deliveredAt,
        lastDeliveryError: organizationInvites.lastDeliveryError,
        createdAt: organizationInvites.createdAt,
      })
      .from(organizationInvites)
      .where(eq(organizationInvites.organizationId, org.id))
      .orderBy(desc(organizationInvites.createdAt));
  }),

  /** Resend an unaccepted, unexpired invitation and persist the delivery result. */
  resendInvite: academyOwnerProcedure
    .input(z.object({ inviteId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const [org] = await dbConn
        .select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      const [invite] = await dbConn
        .select()
        .from(organizationInvites)
        .where(
          and(
            eq(organizationInvites.id, input.inviteId),
            eq(organizationInvites.organizationId, org.id),
          ),
        )
        .limit(1);
      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found.",
        });
      }
      if (invite.acceptedAt) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Accepted invitations cannot be resent.",
        });
      }
      if (new Date(invite.expiresAt) <= new Date()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "This invitation has expired. Create a new invitation instead.",
        });
      }
      const delivery = await sendAcademyInviteEmail({
        recipientEmail: invite.invitedEmail,
        inviterName: ctx.user.name ?? "An Academy owner",
        organizationName: org.name,
        role: invite.role as "teacher" | "student",
        token: invite.token,
        expiresAt: invite.expiresAt,
      });
      await dbConn
        .update(organizationInvites)
        .set({
          deliveryStatus: delivery.delivered ? "DELIVERED" : "FAILED",
          deliveryAttemptCount: invite.deliveryAttemptCount + 1,
          lastDeliveryAttemptAt: new Date(),
          deliveredAt: delivery.delivered ? new Date() : invite.deliveredAt,
          lastDeliveryError: delivery.delivered ? null : delivery.error,
        })
        .where(eq(organizationInvites.id, invite.id));
      return {
        inviteId: invite.id,
        deliveryStatus: delivery.delivered ? "DELIVERED" : "FAILED",
        deliveryReason: delivery.delivered ? null : delivery.reason,
        deliveryMessage: delivery.delivered
          ? "Invitation email sent."
          : "Email delivery failed. Check SMTP settings and retry when the mail service is available.",
      };
    }),

  /** Accept an organization invite (called by the invited user). */
  acceptInvite: protectedProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [invite] = await dbConn
        .select()
        .from(organizationInvites)
        .where(eq(organizationInvites.token, input.token))
        .limit(1);

      if (!invite)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found or expired",
        });
      if (invite.acceptedAt)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invite already accepted",
        });
      if (new Date(invite.expiresAt) < new Date()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Invite has expired",
        });
      }

      // The invite token is not sufficient authorization on its own. The current
      // verified account must match the invited address before any Academy role is granted.
      const user = await db.getUserById(ctx.user.id);
      if (
        !user?.email ||
        user.email.trim().toLowerCase() !==
          invite.invitedEmail.trim().toLowerCase()
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Sign in with the email address that received this Academy invitation.",
        });
      }

      const [existingMember] = await dbConn
        .select({ id: organizationMembers.id })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, invite.organizationId),
            eq(organizationMembers.userId, ctx.user.id),
          ),
        )
        .limit(1);
      if (!existingMember) {
        await dbConn.insert(organizationMembers).values({
          organizationId: invite.organizationId,
          userId: ctx.user.id,
          role: invite.role,
        });
      }

      // Mark invite as accepted only after membership succeeds.
      await dbConn
        .update(organizationInvites)
        .set({ acceptedAt: new Date() })
        .where(eq(organizationInvites.id, invite.id));

      // Complete Academy activation without replacing an existing paid plan.
      const prefs = parseUserPrefs(user.preferences);
      prefs.selectedExperience = invite.role;
      prefs.organizationId = invite.organizationId;
      prefs.activationChecklist = {
        ...(prefs.activationChecklist ?? {}),
        choseExperience: true,
      };
      prefs.onboardingCompleted = true;
      if (!prefs.planTier) prefs.planTier = invite.role;
      await db.updateUser(ctx.user.id, { preferences: JSON.stringify(prefs) });

      // Academy access is already durable. A separate Marketing event is
      // eligible only after an explicit opt-in and can never block acceptance.
      if (resolveMarketingConsent(prefs) === "marketing_opt_in") {
        void publishMarketingEvent({
          sourceApp: "equiprofile.online",
          productLine: "academy",
          eventType: "academy_registration_completed",
          entityType: "account_registration",
          entityId: `academy-invite:${invite.id}`,
          publicUrl: "https://academy.equiprofile.online/dashboard",
          timestamp: new Date().toISOString(),
          consentState: "marketing_opt_in",
          idempotencyKey: `academy-registration:${invite.id}`,
          payloadVersion: "1.0",
          payload: {
            registrationSurface: "invitation_acceptance",
            planInterest: invite.role,
          },
        }).catch(() => undefined);
      }

      return { organizationId: invite.organizationId, role: invite.role };
    }),

  /** Remove a member from the organization. */
  removeMember: academyOwnerProcedure
    .input(z.object({ memberId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [org] = await dbConn
        .select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });

      // Cannot remove yourself
      const [member] = await dbConn
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.id, input.memberId),
            eq(organizationMembers.organizationId, org.id),
          ),
        )
        .limit(1);

      if (!member)
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      if (member.userId === ctx.user.id) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Cannot remove yourself",
        });
      }

      await dbConn
        .delete(organizationMembers)
        .where(eq(organizationMembers.id, input.memberId));

      return { success: true };
    }),

  /** Update a member's role in the organization. */
  updateMemberRole: academyOwnerProcedure
    .input(
      z.object({
        memberId: z.number(),
        role: z.enum(["teacher", "student"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [org] = await dbConn
        .select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });

      await dbConn
        .update(organizationMembers)
        .set({ role: input.role })
        .where(
          and(
            eq(organizationMembers.id, input.memberId),
            eq(organizationMembers.organizationId, org.id),
          ),
        );

      return { success: true };
    }),

  /** Get organization stats for dashboard. */
  getStats: academyOwnerProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const [org] = await dbConn
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org) return null;

    const students = await dbConn
      .select({ count: sql<number>`count(*)` })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org.id),
          eq(organizationMembers.role, "student"),
        ),
      );

    const teachers = await dbConn
      .select({ count: sql<number>`count(*)` })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, org.id),
          eq(organizationMembers.role, "teacher"),
        ),
      );

    const pendingInvites = await dbConn
      .select({ count: sql<number>`count(*)` })
      .from(organizationInvites)
      .where(
        and(
          eq(organizationInvites.organizationId, org.id),
          sql`${organizationInvites.acceptedAt} IS NULL`,
          sql`${organizationInvites.expiresAt} > NOW()`,
        ),
      );

    return {
      organization: org,
      studentCount: students[0]?.count ?? 0,
      teacherCount: teachers[0]?.count ?? 0,
      pendingInviteCount: pendingInvites[0]?.count ?? 0,
      maxStudents: org.maxStudents,
      maxTeachers: org.maxTeachers,
    };
  }),
});
