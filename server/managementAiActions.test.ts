import { beforeEach, describe, expect, test, vi } from "vitest";

const { createTask, getHorseById, logActivity, getDb, getUserActivityLogs } = vi.hoisted(() => ({
  createTask: vi.fn(),
  getHorseById: vi.fn(),
  logActivity: vi.fn(),
  getDb: vi.fn(),
  getUserActivityLogs: vi.fn(),
}));

vi.mock("./db", () => ({ createTask, getHorseById, logActivity, getDb, getUserActivityLogs }));

import { executeManagementAiAction } from "./managementAiActions";

describe("governed Management AI actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getHorseById.mockResolvedValue({ id: 5, userId: 44 });
    createTask.mockResolvedValue(101);
    logActivity.mockResolvedValue(undefined);
    getUserActivityLogs.mockResolvedValue([]);
  });

  test("returns a proposal without mutating data until the user confirms", async () => {
    const result = await executeManagementAiAction({ userId: 44, confirmed: false, action: { type: "CREATE_TASK", title: "Farrier booking" } });
    expect(result).toMatchObject({ status: "proposed", type: "CREATE_TASK" });
    expect(createTask).not.toHaveBeenCalled();
  });

  test("creates a validated owned-horse task only after confirmation", async () => {
    const result = await executeManagementAiAction({ userId: 44, confirmed: true, action: { type: "CREATE_TASK", title: "Apollo farrier visit", horseId: 5, taskType: "hoofcare", dueDate: "2026-09-04T09:00:00.000Z" } });
    expect(getHorseById).toHaveBeenCalledWith(5, 44);
    expect(createTask).toHaveBeenCalledWith(expect.objectContaining({ userId: 44, horseId: 5, taskType: "hoofcare", status: "pending" }));
    expect(result).toMatchObject({ status: "completed", id: 101, type: "CREATE_TASK" });
  });

  test("maps a confirmed reminder to the existing task/reminder fields and audit log", async () => {
    const result = await executeManagementAiAction({ userId: 44, confirmed: true, action: { type: "CREATE_REMINDER", title: "Book dentist", dueDate: "2026-09-10T09:00:00.000Z", reminderDays: 3 } });
    expect(createTask).toHaveBeenCalledWith(expect.objectContaining({ taskType: "general_care", reminderDays: 3, status: "pending" }));
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: "ai_reminder_created", entityType: "task" }));
    expect(result).toMatchObject({ status: "completed", type: "CREATE_REMINDER" });
  });

  test("creates a confirmed calendar item through the existing event model", async () => {
    const insert = vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue([{ insertId: 303 }]) });
    getDb.mockResolvedValue({ insert });
    const result = await executeManagementAiAction({ userId: 44, confirmed: true, action: { type: "CREATE_CALENDAR_ITEM", title: "Apollo farrier", horseId: 5, eventType: "farrier", startDate: "2026-09-04T09:00:00.000Z" } });
    expect(insert).toHaveBeenCalled();
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ action: "ai_calendar_item_created", entityType: "event", entityId: 303 }));
    expect(result).toMatchObject({ status: "completed", id: 303, type: "CREATE_CALENDAR_ITEM" });
  });

  test("rejects an unowned horse and makes no mutation", async () => {
    getHorseById.mockResolvedValue(undefined);
    await expect(executeManagementAiAction({ userId: 44, confirmed: true, action: { type: "CREATE_TASK", title: "Forbidden", horseId: 99 } })).rejects.toThrow("not available in your workspace");
    expect(createTask).not.toHaveBeenCalled();
  });

  test("treats a repeated confirmation key as the same completed action", async () => {
    getUserActivityLogs.mockResolvedValue([{ action: "ai_task_created", entityId: 101, details: JSON.stringify({ idempotencyKey: "proposal-123456789" }) }]);
    const result = await executeManagementAiAction({ userId: 44, confirmed: true, idempotencyKey: "proposal-123456789", action: { type: "CREATE_TASK", title: "Farrier booking" } });
    expect(result).toMatchObject({ status: "completed", id: 101, message: expect.stringContaining("already saved") });
    expect(createTask).not.toHaveBeenCalled();
  });
});
