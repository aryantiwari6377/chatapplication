import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Lazy singleton — created on first call so env vars are always populated
let _transporter = null;

export const getTransporter = () => {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  return _transporter;
};

// Keep old export name so nothing else breaks
export const testaccount = {
  sendMail: (opts) => getTransporter().sendMail(opts),
};
