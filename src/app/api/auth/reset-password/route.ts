import { NextRequest, NextResponse } from "next/server";
import { verifyPasswordResetToken } from "@/services/verification";
import { findUserByEmail, updateUserPassword } from "@/models/user";
import { hashPassword } from "@/lib/hash";

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();

    // 验证输入
    if (!email || !token || !password) {
      return NextResponse.json({ error: "Email, token, and password are required" }, { status: 400 });
    }

    // 验证密码强度
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // 验证重置令牌
    const verificationResult = await verifyPasswordResetToken({ email, token });
    if (!verificationResult.success) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    // 检查用户是否存在
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 更新用户密码
    const hashedPassword = hashPassword(password);
    const updateResult = await updateUserPassword(existingUser.uuid, hashedPassword);

    if (!updateResult) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
