"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Users,
  Bot,
  Calendar,
  FileBarChart,
  BarChart3,
  Settings,
  Sparkles,
  Briefcase,
  X,
  ChevronLeft,
  Mail,
  CalendarClock,
  ClipboardCheck,
  UserRoundSearch,
  FileSignature,
  History,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";

const NAV_CORE = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/recruitment", label: "Recruitment", icon: Briefcase },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/workflow", label: "AI Workflow", icon: Bot },
  { href: "/dashboard/reports", label: "Reports", icon: FileBarChart },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const NAV_AUTOMATION = [
  { href: "/dashboard/communication", label: "Candidate Communication", icon: Mail },
  { href: "/dashboard/scheduling", label: "Interview Scheduling", icon: CalendarClock },
  { href: "/dashboard/evaluation", label: "Interview Evaluation", icon: ClipboardCheck },
  { href: "/dashboard/follow-up", label: "Follow-up Center", icon: UserRoundSearch },
  { href: "/dashboard/offers", label: "Offer Management", icon: FileSignature },
  { href: "/dashboard/activity", label: "Activity Timeline", icon: History },
];

const NAV_FOOTER = [
  { href: "/dashboard/reminders", label: "Interview Reminders", icon: Calendar },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all",
        active
          ? "bg-primary/20 text-white"
          : "text-subtext hover:bg-white/5 hover:text-white"
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-2xl bg-primary/20"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className={cn("relative z-10 h-5 w-5 shrink-0", active && "text-primary")} />
      {!collapsed && (
        <span className="relative z-10 truncate font-medium">{label}</span>
      )}
    </Link>
  );
}

function NavItems({ collapsed }: { collapsed: boolean }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-3">
      {NAV_CORE.map((item) => (
        <NavLink key={item.href} {...item} collapsed={collapsed} />
      ))}

      {!collapsed ? (
        <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-subtext/70">
          Automation
        </p>
      ) : (
        <div className="my-2 border-t border-white/10" />
      )}

      {NAV_AUTOMATION.map((item) => (
        <NavLink key={item.href} {...item} collapsed={collapsed} />
      ))}

      {!collapsed ? (
        <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-subtext/70">
          More
        </p>
      ) : (
        <div className="my-2 border-t border-white/10" />
      )}

      {NAV_FOOTER.map((item) => (
        <NavLink key={item.href} {...item} collapsed={collapsed} />
      ))}
    </nav>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleCollapsed } =
    useUIStore();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/10 bg-card/80 backdrop-blur-xl transition-all duration-300 lg:flex",
          sidebarCollapsed ? "w-[80px]" : "w-[270px]"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight">
                TalentPilot
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:inline-flex"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition", sidebarCollapsed && "rotate-180")}
            />
          </Button>
        </div>
        <NavItems collapsed={sidebarCollapsed} />
        <div className="shrink-0 p-4">
          {!sidebarCollapsed && (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-xs text-subtext">
              <p className="font-medium text-white">Autonomous Mode</p>
              <p className="mt-1">AI handles outreach — you decide who to hire</p>
            </div>
          )}
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-white/10 bg-card lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between px-4">
                <span className="font-[family-name:var(--font-syne)] text-lg font-semibold">
                  TalentPilot
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div
                className="flex-1 overflow-y-auto"
                onClick={() => setSidebarOpen(false)}
              >
                <NavItems collapsed={false} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
