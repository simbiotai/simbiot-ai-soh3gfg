import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { en, ru, de } from './translations';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
      de: {
        translation: de,
      },
    },
    lng: getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;