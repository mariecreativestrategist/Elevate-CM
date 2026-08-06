"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MonthCalendar, type CalendarPost } from "@/components/shared/month-calendar";
import { PostStatusBadge } from "@/components/shared/badges";
import { CONTENT_TYPE_LABELS, accentClasses, accentForId } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Post = CalendarPost & {
  typeContenu: string;
  statut: string;
  clientId: string;
  clientNom: string;
};

export function AdminCalendar({
  posts,
  clients,
  initialClientId,
}: {
  posts: Post[];
  clients: { id: string; nom: string }[];
  initialClientId?: string;
}) {
  const [activeClients, setActiveClients] = useState<Set<string>>(
    new Set(initialClientId ? [initialClientId] : clients.map((c) => c.id))
  );
  const [selected, setSelected] = useState<Post | null>(null);

  const filtered = useMemo(() => posts.filter((p) => activeClients.has(p.clientId)), [posts, activeClients]);

  function toggleClient(id: string) {
    setActiveClients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {clients.map((c) => {
          const active = activeClients.has(c.id);
          const accent = accentForId(c.id);
          const ac = accentClasses(accent);
          return (
            <button
              key={c.id}
              onClick={() => toggleClient(c.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                active ? cn(ac.tintBg, ac.text, "border-transparent") : "border-border text-muted-foreground"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", ac.bg)} />
              {c.nom}
            </button>
          );
        })}
      </div>

      <MonthCalendar posts={filtered} dotColor={(p) => accentForId(p.clientId)} onSelectPost={setSelected} />

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.titre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {CONTENT_TYPE_LABELS[selected.typeContenu]} · {format(selected.datePlanifiee, "d MMMM yyyy", { locale: fr })}
                </p>
                <PostStatusBadge statut={selected.statut} />
                <Link
                  href={`/admin/clients/${selected.clientId}`}
                  className="block text-xs text-magenta hover:underline"
                >
                  Voir la fiche {selected.clientNom} →
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
