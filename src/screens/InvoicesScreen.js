import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../context/ThemeContext';
import Rings from '../components/Rings';

const INVOICES = [
  { id: 'INV-2026-001', period: 'Jan 2026', amount: '₹3,180', status: 'Unpaid', due: '05 Feb 2026' },
  { id: 'INV-2025-012', period: 'Dec 2025', amount: '₹2,940', status: 'Paid', due: '05 Jan 2026' },
  { id: 'INV-2025-011', period: 'Nov 2025', amount: '₹3,420', status: 'Paid', due: '05 Dec 2025' },
  { id: 'INV-2025-010', period: 'Oct 2025', amount: '₹2,780', status: 'Paid', due: '05 Nov 2025' },
  { id: 'INV-2025-009', period: 'Sep 2025', amount: '₹3,100', status: 'Paid', due: '05 Oct 2025' },
];

const InvoicesScreen = ({ navigation }) => {
  const { theme } = useThemeMode();

  return (
    <View style={[s.safe, { backgroundColor: theme.colors.screenBackground }]}>
      <Rings top="-12%" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          <Text style={[s.title, { color: theme.colors.text }]}>Invoices</Text>
          <Text style={[s.sub, { color: theme.colors.chipText }]}>View and download your invoices</Text>
        </View>
        {INVOICES.map((inv) => {
          const paid = inv.status === 'Paid';
          return (
            <Pressable key={inv.id} style={[s.card, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={s.cardRow}>
                <View style={[s.iconWrap, { backgroundColor: paid ? theme.colors.successMuted : theme.colors.danger + '1A' }]}>
                  <Ionicons name={paid ? 'checkmark-circle-outline' : 'alert-circle-outline'} size={22} color={paid ? theme.colors.success : theme.colors.danger} />
                </View>
                <View style={s.cardText}>
                  <Text style={[s.cardId, { color: theme.colors.text }]}>{inv.id}</Text>
                  <Text style={[s.cardPeriod, { color: theme.colors.textMuted }]}>{inv.period}</Text>
                </View>
                <View style={s.cardRight}>
                  <Text style={[s.cardAmount, { color: theme.colors.text }]}>{inv.amount}</Text>
                  <Text style={[s.cardStatus, { color: paid ? theme.colors.success : theme.colors.danger }]}>{inv.status}</Text>
                </View>
              </View>
              <View style={[s.cardFooter, { borderTopColor: theme.colors.border }]}>
                <Text style={[s.dueLabel, { color: theme.colors.textMuted }]}>Due: {inv.due}</Text>
                <Ionicons name="download-outline" size={16} color={theme.colors.primaryDark} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 14, paddingBottom: 200, marginTop: "25%", backgroundColor: "transparent" },
  hero: { borderRadius: 20, padding: 14, marginTop: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 2 },
  card: { borderRadius: 12, padding: 14, marginTop: 10, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardId: { fontSize: 13, fontWeight: '700' },
  cardPeriod: { fontSize: 11, marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  cardAmount: { fontSize: 16, fontWeight: '700' },
  cardStatus: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
  dueLabel: { fontSize: 11 },
});

export default InvoicesScreen;
