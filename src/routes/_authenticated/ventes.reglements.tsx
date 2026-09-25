import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/ventes/reglements")({
  component: () => (
    <CrudTable
      title="Règlements" description="Encaissements & décaissements"
      table="reglements" searchFields={["numero", "reference", "mode"]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_reglement", label: "Date", type: "date", required: true },
        { name: "type_reglement", label: "Type", type: "select", options: [
          { value: "client", label: "Client (encaissement)" },
          { value: "fournisseur", label: "Fournisseur (décaissement)" },
        ] },
        { name: "client_id", label: "Client", type: "select", ref: { table: "clients", labelField: "raison_sociale" } },
        { name: "fournisseur_id", label: "Fournisseur", type: "select", ref: { table: "fournisseurs", labelField: "raison_sociale" } },
        { name: "facture_id", label: "Facture", type: "select", ref: { table: "factures", labelField: "numero" } },
        { name: "mode", label: "Mode", type: "select", ref: { table: "modes_reglement", labelField: "libelle", valueField: "libelle" } },
        { name: "montant", label: "Montant", type: "number", required: true },
        { name: "reference", label: "Référence", type: "text" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
