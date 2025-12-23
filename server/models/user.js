const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile Fields
  headline: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  profilePic: { type: String, default: "" },
  
  // 👇 NEW FIELDS
  education: {
    type: [{
      school: String,
      degree: String,
      year: String
    }],
    default: []
  },
  experience: {
    type: [{
      company: String,
      role: String,
      description: String,
      year: String
    }],
    default: []
  },
  socials: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);