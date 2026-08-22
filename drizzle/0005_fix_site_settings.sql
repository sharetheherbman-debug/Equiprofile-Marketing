-- Migration 0005: Ensure siteSettings table is correct
--
-- Problem: the table may have been created by an older ad-hoc process
-- that omitted updatedAt or the UNIQUE KEY on `key`, so
-- CREATE TABLE IF NOT EXISTS would have left the table incomplete.
--
-- Strategy:
--   1. CREATE TABLE IF NOT EXISTS – covers fresh installs
--   2. ADD COLUMN IF NOT EXISTS    – adds `updatedAt` to tables that exist
--      without it (idempotent: does nothing if column already exists)
--   3. ADD UNIQUE IF NOT EXISTS    – adds the unique index to tables that
--      exist without it (idempotent: does nothing if index already exists)

-- Step 1: Create with full structure on fresh installs
CREATE TABLE IF NOT EXISTS `siteSettings` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `key`       VARCHAR(100) NOT NULL,
  `value`     TEXT,
  `updatedAt` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `siteSettings_key_unique` (`key`)
);

-- Step 2: Add updatedAt column if the table pre-existed without it
ALTER TABLE `siteSettings`
  ADD COLUMN IF NOT EXISTS `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Step 3: Add unique key on `key` column if the table pre-existed without it
-- (ON DUPLICATE KEY UPDATE requires this unique index to function correctly)
ALTER TABLE `siteSettings`
  ADD UNIQUE IF NOT EXISTS `siteSettings_key_unique` (`key`);
