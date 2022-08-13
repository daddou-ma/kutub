import React, { useState, useContext, createContext } from "react";

interface ReaderSettingsProviderProps {
  children: React.ReactElement;
}

interface ReaderTheme {
  font: string;
  fontSize: number;
  color: string;
  background: string;
}

interface SettingsContext {
  theme: ReaderTheme;
  setTheme: CallableFunction;
  setFont: CallableFunction;
  setFontSize: CallableFunction;
  setColor: CallableFunction;
  setBackground: CallableFunction;
}

const readerThemeContext = createContext(null);

export function ReaderSettingsProvider({
  children,
}: ReaderSettingsProviderProps): React.ReactElement {
  const ctx = useReaderSettingsProvider();
  return (
    <readerThemeContext.Provider value={ctx}>
        {children}
    </readerThemeContext.Provider>
  );
}

export function useReaderSettings(): SettingsContext {
  return useContext(readerThemeContext);
}

export function useReaderSettingsProvider(): SettingsContext {
  const [theme, setTheme] = useState<ReaderTheme>({
    font: 'serif',
    fontSize: 13,
    color: 'black',
    background: 'white',
  })

  return {
    theme,
    setTheme,
    setFont: (value) => setTheme({ ...theme, font: value }),
    setFontSize: (value) => setTheme({ ...theme, fontSize: value }),
    setColor: (value) => setTheme({ ...theme, color: value }),
    setBackground: (value) => setTheme({ ...theme, background: value })
  };
}