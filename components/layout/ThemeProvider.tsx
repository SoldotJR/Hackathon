"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui-store";

/** Applies persisted theme on mount */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
}
