const path = require('path');
const Scan = require('../models/Scan');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { enqueueScan } = require('../services/queueService');

const createScan = asyncHandler(async (req, res) => {
  let { targetType, target } = req.body;

  if (targetType === 'upload') {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }
    target = path.basename(req.file.path);
  }

  const scan = await Scan.create({
    userId: req.user.id,
    targetType,
    target
  });

  enqueueScan(scan._id);

  res.status(202).json({
    message: 'Scan queued',
    scan
  });
});

const listMyScans = asyncHandler(async (req, res) => {
  const scans = await Scan.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
  res.json({ scans });
});

const getMyScanById = asyncHandler(async (req, res) => {
  const scan = await Scan.findOne({ _id: req.params.id, userId: req.user.id });
  if (!scan) throw new ApiError(404, 'Scan not found');
  res.json({ scan });
});

module.exports = {
  createScan,
  listMyScans,
  getMyScanById
};
