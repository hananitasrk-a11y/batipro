import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/personnel/pointage")({
  component: () => (
    <CrudTable
      title="Pointage" description="Saisie des heures et présences"
      table="pointages" searchFields={["motif", "notes"]}
      fields={[
        { name: "date_pointage", label: "Date", type: "date", required: true },
        { name: "employe_id", label: "Employé", type: "select", ref: { table: "employes", labelField: "nom" } },
        { name: "chantier_id", label: "Chantier", type: "select", ref: { table: "chantier", labelField: "nom" } },
        { name: "heures_normales", label: "H. normales", type: "number" },
        { name: "heures_sup", label: "H. sup.", type: "number" },
        { name: "absent", label: "Absent", type: "checkbox" },
        { name: "motif", label: "Motif", type: "text" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
