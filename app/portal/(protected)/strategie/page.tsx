import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";
import { RequestAdjustmentDialog } from "@/components/portal/request-adjustment-dialog";

export default async function PortalStrategiePage() {
  const clientId = await currentClientId();

  const [documents, requests] = await Promise.all([
    prisma.document.findMany({ where: { clientId, type: "strategie" }, orderBy: { deposeLe: "desc" } }),
    prisma.modificationRequest.findMany({
      where: { clientId, titre: { startsWith: "Ajustement demandé" } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="max-w-2xl space-y-8 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Stratégie</h1>
        <p className="text-sm text-muted-foreground">Le document stratégique déposé par l&apos;agence.</p>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun document déposé pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 text-magenta" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg text-ink">{doc.nomFichier}</p>
                  <p className="text-xs text-muted-foreground">
                    Déposé le {format(doc.deposeLe, "d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={doc.url}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-ink hover:bg-muted"
                >
                  <Download className="h-3.5 w-3.5" />
                  Télécharger
                </a>
                <RequestAdjustmentDialog documentId={doc.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {requests.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-serif text-lg text-ink">Demandes envoyées</h2>
          <ul className="space-y-2">
            {requests.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                <p className="text-ink">{r.description}</p>
                <p className="mt-1 font-mono text-[11px] uppercase text-muted-foreground">
                  {format(r.createdAt, "d MMM yyyy", { locale: fr })} · {r.statut}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
