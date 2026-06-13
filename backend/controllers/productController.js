const Product = require('../models/Product');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');

const getProducts = asyncHandler(async (req, res) => {
  const { q = '', category, supplier, warehouse, lowStock, page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const query = {};
  if (q) query.name = { $regex: q, $options: 'i' };
  if (category) query.category = category;
  if (supplier) query.supplier = supplier;
  if (warehouse) query.warehouse = warehouse;
  if (lowStock === 'true') query.$expr = { $lte: ['$quantity', '$minQuantity'] };

  const pageNum = Math.max(1, parseInt(page, 10));
  const lim = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const total = await Product.countDocuments(query);
  const items = await Product.find(query)
    .populate('category supplier warehouse createdBy')
    .sort(sort)
    .skip((pageNum - 1) * lim)
    .limit(lim);

  res.json({ success: true, items, page: pageNum, limit: lim, total, pages: Math.ceil(total / lim) });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category supplier warehouse createdBy');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});

const createProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };
  if (req.file) payload.image = `/uploads/${req.file.filename}`;
  const product = await Product.create(payload);

  if (product.quantity <= product.minQuantity) {
    await Notification.create({
      user: req.user._id,
      type: 'warning',
      message: `Low stock alert: ${product.name}`
    });
  }

  const populated = await Product.findById(product._id).populate('category supplier warehouse createdBy');
  res.status(201).json({ success: true, product: populated });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const nextData = { ...req.body };
  if (req.file) nextData.image = `/uploads/${req.file.filename}`;
  Object.assign(product, nextData);
  await product.save();

  const populated = await Product.findById(product._id).populate('category supplier warehouse createdBy');
  res.json({ success: true, product: populated });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
