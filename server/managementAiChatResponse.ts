import { managementAiActionSchema, type ManagementAiAction } from "./managementAiActions";

export type ManagementAiChatResponse = { role: "assistant"; status: "available" | "unavailable"; content: string; proposedAction?: ManagementAiAction };

function structuredProposal(content: string): { content: string; proposedAction?: ManagementAiAction } | null {
  const unfenced = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  if (!unfenced.startsWith("{") || !unfenced.endsWith("}")) return null;
  try {
    const parsed = JSON.parse(unfenced) as { assistant_text?: unknown; proposed_action?: unknown };
    if (typeof parsed.assistant_text !== "string" || !parsed.assistant_text.trim()) return null;
    if (parsed.proposed_action === undefined || parsed.proposed_action === null) return { content: parsed.assistant_text.trim() };
    const action = managementAiActionSchema.safeParse(parsed.proposed_action);
    return action.success
      ? { content: parsed.assistant_text.trim(), proposedAction: action.data }
      : { content: `${parsed.assistant_text.trim()} I could not prepare a safe action preview from that response, so nothing can be confirmed or saved.` };
  } catch {
    return null;
  }
}

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
  const proposal = structuredProposal(content.trim());
  return { role: "assistant", status: "available", ...(proposal || { content: content.trim() }) };
}

export function unavailableManagementAiResponse(): ManagementAiChatResponse {
  return {
    role: "assistant",
    status: "unavailable",
    content: "The AI assistant could not be reached just now. Please try again shortly; no records or reminders were changed.",
  };
}
