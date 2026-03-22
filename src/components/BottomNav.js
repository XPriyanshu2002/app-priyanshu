import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useDrawer } from '../context/DrawerContext';

const TABS = [
  { key: 'Dashboard', label: 'Home', icon: 'home-outline', filled: 'home' },
  { key: 'Pay', label: 'Pay', icon: 'card-outline', filled: 'card' },
  { key: 'Usage', label: 'Usage', icon: 'stats-chart-outline', filled: 'stats-chart' },
  { key: 'Tickets', label: 'Tickets', icon: 'ticket-outline', filled: 'ticket' },
  { key: 'Invoices', label: 'Invoice', icon: 'document-outline', filled: 'document' },
];

const BottomNav = ({ navigation, activeIndex = 0 }) => {
  const { progress } = useDrawer();

  const animStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: 1 - p,
      transform: [{ translateY: p * 80 }],
    };
  });

  return (
    <Animated.View style={[styles.bottomNav, animStyle]}>
      {TABS.map((tab, i) => {
        const active = i === activeIndex;
        return (
          <Pressable key={tab.label} onPress={() => navigation.navigate(tab.key)}
            style={({ pressed }) => [styles.bottomItem, pressed && styles.pressed]}>
            <View style={[styles.iconWrap, active && styles.iconActive]}>
              <Ionicons name={active ? tab.filled : tab.icon} size={18} color={active ? '#FFFFFF' : '#56B769'} />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 }, elevation: 10,
  },
  bottomItem: { flex: 1, alignItems: 'center', gap: 3 },
  iconWrap: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  iconActive: { backgroundColor: '#56B96B', borderRadius: '100%' },
  label: { fontSize: 10, color: '#8A9BA8' },
  labelActive: { color: '#56B96B', fontWeight: '600' },
  pressed: { opacity: 0.7 },
});

export default BottomNav;
