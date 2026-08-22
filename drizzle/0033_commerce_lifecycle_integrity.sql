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
