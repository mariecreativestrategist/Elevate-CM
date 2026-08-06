import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceStatusBadge } from "@/components/shared/badges";
import { UploadFileForm } from "@/components/shared/upload-file-form";
import { uploadContractAsClientAction } from "@/lib/actions/documents";

export default async function PortalAdministratifPage() {
  const clientId = await currentClientId();

  const [invoices, contrats] = await Promise.all([
    prisma.invoice.findMany({ where: { clientId }, orderBy: { echeance: "desc" } }),
    prisma.document.findMany({ where: { clientId, type: "contrat" }, orderBy: { deposeLe: "desc" } }),
  ]);

  return (
    <div className="max-w-2xl space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Administratif</h1>
        <p className="text-sm text-muted-foreground">Vos factures et contrats. Vous pouvez déposer votre contrat signé.</p>
      </div>

      <Tabs defaultValue="factures">
        <TabsList>
          <TabsTrigger value="factures">Factures</TabsTrigger>
          <TabsTrigger value="contrats">Contrats</TabsTrigger>
        </TabsList>

        <TabsContent value="factures" className="mt-4">
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune facture.</p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm text-ink">{inv.montant.toLocaleString("fr-FR")} €</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Échéance {format(inv.echeance, "d MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <InvoiceStatusBadge statut={inv.statut} />
                    {inv.url && (
                      <a href={inv.url} download className="text-xs text-magenta hover:underline">
                        Télécharger
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="contrats" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-2 text-sm text-ink">Déposer le contrat signé</p>
            <UploadFileForm action={uploadContractAsClientAction} label="Déposer" />
          </div>
          {contrats.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun contrat.</p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
              {contrats.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-ink">{doc.nomFichier}</p>
                  </div>
                  <a href={doc.url} download className="text-xs text-magenta hover:underline">
                    Télécharger
                  </a>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
