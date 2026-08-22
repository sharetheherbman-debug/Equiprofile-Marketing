-- Additive identifier support for source-level SKU/EAN normalisation and deduplication.
ALTER TABLE `commerceSupplierProducts`
  ADD COLUMN `ean` VARCHAR(32) NULL,
  ADD KEY `idx_commerceSupplierProducts_ean` (`ean`);
