import { transporter } from "../mailer";


interface RequestConfirmationParams {
  to: string;
  recipientName: string;
  referenceNo: string;
  serviceTitle: string;
  category: string;
  fee: string;
  purpose: string;
  submittedDate: string;
}

export async function sendRequestConfirmationEmail({
  to,
  recipientName,
  referenceNo,
  serviceTitle,
  category,
  fee,
  purpose,
  submittedDate,
}: RequestConfirmationParams) {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Request Submitted</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding: 32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 32px 40px;">
                <p style="margin:0; color:#bfdbfe; font-size:13px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">Request Confirmation</p>
                <h1 style="margin:8px 0 0; color:#ffffff; font-size:22px; font-weight:600;">Your request has been submitted</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px 40px 8px;">
                <p style="margin:0 0 16px; color:#111827; font-size:15px; line-height:1.6;">
                  Hi ${recipientName},
                </p>
                <p style="margin:0 0 24px; color:#374151; font-size:15px; line-height:1.6;">
                  We've received your request. Please keep the reference number below for tracking — you'll need it if you follow up on the status.
                </p>
              </td>
            </tr>

            <!-- Reference Box -->
            <tr>
              <td style="padding: 0 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
                  <tr>
                    <td style="padding: 20px 24px;">
                      <p style="margin:0 0 4px; color:#6b7280; font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase;">Reference No.</p>
                      <p style="margin:0; color:#1e3a8a; font-size:20px; font-weight:700; letter-spacing:0.5px;">${referenceNo}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Details -->
            <tr>
              <td style="padding: 24px 40px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#6b7280; font-size:13px; width:40%;">Service</td>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#111827; font-size:14px; font-weight:500; text-align:right;">${serviceTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#6b7280; font-size:13px;">Category</td>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#111827; font-size:14px; font-weight:500; text-align:right;">${category}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#6b7280; font-size:13px;">Fee</td>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#111827; font-size:14px; font-weight:500; text-align:right;">${fee}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#6b7280; font-size:13px;">Purpose</td>
                    <td style="padding: 10px 0; border-bottom:1px solid #f1f5f9; color:#111827; font-size:14px; font-weight:500; text-align:right;">${purpose}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color:#6b7280; font-size:13px;">Date Submitted</td>
                    <td style="padding: 10px 0; color:#111827; font-size:14px; font-weight:500; text-align:right;">${submittedDate}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Status badge -->
            <tr>
              <td style="padding: 24px 40px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#fef3c7; border-radius:20px; padding: 6px 14px;">
                      <span style="color:#92400e; font-size:12px; font-weight:600;">● Pending Review</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px; background-color:#f8fafc; border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 4px; color:#9ca3af; font-size:12px; line-height:1.6;">
                  This is an automated message. Please do not reply directly to this email.
                </p>
                <p style="margin:0; color:#9ca3af; font-size:12px;">
                  &copy; ${new Date().getFullYear()} Barangay Information System. All rights reserved.
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

  await transporter.sendMail({
    from: `"Barangay Services" <${process.env.SMTP_USER}>`,
    to,
    subject: `Request Received — Reference ${referenceNo}`,
    html,
  });
}