import React, { useState, useContext, createContext } from "react";
import {
  Theme,
  createMuiTheme,
  MuiThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface ThemeProviderProps {
  children: React.ReactElement;
}

interface ThemeContext {
  theme: Theme;
  darkMode: boolean;
  setDarkMode: CallableFunction;
}

const themeContext = createContext(null);

export function ThemeProvider({
  children,
}: ThemeProviderProps): React.ReactElement {
  const ctx = useThemeProvider();
  return (
    <themeContext.Provider value={ctx}>
      <MuiThemeProvider theme={ctx.theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </themeContext.Provider>
  );
}

export function useTheme(): ThemeContext {
  return useContext(themeContext);
}

export function useThemeProvider(): ThemeContext {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const { i18n } = useTranslation();

  const theme = createMuiTheme({
    typography: {
      fontFamily: "Amiri",
    },
    palette: {
      type: darkMode ? "dark" : "light",
    },
    direction: i18n.dir(),
  });

  return {
    theme,
    darkMode,
    setDarkMode: (value) => {
      setDarkMode(value);
      localStorage.setItem("theme", value ? "dark" : "light");
    },
  };
}
