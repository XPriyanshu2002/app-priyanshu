const notificationService = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getNotifications(req.user.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
};
