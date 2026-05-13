import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('valnexis_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('valnexis_refresh_token');
    if (!refreshToken) {
      return Promise.reject(error);
    }

    original._retry = true;
    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    localStorage.setItem('valnexis_access_token', refreshResponse.data.accessToken);
    localStorage.setItem('valnexis_refresh_token', refreshResponse.data.refreshToken);
    original.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
    return api(original);
  }
);
