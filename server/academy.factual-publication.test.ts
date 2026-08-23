import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FACTUALLY_ACCEPTED_ACADEMY_LESSON_SLUGS } from "./academy/factualAcceptance";

describe("Academy factual publication boundary", () => {
  const register = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "docs",
        "academy",
        "lesson-factual-evidence-register.json",
      ),
      "utf8",
    ),
  ) as {
    summary: { sourceMappedRequiresSpecificClaimReview: number };
    lessons: Array<{ lessonSlug: string; reviewStatus: string }>;
  };

  it("publishes exactly the lessons accepted by the binding evidence register", () => {
    const expected = register.lessons
      .filter(
        (lesson) =>
          lesson.reviewStatus === "CLAIM_REVIEWED_AND_ACCEPTED" ||
          lesson.reviewStatus === "NOT_MATERIAL_FACT_CHECK_REQUIRED",
      )
      .map((lesson) => lesson.lessonSlug)
      .sort();
    expect([...FACTUALLY_ACCEPTED_ACADEMY_LESSON_SLUGS].sort()).toEqual(
      expected,
    );
  });

  it("withholds every lesson that still requires a specific claim review", () => {
    const unresolved = register.lessons.filter(
      (lesson) =>
        lesson.reviewStatus === "SOURCE_MAPPED_REQUIRES_SPECIFIC_CLAIM_REVIEW",
    );
    expect(unresolved).toHaveLength(
      register.summary.sourceMappedRequiresSpecificClaimReview,
    );
    for (const lesson of unresolved) {
      expect(
        FACTUALLY_ACCEPTED_ACADEMY_LESSON_SLUGS.has(lesson.lessonSlug),
        lesson.lessonSlug,
      ).toBe(false);
    }
  });
});
