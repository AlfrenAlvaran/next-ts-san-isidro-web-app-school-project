import { transporter } from "./mailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const FROM_ADDRESS =
  process.env.MAIL_FROM ?? `"Brgy. San Isidro" <${process.env.GMAIL_USER}>`;

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  token: string,
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }

  const safeName = escapeHtml(fullName);
  const verifyUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;

  try {
    await transporter.sendMail({
      from: FROM_ADDRESS,
      to: email,
      subject: "Verify your email address",
      text: `Welcome, ${fullName}! Verify your email by visiting: ${verifyUrl} (expires in 24 hours)`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F172A;">Welcome, ${safeName}!</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Thanks for registering with Barangay San Isidro's resident portal.
            Please verify your email address to continue.
          </p>
          
            href="${verifyUrl}"
            style="display: inline-block; margin: 16px 0; padding: 12px 24px;
                   background-color: #B8860B; color: #0F172A; font-weight: 600;
                   text-decoration: none; border-radius: 999px; font-size: 14px;"
          >
            Verify Email
          </a>
          <p style="color: #94a3b8; font-size: 12px;">
            This link expires in 24 hours. If you didn't create this account,
            you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`Failed to send verification email to ${email}:`, err);
    throw new Error("Could not send verification email");
  }
}

export async function sendWelcomePendingApprovalEmail(
  email: string,
  fullName: string,
) {
  const safeName = escapeHtml(fullName);

  try {
    await transporter.sendMail({
      from: FROM_ADDRESS,
      to: email,
      subject: "Email verified — your account is pending approval",
      text: `Thank you, ${fullName}! Your email has been verified and your registration is pending admin approval. This usually takes 1–2 business days.`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #0F172A;">Thank you, ${safeName}!</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Your email has been successfully verified. Your registration is
            now being reviewed by a Barangay San Isidro administrator.
          </p>
          <div style="background-color: #FFFBF0; border: 1px solid rgba(184,134,11,0.3);
                      border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="color: #B8860B; font-weight: 600; font-size: 13px; margin: 0 0 4px;">
              What happens next?
            </p>
            <p style="color: #475569; font-size: 13px; line-height: 1.6; margin: 0;">
              An admin will verify your submitted ID and approve your account.
              This usually takes 1–2 business days. You'll receive another
              email once your account is approved and ready to use.
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">
            If you have any questions in the meantime, feel free to visit or
            contact the Barangay San Isidro office directly.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`Failed to send pending-approval email to ${email}:`, err);
    throw new Error("Could not send pending-approval email");
  }
}