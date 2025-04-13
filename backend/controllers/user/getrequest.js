// import usermodel from "../../models/usermodel.js";

// export const requests = async(req,res)=>{
//        try{
//            const {id} = req.user; 
//            const user = await usermodel.findById(id);
//            if(!user){ res.status(0).json({message:"user not found"})}
        
//            console.log("user friends",user.friends);

//            const requestFriends = [];
//             for (const friend of user.friends) {
//                        if (friend.status === "receiver") {
                         
//                            const friendDetails = await usermodel.findById(friend.userId);
//                            if (friendDetails) {
//                                requestFriends.push(friendDetails);
//                            }
//                        }
//                    }
                 
//                     res.status(200).json({requestFriends});
//            }

    
//        catch(error) {
//              throw new Error(error);
//        }
//      }

import usermodel from "../../models/usermodel.js";

export const requests = async (req, res) => {
    try {
        
        const {id} = req.user; 
 
        const user = await usermodel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       
        console.log("User Friends Array:", user.friends);

        user.friends.forEach(friend => {
            console.log(`Friend ID: ${friend.userId}, Status: ${friend.status}`);
        });

        const receiverFriendsIds = user.friends
            .filter(friend => friend.status === "receiver")
            .map(friend => friend.userId);

        console.log("Receiver Friend IDs:", receiverFriendsIds);

        if (receiverFriendsIds.length === 0) {
            return res.status(200).json({ message: "No receiver friends found", requestFriends: [] });
        }

       
        const requestFriends = await usermodel.find({ _id: { $in: receiverFriendsIds } });

        return res.status(200).json({ requestFriends });
    } catch (error) {
        console.error("Error fetching request friends:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
