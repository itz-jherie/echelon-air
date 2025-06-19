"use client";

import { useEffect, useState, ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>; // Prevents SSR mismatch
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
}
