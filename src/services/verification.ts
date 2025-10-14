import { db } from "@/db";
import { emailVerificationCodes, users, passwordResetTokens } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

export interface VerificationCodeData {
  email: string;
  user_uuid?: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
}

// 生成6位数字验证码
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 创建验证码记录
export async function createVerificationCode(data: VerificationCodeData): Promise<string> {
  const code = generateVerificationCode();
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后过期

  // 先删除该邮箱的旧验证码
  await db().delete(emailVerificationCodes).where(eq(emailVerificationCodes.email, data.email));

  // 插入新验证码
  await db().insert(emailVerificationCodes).values({
    email: data.email,
    code,
    created_at: new Date(),
    expired_at: expiredAt,
    user_uuid: data.user_uuid,
  });

  return code;
}

// 验证验证码
export async function verifyCode(data: VerifyCodeData): Promise<{ success: boolean; user_uuid?: string }> {
  const now = new Date();

  const verificationCode = await db()
    .select()
    .from(emailVerificationCodes)
    .where(
      and(
        eq(emailVerificationCodes.email, data.email),
        eq(emailVerificationCodes.code, data.code),
        eq(emailVerificationCodes.used, false),
        gt(emailVerificationCodes.expired_at, now)
      )
    )
    .limit(1);

  if (verificationCode.length === 0) {
    return { success: false };
  }

  const codeRecord = verificationCode[0];

  // 标记验证码为已使用
  await db().update(emailVerificationCodes).set({ used: true }).where(eq(emailVerificationCodes.id, codeRecord.id));

  return { success: true, user_uuid: codeRecord.user_uuid || undefined };
}

// 标记用户邮箱为已验证
export async function markEmailAsVerified(userUuid: string): Promise<void> {
  await db().update(users).set({ email_verified: true }).where(eq(users.uuid, userUuid));
}

// 检查用户邮箱是否已验证
export async function isEmailVerified(userUuid: string): Promise<boolean> {
  const user = await db().select({ email_verified: users.email_verified }).from(users).where(eq(users.uuid, userUuid)).limit(1);

  return user.length > 0 ? user[0].email_verified : false;
}

// 密码重置令牌相关函数
export interface PasswordResetTokenData {
  email: string;
  user_uuid?: string;
}

export interface VerifyPasswordResetTokenData {
  email: string;
  token: string;
}

// 生成密码重置令牌
export function generatePasswordResetToken(): string {
  return crypto.randomUUID();
}

// 创建密码重置令牌记录
export async function createPasswordResetToken(data: PasswordResetTokenData): Promise<string> {
  const token = generatePasswordResetToken();
  const expiredAt = new Date(Date.now() + 15 * 60 * 1000); // 15分钟后过期

  // 先删除该邮箱的旧重置令牌
  await db().delete(passwordResetTokens).where(eq(passwordResetTokens.email, data.email));

  // 插入新重置令牌
  await db().insert(passwordResetTokens).values({
    email: data.email,
    token,
    created_at: new Date(),
    expired_at: expiredAt,
    user_uuid: data.user_uuid,
  });

  return token;
}

// 验证密码重置令牌
export async function verifyPasswordResetToken(data: VerifyPasswordResetTokenData): Promise<{ success: boolean; user_uuid?: string }> {
  const now = new Date();

  const resetToken = await db()
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.email, data.email),
        eq(passwordResetTokens.token, data.token),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expired_at, now)
      )
    )
    .limit(1);

  if (resetToken.length === 0) {
    return { success: false };
  }

  const tokenRecord = resetToken[0];

  // 标记令牌为已使用
  await db().update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, tokenRecord.id));

  return { success: true, user_uuid: tokenRecord.user_uuid || undefined };
}
