import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/shared/app-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  const [unreadMessages, nouvellesDemandes] = await Promise.all([
    prisma.message.count({ where: { expediteurRole: "client", lu: false } }),
    prisma.modificationRequest.count({ where: { statut: "nouveau" } }),
  ]);

  return (
    <AppShell
      brand="Espace agence"
      variant="admin"
      nom={session.nom}
      email={session.email}
      badges={{ "/admin/chat": unreadMessages, "/admin/demandes": nouvellesDemandes }}
    >
      {children}
    </AppShell>
  );
}
