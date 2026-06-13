const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const paginate = require('../utils/paginate');

const getUsers = asyncHandler(async (req, res) => {
  const { q = '', role, status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const query = {};
  if (q) query.name = { $regex: q, $options: 'i' };
  if (role) query.role = role;
  if (status) query.status = status;

  const result = await paginate(User, query, { page, limit, sort });
  res.json({ success: true, ...result });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, user });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.role = role;
  await user.save();
  res.json({ success: true, message: 'Role updated', user: { ...user.toObject(), password: undefined } });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.status = status;
  await user.save();
  res.json({ success: true, message: 'Status updated', user: { ...user.toObject(), password: undefined } });
});

module.exports = { getUsers, getUserById, updateUserRole, updateUserStatus };
