import type { ReactNode } from "react";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/shared/app-shell";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const session = await requireClient();

  const conversation = await prisma.conversation.findUnique({ where: { clientId: session.sub } });
  const unreadMessages = conversation
    ? await prisma.message.count({ where: { conversationId: conversation.id, expediteurRole: "admin", lu: false } })
    : 0;

  return (
    <AppShell
      brand="Espace client"
      variant="portal"
      nom={session.nom}
      email={session.email}
      badges={{ "/portal/chat": unreadMessages }}
    >
      {children}
    </AppShell>
  );
}
