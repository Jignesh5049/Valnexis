const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(decoded.sub).select('-passwordHash -refreshTokenHash');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
