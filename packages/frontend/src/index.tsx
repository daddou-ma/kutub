import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "Locales/en/translation.json";
import ar from "Locales/ar/translation.json";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

console.log(resources);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

ReactDOM.render(<App />, document.getElementById("output"));
