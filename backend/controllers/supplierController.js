const Supplier = require('../models/Supplier');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const paginate = require('../utils/paginate');

const getSuppliers = asyncHandler(async (req, res) => {
  const { q = '', page = 1, limit = 20, sort = 'name' } = req.query;
  const query = {};
  if (q) query.name = { $regex: q, $options: 'i' };
  const result = await paginate(Supplier, query, { page, limit, sort });
  res.json({ success: true, ...result });
});

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json({ success: true, supplier });
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) throw new ApiError(404, 'Supplier not found');
  Object.assign(supplier, req.body);
  await supplier.save();
  res.json({ success: true, supplier });
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) throw new ApiError(404, 'Supplier not found');
  res.json({ success: true, message: 'Supplier deleted' });
});

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
