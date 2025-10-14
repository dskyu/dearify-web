import { appSummaries } from "@/db/schema";
import { db } from "@/db";
import { eq, and, desc, asc, like, sql, gt, ne, lt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "transliteration";

export interface CreateAppSummaryParams {
  user_uuid: string;
  channel: string;
  country: string;
  app_id: string;
  language?: string;
  app_name?: string;
  app_icon?: string;
  details?: any;
  summary?: any;
}

export interface UpdateAppSummaryParams {
  app_name?: string;
  details?: any;
  summary?: any;
}

export interface AppSummaryRecord {
  id?: number;
  uuid: string;
  slug: string;
  user_uuid: string;
  channel: string;
  country: string;
  app_id: string;
  language?: string | null;
  app_name?: string | null;
  app_icon?: string | null;
  details?: any;
  summary?: any;
  created_at?: Date | null;
}

export interface AppSummaryQueryParams {
  user_uuid?: string;
  channel?: string;
  country?: string;
  app_id?: string;
  language?: string;
  limit?: number;
  offset?: number;
}

// 创建应用摘要
export async function appSummaryCreate(params: CreateAppSummaryParams): Promise<AppSummaryRecord> {
  const summaryUuid = uuidv4();
  // slug 全部小写，拼接 channel, country, app_name, language（如有）
  const slug =
    [params.channel, params.country, params.language, params.app_name]
      .filter(Boolean)
      .map((v) => (v ? slugify(v) : ""))
      .filter((x) => x != "")
      .join("-") || summaryUuid;

  await db().insert(appSummaries).values({
    uuid: summaryUuid,
    slug: slug,
    user_uuid: params.user_uuid,
    channel: params.channel,
    country: params.country,
    app_id: params.app_id,
    language: params.language,
    app_name: params.app_name,
    app_icon: params.app_icon,
    details: params.details,
    summary: params.summary,
    created_at: new Date(),
  });

  return {
    uuid: summaryUuid,
    slug: slug,
    user_uuid: params.user_uuid,
    channel: params.channel,
    country: params.country,
    app_id: params.app_id,
    language: params.language,
    app_name: params.app_name,
    app_icon: params.app_icon,
    details: params.details,
    summary: params.summary,
    created_at: new Date(),
  };
}

export async function appSummaryGetPreviousBySlug(slug: string, id: number): Promise<AppSummaryRecord | null> {
  const summaries = await db()
    .select()
    .from(appSummaries)
    .where(and(ne(appSummaries.slug, slug), gt(appSummaries.id, id)))
    .orderBy(desc(appSummaries.id))
    .limit(1);
  if (!summaries[0]) return null;
  return summaries[0];
}

export async function appSummaryGetNextBySlug(slug: string, id: number): Promise<AppSummaryRecord | null> {
  const summaries = await db()
    .select()
    .from(appSummaries)
    .where(and(ne(appSummaries.slug, slug), lt(appSummaries.id, id)))
    .orderBy(desc(appSummaries.id))
    .limit(1);
  if (!summaries[0]) return null;
  return summaries[0];
}

export async function appSummaryGetByLastest(limit: number = 10): Promise<AppSummaryRecord[]> {
  const summaries = await db()
    .select({
      slug: appSummaries.slug,
      country: appSummaries.country,
      channel: appSummaries.channel,
      app_id: appSummaries.app_id,
      language: appSummaries.language,
      app_icon: appSummaries.app_icon,
      app_name: appSummaries.app_name,
    })
    .from(appSummaries)
    .where(
      sql`${appSummaries.id} IN (
        SELECT MAX(id) 
        FROM ${appSummaries} 
        GROUP BY slug 
        ORDER BY MAX(id) DESC 
      )`
    )
    .orderBy(desc(appSummaries.id))
    .limit(limit);

  return summaries.map(
    (summary) =>
      ({
        slug: summary.slug,
        country: summary.country,
        channel: summary.channel,
        app_id: summary.app_id,
        language: summary.language,
        app_icon: summary.app_icon,
        app_name: summary.app_name,
      }) as AppSummaryRecord
  );
}

// 根据UUID获取应用摘要
export async function appSummaryGetByUuid(uuid: string): Promise<AppSummaryRecord | null> {
  const summaries = await db().select().from(appSummaries).where(eq(appSummaries.uuid, uuid)).limit(1);

  if (!summaries[0]) return null;

  return summaries[0];
}

// 根据slug获取应用摘要
export async function appSummaryGetBySlug(slug: string): Promise<AppSummaryRecord | null> {
  const summaries = await db().select().from(appSummaries).where(eq(appSummaries.slug, slug)).orderBy(desc(appSummaries.id)).limit(1);

  if (!summaries[0]) return null;

  return summaries[0];
}

// 根据应用ID、渠道和国家获取应用摘要
export async function appSummaryGetByAppId(app_id: string, channel: string, country: string, user_uuid?: string): Promise<AppSummaryRecord | null> {
  const conditions = [eq(appSummaries.app_id, app_id), eq(appSummaries.channel, channel), eq(appSummaries.country, country)];

  if (user_uuid) {
    conditions.push(eq(appSummaries.user_uuid, user_uuid));
  }

  const summaries = await db()
    .select()
    .from(appSummaries)
    .where(and(...conditions))
    .limit(1);

  if (!summaries[0]) return null;

  return summaries[0];
}

// 获取用户的应用摘要列表
export async function appSummaryGetUserSummaries(user_uuid: string, params?: Omit<AppSummaryQueryParams, "user_uuid">): Promise<AppSummaryRecord[]> {
  const { limit = 20, offset = 0, channel, country, app_id, language } = params || {};

  // 构建过滤条件
  const conditions = [eq(appSummaries.user_uuid, user_uuid)];

  if (channel) {
    conditions.push(eq(appSummaries.channel, channel));
  }
  if (country) {
    conditions.push(eq(appSummaries.country, country));
  }
  if (app_id) {
    conditions.push(like(appSummaries.app_id, `%${app_id}%`));
  }
  if (language) {
    conditions.push(eq(appSummaries.language, language));
  }

  const summaries = await db()
    .select()
    .from(appSummaries)
    .where(and(...conditions))
    .orderBy(desc(appSummaries.created_at))
    .limit(limit)
    .offset(offset);

  return summaries;
}

// 更新应用摘要
export async function appSummaryUpdate(uuid: string, user_uuid: string, params: UpdateAppSummaryParams): Promise<void> {
  await db()
    .update(appSummaries)
    .set(params)
    .where(and(eq(appSummaries.uuid, uuid), eq(appSummaries.user_uuid, user_uuid)));
}

// 删除应用摘要
export async function appSummaryDelete(uuid: string, user_uuid: string): Promise<void> {
  await db()
    .delete(appSummaries)
    .where(and(eq(appSummaries.uuid, uuid), eq(appSummaries.user_uuid, user_uuid)));
}

// 批量删除用户的应用摘要
export async function appSummaryDeleteByUser(user_uuid: string): Promise<void> {
  await db().delete(appSummaries).where(eq(appSummaries.user_uuid, user_uuid));
}

// 检查应用摘要是否存在
export async function appSummaryExists(app_id: string, channel: string, country: string, user_uuid: string): Promise<boolean> {
  const summaries = await db()
    .select({ id: appSummaries.id })
    .from(appSummaries)
    .where(and(eq(appSummaries.app_id, app_id), eq(appSummaries.channel, channel), eq(appSummaries.country, country), eq(appSummaries.user_uuid, user_uuid)))
    .limit(1);

  return summaries.length > 0;
}
