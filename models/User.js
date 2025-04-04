// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  discord: {
    type: String,
    default: '',
  },
  insta: {
    type: String,
    default: '',
  },
  telegram: {
    type: String,
    default: '',
  },
  profilePhoto: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['influencer', 'gamer', 'org', 'admin'],
    default: 'gamer',
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
