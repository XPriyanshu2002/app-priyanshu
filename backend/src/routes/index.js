const express = require('express');

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const profileRoutes = require('./profileRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(dashboardRoutes);
router.use(profileRoutes);
router.use(notificationRoutes);

module.exports = router;
