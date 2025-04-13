 import usermodel from "../../models/usermodel.js";

// export const profiledata = async(req,res)=>{
             
//              const {id} = req.user.id;
//              console.log(id);
//              const user = await usermodel.findById(id);
//             if(!user){
//                 res.status(404).json({message:"user not found"});
//             }
//             res.status(200).json({user});
// }
export const profiledata = async (req, res) => {
    try {
      const { id } = req.user; // Ensure correct destructuring
      console.log('User ID:', id);
  
      const user = await usermodel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // Return here
      }
  
      res.status(200).json({ user }); // Response sent only once
    } catch (error) {
      console.error('Error fetching profile data:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  