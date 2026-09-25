import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/caisses/alimentations")({
  component: () => (
    <CrudTable
      title="Alimentations" description="Entrées de caisse"
      table="operations_caisse" searchFields={["libelle", "piece"]}
      fields={[
        { name: "date_operation", label: "Date", type: "date", required: true },
        { name: "caisse_id", label: "Caisse", type: "select", ref: { table: "caisses", labelField: "libelle" } },
        { name: "type_operation", label: "Type", type: "select", options: [
          { value: "alimentation", label: "Alimentation" },
          { value: "encaissement", label: "Encaissement" },
        ] },
        { name: "montant", label: "Montant", type: "number", required: true },
        { name: "libelle", label: "Libellé" },
        { name: "beneficiaire", label: "Provenance" },
        { name: "piece", label: "N° pièce", hideInTable: true },
      ]}
    />
  ),
});
