const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import configurations
const { PORT, NODE_ENV } = require('./config/constants');

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'development' 
    ? '*' 
    : [
        'https://ai-powered-meeting-notes-su-git-94520a-sumits-projects-6928961d.vercel.app',
        'https://ai-powered-meeting-notes-summarizer-and-sharer.vercel.app',
        'https://ai-meeting-summarizer.vercel.app', // Add any additional domains here
        'http://localhost:3000'
      ],
  credentials: true
};

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const apiRoutes = require('./routes');

// Import utilities
const { logInfo, logError } = require('./utils/logger');
const { testEmailConfig } = require('./utils/emailService');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin === '*' ? '*' : req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

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

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({ 
    name: 'AI Meeting Summarizer API',
    description: 'Backend API for the AI Meeting Summarizer application',
    endpoints: [
      { path: '/api/summarize', method: 'POST', description: 'Generate AI summary from transcript' },
      { path: '/api/upload', method: 'POST', description: 'Upload transcript file (txt/pdf)' },
      { path: '/api/share', method: 'POST', description: 'Share summary via email' },
      { path: '/health', method: 'GET', description: 'Health check endpoint' }
    ],
    version: '1.0.0',
    status: 'online'
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