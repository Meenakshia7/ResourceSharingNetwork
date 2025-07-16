

const Review = require('../models/Review');
const Loan = require('../models/Loan');

exports.addReview = async (req, res) => {
  const { item, loan, rating, comment } = req.body;
  const reviewer = req.user._id;

  try {
    // 1. Check if the review already exists for the loan
    const existingReview = await Review.findOne({ loan });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this loan.' });
    }

    // 2. Fetch loan document and check if it's returned
    const loanDoc = await Loan.findById(loan).populate('item');
    if (!loanDoc) {
      return res.status(400).json({ message: 'Loan not found.' });
    }

    if (loanDoc.status !== 'returned') {
      return res.status(400).json({ message: 'Review not allowed. Item not marked as returned.' });
    }

    // 3. Verify the reviewer is the borrower
    if (String(loanDoc.borrower) !== String(reviewer)) {
      return res.status(403).json({ message: 'You are not authorized to review this loan.' });
    }

    // 4. Ensure the item and its owner exist
    if (!loanDoc.item || !loanDoc.item.owner) {
      return res.status(500).json({ message: 'Item or its owner not found in loan document.' });
    }

    // 5. Create and save the review
    const review = new Review({
      item,
      loan,
      rating,
      comment,
      reviewer,
      owner: loanDoc.item.owner,
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully.' });

  } catch (err) {
    console.error('[addReview ERROR]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getItemReviews = async (req, res) => {
  const { itemId } = req.params;

  if (!itemId || itemId === 'undefined') {
    return res.status(400).json({ message: 'Invalid item ID' });
  }

  try {
    const reviews = await Review.find({ item: itemId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('[getItemReviews ERROR]', err);
    res.status(500).json({ message: 'Failed to fetch item reviews' });
  }
};


exports.getOwnerReviews = async (req, res) => {
  const { ownerId } = req.params;

  if (!ownerId) {
    return res.status(400).json({ message: 'Owner ID is required' });
  }

  try {
    const reviews = await Review.find({ owner: ownerId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('[getOwnerReviews ERROR]', err);
    res.status(500).json({ message: 'Failed to fetch owner reviews' });
  }
};
