import { mysqlTable, int, varchar, text, boolean, uniqueIndex, index, datetime, json, decimal } from "drizzle-orm/mysql-core";
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
    subscription_credits_reset_date: datetime("subscription_credits_reset_date"),
    subscription_expires_date: datetime("subscription_expires_date"),
    subscription_product_id: varchar("subscription_product_id", { length: 255 }),
    subscription_plan: varchar("subscription_plan", { length: 50 }),
    subscription_status: varchar("subscription_status", { length: 50 }).notNull().default("inactive"),
    subscription_order_no: varchar("subscription_order_no", { length: 255 }),
  },
  (table) => [uniqueIndex("email_provider_unique_idx").on(table.email, table.signin_provider)]
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
  ]
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
  ]
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

// API Keys table
export const apikeys = mysqlTable("t_apikeys", {
  id: int("id").primaryKey().autoincrement(),
  api_key: varchar("api_key", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 100 }),
  user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  status: varchar("status", { length: 50 }),
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

// Affiliates table
export const affiliates = mysqlTable("t_affiliates", {
  id: int("id").primaryKey().autoincrement(),
  user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  status: varchar("status", { length: 50 }).notNull().default(""),
  invited_by: varchar("invited_by", { length: 255 }).notNull(),
  paid_order_no: varchar("paid_order_no", { length: 255 }).notNull().default(""),
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

// Keyword search history table
export const keywordSearchHistory = mysqlTable(
  "t_keyword_search_history",
  {
    id: int("id").primaryKey().autoincrement(),
    user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
    keyword: varchar("keyword", { length: 255 }).notNull(),
    search_count: int("search_count").notNull().default(1),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("keyword_search_user_idx").on(table.user_uuid),
    index("keyword_search_keyword_idx").on(table.keyword),
    index("keyword_search_search_count_idx").on(table.search_count),
    index("keyword_search_created_idx").on(table.created_at),
  ]
);

// App search history table
export const appRecords = mysqlTable(
  "t_app_records",
  {
    id: int("id").primaryKey().autoincrement(),
    channel: varchar("channel", { length: 50 }).notNull(),
    country: varchar("country", { length: 50 }).notNull(),
    language: varchar("language", { length: 50 }),
    app_id: varchar("app_id", { length: 255 }).notNull(),
    bundle_id: varchar("bundle_id", { length: 255 }),
    name: varchar("name", { length: 255 }),
    category: varchar("category", { length: 100 }),
    category_id: varchar("category_id", { length: 100 }),
    rating: varchar("rating", { length: 10 }),
    details: json("details"),
    reviews: json("reviews"),
    similar_apps: json("similar_apps"),
    report: json("report"),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("app_search_unique_idx").on(table.channel, table.country, table.app_id), index("app_search_app_id_idx").on(table.app_id)]
);

// Similar apps table
export const similarApps = mysqlTable(
  "t_similar_apps",
  {
    id: int("id").primaryKey().autoincrement(),
    channel: varchar("channel", { length: 50 }).notNull(),
    app_id: varchar("app_id", { length: 255 }).notNull(),
    app_name: varchar("app_name", { length: 255 }),
    similar_app_id: varchar("similar_app_id", { length: 255 }).notNull(),
    similar_app_name: varchar("similar_app_name", { length: 255 }),
  },
  (table) => [index("similar_apps_app_id_idx").on(table.app_id), index("similar_apps_similar_app_id_idx").on(table.similar_app_id)]
);

export const chatSessions = mysqlTable(
  "t_chat_sessions",
  {
    id: int("id").primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 255 }).notNull().unique(),
    user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull().default("app"), // app, keyword
    icon: varchar("icon", { length: 255 }),
    name: varchar("name", { length: 255 }),
    details: json("details"),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => [index("chat_sessions_user_idx").on(table.user_uuid), index("chat_sessions_uuid_idx").on(table.uuid)]
);

export const chatHistory = mysqlTable(
  "t_chat_history",
  {
    id: int("id").primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 255 }).notNull().unique(),
    user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
    session_uuid: varchar("session_uuid", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull().default("user"), // user, assistant, system
    message_type: varchar("message_type", { length: 50 }).notNull().default("text"), // text, image, file, etc.
    content: text("content").notNull(),
    input_tokens: int("input_tokens").notNull().default(0),
    output_tokens: int("output_tokens").notNull().default(0),
    model: varchar("model", { length: 100 }), // AI model used
    status: varchar("status", { length: 50 }).notNull().default("completed"), // completed, failed, pending
    error_message: text("error_message"),
    processing_time: int("processing_time"), // in milliseconds
    credits_consumed: int("credits_consumed").notNull().default(0),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => [index("chat_history_session_idx").on(table.session_uuid), index("chat_history_created_idx").on(table.created_at)]
);

export const appSummaries = mysqlTable(
  "t_app_summaries",
  {
    id: int("id").primaryKey().autoincrement(),
    uuid: varchar("uuid", { length: 255 }).notNull().unique(),
    slug: varchar("slug", { length: 255 }).notNull().default(""),
    user_uuid: varchar("user_uuid", { length: 255 }).notNull(),
    channel: varchar("channel", { length: 50 }).notNull(),
    country: varchar("country", { length: 50 }).notNull(),
    app_id: varchar("app_id", { length: 255 }).notNull(),
    language: varchar("language", { length: 50 }),
    app_name: varchar("app_name", { length: 255 }),
    app_icon: varchar("app_icon", { length: 255 }),
    status: varchar("status", { length: 50 }).notNull().default("show"), // show, hide
    details: json("details"),
    summary: json("summary"),
    created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("app_summaries_user_idx").on(table.user_uuid),
    index("app_summaries_slug_idx").on(table.slug),
    index("app_summaries_uuid_idx").on(table.uuid),
    index("app_summaries_app_id_idx").on(table.app_id, table.channel, table.country),
  ]
);
