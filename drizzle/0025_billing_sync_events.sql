CREATE TABLE IF NOT EXISTS `billingSyncEvents` (
  `id` int AUTO_INCREMENT NOT NULL,
  `applicationId` varchar(80) NOT NULL,
  `eventId` varchar(160) NOT NULL,
  `nonce` varchar(160) NOT NULL,
  `product` varchar(32) NOT NULL,
  `externalUserId` int NOT NULL,
  `organizationId` int,
  `billingStatus` varchar(32) NOT NULL,
  `payloadHash` varchar(64) NOT NULL,
  `processedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `billingSyncEvents_id` PRIMARY KEY(`id`),
  CONSTRAINT `billingSyncEvents_eventId_unique` UNIQUE(`eventId`),
  CONSTRAINT `billingSyncEvents_nonce_unique` UNIQUE(`nonce`)
);
