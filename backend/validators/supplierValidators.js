const { body } = require('express-validator');

const supplierValidator = [
  body('name').trim().notEmpty().withMessage('Name is required')
];

module.exports = { supplierValidator };
