-- PR64G: universal product truth category for marketing profiles.

ALTER TABLE `marketingProductProfiles`
  ADD COLUMN IF NOT EXISTS `category` varchar(120) NOT NULL DEFAULT 'unknown' AFTER `appName`;
