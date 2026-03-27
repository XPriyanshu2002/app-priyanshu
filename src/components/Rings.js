import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';

const RING_SIZES = [150, 215, 280, 345, 410, 475];

const Rings = ({ top = -220 }) => {
  const { theme } = useThemeMode();

  return (
    <View style={[styles.container, { top }]} pointerEvents="none">
      {RING_SIZES.map((size) => (
        <View key={size} style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: theme.colors.ringBorder }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 345,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
});

export default Rings;
