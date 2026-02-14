const express = require('express');
const router = express.Router();
const { generateSummary } = require('../controllers/summarizeController');
const { validateSummarizeRequest } = require('../middleware/validation');

router.post('/', validateSummarizeRequest, generateSummary);

module.exports = router; 