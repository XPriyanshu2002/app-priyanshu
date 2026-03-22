import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import SplashScreen from './screens/SplashScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppGate = () => {
  const { theme, mode, isReady } = useThemeMode();

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer
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
    </SafeAreaView>
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
