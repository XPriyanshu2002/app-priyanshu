import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-gifted-charts';

import { useAuth } from '../context/AuthContext';
import * as dashboardService from '../services/dashboardService';
import { formatCurrency } from '../utils/formatters';

const { width: SW } = Dimensions.get('window');
const TIME_FILTERS = ['7D', '30D', '90D', '1Y'];
const CHART_MODES = ['Bar', 'Line'];

const FALLBACK_USAGE = [
  { label: 'Jan', value: 55 }, { label: 'Feb', value: 62 }, { label: 'Mar', value: 58 },
  { label: 'Apr', value: 70 }, { label: 'May', value: 80 }, { label: 'Jun', value: 75 },
  { label: 'Jul', value: 90 }, { label: 'Aug', value: 65 }, { label: 'Sep', value: 85 },
  { label: 'Oct', value: 80 },
];
const FALLBACK_ALERTS = [
  { id: 1, meterSerialNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
  { id: 2, meterSerialNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
  { id: 3, meterSerialNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
];
const FALLBACK = {
  dueAmount: 3180, dueDate: '2026-02-05',
  monthlyUsage: FALLBACK_USAGE, alerts: FALLBACK_ALERTS,
};

const normalizeUsage = (usage) => {
  if (!Array.isArray(usage) || usage.length === 0) return FALLBACK_USAGE;
  return usage.map((e, i) => ({ label: e?.label || `P${i + 1}`, value: Number(e?.value || 0) }));
};

const abbreviateDate = (raw) => {
  if (!raw) return '05 Feb 2026';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '05 Feb 2026';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* Skeleton placeholder */
const Skeleton = ({ width: w, height: h, style, borderRadius: br }) => {
  const pulse = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.8, duration: 700, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [pulse]);
  return <Animated.View style={[{ width: w, height: h, borderRadius: br ?? 4, backgroundColor: '#E4EAF0', opacity: pulse }, style]} />;
};

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('1Y');
  const [switching, setSwitching] = useState(false);
  const [dashboard, setDashboard] = useState(FALLBACK);
  const [chartMode, setChartMode] = useState('Bar');
  const [chartDropOpen, setChartDropOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const entrance = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [entrance]);

  const loadDashboard = useCallback(async (range) => {
    /* Phase 1: fade out content smoothly */
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 6, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      /* Phase 2: show skeletons only after content is fully invisible */
      setSwitching(true);
    });
    try {
      const data = await dashboardService.getDashboard(range);
      setDashboard(data);
    } catch (_) { /* keep fallback */ }
    /* Phase 3: after data settles, hide skeletons and fade content back */
    setTimeout(() => {
      setSwitching(false);
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: 320, useNativeDriver: true }),
      ]).start();
    }, 450);
  }, [contentOpacity, contentSlide]);

  useFocusEffect(useCallback(() => { loadDashboard(timeRange); }, [loadDashboard, timeRange]));

  const handleFilterPress = (f) => {
    if (f === timeRange || switching) return;
    setTimeRange(f);
    loadDashboard(f);
  };

  const onDateChange = (_, date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const usagePoints = useMemo(() => normalizeUsage(dashboard?.monthlyUsage), [dashboard]);
  const maxVal = Math.max(...usagePoints.map((p) => p.value), 1);
  const totalUsage = usagePoints.reduce((s, p) => s + p.value, 0);
  const lastMonthUsage = Math.round(totalUsage * 1.14);
  const progressPercent = lastMonthUsage > 0 ? Math.min(100, Math.round((totalUsage / lastMonthUsage) * 100)) : 50;
  const savedKwh = Math.max(0, lastMonthUsage - Math.round(totalUsage));
  const avgDaily = usagePoints.length > 0 ? totalUsage / usagePoints.length : 2867.634;
  const peakUsage = usagePoints.length > 0 ? Math.max(...usagePoints.map((p) => p.value)) : 329;

  const lineData = useMemo(() => usagePoints.map((p) => ({
    value: p.value, label: p.label, dataPointText: String(p.value),
  })), [usagePoints]);

  const consumerName = user?.name?.split(' ')[0] || 'Sandeep';
  const dueAmount = formatCurrency(dashboard?.dueAmount ?? 3180);
  const alerts = (dashboard?.alerts?.length ? dashboard.alerts : FALLBACK_ALERTS).slice(0, 3);

  return (
    // <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={[styles.animatedRoot, {
        opacity: entrance,
        transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
      }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            {[120, 170, 220, 270, 320].map((s) => (
              <View key={s} style={[styles.ring, { width: s, height: s, borderRadius: s / 2 }]} />
            ))}
            <Text style={styles.greeting}>Hi, {consumerName} 👋</Text>
            <Text style={styles.tagline}>Staying efficient today?</Text>
          </View>

          {/* Due strip */}
          <View style={styles.dueStrip}>
            <Text style={styles.dueLabel}>Due Amount: {dueAmount}</Text>
            <Text style={styles.dueDate}>Due on {abbreviateDate(dashboard?.dueDate)}</Text>
          </View>

          {/* Pay card */}
          <View style={styles.payCard}>
            <View style={styles.payCardLeft}>
              <View style={styles.payIconWrap}>
                <Ionicons name="earth-outline" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.payCardTextWrap}>
                <Text style={styles.payCardTitle}>Pay securely{'\n'}to stay on track.</Text>
                <View style={styles.payCardSubRow}>
                  <Text style={styles.payCardSub}>Avoid service disruption.</Text>
                  <Text style={styles.payCardDays}>6 Days Left</Text>
                </View>
              </View>
            </View>
            <Pressable style={({ pressed }) => [styles.payNowBtn, pressed && styles.pressed]}>
              <Text style={styles.payNowText}>Pay Now</Text>
            </Pressable>
          </View>

          {/* Communication card */}
          <View style={styles.commCard}>
            <View style={styles.commLeft}>
              <View style={styles.commTopRow}>
                <View style={styles.commIcon}>
                  <Ionicons name="settings-outline" size={16} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commTitle}>GMR AERO TOWER{'\n'}2 INCOMER</Text>
                </View>
                <View style={styles.tapBadge}>
                  <Text style={styles.tapBadgeText}>Tap for Details</Text>
                </View>
              </View>
              <Text style={styles.commSub}>Last Communication</Text>
            </View>
            <View style={styles.commRight}>
              <View style={styles.meterRow}>
                <Ionicons name="cellular-outline" size={14} color="#7FD492" />
                <Text style={styles.meterNum}>18132429</Text>
              </View>
              <Text style={styles.commSub}>07 Jan 2026, 6:35 PM</Text>
            </View>
          </View>

          {/* Energy Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Energy Summary</Text>
              <Pressable style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.datePickerText}>Pick a Date</Text>
                <Ionicons name="calendar-outline" size={14} color="#1F4B97" />
              </Pressable>
            </View>

            {/* Usage box */}
            <View style={styles.usageBox}>
              {switching ? (
                <View>
                  <View style={styles.usageTopRow}>
                    <Skeleton width={130} height={14} />
                    <Skeleton width={60} height={22} borderRadius={4} />
                  </View>
                  <Skeleton width={100} height={18} style={{ marginTop: 8 }} />
                  <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
                </View>
              ) : (
                <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentSlide }] }}>
                  <View style={styles.usageTopRow}>
                    <Text style={styles.usageLabel}>This Month's Usage:</Text>
                    <View style={{ position: 'relative', zIndex: 10 }}>
                      <Pressable style={styles.chartToggle} onPress={() => setChartDropOpen((v) => !v)}>
                        <Text style={styles.chartToggleText}>{chartMode}</Text>
                        <Ionicons name={chartDropOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={12} color="#1F4B97" />
                      </Pressable>
                      {chartDropOpen && (
                        <View style={styles.chartDropdown}>
                          {CHART_MODES.map((m) => (
                            <Pressable key={m} style={[styles.chartDropItem, m === chartMode && styles.chartDropItemActive]}
                              onPress={() => { setChartMode(m); setChartDropOpen(false); }}>
                              <Text style={[styles.chartDropText, m === chartMode && styles.chartDropTextActive]}>{m}</Text>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.usageValueRow}>
                    <Text style={styles.usageValue}>{Math.round(totalUsage)} kWh</Text>
                    <View style={styles.percentBadge}>
                      <Text style={styles.percentText}>10%</Text>
                      <Ionicons name="trending-up-outline" size={10} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={styles.usageSub}>vs. Last Month.</Text>
                </Animated.View>
              )}
            </View>

            {/* Filters */}
            <View style={styles.filtersRow}>
              {TIME_FILTERS.map((f) => (
                <Pressable key={f} style={[styles.filterChip, f === timeRange && styles.filterChipActive]}
                  onPress={() => handleFilterPress(f)}>
                  <Text style={[styles.filterText, f === timeRange && styles.filterTextActive]}>{f}</Text>
                </Pressable>
              ))}
            </View>

            {/* Chart area — fixed height */}
            <View style={styles.chartAreaFixed}>
              {switching ? (
                <View style={styles.skeletonChartRow}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <View key={i} style={styles.skeletonBarCol}>
                      <Skeleton width={18} height={25 + (i % 3) * 25} />
                      <Skeleton width={22} height={8} style={{ marginTop: 6 }} />
                    </View>
                  ))}
                </View>
              ) : (
                <Animated.View style={[styles.chartAreaInner, { opacity: contentOpacity, transform: [{ translateY: contentSlide }] }]}>
                  {chartMode === 'Bar' ? (
                    <View style={styles.barChartRow}>
                      {usagePoints.map((p) => {
                        const h = Math.max(16, (p.value / maxVal) * 100);
                        return (
                          <View key={p.label} style={styles.chartCol}>
                            <View style={styles.chartBarContainer}>
                              <View style={[styles.chartBarOuter, { height: h }]} />
                              <View style={[styles.chartBarInner, { height: h * 0.85 }]} />
                            </View>
                            <Text style={styles.chartLabel}>{p.label}</Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.lineWrap}>
                      <LineChart
                        data={lineData}
                        width={SW - 90}
                        height={110}
                        spacing={(SW - 120) / Math.max(lineData.length - 1, 1)}
                        color="#1E4694"
                        thickness={2.5}
                        startFillColor="rgba(30,70,148,0.18)"
                        endFillColor="rgba(30,70,148,0.01)"
                        areaChart
                        curved
                        hideDataPoints={false}
                        dataPointsColor="#1E4694"
                        dataPointsRadius={3}
                        xAxisColor="#E8ECF0"
                        yAxisColor="transparent"
                        yAxisTextStyle={{ fontSize: 9, color: '#8A9BA8' }}
                        xAxisLabelTextStyle={{ fontSize: 8, color: '#8A9BA8' }}
                        noOfSections={4}
                        rulesColor="#F0F2F4"
                        rulesType="solid"
                        hideYAxisText={false}
                        initialSpacing={8}
                        endSpacing={8}
                        adjustToWidth
                      />
                    </View>
                  )}
                </Animated.View>
              )}
            </View>
          </View>

          {/* Metrics */}
          {switching ? (
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Skeleton width={80} height={12} />
                <Skeleton width={110} height={20} style={{ marginTop: 6 }} />
              </View>
              <View style={styles.metricCard}>
                <Skeleton width={70} height={12} />
                <Skeleton width={80} height={20} style={{ marginTop: 6 }} />
              </View>
            </View>
          ) : (
            <Animated.View style={[styles.metricsRow, { opacity: contentOpacity, transform: [{ translateY: contentSlide }] }]}>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Average Daily</Text>
                <Text style={styles.metricValue}>{avgDaily.toFixed(3)} kWh</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricTitle}>Peak Usage</Text>
                <Text style={[styles.metricValue, styles.peakValue]}>{Math.round(peakUsage)} kWh</Text>
              </View>
            </Animated.View>
          )}

          {/* Comparison */}
          {switching ? (
            <View style={styles.compareCard}>
              <View style={styles.compareHeaderRow}>
                <Skeleton width={14} height={14} borderRadius={7} />
                <Skeleton width={80} height={14} />
              </View>
              <View style={styles.compareRow}>
                <View>
                  <Skeleton width={70} height={10} />
                  <Skeleton width={100} height={20} style={{ marginTop: 6 }} />
                </View>
                <View style={styles.compareRight}>
                  <Skeleton width={70} height={10} />
                  <Skeleton width={100} height={20} style={{ marginTop: 6 }} />
                </View>
              </View>
              <Skeleton width="100%" height={8} style={{ marginTop: 10 }} borderRadius={4} />
              <View style={[styles.savedRow, { marginTop: 6 }]}>
                <Skeleton width={130} height={12} />
              </View>
            </View>
          ) : (
            <Animated.View style={[styles.compareCard, { opacity: contentOpacity, transform: [{ translateY: contentSlide }] }]}>
              <View style={styles.compareHeaderRow}>
                <Ionicons name="swap-horizontal-outline" size={14} color="#5B6973" />
                <Text style={styles.compareTitle}>Comparison</Text>
              </View>
              <View style={styles.compareRow}>
                <View>
                  <Text style={styles.compareLabel}>This Month</Text>
                  <Text style={styles.compareStrong}>{Math.round(totalUsage).toLocaleString()} kWh</Text>
                </View>
                <View style={styles.compareRight}>
                  <Text style={styles.compareLabel}>Last Month</Text>
                  <Text style={styles.compareMuted}>{lastMonthUsage.toLocaleString()} kWh</Text>
                </View>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
              <View style={styles.savedRow}>
                <Ionicons name="checkmark-circle-outline" size={13} color="#2A9C57" />
                <Text style={styles.savedText}>You saved {savedKwh} kWh</Text>
              </View>
            </Animated.View>
          )}

          {/* Alerts */}
          <View style={styles.alertsCard}>
            <Text style={styles.alertsTitle}>Alerts</Text>
            <View style={styles.alertHeader}>
              <Text style={[styles.alertHeaderText, styles.colSerial]}>S. No</Text>
              <Text style={[styles.alertHeaderText, styles.colMeter]}>Meter Sl No</Text>
              <Text style={[styles.alertHeaderText, styles.colConsumer]}>Consumer Name</Text>
            </View>
            {alerts.map((item, i) => (
              <View key={`${item.id}-${i}`} style={styles.alertRow}>
                <Text style={[styles.alertCell, styles.colSerial]}>{i + 1}</Text>
                <Text style={[styles.alertCell, styles.colMeter]}>• {item.meterSerialNumber}</Text>
                <Text style={[styles.alertCell, styles.colConsumer]}>{item.consumerName}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Date Picker */}
        {Platform.OS === 'ios' ? (
          <Modal visible={showDatePicker} transparent animationType="slide">
            <View style={styles.dateModalOverlay}>
              <View style={styles.dateModalContent}>
                <View style={styles.dateModalHeader}>
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.dateModalCancel}>Cancel</Text>
                  </Pressable>
                  <Text style={styles.dateModalTitle}>Pick a Date</Text>
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.dateModalDone}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  style={{ height: 200 }}
                />
              </View>
            </View>
          </Modal>
        ) : (
          showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )
        )}
      </Animated.View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EDF2EE' },
  animatedRoot: { flex: 1 , backgroundColor: '#EDF2EE', },
  content: { paddingHorizontal: 10, paddingBottom: 200, backgroundColor: '#EDF2EE', marginTop: "20%" },

  hero: {
    marginTop: 4, backgroundColor: '#EAF0EC', borderRadius: 20,
    paddingHorizontal: 14, paddingBottom: 16, overflow: 'hidden',
  },
  ring: {
    position: 'absolute', alignSelf: 'center', top: 8,
    borderWidth: 1, borderColor: 'rgba(143,170,193,0.18)',
  },
  greeting: { fontSize: 16, fontWeight: '700', color: '#151515' },
  tagline: { fontSize: 13, color: '#45545E', marginTop: 2 },

  dueStrip: {
    marginTop: 8, height: 32, borderRadius: 6, backgroundColor: '#1D4694',
    paddingHorizontal: 12, alignItems: 'center', flexDirection: 'row',
    justifyContent: 'space-between', shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2
  },
  dueLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  dueDate: { color: '#C8D8FF', fontSize: 10 },

  payCard: {
    marginTop: 8, backgroundColor: '#56B96B', borderRadius: 10,
    padding: 12, flexDirection: 'row', alignItems: 'center',shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2
  },
  payCardLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  payIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  payCardTextWrap: { flex: 1 },
  payCardTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, lineHeight: 20 },
  payCardSubRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 2 },
  payCardSub: { color: '#D4F5DD', fontSize: 11 },
  payCardDays: { color: '#D4F5DD', fontSize: 11, fontWeight: '600' },
  payNowBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 6,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  payNowText: { color: '#1F4A95', fontWeight: '700', fontSize: 12 },

  commCard: {
    marginTop: 8, backgroundColor: '#1E4694', borderRadius: 10,
    padding: 12, flexDirection: 'row', justifyContent: 'space-between',shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2
  },
  commLeft: { flex: 1 },
  commTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  commTitle: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', lineHeight: 15 },
  tapBadge: { backgroundColor: '#57B96B', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  tapBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '600' },
  commSub: { color: '#C8D8FF', fontSize: 10, marginTop: 4 },
  commRight: { alignItems: 'flex-end', justifyContent: 'center' },
  meterRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meterNum: { color: '#F3F7FF', fontSize: 14, fontWeight: '700' },

  summaryCard: {
    marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 14, shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#151515' },
  datePicker: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EDF3FF', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  datePickerText: { fontSize: 11, color: '#1F4B97', fontWeight: '600' },

  usageBox: { marginBottom: 10, zIndex: 20, position: 'relative' },
  usageTopRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  usageLabel: { fontSize: 12, color: '#5B6973', fontWeight: '500' },
  chartToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EDF3FF', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  chartToggleText: { fontSize: 11, color: '#1F4B97', fontWeight: '600' },
  chartDropdown: {
    position: 'absolute', top: 28, right: 0, backgroundColor: '#FFFFFF',
    borderRadius: 8, paddingVertical: 4, minWidth: 80,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 6, zIndex: 20,
  },
  chartDropItem: { paddingHorizontal: 12, paddingVertical: 7 },
  chartDropItemActive: { backgroundColor: '#EDF3FF' },
  chartDropText: { fontSize: 12, color: '#5B6973' },
  chartDropTextActive: { color: '#1F4B97', fontWeight: '600' },

  usageValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  usageValue: { fontSize: 22, fontWeight: '800', color: '#151515' },
  percentBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#56B96B', borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  percentText: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  usageSub: { fontSize: 11, color: '#8A9BA8', marginTop: 2 },

  filtersRow: {
    flexDirection: 'row', gap: 6, marginBottom: 10,
  },
  filterChip: {
    flex: 1, alignItems: 'center', paddingVertical: 6,
    borderRadius: 6, backgroundColor: '#F4F6F8',
  },
  filterChipActive: { backgroundColor: '#1E4694' },
  filterText: { fontSize: 11, fontWeight: '600', color: '#5B6973' },
  filterTextActive: { color: '#FFFFFF' },

  chartAreaFixed: { height: 150, justifyContent: 'center', position: 'relative' },
  chartAreaInner: { flex: 1, justifyContent: 'center' },
  barChartRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', height: 130, paddingBottom: 18,
  },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBarContainer: { alignItems: 'center', justifyContent: 'flex-end', width: '100%' },
  chartBarOuter: {
    width: 14, borderRadius: 4, backgroundColor: '#D6E4F0',
    position: 'absolute', bottom: 0,
  },
  chartBarInner: {
    width: 14, borderRadius: 4, backgroundColor: '#1E4694',
    position: 'absolute', bottom: 0,
  },
  chartLabel: { fontSize: 9, color: '#8A9BA8', marginTop: 4, position: 'absolute', bottom: -16 },

  skeletonChartRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', height: 130, paddingBottom: 18,
  },
  skeletonBarCol: { alignItems: 'center', flex: 1 },

  lineWrap: {
    height: 130, justifyContent: 'center', alignItems: 'center',
  },

  metricsRow: {
    flexDirection: 'row', gap: 8, marginTop: 8,
  },
  metricCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10,
    padding: 12, shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  metricTitle: { fontSize: 11, color: '#5B6973', fontWeight: '500' },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#151515', marginTop: 4 },
  peakValue: { color: '#E04635' },

  compareCard: {
    marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 10,
    padding: 14, shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  compareHeaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10,
  },
  compareTitle: { fontSize: 13, fontWeight: '700', color: '#151515' },
  compareRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  compareLabel: { fontSize: 10, color: '#8A9BA8' },
  compareStrong: { fontSize: 18, fontWeight: '800', color: '#151515', marginTop: 2 },
  compareRight: { alignItems: 'flex-end' },
  compareMuted: { fontSize: 18, fontWeight: '700', color: '#8A9BA8', marginTop: 2 },
  progressBg: {
    height: 8, borderRadius: 4, backgroundColor: '#E8ECF0', marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: '#56B96B' },
  savedRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6,
  },
  savedText: { fontSize: 11, color: '#2A9C57', fontWeight: '600' },

  alertsCard: {
    marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 10,
    padding: 14, shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  alertsTitle: { fontSize: 14, fontWeight: '700', color: '#151515', marginBottom: 8 },
  alertHeader: {
    flexDirection: 'row', backgroundColor: '#F4F6F8', borderRadius: 6,
    paddingVertical: 6, paddingHorizontal: 8, marginBottom: 4,
  },
  alertHeaderText: { fontSize: 10, fontWeight: '700', color: '#5B6973' },
  alertRow: {
    flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8,
    borderBottomWidth: 1, borderBottomColor: '#F0F2F4',
  },
  alertCell: { fontSize: 11, color: '#333' },
  colSerial: { width: 40 },
  colMeter: { width: 100 },
  colConsumer: { flex: 1 },

  dateModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  dateModalContent: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 16,
    borderTopRightRadius: 16, paddingBottom: 30,
  },
  dateModalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#E8ECF0',
  },
  dateModalCancel: { fontSize: 14, color: '#E04635' },
  dateModalTitle: { fontSize: 15, fontWeight: '700', color: '#151515' },
  dateModalDone: { fontSize: 14, color: '#1F4B97', fontWeight: '600' },
});

export default DashboardScreen;
