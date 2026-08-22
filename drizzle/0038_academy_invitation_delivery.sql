-- Additive Academy invitation-delivery observability.
-- Delivery state is deliberately separate from invitation acceptance: an email failure
-- never grants a role and never makes an undelivered invite appear sent.

ALTER TABLE `organizationInvites`
  ADD COLUMN IF NOT EXISTS `deliveryStatus` VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS `deliveryAttemptCount` INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `lastDeliveryAttemptAt` TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS `deliveredAt` TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS `lastDeliveryError` VARCHAR(500) NULL;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS `idx_organizationInvites_deliveryStatus`
  ON `organizationInvites` (`deliveryStatus`);
