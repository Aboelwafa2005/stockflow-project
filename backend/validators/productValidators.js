const { body } = require('express-validator');

const productValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('minQuantity').optional().isInt({ min: 0 }).withMessage('Min quantity must be a positive integer'),
  body('category').notEmpty().withMessage('Category is required'),
  body('warehouse').notEmpty().withMessage('Warehouse is required')
];

module.exports = { productValidator };
