import RequestModel from "@/models/RequestModel";
import ResidentProfileModel from "@/models/ResidentProfileModel";
import UserModel from "@/models/UserModel";
import { sendMail } from "../mailer";


function generateSaleInvoiceNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `SO-${year}-${random}`;
}

export async function markRequestPaidAndNotify(query: Record<string, unknown>) {
  const existing = await RequestModel.findOne(query);
  if (!existing) return null;

  // Already paid — don't regenerate an invoice number or re-send the email.
  if (existing.paymentStatus === "paid") return existing;

  let saleInvoiceNumber = existing.saleInvoiceNumber;
  if (!saleInvoiceNumber) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateSaleInvoiceNumber();
      const clash = await RequestModel.exists({ saleInvoiceNumber: candidate });
      if (!clash) {
        saleInvoiceNumber = candidate;
        break;
      }
    }
    if (!saleInvoiceNumber) {
      throw new Error("Could not generate a unique sale invoice number");
    }
  }

  // Guard the update itself on paymentStatus !== "paid" so two concurrent
  // callers (e.g. webhook retry racing an admin PATCH) can't both "win".
  const updated = await RequestModel.findOneAndUpdate(
    { _id: existing._id, paymentStatus: { $ne: "paid" } },
    { paymentStatus: "paid", saleInvoiceNumber, paidAt: new Date() },
    { returnDocument: "after" },
  );

  if (!updated) return existing; // someone else already marked it paid

  await sendInvoiceEmail(updated).catch((err) =>
    console.error("Failed to send invoice email:", err),
  );

  return updated;
}

async function sendInvoiceEmail(request: any) {
  const profile = await ResidentProfileModel.findById(
    request.profile_id,
  ).lean();
  if (!profile) {
    console.warn("No resident profile for request", request._id);
    return;
  }

  const user = await UserModel.findById(profile.user)
    .select("email fullName")
    .lean();
  if (!user?.email) {
    console.warn("No user email for profile", profile._id);
    return;
  }

  const issuedDate = (request.paidAt ?? new Date()).toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const recipientName = user.fullName ?? "Resident";

  const html = buildInvoiceHtml({
    recipientName,
    invoiceNo: request.saleInvoiceNumber,
    referenceNo: request.referenceNo,
    serviceTitle: request.serviceTitle,
    category: request.category,
    fee: request.fee,
    issuedDate,
  });

  const text = [
    `Payment received — Invoice ${request.saleInvoiceNumber}`,
    ``,
    `Hi ${recipientName},`,
    `We've received your payment for ${request.serviceTitle}.`,
    ``,
    `Invoice No: ${request.saleInvoiceNumber}`,
    `Reference No: ${request.referenceNo}`,
    `Service: ${request.serviceTitle} (${request.category})`,
    `Amount Paid: ${request.fee}`,
    `Date Issued: ${issuedDate}`,
    ``,
    `Please present this confirmation when you pick up your request.`,
  ].join("\n");

  await sendMail({
    to: user.email,
    subject: `Payment Confirmed — Invoice ${request.saleInvoiceNumber}`,
    html,
    text,
  });
}

function buildInvoiceHtml(data: {
  recipientName: string;
  invoiceNo: string;
  referenceNo: string;
  serviceTitle: string;
  category: string;
  fee: string;
  issuedDate: string;
}) {
  const {
    recipientName,
    invoiceNo,
    referenceNo,
    serviceTitle,
    category,
    fee,
    issuedDate,
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background-color:#1f2937; padding:24px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#ffffff; font-size:18px; font-weight:bold; letter-spacing:0.3px;">
                      Barangay Portal
                    </td>
                    <td align="right" style="color:#9ca3af; font-size:13px;">
                      Official Receipt
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Status banner -->
            <tr>
              <td style="background-color:#ecfdf5; padding:16px 32px; border-bottom:1px solid #d1fae5;">
                <span style="color:#047857; font-size:14px; font-weight:600;">
                  &#10003; Payment Received
                </span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 8px 0; font-size:15px; color:#111827;">
                  Hi ${escapeHtml(recipientName)},
                </p>
                <p style="margin:0 0 24px 0; font-size:14px; color:#4b5563; line-height:1.6;">
                  We've received your payment. Please find your invoice details below.
                  Keep this email as proof of payment when you pick up your request.
                </p>

                <!-- Invoice meta -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="font-size:12px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.4px; padding-bottom:2px;">
                      Invoice No.
                    </td>
                    <td align="right" style="font-size:12px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.4px; padding-bottom:2px;">
                      Date Issued
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:15px; color:#111827; font-weight:600;">
                      ${escapeHtml(invoiceNo)}
                    </td>
                    <td align="right" style="font-size:15px; color:#111827; font-weight:600;">
                      ${escapeHtml(issuedDate)}
                    </td>
                  </tr>
                </table>

                <!-- Line item table -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:6px; overflow:hidden;">
                  <tr style="background-color:#f9fafb;">
                    <td style="padding:10px 16px; font-size:12px; color:#6b7280; font-weight:600; border-bottom:1px solid #e5e7eb;">
                      Description
                    </td>
                    <td align="right" style="padding:10px 16px; font-size:12px; color:#6b7280; font-weight:600; border-bottom:1px solid #e5e7eb;">
                      Amount
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px; font-size:14px; color:#111827;">
                      ${escapeHtml(serviceTitle)}<br/>
                      <span style="font-size:12px; color:#9ca3af;">${escapeHtml(category)}</span>
                    </td>
                    <td align="right" style="padding:14px 16px; font-size:14px; color:#111827; white-space:nowrap;">
                      ${escapeHtml(fee)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; font-size:13px; color:#6b7280; border-top:1px solid #e5e7eb;">
                      Reference No.
                    </td>
                    <td align="right" style="padding:12px 16px; font-size:13px; color:#6b7280; border-top:1px solid #e5e7eb;">
                      ${escapeHtml(referenceNo)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 16px; font-size:14px; color:#111827; font-weight:700; border-top:1px solid #e5e7eb;">
                      Total Paid
                    </td>
                    <td align="right" style="padding:14px 16px; font-size:16px; color:#047857; font-weight:700; border-top:1px solid #e5e7eb;">
                      ${escapeHtml(fee)}
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 0 0; font-size:13px; color:#9ca3af; line-height:1.6;">
                  This is a system-generated invoice. If you have questions about this transaction,
                  please reply to this email or visit your barangay office.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
                <p style="margin:0; font-size:12px; color:#9ca3af; text-align:center;">
                  &copy; ${new Date().getFullYear()} Barangay Portal. All rights reserved.
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

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
