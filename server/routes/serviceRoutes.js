const router = require('express').Router();
const Service = require('../models/service');

// @route   POST /api/services/create
// @desc    Create a new service
router.post('/create', async (req, res) => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/services
// @desc    Get all services
router.get('/', async (req, res) => {
  try {
    // .populate('provider') fills in the User details (name, email) automatically!
    const services = await Service.find().populate('provider', 'name email headline');
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;