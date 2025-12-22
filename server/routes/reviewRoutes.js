const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Service = require('../models/service'); // Import Service model
const User = require('../models/user');

// @route   GET /api/reviews/:serviceId
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/reviews
// @desc    Add review AND update Service average
router.post('/', async (req, res) => {
  const { serviceId, userId, rating, comment } = req.body;

  try {
    // 1. Create the Review
    const newReview = new Review({
      service: serviceId,
      user: userId,
      rating,
      comment
    });
    await newReview.save();
    
    // 2. Calculate New Average for the Service
    const reviews = await Review.find({ service: serviceId });
    const numReviews = reviews.length;
    // Calculate sum of all ratings / count
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    // 3. Save Stats to Service Document
    const service = await Service.findById(serviceId);
    service.numReviews = numReviews;
    service.rating = avgRating;
    await service.save();

    // 4. Return review with user info
    await newReview.populate('user', 'name profilePic');
    res.json(newReview);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;