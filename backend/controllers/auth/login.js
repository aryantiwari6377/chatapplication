import usermodel from '../../models/usermodel.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();

export const login = async(req,res) =>{
      try{
          const {email, password} = req.body;
          const user = await usermodel.findOne({email});
          console.log(req.body);
            
          if(!user){
            return  res.status(404).json({message:"user not found"});
          }
          
         const isMatch = await bcrypt.compare(password,user.password);
         
         if(!isMatch){
          return  res.status(401).json({message:"invalid credentials"});
         }
            
          const token = jwt.sign({id: user._id, email: user.email},process.env.SECRET_KEY,{expiresIn:'1h'});
          
          const refreshtoken = jwt.sign({id: user._id, email: user.email},process.env.REFRESH_KEY,{expiresIn:'15d'})
            
           console.log(token, refreshtoken);
           return  res.status(200).json({message:"login successfully", token, refreshtoken});
      }
      catch(error){
        return  res.status(500).json({error: error.message});
        console.log(error);
      }
}
