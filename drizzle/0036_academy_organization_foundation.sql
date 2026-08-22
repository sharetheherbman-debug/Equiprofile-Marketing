-- Academy organisation foundation.
-- These tables are part of the canonical Academy role, invite, and seat-limit
-- contract. Additive only: retained database terminology is a compatibility
-- boundary while public product terminology is Academy.

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ownerId` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `planTier` VARCHAR(30) NOT NULL DEFAULT 'school_10',
  `maxStudents` INT NOT NULL DEFAULT 10,
  `maxTeachers` INT NOT NULL DEFAULT 3,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `trialEndsAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_organizations_owner` (`ownerId`)
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `organizationMembers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organizationId` INT NOT NULL,
  `userId` INT NOT NULL,
  `role` VARCHAR(30) NOT NULL,
  `joinedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `organizationMembers_organization_user` (`organizationId`, `userId`),
  KEY `idx_organizationMembers_user` (`userId`),
  CONSTRAINT `fk_organizationMembers_organization`
    FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `organizationInvites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organizationId` INT NOT NULL,
  `invitedEmail` VARCHAR(320) NOT NULL,
  `role` VARCHAR(30) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `acceptedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `organizationInvites_token` (`token`),
  KEY `idx_organizationInvites_organization` (`organizationId`),
  CONSTRAINT `fk_organizationInvites_organization`
    FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
