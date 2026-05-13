const express = require('express');
const authenticate = require('../middlewares/auth');
const { idParamValidator } = require('../utils/validators');
const validate = require('../middlewares/validate');
const { getNotifications, markNotificationRead } = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticate);
router.get('/', getNotifications);
router.patch('/:id/read', idParamValidator, validate, markNotificationRead);

module.exports = router;
