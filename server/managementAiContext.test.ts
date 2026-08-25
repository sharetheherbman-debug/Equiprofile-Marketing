import { describe, expect, test } from "vitest";
import { buildSignedInManagementWorkspaceSnapshot } from "./managementAiContext";

describe("Management AI signed-in workspace snapshot", () => {
  test("contains only records supplied by the signed-in user-scoped queries", () => {
    const aliceSnapshot = buildSignedInManagementWorkspaceSnapshot({
      horses: [{ id: 101, name: "Alice's Atlas", breed: "Warmblood", status: "active" }],
      dueCare: [{ horseId: 101, recordType: "vaccination", nextDueDate: "2026-09-02T00:00:00.000Z" }],
      dueTasks: [{ title: "Alice's farrier check", dueDate: "2026-09-03T00:00:00.000Z", priority: "high", status: "pending" }],
      recentTraining: [{ horseId: 101, sessionDate: "2026-08-24T00:00:00.000Z", sessionType: "flatwork", notes: "Alice-only notes" }],
    });

    const serialized = JSON.stringify(aliceSnapshot);
    expect(serialized).toContain("Alice's Atlas");
    expect(serialized).toContain("Alice-only notes");
    expect(serialized).not.toContain("Bob's Comet");
    expect(serialized).not.toContain("Bob confidential veterinary note");
  });

  test("keeps the prompt payload bounded without changing record ownership", () => {
    const snapshot = buildSignedInManagementWorkspaceSnapshot({
      horses: Array.from({ length: 35 }, (_, index) => ({ name: `Horse ${index}`, breed: "Warmblood", status: "active" })),
      dueCare: Array.from({ length: 35 }, (_, index) => ({ horseId: index, recordType: "care", nextDueDate: "2026-09-01T00:00:00.000Z" })),
      dueTasks: Array.from({ length: 35 }, (_, index) => ({ title: `Task ${index}`, dueDate: "2026-09-01T00:00:00.000Z", priority: "normal", status: "pending" })),
      recentTraining: Array.from({ length: 25 }, (_, index) => ({ horseId: index, sessionDate: "2026-08-01T00:00:00.000Z", sessionType: "training", notes: "n".repeat(300) })),
    });

    expect(snapshot.horses).toHaveLength(30);
    expect(snapshot.care_due_next_14_days).toHaveLength(30);
    expect(snapshot.tasks_due_next_14_days).toHaveLength(30);
    expect(snapshot.recent_training).toHaveLength(20);
    expect(snapshot.recent_training[0]?.notes).toHaveLength(180);
  });
});
