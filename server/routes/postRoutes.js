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
// @route   PUT /api/posts/like/:id
// @desc    Like or Unlike a post
router.put('/like/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { userId } = req.body;

    // Check if the post has already been liked by this user
    if (post.likes.includes(userId)) {
      // Unlike: Remove user from likes array
      await post.updateOne({ $pull: { likes: userId } });
      res.json({ message: "Post unliked" });
    } else {
      // Like: Add user to likes array
      await post.updateOne({ $push: { likes: userId } });
      res.json({ message: "Post liked" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;