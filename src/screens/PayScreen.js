import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const METHODS = [
  { label: 'UPI / Google Pay', icon: 'phone-portrait-outline', color: '#1E4694' },
  { label: 'Credit / Debit Card', icon: 'card-outline', color: '#56B96B' },
  { label: 'Net Banking', icon: 'globe-outline', color: '#F4A940' },
  { label: 'Wallet', icon: 'wallet-outline', color: '#7B61FF' },
];

const PayScreen = ({ navigation }) => (
  <View style={s.safe}>
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.hero}>
        <Text style={s.title}>Pay Bill</Text>
        <Text style={s.sub}>Quick and secure payment</Text>
      </View>
      <View style={s.amountCard}>
        <Text style={s.amountLabel}>Amount Due</Text>
        <Text style={s.amountValue}>₹3,180</Text>
        <Text style={s.amountDue}>Due on 05 Feb 2026</Text>
      </View>
      <Text style={s.sectionTitle}>Payment Methods</Text>
      {METHODS.map((m) => (
        <Pressable key={m.label} style={s.methodCard}>
          <View style={[s.methodIcon, { backgroundColor: m.color + '15' }]}>
            <Ionicons name={m.icon} size={22} color={m.color} />
          </View>
          <Text style={s.methodLabel}>{m.label}</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#8A9BA8" />
        </Pressable>
      ))}
      <Pressable style={s.payBtn}>
        <Text style={s.payBtnText}>Pay ₹3,180</Text>
      </Pressable>
    </ScrollView>
  </View>
);

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EDF2EE' },
  content: { paddingHorizontal: 14, paddingBottom: 200, marginTop: "15%" },
  hero: { backgroundColor: '#EAF0EC', borderRadius: 20, padding: 14, marginTop: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#151515' },
  sub: { fontSize: 13, color: '#5B6973', marginTop: 2 },
  amountCard: { backgroundColor: '#56B96B', borderRadius: 14, padding: 20, marginTop: 12, alignItems: 'center' },
  amountLabel: { color: '#D4F5DD', fontSize: 12 },
  amountValue: { color: '#FFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  amountDue: { color: '#D4F5DD', fontSize: 11, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#151515', marginTop: 18, marginBottom: 8 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  methodIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#151515' },
  payBtn: { backgroundColor: '#1E4694', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default PayScreen;
