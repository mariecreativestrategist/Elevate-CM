import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";

export default async function PortalResultatsPage() {
  const clientId = await currentClientId();
  const documents = await prisma.document.findMany({
    where: { clientId, type: "resultats" },
    orderBy: { deposeLe: "desc" },
  });

  const [latest, ...previous] = documents;

  return (
    <div className="max-w-2xl space-y-8 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Résultats</h1>
        <p className="text-sm text-muted-foreground">Vos bilans de performance déposés par l&apos;agence.</p>
      </div>

      {!latest ? (
        <p className="text-sm text-muted-foreground">Aucun bilan déposé pour le moment.</p>
      ) : (
        <>
          <div className="rounded-2xl border border-magenta/30 bg-magenta-tint/40 p-5 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-wide text-magenta">Dernière version</p>
            <div className="mt-2 flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-magenta" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg text-ink">{latest.nomFichier}</p>
                <p className="text-xs text-muted-foreground">
                  Déposé le {format(latest.deposeLe, "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>
            <a
              href={latest.url}
              download
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" />
              Télécharger
            </a>
          </div>

          {previous.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-serif text-lg text-ink">Versions précédentes</h2>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
                {previous.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{doc.nomFichier}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(doc.deposeLe, "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <a href={doc.url} download className="text-xs text-magenta hover:underline">
                      Télécharger
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
