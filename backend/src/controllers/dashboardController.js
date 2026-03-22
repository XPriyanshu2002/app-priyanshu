const dashboardService = require('../services/dashboardService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard(req.user.userId, req.query.range);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
