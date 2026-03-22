import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeMode } from '../context/ThemeContext';

const ScreenContainer = ({ children, scroll = true, style, contentContainerStyle }) => {
  const { theme } = useThemeMode();

  if (!scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }, style]}>
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }, style]}>
      <ScrollView contentContainerStyle={[styles.content, contentContainerStyle]}>{children}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
});

export default ScreenContainer;
