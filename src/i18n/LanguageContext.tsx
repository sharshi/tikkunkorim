import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, Translations, translations } from './translations';

const STORAGE_KEY = 'tikkun-language';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'he' || stored === 'en') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'he';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const dir = language === 'he' ? 'rtl' : 'ltr';
  const isRTL = language === 'he';
  const t = translations[language];

  // Sync <html> attributes whenever language changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', dir);
    html.setAttribute('lang', language);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // localStorage unavailable
    }
  }, [language, dir]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'he' ? 'en' : 'he'));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
