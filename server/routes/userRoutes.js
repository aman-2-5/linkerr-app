const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure path is correct

// @route   GET /api/users
// @desc    Get all users (for the Network page)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords!
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/users/profile/:id
// @desc    Update User Profile (Bio, Education, Experience, etc.)
router.put('/profile/:id', async (req, res) => {
  try {
    // 1. Destructure all possible fields from the request body
    const { 
      name, 
      headline, 
      bio, 
      location, 
      skills, 
      profilePic, 
      education,  // New
      experience, // New
      socials     // New
    } = req.body;

    // 2. Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          headline,
          bio,
          location,
          profilePic,
          // Handle Skills: If it's a string ("Java, Python"), split it. If array, keep it.
          skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
          
          // Save the new complex fields directly
          education, 
          experience, 
          socials
        }
      },
      { new: true } // Return the updated document so Frontend updates instantly
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;