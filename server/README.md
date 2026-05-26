# AI Meeting Summarizer - Server

This is the backend server for the AI Meeting Summarizer application, built with Node.js and Express.

## Project Structure

```
server/
├── config/                 # Configuration files
│   ├── constants.js       # Application constants
│   └── database.js        # Database configuration
├── controllers/           # Request handlers
│   ├── summarizeController.js
│   ├── uploadController.js
│   ├── shareController.js
│   └── healthController.js
├── middleware/            # Custom middleware
│   ├── upload.js         # File upload middleware
│   ├── errorHandler.js   # Error handling middleware
│   └── validation.js     # Request validation
├── models/               # Data models (for future use)
│   ├── Summary.js
│   └── User.js
├── routes/               # API routes
│   ├── index.js         # Main routes file
│   ├── summarizeRoutes.js
│   ├── uploadRoutes.js
│   ├── shareRoutes.js
│   └── healthRoutes.js
├── utils/               # Utility functions
│   ├── emailService.js  # Email functionality
│   └── logger.js        # Logging utility
├── db/                  # Database files (for future use)
├── logs/                # Log files (created automatically)
├── index.js            # Main server file
├── package.json        # Dependencies
└── env.example         # Environment variables template
```

## Features

- **Modular Architecture**: Clean separation of concerns with organized folders
- **Middleware**: Custom middleware for file uploads, validation, and error handling
- **Controllers**: Dedicated controllers for each API endpoint
- **Routes**: Organized routing structure
- **Utilities**: Reusable utility functions for email and logging
- **Configuration**: Centralized configuration management
- **Models**: Data models for future database integration
- **Logging**: Comprehensive logging with Winston

## API Endpoints

### POST `/api/summarize`
Generate AI summary from transcript.

**Request Body:**
```json
{
  "transcript": "Meeting transcript text...",
  "customPrompt": "Optional custom instructions"
}
```

**Response:**
```json
{
  "summary": "Generated summary text..."
}
```

### POST `/api/upload`
Upload transcript file.

**Request:** Multipart form data with `file` field

**Response:**
```json
{
  "transcript": "Extracted text from file..."
}
```

### POST `/api/share`
Share summary via email.

**Request Body:**
```json
{
  "summary": "Summary text to share",
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Email subject"
}
```

**Response:**
```json
{
  "message": "Summary shared successfully"
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp env.example .env
```

Edit the `.env` file with your credentials:
```env
# Groq API Configuration
GROQ_API_KEY=your-groq-api-key-here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development

# Logging Configuration
LOG_LEVEL=info
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Start Production Server
```bash
npm start
```

## Middleware

### Upload Middleware (`middleware/upload.js`)
- Handles file uploads using Multer
- Supports `.txt` and `.pdf` files
- 10MB file size limit
- File type validation

### Error Handler (`middleware/errorHandler.js`)
- Centralized error handling
- Handles Multer errors
- Provides meaningful error messages
- Development/production error details

### Validation (`middleware/validation.js`)
- Request validation for summarize endpoint
- Request validation for share endpoint
- Email format validation
- Input length validation

## Controllers

### Summarize Controller (`controllers/summarizeController.js`)
- Handles AI summarization requests
- Integrates with Groq API
- Error handling for API failures
- Configurable AI parameters

### Upload Controller (`controllers/uploadController.js`)
- Processes file uploads
- Extracts text from files
- File content validation
- Error handling for file processing

### Share Controller (`controllers/shareController.js`)
- Handles email sharing
- Uses email service utility
- Email format validation
- Error handling for email sending

### Health Controller (`controllers/healthController.js`)
- System health monitoring
- Server status information
- Environment details
- Timestamp information

## Utilities

### Email Service (`utils/emailService.js`)
- Email sending functionality
- Gmail integration
- Email configuration testing
- Promise-based email sending

### Logger (`utils/logger.js`)
- Winston-based logging
- File and console logging
- Structured log format
- Environment-based logging levels

## Configuration

### Constants (`config/constants.js`)
- API configuration
- Server settings
- File upload limits
- AI model parameters

### Database (`config/database.js`)
- Database connection settings
- MongoDB configuration
- PostgreSQL configuration
- Redis configuration

## Models

### Summary Model (`models/Summary.js`)
- Summary data structure
- Validation methods
- JSON serialization
- Future database integration ready

### User Model (`models/User.js`)
- User data structure
- Email validation
- User status management
- Future authentication ready

## Logging

The application uses Winston for comprehensive logging:

- **Error Logs**: `logs/error.log`
- **Combined Logs**: `logs/combined.log`
- **Console Logs**: Development environment only
- **Structured Format**: JSON with timestamps

## Error Handling

- **Global Error Handler**: Catches all unhandled errors
- **Request Validation**: Input validation before processing
- **API Error Handling**: Specific error handling for external APIs
- **File Upload Errors**: Multer error handling
- **Email Errors**: Email service error handling

## Future Enhancements

### Database Integration
- MongoDB for document storage
- PostgreSQL for relational data
- Redis for caching

### Authentication
- JWT token authentication
- User registration/login
- Role-based access control

### Additional Features
- PDF parsing support
- File storage (AWS S3, etc.)
- Rate limiting
- API documentation (Swagger)

## Development

### Adding New Routes
1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Add route to `routes/index.js`
4. Add validation middleware if needed

### Adding New Middleware
1. Create middleware file in `middleware/`
2. Import and use in `index.js` or specific routes
3. Add error handling if needed

### Adding New Utilities
1. Create utility file in `utils/`
2. Export functions for use in controllers
3. Add error handling and logging

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Configure all required API keys
- Set up email credentials
- Configure logging level

### Logging
- Logs are automatically written to files
- Console logging is disabled in production
- Monitor log files for errors

### Security
- Environment variables for sensitive data
- Input validation on all endpoints
- File upload restrictions
- CORS configuration

## Troubleshooting

### Common Issues

1. **Email Configuration**
   - Verify Gmail app password
   - Check 2-factor authentication
   - Test email configuration on startup

2. **API Key Issues**
   - Verify Groq API key
   - Check API rate limits
   - Monitor API usage

3. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions
   - Monitor upload logs

4. **Logging Issues**
   - Check log file permissions
   - Verify log directory exists
   - Monitor log file sizes

### Debug Mode
Set `LOG_LEVEL=debug` in your `.env` file for detailed logging.

---

For more information, see the main project README. 