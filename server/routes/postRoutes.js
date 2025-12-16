const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user'); // Ensure lowercase 'user' to match your file

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', async (req, res) => {
  const { userId, content } = req.body;
  try {
    const newPost = new Post({ user: userId, content });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/posts
// @desc    Get all posts (The Feed)
router.get('/', async (req, res) => {
  try {
    // .populate('user') fills in the Name/Avatar of the author automatically!
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Newest first
      .populate('user', ['name', 'headline']); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;