import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { DrawerProvider, useDrawer } from '../context/DrawerContext';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UsageScreen from '../screens/UsageScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import TicketsScreen from '../screens/TicketsScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import PayScreen from '../screens/PayScreen';
import SideMenuScreen from '../screens/SideMenuScreen';
import AppHeader from '../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW, height: SH } = Dimensions.get('window');
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ── bestInfra-matched constants ── */
const MENU_SCALE = 0.68;
const MENU_TRANSLATE_X = 258;
const MENU_TRANSLATE_Y = 50;
const BACKPLATE_WIDTH = 278;
const BACKPLATE_HEIGHT = 520;
const BACKPLATE_TOP = 165;
const BACKPLATE_RIGHT = -115;
const BACKPLATE_DARK_HEIGHT = 148;
const WIDTH_SCALE = SW / 375;
const HEIGHT_SCALE = Math.min(Math.max(SH / 812, 0.92), 1.08);

const TAB_ICONS = {
  Home: { outline: 'home-outline', filled: 'home' },
  Pay: { outline: 'card-outline', filled: 'card' },
  Usage: { outline: 'stats-chart-outline', filled: 'stats-chart' },
  Tickets: { outline: 'ticket-outline', filled: 'ticket' },
  Invoice: { outline: 'document-outline', filled: 'document' },
};

/* Custom tab bar — hides when drawer is open */
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { progress, isOpen } = useDrawer();

  const tabOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const tabTranslateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 80] });

  return (
    <Animated.View style={[tabStyles.bar, { opacity: tabOpacity, transform: [{ translateY: tabTranslateY }] }]}>
      {state.routes.map((route, i) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const focused = state.index === i;
        const icons = TAB_ICONS[route.name] || TAB_ICONS.Home;

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            android_ripple={null}
            style={({ pressed }) => [tabStyles.item, pressed && tabStyles.pressed]}
          >
            <View style={[tabStyles.iconWrap, focused ? tabStyles.iconActive : tabStyles.iconInActive]}>
              <Ionicons name={focused ? icons.filled : icons.outline} size={25} color={focused ? '#FFFFFF' : '#56B769'} />
            </View>
            <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const tabStyles = StyleSheet.create({
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconWrap: {
    flex: 1, width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 }, elevation: 10,
  },
  iconActive: { backgroundColor: '#56B96B', borderRadius: 100 },
  iconInActive: { backgroundColor: '#fff', borderRadius: 100 },
  label: { fontSize: 10, color: '#000' },
  labelActive: { color: '#56B96B', fontWeight: '600' },
  pressed: { opacity: 0.7 },
});

/* Right-icon map for tab screens */
const TAB_RIGHT_ICONS = {
  Home: 'notifications-outline',
  // Pay: 'card-outline',
  // Usage: 'notifications-outline',
  // Tickets: 'add-circle-outline',
  // Invoice: 'document-outline',
};

/* Bottom tab navigator */
const BottomTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={({ route, navigation }) => ({
      header: () => (
        <AppHeader
          navigation={navigation}
          screenName={route.name}
          rightIcon={TAB_RIGHT_ICONS[route.name]}
        />
      ),
    })}
  >
    <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="Pay" component={PayScreen} options={{ tabBarLabel: 'Pay' }} />
    <Tab.Screen name="Usage" component={UsageScreen} options={{ tabBarLabel: 'Usage' }} />
    <Tab.Screen name="Tickets" component={TicketsScreen} options={{ tabBarLabel: 'Tickets' }} />
    <Tab.Screen name="Invoice" component={InvoicesScreen} options={{ tabBarLabel: 'Invoice' }} />
  </Tab.Navigator>
);

const AuthStackNavigator = ({ initialRouteName }) => {
  const { theme } = useThemeMode();
  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background }, animation: 'fade' }}
    >
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

/* Stack wraps tabs + non-tab screens */
const AppContent = () => {
  const { theme } = useThemeMode();

  return (
      <AppStack.Navigator
        screenOptions={({ route, navigation }) => ({
        header: () => (
          <AppHeader
            navigation={navigation}
            screenName={route.name}
            rightIcon={TAB_RIGHT_ICONS[route.name]}
          />
        ),
        contentStyle: { backgroundColor: theme.colors.background }, animation: 'fade'
      })} >
        <AppStack.Screen name="MainTabs" component={BottomTabs} options={{ headerShown: false }} />
        <AppStack.Screen name="Notifications" component={NotificationsScreen} />
        <AppStack.Screen name="Profile" component={ProfileScreen} />
        <AppStack.Screen name="Settings" component={SettingsScreen} />
        <AppStack.Screen name="Payments" component={PaymentsScreen} />
        <AppStack.Screen name="Reports" component={ReportsScreen} />
      </AppStack.Navigator>
  );
};

