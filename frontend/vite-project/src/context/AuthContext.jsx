import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getProfile();
          if (res?.data?.user) {
            setUser(res.data.user);
          } else {
            // Invalid response
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Failed to restore session:', error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      const { user: userData, token: userToken } = res.data || {};
      
      if (userToken) {
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
        return res;
      } else {
        throw new Error('Token not returned from server');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      const { user: newUserData, token: userToken } = res.data || {};

      if (userToken) {
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(newUserData);
        return res;
      } else {
        throw new Error('Token not returned from server');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res?.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
