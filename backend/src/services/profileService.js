const userModel = require('../models/userModel');

const getProfile = async (userId) => {
  const profile = await userModel.findById(userId);

  if (!profile) {
    const error = new Error('Profile not found');
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

const updateProfile = async (userId, { name, email }) => {
  if (!name || !email) {
    const error = new Error('name and email are required');
    error.statusCode = 400;
    throw error;
  }

  let updatedProfile;

  try {
    updatedProfile = await userModel.updateUser(userId, { name, email });
  } catch (dbError) {
    if (dbError.code === 'ER_DUP_ENTRY') {
      const error = new Error('Email is already in use by another account');
      error.statusCode = 409;
      throw error;
    }

    throw dbError;
  }

  return {
    message: 'Profile updated successfully',
    profile: updatedProfile,
  };
};

module.exports = {
  getProfile,
  updateProfile,
};
