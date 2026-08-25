import { and, eq } from "drizzle-orm";
import { growthOnboardingFlows } from "../drizzle/schema";

export const ONBOARDING_TYPES = [
  "horse_owner",
  "stable",
  "school",
  "teacher",
] as const;

export type OnboardingType = (typeof ONBOARDING_TYPES)[number];

type OnboardingStatus = "not_started" | "in_progress" | "completed" | "skipped";

type OnboardingInput = {
  userId: number;
  tenantId: string;
  onboardingType: OnboardingType;
  status: OnboardingStatus;
  step: number;
  progressPercent: number;
  checklist: Record<string, boolean>;
  quickWins: string[];
};

type OnboardingDb = Awaited<ReturnType<typeof import("./db")["getDb"]>>;

async function resolveDb(): Promise<OnboardingDb> {
  const dbModule = await import("./db");
  if ("getDb" in dbModule && typeof dbModule.getDb === "function") {
    return dbModule.getDb();
  }
  return null;
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function startOnboardingFlow(input: OnboardingInput) {
  const db = await resolveDb();
  if (!db) return null;

  const [existing] = await db
    .select()
    .from(growthOnboardingFlows)
    .where(
      and(
        eq(growthOnboardingFlows.userId, input.userId),
        eq(growthOnboardingFlows.tenantId, input.tenantId),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(growthOnboardingFlows)
      .set({
        onboardingType: input.onboardingType,
        status: input.status,
        step: input.step,
        progressPercent: input.progressPercent,
        checklistJson: JSON.stringify(input.checklist ?? {}),
        quickWinsJson: JSON.stringify(input.quickWins ?? []),
        completedAt:
          input.status === "completed" ? new Date() : existing.completedAt,
        updatedAt: new Date(),
      })
      .where(eq(growthOnboardingFlows.id, existing.id));
    return { ...existing, ...input };
  }

  const result = await db.insert(growthOnboardingFlows).values({
    userId: input.userId,
    tenantId: input.tenantId,
    onboardingType: input.onboardingType,
    status: input.status,
    step: input.step,
    progressPercent: input.progressPercent,
    checklistJson: JSON.stringify(input.checklist ?? {}),
    quickWinsJson: JSON.stringify(input.quickWins ?? []),
    completedAt: input.status === "completed" ? new Date() : null,
  });

  return { id: result[0].insertId, ...input };
}

export async function getOnboardingFlow(userId: number, tenantId: string) {
  const db = await resolveDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(growthOnboardingFlows)
    .where(
      and(
        eq(growthOnboardingFlows.userId, userId),
        eq(growthOnboardingFlows.tenantId, tenantId),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    userId: row.userId,
    tenantId: row.tenantId,
    onboardingType: row.onboardingType as OnboardingType,
    status: row.status,
    step: row.step,
    progressPercent: row.progressPercent,
    checklist: parseJson<Record<string, boolean>>(row.checklistJson, {}),
    quickWins: parseJson<string[]>(row.quickWinsJson, []),
    completedAt: row.completedAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
  };
}
