const express = require('express');
const { body } = require('express-validator');
const { register, login, refresh, logout, me } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerValidator, loginValidator } = require('../utils/validators');

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', [body('refreshToken').isString().isLength({ min: 20 })], validate, refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

module.exports = router;
