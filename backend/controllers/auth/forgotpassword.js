// import dotenv from 'dotenv';
// dotenv.config();
// import usermodel from '../../models/usermodel.js';
// import { testaccount  } from '../../util/nodemailer.js';
// import jwt from 'jsonwebtoken';

// export const forgot =async(req,res)=>{
//     const { email } = req.body;
//     try {
//         const usercheck = await usermodel.findOne({ email });
         
//         if (usercheck) {
//             console.log("check the id is correct", usercheck._id);
//             const token = jwt.sign({ id: usercheck._id, email: email }, process.env.SECRET_KEY, { expiresIn: '2h' });
//             const resetURL = `http://localhost:3000/reset-password/${token}`;
            
//             const mailoptions = {
//                 from: process.env.GMAIL_USER,
//                 to: usercheck.email,
//                 subject: `Change your password using the below link`,
//                 html: `You requested for password reset<p>Click this <a href="${resetURL}">Link</a> to reset the password.</p>`,
//             };
 
//             await testaccount.sendMail(mailoptions);
//             console.log("Email sent successfully.");
 
//             return res.status(200).json({ message: "Mail sent" });
//         } else {
//             console.log("User not found");
//             return res.status(400).send({ message: "User not found" });
//         }
//     } catch (error) {
//         console.error("Error occurred: ", error.message);
//         return res.status(500).send(error.message);
//     }
// }
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import usermodel from '../../models/usermodel.js';
import jwt from 'jsonwebtoken';
dotenv.config();

export const createMailTransporter = () => {
    // Create the transporter with updated configuration
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Using port 587 for TLS
        secure: false, // false for TLS - as a boolean not string
        auth: {
            user: process.env.GMAIL_USER,
            // If using App Password
            pass: process.env.GMAIL_PASS, // Use app-specific password
        }, 
        tls: {
            rejectUnauthorized: true
        }
    });

    // Verify the connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log("Transporter verification failed:", error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    return transporter;
};

// Usage in your forgot password function
export const forgot = async (req, res) => {
    const { email } = req.body;
    
    try {
        const usercheck = await usermodel.findOne({ email });
        
        if (!usercheck) {
            console.log("User not found");
            return res.status(400).json({ message: "User not found" });
        }

        const token = jwt.sign(
            { id: usercheck._id, email: email },
            process.env.SECRET_KEY,
            { expiresIn: '2h' }
        );

        const resetURL = `http://localhost:3000/reset-password/${token}`;
        
        const transporter = createMailTransporter();
        
        const mailOptions = {
            from: {
                name: "Chat Application(reset-link)",
                address: process.env.GMAIL_USER
            },
            to: usercheck.email,
            subject: "Password Reset Request",
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested a password reset.</p>
                <p>Click this <a href="${resetURL}">link</a> to reset your password.</p>
                <p>This link will expire in 2 hours.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
        
        return res.status(200).json({ 
            message: "Password reset link sent to your email" 
        });

    } catch (error) {
        console.error("Error in forgot password:", error);
        return res.status(500).json({ 
            message: "Error sending password reset email",
            error: error.message 
        });
    }
};