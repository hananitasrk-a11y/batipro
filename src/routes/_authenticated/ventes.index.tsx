import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/ventes/")({
  component: () => (
    <CrudTable
      title="Ventes — Factures" description="Factures clients"
      table="factures" searchFields={["numero", "statut"]}
      fields={[
        { name: "numero", label: "N°" },
        { name: "date_facture", label: "Date", type: "date" },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "montant_ht", label: "Montant HT", type: "number" },
        { name: "tva", label: "TVA", type: "number", hideInTable: true },
        { name: "montant_ttc", label: "Montant TTC", type: "number" },
        { name: "echeance", label: "Échéance", type: "date" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "brouillon", label: "Brouillon" },
          { value: "envoyee", label: "Envoyée" },
          { value: "payee", label: "Payée" },
          { value: "annulee", label: "Annulée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
