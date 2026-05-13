const Scan = require('../models/Scan');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateScanReportPdf } = require('../services/pdfService');

const downloadPdfReport = asyncHandler(async (req, res) => {
  const scan = await Scan.findOne({ _id: req.params.id, userId: req.user.id });
  if (!scan) throw new ApiError(404, 'Scan not found');

  const pdf = await generateScanReportPdf(scan);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="valnexis-scan-${scan._id}.pdf"`
  );
  return res.send(pdf);
});

module.exports = {
  downloadPdfReport
};
