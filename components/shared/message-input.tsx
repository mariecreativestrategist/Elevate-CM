"use client";

import { useRef, useTransition } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessageInput({ action }: { action: (formData: FormData) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        if (!String(formData.get("contenu") ?? "").trim()) return;
        startTransition(async () => {
          await action(formData);
          formRef.current?.reset();
        });
      }}
      className="flex items-end gap-2 border-t border-border bg-card p-3"
    >
      <textarea
        name="contenu"
        rows={1}
        placeholder="Écrire un message..."
        className="flex-1 resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button type="submit" size="icon" disabled={pending}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
