const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const env = require('../src/config/env');

const MIGRATIONS_TABLE = '_schema_migrations';
const MIGRATIONS_DIR = path.join(__dirname, '..', 'db', 'migrations');

const quoteIdentifier = (value) => `\`${String(value).replace(/`/g, '``')}\``;

const readMigrationFiles = () => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, 'en'));
};

const run = async () => {
  const adminConnection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });

  const dbName = quoteIdentifier(env.db.database);
  const migrationTable = quoteIdentifier(MIGRATIONS_TABLE);

  try {
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await adminConnection.query(`USE ${dbName}`);

    await adminConnection.query(
      `CREATE TABLE IF NOT EXISTS ${migrationTable} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(190) NOT NULL UNIQUE,
        run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    );

    const [rows] = await adminConnection.query(`SELECT name FROM ${migrationTable}`);
    const completed = new Set(rows.map((row) => row.name));

    const files = readMigrationFiles();

    for (const file of files) {
      if (completed.has(file)) {
        // eslint-disable-next-line no-console
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      // eslint-disable-next-line no-console
      console.log(`Applying ${file}...`);
      await adminConnection.query(sql);
      await adminConnection.query(`INSERT INTO ${migrationTable} (name) VALUES (?)`, [file]);
    }

    // eslint-disable-next-line no-console
    console.log('Database migration complete.');
  } finally {
    await adminConnection.end();
  }
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed:', error.message);
  process.exit(1);
});
