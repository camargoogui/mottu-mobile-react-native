import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getSavedLanguage, saveLanguage } from '../i18n';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('pt-BR');

  useEffect(() => {
    // Carrega idioma salvo na inicialização
    getSavedLanguage().then((lang) => {
      setCurrentLanguage(lang);
      i18n.changeLanguage(lang);
    });
  }, [i18n]);

  const changeLanguage = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      await saveLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Erro ao trocar idioma:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

