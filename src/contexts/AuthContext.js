import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { initSocket, disconnectSocket } from '../services/socketService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser.user);
          setIsAuthenticated(true);
          initSocket(token);
        } catch (error) {
          console.error('Authentication error:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();

    return () => {
      disconnectSocket();
    };
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    initSocket(data.token);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    initSocket(data.token);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    disconnectSocket();
  };

  const fetchUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
