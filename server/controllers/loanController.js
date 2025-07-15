// const Loan = require('../models/Loan');
// const Item = require('../models/Item');

// //  Request to borrow an item
// exports.requestLoan = async (req, res) => {
//   try {
//     const { itemId, loanStart, loanEnd } = req.body;  
//     const borrower = req.user._id;

//     const item = await Item.findById(itemId);
//     if (!item) return res.status(404).json({ message: 'Item not found' });
//     if (!item.available) return res.status(400).json({ message: 'Item is not available for loan' });

//     const existingRequest = await Loan.findOne({ item: itemId, borrower, status: 'pending' });
//     if (existingRequest) return res.status(400).json({ message: 'You already requested this item' });

//     const loan = await Loan.create({
//       item: itemId,
//       borrower,
//       owner: item.owner,
//       loanStart,   
//       loanEnd,     
//     });

//     res.status(201).json(loan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// //  Approve a loan request
// exports.approveLoan = async (req, res) => {
//   try {
//     const loan = await Loan.findById(req.params.id);
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });

//     if (loan.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only item owner can approve' });
//     }

//     loan.status = 'approved';
//     await loan.save();

//     // Mark item unavailable
//     await Item.findByIdAndUpdate(loan.item, { available: false });

//     res.json({ message: 'Loan approved', loan });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //  Reject a loan request
// exports.rejectLoan = async (req, res) => {
//   try {
//     const loan = await Loan.findById(req.params.id);
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });

//     if (loan.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only item owner can reject' });
//     }

//     loan.status = 'rejected';
//     await loan.save();

//     res.json({ message: 'Loan rejected', loan });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //  Mark loan as returned
// exports.returnLoan = async (req, res) => {
//   try {
//     const loan = await Loan.findById(req.params.id);
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });

//     if (loan.borrower.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only borrower can mark return' });
//     }

//     loan.status = 'returned';
//     await loan.save();

//     // Make item available again
//     await Item.findByIdAndUpdate(loan.item, { available: true });

//     res.json({ message: 'Loan marked as returned', loan });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get current user's loans (as borrower)
// exports.getMyLoans = async (req, res) => {
//   try {
//     const loans = await Loan.find({ borrower: req.user._id }).populate('item owner');
//     res.json(loans);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get loan requests for items owned by current user
// exports.getRequestsToMe = async (req, res) => {
//   try {
//     const loans = await Loan.find({ owner: req.user._id }).populate('item borrower');
//     res.json(loans);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // In loanController.js
// exports.cancelLoan = async (req, res) => {
//   try {
//     const loan = await Loan.findById(req.params.id);
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });
//     if (loan.borrower.toString() !== req.user._id.toString())
//       return res.status(403).json({ message: 'Only borrower can cancel the request' });

//     if (loan.status !== 'pending')
//       return res.status(400).json({ message: 'Only pending requests can be cancelled' });

//     await loan.deleteOne();
//     res.json({ message: 'Loan request cancelled' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // Remove loan (borrower-only)
// exports.removeLoan = async (req, res) => {
//   try {
//     const loan = await Loan.findById(req.params.id);
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });

//     // Only borrower can remove it after it is returned or rejected
//     if (loan.borrower.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only borrower can remove the loan' });
//     }

//     if (!['returned', 'rejected'].includes(loan.status)) {
//       return res.status(400).json({ message: 'Only returned or rejected loans can be removed' });
//     }

//     await loan.deleteOne();
//     res.json({ message: 'Loan removed successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




const mongoose = require('mongoose');
const Loan = require('../models/Loan');
const Item = require('../models/Item');

// Request to borrow an item
exports.requestLoan = async (req, res) => {
  try {
    const { itemId, loanStart, loanEnd } = req.body;
    const borrower = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (!item.available) return res.status(400).json({ message: 'Item is not available for loan' });

    const existingRequest = await Loan.findOne({ item: itemId, borrower, status: 'pending' });
    if (existingRequest) return res.status(400).json({ message: 'You already requested this item' });

    const loan = await Loan.create({
      item: itemId,
      borrower,
      owner: item.owner,
      loanStart,
      loanEnd,
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error('RequestLoan Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Approve a loan request
exports.approveLoan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (!loan.owner || loan.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only item owner can approve' });
    }

    loan.status = 'approved';
    await loan.save();

    await Item.findByIdAndUpdate(loan.item, { available: false }, { new: true });

    res.json({ message: 'Loan approved', loan });
  } catch (error) {
    console.error('ApproveLoan Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reject a loan request
exports.rejectLoan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (!loan.owner || loan.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only item owner can reject' });
    }

    loan.status = 'rejected';
    await loan.save();

    res.json({ message: 'Loan rejected', loan });
  } catch (error) {
    console.error('RejectLoan Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark loan as returned
exports.returnLoan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (!loan.borrower || loan.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only borrower can mark return' });
    }

    loan.status = 'returned';
    await loan.save();

    await Item.findByIdAndUpdate(loan.item, { available: true }, { new: true });

    res.json({ message: 'Loan marked as returned', loan });
  } catch (error) {
    console.error('ReturnLoan Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user's loans (as borrower)
exports.getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ borrower: req.user._id }).populate('item owner');
    res.json(loans);
  } catch (error) {
    console.error('GetMyLoans Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get loan requests for items owned by current user
exports.getRequestsToMe = async (req, res) => {
  try {
    const loans = await Loan.find({ owner: req.user._id }).populate('item borrower');
    res.json(loans);
  } catch (error) {
    console.error('GetRequestsToMe Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Cancel a loan request (borrower-only)
exports.cancelLoan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (!loan.borrower || loan.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only borrower can cancel the request' });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    await loan.deleteOne();
    res.json({ message: 'Loan request cancelled' });
  } catch (error) {
    console.error('CancelLoan Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove loan (borrower-only, for returned or rejected)
exports.removeLoan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    if (!loan.borrower || loan.borrower.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only borrower can remove the loan' });
    }

    if (!['returned', 'rejected'].includes(loan.status)) {
      return res.status(400).json({ message: 'Only returned or rejected loans can be removed' });
    }

    await loan.deleteOne();
    res.json({ message: 'Loan removed successfully' });
  } catch (error) {
    console.error('RemoveLoan Error:', error);
    res.status(500).json({ message: error.message });
  }
};

