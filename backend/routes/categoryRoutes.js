const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { categoryValidator } = require('../validators/categoryValidators');

const router = express.Router();

router.get('/', protect, getCategories);
router.post('/', protect, authorize('admin', 'manager'), categoryValidator, validateRequest, createCategory);
router.put('/:id', protect, authorize('admin', 'manager'), categoryValidator, validateRequest, updateCategory);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCategory);

module.exports = router;
