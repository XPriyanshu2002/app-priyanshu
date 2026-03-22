const profileService = require('../services/profileService');

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await profileService.updateProfile(req.user.userId, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
