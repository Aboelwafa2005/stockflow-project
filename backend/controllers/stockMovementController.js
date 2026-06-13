const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

const getStockMovements = asyncHandler(async (req, res) => {
  const { product, type, page = 1, limit = 20, sort = '-createdAt' } = req.query;
  const query = {};
  if (product) query.product = product;
  if (type) query.type = type;

  const pageNum = Math.max(1, parseInt(page, 10));
  const lim = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const total = await StockMovement.countDocuments(query);
  const items = await StockMovement.find(query)
    .populate('product createdBy')
    .sort(sort)
    .skip((pageNum - 1) * lim)
    .limit(lim);

  res.json({ success: true, items, page: pageNum, limit: lim, total, pages: Math.ceil(total / lim) });
});

const createStockMovement = asyncHandler(async (req, res) => {
  const { product: productId, type, quantity, note } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let nextQuantity = product.quantity;
  if (type === 'in') nextQuantity += Number(quantity);
  if (type === 'out') nextQuantity -= Number(quantity);
  if (type === 'adjustment') nextQuantity = Number(quantity);

  if (nextQuantity < 0) throw new ApiError(400, 'Stock cannot go below zero');

  product.quantity = nextQuantity;
  await product.save();

  const movement = await StockMovement.create({
    product: productId,
    type,
    quantity,
    note,
    balanceAfter: nextQuantity,
    createdBy: req.user._id
  });

  if (product.quantity <= product.minQuantity) {
    await Notification.create({
      user: req.user._id,
      type: 'warning',
      message: `Low stock alert: ${product.name} is running low`
    });
  }

  const populated = await StockMovement.findById(movement._id).populate('product createdBy');
  res.status(201).json({ success: true, movement: populated });
});

module.exports = { getStockMovements, createStockMovement };
