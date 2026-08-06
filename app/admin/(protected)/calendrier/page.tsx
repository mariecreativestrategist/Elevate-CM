import { prisma } from "@/lib/prisma";
import { AdminCalendar } from "@/components/admin/admin-calendar";

export default async function AdminCalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await searchParams;

  const [clients, posts] = await Promise.all([
    prisma.client.findMany({ where: { statut: "actif" }, orderBy: { nom: "asc" } }),
    prisma.editorialPost.findMany({
      where: { client: { statut: "actif" } },
      include: { client: true },
      orderBy: { datePlanifiee: "asc" },
    }),
  ]);

  const calendarPosts = posts.map((p) => ({
    id: p.id,
    titre: p.titre,
    datePlanifiee: p.datePlanifiee,
    typeContenu: p.typeContenu,
    statut: p.statut,
    clientId: p.clientId,
    clientNom: p.client.nom,
  }));

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Calendrier éditorial</h1>
        <p className="text-sm text-muted-foreground">Toutes les publications des clients actifs.</p>
      </div>
      <AdminCalendar
        posts={calendarPosts}
        clients={clients.map((c) => ({ id: c.id, nom: c.nom }))}
        initialClientId={client}
      />
    </div>
  );
}
