const Scan = require('../models/Scan');
const { ScanStatuses } = require('../utils/constants');
const { runStaticRiskProfiling } = require('./scannerService');
const { createNotification } = require('./notificationService');
const logger = require('../config/logger');

async function processScan(scanId) {
  const scan = await Scan.findById(scanId);
  if (!scan) return;

  scan.status = ScanStatuses.RUNNING;
  scan.startedAt = new Date();
  await scan.save();

  try {
    const result = runStaticRiskProfiling(scan.target);

    scan.status = ScanStatuses.COMPLETED;
    scan.riskScore = result.riskScore;
    scan.vulnerabilities = result.findings;
    scan.metadata = result.metadata;
    scan.completedAt = new Date();
    await scan.save();

    await createNotification({
      userId: scan.userId,
      scanId: scan._id,
      title: 'Scan completed',
      message: `Your scan for ${scan.target} is complete.`,
      type: scan.riskScore >= 70 ? 'critical' : 'success'
    });
  } catch (error) {
    logger.error('Scan processing failed', { scanId, message: error.message });
    scan.status = ScanStatuses.FAILED;
    scan.failureReason = 'Scan execution failed';
    scan.completedAt = new Date();
    await scan.save();

    await createNotification({
      userId: scan.userId,
      scanId: scan._id,
      title: 'Scan failed',
      message: `The scan for ${scan.target} failed. Please retry.`,
      type: 'warning'
    });
  }
}

function enqueueScan(scanId) {
  setTimeout(() => {
    processScan(scanId).catch(() => undefined);
  }, 500);
}

module.exports = {
  enqueueScan
};
