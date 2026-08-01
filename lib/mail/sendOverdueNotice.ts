// lib/mail/sendOverdueNotice.ts
//
// NOTE: this mirrors the shape of the other senders in this folder
// (sendRequestConfirmationEmail, sendRequestStatusUpdateEmail,
// sendPaymentRequestEmail). It's written as a self-contained nodemailer
// sender using SMTP_* env vars — if you already have a shared transporter
// / mail-provider helper those files call into, swap the `transporter`
// block below for that shared helper instead of duplicating it here.

import nodemailer from "nodemailer";

type SendOverdueNoticeParams = {
  to: string;
  recipientName: string;
  referenceNo: string;
  serviceTitle: string;
  message: string;
  // Pre-formatted, human-readable date, e.g. "Monday, August 10, 2026".
  revisedPickupDate: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOverdueNoticeEmail({
  to,
  recipientName,
  referenceNo,
  serviceTitle,
  message,
  revisedPickupDate,
}: SendOverdueNoticeParams) {
  const subject = `Update on your ${serviceTitle} request (${referenceNo})`;

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #94A3B8; margin-bottom: 4px;">
        Resident Portal
      </p>
      <h2 style="font-size: 18px; margin: 0 0 12px;">Hi ${recipientName},</h2>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
        ${message}
      </p>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin: 0 0 16px;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #94A3B8; margin: 0 0 4px;">
          Reference number
        </p>
        <p style="font-size: 15px; font-weight: 700; margin: 0 0 12px;">${referenceNo}</p>
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #94A3B8; margin: 0 0 4px;">
          New pickup date
        </p>
        <p style="font-size: 15px; font-weight: 700; margin: 0;">${revisedPickupDate}</p>
      </div>
      <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0;">
        We apologize for the delay and appreciate your patience. You can also see this
        update anytime by logging into the resident portal.
      </p>
    </div>
  `;

  const text = `Hi ${recipientName},

${message}

Reference number: ${referenceNo}
New pickup date: ${revisedPickupDate}

We apologize for the delay and appreciate your patience. You can also see this update anytime by logging into the resident portal.`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Barangay Resident Portal <no-reply@barangay.gov.ph>",
    to,
    subject,
    html,
    text,
  });
}