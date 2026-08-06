import type { ReactNode } from "react";
import { logoutAction } from "@/lib/actions/auth";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { MobileHeader } from "@/components/shared/mobile-header";
import { Logo } from "@/components/shared/logo";
import { LogOut } from "lucide-react";

export function AppShell({
  brand,
  variant,
  nom,
  email,
  badges,
  children,
}: {
  brand: string;
  variant: "admin" | "portal";
  nom: string;
  email: string;
  badges?: Record<string, number>;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col md:flex-row">
      <MobileHeader brand={brand} variant={variant} nom={nom} email={email} badges={badges} logoutAction={logoutAction} />

      <aside className="hidden w-60 shrink-0 flex-col bg-ink py-6 md:flex">
        <div className="px-6 pb-6">
          <Logo className="font-serif text-xl text-paper" />
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">{brand}</p>
        </div>
        <SidebarNav variant={variant} badges={badges} />
        <div className="mt-auto border-t border-white/10 px-6 pt-4">
          <p className="truncate text-sm text-paper">{nom}</p>
          <p className="truncate text-xs text-paper/50">{email}</p>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-paper/60 transition-colors hover:text-paper"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1 overflow-x-hidden bg-paper">{children}</div>
    </div>
  );
}
