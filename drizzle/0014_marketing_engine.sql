-- Marketing contacts table
CREATE TABLE IF NOT EXISTS `marketingContacts` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(320) NOT NULL,
  `name` varchar(200),
  `businessName` varchar(300),
  `contactType` varchar(50) DEFAULT 'individual',
  `source` varchar(100) DEFAULT 'manual',
  `tags` text,
  `region` varchar(100),
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `unsubscribeToken` varchar(64) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_mc_email` (`email`),
  KEY `idx_mc_status` (`status`),
  KEY `idx_mc_unsub_token` (`unsubscribeToken`)
);

-- Global email unsubscribe / suppression list
CREATE TABLE IF NOT EXISTS `emailUnsubscribes` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(320) NOT NULL,
  `token` varchar(64) NOT NULL,
  `reason` varchar(200),
  `source` varchar(50) DEFAULT 'link',
  `unsubscribedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_unsub_email` (`email`),
  KEY `idx_unsub_token` (`token`)
);

-- Campaign sequences (drip steps)
CREATE TABLE IF NOT EXISTS `campaignSequences` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `campaignId` int NOT NULL,
  `stepNumber` int NOT NULL,
  `delayDays` int NOT NULL,
  `subject` varchar(500) NOT NULL,
  `htmlBody` text NOT NULL,
  `templateId` varchar(50),
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `sentAt` timestamp NULL,
  `sentCount` int NOT NULL DEFAULT 0,
  `failedCount` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_seq_campaign` (`campaignId`)
);

-- Campaign sequence recipients
CREATE TABLE IF NOT EXISTS `campaignSequenceRecipients` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `sequenceId` int NOT NULL,
  `campaignId` int NOT NULL,
  `email` varchar(320) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `sentAt` timestamp NULL,
  `error` text,
  KEY `idx_seqr_sequence` (`sequenceId`),
  KEY `idx_seqr_campaign` (`campaignId`),
  KEY `idx_seqr_email` (`email`)
);
