// API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'your-groq-api-key';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Server Configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// File Upload Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['text/plain', 'application/pdf'];
const MAX_TRANSCRIPT_LENGTH = 50000; // 50,000 characters

// Email Configuration
const EMAIL_SERVICE = 'gmail';

// AI Model Configuration
const AI_MODEL = 'llama3-8b-8192';
const AI_TEMPERATURE = 0.3;
const AI_MAX_TOKENS = 2000;

module.exports = {
  GROQ_API_KEY,
  GROQ_API_URL,
  PORT,
  NODE_ENV,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  MAX_TRANSCRIPT_LENGTH,
  EMAIL_SERVICE,
  AI_MODEL,
  AI_TEMPERATURE,
  AI_MAX_TOKENS
}; 