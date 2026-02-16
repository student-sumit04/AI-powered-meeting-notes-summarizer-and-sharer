const express = require('express');
const router = express.Router();
const { processFileUpload } = require('../controllers/uploadController');
const upload = require('../middleware/upload');

router.post('/', upload.single('file'), processFileUpload);

module.exports = router; 