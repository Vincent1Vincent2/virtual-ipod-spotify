export type iPodTheme = {
  name: string;
  svgPath: string;
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
}
