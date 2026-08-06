import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";
import { PortalCalendar } from "@/components/portal/portal-calendar";
import { RequestStatusBadge } from "@/components/shared/badges";

export default async function PortalCalendrierPage() {
  const clientId = await currentClientId();

  const posts = await prisma.editorialPost.findMany({
    where: { clientId },
    include: { modificationRequests: { orderBy: { createdAt: "desc" } } },
    orderBy: { datePlanifiee: "asc" },
  });

  const calendarPosts = posts.map((p) => ({
    id: p.id,
    titre: p.titre,
    datePlanifiee: p.datePlanifiee,
    typeContenu: p.typeContenu,
    statut: p.statut,
    requests: p.modificationRequests,
  }));

  const allRequests = posts
    .flatMap((p) => p.modificationRequests.map((r) => ({ ...r, postTitre: p.titre })))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Calendrier éditorial</h1>
        <p className="text-sm text-muted-foreground">
          Cliquez sur une publication pour l&apos;approuver ou demander une modification.
        </p>
      </div>

      <PortalCalendar posts={calendarPosts} />

      {allRequests.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-serif text-xl text-ink">Historique des demandes</h2>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
            {allRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{r.postTitre}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.description}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {format(r.createdAt, "d MMM yyyy", { locale: fr })}
                  </p>
                </div>
                <RequestStatusBadge statut={r.statut} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
