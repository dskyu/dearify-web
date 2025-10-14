import { NextRequest, NextResponse } from "next/server";
import resend from "@/lib/resend";
import { generateResetPasswordEmailTemplate } from "@/lib/email-templates";
import { findUserByEmail } from "@/models/user";
import { createPasswordResetToken } from "@/services/verification";

export async function POST(request: NextRequest) {
  try {
    const { email, locale = "en" } = await request.json();

    // 验证输入
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 检查邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 检查用户是否存在
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      // 为了安全，即使用户不存在也返回成功
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // 生成重置令牌
    const resetToken = await createPasswordResetToken({
      email,
      user_uuid: existingUser.uuid,
    });

    // 构建重置URL
    const resetUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/auth/reset-password?token=${resetToken}`;

    // 发送重置邮件
    const userName = existingUser.nickname || email.split("@")[0];
    const { html: emailHtml, subject } = await generateResetPasswordEmailTemplate(resetUrl, userName, locale);

    const emailDomain = process.env.RESEND_EMAIL_DOMAIN;

    await resend.emails.send({
      from: `ReviewInsight <noreply@${emailDomain}>`,
      to: email,
      subject: subject,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return NextResponse.json({ error: "Failed to send password reset email" }, { status: 500 });
  }
}
