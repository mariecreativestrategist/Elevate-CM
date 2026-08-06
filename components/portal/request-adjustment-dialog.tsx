"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { requestDocumentAdjustmentAction } from "@/lib/actions/documents";

export function RequestAdjustmentDialog({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm">Demander des ajustements</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demander des ajustements</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Décrivez ce que vous aimeriez ajuster..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={4}
        />
        <DialogFooter>
          <Button
            disabled={pending || !commentaire.trim()}
            onClick={() => {
              startTransition(async () => {
                await requestDocumentAdjustmentAction(documentId, commentaire);
                setCommentaire("");
                setOpen(false);
              });
            }}
          >
            {pending ? "Envoi..." : "Envoyer la demande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
