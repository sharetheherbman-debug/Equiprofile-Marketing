import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

describe("Academy curriculum and Tutor boundaries", () => {
  it("does not keep a second React-side lesson-slug curriculum map", () => {
    const dashboard = read("client/src/pages/StudentDashboard.tsx");
    expect(dashboard).not.toContain("LEVEL_PATHWAY_ITEMS");
    expect(dashboard).toContain("currentLevelProgress");
  });

  it("uses original Academy Tutor framing and a server-resolved lesson context", () => {
    const router = read("server/studentRouter.ts");
    expect(router).not.toContain("BHS/Pony Club");
    expect(router).not.toContain("gpt-4o-mini");
    expect(router).toContain(
      "lessonSlug: z.string().min(1).max(150).optional()",
    );
    expect(router).toContain("getPublishedLessonBySlug(input.lessonSlug)");
    expect(router).toContain(
      "Never claim a learner has completed a lesson or passed a competency",
    );
    expect(router).toContain(
      "contact a veterinarian or emergency professional promptly",
    );
  });

  it("documents source-retirement without learner-history deletion", () => {
    const pipeline = read("server/academy/curriculumPipeline.ts");
    expect(pipeline).toContain("retiredLessons");
    expect(pipeline).toContain("isPublished: false");
    expect(pipeline).toContain(
      "never deletes rows or learner-completion history",
    );
  });
});
