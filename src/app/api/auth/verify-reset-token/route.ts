import { NextRequest, NextResponse } from "next/server";
import { verifyPasswordResetToken } from "@/services/verification";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // 从数据库中查找token记录，但不标记为已使用
    const { db } = await import("@/db");
    const { passwordResetTokens } = await import("@/db/schema");
    const { eq, and, gt } = await import("drizzle-orm");

    const now = new Date();

    const resetToken = await db()
      .select({
        email: passwordResetTokens.email,
        expired_at: passwordResetTokens.expired_at,
        used: passwordResetTokens.used,
      })
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.token, token), eq(passwordResetTokens.used, false), gt(passwordResetTokens.expired_at, now)))
      .limit(1);

    if (resetToken.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
          isValid: false,
        },
        { status: 400 }
      );
    }

    const tokenRecord = resetToken[0];

    // 隐藏邮箱中间部分
    const email = tokenRecord.email;
    const maskedEmail = maskEmail(email);

    return NextResponse.json({
      success: true,
      isValid: true,
      email: maskedEmail,
      originalEmail: email,
      expiresAt: tokenRecord.expired_at,
    });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return NextResponse.json(
      {
        error: "Failed to verify reset token",
        isValid: false,
      },
      { status: 500 }
    );
  }
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return email; // 如果本地部分太短，不进行隐藏
  }

  const maskedLocal = localPart.charAt(0) + "*".repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
  return `${maskedLocal}@${domain}`;
}
