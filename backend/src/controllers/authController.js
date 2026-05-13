const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const {
  signAccessToken,
  signRefreshToken,
  hashPassword,
  verifyPassword,
  hashRefreshToken,
  verifyRefreshToken
} = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await hashRefreshToken(refreshToken);
  await user.save();

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash +refreshTokenHash');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await hashRefreshToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  if (payload.tokenType !== 'refresh') {
    throw new ApiError(401, 'Invalid token type');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash');
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid token');
  }

  const isValidRefreshToken = await verifyRefreshToken(refreshToken, user.refreshTokenHash);
  if (!isValidRefreshToken) {
    throw new ApiError(401, 'Invalid token');
  }

  const accessToken = signAccessToken(user);
  const nextRefreshToken = signRefreshToken(user);
  user.refreshTokenHash = await hashRefreshToken(nextRefreshToken);
  await user.save();

  res.json({ accessToken, refreshToken: nextRefreshToken });
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+refreshTokenHash');
  if (user) {
    user.refreshTokenHash = undefined;
    await user.save();
  }
  res.status(204).send();
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me
};
