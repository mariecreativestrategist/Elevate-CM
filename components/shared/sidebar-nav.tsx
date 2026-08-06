"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageCircle,
  Inbox,
  KanbanSquare,
  ClipboardList,
  Receipt,
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/calendrier", label: "Calendrier", icon: Calendar },
  { href: "/admin/chat", label: "Chat", icon: MessageCircle },
  { href: "/admin/demandes", label: "Demandes", icon: Inbox },
  { href: "/admin/todo", label: "Todo", icon: KanbanSquare },
  { href: "/admin/questionnaire", label: "Questionnaire", icon: ClipboardList },
  { href: "/admin/administratif", label: "Administratif", icon: Receipt },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
] as const;

const PORTAL_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/onboarding", label: "Onboarding", icon: ClipboardCheck },
  { href: "/portal/strategie", label: "Stratégie", icon: FileText },
  { href: "/portal/calendrier", label: "Calendrier", icon: Calendar },
  { href: "/portal/resultats", label: "Résultats", icon: BarChart3 },
  { href: "/portal/chat", label: "Chat & demandes", icon: MessageCircle },
  { href: "/portal/administratif", label: "Administratif", icon: Receipt },
] as const;

export function SidebarNav({
  variant,
  badges = {},
}: {
  variant: "admin" | "portal";
  badges?: Record<string, number>;
}) {
  const pathname = usePathname();
  const items = variant === "admin" ? ADMIN_ITEMS : PORTAL_ITEMS;
  const root = variant === "admin" ? "/admin" : "/portal";

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {items.map((item) => {
        const active = item.href === pathname || (item.href !== root && pathname.startsWith(item.href));
        const Icon = item.icon;
        const badge = badges[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
              active ? "bg-white/10 text-paper font-medium" : "text-paper/65 hover:bg-white/5 hover:text-paper"
            )}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="h-4 w-4" />
              {item.label}
            </span>
            {!!badge && (
              <span className="rounded-full bg-magenta px-1.5 py-0.5 font-mono text-[10px] text-white">{badge}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
