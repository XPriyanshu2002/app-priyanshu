import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeMode } from '../context/ThemeContext';
import { formatDateTime } from '../utils/formatters';

const TYPE_LABELS = {
  BILL_DUE: 'Bill Due Reminder',
  PAYMENT_CONFIRMATION: 'Payment Confirmation',
  LOW_BALANCE: 'Low Balance Alert',
  SYSTEM_ALERT: 'System Alert',
  TICKET_UPDATE: 'Ticket Update',
};

const toReadableType = (type) => {
  if (TYPE_LABELS[type]) {
    return TYPE_LABELS[type];
  }

  if (!type) {
    return 'Notification';
  }

  return String(type)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const NotificationCard = ({ title, description, type, createdAt }) => {
  const { theme } = useThemeMode();

  return (
    <View style={[styles.card, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
      <View style={styles.row}>
        <Text style={[styles.type, { color: theme.colors.primary }]}>{toReadableType(type)}</Text>
        <Text style={[styles.date, { color: theme.colors.textMuted }]}>{formatDateTime(createdAt)}</Text>
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.colors.textMuted }]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  type: {
    fontWeight: '700',
    fontSize: 12,
  },
  date: {
    fontSize: 11,
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default NotificationCard;
