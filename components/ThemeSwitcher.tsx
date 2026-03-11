"use client";

import { useTheme } from "@/hooks/useTheme";
import { ThemeEnum } from "@/types/enums";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();

  const onChangeTheme = (currentTheme: ThemeEnum) => {
    setTheme(currentTheme);
  };

  return (
    <div>
      {theme === ThemeEnum.DARK ? (
        <Sun
          className="cursor-pointer select-none"
          onClick={() => onChangeTheme(ThemeEnum.LIGHT)}
          width={20}
          height={20}
        />
      ) : (
        <Moon
          className="cursor-pointer select-none"
          onClick={() => onChangeTheme(ThemeEnum.DARK)}
          width={20}
          height={20}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
