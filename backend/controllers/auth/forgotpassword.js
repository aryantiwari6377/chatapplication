

import dotenv from 'dotenv';
dotenv.config();

import usermodel from '../../models/usermodel.js';
import jwt from 'jsonwebtoken';
// import { enqueueEmail } from '../../util/emailQueue.js';

// ─── OLD DIRECT NODEMAILER APPROACH (kept for reference) ─────────────────────
import { testaccount } from '../../util/nodemailer.js';

export const forgot = async (req, res) => {
  const { email } = req.body;
  try {
    const usercheck = await usermodel.findOne({ email });
    if (!usercheck) return res.status(400).json({ message: 'No account found.' });

    const token = jwt.sign({ id: usercheck._id, email }, process.env.SECRET_KEY, { expiresIn: '2h' });
    const resetURL = `http://localhost:3000/reset-password/${token}`;

    await testaccount.sendMail({           // ← blocks until SMTP responds
      from: process.env.GMAIL_USER,
      to: usercheck.email,
      subject: 'Password Reset Request',
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;">
          <h2 style="color:#213858;">Reset your password</h2>
          <p>Hi ${usercheck.username},</p>
          <p>Someone requested a password reset for your Chat App account.</p>
          <p>
            <a href="${resetURL}"
               style="display:inline-block;padding:10px 24px;background:#213858;color:#fff;
                      border-radius:6px;text-decoration:none;font-weight:bold;">
              Reset Password
            </a>
          </p>
          <p style="color:#888;font-size:12px;">
            This link expires in 2 hours.<br/>
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });


    return res.status(200).json({ message: 'Email sent.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
};
// ─────────────────────────────────────────────────────────────────────────────


//code for sqs mail system->

// export const forgot = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: 'Email is required.' });
//   }

//   try {
//     // 1. Look up user
//     const usercheck = await usermodel.findOne({ email });

//     if (!usercheck) {
//       console.log('[Forgot] No account for email:', email);
//       return res.status(400).json({ message: 'No account found with that email.' });
//     }

//     // 2. Generate a short-lived JWT reset token
//     const token = jwt.sign(
//       { id: usercheck._id, email: usercheck.email },
//       process.env.SECRET_KEY,
//       { expiresIn: '2h' }
//     );

//     const resetURL = `http://localhost:3000/reset-password/${token}`;

//     // 3. Build the email payload
//     const emailPayload = {
//       to:      usercheck.email,
//       subject: 'Password Reset Request',
//       html: `
//         <div style="font-family:sans-serif;max-width:480px;margin:auto;">
//           <h2 style="color:#213858;">Reset your password</h2>
//           <p>Hi ${usercheck.username},</p>
//           <p>Someone requested a password reset for your Chat App account.</p>
//           <p>
//             <a href="${resetURL}"
//                style="display:inline-block;padding:10px 24px;background:#213858;color:#fff;
//                       border-radius:6px;text-decoration:none;font-weight:bold;">
//               Reset Password
//             </a>
//           </p>
//           <p style="color:#888;font-size:12px;">
//             This link expires in 2 hours.<br/>
//             If you didn't request this, you can safely ignore this email.
//           </p>
//         </div>
//       `,
//     };

//     // 4. Push to SQS — returns immediately, worker sends the email asynchronously
//     await enqueueEmail(emailPayload);
//     console.log('[Forgot] Reset email queued for:', usercheck.email);

//     // 5. Respond immediately — no waiting for SMTP
//     return res.status(200).json({
//       message: 'Password reset link sent to your email.',
//     });

//   } catch (error) {
//     console.error('[Forgot] Error:', error.message);
//     return res.status(500).json({
//       message: 'Something went wrong. Please try again.',
//       error: error.message,
//     });
//   }
// };
