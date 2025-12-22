const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, default: "" },
  
  // 👇 NEW FIELDS FOR RATINGS
  rating: { type: Number, default: 0 }, // Average Score (e.g., 4.5)
  numReviews: { type: Number, default: 0 }, // Total count (e.g., 10)
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);