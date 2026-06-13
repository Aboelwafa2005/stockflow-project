const express = require('express');
const { getStockMovements, createStockMovement } = require('../controllers/stockMovementController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { stockMovementValidator } = require('../validators/stockMovementValidators');

const router = express.Router();

router.get('/', protect, getStockMovements);
router.post('/', protect, authorize('admin', 'manager', 'staff'), stockMovementValidator, validateRequest, createStockMovement);

module.exports = router;
