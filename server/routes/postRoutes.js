const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name headline profilePic') // Get user details
      .populate('comments.user', 'name profilePic') // Get commenter details
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts
// @desc    Create a post
router.post('/', async (req, res) => {
  const { userId, content, image } = req.body; // 👈 Now accepting 'image'

  try {
    const newPost = new Post({
      user: userId,
      content,
      image: image || "" // Save if exists
    });

    const post = await newPost.save();
    
    // Populate user details immediately so the frontend can show it
    await post.populate('user', 'name headline profilePic');
    
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/like/:id
router.put('/like/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { userId } = req.body;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;