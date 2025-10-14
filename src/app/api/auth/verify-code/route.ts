import { NextRequest, NextResponse } from "next/server";
import { verifyCode, markEmailAsVerified } from "@/services/verification";
import { insertUser } from "@/models/user";
import { getSnowId, hashPassword } from "@/lib/hash";
import { getUuid } from "@/lib/hash";
import { increaseCredits } from "@/services/credit";
import { CreditsAmount, CreditsTransType } from "@/services/credit";
import { getInfinityTimestr } from "@/lib/time";

export async function POST(request: NextRequest) {
  try {
    const { email, code, nickname, password } = await request.json();

    // 验证输入
    if (!email || !code) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    // 验证验证码
    const verificationResult = await verifyCode({ email, code });
    if (!verificationResult.success) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    // 如果验证码有效但没有用户UUID，说明这是新用户注册
    if (!verificationResult.user_uuid) {
      if (!password) {
        return NextResponse.json({ error: "Password is required for new user registration" }, { status: 400 });
      }

      // 创建新用户
      const hashedPassword = hashPassword(password);
      const userUuid = getUuid();
      const now = new Date();

      const newUser = await insertUser({
        uuid: userUuid,
        email,
        password_hash: hashedPassword,
        nickname: nickname || email.split("@")[0],
        created_at: now,
        signin_type: "email",
        signin_provider: "credentials",
        email_verified: true, // 直接设置为已验证
      });

      if (!newUser) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }

      // 为新用户增加积分
      await increaseCredits({
        user_uuid: userUuid,
        trans_type: CreditsTransType.NewUser,
        credits: CreditsAmount.NewUserGet,
        expired_at: getInfinityTimestr(),
        order_no: `NU_${getSnowId()}`,
        description: "New user bonus",
      });

      return NextResponse.json({
        success: true,
        message: "User registered and email verified successfully",
        user_uuid: userUuid,
      });
    } else {
      // 如果已有用户UUID，标记邮箱为已验证
      await markEmailAsVerified(verificationResult.user_uuid);

      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
        user_uuid: verificationResult.user_uuid,
      });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}
