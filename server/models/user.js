const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // --- OLD FIELDS (Keep these!) ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSeller: { type: Boolean, default: false },
  
  // --- NEW: LINKEDIN PROFILE FIELDS ---
  headline: { type: String, default: "" }, // e.g. "Cybersecurity Analyst @ VIT"
  about: { type: String, default: "" },    // Bio
  location: { type: String, default: "" }, // e.g. "Amaravati, India"
  skills: [{ type: String }],              // e.g. ["Python", "React", "Nmap"]
  
  // Resume: Experience
  experience: [{
    title: String,     // e.g. "Intern"
    company: String,   // e.g. "Google"
    year: String,      // e.g. "2024-2025"
    description: String
  }],

  // Resume: Education
  education: [{
    school: String,    // e.g. "VIT-AP University"
    degree: String,    // e.g. "Integrated M.Tech CSE"
    year: String       // e.g. "2026"
  }],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);