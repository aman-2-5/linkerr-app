const router = require('express').Router();
// ⚠️ Verify this path matches your file name exactly (lowercase 'order')
const Order = require('../models/order'); 
const Service = require('../models/service');

router.post('/', async (req, res) => {
  try {
    const { serviceId, buyerId } = req.body;

    // 1. Validate Service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    console.log("Found Service:", service.title); // Debug log

    // 2. Create Order
    // The error "Order is not a constructor" happened here. 
    // This new code ensures 'Order' is loaded correctly.
    const newOrder = new Order({
      buyerId: buyerId,
      sellerId: service.provider, 
      serviceId: service._id,
      orderSnapshot: {
        frozenTitle: service.title,
        frozenPrice: service.price,
        frozenDeliveryTime: service.deliveryTime
      },
      amount: service.price,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Order Saved:", savedOrder._id);

    res.status(201).json({ 
      success: true, 
      orderId: savedOrder._id,
      message: "Order placed successfully!" 
    });

  } catch (err) {
    console.error("❌ Purchase Error:", err);
    res.status(500).json({ error: err.message });
  }
});
// @route   GET /api/purchase/:userId
// @desc    Get all orders where the user is a Buyer OR Seller
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find orders where this user is involved
    const orders = await Order.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
    .populate('serviceId', 'title category') // Fill in Service details
    .populate('buyerId', 'name email')       // Fill in Buyer details
    .populate('sellerId', 'name email')      // Fill in Seller details
    .sort({ createdAt: -1 });                // Newest first

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// @route   PUT /api/purchase/:orderId/status
// @desc    Update order status (e.g., pending -> completed)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    // Validate status
    const validStatuses = ['pending', 'active', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    // Find and update
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { status: status },
      { new: true } // Return the updated document
    );

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;