import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

type TransportOptionsWithFamily = SMTPTransport.Options & {
  family?: number;
};

const options: TransportOptionsWithFamily = {
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  family: 4, // force IPv4 — avoids ENETUNREACH when IPv6 routing is broken
};

export const transporter = nodemailer.createTransport(options);