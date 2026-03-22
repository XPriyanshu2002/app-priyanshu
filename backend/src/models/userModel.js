const pool = require('../config/db');
const inMemoryStore = require('../store/inMemoryStore');
const { isRecoverableDbError } = require('../utils/dbError');

const findByEmail = async (email) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash AS passwordHash FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    if (isRecoverableDbError(error)) {
      return inMemoryStore.findUserByEmail(email);
    }

    throw error;
  }
};

const findById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  } catch (error) {
    if (isRecoverableDbError(error)) {
      return inMemoryStore.findUserById(id);
    }

    throw error;
  }
};

const createUser = async ({ name, email, passwordHash }) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    return result.insertId;
  } catch (error) {
    if (isRecoverableDbError(error)) {
      return inMemoryStore.createUser({ name, email, passwordHash });
    }

    throw error;
  }
};

const updateUser = async (id, { name, email }) => {
  try {
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    return findById(id);
  } catch (error) {
    if (isRecoverableDbError(error)) {
      return inMemoryStore.updateUser(id, { name, email });
    }

    throw error;
  }
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUser,
};
