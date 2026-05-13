const express = require('express');
const authRoutes = require('./authRoutes');
const scanRoutes = require('./scanRoutes');
const reportRoutes = require('./reportRoutes');
const adminRoutes = require('./adminRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'valnexis-api' });
});

router.use('/auth', authRoutes);
router.use('/scans', scanRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
