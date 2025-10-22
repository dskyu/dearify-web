ALTER TABLE `t_user_assets` ADD `provider_job_id` varchar(255);--> statement-breakpoint
ALTER TABLE `t_user_assets` ADD `finished_at` datetime;--> statement-breakpoint
ALTER TABLE `t_user_assets` DROP COLUMN `ref_asset_id`;