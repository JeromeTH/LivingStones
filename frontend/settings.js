const settings = {
  development: {
    API_URL: 'http://localhost:8000/api',
  },
  production: {
    API_URL: 'http://your-production-domain/api',
  },
};

// Export the appropriate settings based on the current environment
const currentEnv = 'development'; // Change this to 'production' for production environment
module.exports = settings[currentEnv];
