import express from 'express';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


export const authenticationcheck = (req,res,next)=>{
        
  const authheader = req.header('Authorization'); 
  console.log('Authorization Header:', authheader);
  
  if (!authheader) {
    return res.status(401).json({ message: 'no token' });
    
  }
   
  const token= authheader;
  console.log('Token:', token);
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token Verification Error:', error);
    return res.status(401).json({ message: 'token is not valid' });
  } 
  
} 