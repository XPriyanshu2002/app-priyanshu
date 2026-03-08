const jwt = require('jsonwebtoken');

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'change_me', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { generateToken };
