import { ReactNode, useEffect, useState } from "react";
import { ThemeProviderContext } from "@/hooks/useTheme";
import { ThemeEnum } from "@/types/enums";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: ThemeEnum;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = ThemeEnum.SYSTEM,
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeEnum>(defaultTheme);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as ThemeEnum | null;
    if (stored && Object.values(ThemeEnum).includes(stored)) {
      setThemeState(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(ThemeEnum.LIGHT, ThemeEnum.DARK);

    if (theme === ThemeEnum.SYSTEM) {
      const systemTheme = window.matchMedia(
        `(prefers-color-scheme: ${ThemeEnum.DARK})`,
      ).matches
        ? ThemeEnum.DARK
        : ThemeEnum.LIGHT;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (nextTheme: ThemeEnum) => {
      localStorage.setItem(storageKey, nextTheme);
      setThemeState(nextTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
