import cron from "node-cron";
import * as db from "../db";
import {
  getWhatsAppConfig,
  sendWhatsAppMessage,
  formatDateForWhatsApp,
  userHasWhatsAppEnabled,
} from "./whatsapp";

/**
 * EquiProfile core reminder scheduler.
 *
 * This scheduler is intentionally limited to EquiProfile product reminders.
 * Legacy embedded Marketing campaign follow-ups, outreach windows, reply
 * polling, contact scans and campaign autopilot have been removed from this
 * runtime. Marketing execution belongs to the standalone EquiProfile Marketing
 * application and must not run from the EquiProfile customer application.
 */

let isRunning = false;

export function startReminderScheduler() {
  if (isRunning) {
    console.log("[Reminders] Scheduler already running");
    return;
  }

  console.log("[Reminders] Starting EquiProfile core reminder scheduler...");

  // Run every hour at minute 0.
  cron.schedule("0 * * * *", async () => {
    console.log("[Reminders] Checking for due EquiProfile reminders...");

    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Event reminders.
      const dueReminders = await db.getDueEventReminders(tomorrow);
      console.log(`[Reminders] Found ${dueReminders.length} due reminders`);

      for (const reminder of dueReminders) {
        try {
          const event = await db.getEventById(reminder.eventId);
          if (!event) {
            await db.markEventReminderSent(reminder.id);
            console.log(
              `[Reminders] Skipped orphaned reminder ${reminder.id} (event deleted) — marked as sent`,
            );
            continue;
          }

          const user = await db.getUserById(event.userId);
          if (!user || !user.email) {
            console.log(`[Reminders] User not found for event ${event.id}`);
            continue;
          }

          const emailModule = await import("./email");
          await emailModule.sendReminderEmail(
            user.email,
            user.name || "there",
            event.title,
            event.description || "",
            new Date(event.startDate),
            undefined,
          );

          const waConfig = await getWhatsAppConfig();
          if (
            waConfig.enabled &&
            userHasWhatsAppEnabled(user.preferences || null)
          ) {
            const phone = user.phone;
            if (phone) {
              const hoursUntil = Math.round(
                (new Date(event.startDate).getTime() - now.getTime()) /
                  (1000 * 60 * 60),
              );
              const timeLabel =
                hoursUntil <= 1 ? "1 hour" : `${hoursUntil} hours`;
              await sendWhatsAppMessage({
                to: phone,
                template: "event_reminder",
                parameters: [
                  user.name || "there",
                  event.title,
                  formatDateForWhatsApp(new Date(event.startDate)),
                  timeLabel,
                ],
              });
            }
          }

          await db.markEventReminderSent(reminder.id);
          console.log(
            `[Reminders] Sent reminder ${reminder.id} to ${user.email}`,
          );
        } catch (error) {
          console.error(
            `[Reminders] Failed to send reminder ${reminder.id}:`,
            error,
          );
        }
      }

      // Trial-ending account reminders (daily at 09:00 UTC).
      const TRIAL_REMINDER_LOOKAHEAD_DAYS = 3;
      if (now.getUTCHours() === 9) {
        try {
          const trialUsers = await db.getTrialsEndingSoon(
            TRIAL_REMINDER_LOOKAHEAD_DAYS,
          );
          const emailModule = await import("./email");

          for (const user of trialUsers) {
            if (!user.email || !user.trialEndsAt) continue;
            const daysLeft = Math.max(
              0,
              Math.ceil(
                (user.trialEndsAt.getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
            );

            if (daysLeft <= 2) {
              await emailModule
                .sendTrialReminderEmail(user, daysLeft)
                .catch((err: unknown) =>
                  console.error(
                    `[Reminders] Failed to send trial reminder to ${user.email}:`,
                    err,
                  ),
                );
              console.log(
                `[Reminders] Sent trial reminder (${daysLeft}d left) to ${user.email}`,
              );
            }
          }
        } catch (error) {
          console.error("[Reminders] Error checking trial reminders:", error);
        }
      }

      console.log("[Reminders] EquiProfile reminder check complete");
    } catch (error) {
      console.error("[Reminders] Error checking reminders:", error);
    }
  });

  isRunning = true;
  console.log("[Reminders] EquiProfile core scheduler started successfully");
}

export function stopReminderScheduler() {
  // node-cron task handles are not retained in this legacy scheduler wrapper.
  // Process shutdown stops the scheduled task; this flag prevents duplicate
  // registration during the current process lifetime.
  isRunning = false;
  console.log("[Reminders] Scheduler stopped");
}
