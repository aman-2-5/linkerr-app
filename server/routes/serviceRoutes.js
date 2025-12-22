const express = require('express');
const router = express.Router();
// 👇 Keeping your lowercase naming convention
const Service = require('../models/service');
const User = require('../models/user');

// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('seller', 'name email');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service by ID (For the Details Page)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('seller', 'name email profilePic headline');
    if(!service) return res.status(404).json({ msg: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error(err);
    if(err.kind === 'ObjectId') return res.status(404).json({ msg: "Service not found" });
    res.status(500).send('Server Error');
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
      thumbnail: thumbnail || "" 
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;