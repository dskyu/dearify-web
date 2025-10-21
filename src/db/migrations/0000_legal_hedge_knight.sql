CREATE TABLE `t_affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_uuid` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`status` varchar(50) NOT NULL DEFAULT '',
	`invited_by` varchar(255) NOT NULL,
	`paid_order_no` varchar(255) NOT NULL DEFAULT '',
	`paid_amount` int NOT NULL DEFAULT 0,
	`reward_percent` int NOT NULL DEFAULT 0,
	`reward_amount` int NOT NULL DEFAULT 0,
	CONSTRAINT `t_affiliates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `t_apikeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`api_key` varchar(255) NOT NULL,
	`title` varchar(100),
	`user_uuid` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`status` varchar(50),
	CONSTRAINT `t_apikeys_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_apikeys_api_key_unique` UNIQUE(`api_key`)
);
--> statement-breakpoint
CREATE TABLE `t_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trans_no` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`user_uuid` varchar(255) NOT NULL,
	`trans_type` varchar(50) NOT NULL,
	`credits` int NOT NULL,
	`order_no` varchar(255),
	`expired_at` datetime,
	`description` text,
	`balance_after` int,
	CONSTRAINT `t_credits_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_credits_trans_no_unique` UNIQUE(`trans_no`)
);
--> statement-breakpoint
CREATE TABLE `t_email_verification_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`code` varchar(10) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`expired_at` datetime,
	`used` boolean NOT NULL DEFAULT false,
	`user_uuid` varchar(255),
	CONSTRAINT `t_email_verification_codes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `t_feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`status` varchar(50),
	`user_uuid` varchar(255),
	`content` text,
	`rating` int,
	CONSTRAINT `t_feedbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `t_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_no` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`user_uuid` varchar(255) NOT NULL DEFAULT '',
	`user_email` varchar(255) NOT NULL DEFAULT '',
	`amount` int NOT NULL,
	`interval` varchar(50),
	`expired_at` datetime,
	`status` varchar(50) NOT NULL,
	`stripe_session_id` varchar(255),
	`credits` int NOT NULL,
	`currency` varchar(50),
	`sub_id` varchar(255),
	`sub_interval_count` int,
	`sub_cycle_anchor` int,
	`sub_period_end` int,
	`sub_period_start` int,
	`sub_times` int,
	`product_id` varchar(255) NOT NULL DEFAULT '',
	`product_name` varchar(255),
	`valid_months` int,
	`order_detail` text,
	`paid_at` datetime,
	`paid_email` varchar(255),
	`paid_detail` text,
	CONSTRAINT `t_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_orders_order_no_unique` UNIQUE(`order_no`)
);
--> statement-breakpoint
CREATE TABLE `t_password_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`expired_at` datetime,
	`used` boolean NOT NULL DEFAULT false,
	`user_uuid` varchar(255),
	CONSTRAINT `t_password_reset_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `t_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(255) NOT NULL,
	`slug` varchar(255),
	`title` varchar(255),
	`description` text,
	`content` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime,
	`status` varchar(50),
	`cover_url` varchar(255),
	`author_name` varchar(255),
	`author_avatar_url` varchar(255),
	`locale` varchar(50),
	CONSTRAINT `t_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_posts_uuid_unique` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `t_user_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_uuid` varchar(255) NOT NULL,
	`asset_uuid` varchar(255) NOT NULL,
	`status` varchar(50),
	`type` varchar(50) NOT NULL DEFAULT 'image',
	`setup_options` json,
	`setup_urls` json,
	`prompt` varchar(255),
	`negative_prompt` varchar(255),
	`result_url` varchar(255),
	`result_detail` json,
	`ref_asset_id` varchar(255),
	`provider` varchar(50) NOT NULL DEFAULT '',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `t_user_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `t_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`nickname` varchar(255),
	`avatar_url` varchar(255),
	`locale` varchar(50),
	`signin_type` varchar(50),
	`signin_ip` varchar(255),
	`signin_provider` varchar(50),
	`signin_openid` varchar(255),
	`invite_code` varchar(255) NOT NULL DEFAULT '',
	`updated_at` datetime,
	`invited_by` varchar(255) NOT NULL DEFAULT '',
	`is_affiliate` boolean NOT NULL DEFAULT false,
	`email_verified` boolean NOT NULL DEFAULT false,
	`stripe_customer_id` varchar(255),
	`subscription_credits` int NOT NULL DEFAULT 0,
	`subscription_credits_reset_date` datetime,
	`subscription_expires_date` datetime,
	`subscription_product_id` varchar(255),
	`subscription_plan` varchar(50),
	`subscription_status` varchar(50) NOT NULL DEFAULT 'inactive',
	`subscription_order_no` varchar(255),
	CONSTRAINT `t_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_users_uuid_unique` UNIQUE(`uuid`),
	CONSTRAINT `email_provider_unique_idx` UNIQUE(`email`,`signin_provider`)
);
--> statement-breakpoint
CREATE INDEX `email_verification_email_idx` ON `t_email_verification_codes` (`email`);--> statement-breakpoint
CREATE INDEX `email_verification_code_idx` ON `t_email_verification_codes` (`code`);--> statement-breakpoint
CREATE INDEX `email_verification_expired_idx` ON `t_email_verification_codes` (`expired_at`);--> statement-breakpoint
CREATE INDEX `password_reset_email_idx` ON `t_password_reset_tokens` (`email`);--> statement-breakpoint
CREATE INDEX `password_reset_token_idx` ON `t_password_reset_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `password_reset_expired_idx` ON `t_password_reset_tokens` (`expired_at`);--> statement-breakpoint
CREATE INDEX `user_assets_user_idx` ON `t_user_assets` (`user_uuid`);--> statement-breakpoint
CREATE INDEX `user_assets_asset_idx` ON `t_user_assets` (`asset_uuid`);