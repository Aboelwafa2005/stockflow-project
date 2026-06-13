const express = require('express');
const { getSummary, getLowStock, getMovementsReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/summary', protect, authorize('admin', 'manager'), getSummary);
router.get('/low-stock', protect, authorize('admin', 'manager'), getLowStock);
router.get('/movements', protect, authorize('admin', 'manager'), getMovementsReport);

module.exports = router;
