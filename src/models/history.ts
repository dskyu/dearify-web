import { keywordSearchHistory, appRecords, similarApps } from "@/db/schema";
import { db } from "@/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface KeywordSearchRecord {
  id?: number;
  user_uuid: string;
  keyword: string;
  search_count: number;
  created_at?: Date | null;
}

export interface CreateKeywordSearchParams {
  user_uuid: string;
  keyword: string;
}

export interface UpdateKeywordSearchParams {
  user_uuid: string;
  keyword: string;
}

export interface KeywordSearchStats {
  keyword: string;
  total_searches: number;
}

// 创建关键词搜索记录（每次搜索都创建新记录）
export async function keywordSearchCreateRecord(params: CreateKeywordSearchParams): Promise<void> {
  const { user_uuid, keyword } = params;

  // 查询该关键词的历史搜索次数
  const existingCount = await keywordSearchGetUserCount(user_uuid, keyword);

  // 每次搜索都创建新记录
  await db()
    .insert(keywordSearchHistory)
    .values({
      user_uuid,
      keyword,
      search_count: existingCount + 1, // 累加搜索次数
    });
}

// 获取用户的关键词搜索历史（去重，按最后搜索时间排序）
export async function keywordSearchGetUserHistory(user_uuid: string, limit: number = 20): Promise<KeywordSearchStats[]> {
  const records = await db()
    .select({
      keyword: keywordSearchHistory.keyword,
      total_searches: sql<number>`MAX(${keywordSearchHistory.search_count})`,
    })
    .from(keywordSearchHistory)
    .where(eq(keywordSearchHistory.user_uuid, user_uuid))
    .groupBy(keywordSearchHistory.keyword)
    .orderBy(desc(sql<number>`MAX(${keywordSearchHistory.search_count})`))
    .limit(limit);

  return records;
}

// 获取热门搜索关键词（按总搜索次数排序）
export async function keywordSearchGetPopularKeywords(limit: number = 10): Promise<KeywordSearchStats[]> {
  const records = await db()
    .select({
      keyword: keywordSearchHistory.keyword,
      total_searches: sql<number>`MAX(${keywordSearchHistory.search_count})`,
    })
    .from(keywordSearchHistory)
    .groupBy(keywordSearchHistory.keyword)
    .orderBy(desc(sql<number>`MAX(${keywordSearchHistory.search_count})`))
    .limit(limit);

  return records;
}

// 获取用户特定关键词的搜索次数
export async function keywordSearchGetUserCount(user_uuid: string, keyword: string): Promise<number> {
  const result = await db()
    .select({
      total_searches: sql<number>`MAX(${keywordSearchHistory.search_count})`,
    })
    .from(keywordSearchHistory)
    .where(and(eq(keywordSearchHistory.user_uuid, user_uuid), eq(keywordSearchHistory.keyword, keyword)));

  return result[0]?.total_searches || 0;
}

// 删除用户的关键词搜索记录
export async function keywordSearchDeleteUserHistory(user_uuid: string, keyword?: string): Promise<void> {
  if (keyword) {
    await db()
      .delete(keywordSearchHistory)
      .where(and(eq(keywordSearchHistory.user_uuid, user_uuid), eq(keywordSearchHistory.keyword, keyword)));
  } else {
    await db().delete(keywordSearchHistory).where(eq(keywordSearchHistory.user_uuid, user_uuid));
  }
}

/////////////////

export interface AppRecord {
  id?: number;
  channel: string;
  country: string;
  language?: string | null;
  app_id: string;
  bundle_id?: string | null;
  name?: string | null;
  category?: string | null;
  category_id?: string | null;
  rating?: string | null;
  details?: any;
  reviews?: any;
  similar_apps?: any;
  report?: any;
  created_at?: Date | null;
}

