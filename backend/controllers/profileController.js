const Dashboard = require('../models/Dashboard');

async function getProfile(req, res, next) {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address || '',
      customerId: req.user.customerId,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, email, phone, address } = req.body;

    if (name) {
      req.user.name = name.trim();
    }

    if (email) {
      req.user.email = email.trim().toLowerCase();
    }

    if (typeof phone === 'string') {
      req.user.phone = phone.trim();
    }

    if (typeof address === 'string') {
      req.user.address = address.trim();
    }

    await req.user.save();

    const firstName = req.user.name.trim().split(/\s+/)[0] || 'User';
    await Dashboard.updateOne(
      { user: req.user._id },
      {
        $set: {
          'menu.userName': req.user.name,
          'menu.userId': `ID: ${req.user.customerId}`,
          'overview.greeting': `Hi, ${firstName}`,
        },
      }
    );

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address || '',
      customerId: req.user.customerId,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProfile, updateProfile };
