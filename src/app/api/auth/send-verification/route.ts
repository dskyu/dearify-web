import { NextRequest, NextResponse } from "next/server";
import resend from "@/lib/resend";
import { generateVerificationEmailTemplate } from "@/lib/email-templates";
import { createVerificationCode } from "@/services/verification";
import { findUserByEmail } from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const { email, nickname, locale = "en" } = await request.json();

    // 验证输入
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 检查邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 检查用户是否已存在
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // 生成验证码
    const verificationCode = await createVerificationCode({ email });

    // 发送验证邮件
    const userName = nickname || email.split("@")[0];
    const { html: emailHtml, subject } = await generateVerificationEmailTemplate(verificationCode, userName, locale);

    const emailDomain = process.env.RESEND_EMAIL_DOMAIN;

    await resend.emails.send({
      from: `ReviewInsight <noreply@${emailDomain}>`,
      to: email,
      subject: subject,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
