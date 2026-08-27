import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const compactWhitespace = (value: string) => value.replace(/\s+/g, " ");

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

  it("withholds unreviewed static practice scenarios across server, UI, and offline-cache boundaries", () => {
    const router = read("server/studentRouter.ts");
    const start = router.indexOf("// ── Scenario Training");
    const end = router.indexOf("// ── Training Log", start);
    const scenarioProcedures = router.slice(start, end);
    const dashboard = read("client/src/pages/StudentDashboard.tsx");
    const serviceWorker = read("client/public/service-worker.js");

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(scenarioProcedures).toContain(
      "intentionally withheld. Their embedded learner",
    );
    expect(scenarioProcedures).toContain(".query(() => [])");
    expect(scenarioProcedures).toContain("PRECONDITION_FAILED");
    expect(scenarioProcedures).toContain(
      "withheld_pending_factual_and_safety_review",
    );
    expect(scenarioProcedures).not.toContain("SCENARIO_DATA.find");
    expect(scenarioProcedures).not.toContain("SCENARIO_DATA.filter");
    expect(compactWhitespace(dashboard)).toContain(
      "Static daily scenarios are withheld while their factual and safety review is completed.",
    );
    expect(serviceWorker).not.toContain("/api/trpc/student.getDailyScenarios");
    expect(serviceWorker).toContain("academy-scenarios-withheld-20260822");
  });

  it("withholds unreviewed virtual-horse task templates without deleting stored task history", () => {
    const router = read("server/studentRouter.ts");
    const start = router.indexOf("// Virtual Horse Daily Task Engine");
    const end = router.indexOf("// STUDENT MESSAGING", start);
    const taskEngine = router.slice(start, end);
    const dashboard = read("client/src/pages/StudentDashboard.tsx");

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(router).toContain("isWithheldLegacyVirtualHorseTask");
    expect(router).toContain(
      "return tasks.filter((task) => !isWithheldLegacyVirtualHorseTask(task));",
    );
    expect(taskEngine).toContain(
      "Legacy template prompts are intentionally withheld",
    );
    expect(router).toContain("withheld_pending_factual_and_safety_review");
    expect(taskEngine).toContain("PRECONDITION_FAILED");
    expect(taskEngine).not.toContain("TASK_POOLS");
    expect(taskEngine).not.toContain("insert(studentTasks).values");
    expect(compactWhitespace(dashboard)).toContain(
      "Virtual-horse task templates withheld",
    );
    expect(dashboard).not.toContain(
      "trpc.student.generateDailyTasks.useMutation",
    );
    expect(dashboard).not.toContain(
      "trpc.student.toggleTaskEngine.useMutation",
    );
  });

  it("withholds legacy Study Hub defaults without deleting non-legacy persisted topics", () => {
    const router = read("server/studentRouter.ts");
    const dashboard = read("client/src/pages/StudentDashboard.tsx");
    const start = router.indexOf("// ── Study Hub");
    const end = router.indexOf("// ── AI Tutor", start);
    const studyHub = router.slice(start, end);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(router).toContain("WITHHELD_LEGACY_STUDY_TOPIC_SLUGS");
    expect(studyHub).not.toContain(
      "insert(studyTopics).values(DEFAULT_STUDY_TOPICS)",
    );
    expect(studyHub).toContain(
      "!WITHHELD_LEGACY_STUDY_TOPIC_SLUGS.has(topic.slug)",
    );
    expect(studyHub).toContain("PRECONDITION_FAILED");
    expect(compactWhitespace(dashboard)).toContain(
      "Legacy Study Hub topics are withheld pending factual and safety review.",
    );
  });
});
