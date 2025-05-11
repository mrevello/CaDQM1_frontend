import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import activityEN from "./locales/en/activity.json";
import commonEN from "./locales/en/translation.json";
import contextEN from "./locales/en/context.json";
import dataProfilingEN from "./locales/en/dataProfiling.json";
import languageEN from "./locales/en/language.json";
import phaseEN from "./locales/en/phase.json";
import problemEN from "./locales/en/problem.json";
import projectEN from "./locales/en/project.json";
import stageEN from "./locales/en/stage.json";
import stateEN from "./locales/en/state.json";
import activityES from "./locales/es/activity.json";
import commonES from "./locales/es/translation.json";
import contextES from "./locales/es/context.json";
import dataProfilingES from "./locales/es/dataProfiling.json";
import languageES from "./locales/es/language.json";
import phaseES from "./locales/es/phase.json";
import problemES from "./locales/es/problem.json";
import projectES from "./locales/es/project.json";
import stageES from "./locales/es/stage.json";
import stateES from "./locales/es/state.json";

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
      activity: activityEN,
      common: commonEN,
      context: contextEN,
      dataProfiling: dataProfilingEN,
      language: languageEN,
      phase: phaseEN,
      problem: problemEN,
      project: projectEN,
      stage: stageEN,
      state: stateEN,
    },
    es: {
      activity: activityES,
      common: commonES,
      context: contextES,
      dataProfiling: dataProfilingES,
      language: languageES,
      phase: phaseES,
      problem: problemES,
      project: projectES,
      stage: stageES,
      state: stateES,
    },
  },
  defaultNS: "common",
});

export default i18n;
