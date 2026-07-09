import { transporter } from "./mailer";

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  token: string,
) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Brgy. San Isidro" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0F172A;">Welcome, ${fullName}!</h2>
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
}
