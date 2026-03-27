// Screens with dark backgrounds (always "light" status bar style)
const DARK_BG_SCREENS = ['Settings', 'Notifications', 'SideMenu'];

// Screens with light backgrounds (style depends on theme mode)
const LIGHT_BG_SCREENS = ['Home', 'Pay', 'Usage', 'Tickets', 'Invoice', 'Profile', 'Payments', 'Reports'];

// Auth screens (always "light" style — dark brand backgrounds)
const AUTH_SCREENS = ['Login', 'Register', 'Onboarding', 'Splash'];

/**
 * Returns the status bar style and background color for a given screen.
 * @param {string} screenName - The screen identifier (e.g. 'Home', 'Settings')
 * @param {string} mode - Current theme mode ('light' or 'dark')
 * @param {boolean} isDrawerOpen - Whether the drawer is currently open
 * @param {object} colors - The current theme's colors object from tokens.js
 * @returns {{ style: 'light' | 'dark', backgroundColor: string }}
 */
function getStatusBarConfig(screenName, mode, isDrawerOpen, colors) {
  // Drawer override: drawer background is always dark
  if (isDrawerOpen) {
    return { style: 'light', backgroundColor: colors.drawerBackground };
  }

  // Dark-background screens: always light style
  if (DARK_BG_SCREENS.includes(screenName)) {
    return { style: 'light', backgroundColor: colors.settingsBackground };
  }

  // Auth screens: always light style
  if (AUTH_SCREENS.includes(screenName)) {
    return { style: 'light', backgroundColor: colors.background };
  }

  // Light-background screens (and unknown/fallback): style depends on mode
  const style = mode === 'light' ? 'dark' : 'light';
  return { style, backgroundColor: colors.screenBackground };
}

module.exports = { getStatusBarConfig, DARK_BG_SCREENS, LIGHT_BG_SCREENS, AUTH_SCREENS };
