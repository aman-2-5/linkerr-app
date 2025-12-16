const express = require('express');
const router = express.Router();

// 👇 THIS WAS THE FIX: changed 'User' to 'user' to match your filename
const User = require('../models/user'); 

// @route   GET /api/users
// @desc    Get ALL professionals (For the "Network" page)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get a specific user's profile data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update profile (Headline, Bio, Skills, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { headline, about, location, skills, experience, education } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { headline, about, location, skills, experience, education },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/users/connect/:id
// @desc    Connect with another user (Follow logic)
router.put('/connect/:id', async (req, res) => {
  const { currentUserId } = req.body; // The ID of the person clicking "Connect"
  const targetUserId = req.params.id; // The ID of the person being connected to

  if (currentUserId === targetUserId) {
    return res.status(400).json({ error: "You cannot connect with yourself" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    // Check if already connected
    if (!currentUser.connections.includes(targetUserId)) {
      await currentUser.updateOne({ $push: { connections: targetUserId } });
      await targetUser.updateOne({ $push: { connections: currentUserId } });
      res.status(200).json({ message: "Connected successfully!" });
    } else {
      res.status(400).json({ error: "Already connected" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;