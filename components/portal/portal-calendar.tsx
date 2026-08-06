"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle2 } from "lucide-react";
import { MonthCalendar, type CalendarPost } from "@/components/shared/month-calendar";
import { PostStatusBadge, RequestStatusBadge } from "@/components/shared/badges";
import { CONTENT_TYPE_COLORS, CONTENT_TYPE_LABELS } from "@/lib/colors";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { approvePostAction, createModificationRequestAction } from "@/lib/actions/modification-requests";

type Request = { id: string; description: string; statut: string; createdAt: Date };
type Post = CalendarPost & {
  typeContenu: string;
  statut: string;
  requests: Request[];
};

export function PortalCalendar({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <MonthCalendar posts={posts} dotColor={(p) => CONTENT_TYPE_COLORS[p.typeContenu] ?? "magenta"} onSelectPost={setSelected} />

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setComment("");
          }
        }}
      >
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.titre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">
                    {CONTENT_TYPE_LABELS[selected.typeContenu]} · {format(selected.datePlanifiee, "d MMMM yyyy", { locale: fr })}
                  </p>
                  <PostStatusBadge statut={selected.statut} />
                </div>

                {selected.statut !== "approuve" && selected.statut !== "publie" && (
                  <Button
                    variant="outline"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        await approvePostAction(selected.id);
                        setSelected(null);
                      });
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approuver cette publication
                  </Button>
                )}

                <div className="space-y-2">
                  <Textarea
                    placeholder="Demander une modification sur ce contenu..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <Button
                    size="sm"
                    disabled={pending || !comment.trim()}
                    onClick={() => {
                      startTransition(async () => {
                        await createModificationRequestAction(selected.id, `Modification — ${selected.titre}`, comment);
                        setComment("");
                        setSelected(null);
                      });
                    }}
                  >
                    Envoyer la demande
                  </Button>
                </div>

                {selected.requests.length > 0 && (
                  <div className="space-y-2 border-t border-border pt-3">
                    <p className="text-xs font-medium text-muted-foreground">Demandes précédentes</p>
                    {selected.requests.map((r) => (
                      <div key={r.id} className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xs text-ink">{r.description}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {format(r.createdAt, "d MMM", { locale: fr })}
                          </span>
                          <RequestStatusBadge statut={r.statut} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
