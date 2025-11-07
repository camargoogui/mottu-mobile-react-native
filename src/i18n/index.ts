import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app:language';

// Recupera idioma salvo
export const getSavedLanguage = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved || 'pt-BR';
  } catch {
    return 'pt-BR';
  }
};

// Salva idioma escolhido
export const saveLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    console.error('Erro ao salvar idioma:', error);
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      'pt-BR': { translation: ptBR },
      'en': { translation: en },
      'es': { translation: es },
    },
    lng: 'pt-BR', // Idioma padrão
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });

// Inicializa com idioma salvo
getSavedLanguage().then((lang) => {
  i18n.changeLanguage(lang);
});

export default i18n;

