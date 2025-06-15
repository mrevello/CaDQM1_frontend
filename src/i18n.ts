import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEN from "./locales/en/translation.json";
import commonES from "./locales/es/translation.json";

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
    },
    es: {
      common: commonES,
    },
  },
  defaultNS: "common",
});

export default i18n;
