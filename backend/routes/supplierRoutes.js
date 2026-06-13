const express = require('express');
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { supplierValidator } = require('../validators/supplierValidators');

const router = express.Router();

router.get('/', protect, getSuppliers);
router.post('/', protect, authorize('admin', 'manager'), supplierValidator, validateRequest, createSupplier);
router.put('/:id', protect, authorize('admin', 'manager'), supplierValidator, validateRequest, updateSupplier);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteSupplier);

module.exports = router;
