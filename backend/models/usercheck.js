import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String, required: false },  // Store the Cloudinary image URL
});

export default mongoose.model('User', userSchema);
