
const Item = require('../models/Item');


// Create new item
exports.createItem = async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      owner: req.user.id,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('owner', 'name') // optional, if you need owner name
      .populate({
        path: 'reviews',
        select: 'rating comment reviewer createdAt',
        populate: {
          path: 'reviewer',
          select: 'name',
        },
      });

    res.json(items);
  } catch (err) {
    console.error('[getAllItems ERROR]', err);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get item', error: error.message });
  }
};

// Update item (only owner)
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedItem) return res.status(403).json({ message: 'Unauthorized or item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

// Delete item (only if no active loan)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if item belongs to the user
    const item = await Item.findOne({ _id: id, owner: req.user.id });
    if (!item) return res.status(403).json({ message: 'Unauthorized or item not found' });

    // 2. Check for active (non-returned) loans
    const activeLoan = await Loan.findOne({
      item: id,
      status: { $ne: 'returned' }, // not returned yet
    });

    if (activeLoan) {
      return res.status(400).json({
        message: 'Item cannot be deleted. It has an active loan request.',
      });
    }

    // 3. Delete the item if no active loan
    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};



// Get logged-in user's items
exports.getMyItems = async (req, res) => {
  try {
    const myItems = await Item.find({ owner: req.user.id });
    res.status(200).json(myItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your items', error: error.message });
  }
};

