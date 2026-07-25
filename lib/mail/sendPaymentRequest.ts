import { transporter } from "../mailer";

export async function sendPaymentRequestEmail({
  to,
  recipientName,
  referenceNo,
  serviceTitle,
  amountLabel,
  payOnlineUrl,
  payInPersonUrl,
}: {
  to: string;
  recipientName: string;
  referenceNo: string;
  serviceTitle: string;
  amountLabel: string;
  payOnlineUrl: string;
  payInPersonUrl: string;
}) {
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
    <p style="color:#B8860B;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:0 0 8px;">
      ${referenceNo}
    </p>
    <h2 style="margin:0 0 12px;color:#0F172A;">Your ${serviceTitle} request has been approved</h2>
    <p style="color:#475569;font-size:14px;line-height:1.6;">
      Hi ${recipientName}, your request is approved and ready for payment (${amountLabel})
      before we release your certificate. Pay online or in person at the barangay
      cashier — whichever works best for you.
    </p>
    <div style="margin:24px 0;text-align:center;">
      <a href="${payOnlineUrl}"
        style="display:inline-block;background:#0F172A;color:#fff;padding:12px 22px;
        border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px 10px;">
        Pay Online
      </a>
      <a href="${payInPersonUrl}"
        style="display:inline-block;border:1px solid #0F172A;color:#0F172A;padding:12px 22px;
        border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px 10px;">
        Pay In Person
      </a>
    </div>
    <p style="color:#94a3b8;font-size:12px;">
      Keep your reference number ${referenceNo} handy for either payment method.
    </p>
    </div>`;

  await transporter.sendMail({
    from: `"Barangay Services" <${process.env.SMTP_USER}>`,
    to,
    subject: `Payment required for your ${serviceTitle} request`,
    html,
  });
}
// import { transporter } from "../mailer";

// export async function sendPaymentRequestEmail({
//   to,
//   recipientName,
//   referenceNo,
//   serviceTitle,
//   amountLabel,
//   payOnlineUrl,
//   payInPersonUrl,
//   isManualPayment,
// }: {
//   to: string;
//   recipientName: string;
//   referenceNo: string;
//   serviceTitle: string;
//   amountLabel: string;
//   payOnlineUrl?: string;
//   payInPersonUrl: string;
//   isManualPayment?: boolean;
// }) {
//   const showOnlineButton = !isManualPayment && !!payOnlineUrl;

//   const introText = showOnlineButton
//     ? `Hi ${recipientName}, your request is approved and ready for payment (${amountLabel})
//        before we release your certificate. Pay online or in person at the barangay
//        cashier — whichever works best for you.`
//     : `Hi ${recipientName}, your request is approved and ready for payment (${amountLabel})
//        before we release your certificate. Please pay in person at the barangay
//        cashier using the reference number below.`;

//   const onlineButton = showOnlineButton
//     ? `<a href="${payOnlineUrl}"
//         style="display:inline-block;background:#0F172A;color:#fff;padding:12px 22px;
//         border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px 10px;">
//         Pay Online
//       </a>`
//     : "";

//   const html = `
//   <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;">
//     <p style="color:#B8860B;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin:0 0 8px;">
//       ${referenceNo}
//     </p>
//     <h2 style="margin:0 0 12px;color:#0F172A;">Your ${serviceTitle} request has been approved</h2>
//     <p style="color:#475569;font-size:14px;line-height:1.6;">
//       ${introText}
//     </p>
//     <div style="margin:24px 0;text-align:center;">
//       ${onlineButton}
//       <a href="${payInPersonUrl}"
//         style="display:inline-block;border:1px solid #0F172A;color:#0F172A;padding:12px 22px;
//         border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:0 6px 10px;">
//         Pay In Person
//       </a>
//     </div>
//     <p style="color:#94a3b8;font-size:12px;">
//       Keep your reference number ${referenceNo} handy for either payment method.
//     </p>
//     </div>`;

//   await transporter.sendMail({
//     from: `"Barangay Services" <${process.env.SMTP_USER}>`,
//     to,
//     subject: `Payment required for your ${serviceTitle} request`,
//     html,
//   });
// }