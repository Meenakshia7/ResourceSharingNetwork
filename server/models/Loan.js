const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'returned', 'rejected'],
    default: 'pending'
  },
  requestDate: { type: Date, default: Date.now },
  loanStart: { type: Date },
  loanEnd: { type: Date },
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;

