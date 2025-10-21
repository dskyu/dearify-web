import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  uniqueIndex,
  index,
  datetime,
  json,
  decimal,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Users table
export const users = mysqlTable(
  "t_users",
  {
    id: int("id").primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull(),
    password_hash: varchar("password_hash", { length: 255 }),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    nickname: varchar("nickname", { length: 255 }),
    avatar_url: varchar("avatar_url", { length: 255 }),
    locale: varchar("locale", { length: 50 }),
    signin_type: varchar("signin_type", { length: 50 }),
    signin_ip: varchar("signin_ip", { length: 255 }),
    signin_provider: varchar("signin_provider", { length: 50 }),
    signin_openid: varchar("signin_openid", { length: 255 }),
    invite_code: varchar("invite_code", { length: 255 }).notNull().default(""),
    updated_at: datetime("updated_at"),
    invited_by: varchar("invited_by", { length: 255 }).notNull().default(""),
    is_affiliate: boolean("is_affiliate").notNull().default(false),
    email_verified: boolean("email_verified").notNull().default(false),
    stripe_customer_id: varchar("stripe_customer_id", { length: 255 }),

    subscription_credits: int("subscription_credits").notNull().default(0),
    subscription_credits_reset_date: datetime(
      "subscription_credits_reset_date",
    ),
    subscription_expires_date: datetime("subscription_expires_date"),
    subscription_product_id: varchar("subscription_product_id", {
      length: 255,
    }),
    subscription_plan: varchar("subscription_plan", { length: 50 }),
    subscription_status: varchar("subscription_status", { length: 50 })
      .notNull()
      .default("inactive"),
    subscription_order_no: varchar("subscription_order_no", { length: 255 }),
  },
  (table) => [
    uniqueIndex("email_provider_unique_idx").on(
      table.email,
      table.signin_provider,
    ),
  ],
);

// Email verification codes table
export const emailVerificationCodes = mysqlTable(
  "t_email_verification_codes",
  {
    id: int("id").primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 10 }).notNull(),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    expired_at: datetime("expired_at"),
    used: boolean("used").notNull().default(false),
    user_uuid: varchar("user_uuid", { length: 255 }),
  },
  (table) => [
    index("email_verification_email_idx").on(table.email),
    index("email_verification_code_idx").on(table.code),
    index("email_verification_expired_idx").on(table.expired_at),
  ],
);

// Password reset tokens table
export const passwordResetTokens = mysqlTable(
  "t_password_reset_tokens",
  {
    id: int("id").primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    expired_at: datetime("expired_at"),
    used: boolean("used").notNull().default(false),
    user_uuid: varchar("user_uuid", { length: 255 }),
  },
  (table) => [
    index("password_reset_email_idx").on(table.email),
    index("password_reset_token_idx").on(table.token),
    index("password_reset_expired_idx").on(table.expired_at),
  ],
);

// Orders table
export const orders = mysqlTable("t_orders", {
  id: int("id").primaryKey().autoincrement(),
  order_no: varchar("order_no", { length: 255 }).notNull().unique(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  user_uuid: varchar("user_uuid", { length: 255 }).notNull().default(""),
  user_email: varchar("user_email", { length: 255 }).notNull().default(""),
  amount: int("amount").notNull(),
  interval: varchar("interval", { length: 50 }),
  expired_at: datetime("expired_at"),
  status: varchar("status", { length: 50 }).notNull(),
  stripe_session_id: varchar("stripe_session_id", { length: 255 }),
  credits: int("credits").notNull(),
  currency: varchar("currency", { length: 50 }),
  sub_id: varchar("sub_id", { length: 255 }),
  sub_interval_count: int("sub_interval_count"),
  sub_cycle_anchor: int("sub_cycle_anchor"),
  sub_period_end: int("sub_period_end"),
  sub_period_start: int("sub_period_start"),
  sub_times: int("sub_times"),
  product_id: varchar("product_id", { length: 255 }).notNull().default(""),
  product_name: varchar("product_name", { length: 255 }),
  valid_months: int("valid_months"),
  order_detail: text("order_detail"),
  paid_at: datetime("paid_at"),
  paid_email: varchar("paid_email", { length: 255 }),
  paid_detail: text("paid_detail"),
});

// Credits table
export const credits = mysqlTable("t_credits", {
  id: int("id").primaryKey().autoincrement(),
  trans_no: varchar("trans_no", { length: 255 }).notNull().unique(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
  trans_type: varchar("trans_type", { length: 50 }).notNull(),
  credits: int("credits").notNull(),
  order_no: varchar("order_no", { length: 255 }),
  expired_at: datetime("expired_at"),
  description: text("description"),
  balance_after: int("balance_after"),
});

// Posts table
export const posts = mysqlTable("t_posts", {
  id: int("id").primaryKey().autoincrement(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  content: text("content"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at"),
  status: varchar("status", { length: 50 }),
  cover_url: varchar("cover_url", { length: 255 }),
  author_name: varchar("author_name", { length: 255 }),
  author_avatar_url: varchar("author_avatar_url", { length: 255 }),
  locale: varchar("locale", { length: 50 }),
});

// API Keys table
export const apikeys = mysqlTable("t_apikeys", {
  id: int("id").primaryKey().autoincrement(),
  api_key: varchar("api_key", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 100 }),
  user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  status: varchar("status", { length: 50 }),
});

// Affiliates table
export const affiliates = mysqlTable("t_affiliates", {
  id: int("id").primaryKey().autoincrement(),
  user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  status: varchar("status", { length: 50 }).notNull().default(""),
  invited_by: varchar("invited_by", { length: 255 }).notNull(),
  paid_order_no: varchar("paid_order_no", { length: 255 })
    .notNull()
    .default(""),
  paid_amount: int("paid_amount").notNull().default(0),
  reward_percent: int("reward_percent").notNull().default(0),
  reward_amount: int("reward_amount").notNull().default(0),
});

// Feedbacks table
export const feedbacks = mysqlTable("t_feedbacks", {
  id: int("id").primaryKey().autoincrement(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  status: varchar("status", { length: 50 }),
  user_uuid: varchar("user_uuid", { length: 255 }),
  content: text("content"),
  rating: int("rating"),
});

/////////

export const userAssets = mysqlTable(
  "t_user_assets",
  {
    id: int("id").primaryKey().autoincrement(),
    user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
    asset_uuid: varchar("asset_uuid", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }),
    type: varchar("type", { length: 50 }).notNull().default("image"),
    setup_options: json("setup_options"),
    setup_urls: json("setup_urls"),
    prompt: varchar("prompt", { length: 255 }),
    negative_prompt: varchar("negative_prompt", { length: 255 }),
    result_url: varchar("result_url", { length: 255 }),
    result_detail: json("result_detail"),
    ref_asset_id: varchar("ref_asset_id", { length: 255 }),
    provider: varchar("provider", { length: 50 }).notNull().default(""),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("user_assets_user_idx").on(table.user_uuid),
    index("user_assets_asset_idx").on(table.asset_uuid),
  ],
);
