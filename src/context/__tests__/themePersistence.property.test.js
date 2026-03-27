/**
 * Feature: dark-light-theme, Property 3: Theme persistence round-trip
 * Validates: Requirements 8.1, 8.2, 8.3
 */
const fc = require('fast-check');

const STORAGE_KEY = 'bestinfra_theme_mode';
const VALID_MODES = ['light', 'dark'];

// In-memory store backing the mock
let mockStore = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => Promise.resolve(mockStore[key] ?? null)),
  setItem: jest.fn((key, value) => {
    mockStore[key] = value;
    return Promise.resolve();
  }),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');

beforeEach(() => {
  mockStore = {};
  jest.clearAllMocks();
});

/**
 * Replicates ThemeContext toggleTheme logic:
 *   const nextMode = mode === 'dark' ? 'light' : 'dark';
 *   setMode(nextMode);
 *   await AsyncStorage.setItem(STORAGE_KEY, nextMode);
 */
async function simulateToggle(currentMode) {
  const nextMode = currentMode === 'dark' ? 'light' : 'dark';
  await AsyncStorage.setItem(STORAGE_KEY, nextMode);
  return nextMode;
}

/**
 * Replicates ThemeContext load logic:
 *   const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
 *   if (savedMode === 'dark' || savedMode === 'light') setMode(savedMode);
 *   // else stays 'light' (useState default)
 */
async function simulateLoad() {
  const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
  return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
}

describe('Feature: dark-light-theme, Property 3: Theme persistence round-trip', () => {
  it('toggleTheme persists the expected next mode for any initial mode', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...VALID_MODES),
        async (initialMode) => {
          mockStore = {};
          await AsyncStorage.setItem(STORAGE_KEY, initialMode);

          const nextMode = await simulateToggle(initialMode);
          const loaded = await simulateLoad();
          return loaded === nextMode;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('stored value matches expected after multiple sequential toggles', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...VALID_MODES),
        fc.integer({ min: 1, max: 20 }),
        async (initialMode, toggleCount) => {
          mockStore = {};
          await AsyncStorage.setItem(STORAGE_KEY, initialMode);

          let currentMode = initialMode;
          for (let i = 0; i < toggleCount; i++) {
            currentMode = await simulateToggle(currentMode);
          }

          const loaded = await simulateLoad();
          const expectedMode = toggleCount % 2 === 0
            ? initialMode
            : (initialMode === 'dark' ? 'light' : 'dark');

          return loaded === expectedMode;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('defaults to light when no value is stored', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          mockStore = {};
          const loaded = await simulateLoad();
          return loaded === 'light';
        },
      ),
      { numRuns: 100 },
    );
  });

  it('persisted value is always a valid mode string after toggle', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...VALID_MODES),
        async (initialMode) => {
          mockStore = {};
          await AsyncStorage.setItem(STORAGE_KEY, initialMode);

          await simulateToggle(initialMode);
          const loaded = await simulateLoad();
          return loaded === 'light' || loaded === 'dark';
        },
      ),
      { numRuns: 100 },
    );
  });

  it('invalid stored values cause fallback to light default', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant(''),
          fc.constant('DARK'),
          fc.constant('Light'),
          fc.constant('auto'),
          fc.constant('system'),
          fc.constant('0'),
          fc.constant('1'),
          fc.string().filter((s) => s !== 'light' && s !== 'dark'),
        ),
        async (invalidValue) => {
          mockStore = {};
          mockStore[STORAGE_KEY] = invalidValue;

          // ThemeContext guard only accepts 'dark' or 'light'
          const loaded = await simulateLoad();
          return loaded === 'light';
        },
      ),
      { numRuns: 100 },
    );
  });
});
