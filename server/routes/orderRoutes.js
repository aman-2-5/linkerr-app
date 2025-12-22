const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Service = require('../models/service'); // Lowercase 'service' to match your file

// @route   POST /api/orders/purchase
// @desc    Create a new order (Buyer clicks "Book Now")
router.post('/purchase', async (req, res) => {
  const { serviceId, buyerId } = req.body;

  try {
    // 1. Find the service to get the price and Seller ID
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Service not found" });

    // 2. Create the Order
    const newOrder = new Order({
      service: serviceId,
      buyer: buyerId,
      seller: service.seller, // Auto-assign the seller from the service
      price: service.price
    });

    const savedOrder = await newOrder.save();
    res.json({ success: true, orderId: savedOrder._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Purchase failed" });
  }
});

// @route   GET /api/orders/my-orders/:userId
// @desc    Get ALL orders for a user (both Purchases AND Sales)
router.get('/my-orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch purchases (I bought)
    const purchases = await Order.find({ buyer: userId })
      .populate('service', 'title thumbnail')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    // Fetch sales (I sold)
    const sales = await Order.find({ seller: userId })
      .populate('service', 'title thumbnail')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ purchases, sales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

// @route   PUT /api/orders/deliver/:orderId
// @desc    Seller marks order as delivered
router.put('/deliver/:orderId', async (req, res) => {
  const { deliveryLink } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = 'delivered';
    order.deliveryWork = deliveryLink;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Delivery failed" });
  }
});

module.exports = router;