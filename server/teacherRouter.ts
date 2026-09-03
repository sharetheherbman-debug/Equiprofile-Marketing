// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
// Teacher / Instructor system router — Phase 3 backend
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { eq, and, desc, gte, lte, inArray, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  studentGroups,
  studentGroupMembers,
  teacherAssignedTasks,
  teacherFeedback,
  learningPathwayProgress,
  studentTasks,
  studentTrainingEntries,
  studentProgress,
  aiTutorSessions,
  users,
  studentCompetencies,
  teacherLessonAssignments,
  lessonReviews,
  lessonCompletion,
  lessonUnits,
  teacherStudentMessages,
  teacherResources,
  studentAssignments,
  reportTemplates,
  studentReports,
} from "../drizzle/schema";
import { ensureAcademyCurriculum } from "./academy/curriculumPipeline";
import { requireAcademyAudience } from "./academy/entitlement";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseUserPrefs(raw: string | null | undefined): Record<string, any> {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

type TeacherDb = NonNullable<Awaited<ReturnType<typeof getDb>>>;

/** Require an active group owned by the current teacher. */
async function requireTeacherOwnedActiveGroup(
  dbConn: TeacherDb,
  teacherId: number,
  groupId: number,
) {
  const [group] = await dbConn
    .select({ id: studentGroups.id })
    .from(studentGroups)
    .where(
      and(
        eq(studentGroups.id, groupId),
        eq(studentGroups.teacherId, teacherId),
        eq(studentGroups.isActive, true),
      ),
    )
    .limit(1);
  if (!group) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
  }
}

/** Require that a student belongs to at least one active group owned by the current teacher. */
async function requireTeacherStudentMembership(
  dbConn: TeacherDb,
  teacherId: number,
  studentUserId: number,
) {
  const [membership] = await dbConn
    .select({ id: studentGroupMembers.id })
    .from(studentGroupMembers)
    .innerJoin(studentGroups, eq(studentGroupMembers.groupId, studentGroups.id))
    .where(
      and(
        eq(studentGroups.teacherId, teacherId),
        eq(studentGroups.isActive, true),
        eq(studentGroupMembers.studentUserId, studentUserId),
      ),
    )
    .limit(1);
  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Student is not in your active groups.",
    });
  }
}

/**
 * Teacher procedure — extends protectedProcedure to check that the user has
 * the teacher plan/experience OR is an admin.
 */
const teacherProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const academyEntitlement = await requireAcademyAudience(ctx.user.id, ["teacher", "admin"]);
  return next({ ctx: { ...ctx, academyEntitlement } });
});

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────

