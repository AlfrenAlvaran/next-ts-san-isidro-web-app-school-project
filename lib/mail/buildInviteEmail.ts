interface InviteEmailParams {
  to: string;
  name: string;
  role: "admin" | "staff";
  inviteUrl: string;
}

const ROLE_LABEL: Record<InviteEmailParams["role"], string> = {
  admin: "admin",
  staff: "staff",
};

export function buildInviteEmail({
  to,
  name,
  role,
  inviteUrl,
}: InviteEmailParams) {
  const subject = "You've been invited to San Isidro's staff portal";

  const text = `Hi ${name},

You've been invited to join the San Isidro staff portal as ${ROLE_LABEL[role]}.

Set up your account here:
${inviteUrl}

This link will expire in 7 days. If you weren't expecting this invite, you can ignore this email.`;

  const html = `
  <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
    <p style="color:#B8860B; font-size:12px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; margin:0 0 16px;">
      San Isidro &middot; Staff Portal
    </p>
    <h1 style="font-size:20px; color:#0F172A; margin:0 0 16px;">You're invited, ${escapeHtml(name)}.</h1>
    <p style="font-size:14px; color:#475569; line-height:1.6; margin:0 0 24px;">
      You've been added as <strong>${ROLE_LABEL[role]}</strong>. Click the button below to set your
      password and log in.
    </p>
    <a href="${inviteUrl}"
       style="display:inline-block; background:#0F172A; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 20px; border-radius:8px;">
      Set up your account
    </a>
    <p style="font-size:12px; color:#94A3B8; line-height:1.6; margin:24px 0 0;">
      This link expires in 7 days. If you weren't expecting this invite, you can safely ignore this email.
    </p>
  </div>`;

  return { to, subject, text, html };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
