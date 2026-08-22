-- Migration 0012: Email campaigns, campaign recipients, and site analytics tables

CREATE TABLE IF NOT EXISTS `emailCampaigns` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(200) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `htmlBody` text NOT NULL,
  `templateId` varchar(50),
  `segment` varchar(50) NOT NULL,
  `customFilter` text,
  `recipientCount` int NOT NULL DEFAULT 0,
  `sentCount` int NOT NULL DEFAULT 0,
  `failedCount` int NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'draft',
  `sentAt` timestamp NULL,
  `sentByUserId` int,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `emailCampaignRecipients` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `campaignId` int NOT NULL,
  `email` varchar(320) NOT NULL,
  `name` varchar(200),
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `sentAt` timestamp NULL,
  `error` text
);

CREATE INDEX IF NOT EXISTS `ecr_campaign_idx` ON `emailCampaignRecipients` (`campaignId`);
CREATE INDEX IF NOT EXISTS `ecr_email_idx` ON `emailCampaignRecipients` (`email`);
CREATE UNIQUE INDEX IF NOT EXISTS `ecr_campaign_email_idx` ON `emailCampaignRecipients` (`campaignId`, `email`);

CREATE TABLE IF NOT EXISTS `siteAnalytics` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `sessionId` varchar(64) NOT NULL,
  `visitorId` varchar(64) NOT NULL,
  `path` varchar(500) NOT NULL,
  `referrer` varchar(500),
  `userAgent` varchar(500),
  `deviceType` varchar(20),
  `country` varchar(10),
  `duration` int DEFAULT 0,
  `isCtaClick` boolean DEFAULT false,
  `ctaType` varchar(50),
  `userId` int,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS `sa_visitor_idx` ON `siteAnalytics` (`visitorId`);
CREATE INDEX IF NOT EXISTS `sa_session_idx` ON `siteAnalytics` (`sessionId`);
CREATE INDEX IF NOT EXISTS `sa_created_idx` ON `siteAnalytics` (`createdAt`);
CREATE INDEX IF NOT EXISTS `sa_path_idx` ON `siteAnalytics` (`path`);
