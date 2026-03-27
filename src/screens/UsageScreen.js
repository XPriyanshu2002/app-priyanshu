import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../context/ThemeContext';
import Rings from '../components/Rings';

const USAGE_DATA = [
  { month: 'Jan 2026', kwh: 542, cost: '₹2,710' },
  { month: 'Feb 2026', kwh: 618, cost: '₹3,090' },
  { month: 'Mar 2026', kwh: 580, cost: '₹2,900' },
  { month: 'Apr 2026', kwh: 495, cost: '₹2,475' },
  { month: 'May 2026', kwh: 670, cost: '₹3,350' },
];

const UsageScreen = ({ navigation }) => {
  const { theme } = useThemeMode();

  return (
    <View style={[s.safe, { backgroundColor: theme.colors.screenBackground }]}>
      <Rings top="-12%" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          <Text style={[s.title, { color: theme.colors.text }]}>Usage History</Text>
          <Text style={[s.sub, { color: theme.colors.chipText }]}>Your monthly energy consumption</Text>
        </View>
        <View style={s.summaryRow}>
          <View style={[s.summaryCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Ionicons name="flash-outline" size={20} color={theme.colors.primaryDark} />
            <Text style={[s.summaryValue, { color: theme.colors.text }]}>581 kWh</Text>
            <Text style={[s.summaryLabel, { color: theme.colors.textMuted }]}>Avg Monthly</Text>
          </View>
          <View style={[s.summaryCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Ionicons name="trending-down-outline" size={20} color={theme.colors.success} />
            <Text style={[s.summaryValue, { color: theme.colors.text }]}>12%</Text>
            <Text style={[s.summaryLabel, { color: theme.colors.textMuted }]}>vs Last Year</Text>
          </View>
        </View>
        {USAGE_DATA.map((item) => (
          <View key={item.month} style={[s.row, { backgroundColor: theme.colors.cardBackground }]}>
            <View>
              <Text style={[s.rowMonth, { color: theme.colors.text }]}>{item.month}</Text>
              <Text style={[s.rowKwh, { color: theme.colors.chipText }]}>{item.kwh} kWh</Text>
            </View>
            <Text style={[s.rowCost, { color: theme.colors.primaryDark }]}>{item.cost}</Text>
          </View>
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
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 11 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, padding: 14, marginTop: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  rowMonth: { fontSize: 14, fontWeight: '600' },
  rowKwh: { fontSize: 12, marginTop: 2 },
  rowCost: { fontSize: 16, fontWeight: '700' },
});

export default UsageScreen;
