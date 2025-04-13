
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const testaccount = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS,  
    },
});


// exports.testaccount = testaccount;
