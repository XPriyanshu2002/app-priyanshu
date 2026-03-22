import { apiRequest } from './apiClient';

export const login = ({ email, password }) =>
  apiRequest('/login', { method: 'POST', body: { email, password } });

export const register = ({ name, email, password }) =>
  apiRequest('/register', {
    method: 'POST',
    body: { name, email, password },
  });
