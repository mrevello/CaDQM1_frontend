import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEN from "./locales/en/translation.json";
import homeEN from "./locales/en/home.json";
import loginEN from "./locales/en/login.json";
import registerEN from "./locales/en/register.json";
import commonES from "./locales/es/translation.json";
import homeES from "./locales/es/home.json";
import loginES from "./locales/es/login.json";
import registerES from "./locales/es/register.json";

export const availableLanguages = [
  { code: "en-US", label: "English" },
  { code: "es", label: "Español" },
];

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en-US",
  supportedLngs: ["en", "es"],

  resources: {
    en: {
      common: commonEN,
      home: homeEN,
      login: loginEN,
      register: registerEN,
    },
    es: {
      common: commonES,
      home: homeES,
      login: loginES,
      register: registerES,
    },
  },
  defaultNS: "common",
});

export default i18n;
