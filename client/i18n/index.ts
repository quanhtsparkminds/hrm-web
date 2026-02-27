import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "./locales/en/common.json";
import loginEn from "./locales/en/login.json";
import signupEn from "./locales/en/signup.json";
import errorEn from "./locales/en/error.json";

import commonVi from "./locales/vi/common.json";
import loginVi from "./locales/vi/login.json";
import signupVi from "./locales/vi/signup.json";
import errorVi from "./locales/vi/error.json";

const resources = {
    en: {
        common: commonEn,
        login: loginEn,
        signup: signupEn,
        error: errorEn,
    },
    vi: {
        common: commonVi,
        login: loginVi,
        signup: signupVi,
        error: errorVi,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        ns: ["common", "login", "signup", "error"],
        defaultNS: "common",
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
            caches: ["localStorage", "cookie"],
        },
    });

export default i18n;
