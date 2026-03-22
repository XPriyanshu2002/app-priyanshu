import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import * as notificationService from '../services/notificationService';
import AppHeader from '../components/AppHeader';

const TYPE_STYLE = {
  LOW_BALANCE: { color: '#132C69', borderColor: '#132C69', icon: 'wallet-outline' },
  BILL_DUE: { color: '#FF5F35', borderColor: '#FF5F35', icon: 'calendar-outline' },
  PAYMENT_CONFIRMATION: { color: '#11A94D', borderColor: '#11A94D', icon: 'cash-outline' },
  SYSTEM_ALERT: { color: '#132C69', borderColor: '#132C69', icon: 'alert-circle-outline' },
  TICKET_UPDATE: { color: '#11A94D', borderColor: '#11A94D', icon: 'ticket-outline' },
};

const defaultNotifications = [
  {
    id: 'seed-1',
    type: 'LOW_BALANCE',
    title: 'Low Balance Alert',
    description: 'Your meter balance is below ₹100.\nRecharge now to avoid disconnection.',
  },
  {
    id: 'seed-2',
    type: 'BILL_DUE',
    title: 'Upcoming Due Date',
    description: 'Your bill of ₹3,180 is due on 10 May.\nPay now to avoid late fees.',
  },
  {
    id: 'seed-3',
    type: 'PAYMENT_CONFIRMATION',
    title: 'Payment Successful',
    description: '₹5,180 received.\nThank you for staying current.',
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState(defaultNotifications);
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await notificationService.getNotifications();
      const mapped = (payload.notifications || []).map((item) => ({
        id: String(item.id),
        type: item.type,
        title: item.title,
        description: item.description,
      }));
      setItems(mapped.length ? mapped.slice(0, 3) : defaultNotifications);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load notifications.');
      setItems(defaultNotifications);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

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
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.topBlock}>
          {[130, 188, 246, 304].map((size) => (
            <View key={size} style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]} />
          ))}
          {/* <AppHeader
            navigation={navigation}
            rightIcon="notifications-outline"
            rightOnPress={() => navigation.goBack()}
            screenName="Notifications"
          /> */}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? <ActivityIndicator style={styles.loader} color="#58B66C" /> : null}
          {!!error ? <Text style={styles.error}>{error}</Text> : null}

          {items.map((item) => {
            const typeStyle = TYPE_STYLE[item.type] || TYPE_STYLE.SYSTEM_ALERT;

            return (
              <View key={item.id} style={[styles.card, { borderLeftColor: typeStyle.borderColor }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: typeStyle.color }]}>{item.title}</Text>
                  <View style={styles.badge}>
                    <Ionicons name={typeStyle.icon} size={16} color={typeStyle.color} />
                  </View>
                </View>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            );
          })}
        </ScrollView>
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
    marginTop: "20%",
  },
  topBlock: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    top: -56,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(133, 165, 223, 0.18)',
  },
  topRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyButton: {
    backgroundColor: '#58B66C',
  },
  logo: {
    width: 68,
    height: 68,
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 26,
    gap: 8,
  },
  loader: {
    marginVertical: 10,
  },
  error: {
    color: '#FFC8C8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#132C69',
    shadowColor: '#000E33',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDescription: {
    color: '#555555',
    fontSize: 13,
    lineHeight: 20,
  },
});

export default NotificationsScreen;
