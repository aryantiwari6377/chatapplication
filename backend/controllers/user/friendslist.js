import usermodel from "../../models/usermodel.js";

export const friendslist = async(req, res) => {
   
    try {
     
        const { id } = req.user;

        const user = await usermodel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

         
        
        const activeFriends = [];
        for (const friend of user.friends) {
            if (friend.status === "active") {
              
                const friendDetails = await usermodel.findById(friend.userId);
                if (friendDetails) {
                    activeFriends.push(friendDetails);
                }
            }
        }
   
        return res.status(200).json({activeFriends });
    } catch (error) {
  
        return res.status(500).json({ error: error.message });
    }
  

}



