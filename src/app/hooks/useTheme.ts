import { ThemeContext } from "@/app/providers/ThemeProvider";
import { ThemeContextType } from "@/types/themes/themes";
import { useContext } from "react";

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
