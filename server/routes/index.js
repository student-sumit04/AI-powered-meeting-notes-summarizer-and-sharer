const express = require('express');
const router = express.Router();

const summarizeRoutes = require('./summarizeRoutes');
const uploadRoutes = require('./uploadRoutes');
const shareRoutes = require('./shareRoutes');
const healthRoutes = require('./healthRoutes');

// API Routes
router.use('/summarize', summarizeRoutes);
router.use('/upload', uploadRoutes);
router.use('/share', shareRoutes);
router.use('/health', healthRoutes);

module.exports = router; 