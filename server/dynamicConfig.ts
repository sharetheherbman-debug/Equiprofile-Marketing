/**
 * Dynamic Runtime Configuration
 *
 * Product preferences may be stored in the database, but infrastructure
 * credentials and provider configuration are environment-only. This prevents
 * API keys, payment secrets, SMTP credentials and messaging credentials from
 * being read from or written through a browser-facing settings surface.
 *
 * Priority for ordinary non-secret settings:
 *   database siteSettings > environment variable > empty string
 *
 * Priority for environment-only settings:
 *   environment variable > empty string
 */
import { getDb } from "./db";
import { siteSettings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const CACHE_TTL_MS = 5 * 60 * 1000;

export type RuntimeConfigMode = "unit_test_mock" | "local_dev" | "production_live";

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const configCache = new Map<string, CacheEntry>();

/**
 * Keys in this set may never use siteSettings as a runtime source.
 *
 * Some legacy aliases remain listed so old database rows cannot silently take
 * precedence over the VPS environment during the migration period.
 */
export const ENV_ONLY_RUNTIME_KEYS = new Set<string>([
  // GenX and legacy AI provider configuration
  "genx_api_key",
  "genx_base_url",
  "genx_model",
  "equiprofile_ai_genx_api_key",
  "equiprofile_ai_genx_model",
  "marketing_genx_api_key",
  "marketing_genx_model",
  "qwen_api_key",
  "qwen_base_url",
  "qwen_model",
  "marketing_qwen_api_key",
  "huggingface_api_key",
  "huggingface_model",
  "marketing_huggingface_api_key",

  // Payment infrastructure
  "stripe_secret_key",
  "stripe_webhook_secret",

  // Email infrastructure
  "smtp_host",
  "smtp_port",
  "smtp_user",
  "smtp_pass",
  "smtp_from",

  // Messaging infrastructure
  "twilio_account_sid",
  "twilio_auth_token",
  "twilio_whatsapp_from",
  "whatsapp_account_sid",
  "whatsapp_auth_token",
  "whatsapp_from_number",
]);

const ENV_ONLY_VARIABLES = new Set<string>([
  "GENX_API_KEY",
  "GENX_BASE_URL",
  "GENX_MODEL",
  "EQUIPROFILE_AI_GENX_MODEL",
  "QWEN_API_KEY",
  "QWEN_BASE_URL",
  "QWEN_MODEL",
  "HUGGINGFACE_API_KEY",
  "HUGGINGFACE_MODEL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_WHATSAPP_FROM",
]);

export function isEnvironmentOnlyRuntimeSetting(
  settingKey: string,
  envVar?: string,
): boolean {
  return (
    ENV_ONLY_RUNTIME_KEYS.has(settingKey.trim().toLowerCase()) ||
    (!!envVar && ENV_ONLY_VARIABLES.has(envVar.trim().toUpperCase()))
  );
}

export function getRuntimeConfigMode(): RuntimeConfigMode {
  const explicit = String(process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE ?? "")
    .trim()
    .toLowerCase();

  if (
    explicit === "unit_test_mock" ||
    explicit === "local_dev" ||
    explicit === "production_live"
  ) {
    return explicit;
  }

  if (process.env.VITEST === "true" || process.env.NODE_ENV === "test") {
    return "unit_test_mock";
  }

  if (process.env.NODE_ENV === "production") {
    return "production_live";
  }

  return "local_dev";
}

function shouldUseDatabaseForRuntimeConfig() {
  if (process.env.FORCE_RUNTIME_CONFIG_DB_IN_TESTS === "true") return true;
  return getRuntimeConfigMode() !== "unit_test_mock";
}

export function getRuntimeConfigDiagnostics() {
  return {
    mode: getRuntimeConfigMode(),
    dbLookupEnabled: shouldUseDatabaseForRuntimeConfig(),
    environmentOnlyKeys: ENV_ONLY_RUNTIME_KEYS.size,
  };
}

/**
 * Get a runtime configuration value.
 *
 * Environment-only credentials are resolved before any cache or database
 * access so a stale siteSettings value can never override the VPS secret.
 */
export async function getRuntimeConfig(
  settingKey: string,
  envVar: string,
): Promise<string> {
  if (isEnvironmentOnlyRuntimeSetting(settingKey, envVar)) {
    return process.env[envVar] ?? "";
  }

  const cached = configCache.get(settingKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  if (!shouldUseDatabaseForRuntimeConfig()) {
    return process.env[envVar] ?? "";
  }

  try {
    const dbConn = await getDb();
    if (!dbConn) return process.env[envVar] ?? "";

    const rows = await dbConn
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, settingKey));

    const databaseValue = rows?.[0]?.value ?? "";
    const value = databaseValue || process.env[envVar] || "";

    configCache.set(settingKey, {
      value,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return value;
  } catch (err) {
    if (getRuntimeConfigMode() !== "unit_test_mock") {
      console.error(
        `[DynamicConfig] Failed to read setting "${settingKey}":`,
        err,
      );
    }
    return process.env[envVar] ?? "";
  }
}

/**
 * Invalidate cached non-secret configuration entries after a setting update.
 */
export function invalidateConfigCache(settingKey?: string): void {
  if (settingKey) {
    configCache.delete(settingKey);
  } else {
    configCache.clear();
  }
}
