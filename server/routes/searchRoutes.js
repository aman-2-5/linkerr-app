const express = require('express');
const router = express.Router();
const User = require('../models/user');     // Lowercase 'user' to match your file
const Service = require('../models/service'); // Assuming Capital 'Service', check your file if it fails

// @route   GET /api/search?q=query
// @desc    Search for Users and Services
router.get('/', async (req, res) => {
  const query = req.query.q;
  
  if (!query) {
    return res.status(400).json({ error: "No search query provided" });
  }

  try {
    // 1. Search Users (Name or Headline)
    // $regex with 'i' means case-insensitive (python matches Python)
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { headline: { $regex: query, $options: 'i' } },
        { skills: { $regex: query, $options: 'i' } }
      ]
    }).select('name headline _id'); // Only get necessary info

    // 2. Search Services (Title or Category)
    const services = await Service.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    // 3. Return combined results
    res.json({ users, services });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;