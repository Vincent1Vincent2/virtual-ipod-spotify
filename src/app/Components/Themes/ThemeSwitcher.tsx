import { useTheme } from "@/app/providers/ThemeProvider";
import { IPOD_THEMES } from "@/app/themes";

export function ThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="theme-switcher">
      <select
        value={currentTheme.name.toLowerCase()}
        onChange={(e) => setTheme(e.target.value)}
        className="theme-select"
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {IPOD_THEMES[theme].name}
          </option>
        ))}
      </select>
    </div>
  );
}
