import { describe, expect, it } from "vitest";
import { LESSON_PATHWAYS, LESSON_UNITS } from "./lessonContent";
import {
  auditAcademyCurriculum,
  calculateKnowledgeCheckScore,
  getCurriculumFacts,
  resolveCanonicalLesson,
} from "./academy/curriculumIntegrity";

const meaningfulWordCount = (value: string) =>
  value.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
const highRiskTopic =
  /\b(colic|laminitis|wound|vital signs?|first aid|vaccin|worm|parasite|nutrition|supplement|dental|farrier|transport|insurance|safeguarding)\b/i;
const professionalBoundary =
  /\b(vet(?:erinarian|erinary)?|qualified professional|farrier|dental (?:technician|professional)|SQP|RAMA|official rules|insurer|safeguarding lead|designated reporting route|emergency services)\b/i;

describe("EquiProfile Academy curriculum integrity", () => {
  it("audits every current pathway and lesson without structural errors", () => {
    const report = auditAcademyCurriculum(
      LESSON_PATHWAYS,
      LESSON_UNITS,
      "test-run",
    );

    expect(report.summary.pathways).toBe(15);
    expect(report.summary.lessons).toBe(LESSON_UNITS.length);
    expect(report.summary.knowledgeChecks).toBeGreaterThan(0);
    expect(report.summary.errors, JSON.stringify(report.issues, null, 2)).toBe(
      0,
    );
  });

  it("derives pathway and level totals from the live source curriculum", () => {
    const facts = getCurriculumFacts(LESSON_PATHWAYS, LESSON_UNITS);

    expect(facts.orderedPathwaySlugs).toHaveLength(15);
    expect(facts.totalLessons).toBe(LESSON_UNITS.length);
    expect(
      Object.values(facts.lessonsByPathway).reduce(
        (sum, count) => sum + count,
        0,
      ),
    ).toBe(LESSON_UNITS.length);
    expect(
      Object.values(facts.lessonsByLevel).reduce(
        (sum, count) => sum + count,
        0,
      ),
    ).toBe(LESSON_UNITS.length);
  });

  it("resolves canonical lesson metadata from the trusted curriculum", () => {
    const sourceLesson = LESSON_UNITS[0];
    expect(sourceLesson).toBeDefined();

    const resolved = resolveCanonicalLesson(LESSON_UNITS, sourceLesson.slug);
    expect(resolved).toEqual(sourceLesson);
    expect(
      resolveCanonicalLesson(LESSON_UNITS, "not-a-real-lesson"),
    ).toBeNull();
  });

  it("calculates knowledge-check scores from server-held answer keys", () => {
    const lesson = LESSON_UNITS.find((unit) => unit.knowledgeCheck.length > 0);
    expect(lesson).toBeDefined();
    if (!lesson) return;

    const correctAnswers = lesson.knowledgeCheck.map(
      (question) => question.correctIndex,
    );
    const result = calculateKnowledgeCheckScore(lesson, correctAnswers);

    expect(result.total).toBe(lesson.knowledgeCheck.length);
    expect(result.correct).toBe(lesson.knowledgeCheck.length);
    expect(result.score).toBe(100);
  });

  it("rejects incomplete knowledge-check answer sets", () => {
    const lesson = LESSON_UNITS.find((unit) => unit.knowledgeCheck.length > 0);
    expect(lesson).toBeDefined();
    if (!lesson) return;

    expect(() => calculateKnowledgeCheckScore(lesson, [])).toThrow(
      /Expected .* knowledge-check answers/,
    );
  });

  it("keeps every production lesson at the strengthened depth and assessment baseline", () => {
    expect(LESSON_UNITS).toHaveLength(105);
    for (const lesson of LESSON_UNITS) {
      expect(
        meaningfulWordCount(lesson.content),
        `${lesson.slug} must retain meaningful teaching depth`,
      ).toBeGreaterThanOrEqual(500);
      expect(
        lesson.knowledgeCheck.length,
        `${lesson.slug} must retain at least three knowledge checks`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        [lesson.title, lesson.content, lesson.safetyNote].join("\n"),
        `${lesson.slug} must not imply external accreditation`,
      ).not.toMatch(/\b(BHS|Pony Club)\b/i);
      if (highRiskTopic.test([lesson.title, lesson.content].join("\n"))) {
        expect(
          lesson.safetyNote,
          `${lesson.slug} must retain its professional escalation boundary`,
        ).toMatch(professionalBoundary);
      }
    }
  });

  it("flags shallow lesson records for content-depth review", () => {
    const source = LESSON_UNITS.find((unit) => unit.knowledgeCheck.length > 0);
    expect(source).toBeDefined();
    if (!source) return;
    const shallow = {
      ...source,
      content: "Too short",
      objectives: ["One objective"],
      keyPoints: ["One key point"],
      knowledgeCheck: [source.knowledgeCheck[0]],
    };
    const audit = auditAcademyCurriculum(
      LESSON_PATHWAYS,
      [shallow],
      "test-run",
    );
    expect(audit.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "SHALLOW_CONTENT_REVIEW_REQUIRED",
        "LIMITED_OBJECTIVES_REVIEW_REQUIRED",
        "LIMITED_KEY_POINTS_REVIEW_REQUIRED",
        "LIMITED_KNOWLEDGE_CHECK_REVIEW_REQUIRED",
      ]),
    );
  });
});
