import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import SplashScreen from './screens/SplashScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStatusBarConfig } from './utils/statusBarConfig';
import { statusBarState } from './utils/statusBarState';
import { View } from 'react-native';

/**
 * Extract the deepest focused route name from React Navigation state.
 */
const getActiveRouteName = (state) => {
  if (!state) return null;
  const route = state.routes[state.index];
  if (route.state) return getActiveRouteName(route.state);
  return route.name;
};

const AppGate = () => {
  const { theme, mode, isReady } = useThemeMode();
  const navigationRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState('Home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    return statusBarState.subscribe(() => {
      setDrawerOpen(statusBarState.getDrawerOpen());
    });
  }, []);

  const onStateChange = useCallback((state) => {
    const routeName = getActiveRouteName(state);
    if (routeName) setActiveRoute(routeName);
  }, []);

  const statusBarConfig = getStatusBarConfig(activeRoute, mode, drawerOpen, theme.colors);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={statusBarConfig.style} translucent backgroundColor="transparent" />
      <NavigationContainer
        ref={navigationRef}
        onStateChange={onStateChange}
        theme={{
          dark: mode === 'dark',
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.accent,
          },
          fonts: {
            regular: { fontFamily: 'System', fontWeight: '400' },
            medium: { fontFamily: 'System', fontWeight: '500' },
            bold: { fontFamily: 'System', fontWeight: '700' },
            heavy: { fontFamily: 'System', fontWeight: '800' },
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
};

const AppRoot = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  </ThemeProvider>
);

export default AppRoot;