export const teacherRouter = router({
  // ── Identity ──────────────────────────────────────────────────────────────

  /** Verify that the current user is a teacher/admin. */
  verifyTeacher: teacherProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    return {
      isTeacher: true,
      teacherId: ctx.user.id,
      name: user?.name ?? "",
      email: user?.email ?? "",
    };
  }),

  // ── Groups ────────────────────────────────────────────────────────────────

  listGroups: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const groups = await dbConn
      .select()
      .from(studentGroups)
      .where(
        and(
          eq(studentGroups.teacherId, ctx.user.id),
          eq(studentGroups.isActive, true),
        ),
      )
      .orderBy(desc(studentGroups.createdAt));

    // For each group, fetch member count
    const groupsWithCount = await Promise.all(
      groups.map(async (g) => {
        const members = await dbConn
          .select({ id: studentGroupMembers.id })
          .from(studentGroupMembers)
          .where(eq(studentGroupMembers.groupId, g.id));
        return { ...g, memberCount: members.length };
      }),
    );

    return groupsWithCount;
  }),

  createGroup: teacherProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        level: z
          .enum(["beginner", "developing", "intermediate", "advanced"])
          .default("beginner"),
        academicYear: z.string().max(20).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const [result] = await dbConn.insert(studentGroups).values({
        teacherId: ctx.user.id,
        name: input.name,
        description: input.description ?? null,
        level: input.level,
        academicYear: input.academicYear ?? null,
      });
      return { id: result.insertId, success: true };
    }),

  updateGroup: teacherProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().optional(),
        level: z
          .enum(["beginner", "developing", "intermediate", "advanced"])
          .optional(),
        academicYear: z.string().max(20).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const { id, ...rest } = input;
      await dbConn
        .update(studentGroups)
        .set(rest)
        .where(
          and(
            eq(studentGroups.id, id),
            eq(studentGroups.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  deleteGroup: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      // Soft delete
      await dbConn
        .update(studentGroups)
        .set({ isActive: false })
        .where(
          and(
            eq(studentGroups.id, input.id),
            eq(studentGroups.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // ── Group Members ─────────────────────────────────────────────────────────

  listGroupMembers: teacherProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify teacher owns this group
      const [group] = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.id, input.groupId),
            eq(studentGroups.teacherId, ctx.user.id),
          ),
        )
        .limit(1);
      if (!group) throw new TRPCError({ code: "NOT_FOUND" });

      const members = await dbConn
        .select({
          memberId: studentGroupMembers.id,
          studentUserId: studentGroupMembers.studentUserId,
          joinedAt: studentGroupMembers.joinedAt,
        })
        .from(studentGroupMembers)
        .where(eq(studentGroupMembers.groupId, input.groupId));

      if (!members.length) return [];

      // Fetch user names/emails
      const studentIds = members.map((m) => m.studentUserId);
      const studentUsers = await dbConn
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(inArray(users.id, studentIds));

      const userMap = new Map(studentUsers.map((u) => [u.id, u]));

      return members.map((m) => ({
        memberId: m.memberId,
        studentUserId: m.studentUserId,
        joinedAt: m.joinedAt,
        name: userMap.get(m.studentUserId)?.name ?? "Unknown",
        email: userMap.get(m.studentUserId)?.email ?? "",
      }));
    }),

  addGroupMember: teacherProcedure
    .input(
      z.object({
        groupId: z.number(),
        studentEmail: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify teacher owns this group
      const [group] = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.id, input.groupId),
            eq(studentGroups.teacherId, ctx.user.id),
          ),
        )
        .limit(1);
      if (!group)
        throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });

      // Find the student by email
      const [student] = await dbConn
        .select({
          id: users.id,
          name: users.name,
          preferences: users.preferences,
        })
        .from(users)
        .where(eq(users.email, input.studentEmail.toLowerCase()))
        .limit(1);

      if (!student)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found with that email address.",
        });

      // Check student plan
      const prefs = parseUserPrefs(student.preferences);
      if (
        prefs.planTier !== "student" &&
        prefs.selectedExperience !== "student"
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That user does not have a student account.",
        });
      }

      // Prevent duplicate
      const [existing] = await dbConn
        .select({ id: studentGroupMembers.id })
        .from(studentGroupMembers)
        .where(
          and(
            eq(studentGroupMembers.groupId, input.groupId),
            eq(studentGroupMembers.studentUserId, student.id),
          ),
        )
        .limit(1);
      if (existing)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Student is already in this group.",
        });

      await dbConn.insert(studentGroupMembers).values({
        groupId: input.groupId,
        studentUserId: student.id,
      });

      return { success: true, studentName: student.name };
    }),

  removeGroupMember: teacherProcedure
    .input(z.object({ memberId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify teacher owns the group this member belongs to
      const [member] = await dbConn
        .select({ groupId: studentGroupMembers.groupId })
        .from(studentGroupMembers)
        .where(eq(studentGroupMembers.id, input.memberId))
        .limit(1);
      if (!member) throw new TRPCError({ code: "NOT_FOUND" });

      const [group] = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.id, member.groupId),
            eq(studentGroups.teacherId, ctx.user.id),
          ),
        )
        .limit(1);
      if (!group) throw new TRPCError({ code: "FORBIDDEN" });

      await dbConn
        .delete(studentGroupMembers)
        .where(eq(studentGroupMembers.id, input.memberId));
      return { success: true };
    }),

  // ── Students ──────────────────────────────────────────────────────────────

  /** List all students in any of the teacher's groups (deduplicated). */
  listMyStudents: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const groups = await dbConn
      .select({
        id: studentGroups.id,
        name: studentGroups.name,
        level: studentGroups.level,
      })
      .from(studentGroups)
      .where(
        and(
          eq(studentGroups.teacherId, ctx.user.id),
          eq(studentGroups.isActive, true),
        ),
      );

    if (!groups.length) return [];

    const groupIds = groups.map((g) => g.id);
    const members = await dbConn
      .select({
        studentUserId: studentGroupMembers.studentUserId,
        groupId: studentGroupMembers.groupId,
      })
      .from(studentGroupMembers)
      .where(inArray(studentGroupMembers.groupId, groupIds));

    if (!members.length) return [];

    const uniqueStudentIds = Array.from(
      new Set(members.map((m) => m.studentUserId)),
    );
    const studentUsers = await dbConn
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        preferences: users.preferences,
      })
      .from(users)
      .where(inArray(users.id, uniqueStudentIds));

    const groupMap = new Map(groups.map((g) => [g.id, g]));

    return studentUsers.map((u) => {
      const studentGroups_ = members
        .filter((m) => m.studentUserId === u.id)
        .map((m) => groupMap.get(m.groupId))
        .filter(Boolean) as typeof groups;
      const prefs = parseUserPrefs(u.preferences);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        learnerLevel: (prefs.studentLevel as string) ?? "beginner",
        groups: studentGroups_.map((g) => ({
          id: g.id,
          name: g.name,
          level: g.level,
        })),
      };
    });
  }),

  /** Get a summary of one student's activity for the teacher view. */
  getStudentSummary: teacherProcedure
    .input(z.object({ studentUserId: z.number() }))
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify this student is in one of the teacher's groups
      const groups = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.teacherId, ctx.user.id),
            eq(studentGroups.isActive, true),
          ),
        );

      if (!groups.length) throw new TRPCError({ code: "FORBIDDEN" });

      const groupIds = groups.map((g) => g.id);
      const [membership] = await dbConn
        .select({ id: studentGroupMembers.id })
        .from(studentGroupMembers)
        .where(
          and(
            inArray(studentGroupMembers.groupId, groupIds),
            eq(studentGroupMembers.studentUserId, input.studentUserId),
          ),
        )
        .limit(1);
      if (!membership)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student is not in your groups.",
        });

      // Fetch data in parallel
      const [studentUser, tasks, training, progress, feedback] =
        await Promise.all([
          dbConn
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              preferences: users.preferences,
            })
            .from(users)
            .where(eq(users.id, input.studentUserId))
            .limit(1),
          dbConn
            .select({
              id: studentTasks.id,
              isCompleted: studentTasks.isCompleted,
              category: studentTasks.category,
            })
            .from(studentTasks)
            .where(eq(studentTasks.userId, input.studentUserId))
            .limit(50),
          dbConn
            .select({
              id: studentTrainingEntries.id,
              sessionDate: studentTrainingEntries.sessionDate,
              sessionType: studentTrainingEntries.sessionType,
              title: studentTrainingEntries.title,
            })
            .from(studentTrainingEntries)
            .where(eq(studentTrainingEntries.userId, input.studentUserId))
            .orderBy(desc(studentTrainingEntries.sessionDate))
            .limit(5),
          dbConn
            .select()
            .from(studentProgress)
            .where(eq(studentProgress.userId, input.studentUserId)),
          dbConn
            .select({
              id: teacherFeedback.id,
              comment: teacherFeedback.comment,
              feedbackType: teacherFeedback.feedbackType,
              createdAt: teacherFeedback.createdAt,
            })
            .from(teacherFeedback)
            .where(eq(teacherFeedback.studentUserId, input.studentUserId))
            .orderBy(desc(teacherFeedback.createdAt))
            .limit(5),
        ]);

      const u = studentUser[0];
      if (!u) throw new TRPCError({ code: "NOT_FOUND" });
      const prefs = parseUserPrefs(u.preferences);

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.isCompleted).length;
      const careCompletion =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const totalXp = progress.reduce((acc, p) => acc + p.xp, 0);
      const avgLevel =
        progress.length > 0
          ? Math.round(
              progress.reduce((acc, p) => acc + p.level, 0) / progress.length,
            )
          : 1;

      return {
        student: {
          id: u.id,
          name: u.name,
          email: u.email,
          learnerLevel: (prefs.studentLevel as string) ?? "beginner",
        },
        stats: {
          totalTasks,
          completedTasks,
          careCompletion,
          totalXp,
          avgSkillLevel: avgLevel,
          trainingCount: training.length,
        },
        recentTraining: training,
        skillProgress: progress,
        recentFeedback: feedback,
      };
    }),

  // ── Assigned Tasks ────────────────────────────────────────────────────────

  assignTask: teacherProcedure
    .input(
      z
        .object({
          studentUserId: z.number().optional(),
          groupId: z.number().optional(),
          title: z.string().min(1).max(200),
          description: z.string().optional(),
          category: z
            .enum([
              "care",
              "grooming",
              "feeding",
              "study",
              "exercise",
              "safety",
              "other",
            ])
            .default("care"),
          dueDate: z.string().optional(),
          frequency: z.enum(["once", "daily", "weekly"]).default("once"),
        })
        .refine(
          (d) => (d.studentUserId !== undefined) !== (d.groupId !== undefined),
          {
            message: "Provide exactly one of studentUserId or groupId",
          },
        ),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      if (input.groupId !== undefined) {
        await requireTeacherOwnedActiveGroup(
          dbConn,
          ctx.user.id,
          input.groupId,
        );
      }
      if (input.studentUserId !== undefined) {
        await requireTeacherStudentMembership(
          dbConn,
          ctx.user.id,
          input.studentUserId,
        );
      }

      const [result] = await dbConn.insert(teacherAssignedTasks).values({
        teacherId: ctx.user.id,
        studentUserId: input.studentUserId ?? null,
        groupId: input.groupId ?? null,
        title: input.title,
        description: input.description ?? null,
        category: input.category,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        frequency: input.frequency,
      });
      return { id: result.insertId, success: true };
    }),

  listAssignedTasksByTeacher: teacherProcedure
    .input(
      z
        .object({
          studentUserId: z.number().optional(),
          groupId: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const conditions = [eq(teacherAssignedTasks.teacherId, ctx.user.id)];
      if (input?.studentUserId)
        conditions.push(
          eq(teacherAssignedTasks.studentUserId, input.studentUserId),
        );
      if (input?.groupId)
        conditions.push(eq(teacherAssignedTasks.groupId, input.groupId));

      return dbConn
        .select()
        .from(teacherAssignedTasks)
        .where(and(...conditions))
        .orderBy(desc(teacherAssignedTasks.createdAt));
    }),

  deleteAssignedTask: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await dbConn
        .delete(teacherAssignedTasks)
        .where(
          and(
            eq(teacherAssignedTasks.id, input.id),
            eq(teacherAssignedTasks.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  markAssignedTaskComplete: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await dbConn
        .update(teacherAssignedTasks)
        .set({ isCompleted: true, completedAt: new Date() })
        .where(
          and(
            eq(teacherAssignedTasks.id, input.id),
            eq(teacherAssignedTasks.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // ── Feedback ──────────────────────────────────────────────────────────────

  addFeedback: teacherProcedure
    .input(
      z.object({
        studentUserId: z.number(),
        entryType: z.enum(["training_entry", "task", "general", "progress"]),
        entryId: z.number().optional(),
        comment: z.string().min(1).max(2000),
        feedbackType: z
          .enum(["good", "needs_improvement", "urgent", "general"])
          .default("general"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify student is in teacher's groups
      const groups = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.teacherId, ctx.user.id),
            eq(studentGroups.isActive, true),
          ),
        );

      if (!groups.length) throw new TRPCError({ code: "FORBIDDEN" });

      const groupIds = groups.map((g) => g.id);
      const [membership] = await dbConn
        .select({ id: studentGroupMembers.id })
        .from(studentGroupMembers)
        .where(
          and(
            inArray(studentGroupMembers.groupId, groupIds),
            eq(studentGroupMembers.studentUserId, input.studentUserId),
          ),
        )
        .limit(1);
      if (!membership)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student is not in your groups.",
        });

      const [result] = await dbConn.insert(teacherFeedback).values({
        teacherId: ctx.user.id,
        studentUserId: input.studentUserId,
        entryType: input.entryType,
        entryId: input.entryId ?? null,
        comment: input.comment,
        feedbackType: input.feedbackType,
      });
      return { id: result.insertId, success: true };
    }),

  listFeedbackByTeacher: teacherProcedure
    .input(
      z
        .object({
          studentUserId: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const conditions = [eq(teacherFeedback.teacherId, ctx.user.id)];
      if (input?.studentUserId)
        conditions.push(eq(teacherFeedback.studentUserId, input.studentUserId));

      return dbConn
        .select()
        .from(teacherFeedback)
        .where(and(...conditions))
        .orderBy(desc(teacherFeedback.createdAt));
    }),

  deleteFeedback: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await dbConn
        .delete(teacherFeedback)
        .where(
          and(
            eq(teacherFeedback.id, input.id),
            eq(teacherFeedback.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // ── Reports ───────────────────────────────────────────────────────────────

  generateReport: teacherProcedure
    .input(
      z.object({
        studentUserId: z.number(),
        reportType: z.enum(["weekly", "monthly", "term"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify student is in teacher's groups
      const groups = await dbConn
        .select({ id: studentGroups.id, name: studentGroups.name })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.teacherId, ctx.user.id),
            eq(studentGroups.isActive, true),
          ),
        );

      if (!groups.length) throw new TRPCError({ code: "FORBIDDEN" });

      const groupIds = groups.map((g) => g.id);
      const [membership] = await dbConn
        .select({ groupId: studentGroupMembers.groupId })
        .from(studentGroupMembers)
        .where(
          and(
            inArray(studentGroupMembers.groupId, groupIds),
            eq(studentGroupMembers.studentUserId, input.studentUserId),
          ),
        )
        .limit(1);
      if (!membership)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student is not in your groups.",
        });

      // Calculate date range
      const now = new Date();
      let fromDate: Date;
      let periodLabel: string;

      if (input.reportType === "weekly") {
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 7);
        periodLabel = "Last 7 Days";
      } else if (input.reportType === "monthly") {
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 30);
        periodLabel = "Last 30 Days";
      } else {
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 90);
        periodLabel = "Last 90 Days (Term)";
      }

      const [
        studentUser,
        tasks,
        training,
        progress,
        pathwayRows,
        feedbackRows,
        aiSessions,
        lessonCompletions,
        competencyRows,
        lessonReviewRows,
      ] = await Promise.all([
        dbConn
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            preferences: users.preferences,
          })
          .from(users)
          .where(eq(users.id, input.studentUserId))
          .limit(1),
        dbConn
          .select()
          .from(studentTasks)
          .where(
            and(
              eq(studentTasks.userId, input.studentUserId),
              gte(studentTasks.createdAt, fromDate),
            ),
          ),
        dbConn
          .select()
          .from(studentTrainingEntries)
          .where(
            and(
              eq(studentTrainingEntries.userId, input.studentUserId),
              gte(studentTrainingEntries.createdAt, fromDate),
            ),
          )
          .orderBy(desc(studentTrainingEntries.sessionDate)),
        dbConn
          .select()
          .from(studentProgress)
          .where(eq(studentProgress.userId, input.studentUserId)),
        dbConn
          .select()
          .from(learningPathwayProgress)
          .where(
            and(
              eq(learningPathwayProgress.studentUserId, input.studentUserId),
              gte(learningPathwayProgress.completedAt, fromDate),
            ),
          ),
        dbConn
          .select()
          .from(teacherFeedback)
          .where(
            and(
              eq(teacherFeedback.studentUserId, input.studentUserId),
              gte(teacherFeedback.createdAt, fromDate),
            ),
          )
          .orderBy(desc(teacherFeedback.createdAt)),
        dbConn
          .select({ id: aiTutorSessions.id })
          .from(aiTutorSessions)
          .where(
            and(
              eq(aiTutorSessions.userId, input.studentUserId),
              gte(aiTutorSessions.createdAt, fromDate),
            ),
          ),
        dbConn
          .select()
          .from(lessonCompletion)
          .where(eq(lessonCompletion.studentUserId, input.studentUserId))
          .orderBy(desc(lessonCompletion.completedAt)),
        dbConn
          .select()
          .from(studentCompetencies)
          .where(eq(studentCompetencies.userId, input.studentUserId)),
        dbConn
          .select()
          .from(lessonReviews)
          .where(
            and(
              eq(lessonReviews.studentUserId, input.studentUserId),
              gte(lessonReviews.createdAt, fromDate),
            ),
          )
          .orderBy(desc(lessonReviews.createdAt)),
      ]);

      const u = studentUser[0];
      if (!u) throw new TRPCError({ code: "NOT_FOUND" });
      const prefs = parseUserPrefs(u.preferences);

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.isCompleted).length;
      const careConsistency =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const totalXp = progress.reduce((acc, p) => acc + p.xp, 0);
      const avgSkillLevel =
        progress.length > 0
          ? parseFloat(
              (
                progress.reduce((acc, p) => acc + p.level, 0) / progress.length
              ).toFixed(1),
            )
          : 1.0;

      // Category breakdown for tasks
      const tasksByCategory = tasks.reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Training breakdown by type
      const trainingByType = training.reduce(
        (acc, t) => {
          acc[t.sessionType] = (acc[t.sessionType] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Skill areas sorted by XP
      const sortedSkills = [...progress].sort((a, b) => b.xp - a.xp);
      const strengths = sortedSkills
        .slice(0, 3)
        .map((s) => s.skillArea.replace(/_/g, " "));
      const weakAreas = sortedSkills
        .slice(-3)
        .map((s) => s.skillArea.replace(/_/g, " "));

      // Pathway completions this period
      const pathwayCompletions = pathwayRows.length;

      // AI tutor engagement
      const aiEngagement = aiSessions.length;

      // Readiness assessment
      const level = (prefs.studentLevel as string) ?? "beginner";
      const LEVEL_THRESHOLDS: Record<
        string,
        { xp: number; careMin: number; trainingMin: number }
      > = {
        beginner: { xp: 200, careMin: 60, trainingMin: 3 },
        developing: { xp: 500, careMin: 70, trainingMin: 5 },
        intermediate: { xp: 1000, careMin: 80, trainingMin: 8 },
        advanced: { xp: 2000, careMin: 85, trainingMin: 10 },
      };
      const threshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS.beginner;
      const readinessScore = Math.round(
        Math.min(totalXp / threshold.xp, 1) * 40 +
          Math.min(careConsistency / threshold.careMin, 1) * 30 +
          Math.min(training.length / threshold.trainingMin, 1) * 30,
      );
      const readinessLabel =
        readinessScore >= 80
          ? "Ready for Next Level"
          : readinessScore >= 60
            ? "Good Progress"
            : readinessScore >= 40
              ? "Developing"
              : "Needs Support";

      return {
        generatedAt: now.toISOString(),
        reportType: input.reportType,
        periodLabel,
        fromDate: fromDate.toISOString(),
        toDate: now.toISOString(),
        student: {
          id: u.id,
          name: u.name,
          email: u.email,
          learnerLevel: level,
        },
        stats: {
          totalTasks,
          completedTasks,
          careConsistency,
          trainingSessionCount: training.length,
          pathwayCompletions,
          aiTutorSessions: aiEngagement,
          totalXp,
          avgSkillLevel,
        },
        tasksByCategory,
        trainingByType,
        strengths,
        weakAreas: weakAreas.filter((w) => !strengths.includes(w)),
        recentTraining: training.slice(0, 5).map((t) => ({
          title: t.title,
          date: String(t.sessionDate).slice(0, 10),
          type: t.sessionType,
          wentWell: t.wentWell,
          needsImprovement: t.needsImprovement,
        })),
        teacherFeedback: feedbackRows.map((f) => ({
          id: f.id,
          comment: f.comment,
          feedbackType: f.feedbackType,
          entryType: f.entryType,
          date: f.createdAt.toISOString().slice(0, 10),
        })),
        readiness: { score: readinessScore, label: readinessLabel },
        groupName:
          groups.find((g) => g.id === membership.groupId)?.name ??
          "Unknown Group",
        // Phase 2 additions
        lessonsCompleted: lessonCompletions.length,
        lessonsByPathway: lessonCompletions.reduce(
          (acc, lc) => {
            acc[lc.pathwaySlug] = (acc[lc.pathwaySlug] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        averageLessonScore: (() => {
          const scoredCompletions = lessonCompletions.filter(
            (lc) => lc.score !== null,
          );
          return scoredCompletions.length > 0
            ? Math.round(
                scoredCompletions.reduce((s, lc) => s + (lc.score ?? 0), 0) /
                  scoredCompletions.length,
              )
            : null;
        })(),
        competencies: {
          total: competencyRows.length,
          achieved: competencyRows.filter((c) => c.status === "achieved")
            .length,
          inProgress: competencyRows.filter((c) => c.status === "in_progress")
            .length,
          needsSupport: competencyRows.filter(
            (c) => c.status === "needs_support",
          ).length,
        },
        lessonReviews: lessonReviewRows.map((r) => ({
          id: r.id,
          lessonSlug: r.lessonSlug,
          reviewStatus: r.reviewStatus,
          feedback: r.feedback,
          recommendedNextLesson: r.recommendedNextLesson,
          date: r.createdAt.toISOString().slice(0, 10),
        })),
      };
    }),

  // ── Teacher Dashboard Overview ────────────────────────────────────────────

  getTeacherOverview: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const groups = await dbConn
      .select({
        id: studentGroups.id,
        name: studentGroups.name,
        level: studentGroups.level,
      })
      .from(studentGroups)
      .where(
        and(
          eq(studentGroups.teacherId, ctx.user.id),
          eq(studentGroups.isActive, true),
        ),
      );

    const totalGroups = groups.length;

    let totalStudents = 0;
    if (groups.length) {
      const groupIds = groups.map((g) => g.id);
      const memberRows = await dbConn
        .select({
          id: studentGroupMembers.id,
          studentUserId: studentGroupMembers.studentUserId,
        })
        .from(studentGroupMembers)
        .where(inArray(studentGroupMembers.groupId, groupIds));
      totalStudents = new Set(memberRows.map((m) => m.studentUserId)).size;
    }

    // Assigned tasks not yet completed
    const pendingAssignedTasks = await dbConn
      .select({ id: teacherAssignedTasks.id })
      .from(teacherAssignedTasks)
      .where(
        and(
          eq(teacherAssignedTasks.teacherId, ctx.user.id),
          eq(teacherAssignedTasks.isCompleted, false),
        ),
      );

    // Recent feedback sent
    const recentFeedback = await dbConn
      .select({
        id: teacherFeedback.id,
        studentUserId: teacherFeedback.studentUserId,
        feedbackType: teacherFeedback.feedbackType,
        comment: teacherFeedback.comment,
        createdAt: teacherFeedback.createdAt,
      })
      .from(teacherFeedback)
      .where(eq(teacherFeedback.teacherId, ctx.user.id))
      .orderBy(desc(teacherFeedback.createdAt))
      .limit(5);

    return {
      totalGroups,
      totalStudents,
      pendingAssignedTasks: pendingAssignedTasks.length,
      recentFeedback,
      groups: groups.slice(0, 5),
    };
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 2 — Lesson Assignment, Review, and Competency Procedures
  // ─────────────────────────────────────────────────────────────────────────

  /** List all available lesson units so teachers can pick from a dropdown. */
  listLessons: teacherProcedure.query(async () => {
    await ensureAcademyCurriculum();
    const dbConn = await getDb();
    if (!dbConn) return [];
    const rows = await dbConn
      .select({
        slug: lessonUnits.slug,
        title: lessonUnits.title,
        pathwaySlug: lessonUnits.pathwaySlug,
        level: lessonUnits.level,
        category: lessonUnits.category,
        sortOrder: lessonUnits.sortOrder,
      })
      .from(lessonUnits)
      .where(eq(lessonUnits.isPublished, true))
      .orderBy(lessonUnits.pathwaySlug, lessonUnits.sortOrder);
    return rows;
  }),

  /** Assign a lesson or pathway to a student or group. */
  assignLesson: teacherProcedure
    .input(
      z
        .object({
          studentUserId: z.number().optional(),
          groupId: z.number().optional(),
          assignmentType: z.enum(["lesson", "pathway"]),
          lessonSlug: z.string().max(150).optional(),
          pathwaySlug: z.string().max(100).optional(),
          dueDate: z.string().optional(),
          instructions: z.string().max(1000).optional(),
        })
        .refine(
          (d) => d.studentUserId !== undefined || d.groupId !== undefined,
          {
            message: "Either studentUserId or groupId must be provided",
          },
        )
        .refine(
          (d) =>
            d.assignmentType === "lesson" ? !!d.lessonSlug : !!d.pathwaySlug,
          {
            message:
              "lessonSlug required for lesson type; pathwaySlug required for pathway type",
          },
        ),
    )
    .mutation(async ({ ctx, input }) => {
      await ensureAcademyCurriculum();
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      if (input.groupId !== undefined) {
        await requireTeacherOwnedActiveGroup(
          dbConn,
          ctx.user.id,
          input.groupId,
        );
      }
      if (input.studentUserId !== undefined) {
        await requireTeacherStudentMembership(
          dbConn,
          ctx.user.id,
          input.studentUserId,
        );
      }

      const [publishedCurriculum] = await dbConn
        .select({ slug: lessonUnits.slug })
        .from(lessonUnits)
        .where(
          input.assignmentType === "lesson"
            ? and(
                eq(lessonUnits.slug, input.lessonSlug!),
                eq(lessonUnits.isPublished, true),
              )
            : and(
                eq(lessonUnits.pathwaySlug, input.pathwaySlug!),
                eq(lessonUnits.isPublished, true),
              ),
        )
        .limit(1);
      if (!publishedCurriculum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The requested published Academy content was not found.",
        });
      }

      const [result] = await dbConn.insert(teacherLessonAssignments).values({
        teacherId: ctx.user.id,
        studentUserId: input.studentUserId ?? null,
        groupId: input.groupId ?? null,
        assignmentType: input.assignmentType,
        lessonSlug: input.lessonSlug ?? null,
        pathwaySlug: input.pathwaySlug ?? null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        instructions: input.instructions ?? null,
      });
      return { id: result.insertId, success: true };
    }),

  /** List lesson assignments made by this teacher, optionally filtered. */
  listLessonAssignments: teacherProcedure
    .input(
      z
        .object({
          studentUserId: z.number().optional(),
          groupId: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      const conditions = [
        eq(teacherLessonAssignments.teacherId, ctx.user.id),
        eq(teacherLessonAssignments.isActive, true),
      ];
      if (input?.studentUserId)
        conditions.push(
          eq(teacherLessonAssignments.studentUserId, input.studentUserId),
        );
      if (input?.groupId)
        conditions.push(eq(teacherLessonAssignments.groupId, input.groupId));

      return dbConn
        .select()
        .from(teacherLessonAssignments)
        .where(and(...conditions))
        .orderBy(desc(teacherLessonAssignments.createdAt));
    }),

  /** Delete / cancel a lesson assignment. */
  deleteLessonAssignment: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await dbConn
        .update(teacherLessonAssignments)
        .set({ isActive: false })
        .where(
          and(
            eq(teacherLessonAssignments.id, input.id),
            eq(teacherLessonAssignments.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  /** Get the list of completed lessons for a specific student. */
  getStudentLessonSummary: teacherProcedure
    .input(z.object({ studentUserId: z.number() }))
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify teacher has access to this student
      const groups = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.teacherId, ctx.user.id),
            eq(studentGroups.isActive, true),
          ),
        );
      if (!groups.length) throw new TRPCError({ code: "FORBIDDEN" });

      const groupIds = groups.map((g) => g.id);
      const [membership] = await dbConn
        .select({ id: studentGroupMembers.id })
        .from(studentGroupMembers)
        .where(
          and(
            inArray(studentGroupMembers.groupId, groupIds),
            eq(studentGroupMembers.studentUserId, input.studentUserId),
          ),
        )
        .limit(1);
      if (!membership)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Student is not in your groups.",
        });

      const [completions, reviews] = await Promise.all([
        dbConn
          .select()
          .from(lessonCompletion)
          .where(eq(lessonCompletion.studentUserId, input.studentUserId))
          .orderBy(desc(lessonCompletion.completedAt)),
        dbConn
          .select()
          .from(lessonReviews)
          .where(eq(lessonReviews.studentUserId, input.studentUserId))
          .orderBy(desc(lessonReviews.createdAt)),
      ]);

      return {
        completions,
        reviews,
        completedCount: completions.length,
        byPathway: completions.reduce(
          (acc, lc) => {
            acc[lc.pathwaySlug] = (acc[lc.pathwaySlug] ?? 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };
    }),

  /** Teacher writes a review of a student's lesson completion. */
  reviewLesson: teacherProcedure
    .input(
      z.object({
        studentUserId: z.number(),
        lessonSlug: z.string().max(150),
        lessonCompletionId: z.number().optional(),
        reviewStatus: z.enum(["satisfactory", "needs_improvement"]),
        feedback: z.string().max(2000).optional(),
        recommendedNextLesson: z.string().max(150).optional(),
        competencyKey: z.string().max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify teacher has access
      const groups = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.teacherId, ctx.user.id),
            eq(studentGroups.isActive, true),
          ),
        );
      if (!groups.length) throw new TRPCError({ code: "FORBIDDEN" });
      const groupIds = groups.map((g) => g.id);
      const [membership] = await dbConn
        .select({ id: studentGroupMembers.id })
        .from(studentGroupMembers)
        .where(
          and(
            inArray(studentGroupMembers.groupId, groupIds),
            eq(studentGroupMembers.studentUserId, input.studentUserId),
          ),
        )
        .limit(1);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

      const [result] = await dbConn.insert(lessonReviews).values({
        teacherId: ctx.user.id,
        studentUserId: input.studentUserId,
        lessonSlug: input.lessonSlug,
        lessonCompletionId: input.lessonCompletionId ?? null,
        reviewStatus: input.reviewStatus,
        feedback: input.feedback ?? null,
        recommendedNextLesson: input.recommendedNextLesson ?? null,
        competencyKey: input.competencyKey ?? null,
      });
      return { id: result.insertId, success: true };
    }),

  /** List lesson reviews submitted by this teacher, optionally for one student. */
  listLessonReviews: teacherProcedure
    .input(z.object({ studentUserId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      const conditions = [eq(lessonReviews.teacherId, ctx.user.id)];
      if (input?.studentUserId)
        conditions.push(eq(lessonReviews.studentUserId, input.studentUserId));
      return dbConn
        .select()
        .from(lessonReviews)
        .where(and(...conditions))
        .orderBy(desc(lessonReviews.createdAt));
    }),

  /** Sign off (or update) a student competency. */
  signOffCompetency: teacherProcedure
    .input(
      z.object({
        studentUserId: z.number(),
        competencyKey: z.string().max(100),
        category: z.string().max(100),
        level: z.string().max(30).default("beginner"),
        status: z.enum([
          "not_assessed",
          "in_progress",
          "achieved",
          "needs_support",
        ]),
        teacherComment: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify teacher has access
      const groups = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.teacherId, ctx.user.id),
            eq(studentGroups.isActive, true),
          ),
        );
      if (!groups.length) throw new TRPCError({ code: "FORBIDDEN" });
      const groupIds = groups.map((g) => g.id);
      const [membership] = await dbConn
        .select({ id: studentGroupMembers.id })
        .from(studentGroupMembers)
        .where(
          and(
            inArray(studentGroupMembers.groupId, groupIds),
            eq(studentGroupMembers.studentUserId, input.studentUserId),
          ),
        )
        .limit(1);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

      // Upsert: update if exists, insert if new
      const [existing] = await dbConn
        .select({ id: studentCompetencies.id })
        .from(studentCompetencies)
        .where(
          and(
            eq(studentCompetencies.userId, input.studentUserId),
            eq(studentCompetencies.competencyKey, input.competencyKey),
          ),
        )
        .limit(1);

      if (existing) {
        await dbConn
          .update(studentCompetencies)
          .set({
            status: input.status,
            teacherComment: input.teacherComment ?? null,
            signedOffBy: input.status === "achieved" ? ctx.user.id : null,
            signedOffAt: input.status === "achieved" ? new Date() : null,
            level: input.level,
          })
          .where(eq(studentCompetencies.id, existing.id));
        return { id: existing.id, success: true };
      }

      const [result] = await dbConn.insert(studentCompetencies).values({
        userId: input.studentUserId,
        competencyKey: input.competencyKey,
        category: input.category,
        level: input.level,
        status: input.status,
        teacherComment: input.teacherComment ?? null,
        signedOffBy: input.status === "achieved" ? ctx.user.id : null,
        signedOffAt: input.status === "achieved" ? new Date() : null,
      });
      return { id: result.insertId, success: true };
    }),

  /** Get all competencies for a specific student. */
  listStudentCompetencies: teacherProcedure
    .input(z.object({ studentUserId: z.number() }))
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      // Verify access
      const groups = await dbConn
        .select({ id: studentGroups.id })
        .from(studentGroups)
        .where(
          and(
            eq(studentGroups.teacherId, ctx.user.id),
            eq(studentGroups.isActive, true),
          ),
        );
      if (!groups.length) throw new TRPCError({ code: "FORBIDDEN" });
      const groupIds = groups.map((g) => g.id);
      const [membership] = await dbConn
        .select({ id: studentGroupMembers.id })
        .from(studentGroupMembers)
        .where(
          and(
            inArray(studentGroupMembers.groupId, groupIds),
            eq(studentGroupMembers.studentUserId, input.studentUserId),
          ),
        )
        .limit(1);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

      return dbConn
        .select()
        .from(studentCompetencies)
        .where(eq(studentCompetencies.userId, input.studentUserId))
        .orderBy(
          studentCompetencies.category,
          studentCompetencies.competencyKey,
        );
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // MESSAGING — Teacher ↔ Student direct messages (persisted)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Send a message to a student. */
  sendMessage: teacherProcedure
    .input(
      z.object({
        studentId: z.number(),
        content: z.string().min(1).max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await requireTeacherStudentMembership(
        dbConn,
        ctx.user.id,
        input.studentId,
      );

      const [result] = await dbConn.insert(teacherStudentMessages).values({
        teacherId: ctx.user.id,
        studentId: input.studentId,
        senderRole: "teacher",
        content: input.content,
      });
      return { id: result.insertId };
    }),

  /** Get all messages between this teacher and a specific student. */
  getThreadMessages: teacherProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await requireTeacherStudentMembership(
        dbConn,
        ctx.user.id,
        input.studentId,
      );

      const msgs = await dbConn
        .select()
        .from(teacherStudentMessages)
        .where(
          and(
            eq(teacherStudentMessages.teacherId, ctx.user.id),
            eq(teacherStudentMessages.studentId, input.studentId),
          ),
        )
        .orderBy(teacherStudentMessages.createdAt);

      // Mark unread messages from student as read
      await dbConn
        .update(teacherStudentMessages)
        .set({ isRead: true })
        .where(
          and(
            eq(teacherStudentMessages.teacherId, ctx.user.id),
            eq(teacherStudentMessages.studentId, input.studentId),
            eq(teacherStudentMessages.senderRole, "student"),
            eq(teacherStudentMessages.isRead, false),
          ),
        );

      return msgs.map((m) => ({
        id: m.id,
        from: m.senderRole as "teacher" | "student",
        text: m.content,
        time: m.createdAt
          ? new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        createdAt: m.createdAt,
      }));
    }),

  /** Get unread message counts per student. */
  getUnreadCounts: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const rows = await dbConn
      .select({
        studentId: teacherStudentMessages.studentId,
        count: sql<number>`count(*)`,
      })
      .from(teacherStudentMessages)
      .where(
        and(
          eq(teacherStudentMessages.teacherId, ctx.user.id),
          eq(teacherStudentMessages.senderRole, "student"),
          eq(teacherStudentMessages.isRead, false),
        ),
      )
      .groupBy(teacherStudentMessages.studentId);

    const result: Record<number, number> = {};
    for (const row of rows) {
      result[row.studentId] = row.count;
    }
    return result;
  }),

  // ═══════════════════════════════════════════════════════════════════════════
  // RESOURCES — Teaching resources (persisted)
  // ═══════════════════════════════════════════════════════════════════════════

  /** Create a new teaching resource. */
  createResource: teacherProcedure
    .input(
      z.object({
        title: z.string().min(1).max(250),
        description: z.string().max(1000).optional(),
        fileUrl: z.string().min(1).max(1000),
        fileType: z.enum(["pdf", "image", "document"]),
        fileSize: z.number().optional(),
        shareScope: z.enum(["all", "group", "individual"]).default("all"),
        groupId: z.number().optional(),
        studentId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      if (input.shareScope === "all") {
        if (input.groupId !== undefined || input.studentId !== undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "All-scope resources cannot include a group or student target.",
          });
        }
      } else if (input.shareScope === "group") {
        if (input.groupId === undefined || input.studentId !== undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Group resources require exactly one owned active group.",
          });
        }
        await requireTeacherOwnedActiveGroup(
          dbConn,
          ctx.user.id,
          input.groupId,
        );
      } else {
        if (input.studentId === undefined || input.groupId !== undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Individual resources require exactly one student in your active groups.",
          });
        }
        await requireTeacherStudentMembership(
          dbConn,
          ctx.user.id,
          input.studentId,
        );
      }

      const [result] = await dbConn.insert(teacherResources).values({
        teacherId: ctx.user.id,
        title: input.title,
        description: input.description ?? null,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSize: input.fileSize ?? null,
        shareScope: input.shareScope,
        groupId: input.groupId ?? null,
        studentId: input.studentId ?? null,
      });
      return { id: result.insertId };
    }),

  /** List teacher's resources. */
  listResources: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    return dbConn
      .select()
      .from(teacherResources)
      .where(eq(teacherResources.teacherId, ctx.user.id))
      .orderBy(desc(teacherResources.createdAt));
  }),

  /** Delete a resource. */
  deleteResource: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      await dbConn
        .delete(teacherResources)
        .where(
          and(
            eq(teacherResources.id, input.id),
            eq(teacherResources.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // ASSIGNMENTS — Teacher creates, student submits, teacher reviews
  // ═══════════════════════════════════════════════════════════════════════════

  /** Create an assignment for a student. */
  createAssignment: teacherProcedure
    .input(
      z.object({
        studentId: z.number(),
        title: z.string().min(1).max(250),
        description: z.string().max(5000).optional(),
        dueDate: z.string().optional(), // ISO string
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await requireTeacherStudentMembership(
        dbConn,
        ctx.user.id,
        input.studentId,
      );

      const [result] = await dbConn.insert(studentAssignments).values({
        teacherId: ctx.user.id,
        studentId: input.studentId,
        title: input.title,
        description: input.description ?? null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        status: "pending",
      });
      return { id: result.insertId };
    }),

  /** List all assignments created by this teacher. */
  listTeacherAssignments: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    const rows = await dbConn
      .select({
        id: studentAssignments.id,
        studentId: studentAssignments.studentId,
        title: studentAssignments.title,
        description: studentAssignments.description,
        dueDate: studentAssignments.dueDate,
        status: studentAssignments.status,
        submissionUrl: studentAssignments.submissionUrl,
        submittedAt: studentAssignments.submittedAt,
        grade: studentAssignments.grade,
        feedback: studentAssignments.feedback,
        reviewedAt: studentAssignments.reviewedAt,
        createdAt: studentAssignments.createdAt,
        studentName: users.name,
      })
      .from(studentAssignments)
      .leftJoin(users, eq(studentAssignments.studentId, users.id))
      .where(eq(studentAssignments.teacherId, ctx.user.id))
      .orderBy(desc(studentAssignments.createdAt));

    return rows;
  }),

  /** Review/mark a student assignment. */
  reviewAssignment: teacherProcedure
    .input(
      z.object({
        assignmentId: z.number(),
        grade: z.string().max(20).optional(),
        feedback: z.string().max(5000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

      await dbConn
        .update(studentAssignments)
        .set({
          grade: input.grade ?? null,
          feedback: input.feedback ?? null,
          status: "reviewed",
          reviewedAt: new Date(),
        })
        .where(
          and(
            eq(studentAssignments.id, input.assignmentId),
            eq(studentAssignments.teacherId, ctx.user.id),
          ),
        );
      return { success: true };
    }),

  // ═══════════════════════════════════════════════════════════════════════════
  // REPORTS — Template-based student progress reports
  // ═══════════════════════════════════════════════════════════════════════════

  /** List available report templates (system + teacher-owned). */
  listReportTemplates: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    // Seed system templates if none exist
    const existing = await dbConn
      .select({ id: reportTemplates.id })
      .from(reportTemplates)
      .where(eq(reportTemplates.isSystem, true))
      .limit(1);

    if (existing.length === 0) {
      const SYSTEM_TEMPLATES = [
        {
          name: "Term Progress Report",
          description:
            "End-of-term summary covering attendance, performance, and competency development.",
          templateData: JSON.stringify({
            sections: [
              { title: "Attendance & Engagement", type: "text" },
              { title: "Lesson Progress", type: "text" },
              { title: "Competency Development", type: "text" },
              { title: "Strengths", type: "text" },
              { title: "Areas for Improvement", type: "text" },
              { title: "Teacher Recommendations", type: "text" },
            ],
          }),
          isSystem: true,
        },
        {
          name: "Skills Assessment",
          description: "Assessment of practical and theoretical equine skills.",
          templateData: JSON.stringify({
            sections: [
              { title: "Riding Skills", type: "rating" },
              { title: "Horse Care Knowledge", type: "rating" },
              { title: "Stable Management", type: "rating" },
              { title: "Health & Safety Awareness", type: "rating" },
              { title: "Overall Comments", type: "text" },
            ],
          }),
          isSystem: true,
        },
        {
          name: "Quick Progress Note",
          description: "Short-form progress note for regular updates.",
          templateData: JSON.stringify({
            sections: [
              { title: "Current Focus", type: "text" },
              { title: "Progress This Period", type: "text" },
              { title: "Next Steps", type: "text" },
            ],
          }),
          isSystem: true,
        },
      ];

      for (const tpl of SYSTEM_TEMPLATES) {
        try {
          await dbConn.insert(reportTemplates).values({
            teacherId: null,
            name: tpl.name,
            description: tpl.description,
            templateData: tpl.templateData,
            isSystem: true,
          });
        } catch (e: any) {
          // Log non-duplicate errors for debugging; duplicates are expected during concurrent seeding
          if (e?.code !== "ER_DUP_ENTRY") {
            console.warn(
              `[ReportTemplates] Failed to seed "${tpl.name}":`,
              e?.message ?? e,
            );
          }
        }
      }
    }

    return dbConn
      .select()
      .from(reportTemplates)
      .where(
        sql`${reportTemplates.isSystem} = true OR ${reportTemplates.teacherId} = ${ctx.user.id}`,
      )
      .orderBy(reportTemplates.isSystem, reportTemplates.name);
  }),

  /** Create a student report from a template. */
  createStudentReport: teacherProcedure
    .input(
      z.object({
        studentId: z.number(),
        templateId: z.number().optional(),
        title: z.string().min(1).max(250),
        reportData: z.string(), // JSON
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbConn = await getDb();
      if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });
      await requireTeacherStudentMembership(
        dbConn,
        ctx.user.id,
        input.studentId,
      );

      const [result] = await dbConn.insert(studentReports).values({
        teacherId: ctx.user.id,
        studentId: input.studentId,
        templateId: input.templateId ?? null,
        title: input.title,
        reportData: input.reportData,
        sentAt: new Date(),
      });
      return { id: result.insertId };
    }),

  /** List reports created by this teacher. */
  listStudentReports: teacherProcedure.query(async ({ ctx }) => {
    const dbConn = await getDb();
    if (!dbConn) throw new TRPCError({ code: "SERVICE_UNAVAILABLE" });

    return dbConn
      .select({
        id: studentReports.id,
        studentId: studentReports.studentId,
        title: studentReports.title,
        sentAt: studentReports.sentAt,
        createdAt: studentReports.createdAt,
        studentName: users.name,
      })
      .from(studentReports)
      .leftJoin(users, eq(studentReports.studentId, users.id))
      .where(eq(studentReports.teacherId, ctx.user.id))
      .orderBy(desc(studentReports.createdAt));
  }),
});
