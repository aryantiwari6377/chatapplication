import usermodel from "../../models/usermodel.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await usermodel.findOne({ email: email.toLowerCase() });
    if (user) {
     
         return res.status(400).json({ status: 400, message: "User already exists" });
    }

    const newuser = new usermodel({
      username,
      email: email.toLowerCase(),
      password,
      friends: [],
    });

    await newuser.save();
    return res.status(201).json({ message: "User created successfully", user: newuser });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
