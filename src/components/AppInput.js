import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useThemeMode } from '../context/ThemeContext';

const AppInput = ({ label, error, style, ...props }) => {
  const { theme } = useThemeMode();

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textMuted}
        {...props}
      />
      {!!error && <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  error: {
    fontSize: 12,
  },
});

export default AppInput;
