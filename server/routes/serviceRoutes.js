const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/user');

// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req, res) => {
  try {
    // Populate shows the Seller's name instead of just their ID
    const services = await Service.find().populate('seller', 'name email');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/services
// @desc    Create a new service
router.post('/', async (req, res) => {
  const { sellerId, title, description, category, price, thumbnail } = req.body;

  try {
    const newService = new Service({
      seller: sellerId,
      title,
      description,
      category,
      price,
      thumbnail: thumbnail || "" // Save the image URL if provided
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;