const healthCheck = (req, res) => {
  const healthData = {
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  };

  res.json(healthData);
};

module.exports = {
  healthCheck
}; 