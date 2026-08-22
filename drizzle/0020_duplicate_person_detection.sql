-- Phase 4: Duplicate-person detection
-- Adds two columns to marketingContacts to store the results of the
-- deterministic fuzzy duplicate-person scan.
--
-- suspectedDuplicateOf : FK-style reference to the primary contact's id.
--                        NULL means no duplicate suspected.
--                        When set, autopilot enrollment skips this contact
--                        until an admin manually clears the flag.
--
-- dupRiskScore          : 0–100 integer score produced by the trigram + domain
--                         + geography scoring algorithm.  NULL when not yet
--                         scanned.  >= 55 triggers the flag.

ALTER TABLE `marketingContacts`
  ADD COLUMN `suspectedDuplicateOf` int DEFAULT NULL AFTER `lastContactedAt`,
  ADD COLUMN `dupRiskScore` tinyint unsigned DEFAULT NULL AFTER `suspectedDuplicateOf`;

-- Index lets the autopilot quickly skip flagged rows
ALTER TABLE `marketingContacts`
  ADD KEY `idx_mc_dup_of` (`suspectedDuplicateOf`);
