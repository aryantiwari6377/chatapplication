import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // For text messages this holds the text.
  // For file messages this is set to '' (empty string).
  content: {
    type: String,
    default: '',
  },
  // 'text' | 'image' | 'file' | 'audio'
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'audio'],
    default: 'text',
  },
  // S3 public (or presigned-GET) URL — only set for image/file messages
  fileUrl: {
    type: String,
    default: null,
  },
  // Original MIME type, e.g. 'image/png', 'application/pdf'
  fileType: {
    type: String,
    default: null,
  },
  // Original filename shown to the receiver
  fileName: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Message', messageSchema);