/* ── Drawer shell — exact bestInfra pattern ── */
const AppWithDrawer = () => {
  const { progress, isOpen, closeDrawer } = useDrawer();

  /* Menu layer: slides in from left, fades in */
  const menuTranslateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-28, 0] });
  const menuOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  /* Content layer: scales down, moves right+down */
  const contentScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, MENU_SCALE] });
  const contentTranslateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.round(MENU_TRANSLATE_X * WIDTH_SCALE)] });
  const contentTranslateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.round(MENU_TRANSLATE_Y * HEIGHT_SCALE)] });

  /* Backdrop card behind the content window */
  const backdropTranslateX = progress.interpolate({ inputRange: [0, 1], outputRange: [42, 0] });

  return (
    <View style={styles.drawerRoot}>
      {/* Menu layer */}
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={[styles.menuLayer, { opacity: menuOpacity, transform: [{ translateX: menuTranslateX }] }]}
      >
        <SideMenuScreen />
      </Animated.View>

      {/* Backdrop card (decorative plate behind content window) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.backdropCard,
          {
            width: Math.round(BACKPLATE_WIDTH * WIDTH_SCALE),
            height: Math.round(BACKPLATE_HEIGHT * HEIGHT_SCALE),
            top: Math.round(BACKPLATE_TOP * HEIGHT_SCALE),
            right: Math.round(BACKPLATE_RIGHT * WIDTH_SCALE),
            opacity: menuOpacity,
            transform: [{ translateX: backdropTranslateX }],
          },
        ]}
      >
        <View style={[styles.backdropTop, { height: Math.round(BACKPLATE_DARK_HEIGHT * HEIGHT_SCALE) }]} />
        <View style={styles.backdropBottom} />
      </Animated.View>

      {/* Content layer — style toggle matches bestInfra exactly */}
      <Animated.View
        pointerEvents={isOpen ? 'none' : 'auto'}
        style={[
          styles.contentLayer,
          isOpen && styles.contentLayerOpen,
          { transform: [{ scale: contentScale }, { translateX: contentTranslateX }, { translateY: contentTranslateY }] },
        ]}
      >
        <AppContent />
      </Animated.View>

      {/* Tap-to-close overlay — separate layer so it doesn't affect content rendering */}
      {isOpen && (
        <Animated.View
          style={[
            styles.tapOverlay,
            { transform: [{ scale: contentScale }, { translateX: contentTranslateX }, { translateY: contentTranslateY }] },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeDrawer()} />
        </Animated.View>
      )}
    </View>
  );
};

const RootNavigator = () => {
  const { token, isBootstrapping, hasSeenOnboarding } = useAuth();
  const [isLaunching, setIsLaunching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLaunching(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (isBootstrapping || isLaunching) return <SplashScreen />;

  if (token) {
    return (
      <DrawerProvider>
        <AppWithDrawer />
      </DrawerProvider>
    );
  }

  const initialRouteName = hasSeenOnboarding ? 'Login' : 'Onboarding';
  return <AuthStackNavigator key={initialRouteName} initialRouteName={initialRouteName} />;
};

const styles = StyleSheet.create({
  drawerRoot: { flex: 1, backgroundColor: '#143F93' },
  menuLayer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  contentLayer: {
    ...StyleSheet.absoluteFillObject, zIndex: 4,
  },
  contentLayerOpen: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#0A1834',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: -6, height: 10 },
    elevation: 9,
  },
  backdropCard: {
    position: 'absolute', zIndex: 2, overflow: 'hidden',
    borderTopLeftRadius: 22, borderBottomLeftRadius: 22,
    borderTopRightRadius: 0, borderBottomRightRadius: 0,
    backgroundColor: 'transparent',
  },
  backdropTop: { width: '100%', backgroundColor: '#1B448F' },
  backdropBottom: { flex: 1, width: '100%', backgroundColor: 'rgba(184, 197, 223, 0.95)' },
  tapOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
});

export default RootNavigator;
