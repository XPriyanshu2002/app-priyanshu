const Dashboard = require('../models/Dashboard');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getDefaultNotifications } = require('./mobileContentService');

function buildDashboardPayload(user) {
  return {
    overview: {
      greeting: `Hi, ${user.name.split(' ')[0]}`,
      subheading: 'Staying efficient today?',
      dueAmount: 'Due Amount: Rs 3,180',
      dueDate: 'Due on 5 Feb 2026',
      paymentTitle: 'Pay securely\nto stay on track.',
      paymentHint: 'Avoid service disruption.',
      daysLeft: '9 Days Left',
      connectionTitle: 'GMR AERO TOWER\n2 INCOMER',
      connectionStatus: 'Tap for Details',
      connectionNumber: '18132429',
      connectionLabel: 'Last Communication',
      connectionDate: '07 Jan 2025, 6:35 PM',
    },
    energySummary: {
      title: 'Energy Summary',
      cta: 'Pick a Date',
      usageLabel: "This Month's Usage:",
      usageValue: '620 kWh',
      usageDelta: '10%',
      usageDeltaIcon: 'trending-up',
      usageComparison: 'vs. Last Month.',
      ranges: ['7D', '30D', '90D', '1Y'],
      activeRange: '30D',
      chartAction: 'Chart',
      bars: [
        { month: 'Jan', height: 145 },
        { month: 'Feb', height: 132 },
        { month: 'Mar', height: 132 },
        { month: 'Apr', height: 93 },
        { month: 'May', height: 136 },
        { month: 'Jun', height: 126 },
        { month: 'Jul', height: 132 },
        { month: 'Aug', height: 93 },
        { month: 'Sep', height: 136 },
        { month: 'Oct', height: 126 },
      ],
    },
    metricSummary: {
      averageLabel: 'Average Daily',
      averageValue: '2,867.634 kWh',
      peakLabel: 'Peak Usage',
      peakValue: '329 kWh',
      comparisonTitle: 'Comparison',
      currentLabel: 'This Month',
      currentValue: '2,060 kWh',
      previousLabel: 'Last Month',
      previousValue: '2,340 kWh',
      savedLabel: 'You saved 280 kWh',
      savedProgress: 0.74,
    },
    alerts: [
      { id: '1', serialNo: '1', meterNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
      { id: '2', serialNo: '2', meterNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
      { id: '3', serialNo: '3', meterNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
    ],
    navItems: [
      { id: 'home', icon: 'home', label: 'Home', active: true },
      { id: 'pay', icon: 'account-balance-wallet', label: 'Pay', active: false },
      { id: 'usage', icon: 'insert-chart-outlined', label: 'Usage', active: false },
      { id: 'tickets', icon: 'support-agent', label: 'Tickets', active: false },
      { id: 'invoice', icon: 'receipt-long', label: 'Invoice', active: false },
    ],
    menu: {
      userName: user.name,
      userId: `ID: ${user.customerId}`,
      version: 'Version 1.0.26',
      items: [
        { id: 'dashboard', icon: 'space-dashboard', label: 'Dashboard', active: true },
        { id: 'usage', icon: 'sync', label: 'Usage', active: false },
        { id: 'payments', icon: 'description', label: 'Payments', active: false },
        { id: 'reports', icon: 'article', label: 'Reports', active: false },
        { id: 'tickets', icon: 'support-agent', label: 'Tickets', active: false },
        { id: 'alerts', icon: 'notifications-none', label: 'Alerts', active: false },
      ],
      footerItems: [
        { id: 'settings', icon: 'settings', label: 'Settings' },
        { id: 'logout', icon: 'logout', label: 'Logout' },
      ],
    },
  };
}

async function ensureUserResources(user) {
  const dashboard = await Dashboard.findOne({ user: user._id });

  if (!dashboard) {
    await Dashboard.create({
      user: user._id,
      ...buildDashboardPayload(user),
    });
  }

  const existingNotifications = await Notification.find({ user: user._id }).sort({ createdAt: 1 }).lean();
  const defaultNotifications = getDefaultNotifications();
  const shouldResetNotifications =
    existingNotifications.length !== defaultNotifications.length ||
    existingNotifications.some((notification, index) => notification.title !== defaultNotifications[index].title);

  if (shouldResetNotifications) {
    await Notification.deleteMany({ user: user._id });
    await Notification.insertMany(
      defaultNotifications.map((item) => ({
        user: user._id,
        title: item.title,
        message: item.message,
      }))
    );
  }
}

async function seedDemoUser() {
  let demoUser = await User.findOne({ email: 'demo@bestinfra.com' });

  if (!demoUser) {
    demoUser = await User.create({
      name: 'Rakesh Kumar',
      email: 'demo@bestinfra.com',
      phone: '9876543210',
      customerId: 'GMR-2024-001234',
      themeMode: 'light',
      fontSize: 13,
      password: 'password123',
    });
  }

  await ensureUserResources(demoUser);
}

module.exports = { buildDashboardPayload, ensureUserResources, seedDemoUser };
