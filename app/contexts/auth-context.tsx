import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/services/api/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => Promise<void>;
  register: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!user && !!token;

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const saveAuthData = async (newToken: string, newUser: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  };

  const login = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    await saveAuthData(newToken, newUser);
  };

  const register = async (newToken: string, newUser: User) => {
    // Para registro, es lo mismo que login
    await login(newToken, newUser);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await clearAuthData();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};