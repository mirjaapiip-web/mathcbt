import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Bot,
  DoorOpen,
  LayoutDashboard,
  ListChecks,
  LogOut,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: ReactNode;
  active: "dashboard" | "rooms" | "questions" | "ai";
};

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    value: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/rooms",
    label: "Room",
    value: "rooms",
    icon: DoorOpen,
  },
  {
    href: "/admin/questions",
    label: "Daftar Soal",
    value: "questions",
    icon: ListChecks,
  },
  {
    href: "/admin/ai",
    label: "Generate Soal AI",
    value: "ai",
    icon: Bot,
  },
] as const;

export function AdminShell({ children, active }: AdminShellProps) {
  return (
    <div className="exam-shell min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-[1520px] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border bg-white/60 p-4 backdrop-blur-xl dark:bg-white/5 lg:block">
          <div className="sticky top-4 space-y-6">
            <BrandLogo />
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-primary",
                    item.value === active && "bg-primary text-white shadow-exam hover:bg-primary hover:text-white",
                  )}
                >
                  <item.icon className="size-5" aria-hidden />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="rounded-2xl border border-border bg-white/70 p-4 dark:bg-white/5">
              <BarChart3 className="size-6 text-primary" aria-hidden />
              <p className="mt-3 text-sm font-black">Mode Demo</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Hubungkan Supabase untuk auth, RLS, realtime, dan storage produksi.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="lg:hidden">
                <BrandLogo compact />
              </div>
              <nav className="hidden flex-wrap gap-2 md:flex lg:hidden">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={item.value === active ? "default" : "outline"}
                    size="sm"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/login">
                    <LogOut aria-hidden />
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
