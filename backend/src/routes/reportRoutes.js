const express = require('express');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { idParamValidator } = require('../utils/validators');
const { downloadPdfReport } = require('../controllers/reportController');

const router = express.Router();

router.use(authenticate);
router.get('/:id/pdf', idParamValidator, validate, downloadPdfReport);

module.exports = router;
