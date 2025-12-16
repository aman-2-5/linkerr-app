const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Ensure this matches your file name (Post.js)
const User = require('../models/user'); 

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
    // 👇 THIS IS THE FIX: Added .populate('comments.user')
    const posts = await Post.find()
      .sort({ createdAt: -1 }) 
      .populate('user', ['name', 'headline'])
      .populate('comments.user', ['name']); 
      
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

// @route   POST /api/posts/comment/:id
// @desc    Add a comment to a post
router.post('/comment/:id', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const post = await Post.findById(req.params.id);

    const newComment = {
      user: userId,
      text: text,
      date: new Date()
    };

    // Add to beginning of comments array
    post.comments.unshift(newComment);

    await post.save();
    
    // Return the post with the new comment populated (so we can show the name immediately)
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', ['name', 'headline'])
      .populate('comments.user', ['name']); // Populate commenter's name
      
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;