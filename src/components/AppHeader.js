import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDrawer } from '../context/DrawerContext';

/**
 * Shared header: hamburger | logo | right action
 * rightIcon / rightOnPress are optional overrides for the right button.
 * Pass screenName prop to identify which screen this header is on.
 */
const AppHeader = ({ navigation, rightIcon, rightOnPress, rightColor, screenName }) => {
  const { openDrawer, closeDrawer, isOpen } = useDrawer();

  const handleToggleDrawer = () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer(screenName || 'Home');
    }
  };
  const defaultRightPress = () => navigation.navigate('Notifications');

  return (
    <View style={styles.topRow}>
      <Pressable style={styles.circleBtn} onPress={handleToggleDrawer}>
        <Ionicons name="menu-outline" size={25} color="#193977" />
      </Pressable>
      <Image source={require('../../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
      <Pressable style={styles.circleBtn} onPress={rightOnPress || defaultRightPress}>
        <Ionicons name={rightIcon || 'notifications-outline'} size={25} color={rightColor || '#193977'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6, paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  circleBtn: {
    width: 60, height: 60, borderRadius: 100, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 }, elevation: 10,
  },
  logo: { width: 52, height: 52 },
});

export default AppHeader;
