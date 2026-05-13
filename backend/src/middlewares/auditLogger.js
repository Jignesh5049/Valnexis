const logger = require('../config/logger');

function auditLogger(req, res, next) {
  const startedAt = Date.now();
  res.on('finish', () => {
    logger.info('Audit event', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      ip: req.ip,
      userId: req.user ? req.user.id : null
    });
  });
  next();
}

module.exports = auditLogger;
