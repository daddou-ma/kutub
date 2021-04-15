import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "Locales/en/translation.json";
import ar from "Locales/ar/translation.json";
import * as serviceWorker from "./serviceWorker";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

console.log(resources);

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.render(<App />, document.getElementById("output"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
