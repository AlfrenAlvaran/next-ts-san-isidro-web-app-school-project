import nodemailer from "nodemailer";
import { transporter } from "../mailer";



const APP_NAME = "Barangay San Isidro";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const BRAND_NAVY = "#0F172A";
const BRAND_GOLD = "#B8860B";

function buildPasswordResetEmailHtml(firstName: string, resetUrl: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_NAVY}; padding: 28px 32px;">
              <p style="margin:0; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${BRAND_GOLD};">
                ${APP_NAME}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 8px 32px;">
              <table role="presentation" width="56" height="56" cellpadding="0" cellspacing="0" style="background-color:#fdf6e8; border-radius:50%; margin-bottom:20px;">
                <tr>
                  <td align="center" valign="middle" style="font-size:24px;">🔒</td>
                </tr>
              </table>

              <h1 style="margin:0 0 12px 0; font-size:20px; line-height:28px; font-weight:800; color:#0f172a;">
                Reset your password
              </h1>

              <p style="margin:0 0 8px 0; font-size:14px; line-height:22px; color:#475569;">
                Hi ${firstName},
              </p>
              <p style="margin:0 0 28px 0; font-size:14px; line-height:22px; color:#475569;">
                We received a request to reset the password for your ${APP_NAME} account.
                Click the button below to choose a new one. This link expires in
                <strong>1 hour</strong>.
              </p>

              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px; background-color:${BRAND_GOLD};">
                    <a href="${resetUrl}"
                       style="display:inline-block; padding:13px 28px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:8px;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 4px 0; font-size:12px; line-height:18px; color:#94a3b8;">
                Or paste this link into your browser:
              </p>
              <p style="margin:0 0 28px 0; font-size:12px; line-height:18px; word-break:break-all;">
                <a href="${resetUrl}" style="color:${BRAND_GOLD}; text-decoration:none;">${resetUrl}</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0; padding-top:20px; margin-top:4px;">
                <tr>
                  <td>
                    <p style="margin:0; font-size:12px; line-height:20px; color:#94a3b8;">
                      If you didn&rsquo;t request a password reset, you can safely ignore
                      this email — your password won&rsquo;t be changed.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding: 20px 32px; text-align:center;">
              <p style="margin:0; font-size:11px; line-height:16px; color:#94a3b8;">
                ${APP_NAME} &middot; This is an automated message, please don&rsquo;t reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendPasswordResetEmail(
  email: string,
  fullName: string | undefined,
  token: string,
) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const firstName = fullName?.trim().split(" ")[0] || "there";

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${APP_NAME}" <no-reply@barangaysanisidro.gov.ph>`,
    to: email,
    subject: "Reset your password",
    html: buildPasswordResetEmailHtml(firstName, resetUrl),
  });
}