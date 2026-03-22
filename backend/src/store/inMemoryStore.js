const users = [];
const dashboardsByUserId = new Map();
const alertsByUserId = new Map();
const notificationsByUserId = new Map();

let nextUserId = 1;
let nextAlertId = 1;
let nextNotificationId = 1;

const clone = (value) => JSON.parse(JSON.stringify(value));

const buildMeterNumber = (userId) => `MTR-${String(userId).padStart(6, '0')}`;

const getDueDate = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  return dueDate.toISOString().slice(0, 10);
};

const defaultMonthlyUsage = () => [
  { label: 'Jan', value: 220 },
  { label: 'Feb', value: 235 },
  { label: 'Mar', value: 228 },
  { label: 'Apr', value: 250 },
];

const findUserByEmail = (email) => {
  const user = users.find((candidate) => candidate.email === email);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
  };
};

const findUserById = (id) => {
  const user = users.find((candidate) => candidate.id === id);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

const createUser = ({ name, email, passwordHash }) => {
  const user = {
    id: nextUserId,
    name,
    email,
    passwordHash,
  };
  nextUserId += 1;
  users.push(user);
  return user.id;
};

const updateUser = (id, { name, email }) => {
  const duplicateUser = users.find((candidate) => candidate.email === email && candidate.id !== id);
  if (duplicateUser) {
    const error = new Error('Duplicate email');
    error.code = 'ER_DUP_ENTRY';
    throw error;
  }

  const targetUser = users.find((candidate) => candidate.id === id);
  if (!targetUser) {
    return null;
  }

  targetUser.name = name;
  targetUser.email = email;
  return findUserById(id);
};

const getDashboardByUserId = (userId) => {
  const dashboard = dashboardsByUserId.get(userId);
  if (!dashboard) {
    return null;
  }

  return clone(dashboard);
};

const createDefaultDashboardForUser = (userId) => {
  if (dashboardsByUserId.has(userId)) {
    return;
  }

  dashboardsByUserId.set(userId, {
    meterNumber: buildMeterNumber(userId),
    balance: 1200.5,
    dueAmount: 340.75,
    dueDate: getDueDate(),
    lastCommunication: new Date().toISOString(),
    monthlyUsage: JSON.stringify(defaultMonthlyUsage()),
    avgDailyUsage: 7.6,
    peakUsage: 12.2,
  });
};

const getAlertsByUserId = (userId) => {
  const alerts = alertsByUserId.get(userId) || [];
  return clone(alerts).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const createDefaultAlertsForUser = (userId, consumerName) => {
  const createdAt = new Date().toISOString();
  const meterSerialNumber = buildMeterNumber(userId);
  const alerts = [
    {
      id: nextAlertId,
      meterSerialNumber,
      consumerName,
      message: 'Low balance detected',
      createdAt,
    },
    {
      id: nextAlertId + 1,
      meterSerialNumber,
      consumerName,
      message: 'Bill due in 5 days',
      createdAt,
    },
    {
      id: nextAlertId + 2,
      meterSerialNumber,
      consumerName,
      message: 'Peak usage exceeded average',
      createdAt,
    },
  ];

  nextAlertId += 3;
  alertsByUserId.set(userId, alerts);
};

const getNotificationsByUserId = (userId) => {
  const notifications = notificationsByUserId.get(userId) || [];
  return clone(notifications).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const createDefaultNotificationsForUser = (userId) => {
  const createdAt = new Date().toISOString();
  const notifications = [
    {
      id: nextNotificationId,
      type: 'BILL_DUE',
      title: 'Bill Due Reminder',
      description: 'Your electricity bill is due soon.',
      createdAt,
      isRead: 0,
    },
    {
      id: nextNotificationId + 1,
      type: 'PAYMENT_CONFIRMATION',
      title: 'Payment Confirmation',
      description: 'Your recent electricity payment has been received.',
      createdAt,
      isRead: 0,
    },
    {
      id: nextNotificationId + 2,
      type: 'LOW_BALANCE',
      title: 'Low Balance Alert',
      description: 'Your balance is below the recommended threshold.',
      createdAt,
      isRead: 0,
    },
    {
      id: nextNotificationId + 3,
      type: 'SYSTEM_ALERT',
      title: 'System Alert',
      description: 'Meter communication is stable and active.',
      createdAt,
      isRead: 0,
    },
    {
      id: nextNotificationId + 4,
      type: 'TICKET_UPDATE',
      title: 'Ticket Update',
      description: 'Your latest support ticket status has been updated.',
      createdAt,
      isRead: 0,
    },
  ];

  nextNotificationId += 5;
  notificationsByUserId.set(userId, notifications);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getDashboardByUserId,
  createDefaultDashboardForUser,
  getAlertsByUserId,
  createDefaultAlertsForUser,
  getNotificationsByUserId,
  createDefaultNotificationsForUser,
};
