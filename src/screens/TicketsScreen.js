import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../context/ThemeContext';
import Rings from '../components/Rings';

const TICKETS = [
  { id: 'TKT-001', subject: 'Meter reading discrepancy', status: 'Open', date: '12 Jan 2026', priority: 'High' },
  { id: 'TKT-002', subject: 'Billing query for Dec 2025', status: 'In Progress', date: '08 Jan 2026', priority: 'Medium' },
  { id: 'TKT-003', subject: 'Power outage report', status: 'Resolved', date: '02 Jan 2026', priority: 'High' },
  { id: 'TKT-004', subject: 'New connection request', status: 'Open', date: '28 Dec 2025', priority: 'Low' },
  { id: 'TKT-005', subject: 'Voltage fluctuation complaint', status: 'Resolved', date: '20 Dec 2025', priority: 'Medium' },
];

const TicketsScreen = ({ navigation }) => {
  const { theme } = useThemeMode();

  const statusColor = {
    Open: theme.colors.danger,
    'In Progress': theme.colors.warning,
    Resolved: theme.colors.success,
  };

  const priorityColor = {
    High: theme.colors.danger,
    Medium: theme.colors.warning,
    Low: theme.colors.success,
  };

  return (
    <View style={[s.safe, { backgroundColor: theme.colors.screenBackground }]}>
      <Rings top="-12%" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          <Text style={[s.title, { color: theme.colors.text }]}>Support Tickets</Text>
          <Text style={[s.sub, { color: theme.colors.chipText }]}>Track your service requests</Text>
        </View>
        <View style={s.statsRow}>
          <View style={[s.stat, { backgroundColor: theme.colors.danger + '1A' }]}>
            <Text style={[s.statNum, { color: theme.colors.danger }]}>2</Text>
            <Text style={[s.statLabel, { color: theme.colors.chipText }]}>Open</Text>
          </View>
          <View style={[s.stat, { backgroundColor: theme.colors.warning + '20' }]}>
            <Text style={[s.statNum, { color: theme.colors.warning }]}>1</Text>
            <Text style={[s.statLabel, { color: theme.colors.chipText }]}>In Progress</Text>
          </View>
          <View style={[s.stat, { backgroundColor: theme.colors.success + '1A' }]}>
            <Text style={[s.statNum, { color: theme.colors.success }]}>2</Text>
            <Text style={[s.statLabel, { color: theme.colors.chipText }]}>Resolved</Text>
          </View>
        </View>
        {TICKETS.map((t) => (
          <Pressable key={t.id} style={[s.card, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={s.cardTop}>
              <Text style={[s.cardId, { color: theme.colors.primaryDark }]}>{t.id}</Text>
              <View style={[s.badge, { backgroundColor: statusColor[t.status] + '20' }]}>
                <Text style={[s.badgeText, { color: statusColor[t.status] }]}>{t.status}</Text>
              </View>
            </View>
            <Text style={[s.cardSubject, { color: theme.colors.text }]}>{t.subject}</Text>
            <View style={s.cardBottom}>
              <Text style={[s.cardDate, { color: theme.colors.textMuted }]}>{t.date}</Text>
              <Text style={[s.cardPriority, { color: priorityColor[t.priority] }]}>● {t.priority}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 14, paddingBottom: 200, marginTop: "25%" },
  hero: { borderRadius: 20, padding: 14, marginTop: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  stat: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, marginTop: 2 },
  card: { borderRadius: 12, padding: 14, marginTop: 10, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardId: { fontSize: 12, fontWeight: '700' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  cardSubject: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardDate: { fontSize: 11 },
  cardPriority: { fontSize: 11, fontWeight: '600' },
});

export default TicketsScreen;
