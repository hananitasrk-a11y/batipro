import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/donnees/produits")({
  component: () => (
    <CrudTable
      title="Produits finis"
      table="produits_finis"
      searchFields={["libelle", "code"]}
      fields={[
        { name: "code", label: "Code" },
        { name: "libelle", label: "Libellé", required: true },
        { name: "type_produit", label: "Type" },
        { name: "unite", label: "Unité" },
        { name: "prix_vente", label: "Prix de vente", type: "number" },
        { name: "tva_taux", label: "TVA %", type: "number" },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  ),
});
