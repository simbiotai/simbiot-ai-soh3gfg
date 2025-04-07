import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import ru from './translations/ru';
import de from './translations/de';

i18next.use(initReactI18next).init({
  resources: { en, ru, de },
  lng: 'en', // Язык по умолчанию
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export const useTranslation = () => i18next;
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