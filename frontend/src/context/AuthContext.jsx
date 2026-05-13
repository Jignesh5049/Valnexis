import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('valnexis_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('valnexis_access_token');
        localStorage.removeItem('valnexis_refresh_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('valnexis_access_token', response.data.accessToken);
    localStorage.setItem('valnexis_refresh_token', response.data.refreshToken);
    setUser(response.data.user);
  };

  const signup = async (payload) => {
    const response = await api.post('/auth/register', payload);
    localStorage.setItem('valnexis_access_token', response.data.accessToken);
    localStorage.setItem('valnexis_refresh_token', response.data.refreshToken);
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout API errors and clear local state anyway.
    }
    localStorage.removeItem('valnexis_access_token');
    localStorage.removeItem('valnexis_refresh_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
