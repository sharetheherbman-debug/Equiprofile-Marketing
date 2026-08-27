import { and, eq } from "drizzle-orm";
import {
  academyCurriculumSyncRuns,
  lessonPathways,
  lessonUnits,
} from "../../drizzle/schema";
import { getDb } from "../db";
import {
  LESSON_PATHWAYS,
  LESSON_UNITS,
  type LessonUnitData,
} from "../lessonContent";
import { auditAcademyCurriculum } from "./curriculumIntegrity";
import { isAcademyLessonFactuallyAccepted } from "./factualAcceptance";

/**
 * Bump deliberately when source curriculum semantics change. Importing is keyed
 * by stable slugs, so a content release never deletes learner progress.
 */
export const ACADEMY_CURRICULUM_VERSION = "2026.2";

export type AcademyCurriculumSyncResult = {
  curriculumVersion: string;
  pathwaysProcessed: number;
  lessonsProcessed: number;
  archivedLessons: number;
  archivedPathways: number;
  validationWarnings: number;
};

function orderedLessonsByPathway() {
  const lessons = new Map<string, LessonUnitData[]>();
  for (const lesson of LESSON_UNITS) {
    const current = lessons.get(lesson.pathwaySlug) ?? [];
    current.push(lesson);
    lessons.set(lesson.pathwaySlug, current);
  }
  for (const items of Array.from(lessons.values())) {
    items.sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.slug.localeCompare(right.slug),
    );
  }
  return lessons;
}

function serialize(value: unknown) {
  return JSON.stringify(value);
}

/**
 * Reconciles source curriculum with the database using upserts. Existing
 * learner-completion rows are intentionally not read, changed, or deleted.
 */
