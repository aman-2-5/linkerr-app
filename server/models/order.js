const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  
  // Data Snapshotting
  orderSnapshot: {
    frozenTitle: { type: String, required: true },
    frozenPrice: { type: Number, required: true },
    frozenDeliveryTime: { type: Number }
  },
  
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'delivered', 'completed', 'cancelled'], 
    default: 'pending' 
  },
}, { timestamps: true });

// ⚠️ IMPORTANT: This line allows the route to use "new Order()"
module.exports = mongoose.model('Order', OrderSchema);