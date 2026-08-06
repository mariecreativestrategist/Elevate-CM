"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { Logo } from "@/components/shared/logo";

export function MobileHeader({
  brand,
  variant,
  nom,
  email,
  badges,
  logoutAction,
}: {
  brand: string;
  variant: "admin" | "portal";
  nom: string;
  email: string;
  badges?: Record<string, number>;
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-ink px-4 py-3 md:hidden">
      <div>
        <Logo className="font-serif text-lg text-paper" />
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/50">{brand}</p>
      </div>
      <button onClick={() => setOpen(true)} className="p-1.5 text-paper" aria-label="Ouvrir le menu">
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex w-72 flex-col bg-ink py-6">
            <div className="flex items-center justify-between px-6 pb-6">
              <Logo className="font-serif text-xl text-paper" />
              <button onClick={() => setOpen(false)} className="p-1 text-paper" aria-label="Fermer le menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div onClick={() => setOpen(false)}>
              <SidebarNav variant={variant} badges={badges} />
            </div>
            <div className="mt-auto border-t border-white/10 px-6 pt-4">
              <p className="truncate text-sm text-paper">{nom}</p>
              <p className="truncate text-xs text-paper/50">{email}</p>
              <form action={logoutAction} className="mt-3">
                <button type="submit" className="flex items-center gap-1.5 text-xs text-paper/60">
                  <LogOut className="h-3.5 w-3.5" />
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
