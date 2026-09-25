import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

function Page() {
  return (
    <CrudTable
      title="Journaux comptables"
      description="Ventes, achats, banque, caisse, OD, paie"
      table="journaux"
      orderBy="code"
      searchFields={["code", "libelle"]}
      fields={[
        { name: "code", label: "Code", required: true },
        { name: "libelle", label: "Libellé", required: true },
        { name: "type", label: "Type", type: "select", required: true, options: [
          { value: "vente", label: "Ventes" },
          { value: "achat", label: "Achats" },
          { value: "banque", label: "Banque" },
          { value: "caisse", label: "Caisse" },
          { value: "od", label: "Opérations diverses" },
          { value: "paie", label: "Paie" },
        ] },
        { name: "compte_contrepartie_id", label: "Compte de contrepartie", ref: { table: "comptes_comptables", labelField: "libelle", orderBy: "numero" } },
        { name: "actif", label: "Actif", type: "checkbox" },
      ]}
    />
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/journaux")({ component: Page });
