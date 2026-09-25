import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/caisses/depenses")({
  component: () => (
    <CrudTable
      title="Dépenses" description="Sorties de caisse"
      table="operations_caisse" searchFields={["libelle", "beneficiaire", "piece"]}
      fields={[
        { name: "date_operation", label: "Date", type: "date", required: true },
        { name: "caisse_id", label: "Caisse", type: "select", ref: { table: "caisses", labelField: "libelle" } },
        { name: "type_operation", label: "Type", type: "select", options: [
          { value: "depense", label: "Dépense" },
          { value: "decaissement", label: "Décaissement" },
        ] },
        { name: "montant", label: "Montant", type: "number", required: true },
        { name: "libelle", label: "Libellé" },
        { name: "beneficiaire", label: "Bénéficiaire" },
        { name: "piece", label: "N° pièce", hideInTable: true },
      ]}
    />
  ),
});
