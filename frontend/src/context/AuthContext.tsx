import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAILS: Record<UserRole, string> = {
  citizen: 'citizen@demo.in',
  community_org: 'citizen@demo.in',
  panchayat_ulb: 'government@demo.in',
  government: 'government@demo.in',
  university_admin: 'university@demo.in',
  faculty: 'faculty@demo.in',
  student: 'student@demo.in',
  industry: 'industry@demo.in',
  csr_org: 'industry@demo.in',
  admin: 'admin@demo.in',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jsix_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jsix_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          localStorage.removeItem('jsix_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, pass);
      localStorage.setItem('jsix_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const quickSwitchRole = async (role: UserRole) => {
    const email = DEMO_EMAILS[role] || 'citizen@demo.in';
    await login(email, 'Demo@12345');
  };

  const logout = () => {
    localStorage.removeItem('jsix_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
