"use client";
import {
  iPodTheme,
  ThemeContextType,
  ThemeProviderProps,
} from "@/types/themes/themes";
import { createContext, useContext, useEffect, useState } from "react";
import { IPOD_THEMES } from "../themes";

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: IPOD_THEMES.classic,
  setTheme: () => null,
  availableThemes: [],
  isLandscape: false,
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<iPodTheme>(
    IPOD_THEMES.classic
  );
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const handleSetTheme = (themeName: string) => {
    if (IPOD_THEMES[themeName]) {
      setCurrentTheme(IPOD_THEMES[themeName]);
      localStorage.setItem("ipod-theme", themeName);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        availableThemes: Object.keys(IPOD_THEMES),
        isLandscape,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