export async function syncAcademyCurriculum(): Promise<AcademyCurriculumSyncResult> {
  const audit = auditAcademyCurriculum(LESSON_PATHWAYS, LESSON_UNITS);
  if (audit.summary.errors > 0) {
    throw new Error(
      `Academy curriculum validation failed: ${audit.issues
        .filter((issue) => issue.severity === "error")
        .map((issue) => `${issue.code}:${issue.location}`)
        .join(", ")}`,
    );
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Academy curriculum sync requires a database connection");
  }

  for (const pathway of LESSON_PATHWAYS) {
    await db
      .insert(lessonPathways)
      .values({
        slug: pathway.slug,
        title: pathway.title,
        description: pathway.description,
        sortOrder: pathway.sortOrder,
        iconName: pathway.iconName,
        isPublished: true,
        curriculumVersion: ACADEMY_CURRICULUM_VERSION,
      })
      .onDuplicateKeyUpdate({
        set: {
          title: pathway.title,
          description: pathway.description,
          sortOrder: pathway.sortOrder,
          iconName: pathway.iconName,
          isPublished: true,
          curriculumVersion: ACADEMY_CURRICULUM_VERSION,
        },
      });
  }

  const byPathway = orderedLessonsByPathway();
  for (const lesson of LESSON_UNITS) {
    const pathwayLessons = byPathway.get(lesson.pathwaySlug) ?? [];
    const currentIndex = pathwayLessons.findIndex(
      (item) => item.slug === lesson.slug,
    );
    const nextLessonSlug =
      pathwayLessons
        .slice(currentIndex + 1)
        .find((item) => isAcademyLessonFactuallyAccepted(item.slug))?.slug ??
      null;
    const isPublished = isAcademyLessonFactuallyAccepted(lesson.slug);

    await db
      .insert(lessonUnits)
      .values({
        slug: lesson.slug,
        pathwaySlug: lesson.pathwaySlug,
        title: lesson.title,
        level: lesson.level,
        category: lesson.category,
        sortOrder: lesson.sortOrder,
        objectives: serialize(lesson.objectives),
        content: lesson.content,
        keyPoints: serialize(lesson.keyPoints),
        safetyNote: lesson.safetyNote,
        practicalApplication: lesson.practicalApplication,
        commonMistakes: serialize(lesson.commonMistakes),
        knowledgeCheck: serialize(lesson.knowledgeCheck),
        aiTutorPrompts: serialize(lesson.aiTutorPrompts),
        linkedCompetencies: serialize(lesson.linkedCompetencies),
        nextLessonSlug,
        estimatedMinutes: 15,
        curriculumVersion: ACADEMY_CURRICULUM_VERSION,
        isPublished,
      })
      .onDuplicateKeyUpdate({
        set: {
          pathwaySlug: lesson.pathwaySlug,
          title: lesson.title,
          level: lesson.level,
          category: lesson.category,
          sortOrder: lesson.sortOrder,
          objectives: serialize(lesson.objectives),
          content: lesson.content,
          keyPoints: serialize(lesson.keyPoints),
          safetyNote: lesson.safetyNote,
          practicalApplication: lesson.practicalApplication,
          commonMistakes: serialize(lesson.commonMistakes),
          knowledgeCheck: serialize(lesson.knowledgeCheck),
          aiTutorPrompts: serialize(lesson.aiTutorPrompts),
          linkedCompetencies: serialize(lesson.linkedCompetencies),
          nextLessonSlug,
          estimatedMinutes: 15,
          curriculumVersion: ACADEMY_CURRICULUM_VERSION,
          isPublished,
          updatedAt: new Date(),
        },
      });
  }

  // A source removal retires the matching source-managed record from public
  // catalogue queries. It never deletes rows or learner-completion history.
  const sourceLessonSlugs = new Set(LESSON_UNITS.map((lesson) => lesson.slug));
  const sourcePathwaySlugs = new Set(
    LESSON_PATHWAYS.map((pathway) => pathway.slug),
  );
  const [existingLessons, existingPathways] = await Promise.all([
    db
      .select({
        id: lessonUnits.id,
        slug: lessonUnits.slug,
        curriculumVersion: lessonUnits.curriculumVersion,
        isPublished: lessonUnits.isPublished,
      })
      .from(lessonUnits),
    db
      .select({
        id: lessonPathways.id,
        slug: lessonPathways.slug,
        curriculumVersion: lessonPathways.curriculumVersion,
        isPublished: lessonPathways.isPublished,
      })
      .from(lessonPathways),
  ]);
  const retiredLessons = existingLessons.filter(
    (lesson) =>
      lesson.isPublished &&
      lesson.curriculumVersion?.startsWith("2026.") &&
      !sourceLessonSlugs.has(lesson.slug),
  );
  const retiredPathways = existingPathways.filter(
    (pathway) =>
      pathway.isPublished &&
      pathway.curriculumVersion?.startsWith("2026.") &&
      !sourcePathwaySlugs.has(pathway.slug),
  );
  for (const lesson of retiredLessons) {
    await db
      .update(lessonUnits)
      .set({ isPublished: false, updatedAt: new Date() })
      .where(eq(lessonUnits.id, lesson.id));
  }
  for (const pathway of retiredPathways) {
    await db
      .update(lessonPathways)
      .set({ isPublished: false })
      .where(eq(lessonPathways.id, pathway.id));
  }

  const result: AcademyCurriculumSyncResult = {
    curriculumVersion: ACADEMY_CURRICULUM_VERSION,
    pathwaysProcessed: LESSON_PATHWAYS.length,
    lessonsProcessed: LESSON_UNITS.length,
    archivedLessons: retiredLessons.length,
    archivedPathways: retiredPathways.length,
    validationWarnings: audit.summary.warnings,
  };

  await db.insert(academyCurriculumSyncRuns).values({
    curriculumVersion: result.curriculumVersion,
    pathwaysProcessed: result.pathwaysProcessed,
    lessonsProcessed: result.lessonsProcessed,
    validationErrors: audit.summary.errors,
    validationWarnings: result.validationWarnings,
    summaryJson: serialize({
      result,
      lessonsByLevel: audit.summary.lessonsByLevel,
      lessonsByPathway: audit.summary.lessonsByPathway,
      knowledgeChecks: audit.summary.knowledgeChecks,
      linkedCompetencyReferences: audit.summary.linkedCompetencyReferences,
    }),
  });

  return result;
}

let activeSync: Promise<AcademyCurriculumSyncResult> | null = null;
let completedVersion: string | null = null;

/**
 * Lazily reconcile once per process. Concurrent student requests share the same
 * operation, avoiding duplicate seed races while retaining an explicit sync API
 * for controlled maintenance jobs.
 */
export async function ensureAcademyCurriculum(): Promise<AcademyCurriculumSyncResult> {
  if (completedVersion === ACADEMY_CURRICULUM_VERSION) {
    return {
      curriculumVersion: ACADEMY_CURRICULUM_VERSION,
      pathwaysProcessed: LESSON_PATHWAYS.length,
      lessonsProcessed: LESSON_UNITS.length,
      archivedLessons: 0,
      archivedPathways: 0,
      validationWarnings: 0,
    };
  }
  if (!activeSync) {
    activeSync = syncAcademyCurriculum()
      .then((result) => {
        completedVersion = result.curriculumVersion;
        return result;
      })
      .finally(() => {
        activeSync = null;
      });
  }
  return activeSync;
}

/** Resolve canonical lesson metadata from the published database curriculum. */
export async function getPublishedLessonBySlug(slug: string) {
  const db = await getDb();
  if (!db)
    throw new Error("Academy lesson lookup requires a database connection");
  const [lesson] = await db
    .select()
    .from(lessonUnits)
    .where(and(eq(lessonUnits.slug, slug), eq(lessonUnits.isPublished, true)))
    .limit(1);
  return lesson ?? null;
}

export function parseAcademyJson<T>(
  raw: string | null | undefined,
  fallback: T,
): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
