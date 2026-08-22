import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required. This command is read-only.");
  process.exit(2);
}

const required: Record<string, string[]> = {
  users: [
    "id",
    "openId",
    "role",
    "subscriptionStatus",
    "subscriptionPlan",
    "stripeCustomerId",
    "stripeSubscriptionId",
    "trialEndsAt",
    "preferences",
    "isSuspended",
    "createdAt",
  ],
  horses: ["id", "userId", "name", "isActive"],
  healthRecords: ["id", "horseId", "userId", "recordType", "recordDate"],
  trainingSessions: ["id", "horseId", "userId", "sessionDate", "sessionType"],
  feedingPlans: ["id", "horseId", "userId", "feedType", "mealTime", "isActive"],
  documents: ["id", "userId", "fileName", "fileUrl", "fileKey"],
  events: ["id", "userId", "title", "eventType", "startDate"],
  stables: ["id", "name", "ownerId", "isActive"],
  stableMembers: ["id", "stableId", "userId", "role", "isActive"],
  stripeEvents: ["id", "eventId", "eventType", "processed"],
  systemSettings: ["id", "settingKey", "settingValue"],
  adminSessions: ["id", "userId", "expiresAt"],
  activityLogs: ["id", "action", "createdAt"],
};

const conn = await mysql.createConnection(databaseUrl);
try {
  const [[schemaRow]] = await conn.query<Array<{ schemaName: string }>>(
    "SELECT DATABASE() AS schemaName",
  );
  const schemaName = schemaRow?.schemaName;
  if (!schemaName) throw new Error("DATABASE_URL has no selected database");

  const [tableRows] = await conn.query<Array<{ tableName: string }>>(
    "SELECT TABLE_NAME AS tableName FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME",
    [schemaName],
  );
  const tables = new Set(tableRows.map((row) => row.tableName));
  const missingTables = Object.keys(required).filter((table) => !tables.has(table));
  const missingColumns: string[] = [];

  for (const [table, columns] of Object.entries(required)) {
    if (!tables.has(table)) continue;
    const [columnRows] = await conn.query<Array<{ columnName: string }>>(
      "SELECT COLUMN_NAME AS columnName FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
      [schemaName, table],
    );
    const actualColumns = new Set(columnRows.map((row) => row.columnName));
    for (const column of columns) {
      if (!actualColumns.has(column)) missingColumns.push(`${table}.${column}`);
    }
  }

  const trackingPresent = tables.has("__drizzle_migrations");
  let trackedMigrationCount = 0;
  let latestTrackedCreatedAt: number | null = null;
  if (trackingPresent) {
    const [[row]] = await conn.query<
      Array<{ countValue: number; latestCreatedAt: number | null }>
    >(
      "SELECT COUNT(*) AS countValue, MAX(created_at) AS latestCreatedAt FROM __drizzle_migrations",
    );
    trackedMigrationCount = Number(row?.countValue ?? 0);
    latestTrackedCreatedAt =
      row?.latestCreatedAt == null ? null : Number(row.latestCreatedAt);
  }

  const ready = missingTables.length === 0 && missingColumns.length === 0;
  const result = {
    mode: "READ_ONLY",
    release: "management-only-2026-08-22",
    database: schemaName,
    ready,
    mutationRequiredByThisRelease: false,
    migrationTracking: {
      present: trackingPresent,
      appliedCount: trackedMigrationCount,
      latestCreatedAt: latestTrackedCreatedAt,
    },
    requiredSurface: {
      tablesChecked: Object.keys(required).length,
      missingTables,
      missingColumns,
    },
    observedTableCount: tableRows.length,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exitCode = ready ? 0 : 2;
} finally {
  await conn.end();
}
