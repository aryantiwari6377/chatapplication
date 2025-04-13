import mongoose from "mongoose";

// Define the schema for a message
const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Assuming you have a User model
    required: true
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
 
});

// Define a model using the schema


export default  mongoose.model('Message', messageSchema);