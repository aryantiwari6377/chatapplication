import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
 
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  friends:[{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'useraccounts' }, 
    status: { type: String, enum: ['receiver', 'active', 'sender', 'pending'] },
    name: {type: String}
  }],
  // profileImage: { type: String, required: false }, 
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});




export default mongoose.model("useraccounts", userSchema);
