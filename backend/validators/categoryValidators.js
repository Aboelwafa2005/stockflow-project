const { body } = require('express-validator');

const categoryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required')
];

module.exports = { categoryValidator };
