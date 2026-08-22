-- Academy billing is isolated from SaaS subscriptions and Store commerce payments.
-- This additive schema supports Stripe TEST-mode checkout and idempotent webhook reconciliation.
ALTER TABLE `organizations`
  ADD COLUMN IF NOT EXISTS `academyBillingStatus` ENUM('not_configured','checkout_pending','active','past_due','cancelled','expired') NOT NULL DEFAULT 'not_configured',
  ADD COLUMN IF NOT EXISTS `academyBillingInterval` ENUM('monthly','yearly') NULL,
  ADD COLUMN IF NOT EXISTS `academyBillingPriceId` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `academyStripeCustomerId` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `academyStripeSubscriptionId` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `academyStripeCheckoutSessionId` VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `academyBillingCurrentPeriodEndsAt` TIMESTAMP NULL;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS `organizations_academyStripeCustomer_unique`
  ON `organizations` (`academyStripeCustomerId`);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `organizations_academyStripeSubscription_unique`
  ON `organizations` (`academyStripeSubscriptionId`);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `organizations_academyStripeCheckoutSession_unique`
  ON `organizations` (`academyStripeCheckoutSessionId`);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `academyBillingEvents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `provider` VARCHAR(40) NOT NULL,
  `providerEventId` VARCHAR(255) NOT NULL,
  `eventType` VARCHAR(160) NOT NULL,
  `organizationId` INT NULL,
  `status` ENUM('received','processed','ignored','failed') NOT NULL DEFAULT 'received',
  `payloadJson` MEDIUMTEXT NOT NULL,
  `processedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `academyBillingEvents_provider_event_unique` (`provider`, `providerEventId`),
  KEY `idx_academyBillingEvents_organization` (`organizationId`, `createdAt`),
  CONSTRAINT `fk_academyBillingEvents_organization`
    FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
