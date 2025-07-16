const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');


router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);


router.post('/', protect , itemController.createItem);
router.put('/:id', protect , itemController.updateItem);
router.delete('/:id', protect , itemController.deleteItem);
router.get('/my', protect , itemController.getMyItems);


module.exports = router;
