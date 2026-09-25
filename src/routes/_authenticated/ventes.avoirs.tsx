import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/ventes/avoirs")({
  component: () => (
    <CrudTable
      title="Avoirs clients" description="Avoirs émis aux clients"
      table="avoirs" searchFields={["numero", "statut"]}
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
