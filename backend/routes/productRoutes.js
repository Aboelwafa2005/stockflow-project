const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { productValidator } = require('../validators/productValidators');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, authorize('admin', 'manager'), upload.single('image'), productValidator, validateRequest, createProduct);
router.put('/:id', protect, authorize('admin', 'manager'), upload.single('image'), productValidator, validateRequest, updateProduct);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteProduct);

module.exports = router;
