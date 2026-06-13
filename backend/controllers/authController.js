const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const generateToken = require('../utils/generateToken');

const createTokenResponse = (res, user) => {
  const token = generateToken({ id: user._id });
  res.json({
    success: true,
    token,
    user
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already exists');

  const user = await User.create({
    name,
    email,
    password,
    role: role && ['admin', 'manager', 'staff'].includes(role) ? role : 'staff'
  });

  await Notification.create({
    user: user._id,
    type: 'success',
    message: 'Welcome to StockFlow!'
  });

  createTokenResponse(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (user.status !== 'active') throw new ApiError(403, 'Account is inactive');

  const matched = await user.matchPassword(password);
  if (!matched) throw new ApiError(401, 'Invalid credentials');

  createTokenResponse(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar
  });
});

const me = asyncHandler(async (req, res) => {
  const user = req.user;
  res.json({ success: true, user });
});

const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = { register, login, me, logout };
