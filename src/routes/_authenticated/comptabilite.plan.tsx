import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

function Page() {
  return (
    <CrudTable
      title="Plan comptable"
      description="Comptes classés par classe (1 à 7) et type"
      table="comptes_comptables"
      orderBy="numero"
      searchFields={["numero", "libelle"]}
      fields={[
        { name: "numero", label: "N° de compte", required: true },
        { name: "libelle", label: "Libellé", required: true },
        { name: "classe", label: "Classe", type: "number", required: true },
        { name: "type", label: "Type", type: "select", required: true, options: [
          { value: "actif", label: "Actif" },
          { value: "passif", label: "Passif" },
          { value: "charge", label: "Charge" },
          { value: "produit", label: "Produit" },
          { value: "mixte", label: "Mixte" },
        ] },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/plan")({ component: Page });
