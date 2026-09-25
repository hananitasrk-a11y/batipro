import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/stocks/transferts")({
  component: () => (
    <CrudTable
      title="Transferts entre dépôts" description="Mouvements de stock entre dépôts"
      table="transferts_stock" searchFields={["numero", "statut"]}
      fields={[
        { name: "numero", label: "N°", type: "text" },
        { name: "date_transfert", label: "Date", type: "date", required: true },
        { name: "depot_source_id", label: "Dépôt source", type: "select", ref: { table: "depots", labelField: "libelle" } },
        { name: "depot_destination_id", label: "Dépôt destination", type: "select", ref: { table: "depots", labelField: "libelle" } },
        { name: "constituant_id", label: "Constituant", type: "select", ref: { table: "constituants", labelField: "libelle" }, hideInTable: true },
        { name: "produit_id", label: "Produit fini", type: "select", ref: { table: "produits_finis", labelField: "libelle" }, hideInTable: true },
        { name: "quantite", label: "Quantité", type: "number", required: true },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "en_cours", label: "En cours" },
          { value: "termine", label: "Terminé" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
