-- Migration 0008: Create all tables defined in schema.ts that were missing from previous migrations
-- Safe to run multiple times: all CREATE TABLE statements use IF NOT EXISTS.

-- Admin sessions for time-limited admin access
CREATE TABLE IF NOT EXISTS `adminSessions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `expiresAt` timestamp NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `adminSessions_id` PRIMARY KEY(`id`)
);

-- Admin unlock attempts tracking for rate limiting
CREATE TABLE IF NOT EXISTS `adminUnlockAttempts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `attempts` int NOT NULL DEFAULT 0,
  `lockedUntil` timestamp NULL,
  `lastAttemptAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `adminUnlockAttempts_id` PRIMARY KEY(`id`),
  CONSTRAINT `adminUnlockAttempts_userId_unique` UNIQUE(`userId`)
);

-- Stables/Teams for multi-user management
CREATE TABLE IF NOT EXISTS `stables` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `ownerId` int NOT NULL,
  `location` varchar(255),
  `logo` text,
  `primaryColor` varchar(7),
  `secondaryColor` varchar(7),
  `customDomain` varchar(255),
  `branding` text,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `stables_id` PRIMARY KEY(`id`)
);

-- Stable members with role-based permissions
CREATE TABLE IF NOT EXISTS `stableMembers` (
  `id` int AUTO_INCREMENT NOT NULL,
  `stableId` int NOT NULL,
  `userId` int NOT NULL,
  `role` enum('owner','admin','trainer','member','viewer') NOT NULL,
  `permissions` text,
  `isActive` boolean NOT NULL DEFAULT true,
  `joinedAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `stableMembers_id` PRIMARY KEY(`id`)
);

-- Invitations to join stables
CREATE TABLE IF NOT EXISTS `stableInvites` (
  `id` int AUTO_INCREMENT NOT NULL,
  `stableId` int NOT NULL,
  `invitedByUserId` int NOT NULL,
  `email` varchar(320) NOT NULL,
  `role` enum('admin','trainer','member','viewer') NOT NULL,
  `token` varchar(100) NOT NULL,
  `status` enum('pending','accepted','declined','expired') NOT NULL DEFAULT 'pending',
  `expiresAt` timestamp NOT NULL,
  `acceptedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `stableInvites_id` PRIMARY KEY(`id`),
  CONSTRAINT `stableInvites_token_unique` UNIQUE(`token`)
);

-- Events and calendar
CREATE TABLE IF NOT EXISTS `events` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `stableId` int,
  `horseId` int,
  `title` varchar(200) NOT NULL,
  `description` text,
  `eventType` enum('training','competition','veterinary','farrier','lesson','meeting','other') NOT NULL,
  `startDate` timestamp NOT NULL,
  `endDate` timestamp NULL,
  `location` varchar(255),
  `isAllDay` boolean NOT NULL DEFAULT false,
  `isRecurring` boolean NOT NULL DEFAULT false,
  `recurrenceRule` text,
  `color` varchar(7),
  `isCompleted` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `events_id` PRIMARY KEY(`id`)
);

-- Event reminders
CREATE TABLE IF NOT EXISTS `eventReminders` (
  `id` int AUTO_INCREMENT NOT NULL,
  `eventId` int NOT NULL,
  `userId` int NOT NULL,
  `reminderTime` timestamp NOT NULL,
  `reminderType` enum('email','push','sms') NOT NULL,
  `isSent` boolean NOT NULL DEFAULT false,
  `sentAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `eventReminders_id` PRIMARY KEY(`id`)
);

