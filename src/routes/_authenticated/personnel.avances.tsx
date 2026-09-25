import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/crud-table";

export const Route = createFileRoute("/_authenticated/personnel/avances")({
  component: () => (
    <CrudTable
      title="Avances" description="Avances sur salaires"
      table="avances" searchFields={["motif", "statut"]}
      fields={[
        { name: "employe_id", label: "Employé", type: "select", ref: { table: "employes", labelField: "nom" } },
        { name: "date_avance", label: "Date", type: "date", required: true },
        { name: "montant", label: "Montant", type: "number", required: true },
        { name: "motif", label: "Motif", type: "text" },
        { name: "statut", label: "Statut", type: "select", options: [
          { value: "accordee", label: "Accordée" },
          { value: "remboursee", label: "Remboursée" },
          { value: "refusee", label: "Refusée" },
        ] },
        { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  ),
});
