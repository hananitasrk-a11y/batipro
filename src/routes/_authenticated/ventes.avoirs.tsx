import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";
import { generateDocumentPDF, generateDocumentsPDF, fetchLabel, fetchLabelsMap, type DocOptions } from "@/lib/pdf";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/ventes/avoirs")({
  component: () => (
    <CrudTable
      title="Avoirs clients" description="Avoirs émis aux clients"
      table="avoirs" searchFields={["numero", "statut"]}
      bulkActions={[{
        label: "Exporter PDF",
        icon: FileDown,
        onClick: async (rows) => {
          try {
            const clients = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "raison_sociale");
            const clientIces = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "ice");
            const chantiers = await fetchLabelsMap("chantier", rows.map((r) => r.chantier_id as string), "nom");
            const items: DocOptions[] = rows.map((r) => ({
              kind: "Bon d'avoir",
              numero: String(r.numero ?? ""),
              date: r.date_avoir ? String(r.date_avoir) : null,
              echeance: r.date_avoir ? String(r.date_avoir) : null,
              tier: r.client_id ? {
                titre: "Avoir pour",
                nom: clients[String(r.client_id)] ?? "",
                details: clientIces[String(r.client_id)] ? [`ICE: ${clientIces[String(r.client_id)]}`] : undefined,
              } : null,
              chantier: r.chantier_id ? chantiers[String(r.chantier_id)] ?? null : null,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            }));
            await generateDocumentsPDF(items, `Avoirs_lot_${items.length}.pdf`);
            toast.success(`${items.length} bon(s) d'avoir exporté(s)`);
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter les avoirs")); }
        },
      }]}
      rowActions={[{
        label: "Télécharger PDF", icon: Download,
        onClick: async (r) => {
          try {
            const clientNom = await fetchLabel("clients", r.client_id as string, "raison_sociale");
            const clientIce = await fetchLabel("clients", r.client_id as string, "ice");
            const chantierNom = await fetchLabel("chantier", r.chantier_id as string, "nom");
            await generateDocumentPDF({
              kind: "Bon d'avoir",
              numero: String(r.numero ?? ""),
              date: r.date_avoir ? String(r.date_avoir) : null,
              echeance: r.date_avoir ? String(r.date_avoir) : null,
              tier: clientNom ? { titre: "Avoir pour", nom: clientNom, details: clientIce ? [`ICE: ${clientIce}`] : undefined } : null,
              chantier: chantierNom,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            });
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter le bon d'avoir")); }
        },
      }]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_avoir", label: "Date", type: "date", required: true },
        { name: "type_avoir", label: "Type", type: "select", options: [{ value: "vente", label: "Vente" }] },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "facture_id", label: "Facture liée", type: "select", ref: { table: "factures", labelField: "numero" } },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "tva", label: "TVA", type: "number" },
        { name: "montant_ttc", label: "Montant TTC", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "valide", label: "Validé" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
