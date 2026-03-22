import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useThemeMode } from '../context/ThemeContext';

const AppButton = ({ title, onPress, variant = 'primary', loading = false, disabled = false }) => {
  const { theme } = useThemeMode();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.colors.primary : theme.colors.surface,
          borderColor: isPrimary ? theme.colors.primary : theme.colors.border,
          opacity: pressed || disabled ? 0.8 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : theme.colors.primary} />
      ) : (
        <Text
          style={{
            color: isPrimary ? '#FFFFFF' : theme.colors.text,
            fontWeight: '700',
            fontSize: 15,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
});

export default AppButton;
