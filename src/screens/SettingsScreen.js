import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeMode } from '../context/ThemeContext';
import AppHeader from '../components/AppHeader';

const SettingsScreen = ({ navigation }) => {
  const { mode, toggleTheme } = useThemeMode();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  return (
    <View style={styles.safeArea}>
      <Animated.View
        style={[
          styles.root,
          {
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
        {[150, 215, 280, 345].map((size) => (
          <View key={size} style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]} />
        ))}

        {/* <AppHeader
          navigation={navigation}
          rightIcon="chevron-back-outline"
          rightOnPress={() => navigation.goBack()}
          screenName="Settings"
        /> */}

        <Text style={styles.sectionTitle}>PREFERENCES</Text>

        <View style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <Ionicons name="settings-outline" size={20} color="#E2EDFF" />
            <Text style={styles.optionLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#7084AC', true: '#57B96B' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <Ionicons name="text-outline" size={20} color="#E2EDFF" />
            <View>
              <Text style={styles.optionLabel}>Font Size</Text>
              <Text style={styles.optionSub}>13 Px.</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#B9D0FF" />
        </View>

        <Pressable style={({ pressed }) => [styles.optionCard, pressed ? styles.pressed : null]}>
          <View style={styles.optionLeft}>
            <Ionicons name="information-circle-outline" size={20} color="#E2EDFF" />
            <Text style={styles.optionLabel}>Terms of Service</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#B9D0FF" />
        </Pressable>

        <Pressable style={({ pressed }) => [styles.optionCard, pressed ? styles.pressed : null]}>
          <View style={styles.optionLeft}>
            <Ionicons name="information-circle-outline" size={20} color="#E2EDFF" />
            <Text style={styles.optionLabel}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#B9D0FF" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#123378',
  },
  root: {
    flex: 1,
    backgroundColor: '#123378',
    paddingHorizontal: 14,
    paddingTop: 8,
    marginTop: "20%",
  },
  ring: {
    position: 'absolute',
    top: -74,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(133, 165, 223, 0.14)',
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
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#90ABD8',
    fontSize: 15,
    letterSpacing: 1,
    marginBottom: 10,
  },
  optionCard: {
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(46, 82, 149, 0.85)',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  optionSub: {
    marginTop: 2,
    color: '#9FC0F6',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default SettingsScreen;