export interface CreateAppRecordParams {
  app_id: string;
  bundle_id: string;
  channel: string;
  country: string;
  language?: string;
  name: string;
  category: string;
  category_id: string;
  rating: string;
  details?: any;
  reviews?: any;
  similar_apps?: any;
  report?: any;
}

export async function appRecordCache(params: AppRecord): Promise<AppRecord | null> {
  const { channel, app_id, ...appInfo } = params;

  // 检查是否已存在记录
  const existing = await db()
    .select()
    .from(appRecords)
    .where(and(eq(appRecords.channel, channel), eq(appRecords.app_id, app_id), eq(appRecords.country, appInfo.country)))
    .limit(1);

  if (existing.length > 0) {
    const data = existing[0];

    // 检查更新时间是否在1天内
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (data.updated_at && data.updated_at > oneDayAgo) {
      return {
        ...data,
      };
    }
  }

  return null;
}

// 创建或更新app搜索记录
export async function appRecordCreateOrUpdate(params: CreateAppRecordParams): Promise<void> {
  const { channel, app_id, ...appInfo } = params;

  // 检查是否已存在记录
  const existing = await db()
    .select()
    .from(appRecords)
    .where(and(eq(appRecords.channel, channel), eq(appRecords.app_id, app_id), eq(appRecords.country, appInfo.country)))
    .limit(1);

  if (existing.length > 0) {
    // 更新现有记录
    const updateData: any = {};

    // 更新app信息（如果提供了新的信息）
    if (appInfo.details) updateData.details = appInfo.details;
    if (appInfo.reviews) updateData.reviews = appInfo.reviews;
    if (appInfo.similar_apps) updateData.similar_apps = appInfo.similar_apps;
    if (appInfo.report) updateData.report = appInfo.report;
    updateData.updated_at = new Date();

    await db()
      .update(appRecords)
      .set(updateData)
      .where(and(eq(appRecords.channel, channel), eq(appRecords.app_id, app_id), eq(appRecords.country, appInfo.country)));
  } else {
    // 创建新记录
    await db().insert(appRecords).values({
      app_id: params.app_id,
      bundle_id: appInfo.bundle_id,
      channel: params.channel,
      country: appInfo.country,
      language: appInfo.language,
      name: appInfo.name,
      category: appInfo.category,
      category_id: appInfo.category_id,
      rating: appInfo.rating,
      details: appInfo.details,
      reviews: appInfo.reviews,
      similar_apps: appInfo.similar_apps,
      report: appInfo.report,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

/////////////////
export interface CreateSimilarAppsParams {
  channel: string;
  app_id: string;
  app_name: string;
  similar_app_id: string;
  similar_app_name: string;
}

export interface SimilarAppsRecord {
  channel: string;
  app_id: string;
  similar_app: {
    app_id: string;
    name: string;
  }[];
}

export async function similarAppsCreateOrUpdate(params: CreateSimilarAppsParams): Promise<void> {
  const { channel, app_id, app_name, similar_app_id, similar_app_name } = params;

  // 检查是否已存在记录
  const existing = await db()
    .select()
    .from(similarApps)
    .where(and(eq(similarApps.channel, channel), eq(similarApps.app_id, app_id), eq(similarApps.similar_app_id, similar_app_id)));

  if (existing.length == 0) {
    // 创建新记录
    await db().insert(similarApps).values({
      channel,
      app_id,
      app_name,
      similar_app_id,
      similar_app_name,
    });
  }
}

export async function similarAppsGet(channel: string, app_id: string): Promise<SimilarAppsRecord> {
  const records = await db()
    .select()
    .from(similarApps)
    .where(and(eq(similarApps.channel, channel), eq(similarApps.app_id, app_id)));

  if (records.length == 0) {
    return {
      channel,
      app_id,
      similar_app: [],
    };
  }

  return {
    channel,
    app_id,
    similar_app: records.map((record) => ({
      app_id: record.similar_app_id,
      name: record.similar_app_name || "",
    })),
  };
}