-- Feed costs tracking
CREATE TABLE IF NOT EXISTS `feedCosts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `horseId` int,
  `feedType` varchar(100) NOT NULL,
  `brandName` varchar(100),
  `quantity` varchar(50) NOT NULL,
  `unit` varchar(20),
  `costPerUnit` int NOT NULL,
  `purchaseDate` date NOT NULL,
  `supplier` varchar(200),
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `feedCosts_id` PRIMARY KEY(`id`)
);

-- Vaccinations tracking
CREATE TABLE IF NOT EXISTS `vaccinations` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `vaccineName` varchar(200) NOT NULL,
  `vaccineType` varchar(100),
  `dateAdministered` date NOT NULL,
  `nextDueDate` date,
  `batchNumber` varchar(100),
  `vetName` varchar(100),
  `vetClinic` varchar(200),
  `cost` int,
  `notes` text,
  `documentUrl` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `vaccinations_id` PRIMARY KEY(`id`)
);

-- Deworming tracking
CREATE TABLE IF NOT EXISTS `dewormings` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `productName` varchar(200) NOT NULL,
  `activeIngredient` varchar(200),
  `dateAdministered` date NOT NULL,
  `nextDueDate` date,
  `dosage` varchar(100),
  `weight` int,
  `cost` int,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `dewormings_id` PRIMARY KEY(`id`)
);

-- Shareable profile links
CREATE TABLE IF NOT EXISTS `shareLinks` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `horseId` int,
  `linkType` enum('horse','stable','medical_passport') NOT NULL,
  `token` varchar(100) NOT NULL,
  `isPublic` boolean NOT NULL DEFAULT false,
  `isActive` boolean NOT NULL DEFAULT true,
  `expiresAt` timestamp NULL,
  `viewCount` int NOT NULL DEFAULT 0,
  `lastViewedAt` timestamp NULL,
  `settings` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `shareLinks_id` PRIMARY KEY(`id`),
  CONSTRAINT `shareLinks_token_unique` UNIQUE(`token`)
);

-- Competitions tracking
CREATE TABLE IF NOT EXISTS `competitions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `horseId` int NOT NULL,
  `competitionName` varchar(200) NOT NULL,
  `venue` varchar(200),
  `date` date NOT NULL,
  `discipline` varchar(100),
  `level` varchar(50),
  `class` varchar(100),
  `placement` varchar(50),
  `score` varchar(50),
  `notes` text,
  `cost` int,
  `winnings` int,
  `documentUrl` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `competitions_id` PRIMARY KEY(`id`)
);

-- Document tags for better organization
CREATE TABLE IF NOT EXISTS `documentTags` (
  `id` int AUTO_INCREMENT NOT NULL,
  `documentId` int NOT NULL,
  `tag` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `documentTags_id` PRIMARY KEY(`id`)
);

-- Stripe webhook events for idempotency
CREATE TABLE IF NOT EXISTS `stripeEvents` (
  `id` int AUTO_INCREMENT NOT NULL,
  `eventId` varchar(255) NOT NULL,
  `eventType` varchar(100) NOT NULL,
  `processed` boolean NOT NULL DEFAULT false,
  `payload` text,
  `error` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `processedAt` timestamp NULL,
  CONSTRAINT `stripeEvents_id` PRIMARY KEY(`id`),
  CONSTRAINT `stripeEvents_eventId_unique` UNIQUE(`eventId`)
);

-- Message threads for stable communication
CREATE TABLE IF NOT EXISTS `messageThreads` (
  `id` int AUTO_INCREMENT NOT NULL,
  `stableId` int NOT NULL,
  `title` varchar(200),
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `messageThreads_id` PRIMARY KEY(`id`)
);

-- Messages for in-app communication
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int AUTO_INCREMENT NOT NULL,
  `threadId` int NOT NULL,
  `senderId` int NOT NULL,
  `content` text NOT NULL,
  `attachments` text,
  `isRead` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);

-- Competition results with detailed scoring
CREATE TABLE IF NOT EXISTS `competitionResults` (
  `id` int AUTO_INCREMENT NOT NULL,
  `competitionId` int NOT NULL,
  `userId` int NOT NULL,
  `horseId` int NOT NULL,
  `roundNumber` int DEFAULT 1,
  `score` varchar(50),
  `penalties` int,
  `time` varchar(20),
  `judgeScores` text,
  `technicalScore` int,
  `artisticScore` int,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `competitionResults_id` PRIMARY KEY(`id`)
);

