import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatThread } from "@/components/shared/chat-thread";
import { MessageInput } from "@/components/shared/message-input";
import { NewRequestForm } from "@/components/portal/new-request-form";
import { RequestStatusBadge } from "@/components/shared/badges";
import { sendMessageAsClientAction } from "@/lib/actions/messages";

export default async function PortalChatPage() {
  const clientId = await currentClientId();

  const conversation = await prisma.conversation.upsert({
    where: { clientId },
    update: {},
    create: { clientId },
  });
  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });
  await prisma.message.updateMany({
    where: { conversationId: conversation.id, expediteurRole: "admin", lu: false },
    data: { lu: true },
  });

  const requests = await prisma.modificationRequest.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex h-screen flex-col p-8">
      <h1 className="mb-4 font-serif text-3xl text-ink">Chat &amp; demandes</h1>
      <Tabs defaultValue="chat" className="flex flex-1 flex-col overflow-hidden">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="demandes">Mes demandes</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4 flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <ChatThread messages={messages} selfRole="client" />
          <MessageInput action={sendMessageAsClientAction} />
        </TabsContent>

        <TabsContent value="demandes" className="mt-4 max-w-xl space-y-6 overflow-y-auto">
          <NewRequestForm />
          <div className="space-y-2">
            <h2 className="font-serif text-lg text-ink">Historique</h2>
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune demande envoyée.</p>
            ) : (
              <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
                {requests.map((r) => (
                  <li key={r.id} className="space-y-1 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{r.titre}</p>
                      <RequestStatusBadge statut={r.statut} />
                    </div>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {format(r.createdAt, "d MMM yyyy", { locale: fr })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
