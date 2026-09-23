import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => void;
  switchUser: (role: 'admin' | 'customer') => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hop_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        api.setUserId(parsed.id);
      } catch (_) {
        localStorage.removeItem('hop_user');
      }
    } else {
      // Default to guest customer for rich instant interaction
      const defaultCustomer: User = {
        id: 'user-customer-01',
        email: 'guest@houseofpops.ae',
        name: 'Fatima Al Mansoori',
        phone: '+971 52 987 6543',
        role: 'customer',
        createdAt: '2026-02-15T10:30:00Z',
        passwordHash: '',
      };
      setUser(defaultCustomer);
      api.setUserId(defaultCustomer.id);
      localStorage.setItem('hop_user', JSON.stringify(defaultCustomer));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.login({ email, password });
    setUser(res.user);
    api.setUserId(res.user.id);
    localStorage.setItem('hop_user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<User> => {
    const res = await api.register({ name, email, password, phone });
    setUser(res.user);
    api.setUserId(res.user.id);
    localStorage.setItem('hop_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    setUser(null);
    api.setUserId(null);
    localStorage.removeItem('hop_user');
  };

  const switchUser = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      await login('admin@houseofpops.ae', 'AdminPops2026!');
    } else {
      await login('guest@houseofpops.ae', 'Customer2026!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
