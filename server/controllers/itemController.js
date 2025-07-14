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

// Get all items (with optional filters)
exports.getAllItems = async (req, res) => {
  try {
    const { zipCode, category } = req.query;
    const filter = {};
    if (zipCode) filter.zipCode = zipCode;
    if (category) filter.category = category;

    const items = await Item.find(filter).populate('owner', 'name email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
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

// Delete item (only owner)
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!deletedItem) return res.status(403).json({ message: 'Unauthorized or item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};
