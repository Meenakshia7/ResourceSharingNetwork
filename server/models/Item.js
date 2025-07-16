
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  photos: [{ type: String }],
  zipCode: { type: String, required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ✅ Virtual field for reviews
itemSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'item',
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
