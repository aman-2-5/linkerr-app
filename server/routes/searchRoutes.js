const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

// GET /api/search?q=python
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // UPDATED SEARCH LOGIC: Matches your actual Schema
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { headline: { $regex: query, $options: 'i' } }, // Replaces 'role'
        { skills: { $in: [new RegExp(query, 'i')] } },
        { location: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name headline location education skills profilePic'); 
    // We only select the fields that exist in your user.js

    res.json({ users });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;