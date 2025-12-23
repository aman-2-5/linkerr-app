const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    text: { type: String, required: true },
  },
  users: Array, // Stores [senderId, receiverId] for easy searching
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);