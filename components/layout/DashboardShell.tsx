"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { FloatingParticles } from "@/components/3d/FloatingParticles";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/utils/cn";

export function DashboardShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="relative min-h-screen bg-mesh-subtle">
      <FloatingParticles count={28} />
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[260px]"
        )}
      >
        <TopBar title={title} />
        <main className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
