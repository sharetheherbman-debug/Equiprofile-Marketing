import type { Connection } from "mysql2/promise";

async function assertNoRows(connection: Connection, query: string, description: string) {
  const [rows] = await connection.query<Array<{ invalidCount: number | string }>>(query);
  const invalidCount = Number(rows[0]?.invalidCount ?? 0);
  if (invalidCount > 0) {
    throw new Error(`Supported Management upgrade refused before mutation: ${description} (${invalidCount} row(s)).`);
  }
}

/**
 * Validates that existing values can be represented by the final typed contract
 * before MySQL applies a non-transactional MODIFY COLUMN statement. This is
 * deliberately narrow: it is only invoked after the read-only inspector has
 * recognised the exact five-entry canonical Management baseline.
 */
export async function validateSupportedManagementBaselineData(connection: Connection) {
  await assertNoRows(
    connection,
    "SELECT COUNT(*) AS invalidCount FROM breeding WHERE method IS NULL OR method NOT IN ('natural', 'artificial', 'embryo_transfer')",
    "breeding.method contains a value outside the final enum",
  );
  await assertNoRows(
    connection,
    "SELECT COUNT(*) AS invalidCount FROM breeding WHERE pregnancyConfirmed IS NOT NULL AND pregnancyConfirmed NOT IN (0, 1)",
    "breeding.pregnancyConfirmed is not boolean-compatible",
  );
  await assertNoRows(
    connection,
    "SELECT COUNT(*) AS invalidCount FROM competitionResults WHERE (technicalScore IS NOT NULL AND CAST(technicalScore AS CHAR) NOT REGEXP '^-?[0-9]+$') OR (artisticScore IS NOT NULL AND CAST(artisticScore AS CHAR) NOT REGEXP '^-?[0-9]+$')",
    "competition scores are not integer-compatible",
  );
  await assertNoRows(
    connection,
    "SELECT COUNT(*) AS invalidCount FROM foals WHERE breedingId IS NULL OR (gender IS NOT NULL AND gender NOT IN ('colt', 'filly')) OR (healthStatus IS NOT NULL AND CHAR_LENGTH(healthStatus) > 100)",
    "foal values cannot be represented by the final contract",
  );
  await assertNoRows(
    connection,
    "SELECT COUNT(*) AS invalidCount FROM trainingPrograms WHERE status IS NULL OR status NOT IN ('active', 'completed', 'paused', 'cancelled') OR (progress IS NOT NULL AND CAST(progress AS CHAR) NOT REGEXP '^-?[0-9]+$') OR programData IS NULL",
    "training program values cannot be represented by the final contract",
  );
  await assertNoRows(
    connection,
    "SELECT COUNT(*) AS invalidCount FROM (SELECT campaignId, email FROM emailCampaignRecipients GROUP BY campaignId, email HAVING COUNT(*) > 1) AS duplicateRecipients",
    "email campaign recipients contain duplicate campaign/email pairs required to be unique",
  );
}

export async function applySupportedManagementBaselineForwardContract(connection: Connection) {
  await validateSupportedManagementBaselineData(connection);
  const statements = [
    `CREATE TABLE IF NOT EXISTS \`rides\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`userId\` int NOT NULL,
      \`horseId\` int,
      \`name\` varchar(200) NOT NULL,
      \`startTime\` timestamp NOT NULL,
      \`endTime\` timestamp NULL,
      \`duration\` int NOT NULL,
      \`distance\` int NOT NULL,
      \`avgSpeed\` int NOT NULL DEFAULT 0,
      \`maxSpeed\` int NOT NULL DEFAULT 0,
      \`routeData\` text,
      \`notes\` text,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT \`rides_id\` PRIMARY KEY(\`id\`)
    )`,
    "ALTER TABLE `breeding` MODIFY COLUMN `method` enum('natural','artificial','embryo_transfer') NOT NULL, MODIFY COLUMN `pregnancyConfirmed` boolean DEFAULT false",
    "ALTER TABLE `competitionResults` MODIFY COLUMN `technicalScore` int NULL, MODIFY COLUMN `artisticScore` int NULL",
    "ALTER TABLE `foals` MODIFY COLUMN `breedingId` int NOT NULL, MODIFY COLUMN `gender` enum('colt','filly') NULL, MODIFY COLUMN `healthStatus` varchar(100) NULL",
    "ALTER TABLE `trainingPrograms` MODIFY COLUMN `status` enum('active','completed','paused','cancelled') NOT NULL DEFAULT 'active', MODIFY COLUMN `progress` int NULL DEFAULT 0, MODIFY COLUMN `programData` text NOT NULL",
    "CREATE UNIQUE INDEX IF NOT EXISTS `ecr_campaign_email_idx` ON `emailCampaignRecipients` (`campaignId`, `email`)",
  ];
  for (const statement of statements) await connection.query(statement);
  return { statementCount: statements.length };
}
