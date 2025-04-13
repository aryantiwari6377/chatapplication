import Message  from "../../models/messagemodel.js"; 

export const latestMessage = async (req, res) => {
  const {id} = req.user; 
  const senderId = id; 
  const receiverId = req.query.receiverId;

  console.log(senderId,receiverId);
  try {

    const message = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ]
    })
      .sort({ timestamp: -1 }) 
      .limit(1); 
      
    if (message.length > 0) {
      const latestMessage = message[0];
  

      res.status(200).json({
        content: latestMessage.content, 
        timestamp: latestMessage.timestamp, 
        receive : receiverId
      });
    } else {
      
      res.status(204).json({  content: "no any chat" });
    }
  } catch (error) {
    console.error('Error fetching latest message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
