import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { setTokenProvider } from '../services/apiClient';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';

const AUTH_TOKEN_KEY = 'bestinfra_auth_token';
const USER_KEY = 'bestinfra_user';
const ONBOARDING_KEY = 'bestinfra_onboarding_seen';

const AuthContext = createContext({
  token: null,
  user: null,
  hasSeenOnboarding: false,
  isBootstrapping: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  completeOnboarding: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    setTokenProvider(() => token);
  }, [token]);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const [savedToken, savedUser, onboardingSeen] = await AsyncStorage.multiGet([
          AUTH_TOKEN_KEY,
          USER_KEY,
          ONBOARDING_KEY,
        ]);

        const tokenValue = savedToken?.[1] || null;
        const userValue = savedUser?.[1] ? JSON.parse(savedUser[1]) : null;

        setToken(tokenValue);
        setUser(userValue);
        setHasSeenOnboarding(false);
      } finally {
        setIsBootstrapping(false);
      }
    };

    restoreState();
  }, []);

  const login = async ({ email, password }) => {
    const response = await authService.login({ email, password });

    setToken(response.token);
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setHasSeenOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');

    let resolvedUser = { name: response.consumerName, email };

    try {
      const profile = await profileService.getProfile({ tokenOverride: response.token });
      resolvedUser = profile;
    } catch (error) {
      resolvedUser = { name: response.consumerName, email };
    }

    setUser(resolvedUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(resolvedUser));

    return response;
  };

  const register = async ({ name, email, password }) => authService.register({ name, email, password });

  const logout = async () => {
    setToken(null);
    setUser(null);
    setHasSeenOnboarding(false);
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_KEY, ONBOARDING_KEY]);
  };

  const completeOnboarding = async () => {
    setHasSeenOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      hasSeenOnboarding,
      isBootstrapping,
      login,
      register,
      logout,
      completeOnboarding,
    }),
    [token, user, hasSeenOnboarding, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
