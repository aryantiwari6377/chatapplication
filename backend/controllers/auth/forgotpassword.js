import dotenv from 'dotenv';
dotenv.config();

import usermodel from '../../models/usermodel.js';
import { testaccount } from '../../util/nodemailer.js';
import jwt from 'jsonwebtoken';

export const forgot = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const usercheck = await usermodel.findOne({ email });

    if (!usercheck) {
      console.log('Forgot password: user not found for', email);
      return res.status(400).json({ message: 'No account found with that email.' });
    }

    const token = jwt.sign(
      { id: usercheck._id, email: usercheck.email },
      process.env.SECRET_KEY,
      { expiresIn: '2h' }
    );

    const resetURL = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: {
        name: 'Chat App',
        address: process.env.GMAIL_USER,
      },
      to: usercheck.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;">
          <h2 style="color:#213858;">Reset your password</h2>
          <p>Someone requested a password reset for your account.</p>
          <p>
            <a href="${resetURL}"
               style="display:inline-block;padding:10px 20px;background:#213858;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">
              Reset Password
            </a>
          </p>
          <p style="color:#888;font-size:12px;">This link expires in 2 hours. If you didn't request this, ignore this email.</p>
        </div>
      `,
    };

    await testaccount.sendMail(mailOptions);
    console.log('Password reset email sent to', usercheck.email);

    return res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error code:', error.code);
    console.error('Forgot password error message:', error.message);
    console.error('Forgot password full error:', error);
    return res.status(500).json({
      message: 'Failed to send reset email. Please try again.',
      error: error.message,
    });
  }
};
