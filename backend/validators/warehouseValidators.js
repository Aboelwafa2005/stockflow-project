const { body } = require('express-validator');

const warehouseValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('code').trim().notEmpty().withMessage('Code is required')
];

module.exports = { warehouseValidator };