-- Training program templates
CREATE TABLE IF NOT EXISTS `trainingProgramTemplates` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `stableId` int,
  `name` varchar(200) NOT NULL,
  `description` text,
  `duration` int,
  `discipline` varchar(100),
  `level` varchar(50),
  `goals` text,
  `programData` text NOT NULL,
  `isPublic` boolean NOT NULL DEFAULT false,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `trainingProgramTemplates_id` PRIMARY KEY(`id`)
);

-- Training programs (instances of templates)
CREATE TABLE IF NOT EXISTS `trainingPrograms` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `templateId` int,
  `name` varchar(200) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date,
  `status` enum('active','completed','paused','cancelled') NOT NULL DEFAULT 'active',
  `progress` int DEFAULT 0,
  `programData` text NOT NULL,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `trainingPrograms_id` PRIMARY KEY(`id`)
);

-- Automated reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `stableId` int,
  `horseId` int,
  `reportType` enum('monthly_summary','health_report','training_progress','cost_analysis','competition_summary') NOT NULL,
  `title` varchar(200) NOT NULL,
  `reportData` text NOT NULL,
  `fileUrl` text,
  `generatedAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);

-- Report schedules for automation
CREATE TABLE IF NOT EXISTS `reportSchedules` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `stableId` int,
  `reportType` enum('monthly_summary','health_report','training_progress','cost_analysis','competition_summary') NOT NULL,
  `frequency` enum('daily','weekly','monthly','quarterly') NOT NULL,
  `recipients` text,
  `isActive` boolean NOT NULL DEFAULT true,
  `lastRunAt` timestamp NULL,
  `nextRunAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `reportSchedules_id` PRIMARY KEY(`id`)
);

-- Breeding records
CREATE TABLE IF NOT EXISTS `breeding` (
  `id` int AUTO_INCREMENT NOT NULL,
  `mareId` int NOT NULL,
  `stallionId` int,
  `stallionName` varchar(200),
  `breedingDate` date NOT NULL,
  `method` enum('natural','artificial','embryo_transfer') NOT NULL,
  `veterinarianName` varchar(100),
  `cost` int,
  `pregnancyConfirmed` boolean DEFAULT false,
  `confirmationDate` date,
  `dueDate` date,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `breeding_id` PRIMARY KEY(`id`)
);

-- Foal tracking
CREATE TABLE IF NOT EXISTS `foals` (
  `id` int AUTO_INCREMENT NOT NULL,
  `breedingId` int NOT NULL,
  `horseId` int,
  `birthDate` date NOT NULL,
  `gender` enum('colt','filly'),
  `name` varchar(100),
  `color` varchar(50),
  `markings` text,
  `birthWeight` int,
  `currentWeight` int,
  `healthStatus` varchar(100),
  `milestones` text,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `foals_id` PRIMARY KEY(`id`)
);

