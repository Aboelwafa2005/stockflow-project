const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const [totalProducts, lowStockCount, totalMovements, totalQuantity] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ $expr: { $lte: ['$quantity', '$minQuantity'] } }),
    StockMovement.countDocuments(),
    Product.aggregate([{ $group: { _id: null, qty: { $sum: '$quantity' } } }])
  ]);

  res.json({
    success: true,
    summary: {
      totalProducts,
      lowStockCount,
      totalMovements,
      totalQuantity: totalQuantity[0]?.qty || 0
    }
  });
});

const getLowStock = asyncHandler(async (req, res) => {
  const items = await Product.find({ $expr: { $lte: ['$quantity', '$minQuantity'] } })
    .populate('category supplier warehouse createdBy')
    .sort('quantity');
  res.json({ success: true, items });
});

const getMovementsReport = asyncHandler(async (req, res) => {
  const movements = await StockMovement.find()
    .populate('product createdBy')
    .sort('-createdAt')
    .limit(50);
  res.json({ success: true, items: movements });
});

module.exports = { getSummary, getLowStock, getMovementsReport };
