const express = require('express');
const router = express.Router();
const Review = require('../models/review'); // Importing the new model
const User = require('../models/user');

// @route   GET /api/reviews/:serviceId
// @desc    Get all reviews for a specific service
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('user', 'name profilePic') // Get reviewer's name & photo
      .sort({ createdAt: -1 }); // Newest first
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/reviews
// @desc    Add a review
router.post('/', async (req, res) => {
  const { serviceId, userId, rating, comment } = req.body;

  try {
    const newReview = new Review({
      service: serviceId,
      user: userId,
      rating,
      comment
    });

    const review = await newReview.save();
    
    // Populate user details immediately so frontend can show it instantly
    await review.populate('user', 'name profilePic');

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;