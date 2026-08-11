import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const scheduler = readFileSync(
  resolve(process.cwd(), "server/_core/reminderScheduler.ts"),
  "utf8",
);

describe("EquiProfile reminder scheduler boundary", () => {
  it("retains EquiProfile event and trial reminders", () => {
    expect(scheduler).toContain("getDueEventReminders");
    expect(scheduler).toContain("sendReminderEmail");
    expect(scheduler).toContain("sendTrialReminderEmail");
    expect(scheduler).toContain("sendWhatsAppMessage");
  });

  it("does not contain legacy embedded Marketing automation", () => {
    for (const forbidden of [
      "CampaignFollowUp",
      "CampaignOutreach",
      "CampaignReplies",
      "CampaignAutopilot",
      "campaignReplyFetcher",
      "marketingContacts",
      "campaignSequences",
      "emailCampaignRecipients",
      "SEND_WINDOWS",
      "NEW_OUTREACH_DAILY_CAP",
    ]) {
      expect(scheduler).not.toContain(forbidden);
    }
  });
});
