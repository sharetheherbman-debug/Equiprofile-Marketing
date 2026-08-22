// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
// School / Organisation router — manages school entities, members, invites
import {
  protectedProcedure,
  router,
} from "./_core/trpc";
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
 * School owner procedure — checks that the user is a school_owner or admin.
 */
const schoolOwnerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await db.getUserById(ctx.user.id);
  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }
  const prefs = parseUserPrefs(user.preferences);
  const isAdmin = user.role === "admin";
  const isSchoolOwner = prefs.planTier === "school_owner" || prefs.selectedExperience === "school_owner";
  if (!isAdmin && !isSchoolOwner) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This feature requires the School Owner plan.",
    });
  }
  return next({ ctx });
});

export const schoolRouter = router({
  /** Create a new organization. */
  createOrganization: schoolOwnerProcedure
    .input(z.object({
      name: z.string().min(2).max(200),
      description: z.string().max(1000).optional(),
      planTier: z.enum(["school_10", "school_20", "school_50", "school_enterprise"]).default("school_10"),
    }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Check user doesn't already own an organization
      const existing = await dbConn.select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already own an organization. You can manage it from your dashboard.",
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
        maxTeachers: input.planTier === "school_enterprise" ? 50 : Math.ceil(maxStudents / 5),
        trialEndsAt: new Date(Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000),
      });

      // Add owner as first member
      const orgId = result.insertId;
      await dbConn.insert(organizationMembers).values({
        organizationId: orgId,
        userId: ctx.user.id,
        role: "school_owner",
      });

      return { id: orgId, name: input.name };
    }),

  /** Get the current user's organization. */
  getMyOrganization: protectedProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    // Check if user is an owner
    const [owned] = await dbConn.select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);

    if (owned) return { ...owned, myRole: "school_owner" as const };

    // Check if user is a member
    const [membership] = await dbConn.select({
      org: organizations,
      role: organizationMembers.role,
    })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
      .where(eq(organizationMembers.userId, ctx.user.id))
      .limit(1);

    if (membership) return { ...membership.org, myRole: membership.role };

    return null;
  }),

  /** List members of the user's organization. */
  listMembers: schoolOwnerProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const [org] = await dbConn.select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org) throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });

    const members = await dbConn.select({
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
  inviteMember: schoolOwnerProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["teacher", "student"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [org] = await dbConn.select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org) throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });

      // Check seat limits
      const memberCount = await dbConn.select({ count: sql<number>`count(*)` })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.organizationId, org.id),
            eq(organizationMembers.role, input.role === "student" ? "student" : "teacher"),
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
      const [existingInvite] = await dbConn.select()
        .from(organizationInvites)
        .where(and(
          eq(organizationInvites.organizationId, org.id),
          eq(organizationInvites.invitedEmail, invitedEmail),
          eq(organizationInvites.role, input.role),
          sql`${organizationInvites.acceptedAt} IS NULL`,
          sql`${organizationInvites.expiresAt} > NOW()`,
        ))
        .orderBy(desc(organizationInvites.createdAt))
        .limit(1);

      const expiresAt = existingInvite?.expiresAt ?? new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      const token = existingInvite?.token ?? nanoid(32);
      const inviteId = existingInvite?.id ?? (
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
      await dbConn.update(organizationInvites).set({
        deliveryStatus: delivery.delivered ? "DELIVERED" : "FAILED",
        deliveryAttemptCount: (existingInvite?.deliveryAttemptCount ?? 0) + 1,
        lastDeliveryAttemptAt: new Date(),
        deliveredAt: delivery.delivered ? new Date() : (existingInvite?.deliveredAt ?? null),
        lastDeliveryError: delivery.delivered ? null : delivery.error,
      }).where(eq(organizationInvites.id, Number(inviteId)));

      return {
        inviteId: Number(inviteId),
        email: invitedEmail,
        role: input.role,
        deliveryStatus: delivery.delivered ? "DELIVERED" : "FAILED",
        deliveryReason: delivery.delivered ? null : delivery.reason,
        deliveryMessage: delivery.delivered
          ? "Invitation email sent."
          : "Invitation was saved, but email delivery failed. Review SMTP settings and retry when mail delivery is available.",
        reusedActiveInvite: Boolean(existingInvite),
      };
    }),

  /** List pending invites for the organization. */
  listInvites: schoolOwnerProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const [org] = await dbConn.select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org) throw new TRPCError({ code: "NOT_FOUND" });

    return dbConn.select()
      .from(organizationInvites)
      .where(eq(organizationInvites.organizationId, org.id))
      .orderBy(desc(organizationInvites.createdAt));
  }),

  /** Accept an organization invite (called by the invited user). */
  acceptInvite: protectedProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [invite] = await dbConn.select()
        .from(organizationInvites)
        .where(eq(organizationInvites.token, input.token))
        .limit(1);

      if (!invite) throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found or expired" });
      if (invite.acceptedAt) throw new TRPCError({ code: "CONFLICT", message: "Invite already accepted" });
      if (new Date(invite.expiresAt) < new Date()) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Invite has expired" });
      }

      // Add user as member
      await dbConn.insert(organizationMembers).values({
        organizationId: invite.organizationId,
        userId: ctx.user.id,
        role: invite.role,
      });

      // Mark invite as accepted
      await dbConn.update(organizationInvites)
        .set({ acceptedAt: new Date() })
        .where(eq(organizationInvites.id, invite.id));

      // Update user preferences with their role within the organization
      const user = await db.getUserById(ctx.user.id);
      if (user) {
        const prefs = parseUserPrefs(user.preferences);
        // Map org role to plan tier: teachers remain "teacher", students remain "student"
        prefs.selectedExperience = invite.role;
        prefs.organizationId = invite.organizationId;
        // Only set planTier if the user doesn't already have one (preserves existing subscription)
        if (!prefs.planTier) {
          prefs.planTier = invite.role;
        }
        await db.updateUser(ctx.user.id, { preferences: JSON.stringify(prefs) });
      }

      return { organizationId: invite.organizationId, role: invite.role };
    }),

  /** Remove a member from the organization. */
  removeMember: schoolOwnerProcedure
    .input(z.object({ memberId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [org] = await dbConn.select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });

      // Cannot remove yourself
      const [member] = await dbConn.select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.id, input.memberId),
            eq(organizationMembers.organizationId, org.id),
          ),
        )
        .limit(1);

      if (!member) throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      if (member.userId === ctx.user.id) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Cannot remove yourself" });
      }

      await dbConn.delete(organizationMembers)
        .where(eq(organizationMembers.id, input.memberId));

      return { success: true };
    }),

  /** Update a member's role in the organization. */
  updateMemberRole: schoolOwnerProcedure
    .input(z.object({
      memberId: z.number(),
      role: z.enum(["teacher", "student"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const [org] = await dbConn.select()
        .from(organizations)
        .where(eq(organizations.ownerId, ctx.user.id))
        .limit(1);
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });

      await dbConn.update(organizationMembers)
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
  getStats: schoolOwnerProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const [org] = await dbConn.select()
      .from(organizations)
      .where(eq(organizations.ownerId, ctx.user.id))
      .limit(1);
    if (!org) return null;

    const students = await dbConn.select({ count: sql<number>`count(*)` })
      .from(organizationMembers)
      .where(and(
        eq(organizationMembers.organizationId, org.id),
        eq(organizationMembers.role, "student"),
      ));

    const teachers = await dbConn.select({ count: sql<number>`count(*)` })
      .from(organizationMembers)
      .where(and(
        eq(organizationMembers.organizationId, org.id),
        eq(organizationMembers.role, "teacher"),
      ));

    const pendingInvites = await dbConn.select({ count: sql<number>`count(*)` })
      .from(organizationInvites)
      .where(and(
        eq(organizationInvites.organizationId, org.id),
        sql`${organizationInvites.acceptedAt} IS NULL`,
        sql`${organizationInvites.expiresAt} > NOW()`,
      ));

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
