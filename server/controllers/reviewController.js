
const Review = require('../models/Review');
const Loan = require('../models/Loan');

exports.addReview = async (req, res) => {
  const { item, loan, rating, comment } = req.body;
  const reviewer = req.user._id;

  try {
    const existingReview = await Review.findOne({ loan });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this loan.' });
    }

    const loanDoc = await Loan.findById(loan).populate('item');
    if (!loanDoc || loanDoc.status !== 'returned') {
      return res.status(400).json({ message: 'Review not allowed. Item not returned or loan not found.' });
    }

    if (String(loanDoc.borrower) !== String(reviewer)) {
      return res.status(403).json({ message: 'You are not authorized to review this loan.' });
    }

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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch item reviews' });
  }
};

exports.getOwnerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ owner: req.params.ownerId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch owner reviews' });
  }
};
