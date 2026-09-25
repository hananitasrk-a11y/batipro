import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/personnel/absences")({
  component: () => (
    <CrudTable
      title="Absences" description="Absences du personnel"
      table="absences" searchFields={["motif"]}
      fields={[
        { name: "employe_id", label: "Employé", type: "select", ref: { table: "employes", labelField: "nom" } },
        { name: "date_absence", label: "Date", type: "date", required: true },
        { name: "duree_heures", label: "Durée (h)", type: "number" },
        { name: "motif", label: "Motif", type: "text" },
        { name: "justifiee", label: "Justifiée", type: "checkbox" },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
