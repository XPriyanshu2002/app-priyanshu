/**
 * Lightweight global state for status bar — allows AppRoot (outside DrawerProvider)
 * to react to drawer open/close and active-route changes.
 */
let _listener = null;
let _isDrawerOpen = false;

const statusBarState = {
  setDrawerOpen(open) {
    _isDrawerOpen = open;
    if (_listener) _listener();
  },
  getDrawerOpen() {
    return _isDrawerOpen;
  },
  subscribe(fn) {
    _listener = fn;
    return () => { _listener = null; };
  },
};

module.exports = { statusBarState };
