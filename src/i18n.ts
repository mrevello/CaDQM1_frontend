import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEN from "./locales/en/translation.json";
import contextEN from "./locales/en/context.json";
import languageEN from "./locales/en/language.json";
import loginEN from "./locales/en/login.json";
import phaseEN from "./locales/en/phase.json";
import problemEN from "./locales/en/problem.json";
import projectEN from "./locales/en/project.json";
import registerEN from "./locales/en/register.json";
import commonES from "./locales/es/translation.json";
import contextES from "./locales/es/context.json";
import languageES from "./locales/es/language.json";
import loginES from "./locales/es/login.json";
import phaseES from "./locales/es/phase.json";
import problemES from "./locales/es/problem.json";
import projectES from "./locales/es/project.json";
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
      context: contextEN,
      language: languageEN,
      login: loginEN,
      phase: phaseEN,
      problem: problemEN,
      project: projectEN,
      register: registerEN,
    },
    es: {
      common: commonES,
      context: contextES,
      language: languageES,
      login: loginES,
      phase: phaseES,
      problem: problemES,
      project: projectES,
      register: registerES,
    },
  },
  defaultNS: "common",
});

export default i18n;
