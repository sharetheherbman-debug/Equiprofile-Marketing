-- PR64E: reusable product marketing intelligence per host app workspace.

CREATE TABLE IF NOT EXISTS `marketingProductProfiles` (
  `id` int AUTO_INCREMENT NOT NULL,
  `tenantId` varchar(100) NOT NULL DEFAULT 'global',
  `workspaceId` varchar(120) NOT NULL DEFAULT 'default',
  `hostAppId` varchar(120) NOT NULL DEFAULT 'equiprofile',
  `appName` varchar(220) NOT NULL,
  `domain` varchar(300),
  `landingPageUrl` text,
  `signupUrl` text,
  `logoAssetId` int,
  `brandColorsJson` text,
  `targetAudiencesJson` text,
  `primaryOffer` text,
  `pricingDetails` text,
  `coreFeaturesJson` text,
  `benefitsJson` text,
  `painPointsSolvedJson` text,
  `objectionsJson` text,
  `proofPointsJson` text,
  `differentiatorsJson` text,
  `forbiddenClaimsJson` text,
  `toneOfVoiceJson` text,
  `ctaLibraryJson` text,
  `platformPositioningJson` text,
  `extractedSourceUrlsJson` text,
  `candidateLogoUrlsJson` text,
  `candidateLogoAssetIdsJson` text,
  `missingInfoJson` text,
  `rawScrapeSummaryJson` text,
  `sourceMode` varchar(40) NOT NULL DEFAULT 'manual',
  `confidenceScore` int NOT NULL DEFAULT 0,
  `lastScrapedAt` timestamp NULL,
  `confirmedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `marketingProductProfiles_id` PRIMARY KEY(`id`)
);

CREATE INDEX IF NOT EXISTS `idx_mproduct_profiles_scope`
  ON `marketingProductProfiles` (`tenantId`, `workspaceId`, `hostAppId`);
