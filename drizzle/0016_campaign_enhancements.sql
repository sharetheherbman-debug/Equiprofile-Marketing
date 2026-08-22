-- Phase 3: Campaign system enhancements
-- Add country, leadFocus, organizationName to marketingContacts
-- Add country, dailyLimit, targetType to emailCampaigns
-- Add scheduledDate to campaignSequences

-- Marketing contacts: add country + leadFocus + organizationName columns
ALTER TABLE `marketingContacts`
  ADD COLUMN `country` varchar(100) DEFAULT NULL AFTER `region`,
  ADD COLUMN `leadFocus` varchar(200) DEFAULT NULL AFTER `country`,
  ADD COLUMN `organizationName` varchar(300) DEFAULT NULL AFTER `leadFocus`,
  ADD COLUMN `lastContactedAt` timestamp NULL DEFAULT NULL AFTER `updatedAt`;

-- Add indexes for country-based segmentation queries
ALTER TABLE `marketingContacts`
  ADD KEY `idx_mc_country` (`country`),
  ADD KEY `idx_mc_contact_type` (`contactType`);

-- Email campaigns: add country targeting + daily limit fields
ALTER TABLE `emailCampaigns`
  ADD COLUMN `targetCountry` varchar(100) DEFAULT NULL AFTER `customFilter`,
  ADD COLUMN `targetType` varchar(100) DEFAULT NULL AFTER `targetCountry`,
  ADD COLUMN `dailyLimit` int DEFAULT 50 AFTER `targetType`,
  ADD COLUMN `sentToday` int DEFAULT 0 AFTER `dailyLimit`,
  ADD COLUMN `lastSendDate` varchar(10) DEFAULT NULL AFTER `sentToday`,
  ADD COLUMN `pausedAt` timestamp NULL DEFAULT NULL AFTER `lastSendDate`;

-- Campaign sequences: add scheduledDate for follow-up scheduling
ALTER TABLE `campaignSequences`
  ADD COLUMN `scheduledDate` varchar(10) DEFAULT NULL AFTER `delayDays`;

-- Campaign send log for daily limit tracking
CREATE TABLE IF NOT EXISTS `campaignSendLog` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `campaignId` int NOT NULL,
  `sendDate` date NOT NULL,
  `sendCount` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_csl_campaign_date` (`campaignId`, `sendDate`)
);
