import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import mr from './locales/mr.json';
import hi from './locales/hi.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    mr: { translation: mr },
    hi: { translation: hi },
    en: { translation: en },
  },
  lng: 'mr', // Marathi default
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
