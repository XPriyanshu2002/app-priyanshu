import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../context/ThemeContext';
import Rings from '../components/Rings';

const PayScreen = ({ navigation }) => {
  const { theme } = useThemeMode();

  const methods = [
    { label: 'UPI / Google Pay', icon: 'phone-portrait-outline', color: theme.colors.primaryDark },
    { label: 'Credit / Debit Card', icon: 'card-outline', color: theme.colors.success },
    { label: 'Net Banking', icon: 'globe-outline', color: theme.colors.warning },
    { label: 'Wallet', icon: 'wallet-outline', color: '#7B61FF' }, // intentionally static brand purple
  ];

  return (
    <View style={[s.safe, { backgroundColor: theme.colors.screenBackground }]}>
      <Rings top="-12%" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          <Text style={[s.title, { color: theme.colors.text }]}>Pay Bill</Text>
          <Text style={[s.sub, { color: theme.colors.chipText }]}>Quick and secure payment</Text>
        </View>
        <View style={[s.amountCard, { backgroundColor: theme.colors.success }]}>
          <Text style={[s.amountLabel, { color: theme.colors.successMuted }]}>Amount Due</Text>
          <Text style={s.amountValue}>₹3,180</Text>
          <Text style={[s.amountDue, { color: theme.colors.successMuted }]}>Due on 05 Feb 2026</Text>
        </View>
        <Text style={[s.sectionTitle, { color: theme.colors.text }]}>Payment Methods</Text>
        {methods.map((m) => (
          <Pressable key={m.label} style={[s.methodCard, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={[s.methodIcon, { backgroundColor: m.color + '15' }]}>
              <Ionicons name={m.icon} size={22} color={m.color} />
            </View>
            <Text style={[s.methodLabel, { color: theme.colors.text }]}>{m.label}</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={theme.colors.textMuted} />
          </Pressable>
        ))}
        <Pressable style={[s.payBtn, { backgroundColor: theme.colors.primaryDark }]}>
          <Text style={s.payBtnText}>Pay ₹3,180</Text>
        </Pressable>
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
  amountCard: { borderRadius: 14, padding: 20, marginTop: 12, alignItems: 'center' },
  amountLabel: { fontSize: 12 },
  amountValue: { color: '#FFF', fontSize: 32, fontWeight: '800', marginTop: 4 }, // intentionally static white on success bg
  amountDue: { fontSize: 11, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 18, marginBottom: 8 },
  methodCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  methodIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  payBtn: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }, // intentionally static white on primary bg
});

export default PayScreen;
