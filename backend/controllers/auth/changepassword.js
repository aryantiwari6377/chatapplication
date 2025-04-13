
// import usermodel from "../../models/usermodel.js";
// import bcrypt from "bcryptjs";

// export const changepassword = async (req, res) => {
//     const { token } = req.params;
//     const { newpassword } = req.body;
//     console.log(newpassword);
//     console.log("token from mail",token);
//     let decoded;
//     try {
//       decoded = jwt.verify(token,process.env.SECRET_KEY);
//     } catch (err) {
//       return res.status(400).send('Invalid or expired token');
//     }
//     const user = await usermodel.findById(decoded.id);
//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newpassword, salt);
//     await user.save();
//       console.log("password saved");
//     res.send('Password has been reset');
//   };

import usermodel from "../../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'; 
import dotenv from "dotenv";
dotenv.config();

export const changepassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newpassword } = req.body;
        
        console.log("Received request with:", {
            token: token,
            newpassword: newpassword
        });
    
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log("Decoded token:", decoded);
        } catch (err) {
            console.error("Token verification failed:", err);
            return res.status(400).json({ message: 'Invalid or expired token', error: err.message });
        }

        console.log("Looking for user with ID:", decoded.id);
        const user = await usermodel.findById(decoded.id);
        
        if (!user) {
            console.log("No user found with ID:", decoded.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("User found, generating salt");
        const salt = await bcrypt.genSalt(10);
        
        console.log("Hashing new password");
        user.password = await bcrypt.hash(newpassword, salt);
        
        console.log("Saving user");
        await user.save();

        console.log("Password successfully updated");
        return res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error("Error in changepassword:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};