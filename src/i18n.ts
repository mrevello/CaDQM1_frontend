import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

export const availableLanguages = [
    { code: 'en-US', label: 'English' },
    { code: 'es', label: 'Español' },
];

i18n.use(initReactI18next).init({
    debug: true,
    fallbackLng: "en-US",
    resources: {
        en: {
            translation: translationEN,
        },
        es: {
            translation: translationES,
        },
    },
});

export default i18n;
