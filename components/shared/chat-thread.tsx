import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Message = { id: string; expediteurRole: string; contenu: string; createdAt: Date };

export function ChatThread({ messages, selfRole }: { messages: Message[]; selfRole: "admin" | "client" }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Aucun message pour l&apos;instant.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.map((m) => {
        const isSelf = m.expediteurRole === selfRole;
        return (
          <div key={m.id} className={cn("flex", isSelf ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-3.5 py-2 text-sm",
                isSelf ? "bg-magenta text-white" : "bg-muted text-ink"
              )}
            >
              <p>{m.contenu}</p>
              <p className={cn("mt-1 font-mono text-[10px]", isSelf ? "text-white/70" : "text-muted-foreground")}>
                {format(m.createdAt, "d MMM · HH:mm", { locale: fr })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
