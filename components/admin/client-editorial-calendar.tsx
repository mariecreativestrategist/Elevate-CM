"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { MonthCalendar, type CalendarPost } from "@/components/shared/month-calendar";
import { PostStatusBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { AddEditorialPostDialog } from "@/components/admin/add-editorial-post-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CONTENT_TYPE_COLORS, CONTENT_TYPE_LABELS } from "@/lib/colors";
import { deleteEditorialPostAction } from "@/lib/actions/editorial-posts";

type Post = CalendarPost & {
  typeContenu: string;
  statut: string;
  pilier: string | null;
  description: string | null;
  visuelUrl: string | null;
};

export function ClientEditorialCalendar({ clientId, posts }: { clientId: string; posts: Post[] }) {
  const [selected, setSelected] = useState<Post | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AddEditorialPostDialog clientId={clientId} />
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune publication planifiée pour ce client.</p>
      ) : (
        <MonthCalendar posts={posts} dotColor={(p) => CONTENT_TYPE_COLORS[p.typeContenu] ?? "magenta"} onSelectPost={setSelected} />
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.titre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">
                    {CONTENT_TYPE_LABELS[selected.typeContenu]} · {format(selected.datePlanifiee, "d MMMM yyyy", { locale: fr })}
                  </p>
                  <PostStatusBadge statut={selected.statut} />
                </div>
                {selected.pilier && (
                  <p>
                    <span className="text-xs text-muted-foreground">Pilier : </span>
                    {selected.pilier}
                  </p>
                )}
                {selected.description && <p className="text-ink">{selected.description}</p>}
                {selected.visuelUrl && (
                  <a href={selected.visuelUrl} target="_blank" className="block text-xs text-magenta hover:underline">
                    Voir le visuel
                  </a>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      await deleteEditorialPostAction(selected.id, clientId);
                      setSelected(null);
                    });
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
