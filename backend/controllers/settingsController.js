async function getSettings(req, res, next) {
  try {
    res.json({
      darkMode: req.user.themeMode === 'dark',
      themeMode: req.user.themeMode || 'light',
      fontSize: req.user.fontSize || 13,
      termsLabel: 'Terms of Service',
      privacyLabel: 'Privacy Policy',
    });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const { themeMode, fontSize } = req.body;

    if (themeMode && ['light', 'dark'].includes(themeMode)) {
      req.user.themeMode = themeMode;
    }

    if (fontSize && Number(fontSize) > 0) {
      req.user.fontSize = Number(fontSize);
    }

    await req.user.save();

    res.json({
      darkMode: req.user.themeMode === 'dark',
      themeMode: req.user.themeMode,
      fontSize: req.user.fontSize,
      termsLabel: 'Terms of Service',
      privacyLabel: 'Privacy Policy',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getSettings, updateSettings };
