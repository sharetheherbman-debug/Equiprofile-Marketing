-- EquiProfile Academy curriculum integrity and import provenance.
-- Additive only: historic lesson records remain untouched and may retain NULL completion keys.

ALTER TABLE `lessonPathways`
  ADD COLUMN IF NOT EXISTS `curriculumVersion` VARCHAR(40) NOT NULL DEFAULT '2026.1';
--> statement-breakpoint

ALTER TABLE `lessonUnits`
  ADD COLUMN IF NOT EXISTS `linkedCompetencies` TEXT NOT NULL,
  ADD COLUMN IF NOT EXISTS `nextLessonSlug` VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS `estimatedMinutes` INT NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS `curriculumVersion` VARCHAR(40) NOT NULL DEFAULT '2026.1';
--> statement-breakpoint

ALTER TABLE `lessonCompletion`
  ADD COLUMN IF NOT EXISTS `completionKey` VARCHAR(220) NULL,
  ADD COLUMN IF NOT EXISTS `curriculumVersion` VARCHAR(40) NULL,
  ADD COLUMN IF NOT EXISTS `quizCorrect` INT NULL,
  ADD COLUMN IF NOT EXISTS `quizTotal` INT NULL;
--> statement-breakpoint

-- Existing historic rows have a NULL key and are retained as-is. New trusted
-- completions use a stable user-and-lesson key, which prevents race duplicates.
CREATE UNIQUE INDEX IF NOT EXISTS `idx_lessonCompletion_completionKey`
  ON `lessonCompletion` (`completionKey`);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS `idx_lessonUnits_published_pathway_order`
  ON `lessonUnits` (`isPublished`, `pathwaySlug`, `sortOrder`);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `academyCurriculumSyncRuns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `curriculumVersion` VARCHAR(40) NOT NULL,
  `pathwaysProcessed` INT NOT NULL DEFAULT 0,
  `lessonsProcessed` INT NOT NULL DEFAULT 0,
  `validationErrors` INT NOT NULL DEFAULT 0,
  `validationWarnings` INT NOT NULL DEFAULT 0,
  `summaryJson` TEXT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_academyCurriculumSyncRuns_createdAt` (`createdAt`)
);
