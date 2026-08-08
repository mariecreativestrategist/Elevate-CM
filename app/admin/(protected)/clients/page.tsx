import Link from "next/link";
import { Archive, ArchiveRestore } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AddClientDialog } from "@/components/admin/add-client-dialog";
import { DeleteClientButton } from "@/components/admin/delete-client-button";
import { OfferBadge } from "@/components/shared/badges";
import { Stepper } from "@/components/shared/stepper";
import { toggleClientStatusAction } from "@/lib/actions/clients";

const STAGE_ORDER = ["onboarding", "strategie", "calendrier", "resultats"];

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { stages: true },
    orderBy: [{ statut: "asc" }, { nom: "asc" }],
  });

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink">Clients</h1>
          <p className="text-sm text-muted-foreground">{clients.length} client(s) au total.</p>
        </div>
        <AddClientDialog />
      </div>

      <div className="space-y-3">
        {clients.map((client) => {
          const stages = STAGE_ORDER.map(
            (etape) => client.stages.find((s) => s.etape === etape) ?? { etape, statut: "a_faire" as const }
          );
          return (
            <div
              key={client.id}
              className="flex items-center gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="w-48 shrink-0">
                <Link href={`/admin/clients/${client.id}`} className="font-serif text-lg text-ink hover:underline">
                  {client.nom}
                </Link>
                <p className="truncate text-xs text-muted-foreground">{client.email}</p>
                <div className="mt-1.5">
                  <OfferBadge offre={client.offre} />
                </div>
              </div>

              <div className="flex-1">
                <Stepper stages={stages} compact />
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {client.statut === "archive" && (
                  <span className="font-mono text-[11px] uppercase text-muted-foreground">Archivé</span>
                )}
                <form action={toggleClientStatusAction.bind(null, client.id)}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                    title={client.statut === "actif" ? "Archiver" : "Réactiver"}
                  >
                    {client.statut === "actif" ? (
                      <Archive className="h-3.5 w-3.5" />
                    ) : (
                      <ArchiveRestore className="h-3.5 w-3.5" />
                    )}
                  </button>
                </form>
                <DeleteClientButton clientId={client.id} clientNom={client.nom} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
