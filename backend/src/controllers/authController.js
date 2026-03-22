const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
