const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import configurations
const { PORT, NODE_ENV } = require('./config/constants');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const apiRoutes = require('./routes');

// Import utilities
const { logInfo, logError } = require('./utils/logger');
const { testEmailConfig } = require('./utils/emailService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logInfo(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test email configuration on startup
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const emailConfigValid = await testEmailConfig();
      if (!emailConfigValid) {
        logError('Email configuration is invalid. Email sharing may not work properly.');
      }
    }

    app.listen(PORT, () => {
      logInfo(`Server running on port ${PORT}`, {
        environment: NODE_ENV,
        port: PORT
      });
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📧 Email sharing: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
      console.log(`🤖 AI API: ${process.env.GROQ_API_KEY ? 'Configured' : 'Not configured'}`);
    });
  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError('Uncaught Exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection', reason);
  process.exit(1);
});

startServer(); 