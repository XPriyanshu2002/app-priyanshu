import { apiRequest } from './apiClient';

export const getNotifications = () => apiRequest('/notifications');
