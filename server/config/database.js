// Database configuration for future use
// This can be extended when adding database functionality

const dbConfig = {
  // MongoDB configuration (for future use)
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-summarizer',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // PostgreSQL configuration (for future use)
  postgresql: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ai_summarizer',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // Redis configuration (for caching)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: process.env.REDIS_DB || 0
  }
};

module.exports = dbConfig; 