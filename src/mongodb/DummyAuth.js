// collect username:str , password:str + bcrypt, credits: number, badges[]:array of titles
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  credits: {
    type: Number,
    default: 0
  },
  badges: {
    type: [String],
    default: []
  }
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);