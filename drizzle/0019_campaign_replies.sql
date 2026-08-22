-- Campaign replies table — stores IMAP-fetched replies for operator visibility
CREATE TABLE IF NOT EXISTS `campaignReplies` (
  `id` int AUTO_INCREMENT NOT NULL,
  `messageId` varchar(500) NOT NULL,
  `fromEmail` varchar(320) NOT NULL,
  `fromName` varchar(200),
  `subject` varchar(500),
  `snippet` text,
  `receivedAt` timestamp NOT NULL,
  `matchedCampaignId` int,
  `matchedContactId` int,
  `status` varchar(30) NOT NULL DEFAULT 'new',
  `notes` text,
  `sequenceStopped` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `campaignReplies_pk` PRIMARY KEY(`id`)
);

-- Prevent duplicate message ingestion
CREATE UNIQUE INDEX IF NOT EXISTS `campaignReplies_messageId_idx`
  ON `campaignReplies` (`messageId`(250));
