import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { RequestStatusSelect } from "@/components/admin/request-status-select";

export default async function AdminDemandesPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: clientFilter } = await searchParams;

  const [clients, requests] = await Promise.all([
    prisma.client.findMany({ orderBy: { nom: "asc" } }),
    prisma.modificationRequest.findMany({
      where: clientFilter ? { clientId: clientFilter } : undefined,
      include: { client: true, editorialPost: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Demandes</h1>
        <p className="text-sm text-muted-foreground">{requests.length} demande(s).</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/demandes"
          className={cn(
            "rounded-full border px-3 py-1 text-xs",
            !clientFilter ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"
          )}
        >
          Tous
        </Link>
        {clients.map((c) => (
          <Link
            key={c.id}
            href={`/admin/demandes?client=${c.id}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              clientFilter === c.id ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"
            )}
          >
            {c.nom}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande.</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-lg text-ink">{r.titre}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.client.nom} · {format(r.createdAt, "d MMM yyyy · HH:mm", { locale: fr })}
                    {r.editorialPost && ` · lié à « ${r.editorialPost.titre} »`}
                  </p>
                </div>
                <RequestStatusSelect requestId={r.id} statut={r.statut} />
              </div>
              <p className="mt-3 text-sm text-ink">{r.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
