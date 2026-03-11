"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeEnum } from "@/types/enums";
import { ToastProvider } from "./toast-provider";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider defaultTheme={ThemeEnum.DARK}>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
      <ToastProvider />
    </>
  );
};

export default Providers;
