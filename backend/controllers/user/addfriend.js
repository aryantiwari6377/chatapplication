import usermodel from "../../models/usermodel.js";


export const addfriend = async(req, res) => {
  try {
    const { email } = req.body;
    const receiverEmail = email;
    const { id } = req.user;
    const senderId = id;

    console.log(receiverEmail, senderId);

    
    const sender = await usermodel.findOne({ _id: senderId });

    const receiver = await usermodel.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(404).json({ message: "User does not exist" });
    }

    console.log("Receiver is", receiver);

    receiver.friends.push({
      userId: senderId,
      status: 'receiver',
       name: sender.username
    });

    await receiver.save();

 
    console.log("Sender is", sender);

    sender.friends.push({
      userId: receiver._id,
      status: 'sender',
       name: receiver.username
    });

    await sender.save();

    return res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const requestaction = async (req, res) => {
  try {
  
    // const receiverId = "67613fd12ed99f40b44755d4";//i think const { id } = req.user; receiverId =id; this is correct
   const {id} = req.user;
    const receiverId = id;
    const { value,  senderId } = req.body;
    console.log("id is correct",receiverId);
    if (!receiverId || !senderId || !value) {
      return res.status(400).json({ message: "Invalid input" });
    }
      
    const receiver = await usermodel.findById(receiverId);
    const sender = await usermodel.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const receiverFriendRequest = receiver.friends.find(friend => friend.userId.toString() === senderId);

    if (!receiverFriendRequest) {
      return res.status(400).json({ message: "No pending request found" });
    }
      
    if (value === "reject") {
        
      receiver.friends = receiver.friends.filter(friend => friend.userId.toString() !== senderId);
      await receiver.save();
       
      sender.friends = sender.friends.filter(friend => friend.userId.toString() !== receiverId);
      await sender.save();
       
      return res.status(200).json({ message: "rejected" });
    } else if (value === "accept") {
      
      receiver.friends = receiver.friends.map(friend => {
        if (friend.userId.toString() === senderId) {
          friend.status = 'active';
        }
        return friend;
      });
      await receiver.save();

      sender.friends = sender.friends.map(friend => {
        if (friend.userId.toString() === receiverId) {
          friend.status = 'active';
        }
        return friend;
      });
      await sender.save();

      return res.status(200).json({ message: "accepted" });
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'accept' or 'reject'" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
