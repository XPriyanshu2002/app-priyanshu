import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const USAGE_DATA = [
  { month: 'Jan 2026', kwh: 542, cost: '₹2,710' },
  { month: 'Feb 2026', kwh: 618, cost: '₹3,090' },
  { month: 'Mar 2026', kwh: 580, cost: '₹2,900' },
  { month: 'Apr 2026', kwh: 495, cost: '₹2,475' },
  { month: 'May 2026', kwh: 670, cost: '₹3,350' },
];

const UsageScreen = ({ navigation }) => (
  <View style={s.safe}>
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.hero}>
        <Text style={s.title}>Usage History</Text>
        <Text style={s.sub}>Your monthly energy consumption</Text>
      </View>
      <View style={s.summaryRow}>
        <View style={s.summaryCard}>
          <Ionicons name="flash-outline" size={20} color="#1E4694" />
          <Text style={s.summaryValue}>581 kWh</Text>
          <Text style={s.summaryLabel}>Avg Monthly</Text>
        </View>
        <View style={s.summaryCard}>
          <Ionicons name="trending-down-outline" size={20} color="#56B96B" />
          <Text style={s.summaryValue}>12%</Text>
          <Text style={s.summaryLabel}>vs Last Year</Text>
        </View>
      </View>
      {USAGE_DATA.map((item) => (
        <View key={item.month} style={s.row}>
          <View>
            <Text style={s.rowMonth}>{item.month}</Text>
            <Text style={s.rowKwh}>{item.kwh} kWh</Text>
          </View>
          <Text style={s.rowCost}>{item.cost}</Text>
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
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  summaryCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 14, alignItems: 'center', gap: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  summaryValue: { fontSize: 20, fontWeight: '800', color: '#151515' },
  summaryLabel: { fontSize: 11, color: '#8A9BA8' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, padding: 14, marginTop: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  rowMonth: { fontSize: 14, fontWeight: '600', color: '#151515' },
  rowKwh: { fontSize: 12, color: '#5B6973', marginTop: 2 },
  rowCost: { fontSize: 16, fontWeight: '700', color: '#1E4694' },
});

export default UsageScreen;
