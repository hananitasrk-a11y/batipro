import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";
import { generateDocumentPDF, generateDocumentsPDF, fetchLabel, fetchLabelsMap, type DocOptions } from "@/lib/pdf";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/ventes/devis")({
  component: () => (
    <CrudTable
      title="Devis" description="Devis clients"
      table="devis" searchFields={["numero", "objet", "statut"]}
      bulkActions={[{
        label: "Exporter PDF", icon: FileDown,
        onClick: async (rows) => {
          try {
            const clients = await fetchLabelsMap("clients", rows.map((r) => r.client_id as string), "raison_sociale");
            const chantiers = await fetchLabelsMap("chantier", rows.map((r) => r.chantier_id as string), "nom");
            const items: DocOptions[] = rows.map((r) => ({
              kind: "Devis",
              numero: String(r.numero ?? ""),
              date: r.date_devis ? String(r.date_devis) : null,
              echeance: r.validite ? String(r.validite) : null,
              tier: r.client_id ? { titre: "Adressé à", nom: clients[String(r.client_id)] ?? "" } : null,
              chantier: r.chantier_id ? chantiers[String(r.chantier_id)] ?? null : null,
              objet: r.objet as string,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            }));
            await generateDocumentsPDF(items, `Devis_lot_${items.length}.pdf`);
            toast.success(`${items.length} devis exporté(s)`);
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter les devis")); }
        },
      }]}
      rowActions={[{
        label: "Télécharger PDF", icon: Download,
        onClick: async (r) => {
          try {
            const clientNom = await fetchLabel("clients", r.client_id as string, "raison_sociale");
            const chantierNom = await fetchLabel("chantier", r.chantier_id as string, "nom");
            await generateDocumentPDF({
              kind: "Devis",
              numero: String(r.numero ?? ""),
              date: r.date_devis ? String(r.date_devis) : null,
              echeance: r.validite ? String(r.validite) : null,
              tier: clientNom ? { titre: "Adressé à", nom: clientNom } : null,
              chantier: chantierNom,
              objet: r.objet as string,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            });
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'exporter le devis")); }
        },
      }]}
      fields={[
        { name: "numero", label: "N° Devis", type: "text" },
        { name: "date_devis", label: "Date", type: "date", required: true },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "objet", label: "Objet", type: "text" },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "tva", label: "TVA", type: "number" },
        { name: "montant_ttc", label: "Montant TTC", type: "number" },
        { name: "validite", label: "Validité", type: "date" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "envoye", label: "Envoyé" },
          { value: "accepte", label: "Accepté" },
          { value: "refuse", label: "Refusé" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
