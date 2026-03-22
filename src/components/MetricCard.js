import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeMode } from '../context/ThemeContext';

const MetricCard = ({ title, value, subtitle }) => {
  const { theme } = useThemeMode();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.textMuted }]}>{title}</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      {!!subtitle && <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minWidth: '48%',
    flex: 1,
  },
  title: {
    fontSize: 13,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default MetricCard;
