import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

let _transporter = null;

export const getTransporter = () => {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      // Required on networks where a proxy/antivirus intercepts TLS
      // (e.g. corporate networks, some ISPs on Windows)
      rejectUnauthorized: false,
    },
  });

  return _transporter;
};

export const testaccount = {
  sendMail: (opts) => getTransporter().sendMail(opts),
};
