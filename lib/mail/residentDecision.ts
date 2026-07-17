const BARANGAY_NAME = process.env.BARANGAY_NAME ?? "Barangay Portal";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@example.com";
const PORTAL_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://example.com";
const LOGO_URL = process.env.BARANGAY_LOGO_URL ?? "/barangay-logo.svg"; // optional, leave blank to hide

function baseLayout(opts: {
  preheader: string;
  bannerColor: string;
  bannerText: string;
  bodyHtml: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BARANGAY_NAME}</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI', Arial, sans-serif;">
  <!-- preheader, hidden preview text in inbox list -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${opts.preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0F172A; padding:24px 32px;">
              ${
                LOGO_URL
                  ? `<img src="${LOGO_URL}" alt="${BARANGAY_NAME}" height="32" style="display:block;" />`
                  : `<span style="color:#ffffff; font-size:16px; font-weight:700; letter-spacing:0.02em;">${BARANGAY_NAME}</span>`
              }
            </td>
          </tr>

          <!-- Status banner -->
          <tr>
            <td style="background-color:${opts.bannerColor}; padding:10px 32px;">
              <span style="color:#ffffff; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                ${opts.bannerText}
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${opts.bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:#f8fafc; border-top:1px solid #e2e8f0;">
              <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.6;">
                This is an automated message from ${BARANGAY_NAME}. Please do not reply directly to this email.
                For assistance, contact us at
                <a href="mailto:${SUPPORT_EMAIL}" style="color:#B8860B; text-decoration:none;">${SUPPORT_EMAIL}</a>.
              </p>
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

export function approvalEmail(fullName: string) {
  const subject = `${BARANGAY_NAME}: Your resident account has been approved`;

  const bodyHtml = `
    <h1 style="margin:0 0 16px; font-size:20px; color:#0F172A; font-weight:700;">Hi ${fullName},</h1>
    <p style="margin:0 0 16px; font-size:14px; color:#334155; line-height:1.7;">
      We're pleased to inform you that your resident account has been <strong>reviewed and approved</strong>
      by the ${BARANGAY_NAME} administration.
    </p>
    <p style="margin:0 0 24px; font-size:14px; color:#334155; line-height:1.7;">
      You now have full access to resident services on the portal, including document requests,
      announcements, and household records.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:8px; background-color:#0F172A;">
          <a href="${PORTAL_URL}/login"
             style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
            Log in to your account
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = baseLayout({
    preheader: "Your resident account has been approved.",
    bannerColor: "#059669",
    bannerText: "Account approved",
    bodyHtml,
  });

  return { subject, html };
}

export function rejectionEmail(fullName: string, reason?: string) {
  const subject = `${BARANGAY_NAME}: Update on your resident account application`;

  const bodyHtml = `
    <h1 style="margin:0 0 16px; font-size:20px; color:#0F172A; font-weight:700;">Hi ${fullName},</h1>
    <p style="margin:0 0 16px; font-size:14px; color:#334155; line-height:1.7;">
      Thank you for registering with ${BARANGAY_NAME}. After review, we were unable to approve
      your resident account application at this time.
    </p>
    ${
      reason
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px; background-color:#fef2f2; border:1px solid #fecaca; border-radius:8px;">
             <tr>
               <td style="padding:14px 16px;">
                 <p style="margin:0; font-size:12px; font-weight:700; color:#b91c1c; text-transform:uppercase; letter-spacing:0.05em;">Reason</p>
                 <p style="margin:6px 0 0; font-size:14px; color:#7f1d1d; line-height:1.6;">${reason}</p>
               </td>
             </tr>
           </table>`
        : ""
    }
    <p style="margin:0; font-size:14px; color:#334155; line-height:1.7;">
      If you believe this was a mistake, or would like to update your details and resubmit,
      please visit your barangay office or reply to this email at
      <a href="mailto:${SUPPORT_EMAIL}" style="color:#B8860B;">${SUPPORT_EMAIL}</a>.
    </p>
  `;

  const html = baseLayout({
    preheader: "An update on your resident account application.",
    bannerColor: "#e11d48",
    bannerText: "Application not approved",
    bodyHtml,
  });

  return { subject, html };
}