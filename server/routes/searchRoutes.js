const express = require('express');
const router = express.Router();

// 1. FIX PATHS: Try to load models from the correct spot
// We use a try-catch to handle different folder structures
let User, Service;
try {
    User = require('../models/user');       // Standard structure
    Service = require('../models/service');
} catch (e) {
    try {
        User = require('../server/models/user'); // If models are in server/ folder
        Service = require('../server/models/service');
    } catch (e2) {
        console.error("CRITICAL ERROR: Could not find Model files!", e2);
    }
}

router.get('/', async (req, res) => {
  const query = req.query.q;
  console.log(`[SEARCH] Received query: "${query}"`); // Look for this in Vercel Logs

  if (!query) return res.json({ users: [], services: [] });

  try {
    const searchRegex = new RegExp(query, 'i');

    // 2. LOGGING: Print how many users/services exist in TOTAL
    const totalUsers = await User.countDocuments();
    console.log(`[DEBUG] Total Users in DB: ${totalUsers}`); 

    // Search Users
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { headline: searchRegex },
        { skills: { $in: [searchRegex] } },
        { location: searchRegex }
      ]
    }).select('name headline profilePic location skills');

    // Search Services
    const services = await Service.find({
      $or: [
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ]
    });

    console.log(`[SEARCH] Found: ${users.length} users, ${services.length} services`);
    
    res.json({ users, services });

  } catch (err) {
    console.error("[SEARCH ERROR]", err);
    res.status(500).json({ message: 'Server Search Error' });
  }
});

module.exports = router;