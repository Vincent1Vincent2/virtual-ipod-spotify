export type iPodTheme = {
  name: string;
  portraitSvgPath: string;
  landscapeSvgPath: string;
  styles?: {
    colors?: Record<string, string>;
    gradients?: Record<string, string>;
    dimensions?: Record<string, string>;
  };
};

export interface ThemeContextType {
  currentTheme: iPodTheme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
  isLandscape: boolean;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}
