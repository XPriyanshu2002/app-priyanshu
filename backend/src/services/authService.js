const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');
const dashboardModel = require('../models/dashboardModel');
const notificationModel = require('../models/notificationModel');
const { signToken } = require('../utils/jwt');

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const error = new Error('name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    const error = new Error('User already exists with this email');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser({ name, email, passwordHash });

  await dashboardModel.createDefaultDashboardForUser(userId);
  await dashboardModel.createDefaultAlertsForUser(userId, name);
  await notificationModel.createDefaultNotificationsForUser(userId);

  return {
    message: 'User registered successfully',
    userId,
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ userId: user.id, email: user.email, name: user.name });

  return {
    token,
    consumerName: user.name,
  };
};

module.exports = {
  register,
  login,
};
