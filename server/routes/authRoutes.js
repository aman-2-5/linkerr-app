const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    // Hash the password (security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      wallet_balance: 1000 // Give them $1000 free for testing!
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Check password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    // Create Token (The Digital ID Card)
    // We are using a simple secret key "secret123" for now.
    const token = jwt.sign({ _id: user._id }, "secret123");

    res.status(200).json({ 
      token, 
      user: { _id: user._id, name: user.name, email: user.email, wallet_balance: user.wallet_balance } 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;