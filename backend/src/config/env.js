const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bestinfra',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  corsOrigin: process.env.CLIENT_ORIGIN || '*',
};
