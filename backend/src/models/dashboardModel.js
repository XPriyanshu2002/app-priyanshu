const pool = require('../config/db');
const inMemoryStore = require('../store/inMemoryStore');
const { isRecoverableDbError } = require('../utils/dbError');

const getDashboardByUserId = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        meter_number AS meterNumber,
        balance,
        due_amount AS dueAmount,
        due_date AS dueDate,
        last_communication AS lastCommunication,
        monthly_usage AS monthlyUsage,
        avg_daily_usage AS avgDailyUsage,
        peak_usage AS peakUsage
       FROM consumer_dashboard
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );

    return rows[0] || null;
  } catch (error) {
    if (isRecoverableDbError(error)) {
      return inMemoryStore.getDashboardByUserId(userId);
    }

    throw error;
  }
};

const createDefaultDashboardForUser = async (userId) => {
  const defaultMonthlyUsage = JSON.stringify([
    { label: 'Jan', value: 220 },
    { label: 'Feb', value: 235 },
    { label: 'Mar', value: 228 },
    { label: 'Apr', value: 250 },
  ]);

  try {
    await pool.query(
      `INSERT INTO consumer_dashboard
        (user_id, meter_number, balance, due_amount, due_date, last_communication, monthly_usage, avg_daily_usage, peak_usage)
       VALUES (?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 7 DAY), NOW(), ?, ?, ?)`,
      [userId, `MTR-${String(userId).padStart(6, '0')}`, 1200.5, 340.75, defaultMonthlyUsage, 7.6, 12.2]
    );
  } catch (error) {
    if (isRecoverableDbError(error)) {
      inMemoryStore.createDefaultDashboardForUser(userId);
      return;
    }

    throw error;
  }
};

const getAlertsByUserId = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        id,
        meter_serial_number AS meterSerialNumber,
        consumer_name AS consumerName,
        message,
        created_at AS createdAt
       FROM alerts
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return rows;
  } catch (error) {
    if (isRecoverableDbError(error)) {
      return inMemoryStore.getAlertsByUserId(userId);
    }

    throw error;
  }
};

const createDefaultAlertsForUser = async (userId, consumerName) => {
  const meterSerial = `MTR-${String(userId).padStart(6, '0')}`;

  try {
    await pool.query(
      `INSERT INTO alerts (user_id, meter_serial_number, consumer_name, message)
       VALUES
        (?, ?, ?, 'Low balance detected'),
        (?, ?, ?, 'Bill due in 5 days'),
        (?, ?, ?, 'Peak usage exceeded average')`,
      [userId, meterSerial, consumerName, userId, meterSerial, consumerName, userId, meterSerial, consumerName]
    );
  } catch (error) {
    if (isRecoverableDbError(error)) {
      inMemoryStore.createDefaultAlertsForUser(userId, consumerName);
      return;
    }

    throw error;
  }
};

module.exports = {
  getDashboardByUserId,
  createDefaultDashboardForUser,
  getAlertsByUserId,
  createDefaultAlertsForUser,
};
