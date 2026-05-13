const express = require('express');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/rbac');
const { Roles } = require('../utils/constants');
const { getSummary } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, requireRole(Roles.ADMIN));
router.get('/summary', getSummary);

module.exports = router;
