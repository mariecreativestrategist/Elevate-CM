import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ChatThread } from "@/components/shared/chat-thread";
import { MessageInput } from "@/components/shared/message-input";
import { sendMessageAsAdminAction } from "@/lib/actions/messages";

export default async function AdminChatPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: selectedClientId } = await searchParams;

  const clients = await prisma.client.findMany({
    where: { statut: "actif" },
    include: {
      conversation: { include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } } },
    },
    orderBy: { nom: "asc" },
  });

  const sorted = [...clients].sort((a, b) => {
    const at = a.conversation?.messages[0]?.createdAt?.getTime() ?? 0;
    const bt = b.conversation?.messages[0]?.createdAt?.getTime() ?? 0;
    return bt - at;
  });

  const activeClient = selectedClientId ? clients.find((c) => c.id === selectedClientId) : undefined;
  let messages: { id: string; expediteurRole: string; contenu: string; createdAt: Date }[] = [];

  if (activeClient) {
    const conversation = await prisma.conversation.upsert({
      where: { clientId: activeClient.id },
      update: {},
      create: { clientId: activeClient.id },
    });
    messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });
    await prisma.message.updateMany({
      where: { conversationId: conversation.id, expediteurRole: "client", lu: false },
      data: { lu: true },
    });
  }

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: { expediteurRole: "client", lu: false },
    _count: true,
  });
  const unreadByConversation = new Map(unreadCounts.map((u) => [u.conversationId, u._count]));

  return (
    <div className="flex h-screen">
      <div className="w-72 shrink-0 overflow-y-auto border-r border-border p-4">
        <h1 className="mb-4 font-serif text-2xl text-ink">Chat</h1>
        <div className="space-y-1">
          {sorted.map((c) => {
            const lastMessage = c.conversation?.messages[0];
            const unread = c.conversation ? unreadByConversation.get(c.conversation.id) ?? 0 : 0;
            return (
              <Link
                key={c.id}
                href={`/admin/chat?client=${c.id}`}
                className={cn(
                  "block rounded-xl px-3 py-2.5 transition-colors",
                  activeClient?.id === c.id ? "bg-magenta-tint" : "hover:bg-muted"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-ink">{c.nom}</p>
                  {unread > 0 && (
                    <span className="shrink-0 rounded-full bg-magenta px-1.5 py-0.5 font-mono text-[10px] text-white">
                      {unread}
                    </span>
                  )}
                </div>
                {lastMessage && (
                  <p className="truncate text-xs text-muted-foreground">
                    {lastMessage.contenu} · {format(lastMessage.createdAt, "d MMM", { locale: fr })}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {!activeClient ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Sélectionnez une conversation.</p>
          </div>
        ) : (
          <>
            <div className="border-b border-border p-4">
              <p className="font-serif text-lg text-ink">{activeClient.nom}</p>
            </div>
            <ChatThread messages={messages} selfRole="admin" />
            <MessageInput action={sendMessageAsAdminAction.bind(null, activeClient.id)} />
          </>
        )}
      </div>
    </div>
  );
}
