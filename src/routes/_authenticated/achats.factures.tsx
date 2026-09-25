import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/achats/factures")({
  component: () => (
    <CrudTable
      title="Factures fournisseurs" description="Factures d'achat"
      table="factures" searchFields={["numero", "statut"]}
      fields={[
        { name: "numero", label: "N° Facture", type: "text", required: true },
        { name: "date_facture", label: "Date", type: "date", required: true },
        { name: "client_id", label: "Tiers", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
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
