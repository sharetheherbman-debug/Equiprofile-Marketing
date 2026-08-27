import { describe, expect, test } from "vitest";
import { normalizeManagementAiProviderResponse, unavailableManagementAiResponse } from "./managementAiChatResponse";

describe("Management AI provider response contract", () => {
  test("returns a clean available response for a configured valid provider payload", () => {
    expect(normalizeManagementAiProviderResponse({ choices: [{ message: { content: " Apollo has a farrier task due Friday. " } }] })).toEqual({
      role: "assistant", status: "available", content: "Apollo has a farrier task due Friday.",
    });
  });

  test("fails closed for malformed or empty provider payloads without configuration leakage", () => {
    for (const payload of [{}, { choices: [] }, { choices: [{ message: { content: "  " } }] }]) {
      const result = normalizeManagementAiProviderResponse(payload);
      expect(result.status).toBe("unavailable");
      expect(result.content).toContain("incomplete response");
      expect(result.content).not.toMatch(/GENX|API[_ ]?KEY|https?:\/\//i);
    }
  });

  test("represents provider timeout or error with a safe unavailable state", () => {
    const result = unavailableManagementAiResponse();
    expect(result).toMatchObject({ role: "assistant", status: "unavailable" });
    expect(result.content).toContain("could not be reached");
    expect(result.content).toContain("no records or reminders were changed");
  });

  test("extracts a strictly validated action proposal without executing it", () => {
    const response = normalizeManagementAiProviderResponse({ choices: [{ message: { content: JSON.stringify({ assistant_text: "I can prepare Bella's farrier reminder for Friday. Confirm to save it.", proposed_action: { type: "CREATE_REMINDER", title: "Book Bella's farrier", horseId: 5, dueDate: "2026-08-28T09:00:00.000Z", reminderDays: 1 } }) } }] });
    expect(response.proposedAction).toMatchObject({ type: "CREATE_REMINDER", horseId: 5 });
    expect(response.content).toContain("Confirm");
  });

  test("malformed action JSON becomes non-executable explanatory text", () => {
    const response = normalizeManagementAiProviderResponse({ choices: [{ message: { content: JSON.stringify({ assistant_text: "I tried to prepare that.", proposed_action: { type: "RUN_SQL", sql: "DELETE FROM horses" } }) } }] });
    expect(response.proposedAction).toBeUndefined();
    expect(response.content).toContain("nothing can be confirmed or saved");
  });
});
