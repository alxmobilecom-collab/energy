
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, UserRole } from '../types';

interface AppContextType {
  user: User | null;
  lang: Language;
  setLang: (lang: Language) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  updateTokens: (delta: number) => void;
  completedTests: string[];
  completeTest: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [lang, setLang] = useState<Language>(Language.RU);
  const [completedTests, setCompletedTests] = useState<string[]>([]);

  useEffect(() => {
    if (user) localStorage.setItem('nova_user', JSON.stringify(user));
    else localStorage.removeItem('nova_user');
  }, [user]);

  const login = (role: UserRole) => {
    setUser({
      id: 'u123',
      email: 'user@example.com',
      role,
      tokens: 1000,
      locale: lang
    });
  };

  const logout = () => setUser(null);

  const updateTokens = (delta: number) => {
    if (user) {
      setUser({ ...user, tokens: Math.max(0, user.tokens + delta) });
    }
  };

  const completeTest = (id: string) => {
    setCompletedTests(prev => [...new Set([...prev, id])]);
  };

  return (
    <AppContext.Provider value={{ user, lang, setLang, login, logout, updateTokens, completedTests, completeTest }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
