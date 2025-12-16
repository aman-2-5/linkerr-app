const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Profile Identity
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  headline: { type: String, default: "" }, // e.g. "Full Stack Dev"
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  
  // Professional Network
  skills: [{ type: String }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Marketplace & Financials
  wallet_balance: { type: Number, default: 0 },
  
  // <--- ADD THIS NEW FIELD
  password: { type: String, required: true }, 

  headline: { type: String },
  bio: { type: String },
  // Strategy: Soft Delete
  isDeleted: { type: Boolean, default: false } 
}, { timestamps: true });

// Query Middleware: Automatically hide deleted users from searches
//UserSchema.pre(/^find/, function(next) {
 // this.find({ isDeleted: { $ne: true } });
  //next();
//});

module.exports = mongoose.model('User', UserSchema);