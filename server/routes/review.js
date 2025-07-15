const express = require('express');
const router = express.Router();
const { addReview, getItemReviews, getOwnerReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// POST review after item is returned
router.post('/', protect, addReview);

// GET all reviews for a particular item
router.get('/item/:itemId', getItemReviews);

// GET all reviews received by a particular owner
router.get('/owner/:ownerId', getOwnerReviews);

module.exports = router;
