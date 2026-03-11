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
  const [theme, setTheme] = useState<ThemeEnum>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const storedTheme = localStorage.getItem(storageKey) as ThemeEnum | null;
    return (storedTheme as ThemeEnum) ?? defaultTheme;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    setTheme: (theme: ThemeEnum) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
