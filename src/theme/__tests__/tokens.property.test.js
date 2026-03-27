/**
 * Feature: dark-light-theme, Property 1: Theme token symmetry and completeness
 * Validates: Requirements 1.1, 1.2
 */
const fc = require('fast-check');
const { lightTheme, darkTheme } = require('../tokens');

const BASE_ROLES = [
  'background', 'surface', 'text', 'textMuted',
  'border', 'primary', 'accent', 'danger',
];

const EXTENDED_ROLES = [
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

const ALL_ROLES = [...BASE_ROLES, ...EXTENDED_ROLES];

describe('Feature: dark-light-theme, Property 1: Theme token symmetry and completeness', () => {
  const lightKeys = Object.keys(lightTheme.colors);
  const darkKeys = Object.keys(darkTheme.colors);

  it('lightTheme and darkTheme have identical key sets', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...lightKeys),
        (key) => darkKeys.includes(key),
      ),
      { numRuns: 100 },
    );

    fc.assert(
      fc.property(
        fc.constantFrom(...darkKeys),
        (key) => lightKeys.includes(key),
      ),
      { numRuns: 100 },
    );
  });

  it('every color value in both themes is a non-empty string', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_ROLES),
        (role) => {
          const lightVal = lightTheme.colors[role];
          const darkVal = darkTheme.colors[role];
          return (
            typeof lightVal === 'string' && lightVal.length > 0 &&
            typeof darkVal === 'string' && darkVal.length > 0
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it('all 8 base roles are present in both themes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...BASE_ROLES),
        (role) => {
          return (
            role in lightTheme.colors &&
            role in darkTheme.colors
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it('all extended roles are present in both themes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...EXTENDED_ROLES),
        (role) => {
          return (
            role in lightTheme.colors &&
            role in darkTheme.colors
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it('randomly sampled subsets of keys exist in both themes with valid values', () => {
    fc.assert(
      fc.property(
        fc.subarray(ALL_ROLES, { minLength: 1 }),
        (subset) => {
          return subset.every((role) => {
            const lv = lightTheme.colors[role];
            const dv = darkTheme.colors[role];
            return (
              typeof lv === 'string' && lv.length > 0 &&
              typeof dv === 'string' && dv.length > 0
            );
          });
        },
      ),
      { numRuns: 100 },
    );
  });
});
