const { body, param } = require('express-validator');
const net = require('net');

const blockedHosts = new Set(['localhost', '127.0.0.1', '::1']);

function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number);
  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 169 && parts[1] === 254)
  );
}

function isBlockedHost(hostname) {
  if (!hostname) return true;
  const normalized = hostname.toLowerCase();

  if (blockedHosts.has(normalized)) return true;

  if (net.isIP(normalized) === 4) {
    return isPrivateIPv4(normalized);
  }

  if (net.isIP(normalized) === 6) {
    return normalized === '::1' || normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe80');
  }

  return normalized.endsWith('.local');
}

const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 12, max: 128 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/)
    .matches(/[^A-Za-z0-9]/)
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 1, max: 256 })
];

const createScanValidator = [
  body('targetType').isIn(['url', 'upload']),
  body('target')
    .if(body('targetType').equals('url'))
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      disallow_auth: true
    })
    .custom((value) => {
      const parsed = new URL(value);
      if (isBlockedHost(parsed.hostname)) {
        throw new Error('Target host is not allowed');
      }
      return true;
    })
];

const idParamValidator = [param('id').isMongoId()];

module.exports = {
  registerValidator,
  loginValidator,
  createScanValidator,
  idParamValidator
};
