const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  logger.error('Request failed', {
    statusCode,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const payload = {
    message: statusCode === 500 ? 'Internal server error' : err.message
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorHandler;
