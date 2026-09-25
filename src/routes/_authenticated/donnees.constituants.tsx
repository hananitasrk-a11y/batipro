import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/donnees/constituants")({
  component: () => (
    <CrudTable
      title="Constituants"
      description="Matières premières et composants"
      table="constituants"
      searchFields={["libelle", "code"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "libelle", label: "Libellé", required: true },
        { name: "type_constituant", label: "Type" },
        { name: "unite", label: "Unité" },
        { name: "prix_achat", label: "Prix d'achat", type: "number" },
        { name: "stock_min", label: "Stock min", type: "number" },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
