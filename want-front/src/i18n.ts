import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import lang from "./translation.json";

export const LANG = ["en", "fr", "kr"];

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: lang.en.translation },
    fr: { translation: lang.fr.translation },
    kr: { translation: lang.kr.translation },
  },
});

export default i18n;
