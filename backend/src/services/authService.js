const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tokenType: 'refresh'
    },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
}

async function hashPassword(password) {
  return bcrypt.hash(password, env.bcryptSaltRounds);
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

async function hashRefreshToken(token) {
  return bcrypt.hash(token, env.bcryptSaltRounds);
}

async function verifyRefreshToken(rawToken, tokenHash) {
  if (!tokenHash) return false;
  return bcrypt.compare(rawToken, tokenHash);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  hashPassword,
  verifyPassword,
  hashRefreshToken,
  verifyRefreshToken
};
