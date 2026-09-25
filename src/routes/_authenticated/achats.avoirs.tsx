import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/achats/avoirs")({
  component: () => (
    <CrudTable
      title="Avoirs fournisseurs" description="Avoirs reçus des fournisseurs"
      table="avoirs" searchFields={["numero", "statut"]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_avoir", label: "Date", type: "date", required: true },
        { name: "type_avoir", label: "Type", type: "select", options: [{ value: "achat", label: "Achat" }] },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
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
