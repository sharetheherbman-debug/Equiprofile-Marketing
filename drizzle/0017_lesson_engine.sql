-- Lesson Engine tables

CREATE TABLE IF NOT EXISTS `lessonPathways` (
  `id` int AUTO_INCREMENT NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  `iconName` varchar(50),
  `isPublished` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `lessonPathways_id` PRIMARY KEY(`id`),
  CONSTRAINT `lessonPathways_slug` UNIQUE(`slug`)
);

CREATE TABLE IF NOT EXISTS `lessonUnits` (
  `id` int AUTO_INCREMENT NOT NULL,
  `slug` varchar(150) NOT NULL,
  `pathwaySlug` varchar(100) NOT NULL,
  `title` varchar(250) NOT NULL,
  `level` varchar(30) NOT NULL,
  `category` varchar(60) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT 0,
  `objectives` text NOT NULL,
  `content` text NOT NULL,
  `keyPoints` text NOT NULL,
  `safetyNote` text NOT NULL,
  `practicalApplication` text NOT NULL,
  `commonMistakes` text NOT NULL,
  `knowledgeCheck` text NOT NULL,
  `aiTutorPrompts` text NOT NULL,
  `isPublished` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `lessonUnits_id` PRIMARY KEY(`id`),
  CONSTRAINT `lessonUnits_slug` UNIQUE(`slug`)
);

CREATE TABLE IF NOT EXISTS `lessonCompletion` (
  `id` int AUTO_INCREMENT NOT NULL,
  `studentUserId` int NOT NULL,
  `lessonSlug` varchar(150) NOT NULL,
  `pathwaySlug` varchar(100) NOT NULL,
  `level` varchar(30) NOT NULL,
  `score` int,
  `completedAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `lessonCompletion_id` PRIMARY KEY(`id`)
);

CREATE INDEX `idx_lessonUnits_pathwaySlug` ON `lessonUnits` (`pathwaySlug`);
CREATE INDEX `idx_lessonUnits_level` ON `lessonUnits` (`level`);
CREATE INDEX `idx_lessonCompletion_studentUserId` ON `lessonCompletion` (`studentUserId`);
CREATE INDEX `idx_lessonCompletion_lessonSlug` ON `lessonCompletion` (`lessonSlug`);
