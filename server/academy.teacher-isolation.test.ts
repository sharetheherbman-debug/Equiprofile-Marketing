import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

function procedureSection(source: string, procedure: string, nextProcedure: string) {
  const start = source.indexOf(`${procedure}: teacherProcedure`);
  const end = source.indexOf(`${nextProcedure}: teacherProcedure`, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return source.slice(start, end);
}

describe("Academy teacher/student isolation boundaries", () => {
  it("guards direct teacher targets through active owned-group membership", () => {
    const teacher = read("server/teacherRouter.ts");

    expect(teacher).toContain("requireTeacherOwnedActiveGroup");
    expect(teacher).toContain("requireTeacherStudentMembership");
    expect(teacher).toContain("eq(studentGroups.isActive, true)");
    expect(teacher).toContain("Student is not in your active groups.");
    expect(teacher).toContain(
      "Provide exactly one of studentUserId or groupId",
    );

    for (const [procedure, nextProcedure] of [
      ["assignTask", "listAssignedTasksByTeacher"],
      ["assignLesson", "listLessonAssignments"],
      ["sendMessage", "getThreadMessages"],
      ["getThreadMessages", "getUnreadCounts"],
      ["createAssignment", "listTeacherAssignments"],
      ["createStudentReport", "listStudentReports"],
    ] as const) {
      expect(procedureSection(teacher, procedure, nextProcedure)).toContain(
        "requireTeacherStudentMembership",
      );
    }
  });

  it("scopes teacher resources to authorised group or student targets and delivery relationships", () => {
    const teacher = read("server/teacherRouter.ts");
    const student = read("server/studentRouter.ts");
    const resourceCreation = procedureSection(
      teacher,
      "createResource",
      "listResources",
    );
    const start = student.indexOf("listSharedResources: studentProcedure");
    const end = student.indexOf("// STUDENT REPORTS", start);
    const resourceDelivery = student.slice(start, end);

    expect(resourceCreation).toContain("requireTeacherOwnedActiveGroup");
    expect(resourceCreation).toContain("requireTeacherStudentMembership");
    expect(resourceCreation).toContain("All-scope resources cannot include");
    expect(resourceDelivery).toContain(
      "eq(studentGroups.isActive, true)",
    );
    expect(resourceDelivery).toContain(
      "inArray(teacherResources.teacherId, teacherIds)",
    );
    expect(resourceDelivery).not.toContain(
      "eq(teacherResources.shareScope, \"all\"),\n      and(",
    );
  });
});
