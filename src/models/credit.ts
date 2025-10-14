import { credits, users } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, and, gte, asc } from "drizzle-orm";
import { SubscriptionStatus } from "@/services/credit";

export async function insertCredit(data: typeof credits.$inferInsert): Promise<typeof credits.$inferSelect | undefined> {
  await db().insert(credits).values(data);

  // For MySQL, we need to fetch the inserted credit separately
  const [credit] = await db().select().from(credits).where(eq(credits.trans_no, data.trans_no)).limit(1);
  return credit;
}

export async function findCreditByTransNo(trans_no: string): Promise<typeof credits.$inferSelect | undefined> {
  const [credit] = await db().select().from(credits).where(eq(credits.trans_no, trans_no)).limit(1);

  return credit;
}

export async function findCreditByOrderNo(order_no: string): Promise<typeof credits.$inferSelect | undefined> {
  const [credit] = await db().select().from(credits).where(eq(credits.order_no, order_no)).limit(1);

  return credit;
}

export async function getUserValidCredits(user_uuid: string): Promise<(typeof credits.$inferSelect)[] | undefined> {
  const now = new Date().toISOString();
  const data = await db()
    .select()
    .from(credits)
    .where(and(gte(credits.expired_at, new Date(now)), eq(credits.user_uuid, user_uuid)))
    .orderBy(asc(credits.expired_at));

  return data;
}

export async function getCreditsByUserUuid(user_uuid: string, page: number = 1, limit: number = 50): Promise<(typeof credits.$inferSelect)[] | undefined> {
  const data = await db()
    .select()
    .from(credits)
    .where(eq(credits.user_uuid, user_uuid))
    .orderBy(desc(credits.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

export async function updateUserSubscriptionCredits(
  user_uuid: string,
  updateData: {
    subscription_credits?: number;
    subscription_credits_reset_date?: string | null;
    subscription_order_no?: string | null;
    subscription_expires_date?: string | null;
    subscription_product_id?: string | null;
    subscription_plan?: string | null;
    subscription_status?: string | null;
  }
): Promise<typeof users.$inferSelect | undefined> {
  const dataToUpdate: any = {
    updated_at: new Date(),
  };

  if (updateData.subscription_credits !== undefined) {
    dataToUpdate.subscription_credits = updateData.subscription_credits;
  }

  if (updateData.subscription_credits_reset_date !== undefined) {
    dataToUpdate.subscription_credits_reset_date = updateData.subscription_credits_reset_date ? new Date(updateData.subscription_credits_reset_date) : null;
  }

  if (updateData.subscription_order_no !== undefined) {
    dataToUpdate.subscription_order_no = updateData.subscription_order_no;
  }

  if (updateData.subscription_expires_date !== undefined) {
    dataToUpdate.subscription_expires_date = updateData.subscription_expires_date ? new Date(updateData.subscription_expires_date) : null;
  }

  if (updateData.subscription_product_id !== undefined) {
    dataToUpdate.subscription_product_id = updateData.subscription_product_id;
  }

  if (updateData.subscription_plan !== undefined) {
    dataToUpdate.subscription_plan = updateData.subscription_plan;
  }

  if (updateData.subscription_status !== undefined) {
    dataToUpdate.subscription_status = updateData.subscription_status;
  }

  await db().update(users).set(dataToUpdate).where(eq(users.uuid, user_uuid));

  const [user] = await db().select().from(users).where(eq(users.uuid, user_uuid)).limit(1);
  return user;
}

export async function getUserSubscriptionInfo(user_uuid: string): Promise<
  | {
      subscription_credits: number;
      subscription_expires_date: Date | null;
      subscription_order_no: string | null;
      subscription_credits_reset_date: Date | null;
      subscription_product_id: string | null;
      subscription_plan: string | null;
      subscription_status: string;
    }
  | undefined
> {
  const [user] = await db()
    .select({
      subscription_credits: users.subscription_credits,
      subscription_expires_date: users.subscription_expires_date,
      subscription_order_no: users.subscription_order_no,
      subscription_credits_reset_date: users.subscription_credits_reset_date,
      subscription_product_id: users.subscription_product_id,
      subscription_plan: users.subscription_plan,
      subscription_status: users.subscription_status,
    })
    .from(users)
    .where(eq(users.uuid, user_uuid))
    .limit(1);

  if (!user) {
    return undefined;
  }

  // Check if subscription is expired (with 1 hour threshold)
  if (user.subscription_expires_date && new Date() > new Date(new Date(user.subscription_expires_date).getTime() + 60 * 60 * 1000)) {
    user.subscription_status = SubscriptionStatus.Expired;
  }

  if (user.subscription_status === SubscriptionStatus.Expired || user.subscription_status === SubscriptionStatus.Inactive) {
    return undefined;
  }

  return user;
}

export async function getUsersNeedingSubscriptionReset(): Promise<{ uuid: string; subscription_credits_reset_date: Date }[] | undefined> {
  const now = new Date();
  const data = await db()
    .select({
      uuid: users.uuid,
      subscription_credits_reset_date: users.subscription_credits_reset_date,
    })
    .from(users)
    .where(and(eq(users.subscription_status, "active"), gte(users.subscription_credits_reset_date, now)));

  // Filter out null values and return only records with valid reset dates
  return data.filter((item) => item.subscription_credits_reset_date !== null) as { uuid: string; subscription_credits_reset_date: Date }[];
}
