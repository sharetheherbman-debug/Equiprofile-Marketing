export type ManagementWorkspaceSnapshotInput = {
  horses: Array<Record<string, unknown>>;
  dueCare: Array<Record<string, unknown>>;
  dueTasks: Array<Record<string, unknown>>;
  recentTraining: Array<Record<string, unknown>>;
};

function compact(value: unknown, limit = 180): string {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, limit);
}

/**
 * Serializes only records already fetched through the authenticated user scope.
 * It is deliberately a data-only snapshot: no model call, write action, or
 * hidden cross-user lookup is possible at this boundary.
 */
export function buildSignedInManagementWorkspaceSnapshot(input: ManagementWorkspaceSnapshotInput) {
  return {
    horses: input.horses.slice(0, 30).map((horse) => ({
      id: horse.id,
      name: compact(horse.name, 80),
      breed: compact(horse.breed, 60),
      status: compact(horse.status, 40),
    })),
    care_due_next_14_days: input.dueCare.slice(0, 30).map((record) => ({
      horse_id: record.horseId,
      type: compact(record.recordType || record.type, 60),
      due: record.nextDueDate ? new Date(String(record.nextDueDate)).toISOString().slice(0, 10) : null,
    })),
    tasks_due_next_14_days: input.dueTasks.slice(0, 30).map((task) => ({
      title: compact(task.title, 120),
      due: task.dueDate ? new Date(String(task.dueDate)).toISOString().slice(0, 10) : null,
      priority: compact(task.priority, 30),
      status: compact(task.status, 30),
    })),
    recent_training: input.recentTraining.slice(0, 20).map((session) => ({
      horse_id: session.horseId,
      date: session.sessionDate ? new Date(String(session.sessionDate)).toISOString().slice(0, 10) : null,
      type: compact(session.sessionType || session.type, 60),
      notes: compact(session.notes, 180),
    })),
  };
}
