const Dashboard = require('../models/Dashboard');
const { ensureUserResources } = require('../services/seedService');

async function getDashboard(req, res, next) {
  try {
    await ensureUserResources(req.user);
    const dashboard = await Dashboard.findOne({ user: req.user._id }).lean();

    if (!dashboard) {
      res.status(404);
      throw new Error('Dashboard not found');
    }

    res.json({
      overview: dashboard.overview,
      energySummary: dashboard.energySummary,
      metricSummary: dashboard.metricSummary,
      alerts: dashboard.alerts,
      navItems: dashboard.navItems,
      menu: dashboard.menu,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };
