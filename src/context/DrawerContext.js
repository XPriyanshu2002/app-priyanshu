import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const DrawerContext = createContext(null);

export const DrawerProvider = ({ children }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Home');

  /* ── bestInfra pattern: single useEffect drives the spring ── */
  useEffect(() => {
    Animated.spring(progress, {
      toValue: isOpen ? 1 : 0,
      damping: isOpen ? 24 : 26,
      stiffness: isOpen ? 210 : 240,
      mass: 0.9,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
      useNativeDriver: true,
    }).start();
  }, [progress, isOpen]);

  const openDrawer = useCallback((screen) => {
    if (screen) setActiveScreen(screen);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback((cb) => {
    if (cb) cb();
    setIsOpen(false);
  }, []);

  return (
    <DrawerContext.Provider value={{ progress, isOpen, activeScreen, setActiveScreen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => useContext(DrawerContext);
