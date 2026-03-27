import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { isValidEmail } from '../utils/validators';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.24;

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { theme } = useThemeMode();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const shiftY = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const kbHeight = e.endCoordinates.height;
      Animated.timing(shiftY, {
        toValue: -(kbHeight * 0.55),
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (e) => {
      Animated.timing(shiftY, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: true,
      }).start();
    };

    const sub1 = Keyboard.addListener(showEvent, onShow);
    const sub2 = Keyboard.addListener(hideEvent, onHide);
    return () => { sub1.remove(); sub2.remove(); };
  }, [shiftY]);

  const onSubmit = async () => {
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (submitError) {
      setError(submitError.message || 'Unable to login right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Animated.View style={[styles.root, { backgroundColor: theme.colors.surface, transform: [{ translateY: shiftY }] }]}>
        <View style={styles.heroWrap}>
          <ImageBackground source={require('../../assets/Background.png')} style={styles.heroBg} resizeMode="cover" />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.avatarWrap}>
              <Image source={require('../../assets/Ellipse 1.png')} style={styles.avatarBase} />
              <Image source={require('../../assets/Logo.png')} style={styles.avatarLogo} resizeMode="contain" />
            </View>

            <View style={{marginTop: "25%"}}>
              <Text style={[styles.title, { color: theme.colors.text }]}>Welcome</Text>
              <Text style={[styles.title, { color: theme.colors.text }]}>to Best Infra</Text>
            </View>

            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Log in to manage installations, view{'\n'}real-time project updates, and access smart{'\n'}metering
              insights — all in one platform.
            </Text>

            <View style={[styles.inputWrap, { backgroundColor: theme.colors.inputBackground }]}>
              <TextInput
                ref={emailInputRef}
                style={[styles.input, { color: theme.colors.inputText }]}
                placeholder="Email / Phone Number"
                placeholderTextColor={theme.colors.inputPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Ionicons name="person-outline" size={18} color={theme.colors.inputPlaceholder} />
            </View>

            <View style={[styles.inputWrap, { backgroundColor: theme.colors.inputBackground }]}>
              <TextInput
                ref={passwordInputRef}
                style={[styles.input, { color: theme.colors.inputText }]}
                placeholder="Password"
                placeholderTextColor={theme.colors.inputPlaceholder}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={onSubmit}
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={theme.colors.inputPlaceholder} />
              </Pressable>
            </View>

            <View style={styles.metaRow}>
              <Pressable style={styles.rememberWrap} onPress={() => setRememberMe((prev) => !prev)} hitSlop={8}>
                <Ionicons
                  name={rememberMe ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={rememberMe ? theme.colors.success : theme.colors.textMuted}
                />
                <Text style={[styles.rememberText, { color: theme.colors.success }]}>Remember</Text>
              </Pressable>
              <Pressable onPress={() => setError('Forgot password flow is not configured yet.')} hitSlop={8}>
                <Text style={[styles.forgotText, { color: theme.colors.success }]}>Forgot Password?</Text>
              </Pressable>
            </View>

            {!!error && <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>}

            <Pressable
              onPress={onSubmit}
              style={({ pressed }) => [styles.submitButton, { backgroundColor: theme.colors.success }, pressed || loading ? styles.pressed : null]}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>{loading ? 'Please wait...' : 'Login Now'}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.replace('Register')} style={styles.switchLink}>
              <Text style={[styles.switchText, { color: theme.colors.primary }]}>Create Account</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={[styles.homeIndicator, { backgroundColor: theme.colors.primaryDark }]} />
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
  },
  heroWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: HERO_HEIGHT,
    overflow: 'hidden',
    zIndex: 1,
  },
  heroBg: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingTop: HERO_HEIGHT - 62,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  card: {
    alignItems: 'center',
    paddingTop: 72,
  },
  avatarWrap: {
    position: 'absolute',
    top: "1%",
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 20,
  },
  avatarBase: {
    width: 128,
    height: 128,
  },
  avatarLogo: {
    position: 'absolute',
    top: "18%",
    left: "23%",
    width: 55,
    height: 55,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 24,
  },
  inputWrap: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  metaRow: {
    width: '100%',
    marginTop: 4,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    width: '100%',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'left',
  },
  submitButton: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF', // intentionally static
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
  switchLink: {
    marginTop: 14,
    paddingVertical: 4,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '500',
  },
  homeIndicator: {
    alignSelf: 'center',
    bottom: 8,
    width: 134,
    height: 5,
    borderRadius: 3,
  },
});

export default LoginScreen;
