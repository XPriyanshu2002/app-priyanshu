const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool(env.db);

const quoteIdentifier = (value) => `\`${String(value).replace(/`/g, '``')}\``;

const ensureDatabaseExists = async () => {
  const adminConnection = await mysql.createConnection({
    host: "trolley.proxy.rlwy.net",
    port: 15412,
    user: "root",
    password: "DYocRoAQQlahZEJiAFZBepqzZgKTGVfV",
    database: "bestinfra"
  });

  try {
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(env.db.database)}`);
  } catch (error) {
    // Managed MySQL providers may deny CREATE DATABASE while still allowing table DDL in an existing DB.
    if (error?.code !== 'ER_DBACCESS_DENIED_ERROR') {
      throw error;
    }
  } finally {
    await adminConnection.end();
  }
};

const initDatabase = async () => {
  await ensureDatabaseExists();

  const tableDefinitions = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password VARCHAR(255) DEFAULT NULL,
      password_hash VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS dashboard (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_dashboard_user_ref FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS consumer_dashboard (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      meter_number VARCHAR(64) NOT NULL,
      balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
      due_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      due_date DATE,
      last_communication DATETIME,
      monthly_usage JSON,
      avg_daily_usage DECIMAL(10, 2) DEFAULT 0,
      peak_usage DECIMAL(10, 2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_dashboard_user (user_id),
      CONSTRAINT fk_consumer_dashboard_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      meter_serial_number VARCHAR(64) NOT NULL,
      consumer_name VARCHAR(120) NOT NULL,
      message VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_alert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      message VARCHAR(255) DEFAULT NULL,
      type VARCHAR(40) NOT NULL,
      title VARCHAR(120) NOT NULL,
      description VARCHAR(255) NOT NULL,
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
  ];

  for (const statement of tableDefinitions) {
    await pool.query(statement);
  }
};

pool.initDatabase = initDatabase;

module.exports = pool;
