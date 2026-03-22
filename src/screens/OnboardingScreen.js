import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RING_SIZES = [180, 240, 300, 360, 420];

const slides = [
  {
    title: 'Bill Accurately.www\nOperate Confidently.',
    description:
      'wwwSay goodbye to estimation errors. Our smart metering solutions ensure transparent, compliant, and error-free billing \u2014 at scale.',
  },
  {
    title: 'Install with Confidence.\nEvery Time.',
    description:
      'Every meter is linked, verified, and geo-tagged \u2014 ensuring accurate installation with complete traceability.',
  },
  {
    title: 'Commission Quickly.\nComply Fully.',
    description:
      'Test, validate, and report in just a few steps \u2014 making compliance faster, smoother, and always audit-ready.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const arrowY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowY, {
          toValue: -10,
          duration: 800,
          easing: Easing.out(Easing.back(1.8)),
          useNativeDriver: true,
        }),
        Animated.timing(arrowY, {
          toValue: 0,
          duration: 800,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [arrowY]);

  const onNext = async (slideIndex) => {
    if (slideIndex < slides.length - 1) {
      const nextIndex = slideIndex + 1;
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      return;
    }
    navigation.replace('Login');
  };

  const onLogin = () => {
    navigation.replace('Login');
  };

  const onScrollEnd = (e) => {
    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />
      <ImageBackground source={require('../../assets/Background.png')} style={styles.bg} resizeMode="cover">
        {/* Rings — absolute, centered on logo area */}
        <View style={styles.ringsContainer} pointerEvents="none">
          {RING_SIZES.map((size) => (
            <View
              key={size}
              style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
            />
          ))}
        </View>

        <View style={styles.container}>
          {/* Slides */}
          <View style={styles.slidesArea}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onScrollEnd}
              ref={scrollRef}
            >
              {slides.map((slide, slideIndex) => (
                <View key={slide.title} style={[styles.slide, { width }]}>
                  {/* Logo area */}
                  <View style={styles.logoWrap}>
                    <Image source={require('../../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
                  </View>

                  {/* Text + action grouped together */}
                  <View style={styles.textContent}>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.description}>{slide.description}</Text>

                    <View style={styles.pagination}>
                      {slides.map((_, i) => (
                        <View
                          key={`dot-${i}`}
                          style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
                        />
                      ))}
                    </View>

                    <Pressable onPress={() => onNext(slideIndex)} style={styles.nextButton}>
                      <Text style={styles.nextButtonText}>
                        {slideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                      </Text>
                    </Pressable>
                  </View>

                  {/* Arrow pushed to bottom of remaining space */}
                  <View style={styles.arrowArea}>
                    <Animated.View style={[styles.arrowWrap, { transform: [{ translateY: arrowY }] }]}>
                      <View style={styles.chevronRow}>
                        <Ionicons name="chevron-up" size={18} color="#DFE7FF" />
                        <Ionicons name="chevron-up" size={18} color="#DFE7FF" style={styles.chevronOverlay} />
                      </View>
                      <View style={[styles.chevronRow, styles.arrowTop]}>
                        <Ionicons name="chevron-up" size={18} color="#DFE7FF" />
                        <Ionicons name="chevron-up" size={18} color="#DFE7FF" style={styles.chevronOverlay} />
                      </View>
                    </Animated.View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Login card pinned to bottom */}
          <View style={styles.loginCard}>
            <Text style={styles.loginHelp}>Don't have an account? Need Help!</Text>
            <Pressable onPress={onLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#222B71',
  },
  bg: {
    flex: 1,
    paddingTop: "20%"
  },
  ringsContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.21,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(133, 165, 223, 0.22)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  slidesArea: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  logoWrap: {
    marginTop: SCREEN_HEIGHT * 0.08,
    marginBottom: SCREEN_HEIGHT * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
  },
  textContent: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  description: {
    marginTop: 16,
    color: '#C8D4F0',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  pagination: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 8,
  },
  dotActive: {
    width: 28,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  nextButton: {
    marginTop: 24,
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#55B66A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  arrowTop: {
    marginTop: -9,
  },
  chevronRow: {
    position: 'relative',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronOverlay: {
    position: 'absolute',
  },
  loginCard: {
    marginHorizontal: 26,
    marginBottom: 16,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(18, 62, 110, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(80, 140, 180, 0.2)',
  },
  loginHelp: {
    color: '#C8DAFF',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 12,
  },
  loginButton: {
    height: 46,
    borderRadius: 8,
    backgroundColor: '#1D4694',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
