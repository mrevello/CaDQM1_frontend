import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEN from "./locales/en/translation.json";
import homeEN from "./locales/en/home.json";
import languageEN from "./locales/en/language.json";
import loginEN from "./locales/en/login.json";
import registerEN from "./locales/en/register.json";
import commonES from "./locales/es/translation.json";
import homeES from "./locales/es/home.json";
import languageES from "./locales/es/language.json";
import loginES from "./locales/es/login.json";
import registerES from "./locales/es/register.json";

export const availableLanguages = [
  { code: "en", labelCode: "english" },
  { code: "es", labelCode: "spanish" },
];

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  supportedLngs: ["en", "es"],

  resources: {
    en: {
      common: commonEN,
      home: homeEN,
      language: languageEN,
      login: loginEN,
      register: registerEN,
    },
    es: {
      common: commonES,
      home: homeES,
      language: languageES,
      login: loginES,
      register: registerES,
    },
  },
  defaultNS: "common",
});

export default i18n;
