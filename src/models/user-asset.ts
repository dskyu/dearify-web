import { db } from "@/db";
import { userAssets } from "@/db/schema";
import { eq, and, desc, isNotNull } from "drizzle-orm";
import { getUuid } from "@/lib/hash";

export interface CreateUserAssetParams {
  userUuid: string;
  type: "image" | "video";
  setupOptions: Record<string, any>;
  setupUrls?: string[];
  prompt: string;
  negativePrompt?: string;
  provider: string;
  providerJobId?: string;
}

export interface UpdateUserAssetParams {
  status?: "pending" | "processing" | "completed" | "failed";
  resultUrl?: string;
  resultDetail?: Record<string, any>;
  finishedAt?: Date;
}

export interface UserAsset {
  id: number;
  user_uuid: string;
  asset_uuid: string;
  status: string;
  type: string;
  setup_options: Record<string, any>;
  setup_urls?: string[];
  prompt: string;
  negative_prompt?: string;
  result_url?: string;
  result_detail?: Record<string, any>;
  provider: string;
  provider_job_id?: string;
  created_at: Date;
  finished_at?: Date;
}

/**
 * Create a new user asset record
 */
export async function createUserAsset(
  params: CreateUserAssetParams,
): Promise<UserAsset> {
  const assetUuid = getUuid();

  const [result] = await db().insert(userAssets).values({
    user_uuid: params.userUuid,
    asset_uuid: assetUuid,
    status: "pending",
    type: params.type,
    setup_options: params.setupOptions,
    setup_urls: params.setupUrls,
    prompt: params.prompt,
    negative_prompt: params.negativePrompt,
    provider: params.provider,
    provider_job_id: params.providerJobId,
  });

  // Return a mock UserAsset for now - in production you'd fetch the created record
  return {
    id: 0,
    user_uuid: params.userUuid,
    asset_uuid: assetUuid,
    status: "pending",
    type: params.type,
    setup_options: params.setupOptions,
    setup_urls: params.setupUrls,
    prompt: params.prompt,
    negative_prompt: params.negativePrompt,
    result_url: undefined,
    result_detail: undefined,
    provider: params.provider,
    provider_job_id: params.providerJobId,
    created_at: new Date(),
    finished_at: undefined,
  } as UserAsset;
}

/**
 * Update user asset record
 */
export async function updateUserAsset(
  assetUuid: string,
  updates: UpdateUserAssetParams,
): Promise<UserAsset | null> {
  await db()
    .update(userAssets)
    .set(updates)
    .where(eq(userAssets.asset_uuid, assetUuid));

  // For now, return null - in production you'd fetch the updated record
  return null;
}

/**
 * Get user asset by UUID
 */
export async function getUserAsset(
  assetUuid: string,
): Promise<UserAsset | null> {
  const [result] = await db()
    .select()
    .from(userAssets)
    .where(eq(userAssets.asset_uuid, assetUuid))
    .limit(1);

  return result as UserAsset | null;
}

/**
 * Get user assets by user UUID
 */
export async function getUserAssets(
  userUuid: string,
  limit: number = 20,
  offset: number = 0,
): Promise<UserAsset[]> {
  const results = await db()
    .select()
    .from(userAssets)
    .where(eq(userAssets.user_uuid, userUuid))
    .orderBy(desc(userAssets.created_at))
    .limit(limit)
    .offset(offset);

  return results as UserAsset[];
}

/**
 * Get user assets by status
 */
export async function getUserAssetsByStatus(
  userUuid: string,
  status: string,
): Promise<UserAsset[]> {
  const results = await db()
    .select()
    .from(userAssets)
    .where(
      and(eq(userAssets.user_uuid, userUuid), eq(userAssets.status, status)),
    )
    .orderBy(desc(userAssets.created_at));

  return results as UserAsset[];
}

/**
 * Get pending user assets that need status updates
 */
export async function getPendingUserAssets(): Promise<UserAsset[]> {
  const results = await db()
    .select()
    .from(userAssets)
    .where(
      and(
        eq(userAssets.status, "processing"),
        isNotNull(userAssets.provider_job_id),
      ),
    )
    .orderBy(userAssets.created_at);

  return results as UserAsset[];
}
