import usermodel from "../../models/usermodel.js";

export const signup = async (req, res) => {
    try {
      const { username, email, password} = req.body;
      
       console.log(username);
     
      const user = await usermodel.findOne({ email });
  
      if (user) {
        
        return res.status(400).json({ message: "User already exists" });
      }
      
      const newuser = new usermodel({
        username: username,
        email: email,
        password: password,
        friends: [], 
      });
  
      await newuser.save();
  

      return res.status(201).json({ message: "User created successfully", user: newuser });
    } catch (error) {
     
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  }