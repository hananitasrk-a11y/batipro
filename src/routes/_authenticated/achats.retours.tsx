import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/achats/retours")({
  component: () => (
    <CrudTable
      title="Retours fournisseurs" description="Retours de marchandises aux fournisseurs"
      table="retours" searchFields={["numero", "motif", "statut"]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_retour", label: "Date", type: "date", required: true },
        { name: "type_retour", label: "Type", type: "select", options: [{ value: "achat", label: "Achat" }] },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
        { name: "facture_id", label: "Facture", type: "select", ref: { table: "factures", labelField: "numero" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "motif", label: "Motif", type: "text" },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "valide", label: "Validé" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
