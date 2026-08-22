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
