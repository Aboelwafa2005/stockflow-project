const Warehouse = require('../models/Warehouse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const paginate = require('../utils/paginate');

const getWarehouses = asyncHandler(async (req, res) => {
  const { q = '', page = 1, limit = 20, sort = 'name' } = req.query;
  const query = {};
  if (q) query.name = { $regex: q, $options: 'i' };
  const result = await paginate(Warehouse, query, { page, limit, sort });
  res.json({ success: true, ...result });
});

const createWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.create(req.body);
  res.status(201).json({ success: true, warehouse });
});

const updateWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id);
  if (!warehouse) throw new ApiError(404, 'Warehouse not found');
  Object.assign(warehouse, req.body);
  await warehouse.save();
  res.json({ success: true, warehouse });
});

const deleteWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
  if (!warehouse) throw new ApiError(404, 'Warehouse not found');
  res.json({ success: true, message: 'Warehouse deleted' });
});

module.exports = { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse };
