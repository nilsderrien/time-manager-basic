import axios from 'axios';
import { clearSession, getToken } from '../features/auth/session';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

// Ajoute le token à chaque requête
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expiré ou invalide : retour au login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearSession();
      window.location.assign('/login');
    }
    return Promise.reject(err);
  },
);
