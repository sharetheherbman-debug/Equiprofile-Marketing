-- Store payment reconciliation is intentionally isolated from SaaS subscription events.
CREATE TABLE `commercePaymentEvents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `provider` VARCHAR(40) NOT NULL,
  `providerEventId` VARCHAR(255) NOT NULL,
  `eventType` VARCHAR(160) NOT NULL,
  `orderId` INT NULL,
  `paymentIntentId` VARCHAR(255) NULL,
  `status` ENUM('received','processed','ignored','failed') NOT NULL DEFAULT 'received',
  `payloadJson` MEDIUMTEXT NOT NULL,
  `processedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `commercePaymentEvents_provider_event_unique` (`provider`, `providerEventId`),
  KEY `idx_commercePaymentEvents_order` (`orderId`, `createdAt`),
  CONSTRAINT `fk_commercePaymentEvents_order` FOREIGN KEY (`orderId`) REFERENCES `commerceOrders` (`id`)
);
--> statement-breakpoint

ALTER TABLE `commerceOrders`
  ADD COLUMN `storePaymentStatus` ENUM('not_configured','pending','paid','failed','refunded','partially_refunded') NOT NULL DEFAULT 'not_configured',
  ADD COLUMN `storePaymentReference` VARCHAR(255) NULL,
  ADD UNIQUE KEY `commerceOrders_storePaymentReference_unique` (`storePaymentReference`);
