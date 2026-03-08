const Dashboard = require('../models/Dashboard');
const User = require('../models/User');
const { ensureUserResources } = require('../services/seedService');
const { generateToken } = require('../services/tokenService');

async function registerUser(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(409);
      throw new Error('User already exists');
    }

    const customerId = `GMR-${Date.now().toString().slice(-8)}`;
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      customerId,
      password,
    });

    await ensureUserResources(user);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || '',
        customerId: user.customerId,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      res.status(400);
      throw new Error('Email or phone and password are required');
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
    });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    await ensureUserResources(user);
    const dashboard = await Dashboard.findOne({ user: user._id });

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || '',
        customerId: user.customerId,
      },
      dashboard,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { loginUser, registerUser };
