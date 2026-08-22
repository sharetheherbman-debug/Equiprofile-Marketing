-- Supplier onboarding state is intentionally separate from operational supplier status.
-- This additive field records external prerequisites without activating a source,
-- publishing products, or authorising supplier order routing.

ALTER TABLE `commerceSuppliers`
  ADD COLUMN IF NOT EXISTS `onboardingStatus` ENUM(
    'not_started',
    'PENDING_AVASAM_ACCOUNT_CREDENTIALS',
    'PENDING_TRADE_APPROVAL',
    'PENDING_TRADE_AND_IMAGE_RIGHTS_APPROVAL',
    'PENDING_TECHNICAL_VALIDATION',
    'READY_FOR_HUMAN_APPROVAL',
    'APPROVED'
  ) NOT NULL DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS `onboardingNotes` TEXT NULL;
--> statement-breakpoint

ALTER TABLE `commerceSuppliers`
  ADD INDEX IF NOT EXISTS `idx_commerceSuppliers_onboardingStatus` (`onboardingStatus`);
