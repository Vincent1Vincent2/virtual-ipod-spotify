"use client";
import { IPOD_THEMES } from "@/app/themes";
import { iPodTheme, ThemeContextType } from "@/types/themes/themes";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: IPOD_THEMES.classic,
  setTheme: () => null,
  availableThemes: [],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<iPodTheme>(
    IPOD_THEMES.classic
  );

  const handleSetTheme = (themeName: string) => {
    if (IPOD_THEMES[themeName]) {
      setCurrentTheme(IPOD_THEMES[themeName]);
      localStorage.setItem("ipod-theme", themeName);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("ipod-theme");
    if (savedTheme && IPOD_THEMES[savedTheme]) {
      handleSetTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        availableThemes: Object.keys(IPOD_THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
