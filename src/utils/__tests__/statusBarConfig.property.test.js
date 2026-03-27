/**
 * Property-based and unit tests for getStatusBarConfig.
 * Feature: dynamic-status-bar
 */
const fc = require('fast-check');
const { getStatusBarConfig, DARK_BG_SCREENS, LIGHT_BG_SCREENS, AUTH_SCREENS } = require('../statusBarConfig');
const { lightTheme, darkTheme, getTheme } = require('../../theme/tokens');

const ALL_SCREENS = [...DARK_BG_SCREENS, ...LIGHT_BG_SCREENS, ...AUTH_SCREENS];
const MODES = ['light', 'dark'];

const colorsFor = (mode) => getTheme(mode).colors;

/**
 * Feature: dynamic-status-bar, Property 1: Status bar style matches screen background category and theme mode
 * For any screen name and theme mode, getStatusBarConfig returns "dark" style only for light-BG screens
 * in light mode, "light" in all other cases.
 * Validates: Requirements 1.1, 1.2, 1.3, 3.2, 3.3
 */
describe('Feature: dynamic-status-bar, Property 1: Status bar style matches screen background category and theme mode', () => {
  it('returns "dark" style only for light-BG screens in light mode, "light" otherwise', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_SCREENS),
        fc.constantFrom(...MODES),
        (screenName, mode) => {
          const colors = colorsFor(mode);
          const config = getStatusBarConfig(screenName, mode, false, colors);

          if (LIGHT_BG_SCREENS.includes(screenName) && mode === 'light') {
            return config.style === 'dark';
          }
          return config.style === 'light';
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: dynamic-status-bar, Property 2: Drawer open always overrides to light style
 * For any screen name and mode, when isDrawerOpen is true, style is "light" and
 * backgroundColor is drawerBackground.
 * Validates: Requirements 5.1, 5.2
 */
describe('Feature: dynamic-status-bar, Property 2: Drawer open always overrides to light style', () => {
  it('returns style "light" and drawerBackground color when drawer is open', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_SCREENS),
        fc.constantFrom(...MODES),
        (screenName, mode) => {
          const colors = colorsFor(mode);
          const config = getStatusBarConfig(screenName, mode, true, colors);
          return (
            config.style === 'light' &&
            config.backgroundColor === colors.drawerBackground
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: dynamic-status-bar, Property 3: Background color matches screen's theme token
 * For any screen name and mode, backgroundColor equals the expected theme token for that
 * screen category.
 * Validates: Requirements 2.1, 2.2
 */
describe('Feature: dynamic-status-bar, Property 3: Background color matches screen theme token', () => {
  it('returns the correct background color token for each screen category', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_SCREENS),
        fc.constantFrom(...MODES),
        (screenName, mode) => {
          const colors = colorsFor(mode);
          const config = getStatusBarConfig(screenName, mode, false, colors);

          if (DARK_BG_SCREENS.includes(screenName)) {
            return config.backgroundColor === colors.settingsBackground;
          }
          if (AUTH_SCREENS.includes(screenName)) {
            return config.backgroundColor === colors.background;
          }
          // Light BG screens (and fallback)
          return config.backgroundColor === colors.screenBackground;
        },
      ),
      { numRuns: 100 },
    );
  });
});

/* ── Unit Tests (Task 6) ── */

describe('Unit tests: getStatusBarConfig', () => {
  // 6.1 SplashScreen always returns style "light" in both light and dark mode
  it('SplashScreen always returns style "light" in both modes', () => {
    const lightConfig = getStatusBarConfig('Splash', 'light', false, lightTheme.colors);
    const darkConfig = getStatusBarConfig('Splash', 'dark', false, darkTheme.colors);
    expect(lightConfig.style).toBe('light');
    expect(darkConfig.style).toBe('light');
  });

  // 6.2 Unknown screen name returns safe fallback config
  it('unknown screen name returns safe fallback config', () => {
    const lightConfig = getStatusBarConfig('NonExistentScreen', 'light', false, lightTheme.colors);
    const darkConfig = getStatusBarConfig('NonExistentScreen', 'dark', false, darkTheme.colors);
    expect(lightConfig.style).toBe('dark');
    expect(lightConfig.backgroundColor).toBe(lightTheme.colors.screenBackground);
    expect(darkConfig.style).toBe('light');
    expect(darkConfig.backgroundColor).toBe(darkTheme.colors.screenBackground);
  });

  // 6.3 Config always returns object with style and backgroundColor string properties
  it('config always returns object with style and backgroundColor string properties', () => {
    for (const screen of ALL_SCREENS) {
      for (const mode of MODES) {
        for (const drawerOpen of [true, false]) {
          const colors = colorsFor(mode);
          const config = getStatusBarConfig(screen, mode, drawerOpen, colors);
          expect(typeof config.style).toBe('string');
          expect(typeof config.backgroundColor).toBe('string');
          expect(['light', 'dark']).toContain(config.style);
        }
      }
    }
  });
});
