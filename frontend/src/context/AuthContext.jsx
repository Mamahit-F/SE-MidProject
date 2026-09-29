import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { INITIAL_USERS } from '../mock/initialData';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

const TOKEN_KEY = 'spk_auth_token';
const USER_KEY = 'spk_current_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Initialize session verification
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);

        if (savedToken && savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setToken(savedToken);
        } else {
          setCurrentUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setCurrentUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async ({ identifier, password }) => {
    try {
      const result = await authApi.login({ identifier, password });
      const { token: newToken, user } = result;

      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setToken(newToken);
      setCurrentUser(user);

      return user;
    } catch (err) {
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const result = await authApi.register(userData);
      const { token: newToken, user } = result;

      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setToken(newToken);
      setCurrentUser(user);

      return user;
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setCurrentUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!currentUser) return;
    try {
      const updatedUser = await authApi.updateProfile(currentUser.id, updates);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }, [currentUser]);

  const uploadProfilePhoto = useCallback(async (file) => {
    if (!currentUser) return;
    try {
      const updatedUser = await authApi.uploadProfilePhoto(file);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }, [currentUser]);

  // Quick switch role for prototype SDLC evaluation
  const switchDemoUser = useCallback((targetRole) => {
    let target = INITIAL_USERS.find((u) => u.role === targetRole);
    if (!target) target = INITIAL_USERS[0];

    const demoToken = `mock_jwt_token_${target.id}_${Date.now()}`;
    localStorage.setItem(USER_KEY, JSON.stringify(target));
    localStorage.setItem(TOKEN_KEY, demoToken);
    setCurrentUser(target);
    setToken(demoToken);
    return target;
  }, []);

  const value = {
    currentUser,
    token,
    loading,
    isAuthenticated: !!currentUser && !!token,
    role: currentUser?.role || null,
    isUser: currentUser?.role === ROLES.USER,
    isStaff: currentUser?.role === ROLES.STAFF,
    isAdmin: currentUser?.role === ROLES.ADMIN,
    login,
    register,
    logout,
    updateProfile,
    uploadProfilePhoto,
    switchDemoUser,
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
