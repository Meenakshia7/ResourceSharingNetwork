const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');


router.post('/request', protect, loanController.requestLoan);
router.get('/mine', protect, loanController.getMyLoans);
router.get('/owned', protect, loanController.getRequestsToMe);
router.patch('/:id/approve', protect, loanController.approveLoan);
router.patch('/:id/reject', protect, loanController.rejectLoan);
router.patch('/:id/return', protect, loanController.returnLoan);
router.delete('/:id/cancel', protect, loanController.cancelLoan);
router.delete('/:id/remove', protect, loanController.removeLoan);



module.exports = router;
