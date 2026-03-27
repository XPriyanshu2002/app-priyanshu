import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeMode } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZES = [180, 250, 320, 390, 460, 530];

const SplashScreen = () => {
  const { theme } = useThemeMode();

  return (
    <View style={{flex: 1}}>
      <StatusBar style="light" />
      <ImageBackground source={require('../../assets/Background.png')} style={styles.screen} resizeMode="cover">
        <View style={styles.centerWrap}>
          {RING_SIZES.map((size) => (
            <View key={size} style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]} />
          ))}
          <Image source={require('../../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#222B71', // intentionally static — brand splash fallback behind background image
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrap: {
    width: RING_SIZES[RING_SIZES.length - 1],
    height: RING_SIZES[RING_SIZES.length - 1],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(133, 165, 223, 0.22)', // intentionally static — brand decorative ring
  },
  logo: {
    width: 86,
    height: 86,
  },
});

export default SplashScreen;