-- Pedigree information
CREATE TABLE IF NOT EXISTS `pedigree` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `sireId` int,
  `sireName` varchar(200),
  `damId` int,
  `damName` varchar(200),
  `sireOfSireId` int,
  `sireOfSireName` varchar(200),
  `damOfSireId` int,
  `damOfSireName` varchar(200),
  `sireOfDamId` int,
  `sireOfDamName` varchar(200),
  `damOfDamId` int,
  `damOfDamName` varchar(200),
  `geneticInfo` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pedigree_id` PRIMARY KEY(`id`)
);

-- Lesson bookings for trainers
CREATE TABLE IF NOT EXISTS `lessonBookings` (
  `id` int AUTO_INCREMENT NOT NULL,
  `trainerId` int NOT NULL,
  `clientId` int NOT NULL,
  `horseId` int,
  `lessonDate` timestamp NOT NULL,
  `duration` int NOT NULL,
  `lessonType` varchar(100),
  `location` varchar(200),
  `status` enum('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
  `fee` int,
  `paid` boolean NOT NULL DEFAULT false,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `lessonBookings_id` PRIMARY KEY(`id`)
);

-- Trainer availability
CREATE TABLE IF NOT EXISTS `trainerAvailability` (
  `id` int AUTO_INCREMENT NOT NULL,
  `trainerId` int NOT NULL,
  `dayOfWeek` int NOT NULL,
  `startTime` varchar(5) NOT NULL,
  `endTime` varchar(5) NOT NULL,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `trainerAvailability_id` PRIMARY KEY(`id`)
);

-- Feature flags for account-level feature enablement
CREATE TABLE IF NOT EXISTS `accountFeatures` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `horsesEnabled` boolean NOT NULL DEFAULT true,
  `healthEnabled` boolean NOT NULL DEFAULT true,
  `trainingEnabled` boolean NOT NULL DEFAULT true,
  `breedingEnabled` boolean NOT NULL DEFAULT false,
  `financeEnabled` boolean NOT NULL DEFAULT false,
  `salesEnabled` boolean NOT NULL DEFAULT false,
  `teamsEnabled` boolean NOT NULL DEFAULT false,
  `advancedReportsEnabled` boolean NOT NULL DEFAULT false,
  `peppolEnabled` boolean NOT NULL DEFAULT false,
  `aiInvoiceScanEnabled` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `accountFeatures_id` PRIMARY KEY(`id`),
  CONSTRAINT `accountFeatures_userId_unique` UNIQUE(`userId`)
);

-- API keys for third-party integrations
CREATE TABLE IF NOT EXISTS `apiKeys` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `stableId` int,
  `name` varchar(100) NOT NULL,
  `keyHash` varchar(255) NOT NULL,
  `keyPrefix` varchar(20) NOT NULL,
  `permissions` text,
  `rateLimit` int NOT NULL DEFAULT 100,
  `isActive` boolean NOT NULL DEFAULT true,
  `lastUsedAt` timestamp NULL,
  `expiresAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `apiKeys_id` PRIMARY KEY(`id`)
);

-- Webhooks for third-party integrations
CREATE TABLE IF NOT EXISTS `webhooks` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `stableId` int,
  `url` text NOT NULL,
  `events` text NOT NULL,
  `secret` varchar(255) NOT NULL,
  `isActive` boolean NOT NULL DEFAULT true,
  `lastTriggeredAt` timestamp NULL,
  `failureCount` int DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `webhooks_id` PRIMARY KEY(`id`)
);

-- Tasks system for general horse care and management
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `horseId` int,
  `title` varchar(200) NOT NULL,
  `description` text,
  `taskType` enum('hoofcare','health_appointment','treatment','vaccination','deworming','dental','general_care','training','feeding','other') NOT NULL,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `dueDate` date,
  `completedAt` timestamp NULL,
  `assignedTo` varchar(100),
  `notes` text,
  `reminderDays` int DEFAULT 1,
  `isRecurring` boolean NOT NULL DEFAULT false,
  `recurringInterval` enum('daily','weekly','biweekly','monthly','quarterly','yearly'),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);

-- Contacts for vets, farriers, trainers, etc.
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `contactType` enum('vet','farrier','trainer','instructor','stable','breeder','supplier','emergency','other') NOT NULL,
  `company` varchar(200),
  `email` varchar(320),
  `phone` varchar(20),
  `mobile` varchar(20),
  `address` text,
  `city` varchar(100),
  `postcode` varchar(20),
  `country` varchar(100) DEFAULT 'United Kingdom',
  `website` varchar(500),
  `notes` text,
  `isPrimary` boolean NOT NULL DEFAULT false,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);

