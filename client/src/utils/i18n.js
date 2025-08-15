import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import amCommon from '../locales/am/common.json';
import orCommon from '../locales/or/common.json';

const resources = {
  en: {
    common: enCommon
  },
  am: {
    common: amCommon
  },
  or: {
    common: orCommon
  }
};

i18n
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // use English if detected language is not available
    debug: process.env.NODE_ENV === 'development',
    
    // Default namespace
    defaultNS: 'common',
    ns: ['common'],

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // react already escapes values
    },

    react: {
      useSuspense: false, // disable suspense for now
    }
  });

export default i18n;
