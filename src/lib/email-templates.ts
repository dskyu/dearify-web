import { getTranslations } from "next-intl/server";

// 获取翻译的辅助函数
async function getEmailTranslations(locale: string, namespace: string) {
  const t = await getTranslations({ locale, namespace: `email.${namespace}` });
  return t;
}

// 通用的邮件模板基础结构
function getEmailBaseTemplate(title: string, content: string, locale: string = "en") {
  const dir = locale === "ar" || locale === "he" ? "rtl" : "ltr";
  const lang = locale;

  return `
<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${process.env.NEXT_PUBLIC_PROJECT_NAME} - ${title}</title>
</head>

<body style="margin:0; padding:0; background-color:#f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f9fa;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; margin:40px 0; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color:#fff; text-align:center; padding:24px 0; font-size:28px; font-weight:700; border-top-left-radius:12px; border-top-right-radius:12px;">
              ${process.env.NEXT_PUBLIC_PROJECT_NAME}
            </td>
          </tr>
          <tr>
            <td style="padding:40px; text-align:center; border-bottom-left-radius:12px; border-bottom-right-radius:12px;">
              ${content}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

</html>
  `;
}

// 邮箱验证邮件模板（支持国际化）
export async function generateVerificationEmailTemplate(code: string, userName: string, locale: string = "en") {
  const t = await getEmailTranslations(locale, "verification");
  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "ReviewInsight";
  const currentYear = new Date().getFullYear();

  const content = `
    <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">${t("verify_title")}</h2>
    <p style="color: #6b7280; font-size: 16px; margin: 0 0 32px 0;">${t("description")}</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb; border:1.5px dashed #a5b4fc; margin:32px 0; border-radius:12px;">
      <tr>
        <td style="padding:24px 0; text-align:center; border-radius:12px;">
          <div style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">${t("verification_code")}</div>
          <div style="font-size: 36px; font-weight: 700; color: #1f2937; letter-spacing: 8px; margin-bottom: 12px; font-family: 'Courier New', monospace;">${code}</div>
        </td>
      </tr>
    </table>
    
    <div style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">${t("ignore_message")}</div>
    <div style="margin-bottom: 16px;">
      <a href="${process.env.NEXT_PUBLIC_WEB_URL}" style="color: #6366f1; text-decoration: none; font-size: 14px;">${t("visit_website")}</a>
    </div>
    
    <div style="text-align:center; color:#9ca3af; font-size:12px; padding-top:24px; border-top:1px solid #e5e7eb;">
      ${t("copyright", { year: currentYear, projectName })}
    </div>
  `;

  const html = getEmailBaseTemplate(t("title"), content, locale);
  const subject = t("subject", { projectName });

  return { html, subject };
}

// 密码重置邮件模板（支持国际化）
export async function generateResetPasswordEmailTemplate(resetUrl: string, userName: string, locale: string = "en") {
  const t = await getEmailTranslations(locale, "reset_password");
  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "ReviewInsight";
  const currentYear = new Date().getFullYear();

  const content = `
    <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0;">${t("reset_title")}</h2>
    <p style="color: #6b7280; font-size: 16px; margin: 0 0 32px 0;">${t("description", { projectName })}</p>
    
    <div style="margin: 32px 0;">
      <a href="${resetUrl}" style="background: linear-gradient(135deg, #ef4444 0%, #ec4899 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; transition: all 0.2s ease;">
        ${t("reset_button")}
      </a>
    </div>
    
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-family: 'Courier New', monospace; font-size: 12px; color: #374151; word-break: break-all; text-align: left; margin: 32px 0;">
      ${resetUrl}
    </div>
    
    <div style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">${t("expires_in")}</div>
    <div style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">${t("ignore_message")}</div>
    
    <div style="margin-bottom: 16px;">
      <a href="${process.env.NEXT_PUBLIC_WEB_URL}" style="color: #6366f1; text-decoration: none; font-size: 14px;">${t("visit_website")}</a>
    </div>
    
    <div style="text-align:center; color:#9ca3af; font-size:12px; padding-top:24px; border-top:1px solid #e5e7eb;">
      ${t("copyright", { year: currentYear, projectName })}
    </div>
  `;

  const html = getEmailBaseTemplate(t("title"), content, locale);
  const subject = t("subject", { projectName });

  return { html, subject };
}
