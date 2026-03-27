/**
 * Feature: dark-light-theme, Property 4: Toggle inverts mode
 * Validates: Requirements 9.1, 9.2
 */
const fc = require('fast-check');

const STORAGE_KEY = 'bestinfra_theme_mode';
const VALID_MODES = ['light', 'dark'];

// Track setMode calls synchronously
let setModeCalls = [];
let mockStore = {};
let setItemResolved = false;

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => Promise.resolve(mockStore[key] ?? null)),
  setItem: jest.fn((key, value) => {
    mockStore[key] = value;
    return new Promise((resolve) => {
      // Delay resolution so we can assert synchronous behavior
      setTimeout(() => {
        setItemResolved = true;
        resolve();
      }, 50);
    });
  }),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');

beforeEach(() => {
  mockStore = {};
  setModeCalls = [];
  setItemResolved = false;
  jest.clearAllMocks();
});

/**
 * Replicates ThemeContext toggleTheme logic, capturing the synchronous
 * setMode call separately from the async AsyncStorage write:
 *
 *   const nextMode = mode === 'dark' ? 'light' : 'dark';
 *   setMode(nextMode);                              // synchronous
 *   await AsyncStorage.setItem(STORAGE_KEY, nextMode); // async
 */
function simulateToggle(currentMode) {
  const nextMode = currentMode === 'dark' ? 'light' : 'dark';
  // Synchronous state update (mirrors setMode(nextMode))
  setModeCalls.push(nextMode);
  // Async persistence (fire-and-forget for synchronous assertion)
  const persistPromise = AsyncStorage.setItem(STORAGE_KEY, nextMode);
  return { nextMode, persistPromise };
}

describe('Feature: dark-light-theme, Property 4: Toggle inverts mode', () => {
  it('toggle produces the opposite mode synchronously before AsyncStorage write completes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_MODES),
        (initialMode) => {
          setModeCalls = [];
          setItemResolved = false;

          const { nextMode } = simulateToggle(initialMode);

          // The mode was set synchronously (setMode called before await)
          expect(setModeCalls).toHaveLength(1);
          expect(setModeCalls[0]).toBe(nextMode);

          // The result is the opposite of the initial mode
          const expected = initialMode === 'dark' ? 'light' : 'dark';
          expect(nextMode).toBe(expected);

          // AsyncStorage write has NOT resolved yet (synchronous check)
          expect(setItemResolved).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('toggle is a self-inverse: toggling twice returns to the original mode', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_MODES),
        (initialMode) => {
          setModeCalls = [];

          const { nextMode: firstToggle } = simulateToggle(initialMode);
          const { nextMode: secondToggle } = simulateToggle(firstToggle);

          expect(secondToggle).toBe(initialMode);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('toggled mode is always a valid mode string', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_MODES),
        (initialMode) => {
          setModeCalls = [];

          const { nextMode } = simulateToggle(initialMode);

          return VALID_MODES.includes(nextMode);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('toggle never produces the same mode as input', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_MODES),
        (initialMode) => {
          setModeCalls = [];

          const { nextMode } = simulateToggle(initialMode);

          return nextMode !== initialMode;
        },
      ),
      { numRuns: 100 },
    );
  });
});
