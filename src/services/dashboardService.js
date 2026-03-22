import { apiRequest } from './apiClient';

export const getDashboard = (timeRange = '30D') =>
  apiRequest(`/dashboard?range=${encodeURIComponent(timeRange)}`);
