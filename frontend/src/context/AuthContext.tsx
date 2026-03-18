import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ORGANIZER' | 'ADMIN';
  referralCode: string;
  avatar?: string;
}


interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isOrganizer: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from token on mount
  useEffect(() => {
    const restoreUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) { setIsLoading(false); return; }
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data.data);
        setToken(savedToken);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/api/auth/register', data);
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      login, register, logout,
      isAuthenticated: !!user,
      isOrganizer: user?.role === 'ORGANIZER',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
