export function inviteEmailHtml(opts: {
  name?: string;
  roleTitle: string;
  barangay: string;
  acceptUrl: string;
}) {
  const greeting = opts.name ? `Hi ${opts.name},` : "Hi,";
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color:#0F172A;">
      <p style="color:#B8860B; font-size:12px; font-weight:600; letter-spacing:0.15em; text-transform:uppercase;">
        Barangay ${opts.barangay}
      </p>
      <h2 style="margin: 8px 0 16px;">You've been invited as ${opts.roleTitle}</h2>
      <p>${greeting}</p>
      <p>You've been invited to join the Barangay Portal. Click below to set your password and activate your account. This link expires in 7 days.</p>
      <p style="margin: 24px 0;">
        <a href="${opts.acceptUrl}"
           style="background:#0F172A; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
          Activate account
        </a>
      </p>
      <p style="font-size:12px; color:#64748B;">If you weren't expecting this invite, you can ignore this email.</p>
    </div>
  `;
}