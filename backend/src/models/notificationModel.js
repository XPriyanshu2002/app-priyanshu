const pool = require('../config/db');
const inMemoryStore = require('../store/inMemoryStore');
const { isRecoverableDbError } = require('../utils/dbError');

const getNotificationsByUserId = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        id,
        type,
        title,
        description,
        created_at AS createdAt,
        is_read AS isRead
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return rows;
  } catch (error) {
    if (isRecoverableDbError(error)) {
      return inMemoryStore.getNotificationsByUserId(userId);
    }

    throw error;
  }
};

const createDefaultNotificationsForUser = async (userId) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, description)
       VALUES
        (?, 'BILL_DUE', 'Bill Due Reminder', 'Your electricity bill is due soon.'),
        (?, 'PAYMENT_CONFIRMATION', 'Payment Confirmation', 'Your recent electricity payment has been received.'),
        (?, 'LOW_BALANCE', 'Low Balance Alert', 'Your balance is below the recommended threshold.'),
        (?, 'SYSTEM_ALERT', 'System Alert', 'Meter communication is stable and active.'),
        (?, 'TICKET_UPDATE', 'Ticket Update', 'Your latest support ticket status has been updated.')`,
      [userId, userId, userId, userId, userId]
    );
  } catch (error) {
    if (isRecoverableDbError(error)) {
      inMemoryStore.createDefaultNotificationsForUser(userId);
      return;
    }

    throw error;
  }
};

module.exports = {
  getNotificationsByUserId,
  createDefaultNotificationsForUser,
};
