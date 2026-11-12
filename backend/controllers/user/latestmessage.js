import Message from "../../models/messagemodel.js";

export const latestMessage = async (req, res) => {
  const { id } = req.user;
  const senderId = id;
  const receiverId = req.query.receiverId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ timestamp: -1 })
      .limit(1);

    if (messages.length === 0) {
      // Return 200 with an empty flag — 204 causes axios to drop the body
      return res.status(200).json({ empty: true, content: '', timestamp: null });
    }

    const msg = messages[0];

    // Build a human-readable preview for non-text messages
    let preview = msg.content || '';
    if (!preview) {
      if (msg.messageType === 'image') preview = '📷 Photo';
      else if (msg.messageType === 'audio') preview = '🎤 Voice message';
      else if (msg.messageType === 'file') preview = `📎 ${msg.fileName || 'File'}`;
    }

    return res.status(200).json({
      empty: false,
      content: preview,
      timestamp: msg.timestamp,
      receive: receiverId,
    });
  } catch (error) {
    console.error('Error fetching latest message:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
