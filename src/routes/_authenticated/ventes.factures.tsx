import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";
import { generateDocumentPDF, generateDocumentsPDF, fetchLabel, fetchLabelsMap, type DocOptions } from "@/lib/pdf";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/ventes/factures")({
  component: () => (
    <CrudTable
      title="Factures clients" description="Factures de vente"
      table="factures" searchFields={["numero", "statut"]}
      bulkActions={[{
        label: "Exporter PDF",
        icon: FileDown,
        onClick: async (rows) => {
          try {
            const clients = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "raison_sociale");
            const chantiers = await fetchLabelsMap("chantier", rows.map((r) => r.chantier_id as string), "nom");
            const items: DocOptions[] = rows.map((r) => ({
              kind: "Facture",
              numero: String(r.numero ?? ""),
              date: r.date_facture ? String(r.date_facture) : null,
              echeance: r.echeance ? String(r.echeance) : null,
              tier: r.client_id ? { titre: "Facturé à", nom: clients[String(r.client_id)] ?? "" } : null,
              chantier: r.chantier_id ? chantiers[String(r.chantier_id)] ?? null : null,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            }));
            await generateDocumentsPDF(items, `Factures_lot_${items.length}.pdf`);
            toast.success(`${items.length} facture(s) exportée(s)`);
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'enregistrer la facture")); }
        },
      }]}
      rowActions={[{
        label: "Télécharger PDF", icon: Download,
        onClick: async (r) => {
          try {
            const clientNom = await fetchLabel("clients", r.client_id as string, "raison_sociale");
            const chantierNom = await fetchLabel("chantier", r.chantier_id as string, "nom");
            await generateDocumentPDF({
              kind: "Facture",
              numero: String(r.numero ?? ""),
              date: r.date_facture ? String(r.date_facture) : null,
              echeance: r.echeance ? String(r.echeance) : null,
              tier: clientNom ? { titre: "Facturé à", nom: clientNom } : null,
              chantier: chantierNom,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            });
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'enregistrer le règlement")); }
        },
      }]}
      fields={[
        { name: "numero", label: "N° Facture", type: "text", required: true },
        { name: "date_facture", label: "Date", type: "date", required: true },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "tva", label: "TVA", type: "number" },
        { name: "montant_ttc", label: "Montant TTC", type: "number" },
        { name: "echeance", label: "Échéance", type: "date" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "validee", label: "Validée" },
          { value: "payee", label: "Payée" },
          { value: "annulee", label: "Annulée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
