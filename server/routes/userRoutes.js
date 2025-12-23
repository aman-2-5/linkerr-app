const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure path is correct

// @route   GET /api/users
// @desc    Get all users (for the network page)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords!
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/users/profile/:id
// @desc    Update User Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, headline, bio, location, skills, profilePic } = req.body;

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          headline,
          bio,
          location,
          skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()), // Handle comma-separated strings
          profilePic
        }
      },
      { new: true } // Return the updated document
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;