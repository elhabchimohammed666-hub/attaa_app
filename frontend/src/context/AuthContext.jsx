import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('attaa_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('attaa_token');
      const storedUser = localStorage.getItem('attaa_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend silently
          const res = await authService.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('attaa_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('attaa_token', receivedToken);
    localStorage.setItem('attaa_user', JSON.stringify(receivedUser));

    return res.data;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('attaa_token', receivedToken);
    localStorage.setItem('attaa_user', JSON.stringify(receivedUser));

    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('attaa_token');
    localStorage.removeItem('attaa_user');
  };

  const updateStoredUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('attaa_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        updateStoredUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
