import { transporter } from "../mailer";


type SendRequestStatusUpdateParams = {
  to: string;
  recipientName: string;
  referenceNo: string;
  serviceTitle: string;
  status: "released" | "rejected";
};

export async function sendRequestStatusUpdateEmail({
  to,
  recipientName,
  referenceNo,
  serviceTitle,
  status,
}: SendRequestStatusUpdateParams) {
  const isReleased = status === "released";

  const subject = isReleased
    ? `Your ${serviceTitle} request has been approved — Ref ${referenceNo}`
    : `Update on your ${serviceTitle} request — Ref ${referenceNo}`;

  const statusLine = isReleased
    ? `Good news — your request has been <strong style="color:#059669;">approved and released</strong>. You may now claim your document at the barangay hall.`
    : `We regret to inform you that your request has been <strong style="color:#e11d48;">rejected</strong>. Please visit the barangay hall or contact us for more details.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #0F172A;">
      <p style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #B8860B; font-weight: 700; margin-bottom: 8px;">
        Barangay San Isidro
      </p>
      <h2 style="font-size: 18px; margin: 0 0 16px;">Request Status Update</h2>
      <p style="font-size: 14px; line-height: 1.6;">Hi ${recipientName},</p>
      <p style="font-size: 14px; line-height: 1.6;">${statusLine}</p>
      <table style="width: 100%; font-size: 13px; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748B;">Reference No.</td>
          <td style="padding: 6px 0; font-weight: 700; text-align: right;">${referenceNo}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B;">Service</td>
          <td style="padding: 6px 0; font-weight: 700; text-align: right;">${serviceTitle}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B;">Status</td>
          <td style="padding: 6px 0; font-weight: 700; text-align: right; color: ${isReleased ? "#059669" : "#e11d48"};">
            ${isReleased ? "Released" : "Rejected"}
          </td>
        </tr>
      </table>
      <p style="font-size: 12px; color: #94A3B8; margin-top: 24px;">
        This is an automated message from Barangay San Isidro's request system.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}