const notificationModel = require('../models/notificationModel');

const getNotifications = async (userId) => {
  const notifications = await notificationModel.getNotificationsByUserId(userId);

  return {
    notifications,
  };
};

module.exports = {
  getNotifications,
};
