const jwt = require('jsonwebtoken');

const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      res.status(401);
      throw new Error('Authorization token is required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_me');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found for this token');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { protect };
