import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TICKETS = [
  { id: 'TKT-001', subject: 'Meter reading discrepancy', status: 'Open', date: '12 Jan 2026', priority: 'High', color: '#E04635' },
  { id: 'TKT-002', subject: 'Billing query for Dec 2025', status: 'In Progress', date: '08 Jan 2026', priority: 'Medium', color: '#F4A940' },
  { id: 'TKT-003', subject: 'Power outage report', status: 'Resolved', date: '02 Jan 2026', priority: 'High', color: '#56B96B' },
  { id: 'TKT-004', subject: 'New connection request', status: 'Open', date: '28 Dec 2025', priority: 'Low', color: '#E04635' },
  { id: 'TKT-005', subject: 'Voltage fluctuation complaint', status: 'Resolved', date: '20 Dec 2025', priority: 'Medium', color: '#56B96B' },
];

const statusColor = { Open: '#E04635', 'In Progress': '#F4A940', Resolved: '#56B96B' };

const TicketsScreen = ({ navigation }) => (
  <View style={s.safe}>
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.hero}>
        <Text style={s.title}>Support Tickets</Text>
        <Text style={s.sub}>Track your service requests</Text>
      </View>
      <View style={s.statsRow}>
        <View style={[s.stat, { backgroundColor: '#FEE8E6' }]}><Text style={[s.statNum, { color: '#E04635' }]}>2</Text><Text style={s.statLabel}>Open</Text></View>
        <View style={[s.stat, { backgroundColor: '#FFF3E0' }]}><Text style={[s.statNum, { color: '#F4A940' }]}>1</Text><Text style={s.statLabel}>In Progress</Text></View>
        <View style={[s.stat, { backgroundColor: '#E8F5E9' }]}><Text style={[s.statNum, { color: '#56B96B' }]}>2</Text><Text style={s.statLabel}>Resolved</Text></View>
      </View>
      {TICKETS.map((t) => (
        <Pressable key={t.id} style={s.card}>
          <View style={s.cardTop}>
            <Text style={s.cardId}>{t.id}</Text>
            <View style={[s.badge, { backgroundColor: statusColor[t.status] + '20' }]}>
              <Text style={[s.badgeText, { color: statusColor[t.status] }]}>{t.status}</Text>
            </View>
          </View>
          <Text style={s.cardSubject}>{t.subject}</Text>
          <View style={s.cardBottom}>
            <Text style={s.cardDate}>{t.date}</Text>
            <Text style={[s.cardPriority, { color: t.color }]}>● {t.priority}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EDF2EE' },
  content: { paddingHorizontal: 14, paddingBottom: 200, marginTop: "15%" },
  hero: { backgroundColor: '#EAF0EC', borderRadius: 20, padding: 14, marginTop: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#151515' },
  sub: { fontSize: 13, color: '#5B6973', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  stat: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#5B6973', marginTop: 2 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginTop: 10, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardId: { fontSize: 12, fontWeight: '700', color: '#1E4694' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  cardSubject: { fontSize: 14, fontWeight: '600', color: '#151515', marginTop: 6 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardDate: { fontSize: 11, color: '#8A9BA8' },
  cardPriority: { fontSize: 11, fontWeight: '600' },
});

export default TicketsScreen;
