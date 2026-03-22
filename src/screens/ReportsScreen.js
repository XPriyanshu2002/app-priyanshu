import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

const REPORTS = [
  { title: 'Monthly Consumption Report', period: 'Jan 2026', icon: 'bar-chart-outline', color: '#1E4694' },
  { title: 'Billing Summary', period: 'Q4 2025', icon: 'document-text-outline', color: '#56B96B' },
  { title: 'Peak Usage Analysis', period: 'Dec 2025', icon: 'trending-up-outline', color: '#F4A940' },
  { title: 'Annual Energy Report', period: '2025', icon: 'analytics-outline', color: '#7B61FF' },
  { title: 'Comparison Report', period: 'Nov-Dec 2025', icon: 'swap-horizontal-outline', color: '#E04635' },
];

const ReportsScreen = ({ navigation }) => (
  <View style={s.safe}>
    {/* <AppHeader navigation={navigation} rightIcon="download-outline" screenName="Reports" /> */}
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.hero}>
        <Text style={s.title}>Reports</Text>
        <Text style={s.sub}>Download and view your reports</Text>
      </View>
      {REPORTS.map((r) => (
        <Pressable key={r.title} style={s.card}>
          <View style={[s.iconWrap, { backgroundColor: r.color + '18' }]}>
            <Ionicons name={r.icon} size={22} color={r.color} />
          </View>
          <View style={s.cardText}>
            <Text style={s.cardTitle}>{r.title}</Text>
            <Text style={s.cardPeriod}>{r.period}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#8A9BA8" />
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginTop: 10, gap: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#151515' },
  cardPeriod: { fontSize: 11, color: '#8A9BA8', marginTop: 2 },
});

export default ReportsScreen;
