import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";
import { generateDocumentPDF, generateDocumentsPDF, fetchLabel, fetchLabelsMap, type DocOptions } from "@/lib/pdf";
import { Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export const Route = createFileRoute("/_authenticated/achats/")({
  component: () => (
    <CrudTable
      title="Achats — Bons de commande" description="Commandes fournisseurs"
      table="bons_commande" searchFields={["numero", "statut"]}
      bulkActions={[{
        label: "Exporter PDF", icon: FileDown,
        onClick: async (rows) => {
          try {
            const fours = await fetchLabelsMap("fournisseurs", rows.map((r) => r.fournisseur_id as string), "raison_sociale");
            const chantiers = await fetchLabelsMap("chantier", rows.map((r) => r.chantier_id as string), "nom");
            const items: DocOptions[] = rows.map((r) => ({
              kind: "Bon de commande",
              numero: String(r.numero ?? ""),
              date: r.date_bc ? String(r.date_bc) : null,
              tier: r.fournisseur_id ? { titre: "Fournisseur", nom: fours[String(r.fournisseur_id)] ?? "" } : null,
              chantier: r.chantier_id ? chantiers[String(r.chantier_id)] ?? null : null,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            }));
            await generateDocumentsPDF(items, `BonsCommande_lot_${items.length}.pdf`);
            toast.success(`${items.length} bon(s) exporté(s)`);
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'enregistrer la demande")); }
        },
      }]}
      rowActions={[{
        label: "Télécharger PDF", icon: Download,
        onClick: async (r) => {
          try {
            const fourNom = await fetchLabel("fournisseurs", r.fournisseur_id as string, "raison_sociale");
            const chantierNom = await fetchLabel("chantier", r.chantier_id as string, "nom");
            await generateDocumentPDF({
              kind: "Bon de commande",
              numero: String(r.numero ?? ""),
              date: r.date_bc ? String(r.date_bc) : null,
              tier: fourNom ? { titre: "Fournisseur", nom: fourNom } : null,
              chantier: chantierNom,
              montant_ht: r.montant_ht as number,
              tva: r.tva as number,
              montant_ttc: r.montant_ttc as number,
              notes: r.notes as string,
            });
          } catch (e) { toast.error(getErrorMessage(e, "Impossible d'enregistrer la commande")); }
        },
      }]}
      fields={[
        { name: "numero", label: "N°" },
        { name: "date_bc", label: "Date", type: "date" },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "tva", label: "TVA", type: "number", hideInTable: true },
        { name: "montant_ttc", label: "Montant TTC", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "envoye", label: "Envoyé" },
          { value: "recu", label: "Reçu" },
          { value: "solde", label: "Soldé" },
          { value: "annule", label: "Annulé" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
