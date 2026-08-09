-- Phase 1: infrastructure credentials are environment-only.
--
-- EquiProfile must never use siteSettings as a secret store. Existing values
-- are cleared and future browser/API writes to these keys are forced to NULL.
-- The server runtime resolves them only from VPS environment variables.

UPDATE `siteSettings`
SET `value` = NULL
WHERE LOWER(`key`) IN (
  'genx_api_key',
  'genx_base_url',
  'genx_model',
  'equiprofile_ai_genx_api_key',
  'equiprofile_ai_genx_model',
  'marketing_genx_api_key',
  'marketing_genx_model',
  'qwen_api_key',
  'qwen_base_url',
  'qwen_model',
  'marketing_qwen_api_key',
  'huggingface_api_key',
  'huggingface_model',
  'marketing_huggingface_api_key',
  'stripe_secret_key',
  'stripe_webhook_secret',
  'smtp_host',
  'smtp_port',
  'smtp_user',
  'smtp_pass',
  'smtp_from',
  'twilio_account_sid',
  'twilio_auth_token',
  'twilio_whatsapp_from',
  'whatsapp_account_sid',
  'whatsapp_auth_token',
  'whatsapp_from_number'
);

DROP TRIGGER IF EXISTS `siteSettings_env_only_insert`;
CREATE TRIGGER `siteSettings_env_only_insert`
BEFORE INSERT ON `siteSettings`
FOR EACH ROW
SET NEW.`value` = IF(
  LOWER(NEW.`key`) IN (
    'genx_api_key',
    'genx_base_url',
    'genx_model',
    'equiprofile_ai_genx_api_key',
    'equiprofile_ai_genx_model',
    'marketing_genx_api_key',
    'marketing_genx_model',
    'qwen_api_key',
    'qwen_base_url',
    'qwen_model',
    'marketing_qwen_api_key',
    'huggingface_api_key',
    'huggingface_model',
    'marketing_huggingface_api_key',
    'stripe_secret_key',
    'stripe_webhook_secret',
    'smtp_host',
    'smtp_port',
    'smtp_user',
    'smtp_pass',
    'smtp_from',
    'twilio_account_sid',
    'twilio_auth_token',
    'twilio_whatsapp_from',
    'whatsapp_account_sid',
    'whatsapp_auth_token',
    'whatsapp_from_number'
  ),
  NULL,
  NEW.`value`
);

DROP TRIGGER IF EXISTS `siteSettings_env_only_update`;
CREATE TRIGGER `siteSettings_env_only_update`
BEFORE UPDATE ON `siteSettings`
FOR EACH ROW
SET NEW.`value` = IF(
  LOWER(NEW.`key`) IN (
    'genx_api_key',
    'genx_base_url',
    'genx_model',
    'equiprofile_ai_genx_api_key',
    'equiprofile_ai_genx_model',
    'marketing_genx_api_key',
    'marketing_genx_model',
    'qwen_api_key',
    'qwen_base_url',
    'qwen_model',
    'marketing_qwen_api_key',
    'huggingface_api_key',
    'huggingface_model',
    'marketing_huggingface_api_key',
    'stripe_secret_key',
    'stripe_webhook_secret',
    'smtp_host',
    'smtp_port',
    'smtp_user',
    'smtp_pass',
    'smtp_from',
    'twilio_account_sid',
    'twilio_auth_token',
    'twilio_whatsapp_from',
    'whatsapp_account_sid',
    'whatsapp_auth_token',
    'whatsapp_from_number'
  ),
  NULL,
  NEW.`value`
);
