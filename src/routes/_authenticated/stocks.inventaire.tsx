import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/stocks/inventaire")({
  component: () => (
    <CrudTable
      title="Inventaire" description="Relevés d'inventaire stock"
      table="inventaires" searchFields={["notes"]}
      fields={[
        { name: "date_inventaire", label: "Date", type: "date", required: true },
        { name: "depot_id", label: "Dépôt", type: "select", ref: { table: "depots", labelField: "libelle" } },
        { name: "constituant_id", label: "Constituant", type: "select", ref: { table: "constituants", labelField: "libelle" } },
        { name: "produit_id", label: "Produit fini", type: "select", ref: { table: "produits_finis", labelField: "libelle" } },
        { name: "quantite_theorique", label: "Qté théorique", type: "number" },
        { name: "quantite_reelle", label: "Qté réelle", type: "number" },
        { name: "ecart", label: "Écart", type: "number" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
