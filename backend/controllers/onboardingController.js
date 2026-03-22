const { getOnboardingSlides } = require('../services/mobileContentService');

async function getOnboarding(_req, res, next) {
  try {
    res.json({
      slides: getOnboardingSlides(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getOnboarding };
