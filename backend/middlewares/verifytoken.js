import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your JWT secret
        return decoded; // Contains user information (e.g., userId)
    } catch (error) {
        console.error('Invalid token:', error.message);
        return null;
    }
};