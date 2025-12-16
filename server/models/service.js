const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  // Link to the User who created this service
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Development', 'Design', 'Marketing', 'Writing', 'Other'],
    default: 'Other'
  },
  deliveryTime: { type: Number, default: 3 }, // in days
  
  // Soft Delete similar to User
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);