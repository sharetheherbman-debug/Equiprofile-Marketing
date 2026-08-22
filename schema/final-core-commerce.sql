-- Final-Core Commerce schema contract.
-- Source: recovered verbatim from authorized commit c40b7a2 Shop DDL.
-- This is not historical Drizzle journal history and is executed only by explicit inspector-gated commands.
-- EquiProfile Equestrian Store foundation. Additive only; deliberately separate
-- from SaaS subscription billing and existing Stripe subscription records.

CREATE TABLE IF NOT EXISTS `commerceSuppliers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(200) NOT NULL,
  `status` ENUM('not_configured','review','active','suspended') NOT NULL DEFAULT 'not_configured',
  `fulfilmentModel` ENUM('supplier_direct','own_stock','hybrid') NOT NULL DEFAULT 'supplier_direct',
  `imageRightsStatus` ENUM('review_required','licensed','not_permitted') NOT NULL DEFAULT 'review_required',
  `configurationJson` TEXT,
  `lastSyncedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceSupplierSources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplierId` INT NOT NULL,
  `sourceType` ENUM('rest','graphql','csv','xml','sftp','manual','synthetic') NOT NULL,
  `sourceName` VARCHAR(200) NOT NULL,
  `sourceUrl` TEXT,
  `isEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `lastFetchedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_commerceSupplierSources_supplierId` (`supplierId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceSupplierSyncRuns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplierSourceId` INT NOT NULL,
  `status` ENUM('started','completed','failed','rejected') NOT NULL,
  `receivedCount` INT NOT NULL DEFAULT 0,
  `acceptedCount` INT NOT NULL DEFAULT 0,
  `rejectedCount` INT NOT NULL DEFAULT 0,
  `reportJson` TEXT NOT NULL,
  `startedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completedAt` TIMESTAMP NULL,
  KEY `idx_commerceSupplierSyncRuns_source` (`supplierSourceId`, `startedAt`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceCategories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `parentId` INT NULL,
  `description` TEXT,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_commerceCategories_parent` (`parentId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceProducts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(180) NOT NULL UNIQUE,
  `title` VARCHAR(250) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('draft','review_required','published','unavailable','archived') NOT NULL DEFAULT 'draft',
  `brand` VARCHAR(150),
  `retailPricePence` INT NOT NULL,
  `salePricePence` INT NULL,
  `vatRateBasisPoints` INT NOT NULL DEFAULT 2000,
  `availabilityStatus` ENUM('in_stock','low_stock','on_order','stale','unavailable') NOT NULL DEFAULT 'unavailable',
  `imageRightsStatus` ENUM('review_required','licensed','not_permitted') NOT NULL DEFAULT 'review_required',
  `factualProvenanceJson` TEXT NOT NULL,
  `generatedCopyJson` TEXT,
  `developmentOnly` BOOLEAN NOT NULL DEFAULT FALSE,
  `isArchived` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_commerceProducts_status` (`status`, `developmentOnly`),
  KEY `idx_commerceProducts_availability` (`availabilityStatus`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceProductVariants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `sku` VARCHAR(150) NOT NULL UNIQUE,
  `ean` VARCHAR(32) NULL,
  `title` VARCHAR(250) NOT NULL,
  `attributesJson` TEXT NOT NULL,
  `retailPricePence` INT NULL,
  `salePricePence` INT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_commerceProductVariants_product` (`productId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceProductCategories` (
  `productId` INT NOT NULL,
  `categoryId` INT NOT NULL,
  PRIMARY KEY (`productId`, `categoryId`),
  KEY `idx_commerceProductCategories_category` (`categoryId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceSupplierProducts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplierId` INT NOT NULL,
  `productId` INT NOT NULL,
  `variantId` INT NULL,
  `supplierSku` VARCHAR(150) NOT NULL,
  `sourcePayloadJson` TEXT NOT NULL,
  `supplierCostPence` INT NOT NULL,
  `rrpPence` INT NULL,
  `leadTimeDays` INT NULL,
  `sourceUpdatedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `commerceSupplierProducts_supplier_sku` (`supplierId`, `supplierSku`),
  KEY `idx_commerceSupplierProducts_product` (`productId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceSupplierInventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplierProductId` INT NOT NULL UNIQUE,
  `quantity` INT NULL,
  `availabilityStatus` ENUM('in_stock','low_stock','on_order','stale','unavailable') NOT NULL DEFAULT 'unavailable',
  `stockUpdatedAt` TIMESTAMP NULL,
  `freshUntil` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceCarts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'GBP',
  `status` ENUM('active','converted','abandoned') NOT NULL DEFAULT 'active',
  `activeCartKey` VARCHAR(16) NOT NULL DEFAULT 'active',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `commerceCarts_user_active` (`userId`, `activeCartKey`),
  KEY `idx_commerceCarts_user` (`userId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceCartItems` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cartId` INT NOT NULL,
  `variantId` INT NOT NULL,
  `quantity` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `commerceCartItems_cart_variant` (`cartId`, `variantId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceOrders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderNumber` VARCHAR(40) NOT NULL UNIQUE,
  `userId` INT NOT NULL,
  `status` ENUM('checkout_pending','payment_pending','paid','acknowledged','processing','partially_fulfilled','fulfilled','dispatched','delivered','payment_failed','cancelled','return_requested','returned','partially_refunded','refunded') NOT NULL DEFAULT 'checkout_pending',
  `currency` CHAR(3) NOT NULL DEFAULT 'GBP',
  `subtotalPence` INT NOT NULL,
  `shippingPence` INT NOT NULL DEFAULT 0,
  `vatPence` INT NOT NULL DEFAULT 0,
  `totalPence` INT NOT NULL,
  `stripeCheckoutSessionId` VARCHAR(255) NULL UNIQUE,
  `idempotencyKey` VARCHAR(160) NOT NULL UNIQUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_commerceOrders_user` (`userId`, `createdAt`),
  KEY `idx_commerceOrders_status` (`status`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceOrderItems` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `variantId` INT NOT NULL,
  `titleSnapshot` VARCHAR(250) NOT NULL,
  `skuSnapshot` VARCHAR(150) NOT NULL,
  `quantity` INT NOT NULL,
  `unitPricePence` INT NOT NULL,
  `vatPence` INT NOT NULL DEFAULT 0,
  `supplierId` INT NULL,
  `fulfilmentStatus` ENUM('pending','acknowledged','processing','dispatched','delivered','cancelled') NOT NULL DEFAULT 'pending',
  KEY `idx_commerceOrderItems_order` (`orderId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceProductApprovals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `status` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `proposedBy` VARCHAR(40) NOT NULL DEFAULT 'system',
  `reviewedByUserId` INT NULL,
  `reason` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewedAt` TIMESTAMP NULL,
  KEY `idx_commerceProductApprovals_product` (`productId`, `status`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `commerceAuditLog` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `actorType` ENUM('system','user','ai') NOT NULL,
  `actorUserId` INT NULL,
  `entityType` VARCHAR(80) NOT NULL,
  `entityId` VARCHAR(80) NOT NULL,
  `action` VARCHAR(120) NOT NULL,
  `detailsJson` TEXT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_commerceAuditLog_entity` (`entityType`, `entityId`, `createdAt`)
);

--> statement-breakpoint

-- Commerce continuation. 0022 is retained unchanged; this additive migration
-- completes lifecycle entities and relational integrity before any production use.

CREATE TABLE `commerceProductImages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `variantId` INT NULL,
  `storageUrl` TEXT NOT NULL,
  `altText` VARCHAR(500) NOT NULL,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `rightsStatus` ENUM('review_required','licensed','not_permitted') NOT NULL DEFAULT 'review_required',
  `provenanceJson` TEXT NOT NULL,
  `sourceUpdatedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_commerceProductImages_product` (`productId`, `sortOrder`),
  CONSTRAINT `fk_commerceProductImages_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`),
  CONSTRAINT `fk_commerceProductImages_variant` FOREIGN KEY (`variantId`) REFERENCES `commerceProductVariants` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceProductAttributes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `variantId` INT NULL,
  `attributeName` VARCHAR(120) NOT NULL,
  `attributeValue` VARCHAR(500) NOT NULL,
  `sourceType` ENUM('supplier','merchant','generated') NOT NULL DEFAULT 'supplier',
  `provenanceJson` TEXT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `commerceProductAttributes_unique` (`productId`, `variantId`, `attributeName`),
  CONSTRAINT `fk_commerceProductAttributes_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`),
  CONSTRAINT `fk_commerceProductAttributes_variant` FOREIGN KEY (`variantId`) REFERENCES `commerceProductVariants` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commercePriceHistory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `variantId` INT NULL,
  `supplierCostPence` INT NULL,
  `retailPricePence` INT NOT NULL,
  `salePricePence` INT NULL,
  `reason` VARCHAR(250) NOT NULL,
  `createdByUserId` INT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_commercePriceHistory_product` (`productId`, `createdAt`),
  CONSTRAINT `fk_commercePriceHistory_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`),
  CONSTRAINT `fk_commercePriceHistory_variant` FOREIGN KEY (`variantId`) REFERENCES `commerceProductVariants` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceAddresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `fullName` VARCHAR(200) NOT NULL,
  `line1` VARCHAR(250) NOT NULL,
  `line2` VARCHAR(250) NULL,
  `city` VARCHAR(120) NOT NULL,
  `postcode` VARCHAR(32) NOT NULL,
  `countryCode` CHAR(2) NOT NULL,
  `phone` VARCHAR(64) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_commerceAddresses_user` (`userId`),
  CONSTRAINT `fk_commerceAddresses_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
);
--> statement-breakpoint

ALTER TABLE `commerceOrders`
  ADD COLUMN `shippingAddressId` INT NULL,
  ADD COLUMN `billingAddressId` INT NULL,
  ADD CONSTRAINT `fk_commerceOrders_shippingAddress` FOREIGN KEY (`shippingAddressId`) REFERENCES `commerceAddresses` (`id`),
  ADD CONSTRAINT `fk_commerceOrders_billingAddress` FOREIGN KEY (`billingAddressId`) REFERENCES `commerceAddresses` (`id`);
--> statement-breakpoint

CREATE TABLE `commerceShipments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `supplierId` INT NULL,
  `status` ENUM('pending','processing','dispatched','delivered','delivery_failed','cancelled') NOT NULL DEFAULT 'pending',
  `carrier` VARCHAR(120) NULL,
  `trackingReference` VARCHAR(250) NULL,
  `leadTimeDays` INT NULL,
  `estimatedDeliveryAt` TIMESTAMP NULL,
  `dispatchedAt` TIMESTAMP NULL,
  `deliveredAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_commerceShipments_order` (`orderId`, `status`),
  CONSTRAINT `fk_commerceShipments_order` FOREIGN KEY (`orderId`) REFERENCES `commerceOrders` (`id`),
  CONSTRAINT `fk_commerceShipments_supplier` FOREIGN KEY (`supplierId`) REFERENCES `commerceSuppliers` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceShipmentItems` (
  `shipmentId` INT NOT NULL,
  `orderItemId` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`shipmentId`, `orderItemId`),
  CONSTRAINT `fk_commerceShipmentItems_shipment` FOREIGN KEY (`shipmentId`) REFERENCES `commerceShipments` (`id`),
  CONSTRAINT `fk_commerceShipmentItems_orderItem` FOREIGN KEY (`orderItemId`) REFERENCES `commerceOrderItems` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceTrackingEvents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `shipmentId` INT NOT NULL,
  `eventCode` VARCHAR(120) NOT NULL,
  `eventDescription` TEXT NULL,
  `eventAt` TIMESTAMP NOT NULL,
  `source` VARCHAR(120) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_commerceTrackingEvents_shipment` (`shipmentId`, `eventAt`),
  CONSTRAINT `fk_commerceTrackingEvents_shipment` FOREIGN KEY (`shipmentId`) REFERENCES `commerceShipments` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceReturns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `userId` INT NOT NULL,
  `status` ENUM('requested','approved','rejected','received','refunded','cancelled') NOT NULL DEFAULT 'requested',
  `reason` TEXT NOT NULL,
  `requestedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `decidedAt` TIMESTAMP NULL,
  `receivedAt` TIMESTAMP NULL,
  KEY `idx_commerceReturns_order` (`orderId`, `status`),
  CONSTRAINT `fk_commerceReturns_order` FOREIGN KEY (`orderId`) REFERENCES `commerceOrders` (`id`),
  CONSTRAINT `fk_commerceReturns_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceReturnItems` (
  `returnId` INT NOT NULL,
  `orderItemId` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`returnId`, `orderItemId`),
  CONSTRAINT `fk_commerceReturnItems_return` FOREIGN KEY (`returnId`) REFERENCES `commerceReturns` (`id`),
  CONSTRAINT `fk_commerceReturnItems_orderItem` FOREIGN KEY (`orderItemId`) REFERENCES `commerceOrderItems` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceRefunds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderId` INT NOT NULL,
  `returnId` INT NULL,
  `amountPence` INT NOT NULL,
  `status` ENUM('requested','pending','succeeded','failed') NOT NULL DEFAULT 'requested',
  `stripeRefundId` VARCHAR(255) NULL UNIQUE,
  `idempotencyKey` VARCHAR(160) NOT NULL UNIQUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_commerceRefunds_order` (`orderId`, `status`),
  CONSTRAINT `fk_commerceRefunds_order` FOREIGN KEY (`orderId`) REFERENCES `commerceOrders` (`id`),
  CONSTRAINT `fk_commerceRefunds_return` FOREIGN KEY (`returnId`) REFERENCES `commerceReturns` (`id`)
);
--> statement-breakpoint

CREATE TABLE `commerceProductManagerActions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NULL,
  `supplierSourceId` INT NULL,
  `actionType` ENUM('ingest','normalise','deduplicate','score','propose','enrich','price','publish','unpublish','monitor') NOT NULL,
  `actorType` ENUM('system','ai','user') NOT NULL,
  `status` ENUM('started','completed','rejected','failed') NOT NULL,
  `inputJson` TEXT NOT NULL,
  `outputJson` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_commerceProductManagerActions_product` (`productId`, `createdAt`),
  CONSTRAINT `fk_commerceProductManagerActions_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`),
  CONSTRAINT `fk_commerceProductManagerActions_source` FOREIGN KEY (`supplierSourceId`) REFERENCES `commerceSupplierSources` (`id`)
);
--> statement-breakpoint

-- Foreign keys for the 0022 core graph. Applied here to preserve a separate,
-- reviewable integrity migration; no existing table or data is removed.
ALTER TABLE `commerceSupplierSources` ADD CONSTRAINT `fk_commerceSupplierSources_supplier` FOREIGN KEY (`supplierId`) REFERENCES `commerceSuppliers` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceSupplierSyncRuns` ADD CONSTRAINT `fk_commerceSupplierSyncRuns_source` FOREIGN KEY (`supplierSourceId`) REFERENCES `commerceSupplierSources` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceProductVariants` ADD CONSTRAINT `fk_commerceProductVariants_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceProductCategories` ADD CONSTRAINT `fk_commerceProductCategories_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`), ADD CONSTRAINT `fk_commerceProductCategories_category` FOREIGN KEY (`categoryId`) REFERENCES `commerceCategories` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceSupplierProducts` ADD CONSTRAINT `fk_commerceSupplierProducts_supplier` FOREIGN KEY (`supplierId`) REFERENCES `commerceSuppliers` (`id`), ADD CONSTRAINT `fk_commerceSupplierProducts_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`), ADD CONSTRAINT `fk_commerceSupplierProducts_variant` FOREIGN KEY (`variantId`) REFERENCES `commerceProductVariants` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceSupplierInventory` ADD CONSTRAINT `fk_commerceSupplierInventory_supplierProduct` FOREIGN KEY (`supplierProductId`) REFERENCES `commerceSupplierProducts` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceCarts` ADD CONSTRAINT `fk_commerceCarts_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceCartItems` ADD CONSTRAINT `fk_commerceCartItems_cart` FOREIGN KEY (`cartId`) REFERENCES `commerceCarts` (`id`), ADD CONSTRAINT `fk_commerceCartItems_variant` FOREIGN KEY (`variantId`) REFERENCES `commerceProductVariants` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceOrders` ADD CONSTRAINT `fk_commerceOrders_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceOrderItems` ADD CONSTRAINT `fk_commerceOrderItems_order` FOREIGN KEY (`orderId`) REFERENCES `commerceOrders` (`id`), ADD CONSTRAINT `fk_commerceOrderItems_variant` FOREIGN KEY (`variantId`) REFERENCES `commerceProductVariants` (`id`), ADD CONSTRAINT `fk_commerceOrderItems_supplier` FOREIGN KEY (`supplierId`) REFERENCES `commerceSuppliers` (`id`);
--> statement-breakpoint
ALTER TABLE `commerceProductApprovals` ADD CONSTRAINT `fk_commerceProductApprovals_product` FOREIGN KEY (`productId`) REFERENCES `commerceProducts` (`id`);

--> statement-breakpoint

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

--> statement-breakpoint

-- Additive identifier support for source-level SKU/EAN normalisation and deduplication.
ALTER TABLE `commerceSupplierProducts`
  ADD COLUMN `ean` VARCHAR(32) NULL,
  ADD KEY `idx_commerceSupplierProducts_ean` (`ean`);

--> statement-breakpoint

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

--> statement-breakpoint

-- Additive item-level return-policy snapshots.
-- Product policy is an operational merchant setting, not a statement of statutory
-- rights. Order items snapshot the policy and cut-off used at checkout so later
-- product edits cannot change a completed order's return eligibility.

ALTER TABLE `commerceProducts`
  ADD COLUMN IF NOT EXISTS `returnEligibility` ENUM('standard','not_returnable','review_required')
    NOT NULL DEFAULT 'review_required';
--> statement-breakpoint

ALTER TABLE `commerceOrderItems`
  ADD COLUMN IF NOT EXISTS `returnEligibility` ENUM('standard','not_returnable','review_required')
    NOT NULL DEFAULT 'review_required',
  ADD COLUMN IF NOT EXISTS `returnWindowDays` INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `returnWindowEndsAt` TIMESTAMP NULL;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS `idx_commerceOrderItems_returnWindow`
  ON `commerceOrderItems` (`orderId`, `returnEligibility`, `returnWindowEndsAt`);

--> statement-breakpoint
