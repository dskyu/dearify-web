import { users } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, gte, inArray, and } from "drizzle-orm";

export async function insertUser(data: typeof users.$inferInsert): Promise<typeof users.$inferSelect | undefined> {
  await db().insert(users).values(data);

  // For MySQL, we need to fetch the inserted user separately
  const [user] = await db().select().from(users).where(eq(users.uuid, data.uuid)).limit(1);

  return user;
}

export async function findUserByEmail(email: string): Promise<typeof users.$inferSelect | undefined> {
  const [user] = await db().select().from(users).where(eq(users.email, email)).limit(1);

  return user;
}

export async function findUserByUuid(uuid: string): Promise<typeof users.$inferSelect | undefined> {
  const [user] = await db().select().from(users).where(eq(users.uuid, uuid)).limit(1);

  return user;
}

export async function getUsers(page: number = 1, limit: number = 50): Promise<(typeof users.$inferSelect)[] | undefined> {
  const offset = (page - 1) * limit;

  const data = await db().select().from(users).orderBy(desc(users.created_at)).limit(limit).offset(offset);

  return data;
}

export async function updateUserInviteCode(user_uuid: string, invite_code: string): Promise<typeof users.$inferSelect | undefined> {
  await db().update(users).set({ invite_code, updated_at: new Date() }).where(eq(users.uuid, user_uuid));

  const [user] = await db().select().from(users).where(eq(users.uuid, user_uuid)).limit(1);

  return user;
}

export async function updateUserInvitedBy(user_uuid: string, invited_by: string): Promise<typeof users.$inferSelect | undefined> {
  await db().update(users).set({ invited_by, updated_at: new Date() }).where(eq(users.uuid, user_uuid));

  const [user] = await db().select().from(users).where(eq(users.uuid, user_uuid)).limit(1);

  return user;
}

export async function getUsersByUuids(user_uuids: string[]): Promise<(typeof users.$inferSelect)[] | undefined> {
  const data = await db().select().from(users).where(inArray(users.uuid, user_uuids));

  return data;
}

export async function findUserByInviteCode(invite_code: string): Promise<typeof users.$inferSelect | undefined> {
  const [user] = await db().select().from(users).where(eq(users.invite_code, invite_code)).limit(1);

  return user;
}

export async function getUserUuidsByEmail(email: string): Promise<string[] | undefined> {
  const data = await db().select({ uuid: users.uuid }).from(users).where(eq(users.email, email));

  return data.map((user) => user.uuid);
}

export async function getUsersTotal(): Promise<number> {
  const total = await db().$count(users);

  return total;
}

export async function getUserCountByDate(startTime: string): Promise<Map<string, number> | undefined> {
  const data = await db()
    .select({ created_at: users.created_at })
    .from(users)
    .where(gte(users.created_at, new Date(startTime)));

  data.sort((a, b) => a.created_at!.getTime() - b.created_at!.getTime());

  const dateCountMap = new Map<string, number>();
  data.forEach((item) => {
    const date = item.created_at!.toISOString().split("T")[0];
    dateCountMap.set(date, (dateCountMap.get(date) || 0) + 1);
  });

  return dateCountMap;
}

export async function updateUserPassword(user_uuid: string, password_hash: string): Promise<typeof users.$inferSelect | undefined> {
  await db().update(users).set({ password_hash, updated_at: new Date() }).where(eq(users.uuid, user_uuid));

  const [user] = await db().select().from(users).where(eq(users.uuid, user_uuid)).limit(1);

  return user;
}

export async function findUserByEmailAndPassword(email: string, password_hash: string): Promise<typeof users.$inferSelect | undefined> {
  const [user] = await db()
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password_hash, password_hash)))
    .limit(1);

  return user;
}

export async function updateUserProfile(user_uuid: string, data: { nickname?: string; avatar_url?: string }): Promise<typeof users.$inferSelect | undefined> {
  const updateData: any = { updated_at: new Date() };

  if (data.nickname !== undefined) {
    updateData.nickname = data.nickname;
  }

  if (data.avatar_url !== undefined) {
    updateData.avatar_url = data.avatar_url;
  }

  await db().update(users).set(updateData).where(eq(users.uuid, user_uuid));

  const [user] = await db().select().from(users).where(eq(users.uuid, user_uuid)).limit(1);

  return user;
}

export async function updateUserStripeCustomerId(
  user_uuid: string,
  data: {
    stripe_customer_id?: string;
  }
): Promise<typeof users.$inferSelect | undefined> {
  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.stripe_customer_id !== undefined) {
    updateData.stripe_customer_id = data.stripe_customer_id;
  }

  await db().update(users).set(updateData).where(eq(users.uuid, user_uuid));

  const [user] = await db().select().from(users).where(eq(users.uuid, user_uuid)).limit(1);
  return user;
}
