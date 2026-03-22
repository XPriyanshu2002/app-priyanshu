const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const env = require('../src/config/env');

const quoteIdentifier = (value) => `\`${String(value).replace(/`/g, '``')}\``;

const run = async () => {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });

  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(env.db.database)}`);
    await connection.query(`USE ${quoteIdentifier(env.db.database)}`);
    await connection.query(sql);
    // eslint-disable-next-line no-console
    console.log('Seed data applied.');
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seeding failed:', error.message);
  process.exit(1);
});
