const User = require('../models/User');
const Scan = require('../models/Scan');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const [totalUsers, totalScans, failedScans, criticalFindings] = await Promise.all([
    User.countDocuments(),
    Scan.countDocuments(),
    Scan.countDocuments({ status: 'failed' }),
    Scan.countDocuments({ 'vulnerabilities.severity': 'Critical' })
  ]);

  const recentScans = await Scan.find().sort({ createdAt: -1 }).limit(20).populate('userId', 'email name');

  res.json({
    summary: {
      totalUsers,
      totalScans,
      failedScans,
      criticalFindings
    },
    recentScans
  });
});

module.exports = {
  getSummary
};
