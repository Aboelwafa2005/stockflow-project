const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const paginate = require('../utils/paginate');

const getCategories = asyncHandler(async (req, res) => {
  const { q = '', page = 1, limit = 20, sort = 'name' } = req.query;
  const query = {};
  if (q) query.name = { $regex: q, $options: 'i' };
  const result = await paginate(Category, query, { page, limit, sort });
  res.json({ success: true, ...result });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  category.name = req.body.name ?? category.name;
  category.description = req.body.description ?? category.description;
  await category.save();
  res.json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
