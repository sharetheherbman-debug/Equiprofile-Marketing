import type { LessonPathwayData, LessonUnitData } from "../lessonContent";

export const ACADEMY_LEVELS = [
  "beginner",
  "developing",
  "intermediate",
  "advanced",
] as const;

export type AcademyLevel = (typeof ACADEMY_LEVELS)[number];

export interface CurriculumAuditIssue {
  severity: "error" | "warning";
  code: string;
  location: string;
  message: string;
}

export interface CurriculumAuditReport {
  generatedAt: string;
  summary: {
    pathways: number;
    lessons: number;
    lessonsByLevel: Record<AcademyLevel, number>;
    lessonsByPathway: Record<string, number>;
    knowledgeChecks: number;
    linkedCompetencyReferences: number;
    errors: number;
    warnings: number;
  };
  issues: CurriculumAuditIssue[];
}

const NON_EMPTY = /\S/;
const PROHIBITED_ACCREDITATION_WORDING = /\b(BHS|Pony Club)\b/i;
const PLACEHOLDER_WORDING =
  /\b(todo|tbd|placeholder|lorem ipsum|coming soon)\b/i;
const MIN_CONTENT_CHARACTERS = 300;
const MIN_OBJECTIVES = 2;
const MIN_KEY_POINTS = 2;
const MIN_KNOWLEDGE_CHECKS = 2;

function duplicateValues(values: string[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return duplicates;
}

function issue(
  issues: CurriculumAuditIssue[],
  severity: CurriculumAuditIssue["severity"],
  code: string,
  location: string,
  message: string,
) {
  issues.push({ severity, code, location, message });
}

export function getCurriculumFacts(
  pathways: LessonPathwayData[],
  lessons: LessonUnitData[],
) {
  const lessonsByLevel: Record<AcademyLevel, number> = {
    beginner: 0,
    developing: 0,
    intermediate: 0,
    advanced: 0,
  };
  const lessonsByPathway: Record<string, number> = Object.fromEntries(
    pathways.map((pathway) => [pathway.slug, 0]),
  );

  for (const lesson of lessons) {
    lessonsByLevel[lesson.level] += 1;
    lessonsByPathway[lesson.pathwaySlug] =
      (lessonsByPathway[lesson.pathwaySlug] ?? 0) + 1;
  }

  return {
    orderedPathwaySlugs: pathways
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((pathway) => pathway.slug),
    totalLessons: lessons.length,
    lessonsByLevel,
    lessonsByPathway,
  };
}

export function resolveCanonicalLesson(
  lessons: LessonUnitData[],
  lessonSlug: string,
): LessonUnitData | null {
  return lessons.find((lesson) => lesson.slug === lessonSlug) ?? null;
}

export function calculateKnowledgeCheckScore(
  lesson: LessonUnitData,
  selectedIndexes: number[],
): { correct: number; total: number; score: number } {
  const questions = lesson.knowledgeCheck;
  if (questions.length === 0) {
    return { correct: 0, total: 0, score: 100 };
  }
  if (selectedIndexes.length !== questions.length) {
    throw new Error(
      `Expected ${questions.length} knowledge-check answers for ${lesson.slug}, received ${selectedIndexes.length}`,
    );
  }

  let correct = 0;
  questions.forEach((question, index) => {
    if (selectedIndexes[index] === question.correctIndex) correct += 1;
  });

  return {
    correct,
    total: questions.length,
    score: Math.round((correct / questions.length) * 100),
  };
}

export function auditAcademyCurriculum(
  pathways: LessonPathwayData[],
  lessons: LessonUnitData[],
  generatedAt = new Date().toISOString(),
): CurriculumAuditReport {
  const issues: CurriculumAuditIssue[] = [];
  const pathwaySlugs = new Set(pathways.map((pathway) => pathway.slug));

  for (const duplicate of Array.from(
    duplicateValues(pathways.map((pathway) => pathway.slug)),
  )) {
    issue(
      issues,
      "error",
      "DUPLICATE_PATHWAY_SLUG",
      `pathway:${duplicate}`,
      `Pathway slug "${duplicate}" is duplicated.`,
    );
  }

  for (const duplicate of Array.from(
    duplicateValues(lessons.map((lesson) => lesson.slug)),
  )) {
    issue(
      issues,
      "error",
      "DUPLICATE_LESSON_SLUG",
      `lesson:${duplicate}`,
      `Lesson slug "${duplicate}" is duplicated.`,
    );
  }

  for (const duplicate of Array.from(
    duplicateValues(pathways.map((pathway) => String(pathway.sortOrder))),
  )) {
    issue(
      issues,
      "warning",
      "DUPLICATE_PATHWAY_SORT_ORDER",
      `pathway-sort:${duplicate}`,
      `More than one pathway uses sort order ${duplicate}.`,
    );
  }

  for (const pathway of pathways) {
    const location = `pathway:${pathway.slug || "<missing>"}`;
    if (!NON_EMPTY.test(pathway.slug)) {
      issue(
        issues,
        "error",
        "MISSING_PATHWAY_SLUG",
        location,
        "Pathway slug is required.",
      );
    }
    if (!NON_EMPTY.test(pathway.title)) {
      issue(
        issues,
        "error",
        "MISSING_PATHWAY_TITLE",
        location,
        "Pathway title is required.",
      );
    }
    if (!NON_EMPTY.test(pathway.description)) {
      issue(
        issues,
        "error",
        "MISSING_PATHWAY_DESCRIPTION",
        location,
        "Pathway description is required.",
      );
    }
    if (!Number.isInteger(pathway.sortOrder) || pathway.sortOrder < 0) {
      issue(
        issues,
        "error",
        "INVALID_PATHWAY_SORT_ORDER",
        location,
        "Pathway sort order must be a non-negative integer.",
      );
    }
    if (
      PROHIBITED_ACCREDITATION_WORDING.test(
        `${pathway.title} ${pathway.description}`,
      )
    ) {
      issue(
        issues,
        "warning",
        "ACCREDITATION_REVIEW_REQUIRED",
        location,
        "Pathway copy references BHS or Pony Club and requires rights/accreditation review.",
      );
    }
  }

  let knowledgeChecks = 0;
  let linkedCompetencyReferences = 0;

  for (const lesson of lessons) {
    const location = `lesson:${lesson.slug || "<missing>"}`;

    if (!NON_EMPTY.test(lesson.slug)) {
      issue(
        issues,
        "error",
        "MISSING_LESSON_SLUG",
        location,
        "Lesson slug is required.",
      );
    }
    if (!pathwaySlugs.has(lesson.pathwaySlug)) {
      issue(
        issues,
        "error",
        "UNKNOWN_PATHWAY",
        location,
        `Lesson references unknown pathway "${lesson.pathwaySlug}".`,
      );
    }
    if (!(ACADEMY_LEVELS as readonly string[]).includes(lesson.level)) {
      issue(
        issues,
        "error",
        "INVALID_LEVEL",
        location,
        `Lesson level "${lesson.level}" is not supported.`,
      );
    }
    if (!NON_EMPTY.test(lesson.title)) {
      issue(
        issues,
        "error",
        "MISSING_TITLE",
        location,
        "Lesson title is required.",
      );
    }
    if (!NON_EMPTY.test(lesson.category)) {
      issue(
        issues,
        "error",
        "MISSING_CATEGORY",
        location,
        "Lesson category is required.",
      );
    }
    if (!Number.isInteger(lesson.sortOrder) || lesson.sortOrder < 0) {
      issue(
        issues,
        "error",
        "INVALID_SORT_ORDER",
        location,
        "Lesson sort order must be a non-negative integer.",
      );
    }
    if (
      lesson.objectives.length === 0 ||
      lesson.objectives.some((value) => !NON_EMPTY.test(value))
    ) {
      issue(
        issues,
        "error",
        "INVALID_OBJECTIVES",
        location,
        "Lesson must contain non-empty objectives.",
      );
    }
    if (!NON_EMPTY.test(lesson.content)) {
      issue(
        issues,
        "error",
        "MISSING_CONTENT",
        location,
        "Detailed lesson content is required.",
      );
    } else if (lesson.content.trim().length < MIN_CONTENT_CHARACTERS) {
      issue(
        issues,
        "warning",
        "SHALLOW_CONTENT_REVIEW_REQUIRED",
        location,
        `Lesson content is shorter than the ${MIN_CONTENT_CHARACTERS}-character depth threshold.`,
      );
    }
    if (lesson.objectives.length < MIN_OBJECTIVES) {
      issue(
        issues,
        "warning",
        "LIMITED_OBJECTIVES_REVIEW_REQUIRED",
        location,
        `Lesson has fewer than ${MIN_OBJECTIVES} learning objectives.`,
      );
    }
    if (
      lesson.keyPoints.length === 0 ||
      lesson.keyPoints.some((value) => !NON_EMPTY.test(value))
    ) {
      issue(
        issues,
        "error",
        "INVALID_KEY_POINTS",
        location,
        "Lesson must contain non-empty key points.",
      );
    } else if (lesson.keyPoints.length < MIN_KEY_POINTS) {
      issue(
        issues,
        "warning",
        "LIMITED_KEY_POINTS_REVIEW_REQUIRED",
        location,
        `Lesson has fewer than ${MIN_KEY_POINTS} key points.`,
      );
    }
    if (!NON_EMPTY.test(lesson.safetyNote)) {
      issue(
        issues,
        "warning",
        "MISSING_SAFETY_NOTE",
        location,
        "Safety guidance is missing.",
      );
    }
    if (!NON_EMPTY.test(lesson.practicalApplication)) {
      issue(
        issues,
        "warning",
        "MISSING_PRACTICAL_APPLICATION",
        location,
        "Practical application guidance is missing.",
      );
    }
    if (lesson.commonMistakes.length === 0) {
      issue(
        issues,
        "warning",
        "MISSING_COMMON_MISTAKES",
        location,
        "Common mistakes guidance is missing.",
      );
    }
    if (lesson.knowledgeCheck.length === 0) {
      issue(
        issues,
        "warning",
        "MISSING_KNOWLEDGE_CHECK",
        location,
        "Lesson has no knowledge-check questions.",
      );
    } else if (lesson.knowledgeCheck.length < MIN_KNOWLEDGE_CHECKS) {
      issue(
        issues,
        "warning",
        "LIMITED_KNOWLEDGE_CHECK_REVIEW_REQUIRED",
        location,
        `Lesson has fewer than ${MIN_KNOWLEDGE_CHECKS} knowledge-check questions.`,
      );
    }
    if (lesson.aiTutorPrompts.length === 0) {
      issue(
        issues,
        "warning",
        "MISSING_AI_TUTOR_PROMPTS",
        location,
        "Lesson has no AI Tutor prompts.",
      );
    }

    const searchableCopy = [
      lesson.title,
      lesson.category,
      lesson.content,
      lesson.safetyNote,
      lesson.practicalApplication,
      ...lesson.objectives,
      ...lesson.keyPoints,
      ...lesson.commonMistakes,
      ...lesson.aiTutorPrompts,
    ].join("\n");

    if (PLACEHOLDER_WORDING.test(searchableCopy)) {
      issue(
        issues,
        "warning",
        "PLACEHOLDER_REVIEW_REQUIRED",
        location,
        "Lesson contains wording associated with placeholder or unfinished content.",
      );
    }
    if (PROHIBITED_ACCREDITATION_WORDING.test(searchableCopy)) {
      issue(
        issues,
        "warning",
        "ACCREDITATION_REVIEW_REQUIRED",
        location,
        "Lesson references BHS or Pony Club and requires rights/accreditation review.",
      );
    }

    lesson.knowledgeCheck.forEach((question, questionIndex) => {
      knowledgeChecks += 1;
      const questionLocation = `${location}:question:${questionIndex + 1}`;
      if (!NON_EMPTY.test(question.question)) {
        issue(
          issues,
          "error",
          "MISSING_QUESTION_TEXT",
          questionLocation,
          "Knowledge-check question text is required.",
        );
      }
      if (
        question.options.length < 2 ||
        question.options.some((option) => !NON_EMPTY.test(option))
      ) {
        issue(
          issues,
          "error",
          "INVALID_QUESTION_OPTIONS",
          questionLocation,
          "Knowledge-check question must have at least two non-empty options.",
        );
      }
      if (
        !Number.isInteger(question.correctIndex) ||
        question.correctIndex < 0 ||
        question.correctIndex >= question.options.length
      ) {
        issue(
          issues,
          "error",
          "INVALID_CORRECT_INDEX",
          questionLocation,
          `correctIndex ${question.correctIndex} is outside the available options.`,
        );
      }
      if (!NON_EMPTY.test(question.explanation)) {
        issue(
          issues,
          "error",
          "MISSING_ANSWER_EXPLANATION",
          questionLocation,
          "Knowledge-check answer explanation is required.",
        );
      }
    });

    linkedCompetencyReferences += lesson.linkedCompetencies.length;
    for (const competencyKey of lesson.linkedCompetencies) {
      if (!NON_EMPTY.test(competencyKey)) {
        issue(
          issues,
          "error",
          "EMPTY_COMPETENCY_KEY",
          location,
          "Linked competency key cannot be empty.",
        );
      }
    }
  }

  const facts = getCurriculumFacts(pathways, lessons);
  const errors = issues.filter((entry) => entry.severity === "error").length;
  const warnings = issues.filter(
    (entry) => entry.severity === "warning",
  ).length;

  return {
    generatedAt,
    summary: {
      pathways: pathways.length,
      lessons: lessons.length,
      lessonsByLevel: facts.lessonsByLevel,
      lessonsByPathway: facts.lessonsByPathway,
      knowledgeChecks,
      linkedCompetencyReferences,
      errors,
      warnings,
    },
    issues,
  };
}
