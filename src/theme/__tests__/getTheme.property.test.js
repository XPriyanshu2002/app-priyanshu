/**
 * Feature: dark-light-theme, Property 2: getTheme mode dispatch
 * Validates: Requirements 2.2, 7.2
 */
const fc = require('fast-check');
const { getTheme, lightTheme, darkTheme } = require('../tokens');

const VALID_MODES = ['light', 'dark'];

const ALL_COLOR_KEYS = [
  'background', 'surface', 'text', 'textMuted',
  'border', 'primary', 'accent', 'danger',
  'primaryDark', 'cardBackground', 'success', 'successMuted', 'warning',
  'tabActive', 'tabInactive', 'tabIconActive', 'tabIconInactive', 'tabLabel',
  'drawerBackground', 'drawerSurface', 'drawerText', 'drawerTextActive',
  'headerButton', 'headerIcon', 'heroBackground', 'screenBackground',
  'settingsBackground', 'settingsCard', 'settingsText', 'settingsTextMuted',
  'settingsIcon', 'settingsChevron', 'inputBackground', 'inputText',
  'inputPlaceholder', 'ringBorder', 'skeletonBase', 'chipBackground',
  'chipText', 'chartBarOuter', 'progressBackground', 'notificationCardBg',
  'badgeBackground', 'onboardingText', 'loginCardBg',
];

describe('Feature: dark-light-theme, Property 2: getTheme mode dispatch', () => {
  it('getTheme(mode) returns a theme with matching mode property and complete colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_MODES),
        (mode) => {
          const theme = getTheme(mode);

          // mode property matches input
          if (theme.mode !== mode) return false;

          // colors object exists
          if (!theme.colors || typeof theme.colors !== 'object') return false;

          // all required color keys present with non-empty string values
          return ALL_COLOR_KEYS.every((key) => {
            const val = theme.colors[key];
            return typeof val === 'string' && val.length > 0;
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  it('light and dark themes differ in at least one color value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_MODES),
        () => {
          const light = getTheme('light');
          const dark = getTheme('dark');

          const hasDifference = ALL_COLOR_KEYS.some(
            (key) => light.colors[key] !== dark.colors[key],
          );

          return hasDifference;
        },
      ),
      { numRuns: 100 },
    );
  });
});
