import { apiRequest } from './apiClient';

export const getProfile = ({ tokenOverride } = {}) => apiRequest('/profile', { tokenOverride });

export const updateProfile = ({ name, email }) =>
  apiRequest('/profile', {
    method: 'PUT',
    body: { name, email },
  });
