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
import * as profileService from '../services/profileService';
import { isValidEmail } from '../utils/validators';
import AppHeader from '../components/AppHeader';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
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
        toValue: -(kbHeight * 0.8),
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
    <View style={styles.safeArea}>
      <Animated.View style={{ flex: 1, transform: [{ translateY: shiftY }] }}>
      <Animated.View
        style={[
          styles.root,
          {
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
        {/* <AppHeader
          navigation={navigation}
          rightIcon={isEditing ? 'arrow-back-outline' : 'log-out-outline'}
          rightOnPress={isEditing ? () => setIsEditing(false) : logout}
          screenName="Profile"
        /> */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            {!isEditing
              ? [120, 170, 220, 270, 320].map((size) => (
                  <View key={size} style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]} />
                ))
              : null}


            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(profile.name || user?.name || 'Srusti')
                  .split(' ')
                  .slice(0, 2)
                  .map((token) => token.charAt(0).toUpperCase())
                  .join('')}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderText}>Account Information</Text>
            </View>
            <View style={styles.infoBody}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Consumer ID</Text>
                <Text style={styles.infoValue}>{consumerId}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Meter Number</Text>
                <Text style={styles.infoValue}>{meterNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Connection Type</Text>
                <Text style={styles.infoValue}>Residential</Text>
              </View>
            </View>
          </View>

          {loading ? <ActivityIndicator color="#57B86A" style={styles.loader} /> : null}
          {!!error ? <Text style={styles.error}>{error}</Text> : null}
          {!!message ? <Text style={styles.success}>{message}</Text> : null}

          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(name) => setProfile((prev) => ({ ...prev, name }))}
                placeholder="Name"
                placeholderTextColor="#8A8A8A"
              />
              <TextInput
                style={styles.input}
                value={profile.phoneMasked}
                onChangeText={(phoneMasked) => setProfile((prev) => ({ ...prev, phoneMasked }))}
                placeholder="Phone"
                placeholderTextColor="#8A8A8A"
              />
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(email) => setProfile((prev) => ({ ...prev, email }))}
                placeholder="Email"
                placeholderTextColor="#8A8A8A"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={profile.address}
                onChangeText={(address) => setProfile((prev) => ({ ...prev, address }))}
                placeholder="Address"
                placeholderTextColor="#8A8A8A"
              />

              <View style={styles.actionsRow}>
                <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.saveButton,
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
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{valueOrPlaceholder(profile.name, 'Srusti')}</Text>
              </View>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{valueOrPlaceholder(profile.phoneMasked, '85852***5656')}</Text>
              </View>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{valueOrPlaceholder(profile.email, 'Email@')}</Text>
              </View>
              <View style={styles.valueBox}>
                <Text style={styles.valueText}>{valueOrPlaceholder(profile.address, 'Address')}</Text>
              </View>

              <Pressable style={({ pressed }) => [styles.editButton, pressed ? styles.buttonPressed : null]} onPress={() => setIsEditing(true)}>
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
    backgroundColor: '#EAF1ED',
  },
  root: {
    flex: 1,
    backgroundColor: '#EAF1ED',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    marginTop: "20%",
  },
  hero: {
    marginTop: 8,
    minHeight: 190,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    top: -65,
    borderWidth: 1,
    borderColor: 'rgba(125, 147, 169, 0.2)',
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
    backgroundColor: '#F3F6F9',
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
    borderColor: '#5E7A99',
    backgroundColor: '#7894AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 32,
  },
  infoCard: {
    marginTop: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  infoHeader: {
    backgroundColor: '#57B86A',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  infoHeaderText: {
    color: '#FFFFFF',
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
    color: '#404040',
    fontSize: 16,
  },
  infoValue: {
    color: '#2F2F2F',
    fontWeight: '700',
    fontSize: 17,
  },
  loader: {
    marginTop: 12,
  },
  error: {
    marginTop: 8,
    color: '#C44536',
  },
  success: {
    marginTop: 8,
    color: '#1E874E',
  },
  valueBox: {
    marginTop: 12,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#F7F8F8',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  valueText: {
    color: '#5B5B5B',
    fontSize: 15,
  },
  input: {
    marginTop: 12,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#F7F8F8',
    justifyContent: 'center',
    paddingHorizontal: 20,
    color: '#2C2C2C',
    fontSize: 15,
  },
  editButton: {
    marginTop: 14,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#56B96B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
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
    borderColor: '#56B96B',
    backgroundColor: '#F3F7F4',
  },
  saveButton: {
    backgroundColor: '#56B96B',
  },
  cancelText: {
    color: '#3A3A3A',
    fontSize: 15,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

export default ProfileScreen;
