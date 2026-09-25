import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/stocks/")({
  component: () => (
    <CrudTable
      title="Stocks — Mouvements" description="Entrées, sorties et transferts de stock"
      table="mouvements_stock" searchFields={["reference", "type_mvt"]}
      fields={[
        { name: "date_mvt", label: "Date", type: "date" },
        { name: "type_mvt", label: "Type", type: "select", required: true, options: [
          { value: "entree", label: "Entrée" },
          { value: "sortie", label: "Sortie" },
          { value: "transfert", label: "Transfert" },
          { value: "ajustement", label: "Ajustement" },
        ] },
        { name: "depot_id", label: "Dépôt", type: "select", ref: { table: "depots", labelField: "libelle" } },
        { name: "constituant_id", label: "Constituant", type: "select", ref: { table: "constituants", labelField: "libelle" }, hideInTable: true },
        { name: "produit_id", label: "Produit fini", type: "select", ref: { table: "produits_finis", labelField: "libelle" }, hideInTable: true },
        { name: "quantite", label: "Quantité", type: "number", required: true },
        { name: "prix_unitaire", label: "Prix unitaire", type: "number" },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" }, hideInTable: true },
        { name: "reference", label: "Référence" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
