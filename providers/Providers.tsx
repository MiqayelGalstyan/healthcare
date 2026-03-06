"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeEnum } from "@/types/enums";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider defaultTheme={ThemeEnum.DARK}>{children}</ThemeProvider>
    </>
  );
};

export default Providers;
