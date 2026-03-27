import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useDrawer } from '../context/DrawerContext';
import { useThemeMode } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: 'grid-outline', filled: 'grid', target: 'MainTabs', tabScreen: 'Home' },
  { label: 'Usage', icon: 'sync-outline', target: 'MainTabs', tabScreen: 'Usage' },
  { label: 'Payments', icon: 'document-text-outline', target: 'Payments' },
  { label: 'Reports', icon: 'receipt-outline', target: 'Reports' },
  { label: 'Tickets', icon: 'chatbox-ellipses-outline', target: 'MainTabs', tabScreen: 'Tickets' },
  { label: 'Alerts', icon: 'notifications-circle-outline', target: 'Notifications' },
];

const SideMenuScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { closeDrawer, activeScreen, setActiveScreen } = useDrawer();
  const { theme } = useThemeMode();

  const isItemActive = (item) => {
    if (item.tabScreen) return activeScreen === item.tabScreen;
    return activeScreen === item.target;
  };

  const navigateTo = (target, tabScreen) => {
    // Update active screen for highlight
    setActiveScreen(tabScreen || target);
    if (target) {
      // Navigate instantly — screen changes in the mini window
      if (tabScreen) {
        navigation.navigate(target, { screen: tabScreen });
      } else {
        navigation.navigate(target);
      }
    }
    // Small delay so user sees the screen swap, then drawer closes expanding the window
    setTimeout(() => closeDrawer(), 80);
  };

  const handleLogout = () => {
    closeDrawer(async () => { await logout(); });
  };

  const consumerLabel = user?.name || 'Rakesh Kumar';
  const initials = (consumerLabel || 'R')
    .split(' ').slice(0, 2).map((t) => t.charAt(0).toUpperCase()).join('');

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.drawerSurface }]}>
      <Image source={require('../../assets/Background.png')} style={styles.bgImage} resizeMode="cover" />
      <View style={styles.safeArea}>
        {/* Full-width header */}
        <View style={styles.topRow}>
          <AppHeader
            navigation={navigation}
            rightOnPress={() => navigateTo('Notifications')}
            // screenName={route.name}
            // rightIcon={TAB_RIGHT_ICONS[route.name]}
          />
        </View>

        {/* Menu content below header */}
        <View style={styles.menuBody}>
          {/* User card */}
          <Pressable onPress={() => navigateTo("Profile")}>
            <View style={[styles.userCard, { backgroundColor: theme.colors.settingsCard, borderColor: theme.colors.ringBorder }]}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.headerButton, borderColor: theme.colors.drawerText }]}>
                <Text style={[styles.avatarText, { color: theme.colors.headerIcon }]}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{consumerLabel}</Text>
                <Text style={styles.userId}>ID: GMR-2024-001234</Text>
              </View>
            </View>
          </Pressable>

          {/* Menu items */}
          <View style={styles.menuGroup}>
            {MENU_ITEMS.map((item) => {
              const active = isItemActive(item);
              return (
                <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.85} onPress={() => navigateTo(item.target, item.tabScreen)}>
                  <Ionicons name={active ? (item.filled || item.icon) : item.icon} size={22} color={active ? theme.colors.drawerTextActive : theme.colors.drawerText} />
                  <Text style={[styles.menuLabel, { color: theme.colors.drawerText }, active && styles.menuLabelActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.85} onPress={() => navigateTo('Settings')}>
              <Ionicons name="settings-outline" size={22} color={theme.colors.drawerText} />
              <Text style={[styles.menuLabel, { color: theme.colors.drawerText }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.85} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color={theme.colors.drawerText} />
              <Text style={[styles.menuLabel, { color: theme.colors.drawerText }]}>Logout</Text>
            </TouchableOpacity>
            <Text style={[styles.version, { color: theme.colors.settingsTextMuted }]}>Version 1.0.26</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.7 },
  safeArea: { flex: 1 },

  /* Full-width header row */
  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 6, marginBottom: 16,
  },
  circleBtn: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F5FB', // intentionally static
    alignItems: 'center', justifyContent: 'center',
  },
  circleBtnActive: { backgroundColor: '#4DB862' }, // intentionally static
  logo: { width: 52, height: 52 },

  /* Menu body — left-aligned content */
  menuBody: { flex: 1, paddingHorizontal: 20, marginTop: "25%" },

  userCard: {
    backgroundColor: 'rgba(30,60,130,0.5)', borderRadius: 14,
    padding: 12, flexDirection: 'row', alignItems: 'center',
    marginBottom: 22, borderWidth: 1, borderColor: 'rgba(120,170,255,0.15)',
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontWeight: '700', fontSize: 16 },
  userName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }, // intentionally static
  userId: { color: '#A8C4F0', fontSize: 12, marginTop: 2 }, // intentionally static

  menuGroup: { gap: 4, marginTop: 6 },
  menuItem: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 14, paddingVertical: 10, paddingRight: 16 },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  menuLabelActive: { color: '#FFFFFF', fontWeight: '700' }, // intentionally static

  footer: { marginTop: 'auto', paddingBottom: "15%" },
  version: { marginTop: 8, fontSize: 12 },
});

export default SideMenuScreen;
