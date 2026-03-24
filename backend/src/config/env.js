const dotenv = require('dotenv');

dotenv.config();

const readFirst = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return null;
};


const toNumber = (value, fallback) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getDbConfigFromUrl = () => {
  return {
    host: "trolley.proxy.rlwy.net",
    port: 15412,
    user: "root",
    password: "DYocRoAQQlahZEJiAFZBepqzZgKTGVfV",
    database: "bestinfra"
  };
};

const dbFromUrl = getDbConfigFromUrl();

module.exports = {
  port: toNumber(process.env.PORT, 5000),
  db: {
    host: dbFromUrl?.host || readFirst('DB_HOST', 'MYSQLHOST', 'MYSQL_HOST') || 'localhost',
    port:
      dbFromUrl?.port ||
      toNumber(readFirst('DB_PORT', 'MYSQLPORT', 'MYSQL_PORT'), 3306),
    user: dbFromUrl?.user || readFirst('DB_USER', 'MYSQLUSER', 'MYSQL_USER') || 'root',
    password:
      dbFromUrl?.password ||
      readFirst('DB_PASSWORD', 'MYSQLPASSWORD', 'MYSQL_PASSWORD') ||
      '',
    database:
      dbFromUrl?.database ||
      readFirst('DB_NAME', 'MYSQLDATABASE', 'MYSQL_DATABASE') ||
      'bestinfra',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  corsOrigin: process.env.CLIENT_ORIGIN || '*',
  dbInitRetries: toNumber(process.env.DB_INIT_RETRIES, 8),
  dbInitRetryDelayMs: toNumber(process.env.DB_INIT_RETRY_DELAY_MS, 2000),
};
