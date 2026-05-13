const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const { createScan, listMyScans, getMyScanById } = require('../controllers/scanController');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createScanValidator, idParamValidator } = require('../utils/validators');
const env = require('../config/env');

const router = express.Router();

const upload = multer({
  dest: path.resolve('uploads'),
  limits: {
    fileSize: env.maxUploadSizeBytes,
    files: 1
  },
  fileFilter(req, file, cb) {
    const allowedExt = ['.zip', '.tar', '.gz', '.txt', '.js', '.ts', '.json'];
    const ext = path.extname(file.originalname.toLowerCase());
    if (!allowedExt.includes(ext)) {
      return cb(new Error('File type not allowed'));
    }
    return cb(null, true);
  }
});

router.use(authenticate);

router.post(
  '/',
  upload.single('project'),
  [body('target').optional().isString().isLength({ max: 2048 }), ...createScanValidator],
  validate,
  createScan
);

router.get('/', listMyScans);
router.get('/:id', idParamValidator, validate, getMyScanById);

module.exports = router;
