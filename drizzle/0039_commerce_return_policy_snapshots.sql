-- Additive item-level return-policy snapshots.
-- Product policy is an operational merchant setting, not a statement of statutory
-- rights. Order items snapshot the policy and cut-off used at checkout so later
-- product edits cannot change a completed order's return eligibility.

ALTER TABLE `commerceProducts`
  ADD COLUMN IF NOT EXISTS `returnEligibility` ENUM('standard','not_returnable','review_required')
    NOT NULL DEFAULT 'review_required';
--> statement-breakpoint

ALTER TABLE `commerceOrderItems`
  ADD COLUMN IF NOT EXISTS `returnEligibility` ENUM('standard','not_returnable','review_required')
    NOT NULL DEFAULT 'review_required',
  ADD COLUMN IF NOT EXISTS `returnWindowDays` INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `returnWindowEndsAt` TIMESTAMP NULL;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS `idx_commerceOrderItems_returnWindow`
  ON `commerceOrderItems` (`orderId`, `returnEligibility`, `returnWindowEndsAt`);
