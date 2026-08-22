/**
 * Chat Orchestrator
 *
 * Handles text-only chat/assistant tasks without touching media routing,
 * video model discovery, or provider telemetry DB writes.
 *
 * This is intentionally kept separate from the main AI orchestrator
 * (orchestrator.ts) so that dashboard chat remains isolated from queued media
 * work. Production Management uses GenX only; a missing GenX configuration
 * produces a truthful setup-needed state rather than a vendor fallback.
 */
import { getRuntimeConfig, getRuntimeConfigMode } from "../../dynamicConfig";
import type { Message } from "../llm";

export type ChatTextProvider = "genx";

export type ChatProviderConfig = {
  provider: ChatTextProvider;
  apiKey: string;
  endpoint: string;
  model: string;
};

export type ChatResponse = {
  provider: ChatTextProvider;
  model: string;
  content: string;
};

export type ChatSetupNeededError = {
  status: "setup_needed";
  message: string;
};

export type ChatResult = ChatResponse | ChatSetupNeededError;

export function isChatSetupNeeded(result: ChatResult): result is ChatSetupNeededError {
  return (result as ChatSetupNeededError).status === "setup_needed";
}

async function resolveGenXChatConfig(): Promise<ChatProviderConfig | null> {
  const apiKey = await getRuntimeConfig("genx_api_key", "GENX_API_KEY");
  if (!apiKey) return null;
  const baseRaw =
    (await getRuntimeConfig("genx_base_url", "GENX_BASE_URL")) ||
    "https://query.genx.sh/v1";
  const base = baseRaw.replace(/\/+$/, "").replace(/\/v1$/i, "");
  const endpoint = base + "/v1/chat/completions";
  const model =
    (await getRuntimeConfig("genx_text_model", "GENX_TEXT_MODEL")) ||
    (await getRuntimeConfig("genx_default_model", "GENX_DEFAULT_MODEL")) ||
    (await getRuntimeConfig("genx_model", "GENX_MODEL")) ||
    "gpt-5.4";
  return { provider: "genx", apiKey, endpoint, model };
}

async function resolvePreferredChatConfig(): Promise<ChatProviderConfig | null> {
  return resolveGenXChatConfig();
}

function normalizeChatMessages(
  messages: Message[],
): Array<{ role: string; content: string }> {
  return messages.map((m) => {
    const content = Array.isArray(m.content)
      ? m.content
          .map((part) => {
            if (typeof part === "string") return part;
            if (part.type === "text") return part.text;
            if (part.type === "image_url") {
              return "[image:" + part.image_url.url + "]";
            }
            return "";
          })
          .join("\n")
      : typeof m.content === "string"
        ? m.content
        : "";
    return {
      role: m.role === "function" || m.role === "tool" ? "assistant" : m.role,
      content,
    };
  });
}

async function callChatEndpoint(
  config: ChatProviderConfig,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
  timeoutMs: number,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: maxTokens,
        stream: false,
      }),
      signal: controller.signal,
    });
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      throw new Error(
        config.provider + " chat HTTP " + resp.status + ": " + body.slice(0, 200),
      );
    }
    const json = (await resp.json()) as Record<string, unknown>;
    const choices = json.choices as
      | Array<{ message?: { content?: unknown } }>
      | undefined;
    const text = choices?.[0]?.message?.content;
    if (typeof text === "string" && text.trim()) return text.trim();
    throw new Error(config.provider + " returned an empty chat response");
  } finally {
    clearTimeout(timer);
  }
}

export async function executeChatTask(
  messages: Message[],
  opts: { maxTokens?: number; timeoutMs?: number } = {},
): Promise<ChatResult> {
  const config = await resolvePreferredChatConfig();
  if (!config) {
    return {
      status: "setup_needed",
      message:
        "GenX is not configured. Add GENX_API_KEY, GENX_BASE_URL, and GENX_MODEL in deployment settings.",
    };
  }

  const normalizedMessages = normalizeChatMessages(messages);
  const maxTokens = opts.maxTokens ?? 2048;
  const timeoutMs = opts.timeoutMs ?? 25_000;
  const content = await callChatEndpoint(
    config,
    normalizedMessages,
    maxTokens,
    timeoutMs,
  );
  return { provider: config.provider, model: config.model, content };
}

export async function isChatProviderConfigured(): Promise<boolean> {
  if (getRuntimeConfigMode() === "unit_test_mock") {
    return !!process.env.GENX_API_KEY;
  }
  const cfg = await resolvePreferredChatConfig();
  return cfg !== null;
}
