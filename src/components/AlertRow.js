import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeMode } from '../context/ThemeContext';

const AlertRow = ({ serial, meterSerialNumber, consumerName, message }) => {
  const { theme } = useThemeMode();

  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}> 
      <Text style={[styles.cellSerial, { color: theme.colors.text }]}>{serial}</Text>
      <Text style={[styles.cell, { color: theme.colors.text }]}>{meterSerialNumber}</Text>
      <Text style={[styles.cell, { color: theme.colors.text }]}>{consumerName}</Text>
      <Text style={[styles.cellWide, { color: theme.colors.textMuted }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  cellSerial: {
    width: 36,
    fontSize: 12,
    fontWeight: '600',
  },
  cell: {
    flex: 1,
    fontSize: 12,
    paddingRight: 6,
  },
  cellWide: {
    flex: 1.2,
    fontSize: 12,
  },
});

export default AlertRow;
