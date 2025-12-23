const express = require('express');
const router = express.Router();
const User = require('../models/user');     // Ensure these paths match your folder structure
const Service = require('../models/service'); // You need to import the Service model!

// GET /api/search?q=something
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    
    // If no query, return empty arrays immediately
    if (!query) {
      return res.json({ users: [], services: [] });
    }

    const searchRegex = new RegExp(query, 'i'); // 'i' makes it case-insensitive

    // 1. Search USERS
    // We search Name, Headline, OR Skills
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { headline: searchRegex },
        { skills: { $in: [searchRegex] } }, // Checks if the tag is in the array
        { location: searchRegex }
      ]
    }).select('name headline profilePic location skills'); 

    // 2. Search SERVICES
    // We search Title, Category, OR Description
    const services = await Service.find({
      $or: [
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ]
    });

    // 3. Return BOTH results
    res.json({ users, services });

  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: 'Server Error during search' });
  }
});

module.exports = router;