const { body } = require('express-validator');

const stockMovementValidator = [
  body('product').notEmpty().withMessage('Product is required'),
  body('type').isIn(['in', 'out', 'adjustment']).withMessage('Invalid stock movement type'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

module.exports = { stockMovementValidator };
