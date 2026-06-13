const express = require('express');
const { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/warehouseController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { warehouseValidator } = require('../validators/warehouseValidators');

const router = express.Router();

router.get('/', protect, getWarehouses);
router.post('/', protect, authorize('admin', 'manager'), warehouseValidator, validateRequest, createWarehouse);
router.put('/:id', protect, authorize('admin', 'manager'), warehouseValidator, validateRequest, updateWarehouse);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteWarehouse);

module.exports = router;
