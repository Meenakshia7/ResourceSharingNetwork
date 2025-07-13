const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined', 'returned'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  loanStart: { type: Date },
  loanEnd: { type: Date },
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;
