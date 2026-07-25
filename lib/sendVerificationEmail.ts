import { transporter } from "./mailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildAppUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }
  return `${base}${path}`;
}

const FROM_ADDRESS =
  process.env.MAIL_FROM ?? `"Brgy. San Isidro" <${process.env.GMAIL_USER}>`;

function emailShell(bodyHtml: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9; padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; font-family:Arial, Helvetica, sans-serif;">
          <tr>
            <td style="background-color:#0F172A; padding:24px 32px;">
              <span style="color:#ffffff; font-size:16px; font-weight:700; letter-spacing:0.5px;">
                BARANGAY SAN ISIDRO
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#F8FAFC; padding:16px 32px; text-align:center;">
              <span style="color:#94A3B8; font-size:11px;">
                Barangay San Isidro Resident Portal
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  token: string,
) {
  const safeName = escapeHtml(fullName);
  const verifyUrl = buildAppUrl(`/verify-email?token=${encodeURIComponent(token)}`);

  const html = emailShell(`
    <h2 style="margin:0 0 12px; color:#0F172A; font-size:20px;">Welcome, ${safeName}!</h2>
    <p style="margin:0 0 20px; color:#475569; font-size:14px; line-height:1.6;">
      Thanks for registering with Barangay San Isidro's resident portal.
      Please verify your email address to continue.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:999px; background-color:#B8860B;">
          <a href="${verifyUrl}" target="_blank"
             style="display:inline-block; padding:12px 28px; color:#0F172A; font-weight:600; font-size:14px; text-decoration:none;">
            Verify Email
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0; color:#94A3B8; font-size:12px; line-height:1.5;">
      This link expires in 24 hours. If you didn't create this account,
      you can safely ignore this email.
    </p>
  `);

  const text = `Welcome, ${fullName}!

Thanks for registering with Barangay San Isidro's resident portal. Verify your email by visiting:
${verifyUrl}

This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.`;

  try {
    await transporter.sendMail({
      from: FROM_ADDRESS,
      to: email,
      subject: "Verify your email address",
      text,
      html,
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

  const html = emailShell(`
    <h2 style="margin:0 0 12px; color:#0F172A; font-size:20px;">Thank you, ${safeName}!</h2>
    <p style="margin:0 0 20px; color:#475569; font-size:14px; line-height:1.6;">
      Your email has been successfully verified. Your registration is now
      being reviewed by a Barangay San Isidro administrator.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:#FFFBF0; border:1px solid rgba(184,134,11,0.3); border-radius:12px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:0 0 4px; color:#B8860B; font-weight:600; font-size:13px;">
            What happens next?
          </p>
          <p style="margin:0; color:#475569; font-size:13px; line-height:1.6;">
            An admin will verify your submitted ID and approve your account.
            This usually takes 1–2 business days. You'll receive another
            email once your account is approved and ready to use.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:20px 0 0; color:#94A3B8; font-size:12px; line-height:1.5;">
      If you have any questions in the meantime, feel free to visit or
      contact the Barangay San Isidro office directly.
    </p>
  `);

  const text = `Thank you, ${fullName}!

Your email has been successfully verified. Your registration is now being reviewed by a Barangay San Isidro administrator.

What happens next?
An admin will verify your submitted ID and approve your account. This usually takes 1–2 business days. You'll receive another email once your account is approved and ready to use.

If you have any questions in the meantime, feel free to visit or contact the Barangay San Isidro office directly.`;

  try {
    await transporter.sendMail({
      from: FROM_ADDRESS,
      to: email,
      subject: "Email verified — your account is pending approval",
      text,
      html,
    });
  } catch (err) {
    console.error(`Failed to send pending-approval email to ${email}:`, err);
    throw new Error("Could not send pending-approval email");
  }
}