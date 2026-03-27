import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import * as profileService from '../services/profileService';
import { isValidEmail } from '../utils/validators';
import AppHeader from '../components/AppHeader';
import Rings from '../components/Rings';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme } = useThemeMode();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    id: 0,
    name: '',
    email: '',
    phoneMasked: '85852***5656',
    address: 'Address',
  });

  const entrance = useRef(new Animated.Value(0)).current;
  const shiftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const kbHeight = e.endCoordinates.height;
      Animated.timing(shiftY, {
        toValue: -(kbHeight * 0.82),
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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const payload = await profileService.getProfile();
        setProfile((prev) => ({
          ...prev,
          id: Number(payload.id || 0),
          name: payload.name || user?.name || '',
          email: payload.email || user?.email || '',
        }));
      } catch (fetchError) {
        setError(fetchError.message || 'Could not load profile details.');
        setProfile((prev) => ({
          ...prev,
          name: user?.name || prev.name,
          email: user?.email || prev.email,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email, user?.name]);

  const consumerId = `GMR${String(profile.id || 2024567890).padStart(10, '0')}`;
  const meterNumber = `MTR-${String(profile.id || 456789).padStart(6, '0')}`;

  const onSave = async () => {
    setError('');
    setMessage('');

    if (!profile.name.trim()) {
      setError('Name is required.');
      return;
    }

    if (!isValidEmail(profile.email)) {
      setError('Enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      const response = await profileService.updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
      });
      setMessage(response.message || 'Profile updated successfully.');
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const valueOrPlaceholder = (value, placeholder) => (value ? value : placeholder);

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.colors.screenBackground }]}>
      <Animated.View style={{ flex: 1, transform: [{ translateY: shiftY }] }}>
      <Animated.View
        style={[
          styles.root,
          {
            backgroundColor: theme.colors.screenBackground,
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        {!isEditing && <Rings top="-12%" />}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.hero}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.textMuted, borderColor: theme.colors.chipText }]}>
              <Text style={styles.avatarText}>
                {(profile.name || user?.name || 'Srusti')
                  .split(' ')
                  .slice(0, 2)
                  .map((token) => token.charAt(0).toUpperCase())
                  .join('')}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={[styles.infoHeader, { backgroundColor: theme.colors.success }]}>
              <Text style={styles.infoHeaderText}>Account Information</Text>
            </View>
            <View style={styles.infoBody}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Consumer ID</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{consumerId}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Meter Number</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{meterNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>Connection Type</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>Residential</Text>
              </View>
            </View>
          </View>

          {loading ? <ActivityIndicator color={theme.colors.success} style={styles.loader} /> : null}
          {!!error ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text> : null}
          {!!message ? <Text style={[styles.success, { color: theme.colors.success }]}>{message}</Text> : null}

          {isEditing ? (
            <>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.inputBackground1, color: theme.colors.inputText }]}
                value={profile.name}
                onChangeText={(name) => setProfile((prev) => ({ ...prev, name }))}
                placeholder="Name"
                placeholderTextColor={theme.colors.inputPlaceholder}
              />
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.inputBackground1, color: theme.colors.inputText }]}
                value={profile.phoneMasked}
                onChangeText={(phoneMasked) => setProfile((prev) => ({ ...prev, phoneMasked }))}
                placeholder="Phone"
                placeholderTextColor={theme.colors.inputPlaceholder}
              />
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.inputBackground1, color: theme.colors.inputText }]}
                value={profile.email}
                onChangeText={(email) => setProfile((prev) => ({ ...prev, email }))}
                placeholder="Email"
                placeholderTextColor={theme.colors.inputPlaceholder}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.inputBackground1, color: theme.colors.inputText }]}
                value={profile.address}
                onChangeText={(address) => setProfile((prev) => ({ ...prev, address }))}
                placeholder="Address"
                placeholderTextColor={theme.colors.inputPlaceholder}
              />

              <View style={styles.actionsRow}>
                <Pressable style={[styles.actionButton, styles.cancelButton, { borderColor: theme.colors.success, backgroundColor: theme.colors.cardBackground }]} onPress={() => setIsEditing(false)}>
                  <Text style={[styles.cancelText, { color: theme.colors.text }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.saveButton,
                    { backgroundColor: theme.colors.success },
                    pressed || saving ? styles.buttonPressed : null,
                  ]}
                  onPress={onSave}
                  disabled={saving}
                >
                  <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.valueBox, { backgroundColor: theme.colors.inputBackground1 }]}>
                <Text style={[styles.valueText, { color: theme.colors.textMuted }]}>{valueOrPlaceholder(profile.name, 'Srusti')}</Text>
              </View>
              <View style={[styles.valueBox, { backgroundColor: theme.colors.inputBackground1 }]}>
                <Text style={[styles.valueText, { color: theme.colors.textMuted }]}>{valueOrPlaceholder(profile.phoneMasked, '85852***5656')}</Text>
              </View>
              <View style={[styles.valueBox, { backgroundColor: theme.colors.inputBackground1 }]}>
                <Text style={[styles.valueText, { color: theme.colors.textMuted }]}>{valueOrPlaceholder(profile.email, 'Email@')}</Text>
              </View>
              <View style={[styles.valueBox, { backgroundColor: theme.colors.inputBackground1 }]}>
                <Text style={[styles.valueText, { color: theme.colors.textMuted }]}>{valueOrPlaceholder(profile.address, 'Address')}</Text>
              </View>

              <Pressable style={({ pressed }) => [styles.editButton, { backgroundColor: theme.colors.success }, pressed ? styles.buttonPressed : null]} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </Animated.View>
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    marginTop: "35%",
  },
  hero: {
    marginTop: 8,
    minHeight: 190,
    alignItems: 'center',
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topLogo: {
    width: 62,
    height: 62,
  },
  circleButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B3365',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF', // intentionally static
    fontWeight: '800',
    fontSize: 32,
  },
  infoCard: {
    marginTop: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoHeader: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  infoHeaderText: {
    color: '#FFFFFF', // intentionally static
    fontWeight: '500',
    fontSize: 14,
  },
  infoBody: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontWeight: '700',
    fontSize: 17,
  },
  loader: {
    marginTop: 12,
  },
  error: {
    marginTop: 8,
  },
  success: {
    marginTop: 8,
  },
  valueBox: {
    marginTop: 12,
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  valueText: {
    fontSize: 15,
  },
  input: {
    marginTop: 12,
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
    fontSize: 15,
  },
  editButton: {
    marginTop: 14,
    height: 54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#FFFFFF', // intentionally static
    fontWeight: '700',
    fontSize: 16,
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
  },
  cancelText: {
    fontSize: 15,
  },
  saveText: {
    color: '#FFFFFF', // intentionally static
    fontSize: 15,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

export default ProfileScreen;
