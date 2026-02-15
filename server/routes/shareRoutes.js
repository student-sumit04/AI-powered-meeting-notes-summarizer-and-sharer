const express = require('express');
const router = express.Router();
const { shareSummary } = require('../controllers/shareController');
const { validateShareRequest } = require('../middleware/validation');

router.post('/', validateShareRequest, shareSummary);

module.exports = router; 