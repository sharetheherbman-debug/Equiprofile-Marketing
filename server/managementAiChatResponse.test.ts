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
});
