const Notification = require('../models/Notification');

async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      unreadCount: notifications.filter((notification) => !notification.isRead).length,
      items: notifications.map((notification) => ({
        id: notification._id,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getNotifications };
