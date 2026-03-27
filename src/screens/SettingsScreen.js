import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeMode } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';
import Rings from '../components/Rings';

const SettingsScreen = ({ navigation }) => {
  const { mode, theme, toggleTheme } = useThemeMode();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.colors.settingsBackground }]}>
      <Animated.View
        style={[
          styles.root,
          {
            backgroundColor: theme.colors.settingsBackground,
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Rings top={-220} />

        {/* <Text style={[styles.sectionTitle, { color: theme.colors.settingsTextMuted }]}>PREFERENCES</Text> */}

        <View style={[styles.optionCard, { backgroundColor: theme.colors.settingsCard }]}>
          <View style={styles.optionLeft}>
            <Ionicons name="settings-outline" size={20} color={theme.colors.settingsIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.settingsText }]}>Dark Mode</Text>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#7084AC', true: '#57B96B' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.optionCard, { backgroundColor: theme.colors.settingsCard }]}>
          <View style={styles.optionLeft}>
            <Ionicons name="text-outline" size={20} color={theme.colors.settingsIcon} />
            <View>
              <Text style={[styles.optionLabel, { color: theme.colors.settingsText }]}>Font Size</Text>
              <Text style={[styles.optionSub, { color: theme.colors.settingsTextMuted }]}>13 Px.</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.settingsChevron} />
        </View>

        <Pressable style={({ pressed }) => [styles.optionCard, { backgroundColor: theme.colors.settingsCard }, pressed ? styles.pressed : null]}>
          <View style={styles.optionLeft}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.settingsIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.settingsText }]}>Terms of Service</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.settingsChevron} />
        </Pressable>

        <Pressable style={({ pressed }) => [styles.optionCard, { backgroundColor: theme.colors.settingsCard }, pressed ? styles.pressed : null]}>
          <View style={styles.optionLeft}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.settingsIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.settingsText }]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.settingsChevron} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    marginTop: "30%",
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 62,
    height: 62,
  },
  circleButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F5F7FF', // intentionally static
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    letterSpacing: 1,
    marginBottom: 10,
  },
  optionCard: {
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(116, 146, 209, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionSub: {
    marginTop: 2,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default SettingsScreen;
