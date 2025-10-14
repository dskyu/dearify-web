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
CREATE TABLE `t_app_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channel` varchar(50) NOT NULL,
	`country` varchar(50) NOT NULL,
	`language` varchar(50),
	`app_id` varchar(255) NOT NULL,
	`bundle_id` varchar(255),
	`name` varchar(255),
	`category` varchar(100),
	`category_id` varchar(100),
	`rating` varchar(10),
	`details` json,
	`reviews` json,
	`similar_apps` json,
	`report` json,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `t_app_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_search_unique_idx` UNIQUE(`channel`,`country`,`app_id`)
);
--> statement-breakpoint
CREATE TABLE `t_app_summaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL DEFAULT '',
	`user_uuid` varchar(255) NOT NULL,
	`channel` varchar(50) NOT NULL,
	`country` varchar(50) NOT NULL,
	`app_id` varchar(255) NOT NULL,
	`language` varchar(50),
	`app_name` varchar(255),
	`app_icon` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'show',
	`details` json,
	`summary` json,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `t_app_summaries_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_app_summaries_uuid_unique` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `t_chat_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(255) NOT NULL,
	`user_uuid` varchar(255) NOT NULL,
	`session_uuid` varchar(255) NOT NULL,
	`role` varchar(20) NOT NULL DEFAULT 'user',
	`message_type` varchar(50) NOT NULL DEFAULT 'text',
	`content` text NOT NULL,
	`input_tokens` int NOT NULL DEFAULT 0,
	`output_tokens` int NOT NULL DEFAULT 0,
	`model` varchar(100),
	`status` varchar(50) NOT NULL DEFAULT 'completed',
	`error_message` text,
	`processing_time` int,
	`credits_consumed` int NOT NULL DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `t_chat_history_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_chat_history_uuid_unique` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `t_chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uuid` varchar(255) NOT NULL,
	`user_uuid` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'app',
	`icon` varchar(255),
	`name` varchar(255),
	`details` json,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `t_chat_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `t_chat_sessions_uuid_unique` UNIQUE(`uuid`)
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
CREATE TABLE `t_keyword_search_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_uuid` varchar(255) NOT NULL,
	`keyword` varchar(255) NOT NULL,
	`search_count` int NOT NULL DEFAULT 1,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `t_keyword_search_history_id` PRIMARY KEY(`id`)
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
CREATE TABLE `t_similar_apps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channel` varchar(50) NOT NULL,
	`app_id` varchar(255) NOT NULL,
	`app_name` varchar(255),
	`similar_app_id` varchar(255) NOT NULL,
	`similar_app_name` varchar(255),
	CONSTRAINT `t_similar_apps_id` PRIMARY KEY(`id`)
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
CREATE INDEX `app_search_app_id_idx` ON `t_app_records` (`app_id`);--> statement-breakpoint
CREATE INDEX `app_summaries_user_idx` ON `t_app_summaries` (`user_uuid`);--> statement-breakpoint
CREATE INDEX `app_summaries_slug_idx` ON `t_app_summaries` (`slug`);--> statement-breakpoint
CREATE INDEX `app_summaries_uuid_idx` ON `t_app_summaries` (`uuid`);--> statement-breakpoint
CREATE INDEX `app_summaries_app_id_idx` ON `t_app_summaries` (`app_id`,`channel`,`country`);--> statement-breakpoint
CREATE INDEX `chat_history_session_idx` ON `t_chat_history` (`session_uuid`);--> statement-breakpoint
CREATE INDEX `chat_history_created_idx` ON `t_chat_history` (`created_at`);--> statement-breakpoint
CREATE INDEX `chat_sessions_user_idx` ON `t_chat_sessions` (`user_uuid`);--> statement-breakpoint
CREATE INDEX `chat_sessions_uuid_idx` ON `t_chat_sessions` (`uuid`);--> statement-breakpoint
CREATE INDEX `email_verification_email_idx` ON `t_email_verification_codes` (`email`);--> statement-breakpoint
CREATE INDEX `email_verification_code_idx` ON `t_email_verification_codes` (`code`);--> statement-breakpoint
CREATE INDEX `email_verification_expired_idx` ON `t_email_verification_codes` (`expired_at`);--> statement-breakpoint
CREATE INDEX `keyword_search_user_idx` ON `t_keyword_search_history` (`user_uuid`);--> statement-breakpoint
CREATE INDEX `keyword_search_keyword_idx` ON `t_keyword_search_history` (`keyword`);--> statement-breakpoint
CREATE INDEX `keyword_search_search_count_idx` ON `t_keyword_search_history` (`search_count`);--> statement-breakpoint
CREATE INDEX `keyword_search_created_idx` ON `t_keyword_search_history` (`created_at`);--> statement-breakpoint
CREATE INDEX `password_reset_email_idx` ON `t_password_reset_tokens` (`email`);--> statement-breakpoint
CREATE INDEX `password_reset_token_idx` ON `t_password_reset_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `password_reset_expired_idx` ON `t_password_reset_tokens` (`expired_at`);--> statement-breakpoint
CREATE INDEX `similar_apps_app_id_idx` ON `t_similar_apps` (`app_id`);--> statement-breakpoint
CREATE INDEX `similar_apps_similar_app_id_idx` ON `t_similar_apps` (`similar_app_id`);