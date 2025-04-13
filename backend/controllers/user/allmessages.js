import Message from "../../models/messagemodel.js"; 
import mongoose from "mongoose";

// export const allmessages = async (req, res) => {
//     console.log("Query parameters received:", req.query);
//     const { id, senderid } = req.query;

//     const receiverId = id?.trim();
//     const senderId = senderid?.trim();

//     console.log("receiver",receiverId);
     
//     console.log("sender",senderId);
//     if (!id || !senderId) {
//       return res.status(400).json({ message: "Missing query parameters" });
//     }
  
//     try {
//       const messages = await Message.find({
//         $or: [
//           { sender: senderid , receiver:  receiverId },
//           { sender:  receiverId, receiver: senderid  }
//         ]
//       }).sort({ timestamp: 1 });
//    console.log(messages);
//       res.status(200).json({ messages });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching messages" });
//     }
//   };
  



export const allmessages = async (req, res) => {
  console.log("Query parameters received:", req.query);
  const { id, senderid } = req.query;  
  
  const receiverId = id?.trim();
  const senderId = senderid?.trim();
  
  console.log("receiver", receiverId);
  console.log("sender", senderId);
 
  if (!receiverId || !senderId) {
    return res.status(400).json({ message: "Missing query parameters" });
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(senderId)) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }
    
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ timestamp: 1 });
    
   // console.log(messages);
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};