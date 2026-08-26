import { z } from "zod";
import * as db from "./db";
import { getDb } from "./db";
import { events } from "../drizzle/schema";

const horseId = z.number().int().positive().optional();
const taskKinds = z.enum(["hoofcare", "health_appointment", "treatment", "vaccination", "deworming", "dental", "general_care", "training", "feeding", "other"]);
const priorities = z.enum(["low", "medium", "high", "urgent"]);

export const managementAiActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("CREATE_TASK"), title: z.string().min(1).max(200), description: z.string().max(10000).optional(), horseId, taskType: taskKinds.default("general_care"), priority: priorities.default("medium"), dueDate: z.string().datetime().optional() }),
  z.object({ type: z.literal("CREATE_REMINDER"), title: z.string().min(1).max(200), description: z.string().max(10000).optional(), horseId, dueDate: z.string().datetime(), reminderDays: z.number().int().min(0).max(30).default(1) }),
  z.object({ type: z.literal("CREATE_CALENDAR_ITEM"), title: z.string().min(1).max(200), description: z.string().max(10000).optional(), horseId, eventType: z.enum(["training", "competition", "veterinary", "farrier", "lesson", "meeting", "other"]).default("other"), startDate: z.string().datetime(), endDate: z.string().datetime().optional(), location: z.string().max(500).optional(), isAllDay: z.boolean().default(false) }),
]);

export type ManagementAiAction = z.infer<typeof managementAiActionSchema>;
export type ManagementAiActionResult = { status: "proposed" | "completed"; type: ManagementAiAction["type"]; id?: number; message: string };

async function assertHorseOwnership(userId: number, selectedHorseId?: number) {
  if (!selectedHorseId) return;
  const horse = await db.getHorseById(selectedHorseId, userId);
  if (!horse) throw new Error("Selected horse is not available in your workspace.");
}

/**
 * This executor is intentionally deterministic: an LLM may propose a typed
 * action, but only the authenticated server validates and persists it after an
 * explicit user confirmation. No free-form SQL, arbitrary tools, or fabricated
 * completion path is available.
 */
export async function executeManagementAiAction(input: { userId: number; confirmed: boolean; action: unknown; idempotencyKey?: string }): Promise<ManagementAiActionResult> {
  const action = managementAiActionSchema.parse(input.action);
  if (!input.confirmed) return { status: "proposed", type: action.type, message: "Review the proposed action and confirm it before anything is saved." };
  const idempotencyKey = String(input.idempotencyKey || "").trim().slice(0, 200);
  if (idempotencyKey) {
    const prior = (await db.getUserActivityLogs(input.userId, 100)).find((entry) => {
      if (!["ai_task_created", "ai_reminder_created", "ai_calendar_item_created"].includes(String(entry.action))) return false;
      try { return (JSON.parse(String(entry.details || "{}")) as { idempotencyKey?: string }).idempotencyKey === idempotencyKey; }
      catch { return false; }
    });
    if (prior) return { status: "completed", type: action.type, id: prior.entityId || undefined, message: "This confirmed action was already saved." };
  }
  await assertHorseOwnership(input.userId, action.horseId);

  if (action.type === "CREATE_TASK" || action.type === "CREATE_REMINDER") {
    const isReminder = action.type === "CREATE_REMINDER";
    const id = await db.createTask({
      userId: input.userId,
      horseId: action.horseId,
      title: action.title,
      description: action.description,
      taskType: isReminder ? "general_care" : action.taskType,
      priority: isReminder ? "medium" : action.priority,
      status: "pending",
      dueDate: action.dueDate ? new Date(action.dueDate) : undefined,
      reminderDays: isReminder ? action.reminderDays : 1,
      isRecurring: false,
    });
    await db.logActivity({ userId: input.userId, action: isReminder ? "ai_reminder_created" : "ai_task_created", entityType: "task", entityId: id, details: JSON.stringify({ idempotencyKey: idempotencyKey || null, actionType: action.type }) });
    return { status: "completed", type: action.type, id, message: isReminder ? "Reminder created." : "Task created." };
  }

  const drizzle = await getDb();
  if (!drizzle) throw new Error("Calendar service is unavailable.");
  const startDate = new Date(action.startDate);
  const result = await drizzle.insert(events).values({
    userId: input.userId,
    title: action.title,
    description: action.description,
    horseId: action.horseId,
    eventType: action.eventType,
    startDate,
    endDate: action.endDate ? new Date(action.endDate) : null,
    location: action.location,
    isAllDay: action.isAllDay,
  });
  const id = Number(result[0].insertId);
  await db.logActivity({ userId: input.userId, action: "ai_calendar_item_created", entityType: "event", entityId: id, details: JSON.stringify({ idempotencyKey: idempotencyKey || null, actionType: action.type }) });
  return { status: "completed", type: action.type, id, message: "Calendar item created." };
}
