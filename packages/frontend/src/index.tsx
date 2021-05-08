import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import ReactGA from "react-ga";

import en from "Locales/en/translation.json";
import ar from "Locales/ar/translation.json";

ReactGA.initialize(process.env.ANALYTICS_ID);

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init(
  {
    resources,
    lng: localStorage.getItem("lang") || "ar",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  },
  () => {
    const language = localStorage.getItem("lang");
    if (language === "ar") {
      window.document.dir = "rtl";
    } else {
      window.document.dir = "ltr";
    }
  }
);

i18n.on("languageChanged", function (language) {
  localStorage.setItem("lang", language);
  if (language === "ar") {
    window.document.dir = "rtl";
  } else {
    window.document.dir = "ltr";
  }
});

(window as any).i18n = i18n;

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>,
  document.getElementById("output")
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
