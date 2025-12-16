const router = require('express').Router();
// ⚠️ The fix is likely here: standard import, no curly braces
const User = require('../models/user'); 

// @route   POST /api/users/register
// @desc    Create a new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error inside register route:", err); // Improved logging
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/users
// @desc    Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ GET USERS ERROR:", err.message); // This will print in your Terminal
    res.status(500).json({ error: err.message });      // This will show in your Browser
  }
});

module.exports = router;