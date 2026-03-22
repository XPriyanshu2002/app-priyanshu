import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INVOICES = [
  { id: 'INV-2026-001', period: 'Jan 2026', amount: '₹3,180', status: 'Unpaid', due: '05 Feb 2026' },
  { id: 'INV-2025-012', period: 'Dec 2025', amount: '₹2,940', status: 'Paid', due: '05 Jan 2026' },
  { id: 'INV-2025-011', period: 'Nov 2025', amount: '₹3,420', status: 'Paid', due: '05 Dec 2025' },
  { id: 'INV-2025-010', period: 'Oct 2025', amount: '₹2,780', status: 'Paid', due: '05 Nov 2025' },
  { id: 'INV-2025-009', period: 'Sep 2025', amount: '₹3,100', status: 'Paid', due: '05 Oct 2025' },
];

const InvoicesScreen = ({ navigation }) => (
  <View style={s.safe}>
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.hero}>
        <Text style={s.title}>Invoices</Text>
        <Text style={s.sub}>View and download your invoices</Text>
      </View>
      {INVOICES.map((inv) => {
        const paid = inv.status === 'Paid';
        return (
          <Pressable key={inv.id} style={s.card}>
            <View style={s.cardRow}>
              <View style={[s.iconWrap, { backgroundColor: paid ? '#E8F5E9' : '#FEE8E6' }]}>
                <Ionicons name={paid ? 'checkmark-circle-outline' : 'alert-circle-outline'} size={22} color={paid ? '#56B96B' : '#E04635'} />
              </View>
              <View style={s.cardText}>
                <Text style={s.cardId}>{inv.id}</Text>
                <Text style={s.cardPeriod}>{inv.period}</Text>
              </View>
              <View style={s.cardRight}>
                <Text style={s.cardAmount}>{inv.amount}</Text>
                <Text style={[s.cardStatus, { color: paid ? '#56B96B' : '#E04635' }]}>{inv.status}</Text>
              </View>
            </View>
            <View style={s.cardFooter}>
              <Text style={s.dueLabel}>Due: {inv.due}</Text>
              <Ionicons name="download-outline" size={16} color="#1E4694" />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  </View>
);

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EDF2EE', },
  content: { paddingHorizontal: 14, paddingBottom: 200,  marginTop: "15%" },
  hero: { backgroundColor: '#EAF0EC', borderRadius: 20, padding: 14, marginTop: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#151515' },
  sub: { fontSize: 13, color: '#5B6973', marginTop: 2 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginTop: 10, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardId: { fontSize: 13, fontWeight: '700', color: '#151515' },
  cardPeriod: { fontSize: 11, color: '#8A9BA8', marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  cardAmount: { fontSize: 16, fontWeight: '700', color: '#151515' },
  cardStatus: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F2F4' },
  dueLabel: { fontSize: 11, color: '#8A9BA8' },
});

export default InvoicesScreen;
