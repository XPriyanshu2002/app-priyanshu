import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { useThemeMode } from '../context/ThemeContext';
import Rings from '../components/Rings';

const REPORTS = [
  { title: 'Monthly Consumption Report', period: 'Jan 2026', icon: 'bar-chart-outline', color: '#1E4694' },
  { title: 'Billing Summary', period: 'Q4 2025', icon: 'document-text-outline', color: '#56B96B' },
  { title: 'Peak Usage Analysis', period: 'Dec 2025', icon: 'trending-up-outline', color: '#F4A940' },
  { title: 'Annual Energy Report', period: '2025', icon: 'analytics-outline', color: '#7B61FF' },
  { title: 'Comparison Report', period: 'Nov-Dec 2025', icon: 'swap-horizontal-outline', color: '#E04635' },
];

const ReportsScreen = ({ navigation }) => {
  const { theme } = useThemeMode();

  return (
    <View style={[s.safe, { backgroundColor: theme.colors.screenBackground }]}>
      <Rings top="-12%" />
      {/* <AppHeader navigation={navigation} rightIcon="download-outline" screenName="Reports" /> */}
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          <Text style={[s.title, { color: theme.colors.text }]}>Reports</Text>
          <Text style={[s.sub, { color: theme.colors.chipText }]}>Download and view your reports</Text>
        </View>
        {REPORTS.map((r) => (
          <Pressable key={r.title} style={[s.card, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={[s.iconWrap, { backgroundColor: r.color + '18' }]}>
              <Ionicons name={r.icon} size={22} color={r.color} />
            </View>
            <View style={s.cardText}>
              <Text style={[s.cardTitle, { color: theme.colors.text }]}>{r.title}</Text>
              <Text style={[s.cardPeriod, { color: theme.colors.textMuted }]}>{r.period}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color={theme.colors.textMuted} />
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
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginTop: 10, gap: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600' },
  cardPeriod: { fontSize: 11, marginTop: 2 },
});

export default ReportsScreen;
