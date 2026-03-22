import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const PAYMENTS = [
  { id: 'TXN-20260115', date: '15 Jan 2026', amount: '₹3,180', status: 'Paid', color: '#56B96B' },
  { id: 'TXN-20251215', date: '15 Dec 2025', amount: '₹2,940', status: 'Paid', color: '#56B96B' },
  { id: 'TXN-20251115', date: '15 Nov 2025', amount: '₹3,420', status: 'Paid', color: '#56B96B' },
  { id: 'TXN-20251015', date: '15 Oct 2025', amount: '₹2,780', status: 'Failed', color: '#E04635' },
  { id: 'TXN-20250915', date: '15 Sep 2025', amount: '₹3,100', status: 'Paid', color: '#56B96B' },
];

const PaymentsScreen = ({ navigation }) => (
  <View style={s.safe}>
    {/* <AppHeader navigation={navigation} rightIcon="card-outline" screenName="Payments" /> */}
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.hero}>
        <Text style={s.title}>Payments</Text>
        <Text style={s.sub}>Transaction history</Text>
      </View>
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Outstanding Balance</Text>
        <Text style={s.balanceAmount}>₹3,180</Text>
        <View style={s.dueBadge}>
          <Ionicons name="time-outline" size={12} color="#FFF" />
          <Text style={s.dueText}>Due on 05 Feb 2026</Text>
        </View>
      </View>
      <Text style={s.sectionTitle}>Recent Transactions</Text>
      {PAYMENTS.map((p) => (
        <View key={p.id} style={s.row}>
          <View style={s.rowLeft}>
            <Text style={s.rowId}>{p.id}</Text>
            <Text style={s.rowDate}>{p.date}</Text>
          </View>
          <View style={s.rowRight}>
            <Text style={s.rowAmount}>{p.amount}</Text>
            <Text style={[s.rowStatus, { color: p.color }]}>{p.status}</Text>
          </View>
        </View>
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
  balanceCard: { backgroundColor: '#1E4694', borderRadius: 14, padding: 18, marginTop: 12, alignItems: 'center' },
  balanceLabel: { color: '#C8D8FF', fontSize: 12 },
  balanceAmount: { color: '#FFF', fontSize: 28, fontWeight: '800', marginTop: 4 },
  dueBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  dueText: { color: '#FFF', fontSize: 11, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#151515', marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  rowLeft: {},
  rowId: { fontSize: 13, fontWeight: '600', color: '#151515' },
  rowDate: { fontSize: 11, color: '#8A9BA8', marginTop: 2 },
  rowRight: { alignItems: 'flex-end' },
  rowAmount: { fontSize: 15, fontWeight: '700', color: '#151515' },
  rowStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
});

export default PaymentsScreen;
