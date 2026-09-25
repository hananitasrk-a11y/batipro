import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/production/consommation")({
  component: () => (
    <CrudTable
      title="Consommation constituants"
      description="Consommation de matières premières par chantier"
      table="consommation_constituants"
      searchFields={["notes", "unite"]}
      fields={[
        { name: "date_conso", label: "Date", type: "date", required: true },
        { name: "chantier_id", label: "Chantier", ref: { table: "chantier", labelField: "nom" } },
        { name: "phase_id", label: "Phase", ref: { table: "phases_chantier", labelField: "nom" }, hideInTable: true },
        { name: "constituant_id", label: "Constituant", required: true, ref: { table: "constituants", labelField: "libelle" } },
        { name: "quantite", label: "Quantité", type: "number", required: true },
        { name: "unite", label: "Unité" },
        { name: "cout_unitaire", label: "Coût unitaire", type: "number" },
        { name: "cout_total", label: "Coût total", type: "number" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
