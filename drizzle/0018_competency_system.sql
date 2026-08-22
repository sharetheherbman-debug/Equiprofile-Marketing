-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 2: Competency System + Teacher Lesson Assignment + Lesson Reviews
-- ─────────────────────────────────────────────────────────────────────────────

-- Student competencies (teacher sign-off)
CREATE TABLE IF NOT EXISTS `studentCompetencies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `competencyKey` VARCHAR(100) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `level` VARCHAR(30) NOT NULL DEFAULT 'beginner',
  `status` ENUM('not_assessed','in_progress','achieved','needs_support') NOT NULL DEFAULT 'not_assessed',
  `teacherComment` TEXT,
  `signedOffBy` INT,
  `signedOffAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_studentCompetencies_userId ON `studentCompetencies`(`userId`);
CREATE INDEX idx_studentCompetencies_status ON `studentCompetencies`(`status`);
CREATE UNIQUE INDEX idx_studentCompetencies_unique ON `studentCompetencies`(`userId`, `competencyKey`);

-- Teacher lesson assignments
CREATE TABLE IF NOT EXISTS `teacherLessonAssignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `teacherId` INT NOT NULL,
  `studentUserId` INT,
  `groupId` INT,
  `assignmentType` ENUM('lesson','pathway') NOT NULL DEFAULT 'lesson',
  `lessonSlug` VARCHAR(150),
  `pathwaySlug` VARCHAR(100),
  `dueDate` DATE,
  `instructions` TEXT,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_teacherLessonAssignments_teacherId ON `teacherLessonAssignments`(`teacherId`);
CREATE INDEX idx_teacherLessonAssignments_studentUserId ON `teacherLessonAssignments`(`studentUserId`);
CREATE INDEX idx_teacherLessonAssignments_groupId ON `teacherLessonAssignments`(`groupId`);

-- Lesson reviews (teacher feedback on completed lessons)
CREATE TABLE IF NOT EXISTS `lessonReviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `teacherId` INT NOT NULL,
  `studentUserId` INT NOT NULL,
  `lessonSlug` VARCHAR(150) NOT NULL,
  `lessonCompletionId` INT,
  `reviewStatus` ENUM('satisfactory','needs_improvement') NOT NULL DEFAULT 'satisfactory',
  `feedback` TEXT,
  `recommendedNextLesson` VARCHAR(150),
  `competencyKey` VARCHAR(100),
  `isRead` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessonReviews_teacherId ON `lessonReviews`(`teacherId`);
CREATE INDEX idx_lessonReviews_studentUserId ON `lessonReviews`(`studentUserId`);
CREATE INDEX idx_lessonReviews_lessonSlug ON `lessonReviews`(`lessonSlug`);
