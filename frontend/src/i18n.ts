import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import idTranslation from './locales/id.json';
import enTranslation from './locales/en.json';

export type TranslatableString = {
  id: string;
  en: string;
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: idTranslation },
      en: { translation: enTranslation }
    },
    lng: 'id', // Default language
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;

export function getTrans(field: any, currentLang: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[currentLang] || field['id'] || '';
}
