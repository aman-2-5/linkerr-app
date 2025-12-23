const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // 👇 ENSURE THESE FIELDS EXIST
  headline: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  bio: {  // 👈 This was likely missing!
    type: String,
    default: ""
  },
  skills: {
    type: [String], // Array of strings
    default: []
  },
  profilePic: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);