const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Service = require('../models/service');

// @route   POST /api/reviews
// @desc    Create a review & Update Service Rating
router.post('/', async (req, res) => {
  const { serviceId, buyerId, rating, comment } = req.body;
  
  try {
    // 1. Create the Review
    const newReview = await Review.create({
      service: serviceId,
      buyer: buyerId,
      rating,
      comment
    });

    // 2. Recalculate Average Rating for the Service
    const reviews = await Review.find({ service: serviceId });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    // 3. Update the Service with new stats
    await Service.findByIdAndUpdate(serviceId, {
      rating: avgRating,
      numReviews: reviews.length
    });

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to post review" });
  }
});

// @route   GET /api/reviews/:serviceId
// @desc    Get all reviews for a specific service
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('buyer', 'name profilePic') // Get buyer's name and pic
      .sort({ createdAt: -1 }); // Newest first
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;