const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Service = require('../models/service'); // Ensure 'service' matches your filename

// 👇 DEBUG LOG: This prints when the server starts
console.log("✅ Order Routes file is being read!");

// @route   POST /api/orders/purchase
router.post('/purchase', async (req, res) => {
  // 👇 DEBUG LOG: This prints when you click the button
  console.log("🔔 Purchase Route Hit!"); 
  console.log("📦 Data received:", req.body);

  const { serviceId, buyerId } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
        console.log("❌ Service not found in DB");
        return res.status(404).json({ error: "Service not found" });
    }

    const newOrder = new Order({
      service: serviceId,
      buyer: buyerId,
      seller: service.seller,
      price: service.price
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Order saved:", savedOrder._id);
    res.json({ success: true, orderId: savedOrder._id });
  } catch (err) {
    console.error("❌ Purchase Error:", err);
    res.status(500).json({ error: "Purchase failed" });
  }
});

// @route   GET /api/orders/my-orders/:userId
router.get('/my-orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const purchases = await Order.find({ buyer: userId }).populate('service').populate('seller').sort({ createdAt: -1 });
    const sales = await Order.find({ seller: userId }).populate('service').populate('buyer').sort({ createdAt: -1 });
    res.json({ purchases, sales });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

// @route   PUT /api/orders/deliver/:orderId
router.put('/deliver/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = 'delivered';
    order.deliveryWork = req.body.deliveryLink;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Delivery failed" });
  }
});

module.exports = router;