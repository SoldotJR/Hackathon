"use client";

import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import { NotificationCenter } from "@/features/notifications/NotificationCenter";
import { GlobalSearch } from "@/features/search/GlobalSearch";
import { cn } from "@/utils/cn";

export function TopBar({ title }: { title?: string }) {
  const { setSidebarOpen, sidebarCollapsed, theme, toggleTheme } = useUIStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/70 px-4 backdrop-blur-xl sm:px-6"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {title && (
        <h1 className="hidden font-[family-name:var(--font-syne)] text-lg font-semibold sm:block">
          {title}
        </h1>
      )}

      <GlobalSearch className="ml-auto hidden max-w-sm flex-1 md:block" />

      <Button
        variant="ghost"
        size="icon"
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      <NotificationCenter />

      <div
        className={cn(
          "hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold sm:flex",
          sidebarCollapsed && "sm:flex"
        )}
      >
        HR
      </div>
    </header>
  );
}