-- Treatments module
CREATE TABLE IF NOT EXISTS `treatments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `treatmentType` varchar(100) NOT NULL,
  `treatmentName` varchar(200) NOT NULL,
  `description` text,
  `startDate` date NOT NULL,
  `endDate` date,
  `frequency` varchar(100),
  `dosage` varchar(200),
  `administeredBy` varchar(100),
  `vetName` varchar(100),
  `vetClinic` varchar(200),
  `cost` int,
  `status` enum('active','completed','discontinued') NOT NULL DEFAULT 'active',
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `treatments_id` PRIMARY KEY(`id`)
);

-- Health appointments module
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `appointmentType` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `appointmentDate` date NOT NULL,
  `appointmentTime` varchar(10),
  `duration` int,
  `providerName` varchar(100),
  `providerPhone` varchar(20),
  `providerClinic` varchar(200),
  `location` varchar(200),
  `cost` int,
  `status` enum('scheduled','confirmed','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `reminderSent` boolean NOT NULL DEFAULT false,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);

-- Dental care module
CREATE TABLE IF NOT EXISTS `dentalCare` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `examDate` date NOT NULL,
  `dentistName` varchar(100),
  `dentistClinic` varchar(200),
  `procedureType` varchar(200),
  `findings` text,
  `treatmentPerformed` text,
  `nextDueDate` date,
  `cost` int,
  `sedationUsed` boolean NOT NULL DEFAULT false,
  `teethCondition` enum('excellent','good','fair','poor'),
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `dentalCare_id` PRIMARY KEY(`id`)
);

-- X-rays module
CREATE TABLE IF NOT EXISTS `xrays` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `xrayDate` date NOT NULL,
  `bodyPart` varchar(100) NOT NULL,
  `reason` varchar(200),
  `vetName` varchar(100),
  `vetClinic` varchar(200),
  `findings` text,
  `diagnosis` text,
  `fileUrl` text,
  `fileName` varchar(255),
  `fileSize` int,
  `mimeType` varchar(100),
  `cost` int,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `xrays_id` PRIMARY KEY(`id`)
);

-- Tags module
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(20),
  `category` varchar(50),
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);

-- Hoofcare module
CREATE TABLE IF NOT EXISTS `hoofcare` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `careDate` date NOT NULL,
  `careType` enum('shoeing','trimming','remedial','inspection','other') NOT NULL,
  `farrierName` varchar(100),
  `farrierPhone` varchar(20),
  `hoofCondition` enum('excellent','good','fair','poor'),
  `shoesType` varchar(100),
  `findings` text,
  `workPerformed` text,
  `nextDueDate` date,
  `cost` int,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `hoofcare_id` PRIMARY KEY(`id`)
);

-- Nutrition logs module
CREATE TABLE IF NOT EXISTS `nutritionLogs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `logDate` date NOT NULL,
  `feedType` varchar(100) NOT NULL,
  `feedName` varchar(200),
  `amount` varchar(100),
  `mealTime` varchar(50),
  `supplements` text,
  `hay` varchar(100),
  `water` varchar(100),
  `bodyConditionScore` int,
  `weight` int,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `nutritionLogs_id` PRIMARY KEY(`id`)
);

-- Nutrition plans module
CREATE TABLE IF NOT EXISTS `nutritionPlans` (
  `id` int AUTO_INCREMENT NOT NULL,
  `horseId` int NOT NULL,
  `userId` int NOT NULL,
  `planName` varchar(200) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date,
  `targetWeight` int,
  `targetBodyCondition` int,
  `dailyHay` varchar(100),
  `dailyConcentrates` varchar(200),
  `supplements` text,
  `specialInstructions` text,
  `feedingSchedule` text,
  `caloriesPerDay` int,
  `proteinPerDay` varchar(50),
  `isActive` boolean NOT NULL DEFAULT true,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `nutritionPlans_id` PRIMARY KEY(`id`)
);
