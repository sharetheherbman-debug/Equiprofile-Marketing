export type ManagementAiChatResponse = { role: "assistant"; status: "available" | "unavailable"; content: string };

/** Converts the existing LLM abstraction result into an honest UI contract. */
export function normalizeManagementAiProviderResponse(value: unknown): ManagementAiChatResponse {
  const response = value as { choices?: Array<{ message?: { content?: unknown } }> };
  const content = response?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    return {
      role: "assistant",
      status: "unavailable",
      content: "The AI service returned an incomplete response. Please try again shortly; no records or reminders were changed.",
    };
  }
  return { role: "assistant", status: "available", content: content.trim() };
}

export function unavailableManagementAiResponse(): ManagementAiChatResponse {
  return {
    role: "assistant",
    status: "unavailable",
    content: "The AI assistant could not be reached just now. Please try again shortly; no records or reminders were changed.",
  };
}
